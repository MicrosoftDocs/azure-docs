---
title: Set up an Azure Service Fabric cluster | Microsoft Docs
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
ms.date: 10/13/2017
ms.author: ryanwi

---

# Create your first Service Fabric cluster on Azure
A [Service Fabric cluster](service-fabric-deploy-anywhere.md) is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. This quickstart helps you to create a five-node cluster, running on either Windows or Linux, through the [Azure PowerShell](https://msdn.microsoft.com/library/dn135248) or [Azure portal](http://portal.azure.com) in just a few minutes.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Use the Azure portal

Log in to the Azure portal at [http://portal.azure.com](http://portal.azure.com).

### Create the cluster

1. Click the **New** button found on the upper left-hand corner of the Azure portal.
2. Search for **Service Fabric** and select **Service Fabric Cluster** from the **Service Fabric Cluster** from the returned results.  Click **Create**.
3. Fill out the Service Fabric **Basics** form. For **Operating system**, select the version of Windows or Linux you want the cluster nodes to run. The user name and password entered here is used to log in to the virtual machine. For **Resource group**, create a new one. A resource group is a logical container into which Azure resources are created and collectively managed. When complete, click **OK**.

    ![Cluster setup output][cluster-setup-basics]

4. Fill out the **Cluster configuration** form.  For **Node type count**, enter "1".

5. Select **Node type 1 (Primary)** and fill out the **Node type configuration** form.  Enter a node type name and set the [Durability tier](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster) to "Bronze."  Select a VM size.

    Node types define the VM size, number of VMs, custom endpoints, and other settings for the VMs of that type. Each node type defined is set up as a separate virtual machine scale set, which is used to deploy and managed virtual machines as a set. Each node type can be scaled up or down independently, have different sets of ports open, and can have different capacity metrics.  The first, or primary, node type is where Service Fabric system services are hosted and must have five or more VMs.

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

### Connect to the cluster using PowerShell
Verify that the cluster is running by connecting using PowerShell.  The ServiceFabric PowerShell module is installed with the [Service Fabric SDK](service-fabric-get-started.md).  The [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster?view=azureservicefabricps) cmdlet establishes a connection to the cluster.   

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint quickstartcluster.westus2.cloudapp.azure.com:19000
```
See [Connect to a secure cluster](service-fabric-connect-to-secure-cluster.md) for other examples of connecting to a cluster. After connecting to the cluster, use the [Get-ServiceFabricNode](/powershell/module/servicefabric/get-servicefabricnode?view=azureservicefabricps) cmdlet to display a list of nodes in the cluster and status information for each node. **HealthState** should be *OK* for each node.

```powershell
PS C:\Users\sfuser> Get-ServiceFabricNode |Format-Table

NodeDeactivationInfo NodeName     IpAddressOrFQDN NodeType  CodeVersion  ConfigVersion NodeStatus NodeUpTime NodeDownTime HealthState
-------------------- --------     --------------- --------  -----------  ------------- ---------- ---------- ------------ -----------
                     _nodetype1_2 10.0.0.6        nodetype1 5.7.198.9494 1                     Up 03:00:38   00:00:00              Ok
                     _nodetype1_1 10.0.0.5        nodetype1 5.7.198.9494 1                     Up 03:00:38   00:00:00              Ok
                     _nodetype1_0 10.0.0.4        nodetype1 5.7.198.9494 1                     Up 03:00:38   00:00:00              Ok
                     _nodetype1_4 10.0.0.8        nodetype1 5.7.198.9494 1                     Up 03:00:38   00:00:00              Ok
                     _nodetype1_3 10.0.0.7        nodetype1 5.7.198.9494 1                     Up 03:00:38   00:00:00              Ok
```

### Remove the cluster
A Service Fabric cluster is made up of other Azure resources in addition to the cluster resource itself. So to completely delete a Service Fabric cluster you also need to delete all the resources it is made of. The simplest way to delete the cluster and all the resources it consumes is to delete the resource group. For other ways to delete a cluster or to delete some (but not all) the resources in a resource group, see [Delete a cluster](service-fabric-cluster-delete.md)

Delete a resource group in the Azure portal:
1. Navigate to the Service Fabric cluster you want to delete.
2. Click the **Resource Group** name on the cluster essentials page.
3. In the **Resource Group Essentials** page, click **Delete resource group** and follow the instructions on that page to complete the deletion of the resource group.
    ![Delete the resource group][cluster-delete]


## Use Azure Powershell
1. Download the [Azure Powershell module version 4.0 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) on your machine.

2. Run the [New-AzureRmServiceFabricCluster](/powershell/module/azurerm.servicefabric/new-azurermservicefabriccluster) cmdlet to create a five-node Service Fabric cluster secured with an X.509 certificate. The command creates a self-signed certificate and uploads it to a new key vault. The certificate is also copied to a local directory. Set the *-OS* parameter to choose the version of Windows or Linux that runs on the cluster nodes. Customize the parameters as needed. 

    ```powershell
    #Provide the subscription Id
    $subscriptionId = 'yourSubscriptionId'

    # Certificate variables.
    $certpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force
    $certfolder="c:\mycertificates\"

    # Variables for VM admin.
    $adminuser="vmadmin"
    $adminpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force 

    # Variables for common values
    $clusterloc="SouthCentralUS"
    $clustername = "mysfcluster"
    $groupname="mysfclustergroup"       
    $vmsku = "Standard_D2_v2"
    $vaultname = "mykeyvault"
    $subname="$clustername.$clusterloc.cloudapp.azure.com"

    # Set the number of cluster nodes. Possible values: 1, 3-99
    $clustersize=5 

    # Set the context to the subscription ID where the cluster will be created
    Login-AzureRmAccount
    Get-AzureRmSubscription
    Select-AzureRmSubscription -SubscriptionId $subscriptionId

    # Create the Service Fabric cluster.
    New-AzureRmServiceFabricCluster -Name $clustername -ResourceGroupName $groupname -Location $clusterloc `
    -ClusterSize $clustersize -VmUserName $adminuser -VmPassword $adminpwd -CertificateSubjectName $subname `
    -CertificatePassword $certpwd -CertificateOutputFolder $certfolder `
    -OS WindowsServer2016DatacenterwithContainers -VmSku $vmsku -KeyVaultName $vaultname
    ```

    The command can take anywhere from 10 minutes to 30 minutes to complete, at the end of it, you should get an output similar to the following. The output has information about the certificate, the KeyVault where it was uploaded to, and the local folder where the certificate is copied.     

3. Copy the entire output and save to a text file as we need to refer to it. Make a note of the following information from the output. 

    - CertificateSavedLocalPath
    - CertificateThumbprint
    - ManagementEndpoint
    - ClientConnectionEndpointPort

### Install the certificate on your local machine
  
To connect to the cluster, you need to install the certificate into the Personal (My) store of the current user. 

Run the following:

```powershell
$certpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
        -FilePath C:\mycertificates\<certificatename>.pfx `
        -Password $certpwd
```

You are now ready to connect to your secure cluster.

### Connect to a secure cluster 

Run [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster) cmdlet to connect to a secure cluster. The certificate details must match a certificate that was used to set up the cluster. 

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <ManagementEndpoint>:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint <CertificateThumbprint> `
          -FindType FindByThumbprint -FindValue <CertificateThumbprint> `
          -StoreLocation CurrentUser -StoreName My
```

The following example shows sample parameters: 

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
### Remove the cluster
A cluster is made up of other Azure resources in addition to the cluster resource itself. The simplest way to delete the cluster and all the resources it consumes is to delete the resource group. 

```powershell
$groupname="mysfclustergroup"
Remove-AzureRmResourceGroup -Name $groupname -Force
```
## Use Azure CLI

1. Install the [Azure CLI 2.0](/cli/azure/install-azure-cli?view=azure-cli-latest) on your computer.
2. Login to Azure and select the subscription you want to create the cluster in.
   ```azurecli
   az login
   az account set --subscription <GUID>
   ```
3. Run the [az sf cluster create](/cli/azure/sf/cluster?view=azure-cli-latest#az_sf_cluster_create) command to create a five-node Service Fabric cluster secured with an X.509 certificate. The command creates a self-signed certificate and uploads it to a new key vault. The certificate is also copied to a local directory. Set the *-os* parameter to choose the version of Windows or Linux that runs on the cluster nodes. Customize the parameters as needed.

    ```azurecli
    #!/bin/bash

    # Variables
    ResourceGroupName="aztestclustergroup" 
    ClusterName="aztestcluster" 
    Location="southcentralus" 
    Password="q6D7nN%6ck@6" 
    Subject="aztestcluster.southcentralus.cloudapp.azure.com" 
    VaultName="aztestkeyvault" 
    VaultGroupName="testvaultgroup"
    VmPassword="Mypa$$word!321"
    VmUserName="sfadminuser"

    # Create resource groups
    az group create --name $ResourceGroupName --location $Location 
    az group create --name $VaultGroupName --location $Location

    # Create secure five node Linux cluster. Creates a key vault in a resource group
    # and creates a certficate in the key vault. The certificate's subject name must match 
    # the domain that you use to access the Service Fabric cluster.  The certificate is downloaded locally.
    az sf cluster create --resource-group $ResourceGroupName --location $Location --certificate-output-folder . \
        --certificate-password $Password --certificate-subject-name $Subject --cluster-name $ClusterName \
        --cluster-size 5 --os UbuntuServer1604 --vault-name $VaultName --vault-resource-group $VaultGroupName \
        --vm-password $VmPassword --vm-user-name $VmUserName
    ```
    
### Connect to the cluster
Run the following CLI command to connect to the cluster using the certificate .  When using a client certificate for authentication, the certificate details must match a certificate deployed to the cluster nodes.  Use the `--no-verify` option for a self-signed certificate.

```azurecli
az sf cluster select --endpoint https://aztestcluster.southcentralus.cloudapp.azure.com:19080 --pem ./linuxcluster201709161647.pem --no-verify
```

Run the following command to check that you are connected and the cluster is healthy.

```azurecli
az sf cluster health
```

### Connect to the nodes directly 

To connect to the nodes in a Linux cluster, you can use SSH to connect to the nodes by specifying a port number from 3389 onwards. For example, for the five node cluster created earlier, the commands would be as follows:
```bash
ssh sfadminuser@aztestcluster.southcentralus.cloudapp.azure.com -p 3389
ssh sfadminuser@aztestcluster.southcentralus.cloudapp.azure.com -p 3390
ssh sfadminuser@aztestcluster.southcentralus.cloudapp.azure.com -p 3391
ssh sfadminuser@aztestcluster.southcentralus.cloudapp.azure.com -p 3392
ssh sfadminuser@aztestcluster.southcentralus.cloudapp.azure.com -p 3393
```

### Remove the cluster
A cluster is made up of other Azure resources in addition to the cluster resource itself. The simplest way to delete the cluster and all the resources it consumes is to delete the resource group. 

```azurecli
ResourceGroupName = "aztestclustergroup"
az group delete --name $ResourceGroupName
```

## Next steps
Now that you have set up a development cluster, try the following:
* [Visualize your cluster with Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)
* [Remove a cluster](service-fabric-cluster-delete.md) 
* [Deploy apps using PowerShell](service-fabric-deploy-remove-applications.md)
* [Deploy apps using CLI](service-fabric-application-lifecycle-sfctl.md)


[cluster-setup-basics]: ./media/service-fabric-get-started-azure-cluster/basics.png
[node-type-config]: ./media/service-fabric-get-started-azure-cluster/nodetypeconfig.png
[cluster-status]: ./media/service-fabric-get-started-azure-cluster/clusterstatus.png
[service-fabric-explorer]: ./media/service-fabric-get-started-azure-cluster/sfx.png
[cluster-delete]: ./media/service-fabric-get-started-azure-cluster/delete.png
