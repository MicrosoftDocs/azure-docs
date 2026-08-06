---
title: 'Tutorial: Create an alias record to support apex domain name with Traffic Manager'
titleSuffix: Azure DNS
description: In this tutorial, you learn how to create and configure an Azure DNS alias record to support using your apex domain name with Traffic Manager.
services: dns
author: asudbring
ms.service: azure-dns
ms.topic: tutorial
ms.date: 06/01/2026
ms.author: allensu
ms.custom:
  - template-tutorial #Required; leave this attribute/value as-is.
  - sfi-image-nochange
#Customer intent: As an experienced network administrator, I want to configure Azure DNS alias records to use my apex domain name with Traffic Manager.
# Customer intent: "As a network administrator, I want to create and configure an alias record for my apex domain in Azure DNS, so that I can efficiently route traffic to my Traffic Manager profile without using a redirecting service."
---

# Tutorial: Create an alias record to support apex domain names with Traffic Manager 

> [!TIP]
> For new Traffic Manager-backed DNS configurations, consider using [Traffic Manager Linked Records](dns-traffic-manager-linked-records.md) instead. Traffic Manager Linked Records return endpoint IP addresses directly without an intermediate CNAME hop and enforce endpoint type consistency via [Strictly Typed Profiles](../traffic-manager/traffic-manager-strictly-typed-profiles.md). Both features are currently in PREVIEW. This tutorial covers the alias record approach, which remains supported for backward compatibility.

You can create an alias record for your apex domain name to reference an Azure Traffic Manager profile. Instead of using a redirecting service, you configure Azure DNS to reference a Traffic Manager profile directly from your zone. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and a subnet.
> * Create a web server virtual machine with a public IP.
> * Add a DNS label to a public IP.
> * Create a Traffic Manager profile.
> * Create an alias record.
> * Test the alias record.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Prerequisites

* An Azure account with an active subscription.
* A domain name hosted in Azure DNS. If you don't have an Azure DNS zone, you can [create a DNS zone](./dns-delegate-domain-azure-dns.md#create-a-dns-zone), then [delegate your domain](dns-delegate-domain-azure-dns.md#delegate-the-domain) to Azure DNS.

> [!NOTE]
> In this tutorial, `contoso.com` is used as an example domain name. Replace `contoso.com` with your own domain name.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Register the Microsoft.Network resource provider

To create alias records, you must register the **Microsoft.Network** resource provider. If the DNS zone and the alias target resource are in different subscriptions, both subscriptions must be registered. You can register resource providers using Azure CLI, PowerShell, or the Azure portal. See the following example:

```azurecli-interactive
az provider register --namespace Microsoft.Network
```

For more information, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/troubleshooting/error-register-resource-provider?tabs=azure-portal#solution).  

## Create the network infrastructure

Create a virtual network and a subnet to place your web servers in.

1. In the Azure portal, enter *virtual network* in the search box at the top of the portal, and then select **Virtual networks** from the search results.
2. In **Virtual networks**, select **+ Create**.
3. In **Create virtual network**, enter or select the following information in the **Basics** tab:

    | Setting | Value |
    |---------|-------|
    | **Project Details**  |   |
    | Subscription   | Select your Azure subscription. |
    | Resource Group       | Select **Create new**. </br> In **Name**, enter *test-rg*. </br> Select **OK**. |
    | **Instance details** |     |
    | Name   | Enter *vnet-1*.    |
    | Region    | Select your region. |

4. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.
5. In the **IP Addresses** tab, enter the following information:

    | Setting | Value |
    |---------|-------|
    | IPv4 address space | Enter *10.10.0.0/16*.  |

6. Select **+ Add subnet**, and enter this information in the **Add subnet**:

    | Setting | Value |
    |---------|-------|
    | Subnet name | Enter *subnet-1*. |
    | Subnet address range | Enter *10.10.0.0/24*. |

7. Select **Add**.
8. Select the **Review + create** tab or select the **Review + create** button.
9. Select **Create**.

## Create web server virtual machines

Create two Linux virtual machines, install NGINX web server on them, and then add DNS labels to their public IPs.

### Create the virtual machines

Create two Ubuntu virtual machines.

1. In the Azure portal, enter *virtual machine* in the search box at the top of the portal, and then select **Virtual machines** from the search results.
2. In **Virtual machines**, select **+ Create** and then select **Azure virtual machine**.
3. In **Create a virtual machine**, enter or select the following information in the **Basics** tab:

    | Setting | Value |
    |---------|-------|
    | **Project Details**   |  |
    | Subscription  | Select your Azure subscription. |
    | Resource Group   | Select **test-rg**. |
    | **Instance details**   |   |
    | Virtual machine name  | Enter *vm-1*. |
    | Region    | Select **(US) East US**. |
    | Availability options  | Select **No infrastructure redundancy required**. |
    | Security type    | Select **Standard**. |
    | Image   | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | Size   | Select your VM size. |
    | **Administrator account** |  |
    | Authentication type | Select **SSH public key**. |
    | Username  | Enter a username. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter a name for the key pair. |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |


4. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
5. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    |---------|-------|
    | **Network interface** |  |
    | Virtual network | Select **vnet-1**. |
    | Subnet  | Select **subnet-1**. |
    | Public IP   | Select **Create new**, and then enter *public-ip-1* in **Name**. Select **Standard** for the **SKU**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports  | Select **Allow selected ports**. |
    | Select inbound ports  | Select **HTTP (80)** and **HTTPS (443)**. |

6. Select **Review + create**.
7. Review the settings, and then select **Create**.
8. Repeat previous steps to create the second virtual machine. Enter *vm-2* in the **Virtual machine name** and *public-ip-2* in the **Name** of **Public IP**. For the other settings, use the same information from the previous steps used with first virtual machine.

Each virtual machine deployment may take a few minutes to complete.

> [!NOTE]
> The network security group rules block inbound SSH access from the internet. To run commands on the virtual machines, use the **Run command** feature in the Azure portal or deploy Azure Bastion. For more information about Azure Bastion, see [Quickstart: Deploy Azure Bastion with default settings](../bastion/quickstart-host-portal.md).

### Install NGINX web server

Install NGINX on both **vm-1** and **vm-2** virtual machines using the **Run command** feature in the Azure portal.

1. In the search box at the top of the portal, enter *virtual machine*. Select **Virtual machines** in the search results.

1. Select the **vm-1** virtual machine.

1. In the **Operations** section of the left menu, select **Run command**.

1. Select **RunShellScript**.

1. In the **Run Command Script** pane, enter the following command:

    ```bash
    sudo apt-get update && sudo apt-get install -y nginx && echo 'Hello World from vm-1' | sudo tee /var/www/html/index.html
    ```

1. Select **Run**.

1. Wait for the command to complete. The output displays the installation progress and finishes when NGINX is installed.

1. Repeat the previous steps for the **vm-2** virtual machine. Use the following command instead:

    ```bash
    sudo apt-get update && sudo apt-get install -y nginx && echo 'Hello World from vm-2' | sudo tee /var/www/html/index.html
    ```

### Add a DNS label

Public IP addresses need DNS labels to work with Traffic Manager.

1. In the Azure portal, enter *test-rg* in the search box at the top of the portal, and then select **test-rg** from the search results.
1. In the **test-rg** resource group, select the **public-ip-1** public IP address.
3. Under **Settings**, select **Configuration**.
4. Enter *vm-1-tmlink* in the **DNS name label**.
5. Select **Save**.

    :::image type="content" source="./media/tutorial-alias-tm/ip-dns-name-label-inline.png" alt-text="Screenshot of the Configuration page of Azure Public IP Address showing D N S name label." lightbox="./media/tutorial-alias-tm/ip-dns-name-label-expanded.png":::

6. Repeat the previous steps for the **public-ip-2** public IP address and enter *vm-2-tmlink* in the **DNS name label**.

## Create a Traffic Manager profile

1. In the **Overview** page of **public-ip-1** public IP address, note the IP address for later use. Repeat this step for the **public-ip-2** public IP address.
2. In the Azure portal, enter *Traffic Manager profile* in the search box at the top of the portal, and then select **Traffic Manager profiles**.
3. Select **+ Create**.
4. In the **Create Traffic Manager profile** page, enter or select the following information:

    | Setting | Value |
    |---------|-------|
    | Name | Enter *tm-alias-profile*.  |
    | Routing method   | Select **Priority**.   |
    | Subscription  | Select your Azure subscription.  |
    | Resource group  | Select **test-rg**.  |

    :::image type="content" source="./media/tutorial-alias-tm/create-traffic-manager-profile.png" alt-text="Screenshot of the Create Traffic Manager profile page showing the selected settings.":::

5. Select **Create**.
6. After **tm-alias-profile** deployment finishes, select **Go to resource**.
7. In the **Endpoints** page of **tm-alias-profile** Traffic Manager profile, select **+ Add** and enter or select the following information:

    | Setting | Value |
    |---------|-------|
    | Type | Select **External endpoint**. |
    | Name | Enter *tmendpoint-1*. |
    | Fully qualified domain name (FQDN) or IP | Enter the IP address for **public-ip-1** that you noted previously.  |
    | Priority  | Enter *1*.  |

    :::image type="content" source="./media/tutorial-alias-tm/add-endpoint-tm-inline.png" alt-text="Screenshot of the Endpoints page in Traffic Manager profile showing selected settings for adding an endpoint." lightbox="./media/tutorial-alias-tm/add-endpoint-tm-expanded.png":::

8. Select **Add**.
9. Repeat the last two steps to create the second endpoint. Enter or select the following information:

    | Setting | Value |
    |---------|-------|
    | Type | Select **External endpoint**. |
    | Name   | Enter *tmendpoint-2*. |
    | Fully qualified domain name (FQDN) or IP | Enter the IP address for **public-ip-2** that you noted previously.  |
    | Priority  | Enter *2*. |

## Create an alias record

Create an alias record that points to the Traffic Manager profile.

1. In the Azure portal, enter *contoso.com* in the search box at the top of the portal, and then select **contoso.com** DNS zone from the search results.
2. On the **Overview** page of **contoso.com** DNS zone, select the **+ Record set** button.
3. In **Add record set**, leave the **Name** box empty to represent the apex domain name. An example is `contoso.com`.
4. Select **A** for the **Type**.
5. Select **Yes** for the **Alias record set**, and then select the **Azure Resource** for the **Alias type**.
6. Select the **tm-alias-profile** Traffic Manager profile for the **Azure resource**.
7. Select **OK**.

    :::image type="content" source="./media/tutorial-alias-tm/add-record-set-tm-inline.png" alt-text="Screenshot of adding an alias record to refer to the Traffic Manager profile." lightbox="./media/tutorial-alias-tm/add-record-set-tm-expanded.png":::

> [!NOTE]
> DNS Queries to your newly aliased Traffic Manager recordset are displayed in your Traffic Manager profile billing. For more information on Traffic Manager billing, see [Traffic Manager pricing](https://azure.microsoft.com/pricing/details/traffic-manager).

## Test the alias record

1. From a web browser, browse to `contoso.com` or your apex domain name. You see the NGINX page with `Hello World from vm-1`. The Traffic Manager directed traffic to **vm-1** because it has the highest priority. Close the web browser and shut down **vm-1** virtual machine. Wait a few minutes for the virtual machine to completely shut down.
2. Open a new web browser, and browse again to `contoso.com` or your apex domain name.
3. You should see the NGINX page with `Hello World from vm-2`. The Traffic Manager handled the situation and directed traffic to the second web server after shutting down the first server that has the highest priority.

## Clean up resources

When no longer needed, you can delete all resources created in this tutorial by following these steps:

1. On the Azure portal menu, select **Resource groups**.
2. Select the **test-rg** resource group.
3. On the **Overview** page, select **Delete resource group**.
4. Enter *test-rg* and select **Delete**.
5. On the Azure portal menu, select **All resources**.
6. Select **contoso.com** DNS zone.
7. On the **Overview** page, select the **@** record created in this tutorial.
8. Select **Delete** and then **Yes**.

## Next steps

In this tutorial, you learned how to create an alias record to use your apex domain name to reference a Traffic Manager profile.

- Learn more about [alias records](dns-alias.md).
- Learn more about [zones and records](dns-zones-records.md).
- Learn more about [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).
