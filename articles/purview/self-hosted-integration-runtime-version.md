---
title: Self-hosted integration runtime auto-update and expiration
description: Learn about self-hosted integration runtime auto-update and expiration in Microsoft Purview.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 01/31/2023
---

# Self-hosted integration runtime auto-update and expiration

This article will describe how to let self-hosted integration runtime auto-update to the latest version and how Microsoft Purview manages the versions of self-hosted integration runtime.

## How to check your self-hosted integration runtime version

You can check the version of your self-hosted integration runtime in Microsoft Purview governance portal -> Data map -> Integration runtimes:

:::image type="content" source="./media/self-hosted-integration-runtime-version/self-hosted-integration-runtime-version-portal.png" alt-text="Screenshot that shows the version in Microsoft Purview governance portal.":::

You can also check the version in your self-hosted integration runtime client -> Help tab.

## Self-hosted Integration Runtime auto-update

Auto update is enabled by default when you install a self-hosted integration runtime. You have two options to manage the version of self-hosted integration runtime: auto-update or maintain manually. Typically, Microsoft Purview releases two new versions of self-hosted integration runtime every month, which includes new feature release, bug fix or enhancement. So we recommend users to update to newer version in order to get the latest feature and enhancement.

The self-hosted integration runtime will be automatically updated to newer version. When new version is available while not yet scheduled for your instance, you can also trigger the update from the portal.

:::image type="content" source="media/self-hosted-integration-runtime-version/shir-auto-update-with-new-version.png" alt-text="Screenshot of checking the self-hosted integration runtime version and trigger update.":::

> [!NOTE]
> If you have multiple self-hosted integration runtime nodes, there is no downtime during auto-update. The auto-update happens in one node first while others are working on tasks. When the first node finishes the update, it will take over the remain tasks when other nodes are updating. If you only have one self-hosted integration runtime node, then it has some downtime during the auto-update.

## Auto-update version vs latest version

To ensure the stability of self-hosted integration runtime, although we release two versions, we'll only push one version every month. So sometimes you'll find that the auto-update version is the previous version of the actual latest version. If you want to get the latest version, you can go to [download center](https://www.microsoft.com/download/details.aspx?id=39717) and do so manually. Additionally, **auto-update** to a new version is managed by the service, and you can't change it.

The self-hosted integration runtime **Version** tab in Microsoft Purview governance portal shows the newer version if current version is old. When your self-hosted integration runtime is online, this version is the auto-update version and will automatically update your self-hosted integration runtime in the scheduled time. But if your self-hosted integration runtime is offline, the page only shows the newer version.

If you have multiple nodes, and for some reasons that some of them aren't auto-updated successfully. Then these nodes roll back to the version, which was the same across all nodes before auto-update.

## Self-hosted Integration Runtime expiration

Each version of self-hosted integration runtime will be expired in one year. The expiring message is shown in Microsoft Purview governance portal and the self-hosted integration runtime client **90 days** before expiration.

## Next steps

- [Create and manage a self-hosted integration runtime](manage-integration-runtimes.md)
