---
title: How to add Azure Managed Domains to Email Communication Service
titleSuffix: An Azure Communication Services quick start guide
description: Learn about adding Azure Managed domains for Email Communication Services.
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

# Quickstart: How to add Azure Managed Domains to Email Communication Service

This article describes how to provision an Azure Managed Domain for Email Communication Service in Azure Communication Services.

::: zone pivot="platform-azp"
[!INCLUDE [Azure portal](./includes/create-azure-managed-domain-resource-az-portal.md)]
::: zone-end

::: zone pivot="platform-azcli"
[!INCLUDE [Azure CLI](./includes/create-azure-managed-domain-resource-az-cli.md)]
::: zone-end

::: zone pivot="platform-net"
[!INCLUDE [.NET](./includes/create-azure-managed-domain-resource-dot-net.md)]
::: zone-end

::: zone pivot="platform-powershell"
[!INCLUDE [PowerShell](./includes/create-azure-managed-domain-resource-powershell.md)]
::: zone-end

## Azure Managed Domains compared to Custom Domains

Before provisioning an Azure Managed Domain, review the following table to decide which domain type best meets your needs.

| | [Azure Managed Domains](./add-azure-managed-domains.md) | [Custom Domains](./add-custom-verified-domains.md) | 
|---|---|---|
|**Pros:** | - Setup is quick & easy<br/>- No domain verification required<br /> | - Emails are sent from your own domain |
|**Cons:** | - Sender domain is not personalized and cannot be changed<br/>- Sender usernames can't be personalized<br/>- Very limited sending volume<br />- User Engagement Tracking can't be enabled <br /> | - Requires verification of domain records <br /> - Longer setup for verification |

### Service limits

Both Azure managed domains and Custom domains are subject to service limits. Service limits include failure, rate, and size limits. For more information, see [Service limits for Azure Communication Services > Email](../../concepts/service-limits.md#email).

## Sender authentication for Azure Managed Domain

Azure Communication Services automatically configures the required email authentication protocols for the email as described in [Email Authentication best practices](../../concepts/email/email-authentication-best-practice.md). 

**Your email domain is now ready to send emails.**

## Next steps

* [Quickstart: How to connect a verified email domain](../../quickstarts/email/connect-email-communication-resource.md)

* [How to send an email using Azure Communication Service](../../quickstarts/email/send-email.md)

## Related articles

* Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md).
* Review email failure limits, rate limits, and size limits in [Service limits for Azure Communication Services > Email](../../concepts/service-limits.md#email).
* Learn how to send emails with custom verified domains in [Quickstart: How to add custom verified email domains](../../quickstarts/email/add-custom-verified-domains.md).
