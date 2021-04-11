---
title: Tutorial - Prove Ownership of CA certificates in Azure IoT Hub | Microsoft Docs
description: Tutorial - Prove that you own a CA certificate for Azure IoT Hub
author: v-gpettibone
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 02/26/2021
ms.author: robinsh
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics', devx-track-azurecli]
#Customer intent: As a developer, I want to be able to use X.509 certificates to authenticate devices to an IoT hub. This step of the tutorial needs to show me how to prove that I own the certificate I uploaded to IoT Hub
---

# Tutorial: Proving possession of a CA certificate

After you upload your root certification authority (CA) certificate or subordinate CA certificate to your IoT hub, you must prove that you own the certificate:

1. In the Azure portal, navigate to your IoTHub and select **Settings > Certificates**.

2. Select **Add** to add a new CA certificate.

3. Enter a display name in the **Certificate Name** field, and select the PEM certificate to add.

4. Select **Save**. Your certificate is shown in the certificate list with a status of **Unverified**. This verification process will prove that you have possession of the certificate.

5. Select the certificate to view the **Certificate Details** dialog.

6. Select **Generate Verification Code** in the dialog.

  :::image type="content" source="media/tutorial-x509-prove-possession/certificate-details.png" alt-text="{Certificate details dialog}":::

7. Copy the verification code to the clipboard. You must set the verification code as the certificate subject. For example, if the verification code is 75B86466DA34D2B04C0C4C9557A119687ADAE7D4732BDDB3, add that as the subject of your certificate as shown in the next step.

8. There are three ways to generate a verification certificate:

    * If you are using the PowerShell script supplied by Microsoft, run `New-CACertsVerificationCert "75B86466DA34D2B04C0C4C9557A119687ADAE7D4732BDDB3"` to create a certificate named `VerifyCert4.cer`. For more information, see [Using Microsoft-supplied Scripts](tutorial-x509-scripts.md).

    * If you are using the Bash script supplied by Microsoft, run `./certGen.sh create_verification_certificate "75B86466DA34D2B04C0C4C9557A119687ADAE7D4732BDDB3"` to create a certificate named `verification-code.cert.pem`. For more information, see [Using Microsoft-supplied Scripts](tutorial-x509-scripts.md).

    * If you are using OpenSSL to generate your certificates, you must first generate a private key and a certificate signing request (CSR):

      ```bash
      $ openssl req -new -key pop.key -out pop.csr

      -----
      Country Name (2 letter code) [XX]:.
      State or Province Name (full name) []:.
      Locality Name (eg, city) [Default City]:.
      Organization Name (eg, company) [Default Company Ltd]:.
      Organizational Unit Name (eg, section) []:.
      Common Name (eg, your name or your server hostname) []:75B86466DA34D2B04C0C4C9557A119687ADAE7D4732BDDB3
      Email Address []:

      Please enter the following 'extra' attributes
      to be sent with your certificate request
      A challenge password []:
      An optional company name []:
 
      ```

      Then, create a certificate using the root CA configuration file (shown below) or the subordinate CA configuration file and the CSR.

      ```bash
      openssl ca -config rootca.conf -in pop.csr -out pop.crt -extensions client_ext

      ```

    For more information, see [Using OpenSSL to Create Test Certificates](tutorial-x509-openssl.md).

10. Select the new certificate in the **Certificate Details** view.

11. After the certificate uploads, select **Verify**. The CA certificate status should change to **Verified**.
