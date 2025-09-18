---
title: Microsoft Sentinel solution setup essentials
description: Learn the prerequisites and environment setup for creating Microsoft Sentinel SIEM and platform solutions.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 09/18/2025
---

# Microsoft Sentinel solution setup essentials

Microsoft Sentinel solutions help you package, deploy, and share custom security content. Use this page to learn about the two solution types and review the setup steps before you build or publish.

## Choose your solution type

Microsoft Sentinel supports two solution types:

- **SIEM solutions** deliver detections, investigations, and automation. They can include analytics rules, hunting queries, summary rules, workbooks, playbooks, data connectors, and ASIM (Advanced Security Information Model) parsers.
- **Platform solutions** work with the Microsoft Sentinel data lake to analyze and act on security data and other platform capabilities.

## SIEM solutions prerequisites

To publish a SIEM solution to the Azure Commercial Marketplace:

- Join the [Microsoft Cloud Partner Program](https://partner.microsoft.com/).
- Create a [Commercial Marketplace account in Partner Center](/partner-center/marketplace/create-account).

## Platform solutions prerequisites

Before you create or publish a platform solution, make sure you have:

- A [Microsoft Sentinel data lake](<link-to-data-lake-doc>) in your workspace, to analyze data and write to the data lake:
    - If you haven’t onboarded yet, see [Onboard to the Microsoft Sentinel data lake (preview)](<link-to-onboarding-doc>). 
    - After onboarding, wait for enough data to be ingested to support meaningful notebook analysis.
- [Visual Studio Code](https://code.visualstudio.com/) with:
  - The [Microsoft Sentinel extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-sentinel)  
    – In VS Code, open the Extensions Marketplace, search for **Sentinel**, select **Microsoft Sentinel**, and choose **Install**.  
    – After installation, the Microsoft Sentinel shield icon appears in the left toolbar.
  - The [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)  
    – In the Extensions Marketplace, search for **GitHub Copilot** and install it.  
    – After installation, sign in to GitHub Copilot with your GitHub account.
- Access to the Microsoft Security Store to publish your platform solution.  
  You need a Partner Center account, enrollment in the Microsoft AI Cloud Partner Program (MAICPP), and registration for Microsoft Security Store.

## Next steps

- For **platform solutions**, [package and publish your solution to the Microsoft Security Store](platform-solution-packaging).
- For **SIEM solutions**, follow the [standard publish flow for SIEM solution offers](<link-to-siem-publish-doc>).
