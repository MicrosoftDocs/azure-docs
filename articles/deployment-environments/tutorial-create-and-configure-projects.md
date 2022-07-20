---
title: Set up an Azure Deployment Environments Project | Microsoft Docs
description: This tutorial shows you how to create and configure an Azure Deployment Environments Project and associate it with a DevCenter.
services: Azure Deployment Environments
author: anandmeg
ms.service: deployment-environments
ms.topic: tutorial
ms.date: 07/13/2022
ms.custom: devdivchpfy22
ms.author: meghaanand
---

# Tutorial: Set up an Azure Deployment Environments Project

In this tutorial, you create and configure an Azure Deployment Environments Project and associate it to the DevCenter created in [Tutorial: Set up a Fidalgo DevCenter](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/tutorial-create-and-configure-devcenter.md). The Enterprise Dev IT team typically creates projects and provides access to development teams. Development teams (for example: developers and testers) then create environments using the Catalog Items, connect to individual resources, and deploy their applications.

In this tutorial, you'll learn how to:

* Create and configure a project.
* Provide access to the development team.


## Create a Project

The following steps illustrate how to use the Azure portal to create and configure a project in 'Azure Deployment Environments'.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters). If you haven't already, we recommend using the **Pin to Dashboard** capability to pin the **Deployment Environments** service to your dashboard.

1. Select **Projects** in the left menu and select **+ Add**. In the **Basics** tab of the **Create a Project** page, enter the following values:

     |Name   |Value   |
     |----------|-----------|
     |**Subscription**     |Select a subscription in which you want to create the project.       |
     |**Resource group**|Either use an existing resource group or select **Create a resource group**, and enter a name for the resource group.   |
     |**DevCenter**|Select a DevCenter to which you want to associate this project. All the DevCenter level settings will then apply to the project.   |
     |**Name**|Enter a name for the project.  |
     |**Region**|Select the location/region in which you want the project to be created.   |

    :::image type="content" source="media/tutorial-create-and-configure-projects/basics.png" alt-text="Screenshot of the Basics tab to create a project.":::


1. In the **Mappings** tab, select and map a **Subscription** to an **Environment type** you want to enable for this project. [Learn more about Subscription Mapping](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-mappings.md)

    :::image type="content" source="media/tutorial-create-and-configure-projects/mappings.png" alt-text="Screenshot of the Subscription mapping tab to create a project.":::


1. In the **Tags** tab, enter a **Name** and **Value** pair that you want to assign.

    :::image type="content" source="media/tutorial-create-and-configure-projects/tags.png" alt-text="Screenshot of the Tags tab to create a project.":::


1. In the **Review + create** tab, validate all the details and select **Create**:

    :::image type="content" source="media/tutorial-create-and-configure-projects/create.png" alt-text="Screenshot of selecting the Create button to validate and create a project.":::


1. Confirm that the project is created successfully by checking the Notifications. Select **Go to resource**.

1. Confirm that you see the **Project** page.

    :::image type="content" source="media/tutorial-create-and-configure-projects/projects.png" alt-text="Screenshot of the Project page.":::

## Provide access to the development team

1. On the **Project** page of the project you created, select **Access Control (IAM)** in the left menu, select **+ Add** and then **Add role assignment**:

    :::image type="content" source="media/tutorial-create-and-configure-projects/access.png" alt-text="Screenshot of the Access control page.":::

1. On the **Add role assignment** page, provide the following details and select **Save**:
    1. For **Role**, select **Contributor**.
    1. Select the user or Azure AD Group you want to assign access to.
    1. Select a project from the list.
    1. Validate the selected members.

    :::image type="content" source="media/tutorial-create-and-configure-projects/assignment.png" alt-text="Screenshot of the Add role assignment page.":::

## Next steps

In this tutorial, you created a project and granted access to your development team. To learn about how your development team members can create environments, advance to the next tutorial:

* [Tutorial: Create & Access Environments](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/tutorial-create-environments.md)