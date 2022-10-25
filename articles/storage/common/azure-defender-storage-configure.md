---
title: Configure Microsoft Defender for Storage
titleSuffix: Azure Storage
description: Configure Microsoft Defender for Storage to detect anomalies in account activity and be notified of potentially harmful attempts to access your account.
services: storage
author: bmansheim

ms.service: storage
ms.subservice: common
ms.topic: how-to
ms.date: 10/24/2022
ms.author: benmansheim
ms.reviewer: ozgun 
ms.custom: devx-track-azurepowershell
---

# Configure Microsoft Defender for Storage

> [!NOTE]
> A new per-storage account pricing plan is now available for Microsoft Defender for Cloud.
>
> In the legacy, per-transaction plan, the cost increases according to the number of analyzed transactions in the storage account. The new per-account plan fixes costs per storage account. Accounts with an exceptionally high transaction volume incur an overage charge.
> 
> For details about the pricing plans, see [Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).


**Microsoft Defender for Storage** is an Azure-native layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit your storage accounts. It uses advanced threat detection capabilities and [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684) data to provide contextual security alerts. Those alerts also include steps to mitigate the detected threats and prevent future attacks.

Microsoft Defender for Storage continuously analyzes the transactions of [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/), [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/), and [Azure Files](https://azure.microsoft.com/services/storage/files/) services. When potentially malicious activities are detected, security alerts are generated. These alerts are displayed in Microsoft Defender for Cloud, with the details of the suspicious activity, appropriate investigation steps, remediation actions, and security recommendations. 

Analyzed transactions of Azure Blob Storage include operation types such as `Get Blob`, `Put Blob`, `Get Container ACL`, `List Blobs`, and `Get Blob Properties`. Examples of analyzed Azure Files operation types include `Get File`, `Create File`, `List Files`, `Get File Properties`, and `Put Range`. 

**Defender for Storage doesn't access the Storage account data and has no impact on its performance.**

Learn more about the [benefits, features, and limitations of Defender for Storage](../../defender-for-cloud/defender-for-storage-introduction.md). You can also learn more about Defender for Storage in the [Defender for Storage episode](../../defender-for-cloud/episode-thirteen.md) of the Defender for Cloud in the Field video series.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|**Microsoft Defender for Storage** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/)|
|Protected storage types:|[Blob Storage](../blobs/storage-blobs-introduction.md)  (Standard/Premium StorageV2, Block Blobs) <br>[Azure Files](../files/storage-files-introduction.md) (over REST API and SMB)<br>[Azure Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md) (Standard/Premium accounts with hierarchical namespaces enabled)|
|Clouds:|:::image type="icon" source="../../defender-for-cloud/media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="../../defender-for-cloud/media/icons/yes-icon.png"::: Azure Government<br>:::image type="icon" source="../../defender-for-cloud/media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="../../defender-for-cloud/media/icons/no-icon.png"::: Connected AWS accounts|

## Set up Microsoft Defender for Storage for the per-account pricing plan

> [!NOTE]
> You can only enable the per-account pricing plan at the subscription level.

With the Defender for Storage per-account pricing plan, you can configure Microsoft Defender for Storage on your subscriptions in several ways. When the plan is enabled at the subscription level, Microsoft Defender for Storage is automatically enabled for all your existing and new storage accounts created under that subscription. 

### [Azure Portal](#tab/azure-portal)

To enable Microsoft Defender for Storage at the subscription level with the per-storage plan using the Azure Portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select the subscription that you want to enable Defender for Storage for.
1. To enable Defender for Storage either:

    - Select **Enable all Microsoft Defender plans** to enable Microsoft Defender for Cloud in the subscription.
    - For Microsoft Defender for Storage, select **On** to turn on Defender for Storage, and select **Save**.

    :::image type="content" source="media/azure-defender-storage-configure/enable-azure-defender-security-center.png" alt-text="Screenshot showing how to enable Microsoft Defender for Storage.":::

Microsoft Defender for Storage is now enabled for this storage account.

### [Bicep template](#tab/bicep-template)

To enable Microsoft Defender for Storage at the subscription level with the per-storage plan using [Bicep](../../azure-resource-manager/bicep/overview.md), add the following to your Bicep template:

```bicep
resource symbolicname 'Microsoft.Security/pricings@2022-03-01' = {
  name: 'StorageAccounts'
  properties: {
    pricingTier: 'Standard'
    subPlan: 'PerStorageAccount'
  }
}
```

To disable the plan, set the `pricingTier` property value to `Free` and remove the `subPlan` property.

Learn more about the [Bicep template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-bicep&source=docs).

### [ARM template](#tab/arm-template)

To enable Microsoft Defender for Storage at the subscription level with the per-storage plan using an ARM template, add this JSON snippet to the resources section of your ARM template: 

```json
{
  "type": "Microsoft.Security/pricings",
  "apiVersion": "2022-03-01",
  "name": "StorageAccounts",
  "properties": {
    "pricingTier": "Standard",
    "subPlan": "PerStorageAccount"
  }
}
```

> [!TIP]
> You can use the Get and List API requests to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `pricingTier` property value to `Free` and remove the `subPlan` property. 

Learn more about the [ARM template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-arm-template).

### [Terraform template](#tab/terraform-template)

To enable Microsoft Defender for Storage at the subscription level with the per-storage plan using an Terraform template, add this code snippet to your template with your subscription ID as the `parent_id` value: 

```terraform
resource "azapi_resource" "symbolicname" {
  type = "Microsoft.Security/pricings@2022-03-01"
  name = "StorageAccounts"
  parent_id = "<subscriptionId>"
  body = jsonencode({
    properties = {
      pricingTier = "Standard" 
      subPlan = "PerStorageAccount" 
    } 
  })
} 
```

> [!TIP]
> You can use the Get and List API requests to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `pricingTier` property value to `Free` and remove the `subPlan` property. 

Learn more about the [ARM template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-arm-template).

### [PowerShell](#tab/powershell)

To enable Microsoft Defender for Storage at the subscription level with the per-storage plan using PowerShell: 

1. If you don't have it already, [install the Azure Az PowerShell module](/powershell/azure/install-az-ps.md).
1. Use the Connect-AzAccount cmdlet to sign in to your Azure account. Learn more about [signing in to Azure with Azure PowerShell](/powershell/azure/authenticate-azureps.md).
1. Use these commands to register your subscription to the Microsoft Defender for Cloud Resource Provider:

    ```powershell
    Set-AzContext -Subscription <subscriptionId> 
    Register-AzResourceProvider -ProviderNamespace 'Microsoft.Security' 
    ```

    Replace `<subscriptionId>` with your subscription ID.

1. Enable Microsoft Defender for Storage for your subscription with the Set-AzSecurityPricing cmdlet: 

    ```powershell
    Set-AzSecurityPricing -Name "StorageAccounts" -PricingTier "Standard" -subPlan "PerStorageAccount"
    ``` 

> [!TIP]
> You can use the GetAzSecurityPricing (Az_Security) to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `-PricingTier` property value to `Free` and remove the `subPlan` parameter. 

Learn more about the [using PowerShell with Microsoft Defender for Cloud](../../defender-for-cloud/powershell-onboarding.md).

### [Azure CLI](#tab/azure-cli)

To enable Microsoft Defender for Storage at the subscription level with the per-storage plan using Azure CLI: 

1. If you don't have it already, [install the Azure CLI](/cli/azure/install-azure-cli).
1. Use the `az login` command to sign in to your Azure account. Learn more about [signing in to Azure with Azure CLI](/cli/azure/authenticate-azure-cli).
1. Use these commands to set the subscription ID and name:

    ```cli
    az account set --subscription "<subscriptionId or name>" 
    ```

    Replace `<subscriptionId>` with your subscription ID.

1. Enable Microsoft Defender for Storage for your subscription with the `az security pricing create` command: 

    ```cli
    az security pricing create -n StorageAccounts --tier "standard" --subPlan "PerStorageAccount" 
    ``` 

> [!TIP]
> You can use the `az security pricing show` command to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `-tier` property value to `free` and remove the `subPlan` parameter. 

Learn more about the [az security pricing](/cli/azure/security/pricing.md#az-security-pricing-create) command.

### [REST API](#tab/rest-api)

To enable Microsoft Defender for Storage at the subscription level with the per-storage plan using the Microsoft Defender for Cloud REST API, create a PUT request with this endpoint and body: 

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/pricings/StorageAccounts?api-version=2022-03-01 

{
"properties": {
    "pricingTier": "Standard"
    "subPlan": "PerStorageAccount"
}
}
``` 

Replace `{subscriptionId}` with your subscription ID.

> [!TIP]
> You can use the Get and List API requests to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `-pricingTier` property value to `Free` and remove the `subPlan` parameter. 

Learn more about the [updating Defender plans with the REST API](/rest/api/defenderforcloud/pricings/update.md) in HTTP, Java, Go and JavaScript.

---

## Set up Microsoft Defender for Storage for the per-transaction pricing plan

For the Defender for Storage per-transaction pricing plan, we recommend that you [configure the plan for each subscription](#set-up-the-per-transaction-pricing-plan-for-a-subscription) so that all existing and new storage accounts are protected. If you want to only protect specific accounts, configure the plan for each account.

### Set up the per-transaction pricing plan for a subscription

You can configure Microsoft Defender for Storage on your subscriptions in several ways.

#### [Azure Portal](#tab/azure-portal)

To enable Microsoft Defender for Storage at the subscription level with the per-storage plan using the Azure Portal:

#### [Bicep template](#tab/bicep-template)

To enable Microsoft Defender for Storage at the subscription level with the per-transaction plan using [Bicep](../../azure-resource-manager/bicep/overview.md), add the following to your Bicep template:

```bicep
resource symbolicname 'Microsoft.Security/pricings@2022-03-01' = {
  name: 'StorageAccounts'
  properties: {
    pricingTier: 'Standard'
    subPlan: 'PerTransaction'
  }
}
```

To disable the plan, set the `pricingTier` property value to `Free` and remove the `subPlan` property.

Learn more about the [Bicep template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-bicep&source=docs).

#### [ARM template](#tab/arm-template)

To enable Microsoft Defender for Storage at the subscription level with the per-transaction plan using an ARM template, add this JSON snippet to the resources section of your ARM template: 

```json
{
  "type": "Microsoft.Security/pricings",
  "apiVersion": "2022-03-01",
  "name": "StorageAccounts",
  "properties": {
    "pricingTier": "Standard",
    "subPlan": "PerTransaction"
  }
}
```

> [!TIP]
> You can use the Get and List API requests to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `pricingTier` property value to `Free` and remove the `subPlan` property. 

Learn more about the [ARM template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-arm-template).

#### [Terraform template](#tab/terraform-template)

To enable Microsoft Defender for Storage at the subscription level with the per-transaction plan using an Terraform template, add this code snippet to your template with your subscription ID as the `parent_id` value: 

```terraform
resource "azapi_resource" "symbolicname" {
  type = "Microsoft.Security/pricings@2022-03-01"
  name = "StorageAccounts"
  parent_id = "<subscriptionId>"
  body = jsonencode({
    properties = {
      pricingTier = "Standard" 
      subPlan = "PerTransaction" 
    } 
  })
} 
```

> [!TIP]
> You can use the Get and List API requests to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `pricingTier` property value to `Free` and remove the `subPlan` property. 

Learn more about the [ARM template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-arm-template).

#### [PowerShell](#tab/powershell)

To enable Microsoft Defender for Storage at the subscription level with the per-transaction plan using PowerShell: 

1. If you don't have it already, [install the Azure Az PowerShell module](/powershell/azure/install-az-ps.md).
1. Use the Connect-AzAccount cmdlet to sign in to your Azure account. Learn more about [signing in to Azure with Azure PowerShell](/powershell/azure/authenticate-azureps.md).
1. Use these commands to register your subscription to the Microsoft Defender for Cloud Resource Provider:

    ```powershell
    Set-AzContext -Subscription <subscriptionId> 
    Register-AzResourceProvider -ProviderNamespace 'Microsoft.Security' 
    ```

    Replace `<subscriptionId>` with your subscription ID.

1. Enable Microsoft Defender for Storage for your subscription with the Set-AzSecurityPricing cmdlet: 

    ```powershell
    Set-AzSecurityPricing -Name "StorageAccounts" -PricingTier "Standard" -subPlan "PerTransaction"
    ``` 

> [!TIP]
> You can use the GetAzSecurityPricing (Az_Security) to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `-PricingTier` property value to `Free` and remove the `subPlan` parameter. 

Learn more about the [using PowerShell with Microsoft Defender for Cloud](../../defender-for-cloud/powershell-onboarding.md).

#### [Azure CLI](#tab/azure-cli)

To enable Microsoft Defender for Storage at the subscription level with the per-transaction plan using Azure CLI: 

1. If you don't have it already, [install the Azure CLI](/cli/azure/install-azure-cli).
1. Use the `az login` command to sign in to your Azure account. Learn more about [signing in to Azure with Azure CLI](/cli/azure/authenticate-azure-cli).
1. Use these commands to set the subscription ID and name:

    ```cli
    az account set --subscription "<subscriptionId or name>" 
    ```

    Replace `<subscriptionId>` with your subscription ID.

1. Enable Microsoft Defender for Storage for your subscription with the `az security pricing create` command: 

    ```cli
    az security pricing create -n StorageAccounts --tier "standard" --subPlan "PerTransaction" 
    ``` 

> [!TIP]
> You can use the `az security pricing show` command to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `-tier` property value to `free` and remove the `subPlan` parameter. 

Learn more about the [az security pricing](/cli/azure/security/pricing.md#az-security-pricing-create) command.

#### [REST API](#tab/rest-api)

To enable Microsoft Defender for Storage at the subscription level with the per-transaction plan using the Microsoft Defender for Cloud REST API, create a PUT request with this endpoint and body: 

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/pricings/StorageAccounts?api-version=2022-03-01 

{
"properties": {
    "pricingTier": "Standard"
    "subPlan": "PerTransaction"
}
}
``` 

Replace `{subscriptionId}` with your subscription ID.

> [!TIP]
> You can use the Get and List API requests to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `-pricingTier` property value to `Free` and remove the `subPlan` parameter. 

Learn more about the [updating Defender plans with the REST API](/rest/api/defenderforcloud/pricings/update.md) in HTTP, Java, Go and JavaScript.

---

### Set up the per-transaction pricing plan for an account

You can configure Microsoft Defender for Storage on your accounts in several ways.

#### [Azure Portal](#tab/azure-portal)

To enable Microsoft Defender for Storage at the account level with the per-transaction plan using the Azure Portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your storage account.
1. In the Security + networking section of the Storage account menu, select **Microsoft Defender for Cloud**.
1. Select **Enable Microsoft Defender for Storage**.

:::image type="content" source="media/azure-defender-storage-configure/enable-azure-defender-portal.png" alt-text="Screenshot of the button to enable Defender for Storage on a storage account.":::

Microsoft Defender for Storage is now enabled for this storage account. If you want to disable Defender for Storage on the account, select **Disable**.

:::image type="content" source="media/azure-defender-storage-configure/disable-azure-defender-portal.png" alt-text="Screenshot of the link to disable Defender for Storage on a storage account.":::

#### [ARM template](#tab/arm-template)

To enable Microsoft Defender for Storage at the account level with the per-transaction plan using an ARM template, use [the prepared Azure template](https://azure.microsoft.com/resources/templates/storage-advanced-threat-protection-create/).

If you want to disable Defender for Storage on the account:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your storage account.
1. In the Security + networking section of the Storage account menu, select **Microsoft Defender for Cloud**.
1. Select **Disable**.

#### [PowerShell](#tab/powershell)

To enable Microsoft Defender for Storage at the account level with the per-transaction plan using PowerShell: 

1. If you don't have it already, [install the Azure Az PowerShell module](/powershell/azure/install-az-ps.md).
1. Use the Connect-AzAccount cmdlet to sign in to your Azure account. Learn more about [signing in to Azure with Azure PowerShell](/powershell/azure/authenticate-azureps.md).
1. Enable Microsoft Defender for Storage for the desired storage account with the `Enable-AzSecurityAdvancedThreatProtection` cmdlet: 

    ```powershell
    Enable-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/"
    ```

    Replace `<subscriptionId>`, `<resource-group>`, and `<storage-account>` with the values for your environment.

If you want disable the per-transaction plan for a specific storage account, use the Disable-AzSecurityAdvancedThreatProtection cmdlet: 

```powershell
Disable-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/" 
```

Learn more about the [using PowerShell with Microsoft Defender for Cloud](../../defender-for-cloud/powershell-onboarding.md).

#### [Azure CLI](#tab/azure-cli)

To enable Microsoft Defender for Storage at the account level with the per-transaction plan using Azure CLI: 

1. If you don't have it already, [install the Azure CLI](/cli/azure/install-azure-cli).
1. Use the `az login` command to sign in to your Azure account. Learn more about [signing in to Azure with Azure CLI](/cli/azure/authenticate-azure-cli).
1. Enable Microsoft Defender for Storage for your subscription with the `az security atp storage` command:

    ```cli
    az security atp storage update \
    --resource-group <resource-group> \
    --storage-account <storage-account> \
    --is-enabled true
    ``` 

> [!TIP]
> You can use the `az security atp storage` command to see if Defender for Storage is enabled on an account.

To disable Microsoft Defender for Storage for your subscription, use the `az security atp storage` command:

```cli
az security atp storage update \
--resource-group <resource-group> \
--storage-account <storage-account> \
--is-enabled false
```

Learn more about the [az security atp storage](/cli/azure/security/atp/storage#az-security-atp-storage-update) command.

---

## Explore security anomalies

When storage activity anomalies occur, you receive an email notification with information about the suspicious security event. Details of the event include:

- The nature of the anomaly
- The storage account name
- The event time
- The storage type
- The potential causes
- The investigation steps
- The remediation steps

The email also includes details on possible causes and recommended actions to investigate and mitigate the potential threat.

:::image type="content" source="media/azure-defender-storage-configure/storage-advanced-threat-protection-alert-email.png" alt-text="Microsoft Defender for Storage alert email":::

You can review and manage your current security alerts from Microsoft Defender for Cloud's [Security alerts tile](../../defender-for-cloud/managing-and-responding-alerts.md). Select an alert for details and actions for investigating the current threat and addressing future threats.

:::image type="content" source="media/azure-defender-storage-configure/storage-advanced-threat-protection-alert.png" alt-text="Microsoft Defender for Storage alert":::

## Security alerts

Alerts are generated by unusual and potentially harmful attempts to access or exploit storage accounts. For a list of alerts for Azure Storage, see [Alerts for Azure Storage](../../defender-for-cloud/alerts-reference.md#alerts-azurestorage).

## FAQ - Microsoft Defender for Storage

### Can I switch from an existing transaction-based plan to the per-storage account plan?

Yes, you can migrate to the per-storage account plan from the Azure Portal or all the other supported enablement methods. To migrate to the per-account plan, [enable the per-account plan at the subscription level](#set-up-microsoft-defender-for-storage-for-the-per-account-pricing-plan).

### Can I return to the per-transaction plan after switching to the per-storage account plan?

Yes, you can enable the per-transaction to migrate back from the per-storage plan using all enablement methods except for the Azure Portal.

### Will you continue supporting the per-transaction plan?

Yes, we have no current plans to deprecate the legacy per-transaction plan. You can [enable the per-transaction plan](#set-up-microsoft-defender-for-storage-for-the-per-transaction-pricing-plan) from all the enablement methods except for the Azure Portal.

### Can I exclude specific storage accounts from protections in the per-storage plan? 

No, you can only enable the per-account pricing plan for each subscription. All storage accounts in the subscription are protected.

### How long does it take for the per-account plan to be enabled?

When you enable Microsoft Defender for Storage at the subscription level for the per-account or per-transaction plans, it takes up to 24 hours for the plan to be enabled.

### Is there any difference in the feature set of the per-storage account plan compared to the legacy per-transaction plan?

No. Both the per-account and per-transaction plans include the same features. The only difference is the pricing plan.

## Next steps

- [Introduction to Microsoft Defender for Storage](../../defender-for-cloud/defender-for-storage-introduction.md)
- [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md)
- [Logs in Azure Storage accounts](/rest/api/storageservices/About-Storage-Analytics-Logging.md)
