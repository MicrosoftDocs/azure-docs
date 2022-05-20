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

# Quickstart: Provision an Azure Spring Cloud service instance using the Enterprise tier

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to create an Azure Spring Cloud service instance using the Enterprise tier.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier Offer in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Provision a service instance

Use the following steps to provision an Azure Spring Cloud service instance:

### [Portal](#tab/azure-portal)

1. Open the [Azure portal](https://ms.portal.azure.com/).

1. In the top search box, search for *Azure Spring Cloud*.

1. Select **Azure Spring Cloud** from the **Services** results.

1. On the **Azure Spring Cloud** page, select **Create**.

1. On the Azure Spring Cloud **Create** page, select **Change** next to the **Pricing** option, then select the **Enterprise** tier.

   :::image type="content" source="media/enterprise/getting-started-enterprise/choose-enterprise-tier.png" alt-text="Screenshot of Azure portal Azure Spring Cloud creation page with Basics section and 'Choose your pricing tier' pane showing." lightbox="media/enterprise/getting-started-enterprise/choose-enterprise-tier.png":::

   Select the **Terms** checkbox to agree to the legal terms and privacy statements of the Enterprise tier offering in the Azure Marketplace.

1. To configure VMware Tanzu components, select **Next: VMware Tanzu settings**.

   > [!NOTE]
   > All Tanzu components are enabled by default. Be sure to carefully consider which Tanzu components you want to use or enable during the provisioning phase. After provisioning the Azure Spring Cloud instance, you can't enable or disable Tanzu components.

   :::image type="content" source="media/enterprise/getting-started-enterprise/create-instance-tanzu-settings-public-preview.png" alt-text="Screenshot of Azure portal Azure Spring Cloud creation page with V M ware Tanzu Settings section showing." lightbox="media/enterprise/getting-started-enterprise/create-instance-tanzu-settings-public-preview.png":::

1. Select the **Application Insights** section, then select **Enable Application Insights**. You can also enable Application Insights after you provision the Azure Spring Cloud instance.

   - Choose an existing Application Insights instance or create a new Application Insights instance.
   - Give a **Sampling Rate** with in the range of 0-100, or use the default value 10.

   > [!NOTE]
   > You'll pay for the usage of Application Insights when integrated with Azure Spring Cloud. For more information about Application Insights pricing, see [Application Insights billing](../azure-monitor/logs/cost-logs.md#application-insights-billing).

    :::image type="content" source="media/enterprise/getting-started-enterprise/application-insights.png" alt-text="Screenshot of Azure portal Azure Spring Cloud creation page with Application Insights section showing." lightbox="media/enterprise/getting-started-enterprise/application-insights.png":::

1. Select **Review and create**. After validation completes successfully, select **Create** to start provisioning the service instance.

It takes about 5 minutes to finish the resource provisioning.

### [Azure CLI](#tab/azure-cli)

1. Update Azure CLI with the Azure Spring Cloud extension by using the following command:

   ```azurecli
   az extension update --name spring-cloud
   ```

1. Sign in to the Azure CLI and choose your active subscription by using the following command:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to accept the legal terms and privacy statements for the Enterprise tier. This step is necessary only if your subscription has never been used to create an Enterprise tier instance of Azure Spring Cloud.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   az term accept --publisher vmware-inc --product azure-spring-cloud-vmware-tanzu-2 --plan tanzu-asc-ent-mtr
   ```

1. Prepare a name for your Azure Spring Cloud service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Create a resource group and an Azure Spring Cloud service instance using the following the command:

   ```azurecli
   az group create --name <resource-group-name>
   az spring-cloud create \
       --resource-group <resource-group-name> \
       --name <service-instance-name> \
       --sku enterprise
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md).

1. Set your default resource group name and Spring Cloud service name using the following command:

   ```azurecli
   az config set defaults.group=<resource-group-name> defaults.spring-cloud=<service-instance-name>
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
> [Quickstart: Set up Application Configuration Service for Tanzu](quickstart-setup-application-configuration-service-enterprise.md)
