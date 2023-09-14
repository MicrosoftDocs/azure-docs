---
title: Quickstart - Create an Azure Automation account using the portal
description: This quickstart helps you to create a new Automation account using Azure portal.
services: automation
ms.date: 08/28/2023
ms.topic: quickstart
ms.subservice: process-automation
ms.custom: mvc, mode-ui, engagement-fy24
#Customer intent: As an administrator, I want to create an Automation account so that I can further use the Automation services.
---

# Quickstart: Create an Automation account using the Azure portal

You can create an Azure [Automation account](../automation-security-overview.md) using the Azure portal, a browser-based user interface allowing access to a number of resources. One Automation account can manage resources across all regions and subscriptions for a given tenant. This Quickstart guides you in creating an Automation account.

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create Automation account

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the top menu, select **+ Create a resource**.

1. Under **Categories**, select **IT & Management Tools**, and then select **Automation**.

   :::image type="content" source="./media/create-account-portal/automation-account-portal.png" alt-text="Locating Automation accounts in portal.":::

Options for your new Automation account are organized into tabs in the **Create an Automation Account** page. The following sections describe each of the tabs and their options.

### Basics

On the **Basics** tab, provide the essential information for your Automation account. After you complete the **Basics** tab, you can choose to further customize your new Automation account by setting options on the other tabs, or you can select **Review + create** to accept the default options and proceed to validate and create the account.

> [!NOTE]
> By default, a system-assigned managed identity is enabled for the Automation account.

The following table describes the fields on the **Basics** tab.

| **Field** | **Required**<br> **or**<br> **optional** |**Description** |
|---|---|---|
|Subscription|Required |From the drop-down list, select the Azure subscription for the account.|
|Resource group|Required |From the drop-down list, select your existing resource group, or select **Create new**.|
|Automation account name|Required |Enter a name unique for its location and resource group. Names for Automation accounts that have been deleted might not be immediately available. You can't change the account name once it has been entered in the user interface. |
|Region|Required |From the drop-down list, select a region for the account. For an updated list of locations that you can deploy an Automation account to, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=automation&regions=all).|

The following image shows a standard configuration for a new Automation account.

:::image type="content" source="./media/create-account-portal/create-account-basics.png" alt-text="Screenshot showing required fields for creating the Automation account on Basics tab.":::

### Advanced

On the **Advanced** tab, you can configure the managed identity option for your new Automation account. The user-assigned managed identity option can also be configured after the Automation account is created.

For instructions on how to create a user-assigned managed identity, see [Create a user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

The following table describes the fields on the **Advanced** tab.

| **Field** | **Required**<br> **or**<br> **optional** |**Description** |
|---|---|---|
|System-assigned |Optional |An Azure Active Directory identity that is tied to the lifecycle of the Automation account. |
|User-assigned |Optional |A managed identity represented as a standalone Azure resource that is managed separately from the resources that use it.|

You can choose to enable managed identities later, and the Automation account is created without one. To enable a managed identity after the account is created, see [Enable managed identity](enable-managed-identity.md). If you select both options, for the user-assigned identity, select the **Add user assigned identities** option. On the **Select user assigned managed identity** page, select a subscription and add one or more user-assigned identities created in that subscription to assign to the Automation account.

The following image shows a standard configuration for a new Automation account.

:::image type="content" source="./media/create-account-portal/create-account-advanced.png" alt-text="Screenshot showing required fields for creating the Automation account on Advanced tab.":::

### Networking

On the **Networking** tab, you can connect to your automation account either publicly (via public IP addresses), or privately, using a private endpoint. The following image shows the connectivity configuration that you can define for a new automation account.

- **Public Access** – This default option provides a public endpoint for the Automation account that can receive traffic over the internet and does not require any additional configuration. However, we don't recommend it for private applications or secure environments. Instead, the second option **Private access**, a private Link mentioned below can be leveraged to restrict access to automation endpoints only from authorized virtual networks. Public access can simultaneously coexist with the private endpoint enabled on the Automation account. If you select public access while creating the Automation account, you can add a Private endpoint later from the Networking blade of the Automation Account. 

- **Private Access** – This option provides a private endpoint for the Automation account that uses a private IP address from your virtual network. This network interface connects you privately and securely to the Automation account. You bring the service into your virtual network by enabling a private endpoint. This is the recommended configuration from a security point of view; however, this requires you to configure Hybrid Runbook Worker connected to an Azure virtual network & currently does not support cloud jobs.

:::image type="content" source="./media/create-account-portal/create-account-networking.png" alt-text="Screenshot showing required fields for creating the Automation account on Networking tab.":::

### Tags

On the **Tags** tab, you can specify Resource Manager tags to help organize your Azure resources. For more information, see [Tag resources, resource groups, and subscriptions for logical organization](../../azure-resource-manager/management/tag-resources.md).

### Review + create tab

When you navigate to the **Review + create** tab, Azure runs validation on the Automation account settings that you have chosen. If validation passes, you can proceed to create the Automation account.

If validation fails, then the portal indicates which settings need to be modified.

Review your new Automation account.

:::image type="content" source="./media/create-account-portal/automation-account-overview.png" alt-text="Automation account overview page":::

## Clean up resources

If you're not going to continue to use the Automation account, select **Delete** from the **Overview** page, and then select **Yes** when prompted.

## Next steps

In this Quickstart, you created an Automation account. To use managed identities with your Automation account, continue to the next Quickstart:

> [!div class="nextstepaction"]
> [Tutorial - Create Automation PowerShell runbook using managed identity](../learn/powershell-runbook-managed-identity.md)
