---
title: Resource Manager REST APIs| Microsoft Docs
description: An overview of the Resource Manager REST APIs authentication and usage examples
services: azure-resource-manager
documentationcenter: na
author: navalev
manager: timlt
editor: ''

ms.assetid: e8d7a1d2-1e82-4212-8288-8697341408c5
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/13/2017
ms.author: navale;tomfitz;

---
# Resource Manager REST APIs
> [!div class="op_single_selector"]
> * [Azure PowerShell](powershell-azure-resource-manager.md)
> * [Azure CLI](xplat-cli-azure-resource-manager.md)
> * [Portal](resource-group-portal.md) 
> * [REST API](resource-manager-rest-api.md)
> 
> 

Behind every call to Azure Resource Manager, behind every deployed template, behind every configured storage account there are one or 
more calls to the Azure Resource Manager's RESTful API. 
This topic is devoted to those APIs and how you can call them without using any SDK at all. This approach is useful if you want full 
control of requests to Azure, or if the SDK for your preferred language is not available or doesn't support the operations you need.

This article does not go through every API that is exposed in Azure, but rather uses some operations as examples of how you connect to them. After you understand the basics, you can read the [Azure Resource Manager REST API Reference](https://docs.microsoft.com/rest/api/resources/) to find detailed information on how to use the rest of the APIs.

## Authentication
Authentication for Resource Manager is handled by Azure Active Directory (AD). To connect to any API, you first need to authenticate with 
Azure AD to receive an authentication token that you can pass on to every request. As we are describing a pure call directly to the REST
APIs, we assume that you don't want to authenticate by being prompted for a username and password. We also assume you are not using two factor authentication mechanisms. 
Therefore, we create what is called an Azure AD Application and a service principal that are used to log in. 
But remember that Azure AD support several authentication procedures and all of them could be used to retrieve that authentication token that we need for subsequent API requests.
Follow [Create Azure AD Application and Service Principle](resource-group-create-service-principal-portal.md) for step by step instructions.

### Generating an Access Token
Authentication against Azure AD is done by calling out to Azure AD, located at login.microsoftonline.com. 
To authenticate, you need to have the following information:

* Azure AD Tenant ID (the name of that Azure AD you are using to log in, often the same as your company but not necessary)
* Application ID (taken during the Azure AD application creation step)
* Password (that you selected while creating the Azure AD Application)

In the following HTTP request, make sure to replace "Azure AD Tenant ID", "Application ID" and "Password" with the correct values.

**Generic HTTP Request:**

```HTTP
POST /<Azure AD Tenant ID>/oauth2/token?api-version=1.0 HTTP/1.1 HTTP/1.1
Host: login.microsoftonline.com
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&resource=https%3A%2F%2Fmanagement.core.windows.net%2F&client_id=<Application ID>&client_secret=<Password>
```

... will (if authentication succeeds) result in a response similar to the following response:

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
(The access_token in the preceding response have been shortened to increase readability)

**Generating access token using Bash:**

```console
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=client_credentials&resource=https://management.core.windows.net/&client_id=<application id>&client_secret=<password you selected for authentication>" https://login.microsoftonline.com/<Azure AD Tenant ID>/oauth2/token?api-version=1.0
```

**Generating access token using PowerShell:**

```powershell
Invoke-RestMethod -Uri https://login.microsoftonline.com/<Azure AD Tenant ID>/oauth2/token?api-version=1.0 -Method Post
 -Body @{"grant_type" = "client_credentials"; "resource" = "https://management.core.windows.net/"; "client_id" = "<application id>"; "client_secret" = "<password you selected for authentication>" }
```

The response contains an access token, information about how long that token is valid, and information about what resource you can use that token for.
The access token you received in the previous HTTP call must be passed in for all request to the Resource Manager API. You pass it as a header value named "Authorization" with the value "Bearer YOUR_ACCESS_TOKEN". Notice the space between "Bearer" and your access token.

As you can see from the above HTTP Result, the token is valid for a specific period of time during which you should cache and reuse that same token. Even if it is possible to authenticate against Azure AD for each API call, it would be highly inefficient.

## Calling Resource Manager REST APIs
This topic only uses a few APIs to explain the basic usage of the REST operations. For information about all the operations, see [Azure Resource Manager REST APIs](https://docs.microsoft.com/rest/api/resources/).

### List all subscriptions
One of the simplest operations you can do is to list the available subscriptions that you can access. In the following request, you see how the access token is passed in as a header:

(Replace YOUR_ACCESS_TOKEN with your actual Access Token.)

```HTTP
GET /subscriptions?api-version=2015-01-01 HTTP/1.1
Host: management.azure.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

... and as a result, you get a list of subscriptions that this service principal is allowed to access

(Subscription IDs have been shortened for readability)

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
All resources available with the Resource Manager APIs are nested inside a resource group. You can query Resource Manager for existing resource groups in your subscription using the following HTTP GET request. Notice how the subscription ID is passed in as part of the URL this time.

(Replace YOUR_ACCESS_TOKEN and SUBSCRIPTION_ID with your actual access token and subscription ID)

```HTTP
GET /subscriptions/SUBSCRIPTION_ID/resourcegroups?api-version=2015-01-01 HTTP/1.1
Host: management.azure.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

The response you get depends on whether you have any resource groups defined and if so, how many.

(Subscription IDs have been shortened for readability)

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
So far, we've only been querying the Resource Manager APIs for information. It's time we create some resources, and let's start by the simplest of them all, a resource group. The following HTTP request creates a resource group in a region/location of your choice, and adds a tag to it.

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

If successful, you get a response that is similar to the following response:

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

You've successfully created a resource group in Azure. Congratulations!

### Deploy resources to a resource group using a Resource Manager Template
With Resource Manager, you can deploy your resources using templates. A template defines several resources and their dependencies. For this section, we assume you are familiar with Resource Manager templates, and we just show you how to make the API call to start deployment. For more information about constructing templates, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).

Deployment of a template doesn't differ much to how you call other APIs. One important aspect is that deployment of a template can take quite a long time. The API call just returns, and it's up to you as developer to query for status of the deployment to find out when the deployment is done. For more information, see [Track asynchronous Azure operations](resource-manager-async-operations.md).

For this example, we use a publicly exposed template available on [GitHub](https://github.com/Azure/azure-quickstart-templates). The template we use deploys a Linux VM to the West US region. Even though this example uses a template available in a public repository like GitHub, you can instead pass the full template as part of the request. Note that we provide parameter values in the request that are used inside the deployed template.

(Replace SUBSCRIPTION_ID, RESOURCE_GROUP_NAME, DEPLOYMENT_NAME, YOUR_ACCESS_TOKEN, GLOBALY_UNIQUE_STORAGE_ACCOUNT_NAME, ADMIN_USER_NAME, ADMIN_PASSWORD and DNS_NAME_FOR_PUBLIC_IP to values appropriate for your request)

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

The long JSON response for this request has been omitted to improve readability of this documentation. The response contains information about the templated deployment that you created.

## Next steps

- To learn about handling asynchronous REST operations, see [Track asynchronous Azure operations](resource-manager-async-operations.md).
