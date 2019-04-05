---
title: Java developer's guide for App Service on Windows - Azure | Microsoft Docs
description: Learn how to configure Java apps running in Azure App Service on Windows.
keywords: azure app service, web app, windows, oss, java
services: app-service
author: jafreebe
manager: ccompy
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 4/4/2019
ms.author: jafreebe
ms.custom: seodec18

---

# Java developer's guide for App Service on Windows

Azure App Service on Windows lets Java developers to quickly build, deploy, and scale their Tomcat or Java Standard Edition (SE) packaged web applications on a fully managed Windows-based service. Deploy applications with Maven plugins from the command line or in editors like IntelliJ, Eclipse, or Visual Studio Code.

This guide provides key concepts and instructions for Java developers using in App Service for Windows. If you've never used Azure App Service for Windows, you should read through the [Java quickstart](app-service-web-get-started-java.md) first. General questions about using App Service for Windows that aren't specific to the Java development are answered in the [App Service Windows FAQ](faq-configuration-and-management.md).

> [!NOTE]
> Can't find what you're looking for? Please see the [Java Developer guide for Linux](containers/app-service-linux-java.md) for more information. This article documents the difference in behavior on the Windows OS.

## Configuring Tomcat

To edit Tomcat's `server.xml` or other configuration files, first take note your Tomcat major version in the portal.

1. Find the Tomcat home directory for your version by running the `env` command. Search for the environment variable that begins with `AZURE_TOMCAT`and matches your major version. For example, `AZURE_TOMCAT85_HOME` points to the Tomcat directory for Tomcat 8.5.
1. Once you have identified the Tomcat home directory for your version, copy the configuration directory to `D:\home`. For example, if `AZURE_TOMCAT85_HOME` had a value of `D:\Program Files (x86)\apache-tomcat-8.5.37`, the full path of the copied configuration directory would be `D:\home\apache-tomcat-8.5.37\conf`.

Finally, restart your App Service. Your deployments should go to `D:\home\site\wwwroot\webapps` just as before.
