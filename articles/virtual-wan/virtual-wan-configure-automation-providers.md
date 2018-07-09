---
title: 'Configure Azure Virtual WAN automation - for Providers | Microsoft Docs'
description: This article helps software-defined connectivity solutions providers set up Azure Virtual WAN automation.
services: virtual-wan
author: cherylmc


ms.service: virtual-wan
ms.topic: conceptual
ms.date: 07/09/2018
ms.author: cherylmc
Customer intent: As a Virtual WAN software-defined connectivity provider, I want to set up a provisioning environment.

---
# Configure Virtual WAN automation - for Providers (Preview)

This article helps you understand how to set up the automation envorionment to connect and configure a branch device (a customer on-premises vpn device) for Azure Virtual WAN. If you are a provider that provides branch devices that can accommodate VPN connectivity over IPsec/IKEv2, this article is for you.

Software-defined connectivity solutions typically use a controller or a device provisioning center to manage their branch devices. The controller can use Azure APIs to automate connectivity to Azure Virtual WAN. This type of connection requires a VPN device located on-premises that has an externally-facing public IP address assigned to it.

##  <a name="access"></a>Access control

Customers must be able to set up appropriate access control for Virtual WAN in the device UI. This is recommended using an Azure Service Principal. Service principal-based access provides the device controller appropriate authentication to upload branch information.

##  <a name="site"></a>Upload branch information

Design the user-experience to upload branch (on-premises site) information to Azure. REST APIs for **VPNSite** can be used to create the site information in Virtual WAN. You can provide all branch/VPN devices, or select device customizations as appropriate.

##  <a name="hub"></a>Hub and services

Once the branch device is uploaded to Azure, customer will typically make selections of hub region and/or services in the Azure portal, which invokes a set of operations to create the hub virtual network and the VPN end point inside the hub. The VPN gateway is a scalable gateway which sizes appropriately based on bandwidth and connection needs.

## <a name="device"></a>Device configuration

In this step, a customer that is not using a provider would manually download the Azure configuration and apply it to their on-premises VPN device. As a provider, you should automate this step. The controller can call **GetVpnConfiguration** REST API to download the Azure configuration, which will typically look similar to the following file.

**Configuration notes**

  * If Azure VNets are attached to the hub VNet, they will appear as ConnectedSubnets.
  * VPN connectivity uses route-based configuration and IKEv2.

### Configuration file

When you view this file, notice the following information:

* **IP addresses** - Virtual WAN IPsec gateways are active-active. You will see both IP addresses listed in this file. In this example, you see "Instance0" and "Instance1" for each site.
* **BGP** - You can see if BGP is enabled in the *connectionConfiguration*.
* **The pre-shared key** - PSK is the pre-shared key that is automatically generated for you. You can always edit the connection in the Overview page for a custom PSK.

  
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

## <a name="custom"></a>Working with Custom Policy

The following table lists the supported cryptographic algorithms and key strengths that are configurable by the customers. You must select one option for every field.

| IPsec/ IKEv2 | Options|
|---|---|
|IKEv2 Encryption | AES256, AES192, AES128, DES3, DES |
| IKEv2 Integrity | SHA384, SHA256, SHA1, MD5 |
| DH Group |  DHGroup24, ECP384, ECP256, DHGroup14 (DHGroup2048), DHGroup2, DHGroup1, None |
| IPsec Encryption | GCMAES256, GCMAES192, GCMAES128, AES256, AES192, AES128, DES3, DES, None  |
| IPsec Integrity | GCMAES256, GCMAES192, GCMAES128, SHA256, SHA1, MD5 |
| PFS Group | PFS24, ECP384, ECP256, PFS2048, PFS2, PFS1, None|
| QM SA Lifetime | Seconds (integer; min. 300/default 27000 seconds)<br>KBytes (integer; min. 1024/default 102400000 KBytes) |

**Additional information**
1. DHGroup2048 & PFS2048 are the same as Diffie-Hellman Group 14 in IKE and IPsec PFS. See Diffie-Hellman Groups for the complete mappings.
2. For GCMAES algorithms, you must specify the same GCMAES algorithm and key length for both IPsec Encryption and Integrity.
3. IKEv2 Main Mode SA lifetime is fixed at 28,800 seconds on the Azure VPN gateways
4. QM SA Lifetimes are optional parameters. If none was specified, default values of 27,000 seconds (7.5 hrs) and 102400000 KBytes (102 GB) are used.

### Does everything need to match between the virtual hub vpngateway policy and my on-premises VPN device configuration?

Your on-premises VPN device configuration must match or contain the following algorithms and parameters, which you specify in the Azure IPsec/IKE policy. The SA lifetimes are local specifications only, and do not need to match.

* IKE encryption algorithm
* IKE integrity algorithm
* DH Group
* IPsec encryption algorithm
* IPsec integrity algorithm
* PFS Group

### Which Diffie-Hellman Groups are supported?

The following table lists the supported Diffie-Hellman Groups for IKE (DHGroup) and IPsec (PFSGroup):

| Diffie-Hellman Group | DHGroup | PFSGroup |
|---|---|---|
| 1 |	DHGroup1 |	PFS1 |
| 2 |	DHGroup2 |	PFS2 |
| 14 |	DHGroup14<br>DHGroup2048 |	PFS2048 |
| 19 |	ECP256 |	ECP256 |
| 20| ECP384 |	ECP284|
| 24 |	DHGroup24 |	PFS24 |

## <a name="feedback"></a>Preview feedback

We would appreciate your feedback. Please send an email to <azurevirtualwan@microsoft.com> to report any issues, or to provide feedback (positive or negative) for Virtual WAN. Include your company name in “[ ]” in the subject line. Also include your subscription ID if you are reporting an issue.

## Next steps

For more information about Virtual WAN, see [About Azure Virtual WAN](virtual-wan-about.md) and the [Azure Virtual WAN FAQ](virtual-wan-faq.md)