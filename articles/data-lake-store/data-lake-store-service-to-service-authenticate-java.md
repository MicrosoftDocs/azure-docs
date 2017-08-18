---
title: 'Service-to-service authentication: Java with Data Lake Store using Azure Active Directory | Microsoft Docs'
description: Learn how to achieve service-to-service authentication with Data Lake Store using Azure Active Directory with Java
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 08/31/2017
ms.author: nitinme

---
# Service-to-service authentication with Data Lake Store using Java
> [!div class="op_single_selector"]
> * [Using Java](data-lake-store-service-to-service-authenticate-java.md)
> * [Using .NET SDK](data-lake-store-service-to-service-authenticate-net-sdk.md)
> * [Using Python](data-lake-store-service-to-service-authenticate-python.md)
> * [Using REST API](data-lake-store-service-to-service-authenticate-rest-api.md)
> 
>  

In this article, you learn about how to use the REST API to do service-to-service authentication with Azure Data Lake Store. End-user authentication with Data Lake Store using Java SDK is not supported.

## Prerequisites
* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Create an Azure Active Directory "Web" Application**. You must have completed the steps in [Service-to-service authentication with Data Lake Store using Azure Active Directory](data-lake-store-service-to-service-authenticate-using-active-directory.md).

* (Optional) And IDE like [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) or [Eclipse](https://www.eclipse.org/downloads/) or similar.

#### Service-to-service authentication
Use the snippet below in your Java application to obtain token for the Active Directory Web application you created earlier using one of the subclasses of `AccessTokenProvider` (the example below uses `ClientCredsTokenProvider`). The token provider caches the creds used to obtain the token in memory, and automatically renews the token if it is about to expire. It is possible to create your own subclasses of `AccessTokenProvider` so tokens are obtained by your customer code, but for now let's just use the one provided in the SDK.

Replace **FILL-IN-HERE** with the actual values for the Azure Active Directory Web application.

    private static String clientId = "FILL-IN-HERE";
    private static String authTokenEndpoint = "FILL-IN-HERE";
    private static String clientKey = "FILL-IN-HERE";

    AccessTokenProvider provider = new ClientCredsTokenProvider(authTokenEndpoint, clientId, clientKey);   

The Data Lake Store SDK provides convenient methods that let you manage the security tokens needed to talk to the Data Lake Store account. However, the SDK does not mandate that only these methods be used. You can use any other means of obtaining token as well, like using the [Azure Active Directory SDK](https://github.com/AzureAD/azure-activedirectory-library-for-java), or your own custom code.

## Next steps
In this article you learned how to use service-to-service authentication to authenticate with Azure Data Lake Store using Java SDK. You can now look at the following articles that talk about how to use the Java SDK to work with Azure Data Lake Store.

* [Account management operations on Data Lake Store using REST API](data-lake-store-get-started-rest-api.md)
* [Data operations on Data Lake Store using REST API](data-lake-store-data-operations-rest-api.md)


