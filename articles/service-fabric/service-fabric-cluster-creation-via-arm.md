---
title: Create an Azure Service Fabric cluster from a template | Microsoft Docs
description: This article describes how to set up a secure Service Fabric cluster in Azure by using Azure Resource Manager, Azure Key Vault, and Azure Active Directory (Azure AD) for client authentication.
services: service-fabric
documentationcenter: .net
author: chackdan
manager: timlt
editor: chackdan
ms.assetid: 15d0ab67-fc66-4108-8038-3584eeebabaa
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/07/2017
ms.author: chackdan

---
# Create a Service Fabric cluster by using Azure Resource Manager 
> [!div class="op_single_selector"]
> * [Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
> * [Azure portal](service-fabric-cluster-creation-via-portal.md)
>
>

This step-by-step guide walks you through setting up a secure Azure Service Fabric cluster in Azure by using Azure Resource Manager. We acknowledge that the article is long. Nevertheless, unless you are already thoroughly familiar with the content, be sure to follow each step carefully.

The guide covers the following procedures:

* Key Concepts that you need to be aware off before deploying a service fabric cluster.
* Creating a cluster in Azure by using service fabric Resource Manager modules.
* Setting up Azure Active Directory (Azure AD) for authenticating users performing management operations on the cluster.
* Authoring a custom Azure Resource Manager template for your cluster and deploying it.

## Key concepts to be aware of
In Azure, Service fabric mandates that you to use an x509 certificate to secure your cluster and its endpoints. Certificates are used in Service Fabric to provide authentication and encryption to secure various aspects of a cluster and its applications. For client access/performing management operations on the cluster,including deploying, upgrading, and deleting applications, services, and the data they contain, you can use certificates or Azure Active Directory credentials. The use of Azure Active Directory is highly encouraged, since that is the only way to prevent sharing of certificates on your clients.  For more information on how certificates are used in Service Fabric, see [Service Fabric cluster security scenarios][service-fabric-cluster-security].

Service Fabric uses X.509 certificates to secure a cluster and provide application security features. You use [Key Vault][key-vault-get-started] to manage certificates for Service Fabric clusters in Azure. 


### Cluster and server certificate (required)
These certificates (one primary and optionally a secondary) are required to secure a cluster and prevent unauthorized access to it. It provides cluster security in two ways:

* **Cluster authentication:** Authenticates node-to-node communication for cluster federation. Only nodes that can prove their identity with this certificate can join the cluster.
* **Server authentication:** Authenticates the cluster management endpoints to a management client, so that the management client knows it is talking to the real cluster and not a 'man in the middle'. This certificate also provides an SSL for the HTTPS management API and for Service Fabric Explorer over HTTPS.

To serve these purposes, the certificate must meet the following requirements:

* The certificate must contain a private key. These certificates typically have extensions .pfx or .pem  
* The certificate must be created for key exchange, which is exportable to a Personal Information Exchange (.pfx) file.
* The **certificate's subject name must match the domain that you use to access the Service Fabric cluster**. This matching is required to provide an SSL for the cluster's HTTPS management endpoint and Service Fabric Explorer. You cannot obtain an SSL certificate from a certificate authority (CA) for the *.cloudapp.azure.com domain. You must obtain a custom domain name for your cluster. When you request a certificate from a CA, the certificate's subject name must match the custom domain name that you use for your cluster.

### Set up Azure Active Directory for client authentication (Optional, but recommended)

Azure AD enables organizations (known as tenants) to manage user access to applications. Applications are divided into those with a web-based sign-in UI and those with a native client experience. In this article, we assume that you have already created a tenant. If you have not, start by reading [How to get an Azure Active Directory tenant][active-directory-howto-tenant].

A Service Fabric cluster offers several entry points to its management functionality, including the web-based [Service Fabric Explorer][service-fabric-visualizing-your-cluster] and [Visual Studio][service-fabric-manage-application-in-visual-studio]. As a result, you create two Azure AD applications to control access to the cluster, one web application and one native application.

More on how to set it up later in the document.

### Application certificates (optional)
Any number of additional certificates can be installed on a cluster for application security purposes. Before creating your cluster, consider the application security scenarios that require a certificate to be installed on the nodes, such as:

* Encryption and decryption of application configuration values.
* Encryption of data across nodes during replication.

The concept of creating secure clusters is the same, whether they are Linux or Windows clusters. 

### Client authentication certificates (optional)
Any number of additional certificates can be specified for Admin or user client operations. By default the cluster certificate has admin client privileges. These additional client certificates should not be installed into the cluster, it just needs to be specified as being allowed in the cluster configuration, however, they need to be installed on the client machines to connect to the cluster and perform any management operations.


## Prerequisites 
The concept of creating secure clusters is the same, whether they are Linux or Windows clusters. This guide covers the use of azure powershell or  azure CLI to create new clusters. The prerequisites are either 

-  [Azure PowerShell 4.1 and above][azure-powershell] or [Azure CLI 2.0 and above][azure-CLI].
-  you can find details on the service fabic modules here - [AzureRM.ServiceFabric](https://docs.microsoft.com/powershell/module/azurerm.servicefabric)  and [az SF CLI module](https://docs.microsoft.com/cli/azure/sf?view=azure-cli-latest)


## Use service fabric RM module to deploy a cluster

In this document, we would use the service fabric RM powershell and CLI module to deploy a cluster, the powershell or the CLI module command allows for multiple scenarios. Let us go through each of the them. Pick the scenario that you feel best meets your needs. 

- Create a new cluster - using a system generated self signed certificate
	- Use a default cluster template
	- use a template that you already have
- Create a new cluster - using a certificate you already own
	- Use a default cluster template
	- use a template that you already have

### Create new cluster  - using a system generated self signed certificate

Use the following command to create cluster, if you have want the system to generate a self signed certificate and use it to secure your cluster. This command sets up a primary cluster certificate that is used for cluster security and to set up admin access to perform management operations using that certificate.

### login in to Azure.

```Powershell

Login-AzureRmAccount
Set-AzureRmContext -SubscriptionId <guid>

```

```CLI

azure login
az account set --subscription $subscriptionId

```
#### Use the default 5 Node 1 nodetype template that ships in the module to set up the cluster

Use the following command to create a cluster quickly, by specifying minimal parameters

The template that is used is available on the [azure service fabric template samples : windows template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure-NSG)
 and [Ubuntu template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Ubuntu-1-NodeTypes-Secure)

The commands below works for creating Windows and Linux clusters, you just need to specify the OS accordingly. The powershell/ CLI commands also outputs the certificate certificate in the specified in theCertificateOutputFolder. The command takes in other parameters like VM SKU as well.

```Powershell

$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$vaultName="myvault"
$vaultResourceGroupName="myvaultrg"
$CertSubjectName="mycluster.westus.cloudapp.azure.com"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$vmpassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force
$vmuser="myadmin"
$os="WindowsServer2016DatacenterwithContainers"
$certOutputFolder="c:\certificates"

New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -CertificateOutputFolder $certOutputFolder -CertificatePassword $certpassword -CertificateSubjectName $CertSubjectName -OS $os -VmPassword $vmpassword -VmUserName $vmuser 

```

```CLI

declare resourceGroupLocation="westus"
declare resourceGroupName="mylinux"
declare vaultResourceGroupName="myvaultrg"
declare vaultName="myvault"
declare CertSubjectName="mylinux.westus.cloudapp.azure.com"
declare vmpassword="Password!1"
declare certpassword="Password!1"
declare vmuser="myadmin"
declare vmOs="UbuntuServer1604"
declare certOutputFolder="c:\certificates"



az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--certificate-output-folder $certOutputFolder --certificate-password $certpassword  \
	--vault-name $vaultName --vault-resource-group $resourceGroupName  \
    --template-file $templateFilePath --parameter-file $parametersFilePath --vm-os $vmOs  \
	--vm-password $vmpassword --vm-user-name $vmuser

```

#### Use the custom template that you already have 

If you need to author a custom template to suit your needs, it is highly recomended that you start with one of the templates that are available on the [azure service fabric template samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master). Follow guidance and explanations to [customize your cluster template][customize-your-cluster-template] section below.

If you already have a custom template, then make sure to double check, that all the three certificate  related parameters in the template and the parameter file are named  as follows and values are null as follows.

```Json
   "certificateThumbprint": {
      "value": ""
    },
    "sourceVaultValue": {
      "value": ""
    },
    "certificateUrlValue": {
      "value": ""
    },
```


```Powershell


$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$CertSubjectName="mycluster.westus.cloudapp.azure.com"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$certOutputFolder="c:\certificates"

$parameterFilePath="c:\mytemplates\mytemplateparm.json"
$templateFilePath="c:\mytemplates\mytemplate.json"


New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -CertificateOutputFolder $certOutputFolder -CertificatePassword $certpassword -CertificateSubjectName $CertSubjectName -TemplateFile $templateFilePath -ParameterFile $parameterFilePath 

```

Here is the equivalent CLI command to do the same. Change the values in the declare statements to appropriate values. CLI supports all the other parameters that the above powershell command supports.

```CLI

declare certPassword=""
declare resourceGroupLocation="westus"
declare resourceGroupName="mylinux"
declare certSubjectName="mylinuxsecure.westus.cloudapp.azure.com"
declare parameterFilePath="c:\mytemplates\linuxtemplateparm.json"
declare templateFilePath="c:\mytemplates\linuxtemplate.json"
declare certOutputFolder="c:\certificates"


az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--certificate-output-folder $certOutputFolder --certificate-password $certPassword  \
	--certificate-subject-name $certSubjectName \
    --template-file $templateFilePath --parameter-file $parametersFilePath

```


### Create new cluster - using the certificate you bought from a CA or you already have.

Use the following command to create cluster, if you have a certificate that you want to use to secure your cluster with.

If this is a CA signed certificate that you will end up using for other purposes as well, then it is recommended that you provide a distinct resource group specifically for your key vault. We recommend that you put the key vault into its own resource group. This action lets you remove the compute and storage resource groups, including the resource group that contains your Service Fabric cluster, without losing your keys and secrets. **The resource group that contains your key vault _must be in the same region_ as the cluster that is using it.**


#### Use the default 5 Node 1 nodetype template that ships in the module
The template that is used is available on the [azure samples : windows template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure-NSG)
 and [Ubuntu template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Ubuntu-1-NodeTypes-Secure)

```Powershell
$resourceGroupLocation="westus"
$resourceGroupName="mylinux"
$vaultName="myvault"
$vaultResourceGroupName="myvaultrg"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$vmpassword=("Password!1" | ConvertTo-SecureString -AsPlainText -Force) 
$vmuser="myadmin"
$os="WindowsServer2016DatacenterwithContainers"

New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -KeyVaultResouceGroupName $vaultResourceGroupName -KeyVaultName $vaultName -CertificateFile C:\MyCertificates\chackocertificate3.pfx -CertificatePassword $certPassword -OS $os -VmPassword $vmpassword -VmUserName $vmuser 

```

```CLI

declare vmPassword="Password!1"
declare certPassword="Password!1"
declare vmUser="myadmin"
declare resourceGroupLocation="westus"
declare resourceGroupName="mylinux"
declare vaultResourceGroupName="myvaultrg"
declare vaultName="myvault"
declare certificate-file="c:\certificates\mycert.pem"
declare vmOs="UbuntuServer1604"


az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--certificate-file $certificate-file --certificate-password $certPassword  \
	--vault-name $vaultName --vault-resource-group $vaultResourceGroupName  \
    --vm-os vmOs \
	--vm-password $vmPassword --vm-user-name $vmUser

```

#### Use the custom template that you have 
If you need to author a custom template to suit your needs, it is highly recomended that you start with one of the templates that are available on the [azure service fabric template samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master). Follow guidance and explanations to [customize your cluster template][customize-your-cluster-template] section below.

If you already have a custom template, then make sure to double check, that all the three certificate  related parameters in the template and the parameter file are named  as follows and values are null as follows.

```Json
   "certificateThumbprint": {
      "value": ""
    },
    "sourceVaultValue": {
      "value": ""
    },
    "certificateUrlValue": {
      "value": ""
    },
```


```Powershell

$resourceGroupLocation="westus"
$resourceGroupName="mylinux"
$vaultName="myvault"
$vaultResourceGroupName="myvaultrg"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$os="WindowsServer2016DatacenterwithContainers"
$parameterFilePath="c:\mytemplates\mytemplateparm.json"
$templateFilePath="c:\mytemplates\mytemplate.json"
$certificateFile="C:\MyCertificates\chackonewcertificate3.pem"


New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -TemplateFile $templateFilePath -ParameterFile $parameterFilePath -KeyVaultResouceGroupName $vaultResourceGroupName -KeyVaultName $vaultName -CertificateFile $certificateFile -CertificatePassword #certPassword

```

Here is the equivalent CLI command to do the same. Change the values in the declare statements to appropriate values.

```CLI

declare certPassword="Password!1"
declare resourceGroupLocation="westus"
declare resourceGroupName="mylinux"
declare vaultResourceGroupName="myvaultrg"
declare vaultName="myvault"
declare parameterFilePath="c:\mytemplates\linuxtemplateparm.json"
declare templateFilePath="c:\mytemplates\linuxtemplate.json"

az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--certificate-file $certificate-file --certificate-password $password  \
	--vault-name $vaultName --vault-resource-group $vaultResourceGroupName  \
    --template-file $templateFilePath --parameter-file $parametersFilePath 
```

#### Use a pointer to the secret you already have uploaded into the keyvault

To use an existing key vault, you _must enable it for deployment_ to allow the compute resource provider to get certificates from it and install it on cluster nodes:

```powershell

Set-AzureRmKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -EnabledForDeployment


$parameterFilePath="c:\mytemplates\mytemplate.json"
$templateFilePath="c:\mytemplates\mytemplateparm.json"
$secertId="https://test1.vault.azure.net:443/secrets/testcertificate4/55ec7c4dc61a462bbc645ffc9b4b225f"


New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroup -SecretIdentifier $secretID -TemplateFile $templateFile -ParameterFile $templateParmfile 

```
Here is the equivalent CLI command to do the same. Change the values in the declare statements to appropriate values.

```cli

declare $parameterFilePath="c:\mytemplates\mytemplate.json"
declare $templateFilePath="c:\mytemplates\mytemplateparm.json"
declare $secertId="https://test1.vault.azure.net:443/secrets/testcertificate4/55ec7c4dc61a462bbc645ffc9b4b225f"


az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--secret-identifieraz $secretID  \
    --template-file $templateFilePath --parameter-file $parametersFilePath 

```

<a id="add-AAD-for-client"></a>

## Set up Azure Active Directory for client authentication

Azure AD enables organizations (known as tenants) to manage user access to applications. Applications are divided into those with a web-based sign-in UI and those with a native client experience. In this article, we assume that you have already created a tenant. If you have not, start by reading [How to get an Azure Active Directory tenant][active-directory-howto-tenant].

A Service Fabric cluster offers several entry points to its management functionality, including the web-based [Service Fabric Explorer][service-fabric-visualizing-your-cluster] and [Visual Studio][service-fabric-manage-application-in-visual-studio]. As a result, you create two Azure AD applications to control access to the cluster, one web application and one native application.

To simplify some of the steps involved in configuring Azure AD with a Service Fabric cluster, we have created a set of Windows PowerShell scripts.

> [!NOTE]
> You must complete the following steps before you create the cluster. Because the scripts expect cluster names and endpoints, the values should be planned and not values that you have already created.

1. [Download the scripts][sf-aad-ps-script-download] to your computer.
2. Right-click the zip file, select **Properties**, select the **Unblock** check box, and then click **Apply**.
3. Extract the zip file.
4. Run `SetupApplications.ps1`, and provide the TenantId, ClusterName, and WebApplicationReplyUrl as parameters. For example:

```powershell
    .\SetupApplications.ps1 -TenantId '690ec069-8200-4068-9d01-5aaf188e557a' -ClusterName 'mycluster' -WebApplicationReplyUrl 'https://mycluster.westus.cloudapp.azure.com:19080/Explorer/index.html'

```

You can find your TenantId by executing the PowerShell command `Get-AzureSubscription`. Executing this command displays the TenantId for every subscription.

ClusterName is used to prefix the Azure AD applications that are created by the script. It does not need to match the actual cluster name exactly. It is intended only to make it easier to map Azure AD artifacts to the Service Fabric cluster that they're being used with.

WebApplicationReplyUrl is the default endpoint that Azure AD returns to your users after they finish signing in. Set this endpoint as the Service Fabric Explorer endpoint for your cluster, which by default is:

https://&lt;cluster_domain&gt;:19080/Explorer

You are prompted to sign in to an account that has administrative privileges for the Azure AD tenant. After you sign in, the script creates the web and native applications to represent your Service Fabric cluster. If you look at the tenant's applications in the [Azure classic portal][azure-classic-portal], you should see two new entries:

   * *ClusterName*\_Cluster
   * *ClusterName*\_Client

The script prints the JSON required by the Azure Resource Manager template when you create the cluster in the next section, so it's a good idea to keep the PowerShell window open.

```json
"azureActiveDirectory": {
  "tenantId":"<guid>",
  "clusterApplication":"<guid>",
  "clientApplication":"<guid>"
},
```

<a id="customize-arm-template" ></a>

## Create a Service Fabric cluster Resource Manager template
This section is for users who want to custom author a Service Fabric cluster Resource Manager template. once you have a template, you can still go back and use the powershell or CLI modules to deploy it. 

Sample Resource Manager templates are available in the [Azure samples on GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates). These templates can be used as a starting point for your cluster template.

### Create the Resource Manager template
This guide uses the [5-node secure cluster][service-fabric-secure-cluster-5-node-1-nodetype] example template and template parameters. Download `azuredeploy.json` and `azuredeploy.parameters.json` to your computer and open both files in your favorite text editor.

### Add certificates
You add certificates to a cluster Resource Manager template by referencing the key vault that contains the certificate keys. Add those key-vault parameters and values in a Resource Manager template parameters file (azuredeploy.parameters.json). 

#### Add all certificates to the virtual machine scale set osProfile
Every certificate that's installed in the cluster must be configured in the osProfile section of the scale set resource (Microsoft.Compute/virtualMachineScaleSets). This action instructs the resource provider to install the certificate on the VMs. This installation includes both the cluster certificate and any application security certificates that you plan to use for your applications:

```json
{
  "apiVersion": "[variables('vmssApiVersion')]",
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

#### Configure the Service Fabric cluster certificate
The cluster authentication certificate must be configured in both the Service Fabric cluster resource (Microsoft.ServiceFabric/clusters) and the Service Fabric extension for virtual machine scale sets in the virtual machine scale set resource. This arrangement allows the Service Fabric resource provider to configure it for use for cluster authentication and server authentication for management endpoints.

##### Add the certificate information the Virtual machine scale set resource:
```json
{
  "apiVersion": "[variables('vmssApiVersion')]",
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

##### Add the certificate information to the Service Fabric cluster resource:
```json
{
  "apiVersion": "[variables('sfrpApiVersion')]",
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

### Add Azure AD configuration to use Azure AD for client access

You add the Azure AD configuration s to a cluster Resource Manager template by referencing the key vault that contains the certificate keys. Add those Azure AD parameters and values in a Resource Manager template parameters file (azuredeploy.parameters.json).

```json
{
  "apiVersion": "[variables('sfrpApiVersion')]",
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

### Populate the parameter file with the values.
Finally, use the output values from the key vault and Azure AD powershell commands to populate the parameters file:

If you plan to use the Azure service fabric RM powershell modules, then you do not need to populate the cluster certificate information, if you you want the system to generate the self signed certificate for cluster security you, just keep them as null. 

> [!NOTE]
> For the RM modules to pick up and populate these empty parameter values, the parameters names much match the names below
>

```json
        "clusterCertificateThumbprint": {
            "value": ""
        },
        "clusterCertificateUrlValue": {
            "value": ""
        },
        "sourceVaultvalue": {
            "value": ""
        },
```

If you are using application certs or are using an existing cluster that you have uploaded to the keyvault, you need to get this information and populate it 

The RM modules do not have the ability to geneate the Azure AD configuration for you. so if you plan to use the Azure AD for client access, you need to populate it.

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

### Test your template  
Use the following PowerShell command to test your Resource Manager template with a parameter file:

```powershell
Test-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json
```

In case you run into issues and get cryptic messages, then use "-Debug" as an option.

```powershell
Test-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json -Debug
```

The following diagram illustrates where your key vault and Azure AD configuration fit into your Resource Manager template.

![Resource Manager dependency map][cluster-security-arm-dependency-map]

## Create the cluster using Azure resource template 

You can now deploy you cluster using the steps outlined earlier in the document, or if you have 
 the values in the parameter file, populated, then You are now ready to create the cluster by using [Azure resource template deployment][resource-group-template-deploy] directly.

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json
```

In case you run into issues and get cryptic messages, then use "-Debug" as an option.


<a name="assign-roles"></a>

## Assign users to roles
After you have created the applications to represent your cluster, assign your users to the roles supported by Service Fabric: read-only and admin. You can assign the roles by using the [Azure classic portal][azure-classic-portal].

1. In the Azure portal, go to your tenant, and then select **Applications**.
2. Select the web application, which has a name like `myTestCluster_Cluster`.
3. Click the **Users** tab.
4. Select a user to assign, and then click the **Assign** button at the bottom of the screen.

    ![Assign users to roles button][assign-users-to-roles-button]
5. Select the role to assign to the user.

    !["Assign Users" dialog box][assign-users-to-roles-dialog]

> [!NOTE]
> For more information about roles in Service Fabric, see [Role-based access control for Service Fabric clients](service-fabric-cluster-security-roles.md).
>
>


## Troubleshooting help in setting up Azure Active Directory
Setting up Azure AD and using it, can be challenging, so here are some pointers on what you can do to debug the issue.

### Service Fabric Explorer prompts you to select a certificate
#### Problem
After you sign in successfully to Azure AD in Service Fabric Explorer, the browser returns to the home page but a message prompts you to select a certificate.

![SFX certificate dialog][sfx-select-certificate-dialog]

#### Reason
The user isn’t assigned a role in the Azure AD cluster application. Thus, Azure AD authentication fails on Service Fabric cluster. Service Fabric Explorer falls back to certificate authentication.

#### Solution
Follow the instructions for setting up Azure AD, and assign user roles. Also, we recommend that you turn on “User assignment required to access app,” as `SetupApplications.ps1` does.

### Connection with PowerShell fails with an error: "The specified credentials are invalid"
#### Problem
When you use PowerShell to connect to the cluster by using “AzureActiveDirectory” security mode, after you sign in successfully to Azure AD, the connection fails with an error: "The specified credentials are invalid."

#### Solution
This solution is the same as the preceding one.

### Service Fabric Explorer returns a failure when you sign in: "AADSTS50011"
#### Problem
When you try to sign in to Azure AD in Service Fabric Explorer, the page returns a failure: "AADSTS50011: The reply address &lt;url&gt; does not match the reply addresses configured for the application: &lt;guid&gt;."

![SFX reply address does not match][sfx-reply-address-not-match]

#### Reason
The cluster (web) application that represents Service Fabric Explorer attempts to authenticate against Azure AD, and as part of the request it provides the redirect return URL. But the URL is not listed in the Azure AD application **REPLY URL** list.

#### Solution
On the **Configure** tab of the cluster (web) application, add the URL of Service Fabric Explorer to the **REPLY URL** list or replace one of the items in the list. When you have finished, save your change.

![Web application reply url][web-application-reply-url]

### Connect the cluster by using Azure AD authentication via PowerShell
To connect the Service Fabric cluster, use the following PowerShell command example:

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <endpoint> -KeepAliveIntervalInSec 10 -AzureActiveDirectory -ServerCertThumbprint <thumbprint>
```

To learn about the Connect-ServiceFabricCluster cmdlet, see [Connect-ServiceFabricCluster](https://msdn.microsoft.com/library/mt125938.aspx).

### Can I reuse the same Azure AD tenant in multiple clusters?
Yes. But remember to add the URL of Service Fabric Explorer to your cluster (web) application. Otherwise, Service Fabric Explorer doesn’t work.

### Why do I still need a server certificate while Azure AD is enabled?
FabricClient and FabricGateway perform a mutual authentication. During Azure AD authentication, Azure AD integration provides a client identity to the server, and the server certificate is used to verify the server identity. For more information about Service Fabric certificates, see [X.509 certificates and Service Fabric][x509-certificates-and-service-fabric].

## Next steps
At this point, you have a secure cluster with Azure Active Directory providing management authentication. Next, [connect to your cluster](service-fabric-connect-to-secure-cluster.md) and learn how to [manage application secrets](service-fabric-application-secret-management.md).


<!-- Links -->
[azure-powershell]:https://docs.microsoft.com/powershell/azure/install-azurerm-ps
[azure-CLI]:https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli?view=azure-cli-latest
[key-vault-get-started]:../key-vault/key-vault-get-started.md
[aad-graph-api-docs]:https://msdn.microsoft.com/library/azure/ad/graph/api/api-catalog
[azure-classic-portal]: https://manage.windowsazure.com
[service-fabric-cluster-security]: service-fabric-cluster-security.md
[active-directory-howto-tenant]: ../active-directory/active-directory-howto-tenant.md
[service-fabric-visualizing-your-cluster]: service-fabric-visualizing-your-cluster.md
[service-fabric-manage-application-in-visual-studio]: service-fabric-manage-application-in-visual-studio.md
[sf-aad-ps-script-download]:http://servicefabricsdkstorage.blob.core.windows.net/publicrelease/MicrosoftAzureServiceFabric-AADHelpers.zip
[azure-quickstart-templates]: https://github.com/Azure/azure-quickstart-templates
[service-fabric-secure-cluster-5-node-1-nodetype]: https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure
[resource-group-template-deploy]: https://azure.microsoft.com/documentation/articles/resource-group-template-deploy/
[x509-certificates-and-service-fabric]: service-fabric-cluster-security.md#x509-certificates-and-service-fabric
[customize-your-cluster-template]: service-fabric-cluster-creation-via-arm.md#Create-a-Service-Fabric-cluster- Resource-Manager-template

<!-- Images -->
[cluster-security-arm-dependency-map]: ./media/service-fabric-cluster-creation-via-arm/cluster-security-arm-dependency-map.png
[cluster-security-cert-installation]: ./media/service-fabric-cluster-creation-via-arm/cluster-security-cert-installation.png
[assign-users-to-roles-button]: ./media/service-fabric-cluster-creation-via-arm/assign-users-to-roles-button.png
[assign-users-to-roles-dialog]: ./media/service-fabric-cluster-creation-via-arm/assign-users-to-roles.png
[sfx-select-certificate-dialog]: ./media/service-fabric-cluster-creation-via-arm/sfx-select-certificate-dialog.png
[sfx-reply-address-not-match]: ./media/service-fabric-cluster-creation-via-arm/sfx-reply-address-not-match.png
[web-application-reply-url]: ./media/service-fabric-cluster-creation-via-arm/web-application-reply-url.png

