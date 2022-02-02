---
title: Enable Microsoft Defender for Cosmos DB
description: Learn how to enable Microsoft Defender for Cosmos DB's enhanced security features.
ms.topic: quickstart
ms.date: 02/02/2022
---

# Quickstart: Enable Microsoft Defender for Cosmos DB

Microsoft Defender for Cloud can be configured in the following two ways:

- [Subscription level](#subscription-level) - Enables Microsoft Defender for Cloud protection for all database types in your subscription (recommended). 

- [Resource level](#resource-level) - Enables Microsoft Defender for Cloud for a specific Cosmos DB account.

## Prerequisites

- 

## Subscription level

The subscription level enablement, enables Microsoft Defender for Cloud protection for all database types in your subscription (recommended). 

You can enable Microsoft Defender for Cloud protection on your subscription in order to protect all database types, for example, Cosmos DB, Azure SQL Database, Azure SQL servers on machines, and OSS RDBs. You can also select specific resource types to protect when you configure your plan. 
 
When you enable Microsoft Defender for Cloud's enhanced security features on your subscription, Microsoft Defender for Cosmos DB is automatically enabled for all of your Cosmos DB accounts.  

**To enable Microsoft Defender for Cosmos DB at the subscription level**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**. 

1. Select the relevant subscription. 

1. Select **Enable all**.

1. Select **Save**.

**To select resource types to protect when you configure your plan**: 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**. 

1. Select the relevant subscription. 

1. Locate Databases and toggle the switch to **On**.

    :::image type="content" source="media/quickstart-enable-defender-for-cosmos/protection-type.png" alt-text="Screenshot showing the available protections you can enable.":::

1. Select **Select types**

1. Toggle the desired resource type switches to **On**.

    :::image type="content" source="media/quickstart-enable-defender-for-cosmos/resource-type.png" alt-text="Screenshot showing the available resources you can enable.":::

1. Select **Save**.

## Resource level

The resource level enables Microsoft Defender for Cloud for a specific Cosmos DB account. This can be accomplished through the Azure portal, PowerShell, or the Azure CLI.

**To enables Microsoft Defender for Cloud for a specific Cosmos DB account**:

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Storage account** > **`Your account`** > **Security + networking** > **Security**.

1. Select **Enable Microsoft Defender for Storage**.

    :::image type="content" source="media/quickstart-enable-defender-for-cosmos/enable-storage.png" alt-text="Screenshot of the option to enable Microsoft Defender for Storage on your specified Cosmos DB account.":::

### [PowerShell](#tab/azure-powershell)

1. Install the [Az.Security](https://www.powershellgallery.com/packages/Az.Security/1.1.1) module.

1. Call the [Enable-AzSecurityAdvancedThreatProtection](/powershell/module/az.security/enable-azsecurityadvancedthreatprotection?view=azps-7.1.0) command.

    ```powershell
    Enable-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/<Your subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.DocumentDb/databaseAccounts/myCosmosDBAccount/" 
    ```

1.  Verify the Microsoft Defender for Cosmos DB setting for your storage account through the PowerShell call [Get-AzSecurityAdvancedThreatProtection](/powershell/module/az.security/get-azsecurityadvancedthreatprotection?view=azps-7.1.0) command.

    ```powershell
    Get-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/<Your subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.DocumentDb/databaseAccounts/myCosmosDBAccount/" 
    ```

### [ARM template](#tab/arm-template)

Use an Azure Resource Manager template to deploy an Azure Storage account with Microsoft Defender for Storage enabled. For more information, see [Create a Cosmos DB account with Defender for Cosmos DB enabled](https://azure.microsoft.com/resources/templates/cosmosdb-advanced-threat-protection-create-account/).

---

## Simulate security alerts from Microsoft Defender for Cosmos DB

A full list of [supported alerts](alerts-reference.md) is available in the reference table of all Defender for Cloud security alerts. 

You can use sample Defender for Cosmos DB alerts to evaluate their value, and capabilities. Sample alerts will also validate any configurations you've made for your security alerts (such as SIEM integrations, workflow automation, and email notifications). 

**To create sample alerts from Microsoft Defender for Cosmos DB**: 

1. Sign in to the  [Azure portal](https://portal.azure.com/) as a Subscription Contributor user.

1. Navigate to the Alerts page. 

1. Select **Create sample alerts**. 

1. Select the subscription. 

1. Select the relevant Microsoft Defender plan(s). 

1. Select **Create sample alerts**.

    :::image type="content" source="media/quickstart-enable-defender-for-cosmos/sample-alerts.png" alt-text="Screenshot showing the order needed to create an alert.":::

After a few minutes, the alerts will appear in the security alerts page. Alerts will also appear anywhere else that you've configured to receive your Microsoft Defender for Cloud security alerts, for example, connected SIEMs, and email notifications. 

## Next Steps

In this article, you learned how to enable Microsoft Defender for Cosmos DB, and how to simulate security alerts.

Next, learn more about [sample alerts](alert-validation.md).
