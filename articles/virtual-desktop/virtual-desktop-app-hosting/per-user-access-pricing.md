---
title: Azure Virtual Desktop enroll per-user access pricing - Azure
description: How to enroll in a per-using access pricing license for Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 06/10/2021
ms.author: helohr
manager: femila
---

# Enroll your subscription in per-user access pricing

Before external users can connect to your deployment, you need to enroll your subscription in per-user access pricing. This will allow users outside of your organization to access apps and desktops in your subscription. Your enrolled subscription will be charged each month based on the number of distinct users who connect to Azure Virtual Desktop resources within it.

>[!NOTE]
>Azure Virtual Desktop is currently offering a special promotion with no charge to access Azure Virtual Desktop for streaming applications to external users. Enrollment in per-user access pricing is still required to provide access to external users, but there is no charge during the promotional period. To learn more, see [Azure Virtual Desktop pricing](https://aka.ms/wvdpricing).

<!---I don't think we do promotional offers in articles. I should check to see if we should include this--->

## How to enroll

To enroll your Azure subscription into per-user access pricing:

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

2. Enter **Windows Azure Virtual Desktop** into the search bar, then find and select **Windows Virtual Desktop** under Services.

3. In the **Windows Virtual Desktop** overview page, select **Per-user access pricing**.

4. In the list of subscriptions, select the subscription where you'll deploy Azure Virtual Desktop resources.

5. Select **Enroll**.

6. Review the Product Terms, then select **Confirm** to begin enrollment. It may take up to an hour for the enrollment process to finish.

7. After enrollment is done, check the value in the **Per-user access pricing** column of the subscriptions list to make sure it's changed from “Enrolling” to “Enrolled.”

## Next steps

To learn more about per-user access pricing, see [Understanding licensing for app hosting](placeholder.md).
