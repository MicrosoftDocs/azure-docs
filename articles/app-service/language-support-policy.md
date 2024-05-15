---
title: Language runtime support policy
description: Learn about the language runtime support policy for Azure App Service.
author: jeffwmartinez
ms.topic: article
ms.date: 05/06/2024
ms.author: jefmarti
ms.custom: devx-track-extended-java
---

# Language runtime support policy for App Service

This article describes the language runtime support policy for updating existing stacks and retiring end-of-support stacks in Azure App Service. This policy clarifies existing practices and doesn't represent a change to customer commitments.

## Updates to existing stacks

App Service updates existing stacks after they become available from each community. App Service updates major versions of stacks but can't guarantee any specific minor or patch versions. The platform controls minor and patch versions. For example, App Service updates Node 18 but doesn't guarantee a specific Node 18.x.x version. If you need a specific minor or patch version, you can use a [custom container](quickstart-custom-container.md).

## Retirements

App Service follows community support timelines for the lifecycle of the runtime. After community support for a language reaches the end of support, your applications continue to run unchanged. However, App Service can't provide security patches or related customer support for that runtime version past its end-of-support date. If your application has any problems past the end-of-support date for that version, you should move up to a supported version to receive the latest security patches and features.

> [!IMPORTANT]
> If you're running apps that use an unsupported language version, you need to upgrade to a supported language version before you can get support for those apps.

## Notifications

End-of-support dates for runtime versions are determined independently by their respective stacks and are outside the control of App Service. App Service sends reminder notifications to subscription owners for upcoming end-of-support runtime versions when they become available for each language.

Roles that receive notifications include account administrators, service administrators, and coadministrators. Contributors, readers, or other roles don't directly receive notifications unless they opt in to receive notification emails, using [Service Health Alerts](../service-health/alerts-activity-log-service-notifications-portal.md).  

## Timelines for language runtime version support

To learn more about specific timelines for the language support policy, see the following resources:

- [.NET and ASP.NET Core](https://aka.ms/dotnetrelease)
- [.NET Framework and ASP.NET](https://aka.ms/aspnetrelease)
- [Node](https://aka.ms/noderelease)
- [Java](https://aka.ms/javarelease)
- [Python](https://aka.ms/pythonrelease)
- [PHP](https://aka.ms/phprelease)
- [Go](https://aka.ms/gorelease)

## Configure language versions

To learn more about how to update language versions for your App Service applications, see the following resources:

- [.NET](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/dot_net_core.md#how-to-update-your-app-to-target-a-different-version-of-net-or-net-core)
- [Node](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/node_support.md#node-on-linux-app-service)
- [Java](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/java_support.md#java-on-app-service)
- [Python](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/python_support.md#how-to-update-your-app-to-target-a-different-version-of-python)
- [PHP](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/php_support.md#how-to-update-your-app-to-target-a-different-version-of-php)

## Java-specific runtime statement of support

- [JDK versions and maintenance](#jdk-versions-and-maintenance)
- [Security updates](#security-updates)
- [Deprecation and retirement](#deprecation-and-retirement)
- [Local development](#local-development)

### JDK versions and maintenance

Microsoft and Adoptium builds of OpenJDK are provided and supported on App Service for Java 8, 11, 17, and 21. These binaries are provided as a no-cost, multi-platform, production-ready distribution of the OpenJDK for Azure. They contain all the components for building and running Java SE applications. For local development or testing, you can install the Microsoft build of OpenJDK from the [downloads page](/java/openjdk/download). 

# [Linux](#tab/linux)

| **Java stack name**       | **Linux distribution** | **Java distribution** |
| ----------------------- | ------------- | ------------------------- |
| Java 8                  | Alpine 3.16\* | Adoptium Temurin 8 (MUSL) |
| Java 11                 | Alpine 3.16\* | MSFT OpenJDK 11 (MUSL)    |
| Java 17                 | Ubuntu        | MSFT OpenJDK 17           |
| Java 21                 | Ubuntu        | MSFT OpenJDK 21           |
| Tomcat 8.5 Java 8       | Alpine 3.16\* | Adoptium Temurin 8 (MUSL) |
| Tomcat 8.5 Java 11      | Alpine 3.16\* | MSFT OpenJDK 11 (MUSL)    |
| Tomcat 9.0 Java 8       | Alpine 3.16\* | Adoptium Temurin 8 (MUSL) |
| Tomcat 9.0 Java 11      | Alpine 3.16\* | MSFT OpenJDK 11 (MUSL)    |
| Tomcat 9.0 Java 17      | Ubuntu        | MSFT OpenJDK 17           |
| Tomcat 9.0 Java 21      | Ubuntu        | MSFT OpenJDK 21           |
| Tomcat 10.0 Java 8      | Ubuntu        | Adoptium Temurin 8        |
| Tomcat 10.0 Java 11     | Ubuntu        | MSFT OpenJDK 11           |
| Tomcat 10.0 Java 17     | Ubuntu        | MSFT OpenJDK 17           |
| Tomcat 10.0 Java 21     | Ubuntu        | MSFT OpenJDK 21           |
| Tomcat 10.1 Java 11     | Ubuntu        | MSFT OpenJDK 11           |
| Tomcat 10.1 Java 17     | Ubuntu        | MSFT OpenJDK 17           |
| Tomcat 10.1 Java 21     | Ubuntu        | MSFT OpenJDK 21           |
| JBoss 7.3 Java 8        | Ubuntu        | Adoptium Temurin 8        |
| JBoss 7.3 Java 11       | Ubuntu        | MSFT OpenJDK 11           |
| JBoss 7.4 Java 8        | Ubuntu        | Adoptium Temurin 8        |
| JBoss 7.4 Java 11       | Ubuntu        | MSFT OpenJDK 11           |
| JBoss 7.4 Java 17       | Ubuntu        | MSFT OpenJDK 17           |

\* Alpine 3.16 is the last supported Alpine distribution in App Service. You should pin to a version to avoid switching over to Ubuntu automatically. Make sure you test and switch to Java offering supported by Ubuntu based distributions when possible.

# [Windows](#tab/windows)

| **Java stack name**  | **Windows version** | **Java distribution** |
| -------------------- | ------------------- | --------------------- |
| Java SE, Java 8      | Windows Server 2022 | Adoptium Temurin 8    |
| Java SE, Java 11     | Windows Server 2022 | MSFT OpenJDK 11       |
| Java SE, Java 17     | Windows Server 2022 | MSFT OpenJDK 17       |
| Java SE, Java 21     | Windows Server 2022 | MSFT OpenJDK 21       |
| Tomcat 8.5, Java 8   | Windows Server 2022 | Adoptium Temurin 8    |
| Tomcat 8.5, Java 11  | Windows Server 2022 | MSFT OpenJDK 11       |
| Tomcat 9.0, Java 8   | Windows Server 2022 | Adoptium Temurin 8    |
| Tomcat 9.0, Java 11  | Windows Server 2022 | MSFT OpenJDK 11       |
| Tomcat 9.0, Java 17  | Windows Server 2022 | MSFT OpenJDK 17       |
| Tomcat 9.0, Java 21  | Windows Server 2022 | MSFT OpenJDK 21       |
| Tomcat 10.0, Java 8  | Windows Server 2022 | Adoptium Temurin 8    |
| Tomcat 10.0, Java 11 | Windows Server 2022 | MSFT OpenJDK 11       |
| Tomcat 10.0, Java 17 | Windows Server 2022 | MSFT OpenJDK 17       |
| Tomcat 10.0, Java 21 | Windows Server 2022 | MSFT OpenJDK 21       |
| Tomcat 10.1, Java 11 | Windows Server 2022 | MSFT OpenJDK 11       |
| Tomcat 10.1, Java 17 | Windows Server 2022 | MSFT OpenJDK 17       |
| Tomcat 10.1, Java 21 | Windows Server 2022 | MSFT OpenJDK 21       |

-----

If you're [pinned](configure-language-java.md#choosing-a-java-runtime-version) to an older minor version of Java, your app might be using the deprecated [Azul Zulu for Azure](https://devblogs.microsoft.com/java/end-of-updates-support-and-availability-of-zulu-for-azure/) binaries provided through [Azul Systems](https://www.azul.com/). You can keep using these binaries for your app, but any security patches or improvements are available only in new versions of the OpenJDK, so we recommend that you periodically update your Web Apps to a later version of Java.

Major version updates are provided through new runtime options in Azure App Service. Customers update to these newer versions of Java by configuring their App Service deployment and are responsible for testing and ensuring the major update meets their needs.

Supported JDKs are automatically patched on a quarterly basis in January, April, July, and October of each year. For more information on Java on Azure, see [this support document](/azure/developer/java/fundamentals/java-support-on-azure).

### Security updates

Patches and fixes for major security vulnerabilities are released as soon as they become available in Microsoft builds of the OpenJDK. A "major" vulnerability has a base score of 9.0 or higher on the [NIST Common Vulnerability Scoring System, version 2](https://nvd.nist.gov/vuln-metrics/cvss).

Tomcat 8.5 reached [End of Life as of March 31, 2024](https://tomcat.apache.org/tomcat-85-eol.html) and Tomcat 10.0 reached [End of Life as of October 31, 2022](https://tomcat.apache.org/tomcat-10.0-eol.html).

While the runtimes are still available on Azure App Service, Tomcat 8.5 or 10.0 won't receive security updates.

When possible, migrate your applications to Tomcat 9.0 or Tomcat 10.1. Tomcat 9.0 and Tomcat 10.1 are available on Azure App Service. For more information, see the [official Tomcat site](https://tomcat.apache.org/whichversion.html).

Community support for Java 7 ended on July 29, 2022 and [Java 7 was retired from App Service](https://azure.microsoft.com/updates/transition-to-java-11-or-8-by-29-july-2022/). If you have a web app running on Java 7, upgrade to Java 8 or 11 immediately.

### Deprecation and retirement

If a supported Java runtime is retired, Azure developers using the affected runtime receive a deprecation notice at least six months before the runtime is retired.

- [Reasons to move to Java 11](/java/openjdk/reasons-to-move-to-java-11?bc=/azure/developer/breadcrumb/toc.json&toc=/azure/developer/java/fundamentals/toc.json)
- [Java 7 migration guide](/java/openjdk/transition-from-java-7-to-java-8?bc=/azure/developer/breadcrumb/toc.json&toc=/azure/developer/java/fundamentals/toc.json)

### Local development

Developers can download the Microsoft Build of OpenJDK for local development from [our download site](/java/openjdk/download).

Product support for the [Microsoft Build of OpenJDK](/java/openjdk/download) is available through Microsoft when developing for Azure or [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) with a [qualified Azure support plan](https://azure.microsoft.com/support/plans/).
