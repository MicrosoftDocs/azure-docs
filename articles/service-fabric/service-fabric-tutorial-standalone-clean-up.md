---
title: Clean up a standalone cluster
description: In this tutorial, learn how to delete AWS or Azure resources for your standalone Service Fabric cluster.
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Tutorial: Clean up your standalone cluster

Service Fabric standalone clusters offer you the option to choose your own environment to host Service Fabric. In this tutorial series, you'll create a standalone cluster hosted on AWS or Azure and deploy an application to it.

This tutorial is part four of a series. This part of the tutorial shows you how to delete the AWS or Azure resources that you created to host your Service Fabric cluster.

In this article, you'll learn to:

> [!div class="checklist"]
> * Remove a Service Fabric cluster
> * Delete your AWS or Azure resources

## Remove a Service Fabric cluster

1. RDP into the VM that you used to installed Service Fabric.
2. Open PowerShell.
3. Change the directory to the extracted folder from the second tutorial.
4. Run the following command to remove the Service Fabric cluster:

  ```powershell
  .\RemoveServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.MultiMachine.json
  ```

5. Enter `Y` when prompted. If it was successful, your output will look like the following (with your own IP addresses):

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

## Delete AWS resources

1. Sign in to your AWS Account.
2. Go to the EC2 Console.
3. Select the three nodes that you created in part one of the tutorial.
4. Select **Actions** > **Instance State** > **Terminate**.

## Delete Azure resources

1. Sign in to the Azure portal.
2. Go to the **Virtual Machines** section.
3. Select check boxes for the three nodes that you created in part one of the tutorial.
4. Select **Delete**.

## Next steps

In this tutorial, you learned how to delete the resources you created in previous steps.

> [!div class="checklist"]
> * Clean up your resources

> [!div class="nextstepaction"]
> [Back to the beginning](service-fabric-tutorial-standalone-create-infrastructure.md)
