---

title: Enable Azure Site Recovery for your VMs using Azure Policy
description: Learn how to enable Policy Support to protect your VMs using Azure Site Recovery.
author: rishjai-msft
ms.author: rishjai
ms.topic: how-to
ms.date: 07/25/2021
ms.custom: template-how-to

---

# Using Policy with Azure Site Recovery

This article describes how to set up [Azure Site Recovery](./site-recovery-overview.md) for your resources, using Azure Policy. [Azure Policy](../governance/policy/overview.md) helps to enforce certain business rules on your Azure resources and assess compliance of said resources.

## Disaster Recovery with Azure Policy
Site Recovery helps you keep your applications up and running in the event of planned or unplanned zonal/regional outages. Enabling Site Recovery on your machines at scale through the Azure portal can be challenging. Azure Policy can help you enable replication at scale without resorting to any scripting.

With the built-in Azure Policy, you have a way to enable Site Recovery en masse on specific subscriptions or resource groups through the portal. Once you have a disaster recovery policy created for a subscription or resource group(s), then all the new virtual machines that are added to that/those subscription or resource group(s) will get Site Recovery enabled for them automatically. Moreover, for all the virtual machines already present in the resource group, Site Recovery can be enabled through a process called _remediation_(details below).

>[!NOTE]
>The _Scope_ of this policy can be at a subscription level or resource group level.

## Prerequisites

- Understand how to assign a Policy [here](../governance/policy/assign-policy-portal.md).
- Learn more about the Architecture of Azure to Azure Disaster Recovery [here](./azure-to-azure-architecture.md).
- Review the support matrix for Azure Site Recovery Policy Support:

**Scenario** | **Support Statement**
--- | ---
Managed Disks | Supported <br/>OS disk should be at least 1GB and at most 4TB in size.<br/>Data disk(s) should be at least 1GB and at most 32TB in size.<br/>
Unmanaged Disks  | Not supported
Multiple Disks | Supported for up to 100 disks per VM.
Ephemeral Disks | Not supported
Ultra Disks | Not supported
Availability Sets | Supported
Availability Zones | Supported
Azure Disk Encryption (ADE) enabled VMs | Not supported
Proximity Placement Groups (PPG) | Supported. If the source VM is inside a PPG, then the Policy will create a PPG by appending ‘-asr’ on the source PPG and use it for the DR/secondary region failover.
VMs in both PPG and availability set | Not supported
Customer-managed keys (CMK) enabled disks | Not supported
Storage spaces direct (S2D) clusters | Not supported
VMSS VMs | Not supported
VM with image as ASR Configuration Server | Not supported
Powered off VMs | Not supported. VM must be powered on for the Policy to work on it.
Azure Resource Manager Deployment Model | Supported
Classic Deployment Model | Not supported
Zone to Zone DR  | Supported
Interoperability with other policies applied as default by Azure (if any) | Supported

>[!NOTE]
>In the following cases, Site Recovery will not be enabled:
>1. If a not-supported VM is created within the scope of policy.
>1. If a VM is a part of both an Availability Set as well as PPG.

## Create a Policy Assignment
To create a policy assignment of the built-in Azure Site Recovery Policy that enables replication for all newly created VMs in a subscription or resource group(s), perform the following:
1. Go to the **Azure portal** and navigate to **Azure Policy**
1. Select **Assignments** on the left side of the Azure Policy page. An assignment is a policy that
   has been assigned to execute on a specific scope.
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/select-assignments.png" alt-text="Screenshot of selecting the Assignments page from Policy Overview page." border="false":::

1. Select **Assign Policy** from the top of the **Policy - Assignments** page.
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/select-assign-policy.png" alt-text="Screenshot of selecting 'Assign policy' from Assignments page." border="false":::

1. On the **Assign Policy** page, set the **Scope** by selecting the ellipsis and then selecting a subscription and then optionally a resource group. A scope determines what resources or grouping of resources the policy assignment gets enforced on. Then use the **Select** button at the bottom of the **Scope** page. Please note that you can also choose to exclude a few resource groups from assignment of the Policy by selecting them under ‘Exclusions’. This is particularly useful when you want to assign the Policy to all but a few resource groups in a given subscription. 

1. Launch the _Policy Definition Picker_ by selecting the ellipses next to **Policy Definition**. Search for _'disaster recovery'_ or _'site recovery'_. You will find a built-in Policy titled _"Configure disaster recovery on virtual machines by enabling replication via Azure Site Recovery"_. Select it and click _'Select'_.
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/select-policy-definition.png" alt-text="Screenshot of selecting 'Policy Definition' from Basics page." border="true":::

1. The **Assignment name** is automatically populated with the policy name you selected, but you can change it. It may be helpful if you plan to assign multiple Azure Site Recovery Policies to the same scope.

1. Select **Next** to configure Azure Site Recovery Properties for the Policy.

## Configure Target Settings and Properties
You are on the way to create a Policy to enable Azure Site Recovery. Let us now configure the Target Settings and Properties:
1. Go to the **Parameters** section of the **Assign Policy** workflow. Unselect _Only show parameters that need input or review_. The parameters look as follows:
:::image type="content" source="./media/azure-to-azure-how-to-enable-policy/specify-parameters.png" alt-text="Screenshot of setting Parameters from Parameters page." border="true":::
1. Select appropriate values for these parameters:
    - **Source Region**: The Source Region of the Virtual Machines for which the Policy will be applicable.
    >[!NOTE]
    >The policy will apply to all the Virtual Machines belonging to the Source Region in the scope of the Policy. Virtual Machines not present in the Source Region will not be included.
    - **Target Region**: The location where your source virtual machine data will be replicated. Site Recovery provides the list of target regions that the customer can replicate to. If you want to enable zone to zone replication within a given region, select the same region as Source Region.
    - **Target Resource Group**: The resource group to which all your replicated virtual machines belong. By default, Site Recovery creates a new resource group in the target region.
    - **Vault Resource Group**: The resource group in which Recovery Services Vault exists.
    - **Recovery Services Vault**: The Vault against which all the VMs of the Scope will get protected. Policy can create a new vault on your behalf, if required.
    - **Recovery Virtual Network** **(optional parameter)**: Pick an existing virtual network in the target region to be used for recovery virtual machine. Policy can create a new virtual network for you as well, if required.
    - **Target Availability Zone** **(optional)**: Enter the Availability Zone of the Target Region where the Virtual Machine will failover. If some of the virtual machines in your resource group are already in the target availability zone, then the policy will not be applied to them in case you are setting up Zone to Zone DR.
    - **Cache Storage Account** **(optional)**: Azure Site Recovery makes use of a storage account for caching replicated data in the source region. Please select an account of your choice. You can choose to select the default cache storage account if you do not need to take care of any special considerations.
    > [!NOTE]
    > Please check cache storage account limits in the [Support Matrix](../site-recovery/azure-to-azure-support-matrix.md#cache-storage) before choosing a cache storage account. 
    - **Tag name** **(optional)**: You can apply tags to your replicated VMs to logically organize them into a taxonomy. Each tag consists of a name and a value pair. You can use this field to enter the tag name. For example, *Environment*. 
    - **Tag values** **(optional)**: You can use this field to enter the tag value. For example, *Production*.
    - **Tag type** **(optional)**: You can use tags to include VMs as part of the Policy assignment by selecting ‘Tag type = Inclusion’. This ensures that only the VMs that have the tag (provided via ‘Tag name’ and ‘Tag values’ fields) are included in the Policy assignment. Alternatively, you can choose ‘Tag type = Exclusion’. This ensures that the VMs that have the tag (provided via ‘Tag name’ and ‘Tag values’ fields) are excluded from Policy assignment. If no tags are selected, the entire resource group and/or subscription (as the case may be) gets selected for the Policy assignment.
    - **Effect**: Enable or disable the execution of the policy. Select _DeployIfNotExists_ to enable the policy as soon as it gets created.

1. Select **Next** to decide on Remediation Task.

## Remediation and other properties
1. The Target Properties for Azure Site Recovery have been configured. However, this policy will take effect only for newly created virtual machines in the scope of the Policy. Pre-existing VMs in the scope of the Policy do not see replication being enabled on them automatically. This can be solved via a Remediation Task after the policy is assigned. You can create a Remediation Task here by checking _Create a Remediation Task_ checkbox.

1. Azure Policy will create a [Managed Identity](../governance/policy/how-to/remediate-resources.md), which will have owner permissions to enable Azure Site Recovery for the resources in the scope.

1. You can configure a custom Non-Compliance message for the policy on the _Non-compliance messages_ tab.

1. Select Next at the bottom of the page or the _Review + Create_ tab at the top of the page to move to the next segment of the assignment wizard.

1. Review the selected options, then select _Create_ at the bottom of the page.

## Checking protection status of VMs after assignment of Policy
After the Policy is assigned, please wait for up to 1 hour for replication to be enabled. Subsequently, please go to the Recovery Services Vault chosen during Policy assignment and look for replication jobs. You should be able to locate all VMs for which Site Recovery was enabled via Policy in this vault.  

If the VMs do not show up in the vault as protected, you can go back to the Policy assignment and attempt to remediate. 

If the VMs show up as non-compliant, it may be because Policy evaluation may have taken place before the VM was up and running completely. You can choose to either remediate or wait for up to 24 hours for the Policy to evaluate the subscription/resource group and remediate automatically.

## Next Steps

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.
