---
title: Tutorial - Upload and verify CA certificates in Azure IoT Hub | Microsoft Docs
description: Tutorial - Upload and verify a CA certificate to Azure IoT Hub
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 01/09/2023
ms.author: kgremban
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics']
#Customer intent: As a developer, I want to be able to use X.509 certificates to authenticate devices to an IoT hub. This step of the tutorial needs to show me how to upload and verify CA certificates to IoT hub.
---

# Tutorial: Upload and verify a CA certificate to IoT Hub

When you upload your root certificate authority (CA) certificate or subordinate CA certificate to your IoT hub, you can set it to verified automatically, or manually prove that you own the certificate.

## Verify certificate automatically

1. In the Azure portal, navigate to your IoT hub and select **Certificates** from the resource menu, under **Security settings**.

1. Select **Add** from the command bar to add a new CA certificate.

1. Enter a display name in the **Certificate name** field.

1. Select the certificate file to add in the **Certificate .pem or .cer file** field.

1. To automatically verify the certificate, check the box next to **Set certificate status to verified on upload**.

   :::image type="content" source="media/tutorial-x509-prove-possession/skip-pop.png" alt-text="Screenshot showing how to automatically verify the certificate status on upload.":::

1. Select **Save**.  

If you chose to automatically verify your certificate during upload, your certificate is shown with its status set to **Verified** on the **Certificates** tab of the working pane.

## Verify certificate manually after upload

If you didn't choose to automatically verify your certificate during upload, your certificate is shown with its status set to **Unverified**. You must perform the following steps to manually verify your certificate.

1. Select the certificate to view the **Certificate Details** dialog.

1. Select **Generate Verification Code** in the dialog.

   :::image type="content" source="media/tutorial-x509-prove-possession/certificate-details.png" alt-text="Screenshot showing the certificate details dialog.":::

1. Copy the verification code to the clipboard. You must use this verification code as the certificate subject in subsequent steps. For example, if the verification code is 75B86466DA34D2B04C0C4C9557A119687ADAE7D4732BDDB3, add that as the subject of your certificate as shown in the next step.

5. There are three ways to generate a verification certificate:

    * If you're using the PowerShell script supplied by Microsoft, run `New-CACertsVerificationCert "<verification code>"` to create a certificate named `VerifyCert4.cer`, replacing `<verification code>` with the previously generated verification code. For more information, see [Tutorial: Use OpenSSL to create test certificates](tutorial-x509-openssl.md).

    * If you're using the Bash script supplied by Microsoft, run `./certGen.sh create_verification_certificate "<verification code>"` to create a certificate named `verification-code.cert.pem`, replacing `<verification code>` with the previously generated verification code. For more information, see [Tutorial: Use OpenSSL to create test certificates](tutorial-x509-openssl.md).

    * If you're using OpenSSL to generate your certificates, you must first generate a private key, then generate a certificate signing request (CSR) file. In the following example, replace `<verification code>` with the previously generated verification code:

      ```bash
      $ openssl genpkey -out pop.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048

      $ openssl req -new -key pop.key -out pop.csr

      -----
      Country Name (2 letter code) [XX]:.
      State or Province Name (full name) []:.
      Locality Name (eg, city) [Default City]:.
      Organization Name (eg, company) [Default Company Ltd]:.
      Organizational Unit Name (eg, section) []:.
      Common Name (eg, your name or your server hostname) []:<verification code>
      Email Address []:

      Please enter the following 'extra' attributes
      to be sent with your certificate request
      A challenge password []:
      An optional company name []:
 
      ```

      Then, create a certificate using the appropriate configuration file for either the root CA or the subordinate CA, and the CSR file. The following example demonstrates how to use OpenSSL to create the certificate from a root CA configuration file and the CSR file.

      ```bash
      openssl ca -config rootca.conf -in pop.csr -out pop.crt -extensions client_ext

      ```

    For more information, see [Tutorial: Use OpenSSL to create test certificates](tutorial-x509-openssl.md).

1. Select the new certificate in the **Certificate Details** view.

1. After the certificate uploads, select **Verify**. The certificate status should change to **Verified**.
