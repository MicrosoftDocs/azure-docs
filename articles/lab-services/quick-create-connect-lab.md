---
title: 'Quickstart: Create and connect to a lab'
titleSuffix: Azure Lab Services
description: In this quickstart, you learn how to create a Windows-based lab in Azure Lab Services. You create the lab from an Azure Marketplace image, publish it, and then connect to it through Remote Desktop (RDP).
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: quickstart
ms.date: 02/09/2023
ms.custom: mode-portal
---

# Quickstart: Create and connect to a lab in Azure Lab Services

Azure Lab Services enables you to create labs, whose infrastructure is managed by Azure. You can create labs for running classroom trainings, hackathons, or for experimenting. In this quickstart, you create a Windows-based lab virtual machine (VM) with Azure Lab Services and connect to it by using remote desktop (RDP).

To create the lab VM, you first create a lab plan in the Azure portal, and use the Azure Lab Services website to add a lab based on an Azure Marketplace VM image. After you publish the VM, you can then register for the lab and connect to it by using remote desktop.

:::image type="content" source="./media/quick-create-connect-lab/lab-services-process-windows-lab.png" alt-text="Diagram that shows the steps for creating a lab with Azure Lab Services, highlighting Create a lab plan, create lab, publish lab, and connect to lab.":::

After you complete this quickstart, you'll have a lab that you can connect to and use for your own experimentation, or you can invite other lab users.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]

[!INCLUDE [Create Azure resources](./includes/lab-services-prerequisite-lab-plan.md)]

## Create a lab

A lab contains the configuration and settings for creating lab VMs. All lab VMs within a lab are identical. You use the Azure Lab Services website to create a lab in the lab plan.

> [!NOTE]
> To create a lab, your Azure account needs the Lab Creator Azure Active Directory (Azure AD) role. As the owner of the lab plan, you can automatically create labs and you don't need the Lab Creator role.

Follow these steps to add a lab to the lab plan you created earlier:

1. Sign in to the [Azure Lab Services website](https://labs.azure.com) by using the credentials for your Azure subscription.

1. Select **New lab**.  

    :::image type="content" source="./media/quick-create-connect-lab/new-lab-button.png" alt-text="Screenshot of the Azure Lab Services website, highlighting the New lab button.":::

1. On the **New Lab** page, enter the following information, and then select **Next**:

    | Field        | Description                |
    | ------------ | -------------------------- |
    | **Name** | Enter *Lab-101*. |
    | **Virtual machine image** | Select *Windows 11 Pro*. |
    | **Virtual machine size** | Select *Medium*. |
    | **Location** | Leave the default value. |

    Some virtual machine sizes might not be available depending on the lab plan region and your [subscription core limit](./how-to-request-capacity-increase.md). Learn more about [virtual machine sizes in the administrator's guide](./administrator-guide.md#vm-sizing).

    You can [enable or disable specific virtual machine images](./specify-marketplace-images.md#enable-and-disable-images) by configuring the lab plan.

1. On the **Virtual machine credentials** page, specify the default **username** and **password**, and then select **Next**.

    By default, all the lab VMs use the same credentials.

    > [!IMPORTANT]
    > Make a note of username and password. They won't be shown again.

    :::image type="content" source="./media/quick-create-connect-lab/new-lab-credentials.png" alt-text="Screenshot of the Virtual machine credentials page in the Azure Lab Services website.":::

1. On the **Lab policies** page, leave the default values and select **Next**.

1. On the **Template virtual machine settings** page, select **Use virtual machine image without customization**.

    In this quickstart, you use the VM image as-is, known as a *templateless VM*. Azure Lab Services also supports creating a *template VM*, which lets you make configuration changes or install software on top of the VM image.

    :::image type="content" source="./media/quick-create-connect-lab/templateless-virtual-machine-settings.png" alt-text="Screenshot of the Template virtual machine settings page, with the option selected to create a templateless VM."::: 

1. Select **Finish** to start the lab creation. It might take several minutes for the lab creation to finish.

1. When the lab creation finishes, you can see the lab details in the **Template** page.

    :::image type="content" source="./media/quick-create-connect-lab/templateless-template.png" alt-text="Screenshot of Template page for a templateless lab.":::

## Publish lab

Before Azure Lab Services can create lab VMs for your lab, you first need to publish the lab. When you publish the lab, you need to specify the maximum number of lab VMs that Azure Lab Services creates. All VMs in the lab share the same configuration as the lab template.

To publish the lab and create one lab VM:

1. On the **Template** page, select **Publish** on the toolbar.

   :::image type="content" source="./media/quick-create-connect-lab/template-page-publish-button.png" alt-text="Screenshot of Azure Lab Services template page. The Publish template menu button is highlighted."::: 

   > [!WARNING]
   > Publishing is an irreversible action, and can't be undone.

1. On the **Publish template** page, enter *1* for the number of VMs, and then select **Publish**.

    :::image type="content" source="./media/quick-create-connect-lab/publish-template-number-vms.png" alt-text="Screenshot of confirmation window for publish action of Azure.":::

1. Wait until the publishing finishes. You can track the publishing status on the **Template** page.

    :::image type="content" source="./media/quick-create-connect-lab/publish-template-progress.png" alt-text="Screenshot of Azure Lab Services template page.  The publishing in progress message is highlighted.":::  

1. On the **Virtual machine pool** page, confirm that there's one lab VM, named **Unassigned**, that is in the **Stopped** state.

    :::image type="content" source="./media/quick-create-connect-lab/virtual-machines-stopped.png" alt-text="Screenshot that shows the list of virtual machines for the lab. The lab VM shows as unassigned and stopped.":::

## Start and connect to lab VM

After you publish the lab, you can now start the lab VM and connect to it by using remote desktop client software. In this quickstart, you use the lab VM yourself and you don't assign it to another user.

1. On the **Virtual machine pool** page, toggle the lab VM **State**, and then select **Start** to start the lab VM.

    Starting the lab VM can take a few minutes.

    :::image type="content" source="./media/quick-create-connect-lab/virtual-machines-start.png" alt-text="Screenshot that shows how to start a lab VM by toggling the state in the list of virtual machines.":::

1. When the lab VM is in the **Running** state, select the **Connect** icon to download the remote desktop connection file to your computer.

    :::image type="content" source="./media/quick-create-connect-lab/virtual-machines-connect.png" alt-text="Screenshot that shows how to get the connection details for the lab VM in the list of virtual machines.":::

1. Open the downloaded remote desktop connection file to connect to the lab VM.

    Use the credentials you specified when you created the lab previously to sign in to the VM.

You can now explore and experiment within the lab virtual machine.

> [!NOTE]
> When a lab creator starts a lab VM, the lab user's quota is not affected. Quota for a user specifies the number of lab hours available to the user, outside of scheduled events. Learn more about [lab user quotas](./classroom-labs-concepts.md#quota).

## Clean up resources

[!INCLUDE [Clean up resources](./includes/lab-services-cleanup-resources.md)]

## Troubleshooting

[!INCLUDE [Troubleshoot not authorized error](./includes/lab-services-troubleshoot-not-authorized.md)]

[!INCLUDE [Troubleshoot region restriction](./includes/lab-services-troubleshoot-region-restriction.md)]

## Next steps

You've successfully created a lab virtual machine for experimenting inside the VM. You created a lab plan in the Azure portal and added a lab from the Azure Lab Services website. You then published the lab to create the lab VM, and connect to it with remote desktop.

Azure Lab Services supports different Azure AD roles to delegate specific tasks and responsibilities to different people in your organization. In the next tutorial, you learn how to set up a lab for classroom teaching, where you assign permissions to lab creators and invite lab users to connect to the lab VMs.

> [!div class="nextstepaction"]
> [Tutorial: Create a lab for classroom training](./tutorial-setup-lab.md)
