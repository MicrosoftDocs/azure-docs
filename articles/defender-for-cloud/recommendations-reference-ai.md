---
title: Reference table for all AI security recommendations in Microsoft Defender for Cloud
description: This article lists all Microsoft Defender for Cloud AI security recommendations that help you harden and protect your resources.
author: dcurwin
ms.service: defender-for-cloud
ms.topic: reference
ms.date: 07/30/2024
ms.author: dacurwin
ms.custom: generated
ai-usage: ai-assisted
---

# AI security recommendations

This article lists all the AI security recommendations you might see in Microsoft Defender for Cloud.

The recommendations that appear in your environment are based on the resources that you're protecting and on your customized configuration.

To learn about actions that you can take in response to these recommendations, see [Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).


## Azure recommendations

### [Azure AI Services resources should have key access disabled (disable local authentication)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/13b10b36-aa99-4db6-b00c-dcf87c4761e6)

**Description**: Key access (local authentication) is recommended to be disabled for security. Azure OpenAI Studio, typically used in development/testing, requires key access and will not function if key access is disabled. After the setting is disabled, Microsoft Entra ID becomes the only access method, which allows maintaining minimum privilege principle and granular control. [Learn more](https://aka.ms/AI/auth).

This recommendation replaces the old recommendation *Cognitive Services accounts should have local authentication methods disabled*. It was formerly in category Cognitive Services and Cognitive Search, and was updated to comply with the Azure AI Services naming format and align with the relevant resources. 

**Severity**: Medium

### [Azure AI Services resources should restrict network access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f738efb8-005f-680d-3d43-b3db762d6243)

**Description**: By restricting network access, you can ensure that only allowed networks can access the service. This can be achieved by configuring network rules so that only applications from allowed networks can access the Azure AI service resource.

This recommendation replaces the old recommendation *Cognitive Services accounts should restrict network access*. It was formerly in category Cognitive Services and Cognitive Search, and was updated to comply with the Azure AI Services naming format and align with the relevant resources.

**Severity**: Medium


### [Azure AI Services resources should use Azure Private Link](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/54f53ddf-6ebd-461e-a247-394c542bc5d1)

**Description**: Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform reduces data leakage risks by handling the connectivity between the consumer and services over the Azure backbone network.

Learn more about private links at: [https://aka.ms/AzurePrivateLink/Overview](https://aka.ms/AzurePrivateLink/Overview)

This recommendation replaces the old recommendation *Cognitive Services should use private link*. It was formerly in category Data recommendations, and was updated to comply with the Azure AI Services naming format and align with the relevant resources.

**Severity**: Medium


### [(Enable if required) Azure AI Services resources should encrypt data at rest with a customer-managed key (CMK)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/18bf29b3-a844-e170-2826-4e95d0ba4dc9/showSecurityCenterCommandBar~/false)

**Description**: Using customer-managed keys to encrypt data at rest provides more control over the key lifecycle, including rotation and management. This is particularly relevant for organizations with related compliance requirements.

This is not assessed by default and should only be applied when required by compliance or restrictive policy requirements. If not enabled, the data will be encrypted using platform-managed keys. To implement this, update the 'Effect' parameter in the Security Policy for the applicable scope. (Related policy: [Azure AI Services resources should encrypt data at rest with a customer-managed key (CMK)](/azure/ai-services/openai/how-to/use-your-data-securely))

This recommendation replaces the old recommendation *Cognitive services accounts should enable data encryption using customer keys*. It was formerly in category Data recommendations, and was updated to comply with the Azure AI Services naming format and align with the relevant resources. 

**Severity**: Low

### [Diagnostic logs in Azure AI services resources should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dea5192e-1bb3-101b-b70c-4646546f5e1e)

**Description**: Enable logs for Azure AI services resources. This enables you to recreate activity trails for investigation purposes, when a security incident occurs or your network is compromised. 

This recommendation replaces the old recommendation *Diagnostic logs in Search services should be enabled*. It was formerly in the category Cognitive Services and Cognitive Search, and was updated to comply with the Azure AI Services naming format and align with the relevant resources. 

**Severity**: Low

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

## AWS AI recommendations

### [AWS Bedrock should have model invocation logging enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/Recommendation.ReactView/assessedResourceId/%2Fsubscriptions%2Fd1d8779d-38d7-4f06-91db-9cbc8de0176f%2Fresourcegroups%2Fsoc-asc%2Fproviders%2Fmicrosoft.security%2Fsecurityconnectors%2Fawsdspm%2Fsecurityentitydata%2Faws-account-in-region-323104580785-us-west-2%2Fproviders%2Fmicrosoft.security%2Fassessments%2F1a202dce-e13f-43ba-8a97-2f9235c5c834/recommendationDisplayName/AWS%20Bedrock%20should%20have%20model%20invocation%20logging%20enabled)

**Description:** With invocation logging, you can collect the full request data, response data, and metadata associated with all calls performed in your account. This enables you to recreate activity trails for investigation purposes when a security incident occurs.

**Severity:** Low

### [AWS Bedrock should use AWS PrivateLink](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/dd55620f-09f2-4d4b-9d6b-adcee7479a64)

**Description** Amazon Bedrock VPC endpoint powered by AWS PrivateLink, allows you to establish a private connection between the VPC in your account and the Amazon Bedrock service account. AWS PrivateLink enables VPC instances to communicate with Bedrock service resources, without the need for public IP addresses, ensuring your data is not exposed to the public internet and thereby helping with your compliance requirements.

**Severity** Medium


## Related content

- [Learn about security recommendations](security-policy-concept.md)
- [Review security recommendations](review-security-recommendations.md)
