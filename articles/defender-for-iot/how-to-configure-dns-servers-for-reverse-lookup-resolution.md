---
title: Configure DNS servers for reverse lookup resolution
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/19/2020
ms.topic: article
ms.service: azure
---

# 

## Configure DNS servers for reverse lookup resolution 

To enhance asset enrichment in, you can configure multiple DNS servers to carryout reverse lookups. This lets you resolve host names or FQDNs associated with the IPs detected in network subnets. For example, if a sensor discovers an IP it may query multiple DNS servers for to resolve the hostname.

All CIDR formats are supported.

Hostname appears in the Asset Inventory and Asset Map, as well as reports.

You can schedule reverse lookup resolution schedules at specific in hourly intervals, for example every 12 hours, or at a specific time.

**To define DNS servers:**

1. Select **System Settings** and then select **DNS Settings.**

2. Select **Add DNS Server**.

    :::image type="content" source="media/how-to-enrich-asset-information/image302.png" alt-text="Add DNS Server":::

3. In the Schedule Reverse DNS Lookup field chose either:

    - intervals (per hour)
    
    - a specific time (use European formatting, 14:30 and not 2:30 PM)

4. In the **DNS Server Address** field, enter the DNS IP address

5. In the **DNS Server Port** field, enter the DNS port.

6. Resolve network IP addresses to asset FQDNs. Add the number of domain labels to display in **Number of Labels** field. Up to 30 characters are displayed from left to right.

7. Enter the Subnets you want the DNS server to query in the **Subnets** field.

8. Select the **Enable** toggle if you want to initiate the reverse lookup.

### Test the dns configuration 

Verify the settings you defined work properly using a test asset.

**To test:**

1. Enable the DNS Lookup toggle.

2. Select **Test**.

3. Enter an address in the **Lookup Address** of the DNS Reverse Lookup test For Server dialog box.

    :::image type="content" source="media/how-to-enrich-asset-information/image303.png" alt-text="Lookup Address":::

4. Select **Test.**
