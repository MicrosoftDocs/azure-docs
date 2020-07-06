---
title: 'Quickstart: Delete an application from your Azure Active Directory (Azure AD) tenant'
description: This quickstart uses the Azure portal to delete an application from your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 07/01/2020
ms.author: kenwith
ms.collection: M365-identity-device-management
---

# Quickstart: Delete an application from your Azure Active Directory (Azure AD) tenant

This quickstart uses the Azure portal to delete an application that has been added to your Azure AD tenant.

## Prerequisites

To delete an application from your Azure AD tenant, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- (Optional: Completion of [View your apps](view-applications-portal.md)).
- (Optional: Completion of [Add an app](add-application-portal.md)).
- (Optional: Completion of [Configure an app](add-application-portal-configure.md)).
- (Optional: Completion of [Set up single sign-on](add-application-portal-setup-sso.md)).

>[!IMPORTANT]
>We recommend using a non-production environment to test the steps in this quickstart.

## Delete an application from your Azure AD tenant

To delete an application from your Azure AD tenant:

1. In the Azure AD portal, select **Enterprise applications** and then find and select the application you want to delete. In this case, we are deleted the GitHub_test application we added in the previous quickstart.
2. In the Manage section of the navigation, select **Properties**.
3. Select Delete and then select Yes to confirm you want to delete the app from your Azure AD tenant.


## Next steps

- [Application management best practices](application-management-fundamentals.md)
- [Application management common scenarios](common-scenarios.md)
- [Application management visibility and control](cloud-app-security.md)