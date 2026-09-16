# BusinessPOS Pro

A professional point-of-sale system for retail, wholesale, supermarkets, electronics shops, restaurants, and general businesses.

## Features included

- Sales module with cart, quantity updates, discount, payment selection, receipt preview, sales history, and return handling.
- Purchase module for vendor stock replenishment and purchase ledger.
- Customer management with phone numbers, balances, and purchase totals.
- Vendor management with supplier records and amount owed tracking.
- Inventory module for products, pricing, stock changes, low-stock monitoring, and stock adjustments.
- Accounts dashboard covering income, expenses, payment records, and profit tracking.
- Delivery tracking linked to completed sales, with Preparing, Ready for Delivery, Dispatched, On the Way, Arrived, Delivered, and Failed statuses.
- Delivery assignment, role-restricted driver actions, event timestamps, customer PIN confirmation, failure reasons, and delivery filters.

## Run the app

Option 1: open the file directly in a browser

- Open `index.html` in your browser.

Option 2: serve locally from the project folder

```bash
cd "c:\Users\kawis\OneDrive\Desktop\PROJ\Point of sale"
python -m http.server 3000
```

Then open:

```text
http://localhost:3000
```

## Data storage

The app stores data locally in the browser using `localStorage`, which makes it easy to test without a database setup. There is no server-side database or API in this prototype, so PIN validation and authorization are enforced in the client-side application state; production deployment should move those checks to a backend.

## Notes

This is a lightweight business-ready POS prototype designed for fast local use and demo deployments.
