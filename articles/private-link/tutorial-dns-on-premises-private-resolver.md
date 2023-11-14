---
title: 'Tutorial: Create a private endpoint DNS infrastructure with Azure Private Resolver for an on-premises workload'
titleSuffix: Azure Private Link
description: Learn how to deploy a private endpoint with an Azure Private resolver for an on-premises workload.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 08/29/2023
ms.custom: template-tutorial
---

# Tutorial: Create a private endpoint DNS infrastructure with Azure Private Resolver for an on-premises workload

When an Azure Private Endpoint is created, it uses Azure Private DNS Zones for name resolution by default. For on-premises workloads to access the endpoint, a forwarder to a virtual machine in Azure hosting DNS or on-premises DNS records for the private endpoint were required. Azure Private Resolver alleviates the need to deploy a VM in Azure for DNS or manage the private endpoint DNS records on an on-premises DNS server.

:::image type="content" source="./media/tutorial-dns-on-premises-private-resolver/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial." lightbox="./media/tutorial-dns-on-premises-private-resolver/resources-diagram.png":::

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

## <a name="create-a-virtual-network"></a> Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Overview

A virtual network for the Azure Web App and simulated on-premises network is used for the resources in the tutorial. You create two virtual networks and peer them to simulate an Express Route or VPN connection between on-premises and Azure. An Azure Bastion host is deployed in the simulated on-premises network to connect to the test virtual machine. The test virtual machine is used to test the private endpoint connection to the web app and DNS resolution.

The following resources are used in this tutorial to simulate an on-premises and cloud network infrastructure:

| Resource | Name | Description |
|----------|------|-------------|
| Simulated on-premises virtual network | **vnet-1** | The virtual network that simulates an on-premises network. |
| Cloud virtual network | **vnet-2** | The virtual network where the Azure Web App is deployed. |
| Bastion host | **bastion** | Bastion host used to connect to the virtual machine in the simulated on-premises network. |
| Test virtual machine | **vm-1** | Virtual machine used to test the private endpoint connection to the web app and DNS resolution. |
| Virtual network peer | **vnet-1-to-vnet-2** | Virtual network peer between the simulated on-premises network and cloud virtual network. |
| Virtual network peer | **vnet-2-to-vnet-1** | Virtual network peer between the cloud virtual network and simulated on-premises network. |

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

It takes a few minutes for the Bastion host deployment to complete. The Bastion host is used later in the tutorial to connect to the "on-premises" virtual machine to test the private endpoint. You can proceed to the next steps when the virtual network is created.

## Create cloud virtual network

Repeat the previous steps to create a cloud virtual network for the Azure Web App private endpoint. Replace the values with the following values for the cloud virtual network:

>[!NOTE]
> The Azure Bastion deployment section can be skipped for the cloud virtual network. The Bastion host is only required for the simulated on-premises network.

| Setting | Value |
| ------- | ----- |
| Name | **vnet-2** |
| Location | **East US 2** |
| Address space | **10.1.0.0/16** |
| Subnet name | **subnet-1** |
| Subnet address range | **10.1.0.0/24** |

[!INCLUDE [virtual-network-create-network-peer.md](../../includes/virtual-network-create-network-peer.md)]

[!INCLUDE [create-webapp.md](../../includes/create-webapp.md)]


## Create private endpoint

An Azure private endpoint creates a network interface for a supported Azure service in your virtual network. The private endpoint enables the Azure service to be accessed from a private connection in your Azure Virtual Network or on-premises network.

You create a private endpoint for the web app you created previously.

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in the **Basics** tab of **Create a private endpoint**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Name | Enter **private-endpoint**. |
    | Network Interface Name | Leave the default name. |
    | Region | Select **East US 2**. |

4. Select **Next: Resource**.

5. Enter or select the following information in the **Resource** tab:

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Select **Connect to an Azure resource in my directory**. |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Web/sites**. |
    | Resource | Select your webapp. The name **webapp8675** is used for the examples in this tutorial. |
    | Target subresource | Select **sites**. |

6. Select **Next: Virtual Network**.

7. Enter or select the following information in the **Virtual Network** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select **vnet-2 (test-rg)**. |
    | Subnet | Select **subnet-1**. |
    | Network policy for private endpoints | Leave the default of **Disabled**. |
    | **Private IP configuration** | Select **Statically allocate IP address**. |
    | **Name** | Enter **ipconfig-1**. |
    | **Private IP** | Enter **10.1.0.10**. |

8. Select **Next: DNS**.

9. Leave the defaults in the **DNS** tab.

10. Select **Next: Tags**, then **Next: Review + create**. 

11. Select **Create**.

## Create a private resolver

You create a private resolver in the virtual network where the private endpoint resides. The resolver receives DNS requests from the simulated on-premises workload. Those requests are forwarded to the Azure provided DNS. The Azure provided DNS resolves the Azure Private DNS zone for the private endpoint and return the IP address to the on-premises workload.

1. In the search box at the top of the portal, enter **DNS private resolver**. Select **DNS private resolvers** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in the **Basics** tab of **Create a DNS private resolver**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription.|
    | Resource group | Select **test-rg** |
    | **Instance details** |   |
    | Name | Enter **private-resolver**. |
    | Region | Select **(US) East US 2**. |
    | **Virtual Network** |   |
    | Virtual Network | Select **vnet-2**. |

4. Select **Next: Inbound Endpoints**. 

5. In **Inbound Endpoints**, select **+ Add an endpoint**.

6. Enter or select the following information in **Add an inbound endpoint**:

    | Setting | Value |
    | ------- | ----- |
    | Endpoint name | Enter **inbound-endpoint**. |
    | Subnet | Select **Create new**. </br> Enter **subnet-resolver** in **Name**. </br> Leave the default **Subnet address range**. </br> Select **Create**. |

7. Select **Save**.

8. Select **Review + create**. 

9. Select **Create**.

When the private resolver deployment is complete, continue to the next steps.

### Set up DNS for simulated network

The following steps set the private resolver as the primary DNS server for the simulated on-premises network **vnet-1**. 

In a production environment, these steps aren't needed and are only to simulate the DNS resolution for the private endpoint. Your local DNS server has a conditional forwarder to this IP address to resolve the private endpoint DNS records from the on-premises network.

1. In the search box at the top of the portal, enter **DNS private resolver**. Select **DNS private resolvers** in the search results.

2. Select **private-resolver**.

3. Select **Inbound endpoints** in **Settings**.

4. Make note of the **IP address** of the endpoint named **inbound-endpoint**. In the example for this tutorial, the IP address is **10.1.1.4**.

5. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

6. Select **vnet-1**.

7. Select **DNS servers** in **Settings**.

8. Select **Custom** in **DNS servers**.

9. Enter the IP address you noted previously. In the example for this tutorial, the IP address is **10.1.1.4**.

10. Select **Save**.

[!INCLUDE [create-test-virtual-machine.md](../../includes/create-test-virtual-machine.md)]

## Test connectivity to private endpoint

In this section, you use the virtual machine you created in the previous step to connect to the web app across the private endpoint.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **vm-1**.

3. On the overview page for **vm-1**, select **Connect** then **Bastion**.

4. Enter the username and password that you entered during the virtual machine creation.

5. Select **Connect** button.

6. Open Windows PowerShell on the server after you connect.

7. Enter `nslookup <webapp-name>.azurewebsites.net`. Replace **\<webapp-name>** with the name of the web app you created in the previous steps. You receive a message similar to the following output:

    ```output
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    webapp.privatelink.azurewebsites.net
    Address:  10.1.0.10
    Aliases:  webapp.azurewebsites.net
    ```

    A private IP address of **10.1.0.10** is returned for the web app name. This address is in **subnet-1** subnet of **vnet-2** virtual network you created previously.

8. Open Microsoft Edge, and enter the URL of your web app, `https://<webapp-name>.azurewebsites.net`.

9. Verify you receive the default web app page.

    :::image type="content" source="./media/tutorial-dns-on-premises-private-resolver/web-app-default-page.png" alt-text="Screenshot of Microsoft Edge showing default web app page." border="true":::

10. Close the connection to **vm-1**.

11. Open a web browser on your local computer and enter the URL of your web app, `https://<webapp-name>.azurewebsites.net`.

12. Verify that you receive a **403** page. This page indicates that the web app isn't accessible externally.

    :::image type="content" source="./media/tutorial-dns-on-premises-private-resolver/web-app-ext-403.png" alt-text="Screenshot of web browser showing a blue page with Error 403 for external web app address." border="true":::

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this tutorial, you learned how to deploy a private resolver and private endpoint. You tested the connection to the private endpoint from a simulated on-premises network.

Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Connect to an Azure SQL server using an Azure Private Endpoint](tutorial-private-endpoint-sql-portal.md)
