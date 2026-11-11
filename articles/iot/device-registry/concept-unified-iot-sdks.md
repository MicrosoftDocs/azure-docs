---
title: Unified Azure IoT SDKs (preview) for IoT Hub and Azure Device Registry
titleSuffix: Azure Device Registry
description: Learn how to choose Azure IoT device SDKs for provisioning, connectivity, certificate management, and device operations.
author: jesusbar
ms.author: jesusbar
ms.service: azure-iot
ms.topic: concept-article
ms.date: 11/09/2026
ai-usage: ai-assisted
# Customer intent: As a developer building an end-to-end Azure IoT solution, I want to understand the unified Azure IoT SDK strategy and device lifecycle so that I can choose the supported SDK path from provisioning through ongoing operation.
---

# Unified Azure IoT SDKs (preview) for IoT Hub and Azure Device Registry

> [!IMPORTANT]
> Some unified Azure IoT SDK releases and Azure IoT capabilities described in this article are in preview, including .NET SDK version 2.0.0-preview4, C SDK version 2.0.0-preview.2, MQTTv5-enabled IoT Hubs, Azure Device Registry integration with IoT Hub, certificate management, and software updates. Don't interpret an SDK version without a preview suffix as an indication that the Azure IoT capabilities it works with are generally available.
>
> Preview functionality is provided without a service-level agreement and isn't recommended for production workloads. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The unified Azure IoT SDKs provide a lifecycle-aware programming model for building device applications that work with Azure IoT services. They bring device provisioning, connectivity, credential management, and device operations into a more consistent development experience.

Rather than requiring applications to independently coordinate service-specific libraries and device lifecycle state, the unified SDKs introduce a shared connection model and capability-focused clients. This approach simplifies how applications provision devices, establish connections, manage credentials, and interact with Azure IoT services.

The unified SDKs are new SDKs, distinct from the existing Azure IoT Hub and Device Provisioning Service (DPS) SDKs. Existing SDKs remain available for applications that depend on their supported capabilities.

This article explains the unified SDK architecture, the end-to-end device lifecycle, and how to choose the appropriate SDK version based on your application's requirements.

> [!NOTE]
> This article applies to devices that use IoT Hub and Device Provisioning Service (DPS) instances that are integrated with Azure Device Registry. The unified SDKs are separate from the existing Azure IoT Hub and DPS device SDKs that aren't integrated with Azure Device Registry, which remain available for applications that depend on their supported capabilities. For IoT Hub and DPS deployments that aren't integrated with Azure Device Registry, continue to use the device SDKs listed in [Azure IoT device and service SDKs](../../iot-hub/iot-sdks.md).

## The unified SDK strategy

The unified Azure IoT SDKs use one shared *connection client* and a set of capability-focused *feature clients*.

The connection client coordinates common device lifecycle operations, including:

- Provisioning devices through Azure IoT Hub Device Provisioning Service (DPS).
- Establishing connections to the assigned Azure IoT Hub.
- Managing supported authentication and credential lifecycle operations.
- Handling connection recovery, retries, and reprovisioning where applicable.

Feature clients use the shared connection to provide device capabilities such as:

- Device-to-cloud telemetry.
- Device twins.
- Direct methods.
- Additional capabilities supported by the selected SDK and Azure IoT service configuration.

This architecture provides a consistent programming model across the device lifecycle. Applications can use a shared connection client and add the feature clients required for their scenarios.

The SDK coordinates supported service and protocol-specific connection behavior, reducing the amount of lifecycle management logic that applications need to implement.

> [!NOTE]
> Capability availability can vary by SDK language, version, API surface, authentication method, and IoT Hub connection profile. Review the documentation and samples for the specific SDK version you're using.

For DPS architecture and deployment guidance, see [Device Provisioning Service deployment-at-scale best practices](../../iot-dps/concepts-deploy-at-scale.md).

### MQTT-based connectivity

The unified Azure IoT SDKs focus on MQTT-based device connectivity, supporting MQTT 3.1.1 and, where available, MQTT 5.0.

MQTT is a lightweight, widely adopted messaging protocol designed for connected devices. By focusing on MQTT, the unified SDKs provide a more consistent device programming model across provisioning, connectivity, authentication, and device operations. This approach also simplifies the connection lifecycle that developers need to manage.

The unified SDKs support:

- **MQTT 3.1.1:** Connectivity to existing Azure IoT Hubs. All four SDK versions described in this article support MQTT 3.1.1.
- **MQTT 5.0 (preview):** Connectivity to MQTTv5-enabled Azure IoT Hubs participating in the preview, including capabilities specific to the new MQTTv5 experience. Only the preview SDK versions, .NET 2.0.0-preview4 and C 2.0.0-preview.2, support MQTT 5.0.

The unified SDKs don't currently support AMQP or HTTP as device-to-IoT Hub messaging transports. Applications that require these protocols should continue using the existing Azure IoT Hub device SDKs that support them.

> [!NOTE]
> MQTTv5 capabilities require an MQTTv5-enabled Azure IoT Hub in preview. The SDK version alone doesn't enable MQTTv5 features on an existing MQTT 3.1.1 IoT Hub.

For supported protocols, capabilities, and API surfaces, see the [Azure IoT SDK for .NET documentation](https://github.com/Azure/azure-iot-sdk/tree/main/dotnet) and [C SDK documentation](https://github.com/Azure/azure-iot-sdk/tree/main/c). For MQTT 5.0 support in the C SDK, see the [C SDK 2.0.0-preview.2 documentation](https://github.com/Azure/azure-iot-sdk/tree/c/2.0.0-preview.2/c).

## The end-to-end Azure IoT device lifecycle

The unified SDKs model the device lifecycle as a continuous journey rather than a series of disconnected service operations.

A typical device moves through the following stages:

1. **Establish an initial device identity.** The device starts with an X.509 certificate or a symmetric key for shared access signature (SAS) authentication, depending on the supported provisioning scenario. The SDKs support X.509 for MQTT 3.1.1 and MQTT 5.0, while they support SAS authentication only for MQTT 3.1.1.
    - The C SDK also supports Trusted Platform Module (TPM) attestation with DPS for devices that connect to MQTT 3.1.1 IoT Hubs.
    - The .NET SDK doesn't currently support TPM-based authentication.
1. **Provision the device.** The connection client uses DPS to register the device and obtain its assigned IoT Hub endpoint and connection information.
1. **Connect and operate.** The connection client establishes connectivity with the assigned IoT Hub. The application uses feature clients to exchange telemetry and perform supported device operations.
1. **Manage device credentials.** Where certificate management is supported and configured, the SDK participates in certificate enrollment and renewal as part of the device connection lifecycle.
1. **Use additional device capabilities.** Applications can use other supported feature clients according to the selected SDK version and service capabilities.
1. **Recover connectivity.** The connection client provides supported reconnection and reprovisioning behavior when connectivity or device assignment changes.

Because the connection client coordinates these stages, applications can follow a consistent device lifecycle without independently implementing every service interaction.

The SDK handles supported connection recovery behavior, but applications remain responsible for their business logic, persistent application state, and safe handling of operations that might be retried or repeated.

## Map Azure IoT capabilities to SDK clients

The unified SDK architecture separates common connection lifecycle behavior from capability-specific device operations.

| Lifecycle area | Azure capability | SDK role |
|---|---|---|
| Provisioning | Device Provisioning Service (DPS) | Connection client |
| Connectivity and device messaging | Azure IoT Hub | Connection client and feature clients |
| Certificate lifecycle | Certificate enrollment and renewal | Connection client, where supported |
| Device operations | Telemetry, device twins, and direct methods | Feature clients |
| Additional device capabilities | Other supported Azure IoT capabilities | Feature-specific clients, where available |

### How Azure Device Registry fits in

Azure Device Registry complements the device-side SDKs by providing a unified management plane for IoT devices across Azure services.

The unified SDKs don't communicate directly with Azure Device Registry. Instead, devices interact with DPS and IoT Hub, while Azure Device Registry provides device representation, management, and governance capabilities through the Azure management plane.

This separation allows device applications to focus on provisioning, connectivity, and device operations while Azure Device Registry supports centralized management of the device estate.

For more information, see [Azure Device Registry integration with IoT Hub](../../iot-hub/iot-hub-device-registry-overview.md).

## Choose the unified Azure IoT SDK

Unified Azure IoT SDKs are available for .NET and C.

Choose the SDK based on your device application language, required capabilities, and the Azure IoT services your application needs to use.

The unified Azure IoT SDKs are designed for device applications using Azure IoT Hub integrated with Azure Device Registry (ADR), together with Device Provisioning Service (DPS).

These SDKs support the new device lifecycle experience, including provisioning, connectivity, and certificate management where available.

For existing IoT Hub and DPS deployments that aren't integrated with Azure Device Registry, continue using the [existing Azure IoT device SDKs](../../iot-hub/iot-sdks.md) for your preferred programming language.

### Available SDKs

| Language | Package or source | Version | Recommended use | Documentation |
|---|---|---|---|---|
| .NET | `Microsoft.Azure.Iot.Device` | `1.2.0` | Device applications using ADR-integrated IoT Hubs with MQTT 3.1.1 connectivity, DPS provisioning, and supported certificate-management capabilities. | [NuGet package 1.2.0](https://www.nuget.org/packages/Microsoft.Azure.Iot.Device/1.2.0) |
| .NET | `Microsoft.Azure.Iot.Device` | `2.0.0-preview4` | Device applications evaluating MQTTv5 connectivity and capabilities with MQTTv5-enabled IoT Hubs in preview, alongside the unified programming model for supported scenarios. | [NuGet package 2.0.0-preview4](https://www.nuget.org/packages/Microsoft.Azure.Iot.Device/2.0.0-preview4) |
| C | GitHub source | `1.0.0` | Generally available release for native C applications, including embedded devices. Supports MQTT 3.1.1 IoT Hub connectivity, DPS provisioning, and certificate management for ADR-integrated IoT Hub scenarios. | [C SDK 1.0.0 release notes](https://github.com/Azure/azure-iot-sdk/releases/tag/c%2F1.0.0) |
| C | GitHub source | `2.0.0-preview.2` | Native C applications evaluating MQTTv5 connectivity with MQTTv5-enabled IoT Hubs in preview and Azure Device Registry software updates (preview). Includes the capabilities of version 1.0.0. | [C SDK 2.0.0-preview.2 release notes](https://github.com/Azure/azure-iot-sdk/releases/tag/c%2F2.0.0-preview.2) |

For the latest published .NET SDK versions, including prerelease versions, see [Microsoft.Azure.Iot.Device on NuGet](https://www.nuget.org/packages/Microsoft.Azure.Iot.Device).

For C SDK version-specific changes, review the Azure IoT SDK C release notes in the [GitHub releases](https://github.com/Azure/azure-iot-sdk/releases) listing and the corresponding release source.

> [!NOTE]
> The unified Azure IoT SDKs support generally available and preview capabilities, depending on the SDK version and service configuration. Devices communicate with DPS and their assigned IoT Hub, while Azure Device Registry provides device management through the Azure management plane. MQTTv5 capabilities require an MQTTv5-enabled IoT Hub in preview and aren't enabled by installing the preview SDK alone.

### When to use the .NET SDK versions

**Use version 1.2.0 for supported IoT Hub MQTT 3.1.1 scenarios.**

Version 1.2.0 provides the unified device programming model for applications using supported DPS provisioning, IoT Hub connectivity, and device operations.

This version is appropriate when your application doesn't require the new MQTTv5-specific capabilities currently available in preview. Version 1.2.0 doesn't support connections to MQTTv5-enabled IoT Hubs.

**Use version 2.0.0-preview4 to evaluate MQTTv5 capabilities.**

Version 2.0.0-preview4 supports MQTTv5-enabled IoT Hubs and includes two API surfaces within the same NuGet package:

- **Unified API surface:** Provides a common programming model across supported MQTT 3.1.1 and MQTT 5.0 IoT Hub connection profiles. The SDK uses the connection profile assigned through DPS to establish the appropriate connection. Features that only MQTTv5-enabled IoT Hubs support, such as twin pushes and direct method probe handling, aren't part of this surface.
- **MQTTv5-specific API surface:** Exposes capabilities specific to MQTTv5-enabled IoT Hubs that aren't part of the common Unified API surface. This surface connects only to MQTTv5-enabled IoT Hubs and supports only X.509 authentication. In version 2.0.0-preview4, it doesn't support certificate management or custom topics.

You don't need a separate NuGet package for each API surface.

> [!IMPORTANT]
> **MQTTv5 support is currently a preview capability.** To take advantage of MQTTv5 connectivity and MQTTv5-specific features, your device must be provisioned to an MQTTv5-enabled Azure IoT Hub participating in the preview.
>
> Installing version `2.0.0-preview4` alone doesn't enable MQTTv5 capabilities on an existing MQTT 3.1.1 IoT Hub.

The Unified API surface is intended to minimize application differences across supported IoT Hub connection profiles. However, individual capabilities and authentication methods can still vary depending on the assigned IoT Hub.

Applications that explicitly require MQTTv5-only features should use the MQTTv5-specific API surface and an eligible MQTTv5-enabled IoT Hub.

For details about the available features and differences between API surfaces, see the [.NET SDK README](https://github.com/Azure/azure-iot-sdk/tree/main/dotnet). 
Samples for both API surfaces are in the [preview branch](https://github.com/Azure/azure-iot-sdk/tree/releases/public-preview/dotnet/samples).

### When to use the C SDK versions

The unified C SDK provides a shared connection lifecycle and capability-focused programming model for native C applications, including embedded and constrained-device environments.

**Use version 1.0.0 for MQTT 3.1.1 IoT Hub scenarios.**

Version 1.0.0 is the generally available release of the unified C SDK. It supports MQTT 3.1.1 IoT Hub connectivity but doesn't support MQTTv5-enabled IoT Hubs or software updates. If DPS assigns the device to an IoT Hub connection profile that version 1.0.0 doesn't support, the connection fails.

**Use version 2.0.0-preview.2 to evaluate MQTTv5 and software updates.**

Version 2.0.0-preview.2 is a preview release that includes the capabilities of version 1.0.0 and adds support for MQTTv5-enabled IoT Hubs and Azure Device Registry software updates. DPS returns the assigned IoT Hub connection profile, and the SDK selects MQTT 3.1.1 or MQTT 5.0 accordingly. Preview APIs might change before a stable release.

The SDK supports documented scenarios involving:

- DPS provisioning and IoT Hub connectivity.
- X.509 and SAS authentication, DPS TPM attestation, and supported certificate-management operations.
- Device-to-cloud telemetry.
- Device twin operations and direct methods.
- Connection recovery and reprovisioning.
- Additional device operations supported by the selected connection profile.
- Azure Device Registry software updates (preview) in version 2.0.0-preview.2.

Some C SDK capabilities are specific to MQTT 3.1.1 and aren't available for MQTTv5-enabled IoT Hubs. For example, cloud-to-device messaging, file upload, and certificate renewal through IoT Hub require the MQTT 3.1.1 connection profile.

The C SDK has its own platform requirements, dependencies, build configuration, and supported-feature matrix. Review the documentation and samples for the selected release before integrating it into a device application.

For version 1.0.0, see the [Unified C SDK documentation](https://github.com/Azure/azure-iot-sdk/tree/main/c) and [C SDK samples](https://github.com/Azure/azure-iot-sdk/tree/main/c/samples).
For version 2.0.0-preview.2, see the [C SDK 2.0.0-preview.2 documentation and samples](https://github.com/Azure/azure-iot-sdk/tree/c/2.0.0-preview.2/c).
For release notes, see [GitHub releases](https://github.com/Azure/azure-iot-sdk/releases).

## Supported scenarios and considerations

The unified SDKs provide a common device lifecycle architecture, but they don't necessarily provide feature parity with every capability of the existing Azure IoT Hub and DPS SDKs.

Review the following considerations when selecting an SDK.

### Provisioning and authentication

The unified SDKs integrate Device Provisioning Service (DPS) into the device connection lifecycle.

Device authentication during DPS provisioning (onboarding credential) is separate from authentication to the assigned IoT Hub (operational credential). Depending on the SDK and supported configuration, devices can use an X.509 certificate, a symmetric key (SAS), or, with the C SDK, TPM attestation to authenticate with DPS.

For the .NET SDK:

- **DPS provisioning:** Supports X.509 and symmetric-key (SAS) authentication. SAS scenarios are supported only with MQTT 3.1.1 IoT Hubs.
- **MQTT 3.1.1 IoT Hub:** Supports X.509 and SAS authentication, depending on the configured scenario.
- **MQTTv5-enabled IoT Hub (preview):** Requires X.509 authentication. In version 2.0.0-preview4, certificate management isn't available for MQTTv5-enabled IoT Hubs, so devices must use an existing supported X.509 certificate.
- **TPM authentication:** Isn't currently supported by the unified .NET SDK.

For the C SDK:

- **DPS provisioning:** Supports X.509 and symmetric-key (SAS) authentication through the connection client, with certificate-provider integration for X.509 credentials. DPS TPM attestation is supported as a separate registration step over HTTPS before the device connects to its assigned IoT Hub. Because TPM registration happens outside the connection client, the connection client doesn't automatically reprovision devices that use TPM attestation.
- **MQTT 3.1.1 IoT Hub:** Supports X.509 and SAS authentication. Devices that use TPM attestation authenticate with SAS tokens signed by the TPM.
- **MQTTv5-enabled IoT Hub (preview):** Version 2.0.0-preview.2 requires X.509 authentication and doesn't support SAS. Devices can use an existing supported X.509 certificate or obtain an operational certificate through certificate management during DPS provisioning.
- **Hardware-backed keys:** X.509 private keys can be held in a PKCS#11 token or a TPM 2.0, used through PSA Crypto, or accessed through an application-provided signing callback.

> [!NOTE]
> SAS authentication to DPS doesn't imply SAS authentication to the assigned IoT Hub. For example, with C SDK version 2.0.0-preview.2, a device can provision using SAS, obtain an operational X.509 certificate through DPS, and use that certificate to authenticate with an MQTTv5-enabled IoT Hub.

### Certificate management

Certificate management is an optional capability that you enable and configure at the Azure Device Registry (ADR) namespace level. It provides Microsoft-backed public key infrastructure (PKI) for issuing and managing operational X.509 certificates that devices use to authenticate with IoT Hub.

For supported configurations, devices can use either an existing X.509 certificate or a symmetric-key (SAS) credential for initial onboarding through DPS. When you configure certificate issuance, the device submits a certificate signing request (CSR), and DPS returns an ADR-issued operational certificate.

The device then uses the operational certificate to authenticate with its assigned IoT Hub.

Certificate renewal capabilities depend on the IoT Hub connection profile:

- **MQTT 3.1.1:** Supports certificate renewal through IoT Hub where certificate management is configured.
- **MQTT 5.0 (preview):** Obtain operational certificates through DPS. Renewal requires reprovisioning through DPS rather than certificate renewal through IoT Hub.

Certificate management support also differs by SDK version:

| SDK version | Certificate issuance through DPS | Certificate renewal through IoT Hub | MQTTv5-enabled IoT Hubs |
|---|---|---|---|
| .NET 1.2.0 | Supported | Supported | Not applicable. Version 1.2.0 doesn't support MQTT 5.0. |
| .NET 2.0.0-preview4 | Supported for MQTT 3.1.1 IoT Hubs through the Unified API surface | Supported for MQTT 3.1.1 IoT Hubs through the Unified API surface | Not supported |
| C 1.0.0 | Supported | Supported | Not applicable. Version 1.0.0 doesn't support MQTT 5.0. |
| C 2.0.0-preview.2 | Supported | Supported for MQTT 3.1.1 IoT Hubs | Issuance through DPS is supported. Renew by reprovisioning through DPS. |

The C SDK includes certificate-provider abstractions for integrating certificate storage and cryptographic operations with the device platform. Applications must configure a supported provider and meet the selected SDK's platform requirements.

For more information about configuring and managing this capability at the Azure Device Registry namespace level, see [Certificate management in Azure Device Registry](../iot-certificate-management-overview.md).

### Connectivity and device operations

The unified SDKs provide MQTT-based connectivity and supported device capabilities through feature clients.

For .NET, these capabilities include:

- Device-to-cloud telemetry.
- Device twin operations.
- Direct methods.
- Connection retry and recovery.
- A replaceable MQTT client implementation.

For C, documented capabilities include:

- Device-to-cloud telemetry.
- Device twin operations.
- Direct methods.
- Cloud-to-device messaging for supported MQTT 3.1.1 scenarios.
- File upload for supported MQTT 3.1.1 scenarios.
- Custom topics for MQTTv5-enabled IoT Hubs, in version 2.0.0-preview.2.
- Connection retry, recovery, and reprovisioning.
- Platform-specific integration for native C applications.

Cloud-to-device messaging and file upload aren't available for MQTTv5-enabled IoT Hubs in the unified C SDK. Applications must account for these protocol-specific limitations when selecting a connection profile.

File upload also requires application integration. The C SDK doesn't include an HTTP client, so your application provides the HTTPS requests for file upload operations and uploads the file to Azure Storage. MQTT-based IoT Hub connectivity doesn't mean that every auxiliary operation uses MQTT.

Some operations and features differ between MQTT 3.1.1 and MQTT 5.0 IoT Hub connection profiles.

The unified SDKs aren't intended to provide identical transport and authentication coverage to every existing Azure IoT SDK. For example, don't assume support for AMQP, HTTPS device transport, or TPM authentication unless the selected SDK explicitly documents support.

### Software updates (preview)

Azure Device Registry provides software updates as an optional capability configured at the namespace level. It enables over-the-air updates by using Azure Device Registry groups and jobs to manage update deployments across devices.

The unified C SDK version 2.0.0-preview.2 includes a software updates client that device applications can integrate to check for updates, download and install update content, and report results.

Software updates are currently in preview for IoT Hub-connected devices. The device checks for updates and reports results through its DPS connection rather than through IoT Hub, so the client supports devices assigned to MQTT 3.1.1 or MQTTv5-enabled IoT Hubs. Software updates require X.509 authentication. C SDK version 1.0.0 and the unified .NET SDK don't include a software updates client.

The software updates client is a library, not a standalone update agent. Device applications are responsible for integrating the client and implementing device-specific installation and recovery logic.

For more information, see [Software updates concepts overview](concept-software-updates.md) and the [C SDK software update guide](https://github.com/Azure/azure-iot-sdk/blob/c/2.0.0-preview.2/c/docs/software-update.md).

### Additional device lifecycle capabilities

You can integrate extra Azure IoT capabilities through feature-specific clients where supported.

Availability can differ by SDK language, package version, API surface, and Azure service.

In particular, evaluate software-update capabilities against the documented support of the selected SDK and service. Support in one SDK language doesn't automatically imply equivalent support in another.

For the current implementation scope, consult the repository's supported-feature tables and samples.

## Get started with the unified Azure IoT SDKs

The unified Azure IoT SDKs are available for .NET and C. Choose the SDK that matches your device environment, and review its supported capabilities, service requirements, and samples before integrating it into your application.

### .NET SDK

Microsoft distributes the unified .NET SDK through the `Microsoft.Azure.Iot.Device` NuGet package. Versions 1.2.0 and 2.0.0-preview4 target .NET 10 (`net10.0`).

To install version 1.2.0 for supported MQTT 3.1.1 IoT Hub scenarios:

```dotnetcli
dotnet add package Microsoft.Azure.Iot.Device --version 1.2.0
```

To evaluate version 2.0.0-preview4, including MQTTv5 capabilities:

```dotnetcli
dotnet add package Microsoft.Azure.Iot.Device --version 2.0.0-preview4
```

For package details and implementation examples, see:

- [Microsoft.Azure.Iot.Device on NuGet](https://www.nuget.org/packages/Microsoft.Azure.Iot.Device)
- [.NET SDK documentation and feature matrix](https://github.com/Azure/azure-iot-sdk/tree/main/dotnet)
- [.NET SDK samples](https://github.com/Azure/azure-iot-sdk/tree/main/dotnet/samples)
- [.NET SDK preview samples for the Unified and MQTTv5 API surfaces](https://github.com/Azure/azure-iot-sdk/tree/releases/public-preview/dotnet/samples)

Select a specific package version for repeatable builds. The latest available version isn't necessarily the appropriate choice for every application because preview versions can expose different API surfaces and service capabilities.

### C SDK

You can find the unified C SDK as source code in the [Azure IoT SDK GitHub repository](https://github.com/Azure/azure-iot-sdk). The SDK is designed for native C device applications and offers a shared connection lifecycle along with supported device capabilities.

Version 1.0.0 is available on the repository's `main` branch. **Version 2.0.0-preview.2** is a preview release of the unified C SDK, and preview development continues on the `releases/public-preview` branch.

Unlike the .NET SDK, you integrate the C SDK into your application through its source and build system. Both versions support Linux, Windows, ESP32 through ESP-IDF components, and Yocto. You can consume the SDK with CMake by using `add_subdirectory()`, `FetchContent`, or an installed package. Check the repository documentation for platform requirements, dependencies, build instructions, and supported configurations.

To get started, see:

- [C SDK source and documentation](https://github.com/Azure/azure-iot-sdk/tree/main/c) for supported platforms, dependencies, and build configuration.
- [C SDK samples](https://github.com/Azure/azure-iot-sdk/tree/main/c/samples) for provisioning, connectivity, and supported device operations.
- [C SDK build and installation documentation](https://github.com/Azure/azure-iot-sdk/blob/main/c/docs/eng/building.md).
- [C SDK 2.0.0-preview.2 source, documentation, and samples](https://github.com/Azure/azure-iot-sdk/tree/c/2.0.0-preview.2/c) for MQTTv5 and software updates.
- Release notes for [C SDK 1.0.0](https://github.com/Azure/azure-iot-sdk/releases/tag/c%2F1.0.0) and [C SDK 2.0.0-preview.2](https://github.com/Azure/azure-iot-sdk/releases/tag/c%2F2.0.0-preview.2).

C SDK version 2.0.0-preview.2 also provides the software updates client for Azure Device Registry software updates (preview). For more information, see [Software updates concepts overview](concept-software-updates.md).

> [!NOTE]
> SDK capabilities vary by language, version, and IoT Hub configuration. MQTTv5 capabilities require an eligible MQTTv5-enabled IoT Hub participating in the preview. Azure Device Registry software updates are currently available in preview only through C SDK version 2.0.0-preview.2.

## Release information and SDK changes

The unified Azure IoT SDKs continue to evolve as Microsoft adds capabilities.

Use the following resources to review published versions, supported capabilities, implementation examples, and development activity.

| Resource | Information |
|---|---|
| [GitHub releases](https://github.com/Azure/azure-iot-sdk/releases) | Published release tags and available release information |
| [.NET NuGet packages](https://www.nuget.org/packages/Microsoft.Azure.Iot.Device) | Published package versions, dependencies, and installation instructions |
| [.NET SDK documentation](https://github.com/Azure/azure-iot-sdk/tree/main/dotnet) | Supported capabilities, API surfaces, and known limitations |
| [.NET SDK samples](https://github.com/Azure/azure-iot-sdk/tree/main/dotnet/samples) | Implementation examples for supported .NET scenarios |
| [.NET source history](https://github.com/Azure/azure-iot-sdk/commits/main/dotnet) | Changes merged into the .NET SDK |
| [C SDK documentation](https://github.com/Azure/azure-iot-sdk/tree/main/c) | C SDK architecture, supported capabilities, and integration guidance |
| [C SDK samples](https://github.com/Azure/azure-iot-sdk/tree/main/c/samples) | Implementation examples for supported C scenarios |
| [C SDK changelog](https://github.com/Azure/azure-iot-sdk/blob/main/c/CHANGELOG.md) | Changes in each C SDK release |
| [Preview branch](https://github.com/Azure/azure-iot-sdk/tree/releases/public-preview) | Documentation, samples, and ongoing development for the preview SDK versions |

### Current release considerations

**.NET v1.2.0**

- Supports MQTT 3.1.1 IoT Hubs through the Unified API surface. Doesn't support MQTTv5-enabled IoT Hubs.
- Provides DPS provisioning with supported X.509 and SAS authentication.
- Supports certificate issuance through DPS and operational certificate renewal through IoT Hub when certificate management is enabled.
- Includes telemetry, device twins, direct methods, and automatic reconnection and reprovisioning.
- Doesn't support TPM authentication or include the Azure Device Registry software updates client.

**.NET v2.0.0-preview4 (preview)**

- Includes the Unified and MQTTv5-specific API surfaces in one package.
- Supports the shared provisioning and connection lifecycle, with capabilities depending on the assigned IoT Hub connection profile.
- Enables MQTTv5 capabilities with an eligible MQTTv5-enabled IoT Hub participating in the preview.
- Requires X.509 authentication for MQTTv5-enabled IoT Hubs. SAS authentication and certificate management are available only with MQTT 3.1.1 IoT Hubs through the Unified API surface.
- Doesn't currently support custom topics, TPM authentication, or the Azure Device Registry software updates client.
- Preview APIs are subject to change.

**C v1.0.0**

- Provides the unified provisioning and connection lifecycle for native C applications, including embedded environments.
- Supports MQTT 3.1.1 IoT Hub connectivity, telemetry, device twins, direct methods, cloud-to-device messaging, and file upload. Doesn't support MQTTv5-enabled IoT Hubs.
- Supports X.509 and SAS authentication, DPS TPM attestation, and certificate management, including certificate issuance through DPS and operational certificate renewal through IoT Hub.
- Supports reconnection, reprovisioning, and platform-specific integration.
- Doesn't include the software updates client, which is available in version 2.0.0-preview.2.

**C v2.0.0-preview.2 (preview)**

- Includes the capabilities of version 1.0.0 and adds connectivity to MQTTv5-enabled IoT Hubs. DPS returns the assigned IoT Hub connection profile, and the SDK selects MQTT 3.1.1 or MQTT 5.0.
- Supports telemetry, device twins, and direct methods with both connection profiles, and custom topics with MQTTv5-enabled IoT Hubs.
- Provides X.509 certificate-provider integration and supported certificate-management flows, including certificate issuance through DPS and operational certificate renewal through IoT Hub for MQTT 3.1.1 configurations. MQTTv5-enabled IoT Hubs require X.509 authentication and don't support certificate renewal through IoT Hub.
- Supports connection recovery and reprovisioning for documented scenarios.
- Includes cloud-to-device messaging and file upload for supported MQTT 3.1.1 scenarios. These operations aren't supported for MQTTv5-enabled IoT Hubs.
- Provides an Azure Device Registry software updates client (preview) that checks for updates through DPS and supports devices assigned to MQTT 3.1.1 or MQTTv5-enabled IoT Hubs. Software updates require X.509 authentication.
- Requires platform-specific integration and configuration according to the C SDK documentation.
- Preview APIs might change before a stable release.

For version-specific additions, fixes, and known limitations, see the [Azure IoT SDK release information](https://github.com/Azure/azure-iot-sdk/releases) and the corresponding release documentation.

> [!NOTE]
> SDK capabilities and authentication requirements vary by language, version, and IoT Hub configuration. Certificate management must be enabled and configured at the Azure Device Registry namespace level. MQTTv5 and Azure Device Registry software updates have separate preview requirements.
>
> This section summarizes documented capabilities and release-selection considerations. It isn't a complete changelog. Changes merged into the repository's `main` branch might not be included in a published SDK release, and preview development continues on the `releases/public-preview` branch. Review the corresponding release tag and version-specific documentation when selecting an SDK.

## Related content

- [Unified Azure IoT SDK repository](https://github.com/Azure/azure-iot-sdk)
- [Unified Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk/tree/main/dotnet)
- [Unified Azure IoT SDK for C](https://github.com/Azure/azure-iot-sdk/tree/main/c)
- [Unified Azure IoT SDK releases](https://github.com/Azure/azure-iot-sdk/releases)
- [Microsoft.Azure.Iot.Device on NuGet](https://www.nuget.org/packages/Microsoft.Azure.Iot.Device)
- [Software updates concepts overview (preview)](concept-software-updates.md)
- [Certificate management overview (preview)](../iot-certificate-management-overview.md)
- [SDKs for DPS and Azure IoT Hubs not integrated with Azure Device Registry](../../iot-hub/iot-sdks.md)
