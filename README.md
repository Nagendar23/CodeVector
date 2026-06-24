# Product Browser Backend Assignment

## Overview

This project is a product browsing system built to efficiently handle approximately 200,000 products while supporting:

* Newest-first browsing
* Category filtering
* Fast pagination at scale
* Consistent browsing experience while data changes
* Efficient bulk data generation

The system consists of:

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

### Frontend

* Next.js

### Hosting

* Backend: Render
* Database: MongoDB Atlas
* Frontend: Vercel

---

## Live Demo

Frontend URL:

```text
<frontend-url>
```

Backend URL:

```text
<backend-url>
```

---

## Features

* Browse products ordered by newest first
* Filter products by category
* Cursor-based pagination
* Snapshot-based consistency
* Efficient handling of ~200,000 products
* Bulk seed script for data generation
* MongoDB index optimization

---

## Frontend

The frontend is intentionally minimal because the primary focus of this assignment is backend correctness, scalability, and pagination design.

Features:

* Product listing
* Category filtering
* Load More pagination
* Snapshot-aware browsing session
* Loading and error states

The frontend consumes the backend API and demonstrates:

* Cursor-based pagination
* Category filtering
* Consistent browsing using snapshot timestamps

---

## Product Structure

Each product contains:

```json
{
  "_id": "...",
  "name": "Gaming Mouse",
  "category": "Electronics",
  "price": 2499,
  "createdAt": "2026-06-20T10:00:00Z",
  "updatedAt": "2026-06-21T10:00:00Z"
}
```

---

## Database Design

### Collection

```text
products
```

### Indexes

Global browsing:

```js
{ createdAt: -1, _id: -1 }
```

Category filtering:

```js
{ category: 1, createdAt: -1, _id: -1 }
```

### Why These Indexes?

The application always sorts by:

```text
createdAt DESC, _id DESC
```

The indexes allow MongoDB to:

* Avoid collection scans
* Avoid expensive in-memory sorting
* Efficiently support cursor pagination
* Efficiently support category filtering

### Why Include `_id` In Sorting?

Many products can share the same `createdAt` timestamp.

Sorting by:

```text
createdAt DESC
```

alone can produce ambiguous ordering.

Using:

```text
createdAt DESC, _id DESC
```

creates a deterministic order and enables reliable cursor pagination.

---

## Key Design Decisions

### Why MongoDB?

MongoDB was chosen because:

* Familiar technology stack
* Strong support for compound indexes
* Efficient cursor-based pagination
* Allowed focus on solving the browsing and consistency problems rather than learning a new database during the assignment

### Why Cursor Pagination?

Instead of offset pagination:

```js
skip()
limit()
```

the system uses cursor pagination because:

* Performance does not degrade as the dataset grows
* Works efficiently with indexes
* Provides stable traversal through large datasets
* Avoids common pagination issues caused by shifting offsets

### Why Snapshot Pagination?

One of the requirements was to remain correct while data changes.

The system captures a snapshot timestamp on the first request and reuses it for all subsequent requests in the browsing session.

Benefits:

* Consistent browsing experience
* Stable pagination results
* Prevents pagination inconsistencies caused by concurrent inserts
* Newly inserted products appear only in future browsing sessions

---

## Pagination Strategy

### Why Not Offset Pagination?

Offset pagination using:

```js
skip()
limit()
```

becomes slower as offsets grow larger and may produce inconsistent results when new records are inserted.

### Cursor Pagination

The application uses cursor-based pagination.

Cursor contains:

```json
{
  "createdAt": "...",
  "_id": "..."
}
```

The cursor is encoded before being sent to the client.

Products are sorted using:

```text
createdAt DESC
_id DESC
```

This guarantees stable ordering even when multiple products share the same timestamp.

---

## Consistency Strategy

One requirement was:

> Users must not see duplicate products or miss products while browsing, even when products are added or updated.

### Snapshot-Based Browsing

When the first page is requested:

```text
snapshotTime = current server timestamp
```

The snapshot timestamp is returned to the client.

All future requests use the same snapshot:

```text
createdAt <= snapshotTime
```

This freezes the visible dataset for the browsing session.

### Result

If new products are inserted after browsing begins:

* Existing pagination remains stable
* No duplicates appear
* No products from the browsing snapshot are skipped
* Newly inserted products appear only in future browsing sessions

---

## API

### Get Products

```http
GET /api/products
```

### Query Parameters

| Parameter    | Description                 |
| ------------ | --------------------------- |
| limit        | Number of products per page |
| cursor       | Encoded pagination cursor   |
| category     | Optional category filter    |
| snapshotTime | Snapshot timestamp          |

### Example

```http
GET /api/products?limit=20&category=Electronics
```

### Response

```json
{
  "items": [],
  "count": 20,
  "hasMore": true,
  "nextCursor": "...",
  "snapshotTime": "..."
}
```

---

## Seed Script

The project includes a seed script that generates approximately 200,000 products.

### Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Seed the database:

```bash
npm run seed
```

### Approach

* Batch insertion
* Random product names
* Random categories
* Random prices
* Random timestamps over the last two years

### Why Batch Inserts?

Instead of inserting one record at a time:

```js
create()
```

the script inserts records in batches.

This significantly reduces database round trips and improves seeding performance.

---

## Performance Considerations

### MongoDB Indexes

Compound indexes are used to support:

* Sorting
* Filtering
* Cursor traversal

### Lean Queries

Product listing queries use:

```js
lean()
```

to avoid unnecessary Mongoose document overhead.

### Limit Protection

The API restricts page size to prevent excessively large requests.

---

## What I Would Improve With More Time

* Automated integration tests
* Load testing with concurrent users
* Redis caching for frequently accessed categories
* Cursor signing to prevent cursor tampering
* Observability and monitoring
* Containerized deployment using Docker

---

## AI Usage

AI assisted with:

* Architecture discussions
* Pagination design exploration
* MongoDB indexing discussions
* Reviewing implementation approaches

Final implementation details and architectural decisions were evaluated, tested, and refined during development.
