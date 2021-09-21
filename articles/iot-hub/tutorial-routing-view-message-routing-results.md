---
title: Tutorial - View Azure IoT Hub message routing results (.NET) | Microsoft Docs
description: Tutorial - After setting up all of the resources using Part 1 of the tutorial, add the ability to route messages to Azure Stream Analytics and view the results in Power BI.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 09/16/2021
ms.author: robinsh
ms.custom: "mvc, devx-track-csharp, devx-track-azurepowershell"
#Customer intent: As a developer, I want to be able to route messages sent to my IoT hub to different destinations based on properties stored in the message.
---
# Tutorial: Part 2 - View the routed messages

[!INCLUDE [iot-hub-include-routing-intro](../../includes/iot-hub-include-routing-intro.md)]

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Rules for routing the messages

These are the rules for the message routing; these were set up in Part 1 of this tutorial, and you see them work in this second part.

|Value |Result|
|------|------|
|level="storage" |Write to Azure Storage.|
|level="critical" |Write to a Service Bus queue. A Logic App retrieves the message from the queue and uses Office 365 to e-mail the message.|
|default |Display this data using Power BI.|

Now you create the resources to which the messages will be routed, run an app to send messages to the hub, and see the routing in action.

## Create a Logic App  

The Service Bus queue is to be used for receiving messages designated as critical. Set up a Logic app to monitor the Service Bus queue, and send an e-mail when a message is added to the queue.

1. In the [Azure portal](https://portal.azure.com), select **+ Create a resource**. Put **logic app** in the search box and click Enter. From the search results displayed, select Logic App, then select **Create** to continue to the **Create logic app** pane. Fill in the fields.

   **Name**: This field is the name of the logic app. This tutorial uses **ContosoLogicApp**.

   **Subscription**: Select your Azure subscription.

   **Resource group**: Select **Use existing** and select your resource group. This tutorial uses **ContosoResources**.

   **Location**: Use your location. This tutorial uses **West US**.

   **Enable Log Analytics**: This toggle should be turned off.

   ![The Create Logic App screen](./media/tutorial-routing-view-message-routing-results/create-logic-app.png)

   Select **Create**. It may take a few minutes for the app to deploy.

2. Now go to the Logic App. If you're still on the deployment page, you can select **Go To Resource**. Another way to get to the Logic App is to select **Resource groups**, select your resource group (this tutorial uses **ContosoResources**), then select the Logic App from the list of resources. 

    Select **Logic Apps Designer** from the columm in the middle. Scroll down until you see the tile that says **Blank Logic App +** and select it. The default tab is "For You". If this pane is blank, select **All** to see all of the connectors and triggers available.

3. Select **Service Bus** from the list of connectors.

   ![The list of connectors](./media/tutorial-routing-view-message-routing-results/logic-app-connectors.png)

4. Select **+New Step**. The **Choose an operation** pane is displayed. Select **Office 365 Outlook** and then in the list, find and select **Send an Email (V2)**. Sign in to your Office 365 account. 

5. ![Select to send-an-email from one of the Oulook connectors](./media/tutorial-routing-view-message-routing-results/logic-app-send-email.png) 
Fill in the fields:

   **To:** Put in the e-mail address where the warning should be sent.

   **Subject:** Fill in the subject for the e-mail.

   **Body**: Fill in some text for the body. If you click **Add dynamic**, it will show fields you can pick from the e-mail to include. Select **Body** to have the body from the e-mail displayed in the error message.

   Click **Save** to save your changes. Close the Logic app Designer. 

<!-- chunk 1 - azure stream analytics goes here 
end chunk 1 here --> 

## Run simulated device app

In Part 1 of this tutorial, you set up a device to simulate using an IoT device. In this section, you download the .NET console app that simulates that device sending device-to-cloud messages to an IoT hub (assuming you didn't already download the app and resources in Part 1).

This application sends messages for each of the different message routing methods. There is also a folder in the download that contains the complete Azure Resource Manager template and parameters file, as well as the Azure CLI and PowerShell scripts.

If you didn't download the files from the repository in Part 1 of this tutorial, go ahead and download them now from [IoT Device Simulation](https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip). Selecting this link downloads a repository with several applications in it; the solution you are looking for is iot-hub/Tutorials/Routing/IoT_SimulatedDevice.sln. 

Double-click on the solution file (IoT_SimulatedDevice.sln) to open the code in Visual Studio, then open Program.cs. Substitute `{your hub name}` with the IoT hub host name. The format of the IoT hub host name is **{iot-hub-name}.azure-devices.net**. For this tutorial, the hub host name is **ContosoTestHub.azure-devices.net**. Next, substitute `{your device key}` with the device key you saved earlier when setting up the simulated device. 

   ```csharp
        static string s_myDeviceId = "Contoso-Test-Device";
        static string s_iotHubUri = "ContosoTestHub.azure-devices.net";
        // This is the primary key for the device. This is in the portal. 
        // Find your IoT hub in the portal > IoT devices > select your device > copy the key. 
        static string s_deviceKey = "{your device key}";
   ```

## Run and test

Run the console application. Wait a few minutes. You can see the messages being sent on the console screen of the application.

The app sends a new device-to-cloud message to the IoT hub every second. The message contains a JSON-serialized object with the device ID, temperature, humidity, and message level, which defaults to `normal`. It randomly assigns a level of `critical` or `storage`, causing the message to be routed to the storage account or to the Service Bus queue (which triggers your Logic App to send an e-mail). The default (`normal`) readings can be displayed in a BI report. <!--deleted part of sentence-->

If everything is set up correctly, at this point you should see the following results:

1. You start getting e-mails about critical messages.

   ![The resulting emails](./media/tutorial-routing-view-message-routing-results/results-in-email.png)

   This result means the following statements are true. 

   * The routing to the Service Bus queue is working correctly.
   * The Logic App retrieving the message from the Service Bus queue is working correctly.
   * The Logic App connector to Outlook is working correctly. 

2. In the [Azure portal](https://portal.azure.com), select **Resource groups** and select your Resource Group. This tutorial uses **ContosoResources**. 

    Select the storage account, select **Containers**, then select the Container. This tutorial uses **contosoresults**. You should see a folder, and you can drill down through the directories until you see one or more files. Open one of those files; they contain the entries routed to the storage account. 

   ![The result files in storage](./media/tutorial-routing-view-message-routing-results/results-in-storage.png)

This result means the following statement is true.

   * The routing to the storage account is working correctly.

<!-- chunk 2 -- power bi visualization goes here

end of chunk 2 --> 

## Clean up resources 

If you want to remove all of the Azure resources you've created through both parts of this tutorial, delete the resource group. This action deletes all resources contained within the group. In this case, it removes the IoT hub, the Service Bus namespace and queue, the Logic App, the storage account, and the resource group itself. You can also remove the Power BI resources and clear the emails sent during the tutorial.
<!-- chunk 3 goes here -->

### Use the Azure CLI to clean up resources

To remove the resource group, use the [az group delete](/cli/azure/group#az_group_delete) command. `$resourceGroup` was set to **ContosoResources** back at the beginning of this tutorial.

```azurecli-interactive
az group delete --name $resourceGroup
```

### Use PowerShell to clean up resources

To remove the resource group, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command. `$resourceGroup` was set to **ContosoResources** back at the beginning of this tutorial.

```azurepowershell-interactive
Remove-AzResourceGroup -Name $resourceGroup
```

### Clean up test emails

You may also want to delete the quantity of emails in your inbox that were generated through the Logic App while the device application was running.

## Next steps

In this 2-part tutorial, you learned how to use message routing to route IoT Hub messages to different destinations by performing the following tasks.  

**Part I: Create resources, set up message routing**
> [!div class="checklist"]
> * Create the resources -- an IoT hub, a storage account, a Service Bus queue, and a simulated device.
> * Configure the endpoints and message routes in IoT Hub for the storage account and Service Bus queue.

**Part II: Send messages to the hub, view routed results**
> [!div class="checklist"]
> * Create a Logic App that is triggered and sends e-mail when a message is added to the Service Bus queue.
> * Download and run an app that simulates an IoT Device sending messages to the hub for the different routing options.
<!-->
> * Create a Power BI visualization for data sent to the default endpoint.
-->
> * View the results ...
> * ...in the Service Bus queue and e-mails.
> * ...in the storage account.
<!-->
> * ...in the Power BI visualization.
-->

Advance to the next tutorial to learn how to manage the state of an IoT device. 

> [!div class="nextstepaction"]
> [Set up and use metrics and diagnostics with an IoT Hub](tutorial-use-metrics-and-diags.md)
