---
title: Monitor Azure Docker Swarm cluster - Dynatrace | Microsoft Docs
description: Monitor an Azure Container Service Docker Swarm cluster with Dynatrace. Deploy the Dynatrace OneAgent by using Azure CLI 2.0 or PowerShell commandlets.
services: container-service
documentationcenter: ''
author: MartinGoodwell
manager: ''
editor: ''
tags: acs, azure-container-service
keywords: Containers, Docker, Azure, Swarm

ms.assetid:
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/13/2016
ms.author: rogardle

---
# Monitor an Azure Container Service Docker Swarm cluster with Dynatrace SaaS/Managed
In this article, we show you how to deploy the [Dynatrace](https://www.dynatrace.com/) OneAgent to monitor all the agent nodes in your Azure Container Service Docker Swarm cluster. You need an account with Dynatrace SaaS/Managed for this configuration. 

## Dynatrace SaaS/Managed
Dynatrace is a cloud-native monitoring solution for highly dynamic container and cluster environments. It allows you to better optimize your container deployments and memory allocations by using real-time usage data. It is capable of automatically pinpointing application and infrastructure issues by providing automated baselining, problem correlation, and root-cause detection.

The following figure shows the Dynatrace UI:

![Dynatrace UI](./media/container-service-docker-swarm-monitoring-dynatrace/swarm.png)

## Prerequisites 
[Deploy](container-service-deployment.md) and [connect](./../container-service-connect.md) to a cluster configured by Azure Container Service. Go to [https://www.dynatrace.com/trial/](https://www.dynatrace.com/trial/) to set up a Dynatrace SaaS account.  

## Configure a Dynatrace deployment with Docker Swarm
Docker Swarm clusters on Azure Container Services are built around VM Scale Sets. You can leverage Azure CLI or PowerShell Commandlets to deploy the Dynatrace OneAgent on them. This way, any new node that's added to the cluster and any containers running on it is automatically monitored.
These steps show you how to configure and deploy Dynatrace applications to your Docker Swarm cluster.

> [!NOTE]
> Regardless of whether you're using Azure CLI or PowerShell commandlets, you can replace `oneAgentWindows` by `oneAgentLinux` in case your cluster is running on Linux instead of Windows.

1. You need a Dynatrace SaaS account or a free trial account. Once you log into the Dynatrace dashboard, select **Deploy Dynatrace**.

    ![Dynatrace Set up PaaS integration](./media/container-service-monitoring-dynatrace/setup-paas.png)

2. On the page, select **Set up PaaS integration**. 

    ![Dynatrace API token](./media/container-service-monitoring-dynatrace/api-token.png) 

3. Execute the following command on Azure CLI 2.0

```bash
az vmss extension set
  -n oneAgentWindows
  --publisher dynatrace.ruxit
  -g "<resource group name>"
  --vmss-name "<VMSS name>"
  --settings "{\"tenantId\":\"<your environment ID>\",\"token\":\"<PaaS token>\"}"
```

In case you are using Dynatrace Managed, please make sure to add the server's address to the settings JSON. The according value is the address only, without https:// and without any subpaths.

```bash
--settings "{\"server\":\"<Dynatrace Managed URL>\",\"tenantId\":\"<your environment ID>\",\"token\":\"<PaaS token>\"}"
```

If you prefer PowerShell commandlets, please execute the following command:

```powershell
Add-AzureRmVmssExtension
  -Name oneAgentWindows
  -Publisher dynatrace.ruxit
  -Type oneAgentWindows
  -TypeHandlerVersion 1.99
  -AutoUpgradeMinorVersion $true
  -Setting @{ "tenantId"="<your environment ID>"; "token"="<PaaS token>" }
  -VirtualMachineScaleSet $vmss
```

In case you are using Dynatrace Managed, please make sure to add the server's address to the settings parameters. The according value is the address only, without https:// and without any subpaths.
```powershell
-Setting @{ "server"="<Dynatrace Managed URL>"; "tenantId"="<your environment ID>"; "token"="<PaaS token>" }
```

5. To make sure all your services are monitored properly, restart the VM Scale Set.

## Next steps

Once you've installed the package, navigate back to the Dynatrace dashboard. You can explore the different usage metrics for the containers within your cluster. The nodes and the deployed services should appear automatically after a few minutes.

