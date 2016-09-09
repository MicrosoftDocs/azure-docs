<properties
   pageTitle="Resource Manager REST APIs| Microsoft Azure"
   description="An overview of the Resource Manager REST APIs authentication and usage examples"
   services="azure-resource-manager"
   documentationCenter="na"
   authors="navalev"
   manager=""
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/23/2016"
   ms.author="navale;tomfitz;"/>
   
# Resource Manager REST APIs
Behind every call to Azure Resource Manager, behind every deployed template, behind every configured storage account there is one or 
several calls to the Azure Resource Manager’s RESTful API. 
This topic is devoted to those APIs and how you can call them without using any SDK at all. This can be very useful if you want full 
control of all requests to Azure or if the SDK for your preferred language is not available or doesn’t support the operations you 
want to perform.

This article will not go through every API that is exposed in Azure, but will rather use some as an example how you go ahead and
connect to them. If you understand the basics you can then go ahead and read the [Azure Resource Manager REST API Reference](https://msdn.microsoft.com/library/azure/dn790568.aspx) to find 
detailed information on how to use the rest of the APIs.

## Authentication
Authentication for ARM is handled by Azure Active Directory (AD). In order to connect to any API you first need to authenticate with 
Azure AD to receive an authentication token that you can pass on to every request. As we are describing a pure call directly to the REST
APIs, we will also assume that you don’t want to authenticate with a normal username password where a pop-up-screen might prompt you 
for username and password and perhaps even other authentication mechanisms used in two factor authentication scenarios. 
Therefore, we will create what is called an Azure AD Application and a Service Principal that will be used to login with. 
But remember that Azure AD support several authentication procedures and all of them could be used to retrieve that authentication token that we need for subsequent API requests.
Follow [Create Azure AD Application and Service Principle](./resource-group-create-service-principal-portal.md) for step by step instructions.

### Generating an Access Token 
Authentication against Azure AD is done by calling out to Azure AD, located at login.microsoftonline.com. 
In order to authenticate you need to have the following information:

* Azure AD Tenant ID (the name of that Azure AD you are using to login, often the same as your company but not necessary)
* Application ID (taken during the Azure AD application creation step)
* Password (that you selected while creating the Azure AD Application)

In the below HTTP request make sure to replace "Azure AD Tenant ID", "Application ID" and "Password" with the correct values.

**Generic HTTP Request:**

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

**Generating access token using Bash:**

```console
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=client_credentials&resource=https://management.core.windows.net&client_id=<application id>&client_secret=<password you selected for authentication>" https://login.microsoftonline.com/microsoft.onmicrosoft.com/oauth2/token?api-version=1.0
```

**Generating access token using PowerShell:**

```powershell
Invoke-RestMethod -Uri https://login.microsoftonline.com/microsoft.onmicrosoft.com/oauth2/token?api-version=1.0 -Method Post
 -Body @{"grant_type" = "client_credentials"; "resource" = "https://management.core.windows.net/"; "client_id" = "<application id>"; "client_secret" = "<password you selected for authentication>" }
```

The response contains an Access Token, information about how long that token is valid and information about what resource you can use that token for.
The access token you received in the previous HTTP call must be passed in for all request to the ARM API as a header named "Authorization" with the value "Bearer YOUR_ACCESS_TOKEN". Notice the space between "Bearer" and your Access Token.

As you can see from the above HTTP Result, the token is valid for a specific period of time during which you should cache and re-use that same token. Even if it is possible to authenticate against Azure AD for each API call, it would be highly inefficient.

## Calling ARM REST APIs

[Azure Resource Manager REST APIs are documented here](https://msdn.microsoft.com/library/azure/dn790568.aspx) and it's out of scope for this tutorial to document the usage of each and every. This documentation will only use a few APIs to explain the basic usage of the APIs and after that we refer you to the official documentation.

### List all subscriptions

One of the simplest operations you can do is to list the available subscriptions that you can access. In the below request you can see how the Access Token is passed in as a header.

(Replace YOUR_ACCESS_TOKEN with your actual Access Token.)

```HTTP
GET /subscriptions?api-version=2015-01-01 HTTP/1.1
Host: management.azure.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

... and as a result, you'll get a list of subscriptions that this Service Principal is allowed to access

(Subscription IDs below have been shortened for readability)

```json
{
  "value": [
    {
      "id": "/subscriptions/3a8555...555995",
      "subscriptionId": "3a8555...555995",
      "displayName": "Azure Subscription",
      "state": "Enabled",
      "subscriptionPolicies": {
        "locationPlacementId": "Internal_2014-09-01",
        "quotaId": "Internal_2014-09-01"
      }
    }
  ]
}
```

### List all resource groups in a specific subscription

All resources available with the ARM APIs are nested inside a Resource Group. We are going to query ARM for existing Resource Groups in our subscription using the below HTTP GET Request. Notice how the Subscription ID is passed in as part of the URL this time.

(Replace YOUR_ACCESS_TOKEN and SUBSCRIPTION_ID with your actual Access Token and Subscription ID)

```HTTP
GET /subscriptions/SUBSCRIPTION_ID/resourcegroups?api-version=2015-01-01 HTTP/1.1
Host: management.azure.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

The response you get will depend whether you have any resource groups defined and if so, how many.

(Subscription IDs below have been shortened for readability)

```json
{
    "value": [
        {
            "id": "/subscriptions/3a8555...555995/resourceGroups/myfirstresourcegroup",
            "name": "myfirstresourcegroup",
            "location": "eastus",
            "properties": {
                "provisioningState": "Succeeded"
            }
        },
        {
            "id": "/subscriptions/3a8555...555995/resourceGroups/mysecondresourcegroup",
            "name": "mysecondresourcegroup",
            "location": "northeurope",
            "tags": {
                "tagname1": "My first tag"
            },
            "properties": {
                "provisioningState": "Succeeded"
            }
        }
    ]
}
```

### Create a resource group

So far we've only been querying the ARM APIs for information, it's time we create some resources instead and let's start by the simplest of them all, a resource group. The following HTTP request creates a new Resource Group in a region/location of your choice and adds one or more tags to it (the sample below actually only adds one tag).

(Replace YOUR_ACCESS_TOKEN, SUBSCRIPTION_ID, RESOURCE_GROUP_NAME with your actual Access Token, Subscription ID and name of the Resource Group you want to create)

```HTTP
PUT /subscriptions/SUBSCRIPTION_ID/resourcegroups/RESOURCE_GROUP_NAME?api-version=2015-01-01 HTTP/1.1
Host: management.azure.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "location": "northeurope",
  "tags": {
    "tagname1": "test-tag"
  }
}
```

If successful, you'll get a similar response to this

```json
{
  "id": "/subscriptions/3a8555...555995/resourceGroups/RESOURCE_GROUP_NAME",
  "name": "RESOURCE_GROUP_NAME",
  "location": "northeurope",
  "tags": {
    "tagname1": "test-tag"
  },
  "properties": {
    "provisioningState": "Succeeded"
  }
}
```

You've successfully created a Resource Group in Azure. Congratulations!

### Deploy resources to a Resource Group using an ARM Template

With ARM, you can deploy your resources using ARM Templates. An ARM Template defines several resources and their dependencies. For this section we will just assume you are familiar with ARM Templates and we will just show you how to make the API call to start deployment of one. A detailed documentation of ARM Templates can be found here.

Deployment of an ARM template doesn't differ much to how you call other APIs. One important aspect is that deployment of a template can take quite a long time, depending on what's inside of the template, and the API call will just return and it's up to you as developer to query for status of the deployment in order to find out when the deployment is done.

For this example, we'll use a publicly exposed ARM Template available on [GitHub](https://github.com/Azure/azure-quickstart-templates). The template we are going to use will deploy a Linux VM to the West US region. Even though this template will have the template available in a public repository like GitHub, you can also select to pass the full template as part of the request. Note that we provide parameter values as part of the request that will be used inside the used template.

(Replace SUBSCRIPTION_ID, RESOURCE_GROUP_NAME, DEPLOYMENT_NAME, YOUR_ACCESS_TOKEN, GLOBALY_UNIQUE_STORAGE_ACCOUNT_NAME, ADMIN_USER_NAME,ADMIN_PASSWORD and DNS_NAME_FOR_PUBLIC_IP to values appropriate for your request)

```HTTP
PUT /subscriptions/SUBSCRIPTION_ID/resourcegroups/RESOURCE_GROUP_NAME/providers/microsoft.resources/deployments/DEPLOYMENT_NAME?api-version=2015-01-01 HTTP/1.1
Host: management.azure.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "properties": {
    "templateLink": {
      "uri": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-simple-linux-vm/azuredeploy.json",
      "contentVersion": "1.0.0.0",
    },
    "mode": "Incremental",
    "parameters": {
        "newStorageAccountName": {
          "value": "GLOBALY_UNIQUE_STORAGE_ACCOUNT_NAME"
        },
        "adminUsername": {
          "value": "ADMIN_USER_NAME"
        },
        "adminPassword": {
          "value": "ADMIN_PASSWORD"
        },
        "dnsNameForPublicIP": {
          "value": "DNS_NAME_FOR_PUBLIC_IP"
        },
        "ubuntuOSVersion": {
          "value": "15.04"
        }
    }
  }
}
```

The quite long JSON response for this request have been omitted in order to improve readability of this documentation. The response will contain information about the templated deployment that you just created.

