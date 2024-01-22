---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 08/31/2023
ms.author: cephalin
ms.custom: "include file"
---

## Create a project ZIP package

>[IMPORTANT]
> When creating the ZIP package for deployment, don't include the root directory, but only the files and directories in it. If you download a GitHub repository as a ZIP file, you cannot deploy that file as-is to App Service. GitHub adds additional nested directories at the top level, which do not work with App Service.
>

In a local terminal window, navigate to the root directory of your app project. 

This directory should contain the entry file to your web app, such as _index.html_, _index.php_, and _app.js_. It can also contain package management files like _project.json_, _composer.json_, _package.json_, _bower.json_, and _requirements.txt_.

Unless you want App Service to run deployment automation for you, run all the build tasks (for example, `npm`, `bower`, `gulp`, `composer`, and `pip`) and make sure that you have all the files you need to run the app. This step is required if you want to [run your package directly](../articles/app-service/deploy-run-package.md).

Create a ZIP archive of everything in your project. For `dotnet` projects, this is everything in the output directory of the `dotnet publish` command (excluding the output directory itself). For example, the following command in your terminal to create a ZIP package of the contents of the current directory:

```
# Bash
zip -r <file-name>.zip .

# PowerShell
Compress-Archive -Path * -DestinationPath <file-name>.zip
``` 

