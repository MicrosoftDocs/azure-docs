---
title: Move Azure App Service resources across resource groups or subscriptions
description: Use Azure Resource Manager to move App Service resources to a new resource group or subscription.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 08/17/2023
---

# Move App Service resources to a new resource group or subscription

This article describes the steps to move App Service resources between resource groups or Azure subscriptions. There are specific requirements for moving App Service resources to a new subscription.

If you want to move App Services to a new region, see [Move an App Service resource to another region](../../../app-service/manage-move-across-regions.md).

## Move across subscriptions

When you move a Web App across subscriptions, the following guidance applies:

- Moving a resource to a new resource group or subscription is a metadata change that shouldn't affect anything about how the resource functions. For example, the inbound IP address for an app service doesn't change when moving the app service.
- The destination resource group must not have any existing App Service resources. App Service resources include:
    - Web Apps
    - App Service plans
    - Uploaded or imported TLS/SSL certificates
    - App Service Environments
- All App Service resources in the resource group must be moved together.
- App Service Environments can't be moved to a new resource group or subscription.
    - You can move a Web App and App Service plan hosted on an App Service Environment to a new subscription without moving the App Service Environment. The Web App and App Service plan that you move will always be associated with your initial App Service Environment. You can't move a Web App/App Service plan to a different App Service Environment.
    - If you need to move a Web App and App Service plan to a new App Service Environment, you'll need to recreate these resources in your new App Service Environment. Consider using the [backup and restore feature](../../../app-service/manage-backup.md) as way of recreating your resources in a different App Service Environment.
- You can move a certificate bound to a web without deleting the TLS bindings, as long as the certificate is moved with all other resources in the resource group. However, you can't move a free App Service managed certificate. For that scenario, see [Move with free managed certificates](#move-with-free-managed-certificates).
- App Service apps with private endpoints cannot be moved. Delete the private endpoint(s) and recreate it after the move.
- App Service resources can only be moved from the resource group in which they were originally created. If an App Service resource is no longer in its original resource group, move it back to its original resource group. Then, move the resource across subscriptions. For help with finding the original resource group, see the next section.

## Find original resource group

If you don't remember the original resource group, you can find it through diagnostics. For your web app, select **Diagnose and solve problems**. Then, select **Configuration and Management**.

:::image type="content" source="./media/app-service-move-limitations/select-diagnostics.png" alt-text="Screenshot of the Diagnose and solve problems section with the Configuration and Management option highlighted.":::

Select **Migration Options**.

:::image type="content" source="./media/app-service-move-limitations/select-migration.png" alt-text="Screenshot of the Migration Options section in the Configuration and Management menu.":::

Select the option for recommended steps to move the web app.

:::image type="content" source="./media/app-service-move-limitations/recommended-steps.png" alt-text="Screenshot of the Recommended Steps option in the Migration Options section.":::

You see the recommended actions to take before moving the resources. The information includes the original resource group for the web app.

:::image type="content" source="./media/app-service-move-limitations/recommendations.png" alt-text="Screenshot of the Recommended Actions section displaying the original resource group for the web app.":::

## Move hidden resource types in portal

When using the portal to move your App Service resources, you may see an error indicating that you haven't moved all of the resources. If you see this error, check if there are resource types that the portal didn't display. Select **Show hidden types**. Then, select all of the resources to move.

:::image type="content" source="./media/app-service-move-limitations/show-hidden-types.png" alt-text="Screenshot of the Show Hidden Types option in the portal when moving App Service resources.":::

## Move with free managed certificates

You can't move a free App Service managed certificate. Instead, delete the managed certificate and recreate it after moving the web app. To get instructions for deleting the certificate, use the **Migration Operations** tool.

If your free App Service managed certificate gets created in an unexpected resource group, try moving the app service plan back to its original resource group. Then, recreate the free managed certificate. This issue will be fixed.

## Move support

To determine which App Service resources can be moved, see move support status for:

- [Microsoft.AppService](../move-support-resources.md#microsoftappservice)
- [Microsoft.CertificateRegistration](../move-support-resources.md#microsoftcertificateregistration)
- [Microsoft.DomainRegistration](../move-support-resources.md#microsoftdomainregistration)
- [Microsoft.Web](../move-support-resources.md#microsoftweb)

## Next steps

For commands to move resources, see [Move resources to new resource group or subscription](../move-resource-group-and-subscription.md).
