---
title: Create and manage Azure Database for PostgreSQL VNet service endpoints and rules using Azure CLI | Microsoft Docs
description: This article describes how to create and manage Azure Database for PostgreSQL VNet service endpoints and rules using Azure CLI command line.
services: postgresql
author: mbolz
ms.author: mbolz
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql
ms.devlang: azure-cli
ms.topic: article
ms.date: 1/10/2017
---
# Create and manage Azure Database for PostgreSQL VNet service endpoints using Azure CLI
Virtual Network (VNet) services endpoints and rules extend the private address space of Virtual Network to your Azure Database for PostgreSQL server. Using convenient Azure CLI commands, you can create, update, delete, list, and show VNet service endpoints and rules to manage your server. For an overview of Azure Database for PostgreSQL VNet service endpoints, see [Azure Database for PostgreSQL Server VNet service endpoints](concepts-data-access-and-security-vnet.md)

## Prerequisites
To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server and database](quickstart-create-server-database-azure-cli.md).
- Install [Azure CLI 2.0](/cli/azure/install-azure-cli) command-line utility or use the Azure Cloud Shell in the browser.
