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

1. On the **Advanced** tab, enable Microsoft Entra Authentication. 

1. Follow the steps through to create the cache. Alternately, you can run the following steps on an existing cache with Microsoft Entra Authentication enabled.

1. Once your cache is created, go to the **Data Access Configuration** and click on Add > New Redis User. 

1. Choose Data Contributor Access Policy and click Next. Under the "Assign access to" options, choose "Managed Identity" and click "Select member"

1. Choose your subscription and select App Service in "Managed Identity" dropdown.

1. Choose the user assigned managed identity for your App Service in the "Select" box and click the "Select" button.

1. Click the "Next: Review and assign" button followed by "Assign" button on next page.

## Create your web application and publish to Azure App Service

Follow the steps described in the [Azure App Service tutorial](https://learn.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore?tabs=net70&pivots=development-environment-vs#1-create-an-aspnet-web-app) to create and publish your first Azure App Service.

### Update the web application to use Azure Cache for Redis

1. Open your web application in Visual Studio and right click on the project. Click on the Manage NuGet Packages. Browse and install the latest version of Microsoft.Azure.StackExchangeRedis.

1. Open the Views/Home/Index.cshtml file and replace with the following code to a button which will write data to your Azure Cache for Redis instance

```html
@{
    ViewData["Title"] = "Home Page";
}

<div class="text-center">
    <h1 class="display-4">Welcome</h1>
    <p>Learn about <a href="https://learn.microsoft.com/aspnet/core">building Web apps with ASP.NET Core</a>.</p>
</div>

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

1. Open the Controllers/HomeController.cs file and replace with the following code to handle the click event for the new button you just added.


```CSharp

using DemoWebApp.Models;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Diagnostics;

namespace DemoWebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IDatabase _redisDB;
        const string key = "mykey";

        public HomeController(ILogger<HomeController> logger, IDatabase redisDB)
        {
            _logger = logger;
            _redisDB = redisDB ?? throw new ArgumentNullException();
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpGet]
        public async Task<IActionResult> UpdateTimeStamp()
        {
                await _redisDB.StringSetAsync(key, DateTime.UtcNow.ToString("s"));
                return Ok("Last timestamp: " + (await _redisDB.StringGetAsync(key)).ToString());
            
        }
    }
}

```

1. Open the Program.cs file and replace with the following code snippet which will instantiate a connection to your Azure Cache for Redis Instance using system assigned managed identity
Note that 
- redisHostName is the hostname for the Azure Cache for Redis instance that you created earlier
- msiPrincipalID is the Principal Id for your Azure App Service system assigned managed identity.

```CSharp
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddControllersWithViews();

const string redisHostName = "yourcachename.redis.cache.windows.net";
const string msiPrincipalID = "someguid";

var configOptions = await ConfigurationOptions.Parse($"{redisHostName}:6380").ConfigureForAzureWithSystemAssignedManagedIdentityAsync(msiPrincipalID);

var redisConnection = await ConnectionMultiplexer.ConnectAsync(configOptions);
var redisDB = redisConnection.GetDatabase();

builder.Services.AddSingleton(redisDB);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

```

### Publish updated web app to Azure App Service

1. Right click on your project and choose Publish. Follow instructions to publish the updated web app to the Azure App Service that you created earlier.

1. After publishing your web app successfully to Azure App Service, a browser window will open which loads your custom controller along with "Update timestamp" button.
Click the button and see the latest timestamp when data in your Redis instance is updated.

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, you can delete them by deleting the resource group.

From your web app's Overview page in the Azure portal, select the myResourceGroup link under Resource group.
On the resource group page, make sure that the listed resources are the ones you want to delete.
Select Delete, type myResourceGroup in the text box, and then select Delete.

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Learn More: Use Entra ID for authentication](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication)
- [Learn More: Role based access control](/azure/azure-cache-for-redis/cache-configure-role-based-access-control)
