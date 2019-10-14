---
title: 'Tutorial: Use Java with Azure Functions to update a Cosmos DB in response to Event Hub events'
description: This tutorial shows you how to consume Event Hub events and produce Cosmos DB updates using an Azure Function written in Java
author: KarlErickson
manager: barbkess
ms.service: azure-functions
ms.devlang: java
ms.topic: tutorial
ms.date: 10/04/2019
ms.author: karler
---

# Tutorial: Create an Azure function in Java with an Event Hub trigger and Cosmos DB output binding

<!-- TODO figure out exact brand/usage requirements for event hub(s) -->

This tutorial shows you how to create an Azure Function that is triggered by Event Hub events representing temperature and pressure inputs. The function responds to the event data by adding status entries to a Cosmos DB.

<!-- In this tutorial, you learn to: 
 -->
<!-- TODO update this list -->

<!-- > [!div class="checklist"]
> * Create Azure resources an Event Hub, Cosmos DB, and storage account 
> * Import a custom TensorFlow machine learning model into a function app
> * Build a serverless HTTP API for predicting whether a photo contains a dog or a cat
> * Consume the API from a web application

![Screenshot of finished project](media/functions-machine-learning-tensorflow/functions-machine-learning-tensorflow-screenshot.png) -->

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

<!-- TODO links -->

* [Java Developer Kit](https://aka.ms/azure-jdks), version 8
* [Visual Studio Code](https://code.visualstudio.com)
* [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for VS Code
* [Azure Event Hub Explorer](https://marketplace.visualstudio.com/items?itemName=Summer.azure-event-hub-explorer) extension for VS Code

<!-- TODO include info on Azure CLI and Cloud Shell -->

<!-- 
To create Azure Functions in Python, you need to install a few tools.

- [Python 3.6](https://www.python.org/downloads/release/python-360/)
- [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/) -->

<!-- TODO consider replacing portal instructions/topic-links with Azure CLI snippets -->

## Create Azure resources

First, create the following resources:

* A resource group
* An Event Hubs namespace and event hub
* A Cosmos DB account, database, and collection
* A function app and a storage account to host it

You can use the following commands to create these resources:

```azurecli
export SUBSCRIPTION_ID=<value>
export RESOURCE_GROUP=<value>
export LOCATION=<value>
export EVENT_HUB_NAMESPACE=<value>
export EVENT_HUB_NAME=<value>
export COSMOS_DB_ACCOUNT=<value>
export STORAGE_ACCOUNT=<value>
export FUNCTION_APP=<value>

export DATABASE_NAME=TelemetryDb
export COLLECTION_NAME=TelemetryInfo
export PARTITION_KEY_PATH='/temperatureStatus'

az login

az account set --subscription $SUBSCRIPTION_ID

az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION

az eventhubs namespace create \
    --name $EVENT_HUB_NAMESPACE \
    --resource-group $RESOURCE_GROUP

az eventhubs eventhub create \
    --name $EVENT_HUB_NAME \
    --namespace-name $EVENT_HUB_NAMESPACE \
    --resource-group $RESOURCE_GROUP

az cosmosdb create \
    --name $COSMOS_DB_ACCOUNT \
    --resource-group $RESOURCE_GROUP

az cosmosdb database create \
    --db-name $DATABASE_NAME \
    --name $COSMOS_DB_ACCOUNT \
    --resource-group-name $RESOURCE_GROUP

 az cosmosdb collection create \
    --collection-name $COLLECTION_NAME \
    --db-name $DATABASE_NAME \
    --name $COSMOS_DB_ACCOUNT \
    --partition-key-path $PARTITION_KEY_PATH \
    --resource-group-name $RESOURCE_GROUP

az storage account create \
    --name $STORAGE_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --sku Standard_LRS

az functionapp create \
    --name $FUNCTION_APP \
    --resource-group $RESOURCE_GROUP \
    --storage-account $STORAGE_ACCOUNT \
    --consumption-plan-location $LOCATION \
    --runtime java
```

<!-- ## Create an Event Hub

First, use the Azure portal to create a resource group, an Event Hubs namespace, and an event hub. Follow the instructions at [Quickstart: Create an event hub using Azure portal](/azure/event-hubs/event-hubs-create).

## Create a Cosmos DB

Next, create a Cosmos DB account in the same resource group. Then, add a container using `TelemetryDb` for the database ID, `TelemetryInfo` for the container ID, and  `/temperatureStatus` for the partition key. For instructions, see [Quickstart: Create an Azure Cosmos account, container, and items with the Azure portal](/azure/cosmos-db/create-cosmosdb-resources-portal).

## Create a function app

Next, create a function app in the same resource group and region that you used previously. Follow the instructions at [Create your first function in the Azure portal](/azure/azure-functions/functions-create-first-azure-function), but skip the part where you create a new function. Be sure to set the runtime stack to Java. For storage, select **Create new**. This storage account is where your function app will be hosted.
 -->

## Create a function project in Visual Studio Code

Next, use Visual Studio to create a 
For this tutorial, we will use Visual Studio code to create the function. If you haven’t used it before, follow the steps  https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-vs-code and create your functions project with a function. If this is your first function app and you are unsure of the values to input for groupId, artifactId, package – see https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-java-maven#generate-a-new-functions-project to as a reference. Use similar (yet not same) values so they make sense for your app. Make sure to change the appname (it has to be unique, so change the numbers at the end).p We now have a function app with http trigger set up.  

## Configure the project

Open the `local.settings.json` file and replace it with the following code. Replace the placeholders with the connection strings for the resources you created previously. You can find these connection strings in the Azure portal. Navigate to your storage account and select **Access keys** > **key1** > **Connection string**


<!-- TODO more details on where to find in portal. screenshots? -->

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "<storage account connection string>",
    "EventHubConnection": "<Event Hub connection string>",
    "AzureWebJobsCosmosDBConnectionString": "<Cosmos DB connection string>",
    "FUNCTIONS_WORKER_RUNTIME": "java"
  }
}
```

AzureWebJobsStorage –  
In the portal, go to your resource-group -> storage account. Select **Access Keys** under “Settings”. Copy the connection string for key 1 and paste it for AzureWebJobsStorage in local.settings.json 


EventHubConnection –  
In the portal, go to your resource-group -> event hub namespace -> (left sub pane) Event hubs and click on your event hub. Select **Shared Access policies** and add policy with Manage permissions. Once added, click on the policy and copy the connection string-primary key that shows up. Paste that value in EventHubConnection setting in local.settings.json 

**Shared access policies** > **RootManageSharedAccessKey** > **Connection string--primary key**

AzureWebJobsCosmosDBConnectionString –  
In the portal, go to your resource-group -> cosmos db account. Click on “Keys” in Sub left nav under “Settings”. From the Read/Write keys tab, copy the Primary connection string and paste it for AzureWebJobsCosmosDBConnectionString in local.settings.json 

**Keys** > **Read-write Keys** > **PRIMARY CONNECTION STRING**

## Add code

Open the `Function.java` file and replace the contents with the following code. Replace `<Event Hub name>` with the name of the Event Hub you created inside your Event Hub namespace.

<!-- TODO replace namespace, too, or direct user to use weatherdetector -->

```java
package com.weatherdetector.function;

import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;
import com.weatherdetector.function.TelemetryItem.status;

public class Function {
    @FunctionName("EventHubTrigger-Java")
    public void run(
        @EventHubTrigger(name = "msg", eventHubName = "<Event Hub name>",
            cardinality = Cardinality.ONE, connection = "EventHubConnection")
        TelemetryItem item,
        @CosmosDBOutput(name = "databaseOutput",
            databaseName = "TelemetryDb", collectionName = "TelemetryInfo",
            connectionStringSetting = "AzureWebJobsCosmosDBConnectionString")
        OutputBinding<TelemetryItem> document,
        final ExecutionContext context) {

        context.getLogger().info("Event hub message received: " + item.toString());

        if (item.getPressure() > 30) {
            item.setNormalPressure(false);
        } else {
            item.setNormalPressure(true);
        }

        if (item.getTemperature() < 40) {
            item.setTemperatureStatus(status.COOL);
        } else if (item.getTemperature() > 90) { 
            item.setTemperatureStatus(status.HOT);
        } else {
            item.setTemperatureStatus(status.WARM);
        }

        document.setValue(item);
    }
}
```

Next, create a new file called `TelemetryItem.java` in the same location as `Function.java` and add the following code:

```java
package com.weatherdetector.function;

public class TelemetryItem {

    private String id;
    private double temperature;
    private double pressure;
    private boolean isNormalPressure;
    private status temperatureStatus;
    static enum status {
        COOL,
        WARM,
        HOT
    }

    public String getId() {
        return id;
    }

    public double getTemperature() {
        return temperature;
    }

    public double getPressure() {
        return pressure;
    }

    @Override
    public String toString() {
        return "TelemetryItem={id=" + id + ",temperature=" + temperature + ",pressure=" + pressure + "}";
    }

    public boolean isNormalPressure() {
        return isNormalPressure;
    }

    public void setNormalPressure(boolean isNormal) {
        this.isNormalPressure = isNormal;
    }

    public status getTemperatureStatus() {
        return temperatureStatus;
    }

    public void setTemperatureStatus(status temperatureStatus) {
        this.temperatureStatus = temperatureStatus;
    }
}
```

<!-- TODO remove test code or provide instructions that skip the test phase -->

## Run locally

Running locally: 
Click F5 to run the function app locally. If you see an error saying “.Net Core is needed on path”, download it from the website mentioned and run ln -s /usr/local/share/dotnet/dotnet /usr/local/bin/ for linking it symbolically. This is a known issue and is currently being worked on. 
  
Testing locally: 
Get the Azure Event Hub Explorer VSCode extension.  
Start the function app locally (F5) if it isn’t already running. 
Then in the menu bar, click View -> Command Palette >EventHub: Select Event Hub 
Follow the prompts to pick your subscription, resource-group, event hub namespace and event hub entity. 
Then open the command palette again and go to >EventHub: Send message to event hub 

Enter a message such as:

```json
{ "pressure": "38.8", "temperature": "28.8" }
```

to send and hit Enter 
See your function execute 


Cosmos DB account > **Data Explorer** > **TelemetryDb** > **TelemetryInfo** > **Items**

example:
{
    "id": "TEST222",
    "temperature": 28.8,
    "pressure": 38.8,
    "isNormalPressure": false,
    "temperatureStatus": "COOL",
    "_rid": "wIR4AK5lQHQHAAAAAAAAAA==",
    "_self": "dbs/wIR4AA==/colls/wIR4AK5lQHQ=/docs/wIR4AK5lQHQHAAAAAAAAAA==/",
    "_etag": "\"1a007499-0000-0700-0000-5d9d380b0000\"",
    "_attachments": "attachments/",
    "_ts": 1570584587
}
or screenshot

Windows: If you are running on Windows, you could also download service bus explorer using  https://github.com/paolosalvatori/ServiceBusExplorer and do File / Connect / select "Connection String". You will now see the function app being triggered in your VSCode terminal window.

## Deploy to Azure

In VSCode command pallet, do >Azure Functions: Upload Local Settings. Follow prompts – Select your function app in Azure. Go to the portal -> Function App -> and in the Overview tab, under Configured Features, click Configuration. to make sure all your settings are uploaded correctly.  
Then in the command palette do >Azure Functions: Deploy to Function App and select your function app. Once deployment is successful, you should be able to in your portal, see function.json in your app. 

## Test in Azure

Follow the same steps that you used to test locally. This time your function app is running in Azure. Based on the function app logic, you can go to the cosmos db created in your resource group to see items being creates (as we used output binding). 

## Clean up resources

When you are finished with the Azure resources you created in this topic, you can delete them using the following command:

```azurecli
az group delete --name $RESOURCE_GROUP
```

## Next steps

In this tutorial, you learned how to ...

<!-- build and customize an HTTP API with Azure Functions to make predictions using a TensorFlow model. You also learned how to call the API from a web application.

You can use the techniques in this tutorial to build out APIs of any complexity, all while running on the serverless compute model provided by Azure Functions.

To deploy the function app to Azure, use the [Azure Functions Core Tools](./functions-run-local.md#publish) or [Visual Studio Code](https://code.visualstudio.com/docs/python/tutorial-azure-functions).

> [!div class="nextstepaction"]
> [Azure Functions Python Developer Guide](./functions-reference-python.md)


Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md) -->
