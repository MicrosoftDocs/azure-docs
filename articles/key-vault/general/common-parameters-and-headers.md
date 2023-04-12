---
title: Common parameters and headers 
description: The parameters and headers common to all operations that you might perform on Key Vault resources.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 01/11/2023
ms.author: mbaldwin

---

# Common parameters and headers

The following information is common to all operations that you might perform on Key Vault resources:

- The HTTP `Host` header must always be present and must specify the vault hostname. Example: `Host: contoso.vault.azure.net`. Note that most client technologies populate the `Host` header from the URI. For instance, `GET https://contoso.vault.azure.net/secrets/mysecret{...}` will set the `Host` as `contoso.vault.azure.net`. If you access Key Vault using raw IP address like `GET https://10.0.0.23/secrets/mysecret{...}`, the automatic value of `Host` header will be wrong, and you'll have to manually ensure that the `Host` header contains the vault hostname.
- Replace `{api-version}` with the api-version in the URI.
- Replace `{subscription-id}` with your subscription identifier in the URI
- Replace `{resource-group-name}` with the resource group. For more information, see Using Resource groups to manage your Azure resources.
- Replace `{vault-name}` with your key vault name in the URI.
- Set the Content-Type header to application/json.
- Set the Authorization header to a JSON Web Token that you obtain from Azure Active Directory (Azure AD). For more information, see [Authenticating Azure Resource Manager](authentication-requests-and-responses.md) requests.

## Common error response
The service will use HTTP status codes to indicate success or failure. In addition, failures contain a response in the following format:

```
   {  
     "error": {  
     "code": "BadRequest",  
     "message": "The key vault sku is invalid."  
     }  
   }  
```

|Element name | Type | Description |
|---|---|---|
| code | string | The type of error that occurred.|
| message | string | A description of what caused the error. |



## See Also
 [Azure Key Vault REST API Reference](/rest/api/keyvault/)
