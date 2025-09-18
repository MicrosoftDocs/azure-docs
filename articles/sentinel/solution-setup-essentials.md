---
title: Microsoft Sentinel solution setup essentials
description: Learn the prerequisites and environment setup for creating Microsoft Sentinel SIEM and platform solutions.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 09/18/2025
---

# Microsoft Sentinel solution setup essentials

Microsoft Sentinel solutions allow you to package, deploy, and share custom security content, extending your workspace for your organization or publishing for customers.  

Use this page to understand the two solution paths and check prerequisites before you build or publish.

## Choose your solution type

Microsoft Sentinel supports two solution types.

- **SIEM solutions** provide detections, investigations, and automation, and can include analytics rules, hunting queries, summary rules, workbooks, playbooks, data connectors, and ASIM (Advanced Security Information Model) parsers.
- **Platform solutions** work with the Microsoft Sentinel data lake to analyze and act on security data and other platform capabilities.

## Prerequisites for SIEM solutions

Before you start, make sure you have:

- A [Partner Center](https://partner.microsoft.com/) account in the Microsoft Cloud Partner Program.
- A [Commercial Marketplace account in Partner Center](/partner-center/marketplace/create-account). 

## Prerequisites for platform solutions

Before you start, make sure you have:

- A [Microsoft Sentinel data lake](<add-link>) in your workspace.
- [Visual Studio Code](https://code.visualstudio.com/) with the [Microsoft Sentinel extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-sentinel) and the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) installed. 

## Next steps

- **Platform solutions:** When your components are ready, [package and publish your solution to the Microsoft Security Store](platform-solution-packaging).
- **SIEM solutions:** Follow the [standard publish flow for SIEM solution offers](<add-link>).