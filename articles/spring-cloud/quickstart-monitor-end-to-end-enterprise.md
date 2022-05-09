---
title: "Quickstart - Monitor Applications End-to-End"
description: Explains how to monitor apps running Azure Spring Cloud Enterprise tier using Application Insights and Log Analytics.
author: maly7
ms.author: 
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 
ms.custom: 
---
# Quickstart:  - Monitor Application End-to-End

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how monitor apps running Azure Spring Cloud Enterprise tier using Application Insights and Log Analytics.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier Offer in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the previous quickstarts in this series:
  - [Build and deploy apps to Azure Spring Cloud using the Enterprise Tier](./quickstart-deploy-enterprise.md)
  - [Integrate with Azure Database for PostgreSQL and Azure Cache for Redis](./quickstart-integrate-azure-database-and-redis-enterprise.md)
  - [Securely Load Application Secrets using Key Vault](./quickstart-key-vault-enterprise.md)

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Set Request Rate Limits](./quickstart-set-request-rate-limits-enterprise.md)
