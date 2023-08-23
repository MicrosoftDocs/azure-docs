---
title: Security baseline for Azure Monitor for SAP solutions
description: Learn about security baseline for Azure Monitor for SAP solutions
author: sakhare
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: article
ms.custom: subject-monitoring
ms.date: 04/24/2023
ms.author: sakhare
#Customer intent: As a SAP BASIS or cloud infrastructure team, I want to learn about security baseline provided by Azure Monitor for SAP solutions.
---

# Security baseline for Azure Monitor for SAP solutions

This security baseline applies guidance from the Microsoft cloud security benchmarks version 1.0. The Microsoft cloud security benchmark provides recommendations on how you can secure your cloud solutions on Azure. 

You can monitor this security baseline and its recommendations using Microsoft Defender for Cloud. Azure Policy definitions is listed in the Regulatory Compliance section of the Microsoft Defender for Cloud dashboard.

When a feature has relevant Azure Policy Definitions, they are listed in this baseline to help you measure compliance with the Microsoft cloud security benchmark controls and recommendations. Some recommendations may require a paid Microsoft Defender plan to enable certain security scenarios.

When Azure Monitor for SAP solutions is deployed, a managed resource group is deployed with it. 
This managed resource group contains services such as Azure Log Analytics, Azure Functions, Azure Storage and Azure Key Vault. 

## Security baseline for relevant servicea

- [Azure Log Analytics](/security/benchmark/azure/baselines/azure-monitor-security-baseline)
- [Azure Functions](/security/benchmark/azure/baselines/functions-security-baseline)
- [Azure Storage](/security/benchmark/azure/baselines/storage-security-baseline)
- [Azure Key Vault](/security/benchmark/azure/baselines/key-vault-security-baseline)


## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](providers.md)
