---
title: Alert validation in Microsoft Defender for Cloud
description: Learn how to validate that your security alerts are correctly configured in Microsoft Defender for Cloud
ms.topic: how-to
ms.date: 10/06/2022
ms.author: benmansheim
author: bmansheim
---
# Alert validation in Microsoft Defender for Cloud

This document helps you learn how to verify if your system is properly configured for Microsoft Defender for Cloud alerts.

## What are security alerts?

Alerts are the notifications that Defender for Cloud generates when it detects threats on your resources. It prioritizes and lists the alerts along with the information needed to quickly investigate the problem. Defender for Cloud also provides recommendations for how you can remediate an attack.

For more information, see [Security alerts in Defender for Cloud](alerts-overview.md) and [Managing and responding to security alerts](managing-and-responding-alerts.md).

## Prerequisites

To receive all the alerts, your machines and the connected Log Analytics workspaces need to be in the same tenant.

## Generate sample security alerts

If you're using the new, preview alerts experience as described in [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.md), you can create sample alerts from the security alerts page in the Azure portal.

Use sample alerts to:

- evaluate the value and capabilities of your Microsoft Defender plans
- validate any configurations you've made for your security alerts (such as SIEM integrations,  workflow automation, and email notifications)

To create sample alerts:

1. As a user with the role **Subscription Contributor**, from the toolbar on the security alerts page, select **Sample alerts**.
1. Select the subscription.
1. Select the relevant Microsoft Defender plan/s for which you want to see alerts. 
1. Select **Create sample alerts**.

    :::image type="content" source="media/alert-validation/create-sample-alerts-procedures.png" alt-text="Steps to create sample alerts in Microsoft Defender for Cloud.":::
    
    A notification appears letting you know that the sample alerts are being created:

    :::image type="content" source="media/alert-validation/notification-sample-alerts-creation.png" alt-text="Notification that the sample alerts are being generated.":::

    After a few minutes, the alerts appear in the security alerts page. They'll also appear anywhere else that you've configured to receive your Microsoft Defender for Cloud security alerts (connected SIEMs, email notifications, and so on).

    :::image type="content" source="media/alert-validation/sample-alerts.png" alt-text="Sample alerts in the security alerts list.":::

    > [!TIP]
    > The alerts are for simulated resources.

## Simulate alerts on your Azure VMs (Windows) <a name="validate-windows"></a>

After the Log Analytics agent is installed on your machine, follow these steps from the computer where you want to be the attacked resource of the alert:

1. Copy an executable (for example **calc.exe**) to the computer's desktop, or other directory of your convenience, and rename it as **ASC_AlertTest_662jfi039N.exe**.
1. Open the command prompt and execute this file with an argument (just a fake argument name), such as: ```ASC_AlertTest_662jfi039N.exe -foo```
1. Wait 5 to 10 minutes and open Defender for Cloud Alerts. An alert should appear.

> [!NOTE]
> When reviewing this test alert for Windows, make sure the field **Arguments Auditing Enabled** is **true**. If it is **false**, then you need to enable command-line arguments auditing. To enable it, use the following command:
>
>```reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\system\Audit" /f /v "ProcessCreationIncludeCmdLine_Enabled"```

## Simulate alerts on your Azure VMs (Linux) <a name="validate-linux"></a>

After the Log Analytics agent is installed on your machine, follow these steps from the computer where you want to be the attacked resource of the alert:

1. Copy an executable to a convenient location and rename it to `./asc_alerttest_662jfi039n`. For example:

    `cp /bin/echo ./asc_alerttest_662jfi039n`

1. Open the command prompt and execute this file:

    `./asc_alerttest_662jfi039n testing eicar pipe`

1. Wait 5 to 10 minutes and then open Defender for Cloud Alerts. An alert should appear.

## Simulate alerts on Kubernetes <a name="validate-kubernetes"></a>

Defender for Containers provides security alerts for both your clusters and underlying cluster nodes. Defender for Containers accomplishes this by monitoring both the control plane (API server) and the containerized workload.

You can tell if your alert is related to the control plan or the containerized workload based on its prefix. Control plane security alerts have a prefix of `K8S_`, while security alerts for runtime workload in the clusters have a prefix of `K8S.NODE_`.

You can simulate alerts for both of the control plane, and workload alerts with the following steps.

### Simulate control plane alerts (K8S_ prefix)

**Prerequisites**

- Ensure the Defender for Containers plan is enabled.
- **ARC only** - Ensure the Defender extension is installed.
- **EKS or GKE only** - Ensure the default audit log collection auto-provisioning options are enabled.

**To simulate a Kubernetes control plane security alert**: 

1. Run the following command from the cluster: 

    ```bash
    kubectl get pods --namespace=asc-alerttest-662jfi039n
    ```

    You'll get the following response: `No resource found`.

1. Wait 30 minutes.

1. In the Azure portal, navigate to the Defender for Cloud's security alerts page.

1. On the relevant Kubernetes cluster, locate the following alert `Microsoft Defender for Cloud test alert for K8S (not a threat)` 

### Simulate workload alerts (K8S.NODE_ prefix)

**Prerequisites**

- Ensure the Defender for Containers plan is enabled.
- Ensure the Defender profile\extension is installed 

**To simulate a a Kubernetes workload security alert**:
 
1. Create a pod to run a test command on. This pod can be any of the existing pods in the cluster, or a new pod. You can create using this sample yaml configuration:
    
    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
        name: mdc-test
    spec:
        containers:
            - name: mdc-test
              image: ubuntu:18.04
              command: ["/bin/sh"]
              args: ["-c", "while true; do echo sleeping; sleep 3600;done"]
    ```

    To create the pod run:
    
    ```bash
    kubectl apply -f <path_to_the_yaml_file>
    ```

1. Run the following command from the cluster:

    ```bash
    kubectl exec -it mdc-test -- bash
    ```

1. Copy the executable to a separate location and rename it to `./asc_alerttest_662jfi039n` with the following command `cp /bin/echo ./asc_alerttest_662jfi039n`.

1. Execute the file `./asc_alerttest_662jfi039n testing eicar pipe`.

1. Wait 10 minutes.

1. In the Azure portal, navigate to the Defender for Cloud's security alerts page.

1. On the relevant AKS cluster, locate the following alert `Microsoft Defender for Cloud test alert (not a threat)`.

You can also learn more about defending your Kubernetes nodes and clusters with [Microsoft Defender for Containers](defender-for-containers-introduction.md).

## Next steps
This article introduced you to the alerts validation process. Now that you're familiar with this validation, try the following articles:

- [Validating Azure Key Vault threat detection in Microsoft Defender for Cloud](https://techcommunity.microsoft.com/t5/azure-security-center/validating-azure-key-vault-threat-detection-in-azure-security/ba-p/1220336)
- [Managing and responding to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.md) - Learn how to manage alerts, and respond to security incidents in Defender for Cloud.
- [Understanding security alerts in Microsoft Defender for Cloud](./alerts-overview.md)
