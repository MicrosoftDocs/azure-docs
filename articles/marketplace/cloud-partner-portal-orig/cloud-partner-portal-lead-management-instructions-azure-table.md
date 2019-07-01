---
title: Azure Table storage | Azure Marketplace
description: Configure lead management for Azure Table storage.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 05/22/2019
ms.author: pabutler
---

# Lead-management instructions for Azure Table storage

This article describes how to configure Azure Table storage to manage sales leads. Table storage helps you store and modify customer information.

## How to configure Table storage

1. If you don't have an Azure account, [create a free trial account](https://azure.microsoft.com/pricing/free-trial/).
1. After your Azure account is active, sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, follow these steps:  
    1. Select **+Create a resource** in the pane on the left side. The **New** pane will open.
    2. In the **New** pane, select **Storage**. A **Featured** list will open on the right side.
    3. Select **Storage account**.  Then, follow the instructions in [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).

        ![Create an Azure storage account](./media/cloud-partner-portal-lead-management-instructions-azure-table/azurestoragecreate.png)

    For more information about storage accounts, see [Quickstart tutorials](https://docs.microsoft.com/azure/storage/). For information about pricing, see [storage pricing](https://azure.microsoft.com/pricing/details/storage/).

1. Wait until your storage account is provisioned, which typically takes a few minutes. Then, access your storage account from the **Home** page of the Azure portal: Select **See all your resources** or **All resources** in the navigation pane on the left side.

    ![Access your Azure storage account](./media/cloud-partner-portal-lead-management-instructions-azure-table/azure-storage-access.png)

1. From your storage account pane, copy the storage account connection string for the key. Paste it into the **Storage Account Connection String** field in the Cloud Partner Portal.

    Example connection string:

    ```sql
    DefaultEndpointsProtocol=https;AccountName=myAccountName;AccountKey=myAccountKey;EndpointSuffix=core.windows.net
    ```

      ![Azure storage key](./media/cloud-partner-portal-lead-management-instructions-azure-table/azurestoragekeys.png)

You can use [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/) or a similar tool to see the data in Table storage. You can also export data from Table storage.

## Use Microsoft Flow with Table storage (*optional*)

You can use [Microsoft Flow](https://docs.microsoft.com/flow/) to automate notifications to be sent every time a lead is added to Table storage. If you don’t have a Microsoft Flow account, [sign up for a free account](https://flow.microsoft.com/).

### Lead notification example

This example shows how to create a basic flow that automatically sends an email notification when a new lead is added to your table storage. It creates a flow to send lead information every hour when the table storage is updated.

1. Sign in to your Microsoft Flow account.
2. In the navigation pane on the left side, select **My flows**.
3. In the top navigation bar, select **+ New**.  
4. From the drop-down list, select **+Create from blank**.
5. Under "Create a flow from blank," select **Create from blank**.

   ![Create a new flow from blank](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-create-from-blank.png)

6. On the connectors and triggers search page, select **Triggers**.
7. Under "Triggers," select **Recurrence**.
8. In the **Recurrence** window, keep the default setting of *1* for **Interval**. From the **Frequency** drop-down list, select **Hour**.

   >[!NOTE] 
   >This example uses a 1-hour interval. But you can select an interval and frequency that’s best for your business needs.

   ![Set a 1-hour frequency for recurrence](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-recurrence-dropdown.png)

9. Select **+New step**.
10. Search for **Get past time**, and then select **Get past time** under "Actions."

    ![Find and select the "get past time" action](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-search-getpasttime.png)

11. In the **Get past time** window, set the **Interval** to **1**.  From the **Time unit** dropdown list, select **Hour**.
    >[!IMPORTANT] 
    >Make sure that the **Interval** and **Time unit** match the interval and frequency that you configured for recurrence.

    ![Set the get past time interval](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-getpast-time.png)

    >[!TIP] 
    >You can check your flow at any time to verify that each step is configured correctly. Select **Flow checker** from the Flow menu bar.

In next set of steps, you connect to your Storage table and set up the processing logic to handle new leads.

1. After the "Get past time" step, select **+New step**, and then search for **Get entities**.
2. Under "Actions," select **Get entities** and then **Show advanced options**.
3. In the **Get entities** window, fill in the following fields:

   - **Table**: the name of your Table storage. The following image shows “MarketPlaceLeads” entered:

     ![Pick a custom value for Azure table name](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-getentities-table-name.png)

   - **Filter query**: Click this field, and the **Get past time** icon is displayed in a pop-up window. Select **Past time** to use this value as timestamp to filter the query. Or, you can paste the following function into the field: 
   
      `CreatedTime Timestamp gt datetime'@{body('Get_past_time')}'` 

     ![Set up the filter query function](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-getentities-filterquery.png)

4. Select **New step** to add a condition to scan Table storage for new leads.

   ![Use "New step" to add a condition to scan Table storage](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-add-filterquery-new-step.png)

5. In the **Choose an action** window, select **Actions**, and then select the **Condition** control.

     ![Add a condition control](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-action-condition-control.png)

6. In the **Condition** window, select **Choose a value**, and then select **Expression** in the pop-up window.
7. Paste `length(body('Get_entities')?['value'])` into the ***fx*** field. Select **OK** to add this function. To finish setting up the condition:

   1. Select **is greater than** from the dropdown list.
   1.  Enter 0 as the value.

     ![Add a function to the condition](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-condition-fx0.png)

8. Set up the action to take based on the result of the condition.

     ![Set up action based on condition results](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-condition-pick-action.png)

9. If the condition resolves to "If no," don’t do anything.
10. If the condition resolves to "If yes," trigger an action that connects your Office 365 account to send an email:
   1. Select **Add an action**.
   2. Select **Send an email**.
   3. In the **Send an email** window, enter information in the following fields:

      - **To**: an email address for everyone that will get this notification.
      - **Subject**: a subject for the email. For example: *New leads!*
      - **Body**: the text that you want to include in each email (optional). Also paste in `body('Get_entities')?['value']` as a function to insert lead information.

        >[!NOTE] 
        >You can insert additional static or dynamic data points into the body of the email.

      ![Set up email for lead notification](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-emailbody-fx.png)

13. Select **Save** to save the flow. Microsoft Flow will automatically test the flow for errors. If there aren’t any errors, your flow starts running after it’s saved.

    The following image shows an example of how the final flow should look.

    [![Final flow sequence](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-end-to-end-thmb.png)](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-end-to-end.png)

    (*Click the image to enlarge it.*)

### Manage your flow

Managing your flow after it’s running is easy. You have complete control over your flow. For example, you can stop it, edit it, see a run history, and get analytics. The following image shows the flow-management options.

 ![Managing a flow](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-manage-completed.png)

The flow keeps running until you select the **Turn flow off** option.

If you’re not getting any lead email notifications, it means that new leads haven’t been added to your table storage. You'll get an email like the following example if a flow failure occurs:

 ![Flow failure email notification](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-failure-note.png)


## Next steps

[Configure customer leads](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-get-customer-leads)
