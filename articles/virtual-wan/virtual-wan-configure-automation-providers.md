---
title: 'Configure Azure Virtual WAN automation - for Virtual WAN partners | Microsoft Docs'
description: This article helps software-defined connectivity solutions partners set up Azure Virtual WAN automation.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 08/23/2018
ms.author: cherylmc
Customer intent: As a Virtual WAN software-defined connectivity provider, I want to set up a provisioning environment.
---

# Configure Virtual WAN automation - for Virtual WAN partners (Preview)

This article helps you understand how to set up the automation environment to connect and configure a branch device (a customer on-premises VPN device or SDWAN) for Azure Virtual WAN. If you are a provider that provides branch devices that can accommodate VPN connectivity over IPsec/IKEv2, this article is for you.

Software-defined connectivity solutions typically use a controller or a device provisioning center to manage their branch devices. The controller can use Azure APIs to automate connectivity to Azure Virtual WAN. This type of connection requires an SDWAN or VPN device located on-premises that has an externally-facing public IP address assigned to it.

##  <a name="access"></a>Access control

Customers must be able to set up appropriate access control for Virtual WAN in the device UI. This is recommended using an Azure Service Principal. Service principal-based access provides the device controller appropriate authentication to upload branch information. For more information,see [Create service principal](../azure-resource-manager/resource-group-create-service-principal-portal.md#create-an-azure-active-directory-application).

##  <a name="site"></a>Upload branch information

Design the user-experience to upload branch (on-premises site) information to Azure. [REST APIs](https://docs.microsoft.com/rest/api/virtualwan/vpnsites) for **VPNSite** can be used to create the site information in Virtual WAN. You can provide all branch SDWAN/VPN devices, or select device customizations as appropriate.

##  <a name="hub"></a>Hub and services

Once the branch device is uploaded to Azure, customer will typically make selections of hub region and/or services in the Azure portal, which invokes a set of operations to create the hub virtual network and the VPN end point inside the hub. The VPN gateway is a scalable gateway which sizes appropriately based on bandwidth and connection needs.

## <a name="device"></a>Device configuration

In this step, a customer that is not using a provider would manually download the Azure configuration and apply it to their on-premises SDWAN/VPN device. As a provider, you should automate this step. The controller can call **GetVpnConfiguration** REST API to download the Azure configuration, which will typically look similar to the following file.

**Configuration notes**

  * If Azure VNets are attached to the virtual hub, they will appear as ConnectedSubnets.
  * VPN connectivity uses route-based configuration and IKEv2.

### Understanding the device configuration file

The device configuration file contains the settings to use when configuring your on-premises VPN device. When you view this file, notice the following information:

* **vpnSiteConfiguration -** This section denotes the device details set up as a site connecting to the virtual WAN. It includes the name and public ip address of the branch device.
* **vpnSiteConnections -** This section provides information about the following:

    * **Address space** of the virtual hub(s) VNet.<br>Example:
 
        ```
        "AddressSpace":"10.1.0.0/24"
        ```
    * **Address space** of the VNets that are connected to the hub.<br>Example:

         ```
        "ConnectedSubnets":["10.2.0.0/16","10.30.0.0/16"]
         ```
    * **IP addresses** of the virtual hub vpngateway. Because the vpngateway has each connection comprising of 2 tunnels in active-active configuration, you will see both IP addresses listed in this file. In this example, you see "Instance0" and "Instance1" for each site.<br>Example:

        ``` 
        "Instance0":"104.45.18.186"
        "Instance1":"104.45.13.195"
        ```
    * **Vpngateway connection configuration details** such as BGP, pre-shared key etc. The PSK is the pre-shared key that is automatically generated for you. You can always edit the connection in the Overview page for a custom PSK.
  
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
                  "10.30.0.0/16"
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

## <a name="default"></a>Default policies

### Initiator

The following sections list the supported policy combinations when Azure is the initiator for the tunnel.

**Phase-1**

* AES_256, SHA1, DH_GROUP_2
* AES_256, SHA_256, DH_GROUP_2
* AES_128, SHA1, DH_GROUP_2
* AES_128, SHA_256, DH_GROUP_2
* 3DES, SHA1, DH_GROUP_2
* 3DES, SHA_256, DH_GROUP_2

**Phase-2**

* GCM_AES_256, GCM_AES_256, PFS_NONE
* AES_256, SHA_1, PFS_NONE
* CBC_3DES, SHA_1, PFS_NONE
* AES_256, SHA_256, PFS_NONE
* AES_128, SHA_1, PFS_NONE
* CBC_3DES, SHA_256, PFS_NONE


### Responder

The following sections list the supported policy combinations when Azure is the responder for the tunnel.

**Phase-1**

* AES_256, SHA1, DH_GROUP_2
* AES_256, SHA_256, DH_GROUP_2
* AES_128, SHA1, DH_GROUP_2
* AES_128, SHA_256, DH_GROUP_2
* 3DES, SHA1, DH_GROUP_2
* 3DES, SHA_256, DH_GROUP_2

**Phase-2**

* GCM_AES_256, GCM_AES_256, PFS_NONE
* AES_256, SHA_1, PFS_NONE
* CBC_3DES, SHA_1, PFS_NONE
* AES_256, SHA_256, PFS_NONE
* AES_128, SHA_1, PFS_NONE
* CBC_3DES, SHA_256, PFS_NONE
* CBC_DES, SHA_1, PFS_NONE 
* AES_256, SHA_1, PFS_1
* AES_256, SHA_1, PFS_2
* AES_256, SHA_1, PFS_14
* AES_128, SHA_1, PFS_1
* AES_128, SHA_1, PFS_2
* AES_128, SHA_1, PFS_14
* CBC_3DES, SHA_1, PFS_1
* CBC_3DES, SHA_1, PFS_2
* CBC_3DES, SHA_256, PFS_2
* AES_256, SHA_256, PFS_1
* AES_256, SHA_256, PFS_2
* AES_256, SHA_256, PFS_14
* AES_256, SHA_1, PFS_24
* AES_256, SHA_256, PFS_24
* AES_128, SHA_256, PFS_NONE
* AES_128, SHA_256, PFS_1
* AES_128, SHA_256, PFS_2
* AES_128, SHA_256, PFS_14
* CBC_3DES, SHA_1, PFS_14

### Does everything need to match between the virtual hub vpngateway policy and my on-premises SDWAN/VPN device or SD-WAN configuration?

Your on-premises SDWAN/VPN device or SD-WAN configuration must match or contain the following algorithms and parameters, which you specify in the Azure IPsec/IKE policy. The SA lifetimes are local specifications only, and do not need to match.

* IKE encryption algorithm
* IKE integrity algorithm
* DH Group
* IPsec encryption algorithm
* IPsec integrity algorithm
* PFS Group

## <a name="feedback"></a>Preview feedback

We would appreciate your feedback. Please send an email to <azurevirtualwan@microsoft.com> to report any issues, or to provide feedback (positive or negative) for Virtual WAN. Include your company name in “[ ]” in the subject line. Also include your subscription ID if you are reporting an issue.

## Next steps

For more information about Virtual WAN, see [About Azure Virtual WAN](virtual-wan-about.md) and the [Azure Virtual WAN FAQ](virtual-wan-faq.md).
