---
title: Azure Lab Services Quickstart - Create a lab  using the Azure Lab Services labs.azure.com portal.
description: In this quickstart, you learn how to create an Azure Lab Services lab using the labs.azure.com portal.
ms.topic: quickstart
ms.date: 6/18/2022
ms.custom: mode-portal
---

# Quickstart: Create a lab using the Azure Lab Services portal

Educators can create labs containing VMs for students using the Azure Lab Services portal.  This quickstart shows you how to create a lab with Windows 11 Pro image.  Once a lab is created, an educator [configures the template](how-to-create-manage-template.md), [adds lab users](how-to-configure-student-usage.md), and [publishes the lab](tutorial-setup-lab.md#publish-a-lab).

## Prerequisites

To complete this quick start, make sure that you have:

- Azure subscription.  If you don’t have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- Lab plan.  If you haven't create a lab plan, see [Quickstart: Create a lab plan using the Azure portal](quick-create-lab-plan-portal.md).

## Create a lab

The following steps show how to create a lab with Azure Lab Services.

1. Sign into the [Azure Lab Service portal](https://labs.azure.com).
1. Select **New lab**.  

    :::image type="content" source="./media/quick-create-lab-portal/new-lab-button.png" alt-text="Screenshot of Azure Lab Services portal.  New lab button is highlighted.":::

1. In the **New Lab** window, choose the basic settings for the lab.
    1. Set the **Name** to *Lab 101*.
    1. Set the **Virtual machine image** to **Windows 11 Pro**.
    1. Set the **Virtual machine size** to **Medium**.

        :::image type="content" source="./media/quick-create-lab-portal/new-lab-window.png" alt-text="Screenshot of the New lab window for Azure Lab Services.":::

    1. On the **Virtual machine credentials** page, specify default administrator credentials for all VMs in the lab. Specify the **name** and the **password** for the administrator.  By default all the student VMs will have the same password as the one specified here.

        :::image type="content" source="./media/quick-create-lab-portal/new-lab-credentials.png" alt-text="Screenshot of the Virtual Machine credentials window for Azure Lab Services.":::

    > [!IMPORTANT]
    > Make a note of user name and password. They won't be shown again.

    1. On the **Lab policies** page, leave the default selections and select **Next**.

        :::image type="content" source="./media/quick-create-lab-portal/quota-for-each-user.png" alt-text="Screenshot of the Lab policy window when creating a new Azure Lab Services lab.":::

    1. You can create a lab with a customizable template VM, or with a VM image that has no customization. 
       - Template labs allow you to create a customizable template VM for the class and add software to it for the class. Your base image can be from an Azure Marketplace image or from your IT department through an Azure Compute Gallery. 
       - Templateless labs don't allow you to install any further software or tools on your image. You can use an Azure Marketplace image with the tools you need already installed, an image exported from a previous lab, or a pre-configured image supplied by your IT department. Templateless labs take around 5 minutes to create. </br>
       
        1. To create a lab with a customizable template, on the **Template virtual machine settings** window, leave the selection on **Create a template virtual machine**.

        :::image type="content" source="./media/quick-create-lab-portal/template-virtual-machine-settings.png" alt-text="Screenshot of the Template virtual machine settings windows when creating a new Azure Lab Services lab with a custom template.":::

       **Or:**

        ii. To create a templateless lab, on the **Template virtual machine settings** window, select **Use virtual machine image without customization**.

        :::image type="content" source="./media/quick-create-lab-portal/templateless-virtual-machine-settings.png" alt-text="Screenshot of the Template virtual machine settings windows when creating a new Azure Lab Services lab without a template."::: 


1. You should see the following screen that shows the status of the template VM creation.

    :::image type="content" source="./media/quick-create-lab-portal/create-template-vm-progress.png" alt-text="Screenshot of status of the template VM creation.":::

1. When the lab is completed, you'll see the **Template** page of the lab.

   :::image type="content" source="./media/quick-create-lab-portal/lab-template-page.png" alt-text="Screenshot of Template page of a lab.":::

   If you're using a templateless lab, you'll see the following note on the Template page, indicating that template customization has been disabled for this lab:

     :::image type="content" source="./media/quick-create-lab-portal/templateless-template.png" alt-text="Screenshot of Template page of a templateless lab with the template customization disabled message highlighted.":::

## Clean up resources

When no longer needed, you can delete the lab.  

On the tile for the lab, select three dots (...) in the corner, and then select **Delete**.

:::image type="content" source="./media/how-to-manage-labs/delete-button.png" alt-text="Screenshot of My labs page with More menu then Delete menu item highlighted.":::

On the **Delete lab** dialog box, select **Delete** to continue with the deletion.

## Troubleshooting

[!INCLUDE [Troubleshoot not authorized error](./includes/lab-services-troubleshoot-not-authorized.md)]

[!INCLUDE [Troubleshoot region restriction](./includes/lab-services-troubleshoot-region-restriction.md)]

## Next steps

In this quickstart, you created a lab with Azure Lab Services.  To learn more about advanced options for labs, see [Tutorial: Create and publish a lab](tutorial-setup-lab.md).

Advance to the next article to learn how to configure the template VM.

> [!div class="nextstepaction"]
> [Configure a template VM](how-to-create-manage-template.md)
