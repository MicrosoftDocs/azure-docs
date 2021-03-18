---
title: 'Tutorial: Connect to an Azure Cosmos account using an Azure Private endpoint'
titleSuffix: Azure Private Link
description: Get started with this tutorial using Azure Private endpoint to connect to an Azure Cosmos account privately.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 9/25/2020
---

# Tutorial: Connect to an Azure Cosmos account using an Azure Private Endpoint

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to communicate with Private Link resources privately.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a virtual machine.
> * Create a Cosmos DB account with a private endpoint.
> * Test connectivity to Cosmos DB account private endpoint.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a virtual network and bastion host

In this section, you'll create a virtual network, subnet, and bastion host. 

The bastion host will be used to connect securely to the virtual machine for testing the private endpoint.

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **myResourceGroup** |
    | **Instance details** |                                                                 |
    | Name             | Enter **myVNet**                                    |
    | Region           | Select **East US** |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **10.1.0.0/16** |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **mySubnet** |
    | Subnet address range | Enter **10.1.0.0/24** |

7. Select **Save**.

8. Select the **Security** tab.

9. Under **BastionHost**, select **Enable**. Enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Bastion name | Enter **myBastionHost** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/24** |
    | Public IP Address | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |


8. Select the **Review + create** tab or select the **Review + create** button.

9. Select **Create**.

## Create a virtual machine

In this section, you'll create a virtual machine that will be used to test the private endpoint.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Virtual machine** or search for **Virtual machine** in the search box.
   
2. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM** |
    | Region | Select **East US** |
    | Availability Options | Select **No infrastructure redundancy required** |
    | Image | Select **Windows Server 2019 Datacenter - Gen1** |
    | Azure Spot instance | Select **No** |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |

3. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
4. In the Networking tab, select or enter:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | **myVNet** |
    | Subnet | **mySubnet** |
    | Public IP | Select **None**. |
    | NIC network security group | **Basic**|
    | Public inbound ports | Select **None**. |
   
5. Select **Review + create**. 
  
6. Review the settings, and then select **Create**.

## Create a Cosmos DB account with a private endpoint

In this section, you'll create a Cosmos DB account and configure the private endpoint.

1. In the left-hand menu, select **Create a resource** > **Databases** > **Cosmos DB Account**, or search for **Cosmos DB account** in the search box.

2. In the **Basics** tab of **Create Cosmos DB account** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **myResourceGroup**. |
    | **Instance details** |  |
    | Account name | Enter **mycosmosdb**. If the name is unavailable, enter a unique name. |
    | API | Select **Core (SQL)**. |
    | Location | Select **East US**. |
    | Capacity mode | Leave the default **Provisioned throughput**. |
    | Apply Free Tier Discount | Leave the default **Do Not Apply**. |
    | Geo-Redundancy | Leave the default **Disable**. |
    | Multi-region Writes | Leave the default **Disable**. |
   
3. Select the **Networking** tab or select the **Next: Networking** button.

4. In the **Networking** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network connectivity** | |
    | Connectivity method | Select **Private endpoint**. |
    | **Configure Firewall** | |
    | Allow access from the Azure portal | Leave the default **Allow**. |
    | Allow access from my IP | Leave the default **Deny**. |

5. In **Private endpoint**, select **+ Add**.

6. In **Create private endpoint** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | Location | Select **East US** |
    | Name | Enter **myPrivateEndpoint** |
    | Target subresource | Leave the default **Core (SQL)** |
    | **Networking** |  |
    | Virtual network | Select **myVNet** |
    | Subnet | Select **mySubnet** |
    | **Private DNS integration** |
    | Integrate with private DNS zone | Leave the default **Yes** |
    | Private DNS Zone | Leave the default (New) privatelink.documents.azure.com |

7. Select **OK**.

8. Select **Review + create**.

9. Select **Create**.

### Add a database and a container

1. Select **Got to resource** or in the left-hand menu of the Azure portal, select **All Resources** > **mycosmosdb**.

2. In the left-hand menu, select **Data Explorer**.

3. In the **Data Explorer** window, select **New Container**.

4. In **Add Container**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Database ID | Leave the default of **Create new**. </br> Enter **mydatabaseid** in the text box. |
    | Throughput (400 - 100,000 RU/s) | Leave the default of **Manual**. </br> Enter **400** in the text box. |
    | Container ID | Enter **mycontainerid** |
    | Partition key | Enter **/mykey** |

5. Select **OK**.

6. In the **Settings** section of the CosmosDB account, select **Keys**.

7. Select copy on the **PRIMARY CONNECTION STRING**.

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous step to connect to the Cosmos DB account across the private endpoint.

1. Select **Resource groups** in the left-hand navigation pane.

1. Select **myResourceGroup**.

1. Select **myVM**.

1. On the overview page for **myVM**, select **Connect** then **Bastion**.

1. Select the blue **Use Bastion** button.

1. Enter the username and password that you entered during the virtual machine creation.

1. Open Windows PowerShell on the server after you connect.

1. Enter `nslookup <cosmosdb-account-name>.documents.azure.com` and validate the name resolution. Replace **\<cosmosdb-account-name>** with the name of the Cosmos DB account you created in the previous steps. 

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mycosmosdb8675.privatelink.documents.azure.com
    Address:  10.1.0.5
    Aliases:  mycosmosdb8675.documents.azure.com
    ```
    A private IP address of **10.1.0.5** is returned for the Cosmos DB account name.  This address is in the subnet of the virtual network you created previously.
    
1. Get your Azure Cosmos DB primary connection string from portal. A valid connection string is in the format:
   
   For SQL API accounts: `https://<accountName>.documents.azure.com:443/;AccountKey=<accountKey>;` 
   For Azure Cosmos DB API for MongoDB: `mongodb://<accountName>:<accountKey>@cdbmongo36.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false`

1. Install [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows&toc=%2fazure%2fstorage%2fblobs%2ftoc.json) on the virtual machine.

1. Select **Finish** after the **Microsoft Azure Storage Explorer** is installed.  Leave the box checked to open the application.

1. In the **Connect to Azure Storage** screen, select **Cancel**.

1. In Storage Explorer, select the right mouse button on **Cosmos DB Accounts** and select **Connect to Cosmos DB**.

1. Leave the default of **SQL** under **Select API**.

1. In the box under **Connection String**, paste the connection string from the Cosmos DB account you copied in the previous steps.

1. Select **Next**.

1. Verify the settings are correct in **Connection Summary**.  

1. Select **Connect**.

1. Close the connection to **myVM**.


## Clean up resources

If you're not going to continue to use this application, delete the virtual network, virtual machine, and Cosmos DB account with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select **myResourceGroup**.

3. Select **Delete resource group**.

4. Enter **myResourceGroup** in **TYPE THE RESOURCE GROUP NAME**.

5. Select **Delete**.

## Next steps

In this tutorial, you created a:

* Virtual network and bastion host.
* Virtual Machine.
* Cosmos DB Account.

Learn how to create a Private Link service:
> [!div class="nextstepaction"]
> [Create a Private Link service](create-private-link-service-portal.md)
