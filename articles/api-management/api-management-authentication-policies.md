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
ms.topic: article
ms.date: 06/12/2020
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

-   **Policy scopes:** all scopes

##  <a name="ClientCertificate"></a> Authenticate with client certificate
 Use the `authentication-certificate` policy to authenticate with a backend service using client certificate. The certificate needs to be [installed into API Management](https://go.microsoft.com/fwlink/?LinkID=511599) first and is identified by its thumbprint.

### Policy statement

```xml
<authentication-certificate thumbprint="thumbprint" certificate-id="resource name"/>
```

### Examples

In this example, the client certificate is identified by its thumbprint:

```xml
<authentication-certificate thumbprint="CA06F56B258B7A0D4F2B05470939478651151984" />
```

In this example, the client certificate is identified by the resource name:

```xml  
<authentication-certificate certificate-id="544fe9ddf3b8f30fb490d90f" />  
``` 

In this example, the client certificate is set in the policy rather than retrieved from the built-in certificate store:

```xml
<authentication-certificate body="@(context.Variables.GetValueOrDefault<byte[]>("byteCertificate"))" password="optional-certificate-password" />
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
|body|Client certificate as a byte array.|No|N/A|
|password|Password for the client certificate.|Used if certificate specified in `body` is password protected.|N/A|
  
### Usage  
 This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).  
  
-   **Policy sections:** inbound  
  
-   **Policy scopes:** all scopes  

##  <a name="ManagedIdentity"></a> Authenticate with managed identity  
 Use the `authentication-managed-identity` policy to authenticate with a backend service using the managed identity. This policy essentially uses the managed identity to obtain an access token from Azure Active Directory for accessing the specified resource. After successfully obtaining the token, the policy will set the value of the token in the `Authorization` header using the `Bearer` scheme.

Both system-assigned identity and any of the multiple user-assigned identity can be used to request token. If `client-id` is not provided system-assigned identity is assumed. If the `client-id` variable is provided token is requested for that user-assigned identity from Azure Active Directory
  
### Policy statement  
  
```xml  
<authentication-managed-identity resource="resource" client-id="clientid of user-assigned identity" output-token-variable-name="token-variable" ignore-error="true|false"/>  
```  
  
### Example  
#### Use managed identity to authenticate with a backend service
```xml  
<authentication-managed-identity resource="https://graph.microsoft.com"/> 
```
```xml  
<authentication-managed-identity resource="https://management.azure.com/"/> <!--Azure Resource Manager-->
```
```xml  
<authentication-managed-identity resource="https://vault.azure.net"/> <!--Azure Key Vault-->
```
```xml  
<authentication-managed-identity resource="https://servicebus.azure.net/"/> <!--Azure Service Bus-->
```
```xml  
<authentication-managed-identity resource="https://storage.azure.com/"/> <!--Azure Blob Storage-->
```
```xml  
<authentication-managed-identity resource="https://database.windows.net/"/> <!--Azure SQL-->
```

```xml
<authentication-managed-identity resource="api://Client_id_of_Backend"/> <!--Your own Azure AD Application-->
```

#### Use managed identity and set header manually

```xml
<authentication-managed-identity resource="api://Client_id_of_Backend"
   output-token-variable-name="msi-access-token" ignore-error="false" /> <!--Your own Azure AD Application-->
<set-header name="Authorization" exists-action="override">
   <value>@("Bearer " + (string)context.Variables["msi-access-token"])</value>
</set-header>
```

#### Use managed identity in send-request policy
```xml  
<send-request mode="new" timeout="20" ignore-error="false">
    <set-url>https://example.com/</set-url>
    <set-method>GET</set-method>
    <authentication-managed-identity resource="ResourceID"/>
</send-request>
```

### Elements  
  
|Name|Description|Required|  
|----------|-----------------|--------------|  
|authentication-managed-identity |Root element.|Yes|  
  
### Attributes  
  
|Name|Description|Required|Default|  
|----------|-----------------|--------------|-------------|  
|resource|String. The App ID of the target web API (secured resource) in Azure Active Directory.|Yes|N/A|
|client-id|String. The App ID of the user-assigned identity in Azure Active Directory.|No|system-assigned identity|
|output-token-variable-name|String. Name of the context variable that will receive token value as an object type `string`. |No|N/A|  
|ignore-error|Boolean. If set to `true`, the policy pipeline will continue to execute even if an access token is not obtained.|No|false|  
  
### Usage  
 This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).  
  
-   **Policy sections:** inbound  
  
-   **Policy scopes:** all scopes

## Next steps
For more information working with policies, see:

+ [Policies in API Management](api-management-howto-policies.md)
+ [Transform APIs](transform-api.md)
+ [Policy Reference](api-management-policy-reference.md) for a full list of policy statements and their settings
+ [Policy samples](policy-samples.md)
