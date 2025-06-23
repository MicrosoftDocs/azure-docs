---
title: Overview of Azure Migrate Application and Code Assessment for Java
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
# Overview of Azure Migrate Application and Code Assessment for Java
This document provides an overview about Azure Migrate application and code assessment for Java to help you generally understand its suitable scenarios to help you migrate Java applications to Azure.
> [!NOTE]
> This article is for *Azure Migrate application and code assessment for Java*, version 7.x. This version has entered into GA since July 2025.

## Overview
Azure Migrate application and code assessment for Java (AppCAT for Java) enables you to evaluate Java application readiness for replatforming and migration to Azure. It can assess Java application binaries and source code to identify replatforming and migration opportunities for Azure. 

The tool uses advanced analysis techniques to understand the structure and dependencies of any Java application, and provides insights on how to refactor and migrate the applications to Azure on below aspects:
- Discover technology usage: See which technologies an application uses. Discovery is useful if you have legacy applications with not much documentation and want to know which technologies they use.
- Assess the code to a specific target: Assess an application for a specific Azure target like Azure App Service, Azure Kubernetes Service, and Azure Container Apps - with specific Azure replatforming rules. Check the modifications you have to do to replatform your applications to Azure.

It's offered in two ways:
- a CLI tool which you can download, install and run with parameters to assess your Java applications.
- a Visual Studio Code extension - [Github Copilot App Modernization for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.migrate-java-to-azure) which you can install and run inside Visual Studio Code covering app assessment (powered by AppCAT for Java), code remediation and validation, powered by the intelligence of GitHub Copilot. try it out via [quick start](https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate). 

## License
Azure Migrate application and code assessment for Java (AppCAT for Java) is a free, open source-based tool. The tool is built based on a set of components in the [Cloud Native Computing Foundation](https://www.cncf.io/) project [Konveyor](https://github.com/konveyor), created and led by Red Hat.

## Data collection

AppCAT collects telemetry data by default. Microsoft aggregates collected data to identify patterns of usage to identify common issues and to improve the experience of the AppCAT CLI. The Microsoft AppCAT CLI doesn't collect any private or personal data. For example, the usage data helps identify issues such as commands with low success rate. This information helps us prioritize our work.

While we appreciate the insights this data provides, we also understand that not everyone wants to send usage data. You can disable data collection by using the `appcat analyze --disable-telemetry` command. For more information, see our [privacy statement](https://www.microsoft.com/privacy/privacystatement).

## Next steps
- [Quick start to assess a java project](appcat7-quick-start.md)
