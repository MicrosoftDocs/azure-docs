---
title: Azure Migrate application and code assessment for .NET
description: How to assess and replatform any type of .NET applications with the Azure Migrate application and code assessment tool to evaluate their readiness to migrate to Azure.
author: brborges
ms.author: brborges
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 11/15/2023
keywords: dotnet, azure, appCAT, assessment, replatform
---

# Azure Migrate application and code assessment for .NET

Azure Migrate application and code assessment for .NET allows you to assess .NET source code, configurations and binaries of your application to identify migration opportunities to Azure. It helps you identify any issues your application might have when it is ported to Azure and improve the performance, scalability and security by suggesting modern, cloud-native solutions.

:::image type="content" source="media/dotnet/visual-studio.png" alt-text="Screenshot of the Azure Migrate application and code assessment for .NET in Visual Studio." lightbox="media/dotnet/visual-studio.png":::

It discovers application technology usage through static code analysis, supports effort estimation, and accelerates code re-platforming, helping you move .NET applications to Azure.

You can use Azure Migrate application and code assessment for .NET in Visual Studio or in the .NET CLI.

## Install Visual Studio extension

### Prerequisites

- Windows operating system
- Visual Studio 2022 version 17.1 or later

### Installation steps

Use the following steps to install it from inside Visual Studio. Alternatively, you can download and install the extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.appcat).

  1. With Visual Studio opened, press the **Extensions > Manage Extensions** menu item, which opens the **Manage Extensions** window.
  2. In the **Manage Extensions** window, enter **"Azure Migrate"** into the search input box.
  3. Select the **Azure Migrate application and code assessment** item, and then select **Download**.
  4. Once the extension has been downloaded, close Visual Studio. This starts the installation of the extension.
  5. In the VSIX Installer dialog select **Modify** and follow the directions to install the extension.

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

Once you installed the Visual Studio extension, you are ready to analyze your application in Visual Studio. You can do so by right click on any of the projects or a solution in the Solution Explorer window and select **Re-platform to Azure**.

:::image type="content" source="media/dotnet/replatform.png" alt-text="Screenshot of the Re-platform to Azure menu item in Visual Studio." lightbox="media/dotnet/replatform.png":::

Read this [step by step guide](https://aka.ms/appcat/dotnet/vs) for detailed instructions on the Visual Studio experience.

## Analyze applications with .NET CLI

Once you installed the CLI tool, you are ready to analyze your application in CLI. In CLI run the command:

```dotnetcli
appcat analyze <APPLICATION_PATH>
```

you can specify a path and a format (.html, .json, or .csv) for the report file that the tool will produce:

```dotnetcli
appcat analyze <APPLICATION_PATH> --report MyAppReport --serializer html
```

Read this [step by step guide](https://aka.ms/appcat/dotnet/cli) for detailed instructions on the CLI experience.

## Interpret reports

Read this [Interpret the results guide](https://aka.ms/appcat/dotnet/report) for detailed description of the different parts of the reports and how to understand and interpret the data.

### Supported languages

Application and code assessment for .NET can analyze projects written in the following languages:

- C#
- Visual Basic

### Supported project types

It analyzes your code in the following project types:

- ASP.NET
- Class libraries

### Supported Azure targets

Currently application identifies potential issues for migration to Azure App Service, AKS, and Azure Container Apps. In the future the tool might have an ability to set the target explicitly and filter the exact issues and recommendations for each target separately.
