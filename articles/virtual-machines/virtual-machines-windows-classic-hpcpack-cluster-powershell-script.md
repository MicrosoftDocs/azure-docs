<properties
   pageTitle="PowerShell script to deploy Windows HPC cluster | Microsoft Azure"
   description="Run a PowerShell script to deploy a Windows HPC Pack cluster in Azure virtual machines"
   services="virtual-machines-windows"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor=""
   tags="azure-service-management,hpc-pack"/>
<tags
   ms.service="virtual-machines-windows"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="big-compute"
   ms.date="07/07/2016"
   ms.author="danlep"/>

# Create a Windows high performance computing (HPC) cluster with the HPC Pack IaaS deployment script

Run the HPC Pack IaaS deployment PowerShell script to deploy a complete HPC cluster for Windows workloads in Azure virtual machines. The cluster consists of an Active Directory-joined head node running Windows Server and Microsoft HPC Pack, and additional Windows compute resources you specify. If you want to deploy an HPC Pack cluster in Azure for Linux workloads, see [Create a Linux HPC cluster with the HPC Pack IaaS deployment script](virtual-machines-linux-classic-hpcpack-cluster-powershell-script.md). You can also use an Azure Resource Manager template to deploy an HPC Pack cluster. For examples, see [Create an HPC cluster](https://azure.microsoft.com/documentation/templates/create-hpc-cluster/) and [Create an HPC cluster with a custom compute node image](https://azure.microsoft.com/documentation/templates/create-hpc-cluster-custom-image/).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]

[AZURE.INCLUDE [virtual-machines-common-classic-hpcpack-cluster-powershell-script](../../includes/virtual-machines-common-classic-hpcpack-cluster-powershell-script.md)]

## Example configuration files

In the following examples, substitute your own values for your subscription Id or name and the account and service names.

### Example 1

The following configuration file deploys an HPC Pack cluster
which has a head node with local databases and 5 compute nodes running
the Windows Server 2012 R2 operating system. All the cloud services are
created directly in the West US location. The head node acts as domain
controller of the domain forest.

```
<?xml version="1.0" encoding="utf-8" ?>
<IaaSClusterConfig>
  <Subscription>
    <SubscriptionId>08701940-C02E-452F-B0B1-39D50119F267</SubscriptionId>
    <StorageAccount>mystorageaccount</StorageAccount>
  </Subscription>
  <Location>West US</Location>  
  <VNet>
    <VNetName>MyVNet</VNetName>
    <SubnetName>Subnet-1</SubnetName>
  </VNet>
  <Domain>
    <DCOption>HeadNodeAsDC</DCOption>
    <DomainFQDN>hpc.local</DomainFQDN>
  </Domain>
  <Database>
    <DBOption>LocalDB</DBOption>
  </Database>
  <HeadNode>
    <VMName>MyHeadNode</VMName>
    <ServiceName>MyHPCService</ServiceName>
    <VMSize>ExtraLarge</VMSize>
  </HeadNode>
  <ComputeNodes>
    <VMNamePattern>MyHPCCN-%1000%</VMNamePattern>
    <ServiceName>MyHPCCNService</ServiceName>
    <VMSize>Medium</VMSize>
    <NodeCount>5</NodeCount>
    <OSVersion>WindowsServer2012R2</OSVersion>
  </ComputeNodes>
</IaaSClusterConfig>
```

### Example 2

The following configuration file deploys an HPC Pack cluster in an existing domain forest. The cluster has 1 head node with local databases and 12 compute nodes with the BGInfo VM extension applied.
Automatic installation of Windows updates is disabled for all the VMs in
the domain forest. All the cloud services are created directly in the
East Asia location. The compute nodes are created in 3 cloud services
and 3 storage accounts (i.e., _MyHPCCN-0001_ to _MyHPCCN-0005_ in
_MyHPCCNService01_ and _mycnstorage01_; _MyHPCCN-0006_ to _MyHPCCN0010_ in
_MyHPCCNService02_ and _mycnstorage02_; and _MyHPCCN-0011_ to _MyHPCCN-0012_ in
_MyHPCCNService03_ and _mycnstorage03_). The compute nodes are created from
an existing private image captured from a compute node. The auto grow
and shrink service is enabled with default grow and shrink intervals.

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
     <NoWindowsAutoUpdate />
  </Domain>
  <Database>
    <DBOption>LocalDB</DBOption>
  </Database>
  <HeadNode>
    <VMName>MyHeadNode</VMName>
    <ServiceName>MyHPCService</ServiceName>
    <VMSize>ExtraLarge</VMSize>
  </HeadNode>
  <Certificates>
    <Certificate>
      <Id>1</Id>
      <PfxFile>d:\mytestcert1.pfx</PfxFile>
      <Password>MyPsw!!2</Password>
    </Certificate>
  </Certificates>
  <ComputeNodes>
    <VMNamePattern>MyHPCCN-%0001%</VMNamePattern>
<ServiceNamePattern>MyHPCCNService%01%</ServiceNamePattern>
<MaxNodeCountPerService>5</MaxNodeCountPerService>
<StorageAccountNamePattern>mycnstorage%01%</StorageAccountNamePattern>
    <VMSize>Medium</VMSize>
    <NodeCount>12</NodeCount>
    <ImageName HPCPackInstalled=”true”>MyHPCComputeNodeImage</ImageName>
    <VMExtensions>
       <VMExtension>
          <ExtensionName>BGInfo</ExtensionName>
          <Publisher>Microsoft.Compute</Publisher>
          <Version>1.*</Version>
       </VMExtension>
    </VMExtensions>
  </ComputeNodes>
  <AutoGrowShrink>
    <CertificateId>1</CertificateId>
  </AutoGrowShrink>
</IaaSClusterConfig>

```

### Example 3

The following configuration file deploys an HPC Pack cluster
in an existing domain forest. The cluster contains 1 head node, 1
database server with a 500GB data disk, 2 broker nodes running the Windows
Server 2012 R2 operating system, and 5 compute nodes running the Windows
Server 2012 R2 operating system. The cloud service MyHPCCNService is
created in the affinity group *MyIBAffinityGroup*, and all the other cloud
services are created in the affinity group *MyAffinityGroup*. The HPC Job
Scheduler REST API and HPC web portal are enabled on the head node.

```
<?xml version="1.0" encoding="utf-8" ?>
<IaaSClusterConfig>
  <Subscription>
    <SubscriptionName>Subscription-1</SubscriptionName>
    <StorageAccount>mystorageaccount</StorageAccount>
  </Subscription>
  <AffinityGroup>MyAffinityGroup</AffinityGroup>
  <Location>East Asia</Location>  
  <VNet>
    <VNetName>MyVNet</VNetName>
    <SubnetName>Subnet-1</SubnetName>
  </VNet>    
  <Domain>
    <DCOption>ExistingDC</DCOption>
    <DomainFQDN>hpc.local</DomainFQDN>
  </Domain>
  <Database>
    <DBOption>NewRemoteDB</DBOption>
    <DBVersion>SQLServer2014_Enterprise</DBVersion>
    <DBServer>
      <VMName>MyDBServer</VMName>
      <ServiceName>MyHPCService</ServiceName>
      <VMSize>ExtraLarge</VMSize>
      <DataDiskSizeInGB>500</DataDiskSizeInGB>
    </DBServer>
  </Database>
  <HeadNode>
    <VMName>MyHeadNode</VMName>
    <ServiceName>MyHPCService</ServiceName>
    <VMSize>ExtraLarge</VMSize>
    <EnableRESTAPI />
    <EnableWebPortal />
  </HeadNode>
  <ComputeNodes>
    <VMNamePattern>MyHPCCN-%0000%</VMNamePattern>
    <ServiceName>MyHPCCNService</ServiceName>
    <VMSize>A8</VMSize>
<NodeCount>5</NodeCount>
<AffinityGroup>MyIBAffinityGroup</AffinityGroup>
  </ComputeNodes>
  <BrokerNodes>
    <VMNamePattern>MyHPCBN-%0000%</VMNamePattern>
    <ServiceName>MyHPCBNService</ServiceName>
    <VMSize>Medium</VMSize>
    <NodeCount>2</NodeCount>
  </BrokerNodes>
</IaaSClusterConfig>
```



### Example 4

The following configuration file deploys an HPC Pack cluster
in an existing domain forest. The cluster has 1 head node with local
databases, two Azure node templates are created, and 3 Medium size Azure
nodes are created for Azure node template _AzureTemplate1_. A script file
will run on the head node after the head node is configured.

```
<?xml version="1.0" encoding="utf-8" ?>
<IaaSClusterConfig>
  <Subscription>
    <SubscriptionName>Subscription-1</SubscriptionName>
    <StorageAccount>mystorageaccount</StorageAccount>
  </Subscription>
  <AffinityGroup>MyAffinityGroup</AffinityGroup>
  <Location>East Asia</Location>  
  <VNet>
    <VNetName>MyVNet</VNetName>
    <SubnetName>Subnet-1</SubnetName>
  </VNet>
  <Domain>
    <DCOption>ExistingDC</DCOption>
    <DomainFQDN>hpc.local</DomainFQDN>
  </Domain>
  <Database>
    <DBOption>LocalDB</DBOption>
  </Database>
  <HeadNode>
    <VMName>MyHeadNode</VMName>
    <ServiceName>MyHPCService</ServiceName>
<VMSize>ExtraLarge</VMSize>
    <PostConfigScript>c:\MyHNPostActions.ps1</PostConfigScript>
  </HeadNode>
  <Certificates>
    <Certificate>
      <Id>1</Id>
      <PfxFile>d:\mytestcert1.pfx</PfxFile>
      <Password>MyPsw!!2</Password>
    </Certificate>
    <Certificate>
      <Id>2</Id>
      <PfxFile>d:\mytestcert2.pfx</PfxFile>
    </Certificate>    
  </Certificates>
  <AzureBurst>
    <AzureNodeTemplate>
      <TemplateName>AzureTemplate1</TemplateName>
      <SubscriptionId>bb9252ba-831f-4c9d-ae14-9a38e6da8ee4</SubscriptionId>
      <CertificateId>1</CertificateId>
      <ServiceName>mytestsvc1</ServiceName>
      <StorageAccount>myteststorage1</StorageAccount>
      <NodeCount>3</NodeCount>
      <RoleSize>Medium</RoleSize>
    </AzureNodeTemplate>
    <AzureNodeTemplate>
      <TemplateName>AzureTemplate2</TemplateName>
      <SubscriptionId>ad4b9f9f-05f2-4c74-a83f-f2eb73000e0b</SubscriptionId>
      <CertificateId>1</CertificateId>
      <ServiceName>mytestsvc2</ServiceName>
      <StorageAccount>myteststorage2</StorageAccount>
      <Proxy>
        <UsesStaticProxyCount>false</UsesStaticProxyCount>     
        <ProxyRatio>100</ProxyRatio>
        <ProxyRatioBase>400</ProxyRatioBase>
      </Proxy>
      <OSVersion>WindowsServer2012</OSVersion>
    </AzureNodeTemplate>
  </AzureBurst>
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

* **Problem accessing RDMA network from size A8 or A9 VMs** - If you add Windows Server compute node or broker node VMs of size A8 or
A9 by using the deployment script, you may experience problems
connecting those VMs to the RDMA application network. One reason this
can occur is if the HpcVmDrivers extension is not properly installed
when the size A8 or A9 VMs are added to the cluster. For example, the
extension might be stuck in the installing state.

    To work around this problem, first check the state of the extension in
    the VMs. If the extension is not properly installed, try removing the
    nodes from the HPC cluster and then add the nodes again. For example,
    you can add compute node VMs by running the Add-HpcIaaSNode.ps1 script on the head node.
    
## Next steps

* Try running a test workload on the cluster. For an example, see the HPC Pack [getting started guide](https://technet.microsoft.com/library/jj884144).

* For a tutorial that uses the script to create a cluster and run an HPC workload, see [Get started with an HPC Pack cluster in Azure to run Excel and SOA workloads](virtual-machines-windows-excel-cluster-hpcpack.md).

* Try HPC Pack's tools to start, stop, add, and remove compute nodes from a cluster you create. See [Manage compute nodes in an HPC Pack cluster in Azure](virtual-machines-windows-classic-hpcpack-cluster-node-manage.md).

* To get set up to submit jobs to the cluster from a local computer, see [Submit HPC jobs from an on-premises computer to an HPC Pack cluster in Azure](virtual-machines-windows-hpcpack-cluster-submit-jobs.md).
