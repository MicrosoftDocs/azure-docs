---
title: Create a Relay namespace using the Azure portal | Microsoft Docs
description: How to create a Relay namespace using the Azure portal.
services: service-bus-relay
documentationcenter: .net
author: spelluru
manager: timlt
editor: ''

ms.assetid: 78ab6753-877a-4426-92ec-a81675d62a57
ms.service: service-bus-relay
ms.devlang: tbd
ms.topic: conceptual
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 12/20/2017
ms.author: spelluru
---

# Create a Relay namespace using the Azure portal

A namespace is a scoping container for all your Azure Relay components. Multiple relays can reside in a single namespace, and namespaces often serve as application containers. There are currently two different ways to create a relay namespace:

1. Azure portal (this article).
2. [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) templates.

## Create a namespace in the Azure portal

[!INCLUDE [relay-create-namespace-portal](../../includes/relay-create-namespace-portal.md)]

Congratulations! You have now created a relay namespace.

## Next steps

* [Relay FAQ](relay-faq.md)
* [Get started with .NET](relay-hybrid-connections-dotnet-get-started.md)
* [Get started with Node](relay-hybrid-connections-node-get-started.md)

