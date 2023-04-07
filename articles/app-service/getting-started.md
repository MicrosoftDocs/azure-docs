---
title: Getting started with Azure App Service
description: Take the first steps toward working with Azure App Service.
ms.author: msangapu
author: msangapu-msft
ms.topic: overview
ms.date: 4/10/2023
zone_pivot_groups: app-service-getting-started-stacks
---

# Getting started with Azure App Service

## Introduction
::: zone pivot="stack-net"
[Azure App Service](./overview.md) is a fully managed platform as a service (PaaS) for hosting web applications. Use the following resources to get started with .NET.

| Action | Resources |
| --- | --- |
| **Create your first .NET app** | Using one of the following tools:<br><br><li>[Visual Studio](./quickstart-dotnetcore.md?tabs=net60&pivots=development-environment-vs)<li>[Visual Studio Code](./quickstart-dotnetcore.md?tabs=net60&pivots=development-environment-vscode)<li>[Command line](./quickstart-dotnetcore.md?tabs=net60&pivots=development-environment-cli)<li>[Azure PowerShell](./quickstart-dotnetcore.md?tabs=net60&pivots=development-environment-ps)<li>[Azure Portal](./quickstart-dotnetcore.md?tabs=net60&pivots=development-environment-azure-portal) |
| **Deploy your app** | <li>[Configure ASP.NET](./configure-language-dotnet-framework.md)<li>[Configure ASP.NET core](./configure-language-dotnetcore.md?pivots=platform-linux)<li>[GitHub actions](./deploy-github-actions.md) |
| **Monitor your app**| <li>[Log stream](./troubleshoot-diagnostic-logs.md#stream-logs)<li>[Diagnose and solve tool](./overview-diagnostics.md)|
| **Add domains & certificates** |<li>[Map a custom domain](./app-service-web-tutorial-custom-domain.md?tabs=root%2Cazurecli)<li>[Add SSL certificate](./configure-ssl-certificate.md)|
| **Connect to a database** | <li>[.NET with Azure SQL Database](./app-service-web-tutorial-dotnet-sqldatabase.md)<li>[.NET Core with Azure SQL DB](./tutorial-dotnetcore-sqldb-app.md)|
| **Custom containers** |<li>[Linux - Visual Studio Code](./quickstart-custom-container.md?tabs=dotnet&pivots=container-linux-vscode)<li>[Windows - Visual Studio](./quickstart-custom-container.md?tabs=dotnet&pivots=container-windows-vs)|
| **Review best practices** | <li>[Scale your app]()<li>[Deployment](./deploy-best-practices.md)<li>[Security](/security/benchmark/azure/baselines/app-service-security-baseline?toc=/azure/app-service/toc.json)|
::: zone-end
::: zone pivot="stack-python"
[Azure App Service](./overview.md) is a fully managed platform as a service (PaaS) for hosting web applications. Use the following resources to get started with Python.

| Action | Resources |
| --- | --- |
| **Create your first Python app** | Using one of the following tools:<br><br><li>[Flask - CLI](./quickstart-python.md?tabs=flask%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli)<li>[Flask - Visual Studio Code](./quickstart-python.md?tabs=flask%2Cwindows%2Cvscode-aztools%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli)<li>[Django - CLI](./quickstart-python.md?tabs=django%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli)<li>[Django - Visual Studio Code](./quickstart-python.md?tabs=django%2Cwindows%2Cvscode-aztools%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli)<li>[Django - Azure portal](./quickstart-python.md?tabs=django%2Cwindows%2Cazure-portal%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli) |
| **Deploy your app** | <li>[Configure Python](configure-language-python.md)<li>[GitHub actions](./deploy-github-actions.md) |
| **Monitor your app**| <li>[Log stream](./troubleshoot-diagnostic-logs.md#stream-logs)<li>[Diagnose and solve tool](./overview-diagnostics.md)|
| **Add domains & certificates** |<li>[Map a custom domain](./app-service-web-tutorial-custom-domain.md?tabs=root%2Cazurecli)<li>[Add SSL certificate](./configure-ssl-certificate.md)|
| **Connect to a database** | <li>[Postgres - CLI](./tutorial-python-postgresql-app?tabs=flask%2Cwindows&pivots=deploy-azd)<li>[Postgres - Azure portal](./tutorial-python-postgresql-app.md?tabs=flask%2Cwindows&pivots=deploy-portal)|
| **Custom containers** |<li>[Linux - Visual Studio Code](./quickstart-custom-container.md?tabs=python&pivots=container-linux-vscode)|
| **Review best practices** | <li>[Scale your app]()<li>[Deployment](./deploy-best-practices.md)<li>[Security](/security/benchmark/azure/baselines/app-service-security-baseline?toc=/azure/app-service/toc.json)|
::: zone-end
::: zone pivot="stack-nodejs"
[Azure App Service](./overview.md) is a fully managed platform as a service (PaaS) for hosting web applications. Use the following resources to get started with Node.js.

| Action | Resources |
| --- | --- |
| **Create your first Node app** | Using one of the following tools:<br><br><li>[Visual Studio Code](./quickstart-nodejs.md?tabs=linux&pivots=development-environment-vscode)<li>[CLI](./quickstart-nodejs.md?tabs=linux&pivots=development-environment-cli)<li>[Azure portal](./quickstart-nodejs.md?tabs=linux&pivots=development-environment-azure-portal) |
| **Deploy your app** | <li>[Configure Node](./configure-language-nodejs.md?pivots=platform-linux)<li>[GitHub actions](./deploy-github-actions.md) |
| **Monitor your app**| <li>[Log stream](./troubleshoot-diagnostic-logs.md#stream-logs)<li>[Diagnose and solve tool](./overview-diagnostics.md)|
| **Add domains & certificates** |<li>[Map a custom domain](./app-service-web-tutorial-custom-domain.md?tabs=root%2Cazurecli)<li>[Add SSL certificate](./configure-ssl-certificate.md)|
| **Connect to a database** | <li>[MongoDB](./tutorial-nodejs-mongodb-app.md)|
| **Custom containers** |<li>[Linux - Visual Studio Code](./quickstart-custom-container.md?tabs=node&pivots=container-linux-vscode)|
| **Review best practices** | <li>[Scale your app]()<li>[Deployment](./deploy-best-practices.md)<li>[Security](/security/benchmark/azure/baselines/app-service-security-baseline?toc=/azure/app-service/toc.json)|
::: zone-end
::: zone pivot="stack-java"
[Azure App Service](./overview.md) is a fully managed platform as a service (PaaS) for hosting web applications. Use the following resources to get started with Java.

| Action | Resources |
| --- | --- |
| **Create your first Java app** | Using one of the following tools:<br><br><li>[Linux - Maven](./quickstart-java.md?tabs=javase&pivots=platform-linux-development-environment-maven)<li>[Linux - Azure portal](./quickstart-java.md?tabs=javase&pivots=platform-linux-development-environment-azure-portal)<li>[Windows - Maven](./quickstart-java.md?tabs=javase&pivots=platform-windows-development-environment-maven)<li>[Windows - Azure portal](./quickstart-java.md?tabs=javase&pivots=platform-windows-development-environment-azure-portal) |
| **Deploy your app** | <li>[Configure Java](./configure-language-java.md?pivots=platform-linux)<li>[Deploy War](./deploy-zip.md?tabs=cli#deploy-warjarear-packages)<li>[GitHub actions](./deploy-github-actions.md) |
| **Monitor your app**| <li>[Log stream](./troubleshoot-diagnostic-logs.md#stream-logs)<li>[Diagnose and solve tool](./overview-diagnostics.md)|
| **Add domains & certificates** |<li>[Map a custom domain](./app-service-web-tutorial-custom-domain.md?tabs=root%2Cazurecli)<li>[Add SSL certificate](./configure-ssl-certificate.md)|
| **Connect to a database** | <li>[Java Spring with CosmosDB](./tutorial-java-spring-cosmosdb.md)|
| **Custom containers** |<li>[Linux - Visual Studio Code](./quickstart-custom-container.md?tabs=python&pivots=container-linux-vscode)|
| **Review best practices** | <li>[Scale your app]()<li>[Deployment](./deploy-best-practices.md)<li>[Security](/security/benchmark/azure/baselines/app-service-security-baseline?toc=/azure/app-service/toc.json)|
::: zone-end
::: zone pivot="stack-php"
[Azure App Service](./overview.md) is a fully managed platform as a service (PaaS) for hosting web applications. Use the following resources to get started with PHP.

| Action | Resources |
| --- | --- |
| **Create your first PHP app** | Using one of the following tools:<br><br><li>[Linux - CLI](./quickstart-php.md?tabs=cli&pivots=platform-linux)<li>[Linux - Azure portal](./quickstart-php.md?tabs=portal&pivots=platform-linux) |
| **Deploy your app** | <li>[Configure PHP](./configure-language-php.md?pivots=platform-linux)<li>[Deploy via FTP](./deploy-ftp.md?tabs=portal)|
| **Monitor your app**| <li>[Troubleshoot with Azure Monitor](./tutorial-troubleshoot-monitor.md)<li>[Log stream](./troubleshoot-diagnostic-logs.md#stream-logs)<li>[Diagnose and solve tool](./overview-diagnostics.md)|
| **Add domains & certificates** |<li>[Map a custom domain](./app-service-web-tutorial-custom-domain.md?tabs=root%2Cazurecli)<li>[Add SSL certificate](./configure-ssl-certificate.md)|
| **Connect to a database** | <li>[MySQL with PHP](./tutorial-php-mysql-app.md)|
| **Custom containers** |<li>[Multi-container](/quickstart-multi-container.md)|
| **Review best practices** | <li>[Scale your app]()<li>[Deployment](./deploy-best-practices.md)<li>[Security](/security/benchmark/azure/baselines/app-service-security-baseline?toc=/azure/app-service/toc.json)|
::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Learn about App Service](./overview.md)
