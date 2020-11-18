---
title: Activate and set up your on-premises management console 
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/18/2020
ms.topic: article
ms.service: azure
---

#

## Connect sensors to the on-premises management console

To ensure that Sensors to send information to the Central Manager, and that the Central Manager can perform backups, manage alerts and carry out other activity on the Sensors, verify that you:

- **Make Initial Connection between Sensors and the Central Manager**

- **Assign Sensors to Zones**

### Make Initial Connection between Sensors and the Central Manager

Two options are available for connecting CyberX Sensors to the Central Manger.

- **Connect from the Sensor Console**

- **Connect Using Tunneling**

After connecting, you are must set up a siter with these Sensors.

### Connect from the Sensor Console

Connect specific Sensors to the Central Manager from the Sensor Console.

**To connect from the Console:**

1. In the left pane of a Sensor Console, select **System Settings**.

2. Select **Connection to Management**.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image14.png" alt-text="Screenshot of Central Manager Connection Status Window showing Unconnected":::

3. In the **Address** text box, enter the IP address of the Central Manager to which you want to connect.

4. Select **Connect**. The status changes:

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image15.png" alt-text="Screenshot of Central Manager Connection Status Window showing Connected":::

## Connect sensors using tunneling

Enable a secured tunneling connection between organizational Sensors and the Central Manager. This setup circumvents interaction with the organizational firewall, and as a result reduces the attack surface.

Using tunneling allows you to connect to the Central Manager from its IP Address and a single port (ie: 9000) to any Sensor.

**To set up tunneling at the Central Manager:**

1. Log in to the Central Manager and run the following commands:

```bash
cyberx-management-tunnel-enable
service apache2 reload
sudo cyberx-management-tunnel-add-xsense --xsenseuid <sensorIPAddress> --xsenseport 9000
service apache2 reload
```

**To set up tunneling on the Sensor:**

1. Open TCP port 9000 on the Sensor (network.properties) manually. If the port is not open, the Sensor will reject the connection from the Central Manager.

2. Log in to each Sensor and run the following commands:

```bash
sudo cyberx-xsense-management-connect -ip <centralmanagerIPAddress>
sudo cyberx-xsense-management-tunnel
sudo vi /var/cyberx/properties/network.properties
opened_tcp_incoming_ports=22,80,443,102,9000
sudo cyberx-xsense-network-validation
sudo /etc/network/if-up.d/iptables-recover
sudo iptables -nvL
```

## Set up a site

The default Enterprise Map provides an overall view of your assets according to several levels of geographical locations.

This may be required where the organizational structure and user permissions are complex. In these cases, site setup may be determined by a global organizational structure, in addition to the standard site/zone structure.

To support this environment, you create a global business topology that is based on your organization's business units, regions, sites, and zones, and define user access permissions around these entities using Access Groups.

This enables better control over where users manage and analyze assets in the CyberX platform.

### How it Works

For each site, you can define a business unit, a region and then add zones, which are logical entities in your network. For each zone you should assignat least one Sensor. The 5-level model provides the flexibility and granularity required to deliver the protection system that reflects the structure of your organization.

You can edit your sites directly from any of the map views. When opening a site from a map view, the number of open alerts is shown next to each zone.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image16.png" alt-text="Screeshot of Central Manager Map with Berlin Data Overlay":::

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image17.png" alt-text="Diagram showing Sensors and Regional Relationship":::

**To set up a site:**

1. Add new business units to reflect your organization's logical structure.

2. Add new regions to reflect your organization regions.

3. Add a site.

4. Add zones to a site.

5. Connect Sensors.

6. Assign Sensor to site zones.

**To add business units:**

1. From the Enterprise View window, select **All Sites** > **Manage Business Units**.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image18.png" alt-text="Screenshot showing Manage Business Units view":::

2. Type the new business unit name and select **ADD**.

**To add a new region:**

1. From the Enterprise View window, select **All Regions** > **Manage Regions**.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image19.png" alt-text="Screenshot showing Manage Regions view":::

2. Type the new region name and select **ADD**.

**To add a new site:**

1. From the Enterprise View window, select :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image20.png" alt-text="Icon of New Site Button"::: in the top bar. Your cursor appears as **+**.

2. Position the **+** at the location of the new site and click on it. The Create New Site dialog box opens.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image21.png" alt-text="Screenshot of Create New Site view":::

3. Define the name and the physical address for the new site and select **SAVE**. The new site appears on the Site Map.

**To delete a site:**

1. In the **Site Management** window, select :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image22.png" alt-text="Icon to Expand view"::: from the bar that contains the site name and select **Delete Site**. The confirmation box appears, verifying if you want to delete the site.

2. In the confirmation box, select **YES**. The confirmation box closes, and the **Site Management** window appears without the site that you have deleted.

## Create enterprise zones

Zones are logical entities that enable you to divide assets within a site to groups according to various characteristics, for example as production lines, sub-stations, site areas, or types of assets. You can define zones based on any characteristic suitable for your organization.

Zones are configured as a part of the site configuration process.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image23.png" alt-text="Screenshot of Site Management Zones view":::

The following table describes the Site Management window parameters.

| Parameter | Description |
|--|--|
| Name | The Sensor name. You can change this name only from the Sensor, for more information, refer to the CyberX User Guide |
| IP | The Sensor IP |
| Version | The Sensor version |
| Connectivity | The Sensor connectivity status. The status can be Connected or Disconnected. |
| Last Upgrade | The date of the last upgrade. |
| Upgrade Progress | During the upgrade process the progress bar shows the status of the upgrade process, as follows:<br />:::image type="content" source="http://help.cyberx-labs.com/" alt-text="Icon of Upgraded Libraries](media/how-to-activate-and-set-up-your-on-premises-management-console/image24.png)<br />The following statuses appear during the process:<br />- Uploading Package<br />- Preparing To Install<br />- Stopping Processes<br />- Backing Up Data<br />- Taking Snapshot<br />- Updating Configuration<br />- Updating Dependencies<br />- Updating Libraries<br />- Patching Databases<br />- Starting Processes<br />- Validating System Sanity<br />- Validation Succeeded<br />- Success<br />- Failure<br />- Upgrade Started<br />- Starting Installation<br /></br >For details about upgrading, refer to the *CyberX Upgrade Guide* on the CyberX Help Center: [help.cyberx-labs.com"::: |
| Assets | The number of OT assets monitored by the Sensor. |
| Alerts | The number of alerts on the Sensor. |
| :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image25.png" alt-text="Icon for Assign"::: | Enables assigning a Sensor to zones. |
| :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image26.png" alt-text="Icon for Delete"::: | Enables deleting a disconnected Sensor from the site. |
| :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image27.png" alt-text="Icon for Sensor"::: | Indicates how many Sensors are currently connected to the zone. |
| :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image28.png" alt-text="Icon for OT Assets"::: | Indicates how many OT assets are currently connected to the zone. |
| :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image29.png" alt-text="Icon for Number of Alerts"::: | Indicates the number of alerts sent by Sensors assigned to the zone. |
| :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image30.png" alt-text="Icon for Sensor Zones"::: | Enables unassigning Sensors from zones. |

**To add a zone to a site:**

1.  In the **Site Management** window, select :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image22.png" alt-text="Icon to Expand view"::: from the bar that contains the site name and select **Add Zone**. The **Create New Zone** dialog box appears.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image31.png" alt-text="Screeshot of Create New Zone view":::

2. Type the zone name.

3. Type the description for the new zone that states clearly the characteristics according to which the site was divided into zones.

4. Select **SAVE**. The new zone appears in the **Site Management** window under the site to which this zone belongs to.

**To edit a zone:**

1. In the **Site Management** window, select :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image22.png" alt-text="Icon to Expand view"::: from the bar that contains the zone name and select **Edit Zone**. The **Edit Zone** dialog box appears.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image32.png" alt-text="Screeshot of Zone Edit view":::

2. Edit the zone parameters and select **SAVE**.

**To delete a zone:**

1. In the **Site Management** window, select :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image22.png" alt-text="Icon to Expand view"::: from the bar that contains the zone name and select **Delete Zone**.

2. In the confirmation box, select **YES**.

**To filter according to the connectivity status:**

- From the top left corner, select :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image33.png" alt-text="Icon of Carat pointing down"::: next to **Connectivity** and select one of the following options:

  - **All**: Presents all the Sensors that report to this Central Manager.

  - **Connected**: Presents only connected Sensors.

  - **Disconnected**: Presents only disconnected Sensors.

To filter according to the upgrade status:

- From the top left corner, select :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image33.png" alt-text="Icon of Carat pointing down"::: next to **Upgrade Status** and select one of the following options:

  - **All**: Presents all the Sensors that report to this Central Manager.

  - **Valid**: Presents Sensors with a valid upgrade status.

  - **In Progress**: Presents Sensors that are in the process of upgrade.

  - **Failed**: Presents Sensors whose upgrade process has failed.

## Assign sensors to zones

For each zone, you need to assign Sensors that perform local traffic analysis and alerting. You can only assign the Sensors that are connected to the Central Manager.

**To assign a Sensor:**

1. Select **Site Management**. The Unassigned Sensors appears in the upper left corner of the dialog box.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image34.png" alt-text="Screenshot of Unassigned Sensors view":::

2. Verify that the **Connectivity** status is *Connected.* If not, see ***Make Initial Connection between Sensors and the Central Manager*** for details about connecting.

3. Select :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image25.png" alt-text="Icon for Assign button"::: for the Sensor that you want to assign. The Assign Sensor dialog box opens.

4. In the **Assign Sensor** dialog box, select the business unit, region, site, and the zone to assign.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image35.png" alt-text="Screenshot of Assign Sensor view":::

5. Select **ASSIGN**.

**To unassign and delete a Sensor:**

1. Disconnect the Sensor from the Central Manager. See ***Make Initial Connection between Sensors and the Central Manager*** for details.

2. In the **Site Management** window, select the Sensor and select:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image30.png" alt-text="Icon for Trash button":::. The Sensor appears in the **Unassigned** Sensors list. This unassigned Sensor may appear on the list after a few moments.

3. To delete the unassigned Sensor from the site, select the Sensor from the **Unassigned Sensors** list and select :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/image26.png" alt-text="Icon for Delete button":::.