---
title: Create a private endpoint with a static IP address - Azure portal
titleSuffix: Azure Private Link
description: Learn how to create a private endpoint for an Azure service with a static private IP address.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: how-to
ms.date: 05/24/2022
ms.custom:
---

# Create a private endpoint with a static IP address using the Azure portal

 A private endpoint IP address is allocated by DHCP in your virtual network by default. In this article, you'll create a private endpoint with a static IP address.

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

   To ensure that your subscription is active, sign in to the Azure portal, and then check your version by running `az login`.

- An Azure web app with a **PremiumV2-tier** or higher app service plan, deployed in your Azure subscription.  

   - For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
   
   - The example webapp in this article is named **myWebApp1979**. Replace the example with your webapp name.

## Create a virtual network and bastion host

A virtual network and subnet is required for to host the private IP address for the private endpoint. You'll create a bastion host to connect securely to the virtual machine to test the private endpoint. You'll create the virtual machine in a later section.

1. Sign-in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks**.

3. Select **+ Create**.

4. In **Create virtual network**, enter or select the following information in the **Basics** tab.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup** in **Name**. </br> Select **OK**. </br> You may also select an existing resource group or the existing resource group containing the Webapp from the prerequisites. For the purposes of the remaining steps in this article, **myResourceGroup** is used. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **East US**. |

5. Select the **IP Addresses** tab, or the **Next: IP Addresses** button at the bottom of the page.

6. In **IP Addresses**, select **default** in **Subnet name**. 

7. Change the **Subnet name** to **myBackendSubnet** and select **Save**.

    :::image type="content" source="./media/private-endpoint-static-ip-portal/ip-addresses.png" alt-text="Screenshot of the IP address configuration in create virtual network." border="true":::

8. Select the **Security** tab, or select the **Next: Security** button at the bottom of the page.

9. In **BastionHost**, select **Enable**.

10. Enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **myBastionHost**. |
    | AzureBastionSubnet address space | Enter **10.0.1.0/27**. |
    | Public IP address | Select **Create new**. </br> Enter **myBastionIP** in **Name**. </br> Select **OK**. |
    
11. Select the **Review + create** tab, or select the **Review + create** button at the bottom of the page.

12. Select **Create**.

It can take a few minutes for the Azure Bastion host to deploy. The deployment is submitted as a job in the portal. You may proceed to the next sections while the bastion host is created.

## Create a private endpoint

An Azure service that supports private endpoints is required to setup the private endpoint and connection to the virtual network. For the examples in this article, you'll use the Azure WebApp from the prerequisites. For more information on the Azure services that support a private endpoint, see [Azure Private Link availability](availability.md).

> [!IMPORTANT]
> You must have a previously deployed Azure WebApp to proceed with the steps in this article. See [Prerequisites](#prerequisites) for more information.

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints**.

2. Select **+ Create**.

3. In **Create a private endpoint**, enter or select the following information in the **Basics** tab.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myPrivateEndpoint**. |
    | Region | Select **East US**. |

4. Select **Next: Resource** at the bottom of the page.

5. In the **Resource** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Select **Connect to an Azure resource in my directory.** |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Web/sites**. |
    | Resource | Select **mywebapp1979**. |
    | Target sub-resource | Select **sites**. |

6. Select **Next: Virtual Network** at the bottom of the page.

7. In the **Virtual Network** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myVNet/myBackendSubnet (10.0.0.0/24)**. |
    | Enable network policies for all private endpoints subnet. | Leave the default of the selection box checked. |
    | **Private IP configuration** | Select **Statically allocate IP address**. |
    | Name | Enter **ipconfig**. |
    | Private IP | Enter **10.0.0.10**. |

8. Select **Next: DNS** at the bottom of the page.

9. In the **DNS** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Private DNS integration** |   |
    | Integrate with private DNS zone | Select **Yes**. |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |

10. Select **Next: Tags**, then **Next: Review + create** at the bottom of the page.

11. Select **Create**.

## Create a test virtual machine

To verify the static IP address and the functionality of the private endpoint, a test virtual machine connected to your virtual network is required.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines**.

2. Select **+ Create** then **Azure virtual machine**.

3. In the **Basics** tab of **Create a virtual machine**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(US) East US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance | Leave default of unchecked. |
    | Size | Select a size for the virtual machine. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Re-enter password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

4. Select the **Networking** tab, or select **Next: Disks** then **Next: Networking** at the bottom of the page.

5. In the **Networking** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **None**. |

6. Select the **Review + create** tab, or select **Review + create** at the bottom of the page.

7. Select **Create**.

It can take a few minutes for the virtual machine to deploy. Don't proceed until the virtual machine deployment is finished.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Test connectivity with the private endpoint

Use the VM you created in the previous step to connect to the webapp across the private endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com). 
 
2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines**.

3. Select **myVM**.

4. On the overview page for **myVM**, select **Connect**, and then select **Bastion**.

5. Enter the username and password that you used when you created the VM. Select **Connect**.

6. After you've connected, open PowerShell on the server.

7. Enter `nslookup mywebapp1979.azurewebsites.net`. Replace **mywebapp1979** with the name of the web app that you created earlier. You'll receive a message that's similar to the following:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp1979.privatelink.azurewebsites.net
    Address:  10.0.0.10
    Aliases:  mywebapp1979.azurewebsites.net
    ```

    A static private IP address of *10.0.0.10* is returned for the web app name.

8. In the bastion connection to **myVM**, open the web browser.

9. Enter the URL of your web app, **https://mywebapp1979.azurewebsites.net**.

   If your web app hasn't been deployed, you'll get the following default web app page:

   :::image type="content" source="./media/private-endpoint-static-ip-powershell/web-app-default-page.png" alt-text="Screenshot of the default web app page on a browser." border="true":::

10. Close the connection to **myVM**.

## Next steps

To learn more about Private Link and Private endpoints, see

- [What is Azure Private Link](private-link-overview.md)

- [Private endpoint overview](private-endpoint-overview.md)



