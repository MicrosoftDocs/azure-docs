---
title: MANA support for Network Virtual Appliances (NVAs)
titleSuffix: Microsoft Azure Network Adapter
description: Learn about MANA support for Network Virtual Appliances (NVAs) using existing VM sizes, including how to use Azure Policy to manage MANA deployments and ensure optimal performance.
author: mattmcinnes
ms.author: mattmcinnes
ms.service: azure-virtual-network
ms.topic: faq
ms.date: 04/07/2026
# Customer intent: As a network administrator using Network Virtual Appliances, I want to understand how MANA affects my NVA deployments and how to apply Azure Policy to manage the transition.
---

# MANA support for Network Virtual Appliances (NVAs)

As Azure expands [Microsoft Azure Network Adapter (MANA)](./accelerated-networking-mana-overview.md) support to [existing VM series](./accelerated-networking-mana-existing-sizes.md), Network Virtual Appliances (NVAs) running on those VM series may be placed on MANA-capable hardware. Existing VM series are supported on Microsoft Azure Network Adapter (MANA) capable hardware. However, since these VM series were introduced before MANA was released, they may not fully benefit from all performance, reliability, and resiliency improvements.

Newer VM series are built and optimized with MANA in mind and are designed to take full advantage of its performance, reliability, and resiliency improvements. For this reason, it is recommended to use newer VM sizes for the most optimal networking experience.

While most workloads transition to MANA-capable hardware without issue, NVA workloads are uniquely impacted due to their direct dependency on the underlying network hardware and drivers. 

## Compatibility
Your NVA VMs running on [existing VM series](./accelerated-networking-mana-existing-sizes.md) must meet the one of following requirements. For DPDK-based workloads, see the [DPDK guidance](./setup-dpdk-mana.md) for more information.

1. **Use a compatible VM series and/or operating system**:
    <br>To check whether your configuration is supported, see [MANA support for existing VM series](./accelerated-networking-mana-existing-sizes.md).

2. **Confirm MANA support with your NVA vendor**
   <br>Ensure that your NVA solution explicitly supports MANA.

## Temporary MANA Exception with `LegacyVMNVA`
You can apply the `LegacyVMNVA` tag to temporarily avoid placement on MANA‑enabled hardware. This tag prevents NVA VMs and Virtual Machine Scale Sets from landing on MANA hardware while you complete your migration. Follow the steps below to apply the tag.

> [!IMPORTANT]
> The `LegacyVMNVA` tag must be applied before August 1, 2026. VMs that are created or tagged after this date may be placed on MANA-capable hardware. After May 31, 2027, the tag is ignored and all [MANA-eligible VM series](./accelerated-networking-mana-existing-sizes.md) will be placed on MANA-capable hardware.

1. Open the `LegacyVMNVA` [Azure Policy](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe87a87f5-e6dd-4919-be21-abb0a4ea4630/version/1.0.0/scopes~/%5B%22%2Fsubscriptions%2F12015272-f077-4945-81de-a5f607d067e1%22%2C%22%2Fsubscriptions%2F0ba674a6-9fde-43b4-8370-a7e16fdf0641%22%5D/contextRender~/false).
     - This will automatically apply the tag across your environment at scale and cover individual VM workloads and Virtual Machine Scale Set scenarios.
     - It will scope tag application to specific NVA publishers and associated product IDs available in the Azure Marketplace.
     - Applying this policy has no cost implications for your subscription.

2. Choose the appropriate scope for the Azure Policy:
   
    | Scope level | Applies to |
    |---|---|
    | Root Management Group | Entire Azure Tenant (all subscriptions) |
    | Management Group | Multiple subscriptions |
    | Subscription | All resource groups and resources in the subscription |
    | Resource Group | Resources in that resource group |
    | Resource | Single resource |

   Microsoft recommends applying policy enforcement gradually, following your organization's safe rollout strategies. Azure Policy supports safe rollout primitives that let you incrementally roll out enforcement by region and resource type. For a detailed breakdown of available mechanisms, see [Azure Policy Safe Deployment Practices](../governance/policy/how-to/policy-safe-deployment-practices.md).

4. Enable **Automatically enroll in minor version changes** to ensure minor revisions are applied automatically. Alternatively, assign the policy using version `1.*.*`.

5. Activate the tag by performing a "stop deallocate and start" operation on the affected resources. The Accelerated Networking enablement status of a VM doesn't affect whether the policy is applied.

## Network performance for incompatible VMs
If a VM is placed on MANA-capable hardware but the OS doesn't support MANA, networking automatically falls back to the NetVSC network adapter. In this scenario:
- The MANA Virtual Function (VF) may be visible, but no interfaces are exposed by the MANA driver.
- Performance is expected to be comparable to SR‑IOV-based `ConnectX‑3`, `ConnectX‑4 Lx`, and `ConnectX‑5` devices.
- Workloads with a high number of concurrent connections may see reduced performance.

> [!NOTE] 
> While Azure performs extensive testing across a wide range of use cases, virtual machines may still experience rare intermittent connectivity or degraded performance. In such cases, it's highly recommended to migrate to the latest generation of VMs or at a minimum, utilize an operating system that's compatible with MANA.

## Special tag deployment scenarios

### NVAs acquired outside of Azure Marketplace

If your NVA was acquired directly from your NVA provider rather than through the Azure Marketplace, work with your provider directly to determine whether changes are required to your deployment templates or mechanisms to ensure the `LegacyVMNVA` tag is applied to both existing and new deployments.

### Managed Service NVAs

This change also affects NVAs provided through a managed service. Work with your managed service provider to understand their plans and processes for applying the `LegacyVMNVA` tag to your resources.

## FAQ
### How can I verify that the `LegacyVMNVA` tag has been applied?
The `LegacyVMNVA` tag is visible in the Azure portal for both IaaS VMs and VM Scale Set scenarios. Azure Policy also collects and aggregates compliance data so you can track which resources are *compliant* (tag applied) versus *noncompliant* (tag not yet applied). This compliance report is available in the Azure portal under the **Policy** tab. You can also verify tag presence using Azure CLI.

### Can I edit the `LegacyVMNVA` policy?
The built-in policy can't be edited directly. Microsoft recommends assigning it as-is to minimize management overhead and ensure you receive all policy revisions and updates automatically. If further customization is needed, the policy can be duplicated and modified before assignment.

### How can I exclude specific resources or scopes from policy enforcement?
You can use Azure Policy exemption capabilities. For more information, [Azure Policy exemption structure](../governance/policy/concepts/exemption-structure.md).

### How can I roll back the `LegacyVMNVA` policy assignment?
To roll back the policy assignment, delete the policy assignment. For a more gradual rollback, update the policy resource selector to incrementally remove regions. If the `LegacyVMNVA` tag is present on applied to existing VMs, delete the tag using your Azure client of choice and redeploy the VMs.

## Is any action needed after the tag expires on May 31, 2027?
No action is required after May 31, 2027. However, we recommend removing the policy assignment from all associated subscriptions.

## Related content
- [Accelerated Networking Overview](https://aka.ms/accelnet)
- [How Accelerated Networking works in Linux and FreeBSD VMs](/azure/virtual-network/accelerated-networking-how-it-works)
- [Microsoft Azure Network Adapter (MANA) support for existing VM Sizes](./accelerated-networking-mana-existing-sizes.md)
