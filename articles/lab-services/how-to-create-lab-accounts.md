---
title: Create lab accounts in Azure Lab Services | Microsoft Docs
description: Learn how to create a lab account in an Azure subscription.
ms.topic: how-to
ms.date: 06/25/2024
---

# Create a lab account

[!INCLUDE [Retirement guide](./includes/retirement-banner.md)]

[!INCLUDE [preview note](./includes/lab-services-labaccount-focused-article.md)]

In Azure Lab Services, a lab account is a container for labs. An administrator creates a lab account with Azure Lab Services and provides access to lab owners who can create labs in the account. This article describes how to create a lab account, view all lab accounts, and delete a lab account.

The following steps illustrate how to use the Azure portal to create a lab account with Azure Lab Services.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All services** on the left menu. Select the **DevOps** category. Select the **Lab accounts** tile.

    :::image type="content" source="./media/how-to-create-lab-accounts/select-lab-accounts.png" alt-text="Screenshot of All services page in the Azure portal. The Dev Ops category and DevTest Labs items are highlighted.":::

1. On the **Lab Accounts** page, select **Create** on the toolbar or **Create lab account** on the page.

    :::image type="content" source="./media/how-to-create-lab-accounts/create-lab-account-button.png" alt-text="Screenshot of lab account resources in the Azure portal. The Create button and Create lab account buttons are highlighted.":::

1. On the **Basics** tab of the **Create a lab account** page, do the following actions:
    1. Select the **Azure subscription** in which you want to create the lab account.
    1. For **Resource group**, select **Create new**, and enter a name for the resource group.
    1. For **Lab account name**, enter a name.
    1. For **Location**, select a location/region in which you want the lab account to be created.

        :::image type="content" source="./media/how-to-create-lab-accounts/create-lab-account-basics.png" alt-text="Screenshot of the Basics tab in Create lab account wizard.":::
1. Select **Next: Tags**.
1. On the Tags tab, add any tags you want to associate with the lab account. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups. For more information, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

    :::image type="content" source="./media/how-to-create-lab-accounts/create-lab-account-tags.png" alt-text="Screenshot that shows the Tags tab of the Create lab account wizard.":::
1. Select **Next: Review + create**.
1. Wait for validation to pass. Review the summary information on the **Review + create** page, and select **Create**.

    :::image type="content" source="./media/how-to-create-lab-accounts/create-lab-account-review-create.png" alt-text="Screenshot that shows the Review and create tab of the Create lab account wizard.":::
1. Wait until the deployment is complete, expand **Next steps**, and select **Go to resource**.

    You can also select the **bell icon** on the toolbar (**Notifications**), confirm that the deployment succeeded, and then select **Go to resource**.

    :::image type="content" source="./media/how-to-create-lab-accounts/go-to-lab-account.png" alt-text="Screenshot that shows the deploy resource page for the lab account. The Go to resource button is highlighted.":::
1. Notice the **Overview** page for the lab account.

    :::image type="content" source="./media/how-to-create-lab-accounts/lab-account-overview.png" alt-text="Screenshot that shows overview page of a lab account.":::

## Next steps

- As an admin, [configure automatic shutdown settings for a lab account](how-to-configure-lab-accounts.md).
- As an admin, use the [Az.LabServices PowerShell module](https://aka.ms/azlabs/samples/PowerShellModule) to manage lab accounts.
- As an educator, [configure automatic shutdown settings for a lab](how-to-enable-shutdown-disconnect.md).
