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

## Create a function

The following command creates an HTTP-triggered function named `MyHtpTrigger`.

```bash
func new --name MyHttpTrigger --template "HttpTrigger"
```

When the command executes, you see something like the following output, which in this case is for a JavaScript function:

```output
Writing C:\functions\MyFunctionProj\MyHttpTrigger\index.js
Writing C:\functions\MyFunctionProj\MyHttpTrigger\sample.dat
Writing C:\functions\MyFunctionProj\MyHttpTrigger\function.json
```