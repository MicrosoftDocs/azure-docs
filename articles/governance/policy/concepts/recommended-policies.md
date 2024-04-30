---
title: Recommended policies for Azure virtual machines
description: Describes recommended policies for Azure virtual machines.
ms.date: 04/15/2024
ms.topic: conceptual
---

# Azure virtual machine recommended policies

The recommended policies for [Azure virtual machines](../../../virtual-machines/index.yml) are on the portal's **Overview** page for virtual machines and under the **Capabilities** tab. Select **Azure Policy** to open a pane that shows the recommended policies. Select the recommended policies to apply to this virtual machine and select **Assign policies** to create an assignment for each policy. **Assign policies** is unavailable, or greyed out, for any policy already assigned to a scope where the virtual machine is a member.

As an organization reaches maturity with [organizing their resources and resource hierarchy](/azure/cloud-adoption-framework/ready/azure-best-practices/organize-subscriptions), the recommendation is to transition these policy assignments from one per resource to the subscription or [management group](../../management-groups/index.yml) level.

|Name<br /><sub>(Azure portal)</sub> |Description |Effect |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit virtual machines without disaster recovery configured](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0015ea4d-51ff-4ce3-8d8c-f3f8f0179a56) |Audit virtual machines which do not have disaster recovery configured. To learn more about disaster recovery, visit [https://aka.ms/asr-doc](https://aka.ms/asr-doc). |auditIfNotExists |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/RecoveryServices_DisasterRecovery_Audit.json) |
|[Audit VMs that do not use managed disks](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F06a78e20-9358-41c9-923c-fb736d382a4d) |This policy audits VMs that do not use managed disks |audit |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json) |
|[Azure Backup should be enabled for Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F013e242c-8828-4970-87b3-ab247555486d) |Ensure protection of your Azure Virtual Machines by enabling Azure Backup. Azure Backup is a secure and cost effective data protection solution for Azure. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Backup/VirtualMachines_EnableAzureBackup_Audit.json) |

## Next steps

- [Azure Policy samples](../samples/index.md) and [Azure Policy built-in definitions](../samples/built-in-policies.md).
- [Azure Policy definitions effect basics](../concepts/effect-basics.md).
- [Remediate non-compliant resources with Azure Policy](../how-to/remediate-resources.md).
