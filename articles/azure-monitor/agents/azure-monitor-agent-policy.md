---
title: Use Azure Policy to install and manage the Azure Monitor agent
description: Options for managing Azure Monitor Agent on Azure virtual machines and Azure Arc-enabled servers.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 7/10/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.reviewer: jeffwo

---

# Use Azure Policy to install and manage the Azure Monitor agent

Using [Azure Policy](../../governance/policy/overview.md), you can have the Azure Monitor agent automatically installed on your existing and new virtual machines and have the appropriate DCRs automatically associated with them. This article describes the built-in policies and initiatives that you can leverage for this functionality and features of Azure Monitor to assist in managing them.

Use the following policies and policy initiatives to automatically install the agent and associate it with a data collection rule every time you create a virtual machine, scale set, or Azure Arc-enabled server.

> [!NOTE]
> Azure Monitor has a preview [data collection rule DCR](../essentials/data-collection-rule-overview.md) experience that simplifies creating assignments for policies and initiatives that use DCRs. This includes initiatives that install the Azure Monitor agent. You may choose to use that experience to create assignments for the initiatives described in this article. See [Manage data collection rules (DCRs) and associations in Azure Monitor](../essentials/data-collection-rule-view.md#azure-policy) for more information.

## Prerequisites
Before you proceed, review [prerequisites for agent installation](azure-monitor-agent-manage.md#prerequisites).

> [!NOTE]
> As per Microsoft Identity best practices, policies for installing Azure Monitor Agent on virtual machines and scale sets rely on user-assigned managed identity. This option is the more scalable and resilient managed identity for these resources.
> For Azure Arc-enabled servers, policies rely on system-assigned managed identity as the only supported option today.


## Built-in policies

You can choose to use the individual policies from the preceding policy initiative to perform a single action at scale. For example, if you only want to automatically install the agent, use the second agent installation policy from the initiative, as shown.

:::image type="content" source="media/azure-monitor-agent-install/built-in-ama-dcr-policy.png" lightbox="media/azure-monitor-agent-install/built-in-ama-dcr-policy.png" alt-text="Partial screenshot from the Azure Policy Definitions page that shows policies contained within the initiative for configuring Azure Monitor Agent.":::



## Built-in policy initiatives
 

There are built-in policy initiatives for Windows and Linux virtual machines, scale sets that provide at-scale onboarding using Azure Monitor agents end-to-end 
- [Deploy Windows Azure Monitor Agent with user-assigned managed identity-based auth and associate with Data Collection Rule](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/InitiativeDetailBlade/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2F0d1b56c6-6d1f-4a5d-8695-b15efbea6b49/scopes~/%5B%22%2Fsubscriptions%2Fae71ef11-a03f-4b4f-a0e6-ef144727c711%22%5D)
- [Deploy Linux Azure Monitor Agent with user-assigned managed identity-based auth and associate with Data Collection Rule](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/InitiativeDetailBlade/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2Fbabf8e94-780b-4b4d-abaa-4830136a8725/scopes~/%5B%22%2Fsubscriptions%2Fae71ef11-a03f-4b4f-a0e6-ef144727c711%22%5D)  

> [!NOTE]
> The policy definitions only include the list of Windows and Linux versions that Microsoft supports. To add a custom image, use the `Additional Virtual Machine Images` parameter.

These initiatives above comprise individual policies that:

- (Optional) Create and assign built-in user-assigned managed identity, per subscription, per region. [Learn more](../../active-directory/managed-identities-azure-resources/how-to-assign-managed-identity-via-azure-policy.md#policy-definition-and-details).
   - `Bring Your Own User-Assigned Identity`: If set to `false`, it creates the built-in user-assigned managed identity in the predefined resource group and assigns it to all the machines that the policy is applied to. Location of the resource group can be configured in the `Built-In-Identity-RG Location` parameter.
     If set to `true`, you can instead use an existing user-assigned identity that is automatically assigned to all the machines that the policy is applied to.
- Install Azure Monitor Agent extension on the machine, and configure it to use user-assigned identity as specified by the following parameters.
  - `Bring Your Own User-Assigned Managed Identity`: If set to `false`, it configures the agent to use the built-in user-assigned managed identity created by the preceding policy. If set to `true`, it configures the agent to use an existing user-assigned identity.
  - `User-Assigned Managed Identity Name`: If you use your own identity (selected `true`), specify the name of the identity that's assigned to the machines.
  - `User-Assigned Managed Identity Resource Group`: If you use your own identity (selected `true`), specify the resource group where the identity exists.
  - `Additional Virtual Machine Images`: Pass additional VM image names that you want to apply the policy to, if not already included.
  - `Built-In-Identity-RG Location`: If you use built-in user-assigned managed identity, specify the location where the identity and the resource group should be created. This parameter is only used when `Bring Your Own User-Assigned Managed Identity` parameter is set to `false`.
- Create and deploy the association to link the machine to specified data collection rule.
   - `Data Collection Rule Resource Id`: The Azure Resource Manager resourceId of the rule you want to associate via this policy to all machines the policy is applied to.

   :::image type="content" source="media/azure-monitor-agent-install/built-in-ama-dcr-initiatives.png" lightbox="media/azure-monitor-agent-install/built-in-ama-dcr-initiatives.png" alt-text="Partial screenshot from the Azure Policy Definitions page that shows two built-in policy initiatives for configuring Azure Monitor Agent.":::

### Known issues

- Managed Identity default behavior. [Learn more](../../active-directory/managed-identities-azure-resources/managed-identities-faq.md#what-identity-will-imds-default-to-if-dont-specify-the-identity-in-the-request).
- Possible race condition with using built-in user-assigned identity creation policy. [Learn more](../../active-directory/managed-identities-azure-resources/how-to-assign-managed-identity-via-azure-policy.md#known-issues).
- Assigning policy to resource groups. If the assignment scope of the policy is a resource group and not a subscription, the identity used by policy assignment (different from the user-assigned identity used by agent) must be manually granted [these roles](../../active-directory/managed-identities-azure-resources/how-to-assign-managed-identity-via-azure-policy.md#required-authorization) prior to assignment/remediation. Failing to do this step will result in *deployment failures*.
- Other [Managed Identity limitations](../../active-directory/managed-identities-azure-resources/managed-identities-faq.md#limitations).



## Remediation

The initiatives or policies will apply to each virtual machine as it's created. A [remediation task](../../governance/policy/how-to/remediate-resources.md) deploys the policy definitions in the initiative to existing resources, so you can configure Azure Monitor Agent for any resources that were already created.

When you create the assignment by using the Azure portal, you have the option of creating a remediation task at the same time. For information on the remediation, see [Remediate non-compliant resources with Azure Policy](../../governance/policy/how-to/remediate-resources.md).
<!-- convertborder later -->
:::image type="content" source="media/azure-monitor-agent-install/built-in-ama-dcr-remediation.png" lightbox="media/azure-monitor-agent-install/built-in-ama-dcr-remediation.png" alt-text="Screenshot that shows initiative remediation for Azure Monitor Agent." border="false":::



## Next steps

[Create a data collection rule](./azure-monitor-agent-send-data-to-event-hubs-and-storage.md) to collect data from the agent and send it to Azure Monitor.
