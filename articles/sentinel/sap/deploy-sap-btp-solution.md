---
title: Deploy Microsoft Sentinel solution for SAP BTP
description: Learn how to deploy the Microsoft Sentinel solution for SAP Business Technology Platform (BTP) system.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 03/30/2023

# customer intent: As an SAP admin, I want to know how to deploy the Microsoft Sentinel solution for SAP BTP so that I can plan a deployment.
---

# Deploy the Microsoft Sentinel solution for SAP BTP

This article describes how to deploy the Microsoft Sentinel solution for SAP Business Technology Platform (BTP) system. The Microsoft Sentinel solution for SAP BTP monitors and protects your SAP BTP system. It collects audit logs and activity logs from the BTP infrastructure and BTP-based apps, and then detects threats, suspicious activities, illegitimate activities, and more. [Read more about the solution](sap-btp-solution-overview.md).

> [!IMPORTANT]
> The Microsoft Sentinel solution for SAP BTP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you begin, verify that:

- The Microsoft Sentinel solution is enabled.
- You have a defined Microsoft Sentinel workspace, and you have read and write permissions to the workspace.
- Your organization uses SAP BTP (in a Cloud Foundry environment) to streamline interactions with SAP applications and other business applications.
- You have an SAP BTP account (which supports BTP accounts in the Cloud Foundry environment). You can also use a [SAP BTP trial account](https://cockpit.hanatrial.ondemand.com/).
- You have the SAP BTP auditlog-management service and service key (see [Set up the BTP account and solution](#set-up-the-btp-account-and-solution)).
- You can create an [Azure function app](../../azure-functions/functions-overview.md) by using the Microsoft.Web/Sites, Microsoft.Web/ServerFarms, Microsoft.Insights/Components, and Microsoft.Storage/StorageAccounts permissions.
- You can create [data collection rules and endpoints](../../azure-monitor/essentials/data-collection-rule-overview.md) by using these permissions:
  - Microsoft.Insights/DataCollectionEndpoints and Microsoft.Insights/DataCollectionRules.
  - Assign the Monitoring Metrics Publisher role to the function app.
- You have an [Azure Key Vault](../../key-vault/general/overview.md) to hold the SAP BTP client secret.

## Set up the BTP account and solution

To set up the BTP account and the solution:

1. After you can sign in to your BTP account (see the [prerequisites](#prerequisites)), follow the [audit log retrieval steps](https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-retrieval-api-usage-for-subaccounts-in-cloud-foundry-environment) on the SAP BTP system.

1. In the SAP BTP cockpit, select the **Audit Log Management Service**.

    :::image type="content" source="./media/deploy-sap-btp-solution/btp-audit-log-management-service.png" alt-text="Screenshot that shows selecting the BTP Audit Log Management Service." lightbox="./media/deploy-sap-btp-solution/btp-audit-log-management-service.png":::

1. Create an instance of the Audit Log Management Service in the BTP subaccount.

    :::image type="content" source="./media/deploy-sap-btp-solution/btp-audit-log-sub-account.png" alt-text="Screenshot that shows creating an instance of the BTP subaccount." lightbox="./media/deploy-sap-btp-solution/btp-audit-log-sub-account.png":::

1. Create a service key and record the values for `url`, `uaa.clientid`, `uaa.clientecret`, and `uaa.url`. These values are required to deploy the data connector.

    Here are examples of these field values:

    - **url**: `https://auditlog-management.cfapps.us10.hana.ondemand.com`
    - **uaa.clientid**: `sb-ac79fee5-8ad0-4f88-be71-d3f9c566e73a!b136532|auditlog-management!b1237`
    - **uaa.clientsecret**: `682323d2-42a0-45db-a939-74639efde986$gR3x3ohHTB8iyYSKHW0SNIWG4G0tQkkMdBwO7lKhwcQ=`
    - **uaa.url**: `https://915a0312trial.authentication.us10.hana.ondemand.com`

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the Microsoft Sentinel service.
1. Select **Content hub**, and in the search bar, search for *BTP*.
1. Select **SAP BTP**.
1. Select **Install**.

    For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](../sentinel-solutions-deploy.md).

1. Select **Create**.

    :::image type="content" source="./media/deploy-sap-btp-solution/sap-btp-create-solution.png" alt-text="Screenshot that shows how to create the Microsoft Sentinel solution  for SAP BTP." lightbox="./media/deploy-sap-btp-solution/sap-btp-create-solution.png":::

1. Select the resource group and the Microsoft Sentinel workspace in which to deploy the solution.
1. Select **Next** until you pass validation, and then select **Create**.
1. When the solution deployment is finished, return to your Microsoft Sentinel workspace and select **Data connectors**.
1. In the search bar, enter **BTP**, and then select **SAP BTP (using Azure Function)**.
1. Select **Open connector page**.
1. On the connector page, make sure that you meet the required prerequisites and complete the configuration steps. In step 2 of the data connector configuration, specify the parameters that you defined in step 4 in this section.

    > [!NOTE]
    > Retrieving audits for the global account doesn't automatically retrieve audits for the subaccount. Follow the connector configuration steps for each of the subaccounts you want to monitor, and also follow these steps for the global account. Review these [account auditing configuration considerations](#consider-your-account-auditing-configurations).

1. Complete all configuration steps, including the function app deployment and the Azure Key Vault access policy configuration.
1. Make sure that BTP logs are flowing into the Microsoft Sentinel workspace:

    1. Sign in to your BTP subaccount and run a few activities that generate logs, such as sign-ins, adding users, changing permissions, and changing settings.
    1. Allow 20 to 30 minutes for the logs to start flowing.
    1. On the **SAP BTP** connector page, confirm that Microsoft Sentinel receives the BTP data, or query the **SAPBTPAuditLog_CL** table directly.

1. Enable the [workbook](sap-btp-security-content.md#sap-btp-workbook) and the [analytics rules](sap-btp-security-content.md#built-in-analytics-rules) that are provided as part of the solution by following [these guidelines](../sentinel-solutions-deploy.md#analytics-rule).

## Consider your account auditing configurations

The final step in the deployment process is to consider your global account and subaccount auditing configurations.

### Global account auditing configuration

When you enable audit log retrieval in the BTP cockpit for the global account: If the subaccount for which you want to entitle the Audit Log Management Service is under a directory, you must entitle the service at the directory level first. Only then can you entitle the service at the subaccount level.

### Subaccount auditing configuration

To enable auditing for a subaccount, complete the steps in the [SAP subaccounts audit retrieval API documentation](https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-retrieval-api-usage-for-subaccounts-in-cloud-foundry-environment).

The API documentation describes how to enable the audit log retrieval by using the Cloud Foundry CLI.

You also can retrieve the logs via the UI:

1. In your subaccount in SAP Service Marketplace, create an instance of **Audit Log Management Service**.
1. In the new instance, create a service key.
1. View the service key and retrieve the required parameters from step 4 of the configuration instructions in the data connector UI (**url**, **uaa.url**, **uaa.clientid**, and **uaa.clientsecret**).

## Related content

- [Learn how to enable the security content](../sentinel-solutions-deploy.md#analytics-rule)
- [Review the solution's security content](sap-btp-security-content.md)
