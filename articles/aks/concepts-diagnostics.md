---
title: Azure Kubernetes Service (AKS) Diagnostics Overview
description: Learn about self-diagnosing clusters in Azure Kubernetes Service.
services: container-service
author: yunjchoi

ms.service: container-service
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: yunjchoi
---

# Azure Kubernetes Service (AKS) Diagnostics overview

Troubleshooting Azure Kubernetes Service (AKS) cluster issues is an important part of maintaining your cluster, especially if your cluster is running mission-critical workloads. AKS Diagnostics is an intelligent, self-diagnostic experience that helps you identify and resolve problems in your cluster. AKS Diagnostics is cloud-native, and you can use it with no extra configuration or billing cost.

## Open AKS Diagnostics

To access AKS Diagnostics:

- Navigate to your Kubernetes cluster in the [Azure portal](https://portal.azure.com).
- Click on **Diagnose and solve problems** in the left navigation, which opens AKS Diagnostics.
- Choose a category that best describes the issue of your cluster by using the keywords in the homepage tile, or type a keyword that best describes your issue in the search bar, for example _Cluster Node Issues_.

![Homepage](./media/concepts-diagnostics/aks-diagnostics-homepage.png)

## View a diagnostic report

After you click on a category, you can view a diagnostic report specific to your cluster. Diagnostic report intelligently calls out if there is any issue in your cluster with status icons. You can drill down on each topic by clicking on **More Info** to see detailed description of the issue, recommended actions, links to helpful docs, related-metrics, and logging data. Diagnostic reports are intelligently generated based on the current state of your cluster after running a variety of checks. Diagnostic reports can be a useful tool for pinpointing the problem of your cluster and finding the next steps to resolve the issue.

![Diagnostic Report](./media/concepts-diagnostics/diagnostic-report.png)

![Expanded Diagnostic Report](./media/concepts-diagnostics/node-issues.png)

## Cluster Insights

The following diagnostic checks are available in **Cluster Insights**.

### Cluster Node Issues

Cluster Node Issues checks for node-related issues that may cause your cluster to behave unexpectedly.

- Node readiness issues
- Node failures
- Insufficient resources
- Node missing IP configuration
- Node CNI failures
- Node not found
- Node power off
- Node authentication failure
- Node kube-proxy stale

### Create, read, update & delete operations

CRUD Operations checks for any CRUD operations that may cause issues in your cluster.

- In-use subnet delete operation error
- Network security group delete operation error
- In-use route table delete operation error
- Referenced resource provisioning error
- Public IP address delete operation error
- Deployment failure due to deployment quota
- Operation error due to organization policy
- Missing subscription registration
- VM extension provisioning error
- Subnet capacity
- Quota exceeded error

### Identity and security management

Identity and Security Management detects authentication and authorization errors that may prevent communication to your cluster.

- Node authorization failures
- 401 errors
- 403 errors

## Next steps

Collect logs to help you further troubleshoot your cluster issues by using [AKS Periscope](https://aka.ms/aksperiscope).

Post your questions or feedback at [UserVoice](https://feedback.azure.com/forums/914020-azure-kubernetes-service-aks) by adding "[Diag]" in the title.
