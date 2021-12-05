---
title: Container security with Microsoft Defender for Cloud
description: Learn about Microsoft Defender for Containers (preview)
ms.topic: overview
ms.date: 12/06/2021
---
# Overview of Microsoft Defender for Containers

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Defender for Containers is the cloud-native solution for securing your containers.

This plan merges the capabilities of two existing Microsoft Defender plans, "Defender for Kubernetes" and "Defender for Container registries", and provides new and improved features without deprecating any of the functionality from those plans.

This page describes how you can use Defender for Containers to improve, monitor, and maintain the security of your clusters, containers, and their applications.

You'll learn how Defender for Cloud helps with the core aspects of container security.

## Availability

[MERGE REGISTRIES rows together and also the K8s distros rows]

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|**Microsoft Defender for Containers** is free for the month of December 2021. After that, it will be billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/security-center/) (which will be updated on 20th December 2021) |
|Supported registries and images:| • Linux images in Azure Container Registry (ACR) registries accessible from the public internet with shell access<br> • Private registries with access granted to [Trusted Services](../container-registry/allow-access-trusted-services.md#trusted-services)<br> • [ACR registries protected with Azure Private Link](../container-registry/container-registry-private-link.md)|
|Unsupported registries and images:| • Windows images<br> • Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images<br> • "Distroless" images that only contain an application and its runtime dependencies without a package manager, shell, or OS<br> • Images with [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md)|
|Supported Kubernetes distributions | Any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters |
|Tested Kubernetes distributions for Azure Arc protections | [Azure Kubernetes Service on Azure Stack HCI](/azure-stack/aks-hci/overview)<br>[Kubernetes](https://kubernetes.io/docs/home/)<br> [AKS Engine](https://github.com/Azure/aks-engine)<br> [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)<br> [Red Hat OpenShift](https://www.openshift.com/learn/topics/kubernetes/) (version 4.6 or newer)<br> [VMware Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid)<br> [Rancher Kubernetes Engine](https://rancher.com/docs/rke/latest/en/) |
|Required roles and permissions:| • To auto provision the required components, [Contributor](../role-based-access-control/built-in-roles.md#contributor), [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor), or [Azure Kubernetes Service Contributor Role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-contributor-role)<br> • **Security admin** can dismiss alerts<br> • **Security reader** can view vulnerability assessment findings<br> See also [Azure Container Registry roles and permissions](../container-registry/container-registry-roles.md)|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Azure China 21Vianet)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts (Preview)|
|||

## What are the benefits of Microsoft Defender for Containers?

Defender for Cloud helps with the core aspects of container security:

- **Environment hardening** - Defender for Containers protects your Kubernetes clusters whether they're running on Azure Kubernetes Service, Kubernetes on-prem / IaaS, or Amazon EKS. By continuously assessing clusters, Defender for Containers provides visibility into misconfigurations and guidelines to help mitigate identified threats. Learn more in [Environment hardening through security recommendations](#environment-hardening-through-security-recommendations).

- **Vulnerability assessment scanning** - Vulnerability assessment and management tools for images **stored** in ACR registries and **running** in Azure Kubernetes Service. Learn more in [Vulnerability management - scanning container images](#vulnerability-management---scanning-container-images)

- **Run-time threat protection for nodes and clusters** - Threat protection for clusters and Linux nodes generates security alerts for suspicious activities. Learn more in [Run-time protection for Kubernetes nodes and clusters](#run-time-protection-for-kubernetes-nodes-and-clusters).


## Architecture overview

This is a high-level diagram of the interaction between Microsoft Defender for Cloud, Azure Kubernetes Service, Azure Arc-enabled Kubernetes, and Azure Policy:

SLIDE #4 (AKS) - update the value - Agentless collection of audit log info. Frictionless.  

SLIDE #7 - arc - Arc is needed to collect all three things outlined in the bullets below (explain)
    For all Kubernetes clusters other than AKS, you'll need to connect your cluster to Azure Arc. Once connected, Microsoft Defender for Kubernetes can be deployed on [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) resources as a [cluster extension](../azure-arc/kubernetes/extensions.md).
    The extension components collect Kubernetes audit logs data from all control plane nodes in the cluster and send them to the Microsoft Defender for Kubernetes backend in the cloud for further analysis. The extension is registered with a Log Analytics workspace used as a data pipeline, but the audit log data isn't stored in the Log Analytics workspace.
    This diagram shows the interaction between Microsoft Defender for Kubernetes and the Azure Arc-enabled Kubernetes cluster:

    As explained in [this Azure Policy for Kubernetes page](../governance/policy/concepts/policy-for-kubernetes.md), the add-on extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/). Kubernetes admission controllers are plugins that enforce how your clusters are used. The add-on registers as a web hook to Kubernetes admission control and makes it possible to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.


SLIDE 10 (EKS) - update the value - Arc is needed to collect policy and config data from nodes. We use AWS's CloudWatch to collect log data. (Mention that the AWS account needs to be connected with the new mechanism. Configuration needs Multi-cloud cspm.)

:::image type="content" source="./media/defender-for-containers/defender-for-containers-high-level.png" alt-text="High-level architecture of the interaction between Microsoft Defender for Containers, Azure Kubernetes Service, Azure Arc-enabled Kubernetes, and Azure Policy." lightbox="./media/defender-for-containers/defender-for-containers-high-level.png":::

You can see that the items received and analyzed by Defender for Cloud include:

- audit logs and security events from the API server
- cluster configuration information from the AKS cluster
- workload configuration from Azure Policy 


## Environment hardening through security recommendations

### Continuous monitoring of your Kubernetes clusters - wherever they're hosted

Defender for Cloud continuously assesses the configurations of your clusters and compares them with the initiatives applied to your subscriptions. When it finds misconfigurations, Defender for Cloud generates security recommendations. Use Defender for Cloud's **recommendations page** to view recommendations and remediate issues. For details of the relevant Defender for Cloud recommendations that might appear for this feature, see the [compute section](recommendations-reference.md#recs-compute) of the recommendations reference table.

For Kubernetes clusters on EKS, you'll need to connect your AWS account to Microsoft Defender for Cloud via the environment settings page as described in [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md). Then ensure you've enabled the CSPM plan.

For details of the relevant Defender for Cloud recommendations that might appear for this feature, see the [compute section](recommendations-reference.md#recs-compute) of the recommendations reference table.

When reviewing the outstanding recommendations for your container-related resources, whether in asset inventory or the recommendations page, you can use the resource filter: [gif]

### Workload protection best-practices using Kubernetes admission control

For a bundle of recommendations to protect the workloads of your Kubernetes containers, install the **Azure Policy for Kubernetes**. You can also auto deploy this component as explained in [enable auto provisioning of agents and extensions](enable-data-collection.md#auto-provision-mma). By default, auto provisioning is enabled when you enable Defender for Containers. 

With the add-on on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure to **enforce** the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Protect your Kubernetes workloads](kubernetes-workload-protections.md).

## Vulnerability assessment

### Scanning images in ACR registries

With Defender for Containers enabled on subscriptions with Azure Container Registry registries, Defender for Cloud scans any images pulled within the last 30 days, pushed to your registry, or imported. The integrated vulnerability scanner is provided by the industry-leading vulnerability scanning vendor, Qualys.

When issues are found – by Qualys or Defender for Cloud – you'll get notified in the [Workload protections dashboard](workload-protections-dashboard.md). For every vulnerability, Defender for Cloud provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue. For details of Defender for Cloud's recommendations for containers, see the [reference list of recommendations](recommendations-reference.md#recs-compute).

Defender for Cloud filters and classifies findings from the scanner. When an image is healthy, Defender for Cloud marks it as such. Defender for Cloud generates security recommendations only for images that have issues to be resolved. By only notifying when there are problems, Defender for Cloud reduces the potential for unwanted informational alerts.

### Scanning images at runtime

Defender for Containers expands on the registry scanning features of the Defender for container registries plan by introducing run-time visibility of vulnerabilities.


### Run-time protection for Kubernetes nodes and clusters

Defender for Cloud provides real-time threat protection for your containerized environments and generates alerts for suspicious activities. You can use this information to quickly remediate security issues and improve the security of your containers.

Defender for Cloud provides threat protection at the cluster level by analyzing the Kubernetes audit logs. Examples of events at this level include exposed Kubernetes dashboards, creation of high privileged roles, and the creation of sensitive mounts. For a list of the cluster level alerts, see the [Reference table of alerts](../articles/security-center/alerts-reference.md#alerts-k8scluster).

Our global team of security researchers constantly monitor the threat landscape. They add container-specific alerts and vulnerabilities as they're discovered.






## Next steps

In this overview, you learned about the core elements of container security in Microsoft Defender for Cloud. For related material see:

- [Introduction to Microsoft Defender for Kubernetes](defender-for-kubernetes-introduction.md)
- [Introduction to Microsoft Defender for container registries](defender-for-container-registries-introduction.md)
