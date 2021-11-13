---
title: View and delete labs in Azure Lab Services
description: Learn how to view all labs and delete labs associated with a lab plan. 
ms.topic: how-to
ms.date: 11/12/2021
---

# Manage labs

This article shows you how a lab plan owner or administrator can view all the labs and delete labs associated with a lab plan.

Lab plans and labs are sibling resources contained in a resource group. Administrators can use existing tools in the Azure Portal to manage labs.

## View labs

1. Open the **Resource Group** page.

    ![Labs in the plan](./media/how-to-manage-lab-plans/labs-in-resource-group.png)

    To view only lab resources, set a filter for `Type == Lab`.
1. You see a **list of labs** with the following information:
    1. Name of the lab.
    2. Type of resource (Lab)
    3. Location of the lab.

1. Open a lab to view additional information such as the associated lab plan, OS type, and virtual machine size.

## Delete a lab

1. Open the **Resource Group** page.

    To view only lab resources, set a filter for `Type == Lab`.

1. Select **... (ellipsis)**, and select **Delete**.

    ![Delete a lab - button](./media/how-to-manage-lab-plans/delete-lab-button.png)
1. Type **Yes** on the warning message.

    ![Confirm lab deletion](./media/how-to-manage-lab-plans/confirm-lab-delete.png)

## Next steps

See other articles in the **How-to guides** -> **Create and configure lab plans (lab plan owner)** section of the table-of-content (TOC).