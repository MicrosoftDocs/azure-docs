<properties
   pageTitle="Troubleshoot VM deployment-Classic | Microsoft Azure"
   description="Troubleshoot classic deployment issues when you create a new virtual machine in Azure"
   services="virtual-machines, azure-classic"
   documentationCenter=""
   authors="jiangchen79"
   manager="felixwu"
   editor=""
   tags="top-support-issue"/>

<tags
  ms.service="virtual-machines"
  ms.workload="na"
  ms.tgt_pltfrm="vm"
  ms.devlang="na"
  ms.topic="article"
   ms.date="04/27/2016"
   ms.author="cjiang"/>

# Troubleshoot classic deployment issues with creating a new Azure Virtual Machine

[AZURE.INCLUDE [troubleshoot-deployment-new-vm-selectors](../../includes/troubleshoot-deployment-new-vm-selectors-include.md)]

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Resource Manager model.

[AZURE.INCLUDE [troubleshoot-deployment-new-vm-opening](../../includes/troubleshoot-deployment-new-vm-opening-include.md)]

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting steps

### Identify your issues

To start troubleshooting your deployment issue, you must begin by collecting the audit logs to identify the error associated with the issue. Here’s how:

In the Azure portal, click **Browse** > **Virtual machines** > *your Windows virtual machine* > **Settings** > **Audit logs**.

### Resolve your issue
[AZURE.INCLUDE [troubleshoot-deployment-new-vm-issue1](../../includes/troubleshoot-deployment-new-vm-issue1-include.md)]

#### Issue 2: You’re using a custom, gallery or marketplace image, and the audit log indicates an allocation failure
This error arises in situations when the new VM request is sent to a cluster that either does not have available free space to accommodate the request, or cannot support the VM size being requested. It is not possible to mix different series of VMs in the same cloud service. So if you want to create a new VM of a different size than what your cloud service can support, the compute request will fail.

Depending on the constraints of the cloud service you use to create the new VM, you might encounter an error caused by one of two situations.

**Cause 1:** The cloud service is pinned to a specific cluster, or it is linked to an affinity group, and hence pinned to a specific cluster by design. So new compute resource requests in that affinity group are tried in the same cluster where the existing resources are hosted. However, the same cluster may either not support the requested VM size or have insufficient available space, resulting in an allocation error. This is true whether the new resources are created through a new cloud service or through an existing cloud service.

**Resolution 1:** Create a new cloud service and associate it with either a region or a region-based virtual network. Then create a new VM in it.

If you get an error when trying to create a new cloud service, either retry after some time or change the region for the cloud service.

> [AZURE.IMPORTANT] If you were trying to create a new VM in an existing cloud service but couldn’t, and had to create a new cloud service for your new VM, you can choose to consolidate all your VMs to be in the same cloud service. To do so, delete the VMs in the existing cloud service, and recreate them from their disks in the new cloud service. However, it is important to remember that the new cloud service will have a new name and VIP, so you will need to change that information for all the dependencies that use that information for the existing cloud service.

**Cause 2:** The cloud service is associated with a virtual network that is linked to an affinity group, so it is pinned to a specific cluster by design. All new compute resource requests in that affinity group are therefore tried in the same cluster where the existing resources are hosted. However, the same cluster may either not support the requested VM size or have insufficient available space, resulting in an allocation error. This is true whether the new resources are created through a new cloud service or through an existing cloud service.

**Resolution 2:** Create a new regional virtual network, create the new VM, and then [connect](https://azure.microsoft.com/blog/vnet-to-vnet-connecting-virtual-networks-in-azure-across-different-regions/) your existing virtual network to the new virtual network. See more [about regional virtual networks](https://azure.microsoft.com/blog/2014/05/14/regional-virtual-networks/). Alternatively, you can [migrate your affinity-group-based virtual network to a regional virtual network](https://azure.microsoft.com/blog/2014/11/26/migrating-existing-services-to-regional-scope/), and then create the new VM.
