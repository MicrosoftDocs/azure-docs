---
title: Classify application workload - Azure Cosmos DB for PostgreSQL
description: Classify workload for scalable application
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: quickstart
recommendations: false
ms.date: 01/30/2023
---

# Classify application workload in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Here are common characteristics of the workloads that are the best fit for
Azure Cosmos DB for PostgreSQL.

## Prerequisites

This article assumes you know the [fundamental concepts for
scaling](quickstart-build-scalable-apps-concepts.md). If you haven't read about
them, take a moment to do so.

## Characteristics of multi-tenant SaaS

* Tenants see their own data; they can't see other tenants' data.
* Most B2B SaaS apps are multi-tenant. Examples include Salesforce or Shopify.
* In most B2B SaaS apps, there are hundreds to tens of thousands of tenants, and
  more tenants keep joining.
* Multi-tenant SaaS apps are primarily operational/transactional, with single
  digit millisecond latency requirements for their database queries.
* These apps have a classic relational data model, and are built using ORMs –
  like RoR, Hibernate, Django etc.
  <br><br>
  > [!VIDEO https://www.youtube.com/embed/7gAW08du6kk]

## Characteristics of real-time operational analytics

* These apps have a customer/user facing interactive analytics dashboard, with
  a subsecond query latency requirement.
* High concurrency required - at least 20 users.
* Analyzes data that's fresh, within the last one second to few minutes.
* Most have time series data such as events, logs, etc.
* Common data models in these apps include:
	* Star Schema - few large/fact tables, the rest being small/dimension tables
	* Mostly fewer than 20 major tables
  <br><br>
  > [!VIDEO https://www.youtube.com/embed/xGWVVTva434]

## Characteristics of high-throughput transactional

* Run NoSQL/document style workloads, but require PostgreSQL features such as
  transactions, foreign/primary keys, triggers, extension like PostGIS, etc.
* The workload is based on a single key. It has CRUD and lookups based on that
  key.
* These apps have high throughput requirements: thousands to hundreds of thousands of
  TPS.
* Query latency in single-digit milliseconds, with a high concurrency
  requirement.
* Time series data, such as internet of things.
  <br><br>
  > [!VIDEO https://www.youtube.com/embed/A9q7w96yO_E]

## Next steps

Choose whichever fits your application the best:

> [!div class="nextstepaction"]
> [Model multi-tenant SaaS app >](quickstart-build-scalable-apps-model-multi-tenant.md)

> [!div class="nextstepaction"]
> [Model real-time analytics app](quickstart-build-scalable-apps-model-real-time.md)

> [!div class="nextstepaction"]
> [Model high-throughput app](quickstart-build-scalable-apps-model-high-throughput.md)
