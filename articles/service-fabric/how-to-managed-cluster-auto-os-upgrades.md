---
title: Enable automatic OS upgrades for Service Fabric managed cluster (preview) nodes
description: Learn how to enable automatic OS upgrades for Azure Service Fabric managed cluster nodes.
ms.topic: how-to
ms.date: 02/15/2021
---
# Enable automatic OS upgrades for Service Fabric managed cluster (preview) nodes



Enabled using the EnableAutoOSUpgrade property on the cluster set to true. 
-	All things happen in background, first we will start to query and track the OS image versions for this cluster.
-	If there is new OS image version available we will check the existing node types / VMSS and upgrade them
-	Currently we only upgrade one node type at a time, for a cluster
-	If the upgrade fails, we will retry after 24 hours, to a max of 3 retries
-	Similar to any other cluster upgrades though, unhealthy apps / nodes may block the upgrade / repair job
-	If node types are going through OS upgrades we don't start SF runtime rollout (i.e. 7.1 -> 7.2)
