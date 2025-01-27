---
title: Configure an existing Durable Functions app to use the Durable Task Scheduler (preview)
description: Learn how to configure an existing Durable Functions app to use Durable Task Scheduler.
ms.topic: how-to
ms.date: 01/27/2025
---

In this guide, you configure an existing Durable Functions app to use Durable Task Scheduler (DTS) as the storage backend. Note that **no** code changes are needed to switch an existing Durable Functions app to use DTS.

- [.NET (isolated) applications](#configure-net-isolated-applications)
- [Non-.NET applications](#configure-non-net-applications)

## Prerequisites
Before continuing with the tutorial, make sure you have:

- [Enrolled in private preview](enroll.md)
- [A Durable Task Scheduler and task hub](https://github.com/Azure/Azure-Functions-Durable-Task-Scheduler-Private-Preview/issues/70) 
- A Durable Functions app
> Note: As of now, DTS is only supported on Function Apps hosted on App Service plans. While DTS may function on other Function SKUs, performance might not be optimal. For instance, Function Apps will not automatically scale out based on orchestration throughput via DTS. This issue is expected to be resolved shortly after or during the middle of the Private Preview.
- An Azure Storage account for deployment to Azure (all Azure Function apps require this)
- [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite) (Azure Storage emulator) for testing locally
- [DurableTask CLI](enroll.md#upgrade-the-azure-cli-to-use-the-durable-task-scheduler-commands) enabled 

## Configure .NET (isolated) applications

### Add and update NuGet packages

Add the following Durable Task NuGet package reference to your application's `.csproj` file.

```xml
<PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged" Version="0.3.0-alpha" />
```

Update existing NuGet package references in your `.csproj` file to the following versions:

```xml
<PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.22.0" />
<PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask" Version="1.2.2" />
<PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.17.4" />
```

### Update host.json to use Durable Task Scheduler as storage backend

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

> **Note:** If you're using Azure Storage as the storage backend for Durable Functions, you may or may not see the `storageProvider` property in your `host.json` file. This is because Azure Storage is currently the default backend, so it's optional to specify it. 

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

Get the DTS URL by running:
```azurecli
  az durabletask scheduler list -g <RESOURCE_GROUP_NAME>
```
Take note of the namepace name and dashboard URL for later use. 

Retrieve the task hub name by running: 
```azurecli
  az durabletask taskhub list -g <RESOURCE_GROUP_NAME> -s <SCHEDULER_NAME>
```

### Assign Azure Role-Based Access Control (RBAC) permission to developer identity
Before running the app, give your developer identity the **Durable Task Data Contributor** role so you have permission to access DTS. 
> **Note:** Learn [how identity-based connection works](https://learn.microsoft.com/azure/azure-functions/functions-reference#local-development-with-identity-based-connections) during local development. 

#### Set the assignee
Get your developer credential ID:

```bash
  assignee=$(az ad user show --id "someone@microsoft.com" --query "id" --output tsv)
```
#### Set the scope 
Setting the scope on the Task Hub or Scheduler level is sufficient. 

* Task Hub: 
```bash
  scope="/subscriptions/${subscription}/resourceGroups/${rg}/providers/Microsoft.DurableTask/schedulers/${scheduler}/taskHubs/${taskhub}"
```
* Scheduler:
```bash
  scope="/subscriptions/${subscription}/resourceGroups/${rg}/providers/Microsoft.DurableTask/schedulers/${scheduler}"
```

If for whatever reason you need to set scope on the resource group or subscription level, you can set it like this:

* Resource group (access to all schedulers in a resource group):
```bash
  scope="/subscriptions/${subscription}/resourceGroups/${rg}"
```
* Subscription (access to all resource groups in a subscription)
```bash
  scope="/subscriptions/${subscription}"
```

#### Grant access
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

### Run the app locally (.NET)
Start [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite#run-azurite). 

Next, go to the root directory of your app and run the application:

```sh
func start
```

If you encounter the error: `“Can't determine Project to build. Expected 1 .csproj or .fsproj but found 2”`:
- Delete the **bin** and **obj** directories in your app.
- Try running `func start` again.

Now you can test your app.

> **Note for Mx Mac (ARM64) users:** 
> You may run into gRPC runtime issues with Durable Functions. As a workaround:
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

## Run the app on Azure (.NET)

Durable Task Scheduler supports identity-based authentication only. You can use an identity managed by the Azure platform, so you do not need to provision or rotate any secrets. 

To run your app on Azure, start by deploying the app, then configure the app to use a *system-assigned* or a *user-assigned* managed identity for authentication. 


- **Recommended:** User-assigned identity isn't tied to the lifecycle of the app. You can re-use that identity even if the app is de-provisioned. 
- System-assigned identity is deleted if the app is de-provisioned. 

This section shows how to set up **user-assigned managed identity**.

### Create a user-managed identity

1. [Create a user-assigned managed identity](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity). 

1. In the Azure portal, go to the identity resource and note down its ID: 
     ![Identity ID](../media/images/identity_id.png)

### Assign Azure Role-Based Access Control (RBAC) to the user-managed identity

1. Navigate to the Durable Task Scheduler resource on the portal. 

1. In the left menu, select **Access control (IAM)**.

1. Click **Add** to add a role assignment.

    ![Add role assignment](../media/images/add-assignment.png)

1. Search for and select **Durable Task Data Contributor**. Click **Next**.

    ![Durable Task Data Contributor role](../media/images/data-contributor-role.png)

1. On the **Members** tab, for **Assign access to**, select **Managed identity**.

1. For **Members**, click **+ Select members**.

1. In the **Select managed identities** pane, expand the **Managed identity** drop down and select **User-assigned managed identity**.
    ![Find user assigned identity](../media/images/members-tab.png)

1. Pick the user-managed identity created previously and click the **Select** button.

1. Click **Review + assign** to finish assigning the role. 

### Assign the Storage RBAC to the user-managed identity

1. In the Azure portal, navigate to your Azure Storage account. 

1. Repeat the steps from the [previous section](#assign-rbac-to-the-user-managed-identity) to assign the **Storage Blob Data Contributor** role to the identity. 

### Enable user-assigned managed identity on your app

The identity is now created and is set up with the right RBAC access. Now we need to assign the identity to your app:  
1. From your app in the portal, from the left menu, select **Settings** > **Identity**.
1. Click the **User assigned** tab.
1. Click **+ Add**, then pick the identity created in the last section. Click the **Add** button.
  ![Add user-assigned identity to app](../media/images/pick-identity.png)

### Add required environment variables to app

1. Navigate to your app on the portal.

1. In the left menu, click **Settings** > **Environment variables**. 

1. Delete the `AzureWebJobsStorage` setting. 

1. Add the following environment variables: 
    * `AzureWebJobsStorage__accountName`: your storage account name 
    * `AzureWebJobsStorage__clientId`: the identity ID noted previously
    * `AzureWebJobsStorage__credential`: `managedidentity`
    * `TASKHUB_NAME`: name of task hub
    * `DURABLE_TASK_SCHEDULER_CONNECTION_STRING`: the format of the string is `Endpoint={DTS URL};Authentication=ManagedIdentity;ClientID={client id}`, where *endpoint* is the DTS URL and *client id* is the ID of the identity ID noted previously

    > **Note:** If you use system-assigned identity, your connection string would be: `Endpoint={DTS URL};Authentication=ManagedIdentity`.

1. Click **Apply** then **Confirm** to add the variables. 

Congratulations! Your Durable Functions app should now be configured to use DTS! You can test it now. 

For more tutorials and information about DTS, see [Next Steps](#next-steps). 

## Configure non-.NET applications

The steps for configuring a non-.NET to use Durable Task Scheduler (DTS) is similar to those of a .NET app, except for a few differences. The following are the steps in common: 

* [Specify DTS as the storage backend](#update-hostjson-to-use-durable-task-scheduler-as-storage-backend) in `host.json` 
* [Provide connection and task hub info](#provide-connection-string-and-task-hub-information) in `local.settings.json`. For the `FUNCTIONS_WORKER_RUNTIME` property, the value would be the language of your app. For example, `python`.
* [Assign RBAC access to developer identity](#assign-rbac-access-to-developer-identity)

The sections following show the other steps required for configuring a non-.NET app to use DTS. 

### Remove `extensionBundle` from `host.json`

Remove the existing `Microsoft.Azure.Functions.ExtensionBundle` reference from the `host.json` file.

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
        "type": "AzureStorage"
      }
    }
  }
}
```

### Install the required packages

Run the following commands:

```sh
  func extensions install --package Microsoft.Azure.WebJobs.Extensions.DurableTask.AzureManaged --version 0.3.0-alpha
```

```sh
  func extensions install --package Microsoft.Azure.WebJobs.Extensions.DurableTask --version 2.13.7
```

This creates an `extensions.csproj` file in your application folder because all Azure Function extensions are C# packages. In this case, you've explicitly installed an extension so a `.csproj` file is created automatically, along with the *bin* and *obj* directories.  

> **Note:** Remember to install any other Azure Function extensions your app needs! 

### Run the app locally

You can test your app locally by running `func start`. 

> **Note:** If you have a Python app, remember to create a virtual environment and install packages in `requirements.txt` before running `func start`. The packages you need are `azure-functions` and `azure-functions-durable`.  

### Run the app on Azure

Follow steps in the [.NET section](#run-the-app-on-azure-net). 

## Clean up resources

Remove the task hub you created. 

```azurecli
  az durabletask taskhub delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOU_SCHEDULER --name YOUR_TASKHUB
```

Successful deletion doesn't return any output. 

Next, delete the scheduler that housed that task hub.

```azurecli
  az durabletask scheduler delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOU_SCHEDULER 
```

Make sure you've deleted all task hubs in the Durable Task Scheduler environment. If you haven't, you'll receive the following error message:

```json
{
  "error": {
    "code": "CannotDeleteResource",
    "message": "Cannot delete resource while nested resources exist. Some existing nested resource IDs include: 'Microsoft.DurableTask/schedulers/YOUR_SCHEDULER/taskhubs/YOUR_TASKHUB'. Please delete all nested resources before deleting this resource."
  }
}
```

## Troubleshooting

### Non-.NET applications

If you see gRPC errors related to not finding native binaries for ARM (such as on a Mx Mac), you may need to add the following workaround to the end of your `extensions.csproj` file.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <WarningsAsErrors></WarningsAsErrors>
    <DefaultItemExcludes>**</DefaultItemExcludes>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.DurableTask" Version="2.13.7" />
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.DurableTask.AzureManaged" Version="0.3.0-alpha" />
    <PackageReference Include="Microsoft.Azure.WebJobs.Script.ExtensionsMetadataGenerator" Version="1.1.3" />
  </ItemGroup>
  <!-- Add the below groups/targets to workaround gRPC issues on ARM devices. -->  
  <ItemGroup>
    <PackageReference Include="Contrib.Grpc.Core.M1" Version="2.41.0" />
  </ItemGroup>
  <Target Name="CopyGrpcNativeAssetsToOutDir" AfterTargets="Build">
    <ItemGroup>
       <NativeAssetToCopy Condition="$([MSBuild]::IsOSPlatform('OSX'))" Include="$(OutDir)runtimes/osx-arm64/native/*"/>
    </ItemGroup>
    <Copy SourceFiles="@(NativeAssetToCopy)" DestinationFolder="$(OutDir).azurefunctions/runtimes/osx-arm64/native"/>
  </Target>
</Project>
```

## Next steps

- [Order processing sample](../E2E/OrderProcessor/)
- [Learn more about Durable Task Scheduler performance](./performance.md)
- [Learn more about the Durable Task Scheduler dashboard](./dashboard.md)