---

title: Enable Azure Site Recovery for your VMs using Azure Policy
description: Learn how to enable Policy Support to protect your VMs using Azure Site Recovery.
author: rishjai-msft
ms.author: rishjai
ms.topic: how-to
ms.date: 07/25/2021
ms.custom: template-how-to

---

# Using Policy with Azure Site Recovery (Public Preview)

This article describes how to set up [Azure Site Recovery](./site-recovery-overview.md) for your resources, using Azure Policy. [Azure Policy](../governance/policy/overview.md) helps to enforce certain business rules on your Azure resources and assess compliance of said resources.

## Disaster Recovery with Azure Policy
Site Recovery helps you keep your applications up and running in the event of planned or unplanned zonal/regional outages. Enabling Site Recovery on your machines at scale through the Azure portal can be challenging. Now, you have way to enable Site Recovery en masse on specific Resource Groups (_Scope_ of the Policy) through the portal.

Azure Policy solves this problem. Once you have a disaster recovery policy created for a resource group, then all the new virtual machines that are added to the Resource Group will get Site Recovery enabled for them automatically. Moreover, for all the virtual machines already present in the Resource Group, you can get Site Recovery enabled through a process called _remediation_ (details below).

>[!NOTE]
>The _Scope_ of this policy should be at Resource Group Level.

## Prerequisites

- Understand how to assign a Policy [here](../governance/policy/assign-policy-portal.md).
- Learn more about the Architecture of Azure to Azure Disaster Recovery [here](./azure-to-azure-architecture.md).
- Review the support matrix for Azure Site Recovery Policy Support:

**Scenario** | **Support Statement**
--- | ---
Managed Disks | Supported
Unmanaged Disks  | Not supported
Multiple Disks | Supported
Availability Sets | Supported
Availability Zones | Supported
Azure Disk Encryption (ADE) enabled VMs | Not supported
Proximity Placement Groups (PPG) | Supported
Customer-managed keys (CMK) enabled disks | Not supported
Storage spaces direct (S2D) clusters | Not supported
Azure Resource Manager Deployment Model | Supported
Classic Deployment Model | Not supported
Zone to Zone DR  | Supported
Interoperability with other policies applied as default by Azure (if any) | Supported

>[!NOTE]
>In the following cases, Site Recovery will not be enabled for them. However, they will reflect as _Non-compliant_ in Resource Compliance:
>1. If a not-supported VM is created within the scope of policy.
>1. If a VM is a part of both an Availability Set as well as PPG.

## Create a Policy Assignment
In this section, you create a policy assignment that enables Azure Site Recovery for all newly created resources.
1. Go to the **Azure portal** and navigate to **Azure Policy**
1. Select **Assignments** on the left side of the Azure Policy page. An assignment is a policy that
   has been assigned to execute on a specific scope.
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/select-assignments.png" alt-text="Screenshot of selecting the Assignments page from Policy Overview page." border="false":::

1. Select **Assign Policy** from the top of the **Policy - Assignments** page.
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/select-assign-policy.png" alt-text="Screenshot of selecting 'Assign policy' from Assignments page." border="false":::

1. On the **Assign Policy** page, set the **Scope** by selecting the ellipsis and then selecting a subscription and then a resource group. A scope determines what resources or grouping of resources the policy assignment gets enforced on. Then use the **Select** button at the bottom of the **Scope** page.

1. Launch the _Policy Definition Picker_ by selecting the ellipses next to **Policy Definition**. _Search for "Configure disaster recovery on virtual machines by enabling replication"_ and select the Policy.
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/select-policy-definition.png" alt-text="Screenshot of selecting 'Policy Definition' from Basics page." border="true":::

1. The **Assignment name** is automatically populated with the policy name you selected, but you can change it. It may be helpful if you plan to assign multiple Azure Site Recovery Policies to the same scope.

1. Select **Next** to configure Azure Site Recovery Properties for the Policy.

## Configure Target Settings and Properties
You are on the way to create a Policy to enable Azure Site Recovery. Let us now configure the Target Settings and Properties:
1. You are on the _Parameters_ section of the _Assign Policy_ workflow, which looks like this:
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/specify-parameters.png" alt-text="Screenshot of setting Parameters from Parameters page." border="true":::
1. Select appropriate values for these parameters:
    - **Source Region**: The Source Region of the Virtual Machines for which the Policy will be applicable.
    >[!NOTE]
    >The policy will apply to all the Virtual Machines belonging to the Source Region in the scope of the Policy. Virtual Machines not present in the Source Region will not be included in _Resource Compliance_.
    - **Target Region**: The location where your source virtual machine data will be replicated. Site Recovery provides the list of target regions that the customer can replicate to. We recommend that you use the same location as the Recovery Services vault's location.
    - **Target Resource Group**: The resource group to which all your replicated virtual machines belong. By default, Site Recovery creates a new resource group in the target region.
    - **Vault Resource Group**: The resource group in which Recovery Services Vault exists.
    - **Recovery Services Vault**: The Vault against which all the VMs of the Scope will get protected. Policy can create a new vault on your behalf if required.
    - **Recovery Virtual Network**: Pick an existing virtual network in the target region to be used for recovery virtual machine. Policy can create a new virtual network for you as well, if required.
    - **Target Availability Zone**: Enter the Availability Zone of the Target Region where the Virtual Machine will failover.
    >[!NOTE]
    >For Zone to Zone Scenario, you need to choose the Same Target Region as the Source Region, and opt for a different Availability Zone in _Target Availability Zone_.     
    >If some of the virtual machines in your resource group are already in the target availability zone, then the policy will not be applied to them in case you are setting up Zone to Zone DR.
    - **Effect**: Enable or disable the execution of the policy. Select _DeployIfNotExists_ to enable the policy as soon as it gets created.

1. Select on **Next** to decide on Remediation Task.

## Remediation and other properties
1. The Target Properties for Azure Site Recovery have been configured. However, this policy will take effect only for newly created virtual machines in the scope of the Policy. It can be applied to existing resources via a Remediation Task after the policy is assigned. You can create a Remediation Task here by checking _Create a Remediation Task_ checkbox.

1. Azure Policy will create a [Managed Identity](../governance/policy/how-to/remediate-resources.md), which will have owner permissions to enable Azure Site Recovery for the resources in the scope.

1. You can configure a custom Non-Compliance message for the policy on the _Non-compliance messages_ tab.

1. Select Next at the bottom of the page or the _Review + Create_ tab at the top of the page to move to the next segment of the assignment wizard.

1. Review the selected options, then select _Create_ at the bottom of the page.

## Next Steps

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.
