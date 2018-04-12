---
title: View containers logs in Azure Service Fabric | Microsoft Docs
description: Describes how to view container logs for a running Service Fabric container services using Service Fabric Explorer.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/09/2018
ms.author: ryanwi

---
# View logs for a Service Fabric container service
Azure Service Fabric is a container orchestrator and supports both [Linux and Windows containers](service-fabric-containers-overview.md).  This article describes how to view container logs of a running container service so that you can diagnose and troubleshoot problems.

## Access container logs
Container logs can be accessed using [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).  In a web browser, open Service Fabric Explorer from the cluster's management endpoint by navigating to [http://mycluster.region.cloudapp.azure.com:19080/Explorer](http://mycluster.region.cloudapp.azure.com:19080/Explorer).  

Container logs are located on the cluster node that the container service instance is running on. As an example, get the logs of the web front-end container of the [Linux Voting sample application](service-fabric-quickstart-containers-linux.md). In the tree view, expand **Cluster**>**Applications**>**VotingType**>**fabric:/Voting/azurevotefront**.  Then expand the partition (d1aa737e-f22a-e347-be16-eec90be24bc1, in this example) and see that the container is running on cluster node *_lnxvm_0*.

In the tree view, find the code package on the *_lnxvm_0* node by expanding **Nodes**>**_lnxvm_0**>**fabric:/Voting**>**azurevotfrontPkg**>**Code Packages**>**code**.  Then select the **Container Logs** option to display the container logs.

![Service Fabric platform][Image1]


## Next steps
- Work through the [Create a Linux container application tutorial](service-fabric-tutorial-create-container-images.md).
- Learn more about [Service Fabric and containers](service-fabric-containers-overview.md)

[Image1]: media/service-fabric-containers-view-logs/view-container-logs-sfx.png
