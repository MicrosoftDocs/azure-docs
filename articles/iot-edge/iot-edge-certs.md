---
title: Understand how IoT Edge uses certificates for security
titleSuffix: Azure IoT Edge
description: How Azure IoT Edge uses certificate to validate devices, modules, and downstream devices enabling secure connections between them. 
author: jlian

ms.author: jlian
ms.date: 07/05/2023
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Understand how Azure IoT Edge uses certificates

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

IoT Edge uses different types of certificates for different purposes. This article walks you through the different ways that IoT Edge uses certificates with Azure IoT Hub and IoT Edge gateway scenarios.

> [!IMPORTANT]
> For brevity, this article applies to IoT Edge version 1.2 or later. The certificate concepts for version 1.1 are similar, but there are some differences:
>
> * The *device CA certificate* in version 1.1 was renamed to *Edge CA certificate*.
> * The *workload CA certificate* in version 1.1 was retired. In version 1.2 or later, the IoT Edge module runtime generates all server certificates directly from the Edge CA certificate, without the intermediate workload CA certificate between them in the certificate chain.

## Summary

These core scenarios are where IoT Edge uses certificates. Use the links to learn more about each scenario.

| Actor | Purpose | Certificate |
|---|---|---|
| IoT Edge | [Ensures it's communicating to the right IoT Hub](#device-verifies-iot-hub-identity) | IoT Hub server certificate |
| IoT Hub | [Ensures the request came from a legitimate IoT Edge device](#iot-hub-verifies-iot-edge-device-identity) | IoT Edge identity certificate |
| Downstream IoT device | [Ensures it's communicating to the right IoT Edge gateway](#device-verifies-gateway-identity) | IoT Edge Hub *edgeHub* module server certificate, issued by Edge CA |
| IoT Edge | [Signs new module server certificates](#why-does-iot-edge-create-certificates). For example, *edgeHub* | Edge CA certificate |
| IoT Edge | [Ensures the request came from a legitimate downstream device](#gateway-verifies-device-identity) | IoT device identity certificate |

## Prerequisites

* You should have a basic understanding of public key cryptography, key pairs, and how a public key and private key can encrypt or decrypt data. For more information about how IoT Edge uses public key cryptography, see [Understanding Public Key Cryptography and X.509 Public Key Infrastructure](../iot-hub/tutorial-x509-introduction.md).
* You should have a basic understanding about how IoT Edge relates to IoT Hub. For more information, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

## Single device scenario

To help understand IoT Edge certificate concepts, imagine a scenario where an IoT Edge device named *EdgeGateway* connects to an Azure IoT Hub named *ContosoIotHub*. In this example, all authentication is done with X.509 certificate authentication rather than symmetric keys. To establish trust in this scenario, we need to guarantee the IoT Hub and IoT Edge device are authentic:  *"Is this device genuine and valid?"* and *"Is the identity of the IoT Hub correct?"*. The scenario can be illustrated as follows:

:::image type="content" source="./media/iot-edge-certs/trust-scenario.png" alt-text="Trust scenario state diagram showing connection between IoT Edge device and IoT Hub." lightbox="./media/iot-edge-certs/trust-scenario.png":::

<!-- mermaid
stateDiagram-v2
    EdgeGateway - -> ContosoIotHub
    note right of EdgeGateway: Verify hub identity - "Are you ContosoIotHub?"
    note left of ContosoIotHub: Verify genuine device - "Is this device EdgeGateway?"
-->

We'll explain the answers to each question and then expand the example in later sections of the article.

## Device verifies IoT Hub identity

How does *EdgeGateway* verify it's communicating with the genuine *ContosoIotHub*? When *EdgeGateway* wants to talk to the cloud, it connects to the endpoint *ContosoIoTHub.Azure-devices.NET*. To make sure the endpoint is authentic, IoT Edge needs *ContosoIoTHub* to show identification (ID). The ID must be issued by an authority that *EdgeGateway* trusts. To verify IoT Hub identity, IoT Edge and IoT Hub use the **TLS handshake** protocol to verify IoT Hub's server identity. A *TLS handshake* is illustrated in the following diagram. To keep the example simple, some details have been omitted. To learn more about the *TLS handshake* protocol, see [TLS handshake on Wikipedia](https://wikipedia.org/wiki/Transport_Layer_Security#TLS_handshake).

> [!NOTE]
> In this example, *ContosoIoTHub* represents the IoT Hub hostname *ContosoIotHub.Azure-devices.NET*.

:::image type="content" source="./media/iot-edge-certs/verify-hub-identity.svg" alt-text="Sequence diagram showing certificate exchange from IoT Hub to IoT Edge device with certificate verification with the trusted root store on the IoT Edge device.":::

<!-- mermaid
sequenceDiagram
    participant EdgeGateway
    participant ContosoIotHub
    
    EdgeGateway->>ContosoIotHub: Let's talk securely with TLS 🔒
    ContosoIotHub->>EdgeGateway: Ok, here's my certificate 📜
    EdgeGateway->>EdgeGateway: Check trusted root certificate store
    note over EdgeGateway, ContosoIotHub: Cryptographic algorithm
    EdgeGateway->>ContosoIotHub: Looks good 🙂, let's connect
-->

In this context, you don't need to know the exact details of the *cryptographic algorithm*. It's important to understand that the algorithm ensures the server possesses the private key that is paired with its public key. It verifies that the presenter of the certificate didn't copy or steal it. If we use a photo ID as an example, your face matches the photo on the ID. If someone steals your ID, they can't use it for identification because your face is unique and difficult to reproduce. For cryptographic keys, the key pair is related and unique. Instead of the matching a face to a photo ID, the cryptographic algorithm uses the key pair to verify identity.

In our scenario, *ContosoIotHub* shows the following certificate chain:

:::image type="content" source="./media/iot-edge-certs/hub-certificate-chain.svg" alt-text="Flow diagram showing intermediate and root certificate authority chain for IoT Hub.":::

<!-- mermaid
flowchart TB
    id3["📃 CN = Baltimore CyberTrust Root (Root CA)"]
    id2["📃 CN = Microsoft IT TLS CA 1 (Intermediate CA)"]
    id1["📃 CN = *.azure-devices.net"] 
    
    id2-- Issued by -- -> id3
    id1-- Issued by -- -> id2
-->

The root certificate authority (CA) is the [Baltimore CyberTrust Root](https://www.digicert.com/kb/digicert-root-certificates.htm) certificate. This root certificate is signed by DigiCert, and is widely trusted and stored in many operating systems. For example, both Ubuntu and Windows include it in the default certificate store.

Windows certificate store:

:::image type="content" source="./media/iot-edge-certs/baltimore-windows.png" alt-text="Screenshot showing Baltimore CyberTrust Root certificate listed in the Windows certificate store." lightbox="./media/iot-edge-certs/baltimore-windows.png":::

Ubuntu certificate store:

:::image type="content" source="./media/iot-edge-certs/ubuntu-baltimore.png" alt-text="Screenshot showing Baltimore CyberTrust Root certificate listed in the Ubuntu certificate store." lightbox="./media/iot-edge-certs/ubuntu-baltimore.png":::

When a device checks for the *Baltimore CyberTrust Root* certificate, it's preinstalled in the OS. From *EdgeGateway* perspective, since the certificate chain presented by *ContosoIotHub* is signed by a root CA that the OS trusts, the certificate is considered trustworthy. The certificate is known as **IoT Hub server certificate**. To learn more about the IoT Hub server certificate, see [Transport Layer Security (TLS) support in IoT Hub](../iot-hub/iot-hub-tls-support.md).

In summary, *EdgeGateway* can verify and trust *ContosoIotHub's* identity because:

* *ContosoIotHub* presents its **IoT Hub server certificate**
* The server certificate is trusted in the OS certificate store
* Data encrypted with *ContosoIotHub's* public key can be decrypted by *ContosoIotHub*, proving its possession of the private key

## IoT Hub verifies IoT Edge device identity

How does *ContosoIotHub* verify it's communicating with *EdgeGateway*? Since [IoT Hub supports *mutual TLS* (mTLS)](../iot-hub/iot-hub-tls-support.md#mutual-tls-support), it checks *EdgeGateway*'s certificate during [client-authenticated TLS handshake](https://wikipedia.org/wiki/Transport_Layer_Security#Client-authenticated_TLS_handshake). For simplicity, we'll skip some steps in the following diagram.

:::image type="content" source="./media/iot-edge-certs/verify-edge-identity.svg" alt-text="Sequence diagram showing certificate exchange from IoT Edge device to IoT Hub with certificate thumbprint check verification on IoT Hub.":::

<!-- mermaid
sequenceDiagram
    participant EdgeGateway
    participant ContosoIotHub
    
    EdgeGateway->>ContosoIotHub: Let's talk securely with TLS 🔒
    EdgeGateway->>ContosoIotHub: Here's my certificate 📜
    note over EdgeGateway, ContosoIotHub: Cryptographic algorithms
    ContosoIotHub->>ContosoIotHub: Check if certificate thumbprint matches record
    ContosoIotHub->>EdgeGateway: Great, let's connect
-->

In this case, *EdgeGateway* provides its **IoT Edge device identity certificate**. From *ContosoIotHub* perspective, it checks both that the thumbprint of the provided certificate matches its record and *EdgeGateway* has the private key paired with the certificate it presented. When you provision an IoT Edge device in IoT Hub, you provide a thumbprint. The thumbprint is what IoT Hub uses to verify the certificate.

> [!TIP]
> IoT Hub requires two thumbprints when registering an IoT Edge device. A best practice is to prepare two different device identity certificates with different expiration dates. This way, if one certificate expires, the other is still valid and gives you time to rotate the expired certificate. However, it's also possible to use only one certificate for registration. Use a single certificate by setting the same certificate thumbprint for both the primary and secondary thumbprints when registering the device.

For example, we can use the following command to get the identity certificate's thumbprint on *EdgeGateway*:

```bash
sudo openssl x509 -in /var/lib/aziot/certd/certs/deviceid-random.cer -noout -nocert -fingerprint -sha256
```

The command outputs the certificate SHA256 thumbprint:

```output
SHA256 Fingerprint=1E:F3:1F:88:24:74:2C:4A:C1:A7:FA:EC:5D:16:C4:11:CD:85:52:D0:88:3E:39:CB:7F:17:53:40:9C:02:95:C3
```

If we view the SHA256 thumbprint value for the *EdgeGateway* device registered in IoT Hub, we can see it matches the thumbprint on *EdgeGateway*:

:::image type="content" source="./media/iot-edge-certs/edge-id-thumbprint.png" alt-text="Screenshot from Azure portal of EdgeGateway device's thumbprint in ContosoIotHub.":::

In summary, *ContosoIotHub* can trust *EdgeGateway* because *EdgeGateway* presents a valid **IoT Edge device identity certificate** whose thumbprint matches the one registered in IoT Hub. 

For more information about the certificate building process, see [Create and provision an IoT Edge device on Linux using X.509 certificates](how-to-provision-single-device-linux-x509.md).

> [!NOTE]
> This example doesn't address Azure IoT Hub Device Provisioning Service (DPS), which has support for X.509 CA authentication with IoT Edge when provisioned with an enrollment group. Using DPS, you upload the CA certificate or an intermediate certificate, the certificate chain is verified, then the device is provisioned. To learn more, see [DPS X.509 certificate attestation](../iot-dps/concepts-x509-attestation.md).
>
> In the Azure Portal, DPS displays the SHA1 thumbprint for the certificate rather than the SHA256 thumbprint.
>
> DPS registers or updates the SHA256 thumbprint to IoT Hub. You can verify the thumbprint using the command `openssl x509 -in /var/lib/aziot/certd/certs/deviceid-long-random-string.cer -noout -fingerprint -sha256`. Once registered, Iot Edge uses thumbprint authentication with IoT Hub. If the device is reprovisioned and a new certificate is issued, DPS updates IoT Hub with the new thumbprint.
>
> IoT Hub currently doesn't support X.509 CA authentication directly with IoT Edge.

### Certificate use for module identity operations

In the certificate verification diagrams, it may appear IoT Edge only uses the certificate to talk to IoT Hub. IoT Edge consists of several modules. As a result, IoT Edge uses the certificate to manage module identities for modules that send messages. The modules don't use the certificate to authenticate to IoT Hub, but rather use SAS keys derived from the private key that are generated by IoT Edge module runtime. These SAS keys don't change even if the device identity certificate expires. If the certificate expires, *edgeHub* for example continues to run, and only the module identity operations fail.

The interaction between modules and IoT Hub is secure because the SAS key is derived from a secret and IoT Edge manages the key without the risk of human intervention.

## Nested device hierarchy scenario with IoT Edge as gateway

You now have a good understanding of a simple interaction IoT Edge between and IoT Hub. But, IoT Edge can also act as a gateway for downstream devices or other IoT Edge devices. These communication channels must also be encrypted and trusted. Because of the added complexity, we have to expand our example scenario to include a downstream device.

We add a regular IoT device named *TempSensor*, which connects to its parent IoT Edge device *EdgeGateway* that connects to IoT Hub *ContosoIotHub*. Similar to before, all authentication is done with X.509 certificate authentication. Our new scenario raises two new questions: *"Is the TempSensor device legitimate?"* and *"Is the identity of the EdgeGateway correct?"*. The scenario can be illustrated as follows:

:::image type="content" source="./media/iot-edge-certs/trust-scenario-ext.png" alt-text="Trust scenario state diagram showing connection between IoT Edge device, an IoT Edge gateway, and IoT Hub." lightbox="./media/iot-edge-certs/trust-scenario-ext.png":::

<!-- mermaid
stateDiagram-v2
    TempSensor
    note right of TempSensor: 🆕 Is the identity of EdgeGateway correct?

    TempSensor - -> EdgeGateway
    note left of EdgeGateway: 🆕 Is the TempSensor device legitimate?
    note right of EdgeGateway: ✅ Is the identity of ContosoIotHub correct?

    EdgeGateway - -> ContosoIotHub
    note left of ContosoIotHub: ✅ Is this device EdgeGateway?
-->

> [!TIP]
> *TempSensor* is an IoT device in the scenario. The certificate concept is the same if *TempSensor* is a downstream IoT Edge device of parent *EdgeGateway*.

## Device verifies gateway identity

How does *TempSensor* verify it's communicating with the genuine *EdgeGateway?* When *TempSensor* wants to talk to the *EdgeGateway*, *TempSensor* needs *EdgeGateway* to show an ID. The ID must be issued by an authority that *TempSensor* trusts.

:::image type="content" source="./media/iot-edge-certs/verify-gateway-identity.svg" alt-text="Sequence diagram showing certificate exchange from gateway device to IoT Edge device with certificate verification using the private root certificate authority.":::

<!-- mermaid
sequenceDiagram
    participant TempSensor
    participant EdgeGateway
    
    TempSensor->>EdgeGateway: Let's talk securely with TLS 🔒
    EdgeGateway-)TempSensor: Ok, this certificate chain proves my legitimacy 📜
    TempSensor->>TempSensor: Check trusted root certificate store
    note over TempSensor, EdgeGateway: Cryptographic algorithms
    TempSensor->>EdgeGateway: Name checks out, private root CA found 🙂, let's connect
-->

The flow is the same as when *EdgeGateway* talks to *ContosoIotHub*. *TempSensor* and *EdgeGateway* use the **TLS handshake** protocol to verify *EdgeGateway's* identity. There are two important details:

* **Hostname specificity**: The certificate presented by *EdgeGateway* must be issued to the same hostname (domain or IP address) that *TempSensor* uses to connect to *EdgeGateway*.
* **Self-signed root CA specificity**: The certificate chain presented by *EdgeGateway* is likely not in the OS default trusted root store.

To understand the details, let's first examine the certificate chain presented by *EdgeGateway*.

:::image type="content" source="./media/iot-edge-certs/gateway-certificate-chain.svg" alt-text="Flow diagram showing certificate authority chain for an IoT Edge gateway.":::

<!-- mermaid
flowchart TB
    id4["📃 CN = my private root CA"]
    id3["📃 CN = my optional intermediate CA"]
    id2["📃 CN = iotedged workload ca edgegateway"]
    id1["📃 CN = edgegateway.local"] 
    
    id3-- Issued by --- > id4
    id2-- Issued by --- > id3
    id1-- Issued by --- > id2
-->

### Hostname specificity

The certificate common name **CN = edgegateway.local** is listed at the top of the chain. **edgegateway.local** is *edgeHub*'s server certificate common name. **edgegateway.local** is also the hostname for *EdgeGateway* on the local network (LAN or VNet) where *TempSensor* and *EdgeGateway* are connected. It could be a private IP address such as *192.168.1.23* or a fully qualified domain name (FQDN) like the diagram. The *edgeHub server certificate* is generated using the **hostname** parameter defined in the [IoT Edge config.toml file](configure-device.md#hostname). Don't confuse the *edgeHub server certificate* with *Edge CA certificate*. For more information about managing the Edge CA certificate, see [Manage IoT Edge certificates](how-to-manage-device-certificates.md#manage-edge-ca).

When *TempSensor* connects to *EdgeGateway*, *TempSensor* uses the hostname **edgegateway.local** to connect to *EdgeGateway*. *TempSensor* checks the certificate presented by *EdgeGateway* and verifies that the certificate common name is **edgegateway.local**. If the certificate common name is different, *TempSensor* rejects the connection.

> [!NOTE]
> For simplicity, the example shows subject certificate common name (CN) as property that is validated. In practice, if a certificate has a subject alternative name (SAN), SAN is validated instead of CN. Generally, because SAN can contain multiple values, it has both the main domain/hostname for the certificate holder as well as any alternate domains.

#### Why does EdgeGateway need to be told about its own hostname?

*EdgeGateway* doesn't have a reliable way to know how other clients on the network can connect to it. For example, on a private network, there could be DHCP servers or mDNS services that list *EdgeGateway* as `10.0.0.2` or `example-mdns-hostname.local`. But, some networks could have DNS servers that map `edgegateway.local` to *EdgeGateway's* IP address `10.0.0.2`.

To solve the issue, IoT Edge uses the configured hostname value in `config.toml` and creates a server certificate for it. When a request comes to *edgeHub* module, it presents the certificate with the right certificate common name (CN).

#### Why does IoT Edge create certificates?

In the example, notice there's an *iotedged workload ca edgegateway* in the certificate chain. It's the certificate authority (CA) that exists on the IoT Edge device known as *Edge CA* (formerly known as *Device CA* in version 1.1). Like the *Baltimore CyberTrust root CA* in the earlier example, the *Edge CA* can issue other certificates. Most importantly, and also in this example, it issues the server certificate to *edgeHub* module. But, it can also issue certificates to other modules running on the IoT Edge device.

> [!IMPORTANT]
> By default without configuration, *Edge CA* is automatically generated by IoT Edge module runtime when it starts for the first time, known as *quickstart Edge CA*, and then it issues a certificate to *edgeHub* module. This process speeds downstream device connection by allowing *edgeHub* to present a valid certificate that is signed. Without this feature, you'd have to get your CA to issue a certificate for *edgeHub* module. Using an automatically generated *quickstart Edge CA* isn't supported for use in production. For more information on quickstart Edge CA, see [Quickstart Edge CA](how-to-manage-device-certificates.md#quickstart-edge-ca).

#### Isn't it dangerous to have an issuer certificate on the device?

Edge CA is designed to enable solutions with limited, unreliable, expensive, or absent connectivity but at the same time have strict regulations or policies on certificate renewals. Without Edge CA, IoT Edge - and in particular `edgeHub` - cannot function.

To secure Edge CA in production:

* Put the EdgeCA private key in a trusted platform module (TPM), preferably in a fashion where the private key is ephemerally generated and never leaves the TPM.
* Use a Public Key Infrastructure (PKI) to which Edge CA rolls up. This provides the ability to disable or refuse renewal of compromised certificates. The PKI can be managed by customer IT if they have the know how (lower cost) or through a commercial PKI provider.

### Self-signed root CA specificity

The [*edgeHub* module](iot-edge-runtime.md#iot-edge-hub) is an important component that makes up IoT Edge by handling all incoming traffic. In this example, it uses a certificate issued by Edge CA, which is in turn issued by a self-signed root CA. Because the root CA isn't trusted by the OS, the only way *TempSensor* would trust it is to install the CA certificate onto the device. This is also known as the *trust bundle* scenario, where you need to distribute the root to clients that need to trust the chain. The trust bundle scenario can be troublesome because you need access the device and install the certificate. Installing the certificate requires planning. It can be done with scripts, added during manufacturing, or pre-installed in the OS image.

> [!NOTE]
> Some clients and SDKs don't use the OS trusted root store and you need to pass the root CA file directly.

Applying all of these concepts, *TempSensor* can verify it's communicating with the genuine *EdgeGateway* because it presented a certificate that matched the address and the certificate is signed by a trusted root.

To verify the certificate chain, you could use `openssl` on the *TempSensor* device. In this example, notice that the hostname for connection matches the CN of the *depth 0* certificate, and that the root CA match.

```bash
openssl s_client -connect edgegateway.local:8883 --CAfile my_private_root_CA.pem

depth=3 CN = my_private_root_CA
verify return:1
depth=2 CN = my_optional_intermediate_CA
verify return:1
depth=1 CN = iotedged workload ca edgegateway
verify return:1
depth=0 CN = edgegateway.local
verify return: 1
CONNECTED(00000003)
---
Certificate chain
0 s:/CN=edgegateway.local
  i:/CN=iotedged workload ca edgegateway
1 s:/CN=iotedged workload ca edgegateway
  i:/CN=my_optional_intermediate_CA
2 s:/CN=my_optional_intermediate_CA
  i:/CN=my_private_root_CA
```

To learn more about `openssl` command, see [OpenSSL documentation](https://www.openssl.org/docs/).

You could also inspect the certificates where they're stored by default in `/var/lib/aziot/certd/certs`. You can find *Edge CA* certificates, device identity certificates, and module certificates in the directory. You can use `openssl x509` commands to inspect the certificates. For example:

```bash
sudo ls -l /var/lib/aziot/certd/certs
```

```Output
total 24
-rw-r--r-- 1 aziotcs aziotcs 1090 Jul 27 21:27 aziotedgedca-86f154be7ff14480027f0d00c59c223db6d9e4ab0b559fc523cca36a7c973d6d.cer
-rw-r--r-- 1 aziotcs aziotcs 2589 Jun 22 18:25 aziotedgedmoduleIoTEdgeAPIProxy637913460334654299server-c7066944a8d35ca97f1e7380ab2afea5068f39a8112476ffc89ea2c46ca81d10.cer
-rw-r--r-- 1 aziotcs aziotcs 2576 Jun 22 18:25 aziotedgedmoduleedgeHub637911101449272999server-a0407493b6b50ee07b3fedbbb9d181e7bb5f6f52c1d071114c361aca628daa92.cer
-rw-r--r-- 1 aziotcs aziotcs 1450 Jul 27 21:27 deviceid-bd732105ef89cf8edd2606a5309c8a26b7b5599a4e124a0fe6199b6b2f60e655.cer
```

In summary, *TempSensor* can trust *EdgeGateway* because:

* The *edgeHub* module showed a valid **IoT Edge module server certificate** for *edgegateway.local*
* The certificate is issued by **Edge CA** which is issued by `my_private_root_CA`
* This private root CA is also stored in the *TempSensor* as trusted root CA earlier
* Cryptographic algorithms verify that the ownership and issuance chain can be trusted

### Certificates for other modules

Other modules can get server certificates issued by *Edge CA*. For example, a *Grafana* module that has a web interface. It can also get a certificate from *Edge CA*. Modules are treated as downstream devices hosted in the container. However, being able to get a certificate from the IoT Edge module runtime is a special privilege. Modules call the [*workload API*](https://azure.github.io/iot-identity-service/) to receive the server certificate chained to the configured *Edge CA*.

## Gateway verifies device identity

How does *EdgeGateway* verify it's communicating with *TempSensor*? EdgeGateway uses *TLS client authentication* to authenticate TempSensor.

:::image type="content" source="./media/iot-edge-certs/verify-sensor-identity.svg" alt-text="Sequence diagram showing certificate exchange from IoT Edge device to gateway with certificate check verification from IoT Hub certificates.":::

<!-- mermaid
sequenceDiagram
    participant TempSensor
    participant EdgeGateway
    participant ContosoIotHub
    
    TempSensor->>EdgeGateway: Let's talk securely with TLS 🔒
    TempSensor->>EdgeGateway: Here's my certificate 📜
    opt If online
        EdgeGateway- ->>ContosoIotHub: Can you give me the latest list of certificates?
        ContosoIotHub- ->>EdgeGateway: Here you go 📜📜📜
    end
    EdgeGateway->>EdgeGateway: Verify certificate against record
    note over TempSensor, EdgeGateway: Cryptographic algorithms
    EdgeGateway->>TempSensor: Great, let's connect
-->

The sequence is similar to *ContosoIotHub* verifying a device. However, in a gateway scenario, *EdgeGateway* relies on *ContosoIotHub* as the source of truth for the record of the certificates. *EdgeGateway* also keeps an offline copy or cache in case there's no connection to the cloud.

> [!TIP]
> Unlike IoT Edge devices, downstream IoT devices are not limited to thumbprint X.509 authentication. X.509 CA authentication is also an option. Instead of just looking for a match on the thumbprint, *EdgeGateway* can also check if *TempSensor's* certificate is rooted in a CA that has been uploaded to *ContosoIotHub*.

In summary, *EdgeGateway* can trust *TempSensor* because:

* *TempSensor* presented a valid *IoT device identity certificate* for its name
* The identity certificate's thumbprint matches the one uploaded to *ContosoIotHub*
* Cryptographic algorithms verify that the ownership and issuance chain can be trusted

## Where to get the certificates and management

In most cases, you can provide your own certificates or use on auto-generated certificates. For example, *Edge CA* and the *edgeHub* certificate are auto-generated.

However, the best practice is to configure your devices to use an Enrollment over Secure Transport (EST) server to manage x509 certificates. Using an EST server frees you from manually handling the certificates and installing them on devices. For more information about using an EST server, see [Configure Enrollment over Secure Transport Server for Azure IoT Edge](tutorial-configure-est-server.md).

You can use certificates to authenticate to EST server as well. These certificates are used to authenticate with EST servers to issue other certificates. The certificate service uses a bootstrap certificate to authenticate with an EST server. The bootstrap certificate is long-lived. Upon initial authentication, the certificate service makes a request to the EST server to issue an identity certificate. This identity certificate is used in future EST requests to the same server.

If you can't use an EST server, you should request certificates from your PKI provider. You can manage the certificate files manually in IoT Hub and your IoT Edge devices. For more information, [Manage certificates on an IoT Edge device](how-to-manage-device-certificates.md).

For proof of concept development, you can create test certificates. For more information, see [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md).

## Certificates in IoT

### Certificate authority

The certificate authority (CA) is an entity that issues digital certificates. A certificate authority acts as a trusted third party between the owner and the receiver of the certificate. A digital certificate certifies the ownership of a public key by the receiver of the certificate. The certificate chain of trust works by initially issuing a root certificate, which is the basis for trust in all certificates issued by the authority. The root certificate owner can then issue additional intermediate certificates (downstream device certificates).

### Root CA certificate

A root CA certificate is the root of trust of the entire process. In production scenarios, this CA certificate is purchased from a trusted commercial certificate authority like Baltimore, Verisign, or DigiCert. Should you have complete control over the devices connecting to your IoT Edge devices, it's possible to use a corporate level certificate authority. In either event, the entire certificate chain from the IoT Edge to IoT Hub uses it. The downstream IoT devices must trust the root certificate. You can store the root CA certificate either in the trusted root certificate authority store, or provide the certificate details in your application code.

### Intermediate certificates

In a typical manufacturing process for creating secure devices, root CA certificates are rarely used directly, primarily because of the risk of leakage or exposure. The root CA certificate creates and digitally signs one or more intermediate CA certificates. There may be only one, or there may be a chain of these intermediate certificates. Scenarios that would require a chain of intermediate certificates include:

* A hierarchy of departments within a manufacturer
* Multiple companies involved serially in the production of a device
* A customer buying a root CA and deriving a signing certificate for the manufacturer to sign the devices they make on that customer's behalf

In any case, the manufacturer uses an intermediate CA certificate at the end of this chain to sign the edge CA certificate placed on the end device. These intermediate certificates are closely guarded at the manufacturing plant. They undergo strict processes, both physical and electronic for their usage.

## Next steps

* For more information about how to install certificates on an IoT Edge device and reference them from the config file, see [Manage certificate on an IoT Edge device](how-to-manage-device-certificates.md).
* [Understand Azure IoT Edge modules](iot-edge-modules.md)
* [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md)
* This article talks about the certificates that are used to secure connections between the different components on an IoT Edge device or between an IoT Edge device and any downstream devices. You may also use certificates to authenticate your IoT Edge device to IoT Hub. Those authentication certificates are different, and aren't discussed in this article. For more information about authenticating your device with certificates, see [Create and provision an IoT Edge device using X.509 certificates](how-to-provision-devices-at-scale-linux-x509.md).
