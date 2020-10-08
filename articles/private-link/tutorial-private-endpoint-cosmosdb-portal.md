---
title: 'Tutorial: Connect to a Azure Cosmos account using an Azure Private endpoint'
titleSuffix: Azure Private Link
description: Get started with Azure Private endpoint to connect to a Azure Cosmos account privately.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 9/25/2020
---

# Tutorial: Connect to a Azure Cosmos account using an Azure Private Endpoint

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to communicate with Private Link resources privately.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a virtual machine.
> * Create a Cosmos DB account with a private endpoint.
> * Test connectivity to Cosmos DB account private endpoint.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

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
    | Allow access from the Azure Portal | Leave the default **Allow**. |
    | Allow access from my IP | Leave the default **Deny**. |

5. In **Private endpoint**, select **+ Add**.

6. In **Create private endpoint** enter or select the following information:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **myResourceGroup** |
    | Location | Select **East US** |
    | Name | Enter **myPrivateEndpoint** |
    | Storage subresource | Leave the default **Core (SQL)** |
    | **Networking** |  |
    | Virtual network | Select **myVNet** |
    | Subnet | Select **mySubnet** |
    | **Private DNS integration** |
    | Integrate with private DNS zone | Leave the default **Yes** |
    | Private DNS Zone | Leave the default (New) privatelink.documents.azure.com |

7. Select **OK**.

8. Select **Review + create**.

9. Select **Create**.


## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the tutorial procedure, a
Clean up resources (H2) should come just before Next steps (H2)
--->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

<!--- Required:
Tutorials should always have a Next steps H2 that points to the next
logical tutorial in a series, or, if there are no other tutorials, to
some other cool thing the customer can do. A single link in the blue box
format should direct the customer to the next article - and you can
shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also
section". --->