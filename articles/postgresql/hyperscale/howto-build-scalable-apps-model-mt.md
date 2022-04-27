---
title: Model multi-tenant apps - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Techniques for scalable multi-tenant SaaS apps
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 04/27/2022
---

# Model multi-tenant SaaS apps

## Tenant ID is the shard key for multi-tenant SaaS apps

The tenant ID is the column at the root of the workload, or the top of the
hierarchy in your data-model. For example, in this SaaS e-commerce schema,
it would be the store ID:

![tenant ID for stores](../media/howto-hyperscale-build-scalable-apps/mt-tenant-id.png)

This data model would be typical for a business such as Shopify. It hosts sites
for multiple online stores, where each store interacts with its own data.

* This data-model has a bunch of tables: stores, products, orders, lineitems
  and countries.
* The stores table is at the top of the hierarchy. Products, orders and
  lineitems are all associated with stores, thus lower in the hierarchy.
* The countries table is not related to individual stores, it is amongst across
  stores.

In this example, `store_id`, which is at the top of the hierarchy, is the
identifier for tenant. It's the right shard key. Picking `store_id` as the
shard key enables collocating data across all tables for a single store on a
single worker.

Colocating tables by store has advantages:

* Provides SQL coverage such as foreign keys, JOINs. Transactions for a single
  tenant are localized on a single worker node where each tenant exists.
* Achieves single digit milisecond performance. Queries for a single tenant are
  routed to a single node instead of getting parallelized, which helps optimize
  network hops and still scale compute/memory.
* It scales. As the number of tenants grows, you can add nodes and rebalance
  the tenants to new nodes, or even isolate large tenants to their own nodes.
  Tenant isolation allows you to provide dedicated resources.

![colocated tables in multi-tenant app](../media/howto-hyperscale-build-scalable-apps/mt-colocation.png)

## Optimal data model for multi-tenant SaaS apps

In this example, we should distribute the store-specific tables by store ID,
and make `countries` a reference table.

![tenant ID in more tables](../media/howto-hyperscale-build-scalable-apps/mt-data-model.png)

Notice that tenant-specific tables have the tenant ID and are distributed. In
our example, stores, products and line\_items are distributed The rest of the
tables are reference tables. In our example, countries is a reference table.

Large tables should all have the tenant ID.

* If you're **migrating an existing** multi-tenant app to Hyperscale (Citus),
  you may need to denormalize a little and add the tenant ID column to large
  tables if it's missing. You'd then backfill missing values of the column.
* For **new apps** on Hyperscale (Citus), make sure the tenant ID is present
  on all tenant-specific tables.

Ensure to include the tenant ID on primary, unique, and foreign key constraints
on distributed tables in the form of a composite key. For example, if a table
has a primary key of `id`, turn it into the composite key `(tenant_id,id)`.
There's no need to do this for reference tables.

## Query considerations for optimal performance

Distributed queries that filter on the tenant ID run most efficiently in
multi-tenant apps. Ensure that your queries are always scoped to a single
tenant.

```sql
SELECT *
  FROM orders
 WHERE order_id = 123
   AND store_id = 42;  -- ← tenant ID filter
```

It's necessary to add the tenant ID filter even if the original filter
conditions unambiguously identifies the rows you want. The tenant ID filter,
while seemingly redundant, tells Hyperscale (Citus) how to route the query to a
single worker node.

Similarly, when you are joining two distributed tables, ensure that both the
tables are scoped to a single tenant. This can be done by ensuring that join
conditions include the tenant ID.

```sql
SELECT sum(l.quantity)
  FROM line_items l
 INNER JOIN products p
    ON l.product_id = p.product_id
   AND l.store_id = p.store_id   -- ← tenant ID in join
 WHERE p.name='Awesome Wool Pants'
   AND l.store_id='8c69aa0d-3f13-4440-86ca-443566c1fc75';
       -- ↑ tenant ID filter
```

There are helper libraries for several popular application frameworks that make
it easy to include a tenant ID in queries. Here are instructions:

* [Ruby on Rails instructions](https://docs.citusdata.com/en/stable/develop/migration_mt_ror.html)
* [Django instructions](https://docs.citusdata.com/en/stable/develop/migration_mt_django.html)
* [ASP.NET](https://docs.citusdata.com/en/stable/develop/migration_mt_asp.html)
* [Java Hibernate](https://www.citusdata.com/blog/2018/02/13/using-hibernate-and-spring-to-build-multitenant-java-apps/)

## Next steps

If you're migrating an existing multi-tenant app to Hyperscale (Citus), see
this highly detailed guide:

> [!div class="nextstepaction"]
> [Migrating an existing app (external) >](https://docs.citusdata.com/en/stable/develop/migration.html#transitioning-mt)
