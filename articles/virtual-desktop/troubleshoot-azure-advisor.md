---
title: Troubleshoot Azure Advisor Windows Virtual Desktop - Azure
description: How to resolve issues with Azure Advisor in a Windows Virtual Desktop tenant environment.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 08/24/2020
ms.author: helohr
manager: lizross
---
# Troubleshoot Azure Advisor for Windows Virtual Desktop

This article describes how you can fix common issues that appear in Azure Advisor for Windows Virtual Desktop.

## “No validation environment enabled”

![](media/9323ec62a7f32354b624841e9ab10e44.png)

### Description

This issue appears under Operational Excellence. Usually, when you encounter this issue, you get a warning message like this:

"You don't have a validation environment enabled in this subscription. When you made your host pools, you selected **No** for "Validation environment" in the Properties tab. To ensure business continuity through Windows Virtual Desktop service deployments, make sure you have at least one host pool with a validation environment where you can test for potential issues.”

### How to resolve the warning

You can make this warning message go away by creating a validation environment in one of your host pools.

To create a validation environment:

1. Go to your Azure portal home page and select any host pool you want to use.

![](media/deaf7c239c73ce764adaec25aee4e952.png)

2. Next, select the host pool you want to change from a production environment to a validation environment.

3. In your host pool, select the **Properties** tab in the column on the right side of the screen, then scroll down until you see “Validation environment.” Select **Yes**, then select **Apply**.

![](media/aeaecaf70ba28db278d511eaa9d2eb2c.png)

This won't make the warning go away immediately, but it should stop appearing within a day of making these changes. Azure Advisor updates twice a day. Until then, you can postpone or dismiss the recommendation manually. We recommend you let the recommendation go away on its own so that Azure Advisor can let you know if it encounters any problems as the settings change.

## “Not enough production (non-validation) environments enabled”

### Description

This issue appears under Operational Excellence.

For this issue, the warning message appears for one of these reasons:

- You have too many host pools in your validation environment.
- You don't have any production host pools. 

We recommend users have fewer than half of their host pools in a validation environment.

### How to resolve the production environment warning

To resolve this warning:

1. Go to your Azure portal home page.
2. Select the host pools you want either want to change from validation to production.
3. In your host pool, select the **Properties** tab in the column on the right side of the screen, then scroll down until you see “Validation environment.” Select **No**, then select **Apply**.

This won't make the warning go away immediately, but it should stop appearing within a day of making these changes. Azure Advisor updates twice a day. Until then, you can postpone or dismiss the recommendation manually. We recommend you let the recommendation go away on its own so that Azure Advisor can let you know if it encounters any problems as the settings change.

![](media/e5b44420a46caa0e862bc842d52b22cd.png)

## “Not enough links are unblocked to successfully implement your VM”

This issue appears under Operational Excellence.

You need to unblock specific URLs to make sure that your virtual machine (VM) functions properly. You can see the list at [Safe URL list](safe-url-list.md). If the URLs aren't unblocked, then your VM won't work properly.

### How to resolve the warning

To solve this issue, make sure you unblock all the URLs on the [Safe URL list](safe-url-list.md). You can use Service Tag or FQDN tags to unblock URLs, too.

## Propose new recommendations

You can help us improve Azure Advisor by submitting ideas for recommendations based on issues you've encountered. Chances are, other users may be encountering the same issue and could benefit from your guidance. To submit a suggestion, go to [our UserVoice forum](https://windowsvirtualdesktop.uservoice.com/forums/930847-azure-advisor-recommendations) and fill out the form with as much detail as possible.