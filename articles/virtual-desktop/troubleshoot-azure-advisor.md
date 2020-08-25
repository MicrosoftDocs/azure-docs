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

## “Not enough links are whitelisted for successful implementation of a VM”

This issue appears under Operational Excellence.

There is a list of certain URLs that need to be unblocked for a user to be able to effectively use Windows Virtual Desktop. There needs to be a declaration that these links are unblocked for the virtual machine to function optimally. To see an minimum list of the required links for the virtual machines to function, plus additional best practices, visit the following link: <https://docs.microsoft.com/en-us/azure/virtual-desktop/safe-url-list>

### How to resolve the warning

To resolve this, you have to whitelist the URLs found at this link. <https://docs.microsoft.com/en-us/azure/virtual-desktop/safe-url-list>. You can use Service Tag or FQDN Tags to do the same.

**Feedback**

Do you have an idea for a recommendation that you wish already existed? Let us know! Chances are, if you’re experiencing an issue, many other users are too. By submitting a proposal for a future recommendation, you can help us help many more people in the future. Click the following link to share your idea with us. Be as detailed as possible, that way we can have the best opportunity to make your submission into a recommendation.

<https://windowsvirtualdesktop.uservoice.com/forums/930847-azure-advisor-recommendations>
