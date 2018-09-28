---
title: Install the Durable Functions extension and samples - Azure
description: Learn how to install the Durable Functions extension for Azure Functions, for portal development or Visual Studio development.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 08/31/2018
ms.author: azfuncdf
---

# Install the Durable Functions extension and samples (Azure Functions)

The [Durable Functions](durable-functions-overview.md) extension for Azure Functions is provided in the NuGet package [Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask). This article shows how to install the package and a set of samples for the following development environments:

* Visual Studio 2017 (Recommended for C#) 
* Visual Studio Code (Recommended for JavaScript)
* Azure portal

## Visual Studio 2017

Visual Studio currently provides the best experience for developing apps that use Durable Functions.  Your functions can be run locally and can also be published to Azure. You can start with an empty project or with a set of sample functions.

### Prerequisites

* Install the [latest version of Visual Studio](https://www.visualstudio.com/downloads/) (version 15.6 or greater). Include the **Azure development** workload in your setup options.

### Start with sample functions 

1. Download the [Sample App .zip file for Visual Studio](https://azure.github.io/azure-functions-durable-extension/files/VSDFSampleApp.zip). You don't need to add the NuGet reference because the sample project already has it.
2. Install and run [Azure Storage Emulator](https://docs.microsoft.com/azure/storage/storage-use-emulator) version 5.6 or later. Alternatively, you can update the *local.appsettings.json* file with real Azure Storage connection strings.
3. Open the project in Visual Studio 2017. 
4. For instructions on how to run the sample, start with [Function chaining - Hello sequence sample](durable-functions-sequence.md). The sample can be run locally or published to Azure.

### Start with an empty project
 
Follow the same directions as for starting with the sample, but do the following steps instead of downloading the *.zip* file:

1. Create a Function App project.
2. Search for the following NuGet package reference using *Manage NuGet Packages* and add it to the project: 
Microsoft.Azure.WebJobs.Extensions.DurableTask v1.6.0
   
## Visual Studio Code

Visual Studio Code provides a local development experience covering all major platforms - Windows, macOS, and Linux.  Your functions can be run locally and also be published to Azure. You can start with an empty project or with a set of sample functions.

### Prerequisites

* Install the [latest version of Visual Studio Code](https://code.visualstudio.com/Download) 

* Follow the instructions under "Install the Azure Functions Core Tools" at [Code and test Azure Functions locally](https://docs.microsoft.com/azure/azure-functions/functions-run-local)

    >[!IMPORTANT]
    > If you already have the Azure Functions Cross Platform Tools, update them to the latest available version.

    >[!IMPORTANT]
    >Durable Functions in JavaScript requires version 2.x of the Azure Functions Core Tools.

*  If you are on a Windows machine, install and run [Azure Storage Emulator](https://docs.microsoft.com/azure/storage/storage-use-emulator) version 5.6 or later. Alternatively, you can update the *local.appsettings.json* file with real Azure Storage connection. 


### Start with sample functions

#### C#

1. Clone the [Durable Functions repository](https://github.com/Azure/azure-functions-durable-extension.git).
2. Navigate on your machine to the [C# script samples folder](https://github.com/Azure/azure-functions-durable-extension/tree/master/samples/csx). 
3. Install Azure Functions Durable Extension by running the following in a command prompt / terminal window:

    ```bash
    func extensions install -p Microsoft.Azure.WebJobs.Extensions.DurableTask -v 1.6.0
    ```
4. Install Azure Functions Twilio Extension by running the following in a command prompt / terminal window:

    ```bash
    func extensions install -p Microsoft.Azure.WebJobs.Extensions.Twilio -v 3.0.0-beta8
    ```
5. Run Azure Storage Emulator or update the *local.appsettings.json* file with real Azure Storage connection string.
6. Open the project in Visual Studio Code. 
7. For instructions on how to run the sample, start with [Function chaining - Hello sequence sample](durable-functions-sequence.md). The sample can be run locally or published to Azure.
8. Start the project by running in command prompt / terminal the following command:
    ```bash
    func host start
    ```

#### JavaScript (Functions v2 only)

1. Clone the [Durable Functions repository](https://github.com/Azure/azure-functions-durable-extension.git).
2. Navigate on your machine to the [JavaScript samples folder](https://github.com/Azure/azure-functions-durable-extension/tree/master/samples/javascript). 
3. Install Azure Functions Durable Extension by running the following in a command prompt / terminal window:

    ```bash
    func extensions install -p Microsoft.Azure.WebJobs.Extensions.DurableTask -v 1.6.0
    ```
4. Restore the npm packages by running the following in a command prompt / terminal window:
    
    ```bash
    npm install
    ``` 
5. Update the *local.appsettings.json* file with the real Azure Storage connection string.
6. Open the project in Visual Studio Code. 
7. For instructions on how to run the sample, start with [Function chaining - Hello sequence sample](durable-functions-sequence.md). The sample can be run locally or published to Azure.
8. Start the project by running in command prompt / terminal the following command:
    ```bash
    func host start
    ```

### Start with an empty project
 
1. In command prompt / terminal navigate to the folder that will host your function app.
2. Install the Azure Functions Durable Extension by running the following in a command prompt / terminal window:

    ```bash
    func extensions install -p Microsoft.Azure.WebJobs.Extensions.DurableTask -v 1.6.0
    ```
3. Create a Function App project by running the following command:

    ```bash
    func init
    ``` 
4. Run Azure Storage Emulator or update the *local.appsettings.json* file with real Azure Storage connection string.
5. Next, create a new function by running the following command and follow the wizard steps:

    ```bash
    func new
    ```
    >[!IMPORTANT]
    > Currently the Durable Function template is not available but you can start with one of the supported options and then modify the code. Use for reference the samples for [Orchestration Client](https://github.com/Azure/azure-functions-durable-extension/tree/master/samples/csx/HttpStart), [Orchestration Trigger](https://github.com/Azure/azure-functions-durable-extension/tree/master/samples/csx/E1_HelloSequence), and [Activity Trigger](https://github.com/Azure/azure-functions-durable-extension/tree/master/samples/csx/E1_HelloSequence).

6. Open the project folder in Visual Studio Code and continue by modifying the template code. 
7. Start the project by running in command prompt / terminal the following command:
    ```bash
    func host start
    ```

## Azure portal

If you prefer, you can use the [Azure portal](https://portal.azure.com) for Durable Functions development.

   > [!NOTE]
   > Durable Functions in JavaScript are not yet available in the portal.

### Create an orchestrator function

1. Create a new function app in the portal, as shown in the [Functions quickstart article](functions-create-first-azure-function.md#create-a-function-app).

2. Configure the function app to [use the 2.0 runtime version](set-runtime-version.md).

   The Durable Functions extension works on both the 1.X runtime and the 2.0 runtime, but the Azure Portal templates are only available when targeting the 2.0 runtime.

3. Create a new function by selecting **"create your own custom function."**.

4. Change the **Language** to **C#**, **Scenario** to **Durable Functions** and select the **Durable Functions Http Starter - C#** template.

5. Under **Extensions not installed**, click **Install** to download the extension from NuGet.org. 

6. After the installation is complete, proceed with the creation of an orchestration client function – **“HttpStart”** that is created by selecting **Durable Functions Http Starter - C#** template.

7. Now, create an orchestration function **“HelloSequence”** from **Durable Functions Orchestrator - C#** template.

8. And the last function will be called **“Hello”** from **Durable Functions Activity - C#** template.

9. Go to **"HttpStart"** function and copy its URL.

10. Use Postman or cURL to call the durable function. Before testing, replace in the URL **{functionName}** with the orchestrator function name - **HelloSequence**.  No data is required, just use POST verb. 

    ```bash
    curl -X POST https://{your function app name}.azurewebsites.net/api/orchestrators/HelloSequence
    ```

11. Then, call the **“statusQueryGetUri”** endpoint and you see the current status of the Durable Function

    ```json
        {
            "runtimeStatus": "Running",
            "input": null,
            "output": null,
            "createdTime": "2017-12-01T05:37:33Z",
            "lastUpdatedTime": "2017-12-01T05:37:36Z"
        }
    ```

12. Continue calling the **“statusQueryGetUri”** endpoint until the status changes to **"Completed"** 

    ```json
    {
            "runtimeStatus": "Completed",
            "input": null,
            "output": [
                "Hello Tokyo!",
                "Hello Seattle!",
                "Hello London!"
            ],
            "createdTime": "2017-12-01T05:38:22Z",
            "lastUpdatedTime": "2017-12-01T05:38:28Z"
        }
    ```

Congratulations! Your first durable function is up and running in Azure Portal!

## Next steps

> [!div class="nextstepaction"]
> [Run the function chaining sample](durable-functions-sequence.md)
