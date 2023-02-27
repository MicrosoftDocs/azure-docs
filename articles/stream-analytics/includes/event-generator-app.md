---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 02/27/2023
ms.author: spelluru
ms.custom: "include file"

---

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an event hub

Before Stream Analytics can analyze the fraudulent calls data stream, the data needs to be sent to Azure. In this tutorial, you'll send data to Azure by using  [Azure Event Hubs](../../event-hubs/event-hubs-about.md).

Use the following steps to create an event hub and send call data to that event hub:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource** > **Internet of Things** > **Event Hubs**. 

    :::image type="content" source="media/stream-analytics-real-time-fraud-detection/find-event-hub-resource.png" alt-text="Screenshot showing the Event Hubs creation page.":::
3. Fill out the **Create Namespace** pane with the following values:

   |**Setting**  |**Suggested value** |**Description**  |
   |---------|---------|---------|
   |Subscription     |   \<Your subscription\>      |   Select an Azure subscription where you want to create the event hub.      |
   |Resource group     |   MyASADemoRG      |  Select **Create New** and enter a new resource-group name for your account.       |
   |Namespace name     | asaTutorialEventHubNS        |  A unique name to identify the event hub namespace.       |
   |Location     |   West US2      |    Location where the event hub namespace can be deployed.     |
4. Use default options on the remaining settings and select **Review + create**. Then select **Create** to start the deployment.

    :::image type="content" source="media/stream-analytics-real-time-fraud-detection/create-event-hub-namespace.png" alt-text="Screenshot showing the Create Namespace page.":::
5. After the namespace is deployed successfully, select **Go to resource** to navigate to the **Event Hubs Namespace** page.
6. On the **Event Hubs Namespace** page, select **+Event Hub** on the command bar.

    :::image type="content" source="media/stream-analytics-real-time-fraud-detection/add-event-hub-button.png" alt-text="Screenshot showing the Add event hub button on the Event Hubs Namespace page.":::    
1. On the **Create Event Hub** page, enter a **Name** for the event hub. Set the **Partition Count** to 2.  Use the default options in the remaining settings and select **Create**. Then wait for the deployment to succeed.

    :::image type="content" source="media/stream-analytics-real-time-fraud-detection/create-event-hub-portal.png" alt-text="Screenshot showing the Create event hub page.":::    

### Grant access to the event hub and get a connection string

Before an application can send data to Azure Event Hubs, the event hub must have a policy that allows access. The access policy produces a connection string that includes authorization information.

1. On the **Event Hubs Namespace**, select **Event Hubs** under **Entities** on the left menu, and then select the event hub you created.

    :::image type="content" source="media/stream-analytics-real-time-fraud-detection/select-event-hub.png" alt-text="Screenshot showing the selection of an event hub on the Event Hubs page."::: 
1. On the **Event Hubs instance** page, select **Shared access policies** under **Settings** on the left menu, and then select **+ Add** on the command bar. 
2. Name the policy **MyPolicy**, ensure **Manage** is checked, and then select **Create**.

    :::image type="content" source="media/stream-analytics-real-time-fraud-detection/create-event-hub-access-policy.png" alt-text="Screenshot showing Shared access policies page for an event hub."::: 
3. Once the policy is created, select the policy name to open the policy. Find the **Connection string–primary key**. Select the **copy** button next to the connection string.

   ![Save the shared access policy connection string](media/stream-analytics-real-time-fraud-detection/save-connection-string.png)

4. Paste the connection string into a text editor. You need this connection string in the next section.

   The connection string looks as follows:

   `Endpoint=sb://<Your event hub namespace>.servicebus.windows.net/;SharedAccessKeyName=<Your shared access policy name>;SharedAccessKey=<generated key>;EntityPath=<Your event hub name>`

   Notice that the connection string contains multiple key-value pairs separated with semicolons: **Endpoint**, **SharedAccessKeyName**, **SharedAccessKey**, and **EntityPath**.

## Start the event generator application

Before you start the TelcoGenerator app, you should configure it to send data to the Azure Event Hubs you created earlier.

1. Extract the contents of [TelcoGenerator.zip](https://aka.ms/asatelcodatagen) file.
2. Open the `TelcoGenerator\TelcoGenerator\telcodatagen.exe.config` file in a text editor of your choice There's more than one `.config` file, so be sure that you open the correct one.
3. Update the `<appSettings>` element in the config file with the following details:

   * Set the value of the **EventHubName** key to the value of the **EntityPath** at the end of the connection string.
   * Set the value of the **Microsoft.ServiceBus.ConnectionString** key to the connection string **without** the EntityPath value at the end. **Don't forget** to remove the semicolon that precedes the EntityPath value.
4. Save the file.

5. Next open a command window and change to the folder where you unzipped the TelcoGenerator application. Then enter the following command:

   ```cmd
   .\telcodatagen.exe 1000 0.2 2
   ```

   This command takes the following parameters:
   * Number of call data records per hour.
   * Percentage of fraud probability, which is how often the app should simulate a fraudulent call. The value 0.2 means that about 20% of the call records will look fraudulent.
   * Duration in hours, which is the number of hours that the app should run. You can also stop the app at any time by ending the process (**Ctrl+C**) at the command line.

   After a few seconds, the app starts displaying phone call records on the screen as it sends them to the event hub. The phone call data contains the following fields:

   |**Record**  |**Definition**  |
   |---------|---------|
   |CallrecTime    |  The timestamp for the call start time.       |
   |SwitchNum     |  The telephone switch used to connect the call. For this example, the switches are strings that represent the country/region of origin (US, China, UK, Germany, or Australia).       |
   |CallingNum     |  The phone number of the caller.       |
   |CallingIMSI     |  The International Mobile Subscriber Identity (IMSI). It's a unique identifier of the caller.       |
   |CalledNum     |   The phone number of the call recipient.      |
   |CalledIMSI     |  International Mobile Subscriber Identity (IMSI). It's a unique identifier of the call recipient.       |

## Create a Stream Analytics job

Now that you have a stream of call events, you can create a Stream Analytics job that reads data from the event hub.

1. To create a Stream Analytics job, navigate to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource** and search for **Stream Analytics job**. Select the **Stream Analytics job** tile and select **Create**.
3. Fill out the **New Stream Analytics job** form with the following values:

   |**Setting**  |**Suggested value**  |**Description**  |
   |---------|---------|---------|
   |Subscription    |  \<Your subscription\>   |   Select an Azure subscription where you want to create the job.       |
   |Resource group   |   MyASADemoRG      |   Select **Use existing** and enter a new resource-group name for your account.      |
   |Job name     |  ASATutorial       |   A unique name to identify the event hub namespace.      |
   |Location   |    West US2     |   	Location where the job can be deployed. It's recommended to place the job and the event hub in the same region for best performance and so that you don't pay to transfer data between regions.      |
   |Hosting environment    | Cloud        |     Stream Analytics jobs can be deployed to cloud or edge. **Cloud** allows you to deploy to Azure Cloud, and **Edge** allows you to deploy to an IoT Edge device.    |
   |Streaming units     |    1	     |   	Streaming units represent the computing resources that are required to execute a job. By default, this value is set to 1. To learn about scaling streaming units, see [understanding and adjusting streaming units](../stream-analytics-streaming-unit-consumption.md) article.      |
4. Use default options on the remaining settings, select **Create**, and wait for the deployment to succeed.

   ![Create an Azure Stream Analytics job](media/stream-analytics-real-time-fraud-detection/create-stream-analytics-job.png)
5. After the job is deployed, select **Go to resource** to navigate to the **Stream Analytics job** page. 

## Configure job input

The next step is to define an input source for the job to read data using the event hub you created in the previous section.

2. On the **Stream Analytics job** page, in the **Job Topology** section on the left menu, select **Inputs**.
3. On the **Inputs** page, select **+ Add stream input** and **Event hub**. 

    :::image type="content" source="media/stream-analytics-real-time-fraud-detection/add-input-event-hub-menu.png" lightbox="media/stream-analytics-real-time-fraud-detection/add-input-event-hub-menu.png" alt-text="Screenshot showing the Input page for a Stream Analytics job."::: 
4. Fill out the input form with the following values:

   |**Setting**  |**Suggested value**  |**Description**  |
   |---------|---------|---------|
   |Input alias     |  CallStream       |  Provide a friendly name to identify your input. Input alias can contain alphanumeric characters, hyphens, and underscores only and must be 3-63 characters long.       |
   |Subscription    |   \<Your subscription\>      |   Select the Azure subscription where you created the event hub. The event hub can be in same or a different subscription as the Stream Analytics job.       |
   |Event hub namespace    |  asaTutorialEventHub       |  Select the event hub namespace you created in the previous section. All the event hub namespaces available in your current subscription are listed in the dropdown.       |
   |Event hub name    |   MyEventHub      |  Select the event hub you created in the previous section. All the event hubs available in your current subscription are listed in the dropdown.       |
   | Authentication mode  |   Connection string      |  In this tutorial, you'll use the connection string to connect to the event hub.   |
   |Event hub policy name   |  MyPolicy       |  Select **Use existing**, and then select the policy you created earlier in this tutorial.  |

4. Use default options on the remaining settings and select **Save**.

    :::image type="content" source="media/stream-analytics-real-time-fraud-detection/configure-stream-analytics-input.png" alt-text="Screenshot showing the Event Hubs configuration page for an input."::: 

## Create a consumer group

We recommend that you use a distinct consumer group for each Stream Analytics job. If no consumer group is specified, the Stream Analytics job uses the $Default consumer group. When a job contains a self-join or has multiple inputs, some inputs later might be read by more than one reader. This situation affects the number of readers in a single consumer group.

To add a new consumer group:

1. In the Azure portal, go to your Event Hubs instance.
1. In the left menu, under **Entities**, select **Consumer groups**.
1. Select **+ Consumer group** on the command bar.

   :::image type="content" source="media/stream-analytics-real-time-fraud-detection/create-consumer-group.png" alt-text="Screenshot that shows creating a new consumer group.":::
1. In **Name**, enter a name for your new consumer group. For example, *MyConsumerGroup*.
1. Select **Create**.
