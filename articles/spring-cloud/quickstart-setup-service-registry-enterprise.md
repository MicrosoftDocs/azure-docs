---
title: "Quickstart - Provision an Azure Spring Cloud service instance using the Enterprise tier"
description: Describes the creation of an Azure Spring Cloud service instance for app deployment using the Enterprise tier.
author: karlerickson
ms.author: caiqing
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 01/18/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Quickstart: Set up Service Registry

This quickstart shows you how to set up Service Registry for use with Azure Spring Cloud Enterprise tier.

> [!NOTE]
> To use Service Registry, you must enable it when your Azure Spring Cloud service instance is provisioned. You cannot enable it after provisioning at this time.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier offering from Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Apache Maven](https://maven.apache.org/download.cgi)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Use Service Registry

To use Service Registry, follow these steps:

1. In the Azure portal, select **Service Registry**.
1. Select **Overview** to view the running state and resources allocated to Service Registry.
1. Select **App binding**, then select **Bind app**.
1. Choose one app in the dropdown, and then select **Apply** to bind the application to Service Registry.

   ![Service Registry bind an app dropdown](./media/enterprise/getting-started-enterprise/service-reg-app-bind-dropdown.png)

A list under **App name** shows the apps bound with Service Registry, as shown in the following screenshot:

![Bound Service Registry application list example](./media/enterprise/getting-started-enterprise/service-reg-app-bind.png)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Set up a Log Analytics workspace](quickstart-setup-log-analytics.md)
