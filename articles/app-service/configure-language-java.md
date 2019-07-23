---
title: Configure Windows Java apps - Azure App Service | Microsoft Docs
description: Learn how to configure Java apps to run on the default Windows instances in Azure App Service.
keywords: azure app service, web app, windows, oss, java
services: app-service
author: jasonfreeberg
manager: jeconnock
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 04/12/2019
ms.author: jafreebe
ms.reviewer: cephalin
ms.custom: seodec18

---

# Configure a Windows Java app for Azure App Service

Azure App Service lets Java developers to quickly build, deploy, and scale their Tomcat or Java Standard Edition (SE) packaged web applications on a fully managed Windows-based service. Deploy applications with Maven plugins from the command line or in editors like IntelliJ, Eclipse, or Visual Studio Code.

This guide provides key concepts and instructions for Java developers using in App Service. If you've never used Azure App Service, you should read through the [Java quickstart](app-service-web-get-started-java.md) first. General questions about using App Service that aren't specific to the Java development are answered in the [App Service Windows FAQ](faq-configuration-and-management.md).

> [!NOTE]
> Can't find what you're looking for? Please see the [Windows OSS FAQ](faq-configuration-and-management.md) or the [Java Linux configuration guide](containers/configure-language-java.md) for information on deploying and securing your Java app.

## Configuring Tomcat

To edit Tomcat's `server.xml` or other configuration files, first take a note of your Tomcat major version in the portal.

1. Find the Tomcat home directory for your version by running the `env` command. Search for the environment variable that begins with `AZURE_TOMCAT`and matches your major version. For example, `AZURE_TOMCAT85_HOME` points to the Tomcat directory for Tomcat 8.5.
1. Once you have identified the Tomcat home directory for your version, copy the configuration directory to `D:\home`. For example, if `AZURE_TOMCAT85_HOME` had a value of `D:\Program Files (x86)\apache-tomcat-8.5.37`, the full path of the copied configuration directory would be `D:\home\tomcat\conf`.

Finally, restart your App Service. Your deployments should go to `D:\home\site\wwwroot\webapps` just as before.

## Java runtime statement of support

### JDK versions and maintenance

Azure's supported Java Development Kit (JDK) is [Zulu](https://www.azul.com/downloads/azure-only/zulu/) provided through [Azul Systems](https://www.azul.com/).

Major version updates will be provided through new runtime options in Azure App Service for Windows. Customers update to these newer versions of Java by configuring their App Service deployment and are responsible for testing and ensuring the major update meets their needs.

Supported JDKs are automatically patched on a quarterly basis in January, April, July, and October of each year.

### Security updates

Patches and fixes for major security vulnerabilities will be released as soon as they become available from Azul Systems. A "major" vulnerability is defined by a base score of 9.0 or higher on the [NIST Common Vulnerability Scoring System, version 2](https://nvd.nist.gov/cvss.cfm).

### Deprecation and retirement

If a supported Java runtime will be retired, Azure developers using the affected runtime will be given a deprecation notice at least six months before the runtime is retired.

### Local development

Developers can download the Production Edition of Azul Zulu Enterprise JDK for local development from [Azul's download site](https://www.azul.com/downloads/azure-only/zulu/).

### Development support

Product support for the [Azure-supported Azul Zulu JDK](https://www.azul.com/downloads/azure-only/zulu/) is available through Microsoft when developing for Azure or [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) with a [qualified Azure support plan](https://azure.microsoft.com/support/plans/).

### Runtime support

Developers can [open an issue](/azure/azure-supportability/how-to-create-azure-support-request) with the Azul Zulu JDKs through Azure Support if they have a [qualified support plan](https://azure.microsoft.com/support/plans/).

## Next steps

This topic provides the Java Runtime statement of support for Azure App Service on Windows.

- To learn more about hosting web applications with Azure App Service see [App Service overview](overview.md).
- For information about Java on Azure development see [Azure for Java Dev Center](https://docs.microsoft.com/java/azure/?view=azure-java-stable).
