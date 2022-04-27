---
title: Classify application workload - Hyperscale (Citus) - Azure Database for PostgreSQL
description: How to build relational apps that scale
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 04/26/2022
---

# Classify application workload

Here are common characteristics of the workloads that are the best fit for
Hyperscale (Citus).

## Characteristics of multi-tenant SaaS

* Tenants see their own data; they cannot see other tenants' data.
* Most B2B SaaS apps are multi-tenant. Examples include Salesforce or Shopify.
* In most B2B SaaS apps, there are 100s to 10s of thousands of tenants, and
  more tenants keep joining.
* Multi-tenant SaaS apps are primarily operational/transactional, with single
  digit milisecond latency requirements for their database queries.
* These apps have a classic relational data model, and are built using ORMs –
  like RoR, Hibernate, Django etc.

## Characteristics of real-time operational analytics

* These apps have a customer/user facing interactive analytics dashboard, with
  a sub-second query latency requirement.
* High concurrency required - at least 20 users.
* Analyzes data that's fresh, within the last one second to few minutes.
* Most have timeseries data such as events, logs, etc.
* Common data models in these apps include:
	* Star Schema - few large/fact tables, the rest being small/dimension tables
	* Mostly fewer than 20 major tables

## Characteristics of high-throughput transactional

* Run NoSQL/document style workloads, but require PostgreSQL features such as
  transactions, foreign/primary keys, triggers, extension like PostGIS, etc.
* The workload is based on a single key. It has CRUD and lookups based on that
  key.
* These apps have high throughput requirements: 1000s to 100s of thousand of
  TPS.
* Query latency in single-digit miliseconds, with a high concurrency
  requirement.
* Timeseries data, such as internet of things.

## Next steps

Choose whichever fits your application the best:

> [!div class="nextstepaction"]
> [Classify application workload >](howto-build-scalable-apps-model-mt.md)

> [!div class="nextstepaction"]
> [Classify application workload >](howto-build-scalable-apps-model-rt.md)

> [!div class="nextstepaction"]
> [Classify application workload >](howto-build-scalable-apps-model-htap.md)

## Data modeling by workload

### Modeling multi-tenant SaaS apps

#### Tenant ID as the shard key for multi-tenant SaaS apps

#### Optimal data model for multi-tenant SaaS apps

### Modeling real-time operational analytics apps

#### Shard key in real-time analytics co-locates large tables

#### Optimal data model for real-time operational analytics apps

### Modeling high throughput transactional apps

#### Shard key is the column that you mostly filter on

#### Optimal data model for real-time operational analytics apps
