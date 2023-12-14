---
title: Use deployment scripts in Bicep | Microsoft Docs
description: use deployment scripts in Bicep.
ms.custom: devx-track-bicep
ms.topic: conceptual
ms.date: 12/13/2023
---

# Use deployment scripts in Bicep

With the [`deploymentScripts`](/azure/templates/microsoft.resources/deploymentscripts) resource, users can execute scripts in Bicep deployments and review execution results.

These scripts can be used for performing custom steps such as:

- add users to a directory
- perform data plane operations, for example, copy blobs or seed database
- look up and validate a license key
- create a self-signed certificate
- create an object in Microsoft Entra ID
- look up IP Address blocks from custom system

The benefits of deployment script:

- Easy to code, use, and debug. You can develop deployment scripts in your favorite development environments. The scripts can be embedded in Bicep files or in external script files.
- You can specify the script language and platform. Currently, Azure PowerShell and Azure CLI deployment scripts on the Linux environment are supported.
- Allow passing command-line arguments to the script.
- Can specify script outputs and pass them back to the deployment.

The deployment script resource is only available in the regions where Azure Container Instance is available.  See [Resource availability for Azure Container Instances in Azure regions](../../container-instances/container-instances-region-availability.md).

> [!WARNING]
> The deployment script service requires two extra resources to execute and troubleshoot scripts: a storage account (unless you provide one) and a container instance. Generally, the service cleans up these resources after the deployment script completes. Yet, you'll incur charges for these resources until they're removed. For the price information, see [Container Instances pricing](https://azure.microsoft.com/pricing/details/container-instances/) and [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/). To learn more, see [Clean-up deployment script resources](./deployment-script-develop.md#clean-up-deployment-script-resources).

### Training resources

If you would rather learn about deployment scripts through step-by-step guidance, see [Extend ARM templates by using deployment scripts](/training/modules/extend-resource-manager-template-deployment-scripts).

## Configure the minimum permissions

For deployment script API version `2020-10-01` or later, there are two principals involved in deployment script execution:

- **Deployment principal** (the principal used to deploy the Bicep file): this principal is used to create underlying resources required for the deployment script resource to execute—a storage account and an Azure container instance. To configure the least-privilege permissions, assign a custom role with the following properties to the deployment principal:

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

    In case the Azure Storage and the Azure Container Instance resource providers haven't been registered, ensure to add `Microsoft.Storage/register/action` and `Microsoft.ContainerInstance/register/action`.

- **Deployment script principal**: This principal is only required if the deployment script needs to authenticate to Azure and call Azure CLI/PowerShell. There are two ways to specify the deployment script principal:

  - Specify a [user-assigned managed identity]() in the `identity` property (see [Deployment script resource syntax](./deployment-script-develop.md#syntax)). When specified, the script service calls `Connect-AzAccount -Identity` before invoking the deployment script. The managed identity must have the required access to complete the operation in the script. Currently, only user-assigned managed identity is supported for the `identity` property. To log in with a different identity, use the second method in this list.
  - Pass the service principal credentials as secure environment variables, and then can call [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) or [az login](/cli/azure/reference-index#az-login) in the deployment script.

  If a managed identity is used, the deployment principle needs the **Managed Identity Operator** role (a built-in role) assigned to the managed identity resource.

Currently, there isn't a built-in role specifically tailored for configuring deployment script permissions.

## Create deployment scripts

The following Bicep file demonstrates a simple Bicep file with a deployment script resource. The script takes one string parameter, and creates another string.

# [CLI](#tab/CLI)

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

# [PowerShell](#tab/PowerShell)

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

For more information about creating deployment script resources, see [Create deployments scripts](./deployment-script-develop.md). For the creation of scripts utilized in the deployment script resource, it's advisable to establish a dedicated script development environment such as an Azure container instance or a Docker image. Once the scripts have been developed and thoroughly tested, you can integrate or invoke the script files from the deployment script resource. For more information, see[Configure script development environments](./deployment-script-bicep-configure-dev.md).

Save the script into a `inlineScript.bicep` file, and then deploy the resource by using the following script

```azurepowershell
$resourceGroupName = Read-Host -Prompt "Enter the name of the resource group to be created"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location $location

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile "inlineScript.bicep"

Write-Host "Press [ENTER] to continue ..."
```

## Monitor and troubleshoot deployment script

When you deploy a deployment script resource, a storage account is required for storing the user script, the execution results, and the stdout file. You can specify your own storage account. See [Use existing storage account](./deployment-script-develop.md#use-existing-storage-account). An alternative solution, without specifying your own storage account, involves setting `cleanupPreference` to `OnExpiration`and configuring `retentionInterval` for a duration that allows ample time for reviewing the outputs before the storage account is removed. For more information, see [Clean up deployment script resources](./deployment-script-develop.md#clean-up-deployment-script-resources).

Add the `cleanupPreference` property to the preceding Bicep file, and set the value to `OnExpiration`. The default value is `Always`. Also, set `rentalInterval` to `PT1H` (one hour), or shorter.

# [CLI](#tab/CLI)

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

# [PowerShell](#tab/PowerShell)

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

After the Bicep file is deployed successfully, use the Azure portal, Azure CLI, Azure PowerShell and REST API to check out the results.

### Azure portal

After you deploy a deployment script resource, the resource is listed under the resource group in the Azure portal. The **Overview** page lists the two supporting resources in addition to the deployment script resource. The supporting resources will be deleted after the retention interval expires. Notice both resources have the `azscripts` suffix in the resource names because these resources are created automatically. The other way to identify the supporting resources is by using `tags`. For more information, see [tags](./deployment-script-develop.md#syntax).

:::image type="content" source="./media/deployment-script-bicep/bicep-deployment-script-portal-resource-group.png" alt-text="Screenshot of deployment script resource group.":::

Select the deployment script resource from the list. The **Overview** page of a deployment script resource displays some important information of the resource, such as **Provisioning state**, the two supporting resources - **Storage account** and **Container instance**. The **Logs** shows the print text from the script.

:::image type="content" source="./media/deployment-script-bicep/bicep-deployment-script-portal-resource.png" alt-text="Screenshot of deployment script resource.":::

Select **Outputs** to display outputs of the script:

:::image type="content" source="./media/deployment-script-bicep/bicep-deployment-script-portal-resource-output.png" alt-text="Screenshot of deployment script outputs.":::

Go back to the resource group, select the storage account, select **File shares**, select the file share with **azscripts** appended to the share name, you shall see two folders - **azscriptinput** and **azscriptoutput**. The output folder contains a _executionresult.json_ and the script output file. You can see the script execution error message in _executionresult.json_. The output file is created only when the script is executed successfully. The input folder contains a system script file and the user deployment script files. You can replace the user deployment script file with a revised one, and rerun the deployment script from the Azure container instance.

:::image type="content" source="./media/deployment-script-bicep/bicep-deployment-script-portal-az-script-output.png" alt-text="Screenshot of deployment script azscriptoutput.":::

### Azure CLI

Using Azure CLI, you can manage deployment scripts at subscription or resource group scope:

- [az deployment-scripts delete](/cli/azure/deployment-scripts#az-deployment-scripts-delete): Delete a deployment script.
- [az deployment-scripts list](/cli/azure/deployment-scripts#az-deployment-scripts-list): List all deployment scripts.
- [az deployment-scripts show](/cli/azure/deployment-scripts#az-deployment-scripts-show): Retrieve a deployment script.
- [az deployment-scripts show-log](/cli/azure/deployment-scripts#az-deployment-scripts-show-log): Show deployment script logs.

The list command output is similar to:

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
  "id": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/dsDemo/providers/Microsoft.Resources/deploymentScripts/inlineCLI",
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
    "containerInstanceId": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/dsDemo/providers/Microsoft.ContainerInstance/containerGroups/jgczqtxom5oreazscripts",
    "endTime": "2023-12-11T20:20:12.149468+00:00",
    "error": null,
    "expirationTime": "2023-12-11T21:20:12.149468+00:00",
    "startTime": "2023-12-11T20:18:26.674492+00:00",
    "storageAccountId": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/dsDemo/providers/Microsoft.Storage/storageAccounts/jgczqtxom5oreazscripts"
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

Using Azure PowerShell, you can manage deployment scripts at subscription or resource group scope:

- [Get-AzDeploymentScript](/powershell/module/az.resources/get-azdeploymentscript): Gets or lists deployment scripts.
- [Get-AzDeploymentScriptLog](/powershell/module/az.resources/get-azdeploymentscriptlog): Gets the log of a deployment script execution.
- [Remove-AzDeploymentScript](/powershell/module/az.resources/remove-azdeploymentscript): Removes a deployment script and its associated resources.
- [Save-AzDeploymentScriptLog](/powershell/module/az.resources/save-azdeploymentscriptlog): Saves the log of a deployment script execution to disk.

The `Get-AzDeploymentScript` output is similar to:

```output
Name                : inlinePS
Id                  : /subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/dsDemo/providers/Microsoft.Resources/deploymentScripts/inlinePS
ResourceGroupName   : dsDemo
Location            : centralus
SubscriptionId      : 01234567-89AB-CDEF-0123-456789ABCDEF
ProvisioningState   : Succeeded
Identity            :
ScriptKind          : AzurePowerShell
AzPowerShellVersion : 10.0
StartTime           : 12/11/2023 9:45:50 PM
EndTime             : 12/11/2023 9:46:59 PM
ExpirationDate      : 12/11/2023 10:46:59 PM
CleanupPreference   : OnExpiration
StorageAccountId    : /subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/dsDemo/providers/Microsoft.Storage/storageAccounts/ee5o4rmoo6ilmazscripts
ContainerInstanceId : /subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/dsDemo/providers/Microsoft.ContainerInstance/containerGroups/ee5o4rmoo6ilmazscripts
Outputs             :
                      Key                 Value
                      ==================  ==================
                      text                Hello John Dole.

RetentionInterval   : PT1H
Timeout             : P1D
```

### REST API

You can get the deployment script resource deployment information at the resource group level and the subscription level by using REST API:

```rest
/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.resources/deploymentScripts/<DeploymentScriptResourceName>?api-version=2020-10-01
```

```rest
/subscriptions/<SubscriptionID>/providers/microsoft.resources/deploymentScripts?api-version=2020-10-01
```

The following example uses [ARMClient](https://github.com/projectkudu/ARMClient). ARMClient is not a supported Microsoft tool.

```azurepowershell
armclient login
armclient get /subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourcegroups/myrg/providers/microsoft.resources/deploymentScripts/myDeployementScript?api-version=2020-10-01
```

The output is similar to:

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
      "containerInstanceId": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/dsDemo/providers/Microsoft.ContainerInstance/containerGroups/jgczqtxom5oreazscripts",
      "endTime": "2023-12-11T20:20:12.149468+00:00",
      "error": null,
      "expirationTime": "2023-12-11T21:20:12.149468+00:00",
      "startTime": "2023-12-11T20:18:26.674492+00:00",
      "storageAccountId": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/dsDemo/providers/Microsoft.Storage/storageAccounts/jgczqtxom5oreazscripts"
    },
    "outputs": {
      "text": "Hello John Dole"
    },
    "cleanupPreference": "OnSuccess"
  },
  "id": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/dsDemo/providers/Microsoft.Resources/deploymentScripts/inlineCLI",
  "type": "Microsoft.Resources/deploymentScripts",
  "name": "inlineCLI",
}

```

The following REST API returns the log:

```rest
/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.resources/deploymentScripts/<DeploymentScriptResourceName>/logs?api-version=2020-10-01
```

It only works before the deployment script resources are deleted.

---

## Deployment script error codes

The following table lists the deployment script error codes:

| Error code | Description |
|------------|-------------|
| DeploymentScriptInvalidOperation | The deployment script resource definition in the Bicep file contains invalid property names. |
| DeploymentScriptResourceConflict | Can't delete a deployment script resource that is in nonterminal state and the execution hasn't exceeded 1 hour. Or can't rerun the same deployment script with the same resource identifier (same subscription, resource group name, and resource name) but different script body content at the same time. |
| DeploymentScriptOperationFailed | The deployment script operation failed internally. Contact Microsoft support. |
| DeploymentScriptStorageAccountAccessKeyNotSpecified | The access key hasn't been specified for the existing storage account.|
| DeploymentScriptContainerGroupContainsInvalidContainers | A container group created by the deployment script service got externally modified, and invalid containers got added. |
| DeploymentScriptContainerGroupInNonterminalState | Two or more deployment script resources use the same Azure container instance name in the same resource group, and one of them hasn't finished its execution yet. |
| DeploymentScriptStorageAccountInvalidKind | The existing storage account of the BlobBlobStorage or BlobStorage type doesn't support file shares, and can't be used. |
| DeploymentScriptStorageAccountInvalidKindAndSku | The existing storage account doesn't support file shares. For a list of supported storage account kinds, see [Use existing storage account](./deployment-script-develop.md#use-existing-storage-account). |
| DeploymentScriptStorageAccountNotFound | The storage account doesn't exist or has been deleted by an external process or tool. |
| DeploymentScriptStorageAccountWithServiceEndpointEnabled | The storage account specified has a service endpoint. A storage account with a service endpoint isn't supported. |
| DeploymentScriptStorageAccountInvalidAccessKey | Invalid access key specified for the existing storage account. |
| DeploymentScriptStorageAccountInvalidAccessKeyFormat | Invalid storage account key format. See [Manage storage account access keys](../../storage/common/storage-account-keys-manage.md). |
| DeploymentScriptExceededMaxAllowedTime | Deployment script execution time exceeded the timeout value specified in the deployment script resource definition. |
| DeploymentScriptInvalidOutputs | The deployment script output isn't a valid JSON object. |
| DeploymentScriptContainerInstancesServiceLoginFailure | The user-assigned managed identity wasn't able to sign in after 10 attempts with 1-minute interval. |
| DeploymentScriptContainerGroupNotFound | A Container group created by deployment script service got deleted by an external tool or process. |
| DeploymentScriptDownloadFailure | Failed to download a supporting script. See [Use supporting script](./deployment-script-develop.md#inline-vs-external-file).|
| DeploymentScriptError | The user script threw an error. |
| DeploymentScriptBootstrapScriptExecutionFailed | The bootstrap script threw an error. Bootstrap script is the system script that orchestrates the deployment script execution. |
| DeploymentScriptExecutionFailed | Unknown error during the deployment script execution. |
| DeploymentScriptContainerInstancesServiceUnavailable | When creating the Azure container instance (ACI), ACI threw a service unavailable error. |
| DeploymentScriptContainerGroupInNonterminalState | When creating the Azure container instance (ACI), another deployment script is using the same ACI name in the same scope (same subscription, resource group name, and resource name). |
| DeploymentScriptContainerGroupNameInvalid | The Azure container instance name (ACI) specified doesn't meet the ACI requirements. See [Troubleshoot common issues in Azure Container Instances](../../container-instances/container-instances-troubleshooting.md#issues-during-container-group-deployment).|

## Access private virtual network

You can run deployment scripts in private networks with some additional configurations. For more information, see [Access private virtual network](./deployment-script-vnet.md).

## Next steps

In this article, you learned how to use deployment scripts. To learn more, see:

- [Learn module - Extend ARM templates by using deployment scripts](/training/modules/extend-resource-manager-template-deployment-scripts)
- [Develop deployment script resources](./deployment-script-develop.md)
- [Access private virtual network](./deployment-script-vnet.md)
- [Create script development environments](./deployment-script-bicep-configure-dev.md)
