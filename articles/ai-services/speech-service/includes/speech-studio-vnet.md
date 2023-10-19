---
author: alexeyo26
ms.service: azure-ai-speech
ms.topic: include
ms.date: 02/23/2022
ms.author: alexeyo
---

## Use of Speech Studio

[Speech Studio](../speech-studio-overview.md) is a web portal with tools for building and integrating Azure AI Speech service in your application. When you work in Speech Studio projects, network connections and API calls to the corresponding Speech resource are made on your behalf. Working with [private endpoints](../speech-services-private-link.md), [virtual network service endpoints](../speech-service-vnet-service-endpoint.md), and other network security options can limit the availability of Speech Studio features. You normally use Speech Studio when working with features, like [Custom Speech](../custom-speech-overview.md), [Custom Neural Voice](../how-to-custom-voice.md) and [Audio Content Creation](../how-to-audio-content-creation.md).


### Reaching Speech Studio web portal from a Virtual network

To use Speech Studio from a virtual machine within an Azure Virtual network, you must allow outgoing connections to the required set of [service tags](../../../virtual-network/service-tags-overview.md) for this virtual network. See details [here](../../cognitive-services-virtual-networks.md#supported-regions-and-service-offerings). 

Access to the Speech resource endpoint is *not* equal to access to Speech Studio web portal. Access to Speech Studio web portal via private or Virtual Network service endpoints is not supported.

### Working with Speech Studio projects

This section describes working with the different kind of Speech Studio projects for the different network security options of the Speech resource. It's expected that the web browser connection to Speech Studio is established. Speech resource network security settings are set in Azure portal.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Speech resource.
1. In the **Resource Management** group in the left pane, select **Networking** > **Firewalls and virtual networks**. 
1. Select one option from **All networks**, **Selected Networks and Private Endpoints**, or **Disabled**. 

#### Custom Speech

The following table describes Custom Speech project accessibility per Speech resource **Networking** > **Firewalls and virtual networks** security setting.

> [!NOTE]
> If you allow only private endpoints via the **Networking** > **Private endpoint connections** tab, then you can't use Speech Studio with the Speech resource. You can still use the Speech resource outside of Speech Studio.  

| Speech resource network security setting | Speech Studio project accessibility |
|--|--|
| All networks | No restrictions |
| Selected Networks and Private Endpoints | Accessible from allowed public IP addresses |
| Disabled | Not accessible |

If you select **Selected Networks and private endpoints**, then you will see a tab with **Virtual networks** and **Firewall** access configuration options. In the **Firewall** section, you must allow at least one public IP address and use this address for the browser connection with Speech Studio. 

If you allow only access via **Virtual network**, then in effect you don't allow access to the Speech resource through Speech Studio. You can still use the Speech resource outside of Speech Studio. 

To use custom speech without relaxing network access restrictions on your production Speech resource, consider one of these workarounds. 
* Create another Speech resource for development that can be used on a public network. Prepare your custom model in Speech Studio on the development resource, and then copy the model to your production resource. See the [Models_CopyTo](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_CopyTo) REST request with [Speech to text REST API](../rest-speech-to-text.md).
* You have the option to not use Speech Studio for custom speech. Use the [Speech to text REST API](../rest-speech-to-text.md) for all custom speech operations. 

#### Custom Voice and Audio Content Creation

You can use Custom Voice and Audio Content Creation Speech Studio projects only when the Speech resource network security setting is **All networks**.
