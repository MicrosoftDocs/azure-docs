---
title: Prerequisites to programmatically access analytics data
description: Learn the requirements you need to meet before you can programmatically access commercial marketplace analytics data.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: sayantanroy83
ms.author: sroy
ms.date: 3/08/2021
---

# Prerequisites to programmatically access analytics data

Before you can programmatically access commercial marketplace analytics data, you need to meet the following requirements.

## Commercial marketplace enrollment

To access commercial marketplace analytics data programmatically, you need to be enrolled in the commercial marketplace program and have a Partner Center account. To learn how, see [Create a commercial marketplace account in Partner Center](./partner-center-portal/create-account.md).

## Create Azure Active Directory application

Regular user credentials cannot be used for programmatic access of commercial marketplace analytics data. An Azure Active Directory (Azure AD) application needs to be created along with a secret to access the analytics APIs. To learn how to create an Azure AD application and secret, see [Quickstart: Register an application with the Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app).

## Associate the Azure AD application to the Partner Center tenant

The Azure AD application you created in Azure portal needs to be linked to your Partner Center account. The steps are as follows:

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard).
1. In the upper right, select the gear icon and then select **Account settings**.
1. In the **Account settings** menu, select **User management**.
1. Select **Azure AD applications** and then select **+ Create Azure AD application**.
1. Select the Azure AD application you created on Azure portal and then select **Next**.
1. Select the **Manager(Windows)** checkbox and then select **Add**.

    :::image type="content" source="./media/analytics-programmatic-access/azure-ad-roles.png" alt-text="Illustrates the Create Azure AD application page with the check boxes for selecting roles.":::

## Generate an Azure AD token

You need to Generate an Azure AD token using the Application (client) ID. This ID helps to uniquely identify your client application in the Microsoft identity platform and the client secret from the previous step. For the steps to generate an Azure AD token, see [Service to service calls using client credentials (shared secret or certificate)](https://docs.microsoft.com/azure/active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow).

> [!NOTE]
> The token is valid for one hour.

## Next steps

- [Programmatic access paradigm](analytics-programmatic-access.md)
