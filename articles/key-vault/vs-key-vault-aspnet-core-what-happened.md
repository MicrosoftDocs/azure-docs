---
title: Changes made to an ASP.NET Core project when you connec to Azure Key Vault | Microsoft Docs
description: Describes what happens to your ASP.NET Core project when you connect toKey Vault by using Visual Studio connected services.
services: key-vault
author: ghogen
manager: douge
tags: azure-resource-manager
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 04/15/2018
ms.author: ghogen
---
# What happened to my ASP.NET Core project (Visual Studio Key Vault connected service)?

> [!div class="op_single_selector"]
> - [Getting Started](vs-key-vault-aspnet-core-get-started.md)
> - [What Happened](vs-key-vault-aspnet-core-what-happened.md)

This article identifies the exact changes made to an ASP.NET project when adding the [Key Vault connected service using Visual Studio](vs-key-vault-add-connected-service.md).

For information on working with the connected service, see [Getting Started](vs-key-vault-aspnet-core-get-started.md).

## Added references

Affects the project file *.NET references and NuGet package references.

| Type | Reference |
| --- | --- |
| NuGet | Microsoft.AspNetCore.AzureKeyVault.HostingStartup |

## Added files

- ConnectedService.json added, which records some information about the Connected Service provider, version, and a link the documentation.

## Project file changes

- Added the Connected Services ItemGroup and ConnectedServices.json file.

## launchsettings.json changes

- Added the following environment variable entries to both the IIS Express profile and the profile that matches your web project name:

    ```json
      "environmentVariables": {
        "ASPNETCORE_HOSTINGSTARTUP__KEYVAULT__CONFIGURATIONENABLED": "true",
        "ASPNETCORE_HOSTINGSTARTUP__KEYVAULT__CONFIGURATIONVAULT": "<your keyvault URL>"
      }
    ```

## Changes on Azure

- Created a resource group (or used an existing one).
- Created a Key Vault in the specified resource group.

