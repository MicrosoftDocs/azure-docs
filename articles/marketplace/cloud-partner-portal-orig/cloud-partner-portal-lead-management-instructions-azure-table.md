---
title: Azure Table storage | Azure Marketplace
description: Configure lead management in Azure Table storage.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 05/22/2019
ms.author: dsindona
---

# Lead-management instructions for Table storage

This article describes how to configure Azure Table storage to manage sales leads. Table storage helps you store and modify customer information.

## Configure Table storage

1. If you don't have an Azure account, [create a free trial account](https://azure.microsoft.com/pricing/free-trial/).
1. After your account is active, sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, follow these steps:  
    1. Select **+Create a resource** in the pane on the left side. The **New** pane will open.
    1. In the **New** pane, select **Storage**. A **Featured** list will open on the right side.
    1. Select **Storage account**. Then, follow the instructions at [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).

    ![Create an Azure storage account](./media/cloud-partner-portal-lead-management-instructions-azure-table/azurestoragecreate.png)

    For more about storage accounts, see [Quickstart tutorials](https://docs.microsoft.com/azure/storage/). For pricing information, see [Azure storage pricing](https://azure.microsoft.com/pricing/details/storage/).

1. Wait until your storage account is provisioned, which typically takes a few minutes. Then, access the account from the home page of the Azure portal: Select **See all your resources** or **All resources** in the navigation pane.

    ![Access your Azure storage account](./media/cloud-partner-portal-lead-management-instructions-azure-table/azure-storage-access.png)

1. From your storage account pane, copy the storage account connection string for the key. Paste it in the **Connection String** field for the storage account in the Cloud Partner Portal.

    Example connection string:

    ```sql
    DefaultEndpointsProtocol=https;AccountName=myAccountName;AccountKey=myAccountKey;EndpointSuffix=core.windows.net
    ```

      ![Azure storage key](./media/cloud-partner-portal-lead-management-instructions-azure-table/azurestoragekeys.png)

You can use [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/) or a similar tool to see the data in your table storage. You can also export data from it.

## Use Microsoft Flow with Table storage (*optional*)

You can use [Microsoft Flow](https://docs.microsoft.com/flow/) to automatically send notifications when a lead is added to your table storage. If you don't have a Microsoft Flow account, [sign up for a free account](https://flow.microsoft.com/).

### Lead notification example

This example shows how to create a basic flow. The flow automatically sends an email notification hourly when new leads are added to your table storage.

1. Sign in to your Microsoft Flow account.
1. In the navigation pane on the left side, select **My flows**.
1. In the top navigation bar, select **+New**.  
1. From the drop-down list, select **+Create from blank**.
1. Under **Create a flow from blank**, select **Create from blank**.

   ![Create a new flow from blank](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-create-from-blank.png)

1. On the connectors and triggers search page, select **Triggers**.
1. Under **Triggers**, select **Recurrence**.
1. In the **Recurrence** window, keep the default setting of **1** for **Interval**. From the **Frequency** drop-down list, select **Hour**.

   >[!NOTE] 
   >This example uses a one-hour interval. But you can select an interval and frequency that best fits your business needs.

   ![Set a 1-hour frequency for recurrence](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-recurrence-dropdown.png)

1. Select **+New step**.
1. Search for **Get past time**, and then select **Get past time** under **Choose an action**.

    ![Find and select the "get past time" action](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-search-getpasttime.png)

1. In the **Get past time** window, set the **Interval** to **1**.  From the **Time unit** drop-down list, select **Hour**.
    >[!IMPORTANT] 
    >Make sure that the **Interval** and **Time unit** match the interval and frequency that you configured for recurrence (step 8).

    ![Set the get past time interval](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-getpast-time.png)

    >[!TIP] 
    >You can check your flow at any time to verify that each step is configured correctly: Select **Flow checker** from the Flow menu bar.

In the next set of steps, you connect to your storage table and set up the processing logic to handle new leads.

1. After the **Get past time** step, select **+New step**, and then search for **Get entities**.
1. Under **Actions**, select **Get entities**, and then select **Show advanced options**.
1. In the **Get entities** window, fill in the following fields:

   - **Table**: the name of your table storage. The following image shows "MarketPlaceLeads" entered:

     ![Pick a custom value for Azure table name](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-getentities-table-name.png)

   - **Filter Query**: When you select this field, the **Get past time** icon is displayed in a pop-up window. Select **Past time** to use this value as a timestamp to filter the query. Or, you can paste the following function into the field:
   
      `CreatedTime Timestamp gt '@{body('Get_past_time')}'` 

     ![Set up the filter query function](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-getentities-filterquery.png)

1. Select **New step** to add a condition to scan your table storage for new leads.

   ![Use "New step" to add a condition to scan table storage](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-add-filterquery-new-step.png)

1. In the **Choose an action** window, select **Actions**, and then select **Condition Control**.

     ![Add a condition control](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-action-condition-control.png)

1. In the **Condition** window, select **Choose a value**, and then select **Expression** in the pop-up window.
1. Paste `length(body('Get_entities')?['value'])` in the ***fx*** field. Select **OK** to add this function. 



     ![Add a function to the condition](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-condition-fx0.png)

1. Set up the action to take based on the result of the condition.

    1. Select **is greater than** from the drop-down list.
   1. Enter **0** as the value.

     ![Set up an action based on condition results](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-condition-pick-action.png)

1. If the condition resolves to "If no," don't do anything.

    If the condition resolves to "If yes," trigger an action that connects your Office 365 account to send an email:
   1. Select **Add an action**.
   1. Select **Send an email**.
   1. In the **Send an email** window, enter information in the following fields:

      - **To**: an email address for everyone who will get the notification.
      - **Subject**: a subject for the email. For example: *New leads!*
      - **Body**: the text that you want to include in each email (optional). Also paste in `body('Get_entities')?['value']` as a function to insert lead information.

        >[!NOTE] 
        >You can insert additional static or dynamic data points in the body of the email.

      ![Set up email for lead notification](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-emailbody-fx.png)

1. Select **Save** to save the flow. Microsoft Flow will automatically test it for errors. If there aren't any errors, your flow starts running after it's saved.

    The following image shows an example of how the final flow should look.

    [![Final flow sequence](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-end-to-end-thmb.png)](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-end-to-end.png)

    (*Select the image to enlarge it.*)

### Manage your flow

It's easy to manage your flow after it's running. You have complete control over your flow. For example, you can stop it, edit it, see a run history, and get analytics. The following image shows the flow-management options.

 ![Flow-management options](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-manage-completed.png)

The flow keeps running until you select **Turn flow off**.

If you're not getting any lead email notifications, no new leads have been added to your table storage.
You'll get an email like the following example if a flow failure occurs:

 ![Flow failure email notification](./media/cloud-partner-portal-lead-management-instructions-azure-table/msflow-failure-note.png)

## Next steps

[Configure customer leads](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-get-customer-leads)
