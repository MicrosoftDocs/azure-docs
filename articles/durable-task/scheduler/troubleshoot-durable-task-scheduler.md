---
author: hhunter-ms
ms.author: hannahhunter
title: Troubleshoot errors in Durable Task Scheduler
titleSuffix: Durable Task
description: Troubleshoot common error messages and issues in Durable Task Scheduler, including connection string problems, deployment failures, and gRPC runtime issues on ARM devices.
ms.topic: troubleshooting-general
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 04/30/2026
---

# Troubleshoot errors in Durable Task Scheduler

This article helps you troubleshoot common scenarios in Durable Task Scheduler apps. Find your scenario in the following list and follow the linked steps to diagnose and resolve the issue.

## Common scenarios

- [Check connection string and access to Durable Task Scheduler](#check-connection-string-and-access-to-durable-task-scheduler)
- [Error deploying Durable Functions app to Azure](#error-deploying-durable-functions-app-to-azure)
- [Unknown error retrieving details of this task hub](#unknown-error-retrieving-details-of-this-task-hub)
- [Can't delete resource](#cant-delete-resource)
- [Can't determine project to build](#cant-determine-project-to-build)
- [Can't find native binaries for ARM (Apple silicon)](#cant-find-native-binaries-for-arm-apple-silicon)

> [!NOTE]
> Microsoft support engineers are available to help diagnose issues with your application. If you're not able to diagnose your problem after going through this article, you can file a support ticket by going to the **Help** > **Support + troubleshooting** section of the Durable Task Scheduler resource in the Azure portal.

## Check connection string and access to Durable Task Scheduler

When your app isn't running as expected, verify the following:

- The connection string format is correct.
- Authentication is set up correctly. 

### Local development

1. Check the connection string, which should have this format: `Endpoint=http://localhost:<port number>;Authentication=None`. Ensure the port number is the one mapped to `8080` on the [container running the durable task scheduler emulator](./quickstart-durable-task-scheduler.md#set-up-the-durable-task-emulator). 

1. Along with the durable task scheduler emulator, make sure [the Azure Storage emulator, Azurite, is started](./quickstart-durable-task-scheduler.md#test-locally). Azurite is needed for components of the app related to Functions. 

### Running on Azure

1. Check your app for the environment variables `DURABLE_TASK_SCHEDULER_CONNECTION_STRING` and `TASKHUB_NAME`.

1. Check the value of `DURABLE_TASK_SCHEDULER_CONNECTION_STRING`. Specifically, verify that the scheduler endpoint and authentication type are correct. The connection string should be formatted as follows when using: 

    - *User-assigned managed identity*: `Endpoint={scheduler endpoint};Authentication=ManagedIdentity;ClientID={client id}`, where `client id` is the identity's client ID. 
    - *System-assigned managed identity*: `Endpoint={scheduler endpoint};Authentication=ManagedIdentity`

1. Ensure the required role-based access control (RBAC) permission is [granted to the identity](./develop-with-durable-task-scheduler.md#configure-identity-based-authentication-for-your-app-to-access-durable-task-scheduler) needing to access the specified task hub or scheduler. 
    -  When accessing the dashboard, ensure permission is [assigned to your own identity (email)](./durable-task-scheduler-dashboard.md#access-the-durable-task-scheduler-dashboard).

1. If user-assigned managed identity is used, ensure the [identity is assigned to your app](./durable-task-scheduler-identity.md#assign-managed-identity-to-your-app).

## Error deploying Durable Functions app to Azure 

If your deployment fails with an error such as `Encountered an error (ServiceUnavailable) from host runtime` from Visual Studio Code, first check your app to ensure the required [environment variables](./durable-task-scheduler-identity.md#add-environment-variables-to-your-app) are set correctly. Then redeploy your app. If you see an error loading functions, select the **Refresh** button. 

## Unknown error retrieving details of this task hub

If you get an `Unknown error retrieving details of this task hub` error on the durable task scheduler dashboard, the reason could be:

1. Your identity (email) doesn't have the required permission assigned for that task hub. Follow instructions to [grant the permission](./durable-task-scheduler-dashboard.md), then access the dashboard again. 

1. Your task hub was deleted. 

## Can't delete resource

Before you can delete a scheduler resource, you must first delete all of its task hubs. If you haven't, you receive the following error message:

```json
{
  "error": {
    "code": "CannotDeleteResource",
    "message": "Cannot delete resource while nested resources exist. Some existing nested resource IDs include: 'Microsoft.DurableTask/schedulers/YOUR_SCHEDULER/taskhubs/YOUR_TASKHUB'. Please delete all nested resources before deleting this resource."
  }
}
```

To resolve this, list the task hubs in the scheduler and delete them:

```azurecli
# List all task hubs in the scheduler
az durabletask taskhub list --resource-group RESOURCE_GROUP_NAME --scheduler-name SCHEDULER_NAME

# Delete each task hub
az durabletask taskhub delete --resource-group RESOURCE_GROUP_NAME --scheduler-name SCHEDULER_NAME --name TASKHUB_NAME
```

After all task hubs are deleted, retry deleting the scheduler resource.

## Can't determine project to build

If, after starting Azurite, you encounter the error: `“Can't determine Project to build. Expected 1 .csproj or .fsproj but found 2”`:
- Delete the **bin** and **obj** directories in your app.
- Try running `func start` again.

## Can't find native binaries for ARM (Apple silicon)

If you see gRPC errors related to not finding native binaries for ARM (such as on an Apple silicon Mac — M1, M2, etc.), add the following workaround to your `extensions.csproj` file:

1. Add a package reference to `Contrib.Grpc.Core.M1`.
1. Add a custom after-build target that copies the ARM64 gRPC native libraries to the correct output directory.

Add the following `ItemGroup` and `Target` elements to your `extensions.csproj`:

```xml
<!-- Workaround for gRPC issues on ARM (Apple silicon) devices -->
<ItemGroup>
  <PackageReference Include="Contrib.Grpc.Core.M1" Version="2.41.0" />
</ItemGroup>
<Target Name="CopyGrpcNativeAssetsToOutDir" AfterTargets="Build">
  <ItemGroup>
    <NativeAssetToCopy Condition="$([MSBuild]::IsOSPlatform('OSX'))" Include="$(OutDir)runtimes/osx-arm64/native/*"/>
  </ItemGroup>
  <Copy SourceFiles="@(NativeAssetToCopy)" DestinationFolder="$(OutDir).azurefunctions/runtimes/osx-arm64/native"/>
</Target>
```

## Related content

- [Configure managed identity for Durable Task Scheduler](./durable-task-scheduler-identity.md)
- [Debug and manage orchestrations using the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md)
- [Quickstart: Configure a Durable Functions app to use the Durable Task Scheduler](./quickstart-durable-task-scheduler.md) 