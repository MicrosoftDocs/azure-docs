---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 03/01/2020
 ms.author: allensu
 ms.custom: include file
---

## Create the virtual network

In this section, you'll create a virtual network and subnet.

1. On the upper-left side of the screen, select **Create a resource > Networking > Virtual network** or search for **Virtual network** in the search box.

2. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Select your Azure subscription                                  |
    | Resource Group   | Select **Create new**, enter **\<resource-group-name>**, then select OK, or select an existing **\<resource-group-name>** based on parameters. |
    | **Instance details** |                                                                 |
    | Name             | Enter **\<virtual-network-name>**                                    |
    | Region           | Select **\<region-name>** |

3. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

4. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **\<IPv4-address-space>** |

5. Under **Subnet name**, select the word **default**.

6. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **\<subnet-name>** |
    | Subnet address range | Enter **\<subnet-address-range>**

7. Select **Save**.

8. Select the **Review + create** tab or select the **Review + create** button.

9. Select **Create**.