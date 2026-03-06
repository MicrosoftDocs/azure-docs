---
title: Language Runtime Support Policy
description: Learn about the language runtime support policy for Azure App Service.
author: jeffwmartinez
ms.topic: concept-article
ms.date: 02/12/2026
ms.author: jefmarti
ms.custom: devx-track-extended-java
ms.service: azure-app-service
#customer intent: As an app owner, I want to understand the Azure App Service language runtime support policies so I can ensure that my apps get needed updates and support.

---

# Language runtime support policy for Azure App Service

This article describes the language runtime support policy for updating existing stacks and retiring end-of-support stacks in Azure App Service. This policy clarifies existing practices and presents no changes to any customer commitments.

## Updates to existing stacks

App Service updates existing stacks after updates become available from each language community. App Service updates major versions of stacks but can't guarantee any specific minor versions or patch versions. The platform controls minor and patch versions. For example, App Service updates Node 24 but doesn't guarantee a specific Node 24.x.x version. If you need a specific minor or patch version, use a [custom container](quickstart-custom-container.md).

## Retirements

App Service follows community support timelines for the lifecycle of the runtime. After community support for a language reaches the end of support, applications that use the language continue to run unchanged. However, App Service can't provide security patches or related customer support for that runtime version past its end-of-support date. If your application has any problems past the end-of-support date for that version, you should move up to a supported version to receive the latest security patches and features.

> [!IMPORTANT]
> If your app uses an unsupported language version, you must upgrade the app to a supported language version before it can get App Service support.

## Notifications

Stack owners independently determine end-of-support dates for their respective runtime versions, which are outside of App Service control. App Service sends reminder notifications to subscription owners about upcoming end-of-support dates when they become available.

Roles that receive notifications include account administrators, service administrators, and coadministrators. Contributors, readers, or other roles don't directly receive notifications unless they opt in to receive notification emails by using [Service Health Alerts](/azure/service-health/alerts-activity-log-service-notifications-portal).

## Timelines for language runtime version support

To learn more about language-specific support policy timelines, see the following resources:

- [.NET and ASP.NET Core](https://aka.ms/dotnetrelease)
- [.NET Framework and ASP.NET](https://aka.ms/aspnetrelease)
- [Node](https://aka.ms/noderelease)
- [Java](https://aka.ms/javarelease)
- [Python](https://aka.ms/pythonrelease)
- [PHP](https://aka.ms/phprelease)
- [Go](https://aka.ms/gorelease)

## Show and set language versions

App Service supports languages on both Linux and Windows operating systems.

### Show language version

To show the language version an app uses, see the following resources:

- [.NET](configure-language-dotnetcore.md#show-supported-net-core-runtime-versions)
- [Java](#jdk-versions-and-maintenance)
- [Node](configure-language-nodejs.md#show-the-nodejs-version)
- [Python](configure-language-python.md#configure-the-python-version)
- [PHP](configure-language-php.md#show-the-php-version)

### Set language versions

To set the language version for an app, see the following resources:

- [.NET](configure-language-dotnetcore.md#set-net-core-version)
- [Java](configure-language-java-deploy-run.md#show-the-java-version)
- [Node](configure-language-nodejs.md#set-the-nodejs-version)
- [Python](configure-language-python.md#configure-the-python-version)
- [PHP](configure-language-php.md#set-the-php-version)

## Java-specific runtime support

- [Java Development Kit (JDK) versions and maintenance](#jdk-versions-and-maintenance)
- [Security updates](#security-updates)
- [Deprecation and retirement](#deprecation-and-retirement)
- [Local development](#local-development)

### JDK versions and maintenance

Microsoft and [`Adoptium`](https://adoptium.net/) Open JDK builds are provided and supported on App Service for Java 8, 11, 17, 21, and 25. These binaries are provided as a no-cost, multiplatform, production-ready distribution of OpenJDK for Azure. The binaries contain all the components for building and running Java Standard Edition (SE) applications. For local development or testing, you can [download the Microsoft build of OpenJDK](/java/openjdk/download).

# [Linux](#tab/linux)

| Java stack name       | Linux distribution | Java distribution |
| ----------------------- | ------------- | ------------------------- |
| Java 8                  | Alpine 3.16\* | [`Adoptium`](https://adoptium.net/) Temurin 8 (`MUSL`) |
| Java 11                 | Alpine 3.16\* | Microsoft OpenJDK 11 (`MUSL`)    |
| Java 17                 | Ubuntu        | Microsoft OpenJDK 17           |
| Java 21                 | Ubuntu        | Microsoft OpenJDK 21           |
| Tomcat 8.5 Java 8       | Alpine 3.16\* | [`Adoptium`](https://adoptium.net/) Temurin 8 (`MUSL`) |
| Tomcat 8.5 Java 11      | Alpine 3.16\* | Microsoft OpenJDK 11 (`MUSL`)    |
| Tomcat 9.0 Java 8       | Alpine 3.16\* | [`Adoptium`](https://adoptium.net/) Temurin 8 (`MUSL`) |
| Tomcat 9.0 Java 11      | Alpine 3.16\* | Microsoft OpenJDK 11 (`MUSL`)    |
| Tomcat 9.0 Java 17      | Ubuntu        | Microsoft OpenJDK 17           |
| Tomcat 9.0 Java 21      | Ubuntu        | Microsoft OpenJDK 21           |
| Tomcat 9.0 Java 25      | Ubuntu        | Microsoft OpenJDK 25           |
| Tomcat 10.0 Java 8      | Ubuntu        | [`Adoptium`](https://adoptium.net/) Temurin 8        |
| Tomcat 10.0 Java 11     | Ubuntu        | Microsoft OpenJDK 11           |
| Tomcat 10.0 Java 17     | Ubuntu        | Microsoft OpenJDK 17           |
| Tomcat 10.0 Java 21     | Ubuntu        | Microsoft OpenJDK 21           |
| Tomcat 10.1 Java 11     | Ubuntu        | Microsoft OpenJDK 11           |
| Tomcat 10.1 Java 17     | Ubuntu        | Microsoft OpenJDK 17           |
| Tomcat 10.1 Java 21     | Ubuntu        | Microsoft OpenJDK 21           |
| Tomcat 10.1 Java 25     | Ubuntu        | Microsoft OpenJDK 25           |
| Tomcat 11.0 Java 17     | Ubuntu        | Microsoft OpenJDK 17           |
| Tomcat 10.1 Java 21     | Ubuntu        | Microsoft OpenJDK 21           |
| Tomcat 10.1 Java 25     | Ubuntu        | Microsoft OpenJDK 25           |
| JBoss 7.3 Java 8        | Ubuntu        | [`Adoptium`](https://adoptium.net/) Temurin 8        |
| JBoss 7.3 Java 11       | Ubuntu        | Microsoft OpenJDK 11           |
| JBoss 7.4 Java 8        | Ubuntu        | [`Adoptium`](https://adoptium.net/) Temurin 8        |
| JBoss 7.4 Java 11       | Ubuntu        | Microsoft OpenJDK 11           |
| JBoss 7.4 Java 17       | Ubuntu        | Microsoft OpenJDK 17           |
| JBoss 8.0 Java 11       | Ubuntu        | Microsoft OpenJDK 11           |
| JBoss 8.0 Java 17       | Ubuntu        | Microsoft OpenJDK 17           |
| JBoss 8.0 Java 21       | Ubuntu        | Microsoft OpenJDK 21           |
| JBoss 8.0 Java 25       | Ubuntu        | Microsoft OpenJDK 25           |

\* Alpine 3.16 is the last supported Alpine distribution in App Service. To avoid switching over to Ubuntu automatically, pin to a version. When possible, test and switch to a Java offering that Ubuntu distributions support.

# [Windows](#tab/windows)

>[!NOTE]
>Java 25 isn't yet natively available as a selectable runtime on Azure App Service for Windows. If you require Java 25 right away, you can deploy your app using a custom Windows container with the Microsoft OpenJDK 25.

| Java stack name  | Windows version | Java distribution |
| -------------------- | ------------------- | --------------------- |
| Java SE, Java 8      | Windows Server 2022 | [`Adoptium`](https://adoptium.net/) Temurin 8    |
| Java SE, Java 11     | Windows Server 2022 | Microsoft OpenJDK 11       |
| Java SE, Java 17     | Windows Server 2022 | Microsoft OpenJDK 17       |
| Java SE, Java 21     | Windows Server 2022 | Microsoft OpenJDK 21       |
| Tomcat 8.5, Java 8   | Windows Server 2022 | [`Adoptium`](https://adoptium.net/) Temurin 8    |
| Tomcat 8.5, Java 11  | Windows Server 2022 | Microsoft OpenJDK 11       |
| Tomcat 9.0, Java 8   | Windows Server 2022 | [`Adoptium`](https://adoptium.net/) Temurin 8    |
| Tomcat 9.0, Java 11  | Windows Server 2022 | Microsoft OpenJDK 11       |
| Tomcat 9.0, Java 17  | Windows Server 2022 | Microsoft OpenJDK 17       |
| Tomcat 9.0, Java 21  | Windows Server 2022 | Microsoft OpenJDK 21       |
| Tomcat 10.0, Java 8  | Windows Server 2022 | [`Adoptium`](https://adoptium.net/) Temurin 8    |
| Tomcat 10.0, Java 11 | Windows Server 2022 | Microsoft OpenJDK 11       |
| Tomcat 10.0, Java 17 | Windows Server 2022 | Microsoft OpenJDK 17       |
| Tomcat 10.0, Java 21 | Windows Server 2022 | Microsoft OpenJDK 21       |
| Tomcat 10.1, Java 11 | Windows Server 2022 | Microsoft OpenJDK 11       |
| Tomcat 10.1, Java 17 | Windows Server 2022 | Microsoft OpenJDK 17       |
| Tomcat 10.1, Java 21 | Windows Server 2022 | Microsoft OpenJDK 21       |
| Tomcat 11.0, Java 17 | Windows Server 2022 | Microsoft OpenJDK 17       |
| Tomcat 11.0, Java 21 | Windows Server 2022 | Microsoft OpenJDK 21       |

-----

If you [pinned](configure-language-java-deploy-run.md#choosing-a-java-runtime-version) to an earlier minor version of Java, your app might be using the deprecated [Azul Zulu for Azure](https://devblogs.microsoft.com/java/end-of-updates-support-and-availability-of-zulu-for-azure/) binaries that were provided through [Azul Systems](https://www.azul.com/). You can keep using these binaries for your apps, but security patches and improvements are available only for more recent versions of OpenJDK. Update to a more recent version of Java as soon as possible.

Azure App Service provides major version updates through new runtime options. Update to these later versions of Java by configuring your App Service deployment. Make sure to test and ensure that the major update meets your needs.

Supported JDKs are automatically patched on a quarterly basis in January, April, July, and October of each year. For more information, see [Java on Azure](/azure/developer/java/fundamentals/java-support-on-azure).

### Security updates

Patches and fixes for major security vulnerabilities are released as soon as they become available in Microsoft builds of OpenJDK. A *major vulnerability* is a vulnerability that has a base score of 9.0 or higher on the [`NIST` Common Vulnerability Scoring System, version 2](https://nvd.nist.gov/vuln-metrics/cvss).

Tomcat 8.5 reached [end of support as of March 31, 2024](https://tomcat.apache.org/tomcat-85-eol.html) and Tomcat 10.0 reached [end of support as of October 31, 2022](https://tomcat.apache.org/tomcat-10.0-eol.html). Although those runtimes are still available on Azure App Service, Tomcat 10 and Tomcat 8.5 don't receive security updates. As soon as possible, migrate your applications to Tomcat 9.0 or Tomcat 10.1, which are available on Azure App Service. For more information, see the [Apache Tomcat documentation](https://tomcat.apache.org/whichversion.html).

Community support for Java 7 ended on July 29, 2022 and [Java 7 was retired from App Service](https://azure.microsoft.com/updates/transition-to-java-11-or-8-by-29-july-2022/). If you have a web app running on Java 7, upgrade to Java 8 or Java 11 as soon as possible.

### Deprecation and retirement

If a supported Java runtime is retired, Azure developers who use the affected runtime receive a deprecation notice at least six months before the runtime is retired.

- [Modernize to Java 21 and Make the Leap to Java 25](https://devblogs.microsoft.com/java/microsofts-openjdk-builds-now-ready-for-java-25/#modernize-to-java-21-and-make-the-leap-to-java-25)
- [Reasons to move to Java 11 and beyond](/java/openjdk/reasons-to-move-to-java-11?bc=/azure/developer/breadcrumb/toc.json&toc=/azure/developer/java/fundamentals/toc.json)
- [Transition from Java 7 to Java 8](/java/openjdk/transition-from-java-7-to-java-8?bc=/azure/developer/breadcrumb/toc.json&toc=/azure/developer/java/fundamentals/toc.json)
### Local development

You can [download](/java/openjdk/download) the [Microsoft build of OpenJDK](/java/openjdk/download) for local development. Microsoft product support for the Microsoft build of OpenJDK is available when you develop for Azure or [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) with a [qualified Azure support plan](https://azure.microsoft.com/support/plans/).

