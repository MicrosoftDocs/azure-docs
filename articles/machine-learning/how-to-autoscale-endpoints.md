---
title: Autoscale managed endpoints
titleSuffix:  Azure Machine Learning
description: Learn to scale up managed endpoints. Get more CPU, memory, disk space, and extra features.
ms.service: machine-learning
ms.subservice: core
ms.topic: concept
ms.author: seramasu
author: rsethur
ms.reviewer: laobri
ms.custom: devplatv2
ms.date: 08/30/2021

---
# Autoscale a managed endpoint (preview)

{>> TODO: Figure out where in TOC this should live.  <<}

Microsoft Azure autoscale adds and removes resources as load on your deployment changes. You specify a minimum and maximum number of instances {>> ??? Better word for what, exactly, you scale <<} to run, add, and remove. The minimum makes sure your application is available even under no load. The maximum allows you to control your total possible hourly cost. You specify the rules for scaling between these two extremes. For more, see [Overview of autoscale in Microsoft Azure](../azure-monitor/autoscale/autoscale-overview.md).

Today, you can manage autoscaling using either the Azure CLI or the browser-based Azure Portal. Other Azure ML SDKs, such as the Python SDK, will add support over time.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* A deployed endpoint. See [What are Azure Machine Learning endpoints (preview)](concept-endpoints.md) and [Deploy and score a machine learning model by using a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md). 

* [Optional] To manage autoscaling using the Azure CLI, you'll need at least the tk version of the `ml` extension. For more, see [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md). {>> ??? <<}

## Go to autoscale settings

# [Azure CLI](#tab/azure-cli)

tk cli tabbed content

# [Portal](#tab/azure-portal)

tk studio tabbed content

## Set minimum and maximum limits

tk

## Set rules for scaling 

tk 

## Scale related services

tk

## Confirm settings

tk

## Next steps

tk
