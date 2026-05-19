---
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.topic: include
ms.date: 03/11/2026
---

<!-- Used by: migrate-spring-boot.md, migrate-spring-cloud-to-azure-container-apps.md -->

If you create your Dockerfile manually and deploy a containerized application to Azure Container Apps, you have full control over your deployment, including JRE/JDK versions.

For deployment from artifacts, Azure Container Apps offers specific versions of Java (8, 11, 17, and 21) and specific versions of Spring Boot and Spring Cloud components. To ensure compatibility, first migrate your application to a supported version of Java in its current environment, then proceed with the remaining migration steps. Fully test the resulting configuration with the latest stable release of your Linux distribution.

> [!NOTE]
> This validation is especially important if your current server runs on an unsupported JDK, such as Oracle JDK or IBM OpenJ9.

To check your current Java version, sign in to your production server and run the following command:

```bash
java -version
```

For supported versions of Java, Spring Boot, and Spring Cloud, see [Java on Azure Container Apps overview](../java-overview.md).
