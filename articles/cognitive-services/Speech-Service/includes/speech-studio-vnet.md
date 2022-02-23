---
author: alexeyo26
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 01/25/2022
ms.author: alexeyo
---

## Use of Speech Studio

[Speech Studio](../speech-studio-overview.md) is a web portal with tools for building and integrating Azure Cognitive Speech service in your application. When you work in Speech Studio projects, network connections and API calls to the corresponding Speech resource are made on your behalf. Working with [private endpoints](../speech-services-private-link.md), [virtual network service endpoints](../speech-service-vnet-service-endpoint.md), and other network security options can limit the availability of Speech Studio features. You normally use Speech Studio when working with features, like [Custom Speech](../custom-speech-overview.md), [Custom Neural Voice](../how-to-custom-voice.md) and [Audio Content Creation](../how-to-audio-content-creation.md).


### Reaching Speech Studio web portal from a Virtual network

To use Speech Studio from a virtual machine within an Azure Virtual network, you must allow outgoing connections to the required set of [service tags](../../../virtual-network/service-tags-overview.md) for this virtual network. See details [here](../../cognitive-services-virtual-networks.md#supported-regions-and-service-offerings). 

Access to the Speech resource endpoint is *not* equal to access to Speech Studio web portal. Access to Speech Studio web portal via private or Virtual Network service endpoints is not supported.

### Working with Speech Studio projects

This section describes working with the different kind of Speech Studio projects for the different network security options of the Speech resource. It's expected that the web browser connection to Speech Studio is established. Speech resource network security settings are set in Azure portal, using **Networking** property, that is in **Resource Management** group of the Speech resource properties.

#### Custom Speech

The following table describes Custom Speech project accessibility per Speech resource network security setting.

| Speech resource network security setting | Speech Studio project accessibility |
|--|--|
| All networks | No restrictions |
| Selected Networks and Private Endpoints | Accessible from allowed IP addresses |
| Disabled | Not accessible |

> [!NOTE]
> - **Selected Networks and private endpoints**. If you select this network security option, you need to allow at least one public IP address and use this address for the browser connection with the Speech Studio. If you allow only Virtual network access, then in effect you don't allow access to the Speech resource through the Speech Studio. Thus, you will not be able to work with the Speech Studio for this resource. See below the possible workaround using Speech-to-text REST API.
>
> - **Private endpoints**. If you restrict the access to the Speech resource through a private endpoint only, you will not be able to work with the Speech Studio for this resource. The reason is, that the private endpoint is not reachable for Speech Studio. See below the possible workaround using Speech-to-text REST API.


To use custom speech without relaxing network access restrictions on your production Speech resource, consider one of these workarounds. 
* Create another Speech resource for development that can be used on a public network. Prepare your custom model in Speech Studio on the development resource, and then copy the model to your production resource. See the [Copy Model](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription) REST request with [Speech-to-text REST API v3.0](../rest-speech-to-text.md#speech-to-text-rest-api-v30). 
* You have the option to not use Speech Studio for custom speech. Use the [Speech-to-text REST API v3.0](../rest-speech-to-text.md#speech-to-text-rest-api-v30) for all custom speech operations. 

#### Custom Voice and Audio Content Creation

You can use Custom Voice and Audio Content Creation Speech Studio projects only when the correspondent Speech resource network security setting is *All networks*.

