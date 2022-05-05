---
title: "Quickstart - Set up Application Configuration Service for Tanzu for Azure Spring Cloud Enterprise tier"
description: Describes how to set up Application Configuration Service for Tanzu for Azure Spring Cloud Enterprise tier.
author: karlerickson
ms.author: caiqing
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Quickstart: Set up Application Configuration Service for Tanzu

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to set up Application Configuration Service for VMware Tanzu® for use with Azure Spring Cloud Enterprise tier.

> [!NOTE]
> To use Application Configuration Service for Tanzu, you must enable it when you provision your Azure Spring Cloud service instance. You cannot enable it after provisioning at this time.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier offering from Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Apache Maven](https://maven.apache.org/download.cgi)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Use Application Configuration Service for Tanzu

To use Application Configuration Service for Tanzu, follow these steps.

### [Portal](#tab/azure-portal)

1. Select **Application Configuration Service**.
1. Select **Overview** to view the running state and resources allocated to Application Configuration Service for Tanzu.

   ![Screenshot of Azure portal Azure Spring Cloud with Application Configuration Service page and Overview section showing.](./media/enterprise/getting-started-enterprise/config-service-overview.png)

1. Select **Settings** and add a new entry in the **Repositories** section with the following information:

   - Name: `default`
   - Patterns: `api-gateway,customers-service`
   - URI: `https://github.com/Azure-Samples/spring-petclinic-microservices-config`
   - Label: `master`

1. Select **Validate** to validate access to the target URI. After validation completes successfully, select **Apply** to update the configuration settings.

   ![Screenshot of Azure portal Azure Spring Cloud with Application Configuration Service page and Settings section showing.](./media/enterprise/getting-started-enterprise/config-service-settings.png)

### [Azure CLI](#tab/azure-cli)

To set the default repository, use the following command:

```azurecli
az spring-cloud application-configuration-service git repo add \
    --name default \
    --patterns api-gateway,customers-service \
    --uri https://github.com/Azure-Samples/spring-petclinic-microservices-config.git \
    --label master
```

---

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
> [Quickstart: Build and deploy apps to Azure Spring Cloud using the Enterprise tier](quickstart-deploy-apps-enterprise.md)
