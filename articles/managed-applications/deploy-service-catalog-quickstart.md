---
title: Use Azure portal to deploy service catalog app | Microsoft Docs
description: Shows consumers of Managed Applications how to deploy a service catalog app through the Azure portal. 
services: managed-applications
author: tfitzmac

ms.service: managed-applications
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 10/04/2018
ms.author: tomfitz
---
# Deploy service catalog app through Azure portal

In the [preceding quickstart](publish-managed-app-definition-quickstart.md), you published a managed application definition. In this quickstart, you create a service catalog app from that definition.

## Create service catalog app

In the Azure portal, use the following steps:

1. Select **Create a resource**.

   ![Create a resource](./media/deploy-service-catalog-quickstart/create-new.png)

1. Search for **Service Catalog Managed Application** and select it from the available options.

   ![Search for service catalog application](./media/deploy-service-catalog-quickstart/select-service-catalog.png)

1. You see a description of the Managed Application service. Select **Create**.

   ![Select create](./media/deploy-service-catalog-quickstart/create-service-catalog.png)

1. The portal shows the managed application definitions that you have access to. From the available definitions, select the one you wish to deploy. In this quickstart, use the **Managed Storage Account** definition that you created in the preceding quickstart. Select **Create**.

   ![Select definition to deploy](./media/deploy-service-catalog-quickstart/select-definition.png)

1. Provide values for the **Basics** tab. Select the Azure subscription to deploy your service catalog app to. Create a new resource group named **applicationGroup**. Select a location for your app. When finished, select **OK**.

   ![Provide values for basic](./media/deploy-service-catalog-quickstart/provide-basics.png)

1. Provide a prefix for the storage account name. Select the type of storage account to create. When finished, select **OK**.

   ![Provide values for storage](./media/deploy-service-catalog-quickstart/provide-storage.png)

1. Review the summary. After validation succeeds, select **OK** to begin deployment.

   ![View summary](./media/deploy-service-catalog-quickstart/view-summary.png)

## View results

After the service catalog app has been deployed, you have two new resource groups. One resource group holds the service catalog app. The other resource group holds the resources for the service catalog app.

1. View the resource group named **applicationGroup** to see the service catalog app.

   ![View application](./media/deploy-service-catalog-quickstart/view-managed-application.png)

1. View the resource group named **applicationGroup{hash-characters}** to see the resources for the service catalog app.

   ![View resources](./media/deploy-service-catalog-quickstart/view-resources.png)

## Next steps

* To learn how to create the definition files for a managed application, see [Create and publish a managed application definition](publish-service-catalog-app.md).
* For Azure CLI, see [Deploy service catalog app with Azure CLI](./scripts/managed-application-cli-sample-create-application.md).
* For PowerShell, see [Deploy service catalog app with PowerShell](./scripts/managed-application-poweshell-sample-create-application.md).