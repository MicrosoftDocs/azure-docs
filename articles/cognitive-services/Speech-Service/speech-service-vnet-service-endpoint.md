---
title: Use Virtual Network service endpoints with Speech service
titleSuffix: Azure Cognitive Services
description: This article describes how to use Speech service with Azure Virtual Network service endpoint.
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

[Azure Virtual Network](../../virtual-network/virtual-networks-overview.md) [service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) provides secure and direct connectivity to Azure services over an optimized route on the Azure backbone network. Endpoints help you secure your critical Azure service resources to only your virtual networks. Service endpoints enables private IP addresses in the virtual network to reach the endpoint of an Azure service without needing a public IP address on the virtual network.

This article explains how to set up and use Virtual Network service endpoints with Speech service in Azure Cognitive Services.

> [!NOTE]
> Before you start, review [how to use virtual networks with Cognitive Services](../cognitive-services-virtual-networks.md).

This article also describes [how to remove Virtual Network service endpoints later but still use the Speech resource](#use-a-speech-resource-with-a-custom-domain-name-and-without-allowed-vnets).

To set up a Speech resource for Virtual Network service endpoint scenarios, you need to:
1. [Create a Speech resource custom domain name.](#create-a-custom-domain-name)
1. [Configure virtual networks and the Speech resource networking settings.](#configure-vnets-and-the-speech-resource-networking-settings)
1. [Adjust existing applications and solutions.](#adjust-existing-applications-and-solutions)

> [!NOTE]
> Setting up and using Virtual Network service endpoints for Speech service is similar to setting up and using the private endpoints. In this article, we refer to the corresponding sections of the [article on using private endpoints](speech-services-private-link.md) when the procedure is the same.

[!INCLUDE [](includes/speech-vnet-service-enpoints-private-endpoints.md)]

This article describes how to use Virtual Network service endpoints with Speech service. For information about private endpoints, see [Use Speech service through a private endpoint](speech-services-private-link.md).

## Create a custom domain name

Virtual Network service endpoints require a [custom subdomain name for Cognitive Services](../cognitive-services-custom-subdomains.md). Create a custom domain by following the [guidance](speech-services-private-link.md#create-a-custom-domain-name) in the private endpoint article. Note that all warnings in the section also apply to Virtual Network service endpoints.

## Configure virtual networks and the Speech resource networking settings

You need to add all virtual networks that are allowed access via the service endpoint to the Speech resource networking properties.

> [!NOTE]
> To access a Speech resource via the Virtual Network service endpoint, you need to enable the `Microsoft.CognitiveServices` service endpoint type for the required subnets of your virtual network. Doing so will route all subnet traffic related to Cognitive Services through the private backbone network. If you intend to access any other Cognitive Services resources from the same subnet, make sure these resources are configured to allow your virtual network. 
>
> If a virtual network isn't added as *allowed* in the Speech resource networking properties, it won't have access to the Speech resource via the service endpoint, even if the `Microsoft.CognitiveServices` service endpoint is enabled for the virtual network. And if the service endpoint is enabled but the virtual network isn't allowed, the Speech resource won't be accessible for the virtual network through a public IP address, no matter what the Speech resource's other network security settings are. That's because enabling the `Microsoft.CognitiveServices` endpoint routes all traffic related to Cognitive Services through the private backbone network, and in this case the virtual resource should be explicitly allowed to access the resource. This is true for all Cognitive Services resources, not just for Speech resources.  
  
1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the required Speech resource.
1. In the **Resource Management** group in the left pane, select **Networking**.
1. On the **Firewalls and virtual networks** tab, select **Selected Networks and Private Endpoints**. 

   > [!NOTE]
   > To use Virtual Network service endpoints, you need to select the **Selected Networks and Private Endpoints** network security option. No other options are supported. If your scenario requires the **All networks** option, consider using [private endpoints](speech-services-private-link.md), which support all three network security options.

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