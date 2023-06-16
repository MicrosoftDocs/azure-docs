---
title: 'Tutorial: Set up a lab account with Azure Lab Services'
titleSuffix: Azure Lab Services
description: Learn how to set up a lab account with Azure Lab Services in the Azure portal. Then, grant a user access to create labs.
ms.topic: tutorial
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.date: 03/03/2023
ms.custom: subject-rbac-steps
---

# Tutorial: Set up a lab account with Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-note.md)]

In Azure Lab Services, a lab account serves as the central resource in which you manage your organization's labs. In your lab account, give permission to others to create labs, and set policies that apply to all labs under the lab account. In this tutorial, learn how to create a lab account by using the Azure portal.

In this tutorial, you do the following actions:

> [!div class="checklist"]
> - Create a lab account
> - Add a user to the Lab Creator role


## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a lab account

The following steps illustrate how to use the Azure portal to create a lab account with Azure Lab Services.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.

    :::image type="content" source="./media/tutorial-setup-lab-account/azure-portal-create-resource.png" alt-text="Screenshot that shows the Azure portal home page, highlighting the Create a resource button.":::

1. Search for **lab account**.  (**Lab account** can also be found under the **DevOps** category.)

1. On the **Lab account** tile, select **Create** > **Lab account**.

    :::image type="content" source="./media/tutorial-setup-lab-account/select-lab-accounts-service.png" alt-text="Screenshot of how to search for and create a lab account by using the Azure Marketplace.":::

1. On the **Basics** tab of the **Create a lab account** page, provide the following information:

    | Field        | Description                |
    | ------------ | -------------------------- |
    | **Subscription** | Select the Azure subscription that you want to use to create the resource. |
    | **Resource group** | Select an existing resource group or select **Create new**, and enter a name for the new resource group. |
    | **Name** | Enter a unique lab account name. <br/>For more information about naming restrictions, see [Microsoft.LabServices resource name rules](../azure-resource-manager/management/resource-name-rules.md#microsoftlabservices). |
    | **Region** | Select a geographic location to host your lab account. |

1. After you're finished configuring the resource, select **Review + Create**.

    :::image type="content" source="./media/tutorial-setup-lab-account/lab-account-basics-page.png" alt-text="Screenshot that shows the Basics tab to create a new lab account in the Azure portal.":::

1. Review all the configuration settings and select **Create** to start the deployment of the lab account.

1. To view the new resource, select **Go to resource**.

    :::image type="content" source="./media/tutorial-setup-lab-account/go-to-lab-account.png" alt-text="Screenshot that shows the resource deployment completion page in the Azure portal.":::

1. Confirm that you see the lab account **Overview** page.

    :::image type="content" source="./media/tutorial-setup-lab-account/lab-account-page.png" alt-text="Screenshot that shows the lab account overview page in the Azure portal.":::

You've now successfully created a lab account by using the Azure portal. To let others create labs in the lab account, you assign them the Lab Creator role.

## Add a user to the Lab Creator role

To set up a lab in a lab account, you must be a member of the Lab Creator role in the lab account. To grant people the permission to create labs, add them to the Lab Creator role. 

Follow these steps to [assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

> [!NOTE]
> Azure Lab Services automatically assigns the Lab Creator role to the Azure account you use to create the lab account. If you plan to use the same user account to create a lab in this tutorial, skip this step.

1. On the **Lab Account** page, select **Access control (IAM)**.

1. From the **Access control (IAM)** page, select **Add** > **Add role assignment**.

    :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows the Access control (I A M) page with Add role assignment menu option highlighted.":::

1. On the **Role** tab, select the **Lab Creator** role.

    :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-role-generic.png" alt-text="Screenshot that shows the Add roll assignment page with Role tab selected.":::

1. On the **Members** tab, select the user you want to add to the Lab Creators role.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

## Troubleshooting

[!INCLUDE [Troubleshoot insufficient IP addresses](./includes/lab-services-troubleshoot-insufficient-ip-addresses.md)]

## Next steps

In this tutorial, you created a lab account and granted lab creation permissions to another user. To learn about how to create a lab, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Set up a lab](tutorial-setup-lab.md)
