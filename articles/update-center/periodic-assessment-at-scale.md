---
title: Enable periodic assessment using policy
description: This article describes how to manage the update settings for your Windows and Linux machines managed by update management center (preview).
ms.service: update-management-center
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 04/21/2022
ms.topic: conceptual
---

# Automate assessment at scale using Policy to see latest update status

This article describes how to enable Periodic Assessment for your machines at scale using Azure Policy. Periodic Assessment is a setting on your machine that enables you to see the latest updates available for your machines and removes the hassle of performing assessment manually every time you need to check the update status. Once you enable this setting, update management center (preview) fetches updates on your machine once every 24 hours.

>[!NOTE]
>  You must [register for the periodic assessement](./enable-machines.md?branch=release-updatecenterv2-publicpreview&tabs=portal-periodic%2cps-periodic-assessment%2ccli-periodic-assessment%2crest-periodic-assessment) in your Azure subscription to enable this feature. 

## Enable Periodic assessment for your Azure machines using Policy
1. Go to **Policy** from the Azure portal and under **Authoring**, go to **Definitions**. 
1. From the **Category** dropdown, select **Update management center**. Select *[Preview]: Configure periodic checking for missing system updates on Azure virtual machines* for Azure machines.
1. When the Policy Definition opens, select Assign.
1. In **Basics**, select your subscription as your scope. You can also specify a resource group within subscription as the scope and select Next.
1. In **Parameters**, uncheck **Only show parameters that need input or review** so that you can see the values of parameters. In **Assessment** mode, select *AutomaticByPlatform*, select *Operating system* and select **Next**. You need to create separate policies for Windows and Linux.
1. In **Remediation**, check **Create a remediation task**, so that periodic assessment is enabled on your machines and click **Next**.
1. In **Non-compliance message**, provide the message that you would like to see in case of non-compliance. For example: *Your machine doesn't have periodic assessment enabled.* Select **Review+Create.**
1. On the **Review+Create** tab, select **Create**. This action triggers Assignment and Remediation Task creation, which can take a minute or so. 

You can monitor the compliance of resources under **Compliance** and remediation status under **Remediation** from the Policy home page.

## Enable Periodic assessment for your Arc machines using Policy

1. Go to **Policy** from the Azure portal and under **Authoring**, **Definitions**. 
1. From the **Category** dropdown, select **Update management center**. Select *[Preview]: Configure periodic checking for missing system updates on Azure Arc-enabled servers* for Arc-enabled machines. 
1. When the Policy Definition opens, select **Assign**.
1. In **Basics**, select your subscription as your scope. You can also specify a resource group within subscription as the scope and select **Next**.
1. In **Parameters**, uncheck **Only show parameters that need input or review** so that you can see the values of parameters. In **Assessment** mode, select *AutomaticByPlatform*, select *Operating system* and select **Next**. You need to create separate policies for Windows and Linux.
1. In **Remediation**, check *Create a remediation task*, so that periodic assessment is enabled on your machines and click on Next.
1. In **Non-compliance message**, provide the message that you would like to see in case of non-compliance. For example: *Your machine doesn't have periodic assessment enabled.* Click **Review+Create.**
1. In **Review+Create**, select **Create** to trigger Assignment and Remediation Task creation which can take a minute or so. 

You can monitor compliance of resources under **Compliance** and remediation status under **Remediation** from the Policy home page.

## Monitor if Periodic Assessment is enabled for your machines (both Azure and Arc-enabled machines)

1. Go to **Policy** from the Azure portal and under **Authoring**, go to **Definitions**. 
1. From the Category dropdown above, select **Update management center**. Select *[Preview]: Machines should be configured to periodically check for missing system updates*. 
1. When the Policy Definition opens, select **Assign**.
1. In **Basics**, select your subscription as your scope. You can also specify a resource group within subscription as the scope. Select **Next.**
1. In **Parameters** and **Remediation**, select **Next.**
1. In **Non-compliance message**, provide the message that you would like to see in case of non-compliance. For example: *Your machine doesn't have periodic assessment enabled.* and select **Review+Create.**
1. In **Review+Create**, click **Create** to trigger Assignment and Remediation Task creation which can take a minute or so. 

You can monitor compliance of resources under **Compliance** and remediation status under **Remediation** from the Policy home page.

## Next steps

* [View assessment compliance](view-updates.md) and [deploy updates](deploy-updates.md) for a selected Azure VM or Arc-enabled server, or across [multiple machines](manage-multiple-machines.md) in your subscription in the Azure portal.
* To view update assessment and deployment logs generated by update management center (preview), see [query logs](query-logs.md).
* To troubleshoot issues, see the [Troubleshoot](troubleshoot.md) update management center (preview).