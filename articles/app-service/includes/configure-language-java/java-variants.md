---
author: cephalin
ms.author: cephalin
ms.topic: include
ms.date: 04/02/2026
ms.service: azure-app-service
---

Azure App Service runs Java web applications in three types on a fully managed service:

- Java Standard Edition (SE). Java SE can run an app deployed as a Java archive (JAR) package that contains an embedded server, such as Spring Boot, Quarkus, Dropwizard, or an app with an embedded Tomcat or Jetty server.
- Tomcat. The built-in Tomcat server can run an app deployed as a web application archive (WAR) package.
- JBoss Enterprise Application Platform (EAP): The built-in JBoss EAP server can run an app deployed as a WAR or enterprise archive (EAR) package. This option is supported for Linux apps in a set of pricing tiers that include Free, Premium v3, and Isolated v2.

> [!NOTE]
> JBoss EAP on App Service now supports Bring Your Own License (BYOL) billing. BYOL enables customers who have existing Red Hat subscriptions to apply those licenses directly to their JBoss EAP deployments on Azure App Service. For more information, see [BYOL Support for JBoss EAP on App Service](https://aka.ms/byol-eap-jboss).
