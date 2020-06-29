---
title: Alert validation (EICAR test file) in Azure Security Center | Microsoft Docs
description: This document helps you to validate the security alerts in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: f8f17a55-e672-4d86-8ba9-6c3ce2e71a57
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date:  11/04/2019
ms.author: memildin

---
# Alert validation (EICAR test file) in Azure Security Center
This document helps you learn how to verify if your system is properly configured for Azure Security Center alerts.

## What are security alerts?
Alerts are the notifications that Security Center generates when it detects threats on your resources. It prioritizes and lists the alerts along with the information needed to quickly investigate the problem. Security Center also provides recommendations for how you can remediate an attack.
For more information, see [Security alerts in Security Center](security-center-alerts-overview.md) and [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md)

## Alert validation

* [Windows](#validate-windows)
* [Linux](#validate-linux)
* [Kubernetes](#validate-kubernetes)

## Validate alerts on Windows VMs <a name="validate-windows"></a>

After Security Center agent is installed on your computer, follow these steps from the computer where you want to be the attacked resource of the alert:

1. Copy an executable (for example **calc.exe**) to the computer's desktop, or other directory of your convenience, and rename it as **ASC_AlertTest_662jfi039N.exe**.
1. Open the command prompt and execute this file with an argument (just a fake argument name), such as: ```ASC_AlertTest_662jfi039N.exe -foo```
1. Wait 5 to 10 minutes and open Security Center Alerts. An alert should appear.

> [!NOTE]
> When reviewing this test alert for Windows, make sure the field **Arguments Auditing Enabled** is **true**. If it is **false**, then you need to enable command-line arguments auditing. To enable it, use the following command:
>
>```reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\system\Audit" /f /v "ProcessCreationIncludeCmdLine_Enabled"```

## Validate alerts on Linux VMs <a name="validate-linux"></a>

After Security Center agent is installed on your computer, follow these steps from the computer where you want to be the attacked resource of the alert:
1. Copy an executable to a convenient location and rename it to **./asc_alerttest_662jfi039n**, for example:

    ```cp /bin/echo ./asc_alerttest_662jfi039n```

1. Open the command prompt and execute this file:

    ```./asc_alerttest_662jfi039n testing eicar pipe```

1. Wait 5 to 10 minutes and open Security Center Alerts. An alert should appear.


## Validate alerts on Kubernetes <a name="validate-kubernetes"></a>

If you're using the Security Center preview feature of integrating Azure Kubernetes Service, run the following kubectl command to test that your alerts are working:

```kubectl get pods --namespace=asc-alerttest-662jfi039n```

For more information about the integration of Azure Kubernetes Service and Azure Security Center, see [this article](azure-kubernetes-service-integration.md).

## Next steps
This article introduced you to the alerts validation process. Now that you're familiar with this validation, try the following articles:

* [Validating Azure Key Vault Threat Detection in Azure Security Center](https://techcommunity.microsoft.com/t5/azure-security-center/validating-azure-key-vault-threat-detection-in-azure-security/ba-p/1220336)
* [Managing and responding to security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts) - Learn how to manage alerts, and respond to security incidents in Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) - Learn how to monitor the health of your Azure resources.
* [Understanding security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-type) - Learn about the different types of security alerts.
