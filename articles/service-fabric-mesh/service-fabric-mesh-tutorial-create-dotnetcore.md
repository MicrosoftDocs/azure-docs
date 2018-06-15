---
title: Tutorial: Create a Service Fabric Mesh app and accompanying back-end service that you will publish to Azure.
description: In this tutorial, you create a a Service Fabric Mesh app,  consisting of an ASP.NET Core website that communicates with a back-end web service, and publish the website and back-end service as a Service Fabric Mesh app.
services: service-fabric-mesh
documentationcenter: .net
author: TylerMSFT
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/18/2018
ms.author: twhitney
ms.custom: mvc, devcenter
#Customer intent: As a developer, I want learn how to create a Service Fabric Mesh app that communicates with another service, and then publish it to Azure.
---

# Tutorial: Create an Azure Service Fabric Mesh app and back-end service that you publish to Azure Service Mesh

In this tutorial, you will create a new Service Fabric Mesh application, which consists of an ASP.NET Core website and a back-end web service, and run it in the local development cluster. You will set a breakpoint to debug the app locally and see how to communicate with another service running on the same cluster. After that, you will publish the project to Azure.

The app will display a simple to-do list and the data will come from the simple back-end web service. This will provide a simple example of service-to-service communication.

In this tutorial you learn how to:
> [!div class="checklist"]
> * Create a Service Fabric Mesh project.
> * Add a second service to the project & communicate with it.
> * Debug the service locally.
> * Publish the service to Azure.

If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you start, make sure that you've [set up your development environment](service-fabric-mesh-setup-developer-environment-sdk.md) which covers installing the Service Fabric runtime, SDK, Docker, and Visual Studio 2017.

## Create a Service Fabric Mesh project

Run Visual Studio and select **File** > **New** > **Project...**

In the **New Project** dialog, type **mesh** into the **Search** box at the top. Select the **Service Fabric Mesh Application** template.

In the **Name** box, type **ServiceFabricMesh1** and in the **Location** box, set the folder path to where the files for the project will be stored.

Make sure that **Create directory for solution** is checked, and press **OK** to create the Service Fabric Mesh project.

![Visual studio new Service Fabric Mesh project dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-project.png)

### Create the web front-end service

Next you will see the **New Service Fabric Service** dialog. Select the **ASP.NET Core** project type, make sure **Container OS** is set to **Windows**.

You must set the **Service Name** to something unique because the name of the service is used as the repository name of the Docker image. This tutorial will use the name **WebFrontEnd**. If you have an existing Docker image with the same repository name, it will be overwritten by Visual Studio. Open a terminal and use the Docker command `docker images` to verify that the project name you have chosen isn't being used as a docker repository name. If it is, choose another service name.

Press **OK** to create the ASP.NET Core service. 

![Visual studio new Service Fabric Mesh project dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-service-fabric-service.png)

The **New ASP.NET Core Web Application** dialog appears. Select **Web Application** and then press **OK**.

![Visual studio new ASP.NET core application](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-aspnetcore-app.png)

Now we have the Service Fabric Application project and the ASP.NET Core project that we will use to display to-do information.  Next, we need to create the model that will contain the to-do information.

=============================> JTW Add second service

## Create the model for to-do items

For simplicity, we will store the to-do items in memory. We need to define a class to represent the to-do items, and a list to hold them.  We'll create a class library for this.

In Visual Studio, select **File** > **Add** > **New Project**.

In the **New Project** dialog, type **C# .net core class** into the **Search** box at the top. Select the **Class Library (.NET Core)** template.

In the **Name** box, type **Model** and in the **Location** box, set the folder path to where the files for the project will be stored. Click **OK** to create the class library.

<jtw: picture of Add new project dialog? Or assume they know how to do this since they did earlier>

In the Solution explorer, under the **Model** node right-click **Class1.cs** and choose **Rename**.  Rename the class **ToDoItem.cs**.  A prompt will appear asking whether to rename all references to Class1. Click **Yes**.

Replace the contents of `class ToDoItem` with the following:

```csharp
public class ToDoItem
{
    public string Description { get; set; }
    public int Index { get; set; }
    public Guid Id { get; private set; }
    public bool Completed { get; set; }

    public ToDoItem(string description)
    {
        Description = description;
        Index = 0;
        Id = Guid.NewGuid();
    }

    public static ToDoItem Load(string description, int index, Guid id, bool completed)
    {
        TodoItem newItem = new ToDoItem(description)
        {
            Index = index,
            Id = id,
            Completed = completed
        };

        return newItem;
    }
}
```

This class will represent individual to-do items.

We need a list to hold the to-do items. In Visual Studio, right-click the **Model** class library node, and select **Add** > **Class...** The **Add New Item** dialog will appear. Set the **Name** to **ToDoList.cs** and click **Add**.

In **ToDoList.cs**, replace `class ToDoList` with the following code:

```csharp
public class TodoList
{
    private List<TodoItem> _items;

    public string Name { get; set; }
    public IEnumerable<TodoItem> Items { get => _items; }

    public TodoList(string name)
    {
        Name = name;
        _items = new List<TodoItem>();
    }

    public TodoItem Add(string description)
    {
        var item = new TodoItem(description);
        _items.Add(item);
        item.Index = _items.IndexOf(item);
        return item;
    }
    public void Add(TodoItem item)
    {
        _items.Add(item);
        item.Index = _items.Count - 1;
    }

    public TodoItem RemoveAt(int index)
    {
        if (index >= 0 && index < _items.Count)
        {
            var result = _items[index];
            _items.RemoveAt(index);

            // Reorder items
            for (int i = index; i < _items.Count; i++)
            {
                _items[i].Index = i;
            }

            return result;
        }
        else
        {
            throw new IndexOutOfRangeException();
        }
    }
}
```

Now that we have the model, lets create the service fabric service that will track the to-do items. We will create a Web API project for that.

## Create the back-end service

In the Visual Studio Solution Explorer window, right-click the **ServiceFabricMesh1** node and select **Add** > **New Service Fabric Service...**

The **New Service Fabric Service** dialog appears. Select the **ASP.NET Core** project type, make sure **Container OS** is set to **Windows**.

You must set the **Service Name** to something unique because the name of the service is used as the repository name of the Docker image. This tutorial will use the name **ToDoService**. If you have an existing Docker image with the same repository name, it will be overwritten by Visual Studio. Open a terminal and use the Docker command `docker images` to verify that the project name you have chosen isn't being used as a docker repository name. If it is, choose another service name.

Press **OK** to create the ASP.NET Core service and then the **New ASP.NET Core Web Application** dialog will appear. Select **Web Application** and then **OK**.

![Visual studio new ASP.NET core application](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-aspnetcore-app.png)

Now we have the Service Fabric Application project and the ASP.NET Core project that we will use to display to-do information.  Next, we need to create the model that will contain the to-do information.

<JTW PICTURE?>

We'll turn off launching the browser when the service is launched since this is just a back-end service that doesn't provide any UI. In the Visual Studio Solution Explorer, right-click the **ToDoService** node, and select **Properties**. Click the **Debug** tab on the left or the resulting properties window and uncheck **Launch browser**.

Because this service maintains the to-do information, we need to add a reference to the Model class library in order to access the ToDoItem class and corresponding list. In the Solution Explorer, right-click the **ToDoService** node and then select **Add** > **Reference**.  The **Reference Manager** dialog will appear.

In the Reference Manager, select the checkbox for **Model**, and click **OK**.

============================= /JTW Add second service

## Build and deploy

A Docker image is automatically built and deployed to your local cluster as soon as your project loads. This process may take a while. You can monitor the progress in the Visual Studio **Output** pane if you set the Output pane's **Show output from:** drop-down list to **Service Fabric Tools**.

After the project has been created, press **F5** to compile and run your service locally. Whenever the project is run and debugged locally, Visual Studio will:

1. Make sure that Docker for Windows is running and set to use Windows as the container operating system.
2. Download any missing Docker base images. This part may take some time
3. Build (or rebuild) the Docker image used to host your code project.
4. Deploys and runs the container on the local Service Fabric development cluster.
5. Run your services and hits any breakpoints you have set.

After the local deployment is finished, and Visual Studio is running your app, a browser window will open to a default sample webpage.

When you are done browsing the deployed service you can stop debugging your project by pressing **Shift+F5** in Visual Studio.

========================>  JTW
Add what to do if get VS error that "No Service Fabric local cluster is running".  Ensure that the Service Fabri Local Custer Manager is running, and rt-click the icon in the task bar, and click **Start Local Cluster**. Once it has started, press **F5** again.
================ JTW

## Publish to Azure

To publish your Service Fabric Mesh project to Azure, right-click on the **Service Fabric Mesh project** in Visual studio and select **Publish...**

![Visual studio right-click Service Fabric Mesh project](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-right-click-publish.png)

You will see a **Publish Service Fabric Application** dialog.

![Visual studio Service Fabric Mesh publish dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-dialog.png)

Select your Azure account and subscription. Choose a **Location**. This article uses **East US**.

Under **Resource group**, select **\<Create New Resource Group...>**. This will show you a dialog where you will create a new resource group. Choose the **East US** location and name the group **sfmeshTutorial1RG**. Press **Create** to create the resource group and return to the publish dialog.

![Visual studio Service Fabric Mesh new resource group dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-new-resource-group-dialog.png)

Back in the **Publish Service Fabric Application** dialog, under **Azure Container Registry**, select **\<Create New Container Registry...>**. In the **Create Container Registry** dialog, use a unique name for the **Container registry name**. For **Location**, pick **East US**. Select the **sfmeshTutorial1RG** resource group. Set the **SKU** to **Basic** and then press **Create** to return to the publish dialog.

![Visual studio Service Fabric Mesh new resource group dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-new-container-registry-dialog.png)

In the publish dialog, press the **Publish** button to deploy your Service Fabric application to Azure.

When you publish to Azure for the first time, it can take up to 10 or more minutes. Subsequent publishes of the same project generally take around five minutes. Obviously, these estimates will vary based on your internet connection speed and other factors. You can monitor the progress of the deployment by selecting the **Service Fabric Tools** pane in the Visual Studio **Output** window. Once the deployment has finished, the **Service Fabric Tools** output will display the IP address and port of your application in the form of a URL.

```json
Packaging Application...
Building Images...
Web1 -> C:\Code\ServiceFabricMesh1\Web1\bin\Any CPU\Release\netcoreapp2.0\Web1.dll
Uploading the images to Azure Container Registy...
Deploying application to remote endpoint...
The application was deployed successfully and it can be accessed at http://10.000.38.000:20000.
```

Open a web browser and navigate to the URL to see the website running in Azure.

## Clean up resources

When no longer needed, delete all of the resources you created. Since you created a new resource group to host both the ACR and Service Fabric Mesh service resources, you can safely delete this resource group.

```azurecli
az group delete --resource-group sfmeshTutorial1RG
```

```powershell
Remove-AzureRmResourceGroup -Name sfmeshTutorial1RG
```

Alternatively, you can delete the resource group [from the portal](../azure-resource-manager/resource-group-portal.md#delete-resource-group-or-resources).

## Next steps

Explore the [Voting app sample](https://github.com/MikkelHegn/service-fabric-mesh-preview-pr/tree/private-preview_3/samples/src/quickstart/windows/VotingApp) to see another example of service-to-service communication.
Explore the [samples](https://github.com/Azure/seabreeze-preview-pr/tree/master/samples) for Service Fabric Mesh.