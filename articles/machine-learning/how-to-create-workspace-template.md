---
title: Create a workspace with Azure Resource Manager template
titleSuffix: Azure Machine Learning
description: Learn how to use an Azure Resource Manager template to create a new Azure Machine Learning workspace.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.author: larryfr
author: Blackmist
ms.date: 04/21/2021


# Customer intent: As a DevOps person, I need to automate or customize the creation of Azure Machine Learning by using templates.
---

# Use an Azure Resource Manager template to create a workspace for Azure Machine Learning


<br>

In this article, you learn several ways to create an Azure Machine Learning workspace using Azure Resource Manager templates. A Resource Manager template makes it easy to create resources as a single, coordinated operation. A template is a JSON document that defines the resources that are needed for a deployment. It may also specify deployment parameters. Parameters are used to provide input values when using the template.

For more information, see [Deploy an application with Azure Resource Manager template](../azure-resource-manager/templates/deploy-powershell.md).

## Prerequisites

* An **Azure subscription**. If you do not have one, try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).

* To use a template from a CLI, you need either [Azure PowerShell](/powershell/azure/) or the [Azure CLI](/cli/azure/install-azure-cli).

* Some scenarios require you to open a support ticket. For example, using a Private Link enabled workspace with a customer-managed key. For more information, see [Manage and increase quotas](how-to-manage-quotas.md#private-endpoint-and-private-dns-quota-increases).

## Limitations

[!INCLUDE [register-namespace](../../includes/machine-learning-register-namespace.md)]

## Workspace Resource Manager template

The Azure Resource Manager template used throughout this document can be found in the [201-machine-learning-advanced](https://github.com/Azure/azure-quickstart-templates/blob/master/201-machine-learning-advanced/azuredeploy.json) directory of the Azure quickstart templates GitHub repository.

This template creates the following Azure services:

* Azure Storage Account
* Azure Key Vault
* Azure Application Insights
* Azure Container Registry
* Azure Machine Learning workspace

The resource group is the container that holds the services. The various services are required by the Azure Machine Learning workspace.

The example template has two **required** parameters:

* The **location** where the resources will be created.

    The template will use the location you select for most resources. The exception is the Application Insights service, which is not available in all of the locations that the other services are. If you select a location where it is not available, the service will be created in the South Central US location.

* The **workspaceName**, which is the friendly name of the Azure Machine Learning workspace.

    > [!NOTE]
    > The workspace name is case-insensitive.

    The names of the other services are generated randomly.

> [!TIP]
> While the template associated with this document creates a new Azure Container Registry, you can also create a new workspace without creating a container registry. One will be created when you perform an operation that requires a container registry. For example, training or deploying a model.
>
> You can also reference an existing container registry or storage account in the Azure Resource Manager template, instead of creating a new one. When doing so, you must either [use a managed identity](how-to-use-managed-identities.md) (preview), or [enable the admin account](../container-registry/container-registry-authentication.md#admin-account) for the container registry.

[!INCLUDE [machine-learning-delete-acr](../../includes/machine-learning-delete-acr.md)]

For more information on templates, see the following articles:

* [Author Azure Resource Manager templates](../azure-resource-manager/templates/template-syntax.md)
* [Deploy an application with Azure Resource Manager templates](../azure-resource-manager/templates/deploy-powershell.md)
* [Microsoft.MachineLearningServices resource types](/azure/templates/microsoft.machinelearningservices/allversions)

## Deploy template

To deploy your template you have to create a resource group.

See the [Azure portal](#use-the-azure-portal) section if you prefer using the graphical user interface.

# [Azure CLI](#tab/azcli)

```azurecli
az group create --name "examplegroup" --location "eastus"
```

# [Azure PowerShell](#tab/azpowershell)

```azurepowershell
New-AzResourceGroup -Name "examplegroup" -Location "eastus"
```

---

Once your resource group is successfully created, deploy the template with the following command:

# [Azure CLI](#tab/azcli)

```azurecli
az deployment group create \
    --name "exampledeployment" \
    --resource-group "examplegroup" \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" \
    --parameters workspaceName="exampleworkspace" location="eastus"
```

# [Azure PowerShell](#tab/azpowershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name "exampledeployment" `
  -ResourceGroupName "examplegroup" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" `
  -workspaceName "exampleworkspace" `
  -location "eastus"
```

---

By default, all of the resources created as part of the template are new. However, you also have the option of using existing resources. By providing additional parameters to the template, you can use existing resources. For example, if you want to use an existing storage account set the **storageAccountOption** value to **existing** and provide the name of your storage account in the **storageAccountName** parameter.

> [!IMPORTANT]
> If you want to use an existing Azure Storage account, it cannot be a premium account (Premium_LRS and Premium_GRS). It also cannot have a hierarchical namespace (used with Azure Data Lake Storage Gen2). Neither premium storage or hierarchical namespace are supported with the default storage account of the workspace. Neither premium storage or hierarchical namespaces are supported with the _default_ storage account of the workspace. You can use premium storage or hierarchical namespace with _non-default_ storage accounts.

# [Azure CLI](#tab/azcli)

```azurecli
az deployment group create \
    --name "exampledeployment" \
    --resource-group "examplegroup" \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" \
    --parameters workspaceName="exampleworkspace" \
      location="eastus" \
      storageAccountOption="existing" \
      storageAccountName="existingstorageaccountname"
```

# [Azure PowerShell](#tab/azpowershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name "exampledeployment" `
  -ResourceGroupName "examplegroup" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" `
  -workspaceName "exampleworkspace" `
  -location "eastus" `
  -storageAccountOption "existing" `
  -storageAccountName "existingstorageaccountname"
```

---

## Deploy an encrypted workspace

The following example template demonstrates how to create a workspace with three settings:

* Enable high confidentiality settings for the workspace. This creates a new Cosmos DB instance.
* Enable encryption for the workspace.
* Uses an existing Azure Key Vault to retrieve customer-managed keys. Customer-managed keys are used to create a new Cosmos DB instance for the workspace.

    [!INCLUDE [machine-learning-customer-managed-keys.md](../../includes/machine-learning-customer-managed-keys.md)]

> [!IMPORTANT]
> Once a workspace has been created, you cannot change the settings for confidential data, encryption, key vault ID, or key identifiers. To change these values, you must create a new workspace using the new values.

For more information, see [Encryption at rest](concept-data-encryption.md#encryption-at-rest).

> [!IMPORTANT]
> There are some specific requirements your subscription must meet before using this template:
> * You must have an existing Azure Key Vault that contains an encryption key.
> * The Azure Key Vault must be in the same region where you plan to create the Azure Machine Learning workspace.
> * You must specify the ID of the Azure Key Vault and the URI of the encryption key.

__To get the values__ for the `cmk_keyvault` (ID of the Key Vault) and the `resource_cmk_uri` (key URI) parameters needed by this template, use the following steps:	

1. To get the Key Vault ID, use the following command:	

    # [Azure CLI](#tab/azcli)	

    ```azurecli	
    az keyvault show --name <keyvault-name> --query 'id' --output tsv	
    ```	

    # [Azure PowerShell](#tab/azpowershell)	

    ```azurepowershell	
    Get-AzureRMKeyVault -VaultName '<keyvault-name>'	
    ```	
    ---	

    This command returns a value similar to `/subscriptions/{subscription-guid}/resourceGroups/<resource-group-name>/providers/Microsoft.KeyVault/vaults/<keyvault-name>`.	

1. To get the value for the URI for the customer managed key, use the following command:	

    # [Azure CLI](#tab/azcli)	

    ```azurecli	
    az keyvault key show --vault-name <keyvault-name> --name <key-name> --query 'key.kid' --output tsv	
    ```	

    # [Azure PowerShell](#tab/azpowershell)	

    ```azurepowershell	
    Get-AzureKeyVaultKey -VaultName '<keyvault-name>' -KeyName '<key-name>'	
    ```	
    ---	

    This command returns a value similar to `https://mykeyvault.vault.azure.net/keys/mykey/{guid}`.	

> [!IMPORTANT]	
> Once a workspace has been created, you cannot change the settings for confidential data, encryption, key vault ID, or key identifiers. To change these values, you must create a new workspace using the new values.

To enable use of Customer Managed Keys, set the following parameters when deploying the template:

* **encryption_status** to **Enabled**.
* **cmk_keyvault** to the `cmk_keyvault` value obtained in previous steps.
* **resource_cmk_uri** to the `resource_cmk_uri` value obtained in previous steps.

# [Azure CLI](#tab/azcli)

```azurecli
az deployment group create \
    --name "exampledeployment" \
    --resource-group "examplegroup" \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" \
    --parameters workspaceName="exampleworkspace" \
      location="eastus" \
      encryption_status="Enabled" \
      cmk_keyvault="/subscriptions/{subscription-guid}/resourceGroups/<resource-group-name>/providers/Microsoft.KeyVault/vaults/<keyvault-name>" \
      resource_cmk_uri="https://mykeyvault.vault.azure.net/keys/mykey/{guid}" \
```

# [Azure PowerShell](#tab/azpowershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name "exampledeployment" `
  -ResourceGroupName "examplegroup" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" `
  -workspaceName "exampleworkspace" `
  -location "eastus" `
  -encryption_status "Enabled" `
  -cmk_keyvault "/subscriptions/{subscription-guid}/resourceGroups/<resource-group-name>/providers/Microsoft.KeyVault/vaults/<keyvault-name>" `
  -resource_cmk_uri "https://mykeyvault.vault.azure.net/keys/mykey/{guid}"
```
---

When using a customer-managed key, Azure Machine Learning creates a secondary resource group which contains the Cosmos DB instance. For more information, see [encryption at rest - Cosmos DB](concept-data-encryption.md#encryption-at-rest).

An additional configuration you can provide for your data is to set the **confidential_data** parameter to **true**. Doing so, does the following:

* Starts encrypting the local scratch disk for Azure Machine Learning compute clusters, providing you have not created any previous clusters in your subscription. If you have previously created a cluster in the subscription, open a support ticket to have encryption of the scratch disk enabled for your compute clusters.
* Cleans up the local scratch disk between runs.
* Securely passes credentials for the storage account, container registry, and SSH account from the execution layer to your compute clusters by using key vault.
* Enables IP filtering to ensure the underlying batch pools cannot be called by any external services other than AzureMachineLearningService.

    > [!IMPORTANT]
    > Once a workspace has been created, you cannot change the settings for confidential data, encryption, key vault ID, or key identifiers. To change these values, you must create a new workspace using the new values.

  For more information, see [encryption at rest](concept-data-encryption.md#encryption-at-rest).

## Deploy workspace behind a virtual network

By setting the `vnetOption` parameter value to either `new` or `existing`, you are able to create the resources used by a workspace behind a virtual network.

> [!IMPORTANT]
> For container registry, only the 'Premium' sku is supported.

> [!IMPORTANT]
> Application Insights does not support deployment behind a virtual network.

### Only deploy workspace behind private endpoint

If your associated resources are not behind a virtual network, you can set the **privateEndpointType** parameter to `AutoAproval` or `ManualApproval` to deploy the workspace behind a private endpoint. This can be done for both new and existing workspaces. When updating an existing workspace, fill in the template parameters with the information from the existing workspace.

> [!IMPORTANT]
> Using an Azure Machine Learning workspace with private link is not available in the Azure Government regions.

# [Azure CLI](#tab/azcli)

```azurecli
az deployment group create \
    --name "exampledeployment" \
    --resource-group "examplegroup" \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" \
    --parameters workspaceName="exampleworkspace" \
      location="eastus" \
      privateEndpointType="AutoApproval"
```

# [Azure PowerShell](#tab/azpowershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name "exampledeployment" `
  -ResourceGroupName "examplegroup" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" `
  -workspaceName "exampleworkspace" `
  -location "eastus" `
  -privateEndpointType "AutoApproval"
```

---

### Use a new virtual network

To deploy a resource behind a new virtual network, set the **vnetOption** to **new** along with the virtual network settings for the respective resource. The deployment below shows how to deploy a workspace with the storage account resource behind a new virtual network.

# [Azure CLI](#tab/azcli)

```azurecli
az deployment group create \
    --name "exampledeployment" \
    --resource-group "examplegroup" \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" \
    --parameters workspaceName="exampleworkspace" \
      location="eastus" \
      vnetOption="new" \
      vnetName="examplevnet" \
      storageAccountBehindVNet="true"
      privateEndpointType="AutoApproval"
```

# [Azure PowerShell](#tab/azpowershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name "exampledeployment" `
  -ResourceGroupName "examplegroup" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" `
  -workspaceName "exampleworkspace" `
  -location "eastus" `
  -vnetOption "new" `
  -vnetName "examplevnet" `
  -storageAccountBehindVNet "true"
  -privateEndpointType "AutoApproval"
```

---

Alternatively, you can deploy multiple or all dependent resources behind a virtual network.

# [Azure CLI](#tab/azcli)

```azurecli
az deployment group create \
    --name "exampledeployment" \
    --resource-group "examplegroup" \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" \
    --parameters workspaceName="exampleworkspace" \
      location="eastus" \
      vnetOption="new" \
      vnetName="examplevnet" \
      storageAccountBehindVNet="true" \
      keyVaultBehindVNet="true" \
      containerRegistryBehindVNet="true" \
      containerRegistryOption="new" \
      containerRegistrySku="Premium"
      privateEndpointType="AutoApproval"
```

# [Azure PowerShell](#tab/azpowershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name "exampledeployment" `
  -ResourceGroupName "examplegroup" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" `
  -workspaceName "exampleworkspace" `
  -location "eastus" `
  -vnetOption "new" `
  -vnetName "examplevnet" `
  -storageAccountBehindVNet "true"
  -keyVaultBehindVNet "true" `
  -containerRegistryBehindVNet "true" `
  -containerRegistryOption "new" `
  -containerRegistrySku "Premium"
  -privateEndpointType "AutoApproval"
```

---

<!-- Workspaces need a private endpoint when associated resources are behind a virtual network to work properly. To set up a private endpoint for the workspace with a new virtual network:

> [!IMPORTANT]
> The deployment is only valid in regions which support private endpoints.

# [Azure CLI](#tab/azcli)

```azurecli
az deployment group create \
    --name "exampledeployment" \
    --resource-group "examplegroup" \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" \
    --parameters workspaceName="exampleworkspace" \
      location="eastus" \
      vnetOption="new" \
      vnetName="examplevnet" \
      privateEndpointType="AutoApproval"
```

# [Azure PowerShell](#tab/azpowershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name "exampledeployment" `
  -ResourceGroupName "examplegroup" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" `
  -workspaceName "exampleworkspace" `
  -location "eastus" `
  -vnetOption "new" `
  -vnetName "examplevnet" `
  -privateEndpointType "AutoApproval"
```

--- -->

### Use an existing virtual network & resources

To deploy a workspace with existing associated resources you have to set the **vnetOption** parameter to **existing** along with subnet parameters. However, you need to create service endpoints in the virtual network for each of the resources **before** deployment. Like with new virtual network deployments, you can have one or all of your resources behind a virtual network.

> [!IMPORTANT]
> Subnet should have `Microsoft.Storage` service endpoint

> [!IMPORTANT]
> Subnets do not allow creation of private endpoints. Disable private endpoint to enable subnet.

1. Enable service endpoints for the resources.

    # [Azure CLI](#tab/azcli)

    ```azurecli
    az network vnet subnet update --resource-group "examplegroup" --vnet-name "examplevnet" --name "examplesubnet" --service-endpoints "Microsoft.Storage"
    az network vnet subnet update --resource-group "examplegroup" --vnet-name "examplevnet" --name "examplesubnet" --service-endpoints "Microsoft.KeyVault"
    az network vnet subnet update --resource-group "examplegroup" --vnet-name "examplevnet" --name "examplesubnet" --service-endpoints "Microsoft.ContainerRegistry"
    ```

    # [Azure PowerShell](#tab/azpowershell)

    ```azurepowershell
    Get-AzVirtualNetwork -ResourceGroupName "examplegroup" -Name "examplevnet" | Set-AzVirtualNetworkSubnetConfig -Name "examplesubnet" -AddressPrefix "<subnet prefix>" -ServiceEndpoint "Microsoft.Storage" | Set-AzVirtualNetwork
    Get-AzVirtualNetwork -ResourceGroupName "examplegroup" -Name "examplevnet" | Set-AzVirtualNetworkSubnetConfig -Name "examplesubnet" -AddressPrefix "<subnet prefix>" -ServiceEndpoint "Microsoft.KeyVault" | Set-AzVirtualNetwork
    Get-AzVirtualNetwork -ResourceGroupName "examplegroup" -Name "examplevnet" | Set-AzVirtualNetworkSubnetConfig -Name "examplesubnet" -AddressPrefix "<subnet prefix>" -ServiceEndpoint "Microsoft.ContainerRegistry" | Set-AzVirtualNetwork
    ```

    ---

1. Deploy the workspace

    # [Azure CLI](#tab/azcli)

    ```azurecli
    az deployment group create \
    --name "exampledeployment" \
    --resource-group "examplegroup" \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" \
    --parameters workspaceName="exampleworkspace" \
      location="eastus" \
      vnetOption="existing" \
      vnetName="examplevnet" \
      vnetResourceGroupName="examplegroup" \
      storageAccountBehindVNet="true" \
      keyVaultBehindVNet="true" \
      containerRegistryBehindVNet="true" \
      containerRegistryOption="new" \
      containerRegistrySku="Premium" \
      subnetName="examplesubnet" \
      subnetOption="existing"
      privateEndpointType="AutoApproval"
    ```

    # [Azure PowerShell](#tab/azpowershell)
    ```azurepowershell
    New-AzResourceGroupDeployment `
      -Name "exampledeployment" `
      -ResourceGroupName "examplegroup" `
      -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" `
      -workspaceName "exampleworkspace" `
      -location "eastus" `
      -vnetOption "existing" `
      -vnetName "examplevnet" `
      -vnetResourceGroupName "examplegroup" `
      -storageAccountBehindVNet "true"
      -keyVaultBehindVNet "true" `
      -containerRegistryBehindVNet "true" `
      -containerRegistryOption "new" `
      -containerRegistrySku "Premium" `
      -subnetName "examplesubnet" `
      -subnetOption "existing"
      -privateEndpointType "AutoApproval"
    ```
    ---

<!-- Workspaces need a private endpoint when associated resources are behind a virtual network to work properly. To set up a private endpoint for the workspace with an existing virtual network:

> [!IMPORTANT]
> The deployment is only valid in regions which support private endpoints.

# [Azure CLI](#tab/azcli)

```azurecli
az deployment group create \
    --name "exampledeployment" \
    --resource-group "examplegroup" \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" \
    --parameters workspaceName="exampleworkspace" \
      location="eastus" \
      vnetOption="existing" \
      vnetName="examplevnet" \
      vnetResourceGroupName="rg" \
      privateEndpointType="AutoApproval" \
      subnetName="subnet" \
      subnetOption="existing"
```

# [Azure PowerShell](#tab/azpowershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name "exampledeployment" `
  -ResourceGroupName "examplegroup" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" `
  -workspaceName "exampleworkspace" `
  -location "eastus" `
  -vnetOption "existing" `
  -vnetName "examplevnet" `
  -vnetResourceGroupName "rg"
  -privateEndpointType "AutoApproval"
  -subnetName "subnet"
  -subnetOption "existing"
```

--- -->

## Use the Azure portal

1. Follow the steps in [Deploy resources from custom template](../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template). When you arrive at the __Select a template__ screen, choose the **201-machine-learning-advanced** template from the dropdown.
1. Select __Select template__ to use the template. Provide the following required information and any other parameters depending on your deployment scenario.

   * Subscription: Select the Azure subscription to use for these resources.
   * Resource group: Select or create a resource group to contain the services.
   * Region: Select the Azure region where the resources will be created.
   * Workspace name: The name to use for the Azure Machine Learning workspace that will be created. The workspace name must be between 3 and 33 characters. It may only contain alphanumeric characters and '-'.
   * Location: Select the location where the resources will be created.
1. Select __Review + create__.
1. In the __Review + create__ screen, agree to the listed terms and conditions and select __Create__.

For more information, see [Deploy resources from custom template](../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template).

## Troubleshooting

### Resource provider errors

[!INCLUDE [machine-learning-resource-provider](../../includes/machine-learning-resource-provider.md)]

### Azure Key Vault access policy and Azure Resource Manager templates

When you use an Azure Resource Manager template to create the workspace and associated resources (including Azure Key Vault), multiple times. For example, using the template multiple times with the same parameters as part of a continuous integration and deployment pipeline.

Most resource creation operations through templates are idempotent, but Key Vault clears the access policies each time the template is used. Clearing the access policies breaks access to the Key Vault for any existing workspace that is using it. For example, Stop/Create functionalities of Azure Notebooks VM may fail.  

To avoid this problem, we recommend one of the following approaches:

* Do not deploy the template more than once for the same parameters. Or delete the existing resources before using the template to recreate them.

* Examine the Key Vault access policies and then use these policies to set the `accessPolicies` property of the template. To view the access policies, use the following Azure CLI command:

    ```azurecli
    az keyvault show --name mykeyvault --resource-group myresourcegroup --query properties.accessPolicies
    ```

    For more information on using the `accessPolicies` section of the template, see the [AccessPolicyEntry object reference](/azure/templates/Microsoft.KeyVault/2018-02-14/vaults#AccessPolicyEntry).

* Check if the Key Vault resource already exists. If it does, do not recreate it through the template. For example, to use the existing Key Vault instead of creating a new one, make the following changes to the template:

    * **Add** a parameter that accepts the ID of an existing Key Vault resource:

        ```json
        "keyVaultId":{
          "type": "string",
          "metadata": {
            "description": "Specify the existing Key Vault ID."
          }
        }
      ```

    * **Remove** the section that creates a Key Vault resource:

        ```json
        {
          "type": "Microsoft.KeyVault/vaults",
          "apiVersion": "2018-02-14",
          "name": "[variables('keyVaultName')]",
          "location": "[parameters('location')]",
          "properties": {
            "tenantId": "[variables('tenantId')]",
            "sku": {
              "name": "standard",
              "family": "A"
            },
            "accessPolicies": [
            ]
          }
        },
        ```

    * **Remove** the `"[resourceId('Microsoft.KeyVault/vaults', variables('keyVaultName'))]",` line from the `dependsOn` section of the workspace. Also **Change** the `keyVault` entry in the `properties` section of the workspace to reference the `keyVaultId` parameter:

        ```json
        {
          "type": "Microsoft.MachineLearningServices/workspaces",
          "apiVersion": "2019-11-01",
          "name": "[parameters('workspaceName')]",
          "location": "[parameters('location')]",
          "dependsOn": [
            "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]",
            "[resourceId('Microsoft.Insights/components', variables('applicationInsightsName'))]"
          ],
          "identity": {
            "type": "systemAssigned"
          },
          "sku": {
            "tier": "[parameters('sku')]",
            "name": "[parameters('sku')]"
          },
          "properties": {
            "friendlyName": "[parameters('workspaceName')]",
            "keyVault": "[parameters('keyVaultId')]",
            "applicationInsights": "[resourceId('Microsoft.Insights/components',variables('applicationInsightsName'))]",
            "storageAccount": "[resourceId('Microsoft.Storage/storageAccounts/',variables('storageAccountName'))]"
          }
        }
        ```

    After these changes, you can specify the ID of the existing Key Vault resource when running the template. The template will then reuse the Key Vault by setting the `keyVault` property of the workspace to its ID.

    To get the ID of the Key Vault, you can reference the output of the original template run or use the Azure CLI. The following command is an example of using the Azure CLI to get the Key Vault resource ID:

    ```azurecli
    az keyvault show --name mykeyvault --resource-group myresourcegroup --query id
    ```

    This command returns a value similar to the following text:

    ```text
    /subscriptions/{subscription-guid}/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault
    ```

## Next steps

* [Deploy resources with Resource Manager templates and Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md).
* [Creating and deploying Azure resource groups through Visual Studio](../azure-resource-manager/templates/create-visual-studio-deployment-project.md).
* [For other templates related to Azure Machine Learning, see the Azure Quickstart Templates repository](https://github.com/Azure/azure-quickstart-templates)