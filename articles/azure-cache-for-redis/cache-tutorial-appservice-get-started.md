---
title: 'Tutorial: Get started connecting an App Service hosted web app to Azure Cache for Redis'
description: In this tutorial, you learn how to connect your App Service-hosted web application to an Azure Cache for Redis instance.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: tutorial
ms.date: 04/15/2024
#CustomerIntent: As a developer, I want to see how to use a Azure Cache for Redis instance with an Azure App Service.

---

# Tutorial: Connect to Azure Cache for Redis from your we application hosted on Azure App Service

In this tutorial, you will start with a basic ASP.NET Core Web App and then add code snippet to connect to Azure Cache for Redis using a system assigned managed identity.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Visual Studio 2022 with the ASP.NET and web development workload.
  If you have already installed Visual Studio 2022:

  Install the latest updates in Visual Studio by selecting Help > Check for Updates.
  Add the workload by selecting Tools > Get Tools and Features.


## Set up an Azure Cache for Redis instance

1. Create a new Azure Cache for Redis instance by using the Azure portal or your preferred CLI tool. Use the [quickstart guide](quickstart-create-redis.md) to get started.

    For this tutorial, use a Standard C1 cache.
    :::image type="content" source="media/cache-tutorial-aks-get-started/cache-new-instance.png" alt-text="Screenshot of creating a Standard C1 cache in the Azure portal":::

1. On the **Advanced** tab, enable Microsoft Entra Authentication. 

1. Follow the steps through to create the cache.

1. Once your cache is created, go to the **Data Access Configuration** and click on Add > New Redis User. 

1. Choose Data Contributor Access Policy and click Next. Under the "Assign access to" options, choose "Managed Identity" and click "Select member"

1. Choose your subscription and select App Service in "Managed Identity" dropdown.

1. Choose the user assigned managed identity for your App Service in the "Select" box and click the "Select" button.

1. Click the "Next: Review and assign" button followed by "Assign" button on next page.

## Create your web application and publish to Azure App Service

Follow the steps described in the [Azure App Service tutorial](https://learn.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore?tabs=net70&pivots=development-environment-vs#1-create-an-aspnet-web-app) to create and publish your first Azure App Service.

### Update the web application to use Azure Cache for Redis

1. Open your web application in Visual Studio and right click on the project. Click on the Manage NuGet Packages. Browse and install the latest version of Microsoft.Azure.StackExchangeRedis.

1. Open the Index.cshtml file and append the following code to a button which will write data to your Azure Cache for Redis instance

```html
<div class="text-center">
    <button onclick="UpdateTimeStamp()">Update timestamp</button>
    <input type="text" id="timestampTextBox" style="min-width:30%" />
</div>

<script>
    function UpdateTimeStamp() {
        $.ajax({
            url: '@Url.Action("UpdateTimeStamp", "Home")',
            type: 'GET',
            success: function (data) {
                $('#timestampTextBox').val(data);
            }
        });
    }
</script>
```

1. Open the HomeController.cs file and add the following code to handle the click event for the new button you just added.

```CSharp
[HttpGet]
public async Task<IActionResult> UpdateTimeStamp()
{
    await _redisDB.StringSetAsync(key, DateTime.UtcNow.ToString("s"));
    return Ok("Last timestamp: " + (await _redisDB.StringGetAsync(key)).ToString());
}
```

1. Open the Program.cs file and the following code snippet to instantiate a connection to your Azure Cache for Redis Instance.
Note that 
- redisHostName is the hostname for the Azure Cache for Redis instance that you created earlier
- webAppObjectId is the object (Principal) Id for your Azure App Service system assigned managed identity.

```CSharp
const string redisHostName = "cachename.redis.cache.windows.net";
const string webAppObjectId = "someguid";

var configOptions = await ConfigurationOptions.Parse($"{redisHostName}:6380").ConfigureForAzureWithSystemAssignedManagedIdentityAsync(webAppObjectId);

var redisConnection = await ConnectionMultiplexer.ConnectAsync(configOptions);
var redisDB = redisConnection.GetDatabase();

builder.Services.AddSingleton(redisDB);

var app = builder.Build();
```


## Clean up your deployment

To clean up your cluster, run the following commands:

```bash
kubectl delete deployment azure-vote-front
kubectl delete service azure-vote-front
```

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using the Azure portal](/azure/aks/learn/quick-kubernetes-deploy-portal)
- [AKS sample voting application](https://github.com/Azure-Samples/azure-voting-app-redis/tree/master)
