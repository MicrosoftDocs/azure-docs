---
title: Autoscale scaling plans and example scenarios in Azure Virtual Desktop
description: Information about autoscale and a collection of four example scenarios that illustrate how various parts of autoscale for Azure Virtual Desktop work.
author: Heidilohr
ms.topic: conceptual
ms.date: 11/01/2023
ms.author: helohr
manager: femila
ms.custom: references_regions
---
# Autoscale scaling plans and example scenarios in Azure Virtual Desktop

Autoscale lets you scale your session host virtual machines (VMs) in a host pool up or down according to schedule to optimize deployment costs.

> [!NOTE]
> - Azure Virtual Desktop (classic) doesn't support autoscale. 
> - Autoscale isn't supported on Azure Virtual Desktop for Azure Stack HCI.
> - Autoscale doesn't support scaling of ephemeral disks.
> - You can't use autoscale and [scale session hosts using Azure Automation](set-up-scaling-script.md) on the same host pool. You must use one or the other.
> - Autoscale is available in Azure and Azure Government in the same regions you can [create host pools](create-host-pools-azure-marketplace.md) in.

For best results, we recommend using autoscale with VMs you deployed with Azure Virtual Desktop Azure Resource Manager (ARM) templates or first-party tools from Microsoft.

## How a scaling plan works

Before you create your plan, keep the following things in mind:

- You can assign one scaling plan to one or more host pools of the same host pool type. The scaling plan's schedules will be applied to all assigned host pools.

- You can only associate one scaling plan per host pool. If you assign a single scaling plan to multiple host pools, those host pools can't be assigned to another scaling plan.

- Hibernate (preview) is available for personal host pools. For more information, view [Hibernation in virtual machines](/azure/virtual-machines/hibernate-resume).

- A scaling plan can only operate in its configured time zone.

- A scaling plan can have one or multiple schedules. For example, different schedules during weekdays versus the weekend.

- Make sure you understand usage patterns before defining your schedule. You'll need to schedule around the following times of day:

    - Ramp-up: the start of the day, when usage picks up.
    - Peak hours: the time of day when usage is expected to be at its highest.
    - Ramp-down: when usage tapers off. This is usually when you shut down your VMs to save costs.
    - Off-peak hours: the time of the day when usage is expected to be at its lowest.

- The scaling plan will take effect as soon as you enable it.

Also, keep these limitations in mind:

- Don’t use autoscale in combination with other scaling Microsoft or third-party scaling tools. Ensure that you disable those for the host pools you apply the scaling plans to.

- For pooled host pools, autoscale overwrites [drain mode](drain-mode.md), so make sure to use exclusion tags when updating VMs in host pools.

- For pooled host pools, autoscale ignores existing [load-balancing algorithms](host-pool-load-balancing.md) in your host pool settings, and instead applies load balancing based on your schedule configuration.

## Example scenarios for autoscale for pooled host pools

In this section, there are four scenarios that show how different parts of autoscale for pooled host pools works. In each example, there are tables that show the host pool's settings and animated visual demonstrations.

>[!NOTE]
>To learn more about what the parameter terms mean, see [our autoscale glossary](autoscale-glossary.md).

### Scenario 1: When does autoscale turn virtual machines on?

In this scenario, we'll demonstrate that autoscale can turn on session host virtual machines (VMs) in any phase of the scaling plan schedule when the used host pool capacity exceeds the capacity threshold.

For example, let's look at the following host pool setup as described in this table:

|Parameter | Value|
|---|---|
|Phase | Ramp-up |
|Total session hosts | 6 |
|Load balancing algorithm | Breadth-first |
|Capacity threshold | 30% |
|Minimum percentage of hosts | 30% |
|Available session hosts | 2 |
|Maximum session limit | 5 |
|Available host pool capacity | 10 |
|User sessions | 0 |
|Used host pool capacity | 0% |

At the beginning of this phase, autoscale has turned on two session hosts to match the minimum percentage of hosts. Although 30% of six isn't a whole number, autoscale rounds up to the nearest whole number. Having two available session hosts and a maximum session limit of five sessions per host means that this host pool has an available host pool capacity of 10. Since there aren't currently any user sessions, the used host pool capacity is 0%.

When the day begins, let's say three users sign in and start user sessions. Their user sessions get evenly distributed across the two available session hosts since the load balancing algorithm is breadth first. The available host pool capacity is still 10, but with the three new user sessions, the used host pool capacity is now 30%. However, autoscale won't turn on virtual machines (VMs) until the used host pool capacity is greater than the capacity threshold. In this example, the capacity threshold is 30%, so autoscale won't turn on any VMs yet.

At this point, the host pool's parameters look like this:

|Parameter | Value|
|---|---|
|Phase | Ramp-up |
|Total session hosts |6 |
|Load balancing algorithm | Breadth-first |
|Capacity threshold | 30% |
|Minimum percentage of hosts | 30% |
|Available session hosts | 2 |
|Maximum session limit | 5 |
|Available host pool capacity | 10 |
|User sessions | 3 |
|Used host pool capacity | 30% |

When another user signs in and starts a session, there are now four total users sessions distributed across two session hosts. The used host pool capacity is now 40%, which is greater than the capacity threshold. As a result, autoscale will turn on another session host to bring the used host pool capacity to less than or equal to the capacity threshold (30%).

In summary, here are the parameters when the used host pool capacity exceeds the capacity threshold:

|Parameter | Value|
|---|---|
|Phase | Ramp-up |
|Total session hosts | 6 |
|Load balancing algorithm | Breadth-first |
|Capacity threshold | 30% |
|Minimum percentage of hosts | 30% |
|Available session hosts | 2 |
|Maximum session limit | 5 |
|Available host pool capacity | 10 |
|User sessions | 4 |
|Used host pool capacity | 40% |

Here are the parameters after autoscale turns on another session host:

|Parameter | Value|
|---|---|
|Phase | Ramp-up |
|Total session hosts | 6 |
|Load balancing algorithm | Breadth-first |
|Capacity threshold | 30% |
|Minimum percentage of hosts | 30% |
|Available session hosts | 3 |
|Maximum session limit | 5 |
|Available host pool capacity | 15 |
|User sessions | 4 |
|Used host pool capacity | 27% |

Turning on another session host means there are now three available session hosts in the host pool. With the maximum session limit still being five, the available host pool capacity has gone up to 15. Because the available host pool capacity increased, the used host pool capacity has gone down to 27%, which is below the 30% capacity threshold.

When another user signs in, there are now five user sessions spread across three available session hosts. The used host pool capacity is now 33%, which is over the 30% capacity threshold. Exceeding the capacity threshold activates autoscale to turn on another session host.

Since our example is in the ramp-up phase, new users are likely to keep signing in. As more users arrive, the pattern becomes clearer:

| Total user sessions | Number of available session hosts | Available host pool capacity |Capacity threshold | Used host pool capacity | Does autoscale turn on another session host? |
|----|---|---|---|---|---|
|5|3|15|30%|33%|Yes|
|5|4|20|30%|25%|No|
|6|4|20|30%|30%|No|
|7|4|20|30%|35%|Yes|
|7|5|25|30%|28%|No|

As this table shows, autoscale only turns on new session hosts when the used host pool capacity goes over the capacity threshold. If the used host pool capacity is at or below the capacity threshold, autoscale won't turn on new session hosts.

The following animation is a visual recap of what we just went over in Scenario 1.

:::image type="content" source="./media/autoscale-turn-on.gif" alt-text="A visual recap of Scenario 1.":::

### Scenario 2: When does autoscale turn virtual machines off?

In this scenario, we'll show that autoscale turns off session hosts when all of the following things are true:

- The used host pool capacity is below the capacity threshold.
- Autoscale can turn off session hosts without exceeding the capacity threshold.
- Autoscale only turns off session hosts with no user sessions on them (unless the scaling plan is in ramp-down phase and you've enabled the force logoff setting).
- Pooled autoscale will not turn off session hosts in the ramp-up phase to avoid bad user experience.


For this scenario, the host pool starts off looking like this:

|Parameter | Value|
|---|---|
|Phase | Peak |
|Total session hosts | 6 |
|Load balancing algorithm | Breadth-first |
|Capacity threshold | 30% |
|Minimum percentage of hosts | 30% |
|Available session hosts | 5 |
|Maximum session limit | 5 |
|Available host pool capacity | 25 |
|User sessions | 7 |
|Used host pool capacity | 28% |

Because we're in the peak phase, we can expect the number of users to remain relatively stable. However, to keep the amount of resources used stable while also remaining efficient, autoscale will turn session hosts on and off as needed.

So, let's say that there are seven users signed in during peak hours. If the total number of user sessions is seven, that would make the used host pool capacity 28%. Because autoscale can't turn off a session host without the used host pool capacity exceeding the capacity threshold, autoscale won't turn off any session hosts yet.

If two of the seven users sign out during their lunch break, that leaves five user sessions across five session hosts. Since the maximum session limit is still five, the available host pool capacity is 25. Having only five users means that the used host pool capacity is now 20%. autoscale must now check if it can turn off a session host without making the used host pool capacity go above the capacity threshold.

If autoscale turned off a session host, the available host pool capacity would be 20. With five users, the used host pool capacity would then be 25%. Because 25% is less than the capacity threshold of 30%, autoscale will select a session host without user sessions on it, put it in drain mode, and turn it off.

Once autoscale turns off one of the session hosts without user sessions, there are four available session hosts left. The host pool maximum session limit is still five, so the available host pool capacity is 20. Since there are five user sessions, the used host pool capacity is 25%, which is still below the capacity threshold.

However, if another user signs out and heads out for lunch, there are now four user sessions spread across the four session hosts in the host pool. Since the maximum session limit is still five, the available host pool capacity is 20, and the used host pool capacity is 20%. Turning off another session host would leave three session hosts and an available host pool capacity of 15, which would cause the used host pool capacity to jump up to around 27%. Even though 27% is below the capacity threshold, there are no session hosts with zero user sessions on it. Autoscale will select the session host with the least number of user sessions, put it in drain mode, and wait for all user sessions to sign out before turning it off. If at any point the used host pool capacity gets to a point where autoscale can no longer turn off the session host, it will take the session host out of drain mode.

The following animation is a visual recap of what we just went over in Scenario 2.

:::image type="content" source="./media/autoscale-turn-off.gif" alt-text="A visual recap of Scenario 2.":::

### Scenario 3: When does autoscale force users to sign out?

Autoscale only forces users to sign out if you've enabled the **force logoff** setting during the ramp-down phase of your scaling plan schedule. The force logoff setting won't sign out users during any other phase of the scaling plan schedule.

For example, let's look at a host pool with the following parameters:

|Parameter | Value|
|---|---|
|Phase | Ramp-down |
|Total session hosts | 6 |
|Load balancing algorithm | Depth-first |
|Capacity threshold | 75% |
|Minimum percentage of hosts | 10% |
|Available session hosts | 4 |
|Maximum session limit | 5 |
|Available host pool capacity | 20 |
|User sessions | 4 |
|Used host pool capacity | 20% |

During the ramp-down phase, the host pool admin has set the capacity threshold to 75% and the minimum percentage of hosts to 10%. Having a high capacity threshold and a low minimum percentage of hosts in this phase decreases the need to turn on new session hosts at the end of the workday.

For this scenario, let's say that there are currently four users on the four available session hosts in this host pool. Since the available host pool capacity is 20, that means the used host pool capacity is 20%. Based on this information, autoscale detects that it can turn off two session hosts without going over the capacity threshold of 75%. However, since there are user sessions on all the session hosts in the host pool, in order to turn off two session hosts, autoscale will need to force users to sign out.

When you've enabled the force logoff setting, autoscale will select the session hosts with the fewest user sessions, then put the session hosts in drain mode. Autoscale then sends users in the selected session hosts notifications that they're going to be forcibly signed out of their sessions after a certain time. Once that time has passed, if the users haven't already ended their sessions, autoscale will forcibly end their sessions for them. In this scenario, since there are equal numbers of user sessions on each of the session hosts in the host pool, autoscale will choose two session hosts at random to forcibly sign out all their users and will then turn off the session hosts.

Once autoscale turns off the two session hosts, the available host pool capacity is now 10. Now that there are only two user sessions left, the used host pool capacity is 20%, as shown in the following table.

|Parameter | Value|
|---|---|
|Phase | Ramp-down |
|Total session hosts | 6 |
|Load balancing algorithm | Depth-first |
|Capacity threshold | 75% |
|Minimum percentage of hosts | 10% |
|Available session hosts | 2 |
|Maximum session limit | 5 |
|Available host pool capacity | 10 |
|User sessions | 2 |
|Used host pool capacity | 20% |

Now, let's say that the two users who were forced to sign out want to continue doing work and sign back in. Since the available host pool capacity is still 10, the used host pool capacity is now 40%, which is below the capacity threshold of 75%. However, autoscale can't turn off more session hosts, because that would leave only one available session host and an available host pool capacity of five. With four users, that would make the used host pool capacity 80%, which is above the capacity threshold.

So now the parameters look like this:

|Parameter | Value|
|---|---|
|Phase | Ramp-down |
|Total session hosts | 6 |
|Load balancing algorithm | Depth-first |
|Capacity threshold | 75% |
|Minimum percentage of hosts | 10% |
|Available session hosts | 2 |
|Maximum session limit | 5 |
|Available host pool capacity | 10 |
|User sessions | 4 |
|Used host pool capacity | 40% |

If at this point another user signs out, that leaves only three user sessions distributed across the two available session hosts. In other words, the host pool now looks like this:

|Parameter | Value|
|---|---|
|Phase | Ramp-down |
|Total session hosts | 6 |
|Load balancing algorithm | Depth-first |
|Capacity threshold | 75% |
|Minimum percentage of hosts | 10% |
|Available session hosts | 2 |
|Maximum session limit | 5 |
|Available host pool capacity | 10 |
|User sessions | 3 |
|Used host pool capacity | 30% |

Because the maximum session limit is still five and the available host pool capacity is 10, the used host pool capacity is now 30%. Autoscale can now turn off one session host without exceeding the capacity threshold. Autoscale turns off a session host by choosing the session host with the fewest number of user sessions on it. Autoscale then puts the session host in drain mode, sends users a notification that says the session host will be turned off, then after a set amount of time, forcibly signs any remaining users out and turns it off. After doing so, there's now one remaining available session host in the host pool with a maximum session limit of five, making the available host pool capacity five. 

Since autoscale forced a user to sign out when turning off the chosen session host, there are now only two user sessions left, which makes the used host pool capacity 40%.

To recap, here's what the host pool looks like now:

|Parameter | Value|
|---|---|
|Phase | Ramp-down |
|Total session hosts | 6 |
|Maximum session limit | 5 |
|Load balancing algorithm | Depth-first |
|Capacity threshold | 75% |
|Minimum percentage of hosts | 10% |
|Available host pool capacity | 5 |
|User sessions | 2 |
|Available session hosts | 1 |
|Used host pool capacity | 40% |

After that, let's imagine that the user who was forced to sign out signs back in, making the host pool look like this:

|Parameter | Value|
|---|---|
|Phase | Ramp-down |
|Total session hosts | 6 |
|Load balancing algorithm | Depth-first |
|Capacity threshold | 75% |
|Minimum percentage of hosts | 10% |
|Available session hosts | 1 |
|Maximum session limit | 5 |
|Available host pool capacity | 5 |
|User sessions | 3 |
|Used host pool capacity | 60% |

Now there are three user sessions in the host pool. However, the host pool capacity is still five, which means the used host pool capacity is 60% and below the capacity threshold. Because turning off the remaining session host would make the available host pool capacity zero, which is below the 10% minimum percentage of hosts, autoscale will ensure that there's always at least one available session host during the ramp-down phase.

The following animation is a visual recap of what we just went over in Scenario 3.

:::image type="content" source="./media/autoscale-force-sign-out.gif" alt-text="A visual recap of Scenario 3.":::

### Scenario 4: How do exclusion tags work?

When a virtual machine has a tag name that matches the scaling plan exclusion tag, autoscale won't turn it on, off, or change its drain mode setting. Exclusion tags are applicable in all phases of your scaling plan schedule.

Here's the example host pool we're starting with:

|Parameter | Value|
|---|---|
|Phase | Off-peak |
|Total session hosts | 6 |
|Load balancing algorithm | Breadth-first |
|Capacity threshold | 75% |
|Minimum percentage of hosts | 10% |
|Available session hosts | 1 |
|Maximum session limit | 5 |
|Available host pool capacity | 5 |
|User sessions | 3 |
|Used host pool capacity | 60% |

In this example scenario, the host pool admin applies the scaling plan exclusion tag to five out of the six session hosts. When a new user signs in, that brings the total number of user sessions up to four. There's only one available session host and the host pool's maximum session limit is still five, so the available host pool capacity is five. The used host pool capacity is 80%. However, even though the used host pool capacity is greater than the capacity threshold, autoscale won't turn on any other session hosts because all of the session hosts except for the one currently running have been tagged with the exclusion tag.

So, now the host pool looks like this:

|Parameter | Value|
|---|---|
|Phase | Off-peak |
|Total session hosts | 6 |
|Load balancing algorithm | Breadth-first |
|Capacity threshold | 75% |
|Minimum percentage of hosts | 10% |
|Available session hosts |  1|
|Maximum session limit | 5 |
|Available host pool capacity | 5 |
|User sessions | 4 |
|Used host pool capacity | 80% |

Next, let's say all four users have signed out, leaving no user sessions left on the available session host. Because there are no user sessions in the host pool, the used host pool capacity is 0. Autoscale will keep this single session host on despite it having no users, because during the off-peak phase, autoscale's minimum percentage of hosts setting dictates that it needs to keep at least one session host available during this phase.

To summarize, the host pool now looks like this:

|Parameter | Value|
|---|---|
|Phase | Off-peak |
|Total session hosts | 6 |
|Load balancing algorithm | Breadth-first |
|Capacity threshold | 75% |
|Minimum percentage of hosts | 10% |
|Available session hosts | 1 |
|Maximum session limit | 5 |
|Available host pool capacity | 5 |
|User sessions | 0 |
|Used host pool capacity | 0% |

If the admin applies the exclusion tag name to the last untagged session host virtual machine and turns it off, then that means even if other users try to sign in, autoscale won't be able to turn on a VM to accommodate their user session. That user will see a "No resources available" error.

However, being unable to turn VMs back on means that the host pool won't be able to meet its minimum percentage of hosts. To fix any potential problems that causes, the admin removes the exclusion tags from two of the VMs. Autoscale only turns on one of the VMs, because it only needs one VM to meet the 10% minimum requirement.

So, finally, the host pool will look like this:

|Parameter | Value|
|---|---|
|Phase | Off-peak |
|Total session hosts | 6 |
|Load balancing algorithm | Breadth-first |
|Capacity threshold | 75% |
|Minimum percentage of hosts | 19% |
|Available session hosts | 1 |
|Maximum session limit | 5 |
|Available host pool capacity | 5 |
|User sessions | 0 |
|Used host pool capacity | 0% |

The following animation is a visual recap of what we just went over in Scenario 4.

:::image type="content" source="./media/autoscale-exclusion-tags.gif" alt-text="A visual recap of Scenario 4.":::

## Next steps

- To learn how to create scaling plans for autoscale, see [Create autoscale scaling for Azure Virtual Desktop host pools](autoscale-scaling-plan.md).
- To review terms associated with autoscale, see [the autoscale glossary](autoscale-glossary.md).
- For answers to commonly asked questions about autoscale, see [the autoscale FAQ](autoscale-faq.yml).