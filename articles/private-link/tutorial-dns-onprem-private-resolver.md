---
title: 'Tutorial: Create a private endpoint DNS infrastructure with Azure Private Resolver for an on-premises workload'
titleSuffix: Azure Private Link
description: Learn how to deploy a private endpoint with an Azure Private resolver for an on-premises workload.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 12/01/2022
ms.custom: template-tutorial
---

# Tutorial: Create a private endpoint DNS infrastructure with Azure Private Resolver for an on-premises workload

When an Azure Private Endpoint is created it uses Azure Private DNS Zones for name resolution by default. For on-premises workloads to access the endpoint, a forwarder to a virtual machine in Azure hosting DNS or on-premises DNS records for the private endpoint were required. Azure Private Resolver alleviates the need to deploy a VM in Azure for DNS or manage the private endpoint DNS records on a on-premises DNS server.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Virtual Network for the cloud network and a simulated on-premises network with virtual network peering.
> * Create a Azure Web App to simulate a cloud resource.
> * Create an Azure Private Endpoint for the web app in the Azure Virtual Network.
> * Create an Azure Private Resolver in the cloud network.
> * Create an Azure Virtual Machine in the simulated on-premises network to test the DNS resolution to the web app.

> [!NOTE]
> An Azure Virtual Network with peering is used to simulate an on-premises network for the purposes of this tutorial. In a production scenario, an **Express Route** or **site to site VPN** is required to connect to the Azure Virtual Network to access the private endpoint. 
>
> The simulated network is configured with the Azure Private Resolver as the virtual network's DNS server. In a production scenario, the on-premises resources will use a local DNS server for name resolution. A conditional forwarder to the Azure Private Resolver is used on the on-premises DNS server to resolve the private endpoint DNS records. Refer to your DNS provider for more information about configuring conditional forwarders. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create virtual networks

A virtual network for the Azure Web App and simulated on-premises network is used for the resources in the tutorial. You'll create two virtual networks and peer them to simulate an Express Route or VPN connection between on-premises and Azure.

### Create cloud virtual network

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **+ Create**.

4. Enter or select the following information in the **Basics** tab of **Create Virtual network**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> In **Name**, enter **TutorPEonPremDNS-rg** </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet-cloud**. |
    | Region | Select **West US 2**. |

5. Select **Next: IP Addresses** or the **IP Addresses tab**.

6. In **IPv4 address space**, select the existing address space. Enter **10.1.0.0/16**.

7. Select **+ Add subnet**.

8. Enter or select the following information in **+ Add subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | Enter **mySubnet-cloud**. |
    | Subnet address range | Enter **10.1.0.0/24**. |

9. Select **Add**.

10. Select **Review + create**.

11. Select **Create**.

### Create simulated on-premises network

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in the **Basics** tab of **Create Virtual network**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorPEonPremDNS-rg**. |
    | **Instance details** |   |
    | Name | Enter **myVNet-onprem**. |
    | Region | Select **West US 2**. |

4. Select **Next: IP Addresses** or the **IP Addresses tab**.

5. In **IPv4 address space**, select the existing address space. Enter **10.2.0.0/16**.

6. Select **+ Add subnet**.

7. Enter or select the following information in **+ Add subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | Enter **mySubnet-cloud**. |
    | Subnet address range | Enter **10.2.0.0/24**. |

9. Select **Add**.

10. Select **Next: Security** or the **Security** tab.

11. Select **Enable** next to **BastionHost**.

12. Enter or select the following information for **BastionHost**:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **myBastion**. |
    | AzureBastionSubnet address space | Enter **10.2.1.0/26**. |
    | Public IP address | Select **Create new**. </br> Enter **myPublicIP-Bastion** in **Name**. </br> Select **OK**. |

13. Select **Review + create**.

14. Select **Create**.

It will take a few minutes for the Bastion host deployment to complete. The Bastion host is used later in the tutorial to connect to the "on-premises" virtual machine to test the private endpoint. You can proceed to the next steps when virtual network is created.

### Peer virtual networks

You'll peer the virtual networks together to simulate an on-premises network. In a production environment, a site to site VPN or Express Route connection is present between the on-premises network and the Azure Virtual Network.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

2. Select **myVNet-cloud**.

3. In **Settings**, select **Peerings**.

4. Select **+ Add**.

5. In **Add peering**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **This virtual network** |   |
    | Peering link name | Enter **myPeer-onprem**. |
    | Traffic to remote virtual network | Leave the default of **Allow (default)**. |
    | Traffic forwarded from remote virtual network | Leave the default of **Allow (default)**. |
    | Virtual network gateway or Route Server | Leave the default of **None (default)**. |
    | **Remote virtual network** |   |
    | Peering link name | Enter **myPeer-cloud**. |
    | Virtual network deployment model | Leave the default of **Resource manager**. |
    | Subscription | Select your subscription. |
    | Virtual Network | Select **myPeer-onprem**. |
    | Traffic to remote virtual network | Leave the default of **Allow (default)**. |
    | Traffic forwarded from remote virtual network | Leave the default of **Allow (default)**. |
    | Virtual network gateway or Route Server | Leave the default of **None (default)**. |

6. Select **Add**.

## Create web app

You'll create an Azure web app for the cloud resource accessed by the on-premises workload.

1. In the search box at the top of the portal, enter **App Service**. Select **App Services** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in the **Basics** tab of **Create Web App**.

    | Setting | Value |
    | ------- | ----- |
    | **Project Details** |   |
    | Subscription | Select your subscription. |
    | Resource Group | Select **TutorPEonPremDNS-rg**. |
    | **Instance Details** |   |
    | Name | Enter a unique name for the web app. The name **mywebapp8675** is used for the examples in this tutorial. |
    | Publish | Select **Code**. |
    | Runtime stack | Select **.NET 6 (LTS)**. |
    | Operating System | Select **Windows**. |
    | Region | Select **West US 2**. |
    | **Pricing plans** |   |
    | Windows Plan (West US 2) | Leave the default name. |
    | Pricing plan | Select **Change size**. |
    
4. In **Spec Picker**, select **Production** for the workload.

5. In **Recommended pricing tiers**, select **P1V2**.

6. Select **Apply**.

7. Select **Review + create**.

8. Select **Create**.

## Create private endpoint

An Azure private endpoint creates a network interface for a supported Azure service in your virtual network. The private endpoint enables the Azure service to be accessed from a private connection in your Azure Virtual Network or on-premises network.

You'll create a private endpoint for the web app you created previously.

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in the **Basics** tab of **Create a private endpoint**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **TutorPEonPremDNS-rg**. |
    | **Instance details** |   |
    | Name | Enter **myPrivateEndpoint-webapp**. |
    | Network Interface Name | Leave the default name. |
    | Region | Select **West US 2**. |

4. Select **Next: Resource**.

5. Enter or select the following information in the **Resource** tab:

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Select **Connect to an Azure resource in my directory**. |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Web/sites**. |
    | Resource | Select your webapp. The name **mywebapp8675** is used for the examples in this tutorial. |
    | Target sub-resource | Select **sites**. |

6. Select **Next: Virtual Network**.

7. Enter or select the following information in the **Virtual Network** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select **myVNet-cloud (TutorPEonPremDNS-rg)**. |
    | Subnet | Select **mySubnet-cloud**. |
    | Network policy for private endpoints | Leave the default of **Disabled**. |
    | **Private IP configuration** | Select **Statically allocate IP address**. |
    | **Name** | Enter **myIPconfig**. |
    | **Private IP** | Enter **10.1.0.10**. |

8. Select **Next: DNS**.

9. Leave the defaults in the **DNS** tab.

10. Select **Next: Tags**, then **Next: Review + create**. 

11. Select **Create**.

## Create a private resolver

You'll create a private resolver in the virtual network where the private endpoint resides. The resolver will receive DNS requests from the simulated on-premises workload. Those requests are forwarded to the Azure provided DNS. The Azure provided DNS will resolve the Azure Private DNS zone for the private endpoint and return the IP address to the on-premises workload.

1. In the search box at the top of the portal, enter **DNS private resolver**. Select **DNS private resolvers** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in the **Basics** tab of **Create a DNS private resolver**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription.|
    | Resource group | Select **TutorPEonPremDNS-rg** |
    | **Instance details** |   |
    | Name | Enter **myPrivateResolver**. |
    | Region | Select **(US) West US 2**. |
    | **Virtual Network** |   |
    | Virtual Network | Select **myVNet-cloud**. |

4. Select **Next: Inbound Endpoints**. 

5. In **Inbound Endpoints**, select **+ Add an endpoint**.

6. Enter or select the following information in **Add an inbound endpoint**:

    | Setting | Value |
    | ------- | ----- |
    | Endpoint name | Enter **myInboundEndpoint**. |
    | Subnet | Select **Create new**. </br> Enter **mySubnet-resolver** in **Name**. </br> Leave the default **Subnet address range**. </br> Select **Create**. |

7. Select **Save**.

8. Select **Review + create**. 

9. Select **Create**.


## [Section 2 heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section n heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
