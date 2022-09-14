---
title: Autoscale with multiple profiles
description: "Using multiple profiles in autoscale"
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.subservice: autoscale
ms.topic: conceptual
ms.date: 09/15/2022
ms.reviewer: 
---

# Autoscale with multiple profiles

You can have one or more profiles in your autoscale setting.
A default profile is automatically created. The default profile isn't dependent on a schedule. Add more profiles such as a recurring profile, or a profile with a fixed date and time range.

Each time the autoscale service runs, the profiles are checked in the following  order:

1. Fixed Date profile
1. Recurring profile
1. Default ("Always") profile

When a profile's conditions are met, autoscale will apply that profiles limits and rules. Only the first applicable profile is applied. Any other profiles are ignored until the next run. If you always want to implement a given rule, include the rule in all profiles.

The example below shows an autoscale setting with a default profile as follows:

+ Minimum instances = 2
+ Maximum instances = 10
+ Scale out when the average request count is greater than 10
+ Scale in when the average request count is less than three

An additional, recurring profile set for Monday has the following settings:

+ Minimum instances = 3
+ Maximum instances = 10
+ Scale out when CPU% exceeds 50
+ Scale in when CPU% is below 20
+ Repeat this profile every Monday, between 6 AM and 6 PM Eastern Time

On Monday after 6 AM, the next time the autoscale service runs, the recurring profile will be used. If the instance count is two, autoscale scales to the new minimum of three. Until Monday at 6 PM, autoscale continues to use this profile and scales based on CPU%. At all other times scaling will be based on the number of requests and the minimum number of instances is 2.
After 6 PM on Monday, autoscale switches back to the default profile. If, for example the number of instances at the time is 12, autoscale scales in to 10, the maximum allowed for the default profile.

:::image type="content" source="./media/autoscale-best-practices/autoscale-best-practices-multi-profile1-small.png" alt-text="A screenshot showing an autoscale settings default profile or scale condition":::

[![](./media/autoscale-best-practices/autoscale-best-practices-multi-profile1-small.png)](./media/autoscale-best-practices/autoscale-best-practices-multi-profile1.png#lightbox)
[![A screenshot showing an autoscale settings recurring profile or scale condition](./media/autoscale-best-practices/autoscale-best-practices-multi-profile2-small.png)](./media/autoscale-best-practices/autoscale-best-practices-multi-profile2.png#lightbox).


