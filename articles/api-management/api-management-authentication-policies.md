---
title: Azure API Management authentication policies | Microsoft Docs
description: Learn about the authentication policies available for use in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.assetid: 061702a7-3a78-472b-a54a-f3b1e332490d
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/27/2017
ms.author: apimpm
---
# API Management authentication policies
This topic provides a reference for the following API Management policies. For information on adding and configuring policies, see [Policies in API Management](https://go.microsoft.com/fwlink/?LinkID=398186).  

##  <a name="AuthenticationPolicies"></a> Authentication policies  
  
-   [Authenticate with Basic](api-management-authentication-policies.md#Basic) - Authenticate with a backend service using Basic authentication.  
  
-   [Authenticate with client certificate](api-management-authentication-policies.md#ClientCertificate) - Authenticate with a backend service using client certificates.  

-   [Authenticate with managed identity](api-management-authentication-policies.md#ManagedIdentity) - Authenticate with the [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the API Management service.  
  
##  <a name="Basic"></a> Authenticate with Basic  
 Use the `authentication-basic` policy to authenticate with a backend service using Basic authentication. This policy effectively sets the HTTP Authorization header to the value corresponding to the credentials provided in the policy.  
  
### Policy statement  
  
```xml  
<authentication-basic username="username" password="password" />  
```  
  
### Example  
  
```xml  
<authentication-basic username="testuser" password="testpassword" />  
```  
  
### Elements  
  
|Name|Description|Required|  
|----------|-----------------|--------------|  
|authentication-basic|Root element.|Yes|  
  
### Attributes  
  
|Name|Description|Required|Default|  
|----------|-----------------|--------------|-------------|  
|username|Specifies the username of the Basic credential.|Yes|N/A|  
|password|Specifies the password of the Basic credential.|Yes|N/A|  
  
### Usage  
 This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).  
  
-   **Policy sections:** inbound  
  
-   **Policy scopes:** API  
  
##  <a name="ClientCertificate"></a> Authenticate with client certificate  
 Use the `authentication-certificate` policy to authenticate with a backend service using client certificate. The certificate needs to be [installed into API Management](https://go.microsoft.com/fwlink/?LinkID=511599) first and is identified by its thumbprint.  
  
### Policy statement  
  
```xml  
<authentication-certificate thumbprint="thumbprint" certificate-id="resource name"/>  
```  
  
### Examples  
  
In this example client certificate is identified by its thumbprint.
```xml  
<authentication-certificate thumbprint="CA06F56B258B7A0D4F2B05470939478651151984" />  
``` 
In this example client certificate is identified by resource name.
```xml  
<authentication-certificate certificate-id="544fe9ddf3b8f30fb490d90f" />  
```  

### Elements  
  
|Name|Description|Required|  
|----------|-----------------|--------------|  
|authentication-certificate|Root element.|Yes|  
  
### Attributes  
  
|Name|Description|Required|Default|  
|----------|-----------------|--------------|-------------|  
|thumbprint|The thumbprint for the client certificate.|Either `thumbprint` or `certificate-id` must be present.|N/A|  
|certificate-id|The certificate resource name.|Either `thumbprint` or `certificate-id` must be present.|N/A|  
  
### Usage  
 This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).  
  
-   **Policy sections:** inbound  
  
-   **Policy scopes:** API  

##  <a name="ManagedIdentity"></a> Authenticate with managed identity  
 Use the `authentication-managed-identity` policy to authenticate with a backend service using the managed identity of the API Management service. This policy effectively uses the managed identity to obtain an access token from Azure Active Directory for accessing the specified resource. 
  
### Policy statement  
  
```xml  
<authentication-managed-identity resource="resource" output-token-variable-name="token-variable" ignore-error="true|false"/>  
```  
  
### Example  
  
```xml  
<authentication-managed-identity resource="https://graph.windows.net" output-token-variable-name="test-access-token" ignore-error="true" /> 
```  
  
### Elements  
  
|Name|Description|Required|  
|----------|-----------------|--------------|  
|authentication-managed-identity |Root element.|Yes|  
  
### Attributes  
  
|Name|Description|Required|Default|  
|----------|-----------------|--------------|-------------|  
|resource|String. The App ID URI of the target web API (secured resource) in Azure Active Directory.|Yes|N/A|  
|output-token-variable-name|String. Name of the context variable that will receive token value as an object type `string`.|No|N/A|  
|ignore-error|Boolean. If set to `true`, the policy pipeline will continue to execute even if an access token is not obtained.|No|false|  
  
### Usage  
 This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).  
  
-   **Policy sections:** inbound  
  
-   **Policy scopes:** global, product, API, operation  

## Next steps
For more information working with policies, see:

+ [Policies in API Management](api-management-howto-policies.md)
+ [Transform APIs](transform-api.md)
+ [Policy Reference](api-management-policy-reference.md) for a full list of policy statements and their settings
+ [Policy samples](policy-samples.md)	
