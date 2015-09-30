<properties
   pageTitle="PowerShell script to deploy HPC Pack cluster | Microsoft Azure"
   description="Run a Windows PowerShell script to deploy a complete HPC Pack cluster in Azure infrastructure services"
   services="virtual-machines"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor=""
   tags="azure-service-management"/>
<tags
   ms.service="virtual-machines"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-multiple"
   ms.workload="big-compute"
   ms.date="09/29/2015"
   ms.author="danlep"/>

# Create a high performance computing (HPC) cluster in Azure VMs with the HPC Pack IaaS deployment script

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article applies to creating a resource with the classic deployment model.


Run the HPC Pack IaaS deployment PowerShell script on a client
computer to deploy a complete HPC Pack cluster in Azure infrastructure
services (IaaS). The script provides several deployment options, and can add cluster compute nodes running supported Linux
distributions or Windows Server operating systems.

Depending on your environment and choices, the script can create all the cluster infrastructure, including the Azure virtual network, storage accounts, cloud services, domain controller, remote or local SQL databases, head node, broker nodes, compute nodes, and Azure cloud service (“burst”, or PaaS) nodes. Alternatively, the script can use pre-existing Azure infrastructure and then create the HPC cluster head node, broker nodes, compute nodes, and Azure burst nodes.


For background information about planning an HPC Pack cluster, see the [Product Evaluation and Planning](https://technet.microsoft.com/library/jj899596.aspx) and [Getting Started](https://technet.microsoft.com/library/jj899590.aspx) content in the HPC Pack TechNet Library.

>[AZURE.NOTE]You can also use an Azure Resource Manager template to deploy an HPC Pack cluster. For an example, see [Create an HPC cluster](https://azure.microsoft.com/documentation/templates/create-hpc-cluster/), [Create an HPC cluster with a custom compute node image](https://azure.microsoft.com/documentation/templates/create-hpc-cluster-custom-image/), or [Create an HPC cluster with Linux compute nodes](https://azure.microsoft.com/documentation/templates/create-hpc-cluster-linux-cn/).

## Prerequisites

* **Azure subscription** - You can use a subscription in either the Azure Global or Azure China service. Your subscription limits will affect the number and type of cluster nodes you can deploy. For information, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).


* **Windows client computer with Azure PowerShell 0.8.7 or later installed and configured** - See [How to install and configure Azure PowerShell](../powershell-install-configure.md). The script runs in Azure Service Management.


* **HPC Pack IaaS deployment script** - Download and unpack the latest version of the script from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=44949). You can check the version of the script by running `New-HPCIaaSCluster.ps1 –Version`. This article is based on version 4.4.0 of the script.

* **Script configuration file** - You'll need to create an XML file that the script uses to configure the HPC cluster. For information and examples, see sections later in this article.


## Syntax

```
New-HPCIaaSCluster.ps1 [-ConfigFile] <String> [-AdminUserName]<String> [[-AdminPassword] <String>] [[-HPCImageName] <String>] [[-LogFile] <String>] [-Force] [-NoCleanOnFailure] [-PSSessionSkipCACheck] [<CommonParameters>]
```
>[AZURE.NOTE]You must run the script as an administrator.

### Parameters

* **ConfigFile** - Specifies the file path of the configuration file to describe the HPC cluster. For more information, see [Configuration file](#Configuration-file) in this topic, or the file Manual.rtf, in the folder containing the script.

* **AdminUserName** -Specifies the user name. If the domain forest is created by the script, this becomes the local administrator user name for all VMs as well as the domain administrator name. If the domain forest already exists, this specifies the domain user as the local administrator user name to install HPC Pack.

* **AdminPassword** - Specifies the administrator’s password. If not specified in the command line, the script will prompt you to input the password.

* **HPCImageName** (optional) - Specifies the HPC Pack VM image name used to deploy the HPC cluster. It must be a Microsoft-provided HPC Pack image from the Azure Marketplace. If not specified (recommended in most cases), the script chooses the latest published HPC Pack image.

    >[AZURE.NOTE] Deployment will fail if you don't specify a valid HPC Pack image.

* **LogFile** (optional) - Specifies the deployment log file path. If not specified, the script will create a log file in the temp directory of the computer running the script.

* **Force** (optional) - Suppresses all the confirmation prompts.

* **NoCleanOnFailure** (optional) - Specifies that the Azure VMs that are not successfully deployed will not be removed. You must remove these VMs manually before rerunning the script to continue the deployment, or the deployment may fail.

* **PSSessionSkipCACheck** (optional)- For every cloud service with VMs deployed by this script, a self-signed certificate is automatically generated by Azure, and all the VMs in the cloud service use this certificate as the default Windows Remote Management (WinRM) certificate. To deploy HPC features in these Azure VMs, the script by default temporarily installs these certificates in the Local Computer\\Trusted Root Certification Authorities store of the client computer to suppress the “not trusted CA” security error during the script execution; the certificates are removed when the script finishes. If this parameter is specified, the certificates are not installed in the client computer, and the security warning is suppressed.

    >[AZURE.IMPORTANT] This parameter is not recommended for production deployments.

### Example

The following example creates a new HPC Pack cluster using the
configuration file MyConfigFile.xml, and specifies administrative
credentials for installing the cluster.
```
New-HPCIaaSCluster.ps1 –ConfigFile MyConfigFile.xml -AdminUserName
<username> –AdminPassword <password>
```
### Additional considerations

* The script uses the HPC Pack VM image in the Azure Marketplace to create the cluster head node. The current image is based on Windows Server 2012 R2 Datacenter with HPC Pack 2012 R2 Update 2 installed.

* The script can optionally enable job submission through the HPC Pack web portal or the HPC Pack REST API.


* The script can optionally run custom pre- and post-configuration scripts on the head node if you want to install additional software or configure other settings.


## Configuration file

The configuration file for the deployment script is an XML
file. The schema file HPCIaaSClusterConfig.xsd is in the HPC Pack IaaS
deployment script folder. **IaaSClusterConfig** is the root element of
the configuration file, which contains the child elements described in
detail in the file Manual.rtf in the deployment script folder. For example files for different scenarios, see
[Example configuration files](#Example-configuration-files) in this article.

## Example configuration files

### Example 1

The following configuration file deploys an HPC Pack cluster in an existing domain forest. The cluster has 1 head node with local databases and 12 compute nodes with the BGInfo VM extension applied.
Automatic installation of Windows updates is disabled for all the VMs in
the domain forest. All the cloud services are created directly in the
East Asia location. The compute nodes are created in 3 cloud services
and 3 storage accounts (i.e., MyHPCCN-0001 to MyHPCCN-0005 in
MyHPCCNService01 and mycnstorage01; MyHPCCN-0006 to MyHPCCN0010 in
MyHPCCNService02 and mycnstorage02; and MyHPCCN-0011 to MyHPCCN-0012 in
MyHPCCNService03 and mycnstorage03). The compute nodes are created from
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

### Example 2

The following configuration file deploys an HPC Pack cluster
in an existing domain forest. The cluster contains 1 head node, 1
database server with a 500GB data disk, 2 broker nodes running the Windows
Server 2012 R2 operating system, and 5 compute nodes running the Windows
Server 2012 R2 operating system. The cloud service MyHPCCNService is
created in the affinity group MyIBAffinityGroup, and all the other cloud
services are created in the affinity group MyAffinityGroup. The HPC Job
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

### Example 3

The following configuration file creates a new domain forest
and Deployments an HPC Pack cluster which has 1 head node with local
databases and 20 Linux compute nodes. All the cloud services are created
directly in the East Asia location. The Linux compute nodes are created
in 4 cloud services and 4 storage accounts (i.e. MyLnxCN-0001 to
MyHPCCN-0005 in MyLnxCNService01 and mylnxstorage01, MyLnxCN-0006 to
MyLnxCN-0010 in MyLnxCNService02 and mylnxstorage02, MyLnxCN-0011 to
MyLnxCN-0015 in MyLnxCNService03 and mylnxstorage03, and MyLnxCN-0016 to
MyLnxCN-0020 in MyLnxCNService04 and mylnxstorage04). The compute nodes
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


### Example 4

The following configuration file deploys an HPC Pack cluster
which has a head node with local databases and 5 compute nodes running
the Windows Server 2008 R2 operating system. All the cloud services are
created directly in the East Asia location. The head node acts as domain
controller of the domain forest.

```
<?xml version="1.0" encoding="utf-8" ?>
<IaaSClusterConfig>
  <Subscription>
    <SubscriptionId>08701940-C02E-452F-B0B1-39D50119F267</SubscriptionId>
    <StorageAccount>mystorageaccount</StorageAccount>
  </Subscription>
  <Location>East Asia</Location>  
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
    <OSVersion>WindowsServer2008R2</OSVersion>
  </ComputeNodes>
</IaaSClusterConfig>
```

### Example 5

The following configuration file deploys an HPC Pack cluster
in an existing domain forest. The cluster has 1 head node with local
databases, two Azure node templates are created, and 3 Medium size Azure
nodes are created for Azure node template AzureTemplate1. A script file
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
## Known issues


* **“VNet doesn’t exist” error** - If you run the HPC Pack IaaS deployment script to deploy multiple
clusters in Azure concurrently under one subscription, one or more
deployments may fail with the error “VNet *VNet\_Name* doesn't exist”.
If this error occurs, re-run the script for the failed deployment.

* **Problem accessing the Internet from the Azure virtual network** - If you create an HPC Pack cluster with a new domain controller by using
the deployment script, or you manually promote a VM to domain
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

* For a tutorial that uses the script to create a cluster and run an HPC workload, see [Get started with an HPC Pack cluster in Azure to run Excel and SOA workloads](virtual-machines-excel-cluster-hpcpac) or [Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure](virtual-machines-linux-cluster-hpcpack-namd.md).

* Try HPC Pack's tools to start, stop, add, and remove compute nodes from a cluster you create. See [Manage compute nodes in an HPC Pack cluster in Azure](virtual-machines-hpcpack-cluster-node-manage.md)
