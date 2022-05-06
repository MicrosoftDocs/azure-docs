---
title: "Quickstart - Integrate with Azure Database for PostgreSQL and Azure Cache for Redis"
description: Explains how to provision and prepare an Azure Database for PostgreSQL and an Azure Cache for Redis to be used with apps running Azure Spring Cloud Enterprise tier. 
author: maly7
ms.author: 
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 
ms.custom: 
---
# Quickstart: Quickstart - Integrate with Azure Database for PostgreSQL and Azure Cache for Redis

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to provision and prepare an Azure Database for PostgreSQL and an Azure Cache for Redis to be used with apps running Azure Spring Cloud Enterprise tier.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier Offer in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the previous quickstarts in this series:
  - [Build and deploy apps to Azure Spring Cloud using the Enterprise Tier](./quickstart-deploy-enterprise.md).