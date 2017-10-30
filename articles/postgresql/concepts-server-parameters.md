---
title: Overview of server parameters in Azure Database for PostgreSQL | Microsoft Docs
description: This article gives and overview on Server Parameters in Azure Database for PostgreSQL and how to access and configure them.
services: postgresql
author: rachel-msft
ms.author: raagyema
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 10/27/2017
---

# Configuration parameters in Azure Database for PostgreSQL

The PostgreSQL server parameters determine the configuration of the server. In Azure Database for PostgreSQL these parameters can be viewed and edited via the Azure portal or the Azure CLI. See the [PostgreSQL documentation on Server Configuration](https://www.postgresql.org/docs/9.6/static/runtime-config.html) for more information on these parameters.

As a managed service for Postgres, the configurable parameters in Azure Database for PostgreSQL are a subset of the parameters in a local Postgres instance. Your Azure Database for PostgreSQL server is enabled with default values for each parameter on creation. Parameters that would require a server restart or superuser access for changes to take effect cannot be configured by the user.

The Azure portal also provides a GUI view of the list of parameter names, descriptions, current values, as well as the range of values for enumerated-type parameters and numeric parameters.

# # Next Steps
- View and edit server parameters through [Azure Portal](howto-configure-server-parameters-using-portal.md) or [Azure CLI](howto-configure-server-parameters-using-cli.md).
