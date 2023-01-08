---
title: Setting SSL/TLS appliance certificates
description: Learn how to set up and deploy certificates for Defender for IoT.
ms.date: 01/05/2023
ms.topic: how-to
---

# Creating certificates for appliance encryption and authentication (OT appliances)

This article provides instructions needed when creating and deploying certificates for Microsoft Defender for IoT. A security, PKI or other qualified certificate lead should handle certificate creation and deployment.

Defender for IoT uses SSL/TLS certificates to secure communication between the following system components:

- Between users and the web console of the appliance.
- Between the sensors and an on-premises management console.
- Between a management console and a High Availability management console.
- To the REST API on the sensor and on-premises management console.

Defender for IoT Admin users can upload a certificate  to sensor consoles and their on-premises management console from the SSL/TLS Certificates dialog box.

:::image type="content" source="media/how-to-activate-and-set-up-your-sensor/wizard-upload-activation-certificates-1.png" alt-text="Screenshot of an initial sensor sign-in certificate page.":::

## Certificate deployment prerequisites

This section describes the steps you need to take to ensure that certificate deployment runs smoothly.

**To deploy certificates, verify that:**

- A security, PKI or certificate specialist is creating or overseeing certificate creation.
- You create a unique certificate for each sensor, management console and HA machine.
- You meet [Supported SSL certificates](about-certificates.md#supported-ssl-certificates).
- Admin users logging in to each Defender for IoT sensor, and on-premises management console and HA machine have access to the certificate.

## Create SSL certificates

Use a certificate management platform to create a certificate, for example, an automated PKI management platform. Verify that the certificates meet certificate file requirements. For more information on testing the files you create, see [Test certificates you create](#test-certificates-you-create).  

If you aren't carrying out certificate validation, remove the CRL URL reference in the certificate. See [CRT file requirements](about-certificates.md#crt-file-requirements) for information about this parameter.

Consult a security, PKI, or other qualified certificate lead if you don't have an application that can automatically create certificates.

You can [Test certificates you create](#test-certificates-you-create).  

You can also convert existing certificate files if you don't want to create new ones. See [Convert existing files to supported files](#convert-existing-files-to-supported-files) for details.

### Sample Certificate

Compare your certificate to the following sample certificate. Verify that the same fields exits and that the order of the fields is the same:

:::image type="content" source="media/how-to-deploy-certificates/sample-certificate.png" alt-text="Screenshot of a sample certificate.":::

## Import SSL certificates

In order to import an SSL certificate, you'll first need to download a security certificate from the sensor's console using a web browser. You can then export the certificate locally and in the appropriate file format, and then import the certificate by installing it on a trusted store.

**To import the SSL certificate:**

1. Sign-in to your sensor console, using the sensor's IP address, without a secure connection.

1. Select the :::image type="icon" source="media/how-to-activate-and-set-up-your-sensor/warning-icon.png" border="false"::: **Not secure** alert in the address bar of your web browser, then select the **>** icon next to the warning message **"Your connection to this site isn't secure"**. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/connection-is-not-secure.png" alt-text="Screenshot of web page with a Not secure warning in the address bar.":::

1. Select the :::image type="icon" source="media/how-to-activate-and-set-up-your-sensor/show-certificate-icon.png" border="false"::: **Show certificate** icon to view the security certificate for this website. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/show-certificate.png" alt-text="Screenshot of where to view the security certificate.":::

1. In the **Certificate viewer** pane, select the **Details** tab, then select **Export** to save the file on your local machine. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/export-certificate.png" alt-text="Screenshot of where to export the security certificate.":::

1. Open the security certificate file you downloaded and select the **Details** tab, then select **Copy to file** to run the **Certificate Export Wizard**. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/certificate-copy-to-file.png" alt-text="Screenshot of the security certificate details tab.":::

1. In the **Certificate Export Wizard**, select **Next**.

1. In the **Export File Format** screen, select **DER encoded binary X.509 (.CER)**, then select **Next**. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/export-wizard-der-encoded.png" alt-text="Screenshot of the export file format screen.":::

1. In the **File to Export** screen, select **Browse**, choose a location to store the certificate, and then select **Next**.

1. Select **Finish** to export the certificate.

1. To check the certificate's common name, open the security certificate file again and select the **Details** tab, then select the **Subject** field.

    The certificate's common name will then appear next to **CN**. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/certificate-cn.png" alt-text="Screenshot of the certificate's common name.":::

1. Open the security certificate file and, in the **General** tab, select **Install Certificate** to start the **Certificate Import Wizard**. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/install-certificate-wizard.png" alt-text="Screenshot of where to start the install certificate wizard.":::

1. In **Store Location**, select **Local Machine**, then select **Next**.

1. If a **User Allow Control** prompt appears, select **Yes** to allow the app to make changes to your device.

1. In the **Certificate Store** screen, select **Automatically select the certificate store based on the type of certificate**, then select **Next**. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/certificate-store-screen.png" alt-text="Screenshot of the certificate store screen.":::

1. Select **Place all certificates in the following store**, then **Browse**, and then select the **Trusted Root Certification Authorities** store. When you're done, select **Next**. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/certificate-store-trusted-root.png" alt-text="Screenshot of the certificate store screen where you can browse to the trusted root folder.":::

1. Select **Finish** to import the certificate.

1. Sign-in to your sensor console without a secure connection again. In the **Your connection isn't private** warning screen, you might see a **NET::ERR_CERT_COMMON_NAME_INVALID** error message. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/connection-is-not-private.png" alt-text="Screenshot of the connection isn't private screen.":::

1. Select the error message to expand it, and then copy the name next to **Subject**. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/connection-is-not-private-details.png" alt-text="Screenshot of the connection isn't private screen with the details expanded.":::

1. In your local file explorer, browse to **This PC > Local Disk (C:) > Windows > System32 > drivers > etc**, and open the **hosts** file.

1. In the hosts file, add in a line at the end of document with the sensor's IP address and the SSL certificate's common name that you copied in the previous steps. When you're done, save the changes. For example:

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/hosts-file.png" alt-text="Screenshot of the hosts file." lightbox="media/how-to-activate-and-set-up-your-sensor/hosts-file.png":::

## Test certificates you create

Test certificates before deploying them to your sensors and on-premises management consoles. If you want to check the information within the certificate .csr file or private key file, use these commands:

| **Test** | **CLI command** |
|--|--|
| Check a Certificate Signing Request (CSR) | `openssl req -text -noout -verify -in CSR.csr` |
| Check a private key  | `openssl rsa -in privateKey.key -check`  |
| Check a certificate  | `openssl x509 -in certificate.crt -text -noout` |

If these tests fail, review [Certificate file parameter requirements](about-certificates.md#certificate-file-parameter-requirements) to verify file parameters are accurate, or consult your certificate lead.

## Convert existing files to supported files

This section describes how to convert existing certificates files to supported formats.

|**Description** | **CLI command** |
|--|--|
| Convert .crt file to .pem file   | `openssl x509 -inform PEM -in <full path>/<pem-file-name>.crt -out <fullpath>/<crt-file-name>.pem`  |
| Convert .pem file to .crt file   | `openssl x509 -inform PEM -in <full path>/<pem-file-name>.pem -out <fullpath>/<crt-file-name>.crt` |  
| Convert a PKCS#12 file (.pfx .p12) containing a private key and certificates to .pem   | `openssl pkcs12 -in keyStore.pfx -out keyStore.pem -nodes`. You can add -nocerts to only output the private key, or add -nokeys to only output the certificates.  |
|  Convert .cer file to .crt file  |  `openssl x509 -inform PEM -in <filepath>/certificate.cer -out certificate.crt` <br> Make sure to specify the full path. <br><br> **Note**: Other options are available for the -inform flag. The value is usually `DER` or `PEM` but might also be `P12` or another value. For more information, see [`openssl-format-options`]( https://www.openssl.org/docs/manmaster/man1/openssl-format-options.html) and [openssl-x509]( https://www.openssl.org/docs/manmaster/man1/openssl-x509.html). |

## Troubleshooting

This section covers various issues that may occur during certificate upload and validation, and steps to take to resolve the issues.

### Troubleshoot CA-Certificate Upload  

Admin users attempting to sign-in to the sensor or on-premises management console for the first time won't be able to upload the CA-signed certificate if the certificate isn't created properly or is invalid. If certificate upload fails, one or several of the error messages will display:

| **Certificate validation error** | **Recommendation** |
|--|--|
| Passphrase does not match to the key | Validate that you typed the correct passphrase. If the problem continues, try recreating the certificate using the correct passphrase. |
| Cannot validate chain of trust. The provided Certificate and Root CA don't match.  | Make sure the .pem file correlates to the  .crt file. If the problem continues, try recreating the certificate using the correct chain of trust (defined by the .pem file). |
| This SSL certificate has expired and isn't considered valid.  | Create a new certificate with valid dates.|
| This SSL certificate has expired and isn't considered valid.  | Create a new certificate with valid dates.|
|This certificate has been revoked by the CRL and can't be trusted for a secure connection | Create a new unrevoked certificate. |
|The CRL (Certificate Revocation List) location is not reachable. Verify the URL can be accessed from this appliance | Make sure that your network configuration allows the appliance to reach the CRL Server defined in the certificate. You can use a proxy server if there are limitations in establishing a direct connection.  
|Certificate validation failed  | This indicates a general error in the appliance. Contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c8f35-1b8e-f274-ec11-c6efdd6dd099).|

### Troubleshoot file conversions  

Your file conversion may not create a valid certificate. For example, the file structure may be inaccurate.

If the conversion fails:  

- Use the conversion commands described in [Convert existing files to supported files](#convert-existing-files-to-supported-files).
- Make sure the file parameters are accurate. See [Supported certificate file types](about-certificates.md#supported-certificate-file-types) and [Certificate file parameter requirements](about-certificates.md#certificate-file-parameter-requirements) for details.  
- Consult your certificate lead.

## Next steps

For more information, see [Identify required appliances](how-to-identify-required-appliances.md).
