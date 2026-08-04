---
title: 'Tutorial: Create a Traffic Manager Linked Record - Azure portal'
titleSuffix: Azure DNS
description: Learn to create a Traffic Manager Linked Record in Azure DNS using the Azure portal, returning endpoint IPs without an intermediate CNAME hop.
services: dns
author: asudbring
ms.service: azure-dns
ms.topic: tutorial
ms.date: 06/01/2026
ms.author: allensu
ms.custom:
  - template-tutorial
# Customer intent: "As a network administrator, I want to create a Traffic Manager Linked Record in Azure DNS using the Azure portal, so that clients receive IP addresses directly from DNS without requiring an intermediate CNAME resolution to trafficmanager.net."
---

# Tutorial: Create a Traffic Manager Linked Record using the Azure portal

In this tutorial, you create a **Traffic Manager Linked Record** in Azure DNS. A Traffic Manager Linked Record connects a DNS record set directly to an Azure Traffic Manager profile. When a client queries this record, Azure DNS resolves the Traffic Manager profile internally and returns endpoint IP addresses directly—no intermediate CNAME hop to `trafficmanager.net` is required.

> [!IMPORTANT]
> Traffic Manager Linked Records is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This approach is the recommended way to associate DNS records with Traffic Manager profiles. For a comparison with alias records, see [Traffic Manager Linked Records overview](dns-traffic-manager-linked-records.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and web server virtual machines.
> * Create a Traffic Manager profile with external endpoints.
> * Create a Traffic Manager Linked Record in an Azure DNS zone.
> * Test the Traffic Manager Linked Record.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Prerequisites

* An Azure account with an active subscription.
* A domain name hosted in Azure DNS. If you don't have an Azure DNS zone, you can [create a DNS zone](./dns-delegate-domain-azure-dns.md#create-a-dns-zone), then [delegate your domain](dns-delegate-domain-azure-dns.md#delegate-the-domain) to Azure DNS.

> [!NOTE]
> In this tutorial, `contoso.com` is used as an example domain name. Replace `contoso.com` with your own domain name.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Register the Microsoft.Network resource provider

To create Traffic Manager Linked Records, you must register the **Microsoft.Network** resource provider. If the DNS zone and the Traffic Manager profile are in different subscriptions, both subscriptions must be registered.

```azurecli-interactive
az provider register --namespace Microsoft.Network
```

For more information, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/troubleshooting/error-register-resource-provider?tabs=azure-portal#solution).

## Create the network infrastructure

Create a virtual network and subnet to place your web servers in.

1. In the Azure portal, search for *virtual network* in the search box at the top and select **Virtual networks** from the results.
1. In **Virtual networks**, select **+ Create**.
1. On the **Basics** tab, enter or select the following information:

    | Setting | Value |
    |---------|-------|
    | **Project Details** | |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **Create new**, enter *test-rg*, and select **OK**. |
    | **Instance details** | |
    | Name | Enter *vnet-1*. |
    | Region | Select your region. |

1. Select the **IP Addresses** tab and configure the address space:

    | Setting | Value |
    |---------|-------|
    | IPv4 address space | Enter *10.10.0.0/16*. |

1. Select **+ Add subnet** and enter the following:

    | Setting | Value |
    |---------|-------|
    | Subnet name | Enter *subnet-1*. |
    | Subnet address range | Enter *10.10.0.0/24*. |

1. Select **Add**, then select **Review + create**, and then select **Create**.

## Create web server virtual machines

Create two Ubuntu virtual machines to use as web server endpoints.

### Create the virtual machines

1. In the Azure portal, search for *virtual machine* and select **Virtual machines**.
1. Select **+ Create**, then select **Azure virtual machine**.
1. On the **Basics** tab, enter or select the following values:

    | Setting | Value |
    |---------|-------|
    | **Project Details** | |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **test-rg**. |
    | **Instance details** | |
    | Virtual machine name | Enter *vm-1*. |
    | Region | Select **(US) East US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | Size | Select your preferred VM size. |
    | **Administrator account** | |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter a username. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter a name for the key pair. |
    | **Inbound port rules** | |
    | Public inbound ports | Select **None**. |

1. Select the **Networking** tab and enter the following:

    | Setting | Value |
    |---------|-------|
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1**. |
    | Public IP | Select **Create new**, enter *public-ip-1*, and select **Standard** SKU. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **HTTP (80)** and **HTTPS (443)**. |

1. Select **Review + create**, and then select **Create**.
1. Repeat the previous steps to create a second virtual machine named *vm-2* with a public IP named *public-ip-2*.

Wait for both deployments to complete before continuing.

> [!NOTE]
> To run commands on the virtual machines without SSH, use the **Run command** feature in the Azure portal. For SSH access from the internet, you must add an inbound NSG rule. For more information, see [Azure Bastion](../bastion/quickstart-host-portal.md).

### Install the NGINX web server

Install NGINX on both virtual machines using the **Run command** feature.

1. In the Azure portal, search for *virtual machine* and select **Virtual machines**.
1. Select **vm-1**.
1. In the left menu under **Operations**, select **Run command**.
1. Select **RunShellScript**, enter the following command, and select **Run**:

    ```bash
    sudo apt-get update && sudo apt-get install -y nginx && echo 'Hello World from vm-1' | sudo tee /var/www/html/index.html
    ```

1. Wait for the command to complete.
1. Repeat for **vm-2**, using this command:

    ```bash
    sudo apt-get update && sudo apt-get install -y nginx && echo 'Hello World from vm-2' | sudo tee /var/www/html/index.html
    ```

### Add DNS labels to the public IP addresses

Traffic Manager requires DNS name labels on public IP addresses used as Azure endpoints.

1. In the Azure portal, search for *test-rg* and select the resource group.
1. Select the **public-ip-1** public IP address.
1. Under **Settings**, select **Configuration**.
1. Enter *vm-1-tmlink* in the **DNS name label** field.
1. Select **Save**.

1. Note the full **DNS name** value (for example, `vm-1-tmlink.eastus.cloudapp.azure.com`) and the **IP address** for later use.
1. Repeat for **public-ip-2**, using the DNS name label *vm-2-tmlink*. Note the IP address.

## Create a Traffic Manager profile

1. In the Azure portal, search for *Traffic Manager profile* and select **Traffic Manager profiles**.
1. Select **+ Create**.
1. On the **Create Traffic Manager profile** page, enter or select the following:

    | Setting | Value |
    |---------|-------|
    | Name | Enter *tm-profile*. |
    | Routing method | Select **Priority**. |
    | Record type | Select **A**. |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **test-rg**. |

    > [!NOTE]
    > The **Record type** sets the [Strictly Typed Profile](../traffic-manager/traffic-manager-strictly-typed-profiles.md) value for the profile, locking it to a specific DNS record type. Select **A** for IPv4 address records, **AAAA** for IPv6 address records, or **CNAME** for canonical name records. This value can't be changed after the profile is created.

1. Select **Create**.
1. After deployment completes, select **Go to resource**.

### Add endpoints to the Traffic Manager profile

1. On the **tm-profile** Traffic Manager profile page, select **Endpoints** under **Settings** in the left menu.
1. Select **+ Add** and enter the following for the first endpoint:

    | Setting | Value |
    |---------|-------|
    | Type | Select **External endpoint**. |
    | Name | Enter *tmendpoint-1*. |
    | Fully qualified domain name (FQDN) or IP | Enter the IP address for **public-ip-1** noted previously. |
    | Priority | Enter *1*. |

1. Select **Add**.
1. Select **+ Add** again, and enter the following for the second endpoint:

    | Setting | Value |
    |---------|-------|
    | Type | Select **External endpoint**. |
    | Name | Enter *tmendpoint-2*. |
    | Fully qualified domain name (FQDN) or IP | Enter the IP address for **public-ip-2** noted previously. |
    | Priority | Enter *2*. |

1. Select **Add**.

Both endpoints should show as **Online** after Traffic Manager completes its health checks. This may take a few minutes.

## Create a Traffic Manager Linked Record

Now create the Traffic Manager Linked Record in your DNS zone.

1. In the Azure portal, search for your DNS zone (for example, *contoso.com*) and select it from the results.
1. On the **Overview** page of your DNS zone, select **+ Record set**.
1. In the **Add record set** pane, enter or select the following:

    | Setting | Value |
    |---------|-------|
    | Name | Leave empty to create a record at the zone apex, or enter a subdomain name such as *www*. |
    | Type | Select **A**. |
    | Enable Traffic Management (Preview) | Select the checkbox. |
    | Choose a subscription | Select the subscription that contains your Traffic Manager profile. |
    | Traffic Manager Profile | Select **tm-profile** from the dropdown. |

    > [!NOTE]
    > The record TTL is inherited from the Traffic Manager profile and cannot be set here.

1. Select **OK**.

The new A record appears in the DNS zone record list. The **Type** column shows **A** with a Traffic Manager icon or label indicating it's a linked record.

> [!NOTE]
> DNS queries to your Traffic Manager Linked Record are counted toward your Traffic Manager profile billing. For more information, see [Traffic Manager pricing](https://azure.microsoft.com/pricing/details/traffic-manager/).

## Test the Traffic Manager Linked Record

1. Open a web browser and navigate to your domain name (for example, `contoso.com`). You should see the NGINX welcome page with the text **Hello World from vm-1**, because Traffic Manager routes traffic to **vm-1** based on its higher priority.

1. Close the browser. In the Azure portal, navigate to the **vm-1** virtual machine and select **Stop** to shut it down.

1. Wait a few minutes for Traffic Manager to detect the endpoint as unhealthy. You can monitor endpoint health on the **Endpoints** page of the **tm-profile** Traffic Manager profile.

1. Open a new browser and navigate to `contoso.com` again. You should now see **Hello World from vm-2**, confirming that Traffic Manager has failed over to the secondary endpoint.

## Clean up resources

When you no longer need the resources created in this tutorial, delete the resource group to remove all of them:

1. In the Azure portal, search for *test-rg* and select it.
1. On the **Overview** page, select **Delete resource group**.
1. Enter *test-rg* to confirm, and then select **Delete**.

Also remove the Traffic Manager Linked Record from your DNS zone:

1. In the Azure portal, navigate to your DNS zone (for example, *contoso.com*).
1. On the **Overview** page, select the record created in this tutorial.
1. Select **Delete**, and then confirm by selecting **Yes**.

## Next steps

In this tutorial, you created a Traffic Manager Linked Record to route apex domain traffic through Traffic Manager, returning IP addresses directly without an intermediate CNAME resolution.

- Learn more about [Traffic Manager Linked Records](dns-traffic-manager-linked-records.md).
- Create a Traffic Manager Linked Record using [Azure CLI](tutorial-traffic-manager-linked-records-cli.md) or [Azure PowerShell](tutorial-traffic-manager-linked-records-powershell.md).
- Learn more about [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).
- Learn more about [Strictly Typed Profiles](../traffic-manager/traffic-manager-strictly-typed-profiles.md).
