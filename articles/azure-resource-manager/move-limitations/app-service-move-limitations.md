---
title: Move Azure resources to new subscription or resource group | Microsoft Docs
description: Use Azure Resource Manager to move resources to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 06/24/2019
ms.author: tomfitz
---

# App Service limitations

The limitations for moving App Service resources differ based on whether you're moving the resources within a subscription or to a new subscription. If your web app uses an App Service Certificate, see [App Service Certificate limitations](#app-service-certificate-limitations)

## Moving within the same subscription

When moving a Web App _within the same subscription_, you can't move third-party SSL certificates. However, you can move a Web App to the new resource group without moving its third-party certificate, and your app's SSL functionality still works.

If you want to move the SSL certificate with the Web App, follow these steps:

1. Delete the third-party certificate from the Web App, but keep a copy of your certificate
2. Move the Web App.
3. Upload the third-party certificate to the moved Web App.

## Moving across subscriptions

When moving a Web App _across subscriptions_, the following limitations apply:

- The destination resource group must not have any existing App Service resources. App Service resources include:
    - Web Apps
    - App Service plans
    - Uploaded or imported SSL certificates
    - App Service Environments
- All App Service resources in the resource group must be moved together.
- App Service resources can only be moved from the resource group in which they were originally created. If an App Service resource is no longer in its original resource group, it must be moved back to that original resource group first, and then it can be moved across subscriptions.

If you don't remember the original resource group, you can find it through diagnostics. For your web app, select **Diagnose and solve problems**. Then, select **Configuration and Management**.

![Select diagnostics](./media/resource-group-move-resources/select-diagnostics.png)

Select **Migration Options**.

![Select migration options](./media/resource-group-move-resources/select-migration.png)

Select the option for recommended steps to move the web app.

![Select recommended steps](./media/resource-group-move-resources/recommended-steps.png)

You see the recommended actions to take before moving the resources. The information includes the original resource group for the web app.

![Recommendations](./media/resource-group-move-resources/recommendations.png)

## App Service Certificate limitations

You can move your App Service Certificate to a new resource group or subscription. If your App Service Certificate is bound to a web app, you must take some steps before moving the resources to a new subscription. Delete the SSL binding and private certificate from the web app before moving the resources. The App Service Certificate doesn't need to be deleted, just the private certificate in the web app.
