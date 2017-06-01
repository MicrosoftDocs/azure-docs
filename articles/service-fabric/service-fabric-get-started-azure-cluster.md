---
title: Set up a Azure Service Fabric cluster | Microsoft Docs
description: Quickstart- create a Windows or Linux Service Fabric cluster on Azure.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/05/2017
ms.author: ryanwi

---

# Create your first Service Fabric cluster on Azure
A [Service Fabric cluster](service-fabric-deploy-anywhere.md) is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. This quickstart helps you to create a five-node cluster, running on either Windows or Linux, through the [Azure PowerShell](https://msdn.microsoft.com/library/dn135248) or [Azure portal](http://portal.azure.com) in just a few minutes.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Use the Azure portal

Log in to the Azure portal at [http://portal.azure.com](http://portal.azure.com).

### Create the cluster

1. Click the **New** button found on the upper left-hand corner of the Azure portal.
2. Select **Compute** from the **New** blade and then select **Service Fabric Cluster** from the **Compute** blade.
3. Fill out the Service Fabric **Basics** form. For **Operating system**, select the version of Windows or Linux you want the cluster nodes to run. The user name and password entered here is used to log in to the virtual machine. For **Resource group**, create a new one. A resource group is a logical container into which Azure resources are created and collectively managed. When complete, click **OK**.

    ![Cluster setup output][cluster-setup-basics]

4. Fill out the **Cluster configuration** form.  For **Node type count**, enter "1" and the [Durability tier](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster) to "Bronze."

5. Select **Configure each node type** and fill out the **Node type configuration** form. Node types define the VM size, number of VMs, custom endpoints, and other settings for the VMs of that type. Each node type defined is set up as a separate virtual machine scale set, which is used to deploy and managed virtual machines as a set. Each node type can be scaled up or down independently, have different sets of ports open, and can have different capacity metrics.  The first, or primary, node type is where Service Fabric system services are hosted and must have five or more VMs.

    For any production deployment, [capacity planning](service-fabric-cluster-capacity.md) is an important step.  For this quick start, however, you aren't running applications so select a *DS1_v2 Standard* VM size.  Select "Silver" for the [reliability tier](service-fabric-cluster-capacity.md#the-reliability-characteristics-of-the-cluster) and an initial virtual machine scale set capacity of 5.  

    Custom endpoints open up ports in the Azure load balancer so that you can connect with applications running on the cluster.  Enter "80, 8172" to open up ports 80 and 8172.

    Do not check the **Configure advanced settings** box, which is used for customizing TCP/HTTP management endpoints, application port ranges, [placement constraints](service-fabric-cluster-resource-manager-configure-services.md#placement-constraints), and [capacity properties](service-fabric-cluster-resource-manager-metrics.md).    

    Select **OK**.

6. In the **Cluster configuration** form, set **Diagnostics** to **On**.  For this quickstart, you do not need to enter any [fabric setting](service-fabric-cluster-fabric-settings.md) properties.  In **Fabric version**, select **Automatic** upgrade mode so that Microsoft automatically updates the version of the fabric code running the cluster.  Set the mode to **Manual** if you want to [choose a supported version](service-fabric-cluster-upgrade.md) to upgrade to. 

    ![Node type configuration][node-type-config]

    Select **OK**.

7. Fill out the **Security** form.  For this quick start select **Unsecure**.  It is highly recommended to create a secure cluster for production workloads, however, since anyone can anonymously connect to an unsecure cluster and perform management operations.  

    Certificates are used in Service Fabric to provide authentication and encryption to secure various aspects of a cluster and its applications. For more information on how certificates are used in Service Fabric, see [Service Fabric cluster security scenarios](service-fabric-cluster-security.md).  To enable user authentication using Azure Active Directory or to set up certificates for application security, [create a cluster from a Resource Manager template](service-fabric-cluster-creation-via-arm.md).

    Select **OK**.

8. Review the summary.  If you'd like to download a Resource Manager template built from the settings you entered, select **Download template and parameters**.  Select **Create** to create the cluster.

    You can see the creation progress in the notifications. (Click the "Bell" icon near the status bar at the upper right of your screen.) If you clicked **Pin to Startboard** while creating the cluster, you see **Deploying Service Fabric Cluster** pinned to the **Start** board.

### View cluster status
Once your cluster is created, you can inspect your cluster in the **Overview** blade in the portal. You can now see the details of your cluster in the dashboard, including the cluster's public endpoint and a link to Service Fabric Explorer.

![Cluster status][cluster-status]

### Visualize the cluster using Service Fabric explorer
[Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) is a good tool for visualizing your cluster and managing applications.  Service Fabric Explorer is a service that runs in the cluster.  Access it using a web browser by clicking the **Service Fabric Explorer** link of the cluster **Overview** page in the portal.  You can also enter the address directly into the browser: [http://quickstartcluster.westus.cloudapp.azure.com:19080/Explorer](http://quickstartcluster.westus.cloudapp.azure.com:19080/Explorer)

The cluster dashboard provides an overview of your cluster, including a summary of application and node health. The node view shows the physical layout of the cluster. For a given node, you can inspect which applications have code deployed on that node.

![Service Fabric Explorer][service-fabric-explorer]

### Connect to the cluster using PowerShell
Verify that the cluster is running by connecting using PowerShell.  The ServiceFabric PowerShell module is installed with the [Service Fabric SDK](service-fabric-get-started.md).  The [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster?view=azureservicefabricps) cmdlet establishes a connection to the cluster.   

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint localhost:19000
```
See [Connect to a secure cluster](service-fabric-connect-to-secure-cluster.md) for other examples of connecting to a cluster. After connecting to the cluster, use the [Get-ServiceFabricNode](/powershell/module/servicefabric/get-servicefabricnode?view=azureservicefabricps) cmdlet to display a list of nodes in the cluster and status information for each node. **HealthState** should be *OK* for each node.

```powershell
PS C:\> Get-ServiceFabricNode |Format-Table

NodeDeactivationInfo NodeName     IpAddressOrFQDN NodeType  CodeVersion ConfigVersion NodeStatus NodeUpTime NodeDownTime HealthState
-------------------- --------     --------------- --------  ----------- ------------- ---------- ---------- ------------ -----------
                     _nodetype1_2 10.0.0.6        nodetype1 5.5.216.0   1                     Up 00:59:04   00:00:00              Ok
                     _nodetype1_1 10.0.0.5        nodetype1 5.5.216.0   1                     Up 00:59:04   00:00:00              Ok
                     _nodetype1_0 10.0.0.4        nodetype1 5.5.216.0   1                     Up 00:59:04   00:00:00              Ok
                     _nodetype1_4 10.0.0.8        nodetype1 5.5.216.0   1                     Up 00:59:04   00:00:00              Ok
                     _nodetype1_3 10.0.0.7        nodetype1 5.5.216.0   1                     Up 00:59:04   00:00:00              Ok
```

### Remove the cluster
A Service Fabric cluster is made up of other Azure resources in addition to the cluster resource itself. So to completely delete a Service Fabric cluster you also need to delete all the resources it is made of. The simplest way to delete the cluster and all the resources it consumes is to delete the resource group. For other ways to delete a cluster or to delete some (but not all) the resources in a resource group, see [Delete a cluster](service-fabric-cluster-delete.md)

Delete a resource group in the Azure portal:
1. Navigate to the Service Fabric cluster you want to delete.
2. Click the **Resource Group** name on the cluster essentials page.
3. In the **Resource Group Essentials** page, click **Delete** and follow the instructions on that page to complete the deletion of the resource group.
    ![Delete the resource group][cluster-delete]


## Use Azure Powershell to deploy a secure cluster


1) Download the [Azure Powershell module version 4.0 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) on your machine.

2) Open a Windows PowerShell window, Run the following command. 
	
```powershell

Get-Command -Module AzureRM.ServiceFabric 
```

You should see an output similar to the following.

![ps-list][ps-list]

3) Login to Azure and Select the subscription to which you want to create the cluster

```powershell

Login-AzureRmAccount

Select-AzureRmSubscription -SubscriptionId "Subcription ID" 

```

4) Run the following command to now create a secure cluster. Do not forget to customize the parameters. 


````powershell

$certpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force
$RDPpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force 
$RDPuser="vmadmin"
$RGname="mycluster" # this is also the name of your cluster
$clusterloc="SouthCentralUS"
$subname="$RGname.$clusterloc.cloudapp.azure.com"
$certfolder="c:\mycertificates\"
$clustersize=1 # can take values 1, 3-99

New-AzureRmServiceFabricCluster -ResourceGroupName $RGname -Location $clusterloc -ClusterSize $clustersize -VmUserName $RDPuser -VmPassword $RDPpwd -CertificateSubjectName $subname -CertificatePassword $certpwd -CertificateOutputFolder $certfolder

````

The command can take anywhere from 10 minutes to 30 minutes to complete, at the end of it, you should get an output similar to the following. The output has information about the certificate, the KeyVault where it was uploaded to, and the local folder where the certificate is copied. 

![ps-out][ps-out]

5) Copy the entire output and save to a text file as we need to refer to it. Make a note of the following information from the output.
 

- **CertificateSavedLocalPath** : c:\mycertificates\mycluster20170504141137.pfx
- **CertificateThumbprint** : C4C1E541AD512B8065280292A8BA6079C3F26F10
- **ManagementEndpoint** : https://mycluster.southcentralus.cloudapp.azure.com:19080
- **ClientConnectionEndpointPort** : 19000

### Install the certificate on your local machine
  
To connect to the cluster, you need to install the certificate into the Personal (My) store of the current user. 

Run the following PowerShell

```powershell
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
        -FilePath C:\mycertificates\the name of the cert.pfx `
        -Password (ConvertTo-SecureString -String certpwd -AsPlainText -Force)
```

You are now ready to connect to your secure cluster.

### Connect to a secure cluster 

Run the following PowerShell command to connect to a secure cluster. The certificate details must match a certificate that was used to set up the cluster. 

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint <Certificate Thumbprint> `
          -FindType FindByThumbprint -FindValue <Certificate Thumbprint> `
          -StoreLocation CurrentUser -StoreName My
```


The following example shows the completed parameters: 

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint mycluster.southcentralus.cloudapp.azure.com:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint C4C1E541AD512B8065280292A8BA6079C3F26F10 `
          -FindType FindByThumbprint -FindValue C4C1E541AD512B8065280292A8BA6079C3F26F10 `
          -StoreLocation CurrentUser -StoreName My
```

Run the following command to check that you are connected and the cluster is healthy.

```powershell

Get-ServiceFabricClusterHealth

```
### Publish your apps to your cluster from Visual Studio

Now that you have set up an Azure cluster, you can publish your applications to it from Visual Studio by following the [Publish to an cluster](service-fabric-publish-app-remote-cluster.md) document. 

### Remove the cluster
A cluster is made up of other Azure resources in addition to the cluster resource itself. The simplest way to delete the cluster and all the resources it consumes is to delete the resource group. 

```powershell

Remove-AzureRmResourceGroup -Name $RGname -Force

```

## Next steps
Now that you have set up a development cluster, try the following:
* [Create a secure cluster in the portal](service-fabric-cluster-creation-via-portal.md)
* [Create a cluster from a template](service-fabric-cluster-creation-via-arm.md) 
* [Deploy apps using PowerShell](service-fabric-deploy-remove-applications.md)


[cluster-setup-basics]: ./media/service-fabric-get-started-azure-cluster/basics.png
[node-type-config]: ./media/service-fabric-get-started-azure-cluster/nodetypeconfig.png
[cluster-status]: ./media/service-fabric-get-started-azure-cluster/clusterstatus.png
[service-fabric-explorer]: ./media/service-fabric-get-started-azure-cluster/sfx.png
[cluster-delete]: ./media/service-fabric-get-started-azure-cluster/delete.png
[ps-list]: ./media/service-fabric-get-started-azure-cluster/pslist.PNG
[ps-out]: ./media/service-fabric-get-started-azure-cluster/psout.PNG
