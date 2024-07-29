---
title: Best practices for virtual machine cost optimization
description: Learn the best practices for managing costs for virtual machines.
author: tomvcassidy
ms.author: tomcassidy
ms.custom: subject-cost-optimization
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 02/21/2024
---

# Best practices for virtual machine cost optimization

This article describes the best practices for managing costs for virtual machines.

If you'd like to see how the billing model works for virtual machines and how to plan for costs ahead of resource deployment, see [Plan to manage costs](cost-optimization-plan-to-manage-costs.md). If you'd like to learn how to monitor costs for virtual machines, see [Monitor costs for virtual machines](cost-optimization-monitor-costs.md).

In this article, you'll learn:
* Best practices for managing and reducing costs for virtual machines
* How to use Azure policies to manage and reduce costs

## Best practices to manage and reduce costs for virtual machines

The following are some best practices you can use to reduce the cost of your virtual machines:

- Use the [virtual machines selector](https://azure.microsoft.com/pricing/vm-selector/) to identify the best VMs for your needs
    - For development and test environments:
        - Use B-Series virtual machines
            - Use at least B2 for Windows machines
        - Use HDDs instead of SSDs when you can
        - Use locally redundant storage (LRS) accounts instead of geo- or zone-redundant storage accounts
        - Use Logic Apps or Azure Automation to implement an automatic start and stop schedule for your VMs
    - For production environments:
        - Use the dedicated Standard pricing tier or higher
        - Use a Premium SSD v2 disk and programmatically adjust its performance to account for either higher or lower demand based on your workload patterns
        - For other disk types, size your disks to achieve your desired performance without the need for over-provisioning. Account for fluctuating workload patterns, and minimizing unused provisioned capacity
- Use [role-based-access-control (RBAC)](../role-based-access-control/built-in-roles.md) to control who can create resources
- Use [Azure Spot virtual machines](spot-vms.md) where you can
- For Windows virtual machines, consider [Azure Hybrid Benefit for Windows Server](windows/hybrid-use-benefit-licensing.md) to save cost on licensing
- Use [cost alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md) to monitor usage and spending
- Minimize idle instances by configuring [autoscaling](../virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview.md)
- Configure Azure Bastion for operational access

### Use policies to help manage and reduce costs for virtual machines

You can use [Azure Policy](../governance/policy/overview.md) to help govern and optimize the costs of your resources.

There are built-in policies for [virtual machines](policy-reference.md) and [networking services](../networking/policy-reference.md) that can help with cost savings:

- **Allowed virtual machine SKUs** - This policy enables you to specify a set of virtual machine size SKUs that your organization can deploy. You could use this policy to restrict any virtual machine sizes that exceed your desired budget. This policy would require updates to maintain as new virtual machine SKUs are added.
    - https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMSkusAllowed_Deny.json
    -  You can review the available [VM sizes](sizes.md) and cross-reference their associated costs on the pricing pages for [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) and [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/).
- **Network interfaces should not have public IPs** - This policy restricts the creation of public IP addresses, except in cases where they are explicitly allowed. Restricting unnecessary exposure to the internet can help reduce bandwidth and virtual network data costs.

You can also make custom policies using Azure Policy. Some examples include:

- Implement policies to restrict what resources can be created:
     - https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/AllowedResourceTypes_Deny.json 
- Implement policies to not allow certain resources to be created:
     - https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/InvalidResourceTypes_Deny.json
- Using the resource policy to limit the allowed locations where virtual machines can be deployed.
- Auditing resources that are incurring costs even after virtual machine deletion.
- Auditing resources to enforce the use of the Azure Hybrid Benefit.

## Next steps

In this article, you learned the best practices for managing and reducing costs for virtual machines and how to use Azure policies to manage and reduce costs.

For more information on virtual machine cost optimization, see the following articles:

- Learn how to [plan to manage costs for virtual machines](cost-optimization-plan-to-manage-costs.md).
- Learn how to [monitor costs for virtual machines](cost-optimization-monitor-costs.md).
- Learn [how to optimize your cloud investment with Microsoft Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
- Learn how to create [Linux](linux/quick-create-portal.md) and [Windows](windows/quick-create-portal.md) virtual machines.
- Take the [Microsoft Azure Well-Architected Framework - Cost Optimization training](/training/modules/azure-well-architected-cost-optimization/).
- Review the [Well-Architected Framework cost optimization design principles](/azure/well-architected/cost-optimization/principles) and how they apply to [virtual machines](/azure/well-architected/service-guides/virtual-machines-review#cost-optimization).
