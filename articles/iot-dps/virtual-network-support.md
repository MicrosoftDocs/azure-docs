---
 title: Azure IoT Device Provisioning Service (DPS) support for virtual networks
 description: How to use virtual networks connectivity pattern with Azure IoT Device Provisioning Service (DPS)
 services: iot-hub
 author: wesmc7777
 ms.service: iot-dps
 ms.topic: conceptual
 ms.date: 06/30/2020
 ms.author: wesmc
---

# Azure IoT Hub Device Provisioning Service (DPS) support for virtual networks

This article introduces the virtual network (VNET) connectivity pattern for IoT devices provisioning with IoT hubs using DPS. This pattern provides private connectivity between the devices, DPS, and the IoT hub inside a customer-owned Azure VNET. 

In most scenarios where DPS is configured with a VNET, your IoT Hub will also be configured in the same VNET. For more specific information on VNET support and configuration for IoT Hubs, see, [IoT Hub virtual network support](../iot-hub/virtual-network-support.md).



## Introduction

By default, DPS hostnames map to a public endpoint with a publicly routable IP address over the Internet. This public endpoint is visible to all customers. Access to the public endpoint can be attempted by IoT devices over wide-area networks as well as on-premises networks.

For several reasons, customers may wish to restrict connectivity to Azure resources, like DPS. These reasons include:

* Prevent connection exposure over the public Internet. Exposure can be reduced by introducing additional layers of security via network level isolation for your IoT hub and DPS resources

* Enabling a private connectivity experience from your on-premises network assets ensuring that your data and traffic 
is transmitted directly to Azure backbone network.

* Preventing exfiltration attacks from sensitive on-premises networks. 

* Following established Azure-wide connectivity patterns using [private endpoints](../private-link/private-endpoint-overview.md).

Common approaches to restricting connectivity include [DPS IP filter rules](./iot-dps-ip-filtering.md) and Virtual networking (VNET) with [private endpoints](../private-link/private-endpoint-overview.md). This goal of this article is to describe the VNET approach for DPS using private endpoints. 

Devices that operate in on-premises networks can use [Virtual Private Network (VPN)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoute](https://azure.microsoft.com/services/expressroute/) private peering to connect to a VNET in Azure and access DPS resources through private endpoints. 

A private endpoint is a private IP address allocated inside a customer-owned VNET by which an Azure resource is accessible. By having a private endpoint for your DPS resource, you will be able to allow devices operating inside your VNET to request provisioning by your DPS resource without allowing traffic to the public endpoint.


## Prerequisites

Before proceeding ensure that the following prerequisites are met:

* Your DPS resource is already created and linked to your IoT hubs. For guidance on setting up a new DPS resource, see, [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md)

* You have provisioned an Azure VNET with a subnet in which the private endpoint will be created. For more information, see, [create a virtual network using Azure CLI](../virtual-network/quick-create-cli.md).

* For devices that operate inside of on-premises networks, set up [Virtual Private Network (VPN)](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [ExpressRoute](https://azure.microsoft.com/services/expressroute/) private peering into your Azure VNET.

## Private endpoint limitations

Note the following current limitations for DPS when using private endpoints:

* Private endpoints will not work with DPS when the DPS resource and the linked Hub are in different clouds. For example, [Azure Government and global Azure](../azure-government/documentation-government-welcome.md).

* Currently, [custom allocation policies with Azure Functions](how-to-use-custom-allocation-policies.md) for DPS will not work when the Azure function is locked down to a VNET and private endpoints. 

* Current DPS VNET support is for data ingress into DPS only. Data egress, which is the traffic from DPS to IoT Hub, uses an internal service-to-service mechanism rather than a dedicated VNET. Support for full VNET-based egress lockdown between DPS and IoT Hub is not currently available.

* The lowest latency allocation policy is used to assign a device to the IoT hub with the lowest latency. This allocation policy is not reliable in a virtual network environment. 

## Set up a private endpoint

To set up a private endpoint, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), open your DPS resource and click the **Networking** tab. Click **Private endpoint connections** and **+ Private endpoint**.

    ![Add a new private endpoint for DPS](./media/virtual-network-support/networking-tab-add-private-endpoint.png)

2. On the _Create a private endpoint_ Basics page, enter the information mentioned in the table below.

    ![Create private endpoints basics](./media/virtual-network-support/create-private-endpoint-basics.png)

    | Field | Value |
    | :---- | :-----|
    | **Subscription** | Choose the desired Azure subscription to contain the private endpoint.  |
    | **Resource group** | Choose or create a resource group to contain the private endpoint |
    | **Name**       | Enter a name for your private endpoint |
    | **Region**     | The region chosen must be the same as the region that contains the VNET, but it does not have to be the same as the DPS resource. |

    Click **Next : Resource** to configure the resource that the private endpoint will point to.

3. On the _Create a private endpoint Resource_ page, enter the information mentioned in the table below.

    ![Create private endpoint resource](./media/virtual-network-support/create-private-endpoint-resource.png)

    | Field | Value |
    | :---- | :-----|
    | **Subscription**        | Choose the Azure subscription that contains the DPS resource that your private endpoint will point to.  |
    | **Resource type**       | Choose **Microsoft.Devices/ProvisioningServices**. |
    | **Resource**            | Select the DPS resource that the private endpoint will map to. |
    | **Target sub-resource** | Select **iotDps**. |

    > [!TIP]
    > Information on the **Connect to an Azure resource by resource ID or alias** setting is provided in the [Request a private endpoint](#request-a-private-endpoint) section in this article.


    Click **Next : Configuration** to configure the VNET for the private endpoint.

4. On the _Create a private endpoint Configuration_ page, choose your virtual network and subnet to create the private endpoint in.
 
    Click **Next : Tags**, and optionally provide any tags for your resource.

    ![Configure private endpoint](./media/virtual-network-support/create-private-endpoint-configuration.png)

6. Click **Review + create** and then **Create** to create your private endpoint resource.


## Request a private endpoint

You can request a private endpoint to a DPS resource by resource ID. In order to make this request, you need the resource owner to supply you with the resource ID. 

1. The resource ID is provided on to the properties tab for DPS resource as shown below.

    ![DPS Properties tab](./media/virtual-network-support/dps-properties.png)

    > [!CAUTION]
    > Be aware that the resource ID does contain the subscription ID. 

2. Once you have the resource ID, follow the steps above in [Set up a private endpoint](#set-up-a-private-endpoint) to step 3 on the _Create a private endpoint Resource_ page. Click **Connect to an Azure resource by resource ID or alias** and enter the information in the following table. 

    | Field | Value |
    | :---- | :-----|
    | **Resource ID or alias** | Enter the resource ID for the DPS resource. |
    | **Target sub-resource** | Enter **iotDps** |
    | **Request message** | Enter a request message for the DPS resource owner.<br>For example, <br>`Please approve this new private endpoint`<br>`for IoT devices in site 23 to access this DPS instance`  |

    Click **Next : Configuration** to configure the VNET for the private endpoint.

3. On the _Create a private endpoint Configuration_ page, choose the virtual network and subnet to create the private endpoint in.
 
    Click **Next : Tags**, and optionally provide any tags for your resource.

4. Click **Review + create** and then **Create** to create your private endpoint request.

5. The DPS owner will see the private endpoint request in the **Private endpoint connections** list on DPS networking tab. On that page, the owner can **Approve** or **Reject** the private endpoint request as shown below.

    ![DPS approval](./media/virtual-network-support/approve-dps-private-endpoint.png)


## Pricing private endpoints

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).



## Next steps

Use the links below to learn more about DPS security features:

* [Security](concepts-security.md)
* [TLS 1.2 Support](tls-support.md)
