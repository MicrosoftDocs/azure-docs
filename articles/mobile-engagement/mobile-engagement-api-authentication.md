---
title: Authenticate with Mobile Engagement REST APIs
description: Describes how to authenticate with Azure Mobile Engagement REST APIs
services: mobile-engagement
documentationcenter: mobile
author: piyushjo
manager: erikre
editor: ''

ms.assetid: da82cb36-957a-4e19-a805-b44733cf6597
ms.service: mobile-engagement
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: mobile-multiple
ms.workload: mobile
ms.date: 10/05/2016
ms.author: wesmc;ricksal

---
# Authenticate with Mobile Engagement REST APIs
> [!IMPORTANT]
> Azure Mobile Engagement retires on 3/31/2018. This page will be deleted shortly after.
> 

## Overview

This document describes how to get a valid Azure Active Directory (Azure AD) OAuth token to authenticate with the Mobile Engagement REST APIs.

This procedure assumes that you have a valid Azure subscription and have created a Mobile Engagement app by using one of the [developer tutorials](mobile-engagement-windows-store-dotnet-get-started.md).

## Authentication

A Microsoft Azure Active Directory-based OAuth token is used for authentication. 

To authenticate an API request, an authorization header must be added to every request. The authorization header is in the following format:

    Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGmJlNmV2ZWJPamg2TTNXR1E...

> [!NOTE]
> Azure Active Directory tokens expire in one hour.
> 
> 

There are several ways to get a token. Because the APIs are called from a cloud service, you want to use an API key. An API key in Azure terminology is called a Service Principal password. The following procedure describes one way to set it up manually.

### One-time setup (using a script)

To perform the setup by using a PowerShell script, take the steps in the following instructions. A PowerShell script requires the least amount of time for setup but uses the most permissible defaults. 

Optionally, you can also follow the instructions in the [manual setup](mobile-engagement-api-authentication-manual.md) for doing this from the Azure portal directly. When you set up from the Azure portal, you can do a more detailed configuration.

1. Get the latest version of Azure PowerShell by [downloading it](http://aka.ms/webpi-azps). For more information about the download instructions, see [this overview](/powershell/azure/overview).

2. After PowerShell is installed, use the following commands to ensure that you have the **Azure module** installed:

    a. Make sure the Azure PowerShell module is available in the list of available modules.

        Get-Module –ListAvailable

    ![Available Azure modules][1]

    b. If you don't find the Azure PowerShell module in the previous list, then you need to run:

        Import-Module Azure
3. Sign in to Azure Resource Manager from PowerShell by running the following command. Provide the user name and password for your Azure account: 

        Connect-AzureRmAccount
4. If you have multiple subscriptions, take the following steps:

    a. Get a list of all your subscriptions. Then copy the **SubscriptionId** of the subscription that you want to use. Make sure this subscription has the Mobile Engagement app. You are going to use this app to interact with the APIs. 

        Get-AzureRmSubscription

    b. Run the following command. Provide the **SubscriptionId** to configure the subscription that you're going to use:

        Select-AzureRmSubscription –SubscriptionId <subscriptionId>
5. Copy the text for the [New-AzureRmServicePrincipalOwner.ps1](https://raw.githubusercontent.com/matt-gibbs/azbits/master/src/New-AzureRmServicePrincipalOwner.ps1) script to your local machine. Then save it as a PowerShell cmdlet (for example, `APIAuth.ps1`), and run it.

         `.\APIAuth.ps1`.

6. The script asks you to provide an input for **principalName**. Provide a suitable name that you want to use for your Active Directory application (for example, APIAuth). 

7. After the script finishes running, it displays the following four values. Be sure to copy them, because you need them to authenticate programmatically with Active Directory: 

   - **TenantId**
   - **SubscriptionId**
   - **ApplicationId**
   - **Secret**

   You use TenantId as `{TENANT_ID}`, ApplicationId as `{CLIENT_ID}` and Secret as `{CLIENT_SECRET}`.

   > [!NOTE]
   > Your default security policy might block you from running PowerShell scripts. If so, use the following command to temporarily configure your execution policy to allow script execution:
   > 
   > Set-ExecutionPolicy RemoteSigned
8. Here is how the set of PowerShell cmdlets looks.
    ![PowerShell cmdlets][3]
9. In the Azure portal, go to Active Directory, select **App registrations**, and then search for your app to make sure it exists.
    ![Search for your app][4]

### Steps to get a valid token

1. Call the API with the following parameters. Make sure to replace **TENANT\_ID**, **CLIENT\_ID**, and **CLIENT\_SECRET**:
   
   * **Request URL** as `https://login.microsoftonline.com/{TENANT_ID}/oauth2/token`

   * **HTTP Content-Type header** as `application/x-www-form-urlencoded`
   
   * **HTTP Request Body** as `grant_type=client\_credentials&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&resource=https%3A%2F%2Fmanagement.core.windows.net%2F`
     
    The following is an example request:
    ```
    POST /{TENANT_ID}/oauth2/token HTTP/1.1
    Host: login.microsoftonline.com
    Content-Type: application/x-www-form-urlencoded
    grant_type=client_credentials&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&reso
    urce=https%3A%2F%2Fmanagement.core.windows.net%2F
    ```
    Following is an example response:
    ```
    HTTP/1.1 200 OK
    Content-Type: application/json; charset=utf-8
    Content-Length: 1234

    {"token_type":"Bearer","expires_in":"3599","expires_on":"1445395811","not_before":"144
    5391911","resource":"https://management.core.windows.net/","access_token":{ACCESS_TOKEN}}
    ```
     This example includes the URL encoding of the POST parameters, in which `resource` value is actually `https://management.core.windows.net/`. Be careful to also URL-encode `{CLIENT_SECRET}`, because it might contain special characters.

     > [!NOTE]
     > For testing, you can use an HTTP client tool such as [Fiddler](http://www.telerik.com/fiddler) or [Chrome Postman extension](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop). 
     > 
     > 
2. Now in every API call, include the authorization request header:
   
        Authorization: Bearer {ACCESS_TOKEN}
   
    If your request returns a 401 status code, check the response body. It might tell you the token is expired. In that case, get a new token.

## Use the APIs
Now that you have a valid token, you are ready to make the API calls.

1. In each API request, you need to pass a valid, unexpired token. You obtained the unexpired token in the previous section.

2. Plug in some parameters to the request URI that identifies your application. The request URI looks like the following code:
   
        https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/
        providers/Microsoft.MobileEngagement/appcollections/{app-collection}/apps/{app-resource-name}/
   
    To get the parameters, select your application name. Then select  **Dashboard**. You see a page with all three parameters, as follows:
   
   * **1** `{subscription-id}`
   * **2** `{app-collection}`
   * **3** `{app-resource-name}`
   * **4** Your Resource Group name is going to be **MobileEngagement** unless you created a new one. 

> [!NOTE]
> Ignore the API root address, because it was for the previous APIs.
> 
> If you created the app by using the Azure portal, then you need to use the Application Resource name, which is different from the App Name itself. If you created the app in the Azure portal, then you should use the App Name. (There is no differentiation between the Application Resource Name and the App Name for apps that are created in the new portal.)
> 
> 

<!-- Images -->
[1]: ./media/mobile-engagement-api-authentication/azure-module.png
[2]: ./media/mobile-engagement-api-authentication/mobile-engagement-api-uri-params.png
[3]: ./media/mobile-engagement-api-authentication/ps-cmdlets.png
[4]: ./media/mobile-engagement-api-authentication/search-app.png



