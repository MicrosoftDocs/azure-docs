---
title: Azure Migrate application and code assessment for .NET
description: How to assess and replatform any type of .NET applications with the Azure Migrate application and code assessment tool to evaluate their readiness to migrate to Azure.
author: brborges
ms.author: brborges
ms.service: azure-migrate
ms.custom: devx-track-dotnet
ms.topic: conceptual
ms.date: 11/15/2023
---

# Azure Migrate application and code assessment for .NET

Azure Migrate application and code assessment for .NET allows you to assess .NET source code, configurations, and binaries of your application to identify migration opportunities to Azure. It helps you identify any issues your application might have when ported to Azure and improve the performance, scalability, and security by suggesting modern, cloud-native solutions.

:::image type="content" source="media/dotnet/visual-studio.png" alt-text="Screenshot of the Azure Migrate application and code assessment for .NET in Visual Studio." lightbox="media/dotnet/visual-studio.png":::

It discovers application technology usage through static code analysis, supports effort estimation, and accelerates code replatforming, helping you move .NET applications to Azure.

You can use Azure Migrate application and code assessment for .NET in Visual Studio or in the .NET CLI.

## Install the Visual Studio extension

### Prerequisites

- Windows operating system
- Visual Studio 2022 version 17.1 or later

### Installation steps

Use the following steps to install it from inside Visual Studio. Alternatively, you can download and install the extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.appcat).

1. With Visual Studio opened, select the **Extensions > Manage Extensions** menu item, which opens the **Manage Extensions** window.

1. In the **Manage Extensions** window, enter *Azure Migrate* into the search input box.

1. Select **Azure Migrate application and code assessment**, and then select **Download**.

1. After the extension downloads, close Visual Studio to start the installation of the extension.

1. In the VSIX Installer dialog, select **Modify** and follow the directions to install the extension.

## Install the CLI tool

### Prerequisites

- .NET SDK

### Installation steps

To install the tool, run the following command in a CLI:

```dotnetcli
dotnet tool install -g dotnet-appcat
```

To update the tool, run the following command in a CLI:

```dotnetcli
dotnet tool update -g dotnet-appcat
```

> [!IMPORTANT]
> Installing this tool may fail if you've configured additional NuGet feed sources. Use the `--ignore-failed-sources` parameter to treat those failures as warnings instead of errors.
>
> ```dotnetcli
> dotnet tool install -g --ignore-failed-sources dotnet-appcat
> ```

## Analyze applications with Visual Studio

After you install the Visual Studio extension, you're ready to analyze your application in Visual Studio. To analyze an application, right click any of the projects or a solution in the Solution Explorer window and select **Re-platform to Azure**.

:::image type="content" source="media/dotnet/replatform.png" alt-text="Screenshot of the Replatform to Azure menu item in Visual Studio." lightbox="media/dotnet/replatform.png":::

For more information, see [Analyze applications with Visual Studio](/dotnet/azure/migration/appcat/visual-studio).

## Analyze applications with .NET CLI

After you install the CLI tool, you're ready to analyze your application in the CLI. In the CLI, run the following command:

```dotnetcli
appcat analyze <application-path>
```

You can specify a path and a format (*.html*, *.json*, or *.csv*) for the report file that the tool produces, as shown in the following example:

```dotnetcli
appcat analyze <application-path> --report MyAppReport --serializer html
```

For more information, see [Analyze applications with the .NET CLI](/dotnet/azure/migration/appcat/dotnet-cli).

## Interpret reports

For a detailed description of the different parts of the reports and how to understand and interpret the data, see [Interpret the analysis results](/dotnet/azure/migration/appcat/interpret-results).

### Supported languages

Application and code assessment for .NET can analyze projects written in the following languages:

- C#
- Visual Basic

### Supported project types

It analyzes your code in the following project types:

- ASP.NET
- Class libraries

### Supported Azure targets

Currently, the application identifies potential issues for migration to Azure App Service, Azure Kubernetes Service (AKS), and Azure Container Apps.

## Next steps

- [CLI usage guide](https://azure.github.io/appcat-docs/cli/)
- [Rules development guide](https://azure.github.io/appcat-docs/rules-development-guide/)
