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

A verified X.509 CA certificate is a certificate that has been uploaded and registered to your provisioning service and has gone through proof-of-possession with the service to prove that you are in possession of the private key associated with the certificate. Proof-of-possession involves creating an X.509 certificate with a unique verification code obtained from the service as its subject, signing the certificate with the private key associated with the CA certificate to be verified, and  uploading the signed verification certificate to the service. The service validates the verification certificate using the public portion of the CA certificate to be verified, thus proving that you are in possession of the CA certificate's private key.

Verified certificates play an important role when using enrollment groups. The root or intermediate certificates configured in an enrollment group must either be verified certificates or must roll up to a verified certificate in the certificate chain a device presents when it authenticates with the service. This ensures the validity of the enrollment group by ensuring that the service has validated the ownership of either the configured certificate or at least one certificate used to sign the configured certificate and ensures that the device can be provisioned using the enrollment group. To learn more about enrollment groups, see [X.509 certificates](concepts-security.md#x509-certificates) and [Controlling device access to the provisioning service with X.509 certificates](concepts-security.md#controlling-device-access-to-the-provisioning-service-with-x509-certificates).

## Register the public part of an X.509 certificate and get a verification code

You must first register your CA certificate with your provisioning service by uploading its public part to the service. You can then get a verification code from the service that you can use to provide proof-of-possession. 

1. In the Azure portal, navigate to your provisioning service and open **Certificates** from the left-hand menu. 
2. Click **Add** to add a new certificate.
3. Enter a friendly display name for your certificate. Browse to the .CER or .PEM file that represents the public part of your X.509 certificate. Click **Upload**.
4. Once you get a notification that your certificate is successfully uploaded, click **Save**.

    ![Upload certificate](./media/how-to-verify-certificates/add-new-cert.png)  

   This will show your certificate in the **Certificate Explorer** list. Note the **STATUS** of this certificate is *Unverified*.

5. Click on the certificate that you added in the previous step.

6. In the **Certificate Details** blade, click **Generate Verification Code**.

7. The provisioning service creates a **Verification Code** to use to validate the certificate ownership. Copy the code to your clipboard. 

   ![Verify certificate](./media/how-to-verify-certificates/verify-cert.png)  

## Digitally sign the verification code to create a verification certificate

Now, you need to sign the *Verification Code* with the private key associated with your X.509 CA certificate, which generates a signature. This is known as [Proof of possession](https://tools.ietf.org/html/rfc5280#section-3.1) and results in a signed verification certificate.

Microsoft provides tools and samples that can help you create a signed verification certificate: 

- The **Azure IoT Hub C SDK** contains PowerShell (Windows) and Bash (Linux) scripts to help you create CA and leaf certificates for development and to perform proof-of-possession using a verification code. You can download the [files](https://github.com/Azure/azure-iot-sdk-c/tree/master/tools/CACertificates) relevant to your system to a working folder and follow the instructions in the [Managing CA certificates readme](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md) to perform proof-of-possession on a CA certificate. 
- The **Azure IoT Hub C# SDK** contains the [Group Certificate Verification Sample](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/provisioning/service/samples/GroupCertificateVerificationSample), which you can use to do proof-of-possession.
- You can follow the steps in the PowerShell scripts in the [PowerShell scripts to manage CA-signed X.509 certificates](iot-hub-security-x509-create-certificates.md) article in the IoT Hub documentation, specifically the script mentioned in the section titled [Proof of possession of your X.509 CA certificate](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-security-x509-create-certificates#signverificationcode).
 
> [!IMPORTANT]
> In addition to performing proof-of-possession, the PowerShell and Bash scripts provided above also allow you to create root and intermediate CA certificates and leaf certificates that can be used to authenticate and provision devices. These certificates should be used for development only. They should never be used in a production environment. 

The PowerShell and Bash scripts cited above rely on [OpenSSL](https://www.openssl.org/). You may also use OpenSSL or other third-party tools to help you do proof-of-possession. For more information about tooling provided with the SDKs, see [How to use tools provided in the SDKs](how-to-use-sdk-tools.md). 


## Upload the signed verification certificate

1. Upload the resulting signature as a verification certificate to your IoT hub in the portal. In the **Certificate Details** blade on the Azure portal, navigate to the **Verification Certificate .pem or .cer file**, and select the signature -- for example, *VerifyCert4.cer* if using the sample PowerShell commands -- using the _File Explorer_ icon beside it.

2. Once the certificate is successfully uploaded, click **Verify**. The **STATUS** of your certificate changes to **_Verified_** in the **Certificates** blade. Click **Refresh** if it does not update automatically.

   ![Upload certificate verification](./media/how-to-verify-certificates/upload-cert-verification.png)  

## Next steps

- To learn about how to use the portal to create an enrollment group using your verified certificate or an intermediate certificate that rolls up to it, see [Managing device enrollments with Azure portal](how-to-manage-enrollments.md).
- To learn about how to use one of the platform service SDKs to create an enrollment group using your verified certificate or an intermediate certificate that rolls up to it, see [Managing device enrollments with service SDKs](how-to-manage-enrollments-sdks.md).










