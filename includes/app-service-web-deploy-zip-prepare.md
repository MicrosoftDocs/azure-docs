---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 01/14/2020
ms.author: cephalin
ms.custom: "include file"
---

## Create a project ZIP file

>[!NOTE]
> If you downloaded the files in a ZIP file, extract the files first. For example, if you downloaded a ZIP file from GitHub, you cannot deploy that file as-is. GitHub adds additional nested directories, which do not work with App Service. 
>

In a local terminal window, navigate to the root directory of your app project. 

This directory should contain the entry file to your web app, such as _index.html_, _index.php_, and _app.js_. It can also contain package management files like _project.json_, _composer.json_, _package.json_, _bower.json_, and _requirements.txt_.

Unless you want App Service to run deployment automation for you, run all the build tasks (for example, `npm`, `bower`, `gulp`, `composer`, and `pip`) and make sure that you have all the files you need to run the app. This step is required if you want to [run your package directly](../articles/app-service/deploy-run-package.md).

Create a ZIP archive of everything in your project. The following command uses the default tool in your terminal:

```
# Bash
zip -r <file-name>.zip .

# PowerShell
Compress-Archive -Path * -DestinationPath <file-name>.zip
``` 

