---
title: Manage the on-premises management console 
description: Learn about on-premises management console options like backup and restore, defining the host name, and setting up a proxy to sensors.
ms.date: 06/02/2022
ms.topic: article
---

# Manage the on-premises management console

This article covers on-premises management console options like backup and restore, downloading committee device activation file, updating certificates, and setting up a proxy to sensors.

You onboard the on-premises management console from the Azure portal.

## Download software for the on-premises management console

You may need to download software for your on-premises management console if you're installing Defender for IoT software on your own appliances, or updating software versions.

**To download on-premises management console software**:

1. In the Azure portal, go to **Defender for IoT** > **Getting started** > **On-premises management console** or **Updates**.

1. Select **Download** for your on-premises management console software update. Save your `management-secured-patcher-<version>.tar` file locally. For example:

    :::image type="content" source="media/update-ot-software/on-premises-download.png" alt-text="Screenshot of the Download option for the on-premises management console." lightbox="media/update-ot-software/on-premises-download.png":::

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

## Upload an activation file

When you first sign in, an activation file for the on-premises management console is downloaded. This file contains the aggregate committed devices that are defined during the onboarding process. The list includes sensors associated with multiple subscriptions.

After initial activation, the number of monitored devices might exceed the number of committed devices defined during onboarding. This event might happen, for example, if you connect more sensors to the management console. If there's a discrepancy between the number of monitored devices and the number of committed devices, a warning appears in the management console. If this event occurs, you should upload a new activation file.

**To upload an activation file:**

1. Go to the Microsoft Defender for IoT **Plans and pricing** page.
1. Select the **Download the activation file for the management console** tab. The activation file is downloaded.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/cloud_download_opm_activation_file.png" alt-text="Download the activation file.":::

   [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. Select **System Settings** from the management console.
1. Select **Activation**.
1. Select **Choose a File** and select the file that you saved.


## Manage certificates

Following on-premises management console installation, a local self-signed certificate is generated and used to access the web application. When logging in to the on-premises management console for the first time, Administrator users are prompted to provide an SSL/TLS certificate. 

Administrators may be required to update certificates that were uploaded after initial login. This may happen for example if a certificate expired.

**To update a certificate:**

1. Select **System Settings**.

1. Select **SSL/TLS Certificates.**

    :::image type="content" source="media/how-to-manage-individual-sensors/certificate-upload.png" alt-text="Upload a certificate":::

1. In the SSL/TLS Certificates dialog box, delete the existing certificate and add a new one.

    - Add a certificate name.
    - Upload a CRT file and key file.
    - Upload a PEM file if necessary.

If the upload fails, contact your security or IT administrator, or review the information in [About Certificates](how-to-deploy-certificates.md).

**To change the certificate validation setting:**

1. Enable or disable the **Enable Certificate Validation** toggle. If the option is enabled and validation fails, communication between relevant components is halted and a validation error is presented in the console. If disabled, certificate validation is not carried out. See [About certificate validation](how-to-deploy-certificates.md#about-certificate-validation) for more information.

1. Select **Save**.

For more information about first-time certificate upload, see [First-time sign-in and activation checklist](how-to-activate-and-set-up-your-sensor.md#first-time-sign-in-and-activation-checklist).

## Define backup and restore settings

The on-premises management console system backup is performed automatically, daily. The data is saved on a different disk. The default location is `/var/cyberx/backups`. 

You can automatically transfer this file to the internal network. 

> [!NOTE]
> You can perform the backup and restore procedure on the same version only. 

To back up the on-premises management console machine: 

- Sign in to an administrative account and enter `sudo cyberx-management-backup -full`.

To restore the latest backup file:

- Sign in to an administrative account and enter `$ sudo cyberx-management-system-restore`.

To save the backup to an external SMB server:

1. Create a shared folder in the external SMB server.  

   Get the folder path, username, and password required to access the SMB server. 

2. In Defender for IoT, make a directory for the backups:

   - `sudo mkdir /<backup_folder_name_on_ server>` 

   - `sudo chmod 777 /<backup_folder_name_on_c_server>/` 

3. Edit fstab:  

   - `sudo nano /etc/fstab` 

   - `add - //<server_IP>/<folder_path> /<backup_folder_name_on_server> cifs rw,credentials=/etc/samba/user,vers=3.0,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0` 

4. Edit or create credentials for the SMB server to share: 

   - `sudo nano /etc/samba/user` 

5. Add: 

   - `username=<user name>`

   - `password=<password>` 

6. Mount the directory: 

   - `sudo mount -a` 

7. Configure a backup directory to the shared folder on the Defender for IoT on-premises management console:  

   - `sudo nano /var/cyberx/properties/backup.properties` 

   - `set Backup.shared_location to <backup_folder_name_on_server>`

## Edit the host name

To edit the management console's host name configured in the organizational DNS server:

1. In the management console's left pane, select **System Settings**.  

2. In the console's networking section, select **Network**. 

3. Enter the host name configured in the organizational DNS server. 

4. Select **Save**.

## Define VLAN names

VLAN names are not synchronized between the sensor and the management console. Define identical names on components.

In the networking area, select **VLAN** and add names to the discovered VLAN IDs. Then select **Save**.

## Define a proxy to sensors

Enhance system security by preventing user sign-in directly to the sensor. Instead, use proxy tunneling to let users access the sensor from the on-premises management console with a single firewall rule. This enhancement narrows the possibility of unauthorized access to the network environment beyond the sensor.

Use a proxy in environments where there's no direct connectivity to sensors.

:::image type="content" source="media/how-to-access-sensors-using-a-proxy/proxy-diagram.png" alt-text="User.":::

The following procedure connects a sensor to the on-premises management console and enables tunneling on that console:

1. Sign in to the on-premises management console appliance CLI with administrative credentials.

2. Type `sudo cyberx-management-tunnel-enable` and select **Enter**.

4. Type `--port 10000` and select **Enter**.

## Adjust system properties

System properties control various operations and settings in the management console. Editing or modifying them might damage the management console's operation. Consult with [Microsoft Support](https://support.microsoft.com) before changing your settings.

To access system properties: 

1. Sign in to the on-premises management console or the sensor.

2. Select **System Settings**.

3. Select **System Properties** from the **General** section.

## Change the name of the on-premises management console

You can change the name of the on-premises management console. The new names appear in the console web browser, in various console windows, and in troubleshooting logs. The default name is **management console**.

To change the name:

1. In the bottom of the left pane, select the current name.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/console-name.png" alt-text="Screenshot of the on-premises management console version.":::

2. In the **Edit management console configuration** dialog box, enter the new name. The name can't be longer than 25 characters.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/edit-management-console-configuration.png" alt-text="Screenshot of editing the Defender for IoT platform configuration.":::

3. Select **Save**. The new name is applied.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/name-changed.png" alt-text="Screenshot that shows the changed name of the console.":::

## Password recovery

Password recovery for your on-premises management console is tied to the subscription that the device is attached to. You can't recover a password if you don't know which subscription a device is attached to.

To reset your password:

1. Go to the on-premises management console's sign-in page.
1. Select **Password Recovery**.
1. Copy the unique identifier.
1. Go to the Defender for IoT **Sites and sensors** page and select the **Recover my password** tab.
1. Enter the unique identifier and select **Recover**. The activation file is downloaded.
1. Go to the **Password Recovery** page and upload the activation file.
1. Select **Next**.
 
   You're now given your username and a new system-generated password.

> [!NOTE]
> The sensor is linked to the subscription that it was originally connected to. You can recover the password only by using the same subscription that it's attached to.


## Mail server settings

Define SMTP mail server settings for the on-premises management console.

To define:

1. Sign in to the CLI for the on-premises management with administrative credentials.
1. Type ```nano /var/cyberx/properties/remote-interfaces.properties```.
1. Select enter. The following prompts appear.
   `mail.smtp_server=`
   `mail.port=25`
   `mail.sender=`
1. Enter the SMTP server name  and sender and select enter.


## Next steps

For more information, see:

- [Install OT system software](how-to-install-software.md)
- [Update OT system software](update-ot-software.md)
- [Manage individual sensors](how-to-manage-individual-sensors.md)
- [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)
- [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
