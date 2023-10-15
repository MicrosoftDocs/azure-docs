---
title: Use Microsoft Entra ID in Communication Services
titleSuffix: An Azure Communication Services quickstart
description: Microsoft Entra ID lets you authorize Azure Communication Services access from applications running in Azure VMs, function apps, and other resources.
services: azure-communication-services
author: peiliu
ms.service: azure-communication-services
ms.subservice: identity
ms.topic: quickstart
ms.date: 06/30/2021
ms.author: peiliu
ms.reviewer: mikben
zone_pivot_groups: acs-azcli-js-csharp-java-python
ms.custom: mode-other, devx-track-extended-java, devx-track-js, devx-track-python
---

# Quickstart: Authenticate using Microsoft Entra ID

Get started with Azure Communication Services by using Microsoft Entra ID. The Communication Services Identity and SMS SDKs support Microsoft Entra authentication.

This quickstart shows you how to authorize access to the Identity and SMS SDKs from an Azure environment that supports Active Directory. It also describes how to test your code in a development environment by creating a service principal for your work.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
- An active Azure Communication Services resource, see [create a Communication Services resource](../create-communication-resource.md) if you do not have one.
- To send an SMS you will need a [Phone Number](../telephony/get-phone-number.md).
- A setup Service Principal for a development environment, see [Authorize access with service principal](./service-principal.md?pivots=platform-azcli)

::: zone pivot="platform-azcli"
[!INCLUDE [AzCLI](./includes/active-directory/service-principal-cli.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [.NET](./includes/active-directory/service-principal-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript](./includes/active-directory/service-principal-js.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java](./includes/active-directory/service-principal-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python](./includes/active-directory/service-principal-python.md)]
::: zone-end

## Next steps

- [Learn more about Azure role-based access control](../../../../articles/role-based-access-control/index.yml)
- [Learn more about Azure identity library for .NET](/dotnet/api/overview/azure/identity-readme)
- [Creating user access tokens](../../quickstarts/identity/access-tokens.md)
- [Send an SMS message](../../quickstarts/sms/send.md)
- [Learn more about SMS](../../concepts/sms/concepts.md)
- [Quickly create an identity for testing](./quick-create-identity.md).
