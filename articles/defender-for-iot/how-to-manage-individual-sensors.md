---
title: Manage individual sensors
description: Learn how to manage individual sensors, including managing activation files, performing backups, and updating a standalone sensor. 
ms.date: 02/02/2021
ms.topic: how-to
---

# Manage individual sensors

This article describes how to manage individual sensors. Tasks include managing activation files, performing backups, and updating a standalone sensor.

You can also do certain sensor management tasks from the on-premises management console, where multiple sensors can be managed simultaneously.

You use the Azure portal for sensor onboarding and registration.

## Manage sensor activation files

Your sensor was onboarded with Azure Defender for IoT from the Azure portal. Each sensor was onboarded as either a locally connected sensor or a cloud-connected sensor.

A unique activation file is uploaded to each sensor that you deploy. For more information about when and how to use a new file, see [Upload new activation files](#upload-new-activation-files). If you can't upload the file, see [Troubleshoot activation file upload](#troubleshoot-activation-file-upload).

### About activation files for locally connected sensors

Locally connected sensors are associated with an Azure subscription. The activation file for your locally connected sensors contains an expiration date. One month before this date, a warning message appears at the top of the sensor console. The warning remains until after you've updated the activation file.

:::image type="content" source="media/how-to-manage-individual-sensors/system-setting-screenshot.png" alt-text="The screenshot of the system settings.":::

You can continue to work with Defender for IoT features even if the activation file has expired. 

### About activation files for cloud-connected sensors

Sensors that are cloud connected are associated with the Defender for IoT hub. These sensors are not limited by time periods for the activation file. The activation file for cloud-connected sensors is used to ensure connection to the Defender for IoT hub.

### Upload new activation files

You might need to upload a new activation file for an onboarded sensor when:

- An activation file expires on a locally connected sensor. 

- You want to work in a different sensor management mode. 

- You want to assign a new Defender for IoT hub to a cloud-connected sensor.

To add a new activation file:

1. Go to the **Sensor Management** page.

2. Select the sensor for which you want to upload a new activation file.

3. Delete it.

4. Onboard the sensor again from the **Onboarding** page in the new mode or with a new Defender for IoT hub.

5. Download the activation file from the **Download Activation File** page.

6. Save the file.

    :::image type="content" source="media/how-to-manage-individual-sensors/download-activation-file.png" alt-text="Download the activation file from the Defender for IoT hub.":::

7. Sign in to the Defender for IoT sensor console.

8. In the sensor console, select **System Settings** > **Reactivation**.

    :::image type="content" source="media/how-to-manage-individual-sensors/reactivation.png" alt-text="Reactivation selection on the System Settings screen.":::

9. Select **Upload** and select the file that you saved.

    :::image type="content" source="media/how-to-manage-individual-sensors/upload-the-file.png" alt-text="Upload the file you saved.":::

10. Select **Activate**.

### Troubleshoot activation file upload

You'll receive an error message if the activation file could not be uploaded. The following events might have occurred:

- **For locally connected sensors**: The activation file is not valid. If the file is not valid, go to the Defender for IoT portal. On the **Sensor Management** page, select the sensor with the invalid file, and download a new activation file.

- **For cloud-connected sensors**: The sensor can't connect to the internet. Check the sensor's network configuration. If your sensor needs to connect through a web proxy to access the internet, verify that your proxy server is configured correctly on the **Sensor Network Configuration** screen. Verify that \*.azure-devices.net:443 is allowed in the firewall and/or proxy. If wildcards are not supported or you want more control, the FQDN for your specific Defender for IoT hub should be opened in your firewall and/or proxy. For details, see [Reference - IoT Hub endpoints](../iot-hub/iot-hub-devguide-endpoints.md).  

- **For cloud-connected sensors**: The activation file is valid but Defender for IoT rejected it. If you can't resolve this problem, you can download another activation from the Sites and  Sensors page of the Defender for IoT portal. If this doesn't work, contact Microsoft Support.

## Manage certificates

Following sensor installation, a local self-signed certificate is generated and used to access the sensor web application. When logging in to the sensor for the first time, Administrator users are prompted to provide an SSL/TLS certificate.  For more information about first-time setup, see [Sign in and activate a sensor](how-to-activate-and-set-up-your-sensor.md).

This article provides information on updating certificates, working with certificate CLI commands, and supported certificates and certificate parameters.

### About certificates

Azure Defender for IoT uses SSL/TLS certificates to:

- Meet specific certificate and encryption requirements requested by your organization by uploading the CA-signed certificate.

- Allow validation between the management console and connected sensors, and between a management console and a High Availability management console. Validations is evaluated against a Certificate Revocation List, and the certificate expiration date. *If validation fails, communication between the management console and the sensor is halted and a validation error is presented in the console*. This option is enabled by default after installation.

 Third party Forwarding rules, for example alert information sent to SYSLOG, Splunk or ServiceNow; or communications with Active Directory are not validated.

#### SSL certificates

The Defender for IoT sensor, and on-premises management console use SSL, and TLS certificates for the following functions: 

 - Secure communications between users, and the web console of the appliance. 
 
 - Secure communications to the REST API on the sensor and on-premises management console.
 
 - Secure communications between the sensors and an on-premises management console. 

Once installed, the appliance generates a local self-signed certificate to allow preliminary access to the web console. Enterprise SSL, and TLS certificates may be installed using the [`cyberx-xsense-certificate-import`](#cli-commands) command line tool.

 > [!NOTE]
 > For integrations and forwarding rules where the appliance is the client and initiator of the session, specific certificates are used and are not related to the system certificates.  
 >
 >In these cases, the certificates are typically received from the server, or use asymmetric encryption where a specific certificate will be provided to set up the integration.

Appliances may use unique certificate files. If you need to replace a certificate, you have uploaded;

- From version 10.0, the certificate can be replaced from the System Settings menu.

- For versions previous to 10.0, the SSL certificate can be replaced using the command line tool.

### Update certificates

Sensor Administrator users can update certificates.

To update a certificate:  

1. Select **System Settings**.

1. Select **SSL/TLS Certificates.**
1. Delete or edit the certificate and add a new one.

    - Add a certificate name.
    
    - Upload a CRT file and key file and enter a passphrase.
    - Upload a PEM file if necessary.

To change the validation setting:

1. Enable or Disable the **Enable Certificate Validation** toggle.

1. Select **Save**.

If the option is enabled and validation fails, communication between the management console and the sensor is halted and a validation error is presented in the console.

### Certificate Support

The following certificates are supported:

- Private and Enterprise Key Infrastructure (Private PKI)

- Public Key Infrastructure (Public PKI) 

- Locally generated on the appliance (locally self-signed). 

> [!IMPORTANT]
> We don't recommend using a self-signed certificates. This type of connection is not secure and should be used for test environments only. Since, the owner of the certificate can't be validated, and the security of your system can't be maintained, self-signed certificates should never be used for production networks.

### Supported SSL Certificates 

The following parameters are supported. 

**Certificate CRT**

- The primary certificate file for your domain name

- Signature Algorithm = SHA256RSA
- Signature Hash Algorithm = SHA256
- Valid from = Valid past date
- Valid To = Valid future date
- Public Key = RSA 2048 bits (Minimum) or 4096 bits
- CRL Distribution Point = URL to .crl file
- Subject CN = URL, can be a wildcard certificate; for example, Sensor.contoso.<span>com, or *.contoso.<span>com
- Subject (C)ountry = defined, for example, US
- Subject (OU) Org Unit = defined, for example, Contoso Labs
- Subject (O)rganization = defined, for example, Contoso Inc.

**Key File**

- The key file generated when you created CSR.

- RSA 2048 bits (Minimum) or 4096 bits.

 > [!Note]
 > Using a key length of 4096bits:
 > - The SSL handshake at the start of each connection will be slower.  
 > - There's an increase in CPU usage during handshakes. 

**Certificate Chain**

- The intermediate certificate file (if any) that was supplied by your CA

- The CA certificate that issued the server's certificate should be first in the file, followed by any others up to the root. 
- Can include Bag attributes.

**Passphrase**

- One key supported.

- Set up when you're importing the certificate.

Certificates with other parameters might work, but Microsoft doesn't support them.

#### Encryption key artifacts

**.pem – certificate container file**

Privacy Enhanced Mail (PEM) files were the general file type used to secure emails. Nowadays, PEM files are used with certificates and use x509 ASN1 keys.  

The container file is defined in RFCs 1421 to 1424, a container format that may include the public certificate only. For example, Apache installs, a CA certificate, files, ETC, SSL, or CERTS. This can include an entire certificate chain including public key, private key, and root certificates.  

It may also encode a CSR as the PKCS10 format, which can be translated into PEM.

**.cert .cer .crt – certificate container file**

A `.pem`, or `.der` formatted file with a different extension. The file is recognized by Windows Explorer as a certificate. The `.pem` file is not recognized by Windows Explorer.

**.key – Private Key File**

A key file is in the same format as a PEM file, but it has a different extension.

#### Additional commonly available key artifacts

**.csr - certificate signing request**.  

This file is used for submission to certificate authorities. The actual format is PKCS10, which is defined in RFC 2986, and may include some, or all of the key details of the requested certificate. For example, subject, organization, and state. It is the public key of the certificate that gets signed by the CA, and receives a certificate in return.  

The returned certificate is the public certificate, which includes the public key but not the private key. 

**.pkcs12 .pfx .p12 – password container**. 

Originally defined by RSA in the Public-Key Cryptography Standards (PKCS), the 12-variant was originally enhanced by Microsoft, and later submitted as RFC 7292.  

This container format requires a password that contains both public and private certificate pairs. Unlike `.pem` files, this container is fully encrypted.  

You can use OpenSSL to turn this into a `.pem` file with both public and private keys: `openssl pkcs12 -in file-to-convert.p12 -out converted-file.pem -nodes`  

**.der – binary encoded PEM**.

The way to encode ASN.1 syntax in binary, is through a `.pem` file, which is just a Base64 encoded `.der` file. 

OpenSSL can convert these files to a `.pem`: `openssl x509 -inform der -in to-convert.der -out converted.pem`.  

Windows will recognize these files as certificate files. By default, Windows will export certificates as `.der` formatted files with a different extension.  

**.crl - certificate revocation list**.  
Certificate authorities produce these files as a way to de-authorize certificates before their expiration.
 
##### CLI commands

Use the `cyberx-xsense-certificate-import` CLI command to import certificates. To use this tool, you need to upload certificate files to the device, by using tools such as WinSCP or Wget.

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

### Use OpenSSL to manage certificates

Manage your certificates with the following commands:

| Description | CLI Command |
|--|--|
| Generate a new private key and Certificate Signing Request | `openssl req -out CSR.csr -new -newkey rsa:2048 -nodes -keyout privateKey.key` |
| Generate a self-signed certificate | `openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt` |
| Generate a certificate signing request (CSR) for an existing private key | `openssl req -out CSR.csr -key privateKey.key -new` |
| Generate a certificate signing request based on an existing certificate | `openssl x509 -x509toreq -in certificate.crt -out CSR.csr -signkey privateKey.key` |
| Remove a passphrase from a private key | `openssl rsa -in privateKey.pem -out newPrivateKey.pem` |

If you need to check the information within a Certificate, CSR or Private Key, use these commands;

| Description | CLI Command |
|--|--|
| Check a Certificate Signing Request (CSR) | `openssl req -text -noout -verify -in CSR.csr` |
| Check a private key | `openssl rsa -in privateKey.key -check` |
| Check a certificate | `openssl x509 -in certificate.crt -text -noout`  |

If you receive an error that the private key doesn’t match the certificate, or that a certificate that you installed to a site is not trusted, use these commands to fix the error;

| Description | CLI Command |
|--|--|
| Check an MD5 hash of the public key to ensure that it matches with what is in a CSR or private key | 1. `openssl x509 -noout -modulus -in certificate.crt | openssl md5` <br /> 2. `openssl rsa -noout -modulus -in privateKey.key | openssl md5` <br /> 3. `openssl req -noout -modulus -in CSR.csr | openssl md5 ` |

To convert certificates and keys to different formats to make them compatible with specific types of servers, or software, use these commands;

| Description | CLI Command |
|--|--|
| Convert a DER file (.crt .cer .der) to PEM  | `openssl x509 -inform der -in certificate.cer -out certificate.pem`  |
| Convert a PEM file to DER | `openssl x509 -outform der -in certificate.pem -out certificate.der`  |
| Convert a PKCS#12 file (.pfx .p12) containing a private key and certificates to PEM | `openssl pkcs12 -in keyStore.pfx -out keyStore.pem -nodes` <br />You can add `-nocerts` to only output the private key, or add `-nokeys` to only output the certificates. |
| Convert a PEM certificate file and a private key to PKCS#12 (.pfx .p12) | `openssl pkcs12 -export -out certificate.pfx -inkey privateKey.key -in certificate.crt -certfile CACert.crt` |

## Connect a sensor to the management console

This section describes how to ensure connection between the sensor and the on-premises management console. You need to do this if you're working in an air-gapped network and want to send device and alert information to the management console from the sensor. This connection also allows the management console to push system settings to the sensor and perform other management tasks on the sensor.

To connect:

1. Sign in to the on-premises management console.

2. Select **System Settings**.

3. In the **Sensor Setup – Connection String** section, copy the automatically generated connection string.

   :::image type="content" source="media/how-to-manage-individual-sensors/connection-string-screen.png" alt-text="Copy the connection string from this screen."::: 

4. Sign in to the sensor console.

5. On the left pane, select **System Settings**.

6. Select **Management Console Connection**.

    :::image type="content" source="media/how-to-manage-individual-sensors/management-console-connection-screen.png" alt-text="Screenshot of the Management Console Connection dialog box.":::

7. Paste the connection string in the **Connection string** box and select **Connect**.

8. In the on-premises management console, in the **Site Management** window, assign the sensor to a zone.

## Change the name of a sensor

You can change the name of your sensor console. The new name will appear in the console web browser, in various console windows, and in troubleshooting logs.

The process for changing sensor names varies for locally connected sensors and cloud-connected sensors. The default name is **sensor**.

### Change the name of a locally connected sensor

To change the name:

1. In the bottom of the left pane of the console, select the current sensor label.

   :::image type="content" source="media/how-to-change-the-name-of-your-azure-consoles/label-name.png" alt-text="Screenshot that shows the sensor label.":::

1. In the **Edit sensor name** dialog box, enter a name.

1. Select **Save**. The new name is applied.

### Change the name of a cloud-connected sensor

If your sensor was registered as a cloud-connected sensor, the sensor name is defined by the name assigned during the registration. The name is included in the activation file that you uploaded when signing in for the first time. To change the name of the sensor, you need to upload a new activation file.

To change the name:

1. In the Azure Defender for IoT portal, go to the Sites and Sensors page.

1. Delete the sensor from the Sites and Sensors page.

1. Register with the new name by selecting **Onboard sensor** from the Getting Started page.

1. Download the new activation file.

1. Sign in to the Defender for IoT sensor console.

1. In the sensor console, select **System Settings** and then select **Reactivation**.

   :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/reactivate.png" alt-text="Upload your activation file to reactivate the sensor.":::

1. Select **Upload** and select the file you saved.

1. Select **Activate**.

## Update the sensor network configuration

The sensor network configuration was defined during the sensor installation. You can change configuration parameters. You can also set up a proxy configuration.

If you create a new IP address, you might be required to sign in again.

To change the configuration:

1. On the side menu, select **System Settings**.

2. In the **System Settings** window, select **Network**.

    :::image type="content" source="media/how-to-manage-individual-sensors/edit-network-configuration-screen.png" alt-text="Configure your network settings.":::

3. Set the parameters:

    | Parameter | Description |
    |--|--|
    | IP address | The sensor IP address |
    | Subnet mask | The mask address |
    | Default gateway | The default gateway address |
    | DNS | The DNS server address |
    | Hostname | The sensor hostname |
    | Proxy | Proxy host and port name |

4. Select **Save**.

## Synchronize time zones on the sensor

You can configure the sensor's time and region so that all the users see the same time and region.

:::image type="content" source="media/how-to-manage-individual-sensors/time-and-region.png" alt-text="Configure the time and region.":::

| Parameter | Description |
|--|--|
| Timezone | The time zone definition for:<br />- Alerts<br />- Trends and statistics widgets<br />- Data mining reports<br />   -Risk assessment reports<br />- Attack vectors |
| Date format | Select one of the following format options:<br />- dd/MM/yyyy HH:mm:ss<br />- MM/dd/yyyy HH:mm:ss<br />- yyyy/MM/dd HH:mm:ss |
| Date and time | Displays the current date and local time in the format that you selected.<br />For example, if your actual location is America and New York, but the time zone is set to Europe and Berlin, the time is displayed according to Berlin local time. |

To configure the sensor time:

1. On the side menu, select **System Settings**.

2. In the **System Settings** window, select **Time & Regional**.

3. Set the parameters and select **Save**.

## Set up backup and restore files

System backup is performed automatically at 3:00 AM daily. The data is saved on a different disk in the sensor. The default location is `/var/cyberx/backups`.

You can automatically transfer this file to the internal network.

> [!NOTE]
> - The backup and restore procedure can be performed between the same versions only.
> - In some architectures, the backup is disabled. You can enable it in the `/var/cyberx/properties/backup.properties` file.

When you control a sensor by using the on-premises management console, you can use the sensor's backup schedule to collect these backups and store them on the management console or on an external backup server.

**What is backed up:** Configurations and data.

**What is not backed up:** PCAP files and logs. You can manually back up and restore PCAPs and logs.

Sensor backup files are automatically named through the following format: `<sensor name>-backup-version-<version>-<date>.tar`. An example is `Sensor_1-backup-version-2.6.0.102-2019-06-24_09:24:55.tar`.

To configure backup:

- Sign in to an administrative account and enter `$ sudo cyberx-xsense-system-backup`.

To restore the latest backup file:

- Sign in to an administrative account and enter `$ sudo cyberx-xsense-system-restore`.

To save the backup to an external SMB server:

1. Create a shared folder in the external SMB server.

    Get the folder path, username, and password required to access the SMB server.

2. In the sensor, make a directory for the backups:

    - `sudo mkdir /<backup_folder_name_on_cyberx_server>`

    - `sudo chmod 777 /<backup_folder_name_on_cyberx_server>/`

3. Edit `fstab`:

    - `sudo nano /etc/fstab`

    - `add - //<server_IP>/<folder_path> /<backup_folder_name_on_cyberx_server> cifsrw,credentials=/etc/samba/user,vers=X.X,uid=cyberx,gid=cyberx,file_mode=0777,dir_mode=0777 0 0`

4. Edit and create credentials to share for the SMB server:

    `sudo nano /etc/samba/user` 

5. Add:

    - `username=&gt:user name&lt:`

    - `password=<password>`

6. Mount the directory:

    `sudo mount -a`

7. Configure a backup directory to the shared folder on the Defender for IoT sensor:  

    - `sudo nano /var/cyberx/properties/backup.properties`

    - `set backup_directory_path to <backup_folder_name_on_cyberx_server>`

### Restore sensors

You can restore backups from the sensor console and by using the CLI.

**To restore from the console:**

- Select **Restore Image** from the sensor's **System Settings** window.

:::image type="content" source="media/how-to-manage-individual-sensors/restore-image-screen.png" alt-text="Restore your image by selecting the button.":::

The console will display restore failures.

**To restore by using the CLI:**

- Sign in to an administrative account and enter `$ sudo cyberx-management-system-restore`.

## Update a standalone sensor version

The following procedure describes how to update a standalone sensor by using the sensor console. The update process takes about 30 minutes.

1. Go to the [Azure portal](https://portal.azure.com/).

2. Go to Defender for IoT.

3. Go to the **Updates** page.

   :::image type="content" source="media/how-to-manage-individual-sensors/updates-page.png" alt-text="Screenshot of the Updates page of Defender for IoT.":::

4. Select **Download** from the **Sensors** section and save the file.

5. In the sensor console's sidebar, select **System Settings**.

6. On the **Version Upgrade** pane, select **Upgrade**.

    :::image type="content" source="media/how-to-manage-individual-sensors/upgrade-pane-v2.png" alt-text="Screenshot of the upgrade pane.":::

7. Select the file that you downloaded from the Defender for IoT **Updates** page.

8. The update process starts, during which time the system is rebooted twice. After the first reboot (before the completion of the update process), the system opens with the sign-in window. After you sign in, the upgrade version appears at the lower left of the sidebar.

    :::image type="content" source="media/how-to-manage-individual-sensors/defender-for-iot-version.png" alt-text="Screenshot of the upgrade version that appears after you sign in.":::

## Forward sensor failure alerts

You can forward alerts to third parties to provide details about:

- Disconnected sensors

- Remote backup failures

This information is sent when you create a forwarding rule for system notifications.

> [!NOTE]
> Administrators can send system notifications.

To send notifications:

1. Sign in to the on-premises management console.
1. Select **Forwarding** from the side menu.
1. Create a forwarding rule.
1. Select **Report System Notifications**.

For more information about forwarding rules, see [Forward alert information](how-to-forward-alert-information-to-partners.md).

## Adjust system properties

System properties control various operations and settings in the sensor. Editing or modifying them might damage the operation of the sensor console.

Consult with [Microsoft Support](https://support.microsoft.com/) before you change your settings.

To access system properties:

1. Sign in to the on-premises management console or the sensor.

2. Select **System Settings**.

3. Select **System Properties** from the **General** section.

## See also

[Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md)

[Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)