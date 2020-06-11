---
title: Find identity object IDs for authentication - Azure API for FHIR
description: This article explains how to locate the identity object IDs needed to configure authentication for Azure API for FHIR
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 02/07/2019
ms.author: mihansen
---

# Find identity object IDs for authentication configuration

In this article, you'll learn how to find identity object IDs needed when configuring the Azure API for FHIR to [use an external or secondary Active Directory tenant](configure-local-rbac.md) for data plane.

## Find user object ID

If you have a user with user name `myuser@consoso.com`, you can locate the users `ObjectId` using the following PowerShell command:

```azurepowershell-interactive
$(Get-AzureADUser -Filter "UserPrincipalName eq 'myuser@consoso.com'").ObjectId
```

or you can use the Azure CLI:

```azurecli-interactive
az ad user show --upn-or-object-id myuser@consoso.com | jq -r .objectId
```

## Find service principal object ID

Suppose you have registered a [service client app](register-service-azure-ad-client-app.md) and you would like to allow this service client to access the Azure API for FHIR, you can find the object ID for the client service principal with the following PowerShell command:

```azurepowershell-interactive
$(Get-AzureADServicePrincipal -Filter "AppId eq 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'").ObjectId
```

where `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` is the service client application ID. Alternatively, you can use the `DisplayName` of the service client:

```azurepowershell-interactive
$(Get-AzureADServicePrincipal -Filter "DisplayName eq 'testapp'").ObjectId
```

If you are using the Azure CLI, you can use:

```azurecli-interactive
az ad sp show --id XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX | jq -r .objectId
```

## Find a security group object ID

If you would like to locate the object ID of a security group, you can use the following PowerShell command:

```azurepowershell-interactive
$(Get-AzureADGroup -Filter "DisplayName eq 'mygroup'").ObjectId
```
Where `mygroup` is the name of the group you are interested in.

If you are using the Azure CLI, you can use:

```azurecli-interactive
az ad group show --group "mygroup" | jq -r .objectId
```

## Next steps

In this article, you've learned how to find identity object IDs needed to configure the Azure API for FHIR to use an external or secondary Azure Active Directory tenant. Next read about how to use the object IDs to configure local RBAC settings:
 
>[!div class="nextstepaction"]
>[Configure local RBAC settings](configure-local-rbac.md)