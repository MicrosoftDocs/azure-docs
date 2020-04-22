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
* **KeyVaultName:** SFQuickstartKV0416
* **KeyVaultSecretName:** clustercert

Upon completion, the script will provide the parameter values needed for template deployment. Be sure to store these in the following variables, as they will be needed to deploy your cluster template:

```powershell
$sourceVaultId = ""
$certUrlValue = ""
$certThumbprint = ""
```

## Create a Service Fabric cluster

<!-- The second H2 must start with "Create a". For example,  'Create a Key Vault', 'Create a virtual machine', etc. -->

### Review the template

<!-- The first sentence must be the following sentence. The link is the quickstart template from GitHub. The link must begin with https://github.com/Azure/azure-quickstart-templates/. -->

The template used in this quickstart is from [Azure Quickstart templates]().

<!-- After the first sentence, add a JSON codefence that links to the quickstart template. Customers have provided feedback that they prefer to see the whole template; therefore, we recommend you include the whole template in your article. If your template is too long to show in the quickstart, you can instead add a sentence that says "The template for this article is too long to show here. To view the template, see ..."

The syntax for the codefence is: -->

:::code language="json" source="~/quickstart-templates/<TEMPLATE NAME>/azuredeploy.json" range="000-000" highlight="000-000":::

<!-- After the JSON codefence, a list of each resourceType from the JSON must exist with a link to the template reference starting with /azure/templates. For example:

* [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): create an Azure key vault.
* [**Microsoft.KeyVault/vaults/secrets**](/azure/templates/microsoft.keyvault/vaults/secrets): create an key vault secret.

The URL usually appears as, for example, https://docs.microsoft.com/en-us/azure/templates/Microsoft.Network/2019-11-01/loadBalancers for loadbalancer of Microsoft.Network. Remove the API version from the URL, the URL redirects the users to the latest version.
-->

* [Azure resource type](link to the template reference)
* [Azure resource type](link to the template reference)

<!-- List additional quickstart templates. For example: [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Keyvault&pageNumber=1&sort=Popular).
Notice the resourceType and sort elements in the URL.
-->

## Deploy the template

<!--
 One of the following options must be included:

  - **CLI**: In an Azure CLI Interactive codefence must contain **az group deployment create**. For example:

    ```azurecli-interactive
    read -p "Enter a project name that is used for generating resource names:" projectName &&
    read -p "Enter the location (i.e. centralus):" location &&
    templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json" &&
    resourceGroupName="${projectName}rg" &&
    az group create --name $resourceGroupName --location "$location" &&
    az group deployment create --resource-group $resourceGroupName --template-uri  $templateUri
    echo "Press [ENTER] to continue ..." &&
    read
    ```

  - **PowerShell**: In an Azure PowerShell Interactive codefence must contain **New-AzResourceGroupDeployment**. For example:

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json"

    $resourceGroupName = "${projectName}rg"

    New-AzResourceGroup -Name $resourceGroupName -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

    Read-Host -Prompt "Press [ENTER] to continue ..."

    For an example, see Add a description. Press tab when you are done.
    ```

  - **Portal**: A button with description **Deploy Resource Manager template to Azure**, with image **/media/<QUICKSTART FILE NAME>/deploy-to-azure.png*, must exist and have a link that starts with **https://portal.azure.com/#create/Microsoft.Template/uri/**:

    ```markdown
    [![Deploy to Azure](./media/quick-create-template/deploy-to-azure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-key-vault-create%2Fazuredeploy.json)
    ```

    To get the standard button image and find more information about this deployment option, see [Use a deployment button to deploy templates from GitHub repository](/azure/azure-resource-manager/templates/deploy-to-azure-button.md).
 -->

## Review deployed resources

<!-- You can also use the title "Validate the deployment"-->

## Clean up resources

When no longer needed, delete the resource group, which deletes the resources in the resource group.

<!--

Choose Azure CLI, Azure PowerShell, or Azure portal to delete the resource group. Use [Zone pivots](https://review.docs.microsoft.com/help/contribute/zone-pivots?branch=master) if you want to use multiple options.  Here are the samples for Azure CLI and Azure PowerShell:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

-->

## Next steps

<!-- You can either make the next steps similar to the next steps in your other quickstarts, or point users to the following tutorial.-->

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [ Tutorial: Create and deploy your first Azure Resource Manager template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template.md)