---
title: Disconnected scenario for Azure Stack Edge
description: Describes assumptions, available features when using Azure Stack Edge standalone with no connection to Azure services.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 02/24/2022
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to use Azure Stack Edge with no internet connection to meet my organization's security restrictions. 
---

# Disconnected scenario for Azure Stack Edge

[!INCLUDE [azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article helps you identify things to consider when you need to use Azure Stack Edge disconnected from the internet.

Typically, Azure Stack Edge is deployed in a connected scenario with access to the Azure portal, services, and resources in the cloud. However, security or other restrictions sometime require that you deploy your Azure Stack Edge device in an environment with no internet connection. As a result, Azure Stack Edge becomes a standalone deployment that is disconnected from and doesn't communicate with Azure and other Azure services.

## Assumptions

Before you disconnect your Azure Stack Edge device from the network that allows internet access, you'll make these preparations:

- To ensure most of the Azure Stack Edge features function in this disconnected mode, you'll activate your device via the Azure portal and deploy containerized and non-containerized workloads such as Kerberos, virtual machines (VMs), and IoT Edge use cases while you have an internet connection. 

   During offline use, you won't have access to the Azure portal to manage workloads; all management will be performed via operations local control plane operations. For a list of Azure endpoints that can't be reached during offline use, see [URL patterns for firewall rules](azure-stack-edge-gpu-system-requirements.md#url-patterns-for-firewall-rules).
 
- For an IoT Edge and Kubernetes deployment, you'll complete these tasks before you disconnect:

  1. Enable and configure IoT Edge and/or Kubernetes components.
  1. Deploy compute modules and containers on the device.
  1. Make sure the modules and components are running.
  
  For Kubernetes deployment guidance, see [Choose the deployment type](azure-stack-edge-gpu-kubernetes-workload-management.md#choose-the-deployment-type). For IoT Edge deployment guidance, see [Run a compute workload with IoT Edge module on Azure Stack Edge](azure-stack-edge-gpu-deploy-compute-module-simple.md).

  > [!NOTE]
  > Some workloads running in VMs, Kerberos, and IoT Edge may require connectivity to Azure. For example, some Azure AI services require connectivity for billing.

## Key differences for disconnected use

When an Azure Stack Edge deployment is disconnected, it can't reach Azure endpoints. This lack of access affects the features that are available.

The following table describes the behavior of features and components when the device is disconnected.

| Azure Stack Edge feature/component | Impact/behavior when disconnected |
|------------------------------------|-----------------------------------|
| Local UI and [Windows PowerShell interface](azure-stack-edge-gpu-connect-powershell-interface.md) | Local access via the local web UI or the Windows PowerShell interface is available by connecting a client computer directly to the device. |
| [Kubernetes](azure-stack-edge-gpu-kubernetes-overview.md) | Kubernetes deployments on a disconnected device have these differences:<ul><li>After you create your Kubernetes cluster, you can connect to and manage the cluster locally from your device using a native tool such as `kubectl`. With `kubectl`, a `kubeconfig` file allows the Kubernetes client to talk directly to the Kubernetes cluster without connecting to PowerShell interface of your device. Once you have the config file, you can direct the cluster using `kubectl` commands, without physical access to the cluster. For more information, see [Create and Manage a Kubernetes cluster on an Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-create-kubernetes-cluster.md).</li><li>Azure Stack Edge has a local container registry - the Edge container registry - to host container images. While your device is disconnected, you'll manage the deployment of these images, pushing them to and deleting them from the Edge container registry over your local network. You won't have direct access to the Azure Container Registry in the cloud. For more information, see [Enable an Edge container registry on an Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-edge-container-registry.md).</li><li>You can't monitor the Kubernetes cluster using Azure Monitor. Instead, use the local Kubernetes dashboard, available on the compute network. For more information, see [Monitor your Azure Stack Edge Pro device via the Kubernetes dashboard](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md).</li></ul>For more information, see [Kubernetes on your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-kubernetes-overview.md). |
| [Azure Arc on Kubernetes](azure-stack-edge-gpu-deploy-arc-kubernetes-cluster.md) | An Azure Arc-enabled Kubernetes deployment can't be used in a disconnected deployment. |
| Azure Arc-enabled data services | After the container images are deployed on the device, Azure Arc-enabled data services continue to run in a disconnected deployment. You'll deploy and manage those images over your local network. You'll push images to and delete them from the Edge container registry. For more information, see [Manage container registry images](azure-stack-edge-gpu-edge-container-registry.md#manage-container-registry-images). |
| [IoT Edge](azure-stack-edge-gpu-deploy-compute-module-simple.md) | IoT Edge modules need to be deployed and updated while connected to Azure. If disconnected from Azure, they continue to run. |
| [Azure Storage access tiers](azure-stack-edge-gpu-deploy-add-shares.md) | During disconnected use:<ul><li>Data in your Azure Storage account won't be uploaded to and from access tiers in the Azure cloud.</li><li>Ghosted data can't be accessed directly through the device. Any access attempt fails with an error.</li><li>The Refresh option can't be used to sync data in your Azure Storage account with shares in the Azure cloud. Data syncs resume when connectivity is established.</li></ul> |
| [VM management](azure-stack-edge-gpu-virtual-machine-overview.md) | During disconnected use, virtual machines can be created, modified, stopped, started, and deleted using the [local Azure Resource Manager (ARM)](azure-stack-edge-gpu-local-resource-manager-overview.md). However, VM images can't be downloaded to the device from the cloud. For more information, see [Deploy VMs on your Azure Stack Edge device via Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md). |
| [Local ARM](azure-stack-edge-gpu-local-resource-manager-overview.md) | Local Azure Resource Manager (ARM) can function without connectivity to Azure. However, connectivity is required during registration and configuration of Local ARM - for example, to [set the ARM Edge user password](azure-stack-edge-gpu-set-azure-resource-manager-password.md#reset-password-via-the-azure-portal) and ARM subscription ID. |
| [VPN](azure-stack-edge-mini-r-configure-vpn-powershell.md) | A configured virtual private network (VPN) remains intact when there's no connection to Azure. When connectivity to Azure is established, data-in-motion transfers over the VPN. |
| [Updates](azure-stack-edge-gpu-install-update.md?tabs=version-2106-and-later) | Automatic updates from Windows Server Update Services (WSUS) aren't available during disconnected use. To apply updates, download update packages manually and then apply them via the device's local web UI. |
| Supportability /<br>[Support log collection](azure-stack-edge-gpu-proactive-log-collection.md) /<br>[Remote supportability](azure-stack-edge-gpu-proactive-log-collection.md) | Microsoft Support is available, with these differences:<ul><li>You can't automatically generate a support request and send logs to Microsoft Support via the Azure portal. Instead, [collect a support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package) via the device's local web UI. Microsoft Support will send you a shared access signature (SAS) URI to upload the support packages to.</li><li>Microsoft can't perform remote diagnostics and repairs while the device is disconnected. Running the commands on the device requires direct communication with Azure.</li></ul> |
| Billing | Billing for your order resource or management resource continues whether or not your Azure Stack Edge device is connected to the internet. |
 
## Next steps

- Review use cases for [Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-overview.md#use-cases), [Azure Stack Edge Pro R](azure-stack-edge-pro-r-overview.md#use-cases), and [Azure Stack Edge Mini R](azure-stack-edge-mini-r-overview.md#use-cases).
- [Get pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/).
