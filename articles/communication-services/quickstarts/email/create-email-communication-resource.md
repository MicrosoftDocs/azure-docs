---
title: Quickstart - Create and manage Email Communication Service resource in Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: This quickstart describes how to create and manage your first Azure Email Communication Service resource.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-plat-azp-azcli-net-ps
ms.custom: mode-other, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: azurecli 
---
# Quickstart: Create and manage Email Communication Service resources

 
Get started with Email by provisioning your first Email Communication Service resource. Provision Email Communication Service resources through the [Azure portal](https://portal.azure.com/) or using the .NET management client library. The management client library and the Azure portal enable you to create, configure, update, and delete your resources and interface using Azure's deployment and management service: [Azure Resource Manager](../../../azure-resource-manager/management/overview.md). All functions available in the client libraries are available in the Azure portal.

> [!WARNING]
> Note that it is not possible to create a resource group at the same time as a resource for Azure Communication Services. When creating a resource, a resource group that has been created already must be used.

::: zone pivot="platform-azp"
[!INCLUDE [Azure portal](./includes/create-email-resource-az-portal.md)]
::: zone-end

::: zone pivot="platform-azcli"
[!INCLUDE [Azure CLI](./includes/create-email-resource-az-cli.md)]
::: zone-end

::: zone pivot="platform-net"
[!INCLUDE [.NET](./includes/create-email-resource-dot-net.md)]
::: zone-end

::: zone pivot="platform-powershell"
[!INCLUDE [PowerShell](./includes/create-email-resource-powershell.md)]
::: zone-end

## Next steps

* [Email domains and sender authentication for Azure Communication Services](../../concepts/email/email-domain-and-sender-authentication.md)

* [Quickstart: How to connect a verified email domain](../../quickstarts/email/connect-email-communication-resource.md)

## Related articles

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- Learn how to send emails with custom verified domains in [Quickstart: How to add custom verified email domains](../../quickstarts/email/add-custom-verified-domains.md)
- Learn how to send emails with Azure Managed Domains in [Quickstart: How to add Azure Managed Domains to email](../../quickstarts/email/add-azure-managed-domains.md)
