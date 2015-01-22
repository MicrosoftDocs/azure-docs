	<properties pageTitle="How to setup VPN connections in Azure API Management" metaKeywords="" description="Learn how to setup a VPN connection in Azure API Management and access web services through it" metaCanonical="" services="" documentationCenter="API Management" title="How to setup VPN connections in Azure API Management" authors="antonba" solutions="" manager="" editor="" />

<tags ms.service="api-management" ms.workload="mobile" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="sdanie" />

# How to setup VPN connections in Azure API Management

VPN connections enable the API Management proxy to securely connect to web services that are reside on-premises or are otherwise inaccessible from the public Internet.

## In this topic

-   [Enable VPN connections][]
-   [Connect to a web service behind VPN][]

## <a name="enable-vpn"> </a>Enable VPN connections

>VPN connectivity is only available in the **Premium** tier. To switch to it, open your API Management service in the [Management Portal][] and then open the **Scale** tab. Under the **General** section select the Premium tier and click Save.

To enable VPN connectivity, open your API Management service in the [Management Portal][] and switch to the **Configure** tab. 

Under the VPN section, switch **VPN connection** to **On**.

![Configure tab of API Management instance][api-management-setup-vpn-configure]

You will now see a list of all regions where your API Management service is provisioned.

Select a VPN and subnet for each region. The list of VPNs is populated based on the virtual networks created in your Azure subscription.

![Select VPN][api-management-setup-vpn-select]

Click **Save** at the bottom of the screen. You will not be able to perform other operations on the API Management service from the Azure management portal while it is updating.

## <a name="connect-vpn"> </a>Connect to a web service behind VPN

After your API Management service is connected to the VPN, accessing web services within the virtual network is no different than accessing public services. Just type in the local address of your web service into the **Web service URL** field when creating a new API or editing an existing one.

![Add API from VPN][api-management-setup-vpn-add-api]


[api-management-setup-vpn-configure]: ./media/api-management-howto-setup-vpn/api-management-setup-vpn-configure.png
[api-management-setup-vpn-select]: ./media/api-management-howto-setup-vpn/api-management-setup-vpn-select.png
[api-management-setup-vpn-add-api]: ./media/api-management-howto-setup-vpn/api-management-setup-vpn-add-api.png


[Enable VPN connections]: #enable-vpn
[Connect to a web service behind VPN]: #connect-vpn


[Management Portal]: https://manage.windowsazure.com/