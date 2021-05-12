---
title: Manage the on-premises management console 
description: Learn about on-premises management console options like backup and restore, defining the host name, and setting up a proxy to sensors.
ms.date: 1/12/2021
ms.topic: article
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

- Allow validation between the management console and connected sensors, and between a management console and a high-availability management console. Validation is evaluated against a certificate revocation list and the certificate expiration date. *If validation fails, communication between the management console and the sensor is halted and a validation error appears in the console*. This option is enabled by default after installation.

Third-party forwarding rules aren't validated. Examples are alert information sent to SYSLOG, Splunk, or ServiceNow; and communication with Active Directory.

#### SSL certificates

The Defender for IoT sensor, and on-premises management console use SSL, and TLS certificates for the following functions: 

 - Secure communications between users, and the web console of the appliance. 
 
 - Secure communications to the REST API on the sensor and on-premises management console.
 
 - Secure communications between the sensors and an on-premises management console. 

Once installed, the appliance generates a local self-signed certificate to allow preliminary access to the web console. Enterprise SSL, and TLS certificates may be installed using the [`cyberx-xsense-certificate-import`](#cli-commands) command-line tool. 

 > [!NOTE]
 > For integrations and forwarding rules where the appliance is the client and initiator of the session, specific certificates are used and are not related to the system certificates.  
 >
 >In these cases, the certificates are typically received from the server, or use asymmetric encryption where a specific certificate will be provided to set up the integration. 

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
  > We don't recommend using a self-signed certificates. This type of connection is not secure and should be used for test environments only. Since, the owner of the certificate can't be validated, and the security of your system can't be maintained, self-signed certificates should never be used for production networks.

### Supported SSL Certificates 

The following parameters are supported: 

**Certificate CRT**

- The primary certificate file for your domain name

- Signature Algorithm = SHA256RSA
- Signature Hash Algorithm = SHA256
- Valid from = Valid past date
- Valid To = Valid future date
- Public Key = RSA 2048 bits (Minimum) or 4096 bits
- CRL Distribution Point = URL to .crl file
- Subject CN = URL, can be a wildcard certificate; for example, Sensor.contoso.<span>com,or *.contoso.<span>com
- Subject (C)ountry = defined, for example, US
- Subject (OU) Org Unit = defined; for example, Contoso Labs
- Subject (O)rganization = defined; for example, Contoso Inc

**Key file**

- The key file generated when you created the CSR

- RSA 2048 bits (minimum) or 4096 bits

 > [!Note]
 > Using a key length of 4096bits:
 > - The SSL handshake at the start of each connection will be slower.  
 > - There's an increase in CPU usage during handshakes. 

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

Privacy Enhanced Mail (PEM) files were the general file type used to secure emails. Nowadays, PEM files are used with certificates and use x509 ASN1 keys.  

The container file is defined in RFCs 1421 to 1424, a container format that may include the public certificate only. For example, Apache installs, a CA certificate, files, ETC, SSL, or CERTS. This can include an entire certificate chain including public key, private key, and root certificates.  

It may also encode a CSR as the PKCS10 format, which can be translated into PEM.

**.cert .cer .crt: certificate container file**

A `.pem`, or `.der` formatted file with a different extension. The file is recognized by Windows Explorer as a certificate. The `.pem` file is not recognized by Windows Explorer.

**.key: private key file**

A key file is in the same format as a PEM file, but it has a different extension. 

#### Additional commonly available key artifacts

**.csr - certificate signing request**.  

This file is used for submission to certificate authorities. The actual format is PKCS10, which is defined in RFC 2986, and may include some, or all of the key details of the requested certificate. For example, subject, organization, and state. It is the public key of the certificate that gets signed by the CA, and receives a certificate in return.  

The returned certificate is the public certificate, which includes the public key but not the private key. 

**.pkcs12 .pfx .p12 – password container**. 

Originally defined by RSA in the Public-Key Cryptography Standards (PKCS), the 12-variant was originally enhanced by Microsoft, and later submitted as RFC 7292.  

This container format requires a password that contains both public and private certificate pairs. Unlike `.pem` files, this container is fully encrypted.  

You can use OpenSSL to turn the file into a `.pem` file with both public and private keys: `openssl pkcs12 -in file-to-convert.p12 -out converted-file.pem -nodes`  

**.der – binary encoded PEM**.

The way to encode ASN.1 syntax in binary, is through a `.pem` file, which is just a Base64 encoded `.der` file. 

OpenSSL can convert these files to a `.pem`: `openssl x509 -inform der -in to-convert.der -out converted.pem`.  

Windows will recognize these files as certificate files. By default, Windows will export certificates as `.der` formatted files with a different extension.

**.crl - certificate revocation list**.  

Certificate authorities produce these as a way to de-authorize certificates before their expiration. 

#### CLI commands

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

## Mail server settings

Define SMTP mail server settings for the on-premises management console.

To define:

1. Sign in to the CLI for the on-premises management with administrative credentials.
1. Type ```nano /var/cyberx/properties/remote-interfaces.properties```.
1. Select enter. The following prompts appear.
```mail.smtp_server= ```
```mail.port=25 ```
```mail.sender=```
1. Enter the SMTP server name  and sender and select enter.

## See also

[Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)

[Manage individual sensors](how-to-manage-individual-sensors.md)
