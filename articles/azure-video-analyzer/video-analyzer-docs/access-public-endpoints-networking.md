---
title: Public endpoints and networking
description: Azure Video Analyzer exposes a set of public network endpoints which enable different product scenarios, including management, ingestion, and playback. This article explains how to access public endpoints and networking. 
ms.topic: how-to
ms.date: 11/04/2021
---

# Public endpoints and networking

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

Azure Video Analyzer exposes a set of public network endpoints that enable different product scenarios, including management, ingestion, and playback. This article describes those endpoints, and provides some details about how they are used. The diagram below depicts those endpoints, in addition to some key endpoints exposed by associated Azure Services.

:::image type="content" source="./media/access-public-endpoints-networking/endpoints-and-networking.svg" alt-text="The image represents Azure Video Analyzer public endpoints":::

## Video Analyzer endpoints 

This section provides a list of Video Analyzer endpoints.

### Streaming

* **Purpose**: exposes audio, video and inference data, which can be consumed by [Video Analyzer player widget](player-widget.md) or compatible DASH/HLS players.
* **Authentication & Authorization**: endpoint authorization is enforced through tokens issued by Video Analyzer service. The tokens are constrained to a single video and are issued implicitly based on the authorization rules applied on the Client and Management APIs on a per video basis. Authorization flow is automatically handled by the Video Analyzer player widget.
* **Requirement**: access to this set of endpoints is required for content playback through the cloud.

### Client APIs

* **Purpose**: exposes metadata (Title, Description, etc.) for the [Video Analyzer video resource](terminology.md#video). This enables the display of rich video objects on customer developed client applications. This metadata is leveraged by the Video Analyzer player widget and can also be leveraged directly by customer applications.
* **Authentication and Authorization**: endpoint authorization is enforced through a combination of customer defined [Access Policies](access-policies.md) plus customer issued JWT Tokens. One or more Access Policies can be defined through the Video Analyzer management APIs. Such policies describe the scope of access and the required claims to be validated on the tokens. Access is denied if there are no access policies created in the Video Analyzer account.
* **Requirement**: access to this endpoint is required for Video Analyzer player widget and similar customer-developed client applications to retrieve video metadata and for playback authorization.

### Edge Service Integration

* **Purpose**: 

    * Exposes policies that are periodically downloaded by the Video Analyzer edge module. Such policies control basic behaviors of the edge module, such as billing and connectivity requirements.
    * Orchestration of video publishing to the cloud, including the retrieval of Azure storage SAS URLs that allows for the Video Analyzer edge module to record video data into the customer’s storage account.
* **Authentication and Authorization**: initial authentication is done through a short-lived Provisioning Token issued by the Video Analyzer management APIs. Once the initial handshake is completed, the module and service exchange a set of auto-rotating authorization keys that are used from this point forward.
* **Requirement**: access to this endpoint is required for the correct functioning of the Video Analyzer Edge module. The edge module will stop functioning if this endpoint cannot be reached within a period of 36 hours.

## Telemetry

* **Purpose**:  optional periodic submission of telemetry data which enables Microsoft to better understand how the Video Analyzer edge module is used and proactively identify future improvements that can be done on compatibility, performance, and other product areas.
* **Authentication and Authorization**: authorization is based on a pre-established key.
* **Requirement**: access to this endpoint is optional and does not interfere with the product functionality. Data collection and submission can be disabled through the module twin properties.

## Associated Azure endpoints 

> [!NOTE]
> The list of endpoints described in this article, is not meant to be a comprehensive list of the associated service endpoints. It is an informative list of the endpoints which are required for the normal operation of Video Analyzer. Refer to each individual Azure service documentation for a complete list of the endpoints exposed by each respective service.

## Azure Storage

* **Purpose**: to record audio, video, and inference data when [pipelines](pipeline.md) are configured to store video on the cloud via the [video sink](pipeline.md#video-sink) node.
* **Authentication and Authorization**: authorization is performed by standard Azure Storage service authentication and authorization enforcement. In this case, storage is accessed through container specific SAS URLs.
* **Requirement**: access to this endpoint is only required when a Video Analyzer edge pipeline is configured to archive the video to the cloud.

## IoT Hub

* **Purpose**: control and data plane for Azure IoT Hub and Edge Devices.
* **Authentication and Authorization**: please refer to the Azure IoT Hub documentation.
* **Requirement**: Properly configured and functioning edge device with Azure IoT Edge Runtime is required to ensure that the Azure Video Analyzer edge module operates correctly.

##	TLS encryption 

* **Encryption and Server Authentication**: all Video Analyzer endpoints are exposed through TLS 1.2 compliant endpoints.

##	References 

Public:

* [Azure Resource Manager overview](../../azure-resource-manager/management/overview.md)
* [Understand Azure IoT Hub endpoints](../../iot-hub/iot-hub-devguide-endpoints.md)
* [What is Azure Private Link?](../../private-link/private-link-overview.md)
* [Azure service tags overview](../../virtual-network/service-tags-overview.md)

## Next steps

[Access Policies](access-policies.md) 
