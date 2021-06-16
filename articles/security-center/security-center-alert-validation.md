---
title: Alert validation in Azure Security Center | Microsoft Docs
description: Learn how to validate that your security alerts are correctly configured in Azure Security Center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date:  03/17/2021
ms.author: memildin

---
# Alert validation in Azure Security Center
This document helps you learn how to verify if your system is properly configured for Azure Security Center alerts.

## What are security alerts?
Alerts are the notifications that Security Center generates when it detects threats on your resources. It prioritizes and lists the alerts along with the information needed to quickly investigate the problem. Security Center also provides recommendations for how you can remediate an attack.
For more information, see [Security alerts in Security Center](security-center-alerts-overview.md) and [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md)


## Generate sample Azure Defender alerts

If you're using the new, preview alerts experience as described in [Manage and respond to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md), you can create sample alerts in a few clicks from the security alerts page in the Azure portal.

Use sample alerts to:

- evaluate the value and capabilities of Azure Defender
- validate any configurations you've made for your security alerts (such as SIEM integrations,  workflow automation, and email notifications)

To create sample alerts:

1. As a user with the role **Security admin** or **Subscription Contributor**, from the toolbar on the alerts page, select **Create sample alerts**.
1. Select the subscription.
1. Select the relevant Azure Defender plan/s for which you want to see alerts. 
1. Select **Create sample alerts**.

    :::image type="content" source="media/security-center-alert-validation/create-sample-alerts-procedures.png" alt-text="Steps to create sample alerts in Azure Security Center":::
    
    A notification appears letting you know that the sample alerts are being created:

    :::image type="content" source="media/security-center-alert-validation/notification-sample-alerts-creation.png" alt-text="Notification that the sample alerts are being generated.":::

    After a few minutes, the alerts appear in the security alerts page. They'll also appear anywhere else that you've configured to receive your Azure Security Center security alerts (connected SIEMs, email notifications, and so on).

    :::image type="content" source="media/security-center-alert-validation/sample-alerts.png" alt-text="Sample alerts in the security alerts list":::

    > [!TIP]
    > The alerts are for simulated resources.

## Simulate alerts on your Azure VMs (Windows) <a name="validate-windows"></a>

After Security Center agent is installed on your computer, follow these steps from the computer where you want to be the attacked resource of the alert:

1. Copy an executable (for example **calc.exe**) to the computer's desktop, or other directory of your convenience, and rename it as **ASC_AlertTest_662jfi039N.exe**.
1. Open the command prompt and execute this file with an argument (just a fake argument name), such as: ```ASC_AlertTest_662jfi039N.exe -foo```
1. Wait 5 to 10 minutes and open Security Center Alerts. An alert should appear.

> [!NOTE]
> When reviewing this test alert for Windows, make sure the field **Arguments Auditing Enabled** is **true**. If it is **false**, then you need to enable command-line arguments auditing. To enable it, use the following command:
>
>```reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\system\Audit" /f /v "ProcessCreationIncludeCmdLine_Enabled"```

## Simulate alerts on your Azure VMs (Linux) <a name="validate-linux"></a>

After Security Center agent is installed on your computer, follow these steps from the computer where you want to be the attacked resource of the alert:
1. Copy an executable to a convenient location and rename it to **./asc_alerttest_662jfi039n**, for example:

    ```cp /bin/echo ./asc_alerttest_662jfi039n```

1. Open the command prompt and execute this file:

    ```./asc_alerttest_662jfi039n testing eicar pipe```

1. Wait 5 to 10 minutes and open Security Center Alerts. An alert should appear.


## Simulate alerts on Kubernetes <a name="validate-kubernetes"></a>

If you've integrated Azure Kubernetes Service with Security Center, you can test that your alerts are working with the following kubectl command:

```kubectl get pods --namespace=asc-alerttest-662jfi039n```

For more information about defending your Kubernetes nodes and clusters, see [Introduction to Azure Defender for Kubernetes](defender-for-kubernetes-introduction.md)

## Next steps
This article introduced you to the alerts validation process. Now that you're familiar with this validation, try the following articles:

* [Validating Azure Key Vault Threat Detection in Azure Security Center](https://techcommunity.microsoft.com/t5/azure-security-center/validating-azure-key-vault-threat-detection-in-azure-security/ba-p/1220336)
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) - Learn how to manage alerts, and respond to security incidents in Security Center.
* [Understanding security alerts in Azure Security Center](./security-center-alerts-overview.md) - Learn about the different types of security alerts.