---
title: PowerShell script to deploy Linux HPC cluster | Microsoft Docs
description: Run a PowerShell script to deploy a Linux HPC Pack 2012 R2 cluster in Azure virtual machines
services: virtual-machines-linux
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-service-management,hpc-pack

ms.assetid: 73041960-58d3-4ecf-9540-d7e1a612c467
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: big-compute
ms.date: 12/29/2016
ms.author: danlep

---
# Create a Linux high-performance computing (HPC) cluster with the HPC Pack IaaS deployment script
Run the HPC Pack IaaS deployment PowerShell script to deploy a complete HPC Pack 2012 R2 cluster for Linux workloads in Azure virtual machines. The cluster consists of an Active Directory-joined head node running Windows Server and Microsoft HPC Pack, and compute nodes that run one of the Linux distributions supported by HPC Pack. If you want to deploy an HPC Pack cluster in Azure for Windows workloads, see [Create a Windows HPC cluster with the HPC Pack IaaS deployment script](../../windows/classic/hpcpack-cluster-powershell-script.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json). You can also use an Azure Resource Manager template to deploy an HPC Pack cluster. For an example, see [Create an HPC cluster with Linux compute nodes](https://azure.microsoft.com/documentation/templates/create-hpc-cluster-linux-cn/).

> [!IMPORTANT] 
> The PowerShell script described in this article creates a Microsoft HPC Pack 2012 R2 cluster in Azure using the classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model.
> In addition, the script described in this article does not support HPC Pack 2016.

[!INCLUDE [virtual-machines-common-classic-hpcpack-cluster-powershell-script](../../../../includes/virtual-machines-common-classic-hpcpack-cluster-powershell-script.md)]

## Example configuration file
The following configuration file creates a domain controller and domain forest
and deploys an HPC Pack cluster which has one head node with local
databases and 10 Linux compute nodes. All the cloud services are created
directly in the East Asia location. The Linux compute nodes are created
in two cloud services and two storage accounts (that is, *MyLnxCN-0001* to
*MyLnxCN-0005* in *MyLnxCNService01* and *mylnxstorage01*, and *MyLnxCN-0006* to
*MyLnxCN-0010* in *MyLnxCNService02* and *mylnxstorage02*). The compute nodes
are created from an OpenLogic CentOS version 7.0 Linux image. 

Substitute your own values for your subscription name and the account and service names.

```Xml
<?xml version="1.0" encoding="utf-8" ?>
<IaaSClusterConfig>
  <Subscription>
    <SubscriptionName>Subscription-1</SubscriptionName>
    <StorageAccount>mystorageaccount</StorageAccount>
  </Subscription>
  <Location>East Asia</Location>  
  <VNet>
    <VNetName>MyVNet</VNetName>
    <SubnetName>Subnet-1</SubnetName>
  </VNet>
  <Domain>
    <DCOption>NewDC</DCOption>
    <DomainFQDN>hpc.local</DomainFQDN>
    <DomainController>
      <VMName>MyDCServer</VMName>
      <ServiceName>MyHPCService</ServiceName>
      <VMSize>Large</VMSize>
    </DomainController>
  </Domain>
  <Database>
    <DBOption>LocalDB</DBOption>
  </Database>
  <HeadNode>
    <VMName>MyHeadNode</VMName>
    <ServiceName>MyHPCService</ServiceName>
    <VMSize>ExtraLarge</VMSize>
  </HeadNode>
  <LinuxComputeNodes>
    <VMNamePattern>MyLnxCN-%0001%</VMNamePattern>
    <ServiceNamePattern>MyLnxCNService%01%</ServiceNamePattern>
    <MaxNodeCountPerService>5</MaxNodeCountPerService>
    <StorageAccountNamePattern>mylnxstorage%01%</StorageAccountNamePattern>
    <VMSize>Medium</VMSize>
    <NodeCount>10</NodeCount>
    <ImageName>5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-70-20150325 </ImageName>
  </LinuxComputeNodes>
</IaaSClusterConfig>
```
## Troubleshooting
* **“VNet doesn’t exist” error**. If you run the HPC Pack IaaS deployment script to deploy multiple
  clusters in Azure concurrently under one subscription, one or more
  deployments may fail with the error “VNet *VNet\_Name* doesn't exist”.
  If this error occurs, rerun the script for the failed deployment.
* **Problem accessing the Internet from the Azure virtual network**. If you create an HPC Pack cluster with a new domain controller by using
  the deployment script, or you manually promote a head node VM to domain
  controller, you may experience problems connecting the VMs in the Azure
  virtual network to the Internet. This can occur if a forwarder DNS
  server is automatically configured on the domain controller, and this
  forwarder DNS server doesn’t resolve properly.
  
    To work around this problem, log on to the domain controller and either remove the forwarder configuration setting or configure a valid forwarder DNS server. To do this, in Server Manager click **Tools** > **DNS** to open DNS Manager, and then double-click **Forwarders**.

## Next steps
* See [Get started with Linux compute nodes in an HPC Pack cluster in Azure](hpcpack-cluster.md) for information about supported Linux distributions, moving data, and submitting jobs to an HPC Pack cluster with Linux compute nodes.
* For tutorials that use the script to create a cluster and run a Linux HPC workload, see:
  * [Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure](hpcpack-cluster-namd.md)
  * [Run OpenFOAM with Microsoft HPC Pack on Linux compute nodes in Azure](hpcpack-cluster-openfoam.md)
  * [Run STAR-CCM+ with Microsoft HPC Pack on Linux compute nodes in Azure](hpcpack-cluster-starccm.md)

