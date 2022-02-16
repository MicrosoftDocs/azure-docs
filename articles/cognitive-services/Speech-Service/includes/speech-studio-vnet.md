---
author: alexeyo26
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 01/25/2022
ms.author: alexeyo
---

## Use of Speech Studio

[Speech Studio](../speech-studio-overview.md) is a web portal with tools for building and integrating Azure Cognitive Speech service in your application. When you work in Speech Studio projects, network connections and API calls to the corresponding Speech resource are made on your behalf. Working with [private endpoints](../speech-services-private-link.md), [virtual network service endpoints](../speech-service-vnet-service-endpoint.md), and other network security options can limit the availability of Speech Studio features. You normally use Speech Studio when working with features, like [Custom Speech](../custom-speech-overview.md), [Custom Voice](../how-to-custom-voice.md) and [Audio Content Creation](../how-to-audio-content-creation.md).

When a user is working with Speech Studio, it performs background API calls on behalf of the user in the context of the Speech resource, that owns the Speech Studio project. Because of this, there are certain limitations on how you can use Speech Studio with the Speech resources, that have [private endpoints](../speech-services-private-link.md), [Virtual Network service endpoints](../speech-service-vnet-service-endpoint.md) or other Network security options enabled.

### Reaching Speech Studio web portal from a Virtual network

If you want to use Speech Studio web portal (that is to reach Speech Studio web site with a browser) from a virtual machine within an Azure Virtual network, be sure you allow outgoing connections to the required set of [Service tags](../../../virtual-network/service-tags-overview.md) for this virtual network. See details [here](../../cognitive-services-virtual-networks.md#supported-regions-and-service-offerings). 

Access to the Speech resource endpoint is *not* equal to access to Speech Studio web portal. Access to Speech Studio web portal via private or Virtual Network service endpoints is not supported.

### Working with Speech Studio projects

This section describes working with the different kind of Speech Studio projects for the different network security options of the Speech resource. It's expected that the web browser connection to Speech Studio is established. Speech resource network security settings are set in Azure portal, using **Networking** property, that is in **Resource Management** group of the Speech resource properties.

#### Custom Speech

The following table describes the Custom Speech project accessibility in different scenarios. See also the additional note, that follows the table.

| Speech resource network security setting | Speech Studio project accessibility |
|--|--|
| All networks | No restrictions |
| Selected Networks and Private Endpoints | Accessible from allowed IP addresses |
| Disabled | Not accessible |

> [!NOTE]
> - **Selected Networks and Private Endpoints**. If you select this network security option, you need to allow at least one public IP address and use this address for the browser connection with the Speech Studio. If you allow only Virtual network access, then in effect you don't allow access to the Speech resource through the Speech Studio. Thus, you will not be able to work with the Speech Studio for this resource. See below the possible workaround using Speech-to-text REST API.
>
> - **Private endpoints**. If you restrict the access to the Speech resource through a private endpoint only, you will not be able to work with the Speech Studio for this resource. The reason is, that the private endpoint is not reachable for Speech Studio. See below the possible workaround using Speech-to-text REST API.

Note, that all Custom Speech operations, which you can do with the Speech Studio are also accessible via [Speech-to-text REST API v3.0](../rest-speech-to-text.md#speech-to-text-rest-api-v30). To use it, you need just access to the Speech resource endpoint, no additional Speech Studio web portal access is required. So in case your scenario requires, for instance access through private endpoints only, you may use this option.

Alternatively, you may create two Speech resources: Production and Development. Set more relaxed network security rules on the Development resource to allow the comfortable usage of the Speech Studio and prepare your custom model. When you are satisfied with the model state, copy it to Production resource using [Copy Model](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription) REST Request from [Speech-to-text REST API v3.0](../rest-speech-to-text.md#speech-to-text-rest-api-v30). This way you can ensure your Production Speech resource network settings are always set to the required security level.

#### Custom Voice. Audio Content Creation

Custom Voice and Audio Content Creation allow the access to the related Speech Studio project only when the correspondent Speech resource network security setting is *All networks*.  

If you need to enable IP-filtering, private, or Virtual Network service endpoint access for your Speech resource and at the same time use Custom Voice models and work on them with the help of the Speech Studio, the following workaround can be used.

Create two Speech resources: Production and Development. Set network security rules on the Development resource to allow the usage of the Speech Studio and prepare your Custom Voice model. When you are satisfied with the model state, copy it to Production resource using *Copy to project* button, that you will find in *Train model* section of your Custom Voice project. This way you can ensure your Production Speech resource network settings are always set to the required security level.

