---
title: Manage hybrid infrastructure at scale with Azure Arc
description: Azure Lighthouse helps you effectively manage customers' machines and Kubernetes clusters outside of Azure.
ms.date: 12/01/2022
ms.topic: how-to
---

# Manage hybrid infrastructure at scale with Azure Arc

[Azure Lighthouse](../overview.md) can help service providers use Azure Arc to manage customers' hybrid environments, with visibility across all managed Azure Active Directory (Azure AD) tenants.

[Azure Arc](../../azure-arc/overview.md) helps simplify complex and distributed environments across on-premises, edge and multicloud, enabling deployment of Azure services anywhere and extending Azure management to any infrastructure.

With [Azure Arc–enabled servers](../../azure-arc/servers/overview.md), customers can manage Windows and Linux machines hosted outside of Azure on their corporate network, in the same way they manage native Azure virtual machines. Through Azure Lighthouse, service providers can then manage these connected non-Azure machines along with their customers' Azure resources.

[Azure Arc–enabled Kubernetes](../../azure-arc/kubernetes/overview.md) lets customers attach and configure Kubernetes clusters outside of Azure. When a Kubernetes cluster is connected to Azure Arc, it appears in the Azure portal with an Azure Resource Manager ID and a managed identity. Clusters are attached to standard Azure subscriptions, are located in a resource group, and can receive tags just like any other Azure resource. Through Azure Lighthouse, service providers can connect Kubernetes clusters and manage them along with their customer's Azure Kubernetes Service (AKS) clusters and other Azure resources.

> [!TIP]
> Though we refer to service providers and customers in this topic, this guidance also applies to [enterprises using Azure Lighthouse to manage multiple tenants](../concepts/enterprise.md).

## Manage hybrid servers at scale with Azure Arc–enabled servers

As a service provider, you can manage on-premises Windows Server or Linux machines outside Azure that your customers have connected to their subscription using the [Azure Connected Machine agent](../../azure-arc/servers/agent-overview.md). When viewing resources for a delegated subscription in the Azure portal, you'll see these connected machines labeled with **Azure Arc**.

You can manage these connected machines using Azure constructs, such as Azure Policy and tagging, just as you would manage the customer's Azure resources. You can also work across customer tenants to manage all connected machines together.

For example, you can [ensure the same set of policies are applied across customers' hybrid machines](../../azure-arc/servers/learn/tutorial-assign-policy-portal.md). You can also use Microsoft Defender for Cloud to monitor compliance across all of your customers' hybrid environments, or [use Azure Monitor to collect data directly](../../azure-arc/servers/learn/tutorial-enable-vm-insights.md) into a Log Analytics workspace. [Virtual machine extensions](../../azure-arc/servers/manage-vm-extensions.md) can be deployed to non-Azure Windows and Linux VMs, simplifying management of your customers' hybrid machines.

## Manage hybrid Kubernetes clusters at scale with Azure Arc-enabled Kubernetes

You can manage Kubernetes clusters that have been [connected to a customer's subscription with Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md), just as if they were running in Azure.

If your customer has created a service principal account to onboard Kubernetes clusters to Azure Arc, you can access this account so that you can [onboard and manage clusters](../../azure-arc/kubernetes/quickstart-connect-cluster.md). To do so, a user in the managing tenant must have been granted the [Kubernetes Cluster - Azure Arc Onboarding built-in role](../../role-based-access-control/built-in-roles.md#kubernetes-cluster---azure-arc-onboarding) when the subscription containing the service principal account was [onboarded to Azure Lighthouse](onboard-customer.md).

You can deploy [configurations and Helm charts](../../azure-arc/kubernetes/tutorial-use-gitops-flux2.md) using [GitOps for connected clusters](../../azure-arc/kubernetes/conceptual-gitops-flux2.md).

You can also [monitor connected clusters](../..//azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md) with Azure Monitor, and [use Azure Policy to apply cluster configurations at scale](../../azure-arc/kubernetes/use-azure-policy.md).

## Next steps

- Explore the [Azure Arc Jumpstart](https://azurearcjumpstart.io/).
- Learn about [supported cloud operations for Azure Arc-enabled servers](../../azure-arc/servers/overview.md#supported-cloud-operations).
- Learn about [accessing connected Kubernetes clusters through the Azure portal](../../azure-arc/kubernetes/kubernetes-resource-view.md).
