---
title: Manage the on-premises management console 
description: Learn about on-premises management console options like backup and restore, defining the host name, and setting up a proxy to sensors.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/12/2020
ms.topic: article
ms.service: azure
---

# Manage the on-premises management console

This article covers on-premises management console options like backup and restore, downloading committee device activation file, updating certificates, and setting up a proxy to sensors.

You onboard the on-premises management console from the Azure portal.

## Upload an activation file

When you first sign in, an activation file for the on-premises management console is downloaded. This file contains the aggregate committed devices that are defined during the onboarding process. The list includes sensors associated with multiple subscriptions.

After initial activation, the number of monitored devices might exceed the number of committed devices defined during onboarding. This event might happen, for example, if you connect more sensors to the management console. If there's a discrepancy between the number of monitored devices and the number of committed devices, a warning appears in the management console. If this event occurs, you should upload a new activation file.

To upload an activation file:

1. Go to the Azure Defender for IoT **Pricing** page.
1. Select the **Download the activation file for the management console** tab. The activation file is downloaded.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/cloud_download_opm_activation_file.png" alt-text="Download the activation file.":::

1. Select **System Settings** from the management console.
1. Select **Activation**.
1. Select **Choose a File** and select the file that you saved.

## Manage certificates

After installation of the on-premises management console, a local self-signed certificate is generated and used to access the management console's web application. When administrator users sign in to the management console for the first time, they're prompted to provide an SSL/TLS certificate. For more information about first-time setup, see [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md).

The following sections provide information on updating certificates, working with certificate CLI commands, and supported certificates and certificate parameters.

### About certificates

Azure Defender for IoT uses SSL and TLS certificates to:

- Meet specific certificate and encryption requirements requested by your organization by uploading the CA-signed certificate.

- Allow validation between the management console and connected sensors, and between a management console and a high-availability management console. Validation is evaluated against a certificate revocation list and the certificate expiration date. *If validation fails, communication between the management console and the sensor is halted and a validation error appears in the console.* This option is enabled by default after installation.

Third-party forwarding rules aren't validated. Examples are alert information sent to SYSLOG, Splunk, or ServiceNow; and communication with Active Directory.

### Update certificates

Administrator users of the on-premises management console can update certificates.

To update a certificate:  

1. Select **System Settings**.
1. Select **SSL/TLS Certificates**.
1. Delete or edit the certificate and add a new one.
   
   - Add a certificate name.
   - Upload a CRT file and key file, and enter a passphrase.
   - Upload a PEM file if necessary.

To change the validation setting:

1. Turn on or turn off the **Enable Certificate Validation** toggle.
1. Select **Save**.

If the option is enabled and validation fails, communication between the management console and the sensor is halted and a validation error appears in the console.

### Certificate support

The following certificates are supported:

- Private and Enterprise Key Infrastructure (Private PKI) 
- Public Key Infrastructure (Public PKI) 
- Locally generated on the appliance (locally self-signed) 

  > [!IMPORTANT]
  > We don't recommend that you use self-signed certificates. This connection is not secure and should be used for test environments only. The owner of the certificate can't be validated, and the security of your system can't be maintained. Self-signed certificates should never be used for production networks.  

The following parameters are supported: 

**Certificate CRT**

- The primary certificate file for your domain name
- Signature Algorithm = SHA256RSA
- Signature Hash Algorithm = SHA256
- Valid from = Valid past date
- Valid To = Valid future date
- Public Key = RSA 2048 bits (Minimum) or 4096 bits
- CRL Distribution Point = URL to .crl file
- Subject CN = URL, can be a wildcard certificate; for example, www.contoso.com or \*.contoso.com
- Subject (C)ountry = defined, for example, US
- Subject (OU) Org Unit = defined; for example, Contoso Labs
- Subject (O)rganization = defined; for example, Contoso Inc

**Key file**

- The key file generated when you created the CSR
- RSA 2048 bits (minimum) or 4096 bits

**Certificate chain**

- The intermediate certificate file (if any) that was supplied by your CA.
- The CA certificate that issued the server's certificate should be first in the file, followed by any others up to the root. 
- The chain can include bag attributes.

**Passphrase**

- One key is supported.
- Set up when you're importing the certificate.

Certificates with other parameters might work, but Microsoft doesn't support them.

#### Encryption key artifacts

**.pem: certificate container file**

The name is from Privacy Enhanced Mail (PEM), a historic method for secure email. The container format is a Base64 translation of the x509 ASN.1 keys.  

This file is defined in RFCs 1421 to 1424: a container format that might include just the public certificate (such as with Apache installations, CA certificate files, and ETC SSL certificates). Or it might include an entire certificate chain, including a public key, a private key, and root certificates.  

It might also encode a CSR, because the PKCS10 format can be translated into PEM.

**.cert .cer .crt: certificate container file**

This is a .pem (or rarely, .der) formatted file with a different extension. Windows File Explorer recognizes it as a certificate. File Explorer doesn't recognize the .pem file.

**.key: private key file**

A key file is the same format as a PEM file, but it has a different extension. 

#### CLI commands

Use the `cyberx-xsense-certificate-import` CLI command to import certificates. To use this tool, you need to upload certificate files to the device (by using tools such as winscp or wget).

The command supports the following input flags:

- `-h`:  Shows the command-line help syntax.

- `--crt`:  Path to a certificate file (.crt extension).

- `--key`:  \*.key file. Key length should be a minimum of 2,048 bits.

- `--chain`:  Path to a certificate chain file (optional).

- `--pass`:  Passphrase used to encrypt the certificate (optional).

- `--passphrase-set`:  Default = `False`, unused. Set to `True` to use the previous passphrase supplied with the previous certificate (optional).

When you're using the CLI command:

- Verify that the certificate files are readable on the appliance.

- Verify that the domain name and IP in the certificate match the configuration that the IT department has planned.

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

VLAN names are not synchronized between the sensor and the management console. You should define identical names on components.

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

## Update the software version

The following procedure describes how to update the on-premises management console software version. The update process takes about 30 minutes.

1. Go to the [Azure portal](https://portal.azure.com/).

1. Go to Defender for IoT.

1. Go to the **Updates** page.

1. Select a version from the on-premises management console section.

1. Select **Download** and save the file.

1. Log into on-premises management console and select **System Settings** from the side menu.

1. On the **Version Update** pane, select **Update**.

1. Select the file that you downloaded from the Defender for IoT **Updates** page.

## See also

[Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)

[Manage individual sensors](how-to-manage-individual-sensors.md)
