---
title: Minimum initial host deployment 
description: The minimum initial deployment is three hosts. 
ms.topic: include
ms.date: 04/28/2021
author: shortpatti
ms.author: v-patsho
ms.service: azure-vmware
---

<!-- Used in plan-private-cloud-deployment.md and concepts-private-clouds-clusters.md -->

For each private cloud created, there's one vSAN cluster by default. You can add, delete, and scale clusters.  The minimum number of hosts per cluster and the initial deployment is three. 

Trial clusters are available for evaluation and are limited to three hosts per private cloud.

You use vSphere and NSX-T Manager to manage most other aspects of cluster configuration or operation. All local storage of each host in a cluster is under the control of vSAN.

>[!TIP]
>You can always extend the cluster and add additional clusters later if you need to go beyond the initial deployment number.
