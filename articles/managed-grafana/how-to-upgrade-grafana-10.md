--- 
title: "Upgrade Azure Managed Grafana to Grafana 10"
titleSuffix: Azure Managed Grafana
description: "Learn how to upgrade an Azure Managed Grafana workspace from Grafana 9 to Grafana 10, and learn information about upgrading legacy alerting to unified alerting."
ms.service: managed-grafana
author: maud-lv  
ms.author: malev 
ms.date: 03/01/2024 
ms.topic: how-to 
# customerIntent: As a user of Azure Managed Grafana, I want to upgrade my workspce from Grafana 9 to Grafana 10. I also want to learn about the upgrade of the legacy alerting feature.
--- 

# Upgrade to Grafana 10

Azure Managed Grafana will stop offering Grafana 9 as a supported software version on 31 August 2024. This guide provides information about the retirement of Grafana 9 and shows you how to update your Azure Managed Grafana workspace to Grafana 10.
We recommend that you upgrade your workspace to Grafana 10 before the end of August 2024.

In September 2024, if your workspace is still on Grafana version 9, it will be automatically upgraded to Grafana 10.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An existing Azure Managed Grafana instance. [Create one if you haven't already](quickstart-managed-grafana-portal.md).

## Retirement timeline

The following table outlines the retirement timeline.

| Key dates            | Status                                                                                                                                                   |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| March 2024           | Users can start to upgrade existing workspaces to Grafana 10.                                                                                            |
| July 1-31, 2024      | <li>All new workspaces use Grafana 10. Creating new workspaces on Grafana 9 is disabled. <li> Users can still upgrade existing workspaces to Grafana 10. |
| September 1-30, 2024 | <li>All workspaces are forcibly upgraded to Grafana 10. <li> Grafana 9 no longer receives updates from Microsoft.                                        |

## Check the version of your Grafana workspace

To find out if your Azure Managed Grafana workspace needs to be upgraded, start by checking which version of Grafana your workspace is on.

### [Portal](#tab/azure-portal)
  
In the Azure portal:

  1. Open your Azure Managed Grafana workspace.
  1. In the left menu, under **Settings** select **Configuration**.
  1. Review the Grafana version listed under **Grafana Version (Preview)**. If version 9 is selected in the dropdown menu, your workspace is on the Grafana version that is reaching end of life and is scheduled for retirement. We recommend that you upgrade your workspace to Grafana 10 by following the steps below. If your Grafana version is Grafana 10 or more, no further action is necessary.

      :::image type="content" source="media/grafana-10-upgrade/check-grafana-version.png" alt-text="Screenshot of the Azure platform showing Grafana Version 9.":::
  
### [Azure CLI](#tab/azure-cli)

Run the command [az grafana show](/cli/azure/grafana#az-grafana-show) in the Azure CLI to retrieve the properties of the Azure Managed Grafana workspace. Replace the placeholder `<azure-managed-grafana-workspace>` with the name of the Azure Managed Grafana instance.

```azurecli
az grafana show --name <azure-managed-grafana-workspace>
```

The version number is listed in the output after `grafanaMajorVersion`. If version is `9`, your workspace is on the Grafana version that is reaching end of life and is scheduled for retirement. We recommend that you upgrade your workspace to Grafana 10 by following the steps below. If your Grafana version is `10` or more, no further action is necessary.

---

## Check if you use legacy alerting

Some Grafana 9 workspaces have legacy alerting enabled. Legacy alerting is an outdated version of the current unified alerting feature.

> [!CAUTION]  
> For workspaces that have legacy alerting enabled, the upgrade to Grafana 10 comes with an upgrade of the alerting feature from legacy alerting to unified alerting. After this upgrade, alerts might not work or need adjustments.

Check if your workspace uses legacy alerting or unified alerting by going to the left menu in the Grafana user interface:

- If the menu shows **Alerting (legacy)**, the older version of the alerting feature is enabled. It will be updated to unified alerting when the workspace is upgraded to Grafana 10.
- If the menu shows **Alerting**, unified alerting is enabled. Alerting will remain unchanged by the upgrade.

  :::image type="content" source="media/grafana-10-upgrade/unified-alerting.png" alt-text="Screenshot of the Grafana interface showing the unified alerting menu.":::

## Upgrade Grafana 9 to Grafana 10

This section details how to upgrade an Azure Managed Grafana instance from Grafana 9 to Grafana 10.

> [!CAUTION]  
> Upgrading to Grafana 10 is irreversible.

### [Portal](#tab/azure-portal)

In the Azure portal:

1. In the Azure portal, open your Azure Managed Grafana workspace and in the left menu, under **Settings**, select **Configuration**.
1. Under **Grafana Version (Preview)**, select **10** to indicate that you want to upgrade your workspace to Grafana 10.
1. The Azure portal displays a warning message. Read the message carefully and check the box to acknowledge that you're aware of the risks.
1. Select **Save** on top to save the new settings and trigger the upgrade to Grafana version 10.

    :::image type="content" source="media/grafana-10-upgrade/save-upgrade.png" alt-text="Screenshot of the Azure portal showing Grafana version 10 selected in the dropdown menu, the warning checkbox checked and the Save button highlighted.":::

1. A notification appears, indicating that the upgrade is in progress. In the **Overview** page, Grafana’s **Provisioning State** is **Provisioning** until the upgrade is complete. After a few minutes, a notification appears, and the provisioning state becomes **Succeeded**.

### [Azure CLI](#tab/azure-cli)

In the Azure CLI:

1. Run the [az grafana update](/cli/azure/grafana#az-grafana-update) command. In the command below, replace `<azure-managed-grafana-workspace>` with the name of the Azure Managed Grafana instance to upgrade.

    ```azurecli
    az grafana update --name <azure-managed-grafana-workspace> --major-version 10
    ```

1. The CLI displays a warning indicating that upgrading to Grafana version 10 is a permanent an irreversible operation. Grafana alerting has been deprecated and any migrated legacy alert may require manual adjustments to function properly under the new alerting system. To acknowledge this information and proceed to the upgrade, enter `Y`. Otherwise, cancel the upgrade with `N`.

---

## Check Grafana alerts

If your workspace previously had legacy alerting enabled, check that your alerts are still working propertly within your upgraded instance of Grafana.

1. Open the Grafana portal.
1. Open the left menu. The alerting feature is now called **Alerting**. Check the state of your alerts to make sure that they're set up the way you want.

## Next step

In this how-to guide, you learned how to upgrade your Azure Managed Grafana workspace from Grafana 9 to Grafana 10. If needed, go to the following guide for support.

> [!div class="nextstepaction"]
> [Find help or open a support ticket](./find-help-open-support-ticket.md)
