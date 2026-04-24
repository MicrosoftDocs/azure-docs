---
author: cephalin
ms.author: cephalin
ms.topic: include
ms.date: 03/27/2026
ms.service: azure-app-service
---

Azure App Service runs Java web applications on a fully managed service in three variants:

- Java Standard Edition (SE): Can run an app deployed as a Java Archive (JAR) package that contains an embedded server, such as Spring Boot, Quarkus, Dropwizard, or an app with an embedded Tomcat or Jetty server.
- Tomcat: The built-in Tomcat server can run an app deployed as a web application archive (WAR) package.
- JBoss Enterprise Application Platform (EAP): The built-in JBoss EAP server can run an app deployed as a WAR or enterprise archive (EAR) package. This version is supported for Linux apps in a set of pricing tiers, which include Free, Premium v3, and Isolated v2.

> [!NOTE]
> JBoss EAP on App Service now supports Bring Your Own License (BYOL) billing. This approach allows customers with existing Red Hat subscriptions to apply those licenses directly to their JBoss EAP deployments on Azure App Service. [Learn more](https://aka.ms/byol-eap-jboss).
