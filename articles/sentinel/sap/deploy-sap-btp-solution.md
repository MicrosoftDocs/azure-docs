---
title: Deploy Microsoft Sentinel Solution for SAP® BTP
description: This article introduces you to the process of deploying the Microsoft Sentinel Solution for SAP® BTP.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 03/30/2023
---

# Deploy Microsoft Sentinel Solution for SAP® BTP

This article describes how to deploy the Microsoft Sentinel Solution for SAP® BTP. The Microsoft Sentinel Solution for SAP® BTP monitors and protects your SAP Business Technology Platform (BTP) system: It collects audits and activity logs from the BTP infrastructure and BTP based apps, and detects threats, suspicious activities, illegitimate activities, and more. Read more about the solution. [Read more about the solution](sap-btp-solution-overview.md).

> [!IMPORTANT]
> The Microsoft Sentinel Solution for SAP® BTP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you begin, verify that:

- The Microsoft Sentinel solution is enabled. 
- You have a defined Microsoft Sentinel workspace and have read and write permissions to the workspace.
- Your organization uses SAP BTP (in a Cloud Foundry environment) to streamline interactions with SAP applications and other business applications.
- You have an SAP BTP account (which supports BTP accounts in the Cloud Foundry environment). You can also use a [SAP BTP trial account](https://cockpit.hanatrial.ondemand.com/).
- You have the SAP BTP auditlog-management service and service key (see [Set up the BTP account and solution](#set-up-the-btp-account-and-solution)). 
- You can create an [Azure Function App](../../azure-functions/functions-overview.md) with the `Microsoft.Web/Sites`, `Microsoft.Web/ServerFarms`, `Microsoft.Insights/Components`, and `Microsoft.Storage/StorageAccounts` permissions.
- You can create [Data Collection Rules/Endpoints](../../azure-monitor/essentials/data-collection-rule-overview.md) with the permissions: 
    - `Microsoft.Insights/DataCollectionEndpoints`, and `Microsoft.Insights/DataCollectionRules`.
    - Assign the Monitoring Metrics Publisher role to the Azure Function. 
- You have an [Azure Key Vault](../../key-vault/general/overview.md) to hold the SAP BTP client secret. 

## Set up the BTP account and solution

1. After you can log into your BTP account (see the [prerequisites](#prerequisites),) follow these [audit log retrieval steps](https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-retrieval-api-usage-for-subaccounts-in-cloud-foundry-environment) on the SAP BTP system. 
1. In the SAP BTP Cockpit, select the **Audit Log Management Service**.

    :::image type="content" source="./media/deploy-sap-btp-solution/btp-audit-log-management-service.png" alt-text="Screenshot of selecting the BTP Audit Log Management Service." lightbox="./media/deploy-sap-btp-solution/btp-audit-log-management-service.png":::

1. Create an instance of the Audit Log Management Service in the sub account.

    :::image type="content" source="./media/deploy-sap-btp-solution/btp-audit-log-sub-account.png" alt-text="Screenshot of creating an instance of the BTP subaccount." lightbox="./media/deploy-sap-btp-solution/btp-audit-log-sub-account.png":::
 
1.	Create a service key and record the `url`, `uaa.clientid`, `uaa.clientecret` and `uaa.url` values. These are required to deploy the data connector.
    
    Here's an example of these field values.

    - **url**: `https://auditlog-management.cfapps.us10.hana.ondemand.com`
    - **uaa.clientid**: `sb-ac79fee5-8ad0-4f88-be71-d3f9c566e73a!b136532|auditlog-management!b1237`
    - **uaa.clientsecret**: `682323d2-42a0-45db-a939-74639efde986$gR3x3ohHTB8iyYSKHW0SNIWG4G0tQkkMdBwO7lKhwcQ=`
    - **uaa.url**: `https://915a0312trial.authentication.us10.hana.ondemand.com`

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the **Microsoft Sentinel** service.
1. Select **Content hub**, and in the search bar, search for *BTP*.
1. Select **SAP BTP**.
1. Select **Install**.

    For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](../sentinel-solutions-deploy.md).

1. Select **Create**.

    :::image type="content" source="./media/deploy-sap-btp-solution/sap-btp-create-solution.png" alt-text="Screenshot of how to create the Microsoft Sentinel Solution® for SAP BTP." lightbox="./media/deploy-sap-btp-solution/sap-btp-create-solution.png":::

1. Select the resource group and the Sentinel workspace in which you want to deploy the solution. 
1. Select **Next** until you pass validation and select **Create**.
1. Once the solution deployment is complete, return to your Sentinel workspace and select **Data connectors**. 
1. In the search bar, type *BTP*, and select **SAP BTP (using Azure Function)**. 
1. Select **Open connector page**.
1. In the connector page, make sure that you meet the required prerequisites and follow the configuration steps. In step 2 of the data connector configuration, specify the parameters you defined in step 4 of this procedure.    
    
    > [!NOTE]
    > Retrieving audits for the global account doesn't automatically retrieve audits for the subaccount. Follow the connector configuration steps for each of the subaccounts you want to monitor, and also follow these steps for the global account. Review these [account auditing configuration considerations](#account-auditing-configuration-considerations).

1. Complete all configuration steps, including the Function App deployment and the Key Vault access policy configuration. 
1. Make sure that BTP logs are flowing into the Microsoft Sentinel workspace:
    1. Log in to your BTP subaccount and run a few activities that generate logs, such as logins, adding users, changing permissions, changing settings, and so on.
    1. Allow 20-30 minutes for the logs to start flowing.
    1. In the **SAP BTP** connector page, confirm that Microsoft Sentinel receives the BTP data, or query the `SAPBTPAuditLog_CL` table directly. 

1. Enable the [workbook](sap-btp-security-content.md#sap-btp-workbook) and the [analytics rules](sap-btp-security-content.md#built-in-analytics-rules) provided as part of the solution by following [these guidelines](../sentinel-solutions-deploy.md#analytics-rule).

## Account auditing configuration considerations

### Global account auditing configuration

When you enable audit log retrieval in the BTP cockpit for the Global account: If the subaccount for which you want to entitle the Audit Log Management Service is under a directory, you must entitle the service at the directory level first, and only then you can entitle the service at the subaccount level.

### Subaccount auditing configuration 

To enable auditing for a subaccount, follow the steps in the [SAP subaccounts audit retrieval API documentation](https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-retrieval-api-usage-for-subaccounts-in-cloud-foundry-environment).

However, while this guide explains how to enable the audit log retrieval using the Cloud Foundry CLI, you can also retrieve the logs via the UI:

1. In your subaccount Service Marketplace, create an instance of the **Audit Log Management Service**.
1. Create a service key in the new **Audit Log Management Service** instance.
1. View the Service key and retrieve the required parameters mentioned in step 2 of the configuration instructions in the data connector UI (**url**, **uaa.url**, **uaa.clientid**, **uaa.clientsecret**).

## Next steps

In this article, you learned how to deploy the Microsoft Sentinel Solution® for SAP BTP.
> 
> - [Learn how to enable the security content](../sentinel-solutions-deploy.md#analytics-rule)
> - [Review the solution's security content](sap-btp-security-content.md)
