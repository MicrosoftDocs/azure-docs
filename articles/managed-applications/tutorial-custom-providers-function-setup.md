---
title: Set up Azure Functions for Azure Custom Providers
description: This tutorial will go over how to create an Azure function app and set it up to work with Azure Custom Providers
author: jjbfour
ms.service: managed-applications
ms.topic: tutorial
ms.date: 06/19/2019
ms.author: jobreen
---

# Set up Azure Functions for Azure Custom Providers

A custom provider is a contract between Azure and an endpoint. With custom providers, you can change workflows in Azure. This tutorial  shows how to set up an Azure function app to work as a custom-provider endpoint.

This tutorial contains the following steps:

1. Create the Azure function app
1. Install Azure Table bindings
1. Update RESTful HTTP methods
1. Modify the .csproj file

This tutorial builds on the tutorial [Creating your first Azure function app through the Azure portal](../azure-functions/functions-create-first-azure-function.md).

## Create the Azure function app

> [!NOTE]
> In this tutorial, you create a simple service endpoint that uses Azure Functions. However, a custom provider can use any publicly accessible endpoint. Azure Logic Apps, Azure API Management, and Web Apps feature of Azure App Service are some great alternatives.

To start this tutorial, you should first follow the tutorial [creating your first Azure Function in the Azure portal](../azure-functions/functions-create-first-azure-function.md).

This tutorial creates a .NET core webhook function that can be modified in the Azure portal.

## Install Azure Table bindings

To install the Azure Table storage bindings:

1. Go to the **Integrate** tab for the HttpTrigger.
1. Select **+ New Input**.
1. Select **Azure Table Storage**.
1. Install Microsoft.Azure.WebJobs.Extensions.Storage if it is not already installed.
1. Change **Table parameter name** to "tableStorage" and **Table name** to "myCustomResources".
1. Save the updated input parameter.

![Custom provider overview showing table bindings](./media/create-custom-providers/azure-functions-table-bindings.png)

## Update RESTful HTTP methods

To set up the Azure Function to include the custom provider RESTful request methods:

1. Navigate to the `Integrate` tab for the HttpTrigger.
1. In **Selected HTTP methods**, select **GET**, **POST**, **DELETE**, and **PUT**.

![Custom provider overview showing HTTP methods](./media/create-custom-providers/azure-functions-http-methods.png)

##  Modify the .csproj file

> [!NOTE]
> If the .csproj file is missing from the directory, you can add it manually. Or it will appear once the `Microsoft.Azure.WebJobs.Extensions.Storage` extension is installed on the function app.

Next, update the .csproj file to include helpful NuGet libraries. These libraries make it easier to parse incoming requests from custom providers. Follow the steps to [add extensions from the portal](../azure-functions/install-update-binding-extensions-manual.md) and update the .csproj file to include the following package references:

```xml
<PackageReference Include="Microsoft.Azure.WebJobs.Extensions.Storage" Version="3.0.4" />
<PackageReference Include="Microsoft.Azure.Management.ResourceManager.Fluent" Version="1.22.2" />
<PackageReference Include="Microsoft.Azure.WebJobs.Script.ExtensionsMetadataGenerator" Version="1.1.*" />
```

The following XML file is an example .csproj file:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <WarningsAsErrors />
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.Storage" Version="3.0.4" />
    <PackageReference Include="Microsoft.Azure.Management.ResourceManager.Fluent" Version="1.22.2" />
    <PackageReference Include="Microsoft.Azure.WebJobs.Script.ExtensionsMetadataGenerator" Version="1.1.*" />
  </ItemGroup>
</Project>
```

## Next steps

In this tutorial, you set up an Azure function app to work as an Azure Custom Provider endpoint.

To learn how to author a RESTful custom provider endpoint, see [Tutorial: Authoring a RESTful custom provider endpoint](./tutorial-custom-providers-function-authoring.md).
