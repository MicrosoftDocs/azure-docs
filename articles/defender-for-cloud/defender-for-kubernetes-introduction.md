---
title: Microsoft Defender for Kubernetes - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for Kubernetes.
ms.date: 07/11/2022
author: dcurwin
ms.author: dacurwin
ms.topic: overview
---

# Introduction to Microsoft Defender for Kubernetes (deprecated)

Defender for Cloud provides real-time threat protection for your Azure Kubernetes Service (AKS) containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers.

Threat protection at the cluster level is provided by the analysis of the Kubernetes audit logs.
Host-level threat detection for your Linux AKS nodes is available if you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) and its Log Analytics agent. However, if your cluster is deployed on an Azure Kubernetes Service virtual machine scale set, the Log Analytics agent isn't currently supported.

## Availability

> [!IMPORTANT]
> Microsoft Defender for Kubernetes has been replaced with [**Microsoft Defender for Containers**](defender-for-containers-introduction.md). If you've already enabled Defender for Kubernetes on a subscription, you can continue to use it. However, you won't get Defender for Containers' improvements and new features.
>
> This plan is no longer available for subscriptions where it isn't already enabled.
>
> To upgrade to Microsoft Defender for Containers, open the Defender plans page in the portal and enable the new plan:
>
> :::image type="content" source="media/defender-for-containers/enable-defender-for-containers.png" alt-text="Enable Microsoft Defender for Containers from the Defender plans page.":::
>
> Learn more about this change in [the release note](release-notes-archive.md#microsoft-defender-for-containers-plan-released-for-general-availability-ga).

|Aspect|Details|
|----|:----|
|Release state:|Deprecated (Use [**Microsoft Defender for Containers**](defender-for-containers-introduction.md))|
|Required roles and permissions:|**Security admin** can dismiss alerts.<br>**Security reader** can view findings.|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)|

## What are the benefits of Microsoft Defender for Kubernetes?

Our global team of security researchers constantly monitor the threat landscape. As container-specific alerts and vulnerabilities are discovered, these researchers add them to our threat intelligence feeds and Defender for Cloud alerts you to any that are relevant for your environment.

In addition, Microsoft Defender for Kubernetes provides **cluster-level threat protection** by monitoring your clusters' logs. This means that security alerts are only triggered for actions and deployments that occur *after* you've enabled Defender for Kubernetes on your subscription.

Examples of security events that Microsoft Defenders for Kubernetes monitors include:

- Exposed Kubernetes dashboards
- Creation of high privileged roles
- Creation of sensitive mounts.

For a full list of the cluster level alerts, see alerts with "K8S_" prefix in the alert type in the [reference table of alerts](alerts-reference.md#alerts-k8scluster).

## FAQ - Microsoft Defender for Kubernetes

- [What happens to subscriptions with Microsoft Defender for Kubernetes or Microsoft Defender for Containers enabled?](#what-happens-to-subscriptions-with-microsoft-defender-for-kubernetes-or-microsoft-defender-for-containers-enabled)
- [Is Defender for Containers a mandatory upgrade?](#is-defender-for-containers-a-mandatory-upgrade)
- [How can I calculate my potential price change?](#how-can-i-calculate-my-potential-price-change)

### What happens to subscriptions with Microsoft Defender for Kubernetes or Microsoft Defender for Containers enabled?

Subscriptions that already have one of these plans enabled can continue to benefit from it.

If you haven't enabled them yet, or create a new subscription, these plans can no longer be enabled.

### Is Defender for Containers a mandatory upgrade?

No. Subscriptions that have either Microsoft Defender for Kubernetes or Microsoft Defender for Containers Registries enabled doesn't need to be upgraded to the new Microsoft Defender for Containers plan. However, they won't benefit from the new and improved capabilities and they’ll have an upgrade icon shown alongside them in the Azure portal.

### How can I calculate my potential price change?

In order to help you understand your costs, Defender for Cloud offers the Price Estimation workbook as part of its published Workbooks. The Price Estimation workbook allows you to estimate the expected price for Defender for Cloud plans before enabling them.

Your price is dependent on your container architecture and coverage. Learn [how to enable and use](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-price-estimation-dashboard/ba-p/3247622) the Price Estimation workbook.

## Next steps

In this article, you learned about Kubernetes protection in Defender for Cloud, including Microsoft Defender for Kubernetes.

> [!div class="nextstepaction"]
> [Enable enhanced protections](enable-enhanced-security.md)

For related material, see the following articles:

- [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md)
- [Reference table of alerts](alerts-reference.md)
