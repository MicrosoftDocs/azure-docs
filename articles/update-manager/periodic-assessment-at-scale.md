---
title: Enable Periodic Assessment using policy
description: This article shows how to manage update settings for your Windows and Linux machines managed by Azure Update Manager.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 09/18/2023
ms.topic: conceptual
---

# Automate assessment at scale by using Azure Policy

This article describes how to enable Periodic Assessment for your machines at scale by using Azure Policy. **Periodic Assessment** is a setting on your machine that enables you to see the latest updates available for your machines and removes the hassle of performing assessment manually every time you need to check the update status. After you enable this setting, Update Manager fetches updates on your machine once every 24 hours.

## Enable Periodic Assessment for your Azure machines by using Azure Policy

1. Go to **Policy** in the Azure portal and select **Authoring** > **Definitions**.
1. From the **Category** dropdown, select **Update Manager**. Select **[Preview]: Configure periodic checking for missing system updates on Azure virtual machines** for Azure machines.
1. When **Policy definition** opens, select **Assign**.
1. On the **Basics** tab, select your subscription as your scope. You can also specify a resource group within your subscription as the scope. Select **Next**.
1. On the **Parameters** tab, clear **Only show parameters that need input or review** so that you can see the values of parameters. In **Assessment** mode, select **AutomaticByPlatform** > **Operating system** > **Next**. You need to create separate policies for Windows and Linux.
1. On the **Remediation** tab, select **Create a remediation task** so that periodic assessment is enabled on your machines. Select **Next**.
1. On the **Non-compliance message** tab, provide the message that you want to see if there was noncompliance. For example, use **Your machine doesn't have periodic assessment enabled.** Select **Review + Create.**
1. On the **Review + Create** tab, select **Create** to trigger **Assignment and Remediation Task** creation, which can take a minute or so.

You can monitor the compliance of resources under **Compliance** and remediation status under **Remediation** on the Azure Policy home page.

## Enable Periodic Assessment for your Azure Arc-enabled machines by using Azure Policy

1. Go to **Policy** in the Azure portal and select **Authoring** > **Definitions**.
1. From the **Category** dropdown, select **Update Manager**. Select **[Preview]: Configure periodic checking for missing system updates on Azure Arc-enabled servers** for Azure Arc-enabled machines.
1. When **Policy definition** opens, select **Assign**.
1. On the **Basics** tab, select your subscription as your scope. You can also specify a resource group within your subscription as the scope. Select **Next**.
1. On the **Parameters** tab, clear **Only show parameters that need input or review** so that you can see the values of parameters. In **Assessment** mode, select **AutomaticByPlatform** > **Operating system** > **Next**. You need to create separate policies for Windows and Linux.
1. On the **Remediation** tab, select **Create a remediation task** so that periodic assessment is enabled on your machines. Select **Next**.
1. On the **Non-compliance message** tab, provide the message that you want to see if there was noncompliance. For example, use **Your machine doesn't have periodic assessment enabled.** Select **Review + Create.**
1. On the **Review + Create** tab, select **Create** to trigger **Assignment and Remediation Task** creation, which can take a minute or so.

You can monitor compliance of resources under **Compliance** and remediation status under **Remediation** on the Azure Policy home page.

## Monitor if Periodic Assessment is enabled for your machines

This procedure applies to both Azure and Azure Arc-enabled machines.

1. Go to **Policy** in the Azure portal and select **Authoring** > **Definitions**.
1. From the **Category** dropdown, select **Update Manager**. Select **[Preview]: Machines should be configured to periodically check for missing system updates**.
1. When **Policy definition** opens, select **Assign**.
1. On the **Basics** tab, select your subscription as your scope. You can also specify a resource group within your subscription as the scope. Select **Next**.
1. On the **Parameters** and **Remediation** tabs, select **Next**.
1. On the **Non-compliance message** tab, provide the message that you want to see if there was noncompliance. For example, use **Your machine doesn't have periodic assessment enabled.** Select **Review + Create.**
1. On the **Review + Create** tab, select **Create** to trigger **Assignment and Remediation Task** creation, which can take a minute or so.

You can monitor compliance of resources under **Compliance** and remediation status under **Remediation** on the Azure Policy home page.

## Next steps

* [View assessment compliance](view-updates.md) and [deploy updates](deploy-updates.md) for a selected Azure VM or Azure Arc-enabled server, or across [multiple machines](manage-multiple-machines.md) in your subscription in the Azure portal.
* To view update assessment and deployment logs generated by Update Manager, see [Query logs](query-logs.md).
* To troubleshoot issues, see [Troubleshoot Update Manager](troubleshoot.md).
