---
title: include file
description: include file
services: functions
author: ggailey777
manager: jeconnoc
ms.service: azure-functions
ms.topic: include
ms.date: 09/16/2018
ms.author: glenga
ms.custom: include file
---

## Create the local function app project

Run the following command from the command line to create a function app project in the `MyFunctionProj` folder of the current local directory. A GitHub repo is also created in `MyFunctionProj`.

```bash
func init MyFunctionProj
```

When prompted, use the arrow keys to select a worker runtime from the following language choices:

+ `dotnet`: creates a .NET class library project (.csproj).
+ `node`: creates a JavaScript project.

When the command executes, you see something like the following output:

```output
Writing .gitignore
Writing host.json
Writing local.settings.json
Initialized empty Git repository in C:/functions/MyFunctionProj/.git/
```

Use the following command to navigate to the new `MyFunctionProj` project folder.

```bash
cd MyFunctionProj
```
