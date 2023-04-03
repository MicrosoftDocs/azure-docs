---
title: Deploy Microsoft Sentinel Solution for SAP® BTP
description: This article introduces you to the process of deploying the Microsoft Sentinel Solution for SAP® BTP.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 03/30/2023
---

# Deploy Microsoft Sentinel Solution for SAP® BTP

This article describes how to deploy the Microsoft Sentinel Solution for SAP® BTP. The Microsoft Sentinel Solution for SAP® BTP monitors and protects your SAP Business Technology Platform (BTP) system, by collecting audits and activity logs from the BTP infrastructure and BTP based apps, and detecting threats, suspicious activities, illegitimate activities, and more. Read more about the solution. [Read more about the solution](sap-btp-solution-overview.md).

> [!IMPORTANT]
> The Microsoft Sentinel Solution for SAP® BTP is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you begin, verify that:

- The Microsoft Sentinel solution is enabled. 
- You have a defined Microsoft Sentinel workspace and have read and write permissions to the workspace.
- Your organization uses SAP BTP (in a Cloud Foundry environment) to streamline interactions with SAP applications and other business applications.
- You have a SAP BTP account ready. You can also use a [SAP BTP trial account](https://cockpit.hanatrial.ondemand.com/).
- Your Microsoft Sentinel user is assigned the [Microsoft Sentinel Contributor](../../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor).
- Your SAP user is assigned the SAP BTP Subaccount Administrator role collection role.
- You can create an [Azure Function App](../../azure-functions/functions-overview.md) with the `Microsoft.Web/Sites` and `Microsoft.Web/ServerFarms` permissions.
- You can create [Data Collection Rules/Endpoints](../../azure-monitor/essentials/data-collection-rule-overview.md) with the permissions: 
    - `Microsoft.Insights/Components`, `Microsoft.Storage/StorageAccounts`, `Microsoft.Insights/DataCollectionEndpoints`, and `Microsoft.Insights/DataCollectionRules`
    - Assign the Monitoring Metrics Publisher role to the Azure Function. 
- You have an [Azure Key Vault](../../key-vault/general/overview.md) to hold the SAP BTP client secret. 
- You have the SAP BTP auditlog-management service and key: Connectivity and permissions to retrieve SAP BTP Audit logs in the Cloud Foundry environment.

## Set up the solution

1. After you can log into your BTP account (see the [prerequisites](#prerequisites),) follow these [audit log retrieval steps](https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-retrieval-api-usage-for-subaccounts-in-cloud-foundry-environment) on the SAP BTP system. 
1. In the SAP BTP Cockpit, select the **Audit Log Management Service**.
1. Create an instance of the Audit Log Management Service in the sub account.

    :::image type="content" source="./media/deploy-sap-btp-solution/audit-log-sub-account.png" alt-text="Screenshot of how to create an instance of the Audit Log Management Service in the BTP sub account.":::
 
1.	Create a service key and record the following details. These are required to deploy the data connector.

    - url: 
    - uaa.clientid
    - uaa.url
    
    :::image type="content" source="./media/deploy-sap-btp-solution/sap-btp-configuration-parameters.png" alt-text="Screenshot of the configuration parameters for the SAP BTP connector.":::

1. From the [Azure portal](https://portal.azure.com/), navigate to the **Microsoft Sentinel** service.

1. Select **Content hub**, and in the search bar, search for *BTP*.

1. Select **Sentinel Solution for SAP BTP**.

1. Select **Install**.

    For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](../sentinel-solutions-deploy.md).

1. Select **Create**.

    :::image type="content" source="./media/deploy-sap-btp-solution/sap-btp-create-solution.png" alt-text="Screenshot of how to create the Microsoft Sentinel Solution® for SAP BTP.":::

1. Select the resource group and the Sentinel workspace in which you want to deploy the solution. 
1. Select **Next** until you pass validation and select **Create**.
1. Once the solution deployment is complete, return to your Sentinel workspace and select **Data connectors**. 
1. In the search bar, type *BTP*, and select **SAP BTP (using Azure Function)**. 
1. Select **Open connector page**.
1. In the connector page, make sure that you meet the required prerequisites and follow the configuration steps. In step 2 of the data connector configuration, specify the parameters you defined in step 4 of this procedure.    
    
    > [!NOTE]
    > Retrieving audits for the global account doesn't automatically retrieve audits for the sub-account. Follow the connector configuration steps for each of the sub-accounts you want to monitor, and also follow these steps for the global account. Review these [account auditing configuration considerations](#account-auditing-configuration-considerations).

1. Complete all configuration steps, including the Function App deployment and the Key Vault access policy configuration. 
1. Make sure that BTP logs are flowing into the Microsoft Sentinel workspace:
    1. Log in to your BTP sub-account and run a few activities that generate logs, such as logins, adding users, changing permissions, changing settings, and so on.
    1. Allow 20-30 minutes for the logs to start flowing.
    1. In the **SAP BTP** connector page, confirm that Microsoft Sentinel receives the BTP data, or query the `SAPBTPAuditLog_CL` table directly. 

1. Enable the [workbook](sap-btp-security-content.md#sap-btp-workbook) and the [analytics rules](sap-btp-security-content.md#built-in-analytics-rules) provided as part of the solution by following [these guidelines](../sentinel-solutions-deploy.md#analytics-rule).

## Account auditing configuration considerations

### Global account auditing configuration

When you enable audit log retrieval in the BTP cockpit for the Global account: If the sub-account for which you want to entitle the Audit Log Management Service is under a directory, you must entitle the service at the directory level first, and only then you can entitle the service at the sub-account level.

### Sub-account auditing configuration 

To enable auditing for a sub-account, follow the steps in the [SAP Sub-accounts audit retrieval API documentation](https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-retrieval-api-usage-for-subaccounts-in-cloud-foundry-environment).

However, while this guide explains how to enable the audit log retrieval using the Cloud Foundry CLI, you can also do this via the UI:

1. In your sub-account Service Marketplace, create an instance of the **Audit Log Management Service**.
1. Create a service key in the new **Audit Log Management Service** instance.
1. View the Service key and retrieve the required parameters mentioned in step 2 of the configuration instructions in the data connector UI (**url**, **uaa.url**, **uaa.clientid**, **uaa.clientsecret**).

## Next steps

In this article, you learned how to deploy the Microsoft Sentinel Solution® for SAP BTP.
> 
> - [Learn how to enable the security content](../sentinel-solutions-deploy.md#analytics-rule)
> - [Review the solution's security content](sap-btp-security-content.md)