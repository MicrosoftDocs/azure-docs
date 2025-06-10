--- 
title: Upgrade Azure Managed Grafana to Grafana 11
titleSuffix: Azure Managed Grafana
description: "Learn how to upgrade an Azure Managed Grafana workspace from Grafana 10 to Grafana 11."
ms.service: azure-managed-grafana
author: maud-lv  
ms.author: malev 
ms.date: 02/28/2025 
ms.topic: how-to 
# customerIntent: As a user of Azure Managed Grafana, I want to upgrade my workspace from Grafana 10 to Grafana 11.
--- 

# Upgrade to Grafana 11

Azure Managed Grafana will stop offering Grafana 10 as a supported software version on July 31, 2025. This guide provides information about the retirement of Grafana 10 and guides you through updating your Azure Managed Grafana workspace to Grafana 11.

> [!IMPORTANT]
> We recommend that you familiarize yourself with the [breaking changes introduced in Grafana 11](https://grafana.com/docs/grafana/latest/breaking-changes/breaking-changes-v11-0/) and upgrade your workspace to Grafana 11 before August 2025. If your workspace is still running Grafana version 10 in August 2025, it will be automatically upgraded to Grafana 11.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An existing Azure Managed Grafana instance. [Create one if you haven't already](quickstart-managed-grafana-portal.md).

## Retirement timeline

The following table outlines the retirement timeline.

| Key dates   | Status                                                                                                                                                    |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| March 2025  | Users can start to upgrade existing workspaces to Grafana 11.                                                                                             |
| June 2025   | <li>All new workspaces use Grafana 11. Creating new workspaces on Grafana 10 is disabled. <li> Users can still upgrade existing workspaces to Grafana 11. |
| August 2025 | All workspaces are forcibly upgraded to Grafana 11.                                        |

## Check the version of your Grafana workspace

To find out if your Azure Managed Grafana workspace needs to be upgraded, check the version of Grafana your workspace is running.

### [Portal](#tab/azure-portal)
  
In the Azure portal:

  1. Open your Azure Managed Grafana workspace.
  1. In the left menu, under **Settings** select **Configuration**.
  1. Review the Grafana version listed under **Grafana Version**. If version 10 is selected in the dropdown menu, your workspace is on the Grafana version that is reaching end of life and is scheduled for retirement. We recommend that you upgrade your workspace to Grafana 11 by following the steps below. If your Grafana version is Grafana 11, no further action is necessary.

      :::image type="content" source="media/grafana-11-upgrade/check-grafana-version.jpg" alt-text="Screenshot of the Azure platform showing Grafana Version 9.":::
  
### [Azure CLI](#tab/azure-cli)

Run the command [az grafana show](/cli/azure/grafana#az-grafana-show) in the Azure CLI to retrieve the properties of the Azure Managed Grafana workspace. Replace the placeholder `<azure-managed-grafana-workspace>` with the name of the Azure Managed Grafana instance.

```azurecli
az grafana show --name <azure-managed-grafana-workspace>
```

The version number is listed in the output after `grafanaMajorVersion`. If version is `10`, your workspace is on the Grafana version that is reaching end of life and is scheduled for retirement. We recommend that you upgrade your workspace to Grafana 11 by following the steps below. If your Grafana version is `11`, no further action is necessary.

---

## Upgrade to Grafana 11

Upgrade from Grafana 10 to Grafana 11 by following the steps below.

> [!IMPORTANT]  
> Grafana 11 includes significant breaking changes. Make sure to review the [Grafana Breaking changes in Grafana v11.0](https://grafana.com/docs/grafana/latest/breaking-changes/breaking-changes-v11-0/) article thoroughly before upgrading your workspace.

> [!CAUTION]  
> Upgrading to Grafana 11 is irreversible.

### [Portal](#tab/azure-portal)

In the Azure portal:

1. Once you have reviewed the breaking changes in Grafana 11 and are ready to proceed with the upgrade, open your workspace and select **Settings** > **Configuration** from the left menu.
1. Under **Grafana Version**, select **11**.
1. Select **Save** on top to save the new settings and trigger the upgrade to Grafana version 11.

    :::image type="content" source="media/grafana-11-upgrade/save-upgrade.jpg" alt-text="Screenshot of the Azure portal showing Grafana version 11 selected in the dropdown menu and the Save button highlighted.":::

1. A notification appears, indicating that the upgrade is in progress. In the **Overview** page, Grafana’s **Provisioning State** is **Provisioning** until the upgrade is complete. After a few minutes, a notification appears, and the provisioning state becomes **Succeeded**.

### [Azure CLI](#tab/azure-cli)

In the Azure CLI:

1. Once you have reviewed the breaking changes in Grafana 11 and are ready to proceed with the upgrade, run the [az grafana update](/cli/azure/grafana#az-grafana-update) command and replace `<azure-managed-grafana-workspace>` with the name of your Azure Managed Grafana workspace.

    ```azurecli
    az grafana update --name <azure-managed-grafana-workspace> --major-version 11
    ```

1. The CLI displays a warning indicating that upgrading to Grafana version 11 is a permanent an irreversible operation.
---

## Next step

In this article, you have been guided through upgrading your Azure Managed Grafana workspace from Grafana 10 to Grafana 11. If needed, go to the following guide for additional support.

> [!div class="nextstepaction"]
> [Find help or open a support ticket](./find-help-open-support-ticket.md)
