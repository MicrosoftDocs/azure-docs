---
title: 'Quickstart: Delete an enterprise application'
description: Delete an enterprise application in Azure Active Directory.
titleSuffix: Azure AD
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 03/24/2022
ms.author: sureshja
ms.reviewer: sureshja
ms.custom: mode-other
#Customer intent: As an administrator of an Azure AD tenant, I want to delete an enterprise application.
---

# Quickstart: Delete an enterprise application

In this quickstart, you use the Azure Active Directory Admin Center to delete an application that was added to your Azure Active Directory (Azure AD) tenant.

It is recommended that you use a non-production environment to test the steps in this quickstart.

## Prerequisites

To delete an enterprise application, you need:

- An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- Completion of the steps in [Quickstart: Add an enterprise application](add-application-portal.md).

## Delete an enterprise application

To delete an enterprise application:

1. Go to the [Azure Active Directory Admin Center](https://aad.portal.azure.com) and sign in using one of the roles listed in the prerequisites.
1. In the left menu, select **Enterprise applications**. The **All applications** pane opens and displays a list of the applications in your Azure AD tenant. Search for and select the application that you want to delete. For example, **Azure AD SAML Toolkit 1**.
1. In the **Manage** section of the left menu, select **Properties**.
1. At the top of the **Properties** pane, select **Delete**, and then select **Yes** to confirm you want to delete the application from your Azure AD tenant.

    :::image type="content" source="media/delete-application-portal/delete-application.png" alt-text="Delete an enterprise application.":::

## Clean up resources

When you are done with this quickstart series, consider deleting the application to clean up your test tenant. Deleting the application was covered in this quickstart.

## Next steps

Learn more about planning a single sign-on deployment.
> [!div class="nextstepaction"]
> [Plan single sign-on deployment](plan-sso-deployment.md)
