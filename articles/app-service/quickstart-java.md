---
title: 'Quickstart: Create a Java app on Azure App Service'
description: Deploy your first Java Hello World to Azure App Service in minutes. The Azure Web App Plugin for Maven makes it convenient to deploy Java apps.
keywords: azure, app service, web app, windows, linux, java, maven, quickstart
ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.devlang: java
ms.topic: quickstart
ms.date: 06/10/2025
ms.custom: mvc, mode-other, devdivchpfy22, devx-track-java, devx-track-javaee-jbosseap-appsvc, devx-track-javaee-jbosseap, devx-track-javaee, devx-track-extended-java
zone_pivot_groups: app-service-java-deploy
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./quickstart-java-uiex
author: cephalin
ms.author: cephalin
---

# Quickstart: Create a Java app on Azure App Service


::: zone pivot="java-tomcat"

[!INCLUDE [quickstart-java-linux-maven-pivot.md](./includes/quickstart-java/quickstart-java-tomcat.md)]

::: zone-end

::: zone pivot="java-javase"

[!INCLUDE [quickstart-java-windows-maven-pivot.md](./includes/quickstart-java/quickstart-java-javase.md)]

::: zone-end

::: zone pivot="java-jboss"

[!INCLUDE [quickstart-java-windows-maven-pivot.md](./includes/quickstart-java/quickstart-java-jboss.md)]

::: zone-end

## Related content

- [Tutorial: Build a Tomcat web app with Azure App Service on Linux and MySQL](tutorial-java-tomcat-mysql-app.md)
- [Tutorial: Build a Java Spring Boot web app with Azure App Service on Linux and Azure Cosmos DB](tutorial-java-spring-cosmosdb.md)
- [Set up CI/CD](deploy-continuous-deployment.md)
- [Pricing information](https://azure.microsoft.com/pricing/details/app-service/linux/)
- [Aggregate logs and metrics](troubleshoot-diagnostic-logs.md)
- [Scale up](manage-scale-up.md)
- [Azure for Java Developers Resources](/java/azure/)
- [Configure your Java app](configure-language-java-deploy-run.md)
- [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
