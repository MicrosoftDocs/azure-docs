---
title: Set up the Bring your own storage (BYOS) Speech resource
titleSuffix: Azure AI services
description: Learn how to set up Bring your own storage (BYOS) Speech resource.
#services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 03/28/2023
ms.author: alexeyo 
---

# Set up the Bring your own storage (BYOS) Speech resource

Bring your own storage (BYOS) is an Azure AI technology for customers, who have high requirements for data security and privacy. The core of the technology is the ability to associate an Azure Storage account, that the user owns and fully controls with the Speech resource. The Speech resource then uses this storage account for storing different artifacts related to the user data processing, instead of storing the same artifacts within the Speech service premises as it is done in the regular case. This approach allows using all set of security features of Azure Storage account, including encrypting the data with the Customer-managed keys, using Private endpoints to access the data, etc.

In BYOS scenarios, all traffic between the Speech resource and the Storage account is maintained using [Azure global network](https://azure.microsoft.com/explore/global-infrastructure/global-network), in other words all communication is performed using private network, completely bypassing public internet. Speech resource in BYOS scenario is using [Azure Trusted services](../../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services) mechanism to access the Storage account, relying on [System-assigned managed identities](../../active-directory/managed-identities-azure-resources/overview.md) as a method of authentication, and [Role-based access control (RBAC)](../../role-based-access-control/overview.md) as a method of authorization.

There's one exception: if you use Text to speech, and your Speech resource and the associated Storage account are located in different Azure regions, then public internet is used for the operations, involving [User delegation SAS](../../storage/common/storage-sas-overview.md#user-delegation-sas). See details in [this section](#configure-storage-account-security-settings-for-text-to-speech).

BYOS can be used with several Azure AI services. For Speech, it can be used in the following scenarios:

**Speech to text**

- [Batch transcription](batch-transcription.md)
- Real-time transcription with [audio and transcription result logging](logging-audio-transcription.md) enabled
- [Custom Speech](custom-speech-overview.md) (Custom models for Speech recognition)

**Text to speech**

- [Audio Content Creation](how-to-audio-content-creation.md)
- [Custom neural voice](custom-neural-voice.md) (Custom models for Speech synthesizing)


One Speech resource – Storage account combination can be used for all four scenarios simultaneously in all combinations.

This article describes how to create and maintain BYOS-enabled Speech resource and applicable to all mentioned scenarios. See the scenario-specific information in the [corresponding articles](#next-steps).

## BYOS-enabled Speech resource: Basic rules

Consider the following rules when planning BYOS-enabled Speech resource configuration:

- Speech resource can be BYOS-enabled only during creation. Existing Speech resource can't be converted to BYOS-enabled. BYOS-enabled Speech resource can't be converted to the “conventional” (non-BYOS) one.
- Storage account association with the Speech resource is declared during the Speech resource creation. It can't be changed later. That is, you can't change what Storage account is associated with the existing BYOS-enabled Speech resource. To use another Storage account, you have to create another BYOS-enabled Speech resource.
- When creating a BYOS-enabled Speech resource, you can use an existing Storage account or create one automatically during Speech resource provisioning (the latter is valid only when using Azure portal).
- One Storage account can be associated with many Speech resources. We recommend using one Storage account per one Speech resource.
- Storage account and the related BYOS-enabled Speech resource can be located in either the same or different Azure regions. We recommend using the same region to minimize latency. For the same reason, we don't recommend selecting too remote regions for multi-region configuration. (For example, we don’t recommend placing Storage account in East US and the associated Speech resource in West Europe).

## Create and configure BYOS-enabled Speech resource

This section describes how to create a BYOS enabled Speech resource.

### Request access to BYOS for your Azure subscriptions

You need to request access to BYOS functionality for each of the Azure subscriptions you plan to use. To request access, fill and submit [Cognitive Services & Applied AI Customer Managed Keys and Bring Your Own Storage access request form](https://aka.ms/cogsvc-cmk). Wait for the request to be approved.

### Plan and prepare your Storage account

If you use Azure portal to create a BYOS-enabled Speech resource, an associated Storage account can be created automatically. For all other provisioning methods (Azure CLI, PowerShell, REST API Request) you need to use existing Storage account.

If you want to use existing Storage account and don't intend to use Azure portal method for BYOS-enabled Speech resource provisioning, note the following regarding this Storage account:

- You need the full Azure resource ID of the Storage account. To obtain it navigate to the Storage account in Azure portal, then select *Endpoints* menu from *Settings* group. Copy and store the value of *Storage account resource ID* field.
- To fully configure BYOS, you need at least *Resource Owner* right for the selected Storage account.

> [!NOTE]
> Storage account *Resource Owner* right or higher is not required to use a BYOS-enabled Speech resource. However it is required during the one-time initial configuration of the Storage account for the usage in BYOS scenario. See details in [this section](#configure-byos-associated-storage-account).

### Create BYOS-enabled Speech resource

Make sure your Azure subscription is enabled for using BYOS before attempting to create the Speech resource. See [this section](#request-access-to-byos-for-your-azure-subscriptions).

There are two ways of creating a BYOS-enabled Speech resource:

- With Azure portal.
- With Cognitive Services API (PowerShell, Azure CLI, REST request).

Azure portal option has tighter requirements:

-	Account used for the BYOS-enabled Speech resource provisioning should have a right of the *Subscription Owner*.
-	BYOS-associated Storage account should only be located in the same region as the Speech resource.

If any of these extra requirements don't fit your scenario, use Cognitive Services API option (PowerShell, Azure CLI, REST request).

To use any of the methods above you need an Azure account that is assigned a role allowing to create resources in your subscription, like *Subscription Contributor*.

# [Azure portal](#tab/portal)

> [!NOTE]
> If you use Azure portal to create a BYOS-enabled Speech resource, we recommend selecting the option of creating a new Storage account. 

To create a BYOS-enabled Speech resource with Azure portal, you need to access some portal preview features. Perform the following steps:

1. Navigate to *Create Speech* page using [this link](https://ms.portal.azure.com/?feature.enablecsumi=true&feature.enablecsstoragemenu=true&microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_byospreview#create/Microsoft.CognitiveServicesSpeechServices).
1. Note the *Storage account* section at the bottom of the page.
1. Select *Yes* for *Bring your own storage* option.
1. Configure the required Storage account settings and proceed with the Speech resource creation.

# [PowerShell](#tab/powershell)

To create a BYOS-enabled Speech resource with PowerShell, we use [New-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccount) command.

You can [install PowerShell locally](/powershell/azure/install-azure-powershell) or use [Azure Cloud Shell](../../cloud-shell/overview.md).

If you use local installation of PowerShell, connect to your Azure account using `Connect-AzAccount` command before trying the following script.

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

To create a BYOS-enabled Speech resource with Azure CLI, we use [az cognitiveservices account create](/cli/azure/cognitiveservices/account) command.

You can [install Azure CLI locally](/cli/azure/install-azure-cli) or use [Azure Cloud Shell](../../cloud-shell/overview.md).

> [!NOTE]
> The following script doesn't use variables because variable usage differs, depending on the platform where Azure CLI runs. See information on Azure CLI variable usage in [this article](/cli/azure/azure-cli-variables).

If you use local installation of Azure CLI, connect to your Azure account using `az login` command before trying the following script.

```azurecli
az account set --subscription "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"

az cognitiveservices account create -n "myBYOSSpeechResource" -g "myResourceGroup" --assign-identity --kind SpeechServices --sku S0 -l eastus --yes --storage '[{"resourceId": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>"}]'
```
> [!IMPORTANT]
> This script will work in Azure Cloud Shell Bash. If you want to use it in any other environment, pay special attention to the format of the `--storage` parameter value. See the following information.

Different command shells have different rules for interpreting quotation marks in command line parameter values. For example to run the same script from Windows Command Prompt, `--storage` part of the command should be formatted like this:
```dos
--storage "[{""resourceId"": ""/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>""}]"
```

General rule is that you need to pass this JSON string as a value of `--storage` parameter:
```json
[{"resourceId": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>"}]
```
# [REST](#tab/rest)

To create a BYOS-enabled Speech resource with a REST Request to Cognitive Services API, we use [Accounts - Create](/rest/api/cognitiveservices/accountmanagement/accounts/create) request.

You need to have a means of authentication. The example in this section uses [Microsoft Entra token](/azure/active-directory/develop/access-tokens).

This code snippet generates Microsoft Entra token using interactive browser sign-in. It requires [Azure Identity client library](/dotnet/api/overview/azure/identity-readme):
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
Here's the body of the request:
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

If you used Azure portal for creating a BYOS-enabled Speech resource, it's fully ready to use. If you used any other method, you need to perform the role assignment for the Speech resource managed identity within the scope of the associated Storage account. In all cases, you also need to review different Storage account settings related to data security. See [this section](#configure-byos-associated-storage-account).

### (Optional) Verify Speech resource BYOS configuration

You may always check, whether any given Speech resource is BYOS enabled, and what is the associated Storage account. You can do it either via Azure portal, or via Cognitive Services API.

# [Azure portal](#tab/portal)

To check BYOS configuration of a Speech resource with Azure portal, you need to access some portal preview features. Perform the following steps:

1. Navigate to *Create Speech* page using [this link](https://ms.portal.azure.com/?feature.enablecsumi=true&feature.enablecsstoragemenu=true&microsoft_azure_marketplace_ItemHideKey=microsoft_azure_cognitiveservices_byospreview#create/Microsoft.CognitiveServicesSpeechServices).
1.  Close *Create Speech* screen by pressing *X* in the right upper corner.
1.  If asked agree to discard unsaved changes.
1.  Navigate to the Speech resource you want to check.
1.  Select *Storage* menu in the *Resource Management* group.
1.  Check that:
    1. *Attached storage* field contains the Azure resource ID of the BYOS-associated Storage account.
    1. *Identity type* has *System Assigned* selected.

If *Storage* menu item is missing in the *Resource Management* group, the selected Speech resource isn't BYOS-enabled.

# [PowerShell](#tab/powershell)

Use the [Get-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccount) command:

```azurepowershell
Get-AzCognitiveServicesAccount -ResourceGroupName "myResourceGroup" -name "myBYOSSpeechResource"
```
In the command output, look for `userOwnedStorage` parameter group. If the Speech resource is BYOS-enabled, the group has Azure resource ID of the associated Storage account. If the `userOwnedStorage` group is empty or missing, the selected Speech resource isn't BYOS-enabled.

# [Azure CLI](#tab/azure-cli)

Use the [az cognitiveservices account show](/cli/azure/cognitiveservices/account) command: 
```bash
az cognitiveservices account show -g "myResourceGroup" -n "myBYOSSpeechResource"
```

In the command output, look for `userOwnedStorage` parameter group. If the Speech resource is BYOS-enabled, the group has Azure resource ID of the associated Storage account. If the `userOwnedStorage` group is empty or missing, the selected Speech resource isn't BYOS-enabled.

# [REST](#tab/rest)

Use the [Accounts - Get](/rest/api/cognitiveservices/accountmanagement/accounts/get) request. In the request output, look for `userOwnedStorage` parameter group. If the Speech resource is BYOS-enabled, the group has Azure resource ID of the associated Storage account. If the `userOwnedStorage` group is empty or missing, the selected Speech resource isn't BYOS-enabled.

***

## Configure BYOS-associated Storage account

To achieve high security and privacy of your data you need to properly configure the settings of the BYOS-associated Storage account. In case you didn't use Azure portal to create your BYOS-enabled Speech resource, you also need to perform a mandatory step of role assignment.

### Assign resource access role

This step is **mandatory** if you didn't use Azure portal to create your BYOS-enabled Speech resource.

BYOS uses the Blob storage of a Storage account. Because of this, BYOS-enabled Speech resource managed identity needs *Storage Blob Data Contributor* role assignment within the scope of BYOS-associated Storage account.

If you used Azure portal to create your BYOS-enabled Speech resource, you may skip the rest of this subsection. Your role assignment is already done. Otherwise, follow these steps.

> [!IMPORTANT]
> You need to be assigned the *Owner* role of the Storage account or higher scope (like Subscription) to perform the operation in the next steps. This is because only the *Owner* role can assign roles to others. See details [here](../../role-based-access-control/built-in-roles.md).

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. Select *Access Control (IAM)* menu in the left pane.
1. Select *Add role assignment* in the *Grant access to this resource* tile.
1. Select *Storage Blob Data Contributor* under *Role* and then select *Next*.
1. Select *Managed identity* under *Members* > *Assign access to*.
1. Assign the managed identity of your Speech resource and then select *Review + assign*.
1. After confirming the settings, select *Review + assign*.

### Configure Storage account security settings for Speech to text

This section describes how to set up Storage account security settings, if you intend to use BYOS-associated Storage account only for Speech to text scenarios. In case you use the BYOS-associated Storage account for Text to speech or a combination of both Speech to text and Text to speech, use [this section](#configure-storage-account-security-settings-for-text-to-speech).

For Speech to text BYOS is using the [trusted Azure services security mechanism](../../storage/common/storage-network-security.md#trusted-access-based-on-a-managed-identity) to communicate with Storage account. The mechanism allows setting very restricted Storage account data access rules.

If you perform all actions in the section, your Storage account will be in the following configuration:
- Access to all external network traffic is prohibited.
- Access to Storage account using Storage account key is prohibited.
- Access to Storage account blob storage using [shared access signatures (SAS)](../../storage/common/storage-sas-overview.md) is prohibited. (Except for [User delegation SAS](../../storage/common/shared-key-authorization-prevent.md#understand-how-disallowing-shared-key-affects-sas-tokens))
- Access to the BYOS-enabled Speech resource is allowed using the resource [system assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

So in effect your Storage account becomes completely "locked" and can only be accessed by your Speech resource, which will be able to:
- Write artifacts of your Speech data processing (see details in the [correspondent articles](#next-steps)),
- Read the files that were already present by the time the new configuration was applied. For example, source audio files for the Batch transcription or Dataset files for Custom model training and testing.

You should consider this configuration as a model as far as the security of your data is concerned and customize it according to your needs.

For example, you may allow traffic from selected public IP addresses and Azure Virtual networks. You may also set up access to your Storage account using [private endpoints](../../storage/common/storage-private-endpoints.md) (see as well [this tutorial](../../private-link/tutorial-private-endpoint-storage-portal.md)), re-enable access using Storage account key, allow access to other Azure trusted services, etc.

> [!NOTE] 
> Using [private endpoints for Speech](speech-services-private-link.md) isn't required to secure the Storage account. Private endpoints for Speech secure the channels for Speech API requests, and can be used as an extra component in your solution.

**Restrict access to the Storage account**

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. In the *Settings* group in the left pane, select *Configuration*.
1. Select *Disabled* for *Allow Blob public access*. 
1. Select *Disabled* for *Allow storage account key access*
1. Select *Save*.

For more information, see [Prevent anonymous public read access to containers and blobs](../../storage/blobs/anonymous-read-access-prevent.md) and [Prevent Shared Key authorization for an Azure Storage account](../../storage/common/shared-key-authorization-prevent.md).

**Configure Azure Storage firewall**

Having restricted access to the Storage account, you need to grant networking access to your Speech resource managed identity. Follow these steps to add access for the Speech resource.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. In the *Security + networking* group in the left pane, select *Networking*.
1. In the *Firewalls and virtual networks* tab, select *Enabled from selected virtual networks and IP addresses*.
1. Deselect all check boxes.
1. Make sure *Microsoft network routing* is selected.
1. Under the *Resource instances* section, select *Microsoft.CognitiveServices/accounts* as the resource type and select your Speech resource as the instance name. 
1. Select *Save*.

    > [!NOTE]
    > It may take up to 5 minutes for the network changes to propagate.

### Configure Storage account security settings for Text to Speech

This section describes how to set up Storage account security settings, if you intend to use BYOS-associated Storage account for Text to speech or a combination of both Speech to text and Text to speech. In case you use the BYOS-associated Storage account for Speech to text only, use [this section](#configure-storage-account-security-settings-for-speech-to-text).

> [!NOTE]
> Text to speech requires more relaxed settings of Storage account firewall, compared to Speech to text. If you use both Speech to text and Text to speech, and need maximally restricted Storage account security settings to protect your data, you may consider using different Storage accounts and the corresponding Speech resources for Speech to Text and Text to speech tasks.

If you perform all actions in the section, your Storage account will be in the following configuration:
- External network traffic is allowed.
- Access to Storage account using Storage account key is prohibited.
- Access to Storage account blob storage using [shared access signatures (SAS)](../../storage/common/storage-sas-overview.md) is prohibited. (Except for [User delegation SAS](../../storage/common/shared-key-authorization-prevent.md#understand-how-disallowing-shared-key-affects-sas-tokens))
- Access to the BYOS-enabled Speech resource is allowed using the resource [system assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) and [User delegation SAS](../../storage/common/storage-sas-overview.md#user-delegation-sas).

These are the most restricted security settings possible for Text to speech scenario. You may further customize them according to your needs.

**Restrict access to the Storage account**

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. In the *Settings* group in the left pane, select *Configuration*.
1. Select *Disabled* for *Allow Blob public access*. 
1. Select *Disabled* for *Allow storage account key access*
1. Select *Save*.

For more information, see [Prevent anonymous public read access to containers and blobs](../../storage/blobs/anonymous-read-access-prevent.md) and [Prevent Shared Key authorization for an Azure Storage account](../../storage/common/shared-key-authorization-prevent.md).

**Configure Azure Storage firewall**

Custom neural voice uses [User delegation SAS](../../storage/common/storage-sas-overview.md#user-delegation-sas) to read the data for custom neural voice model training. It requires allowing external network traffic access to the Storage account.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. In the *Security + networking* group in the left pane, select *Networking*.
1. In the *Firewalls and virtual networks* tab, select *Enabled from all networks*.
1. Select *Save*.

## Configure BYOS-associated Storage account for use with Speech Studio

Many [Speech Studio](https://speech.microsoft.com/) operations like dataset upload, or custom model training and testing don't require any special configuration in the case of BYOS-enabled Speech resource.

However, if you need to read data stored withing BYOS-associated Storage account through Speech Studio Web interface, you need to configure additional settings of your BYOS-associated Storage account. For example, it's required to view the contents of a dataset.

### Configure Cross-Origin Resource Sharing (CORS)

Speech Studio needs permission to make requests to the Blob storage of the BYOS-associated Storage account. To grant such permission, you use [Cross-Origin Resource Sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services). Follow these steps.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. In the *Settings* group in the left pane, select *Resource sharing (CORS)*.
1. Ensure, that *Blob storage* tab is selected. 
1. Configure the following record:
    - *Allowed origins*: `https://speech.microsoft.com`
    - *Allowed methods*: `GET`, `OPTIONS`
    - *Allowed headers*: `*`
    - *Exposed headers*: `*`
    - *Max age*: `1000`
1. Select *Save*.

> [!WARNING]
> *Allowed origins* field should contain URL **without** trailing slash. That is it should be `https://speech.microsoft.com`, and not `https://speech.microsoft.com/`. Adding trailing slash will result in Speech Studio not showing the details of datasets and model tests.

### Configure Azure Storage firewall

You need to allow access for the machine, where you run the browser using Speech Studio. If your Storage account firewall settings allow public access from all networks, you may skip this subsection. Otherwise, follow these steps.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. In the *Security + networking* group in the left pane, select *Networking*.
1. In the *Firewall* section, enter either IP address of the machine where you run the web browser or IP subnet, to which the IP address of the machine belongs.
1. Select *Save*.

## Next steps

- [Use the Bring your own storage (BYOS) Speech resource for Speech to text](bring-your-own-storage-speech-resource-speech-to-text.md)
