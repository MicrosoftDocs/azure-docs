---
title: 'Tutorial: Connect to a storage account using an Azure Private Endpoint'
titleSuffix: Azure Private Link
description: Get started with this tutorial using Azure Private endpoint to connect to a storage account privately.
#customer intent: This tutorial is intended for users who want to securely connect to a storage account using an Azure Private Endpoint, ensuring private and secure communication within Azure resources.
author: abell
ms.author: abell
ms.service: azure-private-link
ms.topic: tutorial
ms.date: 02/23/2026
ms.custom: template-tutorial
# Customer intent: "As a cloud architect, I want to securely connect to a storage account using a private endpoint, so that I can ensure private and secure communication within my Azure resources."
---

# Tutorial: Connect to a storage account using an Azure Private Endpoint

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to privately and securely communicate with Private Link resources such as Azure Storage.

:::image type="content" source="./media/tutorial-private-endpoint-storage/storage-tutorial-resources.png" alt-text="Diagram of resources created in tutorial." lightbox="./media/tutorial-private-endpoint-storage/storage-tutorial-resources.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a storage account and disable public access.
> * Create a private endpoint for the storage account.
> * Create a virtual machine.
> * Test connectivity to the storage account private endpoint.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## <a name="create-storage-account-with-a-private-endpoint"></a> Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a resource group

A resource group is a logical container for Azure resources. This procedure creates a resource group for all resources used in this tutorial.

1. In the portal, search for and select **Resource groups**.

1. On the **Resource groups** page, select **+ Create**.

1. On the **Basics** tab, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Enter **test-rg**. |
    | **Resource details** |  |
    | Region | Select **East US 2**. |

1. Select **Review + create**, and then select **Create**.

## Create a virtual network

The following procedure creates a virtual network with a resource subnet.

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter, or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **vnet-1**. |
    | Region | Select **East US 2**. |

1. Select **Next** to proceed to the **Security** tab.

1. Select **Next** to proceed to the **IP Addresses** tab.

1. In the address space box in **Subnets**, select the **default** subnet.

1. In **Edit subnet**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Subnet details** |  |
    | Subnet template | Leave the default **Default**. |
    | Name | Enter **subnet-1**. |
    | Starting address | Leave the default of **10.0.0.0**. |
    | Subnet size | Leave the default of **/24 (256 addresses)**. |

1. Select **Save**.

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**.

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to VMs in your virtual network over Secure Shell (SSH) or Remote Desktop Protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](/azure/bastion/bastion-overview).

>[!NOTE]
>[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. In the search box at the top of the portal, enter **Bastion**. Select **Bastions** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create a Bastion**, enter, or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **bastion**. |
    | Region | Select **East US 2**. |
    | Tier | Select **Developer**. |
    | **Configure virtual networks** |  |
    | Virtual network | Select **vnet-1**. |

1. Select **Review + create**.

1. Select **Create**.

[!INCLUDE [create-storage-account.md](~/reusable-content/ce-skilling/azure/includes/create-storage-account.md)]

## Disable public access to storage account

Before you create the private endpoint, it's recommended to disable public access to the storage account. Use the following steps to disable public access to the storage account.

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. Select **storage1** or the name of your existing storage account.

1. In **Security + networking**, select **Networking**.

1. In the **Firewalls and virtual networks** tab in **Public network access**, select **Disabled**.

1. Select **Save**.

## Create private endpoint

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints**.

1. Select **+ Create** in **Private endpoints**.

1. In the **Basics** tab of **Create a private endpoint**, enter, or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** |
    | **Instance details** |   |
    | Name | Enter **private-endpoint**. |
    | Network Interface Name | Leave the default of **private-endpoint-nic**. |
    | Region | Select **East US 2**. |

1. Select **Next: Resource**.
    
1. In the **Resource** pane, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Connection method | Leave the default of **Connect to an Azure resource in my directory.** |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Storage/storageAccounts**. |
    | Resource | Select **storage-1** or your storage account. |
    | Target subresource | Select **blob**. |

1. Select **Next: Virtual Network**. 

1. In **Virtual Network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Networking** |  |
    | Virtual network | Select **vnet-1 (test-rg)**. |
    | Subnet | Select **subnet-1**. |
    | Network policy for private endpoints | Select **edit** to apply Network policy for private endpoints. </br> In **Edit subnet network policy**, select the checkbox next to **Network security groups** and **Route Tables** in the **Network policies setting for all private endpoints in this subnet** pull-down. </br> Select **Save**. </br></br>For more information, see [Manage network policies for private endpoints](disable-private-endpoint-network-policy.md) |

    # [**Dynamic IP**](#tab/dynamic-ip)

    | Setting | Value |
    | ------- | ----- |
    | **Private IP configuration** | Select **Dynamically allocate IP address**. |



    # [**Static IP**](#tab/static-ip)

    | Setting | Value |
    | ------- | ----- |
    | **Private IP configuration** | Select **Statically allocate IP address**. |
    | Name | Enter **ipconfig-1**. |
    | Private IP | Enter **10.0.0.10**. |



    ---

1. Select **Next: DNS**.

1. Leave the defaults in **DNS**. Select **Next: Tags**, then **Next: Review + create**. 

1. Select **Create**.

[!INCLUDE [create-test-virtual-machine.md](~/reusable-content/ce-skilling/azure/includes/create-test-virtual-machine.md)]

## Storage access key

The storage access key is required for the later steps. Go to the storage account you created previously and copy the connection string with the access key for the storage account.

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. Select the storage account you created in the previous steps or your existing storage account.

1. In the **Security + networking** section of the storage account, select **Access keys**.

1. Select **Show**, then select copy on the **Connection string** for **key1**.

## Add a blob container

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. Select the storage account you created in the previous steps.

1. In the **Data storage** section, select **Containers**.

1. Select **+ Container** to create a new container.

1. Enter **container** in **Name** and select **Private (no anonymous access)** under **Public access level**.

1. Select **Create**.

## Test connectivity to private endpoint

In this section, you use the virtual machine you created in the previous steps to connect to the storage account across the private endpoint using **Microsoft Azure Storage Explorer**.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. In **Connect**, select **Bastion**.

1. Enter the username and password that you entered during the virtual machine creation.

1. Select **Connect**.

1. Open Windows PowerShell on the server after you connect.
1. Enter `nslookup <storage-account-name>.blob.core.windows.net`. Replace **\<storage-account-name>** with the name of the storage account you created in the previous steps. The following example shows the output of the command.

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    storage1.privatelink.blob.core.windows.net
    Address:  10.0.0.10
    Aliases:  mystorageaccount.blob.core.windows.net
    ```

    A private IP address of **10.0.0.10** is returned for the storage account name. This address is in **subnet-1** subnet of **vnet-1** virtual network you created previously.

1. Install [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows&toc=%2fazure%2fstorage%2fblobs%2ftoc.json) on the virtual machine.

1. Select **Finish** after the **Microsoft Azure Storage Explorer** is installed. Leave the box checked to open the application.

1. Select the **Power plug** symbol to open the **Select Resource** dialog box in the left-hand toolbar.

1. In **Select Resource** , select **Storage account or service** to add a connection in **Microsoft Azure Storage Explorer** to your storage account that you created in the previous steps.

1. In the **Select Connection Method** screen, select **Connection string**, and then **Next**.

1. In the box under **Connection String**, paste the connection string from the storage account you copied in the previous steps. The storage account name automatically populates in the box under **Display name**.

1. Select **Next**.

1. Verify the settings are correct in **Summary**.  

1. Select **Connect**

1. Select your storage account from the **Storage Accounts** in the explorer menu.

1. Expand the storage account and then **Blob Containers**.

1. The **container** you created previously is displayed. 

1. Close the connection to **vm-1**.

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

## Next steps

In this tutorial, you learned how to create:

* Virtual network and bastion host.

* Virtual machine.

* Storage account and a container.

Learn how to connect to an Azure Cosmos DB account via Azure Private Endpoint:

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB using Private Endpoint](tutorial-private-endpoint-cosmosdb-portal.md)
