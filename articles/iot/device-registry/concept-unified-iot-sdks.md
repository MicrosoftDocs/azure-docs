---
title: Unified Azure IoT SDKs (preview) for IoT Hub and Azure Device Registry
titleSuffix: Azure Device Registry
description: Learn how the unified Azure IoT SDKs give developers one lifecycle-aware library to provision, connect, secure, and update devices across Azure IoT services.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: concept-article
ms.date: 09/29/2026
ai-usage: ai-assisted
#Customer intent: As a developer building an end-to-end Azure IoT solution, I want to understand the unified Azure IoT SDK strategy and device lifecycle so that I can choose the supported SDK path from provisioning through ongoing operation.
---

# Unified Azure IoT SDKs (preview) for IoT Hub and Azure Device Registry

> [!IMPORTANT]
> The unified Azure IoT SDKs and the capabilities described in this article are currently in public preview. Preview functionality is provided without a service-level agreement and isn't recommended for production workloads.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The unified Azure IoT SDKs (preview) provide a lifecycle-aware programming model for building device applications that work with Azure IoT services. The SDKs bring device provisioning, connectivity, credential management, and device operations into a more consistent development model.

Rather than requiring your application to independently coordinate service-specific device libraries and lifecycle state, the unified SDKs introduce a shared connection model and capability-focused clients. This approach is intended to simplify the application logic required to manage the device lifecycle.

The unified SDKs are new SDKs and are currently available for evaluation in preview. Existing Azure IoT Hub and Device Provisioning Service SDKs remain available for existing production scenarios.

This article describes the unified SDK strategy and its device lifecycle model so that you can evaluate the preview SDK that's appropriate for your device application.

## The unified SDK strategy

The unified SDKs (preview) use one shared *connection client* and a set of capability-focused *feature clients*. 
The connection client handles common device lifecycle tasks such as provisioning through the Device Provisioning Service, setting up connectivity with the assigned IoT Hub endpoint, managing connection state, and supporting recovery when connectivity changes.

Feature clients use the shared connection and provide device capabilities such as telemetry, device twins, direct methods, and other capabilities available in the corresponding preview SDK.

This architecture provides a consistent application model across the device lifecycle. Instead of independently coordinating provisioning, connectivity, credentials, and individual device capabilities, your application works with a common SDK lifecycle and adds the feature clients it needs.

The SDK manages service and protocol-specific behavior associated with the connection lifecycle so that device applications don't need to implement those details independently.

> [!NOTE]
> Capability availability can vary by SDK, language, configuration, and preview version. Review the documentation and samples for the specific SDK version you're evaluating.

The unified Azure IoT SDKs are new SDKs rather than revisions of the existing Azure IoT Hub and Device Provisioning Service SDKs.

Existing Azure IoT SDKs continue to be the supported choice for existing production scenarios. Evaluate the unified SDKs when you want to explore the new lifecycle model and preview capabilities.

For Device Provisioning Service architecture and deployment guidance, see [Device Provisioning Service deployment-at-scale best practices](../../iot-dps/concepts-deploy-at-scale.md).

## The end-to-end Azure IoT device lifecycle

The unified SDKs model the device lifecycle as a continuous journey rather than a series of disconnected service calls. A typical device moves through the following stages:

- **Establish an initial device identity.** The device starts with the credentials required for its configured provisioning or connection scenario.
- **Provision the device.** The connection client can use the Device Provisioning Service to register the device and obtain its assigned IoT Hub endpoint.
- **Connect and operate.** After a connection is established, the application can use the feature clients available in the selected SDK to interact with IoT Hub.
- **Manage device credentials.** Preview certificate-management capabilities can support scenarios such as certificate enrollment and renewal where they're available and configured.
- **Use additional device capabilities.** Depending on the SDK and preview version, additional feature clients can expose device-management or lifecycle capabilities.
- **Recover connectivity.** The connection client provides lifecycle behavior for reconnecting or reprovisioning when required by the supported SDK scenario.

Because the connection client coordinates these stages, your application follows one consistent flow. The SDK handles transient connection recovery, but a retry can repeat an operation, so your application remains responsible for making non-idempotent operations safe to retry or for detecting duplicates.

Applications remain responsible for their own business logic and for handling application operations safely when an operation can be retried or repeated.

## Map Azure IoT capabilities to SDK clients

The unified SDK architecture separates common connection lifecycle behavior from capability-specific device operations.

| Lifecycle area | Azure capability | SDK role |
|---|---|---|
| Provisioning | Device Provisioning Service | Connection client |
| Connectivity and device messaging | Azure IoT Hub | Connection client and feature clients |
| Device representation and management | Azure Device Registry | Service and management-plane APIs |
| Certificate lifecycle | Certificate enrollment and renewal | Device and service capabilities where available in preview |
| Device lifecycle capabilities | Additional Azure IoT capabilities | Feature-specific clients where available in preview |

Device-side clients handle the supported provisioning, connectivity, and device operations available in each preview SDK.

Because the unified SDKs are evolving during preview, the exact capability set differs by language and SDK version. Use the documentation for the specific SDK you're evaluating to determine which capabilities are currently available.

## Choose the unified Azure IoT SDK for your language

Unified Azure IoT SDKs are currently available in preview for .NET and C.

Choose the SDK that matches your device application language, and then review its version-specific documentation, samples, supported capabilities, and known limitations before adopting it.

The C SDK is designed for native C device applications and supports a range of device environments. Review the C SDK documentation for its platform requirements, build configuration, and currently supported capabilities.

| Language | Package or source | Version | Documentation | Availability |
|---|---|---|---|---|
| .NET | `Microsoft.Azure.Iot.Device` | `1.1.0` | [nuget v1.1.0](https://www.nuget.org/packages/Microsoft.Azure.Iot.Device/1.1.0) | Preview |
| .NET | `Microsoft.Azure.Iot.Device` | `2.0.0-preview2` |  [nuget v2.0.0-preview2](https://www.nuget.org/packages/Microsoft.Azure.Iot.Device/2.0.0-preview2) | Preview |
| C | GitHub source | See C SDK documentation | [Unified C SDK documentation](https://github.com/Azure/azure-iot-sdk/blob/releases/public-preview/c/README.md) | Preview |


> [!IMPORTANT]
> The versions and SDKs listed here are preview offerings. Don't interpret a package version without a `-preview` suffix as indicating that all unified Azure IoT SDK capabilities or related Azure IoT integrations are generally available.
>
> Review the documentation for the specific SDK version you're evaluating to understand its supported scenarios and current preview limitations.

For production applications that depend on capabilities provided by the existing Azure IoT Hub or Device Provisioning Service SDKs, continue to use the applicable in-market SDK unless the documentation for the unified SDK explicitly identifies your scenario as supported for production use.
