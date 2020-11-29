---
title: Configure DNS servers for reverse lookup resolution
description: Enhance asset enrichment by configuring multiple DNS servers to carryout reverse lookups.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/19/2020
ms.topic: how-to
ms.service: azure
---

# 

## Configure DNS servers for reverse lookup resolution 

To enhance asset enrichment, you can configure multiple DNS servers to carryout reverse lookups. You can resolve host names or FQDNs associated with the IP addresses detected in network subnets. For example, if a sensor discovers an IP address it may query multiple DNS servers to resolve the hostname.

All CIDR formats are supported.

The hostname appears in the asset inventory and asset map, as well as reports.

You can schedule reverse lookup resolution schedules for specific hourly intervals, for example every 12 hours, or at a specific time.

**To define DNS servers:**

1. Select **System Settings** and then select **DNS Settings.**

2. Select **Add DNS Server**.

    :::image type="content" source="media/how-to-enrich-asset-information/dns-reverse-lookup-configuration-screen.png" alt-text="Add DNS Server":::

3. In the schedule reverse DNS lookup field chose either:

    - intervals (per hour)
    
    - a specific time (use European formatting, 14:30 and not 2:30 PM)

4. In the **DNS Server Address** field, enter the DNS IP address.

5. In the **DNS Server Port** field, enter the DNS port.

6. Resolve the network IP addresses to asset FQDNs. Add the number of domain labels to display in **Number of Labels** field. Up to 30 characters are displayed from left to right.

7. Enter the subnets you want the DNS server to query in the **Subnets** field.

8. Select the **Enable** toggle if you want to initiate the reverse lookup.

### Test the DNS configuration 

Verify the settings you defined work properly using a test asset.

**To test:**

1. Enable the DNS Lookup toggle.

2. Select **Test**.

3. Enter an address in the **Lookup Address** of the DNS reverse lookup test for server dialog box.

    :::image type="content" source="media/how-to-enrich-asset-information/dns-reverse-looup-test-screen.png" alt-text="Lookup Address":::

4. Select **Test.**
