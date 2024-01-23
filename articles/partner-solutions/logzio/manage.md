---
title: Manage the Azure integration with Logz.io
description: Learn how to manage the Azure integration with Logz.io.
ms.topic: conceptual
ms.date: 10/25/2021
author: flang-msft
ms.author: franlanglois
---

# Manage the Logz.io integration in Azure

This article shows how to manage the settings for your Azure integration with Logz.io.

## Resource overview

The Logz.io **Overview** screen shows the resource's details that include the following items:

- **Resource group**
- **Location**
- **Subscription**
- **Tags**
- **Logz.io SSO**
- **Billing term**

Depending on whether you opted in or opted out of single sign-on (SSO), the **Logz.io SSO** link will differ:

- If you opted in to SSO:

    :::image type="content" source="./media/manage/sso-opt-in.png" alt-text="Single sign-on opt in.":::

- If you opted out of SSO:

    :::image type="content" source="./media/manage/sso-opt-out.png" alt-text="Single sign-on opt out.":::

## Reconfigure rules for logs and metrics

To change the configuration rules, under **Logz configuration** select **Logs and metrics**. For more information, see [Configure logs](./create.md#configure-logs).

:::image type="content" source="./media/manage/logs-metrics.png" alt-text="Logs and metrics configuration.":::

## Configure diagnostic settings

To configure the diagnostic settings, select the resource. In the left pane, select **Diagnostic settings**.

In the **Destination details** column, check the option to **Send to partner solution** to select Logz.io as a destination target. This option is only available after a Logz resource has been created.

:::image type="content" source="./media/manage/configure-diagnostics.png" alt-text="Configure diagnostic settings.":::

## View monitored resources

To see the list of resources sending logs to Logz.io (through the configured business rules), go to **Logz configuration** and select **Monitored resources**.

:::image type="content" source="./media/manage/monitored-resources.png" alt-text="Monitored resources configuration.":::

You can filter the list by resource type, resource group name, location, and whether the resource is sending logs.

The following are descriptions of columns shown on the **Monitored resources** screen:

- **Resource Name**: Azure resource name.
- **Resource Type**: Azure resource type.
- **Resource group**: Show resource group name for the Azure resource.
- **Region**: Shows region or location of the Azure resource.
- **Logs to Logz**: Indicates whether the resource is sending Logs to Logz.io. If the resource isn't sending logs, this field indicates the appropriate reason why logs aren't being sent to Logz.io. The reasons could be:
  - Resource doesn't support sending logs: Only Azure resource logs for all resources types and [log categories defined here](../../azure-monitor/essentials/resource-logs-categories.md) can be configured to send logs to Logz.io.
  - Limit of five diagnostic settings reached: Each Azure resource can have a maximum of five diagnostic settings. For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](../../azure-monitor/essentials/diagnostic-settings.md).
  - Error: An error is blocking the logs from being sent to Logz.io.
  - Logs not configured: Only resources that have the appropriate resource tags can send logs to Logz.io. See [configure logs](./create.md#configure-logs).
  - Region not supported: The Azure resource is in a region that doesn't currently send logs to Logz.io.

To edit the Azure resource's list of tags, select **Edit Tags**. You can add new tags or delete existing tags.

## Monitor VM using Logz.io agent

You can install Logz.io agents on virtual machines (VM) as an extension. Go to **Logz configuration** and select **Virtual machine agent**. This screen shows the list of all VMs in the subscription.

For each VM, the following data is displayed:

- **Resource name**: Virtual machine name.
- **Resource type**: Azure resource type.
- **Resource group**: Show resource group name for the Azure resource.
- **Region**: Shows region or location of the Azure resource.
- **Agent version**: The Logz.io agent version number.
- **Extension status**: Indicates whether the Logz.io agent is **Installed** or **Not installed** on the VM.
- **Logs to Logz**: Specifies whether the Logz.io agent is sending logs to Logz.io.

:::image type="content" source="./media/manage/vm-agent.png" alt-text="Virtual machine agent.":::

### Install VM agent

To install the VM agent, use the following steps.

1. Select the VM that you want to install the Logz.io agent on, then select **Install Agent**.

   The portal asks for confirmation that you want to install the agent with the default authentication.

1. Select **OK** to begin installation.

   Azure shows the status as **Installing** until the agent is installed and provisioned.

   After the Logz.io agent is installed, the status changes to **Installed**.

1. To verify that the Logz.io agent was installed, select the VM and go to the **Extensions** window.

> [!NOTE]
> After the VM agent is installed, if the VM is stopped, the **Logs to Logz** column will show **Not Sending** for that VM.

### Uninstall VM agent

You can uninstall Logz.io agents on a VM from **Virtual machine agent**. Select the VM and **Uninstall agent**.

## Create Logz.io sub account

Only an administrator of the Logz.io account can create a sub account. By default, the Logz.io account's creator is set as administrator. Sign in to the Logz.io account to grant other users administrator permission.

For more information, see [Logz.io Sub Accounts](https://logz.io/blog/diving-deeper-logz-io-sub-accounts/) on the Logz.io website.

You can create a Logz.io sub account using the  **Overview** > **Add Sub Account** button.

:::image type="content" source="./media/manage/create-sub-account-overview.png" alt-text="Create a Logz.io sub account from Overview.":::

Another method is go to **Logz Configuration** and select **Add sub account**. Follow the prompts to set up the sub account and enable shipping of logs through the sub account.

:::image type="content" source="./media/manage/create-sub-account-logz.png" alt-text="Create a Logz.io sub account from Logz configuration.":::

## Delete Logz.io sub account

1. For the Logz.io resource, select **Logz configuration** and **Logz sub accounts**.
1. Select the sub account you want to delete.
1. Select **Delete**.

    :::image type="content" source="./media/manage/delete-sub-account-1.png" alt-text="Delete a Logz.io sub account from Logz configuration.":::

1. Type _yes_ to confirm that you want to delete Logz.io resource.
1. Select **Delete**.

    :::image type="content" source="./media/manage/delete-sub-account-2.png" alt-text="Confirm to delete a Logz.io sub account.":::

Logs are no longer sent to Logz.io and all billing for Logz.io stops.

## Delete Logz.io account

1. From the Logz.io resource, select **Overview** and **Delete**.
1. Confirm that you want to delete the Logz.io resource.
1. Select **Delete**.

    :::image type="content" source="./media/manage/delete-resource-1.png" alt-text="Delete a Logz.io resource from Overview.":::

1. Type _yes_ to confirm that you want to delete Logz.io resource.
1. Select **Delete**.

    :::image type="content" source="./media/manage/delete-resource-2.png" alt-text="Confirm to delete a Logz.io resource.":::

> [!NOTE]
> The **Delete** option on the main account is only activated when all the sub accounts mapped to the main account are already deleted. For more information about how to delete sub accounts, see [Delete Logz.io sub accounts](#delete-logzio-sub-account).

After the resource is deleted, logs are no longer sent to Logz.io and all billing stops for Logz.io through Azure Marketplace.

## Get support

To contact support about the Azure Logz.io integration, under **Support + troubleshooting** and **New Support request**. By selecting this option, you go to the [Logz.io portal](https://app.logz.io/). Use the in-chat support or send an email to [help@logz.io](mailto:help@logz.io).

## Next steps

- To resolve problems with the integration, see [troubleshooting](troubleshoot.md).
