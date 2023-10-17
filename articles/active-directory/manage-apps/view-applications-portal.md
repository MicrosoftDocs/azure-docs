---
title: 'Quickstart: View enterprise applications'
description: View the enterprise applications that are registered to use your Microsoft Entra tenant.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: quickstart
ms.date: 03/23/2023
ms.author: jomondi
ms.reviewer: alamaral
ms.custom: mode-other, enterprise-apps
#Customer intent: As an administrator of a Microsoft Entra tenant, I want to search for and view the enterprise applications in the tenant.
---

# Quickstart: View enterprise applications

In this quickstart, you learn how to use the Microsoft Entra admin center to search for and view the enterprise applications that are already configured in your Microsoft Entra tenant.

It's recommended that you use a nonproduction environment to test the steps in this quickstart.

## Prerequisites

To view applications that have been registered in your Microsoft Entra tenant, you need:

- A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, or owner of the service principal.
- Completion of the steps in [Quickstart: Add an enterprise application](add-application-portal.md).

## View a list of applications

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To view the enterprise applications registered in your tenant:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
    :::image type="content" source="media/view-applications-portal/view-enterprise-applications.png" alt-text="View the registered applications in your Microsoft Entra tenant.":::
1. To view more applications, select **Load more** at the bottom of the list. If there are many applications in your tenant, it might be easier to search for a particular application instead of scrolling through the list.

## Search for an application

To search for a particular application:

1. Select the **Application Type** filter option. Select **All applications** from the **Application Type** drop-down menu, and choose **Apply**.
1. Enter the name of the application you want to find. If the application has been added to your Microsoft Entra tenant, it appears in the search results. For example, you can search for the **Azure AD SAML Toolkit 1** application that is used in the previous quickstarts. 
1. Try entering the first few letters of an application name.

## Select viewing options

Select options according to what you're looking for:

1. The default filters are **Application Type** and **Application ID starts with**, and **Application visibility**. 
1. Under **Application Type**, choose one of these options:
    - **Enterprise Applications** shows non-Microsoft applications.
    - **Microsoft Applications** shows Microsoft applications.
    - **Managed Identities** shows applications that are used to authenticate to services that support Microsoft Entra authentication.
    - **All Applications** shows both non-Microsoft and Microsoft applications.
1. Under **Application ID starts with**, enter the first few digits of the application ID if you know the application ID.
1. Under **Application Visibility**, choose **Any**, or **Hidden**. The **Hidden** option shows applications that are in the tenant, but aren't visible to users.
1. After choosing the options you want, select **Apply**.
1. Select **Add filters** to add more options for filtering the search results. The other options include:
   - **Application Visibility**
   - **Created on**
   - **Assignment required**
   - **Is App Proxy**
   - **Owner**
1. To remove any of the filter options already added, select the **X** icon next to the filter option.


## Clean up resources

If you created a test application named **Azure AD SAML Toolkit 1** that was used throughout the quickstarts, you can consider deleting it now to clean up your tenant. For more information, see [Delete an application](delete-application-portal.md).

## Next steps

Learn how to delete an enterprise application.
> [!div class="nextstepaction"]
> [Delete an application](delete-application-portal.md)
