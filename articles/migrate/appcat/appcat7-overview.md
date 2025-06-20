---
title: Overview
description: Azure Migrate application and code assessment tool - Overview.
author: KarlErickson
ms.author: karler
ms.reviewer: brborges
ms.service: azure
ms.custom:
  - devx-track-java
  - devx-track-extended-java
  - build-2025
ms.topic: overview
ms.date: 01/15/2025
#customer intent: As a developer, I want to assess my Java application so that I can understand its readiness for migration to Azure.
---

# Azure Migrate application and code assessment for Java version 7

> [!NOTE]
> This article is for the next generation of *Azure Migrate application and code assessment for Java*, version 7.x. This version is in GA now.

This article shows you how to use the Azure Migrate application and code assessment tool for Java to assess and replatform any type of Java application. The tool enables you to evaluate application readiness for replatforming and migration to Azure. This tool is offered as a command-line interface (CLI), and assesses Java application binaries and source code to identify replatforming and migration opportunities for Azure. It helps you modernize and replatform large-scale Java applications by identifying common use cases and code patterns and proposing recommended changes.

The tool discovers application technology usage through static code analysis, provides effort estimation, and accelerates code replatforming. This assessment helps you to prioritize and move Java applications to Azure. With a set of engines and rules, the tool can discover and assess different technologies such as Java 11, Java 17, Jakarta EE, Spring, Hibernate, Java Message Service (JMS), and more. The tool then helps you replatform the Java application to different Azure targets - Azure App Service, Azure Kubernetes Service, and Azure Container Apps - with specific Azure replatforming rules.

The tool is based on a set of components in the [Cloud Native Computing Foundation](https://www.cncf.io/) project [Konveyor](https://github.com/konveyor), created and led by Red Hat.

## Overview

The tool is designed to help organizations modernize their Java applications in a way that reduces costs and enables faster innovation. The tool uses advanced analysis techniques to understand the structure and dependencies of any Java application, and provides guidance on how to refactor and migrate the applications to Azure.

With it, you can perform the following tasks:

- Discover technology usage: Quickly see which technologies an application uses. Discovery is useful if you have legacy applications with not much documentation and want to know which technologies they use.
- Assess the code to a specific target: Assess an application for a specific Azure target. Check the effort and the modifications you have to do to replatform your applications to Azure.

Besides offered as a CLI tool, it's now part of [Github Copilot App Modernization for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure) to help you migrate your Java applications to Azure with confidence and efficiency, covering assessment, code remediation and validation, powered by the intelligence of GitHub Copilot - try it out via [quick start](https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate). 

### Supported targets

The tool contains rules for helping you replatform your applications so you can deploy to, and use, different Azure services.

The rules used by Azure Migrate application and code assessment are grouped based on a *target*. A target is where or how the application runs, and general needs and expectations. When assessing an application, you can choose multiple targets. The following table describes the available targets:

| Target name              | Description                                                            | Target                 |
|--------------------------|------------------------------------------------------------------------|------------------------|
| Azure App Service        | Best practices for deploying an app to Azure App Service.              | `azure-appservice`     |
| Azure Kubernetes Service | Best practices for deploying an app to Azure Kubernetes Service.       | `azure-aks`            |
| Azure Container Apps     | Best practices for deploying an app to Azure Container Apps.           | `azure-container-apps` |
| Cloud Readiness          | General best practices for making an application Cloud (Azure) ready.  | `cloud-readiness`      |
| Linux                    | General best practices for making an application Linux ready.          | `linux`                |
| OpenJDK 11               | General best practices for running a Java 8 application with Java 11.  | `openjdk11`            |
| OpenJDK 17               | General best practices for running a Java 11 application with Java 17. | `openjdk17`            |
| OpenJDK 21               | General best practices for running a Java 17 application with Java 21. | `openjdk21`            |

When the tool assesses for Cloud Readiness and related Azure services, it can also report useful information for potential usage of different Azure services. The following list shows a few of the services covered:

- Azure Databases
- Azure Service Bus
- Azure Storage
- Azure Content Delivery Network
- Azure Event Hubs
- Azure Key Vault
- Azure Front Door

## License

Azure Migrate application and code assessment for Java is a free, open source-based tool.

## Data collection

AppCAT collects telemetry data by default. Microsoft aggregates collected data to identify patterns of usage to identify common issues and to improve the experience of the AppCAT CLI. The Microsoft AppCAT CLI doesn't collect any private or personal data. For example, the usage data helps identify issues such as commands with low success rate. This information helps us prioritize our work.

While we appreciate the insights this data provides, we also understand that not everyone wants to send usage data. You can disable data collection by using the `appcat analyze --disable-telemetry` command. For more information, see our [privacy statement](https://www.microsoft.com/privacy/privacystatement).

## Next steps

> [!div class="nextstepaction"]
> [Quick start to assess a java project](appcat7-quick-start.md)
