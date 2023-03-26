---
title: Protect your Azure storage accounts using Microsoft Defender for Cloud
titleSuffix: Azure Storage
description: Configure Microsoft Defender for Storage to detect anomalies in account activity and be notified of potentially harmful attempts to access the storage accounts in your subscription.
services: storage
author: bmansheim

ms.service: storage
ms.subservice: common
ms.topic: how-to
ms.date: 01/18/2023
ms.author: benmansheim
ms.reviewer: ozgun
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Enable Microsoft Defender for Storage

**Microsoft Defender for Storage** is an Azure-native solution offering an advanced layer of intelligence for threat detection and mitigation in storage accounts, powered by Microsoft Threat Intelligence, Microsoft Defender Antimalware technologies, and Sensitive Data Discovery. Covering Azure Blob Storage, Azure Files, and Azure Data Lake Storage services, it provides a comprehensive alert suite, near real-time Malware Scanning (add-on), and sensitive data threat detection (no extra cost), allowing quick detection, triage, and response to potential security threats with contextual information.

With Microsoft Defender for Storage, organizations can customize their protection and enforce consistent security policies by enabling it on subscriptions and storage accounts with granular control and flexibility.

Learn more about Microsoft Defender for Storage [capabilities](../../defender-for-cloud/defender-for-storage-introduction.md) and [security threats and alerts](../../defender-for-cloud/defender-for-storage-threats-alerts.md).

> [!TIP]
> If you're currently using Microsoft Defender for Storage classic, consider upgrading to the new plan, which offers several benefits over the classic plan. Learn more about [migrating to the new plan](../../defender-for-cloud/defender-for-storage-classic-migrate.md).

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Feature availability:|- Activity monitoring (security alerts) - General availability (GA)<br>- Malware Scanning – Preview<br>- Sensitive data threat detection (Sensitive Data Discovery) – Preview|
|Pricing:|- Defender for Storage: $10/storage accounts/month\*<br>- Malware Scanning (add-on): Free during public preview\*\*<br><br>Above pricing applies to commercial clouds. Visit the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) to learn more.<br><br>\* Storage accounts that exceed 73 million monthly transactions will be charged $0.1492 for every 1 million transactions that exceed the threshold.<br>\*\* In the future, Malware Scanning will be priced at $0.15/GB of data ingested. Billing for Malware Scanning is not enabled during public preview and advanced notice will be given before billing starts.|
| Supported storage types:|[Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs/) (Standard/Premium StorageV2, including Data Lake Gen2): Activity monitoring, Malware Scanning, Sensitive Data Discovery<br>Azure Files (over REST API and SMB): Activity monitoring |
|Required roles and permissions:|For Malware Scanning and sensitive data threat detection at subscription and storage account levels, you need Owner roles (subscription owner/storage account owner) or specific roles with corresponding data actions. To enable Activity Monitoring, you need 'Security Admin' permissions. Read more about the required permissions.|
|Clouds:|:::image type="icon" source="../../defender-for-cloud/media/icons/yes-icon.png"::: Commercial clouds\*<br>:::image type="icon" source="../../defender-for-cloud/media/icons/yes-icon.png"::: Azure Government (Only for activity monitoring)<br>:::image type="icon" source="../../defender-for-cloud/media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="../../defender-for-cloud/media/icons/no-icon.png"::: Connected AWS accounts|

\* Azure DNS Zone is not supported for Malware Scanning and sensitive data threat detection.

## Prerequisites

- Networking

    Malware Scanning supports storage accounts with “Networking” > “Public network access” enabled, either from all networks or from selected virtual networks. “Public network access” disabled is not supported and Malware Scanning won't scan the data.

- Permissions

    To enable Malware Scanning feature on the entire subscription you will need the Owner role on the subscription. Alternatively, you can use a role that has the following actions:

        Microsoft.Security/pricings/write
        Microsoft.Security/pricings/read
        Microsoft.Security/pricings/SecurityOperator/read
        Microsoft.Security/pricings/SecurityOperator/write
        Microsoft.Authorization/roleAssignments/read
        Microsoft.Authorization/roleAssignments/write
        Microsoft.Authorization/roleAssignments/delete

    To enable Malware Scanning feature on a specific storage account you will need the Storage Account Owner role.

- Event Grid resource provider

    Event Grid resource provider must be registered to be able to create the Event Grid System Topic used for detect upload triggers.

    Follow [these steps](../../event-grid/blob-event-quickstart-portal.md#register-the-event-grid-resource-provider) to verify Event Grid is registered on your subscription.

    :::image type="content" source="media/azure-defender-storage-configure/register-event-grid-resource-provider.png" alt-text="Diagram showing how to register Event Grid as a resource provider." lightbox="media/azure-defender-storage-configure/register-event-grid-resource-provider.png":::

    You must have permission to the `/register/action` operation for the resource provider. This permission is included in the Contributor and Owner roles.

## Set up Microsoft Defender for Storage

To enable and configure Microsoft Defender for Storage to ensure maximum protection and cost optimization, the following configuration options are available: 

Enable/disable Microsoft Defender for Storage. 

Enable/disable the malware scanning or sensitive data threat detection configurable features. 

Set a monthly cap on the malware scanning per storage account to control costs. (default value is 5000GB per storage account per month) 

Configure additional methods for saving malware scanning results and logging. 

[! Tip] the Malware Scanning features has advanced configurations to support security teams' different workflows and requirements. 

Override subscription-level settings to configure specific storage accounts with custom configurations that differ from the settings configured at the subscription level. 

You can enable and configure Microsoft Defender for Storage from the Azure portal, built-in Azure policies, programmatically using IaC templates (Bicep and ARM) or directly with REST API. 

> [!NOTE]
> To prevent migrating back to the legacy classic plan, make sure to disable the old Defender for Storage policies. Look for and disable policies named **Configure Azure Defender for Storage to be enabled**, **Azure Defender for Storage should be enabled**, or **Configure Microsoft Defender for Storage to be enabled (per-storage account plan)**.

## [Enable on a subscription](#tab/enable-subscription/)

> [!NOTE]
> You can only enable per-storage account pricing at the subscription level.

With the Defender for Storage per-storage account pricing, you can configure Defender for Storage on your subscriptions in several ways to protect all your existing and new storage accounts in that subscription.

You can configure Microsoft Defender for Storage on your subscriptions in several ways:

- [Azure portal](#azure-portal)
- [Bicep template](#bicep-template)
- [ARM template](#arm-template)
- [Terraform template](#terraform-template)
- [REST API](#rest-api)

### Azure portal

To enable Microsoft Defender for Storage at the subscription level with per-storage account pricing using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select the subscription for which you want to enable Defender for Storage.

    :::image type="content" source="media/azure-defender-storage-configure/defender-for-cloud-select-subscription.png" alt-text="Screenshot showing how to select a subscription in Defender for Cloud." lightbox="media/azure-defender-storage-configure/defender-for-cloud-select-subscription.png":::

1. On the **Defender plans** page, enable Defender for Storage per-storage account pricing with one of the following options:

    - Choose the **Enable all** button to enable Microsoft Defender for Cloud in the subscription.
    - To enable Microsoft Defender for Storage, locate **Storage** in the list and toggle the **On** button. Then choose **Save**.

      If you currently have Defender for Storage enabled with per-transaction pricing, select the **New pricing plan available** link and confirm the pricing change.

        :::image type="content" source="media/azure-defender-storage-configure/enable-azure-defender-security-center.png" alt-text="Screenshot showing how to enable Defender for Storage in Defender for Cloud." lightbox="media/azure-defender-storage-configure/enable-azure-defender-security-center.png":::

Microsoft Defender for Storage is now enabled for this storage account.

To disable the plan, toggle the **Off** button for Defender for Storage on the **Defender plans** page.

### Enable per-storage account pricing programmatically

#### Bicep template

To enable Microsoft Defender for Storage at the subscription level with per-storage account pricing using [Bicep](../../azure-resource-manager/bicep/overview.md), add the following to your Bicep template:

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

#### ARM template

To enable Microsoft Defender for Storage at the subscription level with per-storage account pricing using an ARM template, add this JSON snippet to the resources section of your ARM template:

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

To disable the plan, set the `pricingTier` property value to `Free` and remove the `subPlan` property.

Learn more about the [ARM template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-arm-template).

#### Terraform template

To enable Microsoft Defender for Storage at the subscription level with per-storage account pricing using a Terraform template, add this code snippet to your template with your subscription ID as the `parent_id` value:

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

To disable the plan, set the `pricingTier` property value to `Free` and remove the `subPlan` property.

Learn more about the [Terraform template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-terraform).

#### REST API

To enable Microsoft Defender for Storage at the subscription level with per-storage account pricing using the Microsoft Defender for Cloud REST API, create a PUT request with this endpoint and body:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/pricings/StorageAccounts?api-version=2022-03-01

{
  "properties": {
    "pricingTier": "Standard",
    "subPlan": "PerStorageAccount"
  }
}
```

Replace `{subscriptionId}` with your subscription ID.

> [!TIP]
> You can use the [Get](/rest/api/defenderforcloud/pricings/get) and [List](/rest/api/defenderforcloud/pricings/list) API requests to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `-pricingTier` property value to `Free` and remove the `subPlan` parameter.

Learn more about the [updating Defender plans with the REST API](/rest/api/defenderforcloud/pricings/update) in HTTP, Java, Go and JavaScript.

## [Per-transaction pricing](#tab/per-transaction/)

For the Defender for Storage per-transaction pricing, we recommend that you enable Defender for Storage for each subscription so that all existing and new storage accounts are protected. If you want to only protect specific accounts, [configure Defender for Storage for each account](#set-up-per-transaction-pricing-for-an-account).

### Set up per-transaction pricing for a subscription

You can configure Microsoft Defender for Storage on your subscriptions in several ways:

- [Bicep template](#bicep-template-1)
- [ARM template](#arm-template-1)
- [Terraform template](#terraform-template-1)
- [PowerShell](#powershell)
- [Azure CLI](#azure-cli)
- [REST API](#rest-api-1)

#### Bicep template

To enable Microsoft Defender for Storage at the subscription level with per-transaction pricing using [Bicep](../../azure-resource-manager/bicep/overview.md), add the following to your Bicep template:

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

#### ARM template

To enable Microsoft Defender for Storage at the subscription level with per-transaction pricing using an ARM template, add this JSON snippet to the resources section of your ARM template:

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

To disable the plan, set the `pricingTier` property value to `Free` and remove the `subPlan` property.

Learn more about the [ARM template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-arm-template).

#### Terraform template

To enable Microsoft Defender for Storage at the subscription level with per-transaction pricing using a Terraform template, add this code snippet to your template with your subscription ID as the `parent_id` value:

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

To disable the plan, set the `pricingTier` property value to `Free` and remove the `subPlan` property.

Learn more about the [ARM template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-arm-template).

#### PowerShell

To enable Microsoft Defender for Storage at the subscription level with per-transaction pricing using PowerShell:

1. If you don't have it already, [install the Azure Az PowerShell module](/powershell/azure/install-az-ps).
1. Use the `Connect-AzAccount` cmdlet to sign in to your Azure account. Learn more about [signing in to Azure with Azure PowerShell](/powershell/azure/authenticate-azureps).
1. Use these commands to register your subscription to the Microsoft Defender for Cloud Resource Provider:

    ```powershell
    Set-AzContext -Subscription <subscriptionId>
    Register-AzResourceProvider -ProviderNamespace 'Microsoft.Security'
    ```

    Replace `<subscriptionId>` with your subscription ID.

1. Enable Microsoft Defender for Storage for your subscription with the `Set-AzSecurityPricing` cmdlet:

    ```powershell
    Set-AzSecurityPricing -Name "StorageAccounts" -PricingTier "Standard"
    ```

> [!TIP]
> You can use the [`GetAzSecurityPricing` (Az_Security)](/powershell/module/az.security/get-azsecuritypricing) to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `-PricingTier` property value to `Free`.

Learn more about the [using PowerShell with Microsoft Defender for Cloud](../../defender-for-cloud/powershell-onboarding.md).

#### Azure CLI

To enable Microsoft Defender for Storage at the subscription level with per-transaction pricing using Azure CLI:

1. If you don't have it already, [install the Azure CLI](/cli/azure/install-azure-cli).
1. Use the `az login` command to sign in to your Azure account. Learn more about [signing in to Azure with Azure CLI](/cli/azure/authenticate-azure-cli).
1. Use these commands to set the subscription ID and name:

    ```azurecli
    az account set --subscription "<subscriptionId or name>"
    ```

    Replace `<subscriptionId>` with your subscription ID.

1. Enable Microsoft Defender for Storage for your subscription with the `az security pricing create` command:

    ```azurecli
    az security pricing create -n StorageAccounts --tier "standard"
    ```

> [!TIP]
> You can use the [`az security pricing show`](/cli/azure/security/pricing#az-security-pricing-show) command to see all of the Defender for Cloud plans that are enabled for the subscription.

To disable the plan, set the `-tier` property value to `free`.

Learn more about the [`az security pricing create`](/cli/azure/security/pricing#az-security-pricing-create) command.

#### REST API

To enable Microsoft Defender for Storage at the subscription level with per-transaction pricing using the Microsoft Defender for Cloud REST API, create a PUT request with this endpoint and body:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/pricings/StorageAccounts?api-version=2022-03-01

{
"properties": {
    "pricingTier": "Standard",
    "subPlan": "PerTransaction"
    }
}
```

Replace `{subscriptionId}` with your subscription ID.

To disable the plan, set the `-pricingTier` property value to `Free` and remove the `subPlan` parameter.

Learn more about the [updating Defender plans with the REST API](/rest/api/defenderforcloud/pricings/update) in HTTP, Java, Go and JavaScript.

### Set up per-transaction pricing for an account

You can configure Microsoft Defender for Storage with per-transaction pricing on your accounts in several ways:

- [Azure portal](#azure-portal-1)
- [ARM template](#arm-template-2)
- [PowerShell](#powershell-1)
- [Azure CLI](#azure-cli-1)

#### Azure portal

To enable Microsoft Defender for Storage for a specific account with per-transaction pricing using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your storage account.
1. In the **Security + networking** section of the Storage account menu, select **Microsoft Defender for Cloud**.
1. Select **Enable Defender on this storage account only**.

:::image type="content" source="media/azure-defender-storage-configure/storage-enable-defender-for-account.png" alt-text="Screenshot showing how to enable the Defender for Storage per-transaction pricing on a specific account." lightbox="media/azure-defender-storage-configure/storage-enable-defender-for-account.png":::

Microsoft Defender for Storage is now enabled for this storage account. If you want to disable Defender for Storage on the account, select **Disable**.

:::image type="content" source="media/azure-defender-storage-configure/storage-disable-defender-for-account.png" alt-text="Screenshot showing how to disable the Defender for Storage per-transaction pricing on a specific account." lightbox="media/azure-defender-storage-configure/storage-disable-defender-for-account.png":::

#### ARM template

To enable Microsoft Defender for Storage for a specific storage account with per-transaction pricing using an ARM template, use [the prepared Azure template](https://azure.microsoft.com/resources/templates/storage-advanced-threat-protection-create/).

If you want to disable Defender for Storage on the account:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your storage account.
1. In the Security + networking section of the Storage account menu, select **Microsoft Defender for Cloud**.
1. Select **Disable**.

#### PowerShell

To enable Microsoft Defender for Storage for a specific storage account with per-transaction pricing using PowerShell:

1. If you don't have it already, [install the Azure Az PowerShell module](/powershell/azure/install-az-ps).
1. Use the Connect-AzAccount cmdlet to sign in to your Azure account. Learn more about [signing in to Azure with Azure PowerShell](/powershell/azure/authenticate-azureps).
1. Enable Microsoft Defender for Storage for the desired storage account with the [`Enable-AzSecurityAdvancedThreatProtection`](/powershell/module/az.security/enable-azsecurityadvancedthreatprotection) cmdlet:

    ```powershell
    Enable-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/"
    ```

    Replace `<subscriptionId>`, `<resource-group>`, and `<storage-account>` with the values for your environment.

If you want to disable per-transaction pricing for a specific storage account, use the [`Disable-AzSecurityAdvancedThreatProtection`](/powershell/module/az.security/disable-azsecurityadvancedthreatprotection) cmdlet:

```powershell
Disable-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/"
```

Learn more about the [using PowerShell with Microsoft Defender for Cloud](../../defender-for-cloud/powershell-onboarding.md).

#### Azure CLI

To enable Microsoft Defender for Storage for a specific storage account with per-transaction pricing using Azure CLI:

1. If you don't have it already, [install the Azure CLI](/cli/azure/install-azure-cli).
1. Use the `az login` command to sign in to your Azure account. Learn more about [signing in to Azure with Azure CLI](/cli/azure/authenticate-azure-cli).
1. Enable Microsoft Defender for Storage for your subscription with the [`az security atp storage update`](/cli/azure/security/atp/storage) command:

    ```azurecli
    az security atp storage update \
    --resource-group <resource-group> \
    --storage-account <storage-account> \
    --is-enabled true
    ```

> [!TIP]
> You can use the [`az security atp storage show`](/cli/azure/security/atp/storage) command to see if Defender for Storage is enabled on an account.

To disable Microsoft Defender for Storage for your subscription, use the [`az security atp storage update`](/cli/azure/security/atp/storage) command:

```azurecli
az security atp storage update \
--resource-group <resource-group> \
--storage-account <storage-account> \
--is-enabled false
```

Learn more about the [az security atp storage](/cli/azure/security/atp/storage#az-security-atp-storage-update) command.

---

## FAQ - Microsoft Defender for Storage pricing
### Can I switch from an existing per-transaction pricing to per-storage account pricing?

Yes, you can migrate to per-storage account pricing in the Azure portal or using any of the other supported enablement methods. To migrate to per-storage account pricing, [enable per-storage account pricing at the subscription level](#set-up-microsoft-defender-for-storage).

### Can I return to per-transaction pricing after switching to per-storage account pricing?

Yes, you can [enable per-transaction pricing](#set-up-microsoft-defender-for-storage) to migrate back from per-storage account pricing using all enablement methods except for the Azure portal.

### Will you continue supporting per-transaction pricing?

Yes, you can [enable per-transaction pricing](#set-up-microsoft-defender-for-storage) from all the enablement methods, except for the Azure portal.

### Can I exclude specific storage accounts from protections in per-storage account pricing?

No, you can only enable per-storage account pricing for each subscription. All storage accounts in the subscription are protected.

### How long does it take for per-storage account pricing to be enabled?

When you enable Microsoft Defender for Storage at the subscription level for per-storage account or per-transaction pricing, it takes up to 24 hours for the plan to be enabled.

### Is there any difference in the feature set of per-storage account pricing compared to the legacy per-transaction pricing?

No. Both per-storage account and per-transaction pricing include the same features. The only difference is the pricing.

### How can I estimate the cost for each pricing?

To estimate the cost according to each pricing for your environment, we created a [pricing estimation workbook](https://aka.ms/dfstoragecosttool) and a PowerShell script that you can run in your environment.

## Next steps

- Check out the [alerts for Azure Storage](../../defender-for-cloud/alerts-reference.md#alerts-azurestorage)
- Learn about the [features and benefits of Defender for Storage](../../defender-for-cloud/defender-for-storage-introduction.md)
