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

- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- An [application registered in your Azure AD tenant](quickstart-register-app.md)

## Remove an application authored by you or your organization

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Applications that you or your organization have registered are represented by both an application object and service principal object in your tenant. For more information, see [Application objects and service principal objects](./app-objects-and-service-principals.md).

> [!NOTE]
> Deleting an application will also delete its service principal object in the application's home directory. For multi-tenant applications, service principal objects in other directories will not be deleted.

To delete an application, be listed as an owner of the application or have admin privileges.

1. Sign in to the [Azure portal](https://portal.azure.com) and sign in using one of the roles listed in the prerequisites.
1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant in which the app is registered.
1. Search and select the **Azure Active Directory**. 
1. Under **Manage**, select **App registrations**  and select the application that you want to configure. Once you've selected the app, you see the application's **Overview** page.
1. From the **Overview** page, select **Delete**.
1. Read the deletion consequences.  Check the box if one appears at the bottom of the pane.
1. Select **Delete** to confirm that you want to delete the app.

## Remove an application authored by another organization

If you're viewing **App registrations** in the context of a tenant, a subset of the applications that appear under the **All apps** tab are from another tenant and were registered into your tenant during the consent process. More specifically, they're represented by only a service principal object in your tenant, with no corresponding application object. For more information on the differences between application and service principal objects, see [Application and service principal objects in Azure AD](./app-objects-and-service-principals.md).

In order to remove an application’s access to your directory (after having granted consent), the company administrator must remove its service principal. The administrator must have Global Administrator access. To learn how to delete a service principal, see [Delete an enterprise application](../manage-apps/delete-application-portal.md).

## Next steps

Learn more about [application and service principal objects](app-objects-and-service-principals.md) in the Microsoft identity platform.
