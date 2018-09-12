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

This tutorial is part five of a series and shows you how to upgrade an Azure Service Fabric Mesh application directly from Visual Studio.

In this tutorial you learn how to:
> [!div class="checklist"]
> * Upgrade a Service Fabric Mesh service by using Visual Studio

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Create a Service Fabric Mesh app in Visual Studio](service-fabric-mesh-tutorial-create-dotnetcore.md)
> * [Debug a Service Fabric Mesh app running in your local development cluster](service-fabric-mesh-tutorial-debug-service-fabric-mesh-app.md)
> * [Deploy a Service Fabric Mesh app](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md)
> * [Monitor and diagnose a Service Fabric Mesh app using Application Insights](service-fabric-mesh-tutorial-appinsights.md)
> Upgrade a Service Fabric Mesh app
> * [Clean up Service Fabric Mesh resources](service-fabric-mesh-tutorial-cleanup-resources.md)

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you begin this tutorial:

* If you haven't deployed the to-do app, follow the instructions in [Publish a Service Fabric Mesh web application](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md).

# Upgrade a Service Fabric Mesh service by using Visual Studio

This article shows how to independently upgrade a microservice within an application. In this example, we will modify the `WebFrontEnd` service to display a task category. Then we'll upgrade the deployed service.

## Modify the model

First, add a `Category` property to the `ToDoItem` class in the ToDoItem.cs file.

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

The `WebFrontEnd` project is an ASP.NET Core application with a web page that shows to-do list items. In the `WebFrontEnd` project, open `Index.cshtml` and add the following two lines to display a task's category:

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

## Upgrade the app

Upgrade the  `WebFrontEnd` service using the following command. The following example upgrades the application using the [mesh_rp.scaleout.linux.json template](https://sfmeshsamples.blob.core.windows.net/templates/visualobjects/mesh_rp.scaleout.linux.json). 

```azurecli-interactive
az mesh deployment create --resource-group sfmeshTutorial1RG --template-uri https://sfmeshsamples.blob.core.windows.net/templates/visualobjects/mesh_rp.scaleout.linux.json --parameters "{\"location\": {\"value\": \"eastus\"}}"
```

Once the application successfully upgrades, the browser should display a web page that now contains a category column.

## Next steps

In this part of the tutorial, you learned:
> [!div class="checklist"]
> * How to upgrade a Service Fabric Mess app by using Visual Studio


Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Clean up Service Fabric Mesh resources](service-fabric-mesh-tutorial-cleanup-resources.md)
