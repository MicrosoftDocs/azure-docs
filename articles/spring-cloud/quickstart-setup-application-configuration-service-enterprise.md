---
title: "Quickstart - Set up Application Configuration Service for Azure Spring Cloud Enterprise tier"
description: Describes how to set up Application Configuration Service for Azure Spring Cloud Enterprise tier.
author: karlerickson
ms.author: caiqing
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Quickstart: Set up Application Configuration Service

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to set up Application Configuration Service for use with Azure Spring Cloud Enterprise tier.

> [!NOTE]
> To use Application Configuration Service, you must enable it when you provision your Azure Spring Cloud service instance. You cannot enable it after provisioning at this time.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier offering from Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Apache Maven](https://maven.apache.org/download.cgi)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Use Application Configuration Service

To use Application Configuration Service, follow these steps.

### [Portal](#tab/azure-portal)

1. Select **Application Configuration Service**.
1. Select **Overview** to view the running state and resources allocated to Application Configuration Service.

   ![Azure portal screenshot of Azure Spring Cloud with Application Configuration Service page and Overview section showing.](./media/enterprise/getting-started-enterprise/config-service-overview.png)

1. Select **Settings** and add a new entry in the **Repositories** section with the following information:

   - Name: `default`
   - Patterns: `api-gateway,customers-service`
   - URI: `https://github.com/Azure-Samples/spring-petclinic-microservices-config`
   - Label: `master`

1. Select **Validate** to validate access to the target URI. After validation completes successfully, select **Apply** to update the configuration settings.

   ![Azure portal screenshot of Azure Spring Cloud with Application Configuration Service page and Settings section showing.](./media/enterprise/getting-started-enterprise/config-service-settings.png)

1. Select **App binding**, then select **Bind app**.
1. Choose one app in the dropdown and select **Apply** to bind the application to Application Configuration Service.

   ![Azure portal screenshot of Azure Spring Cloud with Application Configuration Service page and 'App binding' section with 'Bind app' dialog showing.](./media/enterprise/getting-started-enterprise/config-service-app-bind-dropdown.png)

A list under **App name** shows the apps bound with Application Configuration Service, as shown in the following screenshot:

![Azure portal screenshot of Azure Spring Cloud with Application Configuration Service page and 'App binding' section with app list showing.](./media/enterprise/getting-started-enterprise/config-service-app-bind.png)

### [Azure CLI](#tab/azure-cli)

1. To set the default repository, use the following command:

   ```azurecli
   az spring-cloud application-configuration-service git repo add \
       --name default \
       --patterns api-gateway,customers-service \
       --uri https://github.com/Azure-Samples/spring-petclinic-microservices-config.git \
       --label master
   ```

1. To use Application Configuration Service with applications, use the following command:

   ```azurecli
   az spring-cloud application-configuration-service bind --app <app-name>
   ```

---

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Set up Service Registry](quickstart-setup-service-registry-enterprise.md)
