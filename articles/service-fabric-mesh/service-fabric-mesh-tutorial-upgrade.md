---
title: Tutorial- Upgrade an Azure Service Fabric Mesh application | Microsoft Docs
description: Learn how to upgrade a Service Fabric application using Visual Studio
services: service-fabric-mesh
documentationcenter: .net
author: tylerMSFT
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: azure-cli
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/18/2018
ms.author: twhitney
ms.custom: mvc, devcenter 
#Customer intent: As a developer, I want to make code changes to my Service Fabric Mesh app and upgrade my app on Azure
---

# Tutorial: Learn how to upgrade a Service Fabric application using Visual Studio

This tutorial is part four of a series and shows you how to upgrade an Azure Service Fabric Mesh application directly from Visual Studio. The upgrade will include both a code update and a config update. You will see that the steps for upgrading and publishing from within Visual Studio are the same.

In this tutorial you learn how to:
> [!div class="checklist"]
> * Upgrade a Service Fabric Mesh service by using Visual Studio

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Create a Service Fabric Mesh app in Visual Studio](service-fabric-mesh-tutorial-create-dotnetcore.md)
> * [Debug a Service Fabric Mesh app running in your local development cluster](service-fabric-mesh-tutorial-debug-service-fabric-mesh-app.md)
> * [Deploy a Service Fabric Mesh app](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md)
> * Upgrade a Service Fabric Mesh app
> * [Clean up Service Fabric Mesh resources](service-fabric-mesh-tutorial-cleanup-resources.md)

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you begin this tutorial:

* If you haven't deployed the to-do app, follow the instructions in [Publish a Service Fabric Mesh web application](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md).

## Upgrade a Service Fabric Mesh service by using Visual Studio

This article shows how to independently upgrade a microservice within an application.  In this example, we will modify the `WebFrontEnd` service to display a task category. Then we'll upgrade the deployed service.

## Modify the config

Upgrades can be due to code changes, config changes, or both.  To introduce a config change, open the `WebFrontEnd` project's `service.yaml` file (which is under the **Service Resources** node).

In the `resources:` section, change `cpu:` from 0.5 to 1.0, in anticipation that the web front end will be heavily used. It should now look like this:

```xml
              ...
              resources:
                requests:
                  cpu: 1.0
                  memoryInGB: 1
              ...
```

## Modify the model

To introduce a code change, add a `Category` property to the `ToDoItem` class in the `ToDoItem.cs` file.

```csharp
public class ToDoItem
{
    public string Category { get; set; }
    ...
}
```

Then update the `Load()` method, in the same file, to set the category to a default string:

```csharp
public static ToDoItem Load(string description, int index, bool completed)
{
    ToDoItem newItem = new ToDoItem(description)
    {
        Index = index,
        Completed = completed, 
        Category = "none"    // <-- add this line
    };

    return newItem;
}
```

## Modify the service

The `WebFrontEnd` project is an ASP.NET Core application with a web page that shows to-do list items. In the `WebFrontEnd` project, open `Index.cshtml` and add the following two lines, indicated below, to display the task's category:

```HTML
<div>
    <table class="table-bordered">
        <thead>
            <tr>
                <th>Description</th>
                <th>Category</th>           @*add this line*@
                <th>Done?</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var item in Model.Items)
            {
                <tr>
                    <td>@item.Description</td>
                    <td>@item.Category</td>           @*add this line*@
                    <td>@item.Completed</td>
                </tr>
            }
        </tbody>
    </table>
</div>
```

Build and run the app to verify that you see a new category column in the web page that lists the tasks.

## Upgrade the app from Visual Studio

Regardless of whether you are making a code upgrade, or a config upgrade (in this case we are doing both), to upgrade your Service Fabric Mesh app on Azure right-click on **todolistapp** in Visual Studio and select **Publish...**

Next, you'll see a **Publish Service Fabric Application** dialog.

![Visual studio Service Fabric Mesh publish dialog](./media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-dialog.png)

Select your Azure account and subscription. Ensure that **Location** is set to the location that you used when you originally published the to-do app to Azure. This article used **East US**.

Ensure that **Resource group** is set to the resource group that you used when you originally published the to-do app to Azure.

Ensure that **Azure Container Registry** is set to the azure container registry name that you created when you originally published the to-do app to Azure.

In the publish dialog, press the **Publish** button to upgrade the to-do app on Azure.

You can monitor the progress of the upgrade by selecting the **Service Fabric Tools** pane in the Visual Studio **Output** window. Once the upgrade has finished, the **Service Fabric Tools** output will display the IP address and port of your application in the form of a URL.

```json
Packaging Application...
Building Images...
Web1 -> C:\Code\ServiceFabricMeshApp\ToDoService\bin\Any CPU\Release\netcoreapp2.0\ToDoService.dll
Uploading the images to Azure Container Registy...
Deploying application to remote endpoint...
The application was deployed successfully and it can be accessed at http://10.000.38.000:20000.
```

Open a web browser and navigate to the URL to see the website running in Azure. You should now see a web page that contains a category column.

## Next steps

In this part of the tutorial, you learned:
> [!div class="checklist"]
> * How to upgrade a Service Fabric Mess app by using Visual Studio

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Clean up Service Fabric Mesh resources](service-fabric-mesh-tutorial-cleanup-resources.md)