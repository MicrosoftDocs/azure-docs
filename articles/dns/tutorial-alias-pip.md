---
title: 'Tutorial: Create an Azure DNS alias record to refer to an Azure public IP address'
description: In this tutorial, you learn how to configure an Azure DNS alias record to reference an Azure public IP address.
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: tutorial
ms.date: 09/27/2022
ms.author: greglin
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
#Customer intent: As an experienced network administrator, I want to configure Azure an DNS alias record to refer to an Azure public IP address.
---

# Tutorial: Create an alias record to refer to an Azure public IP address 

You can create an alias record to reference an Azure resource. An example is an alias record that references an Azure public IP resource.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and a subnet.
> * Create a web server virtual machine with a public IP.
> * Create an alias record that points to the public IP.
> * Test the alias record.


If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Azure account with an active subscription.
* A domain name hosted in Azure DNS. If you don't have an Azure DNS zone, you can [create a DNS zone](./dns-delegate-domain-azure-dns.md#create-a-dns-zone), then [delegate your domain](dns-delegate-domain-azure-dns.md#delegate-the-domain) to Azure DNS.

> [!NOTE]
> In this tutorial, `contoso.com` is used as an example domain name. Replace `contoso.com` with your own domain name.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create the network infrastructure

Create a virtual network and a subnet to place your web server in.

1. In the Azure portal, enter *virtual network* in the search box at the top of the portal, and then select **Virtual networks** from the search results.
1. In **Virtual networks**, select **+ Create**.
1. In **Create virtual network**, enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project Details**  |   |
    | Subscription       | Select your Azure subscription. |
    | Resource Group    | Select **Create new**. </br> In **Name**, enter **PIPResourceGroup**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name    | Enter **myPIPVNet**. |
    | Region  | Select your region. |

1. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.
1. In the **IP Addresses** tab, enter the following information:

    | Setting | Value |
    | ------- | ----- |
    | IPv4 address space | Enter **10.10.0.0/16**. |

1. Select **+ Add subnet**, and enter this information in the **Add subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name  | Enter **WebSubnet**.  |
    | Subnet address range | Enter **10.10.0.0/24**.  |

1. Select **Add**.
1. Select the **Review + create** tab or select the **Review + create** button.
1. Select **Create**.

## Create a web server virtual machine

Create a Windows Server virtual machine and then install IIS web server on it.

### Create the virtual machine

Create a Windows Server 2019 virtual machine.

1. In the Azure portal, enter *virtual machine* in the search box at the top of the portal, and then select **Virtual machines** from the search results.
1. In **Virtual machines**, select **+ Create** and then select **Azure virtual machine**.
1. In **Create a virtual machine**, enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project Details**  |    |
    | Subscription   | Select your Azure subscription. |
    | Resource Group    | Select **PIPResourceGroup**. |
    | **Instance details**  |     |
    | Virtual machine name   | Enter **Web-01**. |
    | Region    | Select **(US) East US**. |
    | Availability options   | Select **No infrastructure redundancy required**. |
    | Security type  | Select **Standard**. |
    | Image   | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Size    | Select your VM size. |
    | **Administrator account** |            |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password    | Reenter the password. |
    | **Inbound port rules**  |   |
    | Public inbound ports | Select **None**. |


1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

1. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    |---------|-------|
    | **Network interface** |  |
    | Virtual network | Select **myPIPVNet**. |
    | Subnet | Select **WebSubnet**. |
    | Public IP | Take the default public IP. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **HTTP (80)**, **HTTPS (443)** and **RDP (3389)**. |

1. Select **Review + create**.
1. Review the settings, and then select **Create**.

This deployment may take a few minutes to complete.

> [!NOTE]
> **Web-01** virtual machine has an attached NIC with a basic dynamic public IP that changes every time the virtual machine is restarted.

### Install IIS web server

Install IIS web server on **Web-01**.

1. In the **Overview** page of **Web-01**, select **Connect** and then **RDP**.
1. In the **RDP** page, select **Download RDP File**.
1. Open *Web-01.rdp*, and select **Connect**.
1. Enter the username and password entered during virtual machine creation.
1. On the **Server Manager** dashboard, select **Manage** then **Add Roles and Features**.
1. Select **Server Roles** or select **Next** three times. On the **Server Roles** screen, select **Web Server (IIS)**.
1. Select **Add Features**, and then select **Next**.

    :::image type="content" source="./media/tutorial-alias-pip/iis-web-server-installation.png" alt-text="Screenshot of Add Roles and Features Wizard in Windows Server 2019 showing how to install the I I S Web Server by adding Web Server role.":::

1. Select **Confirmation** or select **Next** three times, and then select **Install**. The installation process takes a few minutes to finish.
1. After the installation finishes, select **Close**.
1. Open a web browser. Browse to **localhost** to verify that the default IIS web page appears.

    :::image type="content" source="./media/tutorial-alias-pip/iis-web-server.png" alt-text="Screenshot of Internet Explorer showing the I I S Web Server default web page.":::

## Create an alias record

Create an alias record that points to the public IP address.

1. In the Azure portal, enter *contoso.com* in the search box at the top of the portal, and then select **contoso.com** DNS zone from the search results.
1. In the **Overview** page, select the **+ Record set** button.
1. In the **Add record set**, enter *web01* in the **Name**.
1. Select **A** for the **Type**.
1. Select **Yes** for the **Alias record set**, and then select the **Azure Resource** for the **Alias type**.
1. Select the **Web-01-ip** public IP address for the **Azure resource**.
1. Select **OK**.

    :::image type="content" source="./media/tutorial-alias-pip/add-public-ip-alias-inline.png" alt-text="Screenshot of adding an alias record to refer to the Azure public IP of the I I S web server using the Add record set page." lightbox="./media/tutorial-alias-pip/add-public-ip-alias-expanded.png":::

## Test the alias record

1. In the Azure portal, enter *virtual machine* in the search box at the top of the portal, and then select **Virtual machines** from the search results.
1. Select the **Web-01** virtual machine. Note the public IP address in the **Overview** page.
1. From a web browser, browse to `web01.contoso.com`, which is the fully qualified domain name of the **Web-01** virtual machine. You now see the IIS default web page.
1. Close the web browser.
1. Stop the **Web-01** virtual machine, and then restart it.
1. After the virtual machine restarts, note the new public IP address for the virtual machine.
1. From a web browser, browse again to `web01.contoso.com`.

This procedure succeeds because you used an alias record to point to the public IP resource instead of a standard A record that points to the public IP address, not the resource.

## Clean up resources

When no longer needed, you can delete all resources created in this tutorial by following these steps:

1. On the Azure portal menu, select **Resource groups**.
1. Select the **PIPResourceGroup** resource group.
1. On the **Overview** page, select **Delete resource group**.
1. Enter *PIPResourceGroup* and select **Delete**.
1. On the Azure portal menu, select **All resources**.
1. Select **contoso.com** DNS zone.
1. On the **Overview** page, select the **web01** record created in this tutorial.
1. Select **Delete** and then **Yes**.

## Next steps

In this tutorial, you learned how to create an alias record to refer to an Azure public IP address resource. To learn how to create an alias record to support an apex domain name with Traffic Manager, continue with the next tutorial: 

> [!div class="nextstepaction"]
> [Create alias records for Traffic Manager](tutorial-alias-tm.md)
