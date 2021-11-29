---
author: memildin
ms.service: defender-for-cloud
ms.topic: include
ms.date: 11/29/2021
ms.author: memildin
ms.custom: generated
---

There are **3** AWS recommendations in this category.

|Recommendation |Description |Severity |
|---|---|---|
|[Azure Defender for Containers should be enabled on your AWS connector](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/11d0f4af-6924-4a2e-8b66-781a4553c828) |Azure Defender for Containers provides real-time threat protection for your containerized environments and generates alerts about suspicious activities.<br>Use this information to harden the security of your Kubernetes clusters and remediate security issues.<br><br>Important: When you've enabled Azure Defender for Containers and deployed Azure Arc to your EKS clusters, the protections - and charges - will begin. If you don't deploy Azure Arc on a cluster, Azure Defender will not protect it and no charges will be incurred for this Azure Defender plan on that cluster. |High |
|[EKS clusters should grant the required AWS permissions to Azure Defender](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7d3a977e-46f1-419a-9046-4bd44db80aac) |Azure Defender provides security capabilities for your EKS clusters. <br> To monitor your cluster for security vulnerabilities and threats, Azure Defender for Containers needs permissions for your AWS account. These permissions will be used to enable Kubernetes control plane logging on your cluster and establish a reliable pipeline between your cluster and Azure Defender&#39;s backend in the cloud. <br> Learn more about Azure Defender&#39;s security features for containerized environments with Azure Defender for Containers <a href="/en-us/azure/security-center/defender-for-kubernetes-introduction">here</a> |High |
|[EKS clusters should have Azure Defender's extension for Azure Arc installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/38307993-84fb-4636-8ce7-3a64466bb5cc) |Azure Defender&#39;s <a href="/en-us/azure/azure-arc/kubernetes/extensions">cluster extension</a> provides security capabilities for your EKS clusters. The extension collects data from a cluster and its nodes to identify security vulnerabilities and threats. <br> The extension works with <a href="/en-us/azure/azure-arc/kubernetes/overview">Azure Arc enabled Kubernetes</a>. If your cluster isn&#39;t connected to Azure Arc enabled Kubernetes, connect it as described in the remediation steps. <br> Learn more about Azure Defender&#39;s security features for containerized environments with Azure Defender for Containers <a href="/en-us/azure/security-center/defender-for-kubernetes-introduction">here</a>. |High |
|||
