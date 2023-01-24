---
title: Quickstart to create a lab
titleSuffix: Azure Lab Services
description: In this quickstart, you learn how to create a lab to get started with Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: quickstart
ms.date: 01/24/2023
ms.custom: mode-portal
---

# Quickstart: Create a lab in Azure Lab Services

Azure Lab Services enables you to create labs, whose infrastructure is managed by Azure. You can create labs for running classroom trainings, hackathons, or for experimenting. In this quickstart, you create a lab virtual machine (VM) with Azure Lab Services, for exploring an operating system.

To create the lab VM, you first create a lab plan in the Azure portal, and use the Azure Lab Services website to add a lab based on an Azure Marketplace VM image. After you publish the VM, you can then register for the lab and connect to it by using remote desktop.

After you complete this quickstart, you'll have a lab plan that you can use for other tutorials.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]

## Create a lab plan

In Azure Lab Services, a lab plan serves as a collection of configurations and settings that apply to all the labs created from it.

Follow these steps to create a lab plan from the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.

    :::image type="content" source="./media/quick-create-lab-plan-portal/azure-portal-create-resource.png" alt-text="Screenshot that shows the Azure portal home page, highlighting the Create a resource button.":::

1. Search for **lab plan**.

1. On the **Lab plan** tile, select the **Create** dropdown and choose **Lab plan**.

    :::image type="content" source="./media/quick-create-lab-plan-portal/select-lab-plans-service.png" alt-text="Screenshot of how to search for and create a lab plan by using the Azure Marketplace.":::

1. On the **Basics** tab of the **Create a lab plan** page, provide the following information:

    | Field        | Description                |
    | ------------ | -------------------------- |
    | **Subscription** | Select the Azure subscription that you want to use for this lab plan resource. |
    | **Resource group** | Select **Create New** and enter *MyResourceGroup*. |
    | **Name** | Enter *MyLabPlan* as the lab plan name. |
    | **Region** | Select a geographic location to host your lab plan resource. |

1. After you're finished configuring the resource, select **Review + Create**.

1. Review all the configuration settings and select **Create** to start the deployment of the Lab Plan.

    :::image type="content" source="./media/quick-create-lab-plan-portal/Create-lab-plan-review-create-tab.png" alt-text="Screenshot that shows the Review and Create tab of the Create a new lab plan experience.":::

1. To view the new resource, select **Go to resource**.

    :::image type="content" source="./media/quick-create-lab-plan-portal/Create-lab-plan-deployment-complete.png" alt-text="Screenshot that the deployment of the lab plan resource is complete.":::

1. Confirm that you see the Lab Plan **Overview** page for *MyLabPlan*.

## Create a lab

Next, you use the Azure Lab Services website to create a lab in the lab plan. In Azure Lab Services, a lab contains the configuration and settings for creating lab VMs.

> [!NOTE]
> To create a lab, your Azure account needs the Lab Creator Azure Active Directory (Azure AD) role. Owners of a lab plan can automatically create labs and do not need to be assigned the Lab Creator role.

Follow these steps to add a lab to the lab plan you created earlier:

1. Sign in to the [Azure Lab Services website](https://labs.azure.com) by using the credentials for your Azure subscription.

1. Select **New lab**.  

    :::image type="content" source="./media/quick-create-lab-plan-portal/new-lab-button.png" alt-text="Screenshot of the Azure Lab Services website, highlighting the New lab button.":::

1. On the **New Lab** page, enter the following information, and then select **Next**:

    | Field        | Description                |
    | ------------ | -------------------------- |
    | **Name** | Enter *Lab-101*. |
    | **Virtual machine image** | Select *Windows 11 Pro*. |
    | **Virtual machine size** | Select *Medium*. |
    | **Location** | Leave the default value. |

1. On the **Virtual machine credentials** page, specify the default **username** and **password** for all VMs in the lab, and then select **Next**.
    
    By default, all the lab VMs have the same password.

    > [!IMPORTANT]
    > Make a note of user name and password. They won't be shown again.

    :::image type="content" source="./media/quick-create-lab-plan-portal/new-lab-credentials.png" alt-text="Screenshot of the Virtual machine credentials page in the Azure Lab Services website.":::

1. On the **Lab policies** page, leave the default values and select **Next**.

1. On the **Template virtual machine settings** page, select **Use virtual machine image without customization**.

    In this quickstart, you use the VM image as-is, known as a *templateless VM*. Azure Lab Services enables you to also create a *template VM*, which lets you make configuration changes or install software on top of the VM image.

    :::image type="content" source="./media/quick-create-lab-plan-portal/templateless-virtual-machine-settings.png" alt-text="Screenshot of the Template virtual machine settings page, with the option selected to create a templateless VM."::: 

1. Select **Finish** to start the lab creation. You should see the following screen that shows the status of the template VM creation.

    It might take several minutes for the lab creation to finish.

    :::image type="content" source="./media/quick-create-lab-plan-portal/create-template-vm-progress.png" alt-text="Screenshot that shows the status of the template VM creation.":::

1. When the lab creation finishes, you'll see the **Template** page of the lab.

     :::image type="content" source="./media/quick-create-lab-plan-portal/templateless-template.png" alt-text="Screenshot of Template page of a templateless lab with the template customization disabled message highlighted.":::

## Publish lab

Now that you created a lab, you can publish the lab. When you publish the lab, Azure Lab Services creates the VMs in the lab. All VMs in the lab have the same configuration as the lab template.

To publish the lab:

1. On the **Template** page, select **Publish** on the toolbar.

   :::image type="content" source="./media/quick-create-lab-plan-portal/template-page-publish-button.png" alt-text="Screenshot of Azure Lab Services template page. The Publish template menu button is highlighted."::: 

   > [!WARNING]
   > Publishing is an irreversible action, and can't be undone.

1. On the **Publish template** page, enter *1* for the number of VMs, and then select **Publish**.

    :::image type="content" source="./media/quick-create-lab-plan-portal/publish-template-number-vms.png" alt-text="Screenshot of confirmation window for publish action of Azure.":::

1. Wait until the publishing finishes. You can track the publishing status on the **Template** page.

    :::image type="content" source="./media/quick-create-lab-plan-portal/publish-template-progress.png" alt-text="Screenshot of Azure Lab Services template page.  The publishing in progress message is highlighted.":::  

1. On the **Virtual machine pool** page, confirm that the virtual machine is listed and marked as **Unassigned** and in a **Stopped** state.

   :::image type="content" source="./media/quick-create-lab-plan-portal/virtual-machines-stopped.png" alt-text="Screenshot that shows the list of virtual machines for the lab. The lab VM shows as unassigned and stopped.":::

> [!NOTE]
> When an educator turns on a student VM, quota for the student isn't affected. Quota for a user specifies the number of lab hours available to a student outside of the scheduled class time. For more information on quotas, see [Set quotas for users](how-to-configure-student-usage.md?#set-quotas-for-users).

## Start and connect to lab VM

After you publish the lab, you can now start the lab VM and connect to it by using remote desktop client software. In this quickstart, you use the lab VM yourself and you don't assign it to another user.

1. On the **Virtual machine pool** page, toggle the lab VM **State**, and then select **Start** to start the lab VM.

    Starting the lab VM can take a few minutes.

    :::image type="content" source="./media/quick-create-lab-plan-portal/virtual-machines-start.png" alt-text="Screenshot that shows how to start a lab VM by toggling the state in the list of virtual machines.":::

1. When the lab VM is in the **Running** state, select the **Connect** icon to download the remote desktop connection file to your computer.

    :::image type="content" source="./media/quick-create-lab-plan-portal/virtual-machines-connect.png" alt-text="Screenshot that shows how to get the connection details for the lab VM in the list of virtual machines.":::

1. Open the downloaded remote desktop connection file to connect to the lab VM.

    Use the credentials you specified when you created the lab previously to sign in to the VM.

## Clean up resources

[!INCLUDE [Clean up resources](./includes/lab-services-cleanup-resources.md)]

## Troubleshooting

[!INCLUDE [Troubleshoot not authorized error](./includes/lab-services-troubleshoot-not-authorized.md)]

## Next steps

You've successfully created a lab virtual machine for experimenting inside the VM. You created a lab plan in the Azure portal and added a lab from the Azure Lab Services website. You then published the lab to create the lab VM, and connect to it with remote desktop.

Azure Lab Services supports different Azure AD roles to delegate specific tasks and responsibilities to different people in your organization. In the next tutorial, you learn how to set up a lab for classroom teaching, where you assign permissions to lab creators and invite lab users to connect to the lab VMs.

> [!div class="nextstepaction"]
> [Create a lab for classroom training](./tutorial-setup-lab-plan.md)
