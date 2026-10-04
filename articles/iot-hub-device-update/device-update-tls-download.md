---
title: Understand Device Update for Azure IoT Hub TLS download capabilities
description: Key concepts to understand for TLS download of update content from Device Update for IoT Hub.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 08/07/2026
ms.subservice: device-update
---

# Understand download security (TLS) for Device Update for IoT Hub

Devices download update content from Device Update for IoT Hub over either **HTTP** or **HTTPS**. HTTPS is HTTP secured with Transport Layer Security (TLS), which encrypts update content in transit. **Download security** is the setting that controls which protocol a device uses.

> [!IMPORTANT]
> Device Update data plane API version `2026-06-01` introduces download security, which lets you choose whether deployments download update content over **HTTPS** (recommended) or **HTTP**. Deployments created with this version use HTTPS unless you select HTTP. Existing deployments are unaffected.
>
> Migrate to API version `2026-06-01` ahead of the scheduled retirement dates: **February 28, 2027** for preview API versions, and **August 31, 2029** for API version `2022-10-01`. Migration applies to direct REST API calls and to the Device Update data plane SDKs. If you use Azure CLI, update the `azure-iot` extension to the latest version.

Download security is a self-service setting that applies per deployment. You select it when you create a deployment, by using any of the following methods:

- Azure portal
- Azure CLI
- Device Update REST APIs
- Device Update data plane SDKs

New deployments use the selected download security protocol and the corresponding [Device Update data plane API version](/rest/api/deviceupdate/dataplane/duiothub/device-management/create-or-update-deployment?view=rest-deviceupdate-dataplane-duiothub-2026-06-01&preserve-view=true). Existing deployments are unaffected and continue to use their original configuration.

To select download security when you create a deployment, see [Deploy an update by using Device Update for IoT Hub](deploy-update.md).

> [!IMPORTANT]
> Device Update data plane API version `2026-06-01` uses HTTPS as the default download protocol for newly created deployments. Before you create a deployment that uses HTTPS, verify that the target devices are ready for HTTPS downloads. To use HTTP instead, explicitly select HTTP when you create the deployment. Existing deployments retain their original download security configuration.

## General guidance

Use this section to decide which download security protocol to use for your deployments.

### What HTTP and HTTPS mean for downloads

- **HTTP**: Update content is downloaded over an unencrypted connection, so the content isn't protected while in transit.
- **HTTPS (TLS)**: Update content is downloaded over a connection secured with TLS, which encrypts the content in transit between the Device Update service and the device.

### When to use each

**HTTPS** is the default for new deployments and can help you meet security or compliance requirements for encrypting data in transit. Use HTTPS unless your devices can't download update content over HTTPS.

Use **HTTP** only when the Device Update agent on the device can't download from an HTTPS URL, or when in-transit encryption isn't required, such as in isolated testing environments.

### Device readiness considerations

Before you select HTTPS for a deployment, make sure your devices are ready to download update content over HTTPS:

- The Device Update agent on the device must be able to parse and download from HTTPS URLs. Selecting HTTPS changes the URL that Device Update sends to the device, but it doesn't change the agent, so an agent that handles only HTTP URLs fails to download the update.
- The device must trust the required root certificate authorities. See [Certificate information](#certificate-information).
- The device must support TLS 1.2 or TLS 1.3 and a supported cipher suite. See [TLS versions and cipher suites](#tls-versions-and-cipher-suites).
- Constrained or embedded devices might need code changes. See [Additional considerations for constrained or embedded devices](#additional-considerations-for-constrained-or-embedded-devices).

## Additional considerations for constrained or embedded devices

If you're using FreeRTOS, the [Azure IoT Middleware for FreeRTOS](https://github.com/Azure/azure-iot-middleware-freertos) and [FreeRTOS samples](https://github.com/Azure-Samples/iot-middleware-freertos-samples) available from Microsoft currently support HTTP URLs and need to be modified for TLS (HTTPS) URLs:

The Device Update for IoT Hub implementation in the Azure IoT Middleware for FreeRTOS SDK and samples use the following libraries for downloading the binaries:
[Azure_iot_http.h](https://github.com/Azure/azure-iot-middleware-freertos/blob/7759a42a1eab12818ea2a8f3f940847743968021/source/interface/azure_iot_http.h#L13), which depends on:

- [azure_iot_http_port.h](https://github.com/Azure/azure-iot-middleware-freertos/blob/7759a42a1eab12818ea2a8f3f940847743968021/ports/coreHTTP/azure_iot_http_port.h#L11)

- [azure_iot_transport_interface.h](https://github.com/Azure/azure-iot-middleware-freertos/blob/7759a42a1eab12818ea2a8f3f940847743968021/source/interface/azure_iot_transport_interface.h#L5)

To add HTTPS support, modify **azure_iot_http_port.h** to use the coreHTTP library over a TLS transport. For an example, see the [coreHTTP mutual authentication demo](https://github.com/FreeRTOS/FreeRTOS/tree/main/FreeRTOS-Plus/Demo/coreHTTP_Windows_Simulator/HTTP_Mutual_Auth). The demo shows mutual authentication, but Device Update content downloads use server authentication only, so you don't need to configure a client certificate.

The Device Update for IoT Hub samples also include URL parsing functions that you need to revise. See [sample_azure_iot_adu.c](https://github.com/Azure-Samples/iot-middleware-freertos-samples/blob/main/demos/sample_azure_iot_adu/sample_azure_iot_adu.c) in the Device Update sample for FreeRTOS.

Make sure the device's trust store includes the required root CAs. The FreeRTOS samples don't include them by default, so HTTPS downloads fail during certificate validation until you add them. See [Certificate information](#certificate-information).

Finally, you might also need to make changes to your own implementation, such as changing the HTTPS header buffer to manage the update URL format that your device receives from Device Update.

## Certificate information

Update content downloads use server-authenticated TLS. The device validates the Device Update service certificate against a trusted root certificate authority (CA). The device doesn't present a client certificate, so no client certificate setup is required.

To validate the download endpoint, add both of the following root CAs to the device's trust store:

| Root CA | Key type | Used by |
| --- | --- | --- |
| DigiCert Global Root G3 | ECC | The ECC certificate chain that the download endpoint serves by default. |
| DigiCert Global Root G2 | RSA | The RSA certificate chain, served as a fallback. |

Trusting both roots keeps devices connected across ECC and RSA chains and across certificate rotation.

> [!IMPORTANT]
> Don't configure devices to trust a specific intermediate CA, such as Microsoft Azure RSA TLS Issuing CA 03. Azure rotates intermediate CAs without notice, and a device that trusts only an intermediate CA fails to download update content after a rotation. Trust the root CAs instead.

### TLS versions and cipher suites

HTTPS downloads support TLS 1.2 and TLS 1.3.

The download endpoint serves an ECC (ECDSA) certificate chain by default. The device's TLS stack must enable at least one of the following cipher suites:

- `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384` (ECC, curve P-384). Primary.
- `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384` (RSA). Fallback, TLS 1.2 only.

For the current list of Azure root and subordinate CAs and their thumbprints, see [Azure Certificate Authority details](/azure/security/fundamentals/azure-certificate-authority-details).

## Next steps

- [Deploy an update by using Device Update for IoT Hub](deploy-update.md)
- [Troubleshoot common issues](troubleshoot-device-update.md)
