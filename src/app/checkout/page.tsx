"use client";

import { useCartStore } from "@/store/useCartStore";
import styles from "./Checkout.module.css";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "../actions/orders";
import { Country, State } from "country-state-city";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { items, getTotals, clearCart } = useCartStore();
  const { total } = getTotals();

  // Get all countries from country-state-city (clean names, proper codes)
  const allCountries = useMemo(() => Country.getAllCountries(), []);

  const [formData, setFormData] = useState({
    email: "",
    countryCode: "PH",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    postalCode: "",
    city: "",
    region: "",
    phone: "",
    textMeUpdates: false,
  });

  // Get states/regions dynamically based on selected country
  const availableStates = useMemo(() => {
    return State.getStatesOfCountry(formData.countryCode);
  }, [formData.countryCode]);

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset region when country changes since regions are country-specific
  useEffect(() => {
    setFormData((prev) => ({ ...prev, region: "", city: "" }));
  }, [formData.countryCode]);

  useEffect(() => {
    const isValid =
      formData.email.includes("@") &&
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.postalCode.trim() !== "" &&
      formData.city.trim() !== "";
    setFormValid(isValid);
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Get country name for display/storage from country code
  const getCountryName = (code: string) => {
    const country = Country.getCountryByCode(code);
    return country?.name || code;
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div
        className="container"
        style={{ padding: "100px 20px", textAlign: "center" }}
      >
        <h2>Your cart is empty</h2>
        <Link
          href="/"
          className="btn btn-primary"
          style={{ marginTop: "20px", display: "inline-block" }}
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      {/* ───────────── LEFT COLUMN: Form ───────────── */}
      <div className={`${styles.leftColumn} animate-fade-up`}>
        <div className={styles.leftContent}>
          {/* Contact */}
          <h2 className={styles.sectionTitle}>Contact</h2>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Delivery */}
          <h2 className={styles.sectionTitle}>Delivery</h2>

          {/* Country */}
          <div className={styles.formGroup}>
            <select
              name="countryCode"
              className={`${styles.input} ${styles.select}`}
              value={formData.countryCode}
              onChange={handleInputChange}
            >
              {allCountries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                className={styles.input}
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                className={styles.input}
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Address */}
          <div className={styles.formGroup}>
            <input
              type="text"
              name="address"
              placeholder="Address"
              className={styles.input}
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="apartment"
              placeholder="Apartment, suite, etc. (optional)"
              className={styles.input}
              value={formData.apartment}
              onChange={handleInputChange}
            />
          </div>

          {/* Postal code + City */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="postalCode"
                placeholder="Postal code"
                className={styles.input}
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="city"
                placeholder="City"
                className={styles.input}
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Region — dynamic based on country */}
          <div className={styles.formGroup}>
            {availableStates.length > 0 ? (
              <select
                name="region"
                className={`${styles.input} ${styles.select}`}
                value={formData.region}
                onChange={handleInputChange}
              >
                <option value="">Select region / state</option>
                {availableStates.map((s) => (
                  <option key={s.isoCode} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="region"
                placeholder="Region / State / Province"
                className={styles.input}
                value={formData.region}
                onChange={handleInputChange}
              />
            )}
          </div>

          {/* Phone */}
          <div className={styles.formGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone (optional)"
              className={styles.input}
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="textMeUpdates"
              className={styles.checkbox}
              checked={formData.textMeUpdates}
              onChange={handleInputChange}
            />
            Text me with delivery updates
          </label>
        </div>
      </div>

      {/* ───────────── RIGHT COLUMN: Summary + Payment ───────────── */}
      <div className={`${styles.rightColumn} animate-fade-up delay-100`}>
        <div className={styles.rightContent}>
          {/* Cart items */}
          <div>
            {items.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemImageContainer} style={{ position: "relative", overflow: "hidden" }}>
                  <div className={styles.itemBadge}>{item.quantity}</div>
                  <Image src={`/stock/${(item.id.charCodeAt(0) + item.id.charCodeAt(item.id.length - 1)) % 4 + 1}.png`} alt={item.name} fill style={{ objectFit: 'cover', borderRadius: 'inherit' }} />
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.itemName}>{item.name}</div>
                </div>
                <div className={styles.itemPrice}>
                  ₱{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Discount code (placeholder) */}
          <div className={styles.discountRow}>
            <input
              type="text"
              placeholder="Discount code or gift card"
              className={styles.input}
              style={{ flex: 1 }}
            />
            <button className={styles.discountBtn} disabled>
              Apply
            </button>
          </div>

          {/* Summary */}
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span style={{ fontSize: "0.85rem", color: "#999" }}>
              Calculated by carrier
            </span>
          </div>

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#999",
                  fontWeight: "normal",
                }}
              >
                PHP
              </span>
              ₱{total.toFixed(2)}
            </span>
          </div>

          {/* Payment */}
          <h2 className={styles.sectionTitle} style={{ marginTop: "10px" }}>
            Payment
          </h2>

          {!formValid ? (
            <div className={styles.paymentNotice}>
              Please complete all required Contact and Delivery fields above to
              unlock the payment options.
            </div>
          ) : (
            <div className={styles.paymentBox}>
              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
                  currency: "PHP",
                }}
              >
                <PayPalButtons
                  style={{ layout: "vertical", shape: "rect", color: "gold" }}
                  createOrder={(_data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "PHP",
                            value: total.toFixed(2),
                          },
                          shipping: {
                            name: {
                              full_name: `${formData.firstName} ${formData.lastName}`,
                            },
                            address: {
                              address_line_1: formData.address,
                              address_line_2: formData.apartment || undefined,
                              admin_area_2: formData.city,
                              admin_area_1: formData.region,
                              postal_code: formData.postalCode,
                              country_code: formData.countryCode,
                            },
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      const details = await actions.order.capture();

                      const result = await createOrder({
                        email: formData.email,
                        country: getCountryName(formData.countryCode),
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        address: formData.address,
                        apartment: formData.apartment,
                        postalCode: formData.postalCode,
                        city: formData.city,
                        region: formData.region,
                        phone: formData.phone,
                        textMeUpdates: formData.textMeUpdates,
                        totalAmount: total,
                        payPalReference: details.id,
                        items: items.map((item) => ({
                          id: item.id.replace("-CUSTOM", ""),
                          name: item.name,
                          quantity: item.quantity,
                          price: item.price,
                        })),
                      });

                      if (!result.success) {
                        alert("Payment captured but order could not be saved. Please contact support. Error: " + (result.error || "Unknown"));
                        return;
                      }

                      clearCart();
                      router.push(
                        `/checkout/success?name=${encodeURIComponent(formData.firstName)}&orderId=${result.orderId}`
                      );
                    }
                  }}
                />
              </PayPalScriptProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
