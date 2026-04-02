---
title: MANA support for Network Virtual Appliances (NVAs)
titleSuffix: Microsoft Azure Network Adapter
description: Learn about MANA support for Network Virtual Appliances (NVAs) using existing VM sizes, including how to use Azure Policy to manage MANA deployments and ensure optimal performance.
author: mattmcinnes
ms.author: mattmcinnes
ms.service: azure-virtual-network
ms.topic: faq
ms.date: 03/17/2026
# Customer intent: As a network administrator using Network Virtual Appliances, I want to understand how MANA affects my NVA deployments and how to apply Azure Policy to manage the transition.
---

# MANA support for Network Virtual Appliances (NVAs)

> [!IMPORTANT]
> For timelines pertaining to VM families running on MANA-capable hardware, see the [announcement](https://techcommunity.microsoft.com/blog/AzureInfrastructureBlog/announcing-microsoft-azure-network-adapter-mana-support-for-existing-vm-skus/4493279).

The following content is for customers using Network Virtual Appliances (NVAs) that utilize existing VM sizes.

Per the [announcement](https://aka.ms/announcemanasupportforexistingvms), General Purpose Compute VMs can be deployed on compute hardware equipped with the [Microsoft Azure Network Adapter (MANA)](/azure/virtual-network/accelerated-networking-mana-overview). MANA was introduced in February 2025 with the Intel v6 family of sizes as part of Azure Boost. MANA is an Azure optimized, performance-focused, Accelerated Networking device that is an integral part of the newest Azure Boost offerings.

As described in [Microsoft Azure Network Adapter (MANA) support for existing VM Sizes](./accelerated-networking-mana-existing-sizes.md), Network Virtual Appliances (NVAs) may also be deployed on MANA-capable hardware.

For optimal Accelerated Networking performance, the Virtual Machine (VM) should use an operating system that fully supports NVIDIA `ConnectX-3`, `ConnectX-4 Lx`, `ConnectX-5`, **and** MANA.

When a VM or NVA using an operating system that doesn't support MANA is deployed on MANA hardware, it falls back to the NetVSC network adapter. In this scenario, the MANA Virtual Function (VF) is visible, but no network interfaces are exposed by the MANA driver. Accelerated Networking performance for a VM falling back to the NetVSC network adapter is expected to be close to SR-IOV/VF mode NVIDIA `ConnectX-3`, `ConnectX-4 Lx`, `ConnectX-5`. A high number of concurrent connections can cause performance degradation. VMs and NVAs that use DPDK also revert to using NetVSC if the underlying OS doesn't meet the requirements. For more information, see [Microsoft Azure Network Adapter (MANA) and DPDK on Linux](./setup-dpdk-mana.md).

While Microsoft has performed extensive testing across a wide range of use cases, there remains a possibility that virtual machines may experience intermittent connectivity or degraded performance.

For best performance and overall experience, we recommend migrating to the latest generation of VMs. At a minimum, ensure your operating systems fully support MANA.

## FAQ

### How do I know if my NVA supports MANA?

Reach out to your NVA provider to determine if the NVA supports MANA.

### How do I determine if my NVA is deployed on MANA hardware?

To determine if your NVA VM is deployed on MANA, follow the instructions in [Linux VMs with the Microsoft Azure Network Adapter](./accelerated-networking-mana-linux.md).

### Is any action needed if the NVA or underlying OS supports MANA?

No action is required if the NVA or the underlying OS already supports MANA.

### What if additional time is needed to migrate to an NVA that fully supports MANA?

You can apply a tag to Network Virtual Appliances (NVAs), VMs, and Virtual Machine Scale Sets for MANA support. This tag provides a temporary reprieve and allows time to migrate to an NVA or operating system that fully supports MANA.

### What if the NVA is acquired directly from the NVA provider and not through the Azure Marketplace?

Work with your NVA provider directly to determine if any changes are required in the deployment templates or mechanisms to ensure the tag is applied to existing and new deployments.

### Are Managed Service NVAs affected by this change?

Yes. NVAs provided through a managed service are also impacted by this change. Work with the managed service provider to determine their plans and processes for applying the policy.

### How long will the tag be usable?

The tag will be usable until the end of September 2026. After this time, the systems will be updated to ignore the tag, allowing the NVAs to be deployed on MANA-enabled hardware.

### What support is available to help apply this tag on my applicable resources?

To apply this tag across applicable resources at scale, you can [apply a built-in Azure Policy definition](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe87a87f5-e6dd-4919-be21-abb0a4ea4630/version/1.0.0/scopes~/%5B%22%2Fsubscriptions%2F12015272-f077-4945-81de-a5f607d067e1%22%2C%22%2Fsubscriptions%2F0ba674a6-9fde-43b4-8370-a7e16fdf0641%22%5D/contextRender~/false).

Like any other Azure Policy assignment, it can be applied at the following scope levels to cover applicable resources underneath it:

| Scope level | Applies to |
|---|---|
| Root Management Group | Entire Azure Tenant (all subscriptions) |
| Management Group | Multiple subscriptions |
| Subscription | All resource groups and resources in the subscription |
| Resource Group | Resources in that resource group |
| Resource | Single resource |

The policy applies a specific tag, `LegacyVMNVA`, to NVA deployments. The policy covers individual workloads and Virtual Machine Scale Sets scenarios as well.

Logic in the policy definition scopes the tag application to specific NVA publishers and associated product IDs, which are available in the Azure Marketplace. The tag inhibits deployment of NVAs on MANA-enabled hardware.

### Does applying the policy have any cost implications for my subscription?

No. There are no cost implications of applying the policy.

### How do I assign a policy definition?

Microsoft recommends that policy enforcement is applied gradually to your environment following your organization's strategies for safe rollout. Azure Policy supports safe rollout primitives that enable customers to gradually roll out enforcement by region and resource type.

For a more detailed breakdown of the mechanisms available to gradually roll out this policy assignment, see [Safe deployment of Azure Policy assignments](/azure/governance/policy/how-to/policy-safe-deployment-practices).

### Can the policy be edited?

No. The built-in policy can't be edited. We recommend assigning the built-in policy as-is. This minimizes management overhead since the policy is managed by Microsoft and ensures you receive policy revisions and updates.

However, if the definition needs further customization, the policy can be duplicated, customized as needed, and then assigned.

### Will there be new versions of the policy definition?

There may be minor revisions to the policy. As such, we recommend applying the built-in policy. For more information on policy versioning, see [Policy Definition Versions - REST API (Azure Policy)](/rest/api/policy-authorization/policy-definition-versions).

### Is there a way to selectively apply the policy to VMs within my environment?

Azure Policy exemption capabilities can be used to exclude resources or scopes from policy enforcement. For more information, see [Details of the policy exemption structure](/azure/governance/policy/concepts/exemption-structure).

### How can I ensure that new versions are automatically applied?

At the time of assigning the policy, enable **Automatically enroll in minor version changes** to ensure that minor versions are automatically applied. You may also assign the policy with `1.*.*`.

To control the rollout of updated policy definition versions to your environment, see [Safe deployment of Azure Policy assignments](/azure/governance/policy/how-to/policy-safe-deployment-practices).

### Are there any additional steps after applying the tag or using policy to deploy the tag?

For existing VMs, a redeployment is required after the tag has been applied.

### What VM sizes is the policy applicable to?

VM sizes are specified in [Microsoft Azure Network Adapter (MANA) support for existing VM Sizes](./accelerated-networking-mana-existing-sizes.md).

### How can I verify that the tag has been applied to my resources?

The tag `LegacyVMNVA` is visible in the Azure portal for IaaS VMs and for VM Scale Set scenarios.

Azure Policy collects and aggregates compliance data, which can be used to see which resources are *compliant* against the definition (the tag is applied) versus which ones are *non-compliant* and must be remediated (the tag isn't applied). This compliance report can be viewed in the Azure portal under the **Policy** tab.

### Is there a rollback mechanism in case of an error?

To roll back the policy assignment, delete the policy assignment. For a more gradual approach, update the policy resource selector in the policy assignment to incrementally remove regions.

If the tag has been applied to existing VMs, delete the tags using your Azure client of choice and redeploy the VMs.

### Is any action needed after end of September 2026?

No action is required at the end of September 2026. However, we recommend removing the policy assignment from all associated subscriptions.

### Does the Accelerated Networking enablement status affect application of the policy?

No. Accelerated Networking enablement doesn't have any effect on the application of the policy.

## Related content

- [Accelerated Networking Overview](https://aka.ms/accelnet)
- [How Accelerated Networking works in Linux and FreeBSD VMs](/azure/virtual-network/accelerated-networking-how-it-works)
- [Microsoft Azure Network Adapter (MANA) support for existing VM Sizes](./accelerated-networking-mana-existing-sizes.md)
