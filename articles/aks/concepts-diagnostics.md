---
title: Concepts - Azure Kubernetes Service Diagnostics (AKS) Overview
description: Learn about self-diagnosing clusters in Azure Kubernetes Service.
services: container-service
author: yunjchoi

ms.service: container-service
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: yunjchoi
---

# AKS Diagnostics overview

Sometimes good clusters can go through bad times. Cluster issues can be dreadful especially When running mission critical workloads. AKS Diagnostics is an intelligent self-diagnostic experience to help you identify and resolve problems in your cluster. This cloud-native offering will help you find the issue of your cluster and guide you to the right information to easily and quickly troubleshoot the issue with no extra configuration and billing cost.

## Open AKS Diagnostics

To access AKS Diagnostics, navigate to your Kubernetes cluster in the [Azure portal](https://portal.azure.com). In the left navigation, click on **Diagnose and solve problems**.

In the AKS Diagnostics homepage, you can choose a category that best describes the issue of your cluster by using the keywords in the homepage tile.

![Homepage](./media/concepts-diagnostics/aks-diagnostics-homepage.png)

## Diagnostic report

After you choose to investigate the issue by clicking on a category, you can view cluster-specific diagnostic metrics related to the topic often supplemented with textual description of the issue, recommended actions with links to helpful docs, and logging data. Diagnostic reports are generated intelligently based on the current state of your cluster after running variety of checks and can be a powerful tool for pinpointing the problem of your cluster and finding the next steps to resolve the issue.

![Diagnostic Report](./media/concepts-diagnostics/diagnostic-report.png)

![Expanded Diagnostic Report](./media/concepts-diagnostics/expanded-diagnostic-report.png)

Below are the types of checks available in **Cluster Insights**.

### Cluster Node Issues

**Cluster Node Issues** checks for node-related issues that may cause the node of your cluster to behave unexpectedly.

- Node readiness
- Node failures
- Insufficient resources
- Node missing IP configuration
- Node CNI failures
- Node not found
- Node power off
- Node authentication failure
- Node kube-proxy stale

### Create, Read, Update & Delete Operations

**CRUD Operations** checks for any CRUD operations that may cause issues in your cluster.

- In use subnet delete operation error
- Network security group delete operation error
- In use route table delete operation error
- Referenced resource provisioning error
- Public IP address delete operation error
- Deployment failure due to quota
- Operation error due to organization policy
- Missing subscription registration
- VM extension provisioning error
- Subnet capacity
- Exceeded quota

### Identity and Security Management

**Identity and security Management** detects authentication and authorization errors that may prevent communication to your cluster.

- Node authorization failures
- 401 errors
- 403 errors
