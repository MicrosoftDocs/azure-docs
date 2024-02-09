---
title: Use Virtual Network service endpoints with Speech service
titleSuffix: Azure AI services
description: This article describes how to use Speech service with an Azure Virtual Network service endpoint.
author: alexeyo26
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 03/19/2021
ms.author: alexeyo
---

# Use Speech service through a Virtual Network service endpoint

[Azure Virtual Network](../../virtual-network/virtual-networks-overview.md) [service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) help to provide secure and direct connectivity to Azure services over an optimized route on the Azure backbone network. Endpoints help you secure your critical Azure service resources to only your virtual networks. Service endpoints enable private IP addresses in the virtual network to reach the endpoint of an Azure service without needing a public IP address on the virtual network.

This article explains how to set up and use Virtual Network service endpoints with Speech service in Azure AI services.

> [!NOTE]
> Before you start, review [how to use virtual networks with Azure AI services](../cognitive-services-virtual-networks.md).

This article also describes [how to remove Virtual Network service endpoints later but still use the Speech resource](#use-a-speech-resource-that-has-a-custom-domain-name-but-that-doesnt-have-allowed-virtual-networks).

To set up a Speech resource for Virtual Network service endpoint scenarios, you need to:
1. [Create a custom domain name for the Speech resource](#create-a-custom-domain-name).
1. [Configure virtual networks and networking settings for the Speech resource](#configure-virtual-networks-and-the-speech-resource-networking-settings).
1. [Adjust existing applications and solutions](#adjust-existing-applications-and-solutions).

> [!NOTE]
> Setting up and using Virtual Network service endpoints for Speech service is similar to setting up and using private endpoints. In this article, we refer to the corresponding sections of the [article on using private endpoints](speech-services-private-link.md) when the procedures are the same.

[!INCLUDE [](includes/speech-vnet-service-enpoints-private-endpoints.md)]

This article describes how to use Virtual Network service endpoints with Speech service. For information about private endpoints, see [Use Speech service through a private endpoint](speech-services-private-link.md).

## Create a custom domain name

Virtual Network service endpoints require a [custom subdomain name for Azure AI services](../cognitive-services-custom-subdomains.md). Create a custom domain by following the [guidance](speech-services-private-link.md#create-a-custom-domain-name) in the private endpoint article. All warnings in the section also apply to Virtual Network service endpoints.

## Configure virtual networks and the Speech resource networking settings

You need to add all virtual networks that are allowed access via the service endpoint to the Speech resource networking properties.

> [!NOTE]
> To access a Speech resource via the Virtual Network service endpoint, you need to enable the `Microsoft.CognitiveServices` service endpoint type for the required subnets of your virtual network. Doing so will route all subnet traffic related to Azure AI services through the private backbone network. If you intend to access any other Azure AI services resources from the same subnet, make sure these resources are configured to allow your virtual network. 
>
> If a virtual network isn't added as *allowed* in the Speech resource networking properties, it won't have access to the Speech resource via the service endpoint, even if the `Microsoft.CognitiveServices` service endpoint is enabled for the virtual network. And if the service endpoint is enabled but the virtual network isn't allowed, the Speech resource won't be accessible for the virtual network through a public IP address, no matter what the Speech resource's other network security settings are. That's because enabling the `Microsoft.CognitiveServices` endpoint routes all traffic related to Azure AI services through the private backbone network, and in this case the virtual network should be explicitly allowed to access the resource. This guidance applies for all Azure AI services resources, not just for Speech resources.  
  
1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Speech resource.
1. In the **Resource Management** group in the left pane, select **Networking**.
1. On the **Firewalls and virtual networks** tab, select **Selected Networks and Private Endpoints**. 

   > [!NOTE]
   > To use Virtual Network service endpoints, you need to select the **Selected Networks and Private Endpoints** network security option. No other options are supported. If your scenario requires the **All networks** option, consider using [private endpoints](speech-services-private-link.md), which support all three network security options.

5. Select **Add existing virtual network** or **Add new virtual network** and provide the required parameters. Select **Add** for an existing virtual network or **Create** for a new one. If you add an existing virtual network, the `Microsoft.CognitiveServices` service endpoint will automatically be enabled for the selected subnets. This operation can take up to 15 minutes. Also, see the note at the beginning of this section.

### Enabling service endpoint for an existing virtual network 

As described in the previous section, when you configure a virtual network as *allowed* for the Speech resource, the `Microsoft.CognitiveServices` service endpoint is automatically enabled. If you later disable it, you need to re-enable it manually to restore the service endpoint access to the Speech resource (and to other Azure AI services resources):

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the virtual network.
1. In the **Settings** group in the left pane, select **Subnets**.
1. Select the required subnet.
1. A new panel appears on the right side of the window. In this panel, in the **Service Endpoints** section, select `Microsoft.CognitiveServices` in the **Services** list.
1. Select **Save**.

## Adjust existing applications and solutions

A Speech resource that has a custom domain enabled interacts with the Speech service in a different way. This is true for a custom-domain-enabled Speech resource regardless of whether service endpoints are configured. Information in this section applies to both scenarios.

### Use a Speech resource that has a custom domain name and allowed virtual networks 

In this scenario, the **Selected Networks and Private Endpoints** option is selected in the networking settings of the Speech resource and at least one virtual network is allowed. This scenario is equivalent to [using a Speech resource that has a custom domain name and a private endpoint enabled](speech-services-private-link.md#adjust-an-application-to-use-a-speech-resource-with-a-private-endpoint).


### Use a Speech resource that has a custom domain name but that doesn't have allowed virtual networks

In this scenario, private endpoints aren't enabled and one of these statements is true:

- The **Selected Networks and Private Endpoints** option is selected in the networking settings of the Speech resource, but no allowed virtual networks are configured.
- The **All networks** option is selected in the networking settings of the Speech resource.

This scenario is equivalent to [using a Speech resource that has a custom domain name and that doesn't have private endpoints](speech-services-private-link.md#adjust-an-application-to-use-a-speech-resource-without-private-endpoints).

[!INCLUDE [](includes/speech-studio-vnet.md)]

[!INCLUDE [](includes/speech-vnet-service-enpoints-private-endpoints-simultaneously.md)]

## Learn more

* [Use Speech service through a private endpoint](speech-services-private-link.md)
* [Azure Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md)
* [Azure Private Link](../../private-link/private-link-overview.md)
* [Speech SDK](speech-sdk.md)
* [Speech to text REST API](rest-speech-to-text.md)
* [Text to speech REST API](rest-text-to-speech.md)
