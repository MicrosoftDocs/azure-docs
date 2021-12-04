---
title: Azure Policy for Video Analyzer
description: Azure Video Analyzer provides several built-in Azure Policy definitions to help enforce organizational standards and compliance at-scale. This article explains how to assign policies for a Video Analyzer account. 
ms.topic: how-to
ms.date: 12/02/2021
---

# Azure Policy for Video Analyzer

Azure Video Analyzer provides several built-in [Azure Policy](../../governance/policy/overview.md) definitions to help enforce organizational standards and compliance at-scale. Common use cases for Azure Policy include implementing governance for resource consistency, regulatory compliance, security, cost and management. 

Video Analyzer provides several common use case definitions for Azure Policy that are built-in to help you get started. This article explains how to assign policies for a Video Analyzer account using the Azure portal. 

## Built-in Azure Policy definitions for Video Analyzer 

The following built-in policy definitions are available for use with Video Analyzer. 

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|Video Analyzer accounts should use customer-managed keys to encrypt data at rest. |Use customer-managed keys to manage the encryption of your Video Analyzer accounts at rest. By default, customer data is encrypted with service-managed keys, but customer-managed keys are commonly required to meet regulatory compliance standards. Customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. Learn more at [https://aka.ms/videoanalyzerscmkdocs](https://aka.ms/videoanalyzerscmkdocs).  |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Video%20Analyzers/VideoAnalyzer_CustomerManagedKey_Audit.json) |

## Create a policy assignment 

Use the Azure portal to [create a policy assignment](../../governance/policy/assign-policy-portal.md) for your Video Analyzer account using built-in policy definition. 

<!-- To-do: Add screenshot for assigning a built-in policy -->

## Identify non-compliant resources 

Select **Compliance** in the left side of the page. Then locate the policy assignment you created. 

<!-- To-do: Add screenshot for Compliance tab -->

If there are any existing resources that aren't compliant with this new assignment, they appear under **Non-compliant** resources. 

> [!NOTE]
>  For the policy “Video Analyzer accounts should use customer-managed keys to encrypt data at rest”, the policy assignment is validated for new resources created after policy is enabled. It does not validate existing Video Analyzer accounts. 

## Clean up resources 

To remove the assignment created, follow these steps: 

1. Select **Compliance (or Assignments)** in the left side of the **Azure Policy** page and locate the CMK for data encryption at rest policy assignment you created. 
1. Right-click the policy assignment and select **Delete assignment**. 

<!-- To-do: Add screenshot for delete assignment -->

## See Also 

Read more about [customer managed keys](customer-managed-keys.md)
