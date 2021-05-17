---
title: How to use VNet service endpoints with Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use Speech service with Virtual Network service endpoints
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/19/2021
ms.author: alexeyo
---

# Use Speech service through a Virtual Network service endpoint

[Virtual Network](../../virtual-network/virtual-networks-overview.md) (VNet) [service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) provides secure and direct connectivity to Azure services over an optimized route over the Azure backbone network. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. Service Endpoints enables private IP addresses in the VNet to reach the endpoint of an Azure service without needing a public IP address on the VNet.

This article explains how to set up and use VNet service endpoints with Speech service in Azure Cognitive Services.

> [!NOTE]
> Before you proceed, review [how to use virtual networks with Cognitive Services](../cognitive-services-virtual-networks.md).

This article also describes [how to remove VNet service endpoints later, but still use the Speech resource](#use-a-speech-resource-with-a-custom-domain-name-and-without-allowed-vnets).

Setting up a Speech resource for the VNet service endpoint scenarios requires performing the following tasks:
1. [Create Speech resource custom domain name](#create-a-custom-domain-name)
1. [Configure VNet(s) and the Speech resource networking settings](#configure-vnets-and-the-speech-resource-networking-settings)
1. [Adjust existing applications and solutions](#adjust-existing-applications-and-solutions)

> [!NOTE]
> Setting up and using VNet service endpoints for Speech service is very similar to setting up and using the private endpoints. In this article we reference the correspondent sections of the [article on using private endpoints](speech-services-private-link.md), when the content is equivalent.

[!INCLUDE [](includes/speech-vnet-service-enpoints-private-endpoints.md)]

This article describes the usage of the VNet service endpoints with Speech service. Usage of the private endpoints is described [here](speech-services-private-link.md).

## Create a custom domain name

VNet service endpoints require a [custom subdomain name for Cognitive Services](../cognitive-services-custom-subdomains.md). Create a custom domain referring to [this section](speech-services-private-link.md#create-a-custom-domain-name) of the private endpoint article. Note, that all warnings in the section are also applicable to the VNet service endpoint scenario.

## Configure VNet(s) and the Speech resource networking settings

You need to add all Virtual networks that are allowed access via the service endpoint to the Speech resource networking properties.

> [!NOTE]
> To access a Speech resource via the VNet service endpoint you need to enable `Microsoft.CognitiveServices` service endpoint type for the required subnet(s) of your VNet. This in effect will route **all** subnet Cognitive Services related traffic via the private backbone network. If you intend to access any other Cognitive Services resources from the same subnet, make sure these resources are configured to allow your VNet. See next Note for the details.

> [!NOTE]
> If a VNet is not added as allowed to the Speech resource networking properties, it will **not** have access to this Speech resource via the service endpoint, even if the `Microsoft.CognitiveServices` service endpoint is enabled for the VNet. Moreover, if the service endpoint is enabled, but the VNet is not allowed, the Speech resource will be unaccessible for this VNet through a public IP address as well, no matter what the Speech resource other network security settings are. The reason is that enabling `Microsoft.CognitiveServices` endpoint routes **all** Cognitive Services related traffic through the private backbone network, and in this case the VNet should be explicitly allowed to access the resource. This is true not only for Speech but for all other Cognitive Services resources (see the previous Note).  
  
1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the required Speech resource.
1. In the **Resource Management** group on the left pane, select **Networking**.
1. On the **Firewalls and virtual networks** tab, select **Selected Networks and Private Endpoints**. 

> [!NOTE]
> To use VNet service endpoints you need to select **Selected Networks and Private Endpoints** network security option. No other options are supported. If your scenario requires **All networks** option, consider using the [private endpoints](speech-services-private-link.md), which support all three network security options.

5. Select **Add existing virtual network** or **Add new virtual network**, fill in the required parameters, and select **Add** for the existing or **Create** for the new virtual network. Note, that if you add an existing virtual network then the `Microsoft.CognitiveServices` service endpoint will be automatically enabled for the selected subnet(s). This operation can take up to 15 minutes. Also do not forget to consider the Notes in the beginning of this section.

### Enabling service endpoint for an existing VNet

As described in the previous section when you add a VNet as allowed for the speech resource the `Microsoft.CognitiveServices` service endpoint is automatically enabled. However, if later you disable it for whatever reason, you need to re-enable it manually to restore the service endpoint access to the Speech resource (as well as other Cognitive Services resources):

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the required VNet.
1. In the **Settings** group on the left pane, select **Subnets**.
1. Select the required subnet.
1. A new right panel appears. In this panel in the **Service Endpoints** section select `Microsoft.CognitiveServices` from the **Services** drop-down list.
1. Select **Save**.

## Adjust existing applications and solutions

A Speech resource with a custom domain enabled uses a different way to interact with Speech Services. This is true for a custom-domain-enabled Speech resource both with and without service endpoints configured. Information in this section applies to both scenarios.

### Use a Speech resource with a custom domain name and allowed VNet(s) configured

This is the case when **Selected Networks and Private Endpoints** option is selected in networking settings of the Speech resource **AND** at least one VNet is allowed. The usage is equivalent to [using a Speech resource with a custom domain name and a private endpoint enabled](speech-services-private-link.md#adjust-an-application-to-use-a-speech-resource-with-a-private-endpoint).


### Use a Speech resource with a custom domain name and without allowed VNet(s)

This is the case when private endpoints are **not** enabled, and any of the following is true:

- **Selected Networks and Private Endpoints** option is selected in networking settings of the Speech resource, but **no** allowed VNet(s) are configured
- **All networks** option is selected in networking settings of the Speech resource

The usage is equivalent to [using a Speech resource with a custom domain name and without private endpoints](speech-services-private-link.md#adjust-an-application-to-use-a-speech-resource-without-private-endpoints).


[!INCLUDE [](includes/speech-vnet-service-enpoints-private-endpoints-simultaneously.md)]


## Learn more

* [Use Speech service through a private endpoint](speech-services-private-link.md)
* [Azure VNet service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md)
* [Azure Private Link](../../private-link/private-link-overview.md)
* [Speech SDK](speech-sdk.md)
* [Speech-to-text REST API](rest-speech-to-text.md)
* [Text-to-speech REST API](rest-text-to-speech.md)