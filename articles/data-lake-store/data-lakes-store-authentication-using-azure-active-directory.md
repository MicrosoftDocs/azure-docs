---
title: Authentication in Data Lake Store using Azure Active Directory | Microsoft Docs
description: Learn how to authenticate with Data Lake Store using Azure Active Directory
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
# Authentication with Data Lake Store using Azure Active Directory

Azure Data Lake Store uses Azure Active Directory for authentication. Before authoring an application that works with Azure Data Lake Store or Azure Data Lake Analytics, you must first decide how you would like to authenticate your application with Azure Active Directory (Azure AD). The two main options available are:

* **End-user authentication** - An end-user's Azure credentials are used to authenticate with the Data Lake Store. The application you create to work with Data Lake Store prompts you for these user credentials. As a result, this authentication mechanism is *interactvie* and the application runs in the logged in user's context. 

* **Service-to-service authentication** - Use this option if you want an application to authenticate itself with Data Lake Store. For this scenario, you create an Azure Active Directory (AD) application and use the key from the Azure AD application to authenticate with Data Lake Store. As a result, this authentication mechanism is *non-interactive*. 

The following table illustrates how these two authentication mechanisms are supported for Data Lake Store.

|Authentication option / SDK                   |.NET     |Java     |PowerShell |Azure CLI 2.0 | Python   |REST     |
|----------------------------------------------|---------|---------|-----------|--------------|----------|---------|
|End-user (without MFA)                        |    X    |    X    |    X      |       X      |    X     |    X    |
|End-user (with MFA)                           |    X    |         |    X      |       X      |    X     |    X    |
|Service-to-service (using client key)         |    X    |    X    |    X      |       X      |    X     |    X    |
|Service-to-service (using client certificate) |    X    |    X    |    X      |       X      |    X     |    X    | 


## Authentication using Azure Active Directory

Azure Active Directory provides other options as well to retrieve a token. You can pick from a number of different authentication mechanisms to suit your scenario, for example, an application running in a browser, an application distributed as a desktop application, or a server application running on-premises or in an Azure virtual machine. You can also pick from different types of credentials like passwords, certificates, 2-factor authentication, etc. In addition, Azure Active Directory allows you to synchronize your on-premises Active Directory users with the cloud. For details, see [Authentication Scenarios for Azure Active Directory](../active-directory/develop/active-directory-authentication-scenarios.md).


## Next steps
In this article you created an Azure AD web application and gathered the information you need in your client applications that you author using .NET SDK, Java, Python, REST API, etc. You can now proceed to the following articles that talk about how to use the Azure AD native application to first authenticate with Data Lake Store and then perform other operations on the store.

* [Service-to-service authentication with Data Lake Store using Java](data-lake-store-service-to-service-authenticate-java.md)
* [Service-to-service authentication with Data Lake Store using .NET SDK](data-lake-store-service-to-service-authenticate-net-sdk.md)
* [Service-to-service authentication with Data Lake Store using Python](data-lake-store-service-to-service-authenticate-python.md)
* [Service-to-service authentication with Data Lake Store using REST API](data-lake-store-service-to-service-authenticate-rest-api.md)


