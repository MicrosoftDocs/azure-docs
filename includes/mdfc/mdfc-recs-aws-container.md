---
author: memildin
ms.service: defender-for-cloud
ms.topic: include
ms.date: 01/12/2022
ms.author: memildin
ms.custom: generated
---

There are **3** AWS recommendations in this category.

|Recommendation |Description |Severity |
|---|---|---|
|[EKS clusters should grant the required AWS permissions to Microsoft Defender for Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7d3a977e-46f1-419a-9046-4bd44db80aac) |Microsoft Defender for Containers provides protections for your EKS clusters. <br> To monitor your cluster for security vulnerabilities and threats, Defender for Containers needs permissions for your AWS account. These permissions will be used to enable Kubernetes control plane logging on your cluster and establish a reliable pipeline between your cluster and Defender for Cloud's backend in the cloud. <br> Learn more about <a href="/azure/security-center/defender-for-kubernetes-introduction">Microsoft Defender for Cloud's security features for containerized environments</a>. |High |
|[EKS clusters should have Microsoft Defender's extension for Azure Arc installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/38307993-84fb-4636-8ce7-3a64466bb5cc) |Microsoft Defender's <a href="/azure/azure-arc/kubernetes/extensions">cluster extension</a> provides security capabilities for your EKS clusters. The extension collects data from a cluster and its nodes to identify security vulnerabilities and threats. <br> The extension works with <a href="/azure/azure-arc/kubernetes/overview">Azure Arc-enabled Kubernetes</a>. If your cluster isn't connected to Azure Arc-enabled Kubernetes, connect it as described in the remediation steps. <br>Learn more about <a href="/azure/security-center/defender-for-kubernetes-introduction">Microsoft Defender for Cloud's security features for containerized environments</a>. |High |
|[Microsoft Defender for Containers should be enabled on AWS connectors](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/11d0f4af-6924-4a2e-8b66-781a4553c828) |Microsoft Defender for Containers provides real-time threat protection for containerized environments and generates alerts about suspicious activities.<br>Use this information to harden the security of Kubernetes clusters and remediate security issues.<br><br>Important: When you've enabled Microsoft Defender for Containers and deployed Azure Arc to your EKS clusters, the protections - and charges - will begin. If you don't deploy Azure Arc on a cluster, Defender for Containers will not protect it and no charges will be incurred for this Microsoft Defender plan for that cluster. |High |
|||
