---
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 06/12/2019
ms.author: cephalin
ms.custom: "include file"
---

## Prepare your repository

To get automated builds from Azure App Service build server, make sure that your repository root has the correct files in your project.

| Runtime | Root directory files |
|-|-|
| ASP.NET (Windows only) | `*.sln`, `*.csproj`, or `default.aspx` |
| ASP.NET Core | `*.sln` or `*.csproj` |
| PHP | `index.php` |
| Ruby (Linux only) | `Gemfile` |
| Node.js | `server.js`, `app.js`, or `package.json` with a start script |
| Python | `*.py`, `requirements.txt`, or `runtime.txt` |
| HTML | `default.htm`, `default.html`, `default.asp`, `index.htm`, `index.html`, or `iisstart.htm` |
| WebJobs | `<job_name>/run.<extension>` under `App_Data/jobs/continuous` for continuous WebJobs, or `App_Data/jobs/triggered` for triggered WebJobs. For more information, see [Kudu WebJobs documentation](https://github.com/projectkudu/kudu/wiki/WebJobs). |
| Functions | See [Continuous deployment for Azure Functions](../articles/azure-functions/functions-continuous-deployment.md#requirements). |

To customize your deployment, include a *.deployment* file in the repository root. For more information, see [Customize deployments](https://github.com/projectkudu/kudu/wiki/Customizing-deployments) and [Custom deployment script](https://github.com/projectkudu/kudu/wiki/Custom-Deployment-Script).

> [!NOTE]
> If you use Visual Studio, let [Visual Studio create a repository for you](/azure/devops/repos/git/creatingrepo?tabs=visual-studio). Your project will immediately be ready for deployment via Git.
>

