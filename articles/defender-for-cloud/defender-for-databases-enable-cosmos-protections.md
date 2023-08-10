---
title: Enable Microsoft Defender for Azure Cosmos DB
description: Learn how to enable enhanced security features in Microsoft Defender for Azure Cosmos DB.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 11/28/2022
---

# Enable Microsoft Defender for Azure Cosmos DB

 Microsoft Defender for Azure Cosmos DB protection is available at both the [Subscription level](#enable-database-protection-at-the-subscription-level), and resource level. You can enable Microsoft Defender for Cloud on your subscription to protect all database types on your subscription including Microsoft Defender for Azure Cosmos DB (recommended). You can also choose to enable Microsoft Defender for Azure Cosmos DB at the [Resource level](#enable-microsoft-defender-for-azure-cosmos-db-at-the-resource-level) to protect a specific Azure Cosmos DB account.

## Prerequisites

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).

## Enable database protection at the subscription level

The subscription level enablement, enables Microsoft Defender for Cloud protection for all database types in your subscription (recommended). 

You can enable Microsoft Defender for Cloud protection on your subscription in order to protect all database types, for example, Azure Cosmos DB, Azure SQL Database, Azure SQL servers on machines, and OSS RDBs. You can also select specific resource types to protect when you configure your plan. 
 
When you enable Microsoft Defender for Cloud's enhanced security features on your subscription, Microsoft Defender for Azure Cosmos DB is automatically enabled for all of your Azure Cosmos DB accounts.  

**To enable database protection at the subscription level**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**. 

1. Select the relevant subscription. 

1. Locate Databases and toggle the switch to **On**.

    :::image type="content" source="media/quickstart-enable-defender-for-cosmos/protection-type.png" alt-text="Screenshot showing the available protections you can enable." lightbox="media/quickstart-enable-defender-for-cosmos/protection-type-expanded.png":::

1. Select **Save**.

**To select specific resource types to protect when you configure your plan**: 

1. Follow steps 1 - 4 above.

1. Select **Select types**

    :::image type="content" source="media/quickstart-enable-defender-for-cosmos/select-type.png" alt-text="Screenshot showing where the option to select the type is located.":::

1. Toggle the desired resource type switches to **On**.

    :::image type="content" source="media/quickstart-enable-defender-for-cosmos/resource-type.png" alt-text="Screenshot showing the available resources you can enable.":::

1. Select **Confirm**.

## Enable Microsoft Defender for Azure Cosmos DB at the resource level

You can enable Microsoft Defender for Cloud on a specific Azure Cosmos DB account through the Azure portal, PowerShell, or the Azure CLI.

**To enable Microsoft Defender for Cloud for a specific Azure Cosmos DB account**:

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **your Azure Cosmos DB account** > **Settings**.

1. Select **Microsoft Defender for Cloud**.

1. Select **Enable Microsoft Defender for Azure Cosmos DB**.

    :::image type="content" source="media/quickstart-enable-defender-for-cosmos/enable-storage.png" alt-text="Screenshot of the option to enable Microsoft Defender for Azure Cosmos DB on your specified Azure Cosmos DB account." lightbox="media/quickstart-enable-defender-for-cosmos/enable-storage.png":::

### [PowerShell](#tab/azure-powershell)

1. Install the [Az.Security](https://www.powershellgallery.com/packages/Az.Security/1.1.1) module.

1. Call the [Enable-AzSecurityAdvancedThreatProtection](/powershell/module/az.security/enable-azsecurityadvancedthreatprotection) command.

    ```powershell
    Enable-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/<Your subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.DocumentDb/databaseAccounts/myCosmosDBAccount/" 
    ```

1.  Verify the Microsoft Defender for Azure Cosmos DB setting for your storage account through the PowerShell call [Get-AzSecurityAdvancedThreatProtection](/powershell/module/az.security/get-azsecurityadvancedthreatprotection) command.

    ```powershell
    Get-AzSecurityAdvancedThreatProtection -ResourceId "/subscriptions/<Your subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.DocumentDb/databaseAccounts/myCosmosDBAccount/" 
    ```

### [ARM template](#tab/arm-template)

Use an Azure Resource Manager template to deploy an Azure Cosmos DB account with Microsoft Defender for Azure Cosmos DB enabled. For more information, see [Create an Azure Cosmos DB account with Microsoft Defender for Azure Cosmos DB enabled](https://github.com/azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.documentdb/microsoft-defender-cosmosdb-create-account).

---

## Simulate security alerts from Microsoft Defender for Azure Cosmos DB

A full list of [supported alerts](alerts-reference.md) is available in the reference table of all Defender for Cloud security alerts. 

You can use sample Microsoft Defender for Azure Cosmos DB alerts to evaluate their value, and capabilities. Sample alerts will also validate any configurations you've made for your security alerts (such as SIEM integrations, workflow automation, and email notifications). 

**To create sample alerts from Microsoft Defender for Azure Cosmos DB**: 

1. Sign in to the  [Azure portal](https://portal.azure.com/) as a Subscription Contributor user.

1. Navigate to the security alerts page. 

1. Select **Sample alerts**. 

1. Select the subscription. 

1. Select the relevant Microsoft Defender plan(s). 

1. Select **Create sample alerts**.

    :::image type="content" source="media/quickstart-enable-defender-for-cosmos/sample-alerts.png" alt-text="Screenshot showing the order needed to create an alert.":::

After a few minutes, the alerts will appear in the security alerts page. Alerts will also appear anywhere that you've configured to receive your Microsoft Defender for Cloud security alerts. For example, connected SIEMs, and email notifications. 

## Next Steps

In this article, you learned how to enable Microsoft Defender for Azure Cosmos DB, and how to simulate security alerts.

> [!div class="nextstepaction"]
> [Automate responses to Microsoft Defender for Cloud triggers](workflow-automation.md).
