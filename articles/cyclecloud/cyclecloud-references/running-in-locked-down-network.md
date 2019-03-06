---
title: Azure CycleCloud in locked down networks| Microsoft Docs
description: Running Azure CycleCloud in locked down networks.
services: azure cyclecloud
author: anhoward
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 2/26/2018
ms.author: anhoward
---

# Installing and running Azure CycleCloud in a locked down network

While it is possible to run CycleCloud and clusters in locked down networks,
there are a few ports that need to be open between the CycleCloud server and the
cluster nodes when the clusters are deployed in separate subnets from the
CycleCloud server. The following ports need to be open between the compute subnet
to the CycleCloud server:

| Name        | Source            | Destination    | Service | Protocol | Port Range |
| ----------- | ----------------- | -------------- | ------- | -------- | ---------- |
| amqp_5672*  | Compute Subnet    | CycleCloud     | AMQP    | TCP      | 5672       |
| https_9443* | Compute Subnet    | CycleCloud     | HTTPS   | TCP      | 9443       |
| ssh_22      | CycleCloud        | Compute Subnet | SSH     | TCP      | 22

>[!Note] Clusters using a Return Proxy to the master node do not need the AMQP
>or HTTPS rules. They will still need access to port 22 to set up the return
>proxy
