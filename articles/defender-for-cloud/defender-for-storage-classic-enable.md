---
title: Enable and configure Microsoft Defender for Storage (classic) - Microsoft Defender for Cloud
description: Learn about how to enable and configure Microsoft Defender for Storage (classic).
ms.date: 03/16/2023
author: bmansheim
ms.author: benmansheim
ms.topic: how-to
---

# Enable Microsoft Defender for Storage (classic)

> [!NOTE]
> Upgrade to the new [Microsoft Defender for Storage plan](defender-for-storage-introduction.md) and use advanced security capabilities, including Malware Scanning and sensitive data threat detection. Benefit from a more predictable and granular pricing structure that charges per storage account, with additional costs for high-volume transactions. This new pricing plan also encompasses all new security features and detections.
> If you're using Defender for Storage (classic) with per-transaction or per-storage account pricing, you'll need to migrate to the new Defender for Storage (classic) plan to access these features and pricing. Learn about [migrating to the new Defender for Storage plan](defender-for-storage-classic-migrate.md).

**Microsoft Defender for Storage** is an Azure-native layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit your storage accounts. It uses advanced threat detection capabilities and [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684) data to provide contextual security alerts. Those alerts also include steps to mitigate the detected threats and prevent future attacks.

Microsoft Defender for Storage continuously analyzes the transactions of [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/), [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/), and [Azure Files](https://azure.microsoft.com/services/storage/files/) services. When potentially malicious activities are detected, security alerts are generated. Alerts are shown in Microsoft Defender for Cloud with the details of the suspicious activity, appropriate investigation steps, remediation actions, and security recommendations.

Analyzed telemetry of Azure Blob Storage includes operation types such as Get Blob, Put Blob, Get Container ACL, List Blobs, and Get Blob Properties. Examples of analyzed Azure Files operation types include Get File, Create File, List Files, Get File Properties, and Put Range.

Defender for Storage classic doesn’t access the Storage account data and has no impact on its performance.

Learn more about the [benefits, features, and limitations of Defender for Storage](defender-for-storage-introduction.md). You can also learn more about Defender for Storage in the [Defender for Storage episode](episode-thirteen.md) of the Defender for Cloud in the Field video series.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|**Microsoft Defender for Storage** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) and in the [Defender plans page](https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade/pricingTier) in the Azure portal |
|Protected storage types:|[Blob Storage](../storage/blobs/storage-blobs-introduction.md)  (Standard/Premium StorageV2, Block Blobs) <br>[Azure Files](../storage/files/storage-files-introduction.md) (over REST API and SMB)<br>[Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) (Standard/Premium accounts with hierarchical namespaces enabled)|
|Clouds:|:::image type="icon" source="media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="media/icons/yes-icon.png"::: Azure Government (Only for per-transaction plan)<br>:::image type="icon" source="media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="media/icons/no-icon.png"::: Connected AWS accounts|

## Set up Microsoft Defender for Storage (classic)

### Set up per-transaction pricing for a subscription

For the Defender for Storage per-transaction pricing, we recommend that you enable Defender for Storage for each subscription so that all existing and new storage accounts are protected. If you want to only protect specific accounts, [configure Defender for Storage for each account](#set-up-per-transaction-pricing-for-a-storage-account).

You can configure Microsoft Defender for Storage on your subscriptions in several ways:

- [Terraform template](#terraform-template)
- [Bicep template](#bicep-template)
- [ARM template](#arm-template)
- [PowerShell](#powershell)
- [Azure CLI](#azure-cli)
- [REST API](#rest-api)


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

#### Bicep template

To enable Microsoft Defender for Storage at the subscription level with per-transaction pricing using [Bicep](../azure-resource-manager/bicep/overview.md), add the following to your Bicep template:

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

Learn more about the [using PowerShell with Microsoft Defender for Cloud](powershell-onboarding.md).

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

### Set up per-transaction pricing for a storage account

You can configure Microsoft Defender for Storage with per-transaction pricing on your accounts in several ways:

- [ARM template](#arm-template-1)
- [PowerShell](#powershell)
- [Azure CLI](#azure-cli)


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

Learn more about the [using PowerShell with Microsoft Defender for Cloud](powershell-onboarding.md).

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

## Exclude a storage account from a protected subscription in the per-transaction plan

> [!NOTE]
> Consider upgrading to the new Defender for Storage plan if you have storage accounts you would like to exclude from the Defender for Storage classic plan. Not only will you save on costs for transaction-heavy accounts, but you'll also gain access to enhanced security features. Learn more about the [benefits of migrating to the new plan](defender-for-storage-introduction.md).
>
> Excluded storage accounts in the Defender for Storage classic are not automatically excluded when you migrate to the new plan.

When you [enable Microsoft Defender for Storage](../storage/common/azure-defender-storage-configure.md) on a subscription for the per-transaction pricing, all current and future Azure Storage accounts in that subscription are protected. You can exclude specific storage accounts from the Defender for Storage protections using the Azure portal, PowerShell, or the Azure CLI.

We recommend that you enable Defender for Storage on the entire subscription to protect all existing and future storage accounts in it. However, there are some cases where people want to exclude specific storage accounts from Defender protection.

Exclusion of storage accounts from protected subscriptions requires you to:

1. Add a tag to block inheriting the subscription enablement.
1. Disable Defender for Storage (classic).

### Exclude an Azure Storage account protection on a subscription with per-transaction pricing

To exclude an Azure Storage account from Microsoft Defender for Storage (classic), you can use:

- [PowerShell](#use-powershell-to-exclude-an-azure-storage-account)
- [Azure CLI](#use-azure-cli-to-exclude-an-azure-storage-account)

#### Use PowerShell to exclude an Azure Storage account

1. If you don't have the Azure Az PowerShell module installed, install it using [the instructions from the Azure PowerShell documentation](/powershell/azure/install-az-ps).

1. Using an authenticated account, connect to Azure with the ``Connect-AzAccount`` cmdlet, as explained in [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

1. Define the AzDefenderPlanAutoEnable tag on the storage account with the ``Update-AzTag`` cmdlet (replace the ResourceId with the resource ID of the relevant storage account):

    ```azurepowershell
    Update-AzTag -ResourceId <resourceID> -Tag @{"AzDefenderPlanAutoEnable" = "off"} -Operation Merge
    ```

    If you skip this stage, your untagged resources continue receiving daily updates from the subscription level enablement policy. That policy enables Defender for Storage again on the account.

    > [!TIP]
    > Learn more about tags in [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md).

1. Disable Microsoft Defender for Storage for the desired account on the relevant subscription with the ``Disable-AzSecurityAdvancedThreatProtection`` cmdlet (using the same resource ID):

    ```azurepowershell
    Disable-AzSecurityAdvancedThreatProtection -ResourceId <resourceId>
    ```

    [Learn more about this cmdlet](/powershell/module/az.security/disable-azsecurityadvancedthreatprotection).

#### Use Azure CLI to exclude an Azure Storage account

1. If you don't have Azure CLI installed, install it using [the instructions from the Azure CLI documentation](/cli/azure/install-azure-cli).

1. Using an authenticated account, connect to Azure with the ``login`` command as explained in [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) and enter your account credentials when prompted:

    ```azurecli
    az login
    ```

1. Define the AzDefenderPlanAutoEnable tag on the storage account with the ``tag update`` command (replace the ResourceId with the resource ID of the relevant storage account):

    ```azurecli
    az tag update --resource-id MyResourceId --operation merge --tags AzDefenderPlanAutoEnable=off
    ```

    If you skip this stage, your untagged resources continue receiving daily updates from the subscription level enablement policy. That policy enables Defender for Storage again on the account.

    > [!TIP]
    > Learn more about tags in [az tag](/cli/azure/tag).

1. Disable Microsoft Defender for Storage for the desired account on the relevant subscription with the `security atp storage` command (using the same resource ID):

    ```azurecli
    az security atp storage update --resource-group MyResourceGroup  --storage-account MyStorageAccount --is-enabled false
    ```

    [Learn more about this command](/cli/azure/security/atp/storage).


### Exclude an Azure Databricks Storage account

#### Exclude an active Databricks workspace

Microsoft Defender for Storage can exclude specific active Databricks workspace storage accounts, when the plan is already enabled on a subscription.

**To exclude an active Databricks workspace**:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Azure Databricks** > **`Your Databricks workspace`** > **Tags**.
1. In the Name field, enter `AzDefenderPlanAutoEnable`.
1. In the Value field, enter `off`.
1. Select **Apply**.

    :::image type="content" source="media/defender-for-storage-exclude/workspace-exclude.png" alt-text="Screenshot showing the location, and how to apply the tag to your Azure Databricks account.":::

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings** > **`Your subscription`**.
1. Toggle the Defender for Storage plan to **Off**.

    :::image type="content" source="media/defender-for-storage-exclude/storage-off.png" alt-text="Screenshot showing how to switch the Defender for Storage plan to off.":::

1. Select **Save**.
1. Re-enable Defender for Storage (classic) using one of the supported methods (you can’t enable Defender for Storage classic from the Azure portal). 

The tags are inherited by the Storage account of the Databricks workspace and prevent Defender for Storage from turning on.

> [!NOTE]
> Tags can't be added directly to the Databricks Storage account, or its Managed Resource Group.

#### Prevent autoenabling on a new Databricks workspace storage account

When you create a new Databricks workspace, you have the ability to add a tag that prevents your Microsoft Defender for Storage account from enabling automatically.

**To prevent auto-enabling on a new Databricks workspace storage account**:

1. Follow [these steps](/azure/databricks/scenarios/quickstart-create-Databricks-workspace-portal?tabs=azure-portal) to create a new Azure Databricks workspace.

1. In the Tags tab, enter a tag named `AzDefenderPlanAutoEnable`.

1. Enter the value `off`.

    :::image type="content" source="media/defender-for-storage-exclude/tag-off.png" alt-text="Screenshot that shows how to create a tag in the Databricks workspace.":::

1. Continue following the instructions to create your new Azure Databricks workspace.

The Microsoft Defender for Storage account inherits the tag of the Databricks workspace, which prevents Defender for Storage from turning on automatically.

## FAQ - Microsoft Defender for Storage pricing

### Can I switch from an existing per-transaction pricing to per-storage account pricing?

Yes, you can migrate to per-storage account pricing in the Azure portal or using any of the other supported enablement methods. To migrate to per-storage account pricing, [enable per-storage account pricing at the subscription level](#set-up-microsoft-defender-for-storage-classic).

### Can I return to per-transaction pricing after switching to per-storage account pricing?

Yes, you can [enable per-transaction pricing](#set-up-microsoft-defender-for-storage-classic) to migrate back from per-storage account pricing using all enablement methods except for the Azure portal.

### Will you continue supporting per-transaction pricing?

Yes, you can [enable per-transaction pricing](#set-up-microsoft-defender-for-storage-classic) from all the enablement methods, except for the Azure portal.

### Can I exclude specific storage accounts from protections in per-storage account pricing?

No, you can only enable per-storage account pricing for each subscription. All storage accounts in the subscription are protected.

### How long does it take for per-storage account pricing to be enabled?

When you enable Microsoft Defender for Storage at the subscription level for per-storage account or per-transaction pricing, it takes up to 24 hours for the plan to be enabled.

### Is there any difference in the feature set of per-storage account pricing compared to the legacy per-transaction pricing?

No. Both per-storage account and per-transaction pricing include the same features. The only difference is the pricing.

### How can I estimate the cost for each pricing?

To estimate the cost according to each pricing for your environment, we created a [pricing estimation workbook](https://aka.ms/dfstoragecosttool) and a PowerShell script that you can run in your environment.

## Next steps

- Check out the [alerts for Azure Storage](alerts-reference.md#alerts-azurestorage)
- Learn about the [features and benefits of Defender for Storage](defender-for-storage-introduction.md)