---
title: How to do proof-of-possession for X.509 CA certificates with Azure IoT Hub Device Provisioning Service | Microsoft Docs
description: How to verify X.509 CA certificates with your DPS service
services: iot-dps
keywords: 
author: JimacoMS
ms.author: v-jamebr
ms.date: 02/02/2018
ms.topic: article
ms.service: iot-dps
documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc

---

# How to do proof-of-possession for X.509 CA certificates with your provisioning service

Using enrollment groups you can enroll multiple devices that share the same X.509 root or intermediate CA certificate in their certificate chain through a single enrollment entry. The enrollment group also allows you to set policies and specify where devices with the verified certificate in their chain get provisioned. You can create an enrollment group for any X.509 CA certificate whose public part has been previously uploaded and verified with your provisioning service. The process of verifying the certificate is called proof-of-possession. It involves creating an X.509 certificate with a unique verification code obtained from the service as its subject and signing the certificate with the private key associated with the CA certificate to be verified. You then upload this signed verification certificate to the service which validates it using the public portion of the CA certificate to be verified, thus proving that you are in possession of the CA certificate's private key.

## Register the public part of an X.509 certificate and get a verification code

You must first upload the public part of your CA certificate to the provisioning service. 

These steps show you how to add a new Certificate Authority to your IoT hub through the portal.

1. In the Azure portal, navigate to your IoT hub and open the **SETTINGS** > **Certificates** menu. 
2. Click **Add** to add a new certificate.
3. Enter a friendly display name for your certificate. Select the root certificate file named *RootCA.cer* created in the previous section, from your machine. Click **Upload**.
4. Once you get a notification that your certificate is successfully uploaded, click **Save**.

    ![Upload certificate](./media/iot-hub-security-x509-get-started/add-new-cert.png)  

   This will show your certificate in the **Certificate Explorer** list. Note the **STATUS** of this certificate is *Unverified*.

5. Click on the certificate that you added in the previous step.

6. In the **Certificate Details** blade, click **Generate Verification Code**.

7. It creates a **Verification Code** to validate the certificate ownership. Copy the code to your clipboard. 

   ![Verify certificate](./media/iot-hub-security-x509-get-started/verify-cert.png)  

## Digitally sign the verification code to create a verification certificate

Now, you need to sign the *Verification Code* with the private key associated with your X.509 CA certificate, which generates a signature. This is known as the [Proof of possession](https://tools.ietf.org/html/rfc5280#section-3.1). 

Microsoft provides tools and samples that can help you create a signed verification certificate: 

- The **Azure IoT Hub C SDK** contains PowerShell (Windows) and Bash (Linux) scripts to help you create CA and leaf certificates for development and to perform proof-of-possession using a verification code. You can download the [files](https://github.com/Azure/azure-iot-sdk-c/tree/master/tools/CACertificates) relevant to your system to a working folder and follow the instructions in the [Managing CA certificates readme](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md) to perform proof-of-possession on a CA certificate. 
- The **Azure IoT Hub C# SDK** contains the [Group Certificate Verification Sample](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/provisioning/service/samples/GroupCertificateVerificationSample), which you can use to do proof-of-possession.
- You can follow the steps in the PowerShell scripts in the [PowerShell scripts to manage CA-signed X.509 certificates](iot-hub-security-x509-create-certificates.md) article in the IoT Hub documentation, specifically the script mentioned in the section titled [Proof of possession of your X.509 CA certificate](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-security-x509-create-certificates#signverificationcode).
 
>[!IMPORTANT]
> In addition to performing proof-of-possession, the PowerShell and Bash scripts provided above also allow you to create CA certificates and leaf certificates that can be used to authenticate and provision devices. These certificates should be used for development only. They should never be used in a production environment. 

The PowerShell and Bash scripts cited above rely on [OpenSSL](https://www.openssl.org/). You may use OpenSSL or other third-party tools to help you do proof-of-possession.


## Upload the verification certificate

1. Upload the resulting signature as a verification certificate to your IoT hub in the portal. In the **Certificate Details** blade on the Azure portal, navigate to the **Verification Certificate .pem or .cer file**, and select the signature, for example, *VerifyCert4.cer* created by the sample PowerShell command using the _File Explorer_ icon besides it.

10. Once the certificate is successfully uploaded, click **Verify**. The **STATUS** of your certificate changes to **_Verified_** in the **Certificates** blade. Click **Refresh** if it does not update automatically.

   ![Upload certificate verification](./media/iot-hub-security-x509-get-started/upload-cert-verification.png)  

## Next steps

After you have a verified CA certificate, you can use it to configure an enrollment group. To learn more, see [Managing dev]().


A root (intermediate root) CA will be generated.
The Portal will be used to upload the public part of the X509 certificate
The private part of the X509 will be used to sign a leaf certificate with a name specified by the service. This is required to ensure that the user owns the private key. The public part of this leaf certificate will be uploaded to the service.
Service SDK will be used to create a Group Enrollment that allows devices to authenticate with X.509 certs issued by the root CA. The Group allows the user to set policies and specify where devices having these certificates get provisioned and is bound to the CA certificate.









