---
title: Partner Center submission API to onboard Azure apps in the Microsoft commercial marketplace 
description: Learn the prerequisites to use the Partner Center submission API for Azure apps in commercial marketplace on Microsoft Partner Center. 
author: dsindona 
ms.author: dsindona
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 12/10/2019
---

# Partner Center submission API to onboard Azure apps in Partner Center

Use the *Partner Center submission API* to programmatically query, create submissions for, and publish Azure offers.  This API is useful if your account manages many offers and you want to automate and optimize the submission process for these offers.

## API prerequisites

There are a few programmatic assets that you need in order to use the Partner Center API for Azure Products: 

- an Azure Active Directory application.
- an Azure Active Directory (Azure AD) access token.

### Step 1: Complete prerequisites for using the Partner Center submission API

Before you start writing code to call the Partner Center submission API, make sure that you have completed the following prerequisites.

- You (or your organization) must have an Azure AD directory and you must have [Global administrator](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles) permission for the directory. If you already use Office 365 or other business services from Microsoft, you already have Azure AD directory. Otherwise, you can [create a new Azure AD in Partner Center](https://docs.microsoft.com/windows/uwp/publish/associate-azure-ad-with-partner-center#create-a-brand-new-azure-ad-to-associate-with-your-partner-center-account) at no additional charge.

- You must [associate an Azure AD application with your Partner Center account](https://docs.microsoft.com/windows/uwp/monetize/create-and-manage-submissions-using-windows-store-services#associate-an-azure-ad-application-with-your-windows-partner-center-account) and obtain your tenant ID, client ID and key. You need these values to obtain an Azure AD access token, which you will use in calls to the Microsoft Store submission API.

#### How to associate an Azure AD application with your Partner Center account

To use the Microsoft Store submission API, you must associate an Azure AD application with your Partner Center account, retrieve the tenant ID and client ID for the application, and generate a key. The Azure AD application represents the app or service from which you want to call the Partner Center submission API. You need the tenant ID, client ID and key to obtain an Azure AD access token that you pass to the API.

>[!Note]
>You only need to perform this task once. After you have the tenant ID, client ID and key, you can reuse them any time you need to create a new Azure AD access token.

1. In Partner Center, [associate your organization's Partner Center account with your organization's Azure AD directory](https://docs.microsoft.com/windows/uwp/publish/associate-azure-ad-with-partner-center).
1. Next, from the **Users** page in the **Account settings** section of Partner Center, [add the Azure AD application](https://docs.microsoft.com/windows/uwp/publish/add-users-groups-and-azure-ad-applications#add-azure-ad-applications-to-your-partner-center-account) that represents the app or service that you will use to access submissions for your Partner Center account. Make sure you assign this application the **Manager** role. If the application doesn't exist yet in your Azure AD directory, you can [create a new Azure AD application in Partner Center](https://docs.microsoft.com/windows/uwp/publish/add-users-groups-and-azure-ad-applications#create-a-new-azure-ad-application-account-in-your-organizations-directory-and-add-it-to-your-partner-center-account).
1. Return to the **Users** page, click the name of your Azure AD application to go to the application settings, and copy down the **Tenant ID** and **Client ID** values.
1. Click **Add new key**. On the following screen, copy down the **Key** value. You won't be able to access this info again after you leave this page. For more information, see [Manage keys for an Azure AD application](https://docs.microsoft.com/windows/uwp/publish/add-users-groups-and-azure-ad-applications#manage-keys).

### Step 2: Obtain an Azure AD access token

Before you call any of the methods in the Partner Center submission API, you must first obtain an Azure AD access token that you pass to the **Authorization** header of each method in the API. After you obtain an access token, you have 60 minutes to use it before it expires. After the token expires, you can refresh the token so you can continue to use it in future calls to the API.

To obtain the access token, follow the instructions in [Service to Service Calls Using Client Credentials](https://azure.microsoft.com/documentation/articles/active-directory-protocols-oauth-service-to-service/) to send an `HTTP POST` to the `https://login.microsoftonline.com/<tenant_id>/oauth2/token` endpoint. Here is a sample request:

JSONCopy
```Json
POST https://login.microsoftonline.com/<tenant_id>/oauth2/token HTTP/1.1
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded; charset=utf-8

grant_type=client_credentials
&client_id=<your_client_id>
&client_secret=<your_client_secret>
&resource= https://api.partner.microsoft.com
```

For the *tenant_id* value in the `POST URI` and the *client_id* and *client_secret* parameters, specify the tenant ID, client ID and the key for your application that you retrieved from Partner Center in the previous section. For the *resource* parameter, you must specify `https://api.partner.microsoft.com`.

### Step 3: Use the Microsoft Store submission API

After you have an Azure AD access token, you can call methods in the Partner Center submission API. To create or update submissions, you typically call multiple methods in the Partner Center submission API in a specific order. For information about each scenario and the syntax of each method, see the Ingestion API swagger.

https://apidocs.microsoft.com/services/partneringestion/

## Next steps

* Learn how to create an [Create an Azure VM technical asset](create-azure-container-technical-assets.md)
* Learn how to Create an [Azure Container offer](create-azure-container-offer.md)
