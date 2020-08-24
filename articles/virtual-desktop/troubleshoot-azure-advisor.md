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

This issue usually appears under "Operational Excellence."

“We have determined that you do not have a validation environment enabled in current subscription. When creating your host pools, you have selected "No" for "Validation environment" in the properties tab. Having at least one host pool with a validation environment enabled ensures the business continuity through Windows Virtual Desktop service deployments with early detection of potential issues.”

### How to resolve the warning

To resolve this, first go to your Azure portal home page and select any of your existing host pools.

![](media/deaf7c239c73ce764adaec25aee4e952.png)

Next, select the host pool you want to push from production environment to validation environment.

Under the properties tab in the column on the right, scroll down until you see “Validation environment” and switch the selection to “Yes.” Save the changes before exiting.

![](media/aeaecaf70ba28db278d511eaa9d2eb2c.png)

This won't make the warning go away immediately. The warning will go away within a day of making these changes. Should it be of concern, you can always postpone or dismiss the recommendation manually. We recommend you let the recommendation go away on its own, this way if there was an error in your manual resolution of the issue, Azure Advisor will still let you know there is a potential problem.

## “Not enough production (non-validation) environments enabled”

### Description

This issue usually appears under "Operational Excellence."

For the same reason it is an issue when a user only has host pools in a validation environment, it is an issue if a user has too many host pools in a validation environment. We recommend that a user have fewer than half of their host pools in a validation environment.

### How to resolve the production environment warning

This is a very manageable warning to take care of. In order to get the recommendation to go away, you need to decrease the number of host pools you have in the validation environment. Unlike the recommendation above, you may need to select and manipulate multiple host pools. Follow the same process to access the properties tab, just this time ensure that the validation environment is set to “No.” Do this for at least half of your host pools. Note that just like all other recommendations, following these steps does not immediately dismiss the warning. This warning updates on a bi-daily basis, so check back in a day to see if the warning is gone.

![](media/e5b44420a46caa0e862bc842d52b22cd.png)

## “Not enough links are whitelisted for successful implementation of a VM”

This issue usually appears under "Operational Excellence."

There is a list of certain URLs that need to be unblocked for a user to be able
to effectively use Windows Virtual Desktop. There needs to be a declaration that
these links are unblocked, or “whitelisted,” for the virtual machine to function
optimally. To see an minimum list of the required links for the virtual machines
to function, plus additional best practices, visit the following link:
<https://docs.microsoft.com/en-us/azure/virtual-desktop/safe-url-list>

### How to resolve the warning

To resolve this, you have to whitelist the URLs found at this link.
<https://docs.microsoft.com/en-us/azure/virtual-desktop/safe-url-list>. You can
use Service Tag or FQDN Tags to do the same.

**Feedback**

Do you have an idea for a recommendation that you wish already existed? Let us
know! Chances are, if you’re experiencing an issue, many other users are too. By
submitting a proposal for a future recommendation, you can help us help many
more people in the future. Click the following link to share your idea with us.
Be as detailed as possible, that way we can have the best opportunity to make
your submission into a recommendation.

<https://windowsvirtualdesktop.uservoice.com/forums/930847-azure-advisor-recommendations>
