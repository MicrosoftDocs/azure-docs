---
title: Azure Virtual Desktop autoscale example scenarios preview
description: How to use the autoscale feature to allocate resources in your deployment.
author: Heidilohr
ms.topic: conceptual
ms.date: 03/09/2022
ms.author: helohr
manager: femila
---
# Autoscale example scenarios

In this article, we're going to walk you through what happens during the different phases of a scaling plan based on an example scenario. In each section, we'll have a table that gives a brief overview of the example host pool's settings.

## Scenario 1: when does the autoscale feature turn virtual machines on?

In this scenario, we'll demonstrate that the autoscale feature can turn on virtual machines (VMs) in any phase of the scaling schedule when the used host pool capacity exceeds the capacity threshold.

For example, let's look at the following host pool setup as described in this table:

|Parameter | Value|
|---|---|
|Phase | Ramp-up|
|Capacity threshold | 30%|
|Minimum percentage of session hosts | 30% |
|Load balancing algorithm | Breadth-first |
|Total session hosts | 6 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 10 |
|Active user sessions | 0 |
|Active session hosts| 2 |
|Current used host pool capacity | 0% |

>[!NOTE]
>To learn more about what the parameter terms mean, see [our autoscale glossary](autoscale-glossary.md).

At the beginning of this scenario, the example host pool has turned on six session hosts to match the minimum percentage of hosts. Although 30% of six is not a whole number, the autoscale feature rounds up to the nearest whole number. Having two active session hosts and a maximum session limit of five sessions per host means that this deployment has a host pool capacity of ten. Also, because there aren't currently any active user sessions, the used host pool capacity is 0%.

When the day begins, let's say three users sign in and start user sessions across two session hosts. The host pool capacity is still 10 hosts, but the number of new users has brought the used host pool capacity up to 30%. However, the autoscale feature won't turn on VMs until the used host pool capacity is greater than the capacity threshold. In this example the capacity threshold is 30%, so the VMs won't turn on yet.

At this point, the deployment's parameters look like this:

|Parameter | Value|
|---|---|
|Phase | Ramp-up|
|Capacity threshold | 30%|
|Minimum percentage of session hosts | 30% |
|Load balancing algorithm | Breadth-first |
|Total session hosts | 6 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 10 |
|Active user sessions | 3 |
|Active session hosts| 2 |
|Current used host pool capacity | 30% |

If one more user signs in and starts a session, then there will be four total users sessions across two session hosts. This new user will bring the used host pool capacity up to 40%, which will be enough to go over the capacity threshold. As a result, the autoscale feature will turn on a new session host to bring the used capacity back down to 30%.

In summary, here are the parameters when the deployment exceeds the capacity threshold:

|Parameter | Value|
|---|---|
|Phase | Ramp-up|
|Capacity threshold | 30%|
|Minimum percentage of session hosts | 30% |
|Load balancing algorithm | Breadth-first |
|Total session hosts | 6 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 10 |
|Active user sessions | 4 |
|Active session hosts| 2 |
|Current used host pool capacity | 40% |

Here are the parameters after autoscale turns on a new session host:

|Parameter | Value|
|---|---|
|Phase | Ramp-up|
|Capacity threshold | 30%|
|Minimum percentage of session hosts | 30% |
|Load balancing algorithm | Breadth-first |
|Total session hosts | 6 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 15 |
|Active user sessions | 4 |
|Active session hosts| 3 |
|Current used host pool capacity | 27% |

Turning on the new session host means that, while the maximum session limit is still five, the host pool capacity has gone up to 15. Because the host pool capacity increased, the used host pool capacity has gone back down to 27% percent, which is below the 30% capacity threshold again.

If yet another user signs in, they'll bring the total number of user sessions up to five, spread across three session hosts. This will bring the used host pool capacity back up to 33%, which is over the 30% capacity threshold. Exceeding the capacity threshold activates the autoscale feature, which turns on yet another session host.

Since our example is in the ramp-up phase, new users will keep signing in. As more users arrive, the pattern becomes clearer:

| Total user sessions | Number of session hosts | Host pool capacity |Capacity threshold | Used host pool capacity | Does autoscale turn on new session host? |
|----|---|---|---|---|---|
|5|3|15|30%|33%|Yes|
|5|4|20|30%|25%|No|
|6|4|20|30%|30%|No|
|7|4|20|30%|35%|Yes|
|7|5|25|30%|28%|No|

As this table shows, the autoscale feature only turns on new session hosts when the used host pool capacity goes over the capacity threshold. If the used host pool capacity is at or below the capacity threshold, the autoscale feature won't turn on new session hosts.

## Scenario 2: When does the autoscale feature turn virtual machines off?

In this scenario, we'll show that the autoscale feature turns VMs off when both of the following things are true:

- The used host pool capacity is below the capacity threshold.
- The autoscale feature can turn VMs off without exceeding the capacity threshold.

For this scenario, the deployment starts off looking like this:

|Parameter | Value|
|---|---|
|Phase | Peak|
|Capacity threshold | 30%|
|Minimum percentage of session hosts | 20% |
|Load balancing algorithm | Breadth-first |
|Total session hosts | 5 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 25 |
|Active user sessions | 7 |
|Active session hosts| 5 |
|Current used host pool capacity | 28% |

Because we're in the peak phase, we can expect the number of users to remain relatively stable. However, to keep the amount of resources used stable while also remaining efficient, the autoscale feature will turn session hosts on and off as needed.

So, let's say that there are seven users signed in during peak hours. That would make the total number of user sessions seven, while the used host pool capacity is 28%. The autoscale feature won't turn any VMs off at this point, because the used host pool capacity is below the 30% capacity threshold.

If two users sign out during their lunch break, then there are now five user sessions across five session hosts. The maximum session limit is still five, and the host pool capacity is 10. Having only five users means that the used host pool capacity is now 20%. However, whether the autoscale feature turns off a session host in response to two users signing out depends on whether removing a session host will cause the used host pool percentage to go above the capacity threshold.

If our example host pool has a maximum session limit of five sessions per host pool and a host pool capacity of 20 sessions, then with five users, the used host pool capacity would then be 25%. Because 25% is less than the capacity threshold of 30%, the autoscale feature can turn off any session hosts with no user sessions on them, because turning off the session hosts won't make the used host pool capacity go over 30%.

Once the autoscale feature turns off one of the session hosts without user sessions, there are four session hosts left, each with a maximum session limit of five, making the host pool capacity 20. The used host pool capacity for the five remaining active sessions is 25%, which is still under the capacity threshold.

However, if another user signs out and heads out for lunch, there are now four user sessions spread across the four session hosts in the host pool. If each session host has a maximum session limit of 5, then that makes the host pool capacity 20, and the used host pool capacity 20%. Shutting another session host off would make there be three session hosts with a host pool capacity of 15, which would cause the used host pool capacity to jump up to around 27%. Even though 27% is below the host pool capacity threshold, the breadth-first algorithm spreads the user sessions equally across each session host. Since every session host has at least one user, the autoscale feature won't turn any of the session hosts off.

## Scenario 3: when does the autoscale feature force users to sign out?

The autoscale feature only forces users to sign out if you've enable the **force logoff** setting during the ramp-down phase of your scaling schedule.

For example, let's look at a host pool with the following parameters:

|Parameter | Value|
|---|---|
|Phase | Off-peak|
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Depth-first |
|Total session hosts | 4 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 20 |
|Active user sessions | 4 |
|Active session hosts| 4 |
|Current used host pool capacity | 20% |

At the ramp-down phase, the capacity threshold has been brought all the way up to 75%, and the minimum percentage of session hosts brought down to 10%. These settings will let the autoscale feature shut down session hosts without exceeding the capacity threshold.

For this scenario, let's say that there are currently four users on the four active session hosts in this host pool. Since the host pool capacity is 20, that means the used host pool capacity is 20%. Based on this information, the autoscale features detects that it can turn off two session hosts without going over the capacity threshold of 75%. However, because of the breadth-first algorithm, in order to turn off the session hosts, it will need to force users to sign out.

When you've enabled the force logoff setting, the autoscale feature will select the session hosts with the fewest user sessions, then put the session hosts in drain mode. The autoscale feature then sends users in the selected session hosts notifications that they're going to be forcibly signed out of their sessions after a certain period of time. Once that time has passed, if the users haven't already ended their sessions, the autoscale feature will forcibly end their sessions for them. In this scenario, since this host pool is using breadth-first session balancing and there are equal numbers of user sessions in each host pool, the autoscale feature will choose two session hosts at random.

Once the autoscale feature turns off the two session hosts, the host pool capacity is now 10. Now that there are only two user sessions left, the used host pool capacity is 20%, as shown in the following table.

|Parameter | Value|
|---|---|
|Phase | Off-peak|
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Depth-first |
|Total session hosts | 4 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 10 |
|Active user sessions | 2 |
|Active session hosts| 2 |
|Current used host pool capacity | 20% |

Now, let's say that the two users who were forcibly signed out realize they forgot to do something important and sign back in. Since the host pool capacity for the remaining two session hosts is 10, the used host pool capacity is now 40%, which is below the capacity threshold of 75%. However, the autoscale feature can't turn off additional session hosts, because the remaining session host would have a host pool capacity of five. With four users, that would make its used host pool capacity 80%, which is above the capacity threshold.

So now the parameters look like this:

|Parameter | Value|
|---|---|
|Phase | Off-peak|
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Depth-first |
|Total session hosts | 4 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 10 |
|Active user sessions | 4 |
|Active session hosts| 2 |
|Current used host pool capacity | 40% |

If at this point another user signs out, that leaves only three user sessions on two active session hosts. In other words, the deployment now looks like this:

|Parameter | Value|
|---|---|
|Phase | Off-peak|
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Depth-first |
|Total session hosts | 4 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 10 |
|Active user sessions | 3 |
|Active session hosts| 2 |
|Current used host pool capacity | 30% |

Because the maximum session limit is still five and the host pool capacity is 10, the used host pool capacity is now 30%. The autoscale feature can now turn off one session host without exceeding the capacity threshold, which results in one session host with a maximum session limit and host pool capacity of five. Usually, the autoscale feature chooses the session host with the fewest active user sessions to turn off. The feature puts the chosen session host in drain mode, sends users a notification letting them know the session host will be turned off, then after a set amount of time, forcibly signs any remaining users out and shuts the session host down.

Since autoscale forced two users to sign out when turning off the chosen session host, there are now only two users left, and the remaining host pool has a host pool capacity of five. The used host pool capacity is now 40%.

To recap, here's what the deployment looks like now:

|Parameter | Value|
|---|---|
|Phase | Off-peak|
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Depth-first |
|Total session hosts | 4 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 5 |
|Active user sessions | 2 |
|Active session hosts| 1 |
|Current used host pool capacity | 40% |

After that, let's say one of the users who was signed out signs back in, making the deployment look like this:

|Parameter | Value|
|---|---|
|Phase | Off-peak|
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Depth-first |
|Total session hosts | 4 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Host pool capacity | 5 |
|Active user sessions | 3 |
|Active session hosts| 1 |
|Current used host pool capacity | 60% |

Now there are three user sessions in the host pool. However, the host pool capacity is still five, which means the used host pool capacity is 60% and below the capacity threshold. Because the used host pool capacity hasn't gone below the capacity threshold and turning off the remaining session host would make the minimum percentage of hosts go below the 10% limit, the autoscale feature won't be able to turn off any other session hosts.

## Scenario 4: how do exclusion tags work?

When a session host has a tag name that matches the scaling plan exclusion tag, the autoscale feature won't turn it on, off, or change its drain mode setting. You can use exclusion tags in any phase of a scaling plan schedule.

Here's the example deployment we're starting with:

|Parameter | Value|
|---|---|
|Phase | Off-peak |
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Breadth-first |
|Force logoff setting| Enabled |
|Total session hosts | 6 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Active session hosts | 1 |
|Host pool capacity | 5 |
|Active user sessions | 3 |
|Current used host pool capacity | 60% |

In this example scenario, the host pool admin applies the scaling plan exclusion tag to five out of the six session hosts.

|Parameter | Value|
|---|---|
|Phase | Off-peak |
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Breadth-first |
|Force logoff setting| Enabled |
|Total session hosts | 6 |
|Exclusion tagged session hosts | 5 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Active session hosts | 1 |
|Host pool capacity | 5 |
|Active user sessions | 3 |
|Current used host pool capacity | 60% |

When a new user signs in, that brings the total active user sessions up to four. Only one session host is turned on, and it has a maximum session limit of five, so the host pool capacity is five. The used host pool capacity is 80%. However, even though this amount is over the capacity threshold, the autoscale feature won't be able to turn on any other session hosts, because all of the session hosts except for the one currently running have been tagged with the exclusion tag.

So, now the deployment looks like this:

|Parameter | Value|
|---|---|
|Phase | Off-peak |
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Breadth-first |
|Force logoff setting| Enabled |
|Total session hosts | 6 |
|Exclusion tagged session hosts | 5 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Active session hosts | 1 |
|Host pool capacity | 5 |
|Active user sessions | 4 |
|Current used host pool capacity | 80% |

Next, let's say all four users have signed out, leaving no user sessions left in the active session host. Because there are no active users in the session host, the used host pool capacity is 0%, which is below the minimum percentage of session hosts (10%). However, the autoscale feature will keep this single session host on despite it having no users, because during the off-peak phase, autoscale's default setting is to keep at least one session host active no matter what.

To summarize, the deployment now looks like this:

|Parameter | Value|
|---|---|
|Phase | Off-peak |
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Breadth-first |
|Force logoff setting| Enabled |
|Total session hosts | 6 |
|Exclusion tagged session hosts | 5 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Active session hosts | 1 |
|Host pool capacity | 5 |
|Active user sessions | 0 |
|Current used host pool capacity | 0% |

So, what do we do if we want autoscale to turn that session host off? The answer is simple: tag the active but empty session host with the same exclusion tag as the other session hosts. Adding this take makes autoscale turn this session host off. 

What will happen if the admin removes the exclusion tags from two of the tagged session hosts after this? Because autoscale must keep at least one session host on during the off-peak phase to meet the minimum session host requirement of 10%, it will turn on one of the session hosts. However, because there aren't currently any active users, it will leave the other session host off because there's no need to increase the number of available session hosts or raise the maximum session limit.

So, finally, the deployment will look like this:

|Parameter | Value|
|---|---|
|Phase | Off-peak |
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Breadth-first |
|Force logoff setting| Enabled |
|Total session hosts | 6 |
|Exclusion tagged session hosts | 4 |
|Maximum session hosts | 5 |
|Maximum session limit | 5 |
|Active session hosts | 1 |
|Host pool capacity | 5 |
|Active user sessions | 0 |
|Current used host pool capacity | 0% |
