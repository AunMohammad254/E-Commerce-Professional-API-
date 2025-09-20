# E-Commerce Client Application

A modern React-based e-commerce frontend with EmailJS integration for order confirmations.

## Features

- 🛒 Shopping cart functionality
- 👤 User authentication
- 📧 Email notifications via EmailJS
- 📱 Responsive design
- 🎨 Modern UI with animations

## EmailJS Configuration

This application uses EmailJS to send order confirmation emails to customers and admin notifications.

### Setup Instructions

1. **Create EmailJS Account**
   - Visit [EmailJS.com](https://www.emailjs.com/) and create an account
   - Create a new service (Gmail, Outlook, etc.)
   - Note your Service ID

2. **Create Email Templates**
   
   **User Confirmation Template:**
   - Template ID: `template_user_confirmation`
   - Subject: `Order Confirmation - {{order_id}}`
   - Content should include: `{{to_name}}`, `{{order_id}}`, `{{order_date}}`, `{{total_amount}}`, `{{items_list}}`
   
   **Admin Notification Template:**
   - Template ID: `template_admin_notification`
   - Subject: `New Order Received - {{order_id}}`
   - Content should include: `{{customer_name}}`, `{{customer_email}}`, `{{order_id}}`, `{{total_amount}}`, `{{items_list}}`

3. **Configure Environment Variables**
   
   Copy `.env.example` to `.env` and update with your EmailJS credentials:
   
   ```env
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID_USER=template_user_confirmation
   REACT_APP_EMAILJS_TEMPLATE_ID_ADMIN=template_admin_notification
   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Template Parameters**
   
   Ensure your EmailJS templates include these parameters:
   
   **User Template:**
   - `{{to_email}}` - Customer email
   - `{{to_name}}` - Customer name
   - `{{order_id}}` - Unique order identifier
   - `{{order_date}}` - Order timestamp
   - `{{total_amount}}` - Order total
   - `{{items_list}}` - List of ordered items
   - `{{user_phone}}` - Customer phone
   - `{{shipping_address}}` - Delivery address
   
   **Admin Template:**
   - `{{to_email}}` - Admin email (aunmohammad254@gmail.com)
   - `{{customer_name}}` - Customer name
   - `{{customer_email}}` - Customer email
   - `{{order_id}}` - Unique order identifier
   - `{{total_amount}}` - Order total
   - `{{items_list}}` - List of ordered items

### Troubleshooting

**Common Issues:**

1. **400 Bad Request Error**
   - Check that all environment variables are set correctly
   - Verify template IDs match exactly in EmailJS dashboard
   - Ensure public key is correct

2. **401 Unauthorized Error**
   - Verify your EmailJS public key
   - Check service configuration in EmailJS dashboard

3. **404 Template Not Found**
   - Confirm template IDs in `.env` match EmailJS dashboard
   - Ensure templates are published/active

4. **Network Errors**
   - Check internet connection
   - Verify EmailJS service status

**Debug Mode:**
The application includes detailed logging. Check browser console for:
- Configuration validation results
- Email sending attempts
- Detailed error messages

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

## Build

```bash
npm run build
```

## Environment Variables

Required environment variables (see `.env.example`):

- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_EMAILJS_SERVICE_ID` - EmailJS Service ID
- `REACT_APP_EMAILJS_TEMPLATE_ID_USER` - User confirmation template ID
- `REACT_APP_EMAILJS_TEMPLATE_ID_ADMIN` - Admin notification template ID
- `REACT_APP_EMAILJS_PUBLIC_KEY` - EmailJS Public Key
