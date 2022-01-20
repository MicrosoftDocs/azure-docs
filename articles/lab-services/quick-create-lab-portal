---
title: Azure Lab Services Quickstart - Create a lab  using the Azure Lab Services labs.azure.com portal.
description: In this quickstart, you learn how to create an Azure Lab Services llab using the labs.azure.com portal.
ms.topic: quickstart
ms.date: 1/18/2022
ms.custom: TODO
---

# Quickstart: Create a lab using the labs.azure.com portal

Azure Lab Services provides students and teachers with access to virtual computer labs directly from their own computers.  Using virtual computer labs, students can access industry-standard software required for their programs of study through Virtual Machines (VMs).

A VM is a virtual environment and acts as a substitute for a real, physical computer that you can access over the internet.  Each VM has its own processor, memory, and storage.  VMs give students access to operating systems and software without the need to have them installed on a student’s own computer.  Azure Lab Services provides a tool for students to access and navigate VMs and for teachers to manage their virtual computer labs.

To create a virtual computer lab using Azure Lab Services, your first need to set up a lab plan in your Azure subscription which is typically done by your institution’s IT department or Azure administrator.  A lab plan is used to give permission to others to create labs and set policies that apply to the labs created from it. For detailed overview of Azure Lab Services, see TODO.

In this quickstart, you create a lab plan using the Azure portal.

## Prerequisites

To complete this quick start, make sure that you have:

- Azure subscription.  If you don’t have one, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create a resource group
A resource group is a logical collection of Azure resources.  All resources are deployed and managed in a resource group.

1. Sign in the Azure portal.
1. In the left navigation, select **Resource groups**.  Then select **Add**.
TODO – screenshot
1. For **Subscription**, select the name of the Azure subscription in which you want to create the resource group.
1. Type a unique **name for the resource group**.  The system immediately checks to see if the name is available in the currently selected Azure subscription.
1. Select a **region** for the resource group.
1. Select **Review + Create**.
1. One the **Review + Create page**, select **Create.**
TODO – screenshot

## Create a lab plan
The following steps show how to use the Azure portal to create a lab plan with Azure Lab Services.

1. In the Azure portal, select **Create a resource** at the top left of the screen.
1. Select **All services** in the left menu.  Select **DevOps** from **Categories**.  Then, select **Lab plans**.  If you hover over **Lab plans** and select the **star** in the popup, it’s added to the **Favorites** section on the left menu.  From the next time onwards, you select **Lab plans** under **Favorites**.
TODO – screenshot; also, need to verify with Fawad that this is how to find a Lab Plan resource
1. On the **Lab plans** page, click **Create**.
TODO – screenshot
1. On the **Basics** tab of the **Create a lab plan** page, do the following actions:
    1. For the **Subscription**, select the Azure subscription in which you want to create the lab plan.
    1. For **Resource Group**, select the existing resource group you created in the previous section.  You can also select **Create new** and enter a name for a new resource group.
    1. For **Name**, enter a name.
    1. For **Region**, select the Azure region you want to create the lab plan.  This is also the default region where your labs will be created.
TODO - screenshot
1. Select **Review + create**.
1. Review the summary and select **Create**.
TODO - screenshot 
1. When the deployment is complete, expand **Next steps**, and select **Go to resource**.
1. Confirm that you see the **Lab plan** page.
TODO – screenshot

## Add a user to the Lab Creator role
To set up a lab in a lab plan, the user must be a member of the Lab Creator role in the lab plan.  To provide educators the permission to create labs for their classes, add them to the Lab Creator role.  For detailed steps, see [Assign Azure roles using the Azure portal](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal).

> [!NOTE]
> The user account that you used to create the lab plan is automatically added to this role.  If you are planning to use the same user account to create a lab, skip this step.

1. On the Lab plan page, select **Access control (IAM)**.
1. Select **Add -> Add role assignment**.
TODO - screenshot
1. On the **Role** tab, select the **Lab Creator** role.
TODO – screenshot
1.  On the **Members** tab, select the user you want to add to the **Lab Creator** role.
1. On the **Review + assign** tab, select **Review + assign** to assign the role.

## Next steps
In this quickstart, you created a resource group and a lab plan.  To learn about how to create a lab as an educator, see the next quickstart:
 - TODO: link to create lab quick start

For more information on Azure Lab Services, see the following articles:
- TODO: add other articles here







