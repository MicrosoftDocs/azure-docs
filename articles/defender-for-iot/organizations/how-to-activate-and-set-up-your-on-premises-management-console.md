---
title: Activate and set up your on-premises management console 
description: Activating the management console ensures that sensors are registered with Azure and send information to the on-premises management console, and that the on-premises management console carries out management tasks on connected sensors.
ms.date: 06/06/2022
ms.topic: how-to
---

# Activate and set up your on-premises management console

Activation and setup of the on-premises management console ensures that:

- Network devices that you're monitoring through connected sensors are registered with an Azure account.
- Sensors send information to the on-premises management console.
- The on-premises management console carries out management tasks on connected sensors.
- You've installed an SSL certificate.

## Sign in for the first time

To sign in to the on-premises management console:

1. Go to the IP address you received for the on-premises management console during the system installation.

1. Enter the username and password you received for the on-premises management console during the system installation.

If you forgot your password, select the **Recover Password** option. See [Password recovery](how-to-manage-the-on-premises-management-console.md#password-recovery) for instructions on how to recover your password.

## Activate the on-premises management console

After you sign in for the first time, you need to activate the on-premises management console by getting and uploading an activation file. Activation files on the on-premises management console enforces the number of committed devices configured for your subscription and Defender for IoT plan. For more information, see [Manage Defender for IoT subscriptions](how-to-manage-subscriptions.md).

**To activate the on-premises management console**:

1. Sign in to the on-premises management console.

1. In the alert notification at the top of the screen, select **Take Action**.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/take-action.png" alt-text="Screenshot that shows the Take Action link in the alert at the top of the screen.":::

1. In the **Activation** pop-up screen, select **Azure portal**.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/azure-portal.png" alt-text="Screenshot that shows the Azure portal link in the pop-up message.":::
 
1. Select a subscription to associate the on-premises management console to. Then select **Download on-premises management console activation file**. The activation file downloads.

   The on-premises management console can be associated to one or more subscriptions. The activation file is associated with all the selected subscriptions and the number of committed devices at the time of download.

   [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/multiple-subscriptions.png" alt-text="Screenshot that shows selecting multiple subscriptions." lightbox="media/how-to-manage-sensors-from-the-on-premises-management-console/multiple-subscriptions.png":::

   If you haven't already onboarded Defender for IoT to a subscription, see [Onboard a Defender for IoT plan for OT networks](how-to-manage-subscriptions.md#onboard-a-defender-for-iot-plan-for-ot-networks).

   > [!Note]
   > If you delete a subscription, you must upload a new activation file to the on-premises management console that was affiliated with the deleted subscription.

1. Go back to the **Activation** pop-up screen and select **CHOOSE FILE**.

1. Select the downloaded file.

After initial activation, the number of monitored devices might exceed the number of committed devices defined during onboarding. This issue occurs if you connect more sensors to the management console. If there's a discrepancy between the number of monitored devices and the number of committed devices, a warning appears on the management console.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/device-commitment-update.png" alt-text="Screenshot that shows the device commitment warning.":::

If this warning appears, you need to upload a [new activation file](#activate-the-on-premises-management-console).

### Activation expirations

After activating an on-premises management console, you'll need to apply new activation files on both the on-premises management console and connected sensors as follows:

|Location  |Activation process  |
|---------|---------|
|**On-premises management console**     |  Apply a new activation file on your on-premises management console if you've [modified the number of committed devices](how-to-manage-subscriptions.md#edit-a-plan-for-ot-networks) in your subscription.      |
|**Cloud-connected sensors**     | Cloud-connected sensors remain activated for as long as your Azure subscription with your Defender for IoT plan is active. <br><br>However, you'll also need to apply a new activation file when [updating your sensor software](update-ot-software.md#download-and-apply-a-new-activation-file) from a legacy version to version 22.2.x.        |
|  **Locally-managed**   |   Apply a new activation file to locally-managed sensors every year. After a sensor's activation file has expired, the sensor will continue to monitor your network, but you'll see a warning message when signing in to the sensor.     |

For more information, see [Manage Defender for IoT subscriptions](how-to-manage-subscriptions.md).

### Activate expired licenses from versions earlier than 10.0

For users with versions prior to 10.0, your license might expire and the following alert will appear:

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/activation-popup.png" alt-text="Screenshot that shows the License has expired alert.":::

**To activate your license**:

1. Open a case with [support](https://portal.azure.com/?passwordRecovery=true&Microsoft_Azure_IoT_Defender=canary#create/Microsoft.Support).

1. Supply support with your **Activation ID** number.

1. Support will supply you with new license information in the form of a string of letters.

1. Read the terms and conditions, and select the checkbox to approve.

1. Paste the string into the space provided.

    :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/add-license.png" alt-text="Screenshot that shows pasting the string into the box.":::

1. Select **Activate**.

## Set up a certificate

After you install the management console, a local self-signed certificate is generated. This certificate is used to access the console. After an administrator signs in to the management console for the first time, that user is prompted to onboard an SSL/TLS certificate.

Two levels of security are available:

- Meet specific certificate and encryption requirements requested by your organization by uploading the CA-signed certificate.
- Allow validation between the management console and connected sensors. Validation is evaluated against a certificate revocation list and the certificate expiration date. *If validation fails, communication between the management console and the sensor is halted and a validation error is presented in the console.* This option is enabled by default after installation.

The console supports the following types of certificates:

- Private and Enterprise Key Infrastructure (private PKI)
- Public Key Infrastructure (public PKI)
- Locally generated on the appliance (locally self-signed)

  > [!IMPORTANT]
  > We recommend that you don't use a self-signed certificate. The certificate isn't secure and should be used for test environments only. The owner of the certificate can't be validated, and the security of your system can't be maintained. Never use this option for production networks.

To upload a certificate:

1. When you're prompted after you sign in, define a certificate name.

1. Upload the CRT and key files.

1. Enter a passphrase and upload a PEM file if necessary.

You might need to refresh your screen after you upload the CA-signed certificate.

To disable validation between the management console and connected sensors:

1. Select **Next**.

1. Turn off the **Enable system-wide validation** toggle.

For information about uploading a new certificate, supported certificate files, and related items, see [Manage the on-premises management console](how-to-manage-the-on-premises-management-console.md).

## Connect sensors to the on-premises management console

Ensure that sensors send information to the on-premises management console. Make sure that the on-premises management console can perform backups, manage alerts, and carry out other activity on the sensors. Use the following procedures to verify that you make an initial connection between sensors and the on-premises management console.

Two options are available for connecting Microsoft Defender for IoT sensors to the on-premises management console:

- Connect from the sensor console.
- Connect by using tunneling.

After connecting, you must set up a site with these sensors.

### Connect sensors to the on-premises management console from the sensor console

To connect sensors to the on-premises management console from the sensor console:

1. On the on-premises management console, select **System Settings**.

1. Copy the string in the **Copy Connection String** box.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/connection-string.png" alt-text="Screenshot that shows copying the connection string for the sensor.":::

1. On the sensor, go to **System Settings** and select **Connection to Management Console** :::image type="icon" source="media/how-to-manage-sensors-from-the-on-premises-management-console/connection-to-management-console.png" border="false":::

1. Paste the copied connection string from the on-premises management console into the **Connection string** box.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/paste-connection-string.png" alt-text="Screenshot that shows pasting the copied connection string into the Connection string box.":::

1. Select **Connect**.

### Connect sensors by using tunneling

Enable a secured tunneling connection between organizational sensors and the on-premises management console. This setup circumvents interaction with the organizational firewall. As a result, it reduces the attack surface.

Using tunneling allows you to connect to the on-premises management console from its IP address and a single port (9000 by default) to any sensor.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/tunneling-diagram.png" alt-text="Screenshot that shows a tunneling diagram for connecting sensors to the on-premises management console.":::

To set up tunneling at the on-premises management console:

1. Sign in to the on-premises management console and run the following command:

      ```bash
      cyberx-management-tunnel-enable
      
      ```

1. Allow a few minutes for the connection to start.

You can also customize the port range to a number other than 9000. An example is 10000.

To use a new port:

1. Sign in to the on-premises management console and run the following command:

      ```bash
      sudo cyberx-management-tunnel-enable --port 10000
      
      ```

1. Disable the connection, when required.

To disable:

Sign in to the on-premises management console and run the following command:

  ```bash
  cyberx-management-tunnel-disable
  
  ```

No configuration is needed on the sensor.

To view log files:

Review log information in the log files.

To access log files:

1. Sign in to the on-premises management console and go to */var/log/apache2.log*.
1. Sign in to the sensor and go to */var/cyberx/logs/tunnel.log*.

## Set up a site

The default enterprise map provides an overall view of your devices according to several levels of geographical locations.

The view of your devices might be required where the organizational structure and user permissions are complex. In these cases, site setup might be determined by a global organizational structure, in addition to the standard site or zone structure.

To support this environment, you must create a global business topology based on your organization's business units, regions, sites, and zones. You also need to define user access permissions around these entities by using access groups.

Access groups enable better control over where users manage and analyze devices in the Defender for IoT platform.

### How it works

You can define a business unit and a region for each site in your organization. You can then add zones, which are logical entities that exist in your network.

Assign at least one sensor per zone. The five-level model provides the flexibility and granularity required to deliver the protection system that reflects the structure of your organization.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/diagram-of-sensor-showing-relationships.png" alt-text="Diagram that shows sensors and regional relationships.":::

By using the **Enterprise View** screen, you can edit your sites directly. When you select a site on the **Enterprise View** screen, the number of open alerts appears next to each zone.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/console-map-with-data-overlay-v2.png" alt-text="Screenshot that shows an on-premises management console map with Berlin data overlay.":::

To set up a site:

1. Add new business units to reflect your organization's logical structure.

   1. On the **Enterprise View** screen, select **All Sites** > **Manage Business Units**.

      :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/manage-business-unit.png" alt-text="Screenshot that shows selecting Manage Business Units from the All Sites dropdown menu on the Enterprise View screen.":::

   1. Enter the new business unit name and select **ADD**.

1. Add new regions to reflect your organization's regions.

   1. On the **Enterprise View** screen, select **All Regions** > **Manage Regions**.

      :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/manage-regions.png" alt-text="Screenshot that shows selecting All Regions and then selecting Manage Regions to manage the regions in your enterprise.":::

   1. Enter the new region name and select **ADD**.

1. Add a site.

   1. On the **Enterprise View** screen, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/new-site-icon.png" border="false"::: on the top bar. Your cursor appears as a plus sign (**+**).

   1. Position the **+** at the location of the new site and select it. The **Create New Site** dialog opens.

      :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/create-new-site-screen.png" alt-text="Screenshot that shows the Create New Site dialog.":::

   1. Define the name and the physical address for the new site and select **SAVE**. The new site appears on the site map.

1. [Add zones to a site](#create-enterprise-zones).

1. [Connect the sensors](how-to-manage-individual-sensors.md#connect-a-sensor-to-the-management-console).

1. [Assign sensors to site zones](#assign-sensors-to-zones).

### Delete a site

If you no longer need a site, you can delete it from your on-premises management console.

To delete a site:

1. In the **Site Management** window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: from the bar that contains the site name. Then select **Delete Site**. A confirmation box appears where you can verify that you want to delete the site.

1. In the confirmation box, select **CONFIRM**.

## Create enterprise zones

Zones are logical entities that enable you to divide devices within a site into groups according to various characteristics. For example, you can create groups for production lines, substations, site areas, or types of devices. You can define zones based on any characteristic that's suitable for your organization.

You configure zones as a part of the site configuration process.

:::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/site-management-zones-screen-v2.png" alt-text="Screenshot that shows the Site Management zones view." lightbox="media/how-to-activate-and-set-up-your-on-premises-management-console/site-management-zones-screen-v2.png":::

The following table describes the parameters in the **Site Management** window.

| Parameter | Description |
|--|--|
| Name | The name of the sensor. You can change this name only from the sensor. For more information, see the Defender for IoT user guide. |
| IP | The sensor IP address. |
| Version | The sensor version. |
| Connectivity | The sensor connectivity status. The status can be **Connected** or **Disconnected**. |
| Last Update | The date of the last update. |
| Update Progress | The progress bar shows the status of the update process, as follows:<br />- Uploading package<br />- Preparing to install<br />- Stopping processes<br />- Backing up data<br />- Taking snapshot<br />- Updating configuration<br />- Updating dependencies<br />- Updating libraries<br />- Patching databases<br />- Starting processes<br />- Validating system sanity<br />- Validation succeeded<br />- Success<br />- Failure<br />- Update started<br />- Starting installation<br /></br >For details about updating, see [Microsoft Support](https://support.microsoft.com/) for help. |
| Devices | The number of OT devices that the sensor monitors. |
| Alerts | The number of alerts on the sensor. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/assign-icon.png" border="false"::: | Enables assigning a sensor to zones. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/delete-icon.png" border="false":::| Enables deleting a disconnected sensor from the site. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/sensor-icon.png" border="false"::: | Indicates how many sensors are currently connected to the zone. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/ot-assets-icon.png" border="false"::: | Indicates how many OT assets are currently connected to the zone. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/number-of-alerts-icon.png" border="false"::: | Indicates the number of alerts sent by sensors that are assigned to the zone. |
| :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/unassign-sensor-icon.png" border="false"::: | Unassigns sensors from zones. |

To add a zone to a site:

1. In the **Site Management** window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: on the bar that contains the site name. Then select **Add Zone**. The **Create New Zone** dialog appears.

    :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/create-new-zone-screen.png" alt-text="Screenshot that shows the Create New Zone view.":::

1. Enter the zone name.

1. Enter a description for the new zone that clearly states the characteristics that you used to divide the site into zones.

1. Select **SAVE**. The new zone appears in the **Site Management** window under the site that this zone belongs to.

To edit a zone:

1. In the **Site Management** window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: on the bar that contains the zone name. Then select **Edit Zone**. The **Edit Zone** dialog appears.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/zone-edit-screen.png" alt-text="Screenshot that shows the Edit Zone dialog.":::

1. Edit the zone parameters and select **SAVE**.

To delete a zone:

1. In the **Site Management** window, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/expand-view-icon.png" border="false"::: on the bar that contains the zone name. Then select **Delete Zone**.

1. In the confirmation box, select **YES**.

To filter according to the connectivity status:

- In the upper-left corner, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/down-pointing-icon.png" border="false"::: next to **Connectivity**. Then select one of the following options:

  - **All**: Presents all the sensors that report to this on-premises management console.
  - **Connected**: Presents only connected sensors.
  - **Disconnected**: Presents only disconnected sensors.

To filter according to the upgrade status:

- In the upper-left corner, select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/down-pointing-icon.png" border="false"::: next to **Upgrade Status**. Select one of the following options:

  - **All**: Presents all the sensors that report to this on-premises management console.
  - **Valid**: Presents sensors with a valid upgrade status.
  - **In Progress**: Presents sensors that are in the process of upgrade.
  - **Failed**: Presents sensors whose upgrade process has failed.

## Assign sensors to zones

For each zone, you need to assign sensors that perform local traffic analysis and alerting. You can assign only the sensors that are connected to the on-premises management console.

To assign a sensor:

1. Select **Site Management**. The unassigned sensors appear in the upper-left corner of the dialog.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/unassigned-sensors-view.png" alt-text="Screenshot that shows the Unassigned Sensors view.":::

1. Verify that the **Connectivity** status is **Connected**. If it's not, see [Connect sensors to the on-premises management console](#connect-sensors-to-the-on-premises-management-console) for more information about connecting.

1. Select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/assign-icon.png" border="false"::: for the sensor that you want to assign.

1. In the **Assign Sensor** dialog, select the business unit, region, site, and zone to assign.

   :::image type="content" source="media/how-to-activate-and-set-up-your-on-premises-management-console/assign-sensor-screen.png" alt-text="Screenshot that shows the Assign Sensor view.":::

1. Select **ASSIGN**.

To unassign and delete a sensor:

1. Disconnect the sensor from the on-premises management console. See [Connect sensors to the on-premises management console](#connect-sensors-to-the-on-premises-management-console) for more information.

1. In the **Site Management** window, select the sensor and select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/unassign-sensor-icon.png" border="false":::. The sensor appears in the list of unassigned sensors after a few moments.

1. To delete the unassigned sensor from the site, select the sensor from the list of unassigned sensors and select :::image type="icon" source="media/how-to-activate-and-set-up-your-on-premises-management-console/delete-icon.png" border="false":::.

## Next steps

For more information, see [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md) and [Manage individual sensors](how-to-manage-individual-sensors.md).
