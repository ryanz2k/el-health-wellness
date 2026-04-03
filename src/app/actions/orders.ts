"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import nodemailer from "nodemailer";

// ─── CREATE ORDER (from checkout) ───
export async function createOrder(data: any) {
  try {
    const order = await prisma.order.create({
      data: {
        customerEmail: data.email,
        country: data.country,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        apartment: data.apartment || null,
        postalCode: data.postalCode,
        city: data.city,
        region: data.region,
        phone: data.phone || null,
        totalAmount: data.totalAmount,
        productCost: data.productCost || 0,
        shippingCost: data.shippingCost || 0,
        shippingMethod: data.shippingMethod || "Standard",
        status: "PAID",
        shipmentStatus: "PENDING",
        trackingNo: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        payPalReference: data.payPalReference,
        items: {
          create: data.items.map((item: any) => ({
            product: { connect: { id: item.id } },
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    try {
      const itemListHtml = data.items.map((item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₱${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('');

      const emailHtml = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ff69b4; text-align: center;">Thank you for your order!</h2>
          <p>Dear ${data.firstName},</p>
          <p>We've successfully received your order and payment. Your order is currently being processed by our dropshipping center.</p>
          
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fafafa;">
            <p style="margin: 0 0 10px 0;"><strong>Tracking Number:</strong> ${order.trackingNo}</p>
            <p style="margin: 0 0 20px 0;"><strong>Shipping To:</strong> ${data.address}, ${data.city}, ${data.region}, ${data.country}</p>
            
            <h3 style="margin-top: 25px; margin-bottom: 15px; border-bottom: 2px solid #ff69b4; padding-bottom: 5px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f1f1f1;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Sum</th>
                </tr>
              </thead>
              <tbody>
                ${itemListHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.1em; color: #ff69b4; border-top: 2px solid #ddd;">Total:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.1em; color: #ff69b4; border-top: 2px solid #ddd;">₱${data.totalAmount?.toFixed(2) || '0.00'}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <p>You will receive further updates once your package ships to your destination.</p>
          <p style="margin-top: 30px;">Best regards,<br/><strong style="color: #ff69b4;">EL Health and Wellness</strong></p>
        </div>
      `;

      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "EL Health and Wellness <onboarding@resend.dev>",
          to: data.email,
          subject: `Order Confirmation - ${order.trackingNo}`,
          html: emailHtml,
        });
        console.log("Checkout Confirmation sent via Resend API.");
      } else {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        const info = await transporter.sendMail({
          from: `"EL Health and Wellness" <${testAccount.user}>`,
          to: data.email,
          subject: `Order Confirmation - ${order.trackingNo}`,
          html: emailHtml,
        });
        console.log("Checkout Confirmation Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    } catch (emailError) {
      console.error("Failed to send checkout email:", emailError);
      // We do not return error here because the order was already successfully saved
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "Failed to create order in database." };
  }
}

// ─── UPDATE ORDER ───
export async function updateOrder(orderId: string, data: any) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        customerEmail: data.customerEmail,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        address: data.address,
        apartment: data.apartment || null,
        postalCode: data.postalCode,
        city: data.city,
        region: data.region,
        phone: data.phone || null,
        shippingMethod: data.shippingMethod,
        trackingNo: data.trackingNo || null,
        shipmentStatus: data.shipmentStatus,
        status: data.status,
        shippingCost: data.shippingCost || 0,
        productCost: data.productCost || 0,
        totalAmount: data.totalAmount,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order:", error);
    return { success: false, error: "Failed to update order." };
  }
}

// ─── DELETE ORDER ───
export async function deleteOrder(orderId: string) {
  try {
    // Delete order items first (foreign key constraint)
    await prisma.orderItem.deleteMany({ where: { orderId } });
    await prisma.order.delete({ where: { id: orderId } });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "Failed to delete order." };
  }
}

// ─── UPDATE PRODUCT ───
export async function updateProduct(productId: string, data: any) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        brand: data.brand || null,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
      },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product." };
  }
}

// ─── DELETE PRODUCT ───
export async function deleteProduct(productId: string) {
  try {
    // Check if product has order items referencing it
    const orderItemCount = await prisma.orderItem.count({
      where: { productId },
    });
    if (orderItemCount > 0) {
      return {
        success: false,
        error:
          "Cannot delete product that has been ordered. Remove related orders first.",
      };
    }

    await prisma.product.delete({ where: { id: productId } });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product." };
  }
}
