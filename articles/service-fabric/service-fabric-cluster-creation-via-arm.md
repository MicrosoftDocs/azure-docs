
<properties
   pageTitle="Create a secure Service Fabric cluster using Azure Resource Manager | Microsoft Azure"
   description="This article describes how to set up a secure Service Fabric cluster in Azure using Azure Resource Manager, Azure Key Vault, and Azure Active Directory (AAD) for client authentication."
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
   ms.date="09/25/2016"
   ms.author="vturecek"/>

# Create a Service Fabric cluster in Azure using Azure Resource Manager

> [AZURE.SELECTOR]
- [Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
- [Azure portal](service-fabric-cluster-creation-via-portal.md)

This is a step-by-step guide that walks you through the steps of setting up a secure Azure Service Fabric cluster in Azure using Azure Resource Manager. This guide walks you through the following steps:

 - Set up Key Vault to manage keys for cluster and application security.
 - Create a secured cluster in Azure with Azure Resource Manager.
 - Authenticate users with Azure Active Directory (AAD) for cluster management.

A secure cluster is a cluster that prevents unauthorized access to management operations, which includes deploying, upgrading, and deleting applications, services, and the data they contain. An unsecure cluster is a cluster that anyone can connect to at any time and perform management operations. Although it is possible to create an unsecure cluster, it is **highly recommended to create a secure cluster**. An unsecure cluster **cannot be secured later** - a new cluster must be created.

The concepts are the same for creating secure clusters, whether the clusters are Linux clusters or Windows clusters. For more information and helper scripts for creating secure Linux clusters, see [Creating secure clusters on Linux](#secure-linux-clusters)

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

This section walks through creating a Key Vault for a Service Fabric cluster in Azure and for Service Fabric applications. For a complete guide on Key Vault, refer to the [Key Vault getting started guide][key-vault-get-started].

Service Fabric uses X.509 certificates to secure a cluster and provide application security features. Azure Key Vault is used to manage certificates for Service Fabric clusters in Azure. When a cluster is deployed in Azure, the Azure resource provider responsible for creating Service Fabric clusters pulls certificates from Key Vault and installs them on the cluster VMs.

The following diagram illustrates the relationship between Key Vault, a Service Fabric cluster, and the Azure resource provider that uses certificates stored in Key Vault when it creates a cluster:

![Certificate installation][cluster-security-cert-installation]

### Create a Resource Group

The first step is to create a resource group specifically for Key Vault. Putting Key Vault into its own resource group is recommended. This allows you to remove the compute and storage resource groups, including the the resource group that has your Service Fabric cluster without losing your keys and secrets. The resource group that has your Key Vault must be in the same region as the cluster that is using it.

```powershell

	New-AzureRmResourceGroup -Name mycluster-keyvault -Location 'West US'
	WARNING: The output object type of this cmdlet is going to be modified in a future release.
	
	ResourceGroupName : mycluster-keyvault
	Location          : westus
	ProvisioningState : Succeeded
	Tags              :
	ResourceId        : /subscriptions/<guid>/resourceGroups/mycluster-keyvault

```

### Create Key Vault 

Create a Key Vault in the new resource group. The Key Vault **must be enabled for deployment** to allow the Service Fabric resource provider to get certificates from it and install on cluster nodes:

```powershell

	New-AzureRmKeyVault -VaultName 'myvault' -ResourceGroupName 'mycluster-keyvault' -Location 'West US' -EnabledForDeployment
	
	
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
 - The certificate's subject name must match the domain used to access the Service Fabric cluster. This matchng is required to provide SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain an SSL certificate from a certificate authority (CA) for the `.cloudapp.azure.com` domain. You must acquire a custom domain name for your cluster. When you request a certificate from a CA,  the certificate's subject name must match the custom domain name used for your cluster.

### Application certificates (optional)

Any number of additional certificates can be installed on a cluster for application security purposes. Before creating your cluster, consider the application security scenarios that require a certificate to be installed on the nodes, such as:

 - Encryption and decryption of application configuration values
 - Encryption of data across nodes during replication 

### Formatting certificates for Azure resource provider use

Private key files (.pfx) can be added and used directly through Key Vault. However, the Azure resource provider requires keys to be stored in a special JSON format that includes the .pfx as a base-64 encoded string and the private key password. To accommodate these requirements, keys must be placed in a JSON string and then stored as *secrets* in Key Vault.

To make this process easier, a PowerShell module is [available on GitHub][service-fabric-rp-helpers]. Follow these steps to use the module:

  1. Download the entire contents of the repo into a local directory. 
  2. Import the module in your PowerShell window:

  ```powershell
  PS C:\Users\vturecek> Import-Module "C:\users\vturecek\Documents\ServiceFabricRPHelpers\ServiceFabricRPHelpers.psm1"
  ```
     
The `Invoke-AddCertToKeyVault` command in this PowerShell module automatically formats a certificate private key into a JSON string and uploads it to Key Vault. Use it to add the cluster certificate and any additional application certificates to Key Vault. Repeat this step for any additional certificates you want to install in your cluster.

```powershell
 Invoke-AddCertToKeyVault -SubscriptionId <guid> -ResourceGroupName mycluster-keyvault -Location "West US" -VaultName myvault -CertificateName mycert -Password "<password>" -UseExistingCertificate -ExistingPfxFilePath "C:\path\to\mycertkey.pfx"
	
	Switching context to SubscriptionId <guid>
	Ensuring ResourceGroup mycluster-keyvault in West US
	WARNING: The output object type of this cmdlet is going to be modified in a future release.
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

The preceding strings are all the Key Vault prerequisites for configuring a Service Fabric cluster Resource Manager template that installs certificates for node authentication, management endpoint security and authentication, and any additional application security features that use X.509 certificates. At this point, you should now have the following setup in Azure:

 - Key Vault resource group
   - Key Vault
     - Cluster server authentication certificate
     - Application certificates

## Set up Azure Active Directory for client authentication

AAD enables organizations (known as tenants) to manage user access to applications, which are divided into applications with a web-based login UI and applications with a native client experience. In this document, we assume that you have already created a tenant. If not, start by reading [How to get an Azure Active Directory tenant][active-directory-howto-tenant].

A Service Fabric cluster offers several entry points to its management functionality, including the web-based [Service Fabric Explorer][service-fabric-visualizing-your-cluster] and [Visual Studio][service-fabric-manage-application-in-visual-studio]. As a result, you create two AAD applications to control access to the cluster, one web application and one native application.

To simplify some of the steps involved in configuring AAD with a Service Fabric cluster, we have created a set of Windows PowerShell scripts.

>[AZURE.NOTE] You must perform these steps *before* creating the cluster so in cases where the scripts expect cluster names and endpoints, these should be the planned values, not ones that you have already created.

1. [Download the scripts][sf-aad-ps-script-download] to your computer.

2. Right-click the zip file, choose **Properties**, then check the **Unblock** checkbox and apply.

3. Extract the zip file.

4. Run `SetupApplications.ps1`, providing the TenantId, ClusterName, and WebApplicationReplyUrl as parameters. For example:

    ```powershell
    .\SetupApplications.ps1 -TenantId '690ec069-8200-4068-9d01-5aaf188e557a' -ClusterName 'mycluster' -WebApplicationReplyUrl 'https://mycluster.westus.cloudapp.azure.com:19080/Explorer/index.html'
    ```

    You can find your **TenantId** by looking at the URL for the tenant in the Azure classic portal. The GUID embedded in that URL is the TenantId. For example:

    https://<i></i>manage.windowsazure.com/microsoft.onmicrosoft.com#Workspaces/ActiveDirectoryExtension/Directory/**690ec069-8200-4068-9d01-5aaf188e557a**/users

    The **ClusterName** is used to prefix the AAD applications created by the script. It does not need to match the actual cluster name exactly as it is only intended to make it easier for you to map AAD artifacts to the Service Fabric cluster that they're being used with.

    The **WebApplicationReplyUrl** is the default endpoint that AAD returns to your users after completing the sign-in process. You should set this to the Service Fabric Explorer endpoint for your cluster, which by default is:

    https://&lt;cluster_domain&gt;:19080/Explorer

    You are prompted to sign into an account that has administrative privileges for the AAD tenant. Once you do, the script proceeds to create the web and native applications to represent your Service Fabric cluster. If you look at the tenant's applications in the [Azure classic portal][azure-classic-portal], you should see two new entries:

    - *ClusterName*\_Cluster
    - *ClusterName*\_Client

    The script prints the Json required by the Azure Resource Manager template when you create the cluster in the next section so keep the PowerShell window open.

```json
"azureActiveDirectory": {
  "tenantId":"<guid>",
  "clusterApplication":"<guid>",
  "clientApplication":"<guid>"
},
```

## Create a Service Fabric cluster Resource Manager template

In this section, the output of the preceding PowerShell commands are used in a Service Fabric cluster Resource Manager template.

Sample Resource Manager templates are available in the [Azure quick-start template gallery on GitHub][azure-quickstart-templates]. These templates can be used as a starting point for your cluster template. 

### Create the Resource Manager template

This guide uses the [5-node secure cluster][service-fabric-secure-cluster-5-node-1-nodetype-wad] example template and template parameters. Download `azuredeploy.json` and `azuredeploy.parameters.json` to your computer and open both files in your favorite text editor.

### Add certificates

Certificates are added to a cluster Resource Manager template by referencing the Key Vault that contains the certificate keys. It is recommended that these Key Vault values are placed in a Resource Manager template parameters file to keep the Resource Manager template file reusable and free of values specific to a deployment.

#### Add all certificates to the VMSS osProfile

Every certificate that needs to be installed in the cluster must be configured in the osProfile section of the VMSS resource (Microsoft.Compute/virtualMachineScaleSets). This instructs the resource provider to install the certificate on the VMs. This includes the cluster certificate as well as any application security certificates you plan to use for your applications:

```json
{
  "apiVersion": "2016-03-30",
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  ...
  "properties": {
    ...
    "osProfile": {
      ...
      "secrets": [
        {
          "sourceVault": {
            "id": "[parameters('sourceVaultValue')]"
          },
          "vaultCertificates": [
            {
              "certificateStore": "[parameters('clusterCertificateStorevalue')]",
              "certificateUrl": "[parameters('clusterCertificateUrlValue')]"
            },
            {
              "certificateStore": "[parameters('applicationCertificateStorevalue')",
              "certificateUrl": "[parameters('applicationCertificateUrlValue')]"
            },
            ...
          ]
        }
      ]
    }
  }
}
```

#### Configure Service Fabric cluster certificate

The cluster authentication certificate must also be configured in the Service Fabric cluster resource (Microsoft.ServiceFabric/clusters) and in the Service Fabric extension for VMSS in the VMSS resource. This allows the Service Fabric resource provider to configure it for use for cluster authentication and server authentication for management endpoints.

##### VMSS resource:

```json
{
  "apiVersion": "2016-03-30",
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  ...
  "properties": {
    ...
    "virtualMachineProfile": {
      "extensionProfile": {
        "extensions": [
          {
            "name": "[concat('ServiceFabricNodeVmExt','_vmNodeType0Name')]",
            "properties": {
              ...
              "settings": {
                ...
                "certificate": {
                  "thumbprint": "[parameters('clusterCertificateThumbprint')]",
                  "x509StoreName": "[parameters('clusterCertificateStoreValue')]"
                },
                ...
              }
            }
          }
        ]
      }
    }
  }
}
```

##### Service Fabric resource:

```json
{
  "apiVersion": "2016-03-01",
  "type": "Microsoft.ServiceFabric/clusters",
  "name": "[parameters('clusterName')]",
  "location": "[parameters('clusterLocation')]",
  "dependsOn": [
    "[concat('Microsoft.Storage/storageAccounts/', variables('supportLogStorageAccountName'))]"
  ],
  "properties": {
    "certificate": {
      "thumbprint": "[parameters('clusterCertificateThumbprint')]",
      "x509StoreName": "[parameters('clusterCertificateStoreValue')]"
    },
    ...
  }
}
```

### Insert AAD config

The AAD configuration created earlier can be inserted directly into your Resource Manager template, however it is recommended to extract the values into parameters first into a parameters file to keep the Resource Manager template reusable and free of values specific to a deployment.

```json
{
  "apiVersion": "2016-03-01",
  "type": "Microsoft.ServiceFabric/clusters",
  "name": "[parameters('clusterName')]",
  ...
  "properties": {
    "certificate": {
      "thumbprint": "[parameters('clusterCertificateThumbprint')]",
      "x509StoreName": "[parameters('clusterCertificateStorevalue')]"
    },
    ...
    "azureActiveDirectory": {
      "tenantId": "[parameters('aadTenantId')]",
      "clusterApplication": "[parameters('aadClusterApplicationId')]",
      "clientApplication": "[parameters('aadClientApplicationId')]"
    },
    ...
  }
}
```

### <a "configure-arm" ></a>Configure Resource Manager template parameters

Finally, use the output values from the Key Vault and AAD PowerShell commands to populate the parameters file:

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": { 
        ...
        "clusterCertificateStoreValue": {
            "value": "My"
        },
        "clusterCertificateThumbprint": {
            "value": "<thumbprint>"
        },
        "clusterCertificateUrlValue": {
            "value": "https://myvault.vault.azure.net:443/secrets/myclustercert/4d087088df974e869f1c0978cb100e47"
        },
        "applicationCertificateStorevalue": {
            "value": "My"
        },
        "applicationCertificateUrlValue": {
            "value": "https://myvault.vault.azure.net:443/secrets/myapplicationcert/2e035058ae274f869c4d0348ca100f08"
        },
        "sourceVaultvalue": {
            "value": "/subscriptions/<guid>/resourceGroups/mycluster-keyvault/providers/Microsoft.KeyVault/vaults/myvault"
        },
        "aadTenantId": {
            "value": "<guid>"
        },
        "aadClusterApplicationId": {
            "value": "<guid>"
        },
        "aadClientApplicationId": {
            "value": "<guid>"
        },
        ...
    }
}
```
At this point, you should now have the following:

 - Key Vault resource group
    - Key Vault
    - Cluster server authentication certificate
    - Data encipherment certificate
 - Azure Active Directory tenant 
    - AAD Application for web-based management and Service Fabric Explorer
    - AAD Application for native client management
    - Users with roles assigned 
 - Service Fabric cluster Resource Manager template
    - Certificates configured through Key Vault
    - Azure Active Directory configured 

The following diagram illustrates where Key Vault and AAD configuration fit into your Resource Manager template.

![Resource Manager dependency map][cluster-security-arm-dependency-map]

## Create the cluster

You are now ready to create the cluster using [ARM deployment][resource-group-template-deploy].

#### Test it

Use the following PowerShell command to test your Resource Manager template with a parameters file:

```powershell
Test-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json
```

#### Deploy it

If the Resource Manager template test passes, use the following PowerShell command to deploy your Resource Manager template with a parameters file:

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json
```

<a name="assign-roles"></a>
## Assign users to roles

Once you have created the applications to represent your cluster, you need to assign your users to the roles supported by Service Fabric: read-only and admin. You can do this using the [Azure classic portal][azure-classic-portal].

1. Navigate to your tenant and choose Applications.
2. Choose the web application, which has a name like `myTestCluster_Cluster`.
3. Click the Users tab.
4. Choose a user to assign and click the **Assign** button at the bottom of the screen.

    ![Assign users to roles button][assign-users-to-roles-button]

5. Select the role to assign to the user.

    ![Assign users to roles][assign-users-to-roles-dialog]

>[AZURE.NOTE] For more information about roles in Service Fabric, see [Role-based access control for Service Fabric clients](service-fabric-cluster-security-roles.md).

 <a name="secure-linux-cluster"></a> 
##  Create secure clusters on Linux

To make the process easier, a helper script has been provided [here](http://github.com/ChackDan/Service-Fabric/tree/master/Scripts/CertUpload4Linux). For using this helper script, it is assumed that you have already Azure CLI installed, and it is in your path. Make sure that the script has permissions to execute by running `chmod +x cert_helper.py` after downloading it. The first step is to log into your Azure account using the CLI with the `azure login` command. After logging into your Azure account, use the helper with your CA signed certificate, as the following command shows:

```sh
./cert_helper.py [-h] CERT_TYPE [-ifile INPUT_CERT_FILE] [-sub SUBSCRIPTION_ID] [-rgname RESOURCE_GROUP_NAME] [-kv KEY_VAULT_NAME] [-sname CERTIFICATE_NAME] [-l LOCATION] [-p PASSWORD]

The -ifile parameter can take a .pfx or a .pem file as input, with the certificate type (pfx or pem, or ss if it is a self-signed cert).
The parameter -h prints out the help text.
```

This command returns the following three strings as the output: 

1. A SourceVaultID, which is the ID for the new KeyVault ResourceGroup it created for you. 

2. A CertificateUrl for accessing the certificate.

3. A CertificateThumbprint, which is used for authentication.


The following example shows how to use the command:

```sh
./cert_helper.py pfx -sub "fffffff-ffff-ffff-ffff-ffffffffffff"  -rgname "mykvrg" -kv "mykevname" -ifile "/home/test/cert.pfx" -sname "mycert" -l "East US" -p "pfxtest"
```
Executing the preceding command provides you with the three strings as follows:

```sh
SourceVault: /subscriptions/fffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/mykvrg/providers/Microsoft.KeyVault/vaults/mykvname
CertificateUrl: https://myvault.vault.azure.net/secrets/mycert/00000000000000000000000000000000
CertificateThumbprint: 0xfffffffffffffffffffffffffffffffffffffffff
```

 The certificate's subject name must match the domain used to access the Service Fabric cluster. This is required to provide SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain an SSL certificate from a certificate authority (CA) for the `.cloudapp.azure.com` domain. You must acquire a custom domain name for your cluster. When you request a certificate from a CA the certificate's subject name must match the custom domain name used for your cluster.

These are the entries needed for creating a secure service fabric cluster (without AAD) as described at [Configure Resource Manager template parameters](#configure-arm). You can connect to the secure cluster via instructions at [authenticating client access to a cluster](service-fabric-connect-to-secure-cluster.md). Linux preview clusters do not support AAD authentication. You can assign admin and client roles as described in the section [Assign roles to users](#assign-roles). When specifying admin and client roles for a Linux preview cluster, you have to provide certificate thumbprints for authentication (as opposed to subject name, since no chain validation or revocation is being performed in this preview release).


If you wish to use a self-signed certificate for testing, you could use the same script to generate a self-signed certificate and upload it to KeyVault, by providing the flag -ss instead of providing the certificate path and certificate name. For example, see the following command for creating and uploading a self-signed certificate:

```sh
./cert_helper.py ss -rgname "mykvrg" -sub "fffffff-ffff-ffff-ffff-ffffffffffff" -kv "mykevname"   -sname "mycert" -l "East US" -p "selftest"
```

This command returns the same three strings, SourceVault, CertificateUrl and CertificateThumbprint, which is used to create a secure Linux cluster, along with the location where the self-signed certificate was placed. You will need the self-signed certificate to connect to the cluster.  You can connect to the secure cluster via instructions at [authenticating client access to a cluster](service-fabric-connect-to-secure-cluster.md). 
The certificate's subject name must match the domain used to access the Service Fabric cluster. This is required to provide SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain an SSL certificate from a certificate authority (CA) for the `.cloudapp.azure.com` domain. You must acquire a custom domain name for your cluster. When you request a certificate from a CA the certificate's subject name must match the custom domain name used for your cluster.

The parameters provided by the helper script can be filled in the portal as described in the section [Create a cluster in the Azure portal](service-fabric-cluster-creation-via-portal.md#create-cluster-portal).

## Next steps

At this point, you have a secure cluster with Azure Active Directory providing management authentication. Next, [connect to your cluster](service-fabric-connect-to-secure-cluster.md) and learn how to [manage application secrets](service-fabric-application-secret-management.md).

<!-- Links -->
[azure-powershell]:https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[key-vault-get-started]:../key-vault/key-vault-get-started.md
[aad-graph-api-docs]:https://msdn.microsoft.com/library/azure/ad/graph/api/api-catalog
[azure-classic-portal]: https://manage.windowsazure.com
[service-fabric-rp-helpers]: https://github.com/ChackDan/Service-Fabric/tree/master/Scripts/ServiceFabricRPHelpers
[service-fabric-cluster-security]: service-fabric-cluster-security.md
[active-directory-howto-tenant]: ../active-directory/active-directory-howto-tenant.md
[service-fabric-visualizing-your-cluster]: service-fabric-visualizing-your-cluster.md
[service-fabric-manage-application-in-visual-studio]: service-fabric-manage-application-in-visual-studio.md
[sf-aad-ps-script-download]:http://servicefabricsdkstorage.blob.core.windows.net/publicrelease/MicrosoftAzureServiceFabric-AADHelpers.zip
[azure-quickstart-templates]: https://github.com/Azure/azure-quickstart-templates
[service-fabric-secure-cluster-5-node-1-nodetype-wad]: https://github.com/Azure/azure-quickstart-templates/blob/master/service-fabric-secure-cluster-5-node-1-nodetype-wad/
[resource-group-template-deploy]: https://azure.microsoft.com/documentation/articles/resource-group-template-deploy/

<!-- Images -->
[cluster-security-arm-dependency-map]: ./media/service-fabric-cluster-creation-via-arm/cluster-security-arm-dependency-map.png
[cluster-security-cert-installation]: ./media/service-fabric-cluster-creation-via-arm/cluster-security-cert-installation.png
[assign-users-to-roles-button]: ./media/service-fabric-cluster-creation-via-arm/assign-users-to-roles-button.png
[assign-users-to-roles-dialog]: ./media/service-fabric-cluster-creation-via-arm/assign-users-to-roles.png
