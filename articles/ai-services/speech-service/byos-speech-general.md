---
title: How to use "Bring-your-own-service" (BYOS) Speech resource
titleSuffix: Azure Cognitive Services
description: Learn how to use "Bring-your-own-service" (BYOS) Speech resource.
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 03/28/2023
ms.author: alexeyo 
---

# How to use the Bring your own storage (BYOS) Speech resource

Bring your own storage (BYOS) is an Azure AI technology for customers, who have high requirements for data security and privacy. The core of the technology is the ability to associate an Azure Storage account that is owned and fully controlled by the user with the Speech resource, that will then use this storage account for storing different artifacts related to the user data processing instead of storing the same artifacts within the Speech service premises as it is done in the regular case. This allows using all set of security features of Azure Storage account, including encrypting the data with the Customer-managed keys, using Private endpoints to access the data, etc.

In BYOS scenario all traffic between the Speech resource and the Storage account is maintained using [Azure global network](https://azure.microsoft.com/explore/global-infrastructure/global-network), in other words all communication is performed using private network, completely bypassing public internet. Speech resource in BYOS scenario is using [Azure Trusted services](../../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services) mechanism to access the Storage account, relying on [System-assigned managed identities](../../active-directory/managed-identities-azure-resources/overview.md) as a method of authentication and [Role-based access control (RBAC)](../../role-based-access-control/overview.md) as a method of authorization.

BYOS can be used with several Cognitive Services. For Speech, it can be used in the following scenarios:

1. [Batch transcription](batch-transcription.md)
1. Real-time transcription with [audio and transcription result logging](logging-audio-transcription.md) enabled
1. [Custom Speech](custom-speech-overview.md) (Custom models for Speech recognition)
1. [Custom Neural Voice](custom-neural-voice.md) (Custom models for Speech synthesizing)

One Speech resource – Storage account combination can be used for all four scenarios simultaneously in all combinations.

This article describes how to create and maintain BYOS-enabled Speech resource and applicable to all mentioned scenarios. See the scenario-specific information in the [corresponding articles](#next-steps).

## BYOS-enabled Speech resource. Basic rules

Please bear in mind the following rules when planning BYOS-enabled Speech resource configuration:

1. Speech resource can be BYOS-enabled only during creation. Existing Speech resource cannot be converted to BYOS-enabled. BYOS-enabled Speech resource cannot be converted to the “conventional” (non-BYOS) one.
1. Storage account association with the Speech resource is declared during the Speech resource creation. It cannot be changed later. That is, you cannot change what Storage account is associated with the existing BYOS-enabled Speech resource. To use another Storage account you will have to create another BYOS-enabled Speech resource.
1. When creating a BYOS-enabled Speech resource you can use an existing Storage account or create one automatically during Speech resource provisioning (the latter is valid only when using Azure portal).
1. One Storage account can be associated with many Speech resources. We recommend to use one Storage account per one Speech resource.
1. Storage account and the related BYOS-enabled Speech resource can be located in either the same or different Azure regions. We recommend to use the same region to minimize latency. For the same reason we don't recommend selecting too remote regions for multi-region configuration. (For example, we don’t recommend placing Storage account in East US and the associated Speech resource in West Europe).

## Create and configure BYOS-enabled Speech resource

This section describes how to create a BYOS enabled Speech resource.

### Request access to BYOS for your Azure subscriptions

You need to request access to BYOS functionality for each of the Azure subscriptions you plan to use. To request access fill in and submit [Cognitive Services & Applied AI Customer Managed Keys and Bring Your Own Storage access request form](https://aka.ms/cogsvc-cmk). Wait for the request to be approved.

### Plan and prepare your Storage account

If you use Azure portal to create a BYOS-enabled Speech resource, an associated Storage account can be created automatically. For all other provisioning methods (Azure CLI, PowerShell, REST API Request) you need to use existing Storage account.

If you want to use existing Storage account and don't intend to use Azure portal method for BYOS-enabled Speech resource provisioning, please note the following regarding this Storage account:

- You will need the full Azure resource ID of the Storage account. To obtain it navigate to the Storage account in Azure portal, then select *Endpoints* menu from *Settings* group. Copy and store the value of *Storage account resource ID* field.
- To fully configure BYOS you will need at least *Resource Owner* right for the selected Storage account.

> [!NOTE]
> Storage account *Resource Owner* right or higher is not required to use a BYOS-enabled Speech resource. However it is required during the one time initial configuration of the Storage account for the usage in BYOS scenario. See details !!!

### Create BYOS-enabled Speech resource

Make sure your Azure subscription is enabled for using BYOS before attempting to create the Speech resource. See [this section](#request-access-to-byos-for-your-azure-subscriptions).

There are two ways of creating a BYOS-enabled Speech resource:

1. With Azure portal.
1. With Cognitive Services API (PowerShell, Azure CLI, REST request).

Azure portal option has tighter requirements:

1.	Account used for the BYOS-enabled Speech resource provisioning should have a right of the *Subscription Owner*.
1.	BYOS-associated Storage account should only be located in the same region as the Speech resource.

If any of these additional requirements don't fit your scenario, use Cognitive Services API option (PowerShell, Azure CLI, REST request).

To use any of the methods above you need an Azure account, that is assigned a role allowing to create resources in your subscription, like *Subscription Contributor*.

# [Azure portal](#tab/portal)

> [!NOTE]
> If you use Azure portal to create a BYOS-enabled Speech resource, we recommend to select the option of creating a new Storage account. 

To create a BYOS-enabled Speech resource with Azure portal, you will need to access some portal preview features. Perform the following steps:

1. Navigate to *Create Speech* page using [this link](https://ms.portal.azure.com/?feature.enablecsumi=true&feature.enablecsstoragemenu=true&feature.canmodifystamps=true&Microsoft_Azure_ProjectOxford=stage1&microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_byospreview#create/Microsoft.CognitiveServicesSpeechServices).
1. Note the *Storage account* section at the bottom of the page.
1. Select *Yes* for *Bring your own storage* option.
1. Configure the required Storage account settings and proceed with the Speech resource creation.

# [PowerShell](#tab/powershell)

To create a BYOS-enabled Speech resource with PowerShell we use [New-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccount) command.

You can [install PowerShell locally](/powershell/azure/install-azure-powershell) or use [Azure Cloud Shell](../../cloud-shell/overview.md).

If you use local installation of PowerShell connect to your Azure account using `Connect-AzAccount` command before trying the following script.

```azurepowershell
# Target subscription parameters
# REPLACE WITH YOUR CONFIGURATION VALUES
$azureSubscriptionId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
$azureResourceGroup = "myResourceGroup"
$azureSpeechResourceName = "myBYOSSpeechResource"
$azureStorageAccount = <Full Storage account Azure Resource ID in the format of "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>">
$azureLocation = "eastus"

# Select the right subscription
Set-AzContext -SubscriptionId $azureSubscriptionId 

# Create BYOS-enabled Speech resource
New-AzCognitiveServicesAccount -ResourceGroupName $azureResourceGroup  -name $azureSpeechResourceName -Type SpeechServices -SkuName S0 -Location $azureLocation -AssignIdentity -Storage $azureStorageAccount
```

# [Azure CLI](#tab/azure-cli)

To create a BYOS-enabled Speech resource with Azure CLI we use [az cognitiveservices account create](/cli/azure/cognitiveservices/account) command.

You can [install Azure CLI locally](/cli/azure/install-azure-cli) or use [Azure Cloud Shell](../../cloud-shell/overview.md).

> [!NOTE]
> The following script doesn't use variables because variable usage differs, depending on the platform where Azure CLI runs. See information on Azure CLI variable usage in [this article](/cli/azure/azure-cli-variables).

If you use local installation of Azure CLI connect to your Azure account using `az login` command before trying the following script.

```azurecli
az account set --subscription "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"

az cognitiveservices account create -n myBYOSSpeechResource -g myResourceGroup --assign-identity --kind SpeechServices --sku S0 -l eastus --yes --storage '[{"resourceId": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>"}]'
```
> [!IMPORTANT]
> This script will work in Azure Cloud Shell Bash. If you want to use it in any other environment, pay special attention to the format of the `--storage` parameter value. See the following information.

Different command shells have different rules for interpreting quotation marks in command line parameter values. For example to run the same script from Windows Command Prompt, `--storage` part of the command should be formatted like this:
```dos
--storage "[{""resourceId"": ""/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>""}]"
```

General rule is that you need to pass the following JSON string as a value of `--storage` parameter:
```json
[{"resourceId": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>"}]
```
# [REST](#tab/rest)

To create a BYOS-enabled Speech resource with a REST Request to Cognitive Servies API we use [Accounts - Create](/rest/api/cognitiveservices/accountmanagement/accounts/create) request.

You need to have a meaning of authentication. The following example uses [Azure Active Directory (AAD) token](/azure/active-directory/develop/access-tokens).

The following code snippet will generate AAD token using interactive browser login. it requires [Azure Identity client library](/dotnet/api/overview/azure/identity-readme):
```csharp
TokenRequestContext context = new Azure.Core.TokenRequestContext(new string[] { "https://management.azure.com/.default" });
InteractiveBrowserCredential browserCredential = new InteractiveBrowserCredential();
var aadToken = browserCredential.GetToken(context);
var token = aadToken.Token;
```
Now execute the REST request:
```bash
@ECHO OFF

curl -v -X PUT "https://management.azure.com/subscriptions/{AzureSubscriptionId}/resourceGroups/{myResourceGroup}/providers/Microsoft.CognitiveServices/accounts/{myBYOSSpeechResource}?api-version=2021-10-01"
-H "Content-Type: application/json"
-H "Authorization: Bearer {Value_of_token_variable}"

--data-ascii "{body}" 
```
The following will be the body of the request:
```json
{
  "location": "East US",
  "kind": "SpeechServices",
  "sku": {

  "name": "S0"
  },
  "properties": {
    "userOwnedStorage": [
    {
      "resourceId": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>"
    }
  ]
  },
  "identity": {
    "type": "SystemAssigned"
  }
}
```
***

### (Optional) Verify Speech resource BYOS configuration

You may always check, whether any given Speech resource is BYOS enabled, and what is the associated Storage account. You can do it either via Azure portal, or via Cognitive Services API.

# [Azure portal](#tab/portal)

To check BYOS configuration of a Speech resource with Azure portal, you will need to access some portal preview features. Perform the following steps:

1. Navigate to *Create Speech* page using [this link](https://ms.portal.azure.com/?feature.enablecsumi=true&feature.enablecsstoragemenu=true&feature.canmodifystamps=true&Microsoft_Azure_ProjectOxford=stage1&microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_byospreview#create/Microsoft.CognitiveServicesSpeechServices).
1.  Close *Create Speech* screen by pressing *X* in the right upper corner.
1.  If asked agree to discard unsaved changes.
1.  Navigate to the Speech resource you want to check.
1.  Select *Storage* menu in the *Resource Management* group.
1.  Check that:
    1. *Attached storage* field contains the Azure resource Id of the BYOS-associated Storage account.
    1. *Identity type* has *System Assigned* selected.

If *Storage* menu item is missing in the *Resource Management* group, the selected Speech resource is not BYOS-enabled.

# [PowerShell](#tab/powershell)

Use the [Get-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccount) command. In the command output, look for `userOwnedStorage` parameter group. If the Speech resource is BYOS-enabled, the group will have Azure resource Id of the associated Storage account. If the `userOwnedStorage` group is empty or missing, the selected Speech resource is not BYOS-enabled.

# [Azure CLI](#tab/azure-cli)

Use the [az cognitiveservices account show](/cli/azure/cognitiveservices/account) command. In the command output, look for `userOwnedStorage` parameter group. If the Speech resource is BYOS-enabled, the group will have Azure resource Id of the associated Storage account. If the `userOwnedStorage` group is empty or missing, the selected Speech resource is not BYOS-enabled.

# [REST](#tab/rest)

Use the [Accounts - Get](/rest/api/cognitiveservices/accountmanagement/accounts/get) request. In the request output, look for `userOwnedStorage` parameter group. If the Speech resource is BYOS-enabled, the group will have Azure resource Id of the associated Storage account. If the `userOwnedStorage` group is empty or missing, the selected Speech resource is not BYOS-enabled.

***

## Next steps

!!!