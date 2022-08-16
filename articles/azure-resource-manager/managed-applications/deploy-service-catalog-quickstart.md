---
title: Use Azure portal to deploy service catalog application
description: Shows consumers of Azure Managed Applications how to deploy a service catalog application from the Azure portal.
author: davidsmatlak
ms.author: davidsmatlak
ms.topic: quickstart
ms.date: 08/17/2022
---

# Quickstart: Deploy service catalog application from Azure portal

In the [preceding quickstart](publish-service-catalog-app.md), you published a managed application definition. In this quickstart, you create a service catalog application from that definition.

## Create service catalog app

In the Azure portal, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/create-resource.png" alt-text="Create a resource":::

1. Search for _Service Catalog Managed Application_ and select it from the available options.

1. **Service Catalog Managed Application** is displayed. Select **Create**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/create-service-catalog-managed-app.png" alt-text="Select create":::

1. The portal shows the managed application definitions that you have access to. From the available definitions, select the one you wish to deploy. In this quickstart, use the **Managed Storage Account** definition that you created in the preceding quickstart. Select **Create**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/select-definition.png" alt-text="Select definition to deploy":::

1. Provide values for the **Basics** tab. Select the Azure subscription to deploy your service catalog app to. Create a new resource group named **applicationGroup**. Select a location for your app. When finished, select **OK**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/provide-basics.png" alt-text="Provide values for basic":::

1. Provide a prefix for the storage account name. Select the type of storage account to create. When finished, select **OK**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/provide-storage.png" alt-text="Provide values for storage":::

1. Review the summary. After validation succeeds, select **OK** to begin deployment.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/view-summary.png" alt-text="View summary":::

## View results

After the service catalog app has been deployed, you have two new resource groups. One resource group holds the service catalog app. The other resource group holds the resources for the service catalog app.

1. View the resource group named **applicationGroup** to see the service catalog app.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/view-managed-application.png" alt-text="View application":::

1. View the resource group named **applicationGroup{hash-characters}** to see the resources for the service catalog app.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/view-resources.png" alt-text="View resources":::

## Next steps

- To learn how to create the definition files for a managed application, see [Quickstart: Create and publish an Azure Managed Application definition](publish-service-catalog-app.md).
- For Azure CLI, see [Deploy managed application with Azure CLI](./scripts/managed-application-cli-sample-create-application.md).
- For PowerShell, see [Deploy managed application with PowerShell](./scripts/managed-application-poweshell-sample-create-application.md).
