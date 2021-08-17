---
title: Tutorial - Use OpenSSL to create self signed certificates for Azure IoT Hub | Microsoft Docs
description: Tutorial - Use OpenSSL to create self-signed X.509 certificates for Azure IoT Hub
author: v-gpettibone

ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 02/26/2021
ms.author: robinsh
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics']
#Customer intent: As a developer, I want to be able to use X.509 certificates to authenticate devices to an IoT hub. This step of the tutorial needs to show me how to use OpenSSL to self-sign device certificates.
---

# Tutorial: Using OpenSSL to create self-signed certificates

You can authenticate a device to your IoT Hub using two self-signed device certificates. This is sometimes called thumbprint authentication because the certificates contain thumbprints (hash values) that you submit to the IoT hub. The following steps tell you how to create two self-signed certificates.

## Step 1 - Create a key for the first certificate

```bash
openssl genpkey -out device1.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048
```

## Step 2 - Create a CSR for the first certificate

Make sure that you specify the device ID when prompted.

```bash
openssl req -new -key device1.key -out device1.csr

Country Name (2 letter code) [XX]:.
State or Province Name (full name) []:.
Locality Name (eg, city) [Default City]:.
Organization Name (eg, company) [Default Company Ltd]:.
Organizational Unit Name (eg, section) []:.
Common Name (eg, your name or your server hostname) []:{your-device-id}
Email Address []:

```

## Step 3 - Check the CSR

```bash
openssl req -text -in device1.csr -noout
```

## Step 4 - Self-sign certificate 1

```bash
openssl x509 -req -days 365 -in device1.csr -signkey device1.key -out device.crt
```

## Step 5 - Create a key for certificate 2

When prompted, specify the same device ID that you used for certificate 1.

```bash
openssl req -new -key device2.key -out device2.csr

Country Name (2 letter code) [XX]:.
State or Province Name (full name) []:.
Locality Name (eg, city) [Default City]:.
Organization Name (eg, company) [Default Company Ltd]:.
Organizational Unit Name (eg, section) []:.
Common Name (eg, your name or your server hostname) []:{your-device-id}
Email Address []:

```

## Step 6 - Self-sign certificate 2

```bash
openssl x509 -req -days 365 -in device2.csr -signkey device2.key -out device2.crt
```

## Step 7 - Retrieve the thumbprint for certificate 1

```bash
openssl x509 -in device.crt -noout -fingerprint
```

## Step 8 - Retrieve the thumbprint for certificate 2

```bash
openssl x509 -in device2.crt -noout -fingerprint
```

## Step 9 - Create a new IoT device

Navigate to your IoT Hub in the Azure portal and create a new IoT device identity with the following characteristics:

* Provide the **Device ID** that matches the subject name of your two certificates.
* Select the **X.509 Self-Signed** authentication type.
* Paste the hex string thumbprints that you copied from your device primary and secondary certificates. Make sure that the hex strings have no colon delimiters.

## Next Steps

Go to [Testing Certificate Authentication](tutorial-x509-test-certificate.md) to determine if your certificate can authenticate your device to your IoT Hub.
