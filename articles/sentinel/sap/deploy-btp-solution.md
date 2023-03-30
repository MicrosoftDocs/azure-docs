---
title: Deploy Microsoft Sentinel solution for SAP BTP
description: This article introduces you to the process of deploying the Microsoft Sentinel solution for SAP BTP.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 03/30/2023
---

# Deploy Microsoft Sentinel solution for SAP BTP

This article describes how to deploy the Microsoft Sentinel solution for SAP BTP. The Microsoft Sentinel solution for SAP BTP monitors and protects your SAP Business Technology Platform (BTP) system, by collecting audits and activity logs from the BTP infrastructure and BTP based apps, and detecting threats, suspicious activities, illegitimate activities, and more. Read more about the solution. [Read more about the solution](btp-solution-overview.md).

## Overview

## Prerequisites

Before you begin, verify that you have:

- The Microsoft Sentinel solution enabled. 
- A defined Microsoft Sentinel workspace.
- You/your organization must leverage SAP BTP (in Cloud Foundry environment) to streamline interactions with SAP applications and other business applications.
- Your user must be assigned the [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) role on the workspace.
- SAP BTP Subaccount Administrator role collection. · Workspace: read and write permissions on the workspace are required. · Microsoft.Web/Sites, Microsoft.Web/ServerFarms, Microsoft.Insights/Components, Microsoft.Storage/StorageAccounts: Read and write permissions to Azure Functions to create a Function App is required. [Learn more about Azure Functions](../../azure-functions/functions-overview.md). · Microsoft.Insights/DataCollectionEndpoints, Microsoft.Insights/DataCollectionRules: Read and write permissions to Data Collection Rules/Endpoints is required. Permissions to assign the Monitoring Metrics Publisher role to the Azure Function is required. [Learn more about Data Collection Rules](../../azure-monitor/essentials/data-collection-rule-overview.md). · Azure Key Vault: A Key Vault to hold SAP BTP client secret. [Learn more about Key Vault](../../key-vault/general/overview.md). · SAP BTP auditlog-management service, and key: Connectivity and permissions to retrieve SAP BTP Audit logs in the Cloud Foundry environment.

## Set up the solution

Have a SAP BTP account ready. You can also use a SAP BTP trial account: https://cockpit.hanatrial.ondemand.com/

2. Login to the azure portal with the solution preview feature flag: https://portal.azure.com/?feature.loadTemplateSolutions=true

3. Navigate to the content hub blade in your Sentinel workspace, search for BTP in the search bar, choose the solution titled “SAP BTP pP” and click “Install” and then “Create” in the next screen::

TBD - screenshot

TBD - screenshot

Choose the resource group and the Sentinel workspace in which you want to deploy the solution and hit next until you pass validation and hit “Create”.

5. Once the solution deployment is complete go back to your Sentinel workspace, search for the BTP data connector in the data connectors gallery and hit “Open connector page”:

TBD - screenshot

In the connector page assure you meet the required prerequisites and follow the configuration steps.

Screenshot to help with identifying the correct parameters in Step 2 of the data connector configuration:

TBD - screenshot

Note: Retrieving audits for the Global account does not automatically retrieve audits for the subaccount. You will need to follow the connector configuration steps for each of the subaccounts you want to monitor as well as for the global account.

Global account auditing configuration note: In the process of enabling the audit log retrieval in the BTP cockpit for Global account, it is important to note that if the subaccount you want to entitle the service (Audit Log Management Service) is under a directory, then the service must be entitled at the directory level first and only then you can entitle it at the subaccount level.

Subaccount auditing configuration note: To enable auditing for a subaccount you will need to follow steps provided by SAP in the [Subaccounts audit retrieval API documentation](https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-retrieval-api-usage-for-subaccounts-in-cloud-foundry-environment).

However, the above guide explains how to enable the audit log retrieval using the Cloud Foundry CLI. This could also be done through the UI by following these steps:

a. In your subaccount Service Marketplace create an instance of the “Audit Log Management Service”.

b. Create a service key in the “Audit Log Management Service” instance that was just created.

c. View the Service key that was created and fetch from it the required parameters mentioned in step 2 of the configuration instructions in the data connector UI (url, uaa.url, uaa.clientid, uaa.clientsecret).

7. Once all configuration steps are completed successfully (including the function app deployment and the Key Vault access policy configuration) validate that BTP logs are flowing to the Sentinel workspace:

a. Login to your BTP subaccount and run a few activities that would generate logs (logins, adding users, changing permissions, changing settings, etc)

b. Allow 20-30 minutes for the logs to start flowing.

c. Confirm in the SAP BTP connector page that data is received.

d. You can also query directly the “SAPBTPAuditLog_CL” table. 8. Enable the workbook and the analytics rules that are provided as part of the solution by following [these guidelines](../sentinel-solutions-deploy.md#analytics-rule).

9. You are done with deploying the solution! Now you are ready to start testing it.


## Next steps

Begin the deployment of the Microsoft Sentinel solution for SAP® applications by reviewing the prerequisites:
> [!div class="nextstepaction"]
> [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
