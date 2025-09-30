---
title: Microsoft Sentinel solution setup essentials
description: Learn the prerequisites for creating Microsoft Sentinel SIEM and platform solutions.
ms.topic: conceptual
author: mberdugo
ms.author: monaberdugo
ms.reviewer: angodavarthy
ms.date: 09/18/2025
---

# Microsoft Sentinel solution setup essentials

Microsoft Sentinel solutions help you package and share custom security content. Use this page to learn about the two solution types and review the setup steps before you build or publish.

## Choose your solution type

Microsoft Sentinel supports two solution types:

- [**SIEM solutions**](#siem-solutions-prerequisites) deliver detections, investigations, and automation. They can include analytics rules, hunting queries, summary rules, workbooks, playbooks, data connectors, and ASIM (Advanced Security Information Model) parsers.
- [**Platform solutions**](#platform-solutions-prerequisites) work with the Microsoft Sentinel data lake to analyze and act on security data and other platform capabilities.

## SIEM solutions prerequisites

 Before you create and publish a SIEM solution to Azure Commercial Marketplace:

- Join the [Microsoft Cloud Partner Program](https://partner.microsoft.com/).
- Create a [Commercial Marketplace account in Partner Center](/partner-center/marketplace/create-account).

## Platform solutions prerequisites

Before you create and publish a platform solution, make sure you have:

- A [Microsoft Sentinel data lake](../sentinel/datalake/sentinel-lake-overview.md) to analyze data and write to the data lake:
    - If you haven’t onboarded yet, see [Onboard to Microsoft Sentinel data lake](../sentinel/datalake/sentinel-lake-onboarding.md).
    - After onboarding, ingest enough data to support notebook analysis.
- [Visual Studio Code](https://code.visualstudio.com/) with:
    - The [Microsoft Sentinel extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-sentinel): 
        - In VS Code, open the Extensions Marketplace, search for **Sentinel**, select **Microsoft Sentinel**, and choose **Install**. 
        - After installation, the Microsoft Sentinel shield icon appears in the left toolbar.

        :::image type="content" source="media/solution-setup-essentials/vs-code-sentinel-extension-small.png" alt-text="Screenshot of the Microsoft Sentinel extension in the Visual Studio Code Marketplace." lightbox="media/solution-setup-essentials/vs-code-sentinel-extension-big.png":::

    - The [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot):
        - In the Extensions Marketplace, search for **GitHub Copilot** and install it.
        - After installing, sign in to GitHub Copilot with your GitHub account.
- Access to the [Microsoft Security Store](https://security.microsoft.com/securitystore) to publish your platform solution.
    - Make sure you have a Partner Center account, are enrolled in the Microsoft AI Cloud Partner Program (MAICPP), and are registered in the Microsoft Security Store.