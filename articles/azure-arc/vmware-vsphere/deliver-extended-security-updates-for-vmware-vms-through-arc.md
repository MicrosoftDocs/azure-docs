---
title:  Deliver ESUs for VMware VMs through Arc
description: Deliver ESUs for VMware VMs through Azure Arc. 
ms.date: 12/06/2023
ms.topic: how-to
ms.services: azure-arc
ms.subservice: azure-arc-vmware-vsphere
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri
keywords: "VMware, Arc, Azure"
---

# Deliver ESUs for VMware VMs through Arc

Azure Arc-enabled VMware vSphere allows you to enroll all the Windows Server 2012/2012 R2 VMs managed by your vCenter in [Extended Security Updates](/windows-server/get-started/extended-security-updates-overview) (ESUs) at scale. 

ESUs allow you to leverage cost flexibility in the form of pay-as-you-go Azure billing and enhanced delivery experience in the form of built-in inventory and keyless delivery. In addition, ESUs enabled by Azure Arc give you access to Azure management services such as [Azure Update Manager](/azure/update-manager/overview?tabs=azure-vms), [Azure Automation Change Tracking and Inventory](/azure/automation/change-tracking/overview?tabs=python-2), and [Azure Policy Guest Configuration](/azure/cloud-adoption-framework/manage/azure-server-management/guest-configuration-policy) at no additional cost. 

This article provides the steps to procure and deliver ESUs to WS 2012 and 2012 R2 VMware VMs onboarded to Azure Arc-enabled VMware vSphere. 

>[!Note]
> - To purchase ESUs, you must have Software Assurance through Volume Licensing Programs such as an Enterprise Agreement (EA), Enterprise Agreement Subscription (EAS), Enrollment for Education Solutions (EES), or Server and Cloud Enrollment (SCE). Alternatively, if your Windows Server 2012/2012 R2 machines are licensed through SPLA or with a Server Subscription, Software Assurance isn't required to purchase ESUs.

## Prerequisites

- The user account must have an Owner/Contributor role in a Resource Group in Azure to create and assign ESUs to VMware VMs. 
- The vCenter managing the WS 2012 and 2012 R2 VMs, for which the ESUs are to be applied, should be [onboarded to Azure Arc](./quick-start-connect-vcenter-to-arc-using-script.md). After onboarding, the WS 2012 and 2012 R2 VMs, for which the ESUs are to be applied, should be [Azure-enabled](./browse-and-enable-vcenter-resources-in-azure.md) and [guest management enabled](./enable-guest-management-at-scale.md). 

## Create Azure Arc ESUs 

1.	Sign in to the [Azure portal](https://portal.azure.com/).
2.	On the **Azure Arc** page, select **Extended Security Updates** in the left pane. Here, you can view and create ESU Licenses and view eligible resources for ESUs.
3.	The **Licenses** tab displays Azure Arc WS 2012 licenses that are available. Select an existing license to apply or create a new license.

    :::image type="content" source="media/deliver-esus-for-vmware-vms/select-or-create-license.png" alt-text="Screenshot of how to create a new license." lightbox="media/deliver-esus-for-vmware-vms/select-or-create-license.png":::

4.	To create a new WS 2012 license, select **Create**, and then provide the information required to configure the license on the page. For detailed information on how to complete this step, see [License provisioning guidelines for Extended Security Updates for Windows Server 2012](../servers/license-extended-security-updates.md).
5.	Review the information provided and select **Create**. The license you created appears in the list, and you can link it to one or more Arc-enabled VMware vSphere VMs by following the steps in the next section.

    :::image type="content" source="media/deliver-esus-for-vmware-vms/new-license-created.png" alt-text="Screenshot showing the successful creation of a new license." lightbox="media/deliver-esus-for-vmware-vms/new-license-created.png":::

## Link ESU licenses to Arc-enabled VMware vSphere VMs

You can select one or more Arc-enabled VMware vSphere VMs to link to an ESU license. Once you've linked a VM to an activated ESU license, the VM is eligible to receive Windows Server 2012 and 2012 R2 ESUs.

>[!Note]
> You have the flexibility to configure your patching solution of choice to receive these updates – whether it's [Azure Update Manager](/azure/update-center/overview), [Windows Server Update Services](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus), Microsoft Updates, [Microsoft Endpoint Configuration Manager](/mem/configmgr/core/understand/introduction), or a third-party patch management solution.

1.	Select the **Eligible Resources** tab to view a list of all your Arc-enabled server machines running Windows Server 2012 and 2012 R2, including VMware machines that are guest management enabled. The **ESUs status** column indicates whether the machine is ESUs enabled.
 
    :::image type="content" source="media/deliver-esus-for-vmware-vms/view-arc-enabled-machines.png" alt-text="Screenshot of arc-enabled server machines running Windows Server 2012 and 2012 R2 under the eligible resources tab." lightbox="media/deliver-esus-for-vmware-vms/view-arc-enabled-machines.png":::

2.	To enable ESUs for one or more machines, select them in the list, and then select **Enable ESUs**.
3.	On the **Enable Extended Security Updates** page, you can see the number of machines selected to enable ESUs and the WS 2012 licenses available to apply. Select a license to link to the selected machine(s) and select **Enable**.

    :::image type="content" source="media/deliver-esus-for-vmware-vms/enable-license.png" alt-text="Screenshot of how to select and enable license." lightbox="media/deliver-esus-for-vmware-vms/enable-license.png":::

4.	The **ESUs status** column value of the selected machines changes to **Enabled**.

    >[!Note]
    > - See [Troubleshoot delivery of Extended Security Updates for Windows Server 2012](../servers/troubleshoot-extended-security-updates.md) to troubleshoot any problems that occur during the enablement process.<br>
    > - Review the [additional scenarios](../servers/deliver-extended-security-updates.md#additional-scenarios) in which you may be eligible to receive ESU patches at no additional cost.

## Next steps

[Programmatically deploy and manage Azure Arc Extended Security Updates licenses](../servers/api-extended-security-updates.md).
