---
title: Create a Service Fabric cluster using Azure Resource Manager template
description: In this quickstart, you will create an Azure Service Fabric test cluster by using Azure Resource Manager template.
author: erikadoyle
ms.service: service-fabric
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: edoyle
ms.date: 04/24/20
---
# Quickstart: Create a Service Fabric cluster using Resource Manager template

Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and containers. An Service Fabric *cluster* is a network-connected set of virtual machines into which your microservices are deployed and managed.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

This article describes how to deploy a Service Fabric test cluster in Azure using the Resource Manager. This 5-node Windows cluster is secured with a self-signed certificate and thus only intended for instructional purposes (rather than production workloads).

We'll use Azure PowerShell to deploy the template. In addition to Azure PowerShell, you can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites

### Install Service Fabric SDK and PowerShell modules

To complete this quickstart, you'll need to:

* Install the [Service Fabric SDK and PowerShell module](service-fabric-get-started.md).

* Install [Azure Powershell](https://docs.microsoft.com/powershell/azure/install-Az-ps).

### Download the sample template and certificate helper script

Clone or download the [Azure Resource Manager QuickStart Templates](https://github.com/Azure/azure-quickstart-templates) repo. Alternatively, simply copy down locally the following files we'll be using from the *service-fabric-secure-cluster-5-node-1-nodetype* folder:

* [New-ServiceFabricClusterCertificate.ps1](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/service-fabric-secure-cluster-5-node-1-nodetype/New-ServiceFabricClusterCertificate.ps1)
* [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/service-fabric-secure-cluster-5-node-1-nodetype/azuredeploy.json)
* [azuredeploy.parameters.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/service-fabric-secure-cluster-5-node-1-nodetype/azuredeploy.parameters.json)

### Sign in to Azure

Sign in to Azure and designate the subscription to use for creating your Service Fabric cluster.

```powershell
# Sign in to your Azure account
Login-AzAccount -SubscriptionId "<subscription ID>"
```

### Create a self-signed certificate stored in Key Vault

Service Fabric uses X.509 certificates to [secure a cluster](./service-fabric-cluster-security.md) and provide application security features, and [Key Vault](../key-vault/general/overview) to manage those certificates. Successful cluster creation requires a cluster certificate to enable node-to-node communication. For the purpose of creating this quickstart test cluster, we'll create a self-signed certificate for cluster authentication. Production workloads require certificates created using a correctly configured Windows Server certificate service or one from an approved certificate authority (CA).

```powershell
# Designate unique (within cloudapp.azure.com) names for your resources

$resourceGroupName = "SFQuickstartRG"
$keyVaultName = "SFQuickstartKV"

# Create a new resource group for your Key Vault and Service Fabric cluster
New-AzResourceGroup -Name $resourceGroupName -Location SouthCentralUS

# Create a Key Vault enabled for deployment
New-AzKeyVault -VaultName $KeyVaultName -ResourceGroupName $resourceGroupName -Location SouthCentralUS -EnabledForDeployment

# Generate a certificate and upload it to Key Vault
.\New-ServiceFabricClusterCertificate.ps1
```

The script will prompt you for the following (be sure to modify *CertDNSName* and *KeyVaultName* from the example values below):

* **Password:** Password!1
* **CertDNSName:** sfquickstart.southcentralus.cloudapp.azure.com
* **KeyVaultName:** SFQuickstartKV
* **KeyVaultSecretName:** clustercert

Upon completion, the script will provide the parameter values needed for template deployment. Be sure to store these in the following variables, as they will be needed to deploy your cluster template:

```powershell
$certThumbprint = "<Certificate Thumbprint>"
$certUrlValue = "<Certificate URL>"
$sourceVaultId = "<Source Vault Resource Id>"
```

## Create a Service Fabric cluster

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/service-fabric-secure-cluster-5-node-1-nodetype). The template for this article is too long to show here. To view the template, see https://github.com/Azure/azure-quickstart-templates/blob/master/service-fabric-secure-cluster-5-node-1-nodetype/azuredeploy.json.

Multiple Azure resources have been defined in the template:

* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts)
* [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)
* [Microsoft.Network/publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses)
* [Microsoft.Network/loadBalancers](/azure/templates/microsoft.network/loadbalancers)
* [Microsoft.Compute/virtualMachineScaleSets](/azure/templates/microsoft.compute/virtualmachinescalesets)
* [Microsoft.ServiceFabric/clusters](/azure/templates/microsoft.servicefabric/clusters)

To find more templates that are related to Azure Service Fabric, see
[Azure Quickstart Templates](https://azure.microsoft.com/en-us/resources/templates/?sort=Popular&term=service+fabric).

### Customize the parameters file

Open *azuredeploy.parameters.json* and edit the parameter values so that:

* **clusterName** matches the value you supplied for *CertDNSName* when creating your cluster certificate
* **adminUserName** is some value other than the default *GEN-UNIQUE* token
* **adminPassword** is some value other than the default *GEN-PASSWORD* token
* **certificateThumbprint**, **sourceVaultResourceId**, and **certificateUrlValue** are all empty string (`""`)

For example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "value": "sfquickstart"
    },
    "adminUsername": {
      "value": "testadm"
    },
    "adminPassword": {
      "value": "Password#1234"
    },
    "certificateThumbprint": {
      "value": ""
    },
    "sourceVaultResourceId": {
      "value": ""
    },
    "certificateUrlValue": {
      "value": ""
    }
  }
}
```

## Deploy the template

Store the paths of your resource manager template and parameter files in variables, then deploy the template.

```powershell
$templateFilePath = "<full path to azuredeploy.json>"
$parameterFilePath = "<full path to azuredeploy.parameters.json>"

New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $templateFilePath `
    -TemplateParameterFile $parameterFilePath `
    -CertificateThumbprint $certThumbprint `
    -CertificateUrlValue $certUrlValue `
    -SourceVaultResourceId $sourceVaultId `
    -Verbose
```

## Review deployed resources



## Clean up resources

When no longer needed, delete the resource group, which deletes the resources in the resource group.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

<!-- You can either make the next steps similar to the next steps in your other quickstarts, or point users to the following tutorial.-->

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [ Tutorial: Create and deploy your first Azure Resource Manager template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template.md)