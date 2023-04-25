---
title: Securoty baseline for Azure Monitor for SAP solutions
description: Learn about securoty bseline for Azure Monitor for SAP solutions
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

This security baseline applies guidance from the Microsoft cloud security benchmark version 1.0. The Microsoft cloud security benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the security controls defined by the Microsoft cloud security benchmark and the related guidance.

You can monitor this security baseline and its recommendations using Microsoft Defender for Cloud. Azure Policy definitions will be listed in the Regulatory Compliance section of the Microsoft Defender for Cloud dashboard.

When a feature has relevant Azure Policy Definitions, they are listed in this baseline to help you measure compliance to the Microsoft cloud security benchmark controls and recommendations. Some recommendations may require a paid Microsoft Defender plan to enable certain security scenarios.

When Azure Monitor for SAP solutions is deployed, a managed resource group is deplpoyed with it. 
This managed resource group contains services such as Azure Log Analytics, Azure Functions, Azure Storage and Azure Key Vault. 
Security baseline for all these services are as follows:

[Azure Log Anlytics](https://learn.microsoft.com/security/benchmark/azure/baselines/azure-monitor-security-baseline![image](https://user-images.githubusercontent.com/33844181/234364811-74d85df3-9fa7-4046-826d-537aef27d482.png)
)
[Azure Functions](https://learn.microsoft.com/security/benchmark/azure/baselines/functions-security-baseline![image](https://user-images.githubusercontent.com/33844181/234364962-03fab8ba-ef4f-4d03-88a2-5c048f5a2294.png)
)
[Azure Storage]( https://learn.microsoft.com/security/benchmark/azure/baselines/storage-security-baseline![image](https://user-images.githubusercontent.com/33844181/234365059-d3e5b8ce-fcc8-471f-a281-ceb243077af2.png)
)
[Azure Key Vault](https://learn.microsoft.com/security/benchmark/azure/baselines/key-vault-security-baseline![image](https://user-images.githubusercontent.com/33844181/234364996-dfdb1809-034d-4ccb-a403-f8ba47f2340d.png)
)


## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](providers.md)
