---
title: Activate and set up your on-premises management console 
description: Activating the management console ensures that sensors are registered with Azure and send information to the on-premises management console, and that the on-premises management console carries out management tasks on connected sensors.
ms.date: 3/18/2021
ms.topic: how-to
---

# Activate and set up your on-premises management console 

Activation and setup of the on-premises management console ensures that:

- Network devices that you're monitoring through connected sensors are registered with an Azure account.

- Sensors send information to the on-premises management console.

- The on-premises management console carries out management tasks on connected sensors.

- You have installed an SSL certificate.

## Sign in for the first time

To sign in to the management console:

1. Navigate to the IP address you received for the on-premises management console during the system installation.
 
1. Enter the username and password you received for the on-premises management console during the system installation. 


If you forgot your password, select the **Recover Password**  option, and see [Password recovery](how-to-manage-the-on-premises-management-console.md#password-recovery) for instructions on how to recover your password.

## Get and upload an activation file

After you sign in for the first time, you will need to activate the on-premises management console by getting, and uploading an activation file. 

To get an activation file:

1. Navigate to the **Pricing** page of the Azure Defender for IoT portal. 
1. Select the subscription to associate the on-premises management console to.
1. Select the **Download the activation file for the management console** tab. The activation file is downloaded.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/cloud_download_opm_activation_file.png" alt-text="Download the activation file.":::

To upload an activation file:

1. Navigate to the **System Settings** page on the on-premises management console.
1. Select the **Activation** icon :::image type="icon" source="media/how-to-manage-sensors-from-the-on-premises-management-console/activation-icon.png" border="false":::.
1. Select **Choose a File**, and select the file that downloaded.

After initial activation, the number of monitored devices can exceed the number of committed devices defined during onboarding. This occurs if you connect more sensors to the management console. If there's a discrepancy between the number of monitored devices, and the number of committed devices, a warning will appear on the management console. If this happens, upload a new activation file.

## Set up a certificate

Following installation of the management console, a local self-signed certificate is generated and used to access the console. After an administrator signs in to the management console for the first time, that user is prompted to onboard an SSL/TLS certificate. 

Two levels of security are available:

- Meet specific certificate and encryption requirements requested by your organization by uploading the CA-signed certificate.
- Allow validation between the management console and connected sensors. Validation is evaluated against a certificate revocation list and the certificate expiration date. *If validation fails, communication between the management console and the sensor is halted and a validation error is presented in the console.* This option is enabled by default after installation.  

The console supports the following types of certificates:

- Private and Enterprise Key Infrastructure (private PKI)

- Public Key Infrastructure (public PKI)

- Locally generated on the appliance (locally self-signed) 

  > [!IMPORTANT]
  > We recommend that you don't use a self-signed certificate. The certificate is not secure and should be used for test environments only. The owner of the certificate can't be validated, and the security of your system can't be maintained. Never use this option for production networks.

To upload a certificate:

1. When you're prompted after sign-in, define a certificate name.
1. Upload the CRT and key files.
1. Enter a passphrase and upload a PEM file if necessary.

You might need to refresh your screen after you upload the CA-signed certificate.

To disable validation between the management console and connected sensors:

1. Select **Next**.
1. Turn off the **Enable system-wide validation** toggle.

For information about uploading a new certificate, supported certificate files, and related items, see [Manage the on-premises management console](how-to-manage-the-on-premises-management-console.md).

## Connect sensors to the on-premises management console

You must ensure that sensors send information to the on-premises management console, and that the on-premises management console can perform backups, manage alerts, and carry out other activity on the sensors. To do that, use the following procedures to verify that you make an initial connection between sensors and the on-premises management console.

Two options are available for connecting Azure Defender for IoT sensors to the on-premises management console:

- Connect from the sensor console

- Connect by using tunneling

After connecting, you must set up a site with these sensors.

### Connect sensors from the sensor console

To connect specific sensors to the on-premises management console from the sensor console:

1. On the left pane of the sensor console, select **System Settings**.

2. Select **Connection to Management**.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/connection-status-window-not-connected.png" alt-text="Screenshot of the status window of an on-premises management console, showing Unconnected.":::

3. In the **Address** text box, enter the IP address of the on-premises management console to which you want to connect.

4. Select **Connect**. The status changes:

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/connection-status-window-connected.png" alt-text="Screenshot of the status window of an on-premises management console, showing Connected.":::

### Connect sensors by using tunneling

Enable a secured tunneling connection between organizational sensors and the on-premises management console. This setup circumvents interaction with the organizational firewall, and as a result reduces the attack surface.

Using tunneling allows you to connect to the on-premises management console from its IP address and a single port (that is, 9000) to any sensor.

To set up tunneling at the on-premises management console:

- Sign in to the on-premises management console and run the following commands:

  ```bash
  cyberx-management-tunnel-enable
  service apache2 reload
  sudo cyberx-management-tunnel-add-xsense --xsenseuid <sensorIPAddress> --xsenseport 9000
  service apache2 reload
  ```

To set up tunneling on the sensor:

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

The default enterprise map provides an overall view of your devices according to several levels of geographical locations.

The view of your devices might be required where the organizational structure and user permissions are complex. In these cases, site setup might be determined by a global organizational structure, in addition to the standard site or zone structure.

To support this environment, you need to create a global business topology that's based on your organization's business units, regions, sites, and zones. You also need to define user access permissions around these entities by using access groups.

Access groups enable better control over where users manage and analyze devices in the Defender for IoT platform.

### How it works

For each site, you can define a business unit and a region. Then you can add zones, which are logical entities in your network. 

For each zone, you should assign at least one sensor. The five-level model provides the flexibility and granularity required to deliver the protection system that reflects the structure of your organization.

You can edit your sites directly from any of the map views. When you're opening a site from a map view, the number of open alerts appears next to each zone.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/console-map-with-data-overlay-v2.png" alt-text="Screenshot of an on-premises management console map with Berlin data overlay.":::

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/diagram-of-sensor-showing-relationships.png" alt-text="Diagram showing sensors and regional relationship.":::

To set up a site:

1. Add new business units to reflect your organization's logical structure.

2. Add new regions to reflect your organization's regions.

3. Add a site.

4. Add zones to a site.

5. Connect the sensors.

6. Assign sensor to site zones.

To add business units:

1. From the Enterprise view, select **All Sites** > **Manage Business Units**.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/manage-business-unit-screen.png" alt-text="Screenshot showing the Manage Business Units view.":::

2. Enter the new business unit name and select **ADD**.

To add a new region:

1. From the Enterprise view, select **All Regions** > **Manage Regions**.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/manage-regions-screen.png" alt-text="Screenshot showing the Manage Regions view.":::

2. Enter the new region name and select **ADD**.

To add a new site:

1. From the Enterprise view, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/new-site-icon.png" border="false"::: on the top bar. Your cursor appears as a plus sign (**+**).

2. Position the **+** at the location of the new site and select it. The **Create New Site** dialog box opens.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/create-new-site-screen.png" alt-text="Screenshot of the Create New Site view.":::

3. Define the name and the physical address for the new site and select **SAVE**. The new site appears on the site map.

To delete a site:

1. In the **Site Management** window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: from the bar that contains the site name, and then select **Delete Site**. The confirmation box appears, verifying that you want to delete the site.

2. In the confirmation box, select **YES**. The confirmation box closes, and the **Site Management** window appears without the site that you've deleted.

## Create enterprise zones

Zones are logical entities that enable you to divide devices within a site into groups according to various characteristics. For example, you can create groups for production lines, substations, site areas, or types of devices. You can define zones based on any characteristic that's suitable for your organization.

You configure zones as a part of the site configuration process.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/site-management-zones-screen-v2.png" alt-text="Screenshot of the Site Management Zones view.":::

The following table describes the parameters in the **Site Management** window.

| Parameter | Description |
|--|--|
| Name | The name of the sensor. You can change this name only from the sensor. For more information, see the Defender for IoT user guide. |
| IP | The sensor IP address. |
| Version | The sensor version. |
| Connectivity | The sensor connectivity status. The status can be **Connected** or **Disconnected**. |
| Last Upgrade | The date of the last upgrade. |
| Upgrade Progress | The progress bar shows the status of the upgrade process, as follows:<br />- Uploading package<br />- Preparing to install<br />- Stopping processes<br />- Backing up data<br />- Taking snapshot<br />- Updating configuration<br />- Updating dependencies<br />- Updating libraries<br />- Patching databases<br />- Starting processes<br />- Validating system sanity<br />- Validation succeeded<br />- Success<br />- Failure<br />- Upgrade started<br />- Starting installation<br /></br >For details about upgrading, refer to [Microsoft Support](https://support.microsoft.com/) for help. |
| Devices | The number of OT devices that the sensor monitors. |
| Alerts | The number of alerts on the sensor. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/assign-icon.png" border="false"::: | Enables assigning a sensor to zones. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/delete-icon.png" border="false":::| Enables deleting a disconnected sensor from the site. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/sensor-icon.png" border="false"::: | Indicates how many sensors are currently connected to the zone. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/ot-assets-icon.png" border="false"::: | Indicates how many OT assets are currently connected to the zone. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/number-of-alerts-icon.png" border="false"::: | Indicates the number of alerts sent by sensors that are assigned to the zone. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/unassign-sensor-icon.png" border="false"::: | Unassigns sensors from zones. |

To add a zone to a site:

1. In the **Site Management** window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: from the bar that contains the site name, and then select **Add Zone**. The **Create New Zone** dialog box appears.

    :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/create-new-zone-screen.png" alt-text="Screenshot of the Create New Zone view.":::

2. Enter the zone name.

3. Enter a description for the new zone that clearly states the characteristics that you used to divide the site into zones.

4. Select **SAVE**. The new zone appears in the **Site Management** window under the site that this zone belongs to.

To edit a zone:

1. In the **Site Management** window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: from the bar that contains the zone name, and then select **Edit Zone**. The **Edit Zone** dialog box appears.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/zone-edit-screen.png" alt-text="Screenshot that shows the Edit Zone dialog box.":::

2. Edit the zone parameters and select **SAVE**.

To delete a zone:

1. In the **Site Management** window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: from the bar that contains the zone name, and then select **Delete Zone**.

2. In the confirmation box, select **YES**.

To filter according to the connectivity status:

- From the upper-left corner, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/down-pointing-icon.png" border="false"::: next to **Connectivity**, and then select one of the following options:

  - **All**: Presents all the sensors that report to this on-premises management console.

  - **Connected**: Presents only connected sensors.

  - **Disconnected**: Presents only disconnected sensors.

To filter according to the upgrade status:

- From the upper-left corner, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/down-pointing-icon.png" border="false"::: next to **Upgrade Status** and select one of the following options:

  - **All**: Presents all the sensors that report to this on-premises management console.

  - **Valid**: Presents sensors with a valid upgrade status.

  - **In Progress**: Presents sensors that are in the process of upgrade.

  - **Failed**: Presents sensors whose upgrade process has failed.

## Assign sensors to zones

For each zone, you need to assign sensors that perform local traffic analysis and alerting. You can assign only the sensors that are connected to the on-premises management console.

To assign a sensor:

1. Select **Site Management**. The unassigned sensors appear in the upper-left corner of the dialog box.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/unassigned-sensors-view.png" alt-text="Screenshot of the Unassigned Sensors view.":::

2. Verify that the **Connectivity** status is connected. If not, see [Connect sensors to the on-premises management console](#connect-sensors-to-the-on-premises-management-console) for details about connecting. 

3. Select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/assign-icon.png" border="false"::: for the sensor that you want to assign.

4. In the **Assign Sensor** dialog box, select the business unit, region, site, and zone to assign.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/assign-sensor-screen.png" alt-text="Screenshot of the Assign Sensor view.":::

5. Select **ASSIGN**.

To unassign and delete a sensor:

1. Disconnect the sensor from the on-premises management console. See [Connect sensors to the on-premises management console](#connect-sensors-to-the-on-premises-management-console) for details.

2. In the **Site Management** window, select the sensor and select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/unassign-sensor-icon.png" border="false":::. The sensor appears in the list of unassigned sensors after a few moments.

3. To delete the unassigned sensor from the site, select the sensor from the list of unassigned sensors and select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/delete-icon.png" border="false":::.

## See also

[Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
