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
# End-user authentication with Data Lake Store using Azure Active Directory
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
* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* Your subscription ID. You can retrieve it from the Azure Portal. For example, it is available from the Data Lake Store account blade.
  
    ![Get subscription ID](./media/data-lake-store-end-user-authenticate-using-active-directory/get-subscription-id.png)

* Your Azure AD domain name. You can retrieve it by hovering the mouse in the top-right corner of the Azure Portal. From the screenshot below, the domain name is **contoso.onmicrosoft.com**, and the GUID within brackets is the tenant ID. 
  
    ![Get AAD domain](./media/data-lake-store-end-user-authenticate-using-active-directory/get-aad-domain.png)

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

### What do I need to use this approach?
* Azure AD domain name. This is already listed in the prerequisite of this article.
* Azure AD **native application**
* Application ID for the Azure AD native application
* Redirect URI for the Azure AD native application
* Set delegated permissions


### End-user authentication for account management

Use this to authenticate with Azure AD for account management operations (create/delete Data Lake Store account, etc.). You must provide username and password for an Azure AD user. Note that the user should not be configured for multi-factor authentication.

    user = input('Enter the user to authenticate with that has permission to subscription: ')
	password = getpass.getpass()

	credentials = UserPassCredentials(user, password)

### End-user authentication for filesystem operations

Use this to authenticate with Azure AD for filesystem operations (create folder, upload file, etc.). Use this with an existing Azure AD **native client** application. The Azure AD user you provide credentials for should not be configured for multi-factor authentication.

	tenant_id = 'FILL-IN-HERE'
	client_id = 'FILL-IN-HERE'
	user = input('Enter the user to authenticate with that has permission to subscription: ')
	password = getpass.getpass()

	token = lib.auth(tenant_id, user, password, client_id)
   
## Next steps
In this article you created an Azure AD native application and gathered the information you need in your client applications that you author using .NET SDK, Java SDK, REST API, etc. You can now proceed to the following articles that talk about how to use the Azure AD web application to first authenticate with Data Lake Store and then perform other operations on the store.

* [Get started with Azure Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
* [Get started with Azure Data Lake Store using Java SDK](data-lake-store-get-started-java-sdk.md)
* [Get started with Azure Data Lake Store using REST API](data-lake-store-get-started-rest-api.md)

