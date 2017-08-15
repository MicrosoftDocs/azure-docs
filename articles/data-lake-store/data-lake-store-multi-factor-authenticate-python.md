---
title: 'Service-to-service authentication: Data Lake Store with Azure Active Directory | Microsoft Docs'
description: Learn how to achieve service-to-service authentication with Data Lake Store using Azure Active Directory
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: 820b7c5d-4863-4225-9bd1-df4d8f515537
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/21/2017
ms.author: nitinme

---
# Service-to-service authentication with Data Lake Store using Azure Active Directory
> [!div class="op_single_selector"]
> * [Service-to-service authentication](data-lake-store-authenticate-using-active-directory.md)
> * [End-user authentication](data-lake-store-end-user-authenticate-using-active-directory.md)
> 
> 

Azure Data Lake Store uses Azure Active Directory for authentication. Before authoring an application that works with Azure Data Lake Store or Azure Data Lake Analytics, you must first decide how you would like to authenticate your application with Azure Active Directory (Azure AD). The two main options available are:

* End-user authentication 
* Service-to-service authentication (this article) 

Both these options result in your application being provided with an OAuth 2.0 token, which gets attached to each request made to Azure Data Lake Store or Azure Data Lake Analytics.

This article talks about how create an **Azure AD web application for service-to-service authentication**. For instructions on Azure AD application configuration for end-user authentication see [End-user authentication with Data Lake Store using Azure Active Directory](data-lake-store-end-user-authenticate-using-active-directory.md).

## Prerequisites
* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

### Multi-factor authentication for account management

Use this to authenticate with Azure AD for account management operations (create/delete Data Lake Store account, etc.). The following snippet can be used to authenticate your application using multi-factor authentication. Use this with an existing Azure AD "Web App" application.

	authority_host_url = "https://login.microsoftonline.com"
	tenant = "FILL-IN-HERE"
	authority_url = authority_host_url + '/' + tenant
	client_id = 'FILL-IN-HERE'
	redirect = 'urn:ietf:wg:oauth:2.0:oob'
	RESOURCE = 'https://management.core.windows.net/'
	
	context = adal.AuthenticationContext(authority_url)
	code = context.acquire_user_code(RESOURCE, client_id)
	print(code['message'])
	mgmt_token = context.acquire_token_with_device_code(RESOURCE, code, client_id)
	credentials = AADTokenCredentials(mgmt_token, client_id)

### Multi-factor authentication for filesystem management

Use this to authenticate with Azure AD for filesystem operations (create folder, upload file, etc.). The following snippet can be used to authenticate your application using multi-factor authentication. Use this with an existing Azure AD "Web App" application.

	token = lib.auth(tenant_id='FILL-IN-HERE')  

## Next steps
In this article you created an Azure AD web application and gathered the information you need in your client applications that you author using .NET SDK, Java SDK, etc. You can now proceed to the following articles that talk about how to use the Azure AD web application to first authenticate with Data Lake Store and then perform other operations on the store.

* [Get started with Azure Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
* [Get started with Azure Data Lake Store using Java SDK](data-lake-store-get-started-java-sdk.md)

This article walked you through the basic steps needed to get a user principal up and running for your application. You can look at the following articles to get further information:
* [Use PowerShell to create service principal](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal)
* [Use certificate authentication for service principal authentication](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal#create-service-principal-with-certificate)
* [Other methods to authenticate to Azure AD](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-authentication-scenarios)


