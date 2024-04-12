---
title: Recommended policies for Azure services
description: Describes how to find and apply recommended policies for Azure services such as Azure Virtual Machines.
ms.date: 04/03/2024
ms.topic: conceptual
ms.custom: generated
---

# Recommended policies for Azure services

Customers who are new to Azure Policy often look to find common policy definitions to manage and govern their resources. Azure Policy's **Recommended policies** provides a focused list of common policy definitions to start with. The **Recommended policies** experience for supported resources is embedded within the portal experience for that resource.

For more Azure Policy built-ins, go to [Azure Policy built-in definitions](../samples/built-in-policies.md).

## Azure Virtual Machines

The **Recommended policies** for [Azure Virtual Machines](../../../virtual-machines/index.yml) are on the **Overview** page for virtual machines and under the **Capabilities** tab. Select the **Azure Policy** card to open a side pane with the recommended policies. Select the recommended policies to apply to this virtual machine and select **Assign policies** to create an assignment for each policy. **Assign policies** is unavailable, or greyed out, for any policy already assigned to a scope where the virtual machine is a member.

As an organization reaches maturity with [organizing their resources and resource hierarchy](/azure/cloud-adoption-framework/ready/azure-best-practices/organize-subscriptions), the recommendation is to transition these policy assignments from one per resource to the subscription or [management group](../../management-groups/index.yml) level.

### Azure Virtual Machines recommended policies

|Name<br /><sub>(Azure portal)</sub> |Description |Effect |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit virtual machines without disaster recovery configured](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0015ea4d-51ff-4ce3-8d8c-f3f8f0179a56) |Audit virtual machines which do not have disaster recovery configured. To learn more about disaster recovery, visit [https://aka.ms/asr-doc](https://aka.ms/asr-doc). |auditIfNotExists |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/RecoveryServices_DisasterRecovery_Audit.json) |
|[Audit VMs that do not use managed disks](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F06a78e20-9358-41c9-923c-fb736d382a4d) |This policy audits VMs that do not use managed disks |audit |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json) |
|[Azure Backup should be enabled for Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F013e242c-8828-4970-87b3-ab247555486d) |Ensure protection of your Azure Virtual Machines by enabling Azure Backup. Azure Backup is a secure and cost effective data protection solution for Azure. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Backup/VirtualMachines_EnableAzureBackup_Audit.json) |

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review [Understanding policy effects](./effects.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
