---
title: Use deployment scripts in Bicep
description: Learn how to create, monitor, and troubleshoot deployment scripts in Bicep.
ms.custom: devx-track-bicep
ms.topic: how-to
ms.date: 03/25/2025
---

# Use deployment scripts in Bicep

You can use the [deploymentScripts](/azure/templates/microsoft.resources/deploymentscripts) resource to run scripts in Bicep deployments and review execution results. These scripts help you to perform the following custom steps:

- Add users to a directory.
- Perform data plane operations; for example, copy blobs or seed a database.
- Look up and validate a license key.
- Create a self-signed certificate.
- Create an object in Microsoft Entra ID.
- Look up IP address blocks from a custom system.

The benefits of deployment scripts include:

- They're easy to code, use, and debug. You can develop deployment scripts in your favorite development environments. The scripts can be embedded in Bicep files or in external script files.
- You can specify the script language and platform. Azure PowerShell and Azure CLI deployment scripts in the Linux environment are supported at this time.
- You can allow passing command-line arguments to the script.
- You can specify script outputs and pass them back to the deployment.

The deployment script resource is available only in the regions where Azure Container Instances is available. For more information, see [Resource availability & quota limits for ACI](/azure/container-instances/container-instances-resource-and-quota-limits) and [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

> [!WARNING]
> The deployment script service requires two extra resources to run and troubleshoot scripts: a storage account and a container instance. Generally, the service cleans up these resources after the deployment script finishes. You incur charges for these resources until they're removed.
>
> For pricing information, see [Azure Container Instances pricing](https://azure.microsoft.com/pricing/details/container-instances/) and [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). To learn more, see [Clean up deployment script resources](./deployment-script-develop.md#clean-up-deployment-script-resources).

### Training resources

If you prefer to learn about deployment scripts through step-by-step guidance, see the [Extend Bicep and ARM templates by using deployment scripts](/training/modules/extend-resource-manager-template-deployment-scripts) Microsoft Learn module.

## Configure the minimum permissions

For deployment script API version `2020-10-01` or later, two principals are involved in deployment script execution:

- **Deployment principal**: This principal is used to deploy the Bicep file. It creates underlying resources that are required for the deployment script resource to run a storage account and an Azure container instance. To configure the least-privilege permissions, assign a custom role with the following properties to the deployment principal:

    ```json
    {
      "roleName": "deployment-script-minimum-privilege-for-deployment-principal",
      "description": "Configure least privilege for the deployment principal in deployment script",
      "type": "customRole",
      "IsCustom": true,
      "permissions": [
        {
          "actions": [
            "Microsoft.Storage/storageAccounts/*",
            "Microsoft.ContainerInstance/containerGroups/*",
            "Microsoft.Resources/deployments/*",
            "Microsoft.Resources/deploymentScripts/*"
          ],
        }
      ],
      "assignableScopes": [
        "[subscription().id]"
      ]
    }
    ```

    If the Azure Storage and Azure Container Instances resource providers weren't registered, add `Microsoft.Storage/register/action` and `Microsoft.ContainerInstance/register/action`.

- **Deployment script principal**: This principal is required only if the deployment script needs to authenticate to Azure and call the Azure CLI or PowerShell. There are two ways to specify the deployment script principal:

  - Specify a [user-assigned managed identity](/entra/identity/managed-identities-azure-resources/overview) in the `identity` property; see the [deployment script resource syntax](./deployment-script-develop.md#syntax). When you specify a user-assigned managed identity, the script service calls `Connect-AzAccount -Identity` before invoking the deployment script. The managed identity must have the required access to complete the operation in the script. Only a user-assigned managed identity is supported for the `identity` property at this time. To log in with a different identity, use the second method in this list.
  - Pass the service principal credentials as secure environment variables, and then call [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount) or [`az login`](/cli/azure/reference-index#az-login) in the deployment script.

  If you use a managed identity, the deployment principal needs the built-in Managed Identity Operator role assigned to the managed identity resource.

A built-in role isn't tailored for configuring deployment script permissions at this time.

## Create deployment scripts

The following example demonstrates a simple Bicep file with a deployment script resource. The script takes one string parameter and creates another string:

# [Azure CLI](#tab/azure-cli)

```bicep
param name string = 'John Dole'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'inlineCLI'
  location: location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.52.0'
    arguments: name
    scriptContent: 'echo "The argument is ${name}."; jq -n -c --arg st "Hello ${name}" \'{"text": $st}\' > $AZ_SCRIPTS_OUTPUT_PATH'
    retentionInterval: 'PT1H'
  }
}

output text string = deploymentScript.properties.outputs.text
```

# [Azure PowerShell](#tab/azure-powershell)

```bicep
param name string = '\\"John Dole\\"'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'inlinePS'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.0'
    arguments: '-name ${name}'
    scriptContent: '''
      param([string] $name)
      Write-Host 'The argument is {0}' -f $name
      $output = 'Hello {0}' -f $name
      $DeploymentScriptOutputs = @{}
      $DeploymentScriptOutputs['text'] = $output
    '''
    retentionInterval: 'PT1H'
  }
}

output result string = deploymentScript.properties.outputs.text
```

---

For more information about creating deployment script resources, see [Develop a deployment script in Bicep](./deployment-script-develop.md). To create scripts for the deployment script resource, it's recommended to establish a dedicated script development environment such as an Azure container instance or a Docker image. After you develop and thoroughly test the scripts, you can integrate or invoke the script files from the deployment script resource. For more information, see [Configure development environment for deployment scripts in Bicep files](./deployment-script-bicep-configure-dev.md).

Save the script in an _inlineScript.bicep_ file, and then use the following scripts to deploy the resource:

```azurepowershell
$resourceGroupName = Read-Host -Prompt "Enter the name of the resource group to be created"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location $location

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile "inlineScript.bicep"

Write-Host "Press [ENTER] to continue ..."
```

## Use managed identity

The following example demonstrates how to use managed identity to interact with Azure from inside the deployment script:

```bicep
@description('The location of the resources.')
param location string = resourceGroup().location

@description('The storage account to list blobs from.')
param storageAccountData {
  name: string
  container: string
}

@description('The role id of Storage Blob Data Reader.')
var storageBlobDataReaderRoleId = '2a2b9908-6ea1-4ae2-8e65-a410df84e7d1'

@description('The storage account to read blobs from.')
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-04-01' existing = {
  name: storageAccountData.name
}

@description('The Storage Blob Data Reader Role definition from [Built In Roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles).')
resource storageBlobDataReaderRoleDef 'Microsoft.Authorization/roleDefinitions@2022-05-01-preview' existing = {
  scope: subscription()
  name: storageBlobDataReaderRoleId
}

@description('The user identity for the deployment script.')
resource scriptIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-07-31-preview' = {
  name: 'script-identity'
  location: location
}

@description('Assign permission for the deployment scripts user identity access to the read blobs from the storage account.')
resource dataReaderRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storageAccount
  name: guid(storageBlobDataReaderRoleDef.id, scriptIdentity.id, storageAccount.id)
  properties: {
    principalType: 'ServicePrincipal'
    principalId: scriptIdentity.properties.principalId
    roleDefinitionId: storageBlobDataReaderRoleDef.id
  }
}

@description('The deployment script.')
resource script 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'script'
  location: location
  kind: 'AzureCLI'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${scriptIdentity.id}': {}
    }
  }
  properties: {
    azCliVersion: '2.59.0'
    retentionInterval: 'PT1H'
    arguments: '${storageAccount.properties.primaryEndpoints.blob} ${storageAccountData.container}'
    scriptContent: '''
      #!/bin/bash
      set -e
      az storage blob list --auth-mode login --blob-endpoint $1 --container-name $2
    '''
  }
}
```

## Monitor and troubleshoot a deployment script

When you deploy a deployment script resource, you need a storage account to store the user script, the execution results, and the `stdout` file. You can specify your own storage account. For more information, see [Use an existing storage account](./deployment-script-develop.md#use-an-existing-storage-account).

An alternative to specifying your own storage account involves setting `cleanupPreference` to `OnExpiration`. You then configure `retentionInterval` for a duration that allows ample time for reviewing the outputs before the storage account is removed. For more information, see [Clean up deployment script resources](./deployment-script-develop.md#clean-up-deployment-script-resources).

Add the `cleanupPreference` property to the preceding Bicep file, and set the value to `OnExpiration`. The default value is `Always`. Also, set `rentalInterval` to `PT1H` (one hour) or shorter.

# [Azure CLI](#tab/azure-cli)

```bicep
param name string = 'John Dole'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'inlineCLI'
  location: location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.52.0'
    arguments: name
    scriptContent: 'echo "The argument is ${name}."; jq -n -c --arg st "Hello ${name}" \'{"text": $st}\' > $AZ_SCRIPTS_OUTPUT_PATH'
    cleanupPreference: 'OnExpiration'
    retentionInterval: 'PT1H'
  }
}

output text string = deploymentScript.properties.outputs.text
```

# [Azure PowerShell](#tab/azure-powershell)

```bicep
param name string = '\\"John Dole\\"'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'inlinePS'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.0'
    arguments: '-name ${name}'
    scriptContent: '''
      param([string] $name)
      Write-Output "The argument is {0}." -f $name
      $output = "Hello {0}." -f $name
      $DeploymentScriptOutputs = @{}
      $DeploymentScriptOutputs['text'] = $output
    '''
    cleanupPreference: 'OnExpiration'
    retentionInterval: 'PT1H'
  }
}

output text string = deploymentScript.properties.outputs.text
```

---

After you deploy the Bicep file successfully, use the Azure portal, the Azure CLI, Azure PowerShell, or the REST API to check the results.

### Azure portal

After you deploy a deployment script resource, the resource is listed under the resource group in the Azure portal. The **Overview** page lists the two supporting resources in addition to the deployment script resource. The supporting resources will be deleted after the retention interval expires.

Notice that both supporting resources have the _azscripts_ suffix in their names because these resources are created automatically. The other way to identify the supporting resources is to use [tags](./deployment-script-develop.md#syntax).

:::image type="content" source="./media/deployment-script-bicep/bicep-deployment-script-portal-resource-group.png" alt-text="Screenshot of a deployment script resource group.":::

Select the deployment script resource from the list. The **Overview** page of a deployment script resource displays important information about the resource, including the **Provisioning state** and the two supporting resources, **Storage account** and **Container instance**. The **Logs** area shows the print text from the script.

:::image type="content" source="./media/deployment-script-bicep/bicep-deployment-script-portal-resource.png" alt-text="Screenshot of information about a deployment script resource.":::

Select **Outputs** to display outputs of the script.

:::image type="content" source="./media/deployment-script-bicep/bicep-deployment-script-portal-resource-output.png" alt-text="Screenshot of deployment script outputs.":::

Go back to the resource group, select the storage account, select **File shares**, and then select the file share with _azscripts_ appended to the share name. Two folders appear in the list: _azscriptinput_ and _azscriptoutput_. The output folder contains an _executionresult.json_ file and the script output file. The _executionresult.json_ file contains the script execution error message. The output file is created only when you run the script successfully.

:::image type="content" source="./media/deployment-script-bicep/bicep-deployment-script-portal-az-script-output.png" alt-text="Screenshot of the contents of a deployment script's output folder.":::

The input folder contains the system script file and the user deployment script file. You can replace the user deployment script file with a revised one and rerun the deployment script from the Azure container instance.

### Azure CLI

You can use the Azure CLI to manage deployment scripts at the subscription or resource group scope:

- [az deployment-scripts delete](/cli/azure/deployment-scripts#az-deployment-scripts-delete): Delete a deployment script.
- [az deployment-scripts list](/cli/azure/deployment-scripts#az-deployment-scripts-list): List all deployment scripts.
- [az deployment-scripts show](/cli/azure/deployment-scripts#az-deployment-scripts-show): Retrieve a deployment script.
- [az deployment-scripts show-log](/cli/azure/deployment-scripts#az-deployment-scripts-show-log): Show deployment script logs.

The output of the list command is similar to this example:

```json
{
  "arguments": "John Dole",
  "azCliVersion": "2.52.0",
  "cleanupPreference": "OnExpiration",
  "containerSettings": {
    "containerGroupName": null
  },
  "environmentVariables": null,
  "forceUpdateTag": null,
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/dsDemo/providers/Microsoft.Resources/deploymentScripts/inlineCLI",
  "identity": null,
  "kind": "AzureCLI",
  "location": "centralus",
  "name": "inlineCLI",
  "outputs": {
    "text": "Hello John Dole"
  },
  "primaryScriptUri": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "dsDemo",
  "retentionInterval": "1:00:00",
  "scriptContent": "echo \"The argument is John Dole.\"; jq -n -c --arg st \"Hello John Dole\" '{\"text\": $st}' > $AZ_SCRIPTS_OUTPUT_PATH",
  "status": {
    "containerInstanceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/dsDemo/providers/Microsoft.ContainerInstance/containerGroups/jgczqtxom5oreazscripts",
    "endTime": "2023-12-11T20:20:12.149468+00:00",
    "error": null,
    "expirationTime": "2023-12-11T21:20:12.149468+00:00",
    "startTime": "2023-12-11T20:18:26.674492+00:00",
    "storageAccountId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/dsDemo/providers/Microsoft.Storage/storageAccounts/jgczqtxom5oreazscripts"
  },
  "storageAccountSettings": null,
  "supportingScriptUris": null,
  "systemData": {
    "createdAt": "2023-12-11T19:45:32.239063+00:00",
    "createdBy": "johndole@contoso.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-12-11T20:18:26.183565+00:00",
    "lastModifiedBy": "johndole@contoso.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "timeout": "1 day, 0:00:00",
  "type": "Microsoft.Resources/deploymentScripts"
}
```

### Azure PowerShell

You can use Azure PowerShell to manage deployment scripts at the subscription or resource group scope:

- [Get-AzDeploymentScript](/powershell/module/az.resources/get-azdeploymentscript): Get or list deployment scripts.
- [Get-AzDeploymentScriptLog](/powershell/module/az.resources/get-azdeploymentscriptlog): Get the log of a deployment script execution.
- [Remove-AzDeploymentScript](/powershell/module/az.resources/remove-azdeploymentscript): Remove a deployment script and its associated resources.
- [Save-AzDeploymentScriptLog](/powershell/module/az.resources/save-azdeploymentscriptlog): Save the log of a deployment script execution to disk.

The `Get-AzDeploymentScript` output is similar to this example:

```output
Name                : inlinePS
Id                  : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/dsDemo/providers/Microsoft.Resources/deploymentScripts/inlinePS
ResourceGroupName   : dsDemo
Location            : centralus
SubscriptionId      : aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e
ProvisioningState   : Succeeded
Identity            :
ScriptKind          : AzurePowerShell
AzPowerShellVersion : 10.0
StartTime           : 12/11/2023 9:45:50 PM
EndTime             : 12/11/2023 9:46:59 PM
ExpirationDate      : 12/11/2023 10:46:59 PM
CleanupPreference   : OnExpiration
StorageAccountId    : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/dsDemo/providers/Microsoft.Storage/storageAccounts/ee5o4rmoo6ilmazscripts
ContainerInstanceId : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/dsDemo/providers/Microsoft.ContainerInstance/containerGroups/ee5o4rmoo6ilmazscripts
Outputs             :
                      Key                 Value
                      ==================  ==================
                      text                Hello John Dole.

RetentionInterval   : PT1H
Timeout             : P1D
```

### REST API

You can use the REST API to get information about the deployment script resource at the resource group level and the subscription level:

```rest
/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.resources/deploymentScripts/<DeploymentScriptResourceName>?api-version=2020-10-01
```

```rest
/subscriptions/<SubscriptionID>/providers/microsoft.resources/deploymentScripts?api-version=2020-10-01
```

The following example uses [ARMClient](https://github.com/projectkudu/ARMClient). ARMClient isn't a supported Microsoft tool.

```azurepowershell
armclient login
armclient get /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/myrg/providers/microsoft.resources/deploymentScripts/myDeployementScript?api-version=2020-10-01
```

The output is similar to this example:

```json
{
  "kind": "AzureCLI",
  "identity": null,
  "location": "centralus",
  "systemData": {
    "createdAt": "2023-12-11T19:45:32.239063+00:00",
    "createdBy": "johndole@contoso.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-12-11T20:18:26.183565+00:00",
    "lastModifiedBy": "johndole@contoso.com",
    "lastModifiedByType": "User"
  },
  "properties": {
    "provisioningState": "Succeeded",
    "azCliVersion": "2.52.0",
    "scriptContent": "echo \"The argument is John Dole.\"; jq -n -c --arg st \"Hello John Dole\" '{\"text\": $st}' > $AZ_SCRIPTS_OUTPUT_PATH",
    "arguments": "John Dole",
    "retentionInterval": "1:00:00",
    "timeout": "1 day, 0:00:00",
    "containerSettings": {
      "containerGroupName": null
    },
    "status": {
      "containerInstanceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/dsDemo/providers/Microsoft.ContainerInstance/containerGroups/jgczqtxom5oreazscripts",
      "endTime": "2023-12-11T20:20:12.149468+00:00",
      "error": null,
      "expirationTime": "2023-12-11T21:20:12.149468+00:00",
      "startTime": "2023-12-11T20:18:26.674492+00:00",
      "storageAccountId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/dsDemo/providers/Microsoft.Storage/storageAccounts/jgczqtxom5oreazscripts"
    },
    "outputs": {
      "text": "Hello John Dole"
    },
    "cleanupPreference": "OnSuccess"
  },
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/dsDemo/providers/Microsoft.Resources/deploymentScripts/inlineCLI",
  "type": "Microsoft.Resources/deploymentScripts",
  "name": "inlineCLI",
}

```

The following REST API returns the log:

```rest
/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.resources/deploymentScripts/<DeploymentScriptResourceName>/logs?api-version=2020-10-01
```

It works only before the deployment script resources are deleted.

---

## Deployment script error codes

The following table lists the error codes for the deployment script:

| Error code | Description |
|------------|-------------|
| `DeploymentScriptInvalidOperation` | The deployment script resource definition in the Bicep file contains invalid property names. |
| `DeploymentScriptResourceConflict` | You can't delete a deployment script resource if it's in a nonterminal state and the execution hasn't exceeded one hour. Or, you can't rerun the same deployment script with the same resource identifier (same subscription, resource group name, and resource name) but different script body content at the same time. |
| `DeploymentScriptOperationFailed` | The deployment script operation failed internally. Contact [Microsoft support](https://support.microsoft.com/en-us/contactus). |
| `DeploymentScriptStorageAccountAccessKeyNotSpecified` | The access key wasn't specified for the existing storage account.|
| `DeploymentScriptContainerGroupContainsInvalidContainers` | A container group that the deployment script service created was externally modified, and invalid containers were added. |
| `DeploymentScriptContainerGroupInNonterminalState` | Two or more deployment script resources use the same Azure container instance name in the same resource group, and one of them hasn't finished its execution yet. |
| `DeploymentScriptExistingStorageNotInSameSubscriptionAsDeploymentScript` | The existing storage provided in deployment isn't found in the subscription where the script is being deployed. |
| `DeploymentScriptStorageAccountInvalidKind` | The existing storage account of the `BlobBlobStorage` or `BlobStorage` type doesn't support file shares and can't be used. |
| `DeploymentScriptStorageAccountInvalidKindAndSku` | The existing storage account doesn't support file shares. For a list of supported types of storage accounts, see [Use an existing storage account](./deployment-script-develop.md#use-an-existing-storage-account). |
| `DeploymentScriptStorageAccountNotFound` | The storage account doesn't exist, or an external process or tool deleted it. |
| `DeploymentScriptStorageAccountWithServiceEndpointEnabled` | The specified storage account has a service endpoint. A storage account with a service endpoint isn't supported. |
| `DeploymentScriptStorageAccountInvalidAccessKey` | An invalid access key was specified for the existing storage account. |
| `DeploymentScriptStorageAccountInvalidAccessKeyFormat` | The storage account key has an invalid format. See [Manage storage account access keys](../../storage/common/storage-account-keys-manage.md). |
| `DeploymentScriptExceededMaxAllowedTime` | Deployment script execution time exceeded the timeout value specified in the deployment script resource definition. |
| `DeploymentScriptInvalidOutputs` | The deployment script output isn't a valid JSON object. |
| `DeploymentScriptContainerInstancesServiceLoginFailure` | The user-assigned managed identity couldn't sign in after 10 attempts with one-minute intervals. |
| `DeploymentScriptContainerGroupNotFound` | An external tool or process deleted a container group that the deployment script service created. |
| `DeploymentScriptDownloadFailure` | Download of a supporting script failed. See [Use supporting scripts](./deployment-script-develop.md#use-supporting-scripts).|
| `DeploymentScriptError` | The user script threw an error. |
| `DeploymentScriptBootstrapScriptExecutionFailed` | The bootstrap script threw an error. The bootstrap script is the system script that orchestrates execution of the deployment script. |
| `DeploymentScriptExecutionFailed` | An unknown error occurred during execution of the deployment script. |
| `DeploymentScriptContainerInstancesServiceUnavailable` | The Azure Container Instances service threw a "service unavailable" error when a container instance was created. |
| `DeploymentScriptContainerGroupInNonterminalState` | During creation of a container instance, another deployment script was using the same container instance name in the same scope (same subscription, resource group name, and resource name). |
| `DeploymentScriptContainerGroupNameInvalid` | The specified container instance name doesn't meet the Azure Container Instances requirements. See [Troubleshoot common issues in Azure Container Instances](/azure/container-instances/container-instances-troubleshooting#issues-during-container-group-deployment).|

## Access a private virtual network

You can run deployment scripts in private networks with some additional configurations. For more information, see [Access a private virtual network from a Bicep deployment script](./deployment-script-vnet.md) or [Run Bicep deployment script privately over a private endpoint](./deployment-script-vnet-private-endpoint.md).

## Next steps

In this article, you learned how to use deployment scripts. To learn more, see the [Extend Bicep and ARM templates using deployment scripts](/training/modules/extend-resource-manager-template-deployment-scripts) module from Microsoft Learn.

To explore the topics in this article, see:

- [Develop a deployment script in Bicep](./deployment-script-develop.md)
- [Access a private virtual network from a Bicep deployment script](./deployment-script-vnet.md)
- [Run Bicep deployment script privately over a private endpoint](./deployment-script-vnet-private-endpoint.md)
- [Configure development environment for deployment scripts in Bicep files](./deployment-script-bicep-configure-dev.md)
