---
title: Configure private link in Azure Static Web Apps
description: Learn to configure private endpoint access for Azure Static Web Apps
services: static-web-apps
author: burkeholland
ms.author: buhollan
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 3/22/2021
---

# Configure private link in Azure Static Web Apps

You can use a Private Link (also called Private Endpoint) to restrict access to your static web app so that it is only accessible from your private network. Private Links are enabled by using an address from your Azure VNet address space. Network traffic from your private network travels exclusively to your static app over the VNet, so your application is never exposed to the public internet.

## How it works

You'll need an Azure VNet in order to put your application behind a Private Link.

Azure VNet's are a network just like you might have in a traditional data center, but resources within the VNet talk to each other securely on the Microsoft backbone network.

You then create a Private Link within that VNet and assign it to your static app. The Private Link uses a private IP address from your VNet, effectively bringing your application into your VNet. Your application is then no longer available from the public internet, and is only accessible from machines within your Azure VNet.

> [!WARNING]
> Placing your application behind a Private Link means your app is only available in the region where your VNet is located. As a result, your application is longer available across multiple points of presence.

## Prerequisites

- An Azure account with an active subscription.
  - [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An application deployed with [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/get-started-portal?tabs=vanilla-javascript) 

## Create a virtual network and bastion host

In this section, you create a virtual network, subnet, and bastion host.

The bastion host is used to connect securely to virtual machines within a virtual network. You'll have the chance to create a virtual machine later in this article to test your Private Link.

1. Open the [Azure portal](https://portal.azure.com).

1. Search for **Virtual network** in the search box.

1. In **Create virtual network**, enter or select this information in the **Basics** tab:

   | **Setting**          | **Value**                             |
   | -------------------- | ------------------------------------- |
   | **Project Details**  |                                       |
   | Subscription         | Select your Azure subscription        |
   | Resource Group       | Select **CreatePrivateEndpointQS-rg** |
   | **Instance details** |                                       |
   | Name                 | Enter **myVNet**                      |
   | Region               | Select **West Europe**.               |

1. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

1. In the **IP Addresses** tab, enter this information:

   | Setting            | Value                 |
   | ------------------ | --------------------- |
   | IPv4 address space | Enter **10.1.0.0/16** |

1. Under **Subnet name**, select the word **default**.

1. In **Edit subnet**, enter this information:

   | Setting              | Value                 |
   | -------------------- | --------------------- |
   | Subnet name          | Enter **mySubnet**    |
   | Subnet address range | Enter **10.1.0.0/24** |

1. Select **Save**.

1. Select the **Security** tab.

1. Under **BastionHost**, select **Enable**. Enter this information:

   | Setting                          | Value                                                                                  |
   | -------------------------------- | -------------------------------------------------------------------------------------- |
   | Bastion name                     | Enter **myBastionHost**                                                                |
   | AzureBastionSubnet address space | Enter **10.1.1.0/24**                                                                  |
   | Public IP Address                | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |

1. Select the **Review + create** tab or select the **Review + create** button.

1. Select **Create**.

## Create a Private Endpoint

In this section, you create a Private Endpoint for your static web app.

1. In the portal, search for **Private Link** in the search box.

1. Select **Create**.

1. In _Private Link Center_, select **Private endpoints** in the left-hand menu.

1. In _Private endpoints_, select **+ Add**.

1. In the _Basics_ tab of _Create a private endpoint_, enter, or select this information:

   | Setting              | Value                                                                                           |
   | -------------------- | ----------------------------------------------------------------------------------------------- |
   | **Project details**  |                                                                                                 |
   | Subscription         | Select your subscription.                                                                       |
   | Resource group       | Select **CreatePrivateEndpointQS-rg**. You created this resource group in the previous section. |
   | **Instance details** |                                                                                                 |
   | Name                 | Enter **myPrivateEndpoint**.                                                                    |
   | Region               | Select **West Europe**.                                                                         |

1. Select the **Resource** tab or the **Next: Resource** button at the bottom of the page.

1. In _Resource_ section, enter or select this information:

   | Setting             | Value                                                                                                   |
   | ------------------- | ------------------------------------------------------------------------------------------------------- |
   | Connection method   | Select **Connect to an Azure resource in my directory**.                                                |
   | Subscription        | Select your subscription.                                                                               |
   | Resource type       | Select **Microsoft.Web/staticSites**.                                                                   |
   | Resource            | Select **\<your-web-app-name>**. </br> Select the name of the web app you created in the prerequisites. |
   | Target sub-resource | Select **sites**.                                                                                       |

1. Select the **Configuration** tab or the **Next: Configuration** button at the bottom of the screen.

1. In the _Configuration_ section, enter or select this information:

   | Setting                         | Value                                                         |
   | ------------------------------- | ------------------------------------------------------------- |
   | **Networking**                  |                                                               |
   | Virtual network                 | Select **myVNet**.                                            |
   | Subnet                          | Select **mySubnet**.                                          |
   | **Private DNS integration**     |                                                               |
   | Integrate with private DNS zone | Leave the default of **Yes**.                                 |
   | Subscription                    | Select your subscription.                                     |
   | Private DNS zones               | Leave the default of **(New) privatelink.azurewebsites.net**. |

1. Select **Review + create**.

1. Select **Create**.

## Testing your Private Link

Since your application is no longer publicly available, the only way to access it is from inside of your virtual network. For testing, you can setup a virtual machine inside of your virtual network.

1. [Create a virtual machine in your virtual network](../private-link/create-private-endpoint-portal.md#create-a-virtual-machine)
2. [Test connectivity to your private link](../private-link/create-private-endpoint-portal.md#test-connectivity-to-private-endpoint)

## Next steps

> [!div class="nextstepaction"]
> [Networking options](./networking-options.md)
