---
title: Overview of Partner Center submission API onboarding
description: An overview of Partner Center submission API onboarding.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.author: mingshen
author: mingshen-ms
ms.date: 8/29/2022
---

# Partner Center submission API onboarding

Use the Partner Center submission API to programmatically query, create submissions for, and publish commercial marketplace offers. This API is useful if your account manages many offers and you want to automate and optimize the submission process for these offers.

## API prerequisites

The Partner Center submissions API requires a few programmatic assets:

- an Azure Active Directory application
- an Azure Active Directory (Azure AD) access token

### Step 1: Complete prerequisites for using the Partner Center submission API

Before you start writing code to call the Partner Center submission API, ensure you have completed the following prerequisites.

- You (or your organization) must have an Azure AD directory and you must have [Global administrator](../active-directory/roles/permissions-reference.md) permission for the directory. If you already use Microsoft 365 or other business services from Microsoft, you already have Azure AD directory. Otherwise, you can [create a new Azure AD](manage-tenants.md#create-a-new-tenant) in Partner Center at no additional charge.
- You must [associate an Azure AD application](manage-aad-apps.md) with your Partner Center account and obtain your tenant ID, client ID, and key. You need these to obtain the Azure AD access token you will use in calls to the Microsoft Store submission API.

#### Associate an Azure AD application with your Partner Center account

To use the Partner Center submission API, you must associate an Azure AD application with your Partner Center account, retrieve the tenant ID and client ID for the application, and generate a key. The Azure AD application represents the app or service from which you want to call the Partner Center submission API. You need the tenant ID, client ID, and key to obtain an Azure AD access token to pass to the API.

> [!NOTE]
> You only need to perform this task once. After you have the tenant ID, client ID and key, you can reuse them any time you need to create a new Azure AD access token.

1. In Partner Center, [associate your organization's Partner Center account](manage-tenants.md) with your organization's Azure AD directory.

1. From the **Users** page in the **Account settings** section of Partner Center, [add the Azure AD application](manage-aad-apps.md) that represents the app or service you will use to access submissions for your Partner Center account. Ensure you assign this application the **Manager** role. If the application doesn't exist yet in your Azure AD directory, [create a new Azure AD application](manage-aad-apps.md#add-new-azure-ad-applications) in Partner Center.

1. Return to the **Users** page, select the name of your Azure AD application to go to the application settings, and copy the **Tenant ID** and **Client ID** values.

1. Select **Add new key**. On the following screen, copy the **Key** value. You won't be able to access this info again after you leave this page. For more information, see [Manage keys for an Azure AD application](manage-aad-apps.md#manage-keys-for-an-azure-ad-application).

### Step 2: Obtain an Azure AD access token

Before you call any of the methods in the Partner Center submission API, you must first obtain an Azure AD access token to pass to the **Authorization** header of each method in the API. An access token expires 60 minutes after issuance. After that, you can refresh it so you can use it in future calls to the API.

To obtain the access token, follow the instructions in [Service to Service Calls Using Client Credentials](../active-directory/azuread-dev/v1-oauth2-client-creds-grant-flow.md) to send an `HTTP POST` to the `https://login.microsoftonline.com/<tenant_id>/oauth2/token` endpoint. Here is a sample request:

```json
POST https://login.microsoftonline.com/<tenant_id>/oauth2/token HTTP/1.1
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded; charset=utf-8

grant_type=client_credentials
&client_id=<your_client_id>
&client_secret=<your_client_secret>
&resource= https://api.partner.microsoft.com
```

For the tenant_id value in the POST URI and the client_id and client_secret parameters, specify the tenant ID, client ID and the key for your application that you retrieved from Partner Center in the previous section. For the resource parameter, you must specify `https://api.partner.microsoft.com`.

### Step 3: Use the Partner Center submission API

After you have an Azure AD access token, call methods in the Partner Center submission API. To create or update submissions, you typically call multiple methods in the Partner Center submission API in a specific order. For information about each scenario and the syntax of each method, see the [Ingestion API](https://ingestionapi-swagger.azureedge.net/#/) Swagger.

## Next steps

- Start using the Partner Center submission API as described above
