---
title: Tutorial create an Azure Service Fabric Mesh app
description: In this tutorial, you create an Azure Service Fabric Mesh app consisting of an ASP.NET Core website that communicates with a back-end web service, and publish it to Azure.
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
ms.date: 06/20/2018
ms.author: twhitney
ms.custom: mvc, devcenter
#Customer intent: As a developer, I want learn how to create a Service Fabric Mesh app that communicates with another service, and then publish it to Azure.
---

# Tutorial: Create an Azure Service Fabric Mesh app

You'll learn how to create an Azure Service Fabric app that has an ASP.NET web front end and an ASP.NET Core Web API back-end service. Then you'll debug the app on your local development cluster and publish the app to Azure. When you're finished, you'll have a simple to-do app that demonstrates how to make a service-to-service call in a Service Fabric Mesh app.

In this tutorial you learn how to:
> [!div class="checklist"]
> * Create a Service Fabric Mesh app consisting of an ASP.NET web front end.
> * Add a back-end service to the project & retrieve data from it.
> * Debug the app locally.
> * Publish the app to Azure.

If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you start, make sure that you've [set up your development environment](service-fabric-mesh-setup-developer-environment-sdk.md) which includes installing the Service Fabric runtime, SDK, Docker, and Visual Studio 2017.

## Create a Service Fabric Mesh project

Run Visual Studio and select **File** > **New** > **Project...**

In the **New Project** dialog, type **mesh** into the **Search** box at the top. Select the **Service Fabric Mesh Application** template.

In the **Name** box, type **ServiceFabricApp** and in the **Location** box, set the folder path to where the files for the project will be stored.

Make sure that **Create directory for solution** is checked, and click **OK** to create the Service Fabric Mesh project. Next you'll see the **New Service Fabric Service** dialog.

![Visual studio new Service Fabric Mesh project dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-project.png)

### Create the web front-end service

In the **New Service Fabric Service** dialog, select the **ASP.NET Core** project type, make sure **Container OS** is set to **Windows**.

Set the **Service Name** to something unique because the name of the service is used as the repository name of the Docker image. This tutorial will use the name **WebFrontEnd**. If you have an existing Docker image with the same repository name, it will be overwritten by Visual Studio. Open a terminal. Use the Docker command `docker images` to verify that the project name you have chosen isn't being used as a docker repository name. If it is, choose another service name.

Press **OK** to create the ASP.NET Core service. Next you'll see the **New ASP.NET Core Web Application** dialog.

![Visual studio new Service Fabric Mesh project dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-service-fabric-service.png)

In the **New ASP.NET Core Web Application** dialog, select **Web Application** and then click **OK**.

![Visual studio new ASP.NET core application](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-aspnetcore-app.png)

Now you have a Service Fabric Application. Next, create the model for to-do information.

## Create the to-do items model

For simplicity, the to-do items are stored in a list in memory. Create a class library for the to-do items and a list to hold them. In Visual Studio, which currently has the **ServiceFabricMeshApp** loaded, select **File** > **Add** > **New Project**.

In the **New Project** dialog, type **C# .net core class** into the **Search** box at the top. Select the **Class Library (.NET Core)** template.

In the **Name** box, type **Model** and in the **Location** box, set the folder path to where the files for the project will be stored. Click **OK** to create the class library.

In the Solution explorer, under **Model**, right-click **Class1.cs** and choose **Rename**. Rename the class **ToDoItem.cs**. A prompt may appear asking whether to rename all references to `Class1`. Click **Yes**.

Replace the contents of the empty `class ToDoItem` with:

```csharp
public class ToDoItem
{
    public string Description { get; set; }
    public int Index { get; set; }
    public bool Completed { get; set; }

    public ToDoItem(string description)
    {
        Description = description;
        Index = 0;
    }

    public static ToDoItem Load(string description, int index, bool completed)
    {
        ToDoItem newItem = new ToDoItem(description)
        {
            Index = index,
            Completed = completed
        };

        return newItem;
    }
}
```

This class represents individual to-do items.

Create a list to hold the to-do items. In Visual Studio, right-click the **Model** class library, and select **Add** > **Class...** The **Add New Item** dialog will appear. Set the **Name** to **ToDoList.cs** and click **Add**.

In **ToDoList.cs**, replace the empty `class ToDoList` with:

```csharp
public class ToDoList
{
    private List<ToDoItem> _items;

    public string Name { get; set; }
    public IEnumerable<ToDoItem> Items { get => _items; }

    public ToDoList(string name)
    {
        Name = name;
        _items = new List<ToDoItem>();
    }

    public ToDoItem Add(string description)
    {
        var item = new ToDoItem(description);
        _items.Add(item);
        item.Index = _items.IndexOf(item);
        return item;
    }
    public void Add(ToDoItem item)
    {
        _items.Add(item);
        item.Index = _items.Count - 1;
    }

    public ToDoItem RemoveAt(int index)
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

Next, create the service fabric service (a Web API project) that will track the to-do items.

## Create the back-end service

In the Visual Studio **Solution Explorer** window, right-click **ServiceFabricMeshApp** and click **Add** > **New Service Fabric Service...**

The **New Service Fabric Service** dialog appears. Select the **ASP.NET Core** project type, and make sure **Container OS** is set to **Windows**.

Set the **Service Name** to something unique because the name of the service is used as the repository name of the Docker image. This tutorial will use the name **ToDoService**. If you have an existing Docker image with the same repository name, it will be overwritten by Visual Studio. Open a terminal. Use the Docker command `docker images` to verify that the project name you have chosen isn't being used as a docker repository name.  If it is, choose another service name.

Click **OK** to create the ASP.NET Core service. Next, the **New ASP.NET Core Web Application** dialog will appear. In that dialog select **API** and then **OK**, and a project for the service is added to the solution.

![Visual studio new ASP.NET core application](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-new-aspnetcore-app.png)

Because the back-end service doesn't provide any UI, turn off launching the browser when the service is launched. In the **Solution Explorer**, right-click **ToDoService**, and select **Properties**. In the properties window that appears, select the **Debug** tab on the left, and uncheck **Launch browser**.

Because this service maintains the to-do information, add a reference to the Model class library. In the Solution Explorer, right-click **ToDoService** and then select **Add** > **Reference...**. The **Reference Manager** dialog will appear.

In the **Reference Manager**, select the checkbox for **Model**, and click **OK**.

### Add a data context

ASP.Net Web API projects use the model view controller (MVC) pattern. Next create a data context that coordinates serving up the data from the data model.

To add the data context class, in the solution explorer right-click **ToDoService** and then **Add** > **Class**.
In the **Add New Item** dialog that appears, ensure that **Class** is selected, and set the **Name** to `Datacontext.cs`, and click **Add**.

In **Datacontext.cs**, replace the contents of the empty 'class DataContext' with:

```csharp
public static class DataContext
{
    public static Model.ToDoList ToDoList { get; } = new Model.ToDoList("Azure learning List");

    static DataContext()
    {
        ToDoList = new Model.ToDoList("Main List");

        // Seed to-do list

        ToDoList.Add(Model.ToDoItem.Load("Learn about microservices", 0, true));
        ToDoList.Add(Model.ToDoItem.Load("Learn about Service Fabric", 1, true));
        ToDoList.Add(Model.ToDoItem.Load("Learn about Service Fabric Mesh", 2, false));
    }
}
```

The minimal data context populates some sample to-do items and provides access to them.

### Add a controller

Also part of the MVC pattern is a controller that handles the HTTP requests and creates the HTTP response. A default controller was provided by the template when the **ToDoService** project was created. In the **Solution Explorer**, open the **Controllers** folder to see the **ValuesController.cs** file. 

Modify that file to be the to-do items controller. Right-click **ValuesController.cs** and then **Rename**. Rename the file to  `ToDoController.cs`. If a prompt to rename all references appears, click **Yes**.

Add `using Microsoft.AspNetCore.Mvc;` to the top of the file and replace the contents of `class ToDoController` with:

```csharp
[Route("api/[controller]")]
public class ToDoController : Controller
{
    // GET api/todo
    [HttpGet]
    public IEnumerable<Model.ToDoItem> Get()
    {
        return DataContext.ToDoList.Items;
    }

    // GET api/todo/5
    [HttpGet("{index}")]
    public Model.ToDoItem Get(int index)
    {
        return DataContext.ToDoList.Items.ElementAt(index);
    }

    //// POST api/values
    //[HttpPost]
    //public void Post([FromBody]string value)
    //{
    //}

    //// PUT api/values/5
    //[HttpPut("{id}")]
    //public void Put(int id, [FromBody]string value)
    //{
    //}

    // DELETE api/values/5
    [HttpDelete("{index}")]
    public void Delete(int index)
    {
    }
}
```

This tutorial, does not implement add, delete, and so on. The focus is on communicating with another service.

## Create the web page that displays to-do items

With the back-end service implemented, code the web site that will display the to-do items it provides. The following steps take place within the **WebFrontEnd** project.

The web page that displays the to-do items needs access to the **ToDoItem** class and list. Add a reference to the Model project in the **Solution Explorer** by right-clicking **WebFrontEnd** and selecting **Add** > **Reference...** The **Reference Manager** dialog will appear.

In the **Reference Manager**, select the checkbox for **Model**, and click **OK**.

In the **Solution Explorer**, open the Index.cshtml page by navigating to **WebFrontEnd** > **Pages** > **Index.cshtml**. Open **Index.cshtml**.

Replace the contents of the entire file with the following HTML that defines a simple table to display to-do items:

```HTML
@page
@model IndexModel
@{
    ViewData["Title"] = "Home page";
}

<div>
    <table class="table-bordered">
        <thead>
            <tr>
                <th>Description</th>
                <th>Done?</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var item in Model.Items)
            {
                <tr>
                    <td>@item.Description</td>
                    <td>@item.Completed</td>
                </tr>
            }
        </tbody>
    </table>
</div>
```

Open the code for the Index page in the **Solution Explorer**. Double-click on **Index.cshtml** and open **Index.cshtml.cs**. 
At the top of **Index.cshtml.cs**, add `using System.Net.Http;`

Replace the contents of `public class IndexModel` with:

```csharp
public class IndexModel : PageModel
{
    public Model.ToDoItem[] Items = new Model.ToDoItem[] { };

    public void OnGet()
    {
        HttpClient client = new HttpClient();

        using (HttpResponseMessage response = client.GetAsync(backendUrl).GetAwaiter().GetResult())
        {
            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                Items = Newtonsoft.Json.JsonConvert.DeserializeObject<Model.ToDoItem[]>(response.Content.ReadAsStringAsync().Result);
            }
        }
    }

    private static string backendDNSName = $"{Environment.GetEnvironmentVariable("ServiceName")}.{Environment.GetEnvironmentVariable("ApiHostName")}";
    private static Uri backendUrl = new Uri($"http://{backendDNSName}:{Environment.GetEnvironmentVariable("ApiHostPort")}/api/todo");
}
```

### Set environment variables

To communicate with the back-end service, specify the URL for that service. For the purpose of this tutorial, the following code (defined above as part of the `IndexModel`) reads environment variables that will be defined in a moment to compose the URL:

```csharp
private static string backendDNSName = $"{Environment.GetEnvironmentVariable("ServiceName")}.{Environment.GetEnvironmentVariable("AppName")}";
private static Uri backendUrl = new Uri($"http://{backendDNSName}:{Environment.GetEnvironmentVariable("ApiHostPort")}/api/todo");
```

The URL is composed of the application name, the service name, and the port. All of this information is found in the service.yaml file found in the **ToDoService** project. Navigate in **Solution Explorer** to the **ToDoService** project and open **Service Resources** > **service.yaml**.

![Figure 1 - The ToDoService service.yaml file](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-serviceyaml-port.png)

* The app name (`ServiceFabricMeshApp`) is found under `application:` after `name:` See (1) in the figure above.
* The service name (`ToDoService`) is found under `services:` after `name:` See (2) in the figure above.
* The port (`20006`) is found under `endpoints:` after `port:` See (3) in the figure above.

With the app name, service name, and port number, environment variables can be defined that the app will use to communicate with the back-end service. In **Solution Explorer**, navigate  to **WebFrontEnd** > **Service Resources** > **service.yaml** to define the variables that specify the back-end service address.

In the service.yaml file, add the following variables under `environmentVariables`. Use spaces, not tabs, when you indent these variables or the file won't compile.

``` xml
- name: AppName
    value: ServiceFabricMeshApp
- name: ApiHostPort
    value: 20006
- name: ServiceName
    value: ToDoService
```

It should look something like this (although your `ApiHostPort` value will probably be different):

![Service.yaml in the WebFrontEnd project](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-serviceyaml-envvars.png)

Now you are ready to build and deploy the image the Service Fabric app, along with the back-end web service, to your local cluster.

## Build and debug on your local cluster

A Docker image is automatically built and deployed to your local cluster as soon as your project loads. This process may take a while. To monitor the progress in the Visual Studio **Output** pane, set the Output pane **Show output from:** drop-down to **Service Fabric Tools**.

Press **F5** to compile and run your service locally. Whenever the project is run and debugged locally, Visual Studio will:

* Make sure that Docker for Windows is running and set to use Windows as the container operating system.
* Download any missing Docker base images. This part may take some time
* Build (or rebuild) the Docker image used to host your code project.
* Deploy and run the container on the local Service Fabric development cluster.
* Run your services and hit any breakpoints you have set.

After the local deployment is finished, and Visual Studio is running your app, a browser window will open to a default sample webpage.

**Debugging tips**

* If you get error that "No Service Fabric local cluster is running", make sure that the Service Local Custer Manager (SLCM) is running. Right-click the SLCM icon in the task bar, and click **Start Local Cluster**. Once it has started, return to Visual Studio and press **F5**.
* If you get a 404 when the app starts, it probably means that your environment variables in **service.yaml** are incorrect. Make sure that `AppName`, `ApiHostPort` and `ServiceName` are set correctly per the instructions in [Set environment variables](#set-environment-variables).
* If you get a build error in **service.yaml**, make sure that you used spaces and not tabs when you added the environment variables.

### Debug in Visual Studio

When you debug a Service Fabric mesh application in Visual Studio, you are using a local Service Fabric development cluster. To see how to-do items are retrieved from the back-end service, debug into the OnGet() method.
1. In the **WebFrontEnd** project, open **Pages** > **Index.cshtml** > **Index.cshtml.cs** and set a breakpoint in the **Get** method (line 17).
2. In the **ToDoService** project, open **TodoController.cs** and set a breakpoint in the **Get** method (line 16).
3. Go back to the browser and refresh the page. You hit the  breakpoint in the web front end `OnGet()` method. You can inspect the `backendUrl` variable to see how the environment variables that you defined in the **service.yaml** file are combined into the URL used to contact the back-end service.
4. Step over (F10) the `client.GetAsync(backendUrl).GetAwaiter().GetResult())` call and you'll hit the controller's `Get()` breakpoint. In this method, you can see how the list of to-do items is retrieved from the in-memory list.
5. When you are done looking around, you can stop debugging your project in Visual Studio by pressing **Shift+F5**.

## Publish to Azure

To publish your Service Fabric Mesh project to Azure, right-click on **ServiceFabricMeshApp** in Visual studio and select **Publish...**

Next, you'll see a **Publish Service Fabric Application** dialog.

![Visual studio Service Fabric Mesh publish dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-dialog.png)

Select your Azure account and subscription. Choose a **Location**. This article uses **East US**.

Under **Resource group**, select **\<Create New Resource Group...>**. This results in a dialog where you'll create a new resource group. Choose the **East US** location and name the group **sfmeshTutorial1RG**. Press **Create** to create the resource group and return to the publish dialog.

![Visual studio Service Fabric Mesh new resource group dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-new-resource-group-dialog.png)

Back in the **Publish Service Fabric Application** dialog, under **Azure Container Registry**, select **\<Create New Container Registry...>**. In the **Create Container Registry** dialog, use a unique name for the **Container registry name**. For **Location**, pick **East US**. Select the **sfmeshTutorial1RG** resource group. Set the **SKU** to **Basic** and then press **Create** to return to the publish dialog.

![Visual studio Service Fabric Mesh new resource group dialog](media/service-fabric-mesh-tutorial-deploy-dotnetcore/visual-studio-publish-new-container-registry-dialog.png)

In the publish dialog, press the **Publish** button to deploy your Service Fabric application to Azure.

When you publish to Azure for the first time, it can take up to 10 or more minutes. Subsequent publishes of the same project generally take around five minutes. Obviously, these estimates will vary based on your internet connection speed and other factors. You can monitor the progress of the deployment by selecting the **Service Fabric Tools** pane in the Visual Studio **Output** window. Once the deployment has finished, the **Service Fabric Tools** output will display the app's IP address and port in the form of a URL.

```json
Packaging Application...
Building Images...
Web1 -> C:\Code\ServiceFabricMeshApp\ToDoService\bin\Any CPU\Release\netcoreapp2.0\ToDoService.dll
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

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a Service Fabric Mesh app consisting of a ASP.NET web front end.
> * Add a back-end service to the project & retrieve data from it.
> * Debug the app locally.
> * Publish the app to Azure.

Explore the [Voting app sample](https://github.com/Azure/service-fabric-mesh-preview-pr/tree/master/samples/src/votingapp) to see another example of service-to-service communication.