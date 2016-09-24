<properties
   pageTitle="Authenticate with Data Lake Store using Active Directory | Microsoft Azure"
   description="Learn how to authenticate with Data Lake Store using Active Directory"
   services="data-lake-store"
   documentationCenter=""
   authors="nitinme"
   manager="jhubbard"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="09/26/2016"
   ms.author="nitinme"/>

# Authenticate with Data Lake Store using Azure Active Directory

Azure Data Lake Store uses Azure Active Directory for authentication. Before authoring an application that works with Azure Data Lake Store or Azure Data Lake Analytics, you must first decide how you would like to authenticate your application with Azure Active Directory (Azure AD). The two main options available are:

* End-user authentication, and 
* Service-to-service authentication. 

Both these options result in your application being provided with an OAuth 2.0 token, which gets attached to each request made to Azure Data Lake Store or Azure Data Lake Analytics.


## Prerequisites

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* Your subscription ID. You can retrieve it from the Azure Portal. For example, it is available from the Data Lake Store account blade.

	![Get subscription ID](./media/data-lake-store-authenticate-using-active-directory/get-subscription-id.png)

* Your Azure AD domain name. You can retrieve it by hovering the mouse in the top-right corner of the Azure Portal. 

	![Get AAD domain](./media/data-lake-store-authenticate-using-active-directory/get-aad-domain.png)

## End-user authentication

This is the recommended approach if you want an end-user to log in to your application via Azure AD. Your application will be able to access Azure resources with the same level of access as the end-user that logged in. Your end-user will need to provide their credentials periodically in order for your application to maintain access.

The result of having the end-user log in is that your application is given an access token and a refresh token. The access token gets attached to each request made to Data Lake Store or Data Lake Analytics, and it is valid for one hour by default. The refresh token can be used to obtain a new access token, and it is valid for up to two weeks by default, if used regularly. You can use two different approaches for end-user log in.

### Using the OAuth 2.0 pop-up

Your application can trigger an OAuth 2.0 authorization pop-up, in which the end-user can enter their credentials. This pop-up also works with the Azure AD Two-factor Authentication (2FA) process, if required. 

>[AZURE.NOTE] This method is not yet supported in the Azure AD Authentication Library (ADAL) for Python or Java.

### Directly passing in user credentials

Your application can directly provide user credentials to Azure AD. This method only works with organizational ID user accounts; it is not compatible with personal / “live ID” user accounts, including those ending in @outlook.com or @live.com. Furthermore, this method is not compatible with user accounts that require Azure AD Two-factor Authentication (2FA).

### What do I need to use this approach?

* Azure AD domain name (already listed in the prerequisite of this article).

* Azure AD **native client application**. 

* Client ID for the Azure AD native client application. 

For instructions on how to create an Azure AD application and retrieve the client ID, see [Create an Active Directory Application](../resource-group-create-service-principal-portal.md#create-an-active-directory-application). 

>[AZURE.NOTE] The instructions in the above links are for an Azure AD web application. However, the steps are exactly the same even if you chose to create a native client application instead.

## Service-to-service authentication

This is the recommended approach if you want your application to automatically authenticate with Azure AD, without the need for an end-user to provide their credentials. Your application will be able to authenticate itself for as long as its credentials are valid, which can be customized to be in the order of years.

### What do I need to use this approach?

* Azure AD domain name (already listed in the prerequisite of this article).

* Azure AD **web application**.

* Client ID for the Azure AD web application.

	>[AZURE.NOTE] For instructions on how to create an Azure AD application and retrieve the client ID, see [Create an Active Directory Application](../resource-group-create-service-principal-portal.md#create-an-active-directory-application).
	
* Configure the Azure AD web application to either use the client secret or a certificate. To create a web application using a certificate, see [Create a service principal with certificate](../resource-group-authenticate-service-principal.md#create-service-principal-with-certificate).

* Enable access for the Azure AD web application on the the Data Lake Store file/folder or the Data Lake Analytics account that you want to work with. For instructions on how to provide access to an Azure AD application to a Data Lake Store file/folder, see [Assign users or security group as ACLs to the Azure Data Lake Store file system](data-lake-store-secure-data.md#filepermissions).

## Next steps

- [Get started with Azure Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
- [Get started with Azure Data Lake Store using Java SDK](data-lake-store-get-started-java-sdk.md)
