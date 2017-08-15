---
title: 'End-user authentication: Data Lake Store with Azure Active Directory | Microsoft Docs'
description: Learn how to achieve end-user authentication with Data Lake Store using Azure Active Directory
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: ec586ecd-1b42-459e-b600-fadbb7b80a9b
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/21/2017
ms.author: nitinme

---
# End-user authentication with Data Lake Store using .NET SDK
> [!div class="op_single_selector"]
> * [Service-to-service authentication](data-lake-store-authenticate-using-active-directory.md)
> * [End-user authentication](data-lake-store-end-user-authenticate-using-active-directory.md)
> 
> 

Azure Data Lake Store uses Azure Active Directory for authentication. Before authoring an application that works with Azure Data Lake Store or Azure Data Lake Analytics, you must first decide how you would like to authenticate your application with Azure Active Directory (Azure AD). The two main options available are:

* End-user authentication (this article)
* Service-to-service authentication

Both these options result in your application being provided with an OAuth 2.0 token, which gets attached to each request made to Azure Data Lake Store or Azure Data Lake Analytics.

This article talks about how create an **Azure AD native application for end-user authentication**. For instructions on Azure AD application configuration for service-to-service authentication see [Service-to-service authentication with Data Lake Store using Azure Active Directory](data-lake-store-authenticate-using-active-directory.md).

## Prerequisites
* **Visual Studio 2013, 2015, or 2017**. The instructions below use Visual Studio 2015 Update 2.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Azure Data Lake Store account**. For instructions on how to create an account, see [Get started with Azure Data Lake Store](data-lake-store-get-started-portal.md)

* **Create an Azure Active Directory Application**. You use the Azure AD application to authenticate the Data Lake Store application with Azure AD. There are different approaches to authenticate with Azure AD, which are **end-user authentication** or **service-to-service authentication**. For instructions and more information on how to authenticate, see [End-user authentication](data-lake-store-end-user-authenticate-using-active-directory.md) or [Service-to-service authentication](data-lake-store-authenticate-using-active-directory.md).

## End-user authentication
This is the recommended approach if you want an end-user to log in to your application via Azure AD. Your application will be able to access Azure resources with the same level of access as the end-user that logged in. Your end-user will need to provide their credentials periodically in order for your application to maintain access.

The result of having the end-user log in is that your application is given an access token and a refresh token. The access token gets attached to each request made to Data Lake Store or Data Lake Analytics, and it is valid for one hour by default. The refresh token can be used to obtain a new access token, and it is valid for up to two weeks by default, if used regularly. You can use two different approaches for end-user log in.

### Using the OAuth 2.0 pop-up
Your application can trigger an OAuth 2.0 authorization pop-up, in which the end-user can enter their credentials. This pop-up also works with the Azure AD Two-factor Authentication (2FA) process, if required. 

> [!NOTE]
> This method is not yet supported in the Azure AD Authentication Library (ADAL) for Python or Java.
> 
> 

### Directly passing in user credentials
Your application can directly provide user credentials to Azure AD. This method only works with organizational ID user accounts; it is not compatible with personal / “live ID” user accounts, including those ending in @outlook.com or @live.com. Furthermore, this method is not compatible with user accounts that require Azure AD Two-factor Authentication (2FA).

### If you are using end-user authentication (recommended for this tutorial)

Use this with an existing Azure AD native application to authenticate your application **interactively**, which means you will be prompted to enter your Azure credentials.

For ease of use, the snippet below uses default values for client ID and redirect URI that will work with any Azure subscription. To help you complete this tutorial faster, we recommend you use this approach. In the snippet below, just provide the value for your tenant ID. You can retrieve it using the instructions provided at [Create an Active Directory Application](data-lake-store-end-user-authenticate-using-active-directory.md).

    // User login via interactive popup
    // Use the client ID of an existing AAD Web application.
    SynchronizationContext.SetSynchronizationContext(new SynchronizationContext());
    var tenant_id = "<AAD_tenant_id>"; // Replace this string with the user's Azure Active Directory tenant ID
    var nativeClientApp_clientId = "1950a258-227b-4e31-a9cf-717495945fc2";
    var activeDirectoryClientSettings = ActiveDirectoryClientSettings.UsePromptOnly(nativeClientApp_clientId, new Uri("urn:ietf:wg:oauth:2.0:oob"));
    var creds = UserTokenProvider.LoginWithPromptAsync(tenant_id, activeDirectoryClientSettings).Result;

A couple of things to know about this snippet above:

* To help you complete the tutorial faster, this snippet uses an an Azure AD domain and client ID that is available by default for all Azure subscriptions. So, you can **use this snippet as-is in your application**.
* However, if you do want to use your own Azure AD domain and application client ID, you must create an Azure AD native application and then use the Azure AD tenant ID, client ID, and redirect URI for the application you created. See [Create an Active Directory Application for end-user authentication with Data Lake Store](data-lake-store-end-user-authenticate-using-active-directory.md) for instructions.

### What do I need to use this approach?
* Azure AD domain name. This is already listed in the prerequisite of this article.
* Azure AD **native application**
* Application ID for the Azure AD native application
* Redirect URI for the Azure AD native application
* Set delegated permissions



   
## Next steps
In this article you created an Azure AD native application and gathered the information you need in your client applications that you author using .NET SDK, Java SDK, REST API, etc. You can now proceed to the following articles that talk about how to use the Azure AD web application to first authenticate with Data Lake Store and then perform other operations on the store.

* [Get started with Azure Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
* [Get started with Azure Data Lake Store using Java SDK](data-lake-store-get-started-java-sdk.md)
* [Get started with Azure Data Lake Store using REST API](data-lake-store-get-started-rest-api.md)

