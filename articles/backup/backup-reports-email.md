---
title: Email Azure Backup Reports
description: Create automated tasks to receive periodic reports via email
ms.topic: conceptual
ms.date: 03/01/2021
---

# Email Azure Backup Reports

Using the **Email Report** feature available in Backup Reports, you can create automated tasks to receive periodic reports via email. This feature works by deploying a logic app in your Azure environment that queries data from your selected Log Analytics (LA) workspaces, based on the inputs that you provide. [Learn more about Logic apps and their pricing](https://azure.microsoft.com/pricing/details/logic-apps/).

## Getting Started

To configure email tasks via Backup Reports, perform the following steps:

1.	Navigate to **Backup Center** > **Backup Reports** and click on the **Email Report** tab.
2.	Create a task by specifying the following information:
    * **Task Details** - The name of the logic app to be created, and the subscription, resource group, and location in which it should be created. Note that the logic app can query data across multiple subscriptions, resource groups, and locations (as selected in the Report Filters section), but is created in the context of a single subscription, resource group and location.
    * **Data To Export** - The tab which you wish to export. You can either create a single task app per tab, or email all tabs using a single task, by selecting the **All Tabs** option.
    * **Email options**: The email frequency, recipient email ID(s), and the email subject.

    ![Email Tab](./media/backup-azure-configure-backup-reports/email-tab.png)

3.	After you click **Submit** and **Confirm**, the logic app will get created. The logic app and the associated API connections are created with the tag **UsedByBackupReports: true** for easy discoverability. You'll need to perform a one-time authorization step for the logic app to run successfully, as described in the section below.

## Authorize connections to Azure Monitor Logs and Office 365

The logic app uses the [azuremonitorlogs](https://docs.microsoft.com/connectors/azuremonitorlogs/) connector for querying the LA workspace(s) and uses the [Office365 Outlook](https://docs.microsoft.com/connectors/office365connector/) connector for sending emails. You will need to perform a one-time authorization for these two connectors. 
 
To perform the authorization, follow the steps below:

1.	Navigate to **Logic Apps** in the Azure portal.
2.	Search for the name of the logic app you have created and navigate to the resource.

    ![Logic Apps](./media/backup-azure-configure-backup-reports/logic-apps.png)

3.	Click on the **API connections** menu item.

    ![API Connections](./media/backup-azure-configure-backup-reports/api-connections.png)

4.	You will see two connections with the format `<location>-azuremonitorlogs` and `<location>-office365` - that is, _eastus-azuremonitorlogs_ and _eastus-office365_.
5.	Navigate to each of these connections and select the **Edit API connection** menu item. In the screen that appears, select **Authorize**, and save the connection once authorization is complete.

    ![Authorize connection](./media/backup-azure-configure-backup-reports/authorize-connections.png)

6.	To test whether the logic app works after authorization, you can navigate back to the logic app, open **Overview** and select **Run Trigger** in the top pane, to test whether an email is being generated successfully.

## Contents of the email

* All the charts and graphs shown in the portal are available as inline content in the email.
* The grids shown in the portal are available as *.csv attachments in the email.
* The data shown in the email uses all the report-level filters selected by the user in the report, at the time of creating the email task.
* Tab-level filters such as **Backup Instance Name**, **Policy Name** and so on, are not applied. The only exception to this is the **Retention Optimizations** grid in the **Optimize** tab, where the filters for **Daily**, **Weekly**, **Monthly** and **Yearly** RP retention are applied.
* The time range and aggregation type (for charts) are based on the user’s time range selection in the reports. For example, if the time range selection is last 60 days (translating to weekly aggregation type), and email frequency is daily, the recipient will receive an email every day with charts spanning data taken over the last 60-day period, with data aggregated at a weekly level.

## Troubleshooting issues

If you aren't receiving emails as expected even after successful deployment of the logic app, you can follow the steps below to troubleshoot the configuration:

### Scenario 1: Receiving neither a successful email nor an error email

* This issue could be occurring because the Outlook API connector is not authorized. To authorize the connection, follow the authorization steps provided above.

* This issue could also be occurring if you have specified an incorrect email recipient while creating the logic app. To verify that the email recipient has been specified correctly, you can navigate to the logic app in the Azure portal, open the Logic App designer and select email step to see whether the correct email IDs are being used.

### Scenario 2: Receiving an error email that says that the logic app failed to execute to completion

To troubleshoot this issue:
1.	Navigate to the logic app in the Azure portal.
2.	At the bottom of the **Overview** screen, you will see a **Runs History** section. You can open on the latest run and view which steps in the workflow failed. Some possible causes could be:
    * **Azure Monitor Logs Connector has not been not authorized**: To fix this issue, follow the authorization steps as provided above.
    * **Error in the LA query**: In case you have customized the logic app with your own queries, an error in any of the LA queries might be causing the logic app to fail. You can select the relevant step and view the error which is causing the query to run incorrectly.

If the issues persist, contact Microsoft support.

## Next steps
[Learn more about Backup Reports](https://docs.microsoft.com/azure/backup/configure-reports)
