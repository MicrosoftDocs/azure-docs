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

#### Step 1: Obtain an Azure Active Directory token.
The Data Lake Store SDK provides convenient methods that let you manage the security tokens needed to talk to the Data Lake Store account. However, the SDK does not mandate that only these methods be used. You can use any other means of obtaining token as well, like using the [Azure Active Directory SDK](https://github.com/AzureAD/azure-activedirectory-library-for-java), or your own custom code.

To use the Data Lake Store SDK to obtain token for the Active Directory Web application you created earlier, use one of the subclasses of `AccessTokenProvider` (the example below uses `ClientCredsTokenProvider`). The token provider caches the creds used to obtain the token in memory, and automatically renews the token if it is about to expire. It is possible to create your own subclasses of `AccessTokenProvider` so tokens are obtained by your customer code, but for now let's just use the one provided in the SDK.

Replace **FILL-IN-HERE** with the actual values for the Azure Active Directory Web application.

    private static String clientId = "FILL-IN-HERE";
    private static String authTokenEndpoint = "FILL-IN-HERE";
    private static String clientKey = "FILL-IN-HERE";

    AccessTokenProvider provider = new ClientCredsTokenProvider(authTokenEndpoint, clientId, clientKey);   

## Next steps
In this article you created an Azure AD web application and gathered the information you need in your client applications that you author using .NET SDK, Java SDK, etc. You can now proceed to the following articles that talk about how to use the Azure AD web application to first authenticate with Data Lake Store and then perform other operations on the store.

* [Get started with Azure Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
* [Get started with Azure Data Lake Store using Java SDK](data-lake-store-get-started-java-sdk.md)

This article walked you through the basic steps needed to get a user principal up and running for your application. You can look at the following articles to get further information:
* [Use PowerShell to create service principal](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal)
* [Use certificate authentication for service principal authentication](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal#create-service-principal-with-certificate)
* [Other methods to authenticate to Azure AD](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-authentication-scenarios)


