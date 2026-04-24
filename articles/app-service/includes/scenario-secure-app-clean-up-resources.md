---
title: Tutorial - Clean up resources | Azure
description: In this tutorial, you learn how to clean up the Azure resources allocated while creating the web app.
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 04/02/2026
ms.custom:
  - azureday1
  - sfi-image-nochange
#Customer intent: As an application developer, I want to learn how to access Azure Storage for an app using managed identities.
---

If you completed all the steps in this multipart tutorial, you created an App Service, App Service hosting plan, and a storage account in a resource group. You also created an app registration in Microsoft Entra ID. If you chose external configuration, you might have created a new external tenant. When no longer needed, delete these resources and app registration so that you don't continue to accrue charges.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Delete the Azure resources created while following the tutorial.

### Delete the resource group

1. In the [Azure portal](https://portal.azure.com), from the Azure portal menu, select **Resource groups**.
1. Select the resource group that contains your App Service and App Service plan.
1. Select **Delete resource group** to delete the resource group and all the resources.

   :::image type="content" alt-text="Screenshot that shows deleting the resource group." source="../media/scenario-secure-app-clean-up-resources/delete-resource-group.png":::

This action might take several minutes.

### Delete the app registration

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), select **App registrations**. Then select the application you created.

   :::image type="content" alt-text="Screenshot that shows selecting app registration." source="../media/scenario-secure-app-clean-up-resources/select-app-registration.png" lightbox="../media/scenario-secure-app-clean-up-resources/select-app-registration.png":::

1. In the app registration overview, select **Delete**.

   :::image type="content" alt-text="Screenshot that shows deleting the app registration." source="../media/scenario-secure-app-clean-up-resources/delete-app-registration.png" lightbox="../media/scenario-secure-app-clean-up-resources/delete-app-registration.png":::

### Delete the external tenant

If you created a new external tenant, you can [delete it](/entra/external-id/customers/how-to-delete-external-tenant-portal).  

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), browse to **Entra ID** > **Overview** > **Manage tenants**.

1. Select the tenant you want to delete, and then select **Delete**.

   You might need to complete required actions before you can delete the tenant. For example, you might need to delete all user flows and app registrations in the tenant.

1. If you're ready to delete the tenant, select **Delete**.
