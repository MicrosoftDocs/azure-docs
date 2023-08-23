---
title: Deploy a service catalog managed application
description: Describes how to deploy a service catalog's managed application for an Azure Managed Application using Azure PowerShell, Azure CLI, or Azure portal.
ms.topic: quickstart
ms.date: 05/12/2023
ms.custom: engagement-fy23, devx-track-azurecli, devx-track-azurepowershell
---

# Quickstart: Deploy a service catalog managed application

In this quickstart, you use the managed application definition that you created using one of the quickstart articles. The deployment creates two resource groups. One resource group contains the managed application and the other is a managed resource group for the deployed resources. The managed application definition deploys an App Service plan, App Service, and storage account.

## Prerequisites

- A managed application definition created with [publish an application definition](publish-service-catalog-app.md) or [publish a definition with bring your own storage](publish-service-catalog-bring-your-own-storage.md).
- An Azure account with an active subscription. If you don't have an account, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com/).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-azure-powershell) or [Azure CLI](/cli/azure/install-azure-cli).

## Create service catalog managed application

The examples use the resource groups names created in the _quickstart to publish an application definition_. If you used the quickstart to _publish a definition with bring your own storage_, use those resource group names.

- **Publish application definition**: _packageStorageGroup_ and _appDefinitionGroup_.
- **Publish definition with bring your own storage**: _packageStorageGroup_, _byosDefinitionStorageGroup_, and _byosAppDefinitionGroup_.

### Get managed application definition

# [PowerShell](#tab/azure-powershell)

To get the managed application's definition with Azure PowerShell, run the following commands.

In Visual Studio Code, open a new PowerShell terminal and sign in to your Azure subscription.

```azurepowershell
Connect-AzAccount
```

The command opens your default browser and prompts you to sign in to Azure. For more information, go to [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

From Azure PowerShell, get your managed application's definition. In this example, use the resource group name _appDefinitionGroup_ that was created when you deployed the managed application definition.

```azurepowershell
Get-AzManagedApplicationDefinition -ResourceGroupName appDefinitionGroup
```

`Get-AzManagedApplicationDefinition` lists all the available definitions in the specified resource group, like _sampleManagedApplication_.

Create a variable for the managed application definition's resource ID.

```azurepowershell
$definitionid = (Get-AzManagedApplicationDefinition -ResourceGroupName appDefinitionGroup -Name sampleManagedApplication).ManagedApplicationDefinitionId
```

You use the `$definitionid` variable's value when you deploy the managed application.

# [Azure CLI](#tab/azure-cli)

To get the managed application's definition with Azure CLI, run the following commands.

In Visual Studio Code, open a new Bash terminal session and sign in to your Azure subscription. If you have Git installed, select Git Bash.

```azurecli
az login
```

The command opens your default browser and prompts you to sign in to Azure. For more information, go to [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

From Azure CLI, get your managed application's definition. In this example, use the resource group name _appDefinitionGroup_ that was created when you deployed the managed application definition.

```azurecli
az managedapp definition list --resource-group appDefinitionGroup
```

The command lists all the available definitions in the specified resource group, like _sampleManagedApplication_.

Create a variable for the managed application definition's resource ID.

```azurecli
definitionid=$(az managedapp definition show --resource-group appDefinitionGroup --name sampleManagedApplication --query id --output tsv)
```

You use the `$definitionid` variable's value when you deploy the managed application.

# [Portal](#tab/azure-portal)

To get the managed application's definition from the Azure portal, use the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/create-resource.png" alt-text="Screenshot of Azure home page with Create a resource highlighted.":::

1. Search for _Service Catalog Managed Application_ and select it from the available options.

1. **Service Catalog Managed Application** is displayed. Select **Create**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/create-service-catalog-managed-application.png" alt-text="Screenshot of search result for Service Catalog Managed Application with create button highlighted.":::

1. Select **Sample managed application** and then select **Create**.

   The portal displays the managed application definitions that you published with the quickstart articles.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/select-service-catalog-managed-application.png" alt-text="Screenshot that shows managed application definitions that you can deploy.":::

---

### Create resource group and parameters

# [PowerShell](#tab/azure-powershell)

Create a resource group for the managed application that's used during the deployment.

```azurepowershell
New-AzResourceGroup -Name applicationGroup -Location westus3
```

You also need to create a name for the managed application resource group. The resource group is created when you deploy the managed application.

Run the following commands to create the managed resource group's name.

```azurepowershell
$mrgprefix = 'mrg-sampleManagedApplication-'
$mrgtimestamp = Get-Date -UFormat "%Y%m%d%H%M%S"
$mrgname = $mrgprefix + $mrgtimestamp
$mrgname
```

The `$mrgprefix` and `$mrgtimestamp` variables are concatenated and stored in the `$mrgname` variable. The variable's value is in the format _mrg-sampleManagedApplication-20230512103059_. You use the `$mrgname` variable's value when you deploy the managed application.

You need to provide several parameters to the deployment command for the managed application. You can use a JSON formatted string or create a JSON file. In this example, we use a JSON formatted string. The PowerShell escape character for the quote marks is the backtick (`` ` ``) character. The backtick is also used for line continuation so that commands can use multiple lines.

The JSON formatted string's syntax is as follows:

```json
"{ `"parameterName`": {`"value`":`"parameterValue`"}, `"parameterName`": {`"value`":`"parameterValue`"} }"
```

For readability, the completed JSON string uses the backtick for line continuation. The values are stored in the `$params` variable that's used in the deployment command. The parameters in the JSON string are required to deploy the managed resources.

```powershell
$params="{ `"appServicePlanName`": {`"value`":`"demoAppServicePlan`"}, `
`"appServiceNamePrefix`": {`"value`":`"demoApp`"}, `
`"storageAccountNamePrefix`": {`"value`":`"demostg1234`"}, `
`"storageAccountType`": {`"value`":`"Standard_LRS`"} }"
```

The parameters to create the managed resources:

- `appServicePlanName`: Create a plan name. Maximum of 40 alphanumeric characters and hyphens. For example, _demoAppServicePlan_. App Service plan names must be unique within a resource group in your subscription.
- `appServiceNamePrefix`: Create a prefix for the plan name. Maximum of 47 alphanumeric characters or hyphens. For example, _demoApp_. During deployment, the prefix is concatenated with a unique string to create a name that's globally unique across Azure.
- `storageAccountNamePrefix`: Use only lowercase letters and numbers and a maximum of 11 characters. For example, _demostg1234_. During deployment, the prefix is concatenated with a unique string to create a name globally unique across Azure. Although you're creating a prefix, the control checks for existing names in Azure and might post a validation message that the name already exists. If so, choose a different prefix.
- `storageAccountType`: The options are Premium_LRS, Standard_LRS, and Standard_GRS.

# [Azure CLI](#tab/azure-cli)

Create a resource group for the managed application that's used during the deployment.

```azurecli
az group create --name applicationGroup --location westus3
```

You also need to create a name and path for the managed application resource group. The resource group is created when you deploy the managed application.

Run the following commands to create the managed resource group's path.

```azurecli
mrgprefix='mrg-sampleManagedApplication-'
mrgtimestamp=$(date +%Y%m%d%H%M%S)
mrgname="${mrgprefix}${mrgtimestamp}"
subid=$(az account list --query [].id --output tsv)
mrgpath="/subscriptions/$subid/resourceGroups/$mrgname"
```

The `$mrgprefix` and `$mrgtimestamp` variables are concatenated and stored in the `$mrgname` variable. The variable's value is in the format _mrg-sampleManagedApplication-20230512103059_. The `mrgname` and `subid` variable's are concatenated to create the `mrgpath` variable value that creates the managed resource group during the deployment.

You need to provide several parameters to the deployment command for the managed application. You can use a JSON formatted string or create a JSON file. In this example, we use a JSON formatted string. In Bash, the escape character for the quote marks is the backslash (`\`) character. The backslash is also used for line continuation so that commands can use multiple lines.

The JSON formatted string's syntax is as follows:

```json
"{ \"parameterName\": {\"value\":\"parameterValue\"}, \"parameterName\": {\"value\":\"parameterValue\"} }"
```

For readability, the completed JSON string uses the backslash for line continuation. The values are stored in the `params` variable that's used in the deployment command. The parameters in the JSON string are required to deploy the managed resources.

```azurecli
params="{ \"appServicePlanName\": {\"value\":\"demoAppServicePlan\"}, \
\"appServiceNamePrefix\": {\"value\":\"demoApp\"}, \
\"storageAccountNamePrefix\": {\"value\":\"demostg1234\"}, \
\"storageAccountType\": {\"value\":\"Standard_LRS\"} }"
```

The parameters to create the managed resources:

- `appServicePlanName`: Create a plan name. Maximum of 40 alphanumeric characters and hyphens. For example, _demoAppServicePlan_. App Service plan names must be unique within a resource group in your subscription.
- `appServiceNamePrefix`: Create a prefix for the plan name. Maximum of 47 alphanumeric characters or hyphens. For example, _demoApp_. During deployment, the prefix is concatenated with a unique string to create a name that's globally unique across Azure.
- `storageAccountNamePrefix`: Use only lowercase letters and numbers and a maximum of 11 characters. For example, _demostg1234_. During deployment, the prefix is concatenated with a unique string to create a name globally unique across Azure. Although you're creating a prefix, the control checks for existing names in Azure and might post a validation message that the name already exists. If so, choose a different prefix.
- `storageAccountType`: The options are Premium_LRS, Standard_LRS, and Standard_GRS.

# [Portal](#tab/azure-portal)

1. Provide values for the **Basics** tab and select **Next: Web App settings**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/basics-info.png" alt-text="Screenshot that highlights the required information on the basics tab.":::

   - **Subscription**: Select the subscription where you want to deploy the managed application.
   - **Resource group**: Select the resource group. For this example, create a resource group named _applicationGroup_.
   - **Region**: Select the location where you want to deploy the resource.
   - **Application Name**: Enter a name for your managed application. For this example, use _demoManagedApplication_.
   - **Managed Resource Group**: The name of the managed resource group that contains the resources that are deployed for the managed application. The default name is in the format `mrg-{definitionName}-{dateTime}` but you can change the name.

1. Provide values for the **Web App settings** tab and select **Next: Storage settings**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/web-app-settings.png" alt-text="Screenshot that highlights the required information on the Web App settings tab.":::

   - **App Service plan name**: Create a plan name. Maximum of 40 alphanumeric characters and hyphens. For example, _demoAppServicePlan_. App Service plan names must be unique within a resource group in your subscription.
   - **App Service name prefix**: Create a prefix for the plan name. Maximum of 47 alphanumeric characters or hyphens. For example, _demoApp_. During deployment, the prefix is concatenated with a unique string to create a name that's globally unique across Azure.

1. Enter a prefix for the storage account name and select the storage account type. Select **Next: Review + create**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/storage-settings.png" alt-text="Screenshot that shows the information needed to create a storage account.":::

   - **Storage account name prefix**: Use only lowercase letters and numbers and a maximum of 11 characters. For example, _demostg1234_. During deployment, the prefix is concatenated with a unique string to create a name globally unique across Azure. Although you're creating a prefix, the control checks for existing names in Azure and might post a validation message that the name already exists. If so, choose a different prefix.
   - **Storage account type**: Select **Change type** to choose a storage account type. The default is Standard LRS. The other options are Premium_LRS, Standard_LRS, and Standard_GRS.

---

### Deploy the managed application

# [PowerShell](#tab/azure-powershell)

Run the following command to deploy the managed application.

```azurepowershell
New-AzManagedApplication `
  -Name "demoManagedApplication" `
  -ResourceGroupName applicationGroup `
  -Location westus3 `
  -ManagedResourceGroupName $mrgname `
  -ManagedApplicationDefinitionId $definitionid `
  -Kind ServiceCatalog `
  -Parameter $params
```

The parameters used in the deployment command:

- `Name`: Specify a name for the managed application. For this example, use _demoManagedApplication_.
- `ResourceGroupName`: Name of the resource group you created for the managed application.
- `Location`: Specify the region to deploy the resources. For this example, use _westus3_.
- `ManagedResourceGroupName`: Uses the `$mrgname` variable's value. The managed resource group is created when the managed application is deployed.
- `ManagedApplicationDefinitionId`: Uses the `$definitionid` variable's value for the managed application definition's resource ID.
- `Kind`: Specifies that type of managed application. This example uses _ServiceCatalog_.
- `Parameter`: Uses the `$params` variable's value in the JSON formatted string.

# [Azure CLI](#tab/azure-cli)

Run the following command to deploy the managed application.

```azurecli
az managedapp create \
  --name demoManagedApplication \
  --resource-group applicationGroup \
  --location westus3 \
  --managed-rg-id $mrgpath \
  --managedapp-definition-id $definitionid \
  --kind ServiceCatalog \
  --parameters "$params"
```

The parameters used in the deployment command:

- `name`: Specify a name for the managed application. For this example, use _demoManagedApplication_.
- `resource-group`: Name of the resource group you created for the managed application.
- `location`: Specify the region to deploy the resources. For this example, use _westus3_.
- `managed-rg-id`: Uses the `$mrgpath` variable's value. The managed resource group is created when the managed application is deployed.
- `managedapp-definition-id`: Uses the `$definitionid` variable's value for the managed application definition's resource ID.
- `kind`: Specifies that type of managed application. This example uses _ServiceCatalog_.
- `parameters`: Uses the `$params` variable's value in the JSON formatted string.

# [Portal](#tab/azure-portal)

Review the summary of the values you selected and verify **Validation Passed** is displayed. Select **Create** to deploy the managed application.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/summary-validation.png" alt-text="Screenshot that summarizes the values you selected and shows the status of validation passed.":::

---

## View results

After the service catalog managed application is deployed, you have two new resource groups. One resource group contains the managed application. The other resource group contains the managed resources that were deployed. In this example, an App Service, App Service plan, and storage account.

### Managed application

After the deployment is finished, you can check your managed application's status.

# [PowerShell](#tab/azure-powershell)

Run the following command to check the managed application's status.

```azurepowershell
Get-AzManagedApplication -Name demoManagedApplication -ResourceGroupName applicationGroup
```

Expand the properties to make it easier to read the `Properties` information.

```azurepowershell
Get-AzManagedApplication -Name demoManagedApplication -ResourceGroupName applicationGroup | Select-Object -ExpandProperty Properties
```

# [Azure CLI](#tab/azure-cli)

Run the following command to check the managed application's status.

```azurecli
az managedapp list --resource-group applicationGroup
```

The following command parses the data about the managed application to show only the application's name and provisioning state.

```azurecli
az managedapp list --resource-group applicationGroup --query "[].{Name:name, provisioningState:provisioningState}"
```

# [Portal](#tab/azure-portal)

Go to the resource group named **applicationGroup** and select **Overview**. The resource group contains your managed application named _demoManagedApplication_.

:::image type="content" source="./media/deploy-service-catalog-quickstart/view-application-group.png" alt-text="Screenshot that shows the resource group that contains the managed application.":::

Select the managed application's name to get more information like the link to the managed resource group.

:::image type="content" source="./media/deploy-service-catalog-quickstart/view-managed-application.png" alt-text="Screenshot that shows the managed application's details and highlights the link to the managed resource group.":::

---

### Managed resources

You can view the resources deployed to the managed resource group.

# [PowerShell](#tab/azure-powershell)

To display the managed resource group's resources, run the following command. You created the `$mrgname` variable when you created the parameters.

```azurepowershell
Get-AzResource -ResourceGroupName $mrgname
```

To display all the role assignments for the managed resource group.

```azurepowershell
Get-AzRoleAssignment -ResourceGroupName $mrgname
```

The managed application definition you created in the quickstart articles used a group with the Owner role assignment. You can view the group with the following command.

```azurepowershell
Get-AzRoleAssignment -ResourceGroupName $mrgname -RoleDefinitionName Owner
```

You can also list the deny assignments for the managed resource group.

```azurepowershell
Get-AzDenyAssignment -ResourceGroupName $mrgname
```

# [Azure CLI](#tab/azure-cli)

To display the managed resource group's resources, run the following command. You created the `$mrgname` variable when you created the parameters.

```azurecli
az resource list --resource-group $mrgname
```

Run the following command to list only the name, type, and provisioning state for the managed resources.

```azurecli
az resource list --resource-group $mrgname --query "[].{Name:name, Type:type, provisioningState:provisioningState}"
```

Run the following command to list the role assignment for the group that was used in the managed application's definition.

```azurecli
az role assignment list --resource-group $mrgname
```

The following command parses the data for the group's role assignment.

```azurecli
az role assignment list --resource-group $mrgname --role Owner --query "[].{ResourceGroup:resourceGroup, GroupName:principalName, RoleDefinition:roleDefinitionId, Role:roleDefinitionName}"
```

To review the managed resource group's deny assignments, use the Azure portal or Azure PowerShell commands.

# [Portal](#tab/azure-portal)

Go to the managed resource group with the name prefix **mrg-sampleManagedApplication** and select **Overview** to display the resources that were deployed. The resource group contains an App Service, App Service plan, and storage account.

:::image type="content" source="./media/deploy-service-catalog-quickstart/view-managed-resource-group.png" alt-text="Screenshot that shows the managed resource group that contains the resources deployed by the managed application definition.":::

The managed resource group and each resource created by the managed application has a role assignment. When you used a quickstart article to create the definition, you created an Azure Active Directory group. That group was used in the managed application definition. When you deployed the managed application, a role assignment for that group was added to the managed resources.

To see the role assignment from the Azure portal:

1. Go to your **mrg-sampleManagedApplication** resource group.
1. Select **Access Control (IAM)** > **Role assignments**.

   You can also view the resource's **Deny assignments**.

The role assignment gives the application's publisher access to manage the storage account. In this example, the publisher might be your IT department. The _Deny assignments_ prevents customers from making changes to a managed resource's configuration. Managed apps are designed so that customers don't need to maintain the resources. The _Deny assignment_ excludes the Azure Active Directory group that was assigned in **Role assignments**.

---

## Clean up resources

When you're finished with the managed application, you can delete the resource groups and that removes all the resources you created. For example, in this quickstart you created the resource groups _applicationGroup_ and a managed resource group with the prefix _mrg-sampleManagedApplication_.

# [PowerShell](#tab/azure-powershell)

The command prompts you to confirm that you want to remove the resource group.

```azurepowershell
Remove-AzResourceGroup -Name applicationGroup
```

# [Azure CLI](#tab/azure-cli)

The command prompts for confirmation, and then returns you to command prompt while resources are being deleted.

```azurecli
az group delete --resource-group applicationGroup --no-wait
```

# [Portal](#tab/azure-portal)

1. From Azure portal **Home**, in the search field, enter _resource groups_.
1. Select **Resource groups**.
1. Select **applicationGroup** and **Delete resource group**.
1. To confirm the deletion, enter the resource group name and select **Delete**.

---

If you want to delete the managed application definition, delete the resource groups you created in the quickstart articles.

- **Publish application definition**: _packageStorageGroup_ and _appDefinitionGroup_.
- **Publish definition with bring your own storage**: _packageStorageGroup_, _byosDefinitionStorageGroup_, and _byosAppDefinitionGroup_.

## Next steps

- To learn how to create and publish the definition files for a managed application, go to [Quickstart: Create and publish an Azure Managed Application definition](publish-service-catalog-app.md).
- To use your own storage to create and publish the definition files for a managed application, go to [Quickstart: Bring your own storage to create and publish an Azure Managed Application definition](publish-service-catalog-bring-your-own-storage.md).
