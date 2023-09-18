---
title: Authentication types by deployment methods
description: Learn the available types of authentication with Azure App Service when deploying your application code.
ms.topic: article
ms.date: 07/31/2023
author: cephalin
ms.author: cephalin
---

# Authentication types by deployment methods in Azure App Service

Azure App Service lets you deploy your web application code and configuration by using multiple options. These deployment options may support one or more authentication mechanisms. This article provides details about various authentication mechanisms supported by different deployment methods. 

> [!NOTE]
> To disable basic authentication for your App Service app, see [Configure deployment credentials](deploy-configure-credentials.md). 

|Deployment method|Authentication  |Reference Documents |
|:----|:----|:----|
|Azure CLI |Azure AD authentication | In Azure CLI, version 2.48.1 or higher, the following commands have been modified to use Azure AD authentication if basic authentication is turned off for your web app or function app:<br/>- [az webapp up](/cli/azure/webapp#az-webapp-up)<br/>- [az webapp deploy](/cli/azure/webapp#az-webapp-deploy)<br/>- [az webapp deployment source config-zip](/cli/azure/webapp/deployment/source#az-webapp-deployment-source-config-zip)<br/>- [az webapp log deployment show](/cli/azure/webapp/log/deployment#az-webapp-log-deployment-show)<br/>- [az webapp log deployment list](/cli/azure/webapp/log/deployment#az-webapp-log-deployment-list)<br/>- [az webapp log download](/cli/azure/webapp/log#az-webapp-log-download)<br/>- [az webapp log tail](/cli/azure/webapp/log#az-webapp-log-tail)<br/>- [az webapp browse](/cli/azure/webapp#az-webapp-browse)<br/>- [az webapp create-remote-connection](/cli/azure/webapp#az-webapp-create-remote-connection)<br/>- [az webapp ssh](/cli/azure/webapp#az-webapp-ssh)<br/>- [az functionapp deploy](/cli/azure/functionapp#az-functionapp-deploy)<br/>- [az functionapp log deployment list](/cli/azure/functionapp/log/deployment#az-functionapp-log-deployment-list)<br/>- [az functionapp log deployment show](/cli/azure/functionapp/log/deployment#az-functionapp-log-deployment-show)<br/>- [az functionapp deployment source config-zip](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip)<br/>For more information, see [az appservice](/cli/azure/appservice) and [az webapp](/cli/azure/webapp). |
|Azure PowerShell |Azure AD authentication | In Azure PowerShell, version 9.7.1 or above, Azure AD authentication is available for App Service. For more information, see [PowerShell samples for Azure App Service](samples-powershell.md). |
|SCM/Kudu/OneDeploy REST endpoint |Basic authentication, Azure AD authentication |[Deploy files to App Service](deploy-zip.md) |
|Kudu UI |Basic authentication, Azure AD authentication |[Deploy files to App Service](deploy-zip.md)|
|FTP\FTPS |Basic authentication |[Deploy your app to Azure App Service using FTP/S](deploy-ftp.md) |
|Visual Studio |Basic authentication  |[Quickstart: Deploy an ASP.NET web app](quickstart-dotnetcore.md)<br/>[Develop and deploy WebJobs using Visual Studio](webjobs-dotnet-deploy-vs.md)<br/>[Troubleshoot an app in Azure App Service using Visual Studio](troubleshoot-dotnet-visual-studio.md)<br/>[GitHub Actions integration in Visual Studio](/visualstudio/azure/overview-github-actions)<br/>[Deploy your application to Azure using GitHub Actions workflows created by Visual Studio](/visualstudio/deployment/azure-deployment-using-github-actions) |
|Visual Studio Code|Azure AD authentication |[Quickstart: Deploy an ASP.NET web app](quickstart-dotnetcore.md)<br/> [Working with GitHub in VS Code](https://code.visualstudio.com/docs/sourcecontrol/github) |
|GitHub with GitHub Actions |Publish profile, service principal, OpenID Connect |[Deploy to App Service using GitHub Actions](deploy-github-actions.md) |
|GitHub with App Service build service as build engine|Publish profile |[Continuous deployment to Azure App Service](deploy-continuous-deployment.md) |
|GitHub with Azure Pipelines as build engine|Publish profile, Azure DevOps service connection |[Deploy to App Service using Azure Pipelines](deploy-azure-pipelines.md) |
|Azure Repos with App Service build service as build engine|Publish profile |[Continuous deployment to Azure App Service](deploy-continuous-deployment.md) |
|Azure Repos with Azure Pipelines as build engine |Publish profile, Azure DevOps service connection |[Deploy to App Service using GitHub Actions](deploy-github-actions.md) |
|Bitbucket |Publish profile |[Continuous deployment to Azure App Service](deploy-continuous-deployment.md) |
|Local Git |Publish profile |[Local Git deployment to Azure App Service](deploy-local-git.md) |
|External Git repository|Publish profile |[Setting up continuous deployment using manual steps](https://github.com/projectkudu/kudu/wiki/Continuous-deployment#setting-up-continuous-deployment-using-manual-steps) |
|Run directly from an uploaded ZIP file |Azure AD authentication |[Run your app in Azure App Service directly from a ZIP package](deploy-run-package.md) |
|Run directly from external URL |Storage account key, managed identity |[Run from external URL instead](deploy-run-package.md#run-from-external-url-instead) |
|Azure Web app plugin for Maven (Java) |Azure AD authentication |[Quickstart: Create a Java app on Azure App Service](quickstart-java.md)|
|Azure WebApp Plugin for Gradle (Java) |Azure AD authentication |[Configure a Java app for Azure App Service](configure-language-java.md)|
|Webhooks |Publish profile |[Web hooks](https://github.com/projectkudu/kudu/wiki/Web-hooks) |
|App Service migration assistant |Basic authentication |[Azure App Service migration tools](https://azure.microsoft.com/products/app-service/migration-tools/) |
|App Service migration assistant for PowerShell scripts |Basic authentication |[Azure App Service migration tools](https://azure.microsoft.com/products/app-service/migration-tools/) |
|Azure Migrate App Service discovery/assessment/migration |Azure AD authentication |[Tutorial: Assess ASP.NET web apps for migration to Azure App Service](../migrate/tutorial-assess-webapps.md)<br/>[Modernize ASP.NET web apps to Azure App Service code](../migrate/tutorial-modernize-asp-net-appservice-code.md) |
