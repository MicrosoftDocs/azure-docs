---
title: Manage the on-premises management console 
description: This article covers various on-premises management console options, for example, backup and restore, defining the host name, and setting up a proxy to sensors.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/12/2020
ms.topic: article
ms.service: azure
---

# Manage the on-premises management console

This article covers various on-premises management console options, for example, backup and restore, downloading committee device activation file, updating certificates, setting up a proxy to sensors and more.

On-premises management console onboarding is carried out from the Azure portal.

## Upload an activation file

After you first-time log in, an activation file for the on-premises management console was downloaded. This file contains the aggregate committed devices defined during the onboarding process. The list includes sensors associated with multiple subscriptions.

After initial activation, the number of monitored devices might exceed the number of committed devices defined during onboarding. This might happen, for example, if you connect more sensors to the management console. If there is a discrepancy between the number of monitored devices and the number of committed devices, a warning appears in the management console. If this happens, you should upload a new activation file.

To upload an activation file:

1. Go to the Defender for IoT **Pricing** page.
1. Select the **Download the activation file for the management console** tab. The activation file is downloaded.

:::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/cloud_download_opm_activation_file.png" alt-text="Download activation file.":::

1. Select **System Settings** from the management console.
1. Select **Activation**.
1. Select **Choose a File** and select the file that you saved.

## Manage certificates

Following on-premises management console installation, a local self-signed certificate is generated and used to access the management console web application. When logging in to the management console for the first time, Administrator users are prompted to provide an SSL/TLS certificate. For more information about first time setup, see [Activate and set up your on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md).

This article provides information on updating certificates, working with certificate CLI commands, and supported certificates and certificate parameters.

### About certificates

Azure Defender for IoT uses SSL and TLS certificates to:

1. Meet specific certificate and encryption requirements requested by your organization by uploading the CA-signed certificate.

1. Allow validation between the management console and connected sensors, and between a management console and a High Availability management console. Validations is evaluated against a Certificate Revocation List, and the certificate expiration date. **If validation fails, communication between the management console and the sensor is halted and a validation error is presented in the console. This option is enabled by default after installation.**

 Third party Forwarding rules, for example alert information sent to SYSLOG, Splunk or ServiceNow; or communication with Active Directory are not validated.

### Update certificates

On-premises management console Administrator users can update certificates.

To update a certificate:  

1. Select **System Settings**.
1. Select **SSL/TLS Certificates.**
1. Delete or edit the certificate and add a new one.
    - Add a certificate name.
    - Upload a CRT file and key file and enter a passphrase.
    - Upload a PEM file if required.

To change the validation setting:

1. Enable or Disable the **Enable Certificate Validation** toggle.
1. Select **Save**.

If the option is enabled and validation fails, communication between the management console and the sensor is halted and a validation error is presented in the console.

### Certificate Support

The following certificates are supported:

- Private and Enterprise Key Infrastructure (Private PKI) 
- Public Key Infrastructure (Public PKI) 
- Locally generated on the appliance (locally self-signed). **Using self-signed certificates is not recommended.** This connection is *insecure* and should be used for test environments only. The owner of the certificate cannot be validated, and the security of your system cannot be maintained. Self-signed certificates should never be used for production networks.  

The following parameters are supported. 

Certificate CRT

- The primary certificate file for your domain name
- Signature Algorithm = SHA256RSA
- Signature Hash Algorithm = SHA256
- Valid from = Valid past date
- Valid To = Valid future date
- Public Key = RSA 2048bits (Minimum) or 4096bits
- CRL Distribution Point = URL to .crl file
- Subject CN = URL, can be a wildcard certificate e.g. example.contoso.com or  *.contoso.com**
- Subject (C)ountry = defined, e.g. US
- Subject (OU) Org Unit = defined, e.g. Contoso Labs
- Subject (O)rganization = defined, e.g. Contoso Inc.

Key File

- The key file generated when you created CSR
- RSA 2048bits (Minimum) or 4096bits

Certificate Chain

- The intermediate certificate file (if any) that was supplied by your CA
- The CA certificate that issued the server's certificate should be first in the file, followed by any others up to the root. 
- Can include Bag attributes.

Passphrase

- 1 key supported
- Setup when importing the certificate

Certificates with other parameters may work but cannot be supported by Microsoft.
#### Encryption key artifacts

**.pem – Certificate Container File**

The name is from Privacy Enhanced Mail (PEM), an historic method for secure email but the container format it used lives on, and is a base64 translation of the x509 ASN.1 keys.  

Defined in RFCs 1421 to 1424: a container format that may include just the public certificate (such as with Apache installs, and CA certificate files, etc, ssl, and certs), or may include an entire certificate chain including public key, private key, and root certificates.  

It may also encode a CSR as the PKCS10 format can be translated into PEM.

**.cert .cer .crt – Certificate Container File**

A .pem (or rarely .der) formatted file with a different extension. It is recognized by Windows Explorer as a certificate. The .pem file is not recognized by Windows Explorer.

**.key – Private Key File**

A KEY file is the same "format" as a PEM file, but it has a different extension. 
##### Use CLI commands to deploy certificates

Use the *cyberx-xsense-certificate-import* CLI command to import certificates. To use this tool, certificate files need to be uploaded to the device (using tools such as winscp or wget).

The command supports the following input flags:

-h  Show the command line help syntax

--crt  Path to certificate file (CRT extension)

--key  *.key file, key length should be minimum 2048 bits

--chain  Path to certificate chain file (optional)

--pass  Passphrase used to encrypt the certificate (optional)

--passphrase-set  Default = False, unused. Set to TRUE to use previous passphrase supplied with previous certificate (optional)

When using the CLI command:

- Verify the certificate files are readable on the appliance.

- Verify that the domain name and IP in the certificate match the configuration planned by the IT department.

- ## Define backup and restore settings

The on-premises management console system backup is performed automatically, daily. The data is saved on a different disk: The default location is `/var/cyberx/backups`. 

You can automatically transfer this file to the internal network. 

> Note: The backup and restore procedure can be performed on the same version only. 

To back up the on-premises management console machine: 

- Sign in to an administrative account and type `sudo cyberx-management-backup -full`.

To restore the latest backup file:

- Sign in to an administrative account and type `$ sudo cyberx-management-system-restore`.

To save the backup to external SMB Server:

1. Create a shared folder in the external SMB server.  

   Get the folder path and username and password required to access the SMB server. 

2. In the Defender for IoT, make directory for the backups:

   - `sudo mkdir /<backup_folder_name_on_ server>` 

   - `sudo chmod 777 /<backup_folder_name_on_c_server>/` 

3. Edit fstab:  

   - `sudo nano /etc/fstab` 

   - `add - //<server_IP>/<folder_path> /<backup_folder_name_on_server> cifs rw,credentials=/etc/samba/user,vers=3.0,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0` 

4. Edit or create credentials to share, these are the credentials for the SMB server: 

   - `sudo nano /etc/samba/user` 

5. Add: 

   - `username=<user name>`

   - `password=<password>` 

6. Mount the directory: 

   - `sudo mount -a` 

7. Configure backup directory to the shared folder on the Defender for IoT on-premises management console:  

   - `sudo nano /var/cyberx/properties/backup.properties` 

   - `set Backup.shared_location to <backup_folder_name_on_server>`

## Edit the hostname

Edit the management console hostname configured in the organizational DNS server.

To edit:

1. In the console left pane, select **System Settings**.  

2. In the management console networking section, select **Network**. 

3. Enter the hostname configured in the organizational DNS serve. 

4. Select **Save**.

## Define VLAN names

 VLAN names are not synchronized between the sensor and the management console. You should define identical names on components.

In the networking area, select **VLAN** and add names to the VLAN IDs discovered and select **Save**.

## Define a proxy to sensors

Enhance system security by preventing user sign-in directly to the sensor. Instead leverage proxy tunneling to let users access the sensor directly from the on-premises management console with a single firewall rule. This narrows the possibility of unauthorized access to the network environment beyond the sensor.

Use a proxy in environments where there is no direct connectivity to sensors.

  :::image type="content" source="media/how-to-access-sensors-using-a-proxy/proxy-diagram.png" alt-text="user":::

Perform the following to set up tunneling, including:

  - Connect a Sensor the on-premises management console

  - Set up Tunneling on the on-premises management console

To enable tunneling:

1. Sign in to the on-premises management console appliance CLI with administrative credentials.

2. Type: `sudo cyberx-management-tunnel-enable.`

3. Select **Enter**.

4. Type `--port 10000`.

## Adjust system properties

System properties control various operations and settings in the management console. Editing or modifying them could damage management console operation.

Consult with support.microsoft.com before changing your settings.

To access system properties: 

1. Sign in to the on-premises management console or the sensor.

2. Select **System Settings**.

3. Select **System Properties** from the general section.

## Change the name of the on-premises management console

You can change the name of the on-premises management console. The new names appear in the console web browser, in various console windows, and in troubleshooting logs.

The default name is **management console**.

To change the name:

1. In the bottom of the left pane, select the current name.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/console-name.png" alt-text="Screenshot of the on-premises management console version.":::

2. In the **Edit management console configuration** dialog box, enter the new name. The name can't be longer than 25 characters.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/edit-management-console-configuration.png" alt-text="Screenshot of editing the Defender for IoT platform configuration.":::

3. Select **Save**. The new name is applied.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/name-changed.png" alt-text="Screenshot that shows the changed name of the console.":::

## Password recovery

Password recovery for your on-premises management console is tied to the subscription the device is attached to. You can not recover a password if you do not know which subscription a device is attached to.

To reset your password:

1. Navigate to the on-premises management console sign in page.
1. Select **Password Recovery**.
1. Copy the unique identifier.
1. Go to the Defender for IoT **Sites and sensors** page and select the **Recover my password** tab.
1. Enter the unique identifier and select **Recover**. The activation file is downloaded.
1. Go to the **Password Recovery** page and upload the activation file.
1. Select **Next**.
1. You will now be given your username and a new system-generated password.

>Note
>The sensor is linked to the subscription it was originally connected to. The password can only be recovered using the same subscription it is attached to.
## See also

[Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)

[Manage individual sensors](how-to-manage-individual-sensors.md)
