---
title: "How to: Remove a registered app from the Microsoft identity platform"
description: Learn how to remove an application registered with the Microsoft identity platform.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 06/21/2023
ms.author: cwerner
ms.custom: aaddev
ms.reviewer: marsma, aragra, lenalepa, sureshja

#Customer intent: As an application developer, I want to know how to remove my application from the Microsoft identity registered.
---

# Remove an application registered with the Microsoft identity platform

Enterprise developers and software-as-a-service (SaaS) providers who have registered applications with the Microsoft identity platform may need to remove an application's registration.

In the following sections, you learn how to:

- Remove an application authored by you or your organization
- Remove an application authored by another organization

## Prerequisites

- An [application registered in your Microsoft Entra tenant](quickstart-register-app.md)

## Remove an application authored by you or your organization

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Applications that you or your organization have registered are represented by both an application object and service principal object in your tenant. For more information, see [Application objects and service principal objects](./app-objects-and-service-principals.md).

> [!NOTE]
> Deleting an application will also delete its service principal object in the application's home directory. For multi-tenant applications, service principal objects in other directories will not be deleted.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant that contains the app registration to which you want to add an app role.
1. Browse to **Identity** > **Applications** > **App registrations** and then select the application that you want to configure. Once you've selected the app, you see the application's **Overview** page.
1. From the **Overview** page, select **Delete**.
1. Read the deletion consequences.  Check the box if one appears at the bottom of the pane.
1. Select **Delete** to confirm that you want to delete the app.

## Remove an application authored by another organization

If you're viewing **App registrations** in the context of a tenant, a subset of the applications that appear under the **All apps** tab are from another tenant and were registered into your tenant during the consent process. More specifically, they're represented by only a service principal object in your tenant, with no corresponding application object. For more information on the differences between application and service principal objects, see [Application and service principal objects in Microsoft Entra ID](./app-objects-and-service-principals.md).

In order to remove an application’s access to your directory (after having granted consent), the company administrator must remove its service principal. The administrator must have Global Administrator access. To learn how to delete a service principal, see [Delete an enterprise application](../manage-apps/delete-application-portal.md).

## Next steps

Learn more about [application and service principal objects](app-objects-and-service-principals.md) in the Microsoft identity platform.
