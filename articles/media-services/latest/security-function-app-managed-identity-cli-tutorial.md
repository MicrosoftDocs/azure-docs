---
title: Give an Azure Function app access to a Media Services account
description: Suppose you want to build an “On Air” sign for your broadcasting studio. You can determine when Media Services Live Events are running using the Media Services API but this may be hard to call from an embedded device. Instead, you could expose an HTTP API for your embedded device using Azure Functions. Azure Functions could then call Media Services to get the state of the Live Event.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: tutorial
ms.date: 05/18/2021
ms.author: inhenkel
---

# Tutorial: Give an Azure Function app access to a Media Services account

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Suppose you want let visitors to your website or application to know that you are “On Air” in your broadcasting studio. You can determine when Media Services Live Events are running using the Media Services API but this may be hard to call from an embedded device. Instead, you could expose an HTTP API for your embedded device using Azure Functions. Azure Functions could then call Media Services to get the state of the Live Event.

:::image type="content" source="media/diagrams/managed-identities-scenario-function-app-access-media-services-account.svg" alt-text="Managed Identities giving a Function App access to a Media Services account":::

This tutorial uses the 2020-05-01 Media Services API.

## Sign in to Azure

To use any of the commands in this article, you first have to be signed in to the subscription that you want to use.

 [!INCLUDE [Sign in to Azure with the CLI](./includes/task-sign-in-azure-cli.md)]

### Set subscription

Use this command to set the subscription that you want to work with.

[!INCLUDE [Sign in to Azure with the CLI](./includes/task-set-azure-subscription-cli.md)]

## Prerequisites

> [!IMPORTANT]
> You are strongly encouraged to work through the [Create a C# function in Azure from the command line quickstart](../../azure-functions/create-first-function-cli-csharp.md) before attempting this tutorial.  That is because the set up steps included there are the same steps needed here.  It will also give you a chance to work with a simple example on which this tutorial is based.

## Resource names

Before you get started, decide on the names of the resources you'll create.  They should be easily identifiable as a set, especially if you aren't planning to use them after you're done testing. Naming rules are different for many resource types so it's best to stick with all lower case. For example, "mediatest1rg" for your resource group name and "mediatest1stor" for your storage account name. Use the same names for each step in this article.

You'll see these names referenced in the commands below.  The names of resources you'll need are:

- your-resource-group-name
- your-storage-account-name
- your-media-services-account-name
- your-region
- your-function-name: use "OnAir"
- your-live-event-name: use "live1"
- your-ip-address: use "0.0.0./32"

> [!NOTE]
> The hyphens above are only used to separate guidance words. Because of the inconsistency of naming resources in Azure services, don't use hyphens when you name your resources.<br/><br/>
> Anything represented by 00000000-0000-0000-0000000000 is the unique identifier of the resource.  This value is usually returned by a JSON response. It is also recommended that you copy and paste the JSON responses in Notepad or other text editor, as those responses will contain values you will need for later CLI commands.<br/><br/>
> Also, you don't create the region name.  The region name is determined by Azure.

### List Azure regions

If you're not sure of the actual region name to use, use this command to get a listing:

[!INCLUDE [List Azure regions with the CLI](./includes/task-list-azure-regions-cli.md)]

## Sequence

Each of the steps below is done in a particular order because one or more values from the JSON responses are used in the next step in the sequence.

## Create a resource group

The resources you'll create must belong to a resource group. Create the resource group first. You'll use `your-resource-group-name` for the Media Services account creation step, and subsequent steps.

[!INCLUDE [Create a resource group with the CLI](./includes/task-create-resource-group-cli.md)]

## Create a Storage account

The Media Services account you'll create must have a storage account associated with it. Create the storage account for the Media Services account first. You'll use `your-storage-account-name` for subsequent steps.

[!INCLUDE [Create a Storage account with the CLI](./includes/task-create-storage-account-cli.md)]

## Create a Media Services account

Now create the Media Services account. Look for the `

[!INCLUDE [Create a Media Services account with the CLI](./includes/task-create-media-services-account-cli.md)]

## Set up the Azure Function

In this section, you'll set up your Azure Function.

### Get the code

Use the Azure Functions to create your function project and retrieve the code from the HTTP template.

```azurecli-interactive
func init MediaServicesLiveMonitor –dotnet
```

### Change directory

Make sure you change your working directory to the project directory.  Otherwise you'll get errors.

```azurecli-interactive
cd .\MediaServicesLiveMonitor\
```

### Name your function

```azurecli-interactive
func new --name OnAir --template "HTTP trigger" --authlevel "anonymous"
```

## Configure the functions project

### Add items to the .csproj file

In the autogenerated “.csproj” file, add the following lines to the first `<ItemGroup>`:

```xml
<PackageReference Include="Microsoft.Azure.Management.Fluent" Version="1.37.0" />
<PackageReference Include="Microsoft.Azure.Management.Media" Version="3.0.4" />
```

### Edit the OnAir.cs code

Change the `OnAir.cs` file. Change `subscriptionId`, `resourceGroup`, and `mediaServicesAccountName` variables to the ones you decided upon earlier.

```aspx-csharp
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Management.Media;
using Microsoft.Azure.Management.ResourceManager.Fluent.Authentication;
using Microsoft.Azure.Management.ResourceManager.Fluent;
using Microsoft.Azure.Management.Media.Models;

namespace MediaServicesLiveMonitor
{
    public static class LatestAsset
    {
        [FunctionName("OnAir")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            if (string.IsNullOrWhiteSpace(name))
            {
                return new BadRequestObjectResult("Missing 'name' URL parameter");
            }
            
            var credentials = SdkContext.AzureCredentialsFactory.FromSystemAssignedManagedServiceIdentity(
                MSIResourceType.AppService,
                AzureEnvironment.AzureGlobalCloud);

            var subscriptionId = "00000000-0000-0000-000000000000";    // Update
            var resourceGroup = "<your-resource-group-name>";                                    // Update
            var mediaServicesAccountName = "<your-media-services-account-name>";                    // Update

            var mediaServices = new AzureMediaServicesClient(credentials)
            {
                SubscriptionId = subscriptionId
            };

            var liveEvent = await mediaServices.LiveEvents.GetAsync(resourceGroup, mediaServicesAccountName, name);

            if (liveEvent == null)
            {
                return new NotFoundResult();
            }
            
            return new OkObjectResult(liveEvent.ResourceState == LiveEventResourceState.Running ? "On air" : "Off air");
        }
    }
}
```

## Create the Function App

Create the Function App to host the function. The name is the same as the one that you downloaded earlier, `MediaServicesLiveMonitorApp`.

```azurecli-interactive

az functionapp create --resource-group <your-resource-group-name> --consumption-plan-location your-region --runtime dotnet --functions-version 3 --name MediaServicesLiveMonitorApp --storage-account mediatest3store --assign-identity "[system]"

```

Look for `principalId` in the JSON response:

```json
{
...  
"identity": {
//Note the principalId value for the following step
    "principalId": "00000000-0000-0000-000000000000",
    "tenantId": "00000000-0000-0000-000000000000",
    "type": "SystemAssigned",
    "userAssignedIdentities": null
  }
...
```

## Grant the function app access to the Media Services account resource

For this request:

- `assignee` is the `principalId` that is in the JSON response from `az functionapp create`
- `scope` is the `id` that is in the JSON response from `az ams account create`.  See the example JSON response above.

```azurecli-interactive
az role assignment create --assignee 00000000-0000-0000-000000000000 --role "Media Services Account Administrator" --scope "/subscriptions/<the-subscription-id>/resourceGroups/<your-resource-group>/providers/Microsoft.Media/mediaservices/<your-media-services-account-name>"
```

## Publish the function

```azurecli-interactive
func azure functionapp publish MediaServicesLiveMonitorApp
```

## Validation

In a browser, go to the function URL, for example:

`https://mediaserviceslivemonitorapp.azurewebsites.net/api/onair?name=live1`

This should return a 404 (Not Found) error as the Live Event does not exist yet.

### Create a Live Event

```azurecli-interactive
az ams live-event create --resource-group test3 --account-name mediatest3 --name live1 --streaming-protocol RTMP
```

In a browser, go to the function URL, for example:

`https://mediaserviceslivemonitorapp.azurewebsites.net/api/onair?name=live1`

This should now show “Off Air”.

### Start the live event

If you start the Live Event, the function should return “On Air”.

```azurecli-interactive
az ams live-event start live1
```

This function allows access to anyone. Securing access to the Azure Function and wiring up an “On Air” light are out of scope for this document.

## Clean up resources

If you aren't planning to use the resources you created, delete the resource group.

[!INCLUDE [Create a Media Services account with the CLI](./includes/clean-up-resources-cli.md)]
