---

title: Enable Azure Site Recovery for your VMs using Azure Policy
description: Learn how to enable Policy Support to protect your VMs using Azure Site Recovery. 
author: rishjai-msft
ms.author: rishjai
ms.topic: how-to
ms.date: 03/22/2021
ms.custom: template-how-to

---

# Using Policy with Azure Site Recovery

This article describes how to set up [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview) for your resources, using Azure Policy. [Azure Policy](https://docs.microsoft.com/en-us/azure/governance/policy/overview) helps to enforce certain business rules on your Azure resources and assess compliance of said resources.

## Disaster Recovery with Azure Policy
Site Recovery helps you keep your applications up and running in the event of planned or unplanned zonal/regional outages. Enabling Site Recovery on your machines through the Azure portal was a somewhat cumbersome process – it had to be enabled on each machine separately. There used to be no way to enable Site Recovery en masse on specific resource groups that contain business-critical applications.

Azure Policy is a solution to the above-mentioned problem. Once you have a disaster recovery policy created for a resource group, then all the new virtual machines that are added to the resource group will get Site Recovery enabled for them automatically. Moreover, for all the virtual machines already present in the resource group, you can get Site Recovery enabled through bulk remediation.

## Prerequisites

- Understand how to assign a Policy [here](https://docs.microsoft.com/azure/governance/policy/assign-policy-portal).
- Learn more about the Architecture of Azure to Azure Disaster Recovery [here](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-architecture).
- Review the support matrix for Azure Site Recovery Policy Support:

**Scenario** | **Support Statement**
--- | ---
Managed Disks | Supported
Unmanaged Disks  | Not supported
Multiple Disks | Supported
Availability Sets | Supported
Availability Zones | Not supported
Azure Disk Encryption (ADE) enabled VMs | Not supported
Proximity Placement Groups (PPG) | Not supported
Customer-managed keys (CMK) enabled disks | Not supported
Storage spaces direct (S2D) clusters | Not supported
Azure Resource Manager Deployment Model | Supported
Classic Deployment Model | Not supported
Zone to Zone DR  | Not supported
Azure Disk Encryption v1 | Not supported
Azure Disk Encryption v2 | Not supported
Interoperability with Azure Backup | Not supported
Hot add/remove of disks | Not supported
Interoperability with other policies applied as default by Azure (if any) | Supported

<!-- 4. H2s 
Required. A how-to article explains how to do a task. The bulk of each H2 should be 
a procedure.
-->

## Create a Policy Assignment
In this section, you create a policy assignment that enables Azure Site Recovery for all newly created resources.
1. Select **Assignments** on the left side of the Azure Policy page. An assignment is a policy that
   has been assigned to take place within a specific scope.
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/select-assignments.png" alt-text="Screenshot of selecting the Assignments page from Policy Overview page." border="false":::

1. Select **Assign Policy** from the top of the **Policy - Assignments** page.
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/select-assign-policy.png" alt-text="Screenshot of selecting 'Assign policy' from Assignments page." border="false":::

1. On the **Assign Policy** page, set the **Scope** by selecting the ellipsis and then selecting either a subscription or a resource group. A scope determines what resources or grouping of resources the policy assignment gets enforced on. Then use the **Select** button at the bottom of the **Scope** page.

1. Launch the _Policy Definition Picker_ by selecting the ellipses next to **Policy Definition**. _Search for "AzureSiteRecovery-Replication-Policy"_ and select the Policy.
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/select-policy-definition.png" alt-text="Screenshot of selecting 'Policy Definition' from Basics page." border="true":::

1. The **Assignment name** is automatically populated with the policy name you selected, but you can change it. It may be helpful if you plan to assign multiple Azure Site Recovery Policies to the same scope.

1. Select **Next** to configure Azure Site Recovery Properties for the Policy.

## Configure Target Settings and Properties
You are on the way to create a Policy to enable Azure Site Recovery. Let us now configure the Target Settings and Properties:
1. You are on the _Parameters_ section of the _Assign Policy_ workflow, which looks like this:
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/specify-parameters.png" alt-text="Screenshot of selecting 'Policy Definition' from Basics page." border="true":::
1. Select appropriate values for these parameters:
    - **Source Region**: The Source Region of the VMs for which the Policy will be applicable.
    >[!NOTE]
    >The policy will apply to all the VMs belonging to the Source Region. Any VM not belonging to the Source Region will not be included in _Resource Compliance_.
    - **Target Region**: The location where your source virtual machine data will be replicated. Site Recovery provides a list of suitable target regions based on the selected machine's location. We recommend that you use the same location as the Recovery Services vault's location.
    - **Target Resource Group**: The resource group to which all your replicated virtual machines belong. By default, Site Recovery creates a new resource group in the target region.
    - **Vault Resource Group**: The resource group in which Recovery Services Vault exists.
    - **Recovery Services Vault**: The Vault against which all the VMs of the Scope will get protected.
    - **Existing Recovery VNet ID**: Pick an existing virtual network in the target region to be used for recovery virtual machine.
    - **Target Availability Zone**: Enter the Availability Zone of the Target Region where the VM will failover.
    >[!NOTE]
    >For Zone to Zone Scenario, you need to choose the Same Target Region as the Source Region, and opt for a different Availability Zone in _Target Availability Zone_.

1. Select on **Next** to decide on Remediation Task.

## Remediation and other properties
1. You have configured the Target Properties for Azure Site Recovery. However, this policy will take effect only for newly created resources. Existing resources can be updated via a Remediation Task after the policy is assigned. You can create a Remediation Task here by checking _Create a Remediation Task_ checkbox.

1. Azure Policy will create a [Managed Identity](https://aka.ms/arm-policy-identity), which will have owner permissions to enable Azure Site Recovery for the resources in the scope.

1. You can configure a custom Non-Compliance message for the policy on the _Non-compliance messages_ tab.

1. Select Next at the bottom of the page or the _Review + Create_ tab at the top of the page to move to the next segment of the assignment wizard.

1. Review the selected options, then select _Create_ at the bottom of the page.

## Next Steps

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.