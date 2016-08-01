<properties
   pageTitle="Create a standalone Service Fabric cluster with Azure VMs | Microsoft Azure"
   description="Learn how to create and manage an Azure Service Fabric cluster on Azure IaaS virtual machines running Windows Server."
   services="service-fabric"
   documentationCenter=".net"
   authors="dsk-2015"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/29/2016"
   ms.author="dkshir;chackdan"/>



# Create a three node standalone Service Fabric cluster with Azure IaaS VMs

This article describe how to create a cluster on Azure IaaS VMs using the standalone Windows Server installer. This is a special case of [Create and manage a cluster running on Windows Server](service-fabric-cluster-creation-for-windows-server.md) where the VMs are [Azure virtual machines running Windows Server](../virtual-machines/virtual-machines-windows-hero-tutorial.md), however you are not creating an Azure cloud based Service Fabric cluster, either via the [portal](service-fabric-cluster-creation-via-portal.md), the [ARM template](service-fabric-cluster-creation-via-arm.md), or the [Visual Studio](service-fabric-cluster-creation-via-visual-studio.md). The difference is that the standalone Service Fabric cluster created by the following steps is entirely managed by you, while the Azure cloud based Service Fabric clusters are managed and upgraded by the Service Fabric resource provider.


## Steps to create a standalone Service Fabric cluster on Azure VMs

1. Log into the Azure portal and create a new Windows Server 2012 R2 Datacenter VM in a resource group. Read the article [Create a Windows VM in the Azure portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md) for more details.
2. Add a couple more Windows Server 2012 R2 Datacenter VMs to the same resource group. Ensure that each of the VMs has the same admin user name and password when created. Once created you should see all three VMs in the same virtual network.
3. Connect to each of the VMs and turn-off the Windows Firewall using the [Server Manager, Local Server dashboard](https://technet.microsoft.com/library/jj134147.aspx). This ensures that network traffic can communicate between the machines. While connected to each machine, get the IP address by opening a command prompt and typing *ipconfig*. Alternatively you can see the IP address of each machine by selecting the virtual network resource for the resource group in the Azure portal.
4. Connect to one of the VMs and test that you can ping the other two VMs successfully.
5. Connect to one of the VMs and [download the standalone Windows Server package](http://go.microsoft.com/fwlink/?LinkId=730690) into a new folder on the machine and unzip the package.
6. Open the *ClusterConfig.Unsecure.MultiMachine.json* file in Notepad and edit each node with the three IP addresses of the machines, change the cluster name at the top and save the file.  A partial example of the cluster manifest is shown below.

    ```
    {
        "name": "TestCluster",
        "clusterManifestVersion": "1.0.0",
        "apiVersion": "2015-01-01-alpha",
        "nodes": [
        {
            "nodeName": "vm0",
        	"metadata": "Replace the localhost with valid IP address or FQDN below",
            "iPAddress": "10.7.0.5",
            "nodeTypeRef": "NodeType0",
            "faultDomain": "fd:/dc1/r0",
            "upgradeDomain": "UD0"
        },
        {
            "nodeName": "vm1",
        	"metadata": "Replace the localhost with valid IP address or FQDN below",
            "iPAddress": "10.7.0.4",
            "nodeTypeRef": "NodeType0",
            "faultDomain": "fd:/dc2/r0",
            "upgradeDomain": "UD1"
        },
        {
            "nodeName": "vm2",
        	"metadata": "Replace the localhost with valid IP address or FQDN below",
            "iPAddress": "10.7.0.6",
            "nodeTypeRef": "NodeType0",
            "faultDomain": "fd:/dc3/r0",
            "upgradeDomain": "UD2"
        }
    ],
    ```

7. Open a [Powershell ISE window](https://msdn.microsoft.com/powershell/scripting/core-powershell/ise/introducing-the-windows-powershell-ise) and navigate to the folder where you downloaded and unzipped the standalone installer package, and saved the manifest file mentioned above. Run the following Powershell command.

    ```
    .\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.MultiMachine.json -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab
    ```

8. You should see the Powershell run, connect to each machine and create a cluster. After about a minute, you can test if the cluster is operational by connecting to the Service Fabric Explorer on one of the machine IP addresses e.g. http://10.7.0.5:19080/Explorer/index.html. Because this is a standalone cluster on IaaS VMs if you want to make this secure you have to [deploy certs to the VMs](service-fabric-windows-cluster-x509-security.md) or set up one of the machines as a [Windows Server Active Directory (AD) controller for Windows authentication](service-fabric-windows-cluster-windows-security.md) just like you would do on premises.


## Next steps
- [Create standalone Service Fabric clusters on Windows Server or Linux](service-fabric-deploy-anywhere.md)
- [Add or remove nodes to a standalone Service Fabric cluster](service-fabric-cluster-windows-server-add-remove-nodes.md)
- [Configuration settings for standalone Windows cluster](service-fabric-cluster-manifest.md)
- [Secure a standalone cluster on Windows using Windows security](service-fabric-windows-cluster-windows-security.md)
- [Secure a standalone cluster on Windows using X509 certificates](service-fabric-windows-cluster-x509-security.md)
