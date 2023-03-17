---
title: Deploy SSL/TLS certificates on OT appliances - Microsoft Defender for IoT.
description: Learn how to deploy SSL/TLS certificates on Microsoft Defender for IoT OT network sensors and on-premises management consoles.
ms.date: 01/05/2023
ms.topic: install-set-up-deploy
---

# Deploy SSL/TLS certificates on OT appliances

This article describes how to create and deploy SSL/TLS certificates on OT network sensors and on-premises management consoles. Defender for IoT uses SSL/TLS certificates to secure communication between the following system components:

- Between users and the OT sensor or on-premises management console UI access
- Between OT sensors and an on-premises management console, including [API communication](references-work-with-defender-for-iot-apis.md)
- Between an on-premises management console and a high availability (HA) server, if configured
- Between OT sensors or on-premises management consoles and partners servers defined in [alert forwarding rules](how-to-forward-alert-information-to-partners.md)

You can deploy SSL/TLS certificates during initial configuration as well as later on.

Defender for IoT validates certificates against the certificate expiration date and against a passphrase, if one is defined. Validations against a Certificate Revocation List (CRL) and the certificate trust chain are available as well, though not mandatory. Invalid certificates can't be uploaded to OT sensors or on-premises management consoles, and will block encrypted communication between Defender for IoT components.

Each certificate authority (CA)-signed certificate must have both a `.key` file and a `.crt` file, which are uploaded to OT network sensors and on-premises management consoles after the first sign-in. While some organizations may also require a `.pem` file, a `.pem` file isn't required for Defender for IoT.

Make sure to create a unique certificate for each OT sensor, on-premises management console, and HA server, where each certificate meets required parameter criteria.

## Prerequisites

To perform the procedures described in this article, make sure that:

- You have a security, PKI or certificate specialist available to oversee the certificate creation
- You can access the OT network sensor or on-premises management console as an **Admin** user.

    For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Deploy an SSL/TLS certificate

Deploy your SSL/TLS certificate by importing it to your OT sensor or on-premises management console.

Verify that your SSL/TLS certificate [meets the required parameters](#verify-certificate-file-parameter-requirements), and that you have [access to a CRL server](#verify-crl-server-access).

### Deploy a certificate on an OT sensor

1. Sign into your OT sensor and select **System settings** > **Basic** > **SSL/TLS certificate**.

1. In the **SSL/TLS certificate** pane, select one of the following, and then follow the instructions in the relevant tab:

    - **Import a trusted CA certificate (recommended)**
    - **Use Locally generated self-signed certificate (Not recommended)**

    # [Trusted CA certificates](#tab/import-trusted-ca-certificate)
    
    1. Enter the following parameters:
    
        | Parameter  | Description  |
        |---------|---------|
        | **Certificate Name**     |   Enter your certificate name.      |
        | **Passphrase** - *Optional*    |  Enter a passphrase.       |
        | **Private Key (KEY file)**     |  Upload a Private Key (KEY file).       |
        | **Certificate (CRT file)**     | Upload a Certificate (CRT file).        |
        | **Certificate Chain (PEM file)** - *Optional*     |  Upload a Certificate Chain (PEM file).       |
    
        Select **Use CRL (Certificate Revocation List) to check certificate status** to validate the certificate against a [CRL server](#verify-crl-server-access). The certificate is checked once during the import process.

        For example:

        :::image type="content" source="media/how-to-deploy-certificates/recommended-ssl.png" alt-text="Screenshot of importing a trusted CA certificate." lightbox="media/how-to-deploy-certificates/recommended-ssl.png":::
    
    # [Locally generated self-signed certificates](#tab/locally-generated-self-signed-certificate)
    
    > [!NOTE]
    > Using self-signed certificates in a production environment is not recommended, as it leads to a less secure environment.
    > We recommend using self-signed certificates in test environments only.
    > The owner of the certificate cannot be validated and the security of your system cannot be maintained.

    Select **Confirm** to acknowledge the warning.

    ---

1. In the **Validation for on-premises management console certificates** area, select **Required** if SSL/TLS certificate validation is required. Otherwise, select **None**.

1. Select **Save** to save your certificate settings.

### Deploy a certificate on an on-premises management console

1. Sign into your on-premises management console and select **System settings** > **SSL/TLS certificates**.

1. In the **SSL/TLS certificate** pane, select one of the following, and then follow the instructions in the relevant tab:

    - **Import a trusted CA certificate**
    - **Use Locally generated self-signed certificate (Insecure, not recommended)**

    # [Trusted CA certificates](#tab/cm-import-trusted-ca-certificate)
    
    1. In the **SSL/TLS Certificates** dialog, select **Add Certificate**.

    1. Enter the following parameters:
    
        | Parameter  | Description  |
        |---------|---------|
        | **Certificate Name**     |   Enter your certificate name.      |
        | **Passphrase** - *Optional*    |  Enter a passphrase.       |
        | **Private Key (KEY file)**     |  Upload a Private Key (KEY file).       |
        | **Certificate (CRT file)**     | Upload a Certificate (CRT file).        |
        | **Certificate Chain (PEM file)** - *Optional*    |  Upload a Certificate Chain (PEM file).       |

        For example:

        :::image type="content" source="media/how-to-deploy-certificates/management-ssl-certificate.png" alt-text="Screenshot of importing a trusted CA certificate." lightbox="media/how-to-deploy-certificates/management-ssl-certificate.png":::

    # [Locally generated self-signed certificates](#tab/cm-locally-generated-self-signed-certificate)
    
    > [!NOTE]
    > Using self-signed certificates in a production environment is not recommended, as it leads to a less secure environment.
    > We recommend using self-signed certificates in test environments only.
    > The owner of the certificate cannot be validated and the security of your system cannot be maintained.

    Select **I CONFIRM** to acknowledge the warning.

    ---

1. Select the **Enable Certificate Validation** option to turn on system-wide validation for SSL/TLS certificates with the issuing [Certificate Authority](#create-ca-signed-ssltls-certificates) and [Certificate Revocation Lists](#verify-crl-server-access).

1. Select **SAVE** to save your certificate settings.

You can also [import the certificate to your OT sensor using CLI commands](references-work-with-defender-for-iot-cli-commands.md#tlsssl-certificate-commands).

### Verify certificate file parameter requirements

Verify that the certificates meet the following requirements:

- **CRT file requirements**:

    | Field | Requirement |
    |---------|---------|
    | **Signature Algorithm** | SHA256RSA |
    | **Signature Hash Algorithm** | SHA256 |
    | **Valid from** | A  valid past date |
    | **Valid To** | A valid future date |
    | **Public Key** | RSA 2048 bits (Minimum) or 4096 bits |
    | **CRL Distribution Point** | URL to a CRL server. If your organization doesn't [validate certificates against a CRL server](#verify-crl-server-access), remove this line from the certificate. |
    | **Subject CN (Common Name)** | domain name of the appliance, such as *sensor.contoso.com*, or *.contoso.com* |
    | **Subject (C)ountry** | Certificate country code, such as `US` |
    | **Subject (OU) Org Unit** | The organization's unit name, such as *Contoso Labs* |
    | **Subject (O)rganization** | The organization's name, such as *Contoso Inc.* |

    > [!IMPORTANT]
    > While certificates with other parameters might work, they aren't supported by Defender for IoT. Additionally, wildcard SSL certificates, which are public key certificates that can be used on multiple subdomains such as *.contoso.com*, are insecure and aren't supported.
    > Each appliance must use a unique CN.

- **Key file requirements**: Use either RSA 2048 bits or 4096 bits. Using a key length of 4096 bits will slow down the SSL handshake at the start of each connection, and increase the CPU usage during handshakes.

- (Optional) Create a certificate chain, which is a `.pem` file that contains the certificates of all the certificate authorities in the chain of trust that led to your certificate. Certificate chain files support bag attributes.

### Verify CRL server access

If your organization validates certificates, your OT sensors and on-premises management console must be able to access the CRL server defined by the certificate.  By default, certificates access the CRL server URL via HTTP port 80. However, some organizational security policies block access to this port.

If your OT sensors and on-premises management consoles can't access your CRL server on port 80, you can use one of the following workarounds:

- **Define another URL and port in the certificate**:

  - The URL you define must be configured as `http: //` and not `https://`
  - Make sure that the destination CRL server can listen on the port you define

- **Use a proxy server that can access the CRL on port 80**

    For more information, see [Forward OT alert information](how-to-forward-alert-information-to-partners.md).

If validation fails, communication between the relevant components is halted and a validation error is presented in the console.

## Create a certificate

Create either a CA-signed SSL/TLS certificate or a self-signed SSL/TLS certificate (not recommended).

### Create CA-signed SSL/TLS certificates

Use a certificate management platform, such as an automated PKI management platform, to create a certificate. Verify that the certificate meets [certificate file requirements](#verify-certificate-file-parameter-requirements), and then [test the certificate](#test-your-ssltls-certificates) file you created when you're done.

If you aren't carrying out certificate validation, remove the CRL URL reference in the certificate. For more information, see [certificate file requirements](#verify-certificate-file-parameter-requirements).

Consult a security, PKI, or other qualified certificate lead if you don't have an application that can automatically create certificates.

You can also convert existing certificate files if you don't want to create new ones.

### Create self-signed SSL/TLS certificates

Create self-signed SSL/TLS certificates by first [downloading a security certificate](#download-a-security-certificate) from the OT sensor or on-premises management console and then exporting it to the required file types.

> [!NOTE]
> While you can use a locally-generated and self-signed certificate, we do not recommend this option.

**Export as a certificate file:**

After downloading the security certificate, use a certificate management platform to create the following types of SSL/TLS certificate files:

| File type  | Description  |
|---------|---------|
| **.crt – certificate container file** | A `.pem`, or `.der` file, with a different extension for support in Windows Explorer.|
| **.key – Private key file** | A key file is in the same format as a `.pem` file, with a different extension for support in Windows Explorer.|
| **.pem – certificate container file (optional)** | Optional. A text file with a Base64-encoding of the certificate text, and a plain-text header and footer to mark the beginning and end of the certificate. |

For example:

1. Open the downloaded certificate file and select the **Details** tab > **Copy to file** to run the **Certificate Export Wizard**.

1. In the **Certificate Export Wizard**, select **Next** > **DER encoded binary X.509 (.CER)** > and then select **Next** again.

1. In the **File to Export** screen, select **Browse**, choose a location to store the certificate, and then select **Next**.

1. Select **Finish** to export the certificate.

> [!NOTE]
> You may need to convert existing files types to supported types.

### Check your certificate against a sample

Use the following sample certificate to compare to the certificate you've created, making sure that the same fields exist in the same order.

``` Sample SSL certificate
Bag Attributes: <No Attributes>
subject=C = US, S = Illinois, L = Springfield, O = Contoso Ltd, OU= Contoso Labs, CN= sensor.contoso.com, E 
= support@contoso.com
issuer C=US, S = Illinois, L = Springfield, O = Contoso Ltd, OU= Contoso Labs, CN= Cert-ssl-root-da2e22f7-24af-4398-be51-
e4e11f006383, E = support@contoso.com
-----BEGIN CERTIFICATE-----
MIIESDCCAZCgAwIBAgIIEZK00815Dp4wDQYJKoZIhvcNAQELBQAwgaQxCzAJBgNV 
BAYTAIVTMREwDwYDVQQIDAhJbGxpbm9pczEUMBIGA1UEBwwLU3ByaW5nZmllbGQx
FDASBgNVBAoMCONvbnRvc28gTHRKMRUWEwYDVQQLDAXDb250b3NvIExhYnMxGzAZ
BgNVBAMMEnNlbnNvci5jb250b3NvLmNvbTEIMCAGCSqGSIb3DQEJARYTc3VwcG9y
dEBjb250b3NvLmNvbTAeFw0yMDEyMTcxODQwMzhaFw0yMjEyMTcxODQwMzhaMIGK
MQswCQYDVQQGEwJVUzERMA8GA1UECAwISWxsaW5vaXMxFDASBgNVBAcMC1Nwcmlu 
Z2ZpZWxkMRQwEgYDVQQKDAtDb250b3NvIEX0ZDEVMBMGA1UECwwMQ29udG9zbyBM 
YWJzMRswGQYDVQQDDBJzZW5zb3luY29udG9zby5jb20xljAgBgkqhkiG9w0BCQEW 
E3N1cHBvcnRAY29udG9zby5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK 
AoIBAQDRGXBNJSGJTfP/K5ThK8vGOPzh/N8AjFtLvQiiSfkJ4cxU/6d1hNFEMRYG
GU+jY1Vknr0|A2nq7qPB1BVenW3 MwsuJZe Floo123rC5ekzZ7oe85Bww6+6eRbAT 
WyqpvGVVpfcsloDznBzfp5UM9SVI5UEybllod31MRR/LQUEIKLWILHLW0eR5pcLW 
pPLtOW7wsK60u+X3tqFo1AjzsNbXbEZ5pnVpCMqURKSNmxYpcrjnVCzyQA0C0eyq
GXePs9PL5DXfHy1x4WBFTd98X83 pmh/vyydFtA+F/imUKMJ8iuOEWUtuDsaVSX0X
kwv2+emz8CMDLsbWvUmo8Sg0OwfzAgMBAAGjfDB6MB0GA1UdDgQWBBQ27hu11E/w 
21Nx3dwjp0keRPuTsTAfBgNVHSMEGDAWgBQ27hu1lE/w21Nx3dwjp0keRPUTSTAM
BgNVHRMEBTADAQH/MAsGA1UdDwQEAwIDqDAdBgNVHSUEFjAUBggrBgEFBQcDAgYI
KwYBBQUHAwEwDQYJKoZIhvcNAQELBQADggEBADLsn1ZXYsbGJLLzsGegYv7jmmLh
nfBFQqucORSQ8tqb2CHFME7LnAMfzFGpYYV0h1RAR+1ZL1DVtm+IKGHdU9GLnuyv
9x9hu7R4yBh3K99ILjX9H+KACvfDUehxR/ljvthoOZLalsqZIPnRD/ri/UtbpWtB 
cfvmYleYA/zq3xdk4vfOI0YTOW11qjNuBIHh0d5S5sn+VhhjHL/s3MFaScWOQU3G 
9ju6mQSo0R1F989aWd+44+8WhtOEjxBvr+17CLqHsmbCmqBI7qVnj5dHvkh0Bplw 
zhJp150DfUzXY+2sV7Uqnel9aEU2Hlc/63EnaoSrxx6TEYYT/rPKSYL+++8=
-----END CERTIFICATE-----
```

### Test your SSL/TLS certificates

If you want to check the information within the certificate `.csr` file or private key file, use the following CLI commands:

- **Check a Certificate Signing Request (CSR)**: Run `openssl req -text -noout -verify -in CSR.csr`
- **Check a private key**: Run  `openssl rsa -in privateKey.key -check`
- **Check a certificate**: Run `openssl x509 -in certificate.crt -text -noout`

If these tests fail, review [certificate file parameter requirements](#verify-certificate-file-parameter-requirements) to verify that your file parameters are accurate, or consult your certificate specialist.

## Troubleshoot

### Download a security certificate

1. After [installing your OT sensor software](ot-deploy/install-software-ot-sensor.md) or [on-premises management console](ot-deploy/install-software-on-premises-management-console.md), go to the sensor's or on-premises management console's IP address in a browser.

1. Select the :::image type="icon" source="media/how-to-deploy-certificates/warning-icon.png" border="false"::: **Not secure** alert in the address bar of your web browser, then select the **>** icon next to the warning message **"Your connection to this site isn't secure"**. For example:

    :::image type="content" source="media/how-to-deploy-certificates/connection-is-not-secure.png" alt-text="Screenshot of web page with a Not secure warning in the address bar." lightbox="media/how-to-deploy-certificates/connection-is-not-secure.png":::

1. Select the :::image type="icon" source="media/how-to-deploy-certificates/show-certificate-icon.png" border="false"::: **Show certificate** icon to view the security certificate for this website.

1. In the **Certificate viewer** pane, select the **Details** tab, then select **Export** to save the file on your local machine.

### Import a sensor's locally signed certificate to your certificate store

After creating your locally signed certificate, import it to a trusted storage location. For example:

1. Open the security certificate file and, in the **General** tab, select **Install Certificate** to start the **Certificate Import Wizard**.

1. In **Store Location**, select **Local Machine**, then select **Next**.

1. If a **User Allow Control** prompt appears, select **Yes** to allow the app to make changes to your device.

1. In the **Certificate Store** screen, select **Automatically select the certificate store based on the type of certificate**, then select **Next**.

1. Select **Place all certificates in the following store**, then **Browse**, and then select the **Trusted Root Certification Authorities** store. When you're done, select **Next**. For example:

    :::image type="content" source="media/how-to-deploy-certificates/certificate-store-trusted-root.png" alt-text="Screenshot of the certificate store screen where you can browse to the trusted root folder." lightbox="media/how-to-deploy-certificates/certificate-store-trusted-root.png":::

1. Select **Finish** to complete the import.

### Validate the certificate's common name

1. To view the certificate's common name, open the certificate file and select the Details tab, and then select the **Subject** field.

    The certificate's common name will then appear next to **CN**.

1. Sign-in to your sensor console without a secure connection. In the **Your connection isn't private** warning screen, you might see a **NET::ERR_CERT_COMMON_NAME_INVALID** error message.

1. Select the error message to expand it, and then copy the string next to **Subject**. For example:

    :::image type="content" source="media/how-to-deploy-certificates/connection-is-not-private-subject.png" alt-text="Screenshot of the connection isn't private screen with the details expanded." lightbox="media/how-to-deploy-certificates/connection-is-not-private-subject.png":::

    The subject string should match the **CN** string in the security certificate's details.

1. In your local file explorer, browse to the hosts file, such as at **This PC > Local Disk (C:) > Windows > System32 > drivers > etc**, and open the **hosts** file.

1. In the hosts file, add in a line at the end of document with the sensor's IP address and the SSL certificate's common name that you copied in the previous steps. When you're done, save the changes. For example:

    :::image type="content" source="media/how-to-deploy-certificates/hosts-file.png" alt-text="Screenshot of the hosts file." lightbox="media/how-to-deploy-certificates/hosts-file.png":::

### Troubleshoot certificate upload errors

You won't be able to upload certificates to your OT sensors or on-premises management consoles if the certificates aren't created properly or are invalid. Use the following table to understand how to take action if your certificate upload fails and an error message is shown:

| **Certificate validation error** | **Recommendation** |
|--|--|
| **Passphrase does not match to the key** | Make sure you have the correct passphrase. If the problem continues, try recreating the certificate using the correct passphrase. |
| **Cannot validate chain of trust. The provided Certificate and Root CA don't match.**  | Make sure a `.pem` file correlates to the  `.crt` file. <br> If the problem continues, try recreating the certificate using the correct chain of trust, as defined by the `.pem` file. |
| **This SSL certificate has expired and isn't considered valid.**  | Create a new certificate with valid dates.|
|**This certificate has been revoked by the CRL and can't be trusted for a secure connection** | Create a new unrevoked certificate. |
|**The CRL (Certificate Revocation List) location is not reachable. Verify the URL can be accessed from this appliance** | Make sure that your network configuration allows the sensor or on-premises management console to reach the CRL server defined in the certificate. <br> For more information, see [CRL server access](#verify-crl-server-access). |
|**Certificate validation failed**  | This indicates a general error in the appliance. <br> Contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c8f35-1b8e-f274-ec11-c6efdd6dd099).|

## Next steps

For more information, see:

- [Identify required appliances](how-to-identify-required-appliances.md)
- [Manage individual sensors](how-to-manage-individual-sensors.md)
- [Manage the on-premises management console](how-to-manage-the-on-premises-management-console.md)
