
<properties
   pageTitle="Create a secure Service Fabric cluster using the Azure portal | Microsoft Azure"
   description="This article describes how to set up a secure Service Fabric cluster in Azure using the Azure portal and Azure Key Vault."
   services="service-fabric"
   documentationCenter=".net"
   authors="chackdan"
   manager="timlt"
   editor="vturecek"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/10/2016"
   ms.author="vturecek"/>

# Create a Service Fabric cluster in Azure using the Azure portal

> [AZURE.SELECTOR]
- [Azure Resource Manager](service-fabric-walkthrough-cluster-security.md)
- [Azure portal](service-fabric-walkthrough-cluster-security-portal.md)

This is a step-by-step guide that walks you through the steps of setting up a secure Service Fabric cluster in Azure using the Azure portal. This guide walks you through the following steps:

 - Set up Key Vault to manage keys for cluster security.
 - Create a secured cluster in Azure through the Azure portal.
 - Authenticate administrators using certificates.

>[AZURE.NOTE] For more advanced security options, such as user authentication with Azure Active Directory and setting up certificates for application security, [create your cluster using Azure Resource Manager (ARM)][create-cluster-arm].

A secure cluster is a cluster that prevents unauthorized access to management operations, which includes deploying, upgrading, and deleting applications, services, and the data they contain. An unsecure cluster is a cluster that anyone can connect to at any time and perform management operations. Although it is possible to create an unsecure cluster, it is **highly recommended to create a secure cluster**. An unsecure cluster **cannot be secured at a later time** - a new cluster must be created.

## Log in to Azure
This guide uses [Azure PowerShell][azure-powershell]. When starting a new PowerShell session, log in to your Azure account and select your subscription before executing Azure commands.

Log in to your azure account:

```powershell
Login-AzureRmAccount
```

Select your subscription:

```powershell
Get-AzureRmSubscription
Set-AzureRmContext -SubscriptionId <guid>
```

## Set up Key Vault

This part of the guide walks you through creating a Key Vault for a Service Fabric cluster in Azure and for Service Fabric applications. For a complete guide on Key Vault, refer to the [Key Vault getting started guide][key-vault-get-started].

Service Fabric uses X.509 certificates to secure a cluster. Azure Key Vault is used to manage certificates for Service Fabric clusters in Azure. When a cluster is deployed in Azure, the Azure resource provider responsible for creating Service Fabric clusters pulls certificates from Key Vault and installs them on the cluster VMs.

The following diagram illustrates the relationship between Key Vault, a Service Fabric cluster, and the Azure resource provider that uses certificates stored in Key Vault when it creates a cluster:

![Certificate installation][cluster-security-cert-installation]

### Create a Resource Group

The first step is to create a new resource group specifically for Key Vault. Putting Key Vault into its own resource group is recommended so that you can remove compute and storage resource groups - such as the resource group that has your Service Fabric cluster - without losing your keys and secrets. The resource group that has your Key Vault must be in the same region as the cluster that is using it.

```powershell

	PS C:\Users\vturecek> New-AzureRmResourceGroup -Name mycluster-keyvault -Location 'West US'
	WARNING: The output object type of this cmdlet will be modified in a future release.
	
	ResourceGroupName : mycluster-keyvault
	Location          : westus
	ProvisioningState : Succeeded
	Tags              :
	ResourceId        : /subscriptions/<guid>/resourceGroups/mycluster-keyvault

```

### Create Key Vault 

Create a Key Vault in the new resource group. The Key Vault **must be enabled for deployment** to allow the Service Fabric resource provider to get certificates from it and install on cluster nodes:

```powershell

	PS C:\Users\vturecek> New-AzureRmKeyVault -VaultName 'myvault' -ResourceGroupName 'mycluster-keyvault' -Location 'West US' -EnabledForDeployment
	
	
	Vault Name                       : myvault
	Resource Group Name              : mycluster-keyvault
	Location                         : West US
	Resource ID                      : /subscriptions/<guid>/resourceGroups/mycluster-keyvault/providers/Microsoft.KeyVault/vaults/myvault
	Vault URI                        : https://myvault.vault.azure.net
	Tenant ID                        : <guid>
	SKU                              : Standard
	Enabled For Deployment?          : False
	Enabled For Template Deployment? : False
	Enabled For Disk Encryption?     : False
	Access Policies                  :
	                                   Tenant ID                :    <guid>
	                                   Object ID                :    <guid>
	                                   Application ID           :
	                                   Display Name             :    
	                                   Permissions to Keys      :    get, create, delete, list, update, import, backup, restore
	                                   Permissions to Secrets   :    all
	
	
	Tags                             :
```

If you have an existing Key Vault, you can enable it for deployment using Azure CLI:

```cli
> azure login
> azure account set "your account"
> azure config mode arm 
> azure keyvault list
> azure keyvault set-policy --vault-name "your vault name" --enabled-for-deployment true
```


## Add certificates to Key Vault

Certificates are used in Service Fabric to provide authentication and encryption to secure various aspects of a cluster and its applications. For more information on how certificates are used in Service Fabric, see [Service Fabric cluster security scenarios][service-fabric-cluster-security].

### Cluster and server certificate (required) 

This certificate is required to secure a cluster and prevent unauthorized access to it. It provides cluster security in a couple ways:
 
 - **Cluster authentication:** Authenticates node-to-node communication for cluster federation. Only nodes that can prove their identity with this certificate can join the cluster.
 - **Server authentication:** Authenticates the cluster management endpoints to a management client, so that the management client knows it is talking to the real cluster. This certificate also provides SSL for the HTTPS management API and for Service Fabric Explorer over HTTPS.

To serve these purposes, the certificate must meet the following requirements:

 - The certificate must contain a private key.
 - The certificate must be created for key exchange, exportable to a Personal Information Exchange (.pfx) file.
 - The certificate's subject name must match the domain used to access the Service Fabric cluster. This is required to provide SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain an SSL certificate from a certificate authority (CA) for the `.cloudapp.azure.com` domain. You must acquire a custom domain name for your cluster. When you request a certificate from a CA the certificate's subject name must match the custom domain name used for your cluster.

### Client authentication certificates

Additional client certificates authenticate administrators for cluster management tasks. Service Fabric has two access levels: **admin** and **read-only user**. At minimum, a single certificate for administrative access should be used. For additional user-level access, a separate certificate must be provided. For more information on access roles, refer to [role-based access control for Service Fabric clients][service-fabric-cluster-security-roles].

Client authentication certificates do not need to be uploaded to Key Vault to work with Service Fabric. These certificates only need to be provided to administrators that are authorized for cluster management. 

>[AZURE.NOTE] Azure Active Directory is the recommended way to authenticate clients for cluster management operations. To use Azure Active Directory, you must [create a cluster using Azure Resource Manager (ARM)][create-cluster-arm].

### Application certificates (optional)

Any number of additional certificates can be installed on a cluster for application security purposes. Before creating your cluster, consider the application security scenarios that require a certificate to be installed on the nodes, such as:

 - Encryption and decryption of application configuration values
 - Encryption of data across nodes during replication 

Application certificates cannot be configured when creating a cluster through the Azure portal. To configure application certificates at cluster setup time, you must [create a cluster using Azure Resource Manager (ARM)][create-cluster-arm]. You can also add application certificates to the cluster after it has been created.

### Formatting certificates for Azure resource provider use

Private key files (.pfx) can be added and used directly through Key Vault. However, the Azure resource provider requires keys to be stored in a special JSON format that includes the .pfx as a base-64 encoded string and the private key password. To accommodate these requirements, keys must be placed in a JSON string and then stored as *secrets* in Key Vault.

To make this process easier, a PowerShell module is [available on GitHub][service-fabric-rp-helpers]. Follow these steps to use the module:

 1. Download the entire contents of the repo into a local directory. 
 2. Import the module in your PowerShell window:

  ```powershell
  PS C:\Users\vturecek> Import-Module "C:\users\vturecek\Documents\ServiceFabricRPHelpers\ServiceFabricRPHelpers.psm1"
  ```
     
The `Invoke-AddCertToKeyVault` command in this PowerShell module automatically formats a certificate private key into a JSON string and uploads it to Key Vault. Use it to add the cluster certificate and any additional application certificates to Key Vault. Simply repeat this step for any additional certificates you want to install in your cluster.

```powershell
PS C:\Users\vturecek> Invoke-AddCertToKeyVault -SubscriptionId <guid> -ResourceGroupName mycluster-keyvault -Location "West US" -VaultName myvault -CertificateName mycert -Password "<password>" -UseExistingCertificate -ExistingPfxFilePath "C:\path\to\mycertkey.pfx"
	
	Switching context to SubscriptionId <guid>
	Ensuring ResourceGroup mycluster-keyvault in West US
	WARNING: The output object type of this cmdlet will be modified in a future release.
	Using existing valut myvault in West US
	Reading pfx file from C:\path\to\key.pfx
	Writing secret to myvault in vault myvault
	
	
Name  : CertificateThumbprint
Value : <value>

Name  : SourceVault
Value : /subscriptions/<guid>/resourceGroups/mycluster-keyvault/providers/Microsoft.KeyVault/vaults/myvault

Name  : CertificateURL
Value : https://myvault.vault.azure.net:443/secrets/mycert/4d087088df974e869f1c0978cb100e47

```

These are all the Key Vault prerequisites for configuring a Service Fabric cluster Resource Manager template that installs certificates for node authentication, management endpoint security and authentication, and any additional application security features that use X.509 certificates. At this point, you should now have the following set up in Azure:

 - Key Vault resource group
   - Key Vault
     - Cluster server authentication certificate

## Create cluster in the Azure portal

### Search for the Service Fabric cluster resource

![search for Service Fabric cluster template on the Azure portal.][SearchforServiceFabricClusterTemplate]

 1. Sign in to the [Azure portal][azure-portal].

 2. Click **New** to add a new resource template. Search for the Service Fabric Cluster template in the **Marketplace** under **Everything**.

 3. Select **Service Fabric Cluster** from the list.

 4. Navigate to the **Service Fabric Cluster** blade, click **Create**,

 5. You will now be presented with a **Create Service Fabric cluster** blade with four steps.

#### 1. Basics

![Screen shot of creating a new resource group.][CreateRG]

In the Basics blade you need to provide the basic details for your cluster.

 1. Enter the name of your cluster.

 2. Enter a **user name** and **password** for Remote Desktop for the VMs.

 3. Make sure to select the **Subscription** that you want your cluster to be deployed to, especially if you have multiple subscriptions.

 4. Create a **new resource group**. It is best to give it the same name as the cluster, since it helps in finding them later, especially when you are trying to make changes to your deployment or delete your cluster.

    >[AZURE.NOTE] Although you can decide to use an existing resource group, it is a good practice to create a new resource group. This makes it easy to delete clusters that you do not need.

 5. Select the **region** in which you want to create the cluster. You must use the same region that your Key Vault is in.

#### 2. Cluster configuration

![Create a node type][CreateNodeType]

Configure your cluster nodes. Node types define the VM sizes, the number of VMs, and their properties. Your cluster can have more than one node type, but the primary node type (the first one that you define on the portal) must have at least five VMs, as this is the node type where Service Fabric system services are placed. You do not need to configure **Placement Properties** because a default placement property of "NodeTypeName" is added automatically.

   >[AZURE.NOTE] A common scenario for multiple node types is an application that contains a front-end service and a back-end service. You want to put the front-end service on smaller VMs (VM sizes like D2) with ports open to the Internet, but you want to put the back-end service on larger VMs (with VM sizes like D4, D6, D15, and so on) with no Internet-facing ports open.

 1. Choose a name for your node type (1 to 12 characters containing only letters and numbers).

 2. The minimum **size** of VMs for the primary node type is driven by the **durability** tier you choose for the cluster. The default for the durability tier is bronze. For more information on durability, refer to [how to choose the Service Fabric cluster reliability and durability][service-fabric-cluster-capacity].

 3. Select the VM size and pricing tier. D-series VMs have SSD drives and are highly recommended for stateful applications.

 4. The minimum **number** of VMs for the primary node type is driven by the **reliability** tier you choose. The default for the reliability tier is Silver. For more information on reliability, refer to [how to choose the Service Fabric cluster reliability and durability][service-fabric-cluster-capacity].

 5. Choose the number of VMs for the node type. You can scale up or down the number of VMs in a node type later on, but on the primary node type, the minimum is driven by the reliability level that you have chosen. Other node types can have a minimum of 1 VM.

 6. Configure custom endpoints. This field allows you to enter a comma-separated list of ports that you want to expose through the Azure Load Balancer to the public Internet for your applications. For example, if you plan to deploy a web application to your cluster, enter "80" here to allow traffic on port 80 into your cluster. For more information on endpoints, refer to [communicating with applications][service-fabric-connect-and-communicate-with-services]

 7. Configure cluster **diagnostics**. By default, diagnostics are enabled on your cluster to assist with troubleshooting issues. If you want to disable diagnostics change the **Status** toggle to **Off**. Turning off diagnostics is **not** recommended.


#### 3. Security

![Screen shot of security configurations on Azure portal.][SecurityConfigs]

The final step is to provide certificate information to secure the cluster using the Key Vault and certificate information created earlier.

 1. Populate the primary certificate fields with the output obtained from uploading the **cluster certificate** to Key Vault using the `Invoke-AddCertToKeyVault` PowerShell command.

```powershell
Name  : CertificateThumbprint
Value : <value>

Name  : SourceVault
Value : /subscriptions/<guid>/resourceGroups/mycluster-keyvault/providers/Microsoft.KeyVault/vaults/myvault

Name  : CertificateURL
Value : https://myvault.vault.azure.net:443/secrets/mycert/4d087088df974e869f1c0978cb100e47
```

 2. Check the **Configure advanced settings** box to enter client certificates for **admin client** and **read-only client**. In these fields, simply enter the thumbprint of your admin client certificate and the thumbprint of your read-only user client certificate, if applicable. When administrators attempt to connect to the cluster, they will be granted access only if they have a certificate with a thumbprint that matches the thumbprint values entered here.  


#### 4. Summary

![Screen shot of the start board displaying "Deploying Service Fabric Cluster." ][Notifications]

To complete the cluster creation, click **Summary** to see the configurations that you have provided, or download the Azure Resource Manager template that will be used to deploy your cluster. After you have provided the mandatory settings, the **OK** button will be enabled and you can start the cluster creation process by clicking it.

You can see the creation progress in the notifications. (Click the "Bell" icon near the status bar at the upper-right of your screen.) If you clicked **Pin to Startboard** while creating the cluster, you will see **Deploying Service Fabric Cluster** pinned to the **Start** board.

### View your cluster status

![Screen shot of cluster details in the dashboard.][ClusterDashboard]

Once your cluster is created, you can inspect your cluster in the portal:

 1. Go to **Browse** and click **Service Fabric Clusters**.

 2. Locate your cluster and click it.

 3. You can now see the details of your cluster in the dashboard, including the cluster's public endpoint and a link to Service Fabric Explorer.

The **Node Monitor** section on the cluster's dashboard blade indicates the number of VMs that are healthy and not healthy. You can find more details about the cluster's health at [Service Fabric health model introduction][service-fabric-health-introduction].

>[AZURE.NOTE] Service Fabric clusters require a certain number of nodes to be up at all times in order to maintain availability and preserve state - referred to as "maintaining quorum". Consequently, it is typically not safe to shut down all of the machines in the cluster unless you have first performed a [full backup of your state][service-fabric-reliable-services-backup-restore].

## Remote connect to a Virtual Machine Scale Set instance or a cluster node

Each of the NodeTypes you specify in your cluster results in a VM Scale Set getting set up. Refer to [Remote connect to a VM Scale Set instance][remote-connect-to-a-vm-scale-set] for details.

## Next steps

After you've created a cluster, learn more about securing it and deploying apps:
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md)
- [Service Fabric cluster security](service-fabric-cluster-security.md)
- [Service Fabric health model introduction](service-fabric-health-introduction.md)


<!-- Links -->
[azure-powershell]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[service-fabric-rp-helpers]: https://github.com/ChackDan/Service-Fabric/tree/master/Scripts/ServiceFabricRPHelpers
[azure-portal]: https://portal.azure.com/
[key-vault-get-started]: ../key-vault/key-vault-get-started.md
[create-cluster-arm]: https://manage.windowsazure.com
[service-fabric-cluster-security]: service-fabric-cluster-security.md
[service-fabric-cluster-security-roles]: service-fabric-cluster-security-roles.md
[service-fabric-cluster-capacity]: service-fabric-cluster-capacity.md
[service-fabric-connect-and-communicate-with-services]: service-fabric-connect-and-communicate-with-services.md
[service-fabric-health-introduction]: service-fabric-health-introduction.md
[service-fabric-reliable-services-backup-restore]: service-fabric-reliable-services-backup-restore.md
[remote-connect-to-a-vm-scale-set]: service-fabric-cluster-nodetypes.md#remote-connect-to-a-vm-scale-set-instance-or-a-cluster-node

<!--Image references-->
[SearchforServiceFabricClusterTemplate]: ./media/service-fabric-cluster-creation-via-portal/SearchforServiceFabricClusterTemplate.png
[CreateRG]: ./media/service-fabric-cluster-creation-via-portal/CreateRG.png
[CreateNodeType]: ./media/service-fabric-cluster-creation-via-portal/NodeType.png
[SecurityConfigs]: ./media/service-fabric-cluster-creation-via-portal/SecurityConfigs.png
[Notifications]: ./media/service-fabric-cluster-creation-via-portal/notifications.png
[ClusterDashboard]: ./media/service-fabric-cluster-creation-via-portal/ClusterDashboard.png
[cluster-security-cert-installation]: ./media/service-fabric-cluster-creation-via-arm/cluster-security-cert-installation.png
