---
title: Manage user assigned managed identities
description: Create user assigned managed identities
services: active-directory
author: barclayn
manager: daveba
editor: 
ms.service: active-directory
ms.subservice: msi
ms.devlang: 
ms.topic: how-to
ms.workload: identity
ms.date: 06/07/2021
ms.author: barclayn
zone_pivot_groups: identity-mi-methods
---

# Manage user-assigned managed identities


::: zone pivot="identity-mi-methods-azp"

[!INCLUDE [Portal](includes/create-user-assigned-managed-identities-portal.md)]

::: zone-end

::: zone pivot="identity-mi-methods-azcli"

Managed identities for Azure resources provide Azure services with a managed identity in Azure Active Directory. You can use this identity to authenticate to services that support Azure AD authentication, without having to store credentials in your code. 

In this article, you learn how to create, list, and delete a user-assigned managed identity using Azure CLI.


[!INCLUDE [Azure CLI](includes/create-user-assigned-managed-identities-cli.md)]

::: zone-end

::: zone pivot="identity-mi-methods-powershell"

[!INCLUDE [PowerShell](includes/create-user-assigned-managed-identities-powershell.md)]

::: zone-end


::: zone pivot="identity-mi-methods-arm"

[!INCLUDE [Azure resource manager](includes/create-user-assigned-managed-identities-arm.md)]

::: zone-end

::: zone pivot="identity-mi-methods-rest"

[!INCLUDE [REST](includes/create-user-assigned-managed-identities-rest.md)]

::: zone-end



