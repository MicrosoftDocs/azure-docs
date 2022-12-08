---
title: Deploy Azure Kubernetes Service on Azure Stack Edge
description: Learn how to deploy and configure Azure Kubernetes Service on Azure Stack Edge.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 12/08/2022
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to deploy and configure Azure Kubernetes Service on Azure Stack Edge.
---
# Deploy Azure Kubernetes Service on Azure Stack Edge

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to deploy and manage Azure Kubernetes Service (AKS) on your Azure Stack Edge device.

## Overview

The high-level workflow for this article is as follows:

- Step 1. Enable Azure Kubernetes Service (AKS) and custom locations.

- Step 2. Specify static IP pools for Kubernetes pods. 

- Step 3. Configure compute virtual switch.

- Step 4. Enable cloud management VM role through Azure portal.

- Step 5. Set up Kubernetes cluster and enable Arc.

- Add a persistent volume.

- Manage via Azure Arc enabled Kubernetes.

- Remove the Kubernetes Service.

## About Azure Kubernetes Service on Azure Stack Edge

Azure Stack Edge Pro with GPU is an AI-enabled edge computing device with high performance network I/O capabilities. Microsoft ships you a cloud-managed device that acts as network storage gateway and has a built-in Graphical Processing Unit (GPU) that enables accelerated AI-inferencing.

On your Azure Stack Edge device, you can configure compute. With compute configured, you can then use the Azure portal to deploy the Kubernetes cluster including the infrastructure VMs. This cluster is then used for workload deployment via kubectl or Azure Arc.

## Scenarios covered in this article

The following scenarios are described in this article:

1. **Deploy AKS on your device.** This can be done with or without configuring the Azure Arc for Kubernetes clusters as an addon. 
- If you enable Azure Arc on Kubernetes cluster, use Azure Arc to manage your cluster. 
- If you disable Azure Arc, you can use kubectl to manage your cluster.

2. **Remove AKS.** When you remove the Azure Kubernetes Service, this action also removes the Azure Arc for Kubernetes cluster option.

3. **Create Persistent Volumes (PVs).** Allocate storage for your Kubernetes workload deployments by creating Persistent Volumes.

4. **Manage via Arc-enabled Kubernetes.** You can use the GitOps configuration to manage Arc-enabled Kubernetes cluster.

This guide provides a step-by-step procedure of the preceding scenarios.  The target audience for this guide is IT administrators who are familiar with setup and deployment of workloads on the Azure Stack Edge device.

## Prerequisites

Before you begin, ensure that:

- You have your Microsoft account with access credentials to access Azure portal.
- You have access to an Azure Stack Edge Pro GPU device. This device will be configured and activated as per the detailed instructions in [Set up and activate your device](azure-stack-edge-gpu-deploy-checklist.md).
- You have at least one virtual switch created and enabled for compute on your Azure Stack Edge device as per the instructions in [Create virtual switches](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md?pivots=single-node#configure-virtual-switches-and-compute-ips).
- You have a client to access your device. The client system is running a supported operating system. If using a Windows client, make sure that it is running PowerShell 5.0 or later.
- Before you enable Azure Arc on the Kubernetes cluster, make sure that you’ve enabled and registered `Microsoft.Kubernetes` and `Microsoft.KubernetesConfiguration` resource providers against your subscription as per the detailed instructions in [Register resource providers via Azure CLI](../../azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli#register-providers-for-azure-arc-enabled-kubernetes).
- If you intend to deploy Azure Arc for Kubernetes cluster, you’ll need to create a resource group. You must have owner level access to this resource group.
- To verify the access level for the resource group, go to **Resource group** > **Access control (IAM)** > **View my access**. Under **Role assignments**, you should be listed as an Owner.

    ![Screenshot showing assignments for the selected user on the Access control (IAM) page in the Azure portal.](./media/azure-stack-edge-deploy-aks-on-azure-stack-edge/azure-stack-edge-access-control-my-assignments.png)

Depending on the workloads you intend to deploy, you may need to ensure the following **optional** steps are also completed: 
- If you intend to deploy [custom locations](../../azure-arc/platform/conceptual-custom-locations.md) on your Arc-enabled cluster, you’ll need to register the `Microsoft.ExtendedLocation` resource provider against your subscription. You would also need to fetch the custom location object ID and use it to enable custom locations via the PowerShell interface of your device.

   Here is a sample output using the Azure CLI. You can run the same commands via the Cloud Shell in the Azure portal.

   ```azurepowershell
   az login
   az ad sp show --id 'bc313c14-388c-4e7d-a58e-70017303ee3b' --query objectId -o tsv
   ```

  For more information, see [Create and manage custom locations in Arc-enabled Kubernetes](../../azure-arc/kubernetes/custom-locations.md).

- If deploying Kubernetes or PMEC workloads, you may need virtual networks that you’ve added as per the instructions in [Create virtual networks](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md?pivots=single-node#configure-virtual-network).
- If using a high performance network VM as your Kubernetes VM, you would need to reserve the vCPUs as described in the steps to [reserve vCPUs on HPN VMs](azure-stack-edge-gpu-deploy-virtual-machine-high-performance-network.md?tabs=2210#prerequisites) with the following differences:
   - Skip steps 1 to 3 that include the start and stop VM commands as we don’t have any VMs.
   - Get the logical processor indexes to reserve for HPN VMs.

     ```azurepowershell
     Get-HcsNumaLpMapping -MapType HighPerformanceCapable -NodeName (hostname)
     ```

   - Reserve all the supplied vCPUs that you got from the preceding step into `Set-HcsNumaLpMapping` command. The device will automatically reboot at this point. Wait for the reboot to complete.
   Here is an example output where all the vcpus were reserved:

     ```azurepowershell
     [10.126.77.42]: PS>hostname
     1DGNHQ2
     [10.126.77.42]: PS>Get-HcsNumaLpMapping -MapType HighPerformanceCapable -NodeName 1DGNHQ2
     { Numa Node #0 : CPUs [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] }
     { Numa Node #1 : CPUs [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39] }
     [10.126.77.42]: PS>Set-HcsNumaLpMapping -CpusForHighPerfVmsCommaSeperated "4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39" -AssignAllCpusToRoot $false
    ```

## Step 1. Enable Azure Kubernetes Service (AKS) and custom locations


## Step 2. Specify static IP pools for Kubernetes pods


## Step 3. Configure compute virtual switch


## Step 4. Enable cloud management VM role through Azure portal


## Step 5. Set up Kubernetes cluster and enable Arc


## Add a persistent volume


## Manage via Azure Arc enabled Kubernetes


## Remove the Kubernetes Service


## Next steps

