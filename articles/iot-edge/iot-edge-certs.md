---
title: Certificates for device security - Azure IoT Edge | Microsoft Docs 
description: Azure IoT Edge uses certificate to validate devices, modules, and leaf devices and establish secure connections between them. 
author: stevebus
manager: philmea
ms.author: stevebus
ms.date: 10/29/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Understand how Azure IoT Edge uses certificates

IoT Edge certificates are used by the modules and downstream IoT devices to verify the identity and legitimacy of the [IoT Edge hub](iot-edge-runtime.md#iot-edge-hub) runtime module. These verifications enable a TLS (transport layer security) secure connection between the runtime, the modules, and the IoT devices. Like IoT Hub itself, IoT Edge requires a secure and encrypted connection from IoT downstream (or leaf) devices and IoT Edge modules. To establish a secure TLS connection, the IoT Edge hub module presents a server certificate chain to connecting clients in order for them to verify its identity.

This article explains how IoT Edge certificates can work in production, development, and test scenarios. While the scripts are different (Powershell vs. bash), the concepts are the same between Linux and Windows.

## IoT Edge certificates

Usually, manufacturers aren't the end users of an IoT Edge device. Sometimes the only relationship between the two is when the end user, or operator, purchases a generic device made by the manufacturer. Other times, the manufacturer works under contract to build a custom device for the operator. The IoT Edge certificate design attempts to take both scenarios into account.

The following figure illustrates IoT Edge's usage of certificates. There may be zero, one, or many intermediate signing certificates between the root CA certificate and the device CA certificate, depending on the number of entities involved. Here we show one case.

![Diagram of typical certificate relationships](./media/iot-edge-certs/edgeCerts-general.png)

### Certificate authority

The certificate authority, or 'CA' for short, is an entity that issues digital certificates. A certificate authority acts as a trusted third party between the owner, and the receiver of the certificate. A digital certificate certifies the ownership of a public key by the receiver of the certificate. The certificate chain of trust works by initially issuing a root certificate, which is the basis for trust in all certificates issued by the authority. Afterwards, the owner can use the root certificate to issue additional intermediate certificates ('leaf' certificates).

### Root CA certificate

A root CA certificate is the root of trust of the entire process. In production scenarios, this CA certificate is usually purchased from a trusted commercial certificate authority like Baltimore, Verisign, or DigiCert. Should you have complete control over the devices connecting to your IoT Edge devices, it's possible to use a corporate level certificate authority. In either event, the entire certificate chain from the IoT Edge hub up rolls up to it, so the leaf IoT devices must trust the root certificate. You can store the root CA certificate either in the trusted root certificate authority store, or provide the certificate details in your application code.

### Intermediate certificates

In a typical manufacturing process for creating secure devices, root CA certificates are rarely used directly, primarily because of the risk of leakage or exposure. The root CA certificate creates and digitally signs one or more intermediate CA certificates. There may only be one, or there may be a chain of these intermediate certificates. Scenarios that would require a chain of intermediate certificates include:

* A hierarchy of departments within a manufacturer.

* Multiple companies involved serially in the production of a device.

* A customer buying a root CA and deriving a signing certificate for the manufacturer to sign the devices they make on that customer's behalf.

In any case, the manufacturer uses an intermediate CA certificate at the end of this chain to sign the device CA certificate placed on the end device. Generally, these intermediate certificates are closely guarded at the manufacturing plant. They undergo strict processes, both physical and electronic for their usage.

### Device CA certificate

The device CA certificate is generated from and signed by the final intermediate CA certificate in the process. This certificate is installed on the IoT Edge device itself, preferably in secure storage such as a hardware security module (HSM). In addition, a device CA certificate uniquely identifies an IoT Edge device. The device CA certificate can sign other certificates.

### IoT Edge Workload CA

The [IoT Edge Security Manager](iot-edge-security-manager.md) generates the workload CA certificate, the first on the "operator" side of the process, when IoT Edge first starts. This certificate is generated from and signed by the "device CA certificate". This certificate, which is just another intermediate signing certificate, is used to generate and sign any other certificates used by the IoT Edge runtime. Today, that is primarily the IoT Edge hub server certificate discussed in the following section, but in the future may include other certificates for authenticating IoT Edge components.

### IoT Edge hub server certificate

The IoT Edge hub server certificate is the actual certificate presented to leaf devices and modules for identity verification during establishment of the TLS connection required by IoT Edge. This certificate presents the full chain of signing certificates used to generate it up to the root CA certificate, which the leaf IoT device must trust. When generated by the IoT Edge Security Manager, the common name (CN), of this IoT Edge hub certificate is set to the 'hostname' property in the config.yaml file after conversion to lower case. This configuration is a common source of confusion with IoT Edge.

## Production implications

A reasonable question might be "why does IoT Edge need the 'workload CA' extra certificate? Couldn't it use the device CA certificate to directly generate the IoT Edge hub server certificate?". Technically, it could. However, the purpose of this "workload" intermediate certificate is to separate concerns between the device manufacturer and the device operator. Imagine a scenario where an IoT Edge device is sold or transferred from one customer to another. You would likely want the device CA certificate provided by the manufacturer to be immutable. However, the "workload" certificates specific to operation of the device should be wiped and recreated for the new deployment.

Because manufacturing and operation processes are separated, consider the following implications when preparing production devices:

* With any certificate-based process, the root CA certificate and all intermediate CA certificates should be secured and monitored during the entire process of rolling out an IoT Edge device. The IoT Edge device manufacturer should have strong processes in place for proper storage and usage of their intermediate certificates. In addition, the device CA certificate should be kept in as secure storage as possible on the device itself, preferably a hardware security module.

* The IoT Edge hub server certificate is presented by IoT Edge hub to the connecting client devices and modules. The common name (CN) of the device CA certificate **must not be** the same as the "hostname" that will be used in config.yaml on the IoT Edge device. The name used by clients to connect to IoT Edge (for example, via the GatewayHostName parameter of the connection string or the CONNECT command in MQTT) **can't be** the same as common name used in the device CA certificate. This restriction is because the IoT Edge hub presents its entire certificate chain for verification by clients. If the IoT Edge hub server certificate and the device CA certificate both have the same CN, you get in a verification loop and the certificate invalidates.

* Because the device CA certificate is used by the IoT Edge security daemon to generate the final IoT Edge certificates, it must itself be a signing certificate, meaning it has certificate signing capabilities. Applying "V3 Basic constraints CA:True" to the device CA certificate automatically sets up the required key usage properties.

>[!Tip]
> If you've already gone through the setup of IoT Edge as a transparent gateway in a dev/test scenario using our "convenience scripts" (see next section) and used the same host name when creating the device CA certificate as you did for the hostname in config.yaml, you might be wondering why it worked. In an effort to simplify the developer experience, the convenience scripts appends a ".ca" on the end of the name you pass into the script. So, for example, if you used "mygateway" for both your device name in the scripts and hostname in config.yaml, the former will be turned into mygateway.ca before being used as the CN for the device CA cert.

## Dev/Test implications

To ease development and test scenarios, Microsoft provides a set of [convenience scripts](https://github.com/Azure/azure-iot-sdk-c/tree/master/tools/CACertificates) for generating non-production certificates suitable for IoT Edge in the transparent gateway scenario. For examples of how the scripts work, see [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md).

>[!Tip]
> To connect your device IoT "leaf" devices and applications that use our IoT device SDK through IoT Edge, you must add the optional GatewayHostName parameter on to the end of the device's connection string. When the Edge Hub Server Certificate is generated, it is based on a lower-cased version of the hostname from config.yaml, therefore, for the names to match and the TLS certificate verification to succeed, you should enter the GatewayHostName parameter in lower case.

## Example of IoT Edge certificate hierarchy

To illustrate an example of this certificate path, the following screenshot is from a working IoT Edge device set up as a transparent gateway. OpenSSL is used to connect to the IoT Edge hub, validate, and dump out the certificates.

![Screenshot of the certificate hierarchy at each level](./media/iot-edge-certs/iotedge-cert-chain.png)

You can see the hierarchy of certificate depth represented in the screenshot:

| Root CA Certificate         | Azure IoT Hub CA Cert Test Only                                                                           |
|-----------------------------|-----------------------------------------------------------------------------------------------------------|
| Intermediate CA Certificate | Azure IoT Hub Intermediate Cert Test Only                                                                 |
| Device CA Certificate       | iotgateway.ca ("iotgateway" was passed in as the  < gateway host name >  to the convenience scripts)   |
| Workload CA Certificate     | iotedge workload ca                                                                                       |
| IoT Edge Hub Server Certificate | iotedgegw.local  (matches the 'hostname' from config.yaml)                                            |

## Next steps

[Understand Azure IoT Edge modules](iot-edge-modules.md)

[Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md)
