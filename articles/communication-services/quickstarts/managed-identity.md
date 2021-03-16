---
title: Use managed identities in Communication Services
titleSuffix: An Azure Communication Services quickstart
description: Managed identities let you authorize Azure Communication Services access from applications running in Azure VMs, function apps, and other resources.
services: azure-communication-services
author: peiliu
ms.service: azure-communication-services
ms.topic: how-to
ms.date: 03/10/2021
ms.author: peiliu
ms.reviewer: mikben
zone_pivot_groups: acs-js-csharp-java-python
---

# Use managed identities
Get started with Azure Communication Services by using managed identities. The Communication Services Identity and SMS client libraries support Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

This quickstart shows you how to authorize access to the Identity and SMS client libraries from an Azure environment that supports managed identities. It also describes how to test your code in a development environment.

::: zone pivot="programming-language-csharp"
[!INCLUDE [.NET](./includes/managed-identity-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript](./includes/managed-identity-js.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java](./includes/managed-identity-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python](./includes/managed-identity-python.md)]
::: zone-end

## Next steps

- [Learn more about Azure role-based access control](../../../articles/role-based-access-control/index.yml)
- [Learn more about Azure identity library for .NET](/dotnet/api/overview/azure/identity-readme)
- [Creating user access tokens](../quickstarts/access-tokens.md)
- [Send an SMS message](../quickstarts/telephony-sms/send.md)
- [Learn more about SMS](../concepts/telephony-sms/concepts.md)
