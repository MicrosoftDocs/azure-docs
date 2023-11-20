---
title: Branching and chaining activities in a pipeline using Azure portal
description: Learn how to control flow of data in Azure Data Factory pipeline by using the Azure portal.
author: ssabat
ms.author: susabat
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.date: 10/20/2023
---

# Branching and chaining activities in an Azure Data Factory pipeline using the Azure portal

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this tutorial, you create a Data Factory pipeline that showcases some of the control flow features. This pipeline does a simple copy from a container in Azure Blob Storage to another container in the same storage account. If the copy activity succeeds, the pipeline sends details of the successful copy operation (such as the amount of data written) in a success email. If the copy activity fails, the pipeline sends details of copy failure (such as the error message) in a failure email. Throughout the tutorial, you see how to pass parameters.

A high-level overview of the scenario:
:::image type="content" source="media/tutorial-control-flow-portal/overview.png" alt-text="Diagram shows Azure Blob Storage, which is the target of a copy, which, on success, sends an email with details or, on failure, sends an email with error details.":::

You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Create a data factory.
> * Create an Azure Storage linked service.
> * Create an Azure Blob dataset
> * Create a pipeline that contains a Copy activity and a Web activity
> * Send outputs of activities to subsequent activities
> * Utilize parameter passing and system variables
> * Start a pipeline run
> * Monitor the pipeline and activity runs

This tutorial uses Azure portal. You can use other mechanisms to interact with Azure Data Factory, refer to "Quickstarts" in the table of contents.

## Prerequisites

* **Azure subscription**. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
* **Azure Storage account**. You use the blob storage as **source** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-account-create.md) article for steps to create one.
* **Azure SQL Database**. You use the database as **sink** data store. If you don't have a database in Azure SQL Database, see the [Create a database in Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart) article for steps to create one.

### Create blob table

1. Launch Notepad. Copy the following text and save it as **input.txt** file on your disk.

    ```
    John,Doe
    Jane,Doe
    ```
2. Use tools such as [Azure Storage Explorer](https://storageexplorer.com/) do the following steps:
    1. Create the **adfv2branch** container.
    2. Create **input** folder in the **adfv2branch** container.
    3. Upload **input.txt** file to the container.

## Create email workflow endpoints
To trigger sending an email from the pipeline, you use [Azure Logic Apps](../logic-apps/logic-apps-overview.md) to define the workflow. For more information about creating a logic app workflow, see [Create an example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md).

### Success email workflow
Create a Consumption logic app workflow named `CopySuccessEmail`. Add the Request trigger named **When an HTTP request is received**, and add the **Office 365 Outlook** action named **Send an email**. If prompted, sign in to your Office 365 Outlook account.

:::image type="content" source="media/tutorial-control-flow-portal/success-email-workflow.png" alt-text="Shows a screenshot of the Success email workflow.":::

For the Request trigger, fill in the **Request Body JSON Schema** box with the following JSON:

```json
{
    "properties": {
        "dataFactoryName": {
            "type": "string"
        },
        "message": {
            "type": "string"
        },
        "pipelineName": {
            "type": "string"
        },
        "receiver": {
            "type": "string"
        }
    },
    "type": "object"
}
```

The Request trigger in the workflow designer should look like the following image:

:::image type="content" source="media/tutorial-control-flow-portal/logic-app-designer-request.png" alt-text="Shows a screenshot of the workflow designer with Request trigger.":::

For the **Send an email** action, customize how you wish to format the email, utilizing the properties passed in the request Body JSON schema. Here is an example:

:::image type="content" source="media/tutorial-control-flow-portal/send-email-action-2.png" alt-text="Shows a screenshot of the workflow designer with the action named Send an email.":::

Save the workflow. Make a note of your HTTP Post request URL for your success email workflow:

```
//Success Request Url
https://prodxxx.eastus.logic.azure.com:443/workflows/000000/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=000000
```

### Fail email workflow
Follow the same steps to create another logic app workflow named `CopyFailEmail`. In the Request trigger, the **Request Body JSON schema** value is the same. Change the format of your email like the `Subject` to tailor toward a failure email. Here is an example:

:::image type="content" source="media/tutorial-control-flow-portal/fail-email-workflow-2.png" alt-text="Shows a screenshot of the workflow designer with the fail email workflow.":::

Save the workflow. Make a note of your HTTP Post request URL for your failure email workflow:

```
//Fail Request Url
https://prodxxx.eastus.logic.azure.com:443/workflows/000000/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=000000
```

You should now have two workflow URLs:

```
//Success Request Url
https://prodxxx.eastus.logic.azure.com:443/workflows/000000/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=000000

//Fail Request Url
https://prodxxx.eastus.logic.azure.com:443/workflows/000000/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=000000
```

## Create a data factory

1. Launch **Microsoft Edge** or **Google Chrome** web browser. Currently, Data Factory UI is supported only in Microsoft Edge and Google Chrome web browsers.
1. Expand the menu at the top left and select **Create a resource**.  Then select > **Integration** > **Data Factory**:

   :::image type="content" source="./media/tutorial-control-flow-portal/create-resource.png" alt-text="Shows a screenshot of the &quot;Create a resource&quot; button in the Azure portal.":::

   :::image type="content" source="./media/tutorial-control-flow-portal/new-azure-data-factory-menu.png" alt-text="Shows a screenshot of the Data Factory selection in the &quot;New&quot; pane.":::

1. In the **New data factory** page, enter **ADFTutorialDataFactory** for the **name**.

     :::image type="content" source="./media/tutorial-control-flow-portal/new-azure-data-factory.png" alt-text="New data factory page":::

   The name of the Azure data factory must be **globally unique**. If you receive the following error, change the name of the data factory (for example, yournameADFTutorialDataFactory) and try creating again. See [Data Factory - Naming Rules](naming-rules.md) article for naming rules for Data Factory artifacts.

   *Data factory name “ADFTutorialDataFactory” is not available.*

1. Select your Azure **subscription** in which you want to create the data factory.
1. For the **Resource Group**, do one of the following steps:

      - Select **Use existing**, and select an existing resource group from the drop-down list.
      - Select **Create new**, and enter the name of a resource group.   
         
        To learn about resource groups, see [Using resource groups to manage your Azure resources](../azure-resource-manager/management/overview.md).  
1. Select **V2** for the **version**.
1. Select the **location** for the data factory. Only locations that are supported are displayed in the drop-down list. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.
1. Select **Pin to dashboard**.     
1. Click **Create**.      
1. After the creation is complete, you see the **Data Factory** page as shown in the image.

   :::image type="content" source="./media/tutorial-control-flow-portal/data-factory-home-page.png" alt-text="Shows a screenshot of the data factory home page.":::
1. Click **Open Azure Data Factory Studio** tile to launch the Azure Data Factory user interface (UI) in a separate tab.


## Create a pipeline
In this step, you create a pipeline with one Copy activity and two Web activities. You use the following features to create the pipeline:

- Parameters for the pipeline that are access by datasets.
- Web activity to invoke logic apps workflows to send success/failure emails.
- Connecting one activity with another activity (on success and failure)
- Using output from an activity as an input to the subsequent activity

1. In the home page of Data Factory UI, click the **Orchestrate** tile.  

   :::image type="content" source="media/tutorial-data-flow/orchestrate.png" alt-text="Shows a screenshot of the data factory home page with the Orchestrate tile highlighted.":::

1. In the properties window for the pipeline, switch to the **Parameters** tab, and use the **New** button to add the following three parameters of type String: sourceBlobContainer, sinkBlobContainer, and receiver.

    - **sourceBlobContainer** - parameter in the pipeline consumed by the source blob dataset.
    - **sinkBlobContainer** - parameter in the pipeline consumed by the sink blob dataset
    - **receiver** - this parameter is used by the two Web activities in the pipeline that send success or failure emails to the receiver whose email address is specified by this parameter.

   :::image type="content" source="./media/tutorial-control-flow-portal/pipeline-parameters.png" alt-text="Shows a screenshot of the New pipeline menu.":::
1. In the **Activities** toolbox, search for **Copy** and drag-drop the **Copy** activity to the pipeline designer surface.

   :::image type="content" source="./media/tutorial-control-flow-portal/drag-drop-copy-activity.png" alt-text="Shows a screenshot demonstrating how to drag and drop the copy activity onto the pipeline designer.":::
1. Select the **Copy** activity you dragged onto the pipeline designer surface. In the **Properties** window for the **Copy** activity at the bottom, switch to the **Source** tab, and click **+ New**. You create a source dataset for the copy activity in this step.

   :::image type="content" source="./media/tutorial-control-flow-portal/new-source-dataset-button.png" alt-text="Screenshot that shows how to create a source dataset for the copy activity.":::
1. In the **New Dataset** window, select the **Azure** tab at the top, and then choose **Azure Blob Storage**, and select **Continue**.

   :::image type="content" source="./media/tutorial-control-flow-portal/select-azure-blob-storage.png" alt-text="Shows a screenshot of the select Azure Blob Storage button.":::

1. In the **Select format** window, choose **DelimitedText** and select **Continue**.

    :::image type="content" source="media/tutorial-control-flow-portal/select-format.png" alt-text="Shows a screenshot of the &quot;Select Format&quot; window with the DelimitedText format highlighted.":::

1. You see a new **tab** titled **Set properties**. Change the name of the dataset to **SourceBlobDataset**.  Select the **Linked Service** dropdown, and choose **+New** to create a new linked service to your source dataset.

   :::image type="content" source="./media/tutorial-control-flow-portal/create-new-linked-service.png" alt-text="Shows a screenshot of the &quot;Set properties&quot; window for the dataset, with the &quot;+New&quot; button highlighted under the &quot;Linked service&quot; dropdown.**":::

1. You will see the **New linked service** window where you can fill out the required properties for the linked service.

   :::image type="content" source="./media/tutorial-control-flow-portal/new-linked-service-window.png" alt-text="Shows a screenshot fo the dataset connection window with the new linked service button highlighted.":::

1. In the **New Linked Service** window, complete the following steps:

    1. Enter **AzureStorageLinkedService** for **Name**.
    1. Select your Azure storage account for the **Storage account name**.
    1. Click **Create**.

1. On the **Set properties** window that appears next, select **Open this dataset** to enter a parameterized value for the file name.

   :::image type="content" source="media/tutorial-control-flow-portal/dataset-set-properties.png" alt-text="Shows a screenshot of the dataset &quot;Set properties&quot; window with the &quot;Open this dataset&quot; link highlighted.":::

1. Enter `@pipeline().parameters.sourceBlobContainer` for the folder and `emp.txt` for the file name.

    :::image type="content" source="./media/tutorial-control-flow-portal/source-dataset-settings.png" alt-text="Shows a screenshot of the source dataset settings.":::

1. Switch back to the **pipeline** tab (or click the pipeline in the treeview on the left), and select the **Copy** activity on the designer. Confirm that your new dataset is selected for **Source Dataset**.
      
   :::image type="content" source="./media/tutorial-control-flow-portal/pipeline-source-dataset-selected.png" alt-text="Shows a screenshot of the source dataset.":::

1. In the properties window, switch to the **Sink** tab, and click **+ New** for **Sink Dataset**. You create a sink dataset for the copy activity in this step similar to the way you created the source dataset.

    :::image type="content" source="./media/tutorial-control-flow-portal/new-sink-dataset-button.png" alt-text="Shows a screenshot of the new sink dataset button":::
1. In the **New Dataset** window, select **Azure Blob Storage**, and click **Continue**, and then select **DelimitedText** again on the **Select format** window and click **Continue** again.

1. In the **Set properties** page for the dataset, enter **SinkBlobDataset** for **Name**, and select **AzureStorageLinkedService** for **LinkedService**.
1. Expand the Advanced section of the properties page and select **Open this dataset**.
  
1. On the dataset **Connection** tab, edit the **File path**.  Enter `@pipeline().parameters.sinkBlobContainer` for the folder, and `@concat(pipeline().RunId, '.txt')` for the file name. The expression uses the ID of the current pipeline run for the file name. For the supported list of system variables and expressions, see [System variables](control-flow-system-variables.md) and [Expression language](control-flow-expression-language-functions.md).

   :::image type="content" source="./media/tutorial-control-flow-portal/sink-dataset-settings.png" alt-text="Shows a screenshot of the Sink dataset settings.":::

1. Switch back to the **pipeline** tab at the top. Search for **Web** in the search box, and drag-drop a **Web** activity to the pipeline designer surface. Set the name of the activity to **SendSuccessEmailActivity**. The Web Activity allows a call to any REST endpoint. For more information about the activity, see [Web Activity](control-flow-web-activity.md). This pipeline uses a Web Activity to call the Logic Apps email workflow.

    :::image type="content" source="./media/tutorial-control-flow-portal/success-web-activity-general.png" alt-text="Shows a screenshot demonstrating how to drag and drop the first Web activity.":::
1. Switch to the **Settings** tab from the **General** tab, and do the following steps:
    1. For **URL**, specify URL for the logic apps workflow that sends the success email.  
    1. Select **POST** for **Method**.
    1. Click **+ Add header** link in the **Headers** section.
    1. Add a header **Content-Type** and set it to **application/json**.
    1. Specify the following JSON for **Body**.

        ```json
        {
            "message": "@{activity('Copy1').output.dataWritten}",
            "dataFactoryName": "@{pipeline().DataFactory}",
            "pipelineName": "@{pipeline().Pipeline}",
            "receiver": "@pipeline().parameters.receiver"
        }
        ```
        The message body contains the following properties:

       - Message - Passing value of `@{activity('Copy1').output.dataWritten`. Accesses a property of the previous copy activity and passes the value of dataWritten. For the failure case, pass the error output instead of `@{activity('CopyBlobtoBlob').error.message`.
       - Data Factory Name - Passing value of `@{pipeline().DataFactory}` This is a system variable, allowing you to access the corresponding data factory name. For a list of system variables, see [System Variables](control-flow-system-variables.md) article.
       - Pipeline Name - Passing value of `@{pipeline().Pipeline}`. This is also a system variable, allowing you to access the corresponding pipeline name.
       - Receiver - Passing value of "\@pipeline().parameters.receiver"). Accessing the pipeline parameters.

         :::image type="content" source="./media/tutorial-control-flow-portal/web-activity1-settings.png" alt-text="Shows a screenshot of the settings for the first Web activity.":::         
1. Connect the **Copy** activity to the **Web** activity by dragging the green checkbox button next to the Copy activity and dropping on the Web activity.

    :::image type="content" source="./media/tutorial-control-flow-portal/connect-copy-web-activity1.png" alt-text="Shows a screenshot demonstrating how to connect the Copy activity with the first Web activity.":::
1. Drag-drop another **Web** activity from the Activities toolbox to the pipeline designer surface, and set the **name** to **SendFailureEmailActivity**.

    :::image type="content" source="./media/tutorial-control-flow-portal/web-activity2-name.png" alt-text="Shows a screenshot of the name of the second Web activity.":::
1. Switch to the **Settings** tab, and do the following steps:

    1. For **URL**, specify URL for the logic apps workflow that sends the failure email.  
    1. Select **POST** for **Method**.
    1. Click **+ Add header** link in the **Headers** section.
    1. Add a header **Content-Type** and set it to **application/json**.
    1. Specify the following JSON for **Body**.

        ```json
        {
            "message": "@{activity('Copy1').error.message}",
            "dataFactoryName": "@{pipeline().DataFactory}",
            "pipelineName": "@{pipeline().Pipeline}",
            "receiver": "@pipeline().parameters.receiver"
        }
        ```

        :::image type="content" source="./media/tutorial-control-flow-portal/web-activity2-settings.png" alt-text="Shows a screenshot of the settings for the second Web activity.":::         
1. Select the red **X** button on the right side of the **Copy** activity in the pipeline designer and drag and drop it onto the **SendFailureEmailActivity** you just created.  

    :::image type="content" source="./media/tutorial-control-flow-portal/select-copy-failure-link.png" alt-text="Screenshot that shows how to select Error on the Copy activity in the pipeline designer.":::

1. To validate the pipeline, click **Validate** button on the toolbar. Close the **Pipeline Validation Output** window by clicking the **>>** button.

    :::image type="content" source="./media/tutorial-control-flow-portal/validate-pipeline.png" alt-text="Shows a screenshot of the Validate pipeline button.":::
1. To publish the entities (datasets, pipelines, etc.) to Data Factory service, select **Publish All**. Wait until you see the **Successfully published** message.

    :::image type="content" source="./media/tutorial-control-flow-portal/publish-button.png" alt-text="Shows a screenshot of the Publish button in the data factory portal.":::

## Trigger a pipeline run that succeeds
1. To **trigger** a pipeline run, click **Trigger** on the toolbar, and click **Trigger Now**.

    :::image type="content" source="./media/tutorial-control-flow-portal/trigger-now-menu.png" alt-text="Shows a screenshot of the Trigger Now button.":::
1. In the **Pipeline Run** window, do the following steps:

    1. Enter **adftutorial/adfv2branch/input** for the **sourceBlobContainer** parameter.
    1. Enter **adftutorial/adfv2branch/output** for the **sinkBlobContainer** parameter.
    1. Enter an **email address** of the **receiver**.
    1. Click **Finish**

        :::image type="content" source="./media/tutorial-control-flow-portal/pipeline-run-parameters.png" alt-text="Pipeline run parameters":::

## Monitor the successful pipeline run

1. To monitor the pipeline run, switch to the **Monitor** tab on the left. You see the pipeline run that was triggered manually by you. Use the **Refresh** button to refresh the list.

    :::image type="content" source="./media/tutorial-control-flow-portal/monitor-success-pipeline-run.png" alt-text="Successful pipeline run":::
1. To **view activity runs** associated with this pipeline run, click the first link in the **Actions** column. You can switch back to the previous view by clicking **Pipelines** at the top. Use the **Refresh** button to refresh the list.

    :::image type="content" source="./media/tutorial-control-flow-portal/activity-runs-success.png" alt-text="Screenshot that shows how to view the list of activity runs.":::

## Trigger a pipeline run that fails
1. Switch to the **Edit** tab on the left.
1. To **trigger** a pipeline run, click **Trigger** on the toolbar, and click **Trigger Now**.
1. In the **Pipeline Run** window, do the following steps:

    1. Enter **adftutorial/dummy/input** for the **sourceBlobContainer** parameter. Ensure that the dummy folder does not exist in the adftutorial container.
    1. Enter **adftutorial/dummy/output** for the **sinkBlobContainer** parameter.
    3. Enter an **email address** of the **receiver**.
    4. Click **Finish**.

## Monitor the failed pipeline run

1. To monitor the pipeline run, switch to the **Monitor** tab on the left. You see the pipeline run that was triggered manually by you. Use the **Refresh** button to refresh the list.

    :::image type="content" source="./media/tutorial-control-flow-portal/monitor-failure-pipeline-run.png" alt-text="Failure pipeline run":::
1. Click **Error** link for the pipeline run to see details about the error.

    :::image type="content" source="./media/tutorial-control-flow-portal/pipeline-error-message.png" alt-text="Pipeline error":::
1. To **view activity runs** associated with this pipeline run, click the first link in the **Actions** column. Use the **Refresh** button to refresh the list. Notice that the Copy activity in the pipeline failed. The Web activity succeeded to send the failure email to the specified receiver.

    :::image type="content" source="./media/tutorial-control-flow-portal/activity-runs-failure.png" alt-text="Activity runs":::
1. Click **Error** link in the **Actions** column to see details about the error.

    :::image type="content" source="./media/tutorial-control-flow-portal/activity-run-error.png" alt-text="Activity run error":::

## Next steps
You performed the following steps in this tutorial:

> [!div class="checklist"]
> * Create a data factory.
> * Create an Azure Storage linked service.
> * Create an Azure Blob dataset
> * Create a pipeline that contains a copy activity and a web activity
> * Send outputs of activities to subsequent activities
> * Utilize parameter passing and system variables
> * Start a pipeline run
> * Monitor the pipeline and activity runs

You can now proceed to the Concepts section for more information about Azure Data Factory.
> [!div class="nextstepaction"]
>[Pipelines and activities](concepts-pipelines-activities.md)
