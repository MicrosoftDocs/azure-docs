---
title: Create an Azure Service Fabric cluster from a template | Microsoft Docs
description: Learn how to set up a secure Service Fabric cluster in Azure by using Azure Resource Manager, Azure Key Vault, and Azure Active Directory (Azure AD) for client authentication.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: timlt
editor: chackdan
ms.assetid: 15d0ab67-fc66-4108-8038-3584eeebabaa
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/16/2018
ms.author: aljo

---
# Create a Service Fabric cluster by using Azure Resource Manager 
> [!div class="op_single_selector"]
> * [Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
> * [Azure portal](service-fabric-cluster-creation-via-portal.md)
>
>

An [Azure Service Fabric cluster](service-fabric-deploy-anywhere.md) is a network-connected set of virtual machines into which your microservices are deployed and managed. This article describes how to set up a secure Azure Service Fabric cluster in Azure using Azure Resource Manager.

Cluster security is configured when the cluster is first setup and cannot be changed later. Before setting up a cluster, read [Service Fabric cluster security scenarios][service-fabric-cluster-security]. In Azure, Service Fabric uses x509 certificate to secure your cluster and its endpoints, authenticate clients, and encrypt data. Azure Active Directory is also recommended to secure access to management endpoints. Azure AD tenants and users must be created before creating the cluster.  For more information, read [Set up Azure AD to authenticate clients](service-fabric-cluster-creation-setup-aad.md).

The guide covers the following procedures:

* Creating a cluster in Azure by using Service Fabric Resource Manager modules.
* Authoring a custom Azure Resource Manager template for your cluster and deploying it.

## Prerequisites 
The concept of creating secure clusters is the same, whether they are Linux or Windows clusters. This guide covers the use of Azure PowerShell or Azure CLI to create new clusters. The prerequisites are either:

* [Azure PowerShell 4.1 and above][azure-powershell] or [Azure CLI 2.0 and above][azure-CLI].
* you can find details on the Service Fabric modules here - [AzureRM.ServiceFabric](https://docs.microsoft.com/powershell/module/azurerm.servicefabric)  and [az SF CLI module](https://docs.microsoft.com/cli/azure/sf?view=azure-cli-latest)

## Use Service Fabric RM module to deploy a cluster

In this document, we will use the Service Fabric RM powershell and CLI module to deploy a cluster, the PowerShell or the CLI module command allows for multiple scenarios. Let us go through each of the them. Pick the scenario that you feel best meets your needs.

Create a new cluster:
- using a system generated self signed certificate
- using a certificate you already own

You can use a default cluster template or a template that you already have

### Create new cluster  - using a system generated self signed certificate

Use the following command to create cluster, if you want the system to generate a self-signed certificate and use it to secure your cluster. This command sets up a primary cluster certificate that is used for cluster security and to set up admin access to perform management operations using that certificate.

#### Sign in to Azure

```PowerShell
Connect-AzureRmAccount
Set-AzureRmContext -SubscriptionId <guid>
```

```CLI
azure login
az account set --subscription $subscriptionId
```
#### Use the default 5 Node 1 node type template that ships in the module to set up the cluster

Use the following command to create a cluster quickly, by specifying minimal parameters

The template that is used is available on the [Azure Service Fabric template samples : windows template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure-NSG)
 and [Ubuntu template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Ubuntu-1-NodeTypes-Secure)

The commands below works for creating Windows and Linux clusters, you just need to specify the OS accordingly. The PowerShell/CLI commands also output the certificate in the specified CertificateOutputFolder; however, make sure certificate folder already created. The command takes in other parameters like VM SKU as well.

> [!NOTE]
> The below PowerShell command only works with Azure Resource Manager PowerShell version > 6.1. To check the current version of Azure Resource Manager PowerShell version, run the following PowerShell command "Get-Module AzureRM". Follow this link to upgrade your Azure Resource Manager PowerShell version. https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps?view=azurermps-6.3.0
>
>

```PowerShell
$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$vaultName="myvault"
$vaultResourceGroupName="myvaultrg"
$CertSubjectName="mycluster.westus.cloudapp.azure.com"
$certPassword="Password123!@#" | ConvertTo-SecureString -AsPlainText -Force 
$vmpassword="Password4321!@#" | ConvertTo-SecureString -AsPlainText -Force
$vmuser="myadmin"
$os="WindowsServer2016DatacenterwithContainers"
$certOutputFolder="c:\certificates"

New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -Location $resourceGroupLocation -CertificateOutputFolder $certOutputFolder -CertificatePassword $certpassword -CertificateSubjectName $CertSubjectName -OS $os -VmPassword $vmpassword -VmUserName $vmuser
```

```CLI
declare resourceGroupLocation="westus"
declare resourceGroupName="mylinux"
declare vaultResourceGroupName="myvaultrg"
declare vaultName="myvault"
declare CertSubjectName="mylinux.westus.cloudapp.azure.com"
declare vmpassword="Password!1"
declare certpassword="Password!4321"
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

If you need to author a custom template to suit your needs, it is highly recommended that you start with one of the templates that are available on the [Azure Service Fabric template samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master). Follow guidance and explanations to [customize your cluster template][customize-your-cluster-template] section below.

If you already have a custom template, then make sure to double check that all the three certificate related parameters in the template and the parameter file are named as follows and values are null as follows.

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


```PowerShell
$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$CertSubjectName="mycluster.westus.cloudapp.azure.com"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$certOutputFolder="c:\certificates"

$parameterFilePath="c:\mytemplates\mytemplateparm.json"
$templateFilePath="c:\mytemplates\mytemplate.json"

New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -CertificateOutputFolder $certOutputFolder -CertificatePassword $certpassword -CertificateSubjectName $CertSubjectName -TemplateFile $templateFilePath -ParameterFile $parameterFilePath 
```

Here is the equivalent CLI command to do the same. Change the values in the declare statements to appropriate values. CLI supports all the other parameters that the above PowerShell command supports.

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


### Create new cluster - using the certificate you bought from a CA or you already have

Use the following command to create cluster, if you have a certificate that you want to use to secure your cluster with.

If this is a CA signed certificate that you will end up using for other purposes as well, then it is recommended that you provide a distinct resource group specifically for your key vault. We recommend that you put the key vault into its own resource group. This action lets you remove the compute and storage resource groups, including the resource group that contains your Service Fabric cluster, without losing your keys and secrets. **The resource group that contains your key vault _must be in the same region_ as the cluster that is using it.**


#### Use the default 5 Node 1 node type template that ships in the module
The template that is used is available on the [Azure samples : Windows template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure-NSG)
 and [Ubuntu template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Ubuntu-1-NodeTypes-Secure)

```PowerShell
$resourceGroupLocation="westus"
$resourceGroupName="mylinux"
$vaultName="myvault"
$vaultResourceGroupName="myvaultrg"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$vmpassword=("Password!4321" | ConvertTo-SecureString -AsPlainText -Force) 
$vmuser="myadmin"
$os="WindowsServer2016DatacenterwithContainers"

New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -Location $resourceGroupLocation -KeyVaultResouceGroupName $vaultResourceGroupName -KeyVaultName $vaultName -CertificateFile C:\MyCertificates\chackocertificate3.pfx -CertificatePassword $certPassword -OS $os -VmPassword $vmpassword -VmUserName $vmuser 
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
If you need to author a custom template to suit your needs, it is highly recommended that you start with one of the templates that are available on the [Azure Service Fabric template samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master). Follow guidance and explanations to [customize your cluster template][customize-your-cluster-template] section below.

If you already have a custom template, then make sure to double check that all the three certificate related parameters in the template and the parameter file are named as follows and values are null as follows.

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


```PowerShell
$resourceGroupLocation="westus"
$resourceGroupName="mylinux"
$vaultName="myvault"
$vaultResourceGroupName="myvaultrg"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$os="WindowsServer2016DatacenterwithContainers"
$parameterFilePath="c:\mytemplates\mytemplateparm.json"
$templateFilePath="c:\mytemplates\mytemplate.json"
$certificateFile="C:\MyCertificates\chackonewcertificate3.pem"

New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -Location $resourceGroupLocation -TemplateFile $templateFilePath -ParameterFile $parameterFilePath -KeyVaultResouceGroupName $vaultResourceGroupName -KeyVaultName $vaultName -CertificateFile $certificateFile -CertificatePassword $certPassword
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

#### Use a pointer to the secret you already have uploaded into the key vault

To use an existing key vault, you _must enable it for deployment_ to allow the compute resource provider to get certificates from it and install it on cluster nodes:

```PowerShell
Set-AzureRmKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -EnabledForDeployment

$parameterFilePath="c:\mytemplates\mytemplate.json"
$templateFilePath="c:\mytemplates\mytemplateparm.json"
$secretID="https://test1.vault.azure.net:443/secrets/testcertificate4/55ec7c4dc61a462bbc645ffc9b4b225f"

New-AzureRmServiceFabricCluster -ResourceGroupName $resourceGroupName -SecretIdentifier $secretId -TemplateFile $templateFilePath -ParameterFile $parameterFilePath 
```
Here is the equivalent CLI command to do the same. Change the values in the declare statements to appropriate values.

```CLI
declare $resourceGroupName = "testRG"
declare $parameterFilePath="c:\mytemplates\mytemplate.json"
declare $templateFilePath="c:\mytemplates\mytemplateparm.json"
declare $secertId="https://test1.vault.azure.net:443/secrets/testcertificate4/55ec7c4dc61a462bbc645ffc9b4b225f"

az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--secret-identifier az $secretID  \
	--template-file $templateFilePath --parameter-file $parametersFilePath 
```

<a id="customize-arm-template" ></a>

## Create a Service Fabric cluster resource manager template
This section is for users who want to custom author a Service Fabric cluster resource manager template. once you have a template, you can still go back and use the PowerShell or CLI modules to deploy it. 

Sample Resource Manager templates are available in the [Azure samples on GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates). These templates can be used as a starting point for your cluster template.

> [!NOTE]
> For national clouds (Azure Government, Azure China, Azure Germany), you should also add the following `fabricSettings` to your ARM template: `AADLoginEndpoint`, `AADTokenEndpointFormat` and `AADCertEndpointFormat`.

### Create the Resource Manager template
This guide uses the [5-node secure cluster][service-fabric-secure-cluster-5-node-1-nodetype] example template and template parameters. Download `azuredeploy.json` and `azuredeploy.parameters.json` to your computer and open both files in your favorite text editor.

### Add certificates
You add certificates to a cluster resource manager template by referencing the key vault that contains the certificate keys. Add those key-vault parameters and values in a Resource Manager template parameters file (azuredeploy.parameters.json). 

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
                  "commonNames": ["[parameters('certificateCommonName')]"],
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
  "apiVersion": "2018-02-01",
  "type": "Microsoft.ServiceFabric/clusters",
  "name": "[parameters('clusterName')]",
  "location": "[parameters('clusterLocation')]",
  "dependsOn": [
    "[concat('Microsoft.Storage/storageAccounts/', variables('supportLogStorageAccountName'))]"
  ],
  "properties": {
    "certificateCommonNames": {
        "commonNames": [
        {
            "certificateCommonName": "[parameters('certificateCommonName')]",
            "certificateIssuerThumbprint": ""
        }
        ],
        "x509StoreName": "[parameters('certificateStoreValue')]"
    },
    ...
  }
}
```

### Add Azure AD configuration to use Azure AD for client access

You add the Azure AD configuration to a cluster Resource Manager template by referencing the key vault that contains the certificate keys. Add those Azure AD parameters and values in a Resource Manager template parameters file (azuredeploy.parameters.json).

```json
{
  "apiVersion": "2018-02-01",
  "type": "Microsoft.ServiceFabric/clusters",
  "name": "[parameters('clusterName')]",
  ...
  "properties": {
    "certificateCommonNames": {
        "commonNames": [
        {
            "certificateCommonName": "[parameters('certificateCommonName')]",
            "certificateIssuerThumbprint": ""
        }
        ],
        "x509StoreName": "[parameters('certificateStoreValue')]"
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

### Populate the parameter file with the values
Finally, use the output values from the key vault and Azure AD PowerShell commands to populate the parameters file.

If you plan to use the Azure service fabric RM PowerShell modules, then you do not need to populate the cluster certificate information. If you want the system to generate the self signed certificate for cluster security you, just keep them as null. 

> [!NOTE]
> For the RM modules to pick up and populate these empty parameter values, the parameters names much match the names below

```json
"clusterCertificateThumbprint": {
    "value": ""
},
"certificateCommonName": {
    "value": ""
},
"clusterCertificateUrlValue": {
    "value": ""
},
"sourceVaultvalue": {
    "value": ""
},
```

If you are using application certs or are using an existing cluster that you have uploaded to the key vault, you need to get this information and populate it.

The RM modules do not have the ability to generate the Azure AD configuration for you, so if you plan to use the Azure AD for client access, you need to populate it.

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

```PowerShell
Test-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json
```

In case you run into issues and get cryptic messages, then use "-Debug" as an option.

```PowerShell
Test-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json -Debug
```

The following diagram illustrates where your key vault and Azure AD configuration fit into your Resource Manager template.

![Resource Manager dependency map][cluster-security-arm-dependency-map]


## Create the cluster using Azure resource template 

You can now deploy you cluster using the steps outlined earlier in the document, or if you have 
 the values in the parameter file populated, then you are now ready to create the cluster by using [Azure resource template deployment][resource-group-template-deploy] directly.

```PowerShell
New-AzureRmResourceGroupDeployment -ResourceGroupName "myresourcegroup" -TemplateFile .\azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json
```

In case you run into issues and get cryptic messages, then use "-Debug" as an option.

## Next steps
At this point, you have a secure cluster with Azure Active Directory providing management authentication. Next, [connect to your cluster](service-fabric-connect-to-secure-cluster.md) and learn how to [manage application secrets](service-fabric-application-secret-management.md).


<!-- Links -->
[azure-powershell]:https://docs.microsoft.com/powershell/azure/install-azurerm-ps
[azure-CLI]:https://docs.microsoft.com/cli/azure/get-started-with-azure-cli?view=azure-cli-latest
[service-fabric-cluster-security]: service-fabric-cluster-security.md
[service-fabric-secure-cluster-5-node-1-nodetype]: https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure
[resource-group-template-deploy]: https://azure.microsoft.com/documentation/articles/resource-group-template-deploy/
[customize-your-cluster-template]: service-fabric-cluster-creation-via-arm.md#create-a-service-fabric-cluster-resource-manager-template

<!-- Images -->
[cluster-security-arm-dependency-map]: ./media/service-fabric-cluster-creation-via-arm/cluster-security-arm-dependency-map.png
[cluster-security-cert-installation]: ./media/service-fabric-cluster-creation-via-arm/cluster-security-cert-installation.png
