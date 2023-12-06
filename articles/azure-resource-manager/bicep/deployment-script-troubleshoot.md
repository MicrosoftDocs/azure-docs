---
title: Use deployment scripts in Bicep | Microsoft Docs
description: use deployment scripts in Bicep.
ms.custom: devx-track-bicep
ms.topic: conceptual
ms.date: 11/02/2023
---

# Use deployment scripts in Bicep


*** jgao - for the inline script sample, checking write-output, check output, check deployment status and so on.

## Monitor and troubleshoot deployment scripts

The script service creates two supporting resources, a [storage account](../../storage/common/storage-account-overview.md) and a [container instance](../../container-instances/container-instances-overview.md), for script execution (unless you specify an existing storage account and/or an existing container instance). If these supporting resources are automatically created by the script service, both resources have the `azscripts` suffix in the resource names. The other way to identify the the supporting resources is by using tags. For more information, see [tags](./deployment-script-develop.md#syntax).

![Resource Manager template deployment script resource names](./media/deployment-script-bicep/resource-manager-template-deployment-script-resources.png)

The user script, the execution results, and the stdout file are stored in the files shares of the storage account. There's a folder called `azscripts`. In the folder, there are two more folders for the input and the output files: `azscriptinput` and `azscriptoutput`.

The output folder contains a _executionresult.json_ and the script output file. You can see the script execution error message in _executionresult.json_. The output file is created only when the script is executed successfully. The input folder contains a system PowerShell script file and the user deployment script files. You can replace the user deployment script file with a revised one, and rerun the deployment script from the Azure container instance.

### Use the Azure portal

After you deploy a deployment script resource, the resource is listed under the resource group in the Azure portal. The following screenshot shows the **Overview** page of a deployment script resource:

![Resource Manager template deployment script portal overview](./media/deployment-script-bicep/resource-manager-deployment-script-portal.png)

The overview page displays some important information of the resource, such as **Provisioning state**, **Storage account**, **Container instance**, and **Logs**.

From the left menu, you can view the deployment script content, the arguments passed to the script, and the output. You can also export the JSON template for the deployment script including the deployment script.

### Use PowerShell

Using Azure PowerShell, you can manage deployment scripts at subscription or resource group scope:

- [Get-AzDeploymentScript](/powershell/module/az.resources/get-azdeploymentscript): Gets or lists deployment scripts.
- [Get-AzDeploymentScriptLog](/powershell/module/az.resources/get-azdeploymentscriptlog): Gets the log of a deployment script execution.
- [Remove-AzDeploymentScript](/powershell/module/az.resources/remove-azdeploymentscript): Removes a deployment script and its associated resources.
- [Save-AzDeploymentScriptLog](/powershell/module/az.resources/save-azdeploymentscriptlog): Saves the log of a deployment script execution to disk.

The `Get-AzDeploymentScript` output is similar to:

```output
Name                : runPowerShellInlineWithOutput
Id                  : /subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myds0618rg/providers/Microsoft.Resources/deploymentScripts/runPowerShellInlineWithOutput
ResourceGroupName   : myds0618rg
Location            : centralus
SubscriptionId      : 01234567-89AB-CDEF-0123-456789ABCDEF
ProvisioningState   : Succeeded
Identity            : /subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/mydentity1008rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myuami
ScriptKind          : AzurePowerShell
AzPowerShellVersion : 10.0
StartTime           : 5/11/2023 7:46:45 PM
EndTime             : 5/11/2023 7:49:45 PM
ExpirationDate      : 5/12/2023 7:49:45 PM
CleanupPreference   : OnSuccess
StorageAccountId    : /subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myds0618rg/providers/Microsoft.Storage/storageAccounts/ftnlvo6rlrvo2azscripts
ContainerInstanceId : /subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myds0618rg/providers/Microsoft.ContainerInstance/containerGroups/ftnlvo6rlrvo2azscripts
Outputs             :
                      Key                 Value
                      ==================  ==================
                      text                Hello John Dole

RetentionInterval   : P1D
Timeout             : PT1H
```

### Use Azure CLI

Using Azure CLI, you can manage deployment scripts at subscription or resource group scope:

- [az deployment-scripts delete](/cli/azure/deployment-scripts#az-deployment-scripts-delete): Delete a deployment script.
- [az deployment-scripts list](/cli/azure/deployment-scripts#az-deployment-scripts-list): List all deployment scripts.
- [az deployment-scripts show](/cli/azure/deployment-scripts#az-deployment-scripts-show): Retrieve a deployment script.
- [az deployment-scripts show-log](/cli/azure/deployment-scripts#az-deployment-scripts-show-log): Show deployment script logs.

The list command output is similar to:

```json
[
  {
    "arguments": "'foo' 'bar'",
    "azCliVersion": "2.52.0",
    "cleanupPreference": "OnExpiration",
    "containerSettings": {
      "containerGroupName": null
    },
    "environmentVariables": null,
    "forceUpdateTag": "20231101T163748Z",
    "id": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myds0624rg/providers/Microsoft.Resources/deploymentScripts/runBashWithOutputs",
    "identity": {
      "tenantId": "01234567-89AB-CDEF-0123-456789ABCDEF",
      "type": "userAssigned",
      "userAssignedIdentities": {
        "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourcegroups/myidentity/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myuami": {
          "clientId": "01234567-89AB-CDEF-0123-456789ABCDEF",
          "principalId": "01234567-89AB-CDEF-0123-456789ABCDEF"
        }
      }
    },
    "kind": "AzureCLI",
    "location": "centralus",
    "name": "runBashWithOutputs",
    "outputs": {
      "Result": [
        {
          "id": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/mytest/providers/Microsoft.KeyVault/vaults/mykv1027",
          "resourceGroup": "mytest"
        }
      ]
    },
    "primaryScriptUri": null,
    "provisioningState": "Succeeded",
    "resourceGroup": "mytest",
    "retentionInterval": "1 day, 0:00:00",
    "scriptContent": "result=$(az keyvault list); echo \"arg1 is: $1\"; echo $result | jq -c '{Result: map({id: .id})}' > $AZ_SCRIPTS_OUTPUT_PATH",
    "status": {
      "containerInstanceId": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/mytest/providers/Microsoft.ContainerInstance/containerGroups/eg6n7wvuyxn7iazscripts",
      "endTime": "2023-11-01T16:39:12.080950+00:00",
      "error": null,
      "expirationTime": "2023-11-02T16:39:12.080950+00:00",
      "startTime": "2023-11-01T16:37:53.139700+00:00",
      "storageAccountId": null
    },
    "storageAccountSettings": {
      "storageAccountKey": null,
      "storageAccountName": "dsfruro267qwb4i"
    },
    "supportingScriptUris": null,
    "systemData": {
      "createdAt": "2023-10-31T19:06:57.060909+00:00",
      "createdBy": "someone@contoso.com",
      "createdByType": "User",
      "lastModifiedAt": "2023-11-01T16:37:51.859570+00:00",
      "lastModifiedBy": "someone@contoso.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "timeout": "0:30:00",
    "type": "Microsoft.Resources/deploymentScripts"
  }
]
```

### Use REST API

You can get the deployment script resource deployment information at the resource group level and the subscription level by using REST API:

```rest
/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.resources/deploymentScripts/<DeploymentScriptResourceName>?api-version=2020-10-01
```

```rest
/subscriptions/<SubscriptionID>/providers/microsoft.resources/deploymentScripts?api-version=2020-10-01
```

The following example uses [ARMClient](https://github.com/projectkudu/ARMClient):

```azurepowershell
armclient login
armclient get /subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourcegroups/myrg/providers/microsoft.resources/deploymentScripts/myDeployementScript?api-version=2020-10-01
```

The output is similar to:

```json
{
  "kind": "AzurePowerShell",
  "identity": {
    "type": "userAssigned",
    "tenantId": "01234567-89AB-CDEF-0123-456789ABCDEF",
    "userAssignedIdentities": {
      "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myidentity1008rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myuami": {
        "principalId": "01234567-89AB-CDEF-0123-456789ABCDEF",
        "clientId": "01234567-89AB-CDEF-0123-456789ABCDEF"
      }
    }
  },
  "location": "centralus",
  "systemData": {
    "createdBy": "someone@contoso.com",
    "createdByType": "User",
    "createdAt": "2023-05-11T02:59:04.7501955Z",
    "lastModifiedBy": "someone@contoso.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-05-11T02:59:04.7501955Z"
  },
  "properties": {
    "provisioningState": "Succeeded",
    "forceUpdateTag": "20220625T025902Z",
    "azPowerShellVersion": "10.0",
    "scriptContent": "\r\n          param([string] $name)\r\n          $output = \"Hello {0}\" -f $name\r\n          Write-Output $output\r\n          $DeploymentScriptOutputs = @{}\r\n          $DeploymentScriptOutputs['text'] = $output\r\n        ",
    "arguments": "-name \\\"John Dole\\\"",
    "retentionInterval": "P1D",
    "timeout": "PT1H",
    "containerSettings": {},
    "status": {
      "containerInstanceId": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myds0624rg/providers/Microsoft.ContainerInstance/containerGroups/64lxews2qfa5uazscripts",
      "storageAccountId": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myds0624rg/providers/Microsoft.Storage/storageAccounts/64lxews2qfa5uazscripts",
      "startTime": "2023-05-11T02:59:07.5951401Z",
      "endTime": "2023-05-11T03:00:16.7969234Z",
      "expirationTime": "2023-05-12T03:00:16.7969234Z"
    },
    "outputs": {
      "text": "Hello John Dole"
    },
    "cleanupPreference": "OnSuccess"
  },
  "id": "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myds0624rg/providers/Microsoft.Resources/deploymentScripts/runPowerShellInlineWithOutput",
  "type": "Microsoft.Resources/deploymentScripts",
  "name": "runPowerShellInlineWithOutput"
}

```

The following REST API returns the log:

```rest
/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.resources/deploymentScripts/<DeploymentScriptResourceName>/logs?api-version=2020-10-01
```

It only works before the deployment script resources are deleted.

To see the deploymentScripts resource in the portal, select **Show hidden types**:

![Resource Manager template deployment script, show hidden types, portal](./media/deployment-script-bicep/resource-manager-deployment-script-portal-show-hidden-types.png)



## Deployment script error codes

| Error code | Description |
|------------|-------------|
| DeploymentScriptInvalidOperation | The deployment script resource definition in the Bicep file contains invalid property names. |
| DeploymentScriptResourceConflict | Can't delete a deployment script resource that is in nonterminal state and the execution hasn't exceeded 1 hour. Or can't rerun the same deployment script with the same resource identifier (same subscription, resource group name, and resource name) but different script body content at the same time. |
| DeploymentScriptOperationFailed | The deployment script operation failed internally. Contact Microsoft support. |
| DeploymentScriptStorageAccountAccessKeyNotSpecified | The access key hasn't been specified for the existing storage account.|
| DeploymentScriptContainerGroupContainsInvalidContainers | A container group created by the deployment script service got externally modified, and invalid containers got added. |
| DeploymentScriptContainerGroupInNonterminalState | Two or more deployment script resources use the same Azure container instance name in the same resource group, and one of them hasn't finished its execution yet. |
| DeploymentScriptStorageAccountInvalidKind | The existing storage account of the BlobBlobStorage or BlobStorage type doesn't support file shares, and can't be used. |
| DeploymentScriptStorageAccountInvalidKindAndSku | The existing storage account doesn't support file shares. For a list of supported storage account kinds, see [Use existing storage account](#use-existing-storage-account). |
| DeploymentScriptStorageAccountNotFound | The storage account doesn't exist or has been deleted by an external process or tool. |
| DeploymentScriptStorageAccountWithServiceEndpointEnabled | The storage account specified has a service endpoint. A storage account with a service endpoint isn't supported. |
| DeploymentScriptStorageAccountInvalidAccessKey | Invalid access key specified for the existing storage account. |
| DeploymentScriptStorageAccountInvalidAccessKeyFormat | Invalid storage account key format. See [Manage storage account access keys](../../storage/common/storage-account-keys-manage.md). |
| DeploymentScriptExceededMaxAllowedTime | Deployment script execution time exceeded the timeout value specified in the deployment script resource definition. |
| DeploymentScriptInvalidOutputs | The deployment script output isn't a valid JSON object. |
| DeploymentScriptContainerInstancesServiceLoginFailure | The user-assigned managed identity wasn't able to sign in after 10 attempts with 1-minute interval. |
| DeploymentScriptContainerGroupNotFound | A Container group created by deployment script service got deleted by an external tool or process. |
| DeploymentScriptDownloadFailure | Failed to download a supporting script. See [Use supporting script](#use-supporting-scripts).|
| DeploymentScriptError | The user script threw an error. |
| DeploymentScriptBootstrapScriptExecutionFailed | The bootstrap script threw an error. Bootstrap script is the system script that orchestrates the deployment script execution. |
| DeploymentScriptExecutionFailed | Unknown error during the deployment script execution. |
| DeploymentScriptContainerInstancesServiceUnavailable | When creating the Azure container instance (ACI), ACI threw a service unavailable error. |
| DeploymentScriptContainerGroupInNonterminalState | When creating the Azure container instance (ACI), another deployment script is using the same ACI name in the same scope (same subscription, resource group name, and resource name). |
| DeploymentScriptContainerGroupNameInvalid | The Azure container instance name (ACI) specified doesn't meet the ACI requirements. See [Troubleshoot common issues in Azure Container Instances](../../container-instances/container-instances-troubleshooting.md#issues-during-container-group-deployment).|



## Next steps

In this article, you learned how to use deployment scripts. To walk through a Learn module:

> [!div class="nextstepaction"]
> [Extend ARM templates by using deployment scripts](/training/modules/extend-resource-manager-template-deployment-scripts)
