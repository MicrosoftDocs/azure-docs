---
title: Activate and set up your on-premises management console 
description: Activating the management console ensures that sensors are registered with Azure and sending information to the on-premises management console, and that the on-premises management console carries out management tasks on connected sensors.
ms.date: 06/06/2022
ms.topic: install-set-up-deploy
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

If you forgot your password, select the **Recover Password** option.
## Activate the on-premises management console

After you sign in for the first time, you need to activate the on-premises management console by getting and uploading an activation file. Activation files on the on-premises management console enforce the number of committed devices configured for your subscription and Defender for IoT plan. For more information, see [Manage Defender for IoT subscriptions](how-to-manage-subscriptions.md).

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
|**Cloud-connected and locally managed sensors**     | Cloud-connected and locally managed sensors remain activated for as long as your Azure subscription with your Defender for IoT plan is active. <br><br>If you're updating an OT sensor from a legacy version, you'll need to re-activate your updated sensor.  |

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

- [Connect from the sensor console](#connect-sensors-to-the-on-premises-management-console-from-the-sensor-console)
- [Connect sensors by using tunneling](#connect-sensors-by-using-tunneling)

After connecting, set up sites and zones and assign each sensor to a zone to [monitor detected data segmented separately](monitor-zero-trust.md). 

For more information, see [Create OT sites and zones on an on-premises management console](ot-deploy/sites-and-zones-on-premises.md).

### Connect sensors to the on-premises management console from the sensor console

**To connect sensors to the on-premises management console from the sensor console**:

1. In the on-premises management console, select **System Settings**.

1. Copy the string in the **Copy Connection String** box.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/connection-string.png" alt-text="Screenshot that shows copying the connection string for the sensor.":::

1. On the sensor, go to **System Settings** > **Connection to Management Console**.

1. Paste the copied connection string from the on-premises management console into the **Connection string** box.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/paste-connection-string.png" alt-text="Screenshot that shows pasting the copied connection string into the Connection string box.":::

1. Select **Connect**.

### Connect sensors by using tunneling

Enhance system security by preventing direct user access to the sensor. Instead of direct access, use proxy tunneling to let users access the sensor from the on-premises management console with a single firewall rule. This technique narrows the possibility of unauthorized access to the network environment beyond the sensor. The user's experience when signing in to the sensor remains the same.

Using tunneling allows you to connect to the on-premises management console from its IP address and a single port (9000 by default) to any sensor.

For example, the following image shows a sample architecture where users access the sensor consoles via the on-premises management console.

:::image type="content" source="media/tutorial-install-components/sensor-system-graph.png" alt-text="Screenshot that shows access to the sensor." border="false":::

**To set up tunneling at the on-premises management console**:

1. Sign in to the on-premises management console's CLI with the *cyberx* or the *support* user credentials and run the following command:

      ```bash
      sudo cyberx-management-tunnel-enable
      
      ```

    For more information on users, see [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

1. Allow a few minutes for the connection to start.
   
    When tunneling access is configured, the following URL syntax is used to access the sensor consoles: `https://<on-premises management console address>/<sensor address>/<page URL>`

You can also customize the port range to a number other than 9000. An example is 10000.

**To use a new port**:

Sign in to the on-premises management console and run the following command:

```bash
sudo cyberx-management-tunnel-enable --port 10000
          
```

**To disable the connection**:

Sign in to the on-premises management console and run the following command:

```bash
cyberx-management-tunnel-disable
  
```

No configuration is needed on the sensor.

**To access the tunneling log files**:

1. **From the on-premises management console**: Sign in and go to */var/log/apache2.log*.
1. **From the sensor**: Sign in and go to */var/cyberx/logs/tunnel.log*.

## Next steps


For more information, see:

- [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
- [Manage individual sensors](how-to-manage-individual-sensors.md)
- [Create OT sites and zones on an on-premises management console](ot-deploy/sites-and-zones-on-premises.md)
