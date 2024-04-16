---
title: Find identity object IDs for authentication in Azure API for FHIR
description: This article explains how to locate the identity object IDs needed to configure authentication for Azure API for FHIR.
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.custom: has-azure-ad-ps-ref
ms.topic: conceptual
ms.date: 3/21/2024
ms.author: kesheth
---

# Find identity object IDs for authentication configuration in Azure API for FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this article, learn how to find the identity object IDs needed to configure the Azure API for FHIR service to [use an external or secondary Active Directory tenant](configure-local-rbac.md) for data plane.

## Find user object ID

If you have a user with user name `myuser@contoso.com`, you can locate the user's `ObjectId` by using a Microsoft Graph PowerShell command or the Azure Command-Line Interface (CLI).

#### [PowerShell](#tab/powershell)

```powershell
$(Get-MgUser -Filter "UserPrincipalName eq 'myuser@contoso.com'").Id
```

#### [Azure CLI](#tab/command-line)

```azurecli-interactive
az ad user show --id myuser@contoso.com --query id --out tsv
```

---

## Find service principal object ID

Suppose you registered a [service client app](register-service-azure-ad-client-app.md) and you want to allow this service client to access the Azure API for FHIR. Find the object ID for the client service principal with a Microsoft Graph PowerShell command or the Azure CLI.

#### [PowerShell](#tab/powershell)

```powershell
$(Get-MgServicePrincipal -Filter "AppId eq 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'").Id
```

Where `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` is the service client application ID. Alternatively, you can use the `DisplayName` of the service client:

```powershell
$(Get-MgServicePrincipal -Filter "DisplayName eq 'testapp'").Id
```

#### [Azure CLI](#tab/command-line)

```azurecli-interactive
az ad sp show --id XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX --query id --out tsv
```

---

## Find a security group object ID

If you would like to locate the object ID of a security group, you can use a Microsoft Graph PowerShell command or the Azure CLI.

#### [PowerShell](#tab/powershell)

```powershell
$(Get-MgGroup -Filter "DisplayName eq 'mygroup'").Id
```

Where `mygroup` is the name of the group you're interested in.

#### [Azure CLI](#tab/command-line)

```azurecli-interactive
az ad group show --group "mygroup" --query id --out tsv
```

---

## Next steps

[Configure local RBAC settings](configure-local-rbac.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]