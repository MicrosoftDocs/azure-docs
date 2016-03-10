<properties
   pageTitle="Resource Manager REST APIs| Microsoft Azure"
   description="An overview of the Resource Manager REST APIs authentication and usage examples"
   services="azure-resource-manager"
   documentationCenter="na"
   authors="navalev;krist00fer;"
   manager=""
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="03/10/2016"
   ms.author="navale;tomfitz;"/>
   
# Resource Manager REST APIs
Behind every call to Azure Resource Manager, behind every deployed template, behind every configured storage account there is one or 
several calls to the Azure Resource Manager’s RESTful API. 
This section is devoted to those APIs and how you can call them without using any SDK at all. This can be very useful if you want full 
control of all requests to Azure or if the SDK for your prefered language is not available or doesn’t support the operations you 
want to perform.

This article will not go through every API that is exposed in Azure, but will rather use some as an example how you go ahead and
connect to them. If you understand the basics you can then go ahead and read the [Azure Resource Manager REST API Reference](https://msdn.microsoft.com/en-us/library/azure/mt420159.aspx) to find 
detailed information on how to use the rest of the APIs.

## Authentication
Authentication for ARM is handled by Azure Active Directory (AD). In order to connect to any API you first need to authenticate with 
Azure AD to receive an authentication token that you can pass on to every request. As we are describing a pure call directly to the REST
APIs, we will also assume that you don’t want to authenticate with a normal username password where a pop-up-screen might prompt you 
for username and password and perhaps even other authentication mechanisms used in two factor authentication scenarios. 
Therefore, we will create what is called an Azure AD Application and a Service Principal that will be used to login with. 
But remember that Azure AD support several authentication procedures and all of them could be used to retrieve that authentication token that we need for subsequent API requests.
Follow [Create Azure AD Application and Service Principle](https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-service-principal-portal/) for step by step instructions.

### Generate an Access Token
Authentication against Azure AD is done by calling out to Azure AD, located at login.microsoftonline.com. 
In order to authenticate you need to have the following information:

* Azure AD Tenant ID (the name of that Azure AD you are using to login, often the same as your company but not necessary)
* Application ID (taken during the Azure AD application creation step)
* Password (that you selected while creating the Azure AD Application)

In the below HTTP request make sure to replace "Azure AD Tenant ID", "Application ID" and "Password" with the correct values.

The following generic HTTP Request:
```HTTP
POST /<Azure AD Tenant ID>.onmicrosoft.com/oauth2/token?api-version=1.0 HTTP/1.1 HTTP/1.1
Host: login.microsoftonline.com
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&resource=https%3A%2F%2Fmanagement.core.windows.net%2F&client_id=<Application ID>&client_secret=<Password>
```

... will (if authentication succeeds) result in a similar response to this:
```json
{
  "token_type": "Bearer",
  "expires_in": "3600",
  "expires_on": "1448199959",
  "not_before": "1448196059",
  "resource": "https://management.core.windows.net/",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhb...86U3JI_0InPUk_lZqWvKiEWsayA"
}
```
(The access_token in the above response have been shortened to increase readability)

The response contains an Access Token, information about how long that token is valid and inforamtion about what resource you can use that token for.

As you can see from the above HTTP Result, the token is valid for a specific period of time during which you should cach and re-use that same tooken. Even if it would be possible to authenticate against Azure AD for each API call, such a filosofi would be highly inefficient.


