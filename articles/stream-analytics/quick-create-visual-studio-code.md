---
title: Quickstart - Create an Azure Stream Analytics job in Visual Studio Code
description: This quickstart shows you how to get started by creating a Stream Analytics job, configuring inputs and outputs, and defining a query with Visual Studio Code.
ms.service: stream-analytics
author: su-jie
ms.author: sujie
ms.date: 01/18/2020
ms.topic: quickstart
ms.custom: mvc, mode-ui
#Customer intent: As an IT admin/developer, I want to create a Stream Analytics job, configure input and output, and analyze data by using Visual Studio Code.
---

# Quickstart: Create an Azure Stream Analytics job in Visual Studio Code

This quickstart shows you how to create and run an Azure Stream Analytics job by using the Azure Stream Analytics Tools extension for Visual Studio Code. The example job reads streaming data from an Azure IoT Hub device. You define a job that calculates the average temperature when over 27° and writes the resulting output events to a new file in blob storage.

> [!NOTE]
> Visual Studio and Visual Studio Code tools don't support jobs in the China East, China North, Germany Central, and Germany NorthEast regions.

## Prerequisites
Here are the prerequisites for the quickstart:

- Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
- [Visual Studio Code](https://code.visualstudio.com/).

## Install the Azure Stream Analytics Tools extension

1. Open Visual Studio Code.
2. From **Extensions** on the left pane, search for **Azure Stream Analytics** and select **Install** on the **Azure Stream Analytics Tools** extension.

    :::image type="content" source="./media/quick-create-visual-studio-code/install-extension.png" alt-text="Screenshot showing the Extensions page of Visual Studio Code with an option to install Stream Analytics extension.":::
3. After the extension is installed, verify that **Azure Stream Analytics Tools** is visible in **Enabled Extensions**.

    :::image type="content" source="./media/quick-create-visual-studio-code/enabled-extensions.png" alt-text="Screenshot showing the Azure Stream Analytics extension in the list of enabled extensions.":::

## Activate the Azure Stream Analytics Tools extension

1. Select the **Azure** icon on the Visual Studio Code activity bar. Under **Stream Analytics** on the side bar, select **Sign in to Azure**.


    :::image type="content" source="./media/quick-create-visual-studio-code/azure-sign-in.png" alt-text="Screenshot showing how to sign in to Azure.":::
2. You may need to select a subscription as showing in the following image:

    :::image type="content" source="./media/quick-create-visual-studio-code/select-subscription.png" alt-text="Screenshot showing the selection of an Azure subscription.":::
3. Keep Visual Studio Code open. 

    > [!NOTE]
    > The Azure Stream Analytics Tools extension will automatically sign you in the next time if you don't sign out.
    > If your account has two-factor authentication, we recommend that you use phone authentication rather than using a PIN.
    > If you have issues with listing resources, signing out and signing in again usually helps. To sign out, enter the command `Azure: Sign Out`.

## Prepare the input data

Before you define the Stream Analytics job, you should prepare the data that's later configured as the job input. To prepare the input data that the job requires, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource** > **Internet of Things** > **IoT Hub**.

    :::image type="content" source="./media/quick-create-visual-studio-code/create-resource-iot-hub-menu.png" alt-text="Screenshot showing the Create Resource page for Iot Hub.":::
3. In the **IoT Hub** pane, enter the following information:

   |**Setting**  |**Suggested value**  |**Description**  |
   |---------|---------|---------|
   |Subscription  | \<Your subscription\> |  Select the Azure subscription that you want to use. |
   |Resource Group   |   asaquickstart-resourcegroup  |   Select **Create New** and enter a new resource-group name for your account. |
   |Region  |  \<Select the region that is closest to your users\> | Select a geographic location where you can host your IoT hub. Use the location that's closest to your users. |
   |IoT Hub Name  | MyASAIoTHub  |   Select a name for your IoT hub.   |

    :::image type="content" source="./media/quick-create-visual-studio-code/create-iot-hub.png" alt-text="Screenshot showing the IoT Hub page for creation.":::
4. Select **Next: Networking** at the bottom of the page to move to the **Networking** page of the creation wizard. 
1. On the **Networking** page, select **Next: Management** at the bottom of the page. 
1. On the **Management** page, for **Pricing and scale tier**, select **F1: Free tier**, if it's still available on your subscription. If the free tier is unavailable, choose the lowest pricing tier available. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).
6. Select **Review + create**. Review your IoT hub information and select **Create**. Your IoT hub might take a few minutes to create. You can monitor the progress on the **Notifications** pane.
1. After the creation is successful, select **Go to resource** to navigate to the **IoT Hub** page for your IoT hub. 
1. On the **IoT Hub** page, select **Devices** under **Device management** on the left menu, and then select **Add Device** as shown in the image.

    :::image type="content" source="./media/quick-create-visual-studio-code/add-device-menu.png" alt-text="Screenshot showing the Add Device button on the Devices page.":::    
1. On your IoT hub's navigation menu, select **Add** under **IoT devices**. Add an ID for **Device ID**, and select **Save**.

    :::image type="content" source="./media/quick-create-visual-studio-code/add-device-iot-hub.png" alt-text="Screenshot showing the Add Device page.":::    
1. After the device is saved, select the device from the list. If it doesn't show up in the list, move to another page and switch back to the **Devices** page. 

    :::image type="content" source="./media/quick-create-visual-studio-code/select-device.png" alt-text="Screenshot showing the selection of the device on the Devices page.":::    
8. Copy the string in **Connection string (primary key)** and save it to a notepad to use later.

      :::image type="content" source="./media/quick-create-visual-studio-code/save-iot-device-connection-string.png" alt-text="Screenshot showing the primary connection string of the device you created.":::    

## Run the IoT simulator
1. Open the [Raspberry Pi Azure IoT Online Simulator](https://azure-samples.github.io/raspberry-pi-web-simulator/) in a new browser tab or window.
2. Replace the placeholder in line 15 with the IoT hub device connection string that you saved earlier.
3. Select **Run**. The output should show the sensor data and messages that are being sent to your IoT hub.

    :::image type="content" source="./media/quick-create-visual-studio-code/ras-pi-connection-string.png" lightbox="./media/quick-create-visual-studio-code/ras-pi-connection-string.png" alt-text="Screenshot showing the Raspberry Pi Azure IoT Online Simulator with output.":::    

## Create blob storage

1. From the upper-left corner of the Azure portal, select **Create a resource** > **Storage** > **Storage account**.

    :::image type="content" source="./media/quick-create-visual-studio-code/create-storage-account-menu.png" alt-text="Screenshot showing the Create storage account menu.":::   
2. In the **Create storage account** pane, enter a storage account name, location, and resource group. Choose the same location and resource group as the IoT hub that you created. Then select **Review** to create the account. Then, select **Create** to create the storage account. After the resource is created, select **Go to resource** to navigate to the **Storage account** page. 

    :::image type="content" source="./media/quick-create-visual-studio-code/create-storage-account.png" alt-text="Screenshot showing the Create storage account page.":::   
3. On the **Storage account** page, select **Containers** on the left menu, and then select **+ Container** on the command bar.

    :::image type="content" source="./media/quick-create-visual-studio-code/add-blob-container-menu.png" alt-text="Screenshot showing the Containers page.":::   
4. From the **New container** page, provide a **name** for your container, leave **Public access level** as **Private (no anonymous access)**, and select **OK**.

    :::image type="content" source="./media/quick-create-visual-studio-code/create-blob-container.png" alt-text="Screenshot showing the creation of a blob container page.":::   

## Create a Stream Analytics project

1. In Visual Studio Code, select **View** -> **Command palette** on the menu to open the command palette. 

    :::image type="content" source="./media/quick-create-visual-studio-code/view-command-palette.png" alt-text="Screenshot showing the View -> Command palette menu.":::   
1. Then enter **ASA** and select **ASA: Create New Project**.

    :::image type="content" source="./media/quick-create-visual-studio-code/create-new-project.png" alt-text="Screenshot showing the selection of ASA: Create New Project in the command palette.":::   
2. Enter your project name, like **myASAproj**, and select a folder for your project.

    :::image type="content" source="./media/quick-create-visual-studio-code/create-project-name.png" alt-text="Screenshot showing entering an ASA project name.":::   
3. The new project is added to your workspace. A Stream Analytics project consists of three folders: **Inputs**, **Outputs**, and **Functions**. It also has the query script **(*.asaql)**, a **JobConfig.json** file, and an **asaproj.json** configuration file. You may need to select **Explorer** button on the left menu of the Visual Studio Code to see the explorer.

    The **asaproj.json** configuration file contains the inputs, outputs, and job configuration file information needed for submitting the Stream Analytics job to Azure.

    :::image type="content" source="./media/quick-create-visual-studio-code/asa-project-files.png" alt-text="Screenshot showing Stream Analytics project files in Visual Studio Code.":::   

    > [!Note]
    > When you're adding inputs and outputs from the command palette, the corresponding paths are added to **asaproj.json** automatically. If you add or remove inputs or outputs on disk directly, you need to manually add or remove them from **asaproj.json**. You can choose to put the inputs and outputs in one place and then reference them in different jobs by specifying the paths in each **asaproj.json** file.

## Define the transformation query

1. Open **myASAproj.asaql** from your project folder.
2. Add the following query:

   ```sql
   SELECT *
   INTO Output
   FROM Input
   WHERE Temperature > 27
   ```

    :::image type="content" source="./media/quick-create-visual-studio-code/query.png" lightbox="./media/quick-create-visual-studio-code/query.png" alt-text="Screenshot showing the transformation query.":::       

## Define a live input

1. Right-click the **Inputs** folder in your Stream Analytics project. Then select **ASA: Add Input** from the context menu.

    :::image type="content" source="./media/quick-create-visual-studio-code/add-input-from-inputs-folder.png" lightbox="./media/quick-create-visual-studio-code/add-input-from-inputs-folder.png" alt-text="Screenshot showing the ASA: Add input menu in Visual Studio Code.":::   

    Or select **Ctrl+Shift+P** (or **View** -> **Command palette** menu) to open the command palette and enter **ASA: Add Input**.

    :::image type="content" source="./media/quick-create-visual-studio-code/add-input.png" lightbox="./media/quick-create-visual-studio-code/add-input.png" alt-text="Screenshot showing the ASA: Add input in the command palette of Visual Studio Code.":::   
2. Choose **IoT Hub** for the input type.
    
    :::image type="content" source="./media/quick-create-visual-studio-code/iot-hub.png" lightbox="./media/quick-create-visual-studio-code/iot-hub.png" alt-text="Screenshot showing the selection of your IoT hub in VS Code command palette.":::   
3. If you added the input from the command palette, choose the Stream Analytics query script that will use the input. It should be automatically populated with the file path to **myASAproj.asaql**.

    :::image type="content" source="./media/quick-create-visual-studio-code/asa-script.png" lightbox="./media/quick-create-visual-studio-code/asa-script.png" alt-text="Screenshot showing the selection of your Stream Analytics script in VS Code command palette.":::   
4. Choose **Select from your Azure Subscriptions** from the drop-down menu, and then press **ENTER**.

    :::image type="content" source="./media/quick-create-visual-studio-code/add-input-select-subscription.png" lightbox="./media/quick-create-visual-studio-code/add-input-select-subscription.png" alt-text="Screenshot showing the selection of your Azure subscription in VS Code command palette.":::   
5. Edit the newly generated **IoTHub1.json** file with the following values. Keep default values for fields not mentioned here.

   |Setting|Suggested value|Description|
   |-------|---------------|-----------|
   |Name|Input|Enter a name to identify the job's input.|
   |IotHubNamespace|MyASAIoTHub|Choose or enter the name of your IoT hub. IoT hub names are automatically detected if they're created in the same subscription.|
   |SharedAccessPolicyName|iothubowner| |

   You can use the CodeLens feature to help you enter a string, select from a drop-down list, or change the text directly in the file. The following screenshot shows **Select from your Subscriptions** as an example. The credentials are auto-listed and saved in local credential manager.

    :::image type="content" source="./media/quick-create-visual-studio-code/configure-input.png" lightbox="./media/quick-create-visual-studio-code/configure-input.png" alt-text="Screenshot showing the launch of CodeLens feature in VS Code."::: 

    After you select a subscription, **select an IoT hub** if you have multiple hubs in that subscription. 

    :::image type="content" source="./media/quick-create-visual-studio-code/select-iot-hub.png" lightbox="./media/quick-create-visual-studio-code/select-iot-hub.png" alt-text="Screenshot showing the selection of your IoT hub in VS Code."::: 

    > [!IMPORTANT]
    > Make sure that the name of the input is **Input** as the query expect it. 

## Preview input

Select **Preview data** in **IoTHub1.json** from the top line. Some input data will be fetched from the IoT hub and shown in the preview window. This process might take a while.

:::image type="content" source="./media/quick-create-visual-studio-code/preview-live-input.png" lightbox="./media/quick-create-visual-studio-code/preview-live-input.png"  alt-text="Screenshot showing the preview of input data in your IoT hub."::: 

## Define an output

1. Select **Ctrl+Shift+P** to open the command palette. Then, enter **ASA: Add Output**.
2. Choose **Data Lake Storage Gen2/Blob Storage** for the sink type.
3. Choose the Stream Analytics query script that will use this input.
4. Enter the output file name as **BlobStorage**.
5. Edit **BlobStorage** by using the following values. Keep default values for fields not mentioned here. Use the **CodeLens** feature to help you select an Azure subscription and storage account name from a drop-down list or manually enter values.

   |Setting|Suggested value|Description|
   |-------|---------------|-----------|
   |Name|Output| Enter a name to identify the job's output.|
   |Storage Account| &lt;Name of your storage account&gt; |Choose or enter the name of your storage account. Storage account names are automatically detected if they're created in the same subscription.|
   |Container|container1|Select the existing container that you created in your storage account.|
   |Path Pattern|output|Enter the name of a file path to be created within the container.|

   :::image type="content" source="./media/quick-create-visual-studio-code/configure-output.png" lightbox="./media/quick-create-visual-studio-code/configure-output.png" alt-text="Screenshot showing the configuration of output for the Stream Analytics job."::: 

    > [!IMPORTANT]
    > Make sure that the name of the output is **Output** as the query expect it. 

## Compile the script

Script compilation checks syntax and generates the Azure Resource Manager templates for automatic deployment. There are two ways to trigger script compilation:

- Select the script from the workspace and then compile from the command palette.

   :::image type="content" source="./media/quick-create-visual-studio-code/compile-script-1.png" lightbox="./media/quick-create-visual-studio-code/compile-script-1.png" alt-text="Screenshot showing the compilation of script option from the command palette."::: 
- Right-click the script and select **ASA: Compile Script**.

   :::image type="content" source="./media/quick-create-visual-studio-code/compile-script-2.png" lightbox="./media/quick-create-visual-studio-code/compile-script-2.png" alt-text="Screenshot showing the compilation of script option from the Stream Analytics explorer in VS Code."::: 

After compilation, you can see results in the **Output** window. You can find the two generated Azure Resource Manager templates in the **Deploy** subfolder in your project folder. These two files are used for automatic deployment.

:::image type="content" source="./media/quick-create-visual-studio-code/deployment-templates.png" lightbox="./media/quick-create-visual-studio-code/deployment-templates.png" alt-text="Screenshot showing the generated deployment templates in the project folder."::: 

## Submit a Stream Analytics job to Azure

1. In the script editor window of your query script, select **Submit to Azure**.

:::image type="content" source="./media/quick-create-visual-studio-code/submit-job.png" lightbox="./media/quick-create-visual-studio-code/submit-job.png"  alt-text="Screenshot showing the submit job button to submit the Stream Analytics job to Azure."::: 
2. Select your subscription from the pop-up list.
3. Choose **Select a job**. Then choose **Create New Job**.
4. Enter your job name, **myASAjob**. Then follow the instructions to choose the resource group and location.
5. Select **Publish to Azure**. You can find the logs in the output window. 
6. When your job is created, you can see it in **Stream Analytics Explorer**. See the image in the next section.

## Start the Stream Analytics job and check output

1. Open **Stream Analytics Explorer** in Visual Studio Code and find your job, **myASAJob**.
2. Select **Start** from the **Cloud view** page (OR) right-click the job name in Stream Analytics explorer, and select **Start** from the context menu.

    :::image type="content" source="./media/quick-create-visual-studio-code/start-asa-job-vs-code.png" lightbox="./media/quick-create-visual-studio-code/start-asa-job-vs-code.png"  alt-text="Screenshot showing the Start job button in the Cloud view page."::: 
4. Note that the job status has changed to **Running**. Right-click the job name and select **Open Job View in Portal** to see the input and output event metrics. This action might take a few minutes.
5. To view the results, open the blob storage in the Visual Studio Code extension or in the Azure portal.

    :::image type="content" source="./media/quick-create-visual-studio-code/output-files.png" lightbox="./media/quick-create-visual-studio-code/output-files.png" alt-text="Screenshot showing the output file in the Blob container.":::

    Download and open the file to see output.

    ```json
    {"messageId":11,"deviceId":"Raspberry Pi Web Client","temperature":28.165519323167562,"humidity":76.875393581654379,"EventProcessedUtcTime":"2022-09-01T22:53:58.1015921Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:52:57.6250000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:52:57.6290000Z"}}
    {"messageId":14,"deviceId":"Raspberry Pi Web Client","temperature":29.014941877871451,"humidity":64.93477299527828,"EventProcessedUtcTime":"2022-09-01T22:53:58.2421545Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:53:03.6100000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:53:03.6140000Z"}}
    {"messageId":17,"deviceId":"Raspberry Pi Web Client","temperature":28.032846241745975,"humidity":66.146114343897338,"EventProcessedUtcTime":"2022-09-01T22:53:58.2421545Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:53:19.5960000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:53:19.5830000Z"}}
    {"messageId":18,"deviceId":"Raspberry Pi Web Client","temperature":30.176185593576143,"humidity":72.697359909427419,"EventProcessedUtcTime":"2022-09-01T22:53:58.2421545Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:53:21.6120000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:53:21.6140000Z"}}
    {"messageId":20,"deviceId":"Raspberry Pi Web Client","temperature":27.851894248213021,"humidity":71.610229530268214,"EventProcessedUtcTime":"2022-09-01T22:53:58.2421545Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:53:25.6270000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:53:25.6140000Z"}}
    {"messageId":21,"deviceId":"Raspberry Pi Web Client","temperature":27.718624694772238,"humidity":66.540445035685153,"EventProcessedUtcTime":"2022-09-01T22:53:58.2421545Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:53:48.0820000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:53:48.0830000Z"}}
    {"messageId":22,"deviceId":"Raspberry Pi Web Client","temperature":27.7849054424326,"humidity":74.300662748167085,"EventProcessedUtcTime":"2022-09-01T22:54:09.3393532Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:54:09.2390000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:54:09.2400000Z"}}
    {"messageId":28,"deviceId":"Raspberry Pi Web Client","temperature":30.839892925680324,"humidity":76.237611741451786,"EventProcessedUtcTime":"2022-09-01T22:54:47.8053253Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:54:47.6180000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:54:47.6150000Z"}}
    {"messageId":29,"deviceId":"Raspberry Pi Web Client","temperature":30.561040300759053,"humidity":78.3845172058103,"EventProcessedUtcTime":"2022-09-01T22:54:49.8070489Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:54:49.6030000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:54:49.5990000Z"}}
    {"messageId":31,"deviceId":"Raspberry Pi Web Client","temperature":28.163585438418679,"humidity":60.0511571297096,"EventProcessedUtcTime":"2022-09-01T22:55:25.1528729Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:55:24.9050000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:55:24.9120000Z"}}
    {"messageId":32,"deviceId":"Raspberry Pi Web Client","temperature":31.00503387156985,"humidity":78.68821066044552,"EventProcessedUtcTime":"2022-09-01T22:55:43.2652127Z","PartitionId":3,"EventEnqueuedUtcTime":"2022-09-01T22:55:43.0480000Z","IoTHub":{"MessageId":null,"CorrelationId":null,"ConnectionDeviceId":"MyASAIoTDevice","ConnectionDeviceGenerationId":"637976642928634103","EnqueuedTime":"2022-09-01T22:55:43.0520000Z"}}
    ```
    

## Clean up resources

When they're no longer needed, delete the resource group, the streaming job, and all related resources. Deleting the job avoids billing the streaming units that the job consumes. 

If you're planning to use the job in the future, you can stop it and restart it later. If you're not going to use this job again, use the following steps to delete all resources that you created in this quickstart:

1. From the left menu in the Azure portal, select **Resource groups** and then select the name of the resource that you created.  

2. On your resource group page, select **Delete**. Enter the name of the resource to delete in the text box, and then select **Delete**.

## Next steps

In this quickstart, you deployed a simple Stream Analytics job by using Visual Studio Code. You can also deploy Stream Analytics jobs by using the [Azure portal](stream-analytics-quick-create-portal.md), [PowerShell](stream-analytics-quick-create-powershell.md), and [Visual Studio](stream-analytics-quick-create-vs.md).

To learn about Azure Stream Analytics Tools for Visual Studio Code, continue to the following articles:

* [Test Stream Analytics queries locally with sample data using Visual Studio Code](visual-studio-code-local-run.md)

* [Test Azure Stream Analytics jobs locally against live input with Visual Studio Code](visual-studio-code-local-run-live-input.md)

* [Use Visual Studio Code to view Azure Stream Analytics jobs](visual-studio-code-explore-jobs.md)

* [Set up CI/CD pipelines by using the npm package](./cicd-overview.md)
