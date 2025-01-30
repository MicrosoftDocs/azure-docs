---
title: Configure an existing Durable Functions app to use the Durable Task Scheduler (preview)
description: Learn how to configure an existing Durable Functions app to use Durable Task Scheduler.
ms.topic: how-to
ms.date: 01/27/2025
zone_pivot_groups: dts-lanugages
---

# Configure an existing Durable Functions app to use the Durable Task Scheduler (preview)

You can switch and configure an existing Durable Functions app to use Durable Task Scheduler without changing any of your code. 

Choose your programming language scenario at the top of the article.

## Prerequisites

Before continuing with the tutorial, make sure you have:

::: zone pivot="csharp"  

- [A Durable Task Scheduler and task hub](./durable-task-scheduler-cli.md) 
- [A Durable Functions app](../durable-functions-isolated-create-first-csharp.md) with an Azure Storage account for deployment to Azure
- [Azurite](../../../storage/common/storage-use-azurite.md) (Azure Storage emulator) for testing locally
- [DurableTask CLI](./durable-task-scheduler-cli.md#set-up-the-cli) enabled 

::: zone-end 

::: zone pivot="other"  

- [A Durable Task Scheduler and task hub](./durable-task-scheduler-cli.md) 
- [A Durable Functions app](../quickstart-js-vscode.md) with an Azure Storage account for deployment to Azure
- [Azurite](../../../storage/common/storage-use-azurite.md) (Azure Storage emulator) for testing locally
- [DurableTask CLI](./durable-task-scheduler-cli.md#set-up-the-cli) enabled 

::: zone-end 

::: zone pivot="csharp"  

## Configure .NET (isolated) applications

### Add and update NuGet packages

In your Durable Functions app, add the following Durable Task NuGet package reference to your application's `.csproj` file.

```xml
<PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged" Version="0.3.0-alpha" />
```

Update existing NuGet package references in your `.csproj` file to the following versions:

```xml
<PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.22.0" />
<PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask" Version="1.2.2" />
<PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.17.4" />
```
::: zone-end 

::: zone pivot="other"  

## Configure non-.NET applications

::: zone-end 

### Update host.json to use Durable Task Scheduler as storage backend

::: zone pivot="csharp"  

Change the `storageProvider` type to be `azureManaged`:

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "hubName": "%TASKHUB_NAME%",
      "storageProvider": {
        "type": "azureManaged",
        "connectionStringName": "DURABLE_TASK_SCHEDULER_CONNECTION_STRING"
      }
    }
  }
}
```

::: zone-end 

::: zone pivot="other"  

Change the `storageProvider` type to be `azureManaged` and remove the existing `Microsoft.Azure.Functions.ExtensionBundle` reference from the `host.json` file.

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    }
  },
  // Remove this extensionBundle property.  
  // "extensionBundle": {
  //   "id": "Microsoft.Azure.Functions.ExtensionBundle",
  //   "version": "[4.*, 5.0.0)"
  // },
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "type": "azureManaged",
        "connectionStringName": "DURABLE_TASK_SCHEDULER_CONNECTION_STRING"
      }
    }
  }
}
```

::: zone-end 

> [!NOTE]
> If you're using Azure Storage as the storage backend for Durable Functions, you may or may not see the `storageProvider` property in your `host.json` file. This is because Azure Storage is currently the default backend, so it's optional to specify it. 

::: zone pivot="other"  

### Install the required packages

Run the following commands:

```sh
  func extensions install --package Microsoft.Azure.WebJobs.Extensions.DurableTask.AzureManaged --version 0.3.0-alpha
```

```sh
  func extensions install --package Microsoft.Azure.WebJobs.Extensions.DurableTask --version 2.13.7
```

This creates an `extensions.csproj` file in your application folder because all Azure Function extensions are C# packages. In this case, you've explicitly installed an extension so a `.csproj` file is created automatically, along with the *bin* and *obj* directories.  

> [!NOTE]
> Remember to install any other Azure Function extensions your app needs! 

::: zone-end 

## Test the app locally 

### Provide connection string and task hub information

To test the app locally, provide the connection string and task hub information in the `local.settings.json` file:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint={DTS URL};Authentication=DefaultAzure",
    "TASKHUB_NAME": "<TASKHUB NAME>"
  }
}
```

Get the Durable Task Scheduler URL by running:

```azurecli
  az durabletask scheduler list -g <RESOURCE_GROUP_NAME>
```
Take note of the namepace name and dashboard URL for later use. 

Retrieve the task hub name by running: 
```azurecli
  az durabletask taskhub list -g <RESOURCE_GROUP_NAME> -s <SCHEDULER_NAME>
```

### Assign Azure Role-Based Access Control (RBAC) permission to developer identity

Before running the app, give your developer identity the **Durable Task Data Contributor** role so you have permission to access Durable Task Scheduler. 

> [!NOTE]
> Learn [how identity-based connection works](../../functions-reference.md#local-development-with-identity-based-connections) during local development. 

#### Set the assignee

Get your developer credential ID:

```bash
  assignee=$(az ad user show --id "someone@microsoft.com" --query "id" --output tsv)
```

#### Set the scope 
Setting the scope on the Task Hub or Scheduler level is sufficient. 

**Task Hub**

```bash
  scope="/subscriptions/${subscription}/resourceGroups/${rg}/providers/Microsoft.DurableTask/schedulers/${scheduler}/taskHubs/${taskhub}"
```

**Scheduler**
```bash
  scope="/subscriptions/${subscription}/resourceGroups/${rg}/providers/Microsoft.DurableTask/schedulers/${scheduler}"
```

If you need to set scope on the resource group or subscription level, you can set it like the following examples:

**Resource group**

Scopes access to all schedulers in a resource group.

```bash
  scope="/subscriptions/${subscription}/resourceGroups/${rg}"
```

**Subscription**

Scopes access to all resource groups in a subscription.

```bash
  scope="/subscriptions/${subscription}"
```

#### Grant access

Run the following command to create the role assignment and grant access.

```bash
  az role assignment create \
    --assignee "$assignee" \
    --role "Durable Task Data Contributor" \
    --scope "$scope"
```

*Expected output*

The following output example shows a developer identity assigned with the Durable Task Data Contributor role on the *scheduler* level:

```json
{
  "condition": null,
  "conditionVersion": null,
  "createdBy": "YOUR_DEVELOPER_CREDENTIAL_ID",
  "createdOn": "2024-12-20T01:36:45.022356+00:00",
  "delegatedManagedIdentityResourceId": null,
  "description": null,
  "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_DTS_NAME/providers/Microsoft.Authorization/roleAssignments/ROLE_ASSIGNMENT_ID",
  "name": "ROLE_ASSIGNMENT_ID",
  "principalId": "YOUR_DEVELOPER_CREDENTIAL_ID",
  "principalName": "YOUR_EMAIL",
  "principalType": "User",
  "resourceGroup": "YOUR_RESOURCE_GROUP",
  "roleDefinitionId": "/subscriptions/YOUR_SUBSCRIPTION/providers/Microsoft.Authorization/roleDefinitions/ROLE_DEFINITION_ID",
  "roleDefinitionName": "Durable Task Data Contributor",
  "scope": "/subscriptions/YOUR_SUBSCRIPTION/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_DTS_NAME",
  "type": "Microsoft.Authorization/roleAssignments",
  "updatedBy": "YOUR_DEVELOPER_CREDENTIAL_ID",
  "updatedOn": "2024-12-20T01:36:45.022356+00:00"
}
```

### Run the app locally

Start [Azurite](../../../storage/common/storage-use-azurite.md#run-azurite). 

Once you've started Azurite, go to the root directory of your app and run the application:

```sh
func start
```

Running into issues? [See the troubleshooting guide.](./troubleshoot-durable-task-scheduler.md)

::: zone pivot="csharp"  

> [!NOTE] 
> For Mx Mac (ARM64) users, you may run into gRPC runtime issues with Durable Functions. As a workaround:
> 1. Reference the `2.41.0` version of the `Contrib.Grpc.Core.M1` NuGet package.
> 1. Add a custom after-build target that ensures the correct ARM64 version of the gRPC libraries can be found.
> 
> ```xml
><Project>
>  <ItemGroup>
>    <PackageReference Include="Contrib.Grpc.Core.M1" Version="2.41.0" />
>  </ItemGroup>
>
>  <Target Name="CopyGrpcNativeAssetsToOutDir" AfterTargets="Build">
>    <ItemGroup>
>       <NativeAssetToCopy Condition="$([MSBuild]::IsOSPlatform('OSX'))" Include="$(OutDir)runtimes/osx-arm64/native/*"/>
>    </ItemGroup>
>    <Copy SourceFiles="@(NativeAssetToCopy)" DestinationFolder="$(OutDir).azurefunctions/runtimes/osx-arm64/native"/>
>  </Target>
></Project>     
>``` 

::: zone-end 

::: zone pivot="other"  

> [!NOTE] 
> If you have a Python app, remember to create a virtual environment and install packages in `requirements.txt` before running `func start`. The packages you need are `azure-functions` and `azure-functions-durable`.  

::: zone-end 

## Run the app on Azure

Durable Task Scheduler supports identity-based authentication only. You can use an identity managed by the Azure platform, so you do not need to provision or rotate any secrets. 

To run your app on Azure, start by deploying the app, then configure the app to use a *system-assigned* or a *user-assigned* managed identity for authentication. 

- **User-assigned identity** (recommended) isn't tied to the lifecycle of the app. You can re-use that identity even if the app is de-provisioned. 
- **System-assigned identity** is deleted if the app is de-provisioned. 

This article shows how to set up **user-assigned managed identity**.

[!INCLUDE [assign-rbac-portal](./includes/assign-rbac-portal.md)]

Congratulations! Your Durable Functions app should now be configured to use Durable Task Scheduler! You can test it now. 

## Clean up resources

Remove the task hub you created. 

```azurecli
az durabletask taskhub delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
```

Successful deletion doesn't return any output. 

Next, delete the scheduler that housed that task hub.

```azurecli
az durabletask scheduler delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER 
```

## Next steps

- Learn more about the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).
- [Troubleshoot any errors you may encounter](./troubleshoot-durable-task-scheduler.md) while using Durable Task Scheduler.