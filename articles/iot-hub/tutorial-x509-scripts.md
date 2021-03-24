---
title: Tutorial - Use Microsoft scripts to create x.509 test certificates | Microsoft Docs
description: Tutorial - Use custom scripts to create CA and device certificates for Azure IoT Hub
author: v-gpettibone
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 02/26/2021
ms.author: robinsh
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics', devx-track-azurecli]
#Customer intent: As a developer, I want to be able to use X.509 certificates to authenticate devices to an IoT hub. This step of the tutorial needs to introduce me to Microsoft scripts that I can use to generate test certificates. 
---

# Tutorial: Using Microsoft-supplied scripts to create test certificates

## Introduction

Microsoft provides PowerShell and Bash scripts to help you understand how to create your own X.509 certificates and authenticate them to an IoT Hub. The scripts are located in [GitHub](https://github.com/Azure/azure-iot-sdk-c/tree/master/tools/CACertificates). They are provided for demonstration purposes only. Certificates created by them must not be used for production. The certificates contain hard-coded passwords (“1234”) and expire after 30 days. For a production environment, you'll need to use your own best practices for certificate creation and lifetime management.

## PowerShell scripts

### Step 1 - Setup

Get OpenSSL for Windows. See <https://www.openssl.org/docs/faq.html#MISC4> for places to download it or <https://www.openssl.org/source/> to build from source. Then run the preliminary scripts:

1. Copy the scripts from [GitHub](https://github.com/Azure/azure-iot-sdk-c/tree/master/tools/CACertificates) into the local directory in which you want to work. All files will be created as children of this directory.

1. Start PowerShell as an administrator.

1. Change to the directory where you loaded the scripts.

1. On the command line, set the environment variable `$ENV:OPENSSL_CONF` to the directory in which the openssl configuration file (openssl.cnf) is located.

1. Run `Set-ExecutionPolicy -ExecutionPolicy Unrestricted` so that PowerShell can run the scripts.

1. Run `. .\ca-certs.ps1`. This brings the functions of the script into the PowerShell global namespace.

1. Run `Test-CACertsPrerequisites`. PowerShell uses the Windows Certificate Store to manage certificates. This command verifies that there won't be name collisions later with existing certificates and that OpenSSL is setup correctly.

### Step 2 - Create certificates

Run `New-CACertsCertChain [ecc|rsa]`. ECC is recommended for CA certificates but not required. This script updates your directory and Windows Certificate store with the following CA and intermediate certificates:

* intermediate1.pem
* intermediate2.pem
* intermediate3.pem
* RootCA.cer
* RootCA.pem

After running the script, add the new CA certificate (RootCA.pem) to your IoT Hub:

1. Go to your IoT Hub and navigate to Certificates.

1. Select **Add**.

1. Enter a display name for the CA certificate.

1. Upload the CA certificate.

1. Select **Save**.

### Step 3 - Prove possession

Now that  you've uploaded your CA certificate to your IoT Hub, you'll need to prove that you actually own it:

1. Select the new CA certificate.

1. Select **Generate Verification Code** in the **Certificate Details** dialog. For more information, see [Prove Possession of a CA certificate](tutorial-x509-prove-possession.md).

1. Create a certificate that contains the verification code. For example, if the verification code is `"106A5SD242AF512B3498BD6098C4941E66R34H268DDB3288"`, run the following to create a new certificate in your working directory containing the subject `CN = 106A5SD242AF512B3498BD6098C4941E66R34H268DDB3288`. The script creates a certificate named `VerifyCert4.cer`.

    `New-CACertsVerificationCert "106A5SD242AF512B3498BD609C4941E66R34H268DDB3288"`

1. Upload `VerifyCert4.cer` to your IoT Hub in the **Certificate Details** dialog.

1. Select **Verify**.

### Step 4 - Create a new device

Create a device for your IoT Hub:

1. In your IoT Hub, navigate to the **IoT Devices** section.

1. Add a new device with ID `mydevice`.

1. For authentication, choose **X.509 CA Signed**.

1. Run `New-CACertsDevice mydevice` to create a new device certificate. This creates the following files in your working directory:

   * `mydevice.pfx`
   * `mydevice-all.pem`
   * `mydevice-private.pem`
   * `mydevice-public.pem`

### Step 5 - Test your device certificate

Go to [Testing Certificate Authentication](tutorial-x509-test-certificate.md) to determine if your device certificate can authenticate to your IoT Hub. You will need the PFX version of your certificate, `mydevice.pfx`.

### Step 6 - Cleanup

From the start menu, open **Manage Computer Certificates** and navigate to  **Certificates - Local Computer > personal**. Remove certificates issued by "Azure IoT CA TestOnly*". Similarly remove the appropriate certificates from **>Trusted Root Certification Authority > Certificates and >Intermediate Certificate Authorities > Certificates**.

## Bash Scripts

### Step 1 - Setup

1. Start Bash.

1. Change to the directory in which you want to work. All files will be created in this directory.

1. Copy `*.cnf` and `*.sh` to your working directory.

### Step 2 - Create certificates

1. Run `./certGen.sh create_root_and_intermediate`. This creates the following files in the **certs** directory:

    * azure-iot-test-only.chain.ca.cert.pem
    * azure-iot-test-only.intermediate.cert.pem
    * azure-iot-test-only.root.ca.cert.pem

1. Go to your IoT Hub and navigate to **Certificates**.

1. Select **Add**.

1. Enter a display name for the CA certificate.

1. Upload only the CA certificate to your IoT Hub. The name of the certificate is `./certs/azure-iot-test-only.root.ca.cert.pem.`

1. Select **Save**.

### Step 3 - Prove possession

1. Select the new CA certificate created in the preceding step.

1. Select **Generate Verification Code** in the **Certificate Details** dialog. For more information, see [Prove Possession of a CA certificate](tutorial-x509-prove-possession.md).

1. Create a certificate that contains the verification code. For example, if the verification code is `"106A5SD242AF512B3498BD6098C4941E66R34H268DDB3288"`, run the following to create a new certificate in your working directory named `verification-code.cert.pem` which contains the subject `CN = 106A5SD242AF512B3498BD6098C4941E66R34H268DDB3288`.

    `./certGen.sh create_verification_certificate "106A5SD242AF512B3498BD6098C4941E66R34H268DDB3288"`

1. Upload the certificate to your IoT hub in the **Certificate Details** dialog.

1. Select **Verify**.

### Step 4 - Create a new device

Create a device for your IoT hub:

1. In your IoT Hub, navigate to the IoT Devices section.

1. Add a new device with ID `mydevice`.

1. For authentication, choose **X.509 CA Signed**.

1. Run `./certGen.sh create_device_certificate mydevice` to create a new device certificate. This creates two files named `new-device.cert.pem` and `new-device.cert.pfx` files in your working directory.

### Step 5 - Test your device certificate

Go to [Testing Certificate Authentication](tutorial-x509-test-certificate.md) to determine if your device certificate can authenticate to your IoT Hub. You will need the PFX version of your certificate, `new-device.cert.pfx`.

### Step 6 - Cleanup

Because the bash script simply creates certificates in your working directory, just delete them when you are done testing.
