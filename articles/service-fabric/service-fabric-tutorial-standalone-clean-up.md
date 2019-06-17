---
title: Tutorial cleanup Service Fabric standalone cluster - Azure Service Fabric | Microsoft Docs
description: In this tutorial you learn how to cleanup your standalone cluster
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: chackdan
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/11/2018
ms.author: dekapur
ms.custom: mvc
---
# Tutorial: Clean up your standalone cluster

Service Fabric standalone clusters offer you the option to choose your own environment and create a cluster as part of the "any OS, any cloud" approach that Service Fabric is taking. In this tutorial series, you create a standalone cluster hosted on AWS and install an application into it.

This tutorial is part four of a series. This part of the tutorial shows you how to clean up the AWS resources that you created to host your Service Fabric cluster.

In part four of the series, you learn how to:

> [!div class="checklist"]
> * Clean up Service Fabric cluster
> * Clean up your AWS resources

## Clean up Service Fabric cluster

* RDP into the EC2 instance that you used to installed Service Fabric
* Open PowerShell
* Change the directory to the extracted folder from the second tutorial.
* Run the following command to remove the Service Fabric cluster:

```powershell
.\RemoveServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.MultiMachine.json
```

* `Y` when prompted, if it was successful your output will look like the following, with your own IP addresses substituted in:

```powershell
Best Practices Analyzer completed successfully.
Removing configuration from machine 172.31.21.141
Removing configuration from machine 172.31.27.1
Removing configuration from machine 172.31.20.163
Configuration removed from machine 172.31.21.141
Configuration removed from machine 172.31.27.1
Configuration removed from machine 172.31.20.163
The cluster is successfully removed.
```

## Clean up AWS resources

* Sign in to your AWS Account
* Go to the EC2 Console.
* Select the three nodes that you created in part one of the tutorial.
* Click on **Actions** > **Instance State** > **Terminate**

## Next steps

In part four of the series, you learned how to clean up your resources that were created in previous steps.

> [!div class="checklist"]
> * Clean up your resources

> [!div class="nextstepaction"]
> [Back to the beginning](service-fabric-tutorial-standalone-create-infrastructure.md)