---
title: 'Scenario: Connect two separate Virtual WANs via site-to-site VPN'
titleSuffix: Azure Virtual WAN
description: Learn how to connect two separate Azure Virtual WANs via a site-to-site VPN connection.
author: siddomala
ms.service: virtual-wan
ms.topic: tutorial
ms.date: 10/23/2023
ms.author: siddomala
---
# Tutorial: Connect two separate Virtual WANs via site-to-site VPN

This tutorial shows you how to use a site-to-site VPN connection to connect two separate Virtual WANs. This requires both Virtual WAN hubs to have a VPN gateway deployed inside. 

:::image type="content" source="./media/site-to-site/site-to-site-diagram.png" alt-text="Screenshot shows a networking diagram for Virtual WAN." lightbox="./media/site-to-site/site-to-site-diagram.png" :::

In this tutorial you learn how to:

> [!div class="checklist"]
> * Create a virtual WAN
> * Configure virtual hub Basic settings
> * Configure site-to-site VPN gateway settings
> * Create a site
> * Connect a site to a virtual hub
> * Connect a VPN site to a virtual hub
> * Connect a VNet to a virtual hub
> * Download a configuration file
> * View or edit your VPN gateway

> [!NOTE]
> If you have many sites, you typically would use a [Virtual WAN partner](https://aka.ms/virtualwan) to create this configuration. However, you can create this configuration yourself if you are comfortable with networking and proficient at configuring your own VPN device.
>

## Prerequisites

Verify that you've met the following criteria before beginning your configuration:

[!INCLUDE [Before you begin](../../includes/virtual-wan-before-include.md)]

## <a name="openvwan"></a>Create a virtual WAN

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name="hub"></a>Configure virtual hub settings

A virtual hub is a virtual network that can contain gateways for site-to-site, ExpressRoute, or point-to-site functionality. For this tutorial, you begin by filling out the **Basics** tab for the virtual hub and then continue on to fill out the site-to-site tab in the next section. It's also possible to create an empty virtual hub (a virtual hub that doesn't contain any gateways) and then add gateways (S2S, P2S, ExpressRoute, etc.) later. Once a virtual hub is created, you'll be charged for the virtual hub, even if you don't attach any sites or create any gateways within the virtual hub.

[!INCLUDE [Create a virtual hub](../../includes/virtual-wan-hub-basics.md)]

Don't create the virtual hub yet. Continue on to the next section to configure additional settings.

## <a name="gateway"></a>Configure a site-to-site gateway

In this section, you configure site-to-site connectivity settings, and then proceed to create the virtual hub and site-to-site VPN gateway. A virtual hub and gateway can take about 30 minutes to create.

[!INCLUDE [Create a gateway](../../includes/virtual-wan-tutorial-s2s-gateway-include.md)]

[!INCLUDE [hub warning message](../../includes/virtual-wan-hub-router-provisioning-warning.md)]

## <a name="site"></a>Create a site

In this section, you create a site. Sites correspond to your physical locations. Create as many sites as you need. For example, if you have a branch office in NY, a branch office in London, and a branch office in LA, you'd create three separate sites. These sites contain your on-premises VPN device endpoints. You can create up to 1000 sites per virtual hub in a virtual WAN. If you had multiple virtual hubs, you can create 1000 per each of those virtual hubs. If you have a Virtual WAN partner CPE device, check with them to learn about their automation to Azure. Typically, automation implies a simple click experience to export large-scale branch information into Azure, and setting up connectivity from the CPE to Azure Virtual WAN VPN gateway. For more information, see [Automation guidance from Azure to CPE partners](virtual-wan-configure-automation-providers.md).

[!INCLUDE [Create a site](../../includes/virtual-wan-tutorial-s2s-site-include.md)]

## <a name="connectsites"></a>Connect the VPN site to a virtual hub

In this section, you connect your VPN site to the virtual hub.

[!INCLUDE [Connect VPN sites](../../includes/virtual-wan-tutorial-s2s-connect-vpn-site-include.md)]

## <a name="vnet"></a>Connect a VNet to the virtual hub

In this section, you create a connection between the virtual hub and your VNet.

[!INCLUDE [Connect](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## <a name="device"></a>Download VPN configuration

Use the VPN device configuration file to configure your on-premises VPN device. The basic steps are listed below.

1. From your Virtual WAN page, go to **Hubs -> Your virtual hub -> VPN (Site to site)** page.

1. At the top of the **VPN (Site to site)** page, click **Download VPN Config**. You'll see a series of messages as Azure creates a new storage account in the resource group 'microsoft-network-[location]', where location is the location of the WAN. You can also add an existing storage account by clicking "Use Existing" and adding a valid SAS URL with write permissions enabled. To learn more about creating a new SAS URL, see [Generate the SAS URL](packet-capture-site-to-site-portal.md#URL).

1. Once the file finishes creating, click the link to download the file. This creates a new file with VPN configuration at the provided SAS url location. To learn about the contents of the file, see [About the VPN device configuration file](#config-file) in this section.

1. Apply the configuration to your on-premises VPN device. For more information, see [VPN device configuration](#vpn-device) in this section.

1. After you've applied the configuration to your VPN devices, it is not required to keep the storage account that you created.

### <a name="config-file"></a>About the VPN device configuration file

The device configuration file contains the settings to use when configuring your on-premises VPN device. When you view this file, notice the following information:

* **vpnSiteConfiguration -** This section denotes the device details set up as a site connecting to the virtual WAN. It includes the name and public IP address of the branch device.
* **vpnSiteConnections -** This section provides information about the following settings:

    * **Address space** of the virtual hub(s) VNet.<br>Example:
 
        ```
        "AddressSpace":"10.1.0.0/24"
        ```
    * **Address space** of the VNets that are connected to the virtual hub.<br>Example:

         ```
        "ConnectedSubnets":["10.2.0.0/16","10.3.0.0/16"]
         ```
    * **IP addresses** of the virtual hub vpngateway. Because each vpngateway connection is composed of two tunnels in active-active configuration, you'll see both IP addresses listed in this file. In this example, you see "Instance0" and "Instance1" for each site.<br>Example:

        ``` 
        "Instance0":"104.45.18.186"
        "Instance1":"104.45.13.195"
        ```
    * **Vpngateway connection configuration details** such as BGP, pre-shared key etc. The PSK is the pre-shared key that is automatically generated for you. You can always edit the connection in the **Overview** page for a custom PSK.
  
### Example device configuration file

```
  { 
      "configurationVersion":{ 
         "LastUpdatedTime":"2018-07-03T18:29:49.8405161Z",
         "Version":"r403583d-9c82-4cb8-8570-1cbbcd9983b5"
      },
      "vpnSiteConfiguration":{ 
         "Name":"testsite1",
         "IPAddress":"73.239.3.208"
      },
      "vpnSiteConnections":[ 
         { 
            "hubConfiguration":{ 
               "AddressSpace":"10.1.0.0/24",
               "Region":"West Europe",
               "ConnectedSubnets":[ 
                  "10.2.0.0/16",
                  "10.3.0.0/16"
               ]
            },
            "gatewayConfiguration":{ 
               "IpAddresses":{ 
                  "Instance0":"104.45.18.186",
                  "Instance1":"104.45.13.195"
               }
            },
            "connectionConfiguration":{ 
               "IsBgpEnabled":false,
               "PSK":"bkOWe5dPPqkx0DfFE3tyuP7y3oYqAEbI",
               "IPsecParameters":{ 
                  "SADataSizeInKilobytes":102400000,
                  "SALifeTimeInSeconds":3600
               }
            }
         }
      ]
   },
   { 
      "configurationVersion":{ 
         "LastUpdatedTime":"2018-07-03T18:29:49.8405161Z",
         "Version":"1f33f891-e1ab-42b8-8d8c-c024d337bcac"
      },
      "vpnSiteConfiguration":{ 
         "Name":" testsite2",
         "IPAddress":"66.193.205.122"
      },
      "vpnSiteConnections":[ 
         { 
            "hubConfiguration":{ 
               "AddressSpace":"10.1.0.0/24",
               "Region":"West Europe"
            },
            "gatewayConfiguration":{ 
               "IpAddresses":{ 
                  "Instance0":"104.45.18.187",
                  "Instance1":"104.45.13.195"
               }
            },
            "connectionConfiguration":{ 
               "IsBgpEnabled":false,
               "PSK":"XzODPyAYQqFs4ai9WzrJour0qLzeg7Qg",
               "IPsecParameters":{ 
                  "SADataSizeInKilobytes":102400000,
                  "SALifeTimeInSeconds":3600
               }
            }
         }
      ]
   },
   { 
      "configurationVersion":{ 
         "LastUpdatedTime":"2018-07-03T18:29:49.8405161Z",
         "Version":"cd1e4a23-96bd-43a9-93b5-b51c2a945c7"
      },
      "vpnSiteConfiguration":{ 
         "Name":" testsite3",
         "IPAddress":"182.71.123.228"
      },
      "vpnSiteConnections":[ 
         { 
            "hubConfiguration":{ 
               "AddressSpace":"10.1.0.0/24",
               "Region":"West Europe"
            },
            "gatewayConfiguration":{ 
               "IpAddresses":{ 
                  "Instance0":"104.45.18.187",
                  "Instance1":"104.45.13.195"
               }
            },
            "connectionConfiguration":{ 
               "IsBgpEnabled":false,
               "PSK":"YLkSdSYd4wjjEThR3aIxaXaqNdxUwSo9",
               "IPsecParameters":{ 
                  "SADataSizeInKilobytes":102400000,
                  "SALifeTimeInSeconds":3600
               }
            }
         }
      ]
   }
```

### <a name="vpn-device"></a>Configuring your VPN device

>[!NOTE]
> If you are working with a Virtual WAN partner solution, VPN device configuration automatically happens. The device controller obtains the configuration file from Azure and applies to the device to set up connection to Azure. This means you don't need to know how to manually configure your VPN device.
>

If you need instructions to configure your device, you can use the instructions on the [VPN device configuration scripts page](~/articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#configscripts) with the following caveats:

* The instructions on the VPN devices page aren't written for Virtual WAN, but you can use the Virtual WAN values from the configuration file to manually configure your VPN device.

* The downloadable device configuration scripts that are for VPN Gateway don't work for Virtual WAN, as the configuration is different.

* A new Virtual WAN can support both IKEv1 and IKEv2.

* Virtual WAN can use both policy based and route-based VPN devices and device instructions.

## <a name="gateway-config"></a>View or edit gateway settings

You can view and edit your VPN gateway settings at any time. Go to your **Virtual HUB -> VPN (Site to site)** and select **View/Configure**.

:::image type="content" source="media/virtual-wan-site-to-site-portal/view-configuration-1.png" alt-text="Screenshot that shows the 'VPN (Site-to-site)' page with an arrow pointing to the 'View/Configure' action." lightbox="media/virtual-wan-site-to-site-portal/view-configuration-1-expand.png":::

On the **Edit VPN Gateway** page, you can see the following settings:

* **Public IP Address**: Assigned by Azure.
* **Private IP Address**: Assigned by Azure.
* **Default BGP IP Address**: Assigned by Azure.
* **Custom BGP IP Address**: This field is reserved for APIPA (Automatic Private IP Addressing). Azure supports BGP IP in the ranges 169.254.21.* and 169.254.22.*. Azure accepts BGP connections in these ranges but will dial connection with the default BGP IP. Users can specify multiple custom BGP IP addresses for each instance. The same custom BGP IP address shouldn't be used for both instances. 

   :::image type="content" source="media/virtual-wan-site-to-site-portal/edit-gateway.png" alt-text="Screenshot shows the Edit VPN Gateway page with the Edit button highlighted." lightbox="media/virtual-wan-site-to-site-portal/edit-gateway.png":::

## <a name="cleanup"></a>Clean up resources

When you no longer need the resources that you created, delete them. Some of the Virtual WAN resources must be deleted in a certain order due to dependencies. Deleting can take about 30 minutes to complete.

[!INCLUDE [Delete resources](../../includes/virtual-wan-resource-cleanup.md)]

## Next steps

Next, to learn more about Virtual WAN, see:

> [!div class="nextstepaction"]
> * [Virtual WAN FAQ](virtual-wan-faq.md)
