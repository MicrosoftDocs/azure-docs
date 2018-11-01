---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 06/05/2018
ms.author: cephalin
ms.custom: "include file"
---

## Prepare your repository

To get automatic builds from the App Service Kudu build server, make sure that your repository root has the correct files in your project.

| Runtime | Root directory files |
|-|-|
| ASP.NET (Windows only) | _*.sln_, _*.csproj_, or _default.aspx_ |
| ASP.NET Core | _*.sln_ or _*.csproj_ |
| PHP | _index.php_ |
| Ruby (Linux only) | _Gemfile_ |
| Node.js | _server.js_, _app.js_, or _package.json_ with a start script |
| Python (Windows only) | _\*.py_, _requirements.txt_, or _runtime.txt_ |
| HTML | _default.htm_, _default.html_, _default.asp_, _index.htm_, _index.html_, or _iisstart.htm_ |
| WebJobs | _\<job_name>/run.\<extension>_ under _App\_Data/jobs/continuous_ (for continuous WebJobs) or _App\_Data/jobs/triggered_ (for triggered WebJobs). For more information, see [Kudu WebJobs documentation](https://github.com/projectkudu/kudu/wiki/WebJobs) |
| Functions | See [Continuous deployment for Azure Functions](../articles/azure-functions/functions-continuous-deployment.md#continuous-deployment-requirements). |

To customize your deployment, include a _.deployment_ file in the repository root. For more information, see [Customizing deployments](https://github.com/projectkudu/kudu/wiki/Customizing-deployments) and [Custom deployment script](https://github.com/projectkudu/kudu/wiki/Custom-Deployment-Script).

> [!NOTE]
> If you develop in Visual Studio, let [Visual Studio create a repository for you](/azure/devops/repos/git/creatingrepo?view=vsts&tabs=visual-studio). The project is immediately ready to be deployed using Git.
>
>

