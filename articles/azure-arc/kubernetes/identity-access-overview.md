---
title: "Azure Arc-enabled Kubernetes identity and access overview"
ms.date: 05/04/2023
ms.topic: conceptual
description: "Understand identity and access options for Arc-enabled Kubernetes clusters."
---

# Azure Arc-enabled Kubernetes identity and access overview

You can authenticate, authorize, and control access to your Azure Arc-enabled Kubernetes clusters. Kubernetes role-based access control (Kubernetes RBAC) lets you grant users, groups, and service accounts access to only the resources they need. You can further enhance the security and permissions structure by using Azure Active Directory and Azure role-based access control (Azure RBAC).

While Kubernetes RBAC works only on Kubernetes resources within your cluster, Azure RBAC works on resources across your Azure subscription.

This topic provides an overview of these two RBAC systems and how you can use them with your Arc-enabled Kubernetes clusters.

## Kubernetes RBAC

[Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) provides granular filtering of user actions. With Kubernetes RBAC, you assign users or groups permission to create and modify resources or view logs from running application workloads. You can create roles to define permissions, and then assign those roles to users with role bindings. Permissions may be scoped to a single namespace or across the entire cluster.

The Azure Arc-enabled Kubernetes cluster connect feature uses Kubernetes RBAC to provide connectivity to the `apiserver` of the cluster. This connectivity doesn't require any inbound port to be enabled on the firewall. A reverse proxy agent running on the cluster can securely start a session with the Azure Arc service in an outbound manner. Using the cluster connect feature helps enable interactive debugging and troubleshooting scenarios. It can also be used to provide cluster access to Azure services for [custom locations](conceptual-custom-locations.md).

For more information, see [Cluster connect access to Azure Arc-enabled Kubernetes clusters](conceptual-cluster-connect.md) and [Use cluster connect to securely connect to Azure Arc-enabled Kubernetes clusters](cluster-connect.md).

## Azure RBAC

[Azure role-based access control (RBAC)](../../role-based-access-control/overview.md) is an authorization system built on Azure Resource Manager  and Azure Active Directory (Azure AD) that provides fine-grained access management of Azure resources.

With Azure RBAC, role definitions outline the permissions to be applied. You assign these roles to users or groups via a role assignment for a particular scope. The scope can be across the entire subscription or limited to a resource group or to an individual resource such as a Kubernetes cluster.

Using Azure RBAC with your Arc-enabled Kubernetes clusters allows the benefits of Azure role assignments, such as activity logs that show all Azure RBAC changes to an Azure resource.

For more information, see [Azure RBAC on Azure Arc-enabled Kubernetes (preview)](conceptual-azure-rbac.md) and [Use Azure RBAC on Azure Arc-enabled Kubernetes clusters (preview)](azure-rbac.md).

## Next steps

- Learn about [cluster connect access to Azure Arc-enabled Kubernetes clusters](conceptual-cluster-connect.md).
- Learn about [Azure RBAC on Azure Arc-enabled Kubernetes (preview)](conceptual-azure-rbac.md)
- Learn about [access and identity options for Azure Kubernetes Service (AKS) clusters](../../aks/concepts-identity.md).
