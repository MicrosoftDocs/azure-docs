---
title: Common parameters and headers 
description: The parameters and headers common to all operations that you might do related to Key Vault resources.
services: key-vault
author: msmbaldwin
manager: barbkess
tags: azure-resource-manager

ms.service: key-vault
ms.topic: conceptual
ms.date: 01/07/2019
ms.author: mbaldwin

---

# Common parameters and headers

The following information is common to all operations that you might do related to Key Vault resources:

- Replace `{api-version}` with the api-version in the URI.
- Replace `{subscription-id}` with your subscription identifier in the URI
- Replace `{resource-group-name}` with the resource group. For more information, see Using Resource groups to manage your Azure resources.
- Replace `{vault-name}` with your key vault name in the URI.
- Set the Content-Type header to application/json.
- Set the Authorization header to a JSON Web Token that you obtain from Azure Active Directory (AAD). For more information, see [Authenticating Azure Resource Manager](authentication-requests-and-responses.md) requests.

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
