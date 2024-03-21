---
title: Reference table for all AI security recommendations in Microsoft Defender for Cloud
description: This article lists all Microsoft Defender for Cloud AI security recommendations that help you harden and protect your resources.
author: dcurwin
ms.service: defender-for-cloud
ms.topic: reference
ms.date: 03/13/2024
ms.author: dacurwin
ms.custom: generated
ai-usage: ai-assisted
---

# AI security recommendations

This article lists all the AI security recommendations you might see in Microsoft Defender for Cloud. The recommendations that appear in your environment are based on the resources that you're protecting and on your customized configuration.

To learn about actions that you can take in response to these recommendations, see [Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).


> [!TIP]
> If a recommendation's description says *No related policy*, usually it's because that recommendation is dependent on a different recommendation and *its* policy.
>
> For example, the recommendation *Endpoint protection health failures should be remediated* relies on the recommendation that checks whether an endpoint protection solution is even installed (*Endpoint protection solution should be installed*). The underlying recommendation *does* have a policy. Limiting the policies to only the foundational recommendation simplifies policy management.


## AI recommendations

### Resource logs in Azure Machine Learning Workspaces should be enabled (Preview)

**Description & related policy**: Resource logs enable recreating activity trails to use for investigation purposes when a security incident occurs or when your network is compromised.

**Severity**: Medium

### Azure Machine Learning Workspaces should disable public network access (Preview)

**Description & related policy**: Disabling public network access improves security by ensuring that the Machine Learning Workspaces aren't exposed on the public internet. You can control exposure of your workspaces by creating private endpoints instead. For more information, see [Configure a private endpoint for an Azure Machine Learning workspace](../machine-learning/how-to-configure-private-link.md).

**Severity**: Medium

### Azure Machine Learning Computes should be in a virtual network (Preview)

**Description & related policy**: Azure Virtual Networks provide enhanced security and isolation for your Azure Machine Learning Compute Clusters and Instances, as well as subnets, access control policies, and other features to further restrict access. When a compute is configured with a virtual network, it is not publicly addressable and can only be accessed from virtual machines and applications within the virtual network.

**Severity**: Medium

### Azure Machine Learning Computes should have local authentication methods disabled (Preview)

**Description & related policy**: Disabling local authentication methods improves security by ensuring that Machine Learning Computes require Azure Active Directory identities exclusively for authentication. For more information, see [Azure Policy Regulatory Compliance controls for Azure Machine Learning](../machine-learning/security-controls-policy.md).

**Severity**: Medium

### Azure Machine Learning compute instances should be recreated to get the latest software updates (Preview)

**Description & related policy**: Ensure Azure Machine Learning compute instances run on the latest available operating system. Security is improved and vulnerabilities reduced by running with the latest security patches. For more information, see [Vulnerability management for Azure Machine Learning](../machine-learning/concept-vulnerability-management.md#compute-instance).

**Severity**: Medium

### Resource logs in Azure Databricks Workspaces should be enabled (Preview)

**Description & related policy**: Resource logs enable recreating activity trails to use for investigation purposes when a security incident occurs or when your network is compromised.

**Severity**: Medium

### Azure Databricks Workspaces should disable public network access (Preview)

**Description & related policy**: Disabling public network access improves security by ensuring that the resource isn't exposed on the public internet. You can control exposure of your resources by creating private endpoints instead. For more information, see [Enable Azure Private Link](/azure/databricks/administration-guide/cloud-configurations/azure/private-link).

**Severity**: Medium

### Azure Databricks Clusters should disable public IP (Preview)

**Description & related policy**: Disabling public IP of clusters in Azure Databricks Workspaces improves security by ensuring that the clusters aren't exposed on the public internet. For more information, see [Secure cluster connectivity](/azure/databricks/security/network/secure-cluster-connectivity).

**Severity**: Medium

### Azure Databricks Workspaces should be in a virtual network (Preview)

**Description & related policy**: Azure Virtual Networks provide enhanced security and isolation for your Azure Databricks Workspaces, as well as subnets, access control policies, and other features to further restrict access. For more information, see [Deploy Azure Databricks in your Azure virtual network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

**Severity**: Medium

### Azure Databricks Workspaces should use private link (Preview)

**Description & related policy**: Azure Private Link lets you connect your virtual networks to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to Azure Databricks workspaces, you can reduce data leakage risks. For more information, see [Create the workspace and private endpoints in the Azure portal UI](/azure/databricks/administration-guide/cloud-configurations/azure/private-link-standard#create-the-workspace-and-private-endpoints-in-the-azure-portal-ui).

**Severity**: Medium



## Related content

- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
- [Review your security recommendations](review-security-recommendations.md)
