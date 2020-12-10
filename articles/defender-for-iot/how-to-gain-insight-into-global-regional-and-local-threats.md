---
title: Gain insight into global, regional, and local threats
description: Gain insight into global, regional, and local threats using the on-premises management console site map.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/07/2020
ms.topic: how-to
ms.service: azure
---

# Gain insight into global, regional, and local threats

The on-premises management console site map helps you achieve full security coverage by dividing your network into geographical and logical segments that reflect your business topology.

- **Geographical facility level:** A site reflects a number of devices grouped according to a geographical location presented on the map. By default, Defender for IoT provides you with a world map. You update the map to reflect your organizational or business structure. For example, use a map that reflects sites across a specific country, city or industrial campus. When the site color changes on the map, it provides the SOC team with an indication of critical system status in the facility.

  The map is interactive and enables opening each site and delve into this site's info.

- **Global logical layer:** A business unit is a way to divide your enterprise into logical segments according to specific industries. When you do this, your business topology is reflected on the map.

  For example, a global company that contains glass factories, plastic factories, and automobile factories can be managed as three different business units. A physical site located in Toronto includes three different glass production lines, a plastic production line, and a truck engine production line. So, this site has representatives of all three business units.

- **Geographical region level:** Create regions to divide a global enterprise into geographical regions. For example, North America, Western Europe, Eastern Europe. North America has factories from all three Business Units; Western Europe has automobile factories and glass factories, and Eastern Europe only plastic factories.

- **Local logical segment level:** A zone is a logical segment within a site, defined, for example,  into functional areas or production lines. Working with zones allows enforcement of security policies relevant to the zone definition. For example, a site that contains five production lines  can be defined into five zones.

- **Local view level:** A single sensor installation that provides insight into the operational and security status of connected devices.

## Work with site map views

The on-premises management console provides an overall view of your industrial network in a context-related map. The general map view presents the global map of your organization with geographical location of each site.

:::image type="content" source="media/how-to-work-with-maps/enterprise.png" alt-text="Screenshot of Enterprise Map View":::

### Color-coded map views

 **Green**: The number of security events detected is below the threshold defined by Defender for IoT for your system. No action needed.

**Yellow**: The number of security events detected is equal to the threshold defined by Defender for IoT for your system. Consider investigating the events.  

**Red**: The number of security events is beyond the threshold defined by Defender for IoT for your system. It is recommended that you take immediate action.

### Risk level map views

 **Risk Management view:** The Risk Assessment view displays information on site risks. Use risk information to help you prioritize mitigation
and build a road map to plan security improvements.

**Incident Response view:** A centralized view of all unacknowledged alerts on each site across the enterprise. You can drill down and manage alerts detected in a specific site.

:::image type="content" source="media/how-to-work-with-maps/incident-responses.png" alt-text="Screenshot of Enterprise Map View with Incident Response":::

**Malicious Activity**: If malware was detected, the site appears in red. This indicates you should take immediate action.

:::image type="content" source="media/how-to-work-with-maps/malicious-activity.png" alt-text="Screenshot of Enterprise Map View with Malicious Activity":::

**Operational Alerts:** OT system operational alerts map view provides a better understanding of which OT system might experience operational incidents, such as PLC stops, firmware upload, program upload and so on.

:::image type="content" source="media/how-to-work-with-maps/operational-alerts.png" alt-text="Screenshot of Enterprise Map View with Operational Alerts":::

To choose a map view:

1. Select **Default View** from the map.
2. Select a view.

:::image type="content" source="media/how-to-work-with-maps/map-views.png" alt-text="Screenshot of Site Map Default View":::

## Update the site map image

A default world map is provided. You can change it to reflect your organization: a country map or a city map for example. 

To replace the map:

1. In the left pane, select **System Settings**.

2. Select the **Change Site Map** and upload the graphic file to replace the default map.

## Next step

[View alerts](how-to-view-alerts.md)
