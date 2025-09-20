# Email Templates for EmailJS

This document contains the email templates that need to be configured in your EmailJS dashboard.

## User Confirmation Email Template

**Template Name:** Order Confirmation
**Template ID:** Use this as `REACT_APP_EMAILJS_TEMPLATE_ID_USER`

### Subject Line:
```
Order Confirmation - {{order_id}} | Your E-Commerce Store
```

### Email Body:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(45deg, #3b82f6, #1d4ed8); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .items-list { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; white-space: pre-line; }
        .total { font-size: 18px; font-weight: bold; color: #10b981; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your purchase, {{to_name}}!</p>
        </div>
        
        <div class="content">
            <h2>Order Details</h2>
            <div class="order-details">
                <p><strong>Order ID:</strong> {{order_id}}</p>
                <p><strong>Order Date:</strong> {{order_date}}</p>
                <p><strong>Customer:</strong> {{user_name}}</p>
                <p><strong>Email:</strong> {{user_email}}</p>
                <p><strong>Phone:</strong> {{user_phone}}</p>
                <p><strong>Shipping Address:</strong> {{shipping_address}}</p>
            </div>

            <h3>Items Ordered ({{items_count}} items):</h3>
            <div class="items-list">{{items_list}}</div>

            <div class="total">
                <p>Total Amount: ${{total_amount}}</p>
            </div>

            <p>We're processing your order and will send you a shipping confirmation once your items are on their way.</p>
            
            <div class="footer">
                <p>Thank you for shopping with us!</p>
                <p>If you have any questions, please contact our support team.</p>
            </div>
        </div>
    </div>
</body>
</html>
```

## Admin Notification Email Template

**Template Name:** New Order Notification
**Template ID:** Use this as `REACT_APP_EMAILJS_TEMPLATE_ID_ADMIN`

### Subject Line:
```
🚨 New Order Received - {{order_id}} | E-Commerce Store
```

### Email Body:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Order Notification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(45deg, #10b981, #059669); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .customer-info { background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .items-list { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; white-space: pre-line; }
        .total { font-size: 18px; font-weight: bold; color: #dc2626; }
        .urgent { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 New Order Alert!</h1>
            <p>A new order has been placed on your store</p>
        </div>
        
        <div class="content">
            <div class="urgent">
                <p><strong>⚡ Action Required:</strong> A new order needs your attention!</p>
            </div>

            <h2>Order Information</h2>
            <div class="order-details">
                <p><strong>Order ID:</strong> {{order_id}}</p>
                <p><strong>Order Date:</strong> {{order_date}}</p>
                <p><strong>Total Items:</strong> {{items_count}}</p>
                <p><strong>Order Value:</strong> ${{total_amount}}</p>
            </div>

            <h3>Customer Information</h3>
            <div class="customer-info">
                <p><strong>Name:</strong> {{customer_name}}</p>
                <p><strong>Email:</strong> {{customer_email}}</p>
                <p><strong>Phone:</strong> {{customer_phone}}</p>
                <p><strong>Shipping Address:</strong> {{shipping_address}}</p>
            </div>

            <h3>Items Ordered:</h3>
            <div class="items-list">{{items_list}}</div>

            <div class="total">
                <p>💰 Total Revenue: ${{total_amount}}</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <p><strong>Please process this order promptly!</strong></p>
                <p>Log into your admin dashboard to manage this order.</p>
            </div>
        </div>
    </div>
</body>
</html>
```

## Environment Variables Setup

Add these to your `.env` file in the client directory:

```env
# EmailJS Configuration
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID_USER=your_user_template_id_here
REACT_APP_EMAILJS_TEMPLATE_ID_ADMIN=your_admin_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## EmailJS Dashboard Setup Instructions

1. **Create EmailJS Account**: Go to https://www.emailjs.com/ and create an account
2. **Add Email Service**: Connect your email service (Gmail, Outlook, etc.)
3. **Create Templates**: 
   - Create two templates using the HTML content above
   - Copy the template IDs to your environment variables
4. **Get Public Key**: Copy your public key from the EmailJS dashboard
5. **Update Environment Variables**: Add all the keys to your `.env` file

## Template Variables Used

### User Confirmation Template:
- `{{to_name}}` - Customer name
- `{{order_id}}` - Order ID
- `{{order_date}}` - Order date
- `{{user_name}}` - Customer name
- `{{user_email}}` - Customer email
- `{{user_phone}}` - Customer phone
- `{{shipping_address}}` - Full shipping address
- `{{items_count}}` - Number of items
- `{{items_list}}` - List of ordered items
- `{{total_amount}}` - Total order amount

### Admin Notification Template:
- `{{order_id}}` - Order ID
- `{{order_date}}` - Order date
- `{{customer_name}}` - Customer name
- `{{customer_email}}` - Customer email
- `{{customer_phone}}` - Customer phone
- `{{shipping_address}}` - Full shipping address
- `{{items_count}}` - Number of items
- `{{items_list}}` - List of ordered items
- `{{total_amount}}` - Total order amount