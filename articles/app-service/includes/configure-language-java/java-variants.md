---
author: cephalin
ms.author: cephalin
ms.topic: include
ms.date: 05/17/2024
---

Azure App Service runs Java web applications on a fully managed service in three variants:

* Java SE - Can run an app deployed as a JAR package that contains an embedded server (such as Spring Boot, Dropwizard, Quarkus, or one with an embedded Tomcat or Jetty server).   
* Tomcat - The built-in Tomcat server can run an app deployed as a WAR package.
* JBoss EAP - Supported for Linux apps in the Premium v3 and Isolated v2 pricing tiers only. The built-in JBoss EAP server can run an app deployed as a WAR or EAR package.

::: zone pivot="java-javase"

> [!NOTE]
> For Spring applications, we recommend using Azure Spring Apps. However, you can still use Azure App Service as a destination. See [Java Workload Destination Guidance](https://aka.ms/javadestinations) for advice.

::: zone-end
