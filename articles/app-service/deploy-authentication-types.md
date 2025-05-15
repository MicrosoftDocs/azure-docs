---
title: Authentication Types by Deployment Methods
description: Learn the available types of authentication with Azure App Service when you're deploying application code.
ms.topic: concept-article
ms.date: 03/28/2025
author: cephalin
ms.author: cephalin
#customer intent: As an app developer, I want to understand the authentication options available for different deployment methods in Azure App Service.
---

# Authentication types by deployment methods in Azure App Service

With Azure App Service, you have multiple options for deploying your web application code and configuration. These deployment methods support one or more authentication mechanisms. This article provides details about the deployment methods and authentication mechanisms.

> [!NOTE]
> To disable basic authentication for your App Service app, see [Disable basic authentication in App Service deployments](configure-basic-auth-disable.md).

| Deployment method | Authentication | Reference documentation |
|:----|:----|:----|
| Azure CLI | Microsoft Entra ID | In Azure CLI version 2.48.1 or later, the following commands use Microsoft Entra if basic authentication is turned off for your web app or function app:<br/><br/>- [az webapp up](/cli/azure/webapp#az-webapp-up)<br/>- [az webapp deploy](/cli/azure/webapp#az-webapp-deploy)<br/>- [az webapp log deployment show](/cli/azure/webapp/log/deployment#az-webapp-log-deployment-show)<br/>- [az webapp log deployment list](/cli/azure/webapp/log/deployment#az-webapp-log-deployment-list)<br/>- [az webapp log download](/cli/azure/webapp/log#az-webapp-log-download)<br/>- [az webapp log tail](/cli/azure/webapp/log#az-webapp-log-tail)<br/>- [az webapp browse](/cli/azure/webapp#az-webapp-browse)<br/>- [az webapp create-remote-connection](/cli/azure/webapp#az-webapp-create-remote-connection)<br/>- [az webapp ssh](/cli/azure/webapp#az-webapp-ssh)<br/>- [az functionapp deploy](/cli/azure/functionapp#az-functionapp-deploy)<br/>- [az functionapp log deployment list](/cli/azure/functionapp/log/deployment#az-functionapp-log-deployment-list)<br/>- [az functionapp log deployment show](/cli/azure/functionapp/log/deployment#az-functionapp-log-deployment-show)<br/>- [az functionapp deployment source config-zip](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip)<br/><br/>For more information, see [az appservice](/cli/azure/appservice) and [az webapp](/cli/azure/webapp). |
| Azure PowerShell | Microsoft Entra | In Azure PowerShell version 9.7.1 or later, Microsoft Entra is available for App Service. For more information, see [PowerShell samples for Azure App Service](samples-powershell.md). |
| SCM/Kudu/OneDeploy REST endpoint | Basic authentication<br/><br/>Microsoft Entra | [Deploy files to App Service](deploy-zip.md) |
| Kudu UI | Basic authentication<br/><br/>Microsoft Entra | [Deploy files to App Service](deploy-zip.md) |
| FTP/FTPS | Basic authentication | [Deploy your app to Azure App Service by using FTP/S](deploy-ftp.md) |
| Visual Studio | Basic authentication<br/><br/>Microsoft Entra  | [Quickstart: Deploy an ASP.NET web app](quickstart-dotnetcore.md)<br/><br/>[Develop and deploy WebJobs by using Visual Studio](webjobs-dotnet-deploy-vs.md)<br/><br/>[Troubleshoot an app in Azure App Service by using Visual Studio](troubleshoot-dotnet-visual-studio.md)<br/><br/>[GitHub Actions integration in Visual Studio](/visualstudio/azure/overview-github-actions)<br/><br/>[Deploy your application to Azure by using GitHub Actions workflows created by Visual Studio](/visualstudio/deployment/azure-deployment-using-github-actions) |
| Visual Studio Code | Microsoft Entra | [Quickstart: Deploy an ASP.NET web app](quickstart-dotnetcore.md)<br/><br/>[Working with GitHub in VS Code](https://code.visualstudio.com/docs/sourcecontrol/github) |
| GitHub with GitHub Actions | Publish profile (basic authentication)<br/><br/>Service principal (Microsoft Entra)<br/><br/>OpenID Connect (Microsoft Entra) | [Deploy to App Service by using GitHub Actions](deploy-github-actions.md) |
| GitHub with the App Service build service as a build engine | Basic authentication | [Continuous deployment to Azure App Service](deploy-continuous-deployment.md) |
| GitHub with Azure Pipelines as a build engine | Publish profile (basic authentication)<br/><br/>Azure DevOps service connection | [Deploy to App Service by using Azure Pipelines](deploy-azure-pipelines.md) |
| Azure Repos with the App Service build service as a build engine | Basic authentication | [Continuous deployment to Azure App Service](deploy-continuous-deployment.md) |
| Azure Repos with Azure Pipelines as a build engine | Publish profile (basic authentication)<br/><br/>Azure DevOps service connection | [Deploy to App Service by using GitHub Actions](deploy-github-actions.md) |
| Bitbucket | Basic authentication | [Continuous deployment to Azure App Service](deploy-continuous-deployment.md) |
| Local Git | Basic authentication | [Local Git deployment to Azure App Service](deploy-local-git.md) |
| External Git repository | Basic authentication | [Setting up continuous deployment by using manual steps](https://github.com/projectkudu/kudu/wiki/Continuous-deployment#setting-up-continuous-deployment-using-manual-steps) |
| Run directly from an uploaded ZIP file | Microsoft Entra | [Run your app in Azure App Service directly from a ZIP package](deploy-run-package.md) |
| Run directly from an external URL | Not applicable (outbound connection) |[Run from external URL instead](deploy-run-package.md#run-from-external-url-instead) |
| Maven plug-in for Azure App Service (Java) | Microsoft Entra | [Quickstart: Create a Java app on Azure App Service](quickstart-java.md) |
| Gradle plug-in for Azure App Service (Java) | Microsoft Entra | [Configure a Java app for Azure App Service](configure-language-java-deploy-run.md)|
| Web hooks | Basic authentication | [Web hooks](https://github.com/projectkudu/kudu/wiki/Web-hooks) |
| App Service migration assistant | Basic authentication | [Azure App Service migration tools](https://azure.microsoft.com/products/app-service/migration-tools/) |
| App Service migration assistant for PowerShell scripts | Basic authentication | [Azure App Service migration tools](https://azure.microsoft.com/products/app-service/migration-tools/) |
| Azure Migrate discovery/assessment/migration for App Service | Microsoft Entra | [Tutorial: Assess web apps for migration to Azure App Service](../migrate/tutorial-assess-webapps.md)<br/><br/>[Modernize ASP.NET web apps to Azure App Service code](../migrate/tutorial-modernize-asp-net-appservice-code.md) |
