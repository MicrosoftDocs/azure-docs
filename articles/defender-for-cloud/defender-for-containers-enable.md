---
title: How to enable Microsoft Defender for Containers components
description: Enable the container protections of Microsoft Defender for Containers
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.custom: ignite-2022, devx-track-azurecli
zone_pivot_groups: k8s-host
ms.date: 06/29/2023
---

# How to enable Microsoft Defender for Containers components

Microsoft Defender for Containers is the cloud-native solution for securing your containers.

Defender for Containers protects your clusters whether they're running in:

- **Azure Kubernetes Service (AKS)** - Microsoft's managed service for developing, deploying, and managing containerized applications.

- **Amazon Elastic Kubernetes Service (EKS) in a connected Amazon Web Services (AWS) account** - Amazon's managed service for running Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane or nodes.

- **Google Kubernetes Engine (GKE) in a connected Google Cloud Platform (GCP) project** - Google’s managed environment for deploying, managing, and scaling applications using GCP infrastructure.

- **Other Kubernetes distributions** (using Azure Arc-enabled Kubernetes) - Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters hosted on-premises or on IaaS. For more information, see the **On-prem/IaaS (Arc)** section of [Supported features by environment](supported-machines-endpoint-solutions-clouds-containers.md#supported-features-by-environment).

Learn about this plan in [Overview of Microsoft Defender for Containers](defender-for-containers-introduction.md).

You can first learn how to connect and protect your containers in these articles:

- [Protect your Azure containers with Defender for Containers](tutorial-enable-containers-azure.md)
- [Protect your on-premises Kubernetes clusters with Defender for Containers](tutorial-enable-containers-arc.md)
- [Protect your Amazon Web Service (AWS) accounts containers with Defender for Containers](tutorial-enable-container-aws.md)
- [Protect your Google Cloud Platform (GCP) project containers with Defender for Containers](tutorial-enable-container-gcp.md)

You can also learn more by watching these videos from the Defender for Cloud in the Field video series:

- [Microsoft Defender for Containers in a multicloud environment](episode-nine.md)
- [Protect Containers in GCP with Defender for Containers](episode-ten.md)

::: zone pivot="defender-for-container-arc,defender-for-container-eks,defender-for-container-gke"
> [!NOTE]
> Defender for Containers' support for Arc-enabled Kubernetes clusters, AWS EKS, and GCP GKE is a preview feature. The preview feature is available on a self-service, opt-in basis.
>
> Previews are provided "as is" and "as available" and are excluded from the service level agreements and limited warranty.
>
> To learn more about the supported operating systems, feature availability, outbound proxy and more, see the [Defender for Containers feature availability](supported-machines-endpoint-solutions-clouds-containers.md).
::: zone-end

::: zone pivot="defender-for-container-aks"
[!INCLUDE [Prerequisites](./includes/defender-for-container-prerequisites-aks.md)]
::: zone-end

::: zone pivot="defender-for-container-arc,defender-for-container-eks,defender-for-container-gke"
[!INCLUDE [Prerequisites](./includes/defender-for-container-prerequisites-arc-eks-gke.md)]
::: zone-end

::: zone pivot="defender-for-container-aks"
[!INCLUDE [Enable plan for AKS](./includes/defender-for-containers-enable-plan-aks.md)]
::: zone-end

::: zone pivot="defender-for-container-arc"
[!INCLUDE [Enable plan for Arc](./includes/defender-for-containers-enable-plan-arc.md)]
::: zone-end

::: zone pivot="defender-for-container-eks"
[!INCLUDE [Enable plan for EKS](./includes/defender-for-containers-enable-plan-eks.md)]
::: zone-end

::: zone pivot="defender-for-container-gke"
[!INCLUDE [Enable plan for GKE](./includes/defender-for-containers-enable-plan-gke.md)]
::: zone-end

## Simulate security alerts from Microsoft Defender for Containers

A full list of supported alerts is available in the [reference table of all Defender for Cloud security alerts](alerts-reference.md#alerts-k8scluster).

1. To simulate a security alert, run the following command from the cluster:

    ```console
    kubectl get pods --namespace=asc-alerttest-662jfi039n
    ```

    The expected response is `No resource found`.

    Within 30 minutes, Defender for Cloud detects this activity and trigger a security alert.

1. In the Azure portal, open Microsoft Defender for Cloud's security alerts page and look for the alert on the relevant resource:

    :::image type="content" source="media/defender-for-kubernetes-azure-arc/sample-kubernetes-security-alert.png" alt-text="Sample alert from Microsoft Defender for Kubernetes." lightbox="media/defender-for-kubernetes-azure-arc/sample-kubernetes-security-alert.png":::

::: zone pivot="defender-for-container-arc,defender-for-container-eks,defender-for-container-gke"
[!INCLUDE [Remove the agent](./includes/defender-for-containers-remove-extension.md)]
::: zone-end

::: zone pivot="defender-for-container-aks"
[!INCLUDE [Assign a custom workspace](./includes/defender-for-containers-assign-workspace-aks.md)]
::: zone-end

::: zone pivot="defender-for-container-arc"
[!INCLUDE [Assign a custom workspace](./includes/defender-for-containers-assign-workspace-arc.md)]
::: zone-end

::: zone pivot="defender-for-container-aks"
[!INCLUDE [Remove the agent](./includes/defender-for-containers-remove-profile.md)]
::: zone-end

## Learn more

You can check out the following blogs:

- [Protect your Google Cloud workloads with Microsoft Defender for Cloud](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/protect-your-google-cloud-workloads-with-microsoft-defender-for/ba-p/3073360)
- [Introducing Microsoft Defender for Containers](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/introducing-microsoft-defender-for-containers/ba-p/2952317)
- [A new name for multicloud security: Microsoft Defender for Cloud](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/a-new-name-for-multi-cloud-security-microsoft-defender-for-cloud/ba-p/2943020)

## Next steps

Now that you enabled Defender for Containers, you can:

- [Scan your ACR images for vulnerabilities](defender-for-containers-vulnerability-assessment-azure.md)
- [Scan your Amazon AWS ECR images for vulnerabilities](defender-for-containers-vulnerability-assessment-elastic.md)
- Check out [common questions](faq-defender-for-containers.yml) about Defender for Containers.
