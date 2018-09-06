---
title: Azure IoT Edge certificate usage detail | Microsoft Docs 
description: Learn about Azure IoT Edge certificates and how they are used.
author: stevebus
manager: timlt
ms.author: stevebus
ms.date: 09/06/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Azure IoT Edge certificate usage detail

While there are many potential future use cases for certificates in Azure IoT Edge, the primary usage of certificates by IoT Edge today is for server-side identity verification of the [Edge Hub][lnk-edge-hub] runtime module to leaf IoT devices and modules for establishment of the TLS secure connection between them. Like IoT Hub itself, IoT Edge requires a secure and encrypted connection from IoT downstream (or leaf) devices and IoT Edge modules. In order to establish a secure TLS connection, the Edge Hub module presents a server certificate chain to connecting clients in order for them to verify its identity.

To alleviate any confusion about IoT Edge's use of certificates, as well as give insight into the intended design, this article will explain both how Microsoft envisions IoT Edge certificates will be used in production at scale scenarios, and how that maps into our self-signed "development/test" scripts provided in our [transparent gateway tutorial][lnk-iot-edge-as-transparent-gateway-linux]. While the scripts are different (Powershell vs. bash), the concepts are the same between Linux and Windows.

## IoT Edge Certificates

Microsoft designed the IoT Edge usage of certificates with the idea that the manufacturer of the IoT Edge device will likely be a different entity than the user or operator of the device. The device manufacturer may be a totally independent entity and the only relationship between manufacturer and operator is the purchase of a commercially available Edge device, or the manufacturer may be working under contract with the operator building a bespoke Edge device on their behalf. The IoT Edge certificate design attempts to take both scenarios into account.

The figure below illustrates IoT Edge's typical usage of certificates. We say typical, because there may be zero, one, or many intermediate signing certificates between the Root CA Certificate and the Device CA Certificate, depending on the number of entities involved in the process. Here we show just one.

![edge-certs-general][1]

### Root CA Certificate

This certificate is the root of trust of the entire process. In production scenarios, this is generally going to be a CA certificate purchased from a commercial certificate authority like Baltimore, Verisign, DigiCert, etc. If you have complete control over the IoT devices that will be connecting to your Edge devices, you may also be able to use a corporate-level certificate authority. In either event, the entire certificate chain from the Edge Hub up rolls up to this certificate, so the leaf IoT devices must trust this certificate. That can either by having it in the OS-level trusted root certificate authority store, or by providing the certificate details in your code when the IoT client connects to IoT Edge.

### Intermediate Certificate(s)

In a typical manufacturing process for creating a secure devices, Root CA Certificates are rarely used directly, primarily because of the risk of leakage or exposure. Generally, one or more Intermediate CA certificates are created and digitally signed by the Root CA Certificates. There may only be one, or there may be a chain of these intermediate certificates. Examples where this might happen include a hierarchy of departments within a manufacturer, or multiple companies involved serially in the production of a device, or even the end-customer buying a root CA and deriving a signing certificate for the manufacturer to sign the devices they make on that customer's behalf. Either way, the point is that the manufacturer uses an intermediate CA Certificate at the end of this chain to actually sign the Device CA Cert placed on the end device. Generally these intermediate certificates are closely guarded at the manufacturing plant, undergoing very strict processes, both physical and electronic, for their usage.

### Device CA Certificate

This certificate, the last on the manufacturer side of the process, is generated from and signed by the final Intermediate CA Certificate in the process. This certificate is installed on the Edge device itself, preferably in secure storage such as a Hardware Security Module (HSM). This is the certificate that uniquely identifies the IoT Edge device in general. For IoT Edge the device CA certificate is a signing capable certificate. This certificate can issue other certificates such as the leaf device certificate used to authenticate the device to a service like the Azure IoT Device Provisioning Service to provision and configure the IoT Edge device in an IoT Hub and begin its configuration.

### IoT Edge Workload CA

This certificate, the first on the "operator" side of the process, is generated by the [IoT Edge Security Manager][lnk-iot-edge-security-mgr] when IoT Edge first starts. This certificate is generated from and signed by the "Device CA Certificate" above. This certificate, which is really just another intermediate signing certificate, is used to generate and sign any other certificates used by the IoT Edge runtime. Today, that is primarily the Edge Hub server certificate discussed below, but in the future may include other certificates for authenticating IoT Edge components.

### Edge Hub server certificate

This certificate is the actual certificate presented by the Edge Hub runtime component to leaf devices and modules for identity verification during establishment of the TLS connection required by IoT Edge. This certificate presents the full chain of signing certificates used to generate it up to the Root CA Certificate mentioned above, which as mentioned, the leaf IoT device must trust. When generated by the IoT Edge Security Manager, the common name (CN) or subject of this Edge Hub certificate is set to the name provided by the 'hostname' property in the IoT Edge devices config.yaml file after conversion to lower case. This is a common source of confusion with IoT Edge (see the production and dev/test implications below).

## Production Implications

A reasonable question might be "why does IoT Edge need the 'Workload CA' extra certificate? Couldn't it use the Device CA Certificate to directly generate the Edge Hub server certificate?". Technically, it could. However, the purpose of this "workload" intermediate certificate is to create a distinct boundary and separation of concerns between the device manufacturer and the device operator. Imagine a scenario where an IoT Edge device is sold or transferred from one customer to another. You would likely want the Device CA Certificate provided by the manufacturer to be immutable, but the "workload" certificates specific to operation of the device be wiped and recreated for the new deployment.

Because of this separation of manufacturer and operator processes, there are a couple of implications that need to be considered related to rolling out IoT Edge for production devices.

* It should go without saying, as with any certificate-based process, the Root CA Certificate and all Intermediate CA Certificates should be secured and guarded closely during the entire process of rolling out an IoT Edge device. The manufacturing plant should have strong processes in place for proper storage and usage of their intermediate certificates, and the Device CA Certificate should be kept in as secure storage as possible on the device itself, preferably an HSM
* Because the Edge Hub server certificate, and not the Device CA Certificate, is the certificate actually presented by the Edge Hub to connecting client devices and modules, the CN of the Device CA Certificate **must not be** the same as the "hostname" that will be used in config.yaml. In other words, the name used by clients to connect to IoT Edge (e.g. via the GatewayHostName parameter of the connection string or the CONNECT command in MQTT) **cannot be** the same as common name used in the Device CA Certificate. This is because the Edge Hub presents its entire certificate chain for verification by clients, if the Edge Hub server certificate and the Device CA Certificate both have the same CN, you get in a verification loop and the certificate will fail to validate.
 
> If you've already gone through the setup of IoT Edge as a transparent gateway in a dev/test scenario using our "convenience scripts" (see next section) and used the same host name when creating the Device CA Cert as you did for the hostname in config.yaml, you might be wondering why it worked. In an effort to simplify the developer experience, the convenience scripts appends a ".ca" on the end of the name you pass into the script. So, for example, if you used "mygateway" for both your device name in the scripts and hostname in config.yaml, the former will be turned into mygateway.ca before being used as the CN for the Device CA Cert.

## Dev/Test implications

To ease development and test scenarios, Microsoft provides a set of [convenience scripts][lnk-convenience-scripts] for generating non-production certificates suitable for IoT Edge in the transparent gateway scenario.

These scripts generate certificates used very similarly to the scenario in the picture above. When used for [Linux][lnk-iot-edge-as-transparent-gateway-linux-cert-create] or [Windows][lnk-iot-edge-as-transparent-gateway-windows-cert-create], specifically, the

```cmd
./certGen.sh create_root_and_intermediate (linux)
   or
New-CACertsCertChain rsa (Windows)
```

commands generate the "Root CA Certificate" and a single "Intermediate CA Certificate".

Likewise, the

```cmd
./certGen.sh create_edge_device_certificate "<gateway device name>" (linux)
   or
New-CACertsEdgeDevice "<gateway device name>"  (Windows)
```

commands generate the "Device CA Certificate".

So, similar to the production scenario, the following rule applies when using the scripts

* The \<gateway device name> passed into the scripts above **must not** be the same as the "hostname" parameter in config.yaml. As mentioned above, the scripts help you avoid any issues by appending a ".ca" string to the \<gateway device name> to prevent the name collision in case a user sets up the Edge using the same name in both places, however, it's good practice to avoid using the same name.

> To connect your device IoT "leaf" devices and applications that use our IoT device SDK through IoT Edge, you must add the optional GatewayHostName parameter on to the end of the device's connection string. As mentioned above, when the Edge Hub Server Certificate is generated, it is based on a lower-cased version of the hostname from config.yaml, therefore, for the names to match and the TLS certificate verification to succeed, you should enter the GatewayHostName parameter in lower case.

## Example of IoT Edge Certificate hierarchy

To illustrate an example of this certificate path, the below screenshot is from a working IoT Edge device set up as a transparent gateway. OpenSSL is used to connect to the Edge Hub, validate, and dump out the certificates.

![edge-cert-chain][2]

You can see the hierarchy of certificate depth represented in the screenshot:

* Root CA Certificate -> Azure IoT Hub CA Cert Test Only
* Intermediate CA Certificate -> Azure IoT Hub Intermediate Cert Test Only
* Device CA Certificate -> iotgateway.ca ("iotgateway" was passed in as the \<gateway host name> to the convenience scripts)
* Workload CA Certificate -> iotedged workload ca
* Edge Hub Server Certificate -> iotedgegw.local  (matches the 'hostname' from config.yaml)

[[todo: links to other docs? next steps? -- i.e. the standard iot edge docs footer stuff]]

## Next steps

[Understand Azure IoT Edge modules][lnk-modules]
[Use an IoT Edge device as a transparent gateway (Linux)][lnk-iot-edge-as-transparent-gateway-linux] 
[Use an IoT Edge device as a transparent gateway (Windows)][lnk-iot-edge-as-transparent-gateway-windows] 
<!-- Images -->
[1]: ./media/iot-edge-certs/edgeCerts-general.png
[2]: ./media/iot-edge-certs/iotedge-cert-chain.png
<!-- Links -->
[lnk-edge-hub]: iot-edge-runtime.md#iot-edge-hub
[lnk-iot-edge-security-mgr]: iot-edge-security-manager.md
[lnk-convenience-scripts]: https://github.com/Azure/azure-iot-sdk-c/tree/master/tools/CACertificates
[lnk-modules]: iot-edge-modules.md
[lnk-iot-edge-as-transparent-gateway-linux]: how-to-create-transparent-gateway-linux.md
[lnk-iot-edge-as-transparent-gateway-linux-cert-create]: how-to-create-transparent-gateway-linux.md#certificate-creation
[lnk-iot-edge-as-transparent-gateway-windows]: how-to-create-transparent-gateway-windows.md
[lnk-iot-edge-as-transparent-gateway-windows-cert-create]: how-to-create-transparent-gateway-windows.md#certificate-creation