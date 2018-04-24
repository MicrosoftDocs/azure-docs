---
title: Tutorial for integrating Azure functions with Azure SignalR Service | Microsoft Docs
description: In this tutorial, you learn how to use Azure Functions with Azure SignalR Service
services: signalr
documentationcenter: ''
author: wesmc7777
manager: cfowler
editor: ''

ms.assetid: 
ms.service: signalr
ms.workload: tbd
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 04/24/2018
ms.author: wesmc
#Customer intent: As an ASP.NET Core developer, I want to integrate my app with Azure Functions to push content updates triggered by my functions.
---

# Tutorial: Integrate Azure Functions with Azure SignalR Service

A common scenario with real-time applications is for content updates to originate from a web server before being published to the desired clients. In this scenario, [Azure Functions](../azure-functions/functions-overview.md) is an excellent candiate for generating these content updates. A key benefit of using Azure functions is that you can run your code on-demand without worrying about the architecture of a whole application, or the infrastructure to run it. You also only pay for the time your code actually runs, as the result of a trigger firing.  

Normally, this scenario would present a problem when trying to use SignalR. Because SignalR tries to maintain a connection between client and server to allow pushing content updates. Since the code only runs on-demand, a connection can not be maintained. However, Azure SignalR Service can support this scenartio. Because the service manages the connections for you.

In this tutorial, you will use Azure Functions to generate messages using a [timer trigger](../azure-functions/functions-bindings-timer) and publish them to the chat room created in the previous tutorials. The server will send the messages at the beginning of each minute. 

The code for this tutorial is available for download in the [AzureSignalR-samples GitHub repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/Timer).

![Chat app with server messages](./media/signalr-integrate-functions/signalr-functions-complete.png)


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a new Timer function with Azure Functions using the Azure CLI.
> * Configure the timer function for local git repository deployment.
> * Connect the timer to your SignalR Service to push updates every minute


## Prerequisites

To complete this tutorial, you must have the following prerequisites:

To complete this tutorial, you must have the following prerequisites:

* [Git](https://git-scm.com/)
* [.NET Core SDK](https://www.microsoft.com/net/download/windows) 
* [Azure Cloud Shell configured](https://docs.microsoft.com/azure/cloud-shell/quickstart)
* Download or clone the [AzureSignalR-sample](https://github.com/aspnet/AzureSignalR-samples) github repository.

## Create a function app

You must create a function app to define the serverless execution, and environment for your functions. It lets you group multiple functions as a logical unit for easier management, deployment, and resource sharing. For more information, see [Create your first function using the Azure CLI](../azure-functions/functions-create-first-azure-function-azure-cli.md).

In this section, you will use the Azure command-line interface (CLI) to create a new Azure Function app configured for deployment from a local git repository. 

When creating the function app, create it in the same resource group you created in the previous tutorial. That resource group contains the SignalR Service resources and your web app. This makes managing all tutorial resources easier.

Copy the script below and change the script variables if necessary. Paste into your Azure Cloud Shell, to create and configure your function app.

```azurecli-interactive
#========================================================================
#=== Update using the connection string for your SignalR Service      ===
#=== resource.                                                        ===
#========================================================================
connstring="Endpoint=<service_endpoint>;AccessKey=<access_key>;"

#========================================================================
#=== Optionally, update the values of these variable.                 ===
#========================================================================
storageAccountName=signalrstorageaccount
functionappName=signalrfunctionapp

#========================================================================
#=== Update this group name and location based on the values you used ===
#=== for the other SignalR related resources you created previously.  ===
#========================================================================
ResourceGroupName=SignalRTestResources
location=eastus

#========================================================================
#=== Update these values based on your desired deployment username    ===
#=== and password.                                                    ===
#========================================================================
deploymentUser=myUserName
deploymentUserPassword=myPassword    

# Create a storage account to hold function app code and settings
az storage account create --resource-group $ResourceGroupName \
    --name $storageAccountName \
    --location $location --sku Standard_LRS

# Create the function app
az functionapp create --resource-group $ResourceGroupName \
    --name $functionappName \
    --consumption-plan-location $location \
    --storage-account $storageAccountName

# Add the SignalR Service connection string app setting
az functionapp config appsettings set --resource-group $ResourceGroupName 
    --name $functionappName \
    --setting "AzureSignalRConnectionString=$connstring"

# configure for deployment from a local git repository
az functionapp deployment source config-local-git --name $functionappName \
    --resource-group $ResourceGroupName

```

Make a note the git deployment URL returned from the last command. You will use this URL for deploying the funtion code.


## Build the timer function

1. Navigate to the */samples/Timer* directory of your download, or clone of the [AzureSignalR-sample](https://github.com/aspnet/AzureSignalR-samples) github repository.

2. Using the [.NET Core command-line interface (CLI)](https://docs.microsoft.com/dotnet/core/tools/), restore the NuGet packages using the following command:

        dotnet restore

3. Build the *Timer* function app using the following command:

        msbuild /p:Configuration=Release


## Initialize and deploy the local git repository

1. In a git shell, navigate to the */samples/Timer/bin/Release/net461* directory.

2. Initialize the directory as a new git repository using the following command:

        git init

3. Add a new commit for all files in the build directory.

        git add -A
        git commit -v -a -m "Initial Timer function commit"        

4. Add a remote endpoint for the git deployment URL you made note of during the creation of your function app:

        git remote add Azure <enter your git deployment URL>

5. Deploy the function app

        git push Azure master


## Test the chat app

If you navigate to the chat application, the Timer function you just created will now be reporting the time at the beginning of each minute.

![Chat app with server messages](./media/signalr-integrate-functions/signalr-functions-complete.png)



## Clean up resources

If you want to continue to test the application, you can keep the resources you have created.

Otherwise, if you are finished with the sample application, you can delete the Azure resources to avoid charges. 

> [!IMPORTANT]
> Deleting a resource group is irreversible and that the resource group and all the resources in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the resources for hosting this sample inside an existing resource group that contains resources you want to keep, you can delete each resource individually from their respective blades instead of deleting the resource group.
> 
> 

Sign in to the [Azure portal](https://portal.azure.com) and click **Resource groups**.

In the **Filter by name...** textbox, type the name of your resource group. The instructions for this article used a resource group named *SignalRTestResources*. On your resource group in the result list, click **...** then **Delete resource group**.

   
![Delete](./media/signalr-integrate-functions/signalr-delete-resource-group.png)


You will be asked to confirm the deletion of the resource group. Type the name of your resource group to confirm, and click **Delete**.
   
After a few moments, the resource group and all of its contained resources are deleted.


## Next steps

In this tutorial, you learned how to intergrate with Azure Function to push updates to clients based on Azure Function triggers. To learn more about using Azure SignalR Server, continue to the Azure CLI samples for SignalR Service.

> [!div class="nextstepaction"]
> [Azure SignalR CLI Samples](./signalr-cli-samples.md)



