---
title: Troubleshoot the Azure Functions durable task scheduler (preview)
description: Learn how to troubleshoot error messages and issues you encounter while using the Azure Functions durable task scheduler.
ms.topic: conceptual
ms.date: 05/06/2025
---

# Troubleshoot the Azure Functions durable task scheduler (preview)

> [!NOTE]
> Microsoft support engineers are available to help diagnose issues with your application. If you're not able to diagnose your problem after going through this article, you can file a support ticket by going the **Help** > **Support + troubleshooting** section of durable task scheduler resource on Azure portal.

## Check connection string and access to durable task scheduler

When your app isn't running as expected, first check if you have:
- The correct connection string format.
- Authentication set up correctly. 

### Local development

1. Check the connection string, which should have this format: `Endpoint=http://localhost:<port number>;Authentication=None`. Ensure the port number is the one mapped to `8080` on the [container running the durable task scheduler emulator](./quickstart-durable-task-scheduler.md#set-up-the-durable-task-emulator). 

1. Along with the durable task scheduler emulator, make sure [the Azure Storage emulator, Azurite, is started](./quickstart-durable-task-scheduler.md#test-locally). Azurite is needed for components of the app related to Functions. 

### Running on Azure

1. Check your app for the environment variables `DURABLE_TASK_SCHEDULER_CONNECTION_STRING` and `TASKHUB_NAME`.

1. Check the value of `DURABLE_TASK_SCHEDULER_CONNECTION_STRING`. Specifically, verify that the scheduler endpoint and authentication type are correct. The connection string should be formatted as follows when using: 

    - *User-assigned managed identity*: `Endpoint={scheduler endpoint};Authentication=ManagedIdentity;ClientID={client id}`, where `client id` is the identity's client ID. 
    - *System-assigned managed identity*: `Endpoint={scheduler endpoint};Authentication=ManagedIdentity`

1. Ensure the required role-based access control (RBAC) permission is [granted to the identity](./develop-with-durable-task-scheduler.md#configure-identity-based-authentication-for-app-to-access-durable-task-scheduler) needing to access the specified task hub or scheduler. 
    -  When accessing the dashboard, ensure permission is [assigned to your own identity (email)](./durable-task-scheduler-dashboard.md#access-the-durable-task-scheduler-dashboard).

1. If user-assigned managed identity is used, ensure the [identity is assigned to your app](./durable-task-scheduler-identity.md#assign-managed-identity-to-your-app).

## Error deploying durable functions app to Azure 

If your deployment fails with an error such as `Encountered an error (ServiceUnavailable) from host runtime` from Visual Studio Code, first check your app to ensure the required [environment variables](./durable-task-scheduler-identity.md#add-environment-variables-to-app) are set correctly. Then redeploy your app. If you see an error loading functions, click the "Refresh" button. 

## Unknown error retrieving details of this task hub

If you get an `Unknown error retrieving details of this task hub` error on the durable task scheduler dashboard, the reason could be:

1. Your identity (email) doesn't have the required permission assigned for that task hub. Follow instructions to [grant the permission](./durable-task-scheduler-dashboard.md), then access the dashboard again. 

1. Your task hub was deleted. 

## Can't delete resource

Make sure you delete all task hubs in the durable task scheduler environment. If you haven't, you receive the following error message:

```json
{
  "error": {
    "code": "CannotDeleteResource",
    "message": "Cannot delete resource while nested resources exist. Some existing nested resource IDs include: 'Microsoft.DurableTask/schedulers/YOUR_SCHEDULER/taskhubs/YOUR_TASKHUB'. Please delete all nested resources before deleting this resource."
  }
}
```

## Can't determine project to build

If, after starting Azurite, you encounter the error: `“Can't determine Project to build. Expected 1 .csproj or .fsproj but found 2”`:
- Delete the **bin** and **obj** directories in your app.
- Try running `func start` again.

## Can't find native binaries for ARM

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

## Experiencing gRPC runtime issues

For Mx Mac (ARM64) users, you may run into gRPC runtime issues with durable functions. As a workaround:
1. Reference the `2.41.0` version of the `Contrib.Grpc.Core.M1` NuGet package.
1. Add a custom after-build target that ensures the correct ARM64 version of the gRPC libraries can be found.
 
   ```xml
   <Project>
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