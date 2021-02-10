---
title: Manage hybrid infrastructure at scale with Azure Arc
description: Learn how to effectively manage your customers' machines and Kubernetes clusters outside of Azure.
ms.date: 09/22/2020
ms.topic: how-to
---

# Manage hybrid infrastructure at scale with Azure Arc

As a service provider, you may have onboarded multiple customer tenants to [Azure Lighthouse](../overview.md). Azure Lighthouse allows service providers to perform operations at scale across several Azure Active Directory (Azure AD) tenants at once, making management tasks more efficient.

[Azure Arc](../../azure-arc/overview.md) helps simplify complex and distributed environments across on-premises, edge and multicloud, enabling deployment of Azure services anywhere and extending Azure management to any infrastructure.

With [Azure Arc enabled servers](../../azure-arc/servers/overview.md), customers can manage any Windows and Linux machines hosted outside of Azure on their corporate network, in the same way they manage native Azure virtual machines. By linking a hybrid machine to Azure, it becomes connected and is treated as a resource in Azure. Service providers can then manage these non-Azure machines along with their customers' Azure resources.

[Azure Arc enabled Kubernetes (preview)](../../azure-arc/kubernetes/overview.md) lets customers attach and configure Kubernetes clusters inside or outside of Azure. When a Kubernetes cluster is attached to Azure Arc, it will appear in the Azure portal, with an Azure Resource Manager ID and a managed identity. Clusters are attached to standard Azure subscriptions, are located in a resource group, and can receive tags just like any other Azure resource.

This topic provides an overview of how service providers can use Azure Arc enabled servers and Azure Arc enabled Kubernetes (preview) in a scalable way to manage their customers' hybrid environment, with visibility across all managed customer tenants.

> [!TIP]
> Though we refer to service providers and customers in this topic, this guidance also applies to [enterprises using Azure Lighthouse to manage multiple tenants](../concepts/enterprise.md).

## Manage hybrid servers at scale with Azure Arc enabled servers

As a service provider, you can manage on-premises Windows Server or Linux machines outside Azure that your customers have connected to their subscription using the [Azure Connected Machine agent](../../azure-arc/servers/agent-overview.md).

When viewing resources for a delegated subscription in the Azure portal, you'll see these connected machines labeled with **Azure Arc**. You can manage these connected machines using Azure constructs, such as Azure Policy and tagging, the same way that you’d manage the customer's Azure resources. You can also work across customer tenants to manage all connected hybrid machines together.

For example, you can [ensure the same set of policies are applied across customers' hybrid machines](../../azure-arc/servers/learn/tutorial-assign-policy-portal.md). You can also use Azure Security Center to monitor compliance across all of your customers' hybrid environments, or [use Azure Monitor to collect data directly from your hybrid machines](../../azure-arc/servers/learn/tutorial-enable-vm-insights.md) into a Log Analytics workspace. [Virtual machine extensions](../../azure-arc/servers/manage-vm-extensions.md) can be deployed to non-Azure Windows and Linux VMs, simplifying management of customer's hybrid machines.

## Manage hybrid Kubernetes clusters at scale with Azure Arc enabled Kubernetes (preview)

> [!NOTE]
> Azure Arc enabled Kubernetes is currently in preview. We don't recommend it for production workloads at this time.

You can manage Kubernetes clusters that have been [connected to a customer's subscription with Azure Arc](../../azure-arc/kubernetes/connect-cluster.md), just as if they were running in Azure.

If your customer has created a [service principal account to onboard Kubernetes clusters to Azure Arc](../../azure-arc/kubernetes/create-onboarding-service-principal.md), you can access this service principal account to onboard and manage clusters. This can be done by users in the managing tenant who were granted the "Kubernetes Cluster - Azure Arc Onboarding" Azure built-in role when the subscription containing the service principal account was [onboarded to Azure Lighthouse](onboard-customer.md).

You can deploy [configurations](../../azure-arc/kubernetes/use-gitops-connected-cluster.md) and [Helm charts](../../azure-arc/kubernetes/use-gitops-with-helm.md) using GitOps for connected clusters.

You can also monitor connected clusters with Azure Monitor, and [use Azure Policy to apply cluster configurations at scale](../../azure-arc/kubernetes/use-azure-policy.md).

## Next steps

- Explore the jumpstarts and samples in the [Azure Arc GitHub repository](https://github.com/microsoft/azure_arc). 
- Learn about [supported scenarios for Azure Arc enabled servers](../../azure-arc/servers/overview.md#supported-scenarios).
- Learn about [Kubernetes distributions supported by Azure Arc](../../azure-arc/kubernetes/overview.md#supported-kubernetes-distributions).
- Learn how to [deploy a policy at scale](policy-at-scale.md).
- Learn how to [use Azure Monitor Logs at scale](monitor-at-scale.md).

