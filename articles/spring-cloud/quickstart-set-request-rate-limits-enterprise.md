---
title: "Quickstart - Set Request Rate Limits"
description: Explains how to set request rate limits using Spring Cloud Gateway on Azure Spring Cloud Enterprise tier.
author: maly7
ms.author: 
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 
ms.custom: 
---
# Quickstart:  - Set Request Rate Limits

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to set request rate limits using Spring Cloud Gateway on Azure Spring Cloud Enterprise tier. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier Offer in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the previous quickstarts in this series:
  - [Build and deploy apps to Azure Spring Cloud using the Enterprise Tier](./quickstart-deploy-enterprise.md)

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
> [Quickstart: Automate Deployments](./quickstart-automate-deployments-github-actions-enterprise.md)
