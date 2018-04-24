---
title: Changes made to an ASP.NET project when you connec to Azure Key Vault | Microsoft Docs
description: Describes what happens to your ASP.NET project when you connect toKey Vault by using Visual Studio connected services.
services: key-vault
author: ghogen
manager: douge
tags: azure-resource-manager
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.topic: conceptual
ms.date: 04/15/2018
ms.author: ghogen
---
# What happened to my ASP.NET project (Visual Studio Key Vault connected service)?

> [!div class="op_single_selector"]
>  - [Getting Started](vs-key-vault-aspnet-get-started.md)
>  - [What Happened](vs-key-vault-aspnet-what-happened.md)

This article identifies the exact changes made to am ASP.NET project when adding the [Key Vault connected service using Visual Studio](vs-key-vault-add-connected-service.md).

For information on working with the connected service, see [Getting Started](vs-key-vault-aspnet-get-started.md).

## Added references

Affects the project file *.NET references and `packages.config` (NuGet references).

| Type | Reference |
| --- | --- |
| .NET; NuGet | Microsoft.Azure.KeyVault |
| .NET; NuGet | Microsoft.Azure.KeyVault.WebKey |
| .NET; NuGet | Microsoft.Rest.ClientRuntime |
| .NET; NuGet | Microsoft.Rest.ClientRuntime.Azure |

## Added files

- ConnectedService.json added, which records some information about the Connected Service provider, version, and a link to the documentation.

## Project file changes

- Added the Connected Services ItemGroup and ConnectedServices.json file.
- References to the .NET assemblies described in the [Added references](#added-references) section.

## web.config or app.config changes

- Added the following configuration entries:

    ```xml
    <appSettings>
       <add key="vaultName" value="<your Key Vault name>" />
       <add key="vaultUri" value="<the URI to your Key Vault in Azure>" />
    </appSettings>
    ```

## Changes on Azure

- Created a resource group (or used an existing one).
- Created a Key Vault in the specified resource group.

[Learn more about Azure Key Vault](index.md).
