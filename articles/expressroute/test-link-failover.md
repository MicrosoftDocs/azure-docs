---
title: Test link failover for Azure ExpressRoute
description: Test how your ExpressRoute circuit handles a link failure before planned maintenance or a disaster recovery exercise.
author: duongau
ms.author: duau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 09/28/2026
---

# Resiliency Validation: Test link failover (preview)

Use Link Failover to test how an Azure ExpressRoute circuit responds to a link failure before planned maintenance or a disaster recovery exercise. The test disconnects the Border Gateway Protocol (BGP) session on the primary or secondary link you select to simulate an outage. You can then check whether traffic uses the alternate link and identify routing or connectivity gaps.

Link Failover tests the links within a single ExpressRoute circuit. It doesn't test failover between circuits or peering locations. To test those scenarios, use [Gateway Resiliency Validation](resiliency-validation.md).

## When to use Link Failover

Use Link Failover:

- **Before planned maintenance:** Check whether the circuit continues to carry traffic if maintenance affects one link.
- **During disaster recovery exercises:** Include link failover in your resiliency tests.
- **After routing changes:** Test the circuit again after changing customer edge routing, advertised prefixes, BGP policies, or circuit configuration.
- **When investigating redundancy gaps:** Identify routes that might be affected if a link fails.

## What Link Failover validates

| Validation area | What you can check |
|---|---|
| Route redundancy | Whether routes learned on the selected link are also available through the alternate link. |
| Traffic behavior | Whether traffic moves to the alternate link during the test. |
| Connectivity continuity | Whether workloads remain reachable while the selected link is unavailable. |
| Operational readiness | Whether routing needs correction before maintenance or a disaster recovery exercise. |

## How the test works

When you start the test, Azure disconnects the BGP session on the selected link and withdraws routes learned through that session. Traffic must then use routes available through the alternate link. The test doesn't disable the circuit or its alternate link.

Disconnecting BGP simulates a link outage. Unlike AS-path prepending or traffic draining, which leave the BGP session active and steer traffic away from a link, this test disconnects the session.

> [!NOTE]
> During preview, you can run only one Link Failover test at a time for each circuit.

## Prerequisites

Before you start a Link Failover test:

- Check that critical prefixes are advertised over both the primary and secondary links.
- Check that no planned maintenance or known issue affects the circuit or either link.
- Schedule a test window during which your operations team can monitor application connectivity.
- Notify teams that monitor network alerts. The test might trigger BGP or link-status alerts.
- Prepare to stop the test immediately if business-critical connectivity is affected.

> [!WARNING]
> Routes available only through the selected link might become unreachable during the test. If your workloads depend on those routes, correct the routing before you continue.

## Run a Link Failover test

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, enter **ExpressRoute circuits**, and then select **ExpressRoute circuits**.

1. Select the circuit that you want to test.

1. In the circuit menu, select **Link Failover**.

1. Select the primary or secondary link, and then select **Disconnect BGP** as the test type.

1. Review the route redundancy results:

   - **Redundant routes:** Routes available through both links.
   - **Nonredundant routes:** Routes available only through the link selected for the test.

1. If the results show nonredundant routes, determine whether your workloads require them. Correct the routing before you continue, or acknowledge the potential connectivity impact.

1. Start the test.

1. Monitor the test status and your environment:

   - Check that traffic moves to the alternate link.
   - Check that critical applications remain reachable.
   - Monitor application health, network telemetry, and customer edge devices.
   - Watch for unexpected packet loss, latency, or route withdrawals.

1. After you verify failover, stop the test to restore the BGP session on the selected link.

1. Check that both links return to their normal state and that traffic behaves as expected.

> [!IMPORTANT]
> Stop the test immediately if business-critical connectivity is affected.

## Review test reports

After the test finishes, review the circuit's test history for the selected link, test type, start and end times, route redundancy results, and completion status.

Address any nonredundant routes. Advertise required prefixes over both links, and then review the routes again before your next Link Failover test.

## Limitations

- Link Failover tests customer connectivity but doesn't replace a complete disaster recovery plan.
- You can run only one test at a time for each circuit during preview.
- You might not be able to start or stop a test during a maintenance event that affects the circuit. Wait until the circuit returns to a supported state.

## Frequently asked questions

### Will this test cause downtime?

The effect depends on your routing configuration. If all required routes are redundant and customer edge routing is configured correctly, traffic should continue through the alternate link. Destinations that use nonredundant routes might become unreachable during the test.

### What should I do if nonredundant routes appear?

Check whether production workloads require the listed prefixes. If they do, update your routing so that both ExpressRoute links advertise those prefixes before you start the test.

### Can I use Link Failover for regular resiliency testing?

Yes. Include Link Failover in regular resiliency reviews and disaster recovery exercises. Run the test again after major changes to routing, circuits, or customer edge devices.

## Next step

Learn how to [evaluate the resiliency of multi-site redundant ExpressRoute circuits](evaluate-circuit-resiliency.md).
