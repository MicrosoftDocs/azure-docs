---
title: Set up Azure Functions
description: This tutorial describes how to create a function app in Azure Functions that works with Azure Custom Resource Providers.
ms.topic: tutorial
ms.custom: devx-track-arm-template
ms.date: 09/20/2022
ms.author: jobreen
author: jjbfour
---

# Set up Azure Functions for custom resource providers

A custom resource provider is a contract between Azure and an endpoint. With custom resource providers, you can change workflows in Azure. This tutorial shows how to set up a function app in Azure Functions to work as a custom resource provider endpoint.

## Create the function app

> [!NOTE]
> In this tutorial, you create a simple service endpoint that uses a function app in Azure Functions. However, a custom resource provider can use any publicly accessible endpoint. Alternatives include Azure Logic Apps, Azure API Management, and the Web Apps feature of Azure App Service.

To start this tutorial, you should first follow the tutorial [Create your first function app in the Azure portal](../../azure-functions/functions-get-started.md). That tutorial creates a .NET core webhook function that can be modified in the Azure portal. It's also the foundation for the current tutorial.

## Install Azure Table storage bindings

To install the Azure Table storage bindings:

1. Go to the **Integrate** tab for the `HttpTrigger`.
1. Select **+ New Input**.
1. Select **Azure Table Storage**.
1. Install the `Microsoft.Azure.WebJobs.Extensions.Storage` extension if it isn't already installed.
1. In the **Table parameter name** box, enter *tableStorage*.
1. In the **Table name** box, enter *myCustomResources*.
1. Select **Save** to save the updated input parameter.

:::image type="content" source="./media/tutorial-custom-providers-function-setup/azure-functions-table-bindings.png" alt-text="Screenshot of the Azure Functions Integrate tab displaying Azure Table Storage bindings configuration.":::

## Update RESTful HTTP methods

To set up the Azure function to include the custom resource provider RESTful request methods:

1. Go to the **Integrate** tab for the `HttpTrigger`.
1. Under **Selected HTTP methods**, select **GET**, **POST**, **DELETE**, and **PUT**.

:::image type="content" source="./media/tutorial-custom-providers-function-setup/azure-functions-http-methods.png" alt-text="Screenshot of the Azure Functions Integrate tab displaying the selection of RESTful HTTP methods.":::

## Add Azure Resource Manager NuGet packages

> [!NOTE]
> If your C# project file is missing from the project directory, you can add it manually, or it will appear after the `Microsoft.Azure.WebJobs.Extensions.Storage` extension is installed on the function app.

Next, update the C# project file to include helpful NuGet libraries. These libraries make it easier to parse incoming requests from custom resource providers. Follow the steps to [add extensions from the portal](../../azure-functions/functions-bindings-register.md) and update the C# project file to include the following package references:

```xml
<PackageReference Include="Microsoft.Azure.WebJobs.Extensions.Storage" Version="3.0.4" />
<PackageReference Include="Microsoft.Azure.Management.ResourceManager.Fluent" Version="1.22.2" />
<PackageReference Include="Microsoft.Azure.WebJobs.Script.ExtensionsMetadataGenerator" Version="1.1.*" />
```

The following XML element is an example C# project file:

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

In this tutorial, you set up a function app in Azure Functions to work as an Azure Custom Resource Provider endpoint.

To learn how to author a RESTful custom resource provider endpoint, see [Author a RESTful endpoint for custom resource providers](./tutorial-custom-providers-function-authoring.md).
