---
title: "Quickstart - Provision an Azure Spring Cloud service instance using the Enterprise tier"
description: Describes the creation of an Azure Spring Cloud service instance for app deployment using the Enterprise tier.
author: karlerickson
ms.author: caiqing
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Quickstart: Provision an Azure Spring Cloud service using the Enterprise tier

**This article applies to:** ✔️ Enterprise tier

This quickstart shows you how to create an Azure Spring Cloud service instance using the Enterprise tier.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier Offer in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Provision a service instance

Use the following steps to provision an Azure Spring Cloud service instance:

1. Open the [Azure portal](https://ms.portal.azure.com/?AppPlatformExtension=entdf#home).

1. In the top search box, search for *Azure Spring Cloud*.

1. Select **Azure Spring Cloud** from the **Services** results.

1. On the **Azure Spring Cloud** page, select **Create**.

1. On the Azure Spring Cloud *Create* page, select **Change** next to the *Pricing* option, then select the **Enterprise** tier.

   ![Where to choose the Enterprise Tier on the Create Page](./media/enterprise/getting-started-enterprise/choose-enterprise-tier.png)

   Select the **Terms** checkbox to agree to the legal terms and privacy statements of the Enterprise tier offering in the Azure Marketplace.

1. To configure VMware Tanzu components, select **Next: VMware Tanzu settings** at the bottom right of the page.

   > [!NOTE]
   > All Tanzu components are enabled by default. Please carefully consider which Tanzu components you want to use or enable during the provisioning phase. After provisioning the Azure Spring Cloud instance, you can't enable or disable Tanzu components.

   ![VMware Tanzu Settings screen](./media/enterprise/getting-started-enterprise/create-instance-tanzu-settings-public-preview.png)

1. Select the **Application Insights** section, then select **Enable Application Insights**. You can also enable Application Insights after you provision the Azure Spring Cloud instance.

   - Choose an existing Application Insights instance or create a new Application Insights instance.
   - Give a **Sampling Rate** with in the range of 0-100, or use the default value 10.

   > [!NOTE]
   > You'll pay for the usage of Application Insights when integrated with Azure Spring Cloud. For more information about Application Insights pricing, see [Manage usage and costs for Application Insights](../azure-monitor/app/pricing.md).

   ![Application Insights settings](./media/enterprise/getting-started-enterprise/application-insights.png)

1. Select **Review and create** at the bottom left of the page. After validation completes successfully, select **Create** to start provisioning the service instance.

It takes about 5 minutes to finish the resource provisioning.

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Build and deploy apps to Azure Spring Cloud using the Enterprise tier](quickstart-deploy-apps-enterprise.md)
