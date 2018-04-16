---
title: Changes made to an ASP.NET project when you connec to Azure Key Vault | Microsoft Docs
description: Describes what happens to your ASP.NET project when you connect toKey Vault by using Visual Studio connected services.
services: key-vault
author: ghogen
manager: douge
tags: azure-resource-manager
ms.service: key-vault
ms.workload: identity
ms.topic: conceptual
ms.date: 04/15/2018
ms.author: ghogen
---
# What happened to my ASP.NET project (Visual Studio Key Vault connected service)?

> [!div class="op_single_selector"]
> - [Getting Started](vs-active-directory-dotnet-getting-started.md)
> - [What Happened](vs-active-directory-dotnet-what-happened.md)

This article identifies the exact changes made to am ASP.NE project when adding the [Key Vault connected service using Visual Studio](vs-key-vault-add-connected-service.md).

For information on working with the connected service, see [Getting Started](vs-key-vault-dotnet-getting-started.md).

## Added references

Affects the project file *.NET references and `packages.config` (NuGet references).

| Type | Reference |
| --- | --- |
| .NET; NuGet | Microsoft.Azure.KeyVault |

## Project file changes

- Set the property `x` to y.

## web.config or app.config changes

- Added the following configuration entries:

    ```xml
    <appSettings>
       <add key="vaultName" value="<your Key Vault name>" />
       <add key="vaultUri" value="<the URI to your Key Vault in Azure>" />
    </appSettings>
    ```

## Changes on Azure

- Created a resource group (or used an existing one)
- Created a Key Vault in the specified resource group.

[Learn more about Azure Key Vault](index.md).

## Next steps

- [Use Azure Key Vault from a Web Application](/azure/key-vault/key-vault-use-from-web-application)