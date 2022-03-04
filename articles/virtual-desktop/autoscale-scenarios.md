---
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
|Host pool capacity | 10 |

>[!NOTE]
>To learn more about what the parameter terms mean, see [our autoscale glossary](autoscale-glossary.md).

At the beginning of this scenario, the example host pool has turned on six session hosts to match the minimum percentage of hosts. Although 30% of six is not a whole number, the autoscale feature rounds up to the nearest whole number. Having two active session hosts and a maximum session limit of five sessions per host means that this deployment has a host pool capacity of ten. Also, because there aren't currently any active user sessions, the used host pool capacity is 0%.

When the day begins, let's say three users sign in and start user sessions across two session hosts. The host pool capacity is still 10 hosts, but the number of new users has brought the used host pool capacity up to 30%. However, the autoscale feature won't turn on VMs until the used host pool capacity is greater than the capacity threshold. In this example the capacity threshold is 30%, so the VMs won't turn on yet.

If one more user signs in and starts a session, then there will be four total users sessions across two session hosts. This new user will bring the used host pool capacity up to 40%, which will be enough to go over the capacity threshold. As a result, the autoscale feature will turn on a new session host to bring the used capacity back down to 30%.

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

For this scenario, let's go back to the example deployment we used in Scenario 1. At the peak phase of the scaling schedule, the deployment starts off looking like this:

|Parameter | Value|
|---|---|
|Phase | Peak|
|Capacity threshold | 30%|
|Minimum percentage of session hosts | 20% |
|Load balancing algorithm | Breadth-first |
|Total session hosts | 6 |
|Maximum session hosts | 5 |
| Host pool capacity | 10 |

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
|Phase | Ramp-down |
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Depth-first |
|Total session hosts | 4 |
|Maximum session hosts | 5 |

At the ramp-down phase, the capacity threshold has been brought all the way up to 75%, and the minimum percentage of session hosts brought down to 10%. These settings will let the autoscale feature shut down session hosts without exceeding the capacity threshold.

For this scenario, let's say that there are currently four users on the four active session hosts in this host pool. Since the host pool capacity is 20, that means the used host pool capacity is 20%. Based on this information, the autoscale features detects that it can turn off two session hosts without going over the capacity threshold of 75%. However, because of the breadth-first algorithm, in order to turn off the session hosts, it will need to force users to sign out.

When you've enabled the force logoff setting, the autoscale feature will select the session hosts with the fewest user sessions, then put the session hosts in drain mode. The autoscale feature then sends users in the selected session hosts notifications that they're going to be forcibly signed out of their sessions after a certain period of time. Once that time has passed, if the users haven't already ended their sessions, the autoscale feature will forcibly end their sessions for them. In this scenario, since this host pool is using breadth-first session balancing and there are equal numbers of user sessions in each host pool, the autoscale feature will choose two session hosts at random.

Once the autoscale feature turns off the two session hosts, the host pool capacity is now 10. Now that there are only two user sessions left, the used host pool capacity is 20%.

Now, let's say that the two users who were forcibly signed out realize they forgot to do something important and sign back in. Since the host pool capacity for the remaining two session hosts is 10, the used host pool capacity is now 40%, which is below the capacity threshold of 75%. However, the autoscale feature can't turn off additional session hosts, because the remaining session host would have a host pool capacity of five. With four users, that would make its used host pool capacity 80%, which is above the capacity threshold.

If at this point another user signs out, that leaves only three user sessions on two active session hosts. Because the maximum session limit is still 5 and the host pool capacity is 10, the used host pool capacity is now 30%. The autoscale feature can now turn off one session host without exceeding the capacity threshold, which results in one session host with a maximum session limit and host pool capacity of five. Usually, the autoscale feature chooses the session host with the fewest active user sessions to turn off. The feature puts the chosen session host in drain mode, then after a set amount of time, forcibly signs the users out and shuts the session host down.





1.  Autoscale sees that it can turn 1 session host off without exceeding the
    capacity threshold. If it does, there would be 1 session host on with a max
    session limit of 5, which would result in a host pool capacity of 5. Since
    there are 3 user sessions, the used host pool capacity would be 60% which is
    less than the capacity threshold of 75%. Given this, Autoscale will select
    the session host with the least number of total user sessions (VM-2), put it
    in drain mode, send the notification message and wait the designated delay
    time, force logoff user 2 (if they haven’t logged off themself), and then
    turn off that session host.

2.  Autoscale has now force logged off user 2 and has turned off 1 session host
    (VM-2), so the host pool capacity is now 5. Since user 2 was force logged
    off, there are only 2 user sessions left so the used host pool capacity is
    40%.

3.  User 2 logs back in so there are 3 user sessions in the host pool. Since the
    host pool capacity is still 5, the used host pool capacity is 60%, which is
    below the capacity threshold of 75%. Note that at this point, Autoscale
    cannot turn off another session host because the minimum % of hosts for ramp
    down is 10% which means that there must always be at least 1 session host
    during the ramp down phase.

4.  **How do exclusion tags work?**

Scenario 4; in any phase of the schedule, when a session host has a tag name
that matches the scaling plan exclusion tag, Autoscale will not turn it on, turn
it off, or change its drain mode setting.

|Parameter | Value|
|---|---|
|Phase | Off-peak |
|Capacity threshold | 75%|
|Minimum percentage of session hosts | 10% |
|Load balancing algorithm | Breadth-first |
|Force logoff setting| Enabled |
|Total session hosts | 6 |
|Maximum session hosts | 5 |

In this example, the schedule is currently in the off peak phase of the day, and
for the off peak phase the capacity threshold is 75%, the minimum percentage of
hosts is 10%, the load balancing algorithm is depth first, and force logoff is
enabled. This host pool has a total of 6 session hosts in it and the max session
limit is 5 user sessions per session host.

1.  Picking up from scenario 3, the max session limit is 5 and there is 1
    session host on, so the host pool capacity is 5. There are currently 3 user
    sessions, so the used host pool capacity is 60%.

2.  The host pool admin applies the scaling plan exclusion tag to VM-2, VM-3,
    VM-4, VM-5, and VM-6.

3.  At this point, another user has logged in, and there are now 4 user
    sessions. There is currently 1 session host turned on, and the max session
    limit is still 5, so the host pool capacity is 5. The used host pool
    capacity is now 80%. This used host pool capacity is greater than the
    capacity threshold, but Autoscale cannot turn on any other session hosts
    because they all have the exclusion tag.

4.  At this point, 4 users have logged out so there are now 0 user sessions.
    There is currently 1 session host turned on, and the max session limit is 5,
    so the host pool capacity is 5. The used host pool capacity is now 0%. Note
    that because the minimum % of hosts is 10%, Autoscale will always keep at
    least 1 session host (10%\*6 = 0.6 rounded to the nearest whole number) on
    during the off peak phase.

5.  The host pool admin applies the scaling plan exclusion tag to VM-1 and turns
    it off.

6.  The host pool admin removes the scaling plan exclusion tag from VM-5 and
    VM-6.

7.  Autoscale turns on VM-5 to ensure that at least 1 session host is on to meet
    the minimum percentage of hosts requirement.