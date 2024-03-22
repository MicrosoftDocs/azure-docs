---
title: Deploy STIG-compliant Windows Virtual Machines (Preview)
description: This quickstart shows you how to deploy a STIG-compliant Windows VM (Preview) from the Azure portal or Azure Government portal.
author: EliotSeattle
ms.author: eliotgra
ms.service: azure-government
ms.topic: quickstart
ms.custom: mode-other, kr2b-contr-experiment
recommendations: false
ms.date: 06/14/2023
---

# Deploy STIG-compliant Windows Virtual Machines (Preview)

Microsoft Azure Security Technical Implementation Guides (STIGs) solution templates help you accelerate your [DoD STIG compliance](https://public.cyber.mil/stigs/) by delivering an automated solution to deploy virtual machines and apply STIGs through the Azure portal.

This quickstart shows how to deploy a STIG-compliant Windows virtual machine (Preview) on Azure or Azure Government using the corresponding portal.

## Prerequisites

- Azure or Azure Government subscription
- Storage account
  - If desired, must be in the same resource group/region as the VM
  - Required if you plan to store Log Analytics diagnostics
- Log Analytics workspace (required if you plan to store diagnostic logs)

## Sign in to Azure

Sign in at the [Azure portal](https://portal.azure.com/) or [Azure Government portal](https://portal.azure.us/) depending on your subscription.

## Create a STIG-compliant virtual machine

1. Select *Create a resource*.
1. Type **Azure STIG Templates for Windows** in the search bar and press enter.
1. Select **Azure STIG Templates for Windows** from the search results and then **Create**.
1. In the **Basics** tab, under **Project details**:

    a. Select an existing *Subscription*.

    b. Create a new *Resource group* or enter an existing resource group.

    c. Select your *Region*.

    > [!IMPORTANT]
    > Make sure to choose an empty resource group or create a new one.
    
    :::image type="content" source="./media/stig-project-details.png" alt-text="Project details section showing where you select the Azure subscription and the resource group for the virtual machine" border="false":::

1. Under **Instance details**, enter all required information:

    a. Enter the *VM name*.

    b. Select the *Availability options*. To learn about availability sets, see [Availability sets overview](../virtual-machines/availability-set-overview.md).

    c. Select the *Windows OS version*.

    d. Select the instance *Size*.

    e. Enter the administrator account *Username*.

    f. Enter the administrator account *Password*.

    g. Confirm *Password*.

    h. Check if using an existing Windows Server license.

    :::image type="content" source="./media/stig-windows-instance-details.png" alt-text="Instance details section where you provide a name for the virtual machine and select its region, image, and size" border="false":::

1. Under **Disk**:

    a. Select the *OS disk type*.

    b. Select the *Encryption type*.

    :::image type="content" source="./media/stig-disk-options.png" alt-text="Disk options section showing where you select the disk and encryption type for the virtual machine" border="false":::

1. Under **Networking**:

    a. Select the *Virtual Network*. Either use existing virtual network or select *Create new* (note RDP inbound is disallowed).

    b. Select *Subnet*.

    c. Application security group (optional).

    :::image type="content" source="./media/stig-network-interface.png" alt-text="Network interface section showing where you select the network and subnet for the virtual machine" border="false":::

1. Under **Management**:

    a. For Diagnostic settings select *Storage account* (optional, required to store diagnostic logs).

    b. Enter Log Analytics workspace (optional, required to store log analytics).

    :::image type="content" source="./media/stig-windows-diagnostic-settings.png" alt-text="Management section showing where you select the diagnostic settings for the virtual machine" border="false":::

1. Select **Review + create** to review summary of all selections.

1. Once the validation check is successful select ***Create***.

1. Once the creation process is started, the ***Deployment*** process page will be displayed:

    a.  **Deployment** ***Overview*** tab displays the deployment process including any errors that may occur. Once deployment is
        complete, this tab provides information on the deployment and provides the opportunity to download the deployment details.

    b.  ***Inputs*** tab provides a list of the inputs to the deployment.

    c.  ***Outputs*** tab provides information on any deployment outputs.

    d.  ***Template*** tab provides downloadable access to the JSON scripts used in the template.

1. The deployed virtual machine can be found in the resource group used for the deployment. Since inbound RDP is disallowed, Azure Bastion must be used to connect to the VM.

## High availability and resiliency
 
Our solution template creates a single instance virtual machine using premium or standard operating system disk, which supports [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/).
 
We recommend you deploy multiple instances of virtual machines configured behind Azure Load Balancer and/or Azure Traffic Manager for higher availability and resiliency.
 
## Business continuity and disaster recovery (BCDR)
 
As an organization you need to adopt a business continuity and disaster recovery (BCDR) strategy that keeps your data safe, and your apps and workloads online, when planned and unplanned outages occur.
 
[Azure Site Recovery](../site-recovery/site-recovery-overview.md) helps ensure business continuity by keeping business apps and workloads running during outages. Site Recovery replicates workloads running on physical and virtual machines from a primary site to a secondary location. When an outage occurs at your primary site, you fail over to secondary location, and access apps from there. After the primary location is running again, you can fail back to it.
 
Site Recovery can manage replication for:
 
- Azure VMs replicating between Azure regions.
- On-premises VMs, Azure Stack VMs, and physical servers.
 
To learn more about backup and restore options for virtual machines in Azure, continue to [Overview of backup options for VMs](../virtual-machines/backup-recovery.md).

## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources.

Select the resource group for the virtual machine, then select **Delete**. Confirm the name of the resource group to finish deleting the resources.

## Support

Contact Azure support to get assistance with issues related to STIG solution templates. You can create and manage support requests in the Azure portal. For more information see, [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md). Use the following support paths when creating a ticket:

Azure -> Virtual Machine running Windows -> Cannot create a VM -> Troubleshoot my ARM template error

:::image type="content" source="./media/stig-windows-support.png" alt-text="New support request for Windows STIG solution template":::

## Frequently asked questions

**When will STIG-compliant VMs reach general availability (GA)?** </br>
The Azure STIG-compliant VM offering is expected to remain in Preview instead of reaching GA because of the release cadence for DISA STIGs. Every quarter, the offering is upgraded with latest guidance, and this process is expected to continue in the future. See previous section for support options that most customers require for production workloads, including creating support tickets.

**Can Azure Update Management be used with STIG images?** </br>
Yes, [Update Management](../automation/update-management/overview.md) in Azure Automation supports STIG images.

**What STIG settings are being applied by the template?** </br>
For more information, see [Deploy Azure Virtual Machine (Windows) and apply STIG](https://github.com/Azure/ato-toolkit/tree/master/stig/windows).

## Next steps

This quickstart showed you how to deploy a STIG-compliant Windows virtual machine (Preview) on Azure or Azure Government. For more information about creating virtual machines in:

- Azure, see [Quickstart: Create a Windows virtual machine in the Azure portal](../virtual-machines/windows/quick-create-portal.md).
- Azure Government, see [Tutorial: Create virtual machines](./documentation-government-quickstarts-vm.md).

To learn more about Azure services, continue to the Azure documentation.

> [!div class="nextstepaction"]
> [Azure documentation](../index.yml)

For more information about Azure Government, see the following resources:

- [Azure Government overview](./documentation-government-welcome.md)
- [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md)
- [Azure Government security](./documentation-government-plan-security.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope)
- [Azure Government DoD overview](./documentation-government-overview-dod.md)
- [FedRAMP – Azure compliance](/azure/compliance/offerings/offering-fedramp)
- [DoD Impact Level 5 – Azure compliance](/azure/compliance/offerings/offering-dod-il5)
- [Isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md)
- [Secure Azure Computing Architecture](./compliance/secure-azure-computing-architecture.md)
- [Security Technical Implementation Guides (STIGs)](https://public.cyber.mil/stigs/)
