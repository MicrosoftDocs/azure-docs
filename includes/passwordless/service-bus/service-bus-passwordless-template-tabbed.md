---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: storage
ms.topic: include
ms.date: 09/09/2022
ms.author: alexwolf
ms.custom: include file
---

## Authenticate the app to Azure

[!INCLUDE [passwordless-overview](../passwordless-overview.md)]

## [Passwordless (Recommended)](#tab/passwordless)

[!INCLUDE [passwordless-default-azure-credential-overview](../dotnet-default-azure-credential-overview.md)]

### Assign roles to your Azure AD user

[!INCLUDE [service-bus-assign-roles](service-bus-assign-roles.md)]

### Sign in and add the Azure Identity package

You can authorize access to the service bus namespace using the following steps:

[!INCLUDE [default-azure-credential-sign-in](../default-azure-credential-sign-in.md)]

[!INCLUDE [visual-studio-add-identity](../visual-studio-add-identity.md)]

## [Connection String](#tab/connection-string)

[!INCLUDE [service-bus-retrieve-connection-string](service-bus-retrieve-connection-string.md)]

---
