---
title: Connecting to the Azure Stack API
description: Learn how to retrieve a authentication from Azure to make API requests to Azure Stack.
services: azure-stack
documentationcenter: ''
author: cblackuk and charliejllewellyn
manager: ''
editor: ''

ms.assetid: na
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/05/2018
ms.author: na

---

The Azure Stack API can be used to automate operational actions against the platform like syndicating marketplace items.

The process requires authentication against the Microsoft Azure login endpoint to obtain a token which is then provided in the headers of every request sent to the Azure Stack API.

This guide provides simple examples specific to Azure Stack using curl to show the process of retrieving a token to acces the Azure Stack API. Most languages provide oauth libraries which have robust token management, handling tasks like token refreshing. It is expected that most developers will choose to use these, however there is value in understanding the underlying requests being made.

This guide also doesn't explore all the options avaialble for retrieving tokens such as interactive login or creating dedicated app IDs, for more information see https://docs.microsoft.com/en-us/rest/api/.

# Retrieve a token from Azure

In order to obtain an Access Token you will need to create a request *body* formatted using the content type x-www-form-urlencoded and POST it to the Azure REST Authentication/Login Endpoint.

## Login endpoint:
```
https://login.microsoftonline.com/{tenant id}/oauth2/token
```

Tenant ID is either:

- tenant domain e.g. fabrikam.onmicrosoft.com
- tenant ID e.g. 8eaed023-2b34-4da1-9baa-8bc8c9d6a491
- Default value for tenant independent keys - common

## Body
```
grant_type=password
&client_id=1950a258-227b-4e31-a9cf-717495945fc2
&resource=https://contoso.onmicrosoft.com/4de154de-f8a8-4017-af41-df619da68155
&username=admin@fabrikam.onmicrosoft.com
&password=Password123
&scope=openid
```

  **grant_type**
  
  This is the type of authentication scheme you will using. In this example the value is:
  ```
  password
  ```

  **resource**

  The resource the token will be used to access. This can be found by querying the Azure Stack management metatdata endpoint and looking at the "audiences" section

  The Azure Stack Management endpoint:
  ```
  https://management.{region}.{Azure Stack domain}/metadata/endpoints?api-version=2015-01-01
  ```
  **NOTE:** If you are an admin trying to access the tenant API then you must make sure to the tenant endpoint, e.g.
  ```
  https://adminmanagement.{region}.{Azure Stack domain}/metadata/endpoints?api-version=2015-01-01
  ```
  
  For example with the ASDK:
  ```
  curl 'https://management.local.azurestack.external/metadata/endpoints?api-version=2015-01-01'
  ```
 
  response:
  ```
  {
  "galleryEndpoint":"https://adminportal.local.azurestack.external:30015/",
  "graphEndpoint":"https://graph.windows.net/",
  "portalEndpoint":"https://adminportal.local.azurestack.external/",
  "authentication":{
      "loginEndpoint":"https://login.windows.net/",
      "audiences":["https://contoso.onmicrosoft.com/4de154de-f8a8-4017-af41-df619da68155"]
      }
  }
  ```

  Example:
  ```
  https://contoso.onmicrosoft.com/4de154de-f8a8-4017-af41-df619da68155
  ```

  **client_id**

  This value is hardcoded to a default value:
  ```
  1950a258-227b-4e31-a9cf-717495945fc2
  ```

  Alternative options are available for specific scenarios:
  
  | Application | ApplicationID |
  | --------------------------------------- |:-------------------------------------------------------------:|
  | LegacyPowerShell | 0a7bdc5c-7b57-40be-9939-d4c5fc7cd417 |
  | PowerShell | 1950a258-227b-4e31-a9cf-717495945fc2 |
  | WindowsAzureActiveDirectory | 00000002-0000-0000-c000-000000000000 |
  | VisualStudio | 872cd9fa-d31f-45e0-9eab-6e460a02d1f1 |
  | AzureCLI | 04b07795-8ddb-461a-bbee-02f9e1bf7b46 |

  **username**
  
  The Azure Stack AAD account, for example:
  ```
  azurestackadmin@fabrikam.onmicrosoft.com
  ```

  **password**

  The Azure Stack AAD admin password.
  
## Example:

Request:
```
curl -X "POST" "https://login.windows.net/fabrikam.onmicrosoft.com/oauth2/token" \
-H "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "client_id=1950a258-227b-4e31-a9cf-717495945fc2" \
--data-urlencode "grant_type=password" \
--data-urlencode "username=admin@fabrikam.onmicrosoft.com" \
--data-urlencode 'password=Password12345' \
--data-urlencode "resource=https://contoso.onmicrosoft.com/4de154de-f8a8-4017-af41-df619da68155"
```

Response:
```
{
  "token_type": "Bearer",
  "scope": "user_impersonation",
  "expires_in": "3599",
  "ext_expires_in": "0",
  "expires_on": "1512574780",
  "not_before": "1512570880",
  "resource": "https://contoso.onmicrosoft.com/4de154de-f8a8-4017-af41-df619da68155",
  "access_token": "eyJ0eXAiOi...truncated for readability..."
}
```

# API Queries

Once you obtained your Access Token you will need to add it as a header to each of your API requests. In order to do so you need to create a header "authorization" with value: "Bearer <access token>". For example:

Request:
```
curl -H "Authorization: Bearer eyJ0eXAiOi...truncated for readability..." 'https://adminmanagement.local.azurestack.external/subscriptions?api-version=2016-05-01'
```

Response:
```
offerId : /delegatedProviders/default/offers/92F30E5D-F163-4C58-8F02-F31CFE66C21B
id : /subscriptions/800c4168-3eb1-406b-a4ca-919fe7ee42e8
subscriptionId : 800c4168-3eb1-406b-a4ca-919fe7ee42e8
tenantId : 9fea4606-7c07-4518-9f3f-8de9c52ab628
displayName : Default Provider Subscription
state : Enabled
subscriptionPolicies : @{locationPlacementId=AzureStack}
```

## URL structure and query Syntax
```
Generic   request URI, consists of:  {URI-scheme} :// {URI-host} / {resource-path} ? {query-string}
```

- **URI scheme:** Indicates the protocol used to transmit the request. For example, http or https.
- **URI host:** Specifies the domain name or IP address of the server where the REST service endpoint is hosted, such as graph.microsoft.com or adminmanagement.local.azurestack.external
- **Resource path:** Specifies the resource or resource collection, which may include multiple segments used by the service in determining the selection of those resources. For example: beta/applications/00003f25-7e1f-4278-9488-efc7bac53c4a/owners can be used to query the list a specific application's owners within the applications collection.
- **Query string:** Provides additional simple parameters, such as the API version or resource selection criteria.

## Azure Stack request URI Construct:
```
{URI-scheme} :// {URI-host} / {subscription id} / {resource group} / {provider} / {resource-path} ? {OPTIONAL: filter-expression} {MANDATORY: api-version} 
```

## URI Syntax:
```
https://adminmanagement.local.azurestack.external/{subscription id}/resourcegroups/{resource group}/providers/{provider}/{resource-path}?{api-version} 
```

## Query URI Example:
```
https://adminmanagement.local.azurestack.external/subscriptions/800c4168-3eb1-406b-a4ca-919fe7ee42e8/resourcegroups/system.local/providers/microsoft.infrastructureinsights.admin/regionhealths/local/Alerts?$filter=(Properties/State eq 'Active') and (Properties/Severity eq 'Critical')&$orderby=Properties/CreatedTimestamp desc&api-version=2016-05-01"
```
