---
title: Azure App Service for Windows Java Runtime Support
description: This topic provides the Java Runtime statement of support for Azure App Service on Windows.
author: bmitchell287
ms.author: brendm; joshuapa
ms.date: 3/22/2019
ms.topic: article
ms.service: app-service
manager: dougE
---

# Java runtime statement of support for App Service on Windows

## JDK versions and maintenance

Azure's supported Java Development Kit (JDK) is [Zulu](https://www.azul.com/downloads/azure-only/zulu/) provided through [Azul Systems](https://www.azul.com/).

Major version updates will be provided through new runtime options in Azure App Service for Windows. Customers update to these newer versions of Java by configuring their App Service deployment and are responsible for testing and ensuring the major update meets their needs.

Supported JDKs are automatically patched on a quarterly basis in January, April, July, and October of each year.

## Security updates

Patches and fixes for major security vulnerabilities will be released as soon as they become available from Azul Systems. A "major" vulnerability is defined by a base score of 9.0 or higher on the [NIST Common Vulnerability Scoring System, version 2](https://nvd.nist.gov/cvss.cfm).

## Deprecation and retirement

If a supported Java runtime will be retired, Azure developers using the affected runtime will be given a deprecation notice at least six months before the runtime is retired.

## Local development

Developers can download the Production Edition of Azul Zulu Enterprise JDK for local development from [Azul's download site](https://www.azul.com/downloads/azure-only/zulu/).

## Development support

Product support for the [Azure-supported Azul Zulu JDK](https://www.azul.com/downloads/azure-only/zulu/) is available through Microsoft when developing for Azure or [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) with a [qualified Azure support plan](https://azure.microsoft.com/support/plans/).

## Runtime support

Developers can [open an issue](/azure/azure-supportability/how-to-create-azure-support-request) with the Azul Zulu JDKs through Azure Support if they have a [qualified support plan](https://azure.microsoft.com/support/plans/).

## Next steps

This topic provides the Java Runtime statement of support for Azure App Service on Windows.
- To learn more about hosting web applications with Azure App Service see [App Service overview](overview.md).
- For information about Java on Azure development see [Azure for Java Dev Center](https://docs.microsoft.com/java/azure/?view=azure-java-stable).
