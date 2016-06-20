<properties
   pageTitle="PowerShell script to deploy Linux HPC cluster | Microsoft Azure"
   description="Run a PowerShell script to deploy a Linux HPC Pack cluster in Azure infrastructure services"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor=""
   tags="azure-service-management,hpc-pack"/>
<tags
   ms.service="virtual-machines-linux"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="big-compute"
   ms.date="04/05/2016"
   ms.author="danlep"/>

# Create a Linux high performance computing (HPC) cluster with the HPC Pack IaaS deployment script

Run the HPC Pack IaaS deployment PowerShell script on a client
computer to deploy a complete HPC cluster for Linux workloads in Azure infrastructure
services (IaaS). If you want to deploy an HPC Pack cluster in Azure for Windows workloads, see [Create a Windows HPC cluster with the HPC Pack IaaS deployment script](virtual-machines-windows-classic-hpcpack-cluster-powershell-script.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Resource Manager model.

[AZURE.INCLUDE [virtual-machines-common-classic-hpcpack-cluster-powershell-script](../../includes/virtual-machines-common-classic-hpcpack-cluster-powershell-script.md)]

## Example configuration files

### Example 1

The following configuration file creates a new domain forest
and deploys an HPC Pack cluster which has 1 head node with local
databases and 20 Linux compute nodes. All the cloud services are created
directly in the East Asia location. The Linux compute nodes are created
in 4 cloud services and 4 storage accounts (i.e. _MyLnxCN-0001_ to
_MyLnxCN-0005_ in _MyLnxCNService01_ and _mylnxstorage01_, _MyLnxCN-0006_ to
_MyLnxCN-0010_ in _MyLnxCNService02_ and _mylnxstorage02_, _MyLnxCN-0011_ to
_MyLnxCN-0015_ in _MyLnxCNService03_ and _mylnxstorage03_, and _MyLnxCN-0016_ to
_MyLnxCN-0020_ in _MyLnxCNService04_ and _mylnxstorage04_). The compute nodes
are created from an OpenLogic CentOS version 7.0 Linux image.

```
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
    <NodeCount>20</NodeCount>
    <ImageName>5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-70-20150325 </ImageName>
    <SSHKeyPairForRoot>
      <PfxFile>d:\mytestcert1.pfx</PfxFile>
      <Password>MyPsw!!2</Password>
    </SSHKeyPairForRoot>
  </LinuxComputeNodes>
</IaaSClusterConfig>
```
## Troubleshooting

* **“VNet doesn’t exist” error** - If you run the HPC Pack IaaS deployment script to deploy multiple
clusters in Azure concurrently under one subscription, one or more
deployments may fail with the error “VNet *VNet\_Name* doesn't exist”.
If this error occurs, re-run the script for the failed deployment.

* **Problem accessing the Internet from the Azure virtual network** - If you create an HPC Pack cluster with a new domain controller by using
the deployment script, or you manually promote a head node VM to domain
controller, you may experience problems connecting the VMs in the Azure
virtual network to the Internet. This can occur if a forwarder DNS
server is automatically configured on the domain controller, and this
forwarder DNS server doesn’t resolve properly.

    To work around this problem, log on to the domain controller and either
    remove the forwarder configuration setting or configure a valid
    forwarder DNS server. To do this, in Server Manager click **Tools** >
    **DNS** to open DNS Manager, and then double-click **Forwarders**.
    
## Next steps

* For tutorials that use the script to create a cluster and run a Linux HPC workload, see [Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure](virtual-machines-linux-classic-hpcpack-cluster-namd.md) or [Run OpenFOAM with Microsoft HPC Pack on Linux compute nodes in Azure](virtual-machines-linux-classic-hpcpack-cluster-openfoam.md).

* You can also use an Azure Resource Manager template to deploy an HPC Pack cluster. For an example, see [Create an HPC cluster with Linux compute nodes](https://azure.microsoft.com/documentation/templates/create-hpc-cluster-linux-cn/).
