---
title: Gain insight into global, regional, and local threats
description: Gain insight into global, regional, and local threats by using the site map in the on-premises management console.
ms.date: 11/09/2021
ms.topic: how-to
---

# Gain insight into global, regional, and local threats

The site map in the on-premises management console helps you achieve full security coverage by dividing your network into geographical and logical segments that reflect your business topology:

- **Geographical facility level**: A site reflects many devices grouped according to a geographical location presented on the map. By default, Microsoft Defender for IoT provides you with a world map. You update the map to reflect your organizational or business structure. For example, use a map that reflects sites across a specific country, city, or industrial campus. When the site color changes on the map, it provides the SOC team with an indication of critical system status in the facility.

  The map is interactive and enables opening each site and delving into this site's information.

- **Global logical layer**: A business unit is a way to divide your enterprise into logical segments according to specific industries. When you do this, your business topology is reflected on the map.

  For example, a global company that contains glass factories, plastic factories, and automobile factories can be managed as three different business units. A physical site located in Toronto includes three different glass production lines, a plastic production line, and a truck engine production line. So, this site has representatives of all three business units.

- **Geographical region level**: Create regions to divide a global enterprise into geographical regions. For example, the company that we described might use the regions North America, Western Europe, and Eastern Europe. North America has factories from all three business units. Western Europe has automobile factories and glass factories, and Eastern Europe has only plastic factories.

- **Local logical segment level**: A zone is a logical segment within a site that defines, for example, a functional area or production line. Working with zones allows enforcement of security policies that are relevant to the zone definition. For example, a site that contains five production lines can be segmented into five zones.

- **Local view level**: A local view of a single sensor installation provides insight into the operational and security status of connected devices.

## Work with site map views

The on-premises management console provides an overall view of your industrial network in a context-related map. The general map view presents the global map of your organization with the geographical location of each site.

:::image type="content" source="media/how-to-work-with-maps/enterprise.png" alt-text="Screenshot of the Enterprise Map view.":::

### Color-coded map views

**Green**: The number of security events is below the threshold that Defender for IoT has defined for your system. No action is needed.

**Yellow**: The number of security events is equal to the threshold that Defender for IoT has defined for your system. Consider investigating the events.  

**Red**: The number of security events is beyond the threshold that Defender for IoT has defined for your system. Take immediate action.

### Risk-level map views

**Risk Assessment**: The Risk Assessment view displays information on site risks. Risk information helps you prioritize mitigation and build a road map to plan security improvements.

**Incident Response**: Get a centralized view of all unacknowledged alerts on each site across the enterprise. You can drill down and manage alerts detected in a specific site.

:::image type="content" source="media/how-to-work-with-maps/incident-responses.png" alt-text="Screenshot of the Enterprise Map view with Incident Response.":::

**Malicious Activity**: If malware was detected, the site appears in red. This indicates that you should take immediate action.

:::image type="content" source="media/how-to-work-with-maps/malicious-activity.png" alt-text="Screenshot of the Enterprise Map view with Malicious Activity.":::

**Operational Alerts**: This map view for OT systems provides a better understanding of which OT system might experience operational incidents, such as PLC stops, firmware upload, and program upload.

:::image type="content" source="media/how-to-work-with-maps/operational-alerts.png" alt-text="Screenshot of the Enterprise Map view with Operational Alerts.":::

To choose a map view:

1. Select **Default View** from the map.
2. Select a view.

:::image type="content" source="media/how-to-work-with-maps/map-views.png" alt-text="Screenshot of the site map default view.":::

## Update the site map image

Defender for IoT provides a default world map. You can change it to reflect your organization: a country map or a city map, for example. 

To replace the map:

1. On the left pane, select **System Settings**.

2. Select the **Change Site Map** and upload the graphic file to replace the default map.

## Next step

[View alerts](how-to-view-alerts.md)
