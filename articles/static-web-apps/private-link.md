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

You can use a Private Link (also called Private Endpoint) to restrict access to your Static Web App so that it is only accessible from your private network. Private Links are enabled by using an address from your Azure VNet address space. Network traffic from your private network to your Static Web App happens over the VNet, so your Static Web App is never exposed to the public internet.

## How it works

You'll need an Azure VNet in order to put your Static Web App behind a Private Link.

Azure VNet's are a network just like you might have in a traditional data center. Resources within the VNet will be able to talk to each other securely on the Microsoft backbone network.

You then create a Private Link within that VNet and assign it to your Static Web App. The Private Link uses a private IP address from your VNet, effectively bringing your Static Web App into your VNet. Your Static Web App will no longer be available from the public internet and will only be accessible from machines within your Azure VNet.

> [!WARNING]
> Placing your Static Web App behind a Private Link will mean that your app will only be available in the region where your VNet is located. You will no longer get the benefit of Static Web Apps multiple points of presence.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An [Azure Static Web App](https://docs.microsoft.com/en-us/azure/static-web-apps/get-started-portal?tabs=vanilla-javascript)

## Create a virtual network and bastion host

In this section, you'll create a virtual network, subnet, and bastion host.

The bastion host is used to connect securely to virtual machines within a virtual network. You'll have the chance to create a virtual machine later in this article to test your Private Link.

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

   | **Setting**          | **Value**                             |
   | -------------------- | ------------------------------------- |
   | **Project Details**  |                                       |
   | Subscription         | Select your Azure subscription        |
   | Resource Group       | Select **CreatePrivateEndpointQS-rg** |
   | **Instance details** |                                       |
   | Name                 | Enter **myVNet**                      |
   | Region               | Select **West Europe**.               |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

   | Setting            | Value                 |
   | ------------------ | --------------------- |
   | IPv4 address space | Enter **10.1.0.0/16** |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

   | Setting              | Value                 |
   | -------------------- | --------------------- |
   | Subnet name          | Enter **mySubnet**    |
   | Subnet address range | Enter **10.1.0.0/24** |

7. Select **Save**.

8. Select the **Security** tab.

9. Under **BastionHost**, select **Enable**. Enter this information:

   | Setting                          | Value                                                                                  |
   | -------------------------------- | -------------------------------------------------------------------------------------- |
   | Bastion name                     | Enter **myBastionHost**                                                                |
   | AzureBastionSubnet address space | Enter **10.1.1.0/24**                                                                  |
   | Public IP Address                | Select **Create new**. </br> For **Name**, enter **myBastionIP**. </br> Select **OK**. |

10. Select the **Review + create** tab or select the **Review + create** button.

11. Select **Create**.

## Create a Private Endpoint

In this section, you'll create a Private Endpoint for your Static Web App.

1. On the upper-left side of the screen in the portal, select **Create a resource** > **Networking** > **Private Link**, or in the search box enter **Private Link**.

2. Select **Create**.

3. In **Private Link Center**, select **Private endpoints** in the left-hand menu.

4. In **Private endpoints**, select **+ Add**.

5. In the **Basics** tab of **Create a private endpoint**, enter, or select this information:

   | Setting              | Value                                                                                           |
   | -------------------- | ----------------------------------------------------------------------------------------------- |
   | **Project details**  |                                                                                                 |
   | Subscription         | Select your subscription.                                                                       |
   | Resource group       | Select **CreatePrivateEndpointQS-rg**. You created this resource group in the previous section. |
   | **Instance details** |                                                                                                 |
   | Name                 | Enter **myPrivateEndpoint**.                                                                    |
   | Region               | Select **West Europe**.                                                                         |

6. Select the **Resource** tab or the **Next: Resource** button at the bottom of the page.
7. In **Resource**, enter or select this information:

   | Setting             | Value                                                                                                   |
   | ------------------- | ------------------------------------------------------------------------------------------------------- |
   | Connection method   | Select **Connect to an Azure resource in my directory**.                                                |
   | Subscription        | Select your subscription.                                                                               |
   | Resource type       | Select **Microsoft.Web/staticSites**.                                                                   |
   | Resource            | Select **\<your-web-app-name>**. </br> Select the name of the web app you created in the prerequisites. |
   | Target sub-resource | Select **sites**.                                                                                       |

8. Select the **Configuration** tab or the **Next: Configuration** button at the bottom of the screen.

9. In **Configuration**, enter or select this information:

   | Setting                         | Value                                                         |
   | ------------------------------- | ------------------------------------------------------------- |
   | **Networking**                  |                                                               |
   | Virtual network                 | Select **myVNet**.                                            |
   | Subnet                          | Select **mySubnet**.                                          |
   | **Private DNS integration**     |                                                               |
   | Integrate with private DNS zone | Leave the default of **Yes**.                                 |
   | Subscription                    | Select your subscription.                                     |
   | Private DNS zones               | Leave the default of **(New) privatelink.azurewebsites.net**. |

10. Select **Review + create**.

11. Select **Create**.

## Testing your Private Link

Your Static Web App will no longer be available via the public URL that you were given before. The only way to access it now will be from inside of your virtual network. To test that, you can setup a virtual machine inside of your virtual network.

1. [Create a virtual machine in your virtual network](https://docs.microsoft.com/en-us/azure/private-link/create-private-endpoint-portal#create-a-virtual-machine)
2. [Test connectivity to your private link](https://docs.microsoft.com/en-us/azure/private-link/create-private-endpoint-portal#test-connectivity-to-private-endpoint)

## Next steps

> [!div class="nextstepaction"]
> [Networking options](./networking-options.md)
