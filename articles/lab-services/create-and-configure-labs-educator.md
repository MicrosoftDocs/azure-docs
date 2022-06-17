---
title: Configure regions for labs
description: Learn how to change the region of a lab. 
author: RoseHJM
ms.author: rosemalcolm
ms.service: lab-services
ms.topic: how-to 
ms.date: 06/17/2022
ms.custom: template-how-to 
---

# Configure regions for labs

This article shows you how to configure the locations where you can create labs by enabling or disabling regions associated with the lab plan. Enabling a region allows lab creators to create labs within that region. You cannot create labs in disabled regions. 

When you create a lab plan, you have to set an initial region for the labs, but you can enable or disable more regions for your lab at any time.

You might need to change the region for your labs in these circumstances:
- Regulatory compliance. Choosing where your data resides, such as European organizations choosing specific regions to help ensure that they are General Data Protection Regulation (GDPR) compliant.
- Service availability. Providing the optimal lab experience for your students by ensuring the Azure Lab Service is available in the region closest to them.

## Prerequisites

- To perform these steps, you must have an existing lab plan.

## Configure for the lab level

To modify region setting after lab creation, follow these steps.

1. In the [Azure portal](https://portal.azure.com), navigate to your lab plan.
1. On the Lab plan overview page, select **Lab settings** from the left menu or select **Adjust settings**. Both go to the Lab settings page.
   :::image type="content" source="./media/create-and-configure-labs-educator/lab-plan-overview-page.png" alt-text="Screenshot that shows the Lab overview page with Lab settings and Adjust settings highlighted.":::
1. On the Lab settings page, under **Location selection**, select **Select regions**.
   :::image type="content" source="./media/create-and-configure-labs-educator/lab-settings-page.png" alt-text="Screenshot that shows the Lab settings page with Select regions highlighted.":::
1. On the Enabled regions page, select the region(s) you want to add, select **Enable**.
   :::image type="content" source="./media/create-and-configure-labs-educator/enabled-regions-page.png" alt-text="Screenshot that shows the Enabled regions with Enable and Apply highlighted.":::
1. Enabled regions are displayed at the top of the list. Check that your desired regions are displayed and then select **Apply** to confirm your selection.
   > NOTE
   > You can disable regions on this page, by clearing the checkbox for the region. 
1. On the Lab settings page, verify that the regions you enabled are listed and then select **Save**. 
   :::image type="content" source="./media/create-and-configure-labs-educator/newly-enabled-regions.png" alt-text="Screenshot that shows the Lab settings page with the newly selected regions highlighted.":::
 


## Next steps

- Learn how to choose the right regions for your Lab plan at [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/#overview).
- Check [Azure Lab Services](https://azure.microsoft.com/global-infrastructure/services/?products=devtest-lab,lab-services) availability near you.