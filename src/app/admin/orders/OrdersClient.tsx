"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import styles from "../Admin.module.css";
import { Pencil, Trash2, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { updateOrder, deleteOrder } from "@/app/actions/orders";
import { Country, State } from "country-state-city";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { id: string; name: string };
}

interface Order {
  id: string;
  createdAt: string;
  customerEmail: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string | null;
  shippingMethod: string;
  trackingNo: string | null;
  productCost: number;
  shippingCost: number;
  totalAmount: number;
  shipmentStatus: string;
  status: string;
  items: OrderItem[];
}

export default function OrdersClient({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const allCountries = useMemo(() => Country.getAllCountries(), []);

  useEffect(() => { setOrders(initialOrders); }, [initialOrders]);

  // Get the country code from a country name (for country-state-city lookups)
  const getCountryCode = (countryName: string) => {
    const match = allCountries.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return match?.isoCode || "";
  };

  // Dynamic states for whichever country is being edited
  const editCountryCode = editData.countryCode || getCountryCode(editData.country || "");
  const availableStates = useMemo(() => {
    if (!editCountryCode) return [];
    return State.getStatesOfCountry(editCountryCode);
  }, [editCountryCode]);

  const startEdit = (order: Order) => {
    const code = getCountryCode(order.country);
    setEditingId(order.id);
    setEditData({
      customerEmail: order.customerEmail,
      firstName: order.firstName,
      lastName: order.lastName,
      address: order.address,
      apartment: order.apartment || "",
      city: order.city,
      region: order.region,
      postalCode: order.postalCode,
      country: order.country,
      countryCode: code,
      phone: order.phone || "",
      shippingMethod: order.shippingMethod,
      trackingNo: order.trackingNo || "",
      productCost: order.productCost,
      shippingCost: order.shippingCost,
      totalAmount: order.totalAmount,
      shipmentStatus: order.shipmentStatus,
      status: order.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    // Remove the helper countryCode before sending to server
    const { countryCode, ...dataToSave } = editData;
    const result = await updateOrder(editingId, dataToSave);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingId ? { ...o, ...dataToSave } : o
        )
      );
      setEditingId(null);
    } else {
      alert(result.error || "Failed to save");
    }
    setSaving(false);
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    
    setSaving(true);
    const result = await deleteOrder(orderId);
    if (result.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } else {
      alert(result.error || "Failed to delete");
    }
    setSaving(false);
  };

  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (isoCode: string) => {
    const country = Country.getCountryByCode(isoCode);
    setEditData((prev: any) => ({
      ...prev,
      country: country?.name || isoCode,
      countryCode: isoCode,
      region: "", // Reset region when country changes
    }));
  };

  const toggleExpanded = (orderId: string) => {
    setExpandedId(expandedId === orderId ? null : orderId);
  };

  const shipmentStatuses = ["PENDING", "PROCESSING", "SHIPPED", "IN_TRANSIT", "DELIVERED", "CANCELLED"];
  const orderStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: "2rem", marginBottom: "30px", fontWeight: 700, color: "var(--text-dark)" }}>
        Manage Orders
      </h1>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3>All Orders ({orders.length})</h3>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            <p>No orders have been placed yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.ordersTable} style={{ minWidth: "1100px" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order No.</th>
                  <th>Full Name</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>QTY</th>
                  <th>Shipping</th>
                  <th>Tracking No.</th>
                  <th>Total Cost</th>
                  <th>Shipment</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr
                      onClick={(e) => {
                        // Don't toggle if clicking on inputs, buttons, or selects (edit mode)
                        const target = e.target as HTMLElement;
                        if (
                          target.tagName === "INPUT" ||
                          target.tagName === "SELECT" ||
                          target.tagName === "BUTTON" ||
                          target.closest("button")
                        ) return;
                        toggleExpanded(order.id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ whiteSpace: "nowrap" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--primary-color)", whiteSpace: "nowrap" }}>
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {editingId === order.id ? (
                          <div style={{ display: "flex", gap: "4px" }}>
                            <input value={editData.firstName} onChange={(e) => handleEditChange("firstName", e.target.value)} style={{ ...inputStyle, width: "80px" }} onClick={(e) => e.stopPropagation()} />
                            <input value={editData.lastName} onChange={(e) => handleEditChange("lastName", e.target.value)} style={{ ...inputStyle, width: "80px" }} onClick={(e) => e.stopPropagation()} />
                          </div>
                        ) : (
                          `${order.firstName} ${order.lastName}`
                        )}
                      </td>
                      <td>
                        {editingId === order.id ? (
                          <input
                            value={editData.city}
                            onChange={(e) => handleEditChange("city", e.target.value)}
                            style={{ ...inputStyle, width: "110px" }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          order.city
                        )}
                      </td>
                      <td>
                        {editingId === order.id ? (
                          <select
                            value={editCountryCode}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            style={{ ...inputStyle, width: "130px" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="">Select country</option>
                            {allCountries.map((c) => (
                              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                            ))}
                          </select>
                        ) : (
                          order.country
                        )}
                      </td>
                      <td>
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {editingId === order.id ? (
                          <select value={editData.shippingMethod} onChange={(e) => handleEditChange("shippingMethod", e.target.value)} style={inputStyle} onClick={(e) => e.stopPropagation()}>
                            <option>Standard</option>
                            <option>Express</option>
                            <option>Economy</option>
                          </select>
                        ) : (
                          order.shippingMethod
                        )}
                      </td>
                      <td>
                        {editingId === order.id ? (
                          <input value={editData.trackingNo} onChange={(e) => handleEditChange("trackingNo", e.target.value)} style={{ ...inputStyle, width: "120px" }} placeholder="Tracking #" onClick={(e) => e.stopPropagation()} />
                        ) : (
                          order.trackingNo || <span style={{ color: "#ccc" }}>—</span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                        {editingId === order.id ? (
                          <input type="number" value={editData.totalAmount} onChange={(e) => handleEditChange("totalAmount", parseFloat(e.target.value) || 0)} style={{ ...inputStyle, width: "90px" }} onClick={(e) => e.stopPropagation()} />
                        ) : (
                          `₱${order.totalAmount.toFixed(2)}`
                        )}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {editingId === order.id ? (
                          <select value={editData.shipmentStatus} onChange={(e) => handleEditChange("shipmentStatus", e.target.value)} style={inputStyle} onClick={(e) => e.stopPropagation()}>
                            {shipmentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`${styles.statusBadge} ${getShipmentClass(order.shipmentStatus, styles)}`}>
                            {order.shipmentStatus}
                          </span>
                        )}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {editingId === order.id ? (
                          <select value={editData.status} onChange={(e) => handleEditChange("status", e.target.value)} style={inputStyle} onClick={(e) => e.stopPropagation()}>
                            {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`${styles.statusBadge} ${getStatusClass(order.status, styles)}`}>
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          {editingId === order.id ? (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); saveEdit(); }} disabled={saving} style={actionBtnStyle} title="Save">
                                <Check size={16} color="#10b981" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); cancelEdit(); }} style={actionBtnStyle} title="Cancel">
                                <X size={16} color="#ef4444" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); startEdit(order); }} style={actionBtnStyle} title="Edit">
                                <Pencil size={16} color="var(--primary-color)" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(order.id); }} disabled={saving} style={actionBtnStyle} title="Delete">
                                <Trash2 size={16} color="#ef4444" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Expanded row — shows full address + item details */}
                    {expandedId === order.id && (
                      <tr>
                        <td colSpan={12} style={{ padding: "15px 20px", background: "#fafafa", borderLeft: "3px solid var(--primary-color)" }}>
                          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                            <div style={{ minWidth: "200px" }}>
                              <strong style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Shipping Address</strong>
                              <div style={{ marginTop: "5px", fontSize: "0.9rem", lineHeight: "1.6" }}>
                                {editingId === order.id ? (
                                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <input value={editData.address} onChange={(e) => handleEditChange("address", e.target.value)} style={inputStyle} placeholder="Address" />
                                    <input value={editData.apartment} onChange={(e) => handleEditChange("apartment", e.target.value)} style={inputStyle} placeholder="Apt/Suite" />
                                    <div style={{ display: "flex", gap: "4px" }}>
                                      <input value={editData.city} onChange={(e) => handleEditChange("city", e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="City" />
                                      {availableStates.length > 0 ? (
                                        <select value={editData.region} onChange={(e) => handleEditChange("region", e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                                          <option value="">Region</option>
                                          {availableStates.map((s) => (
                                            <option key={s.isoCode} value={s.name}>{s.name}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <input value={editData.region} onChange={(e) => handleEditChange("region", e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Region" />
                                      )}
                                      <input value={editData.postalCode} onChange={(e) => handleEditChange("postalCode", e.target.value)} style={{ ...inputStyle, width: "70px" }} placeholder="Zip" />
                                    </div>
                                    <select value={editCountryCode} onChange={(e) => handleCountryChange(e.target.value)} style={inputStyle}>
                                      <option value="">Select country</option>
                                      {allCountries.map((c) => (
                                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                ) : (
                                  <p style={{ margin: 0 }}>
                                    {order.address}{order.apartment ? `, ${order.apartment}` : ""}<br />
                                    {order.city}, {order.region} {order.postalCode}<br />
                                    {order.country}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div style={{ minWidth: "200px" }}>
                              <strong style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Order Items</strong>
                              <div style={{ marginTop: "5px" }}>
                                {order.items.map((item) => (
                                  <div key={item.id} style={{ fontSize: "0.9rem", padding: "4px 0", display: "flex", gap: "15px" }}>
                                    <span style={{ fontWeight: 500 }}>{item.product.name}</span>
                                    <span style={{ color: "var(--text-muted)" }}>×{item.quantity}</span>
                                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div style={{ minWidth: "150px" }}>
                              <strong style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Contact</strong>
                              <p style={{ marginTop: "5px", fontSize: "0.9rem", lineHeight: "1.6" }}>
                                {order.customerEmail}<br />
                                {order.phone || "No phone"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getShipmentClass(status: string, styles: any) {
  switch (status) {
    case "DELIVERED": return styles["status-paid"];
    case "SHIPPED":
    case "IN_TRANSIT": return styles["status-shipped"];
    case "CANCELLED": return styles["status-cancelled"];
    default: return styles["status-pending"];
  }
}

function getStatusClass(status: string, styles: any) {
  switch (status) {
    case "PAID":
    case "DELIVERED": return styles["status-paid"];
    case "SHIPPED": return styles["status-shipped"];
    case "CANCELLED": return styles["status-cancelled"];
    default: return styles["status-pending"];
  }
}

const inputStyle: React.CSSProperties = {
  padding: "5px 8px",
  border: "1px solid #d9d9d9",
  borderRadius: "4px",
  fontSize: "0.85rem",
  outline: "none",
  fontFamily: "inherit",
};

const actionBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
