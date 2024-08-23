---
title: Manage lab accounts in Azure Lab Services | Microsoft Docs
description: Learn how to view all lab accounts or delete a lab account in an Azure subscription.
ms.topic: how-to
ms.date: 06/25/2024
---

# Manage lab accounts

[!INCLUDE [Retirement guide](./includes/retirement-banner.md)]

[!INCLUDE [preview note](./includes/lab-services-labaccount-focused-article.md)]

In Azure Lab Services, a lab account is a container for labs. An administrator creates a lab account with Azure Lab Services and provides access to lab owners who can create labs in the account. This article describes how to create a lab account, view all lab accounts, and delete a lab account.

## View lab accounts

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** from the menu.
3. Select **Lab Accounts** for the **type**.
    You can also filter by subscription, resource group, locations, and tags.

    :::image type="content" source="./media/how-to-manage-lab-accounts/all-resources-lab-accounts.png" alt-text="Screenshot that shows All resources page in the Azure portal. The resource type filter is highlighted and set to show resources of type lab accounts.":::

## Delete a lab account

Follow instructions from the previous section that displays lab accounts in a list. Use the following instructions to delete a lab account:

1. Select the **lab account** that you want to delete.
1. Select **Delete** from the toolbar.

    :::image type="content" source="./media/how-to-manage-lab-accounts/delete-button.png" alt-text="Screenshot that shows All resources page in the Azure portal with resources filtered to list lab accounts. The delete button on the toolbar is highlighted.":::
1. Type **yes** for confirmation.
1. Select **Delete**.

    :::image type="content" source="./media/how-to-manage-lab-accounts/delete-lab-account-confirmation.png" alt-text="Screenshot that shows delete confirmation page.":::

## Automatic shutdown settings

Automatic shutdown features enable you to prevent wasted VM usage hours in the labs. The following settings catch most of the cases where users accidentally leave their virtual machines running:

:::image type="content" source="./media/cost-management-guide/auto-shutdown-disconnect.png" alt-text="Screenshot that shows the three automatic shutdown settings.":::

You can configure these settings at both the lab account level and the lab level. If you enable them at the lab account level, they're applied to all labs within the lab account. For all new lab accounts, these settings are turned on by default.

### Automatically disconnect users from virtual machines that the OS deems idle

> [!NOTE]
> This setting is available only for Windows virtual machines.

> [!IMPORTANT]
> Changes to the disconnect on idle setting are reflected on the lab VM the next time it is started. Currently running lab VMs are not affected until they are restarted.

When the **Disconnect users when virtual machines are idle** setting is turned on, the user is disconnected from any machines in the lab when the Windows OS deems the session to be idle (including the template virtual machines). The [Windows OS definition of idle](/windows/win32/taskschd/task-idle-conditions#detecting-the-idle-state) uses two criteria:

- User absence: no keyboard or mouse input.
- Lack of resource consumption: All the processors and all the disks were idle for a certain percentage of time.

Users see a message like this in the VM before they're disconnected:

:::image type="content" source="./media/cost-management-guide/idle-timer-expired.png" alt-text="Screenshot that shows a warning message that a session has been idle over its time limit.":::

The virtual machine is still running when the user is disconnected. If the user reconnects to the virtual machine by signing in, windows or files that were open or work that was unsaved before the disconnect will still be there. In this state, because the virtual machine is running, it still counts as active and accrues cost.

To automatically shut down idle Windows virtual machines that are disconnected, use the combination of **Disconnect users when virtual machines are idle** and **Shut down virtual machines when users disconnect** settings.

For example, if you configure the settings as follows:

- **Disconnect users when virtual machines are idle**: 15 minutes after the idle state is detected.
- **Shut down virtual machines when users disconnect**: 5 minutes after the user disconnects.

The Windows virtual machines will automatically shut down 20 minutes after the user stops using them.

:::image type="content" source="./media/cost-management-guide/vm-idle-diagram.png" alt-text="Diagram that illustrates the combination of settings resulting in automatic VM shutdown.":::

### Automatically shut down virtual machines when users disconnect

The **Shut down virtual machines when users disconnect** setting supports both Windows and Linux virtual machines. When this setting is on, automatic shutdown occurs when:

- The Remote Desktop (RDP) connection is disconnected for Windows or Linux VMs.
- The Secure Shell (SSH) connection is disconnected for a Linux VM.

> [!IMPORTANT]
> Only [specific distributions and versions of Linux](/azure/virtual-machines/extensions/diagnostics-linux#supported-linux-distributions) are supported. Shutdown settings are not supported by the [Data Science Virtual Machine - Ubuntu](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) image.

You can specify how long the virtual machines should wait for the user to reconnect before automatically shutting down.

### Automatically shut down virtual machines that are started but users don't connect

In a lab, a user might start a virtual machine but never connect to it. For example:

- A schedule in the lab starts all virtual machines for a class session, but some students don't show up and don't connect to their machines.
- A user starts a virtual machine but forgets to connect.

The **Shut down virtual machines when users do not connect** setting catches these cases and automatically shut down the virtual machines.

## Next steps

- As an admin, [configure automatic shutdown settings for a lab account](how-to-configure-lab-accounts.md).
- As an admin, use the [Az.LabServices PowerShell module](https://aka.ms/azlabs/samples/PowerShellModule) to manage lab accounts.
- As an educator, [configure automatic shutdown settings for a lab](how-to-enable-shutdown-disconnect.md).
