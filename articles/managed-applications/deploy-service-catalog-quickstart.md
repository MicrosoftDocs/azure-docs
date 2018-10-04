---
title: Use Azure portal to deploy service catalog app | Microsoft Docs
description: Shows consumers of Managed Applications how to deploy a service catalog app through the Azure portal. 
services: managed-applications
author: tfitzmac

ms.service: managed-applications
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 10/03/2018
ms.author: tomfitz
---
# Deploy service catalog app through Azure portal

After your organization has published managed application definitions, you can deploy those service catalog apps through the Azure portal. 

## Prerequisites

You need a published managed application definition. If your organization hasn't published one, see [Publish an Azure managed application definition](publish-managed-app-definition-quickstart.md).

## Create service catalog app

1. In the portal, select **Create a resource**.

   ![Create a resource](./media/deploy-service-catalog-quickstart/create-new.png)

1. Search for **Service Catalog Managed Application**.

   ![Search for service catalog managed application](./media/deploy-service-catalog-quickstart/select-service-catalog.png)

1. Select **Create**.

   ![Select create](./media/deploy-service-catalog-quickstart/create-service-catalog.png)

1. From the available service catalog apps, select the one you want to deploy. Select **Create**.

   ![Select definition to deploy](./media/deploy-service-catalog-quickstart/select-definition.png)

1. Provide values for the **Basics** tab. Create a new resource group named **applicationGroup**. When finished, select **OK**.

   ![Provide values for basic](./media/deploy-service-catalog-quickstart/provide-basics.png)

1. Provide values for the storage account. When finished, select **OK**.

   ![Provide values for storage](./media/deploy-service-catalog-quickstart/provide-storage.png)

1. Review the summary. After validation succeeds, select OK to begin deployment.

   ![View summary](./media/deploy-service-catalog-quickstart/view-summary.png)

## View results

After the service catalog app has been deployed, you have two new resource groups.

1. View the resource group named **applicationGroup** to see the managed application instance.

   ![View managed application](./media/deploy-service-catalog-quickstart/view-managed-application.png)

1. View the resource group named **applicationGroup{hash-characters}** to see the resources for the managed application.

   ![View resources](./media/deploy-service-catalog-quickstart/view-resources.png)

## Next steps

* To learn how to create the definition files for a managed application, see [Create and publish a managed application definition](publish-service-catalog-app.md).
* For Azure CLI, see [Deploy service catalog app with Azure CLI](./scripts/managed-application-cli-sample-create-application.md).
* For PowerShell, see [Deploy service catalog app with PowerShell](./scripts/managed-application-poweshell-sample-create-application.md).