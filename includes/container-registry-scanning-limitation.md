---
title: include file
description: include file
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: include
ms.date: 08/25/2020
ms.author: danlep
ms.custom: include file
---


> [!NOTE]
> Unless allowed as a [trusted service for network access](../articles/container-registry/allow-access-trusted-services.md), a managed Azure service can't reach an Azure container registry that restricts access to private endpoints, selected subnets, or IP addresses. For example, Azure Security Center can't currently perform [image vulnerability scanning](../articles/security-center/azure-container-registry-integration.md?toc=/azure/container-registry/toc.json&bc=/azure/container-registry/breadcrumb/toc.json) in a network-restricted registry.