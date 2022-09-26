---
title: Upgrade directly connected Azure Arc data controller using the portal
description: Article describes how to upgrade a directly connected Azure Arc data controller using the portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/07/2022
ms.topic: how-to
---

# Upgrade a directly connected Azure Arc data controller using the portal

This article describes how to upgrade a directly connected Azure Arc-enabled data controller using the Azure portal.

During a data controller upgrade, portions of the data control plane such as Custom Resource Definitions (CRDs) and containers may be upgraded. An upgrade of the data controller will not cause downtime for the data services (SQL Managed Instance or PostgreSQL server).

## Prerequisites

You will need a directly connected data controller with the imageTag v1.0.0_2021-07-30 or later.

To check the version, run:

```console
kubectl get datacontrollers -n <namespace> -o custom-columns=BUILD:.spec.docker.imageTag
```

## Upgrade data controller

This section shows how to upgrade a directly connected data controller.

> [!NOTE]
> Some of the data services tiers and modes are generally available and some are in preview.
> If you install GA and preview services on the same data controller, you can't upgrade in place.
> To upgrade, delete all non-GA database instances. You can find the list of generally available 
> and preview services in the [Release Notes](./release-notes.md).

For supported upgrade paths, see [Upgrade Azure Arc-enabled data services](upgrade-overview.md).


### Upgrade

Open your data controller resource. If an upgrade is available, you will see a notification on the **Overview** blade that says, "One or more upgrades are available for this data controller." 

Under **Settings**, select the **Upgrade Management** blade. 

In the table of available versions, choose the version you want to upgrade to and click "Upgrade Now". 

In the confirmation dialog box, click "Upgrade". 

## Monitor the upgrade status

To view the status of your upgrade in the portal, go to the resource group of the data controller and select the **Activity log** blade.  

You will see a "Validate Deploy" option that shows the status. 

[!INCLUDE [upgrade-rollback](includes/upgrade-rollback.md)]
