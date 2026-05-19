---
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.topic: include
ms.date: 03/11/2026
---

<!-- Used by: migrate-spring-boot.md, migrate-spring-cloud-to-azure-container-apps.md, migrate-tomcat.md -->

If your application contains code with dependencies on the host OS, refactor it to remove those dependencies. For example, replace any use of `/` or `\` in file system paths with [`File.Separator`](https://docs.oracle.com/javase/8/docs/api/java/io/File.html#separator) or [`Paths.get`](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Paths.html#get-java.lang.String-java.lang.String...-).
