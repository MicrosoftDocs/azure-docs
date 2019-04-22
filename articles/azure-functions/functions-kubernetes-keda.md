---
title: Azure Functions on Kubernetes with KEDA
description: Understand how to run Azure Functions in Kubernetes in the cloud or on-premises using KEDA, Kubernetes-based event driven autoscaling.
services: functions
documentationcenter: na
author: jeffhollan
manager: jeconnoc
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture, kubernetes

ms.service: azure-functions
ms.devlang: multiple
ms.topic: reference
ms.date: 05/04/2019
ms.author: jehollan
---

# Azure Functions on Kubernetes with KEDA

The Azure Functions runtime provides flexibility in hosting where and how you want.  [KEDA](https://github.com/kedacore/kore) provides Kubernetes-based event driven autoscaling, and pairs seamlessly with the Azure Functions runtime and tooling to provide event driven scalability in Kubernetes environments.

## How Kubernetes-based functions work

The Azure Functions service is made up of two key components: the Azure Functions runtime and the Azure Functions scale controller.  The runtime runs and executes your code.  In includes logic on how to trigger, log, and manage the function executions.  