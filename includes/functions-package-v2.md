---
title: include file
description: include file
services: functions
author: craigshoemaker
manager: gwallace
ms.service: azure-functions
ms.topic: include
ms.date: 01/28/2020
ms.author: cshoe
ms.custom: include file
---

Add support in you preferred development environment using the following methods.

| Development environment  | Application type      | To add support |
|--------------------------|-----------------------|----------------|
| Visual Studio            | C# class library      | [Install the NuGet package](../articles/azure-functions/functions-bindings-register.md#vs) |
| Visual Studio Code       | Based on [core tools](../articles/azure-functions/functions-run-local.md) | [Register the extension bundle](../articles/azure-functions/functions-bindings-register.md#extension-bundles)<br><br>Installing the [Azure Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) is recommended. |
| Any other editor/IDE     | Based on [core tools](../articles/azure-functions/functions-run-local.md) | [Register the extension bundle](../articles/azure-functions/functions-bindings-register.md#extension-bundles) |
| Azure Portal             | Online only in portal | Installs when adding a binding<br /><br /> See [Update your extensions](../articles/azure-functions/install-update-binding-extensions-manual.md) to update existing binding extensions without having to republish your function app. |
