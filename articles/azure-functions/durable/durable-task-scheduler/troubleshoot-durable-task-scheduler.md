---
title: Troubleshoot the Durable Task Scheduler dashboard (preview)
description: Learn how to troubleshoot error messages and issues you encounter while using the Durable Task Scheduler.
ms.topic: conceptual
ms.date: 01/27/2025
---

# Troubleshoot the Durable Task Scheduler dashboard (preview)

## Can't delete resource

Make sure you delete all task hubs in the Durable Task Scheduler environment. If you haven't, you receive the following error message:

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

For Mx Mac (ARM64) users, you may run into gRPC runtime issues with Durable Functions. As a workaround:
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