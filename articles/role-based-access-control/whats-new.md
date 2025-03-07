---
title: What's new in Azure RBAC documentation
description: Learn about the new features and documentation improvements in Azure role-based access control (RBAC).
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.topic: whats-new
ms.date: 02/26/2025
ms.author: rolyon

---

# What's new in Azure RBAC documentation

This article provides information about new features and documentation improvements in Azure role-based access control (RBAC).

## 2025

| Date | Area | Description |
| --- | --- | --- |
| February 2025 | Limits | Updates to [Azure RBAC limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-rbac-limits). |
| February 2025 | Roles | Added [Chaos Studio Target Contributor](built-in-roles/devops.md#chaos-studio-target-contributor) role. |
| February 2025 | Security | Added instructions for how to detect elevate access events using Microsoft Sentinel. See [Detect elevate access events using Microsoft Sentinel](elevate-access-global-admin.md#detect-elevate-access-events-using-microsoft-sentinel). |
| February 2025 | Permissions | Updated list of permissions for the Azure Container Registry. See [Microsoft.ContainerRegistry](permissions/containers.md#microsoftcontainerregistry). |
| February 2025 | Roles | Added [Locks Contributor](built-in-roles/security.md#locks-contributor) role. |
| February 2025 | Subscriptions | Updated list of known impact when transferring a subscription. See [Understand the impact of transferring a subscription](transfer-subscription.md#understand-the-impact-of-transferring-a-subscription). |
| January 2025 | Security | Preview of elevate access log entries in the Microsoft Entra directory audit logs. See [View elevate access log entries](elevate-access-global-admin.md#view-elevate-access-log-entries). |
| January 2025 | Roles | Updated descriptions for roles with `*/read` permissions.<br/>[App Compliance Automation Administrator](built-in-roles/security.md#app-compliance-automation-administrator)<br/>[App Compliance Automation Reader](built-in-roles/security.md#app-compliance-automation-reader)<br/>[Log Analytics Contributor](built-in-roles/monitor.md#log-analytics-contributor)<br/>[Log Analytics Reader](built-in-roles/monitor.md#log-analytics-reader)<br/>[Managed Application Contributor Role](built-in-roles/management-and-governance.md#managed-application-contributor-role)<br/>[Managed Application Operator Role](built-in-roles/management-and-governance.md#managed-application-operator-role)<br/>[Managed Applications Reader](built-in-roles/management-and-governance.md#managed-applications-reader)<br/>[Monitoring Contributor](built-in-roles/monitor.md#monitoring-contributor)<br/>[Monitoring Reader](built-in-roles/monitor.md#monitoring-reader)<br/>[Reader](built-in-roles/general.md#reader)<br/>[Resource Policy Contributor](built-in-roles/management-and-governance.md#resource-policy-contributor)<br/>[Role Based Access Control Administrator](built-in-roles/privileged.md#role-based-access-control-administrator)<br/>[User Access Administrator](built-in-roles/privileged.md#user-access-administrator) |
| January 2025 | Roles | Added Azure Chaos Studio roles. See [Chaos Studio Experiment Contributor](built-in-roles/devops.md#chaos-studio-experiment-contributor), [Chaos Studio Operator](built-in-roles/devops.md#chaos-studio-operator), and [Chaos Studio Reader](built-in-roles/devops.md#chaos-studio-reader). |
| January 2025 | Roles | Added Azure Container Registry roles.<br/>[Container Registry Configuration Reader and Data Access Configuration Reader](built-in-roles/containers.md#container-registry-configuration-reader-and-data-access-configuration-reader)<br/>[Container Registry Contributor and Data Access Configuration Administrator](built-in-roles/containers.md#container-registry-contributor-and-data-access-configuration-administrator)<br/>[Container Registry Data Importer and Data Reader](built-in-roles/containers.md#container-registry-data-importer-and-data-reader)<br/>[Container Registry Repository Catalog Lister](built-in-roles/containers.md#container-registry-repository-catalog-lister)<br/>[Container Registry Repository Contributor](built-in-roles/containers.md#container-registry-repository-contributor)<br/>[Container Registry Repository Reader](built-in-roles/containers.md#container-registry-repository-reader)<br/>[Container Registry Repository Writer](built-in-roles/containers.md#container-registry-repository-writer)<br/>[Container Registry Tasks Contributor](built-in-roles/containers.md#container-registry-tasks-contributor)<br/>[Container Registry Transfer Pipeline Contributor](built-in-roles/containers.md#container-registry-transfer-pipeline-contributor) |
| January 2025 | Roles and permissions | Updated permissions for several roles and resource providers. See [Azure built-in roles](built-in-roles.md) and [Azure permissions](resource-provider-operations.md). |
| January 2025 | REST API | Updated how to list a role definition with a specified role name. See [List role definitions](role-definitions-list.yml#rest-api). |

## 2024

| Date | Area | Description |
| --- | --- | --- |
| December 2024 | Role assignments | Documented check access improvements on the **Access control (IAM) page**. See [Quickstart: Check access for a user to a single Azure resource](check-access.md). |
| December 2024 | Security | Documented improvements for how to view users with elevated access and how to remove this elevated access. See [View users with elevated access](elevate-access-global-admin.md#view-users-with-elevated-access). |
| December 2024 | Roles | Added [Compute Gallery Image Reader](built-in-roles/compute.md#compute-gallery-image-reader) role. |
| December 2024 | Roles | Added [Azure Stack HCI Connected InfraVMs](built-in-roles/hybrid-multicloud.md#azure-stack-hci-connected-infravms) role. |
| December 2024 | Roles and permissions | Updated permissions for several roles and resource providers. See [Azure built-in roles](built-in-roles.md) and [Azure permissions](resource-provider-operations.md). |
| November 2024 | Role assignments | General availability of the integration of Azure RBAC and Microsoft Entra Privileged Identity Management (PIM) to create eligible and time-bound role assignments. See [Eligible and time-bound role assignments in Azure RBAC](pim-integration.md), [Assign Azure roles using the Azure portal](role-assignments-portal.yml#step-6-select-assignment-type), and [Activate eligible Azure role assignments](role-assignments-eligible-activate.md). |
| November 2024 | Roles | Added [Azure Managed Grafana Workspace Contributor](built-in-roles/monitor.md#azure-managed-grafana-workspace-contributor) role. |
| October 2024 | Roles | Added Azure Service Fabric roles. See [Service Fabric Cluster Contributor](built-in-roles/containers.md#service-fabric-cluster-contributor) and [Service Fabric Managed Cluster Contributor](built-in-roles/containers.md#service-fabric-managed-cluster-contributor). |
| October 2024 | Roles | Updated [Cognitive Services Data Reader](built-in-roles/ai-machine-learning.md#cognitive-services-data-reader) role. |
| September 2024 | Roles | Added Azure Kubernetes roles. See [Azure Kubernetes Service Arc Cluster Admin Role](built-in-roles/containers.md#azure-kubernetes-service-arc-cluster-admin-role), [Azure Kubernetes Service Arc Cluster User Role](built-in-roles/containers.md#azure-kubernetes-service-arc-cluster-user-role), and [Azure Kubernetes Service Arc Contributor Role](built-in-roles/containers.md#azure-kubernetes-service-arc-contributor-role). |
| September 2024 | Roles and permissions | Added de-identification service roles in Azure Health Data Services. See [DeID Batch Data Owner](built-in-roles/integration.md#deid-batch-data-owner), [DeID Batch Data Reader](built-in-roles/integration.md#deid-batch-data-reader), [DeID Data Owner](built-in-roles/integration.md#deid-data-owner), [DeID Realtime Data User](built-in-roles/integration.md#deid-realtime-data-user), and [Microsoft.HealthDataAIServices](permissions/integration.md#microsofthealthdataaiservices). |
| September 2024 | Roles | Added app configuration roles. See [App Configuration Contributor](built-in-roles/integration.md#app-configuration-contributor) and [App Configuration Reader](built-in-roles/integration.md#app-configuration-reader). |
| September 2024 | Roles | Added Privileged category. See [Azure built-in roles for Privileged](built-in-roles/privileged.md). |
| August 2024 | Security | Updates about classic administrators retirement. See [Azure classic subscription administrators](classic-administrators.md). |
| August 2024 | Role assignments | Updates to scope for the integration of Azure RBAC and Microsoft Entra Privileged Identity Management (PIM). See [Eligible and time-bound role assignments in Azure RBAC](pim-integration.md). |
| July 2024 | Roles | Added Azure Compute Gallery roles. See [Compute Gallery Artifacts Publisher](built-in-roles/compute.md#compute-gallery-artifacts-publisher) and [Compute Gallery Sharing Admin](built-in-roles/compute.md#compute-gallery-sharing-admin). |
| June 2024 | Roles | Added Azure AI roles. See [Azure AI Developer](built-in-roles/ai-machine-learning.md#azure-ai-developer), [Azure AI Enterprise Network Connection Approver](built-in-roles/ai-machine-learning.md#azure-ai-enterprise-network-connection-approver), and [Azure AI Inference Deployment Operator](built-in-roles/ai-machine-learning.md#azure-ai-inference-deployment-operator). |
| June 2024 | Role assignments | Preview of the integration of Azure RBAC and Microsoft Entra Privileged Identity Management (PIM) to create eligible and time-bound role assignments. See [Eligible and time-bound role assignments in Azure RBAC](pim-integration.md), [Assign Azure roles using the Azure portal](role-assignments-portal.yml#step-6-select-assignment-type), and [Activate eligible Azure role assignments](role-assignments-eligible-activate.md). |

## Related content

- [Azure documentation](/azure/)
- [Azure Updates](https://azure.microsoft.com/updates/)
- [Microsoft Azure Blog - Announcements](https://azure.microsoft.com/blog/content-type/announcements/)
