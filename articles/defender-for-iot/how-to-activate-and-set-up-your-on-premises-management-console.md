---
title: Activate and set up your on-premises management console 
description: Management console activation and set up ensures that sensors are registered with Azure and send information to the on-premises management console, and that the on-premises management console  carries out management tasks on connected sensors.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/30/2020
ms.topic: how-to
ms.service: azure
---

# Activate and set up your on-premises management console 

Activation and set up enures that:

- Network devices you are monitoring through connected sensors are registered with an Azure account.

- Sensors send information to the on-premises management console, and that the on-premises management console  carries out management tasks on connected sensors.

## Activate the on-premises management console

Verify that you have the username and password required for the on-premises management console.

**To log in:**

1. Open a web browser and enter the on-premises management console IP address you received during the system installation.

1. Enter the username and password you received by your administrator and select LOGIN.

After login, the on-premises management console opens in the Enterprise View.  
## Upload the activation file

After login, the on-premises management console should be activated by downloading an activation file from the Azure Portal, Pricing page.

This file contains the aggregate committed devices defined during the onboarding process.  This includes sensors associated with multiple subscriptions. After initial activation, the number of monitored devices may exceed  the number of committed devices defined during onboarding. This may happen for example if you connect more sensors to the management console. If there is a discrepancy between the number of monitored devices and number of committed devices, a warning appears in the management console. If this happens you should upload a new activation file.

To acquire and upload an activation file:

1. Go to the Azure portal Pricing page.
1. Select the on-premises management console tab.
1. Download the activation file for the management console and save it.
1. Select System Settings from the management console.
1. Select Activation.
1. Select Choose a File and select the file you saved.


## Connect sensors to the on-premises management console

To ensure that sensors send information to the on-premises management console, and that the on-premises management console can perform backups, manage alerts and carry out other activity on the sensors, verify that you:

- **Make initial connection between sensors and the on-premises management console**

- **Assign sensors to zones**

### Make initial connection between sensors and the on-premises management console

Two options are available for connecting Defender for IoT sensors to the on-premises management console.

- **Connect from the sensor console**

- **Connect using tunneling**

After connecting, you must set up a site with these sensors.

### Connect from the sensor console

Connect specific sensors to the on-premises management console from the sensor console.

**To connect from the console:**

1. In the left pane of a sensor console, select **System Settings**.

2. Select **Connection to Management**.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/connection-status-window-not-connected.png" alt-text="Screenshot of on-premises management console connection status window showing unconnected":::

3. In the **Address** text box, enter the IP address of the on-premises management console to which you want to connect.

4. Select **Connect**. The status changes:

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/connection-status-window-connected.png" alt-text="Screenshot of on-premises management console connection Status Window showing Connected":::

## Connect sensors using tunneling

Enable a secured tunneling connection between organizational sensors and the on-premises management console. This setup circumvents interaction with the organizational firewall, and as a result reduces the attack surface.

Using tunneling allows you to connect to the on-premises management console from its IP Address and a single port (that is: 9000) to any sensor.

**To set up tunneling at the on-premises management console:**

1. Sign in to the on-premises management console and run the following commands:

```bash
cyberx-management-tunnel-enable
service apache2 reload
sudo cyberx-management-tunnel-add-xsense --xsenseuid <sensorIPAddress> --xsenseport 9000
service apache2 reload
```

**To set up tunneling on the sensor:**

1. Open TCP port 9000 on the sensor (network.properties) manually. If the port is not open, the sensor will reject the connection from the on-premises management console.

2. Sign in to each sensor and run the following commands:

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

The default enterprise map provides an overall view of your assets according to several levels of geographical locations.

The view of your assets may be required where the organizational structure and user permissions are complex. In these cases, site setup may be determined by a global organizational structure, in addition to the standard site or zone structure.

To support this environment, you need to create a global business topology that is based on your organization's business units, regions, sites, and zones, and define user access permissions around these entities using access groups.

Access groups enables better control over where users manage and analyze assets in the Defender for IoT platform.

### How it works

For each site, you can define a business unit, a region and then add zones, which are logical entities in your network. For each zone, you should assign at least one sensor. The five level model provides the flexibility and granularity required to deliver the protection system that reflects the structure of your organization.

You can edit your sites directly from any of the map views. When opening a site from a map view, the number of open alerts is shown next to each zone.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/console-map-with-berlin-data-overlay.png" alt-text="Screenshot of on-premises management console map with Berlin data overlay":::

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/diagram-of-sensor-showing-relationships.png" alt-text="Diagram showing sensors and regional relationship":::

**To set up a site:**

1. Add new business units to reflect your organization's logical structure.

2. Add new regions to reflect your organization regions.

3. Add a site.

4. Add zones to a site.

5. Connect the sensors.

6. Assign sensor to site zones.

**To add business units:**

1. From the enterprise view window, select **All Sites** > **Manage Business Units**.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/manage-business-unit-screen.png" alt-text="Screenshot showing manage business units view":::

2. Type the new business unit name and select **ADD**.

**To add a new region:**

1. From the enterprise view window, select **All Regions** > **Manage Regions**.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/manage-regions-screen.png" alt-text="Screenshot showing manage regions view":::

2. Type the new region name and select **ADD**.

**To add a new site:**

1. From the enterprise view window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/new-site-icon.png" border="false"::: in the top bar. Your cursor appears as a **+**.

2. Position the **+** at the location of the new site and left click on it. The create new site dialog box opens.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/create-new-site-screen.png" alt-text="Screenshot of create new site view":::

3. Define the name and the physical address for the new site and select **SAVE**. The new site appears on the site map.

**To delete a site:**

1. In the site management window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: from the bar that contains the site name and select **Delete Site**. The confirmation box appears, verifying if you want to delete the site.

2. In the confirmation box, select **YES**. The confirmation box closes, and the site management window appears without the site that you have deleted.

## Create enterprise zones

Zones are logical entities that enable you to divide assets within a site to groups according to various characteristics. For example, as production lines, substations, site areas, or types of assets. You can define zones based on any characteristic suitable for your organization.

Zones are configured as a part of the site configuration process.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/site-management-zones-screen.png" alt-text="Screenshot of site management zones view":::

The following table describes the site management window parameters.

| Parameter | Description |
|--|--|
| Name | The name of the sensor. You can change this name only from the sensor. For more information, see the Defender for IoT user guide |
| IP | The sensor IP address. |
| Version | The sensor version. |
| Connectivity | The sensor connectivity status. The status can be connected or disconnected. |
| Last Upgrade | The date of the last upgrade. |
| Upgrade Progress | During the upgrade process the progress bar shows the status of the upgrade process, as follows:<br />The following statuses appear during the process:<br />- Uploading package<br />- Preparing To install<br />- Stopping processes<br />- Backing up data<br />- Taking snapshot<br />- Updating configuration<br />- Updating dependencies<br />- Updating libraries<br />- Patching databases<br />- Starting processes<br />- Validating system sanity<br />- Validation succeeded<br />- Success<br />- Failure<br />- Upgrade started<br />- Starting installation<br /></br >For details about upgrading, refer to the Defender for IoT upgrade guide on the Defender for IoT help center: help.cyberx-labs.com |
| Assets | The number of OT assets monitored by the sensor. |
| Alerts | The number of alerts on the sensor. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/assign-icon.png" border="false"::: | Enables assigning a sensor to zones. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/delete-icon.png" border="false":::| Enables deleting a disconnected sensor from the site. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/sensor-icon.png" border="false"::: | Indicates how many sensors are currently connected to the zone. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/ot-assets-icon.png" border="false"::: | Indicates how many OT assets are currently connected to the zone. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/number-of-alerts-icon.png" border="false"::: | Indicates the number of alerts sent by sensors assigned to the zone. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/unassign-sensor-icon.png" border="false"::: | Unassign sensors from zones. |

**To add a zone to a site:**

1. In the Site Management window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: from the bar that contains the site name and select **Add Zone**. The **Create New Zone** dialog box appears.

    :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/create-new-zone-screen.png" alt-text="Screeshot of create new zone view":::

2. Type the zone name.

3. Type the description for the new zone that states clearly the characteristics according to which the site was divided into zones.

4. Select **SAVE**. The new zone appears in the site management window under the site to which this zone belongs to.

**To edit a zone:**

1. In the site management window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: from the bar that contains the zone name and select **Edit Zone**. The **Edit Zone** dialog box appears.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/zone-edit-screen.png" alt-text="Edit a zone window":::

2. Edit the zone parameters and select **SAVE**.

**To delete a zone:**

1. In the site management window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: from the bar that contains the zone name and select **Delete Zone**.

2. In the confirmation box, select **YES**.

**To filter according to the connectivity status:**

- From the top-left corner, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/down-pointing-icon.png" border="false"::: next to **Connectivity** and select one of the following options:

  - **All**: Presents all the sensors that report to this on-premises management console.

  - **Connected**: Presents only connected sensors.

  - **Disconnected**: Presents only disconnected sensors.

To filter according to the upgrade status:

- From the top-left corner, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/down-pointing-icon.png" border="false"::: next to **Upgrade Status** and select one of the following options:

  - **All**: Presents all the sensors that report to this on-premises management console.

  - **Valid**: Presents sensors with a valid upgrade status.

  - **In Progress**: Presents sensors that are in the process of upgrade.

  - **Failed**: Presents sensors whose upgrade process has failed.

## Assign sensors to zones

For each zone, you need to assign sensors that perform local traffic analysis and alerting. You can only assign the sensors that are connected to the on-premises management console.

**To assign a sensor:**

1. Select **Site Management**. The unassigned sensors appear in the upper left corner of the dialog box.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/unassigned-sensors-view.png" alt-text="Screenshot of Unassigned sensors view":::

2. Verify that the **Connectivity** status is connected. If not, see [Make initial connection between sensors and the on-premises management console](#make-initial-connection-between-sensors-and-the-on-premises-management-console) for details about connecting. 

3. Select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/assign-icon.png" border="false"::: for the sensor that you want to assign. The assign sensor dialog box opens.

4. In the **Assign sensor** dialog box, select the business unit, region, site, and the zone to assign.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/assign-sensor-screen.png" alt-text="Screenshot of Assign sensor view":::

5. Select **ASSIGN**.

**To unassign and delete a sensor:**

1. Disconnect the sensor from the on-premises management console. See  [Make initial connection between sensors and the on-premises management console](#make-initial-connection-between-sensors-and-the-on-premises-management-console) for details.

2. In the site management window, select the sensor and select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/unassign-sensor-icon.png" border="false":::. The sensor appears in the unassigned sensors list. This unassigned sensor may appear on the list after a few moments.

3. To delete the unassigned sensor from the site, select the sensor from the unassigned sensors list and select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/delete-icon.png" border="false":::.

### See also
[About the on-premises management console](concept-air-gapped-networks.md)