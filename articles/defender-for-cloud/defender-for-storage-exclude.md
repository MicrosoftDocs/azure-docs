---
title: Exclude storage accounts from Microsoft Defender for Storage
description: Learn how to exclude specific Azure Storage accounts from Microsoft Defender for Storage protections.
ms.date: 08/04/2022
ms.topic: how-to
ms.author: benmansheim
author: bmansheim
---

# Exclude a storage account from per-transaction Microsoft Defender for Storage protections

When you [enable Microsoft Defender for Storage](../storage/common/azure-defender-storage-configure.md) on a subscription for the per-transaction pricing, all current and future Azure Storage accounts in that subscription are protected. You can exclude specific storage accounts from the Defender for Storage protections using the Azure portal, PowerShell, or the Azure CLI.

We don't recommend that you exclude storage accounts from Defender for Storage because attackers can use any opening in order to compromise your environment. If you want to optimize your Azure costs and remove storage accounts that you feel are low risk from Defender for Storage, you can use the [Price Estimation Workbook](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/28) in the Azure portal to evaluate the cost savings.

## Exclude an Azure Storage account protection on a subscription with per-transaction pricing

To exclude an Azure Storage account from Microsoft Defender for Storage:

### [**PowerShell**](#tab/enable-storage-protection-ps)

### Use PowerShell to exclude an Azure Storage account

1. If you don't have the Azure Az PowerShell module installed, install it using [the instructions from the Azure PowerShell documentation](/powershell/azure/install-az-ps).

1. Using an authenticated account, connect to Azure with the ``Connect-AzAccount`` cmdlet, as explained in [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps). 

1. Define the AzDefenderPlanAutoEnable tag on the storage account with the ``Update-AzTag`` cmdlet (replace the ResourceId with the resource ID of the relevant storage account):

    ```azurepowershell    
    Update-AzTag -ResourceId <resourceID> -Tag @{"AzDefenderPlanAutoEnable" = "off"} -Operation Merge 
    ```

    If you skip this stage, your untagged resources will continue receiving daily updates from the subscription level enablement policy. That policy will enable Defender for Storage again on the account.

    > [!TIP]
    > Learn more about tags in [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md).

1. Disable Microsoft Defender for Storage for the desired account on the relevant subscription with the ``Disable-AzSecurityAdvancedThreatProtection`` cmdlet (using the same resource ID): 

    ```azurepowershell    
    Disable-AzSecurityAdvancedThreatProtection -ResourceId <resourceId> 
    ```

    [Learn more about this cmdlet](/powershell/module/az.security/disable-azsecurityadvancedthreatprotection).


### [**Azure CLI**](#tab/enable-storage-protection-cli)

### Use Azure CLI to exclude an Azure Storage account

1. If you don't have Azure CLI installed, install it using [the instructions from the Azure CLI documentation](/cli/azure/install-azure-cli).

1. Using an authenticated account, connect to Azure with the ``login`` command as explained in [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) and enter your account credentials when prompted:

    ```azurecli
    az login
    ```

1. Define the AzDefenderPlanAutoEnable tag on the storage account with the ``tag update`` command (replace the ResourceId with the resource ID of the relevant storage account):

    ```azurecli    
    az tag update --resource-id MyResourceId --operation merge --tags AzDefenderPlanAutoEnable=off
    ```

    If you skip this stage, your untagged resources will continue receiving daily updates from the subscription level enablement policy. That policy will enable Defender for Storage again on the account.

    > [!TIP]
    > Learn more about tags in [az tag](/cli/azure/tag).

1. Disable Microsoft Defender for Storage for the desired account on the relevant subscription with the `security atp storage` command (using the same resource ID):

    ```azurecli    
    az security atp storage update --resource-group MyResourceGroup  --storage-account MyStorageAccount --is-enabled false 
    ```

    [Learn more about this command](/cli/azure/security/atp/storage).


### [**Azure portal**](#tab/enable-storage-protection-portal)

### Use the Azure portal to exclude an Azure Storage account

1. Define the AzDefenderPlanAutoEnable tag on the storage account:

    1. From the Azure portal, open the storage account and select the **Tags** page.
    1. Enter the tag name **AzDefenderPlanAutoEnable** and set the value to **off**.
    1. Select **Apply**.

    :::image type="content" source="media/defender-for-storage-exclude/define-tag-storage-account.png" alt-text="Screenshot of how to add a tag to a storage account in the Azure portal." lightbox="media/defender-for-storage-exclude/define-tag-storage-account.png":::
    
1. Verify that the tag has been added successfully. It should look similar to this:

    :::image type="content" source="media/defender-for-storage-exclude/define-tag-storage-account-success.png" alt-text="Screenshot of a tag on a storage account in the Azure portal." lightbox="media/defender-for-storage-exclude/define-tag-storage-account-success.png":::

1. Disable and then enable the Microsoft Defender for Storage on the subscription: 

    1. From the Azure portal, open **Microsoft Defender for Cloud**. 
    1. Open **Environment settings** > select the relevant subscription > **Defender plans** > toggle the Defender for Storage plan off > select **Save** > turn it back on > select **Save**. 

    :::image type="content" source="media/defender-for-storage-exclude/defender-plan-toggle.png" alt-text="Screenshot of disabling and enabling the Microsoft Defender for Storage plan from Microsoft Defender for Cloud." lightbox="media/defender-for-storage-exclude/defender-plan-toggle.png":::

---

## Exclude an Azure Databricks Storage account

### Exclude an active Databricks workspace

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
1. Toggle the Defender for Storage plan to **On**.
1. Select **Save**.

The tags will be inherited by the Storage account of the Databricks workspace and prevent Defender for Storage from turning on. 

> [!NOTE]
> Tags can't be added directly to the Databricks Storage account, or its Managed Resource Group.

### Prevent auto-enabling on a new Databricks workspace storage account 

When you create a new Databricks workspace, you have the ability to add a tag that will prevent your Microsoft Defender for Storage account from enabling automatically.

**To prevent auto-enabling on a new Databricks workspace storage account**:

1. Follow [these steps](/azure/databricks/scenarios/quickstart-create-Databricks-workspace-portal?tabs=azure-portal) to create a new Azure Databricks workspace.
 
1. In the Tags tab, enter a tag named `AzDefenderPlanAutoEnable`.
 
1. Enter the value `off`.
 
    :::image type="content" source="media/defender-for-storage-exclude/tag-off.png" alt-text="Screenshot that shows how to create a tag in the Databricks workspace.":::

1. Continue following the instructions to create your new Azure Databricks workspace.
 
The Microsoft Defender for Storage account will inherit the tag of the Databricks workspace, which will prevent Defender for Storage from turning on automatically.

## Next steps

- Explore the [Microsoft Defender for Storage – Price Estimation Dashboard](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-storage-price-estimation-dashboard/ba-p/2429724)