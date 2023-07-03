---
title: Enable Virtual Network service endpoints with Custom Translator service
titleSuffix: Azure Cognitive Services
description: This article describes how to use Custom Translator service with an Azure Virtual Network service endpoint.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 03/31/2023
ms.author: lajanuar
ms.topic: how-to
---

# Use Custom Translator service through a Virtual Network service endpoint

[Azure Virtual Network](../../../../virtual-network/virtual-networks-overview.md) [service endpoints](../../../../virtual-network/virtual-network-service-endpoints-overview.md) help to provide secure and direct connectivity to Azure services over an optimized route on the Azure backbone network. Endpoints help you secure your critical Azure service resources to only your virtual networks. Service endpoints enable private IP addresses in the virtual network to reach the endpoint of an Azure service without needing a public IP address on the virtual network.

This article explains how to set up and use Virtual Network service endpoints with Custom Translator service in Azure Cognitive Services.

> [!NOTE]
> Before you start, review [how to use virtual networks with Cognitive Services](../../../cognitive-services-virtual-networks.md).

To set up a Translator resource for Virtual Network service endpoint scenarios, you need to:
1. [Create a regional Translator resource - Global is not supported](../../create-translator-resource.md).
1. [Configure virtual networks and networking settings for the Translator resource](#configure-virtual-networks-and-the-translator-resource-networking-settings).


## Configure virtual networks and the Translator resource networking settings

You need to add all virtual networks that are allowed access via the service endpoint to the Translator resource networking properties.

> [!NOTE]
> To access a Translator resource via the Virtual Network service endpoint, you need to enable the `Microsoft.CognitiveServices` service endpoint type for the required subnets of your virtual network. Doing so will route all subnet traffic related to Cognitive Services through the private backbone network. If you intend to access any other Cognitive Services resources from the same subnet, make sure these resources are configured to allow your virtual network. 
>
> If a virtual network isn't added as *allowed* in the Translator resource networking properties, it won't have access to the Translator resource via the service endpoint, even if the `Microsoft.CognitiveServices` service endpoint is enabled for the virtual network. And if the service endpoint is enabled but the virtual network isn't allowed, the Translator resource won't be accessible for the virtual network through a public IP address, no matter what the Translator resource's other network security settings are. That's because enabling the `Microsoft.CognitiveServices` endpoint routes all traffic related to Cognitive Services through the private backbone network, and in this case the virtual network should be explicitly allowed to access the resource. This guidance applies for all Cognitive Services resources, not just for Translator resources.  
  
1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select regional Translator resource.
1. In the **Resource Management** group in the left pane, select **Networking**.
1. On the **Firewalls and virtual networks** tab, select **Selected Networks and Private Endpoints**. 

   > [!NOTE]
   > To use Virtual Network service endpoints, you need to select the **Selected Networks and Private Endpoints** network security option. No other options are supported.

5. Select **Add existing virtual network** or **Add new virtual network** and provide the required parameters. Select **Add** for an existing virtual network or **Create** for a new one. If you add an existing virtual network, the `Microsoft.CognitiveServices` service endpoint will automatically be enabled for the selected subnets. This operation can take few minutes. Also, see the note at the beginning of this section.

### Enabling service endpoint for an existing virtual network 

As described in the previous section, when you configure a virtual network as *allowed* for the Translator resource, the `Microsoft.CognitiveServices` service endpoint is automatically enabled. If you later disable it, you need to re-enable it manually to restore the service endpoint access to the Translator resource (and to other Cognitive Services resources):

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the virtual network.
1. In the **Settings** group in the left pane, select **Subnets**.
1. Select the required subnet.
1. A new panel appears on the right side of the window. In this panel, in the **Service Endpoints** section, select `Microsoft.CognitiveServices` in the **Services** list.
1. Select **Save**.


### Use a Translator resource that has Virtual Network service endpoint enabled

In this scenario, the **Selected Networks and Private Endpoints** option is selected in the networking settings of the Translator resource and at least one virtual network is allowed. 

#### Custom Translator portal

The following table describes Custom Translator project accessibility per Translator resource **Networking** > **Firewalls and virtual networks** security setting.

> [!NOTE]
> If you allow only Selected Networks and Private Endpoints via the **Networking** > **Firewalls and virtual networks** tab, then you can't use Custom Translator portal with the Translator resource. You still can use the Translator resource outside of Custom Translator portal.  

| Translator resource network security setting | Custom Translator portal accessibility |
|--|--|
| All networks | No restrictions |
| Selected Networks and Private Endpoints | Accessible from allowed VNET IP addresses |
| Disabled | Not accessible |


To use Custom Translator without relaxing network access restrictions on your production Translator resource, consider this workaround: 
* Create another Translator resource for development that can be used on a public network. Prepare your custom model in Custom Translator portal on the development resource, and then copy the model to your production resource using [Custom Translator non-interactive REST API](https://microsofttranslator.github.io/CustomTranslatorApiSamples/) workspaces>copyauthorization and models>copy functions. 

## Learn more

* [Custom Translator non-interactive REST API](https://microsofttranslator.github.io/CustomTranslatorApiSamples/)
