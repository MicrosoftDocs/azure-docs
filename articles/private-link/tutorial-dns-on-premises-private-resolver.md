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

When an Azure Private Endpoint is created, it uses Azure Private DNS Zones for name resolution by default. For on-premises workloads to access the endpoint, a forwarder to a virtual machine in Azure hosting DNS or on-premises DNS records for the private endpoint were required. Azure Private Resolver alleviates the need to deploy a VM in Azure for DNS or manage the private endpoint DNS records on an on-premises DNS server.

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
> The simulated network is configured with the Azure Private Resolver as the virtual network's DNS server. In a production scenario, the on-premises resources will use a local DNS server for name resolution. A conditional forwarder to the Azure Private Resolver is used on the on-premises DNS server to resolve the private endpoint DNS records. For more information about the configuration of conditional forwarders for your DNS server, see your provider's documentation. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

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
    | Subnet name | Enter **mySubnet-onprem**. |
    | Subnet address range | Enter **10.2.0.0/24**. |

8. Select **Add**.

9. Select **Next: Security** or the **Security** tab.

10. Select **Enable** next to **BastionHost**.

11. Enter or select the following information for **BastionHost**:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **myBastion**. |
    | AzureBastionSubnet address space | Enter **10.2.1.0/26**. |
    | Public IP address | Select **Create new**. </br> Enter **myPublicIP-Bastion** in **Name**. </br> Select **OK**. |

12. Select **Review + create**.

13. Select **Create**.

It will take a few minutes for the Bastion host deployment to complete. The Bastion host is used later in the tutorial to connect to the "on-premises" virtual machine to test the private endpoint. You can proceed to the next steps when the virtual network is created.

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
    | Virtual Network | Select **myVNet-onprem**. |
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

7. Select **Next: Deployment**.

8. Select **Next: Networking**.

9. Change 'Enable public access' to false.

10. Select **Review + create**.

11. Select **Create**.

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
    | Target subresource | Select **sites**. |

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

When the private resolver deployment is complete, continue to the next steps.

### Set up DNS for simulated network

The following steps will set the private resolver as the primary DNS server for the simulated on-premises network **myVNet-onprem**. 

In a production environment, these steps aren't needed and are only to simulate the DNS resolution for the private endpoint. Your local DNS server will have a conditional forwarder to this IP address to resolve the private endpoint DNS records from the on-premises network.

1. In the search box at the top of the portal, enter **DNS private resolver**. Select **DNS private resolvers** in the search results.

2. Select **myPrivateResolver**.

3. Select **Inbound endpoints** in **Settings**.

4. Make note of the **IP address** of the endpoint named **myInboundEndpoint**. In the example for this tutorial, the IP address is **10.1.1.4**.

5. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

6. Select **myVNet-onprem**.

7. Select **DNS servers** in **Settings**.

8. Select **Custom** in **DNS servers**.

9. Enter the IP address you noted previously. In the example for this tutorial, the IP address is **10.1.1.4**.

10. Select **Save**.

## Create a virtual machine

You'll create a virtual machine that will be used to test the private endpoint from the simulated on-premises network.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.
   
2. Select **+ Create** > **Azure virtual machine**.

3. In **Create a virtual machine**, enter or select the following information in the **Basics** tab.

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **TutorPEonPremDNS-rg**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM-onprem**. |
    | Region | Select **(US) West US 2**. |
    | Availability Options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - Gen2**. |
    | Size | Choose VM size or leave the default setting. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

4. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
5. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **myVNet-onprem**. |
    | Subnet | Select **mySubnet-onprem (10.2.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **None**. |
   
6. Select **Review + create**. 
  
7. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous step to connect to the web app across the private endpoint.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM-onprem**.

3. On the overview page for **myVM-onprem**, select **Connect** then **Bastion**.

4. Enter the username and password that you entered during the virtual machine creation.

5. Select **Connect** button.

6. Open Windows PowerShell on the server after you connect.

7. Enter `nslookup <webapp-name>.azurewebsites.net`. Replace **\<webapp-name>** with the name of the web app you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp.privatelink.azurewebsites.net
    Address:  10.1.0.10
    Aliases:  mywebapp.azurewebsites.net
    ```

    A private IP address of **10.1.0.10** is returned for the web app name. This address is in **mySubnet-cloud** subnet of **myVNet-cloud** virtual network you created previously.

8. Open Microsoft Edge, and enter the URL of your web app, `https://<webapp-name>.azurewebsites.net`.

9. Verify you receive the default web app page.

    :::image type="content" source="./media/tutorial-dns-on-premises-private-resolver/web-app-default-page.png" alt-text="Screenshot of Microsoft Edge showing default web app page." border="true":::

10. Close the connection to **myVM-onprem**.

11. Open a web browser on your local computer and enter the URL of your web app, `https://<webapp-name>.azurewebsites.net`.

12. Verify that you receive a **403** page. This page indicates that the web app isn't accessible externally.

    :::image type="content" source="./media/tutorial-dns-on-premises-private-resolver/web-app-ext-403.png" alt-text="Screenshot of web browser showing a blue page with Error 403 for external web app address." border="true":::

## Clean up resources

If you're not going to continue to use this application, delete
the virtual networks, private endpoint and resolver, and virtual machine with the following steps:

1. In the search box at the top of the portal, enter **Resource group**. Select **Resource groups** in the search results.

2. Select **TutorPEonPremDNS-rg**.

3. Select **Delete resource group**. Enter the name of the resource group in **TYPE THE RESOURCE GROUP NAME:**.

4. Select **Delete**.

## Next steps

In this tutorial, you learned how to deploy a private resolver and private endpoint. You tested the connection to the private endpoint from a simulated on-premises network.

Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Connect to an Azure SQL server using an Azure Private Endpoint](tutorial-private-endpoint-sql-portal.md)
