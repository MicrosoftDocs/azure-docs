---
title: Getting started with Azure App Service
description: Take the first steps toward working with Azure App Service. Decide on a stack and choose from various actions to get your app running.
ms.author: msangapu
author: msangapu-msft
ms.topic: overview
ms.custom: devx-track-extended-java, devx-track-python, devx-track-js
ms.date: 02/05/2025
zone_pivot_groups: app-service-getting-started-stacks
---

# Getting started with Azure App Service

[Azure App Service](./overview.md) is a fully managed platform as a service (PaaS) for hosting web applications.

::: zone pivot="stack-net"

## ASP.NET or ASP.NET Core

Use the following resources to get started with .NET.

| Action | Resources |
| --- | --- |
| **Create your first .NET app** | Use one of the following tools:<br><br>- [Visual Studio](./quickstart-dotnetcore.md?tabs=net60&pivots=development-environment-vs)<br>- [Visual Studio Code](./quickstart-dotnetcore.md?tabs=net60&pivots=development-environment-vscode)<br>- [Command line](./quickstart-dotnetcore.md?tabs=net60&pivots=development-environment-cli)<br>- [Azure PowerShell](./quickstart-dotnetcore.md?tabs=net60&pivots=development-environment-ps)<br>- [Azure portal](./quickstart-dotnetcore.md?tabs=net60&pivots=development-environment-azure-portal) |
| **Deploy your app** | - [Configure ASP.NET](./configure-language-dotnet-framework.md)<br>- [Configure ASP.NET core](./configure-language-dotnetcore.md?pivots=platform-linux)<br>- [GitHub actions](./deploy-github-actions.md) |
| **Monitor your app**| - [Log stream](./troubleshoot-diagnostic-logs.md#stream-logs)<br>- [Diagnose and solve tool](./overview-diagnostics.md)|
| **Add domains & certificates** |- [Map a custom domain](./app-service-web-tutorial-custom-domain.md?tabs=root%2Cazurecli)<br>- [Add an SSL certificate](./configure-ssl-certificate.md)|
| **Connect to a database** | - [.NET with Azure SQL Database](./app-service-web-tutorial-dotnet-sqldatabase.md)<br>- [.NET Core with Azure SQL Database](./tutorial-dotnetcore-sqldb-app.md)|
| **Custom containers** |- [Linux - Visual Studio Code](./quickstart-custom-container.md?tabs=dotnet&pivots=container-linux-vscode)<br>- [Windows - Visual Studio](./quickstart-custom-container.md?tabs=dotnet&pivots=container-windows-vs)|
| **Review best practices** | - [Scale your app](./manage-scale-up.md)<br>- [Deployment](./deploy-best-practices.md)<br>- [Security](/security/benchmark/azure/baselines/app-service-security-baseline?toc=/azure/app-service/toc.json)<br>- [Virtual Network](./configure-vnet-integration-enable.md)|

::: zone-end
::: zone pivot="stack-java"

## Java

App Service aims to provide robust support for Java. To cover the depth and breadth of 
Java applications, App Service supports the Java Standard Edition (SE), Tomcat, and 
JBoss Enterprise Application Platform (EAP) technology stacks. At the base of these 
stacks, App Service supports all recent Java long-term support (LTS) versions. There are 
several key scenarios for which you should consider adopting App Service for your Java 
applications.

### Java SE on App Service
Java SE on App Service allows you to effortlessly deploy your applications to fully 
managed Java Virtual Machine (JVM) instances. You should consider this stack if you 
have Spring Boot and Quarkus web applications. However, you can use this stack for any 
application that can be started directly from a JVM and includes an embedded 
HyperText Transfer Protocol (HTTP) server. You can deploy your 
Java archive (JAR) file and let App Service do the rest.

### Tomcat on App Service
This App Service stack supports all recent major and minor versions of Tomcat. 
You should consider migrating on-premises Tomcat web applications to App Service using 
this stack. Such applications often use technologies such as the Spring Framework and 
Hibernate. The stack is also suitable for applications currently running on servers such 
as WebLogic or WebSphere that can be easily migrated to Tomcat. You can deploy 
your web application archive (WAR) file and let App Service do the rest.

### JBoss EAP on App Service
You can effortlessly run any JBoss EAP version currently supported by Red Hat on this 
App Service stack. JBoss EAP is fully compatible with the Java Enterprise Edition (EE) 
and Jakarta EE standards. The stack can optionally support any application that requires 
JBoss EAP clustering. You should consider migrating applications currently running 
on-premises on JBoss EAP and WildFly to this stack. The stack is also suitable for 
applications running on servers such as WebLogic or WebSphere that can be easily migrated 
to JBoss EAP. You can deploy your web application archive (WAR) or 
enterprise archive (EAR) file and let App Service do the rest.

Use the following resources to get started with Java.

| Action | Resources |
| --- | --- |
| **Create your first Java app** | Use one of the following tools:<br><br>- [Maven deploy with an embedded web server](./quickstart-java.md?pivots=java-javase)<br>- [Maven deploy to a Tomcat server](./quickstart-java.md?pivots=java-tomcat)<br>- [Maven deploy to a JBoss EAP server](./quickstart-java.md?pivots=java-jboss) |
| **Deploy your app** | - [With Maven](configure-language-java-deploy-run.md?pivots=platform-linux#maven)<br>- [With Gradle](configure-language-java-deploy-run.md?pivots=platform-linux#gradle)<br>- [With popular IDEs (Visual Studio Code, IntelliJ, and Eclipse)](configure-language-java-deploy-run.md?pivots=platform-linux#ides)<br>- [Deploy JAR, WAR, or EAR packages directly](./deploy-zip.md?tabs=cli#deploy-warjarear-packages)<br>- [With GitHub Actions](./deploy-github-actions.md)<br>- [With Azure DevOps](./deploy-azure-pipelines.md)|
| **Monitor your app**| - [Monitoring overview](./monitor-app-service.md)<br>- [Log stream](./troubleshoot-diagnostic-logs.md#stream-logs)<br>- [Diagnose and solve tool](./overview-diagnostics.md)|
| **Add domains & certificates** |- [Map a custom domain](./app-service-web-tutorial-custom-domain.md?tabs=root%2Cazurecli)<br>- [Add an SSL certificate](./configure-ssl-certificate.md)|
| **Connect to a database** |- [Spring Boot with Azure Cosmos DB](./tutorial-java-spring-cosmosdb.md)<br>- [Tomcat with PostgreSQL](./tutorial-java-tomcat-connect-managed-identity-postgresql-database.md)<br>- [JBoss EAP with PostgreSQL](./tutorial-java-jboss-mysql-app.md)|
| **Custom containers** |- [Linux - Visual Studio Code](./quickstart-custom-container.md?tabs=python&pivots=container-linux-vscode)|
| **Review best practices** | - [Scale your app](./manage-scale-up.md)<br>- [Deployment](./deploy-best-practices.md)<br>- [Security](/security/benchmark/azure/baselines/app-service-security-baseline?toc=/azure/app-service/toc.json)<br>- [Virtual networks](./configure-vnet-integration-enable.md)|

::: zone-end
::: zone pivot="stack-nodejs"

## Node.js

Use the following resources to get started with Node.js.

| Action | Resources |
| --- | --- |
| **Create your first Node.js app** | Use one of the following tools:<br><br>- [Visual Studio Code](./quickstart-nodejs.md?tabs=linux&pivots=development-environment-vscode)<br>- [CLI](./quickstart-nodejs.md?tabs=linux&pivots=development-environment-cli)<br>- [Azure portal](./quickstart-nodejs.md?tabs=linux&pivots=development-environment-azure-portal) |
| **Deploy your app** | - [Configure Node.js](./configure-language-nodejs.md?pivots=platform-linux)<br>- [GitHub Actions](./deploy-github-actions.md) |
| **Monitor your app**| - [Log stream](./troubleshoot-diagnostic-logs.md#stream-logs)<br>- [Diagnose and solve tool](./overview-diagnostics.md)|
| **Add domains & certificates** |- [Map a custom domain](./app-service-web-tutorial-custom-domain.md?tabs=root%2Cazurecli)<br>- [Add an SSL certificate](./configure-ssl-certificate.md)|
| **Connect to a database** | - [MongoDB](./tutorial-nodejs-mongodb-app.md)|
| **Custom containers** |- [Linux - Visual Studio Code](./quickstart-custom-container.md?tabs=node&pivots=container-linux-vscode)|
| **Review best practices** | - [Scale your app](./manage-scale-up.md)<br>- [Deployment](./deploy-best-practices.md)<br>- [Security](/security/benchmark/azure/baselines/app-service-security-baseline?toc=/azure/app-service/toc.json)<br>- [Virtual networks](./configure-vnet-integration-enable.md)|

::: zone-end
::: zone pivot="stack-python"

## Python

Use the following resources to get started with Python.

| Action | Resources |
| --- | --- |
| **Create your first Python app** | Use one of the following tools:<br><br>- [Flask - CLI](./quickstart-python.md?tabs=flask%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli)<br>- [Flask - Visual Studio Code](./quickstart-python.md?tabs=flask%2Cwindows%2Cvscode-aztools%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli)<br>- [Django - CLI](./quickstart-python.md?tabs=django%2Cwindows%2Cazure-cli%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli)<br>- [Django - Visual Studio Code](./quickstart-python.md?tabs=django%2Cwindows%2Cvscode-aztools%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli)<br>- [Django - Azure portal](./quickstart-python.md?tabs=django%2Cwindows%2Cazure-portal%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli) |
| **Deploy your app** | - [Configure Python](configure-language-python.md)<br>- [GitHub Actions](./deploy-github-actions.md) |
| **Monitor your app**| - [Log stream](./troubleshoot-diagnostic-logs.md#stream-logs)<br>- [Diagnose and solve tool](./overview-diagnostics.md)|
| **Add domains & certificates** |- [Map a custom domain](./app-service-web-tutorial-custom-domain.md?tabs=root%2Cazurecli)<br>- [Add an SSL certificate](./configure-ssl-certificate.md)|
| **Connect to a database** | - [PostgreSQL - CLI](./tutorial-python-postgresql-app.md?tabs=flask%2Cwindows&pivots=azure-developer-cli)<br>- [PostgreSQL - Azure portal](./tutorial-python-postgresql-app.md?tabs=flask%2Cwindows&pivots=azure-portal)|
| **Custom containers** |- [Linux - Visual Studio Code](./quickstart-custom-container.md?tabs=python&pivots=container-linux-vscode)|
| **Review best practices** | - [Scale your app](./manage-scale-up.md)<br>- [Deployment](./deploy-best-practices.md)<br>- [Security](/security/benchmark/azure/baselines/app-service-security-baseline?toc=/azure/app-service/toc.json)<br>- [Virtual networks](./configure-vnet-integration-enable.md)|

::: zone-end
::: zone pivot="stack-php"

## PHP

Use the following resources to get started with PHP.

| Action | Resources |
| --- | --- |
| **Create your first PHP app** | Use one of the following tools:<br><br>- [Linux - CLI](./quickstart-php.md?tabs=cli&pivots=platform-linux)<br>- [Linux - Azure portal](./quickstart-php.md?tabs=portal&pivots=platform-linux) |
| **Deploy your app** | - [Configure PHP](./configure-language-php.md?pivots=platform-linux)<br>- [Deploy via FTP](./deploy-ftp.md?tabs=portal)|
| **Monitor your app**|- [Troubleshoot with Azure Monitor](./tutorial-troubleshoot-monitor.md)<br>- [Log stream](./troubleshoot-diagnostic-logs.md#stream-logs)<br>- [Diagnose and solve tool](./overview-diagnostics.md)|
| **Add domains & certificates** |- [Map a custom domain](./app-service-web-tutorial-custom-domain.md?tabs=root%2Cazurecli)<br>- [Add an SSL certificate](./configure-ssl-certificate.md)|
| **Connect to a database** | - [MySQL with PHP](./tutorial-php-mysql-app.md)|
| **Custom containers** |- [Sidecar containers](tutorial-custom-container-sidecar.md)|
| **Review best practices** | - [Scale your app]()<br>- [Deployment](./deploy-best-practices.md)<br>- [Security](/security/benchmark/azure/baselines/app-service-security-baseline?toc=/azure/app-service/toc.json)<br>- [Virtual Network](./configure-vnet-integration-enable.md)|

::: zone-end

## Next step

> [!div class="nextstepaction"]
> [Learn about App Service](./overview.md)
