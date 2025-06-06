---
title: "Include file"
description: "Include file"
services: app-service
author: cephalin
ms.service: azure-app-service
ms.topic: "include"
ms.date: 01/22/2025
ms.author: cephalin
ms.custom: "include file"
---

## Create a project ZIP package

> [!IMPORTANT]
> When you create the ZIP package for deployment, don't include the root directory. Include only the files and directories in the root directory. If you download a GitHub repository as a ZIP file, you can't deploy that file as-is to App Service. GitHub adds nested directories at the top level, which doesn't work with App Service.
>

In a local terminal window, navigate to the root directory of your app project.

This directory should contain the entry file to your web app, such as `index.html`, `index.php`, and `app.js`. It can also contain package management files like `project.json`, `composer.json`, `package.json`, `bower.json`, and `requirements.txt`.

If you don't want App Service to run deployment automation for you, run all the build tasks. For example: `npm`, `bower`, `gulp`, `composer`, and `pip`. Make sure that you have all the files you need to run the app. This step is required if you want to [run your package directly](../articles/app-service/deploy-run-package.md).

Create a ZIP archive of everything in your project. For `dotnet` projects, add everything in the output directory of the `dotnet publish` command, excluding the output directory itself. For example, enter the following command in your terminal to create a ZIP package that includes the contents of the current directory:

```cmd
# Bash
zip -r <file-name>.zip .

# PowerShell
Compress-Archive -Path * -DestinationPath <file-name>.zip
```
