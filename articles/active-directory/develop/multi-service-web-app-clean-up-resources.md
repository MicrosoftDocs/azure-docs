---
title: Tutorial - Clean up resources
description: In this tutorial, you learn how to clean up the Azure resources allocated while creating the web app.
services: storage, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service
ms.topic: tutorial
ms.workload: identity
ms.date: 04/25/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.custom: azureday1
#Customer intent: As an application developer, I want to learn how to access Azure Storage for an app using managed identities.
ms.subservice: web-apps
---

# Tutorial: Clean up resources

If you completed all the steps in this multipart tutorial, you created an app service, app service hosting plan, and a storage account in a resource group. You also created an app registration in Microsoft Entra ID. When no longer needed, delete these resources and app registration so that you don't continue to accrue charges.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Delete the Azure resources created while following the tutorial.

## Delete the resource group

In the [Azure portal](https://portal.azure.com), select **Resource groups** from the portal menu and select the resource group that contains your app service and app service plan.

Select **Delete resource group** to delete the resource group and all the resources.

:::image type="content" alt-text="Screenshot that shows deleting the resource group." source="./media/multi-service-web-app-clean-up-resources/delete-resource-group.png":::

This command might take several minutes to run.

## Delete the app registration

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Developer](../roles/permissions-reference.md#application-developer).
1. Browse to **Identity** > **Applications** > **App registrations**. 
1. Select the application you created.
1. In the app registration overview, select **Delete**.
