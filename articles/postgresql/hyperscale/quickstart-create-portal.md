---
title: 'Quickstart: create a server group - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to create and query distributed tables on Azure Database for PostgreSQL Hyperscale (Citus).
ms.author: jonels
author: jonels-msft
recommendations: false
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 06/29/2022
#Customer intent: As a developer, I want to provision a hyperscale server group so that I can run queries quickly on large datasets.
---

# Create a Hyperscale (Citus) server group in the Azure portal

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

Azure Database for PostgreSQL - Hyperscale (Citus) is a managed service that
allows you to run horizontally scalable PostgreSQL databases in the cloud.

## Prerequisites

To follow this quickstart, you'll first need to:

* Create a [free account](https://azure.microsoft.com/free/) (If you don't have
  an Azure subscription).
* Sign in to the [Azure portal](https://portal.azure.com).

## Get started with the Basic Tier

The Basic Tier allows you to deploy Hyperscale (Citus) as a single node, while
having the superpower of distributing tables. At a few dollars a day, it's the
most cost-effective way to experience Hyperscale (Citus). Later, if your
application requires greater scale, you can add nodes and rebalance your data.

Let's get started!

[!INCLUDE [azure-postgresql-hyperscale-create-db](../../../includes/azure-postgresql-hyperscale-create-db.md)]

## Next steps

With your server group created, it's time to connect with a SQL client.

> [!div class="nextstepaction"]
> [Connect to your server group >](quickstart-connect-psql.md)
