---
title: 'Tutorial: Use a NAT gateway with a hub and spoke network'
titleSuffix: Azure Virtual Network NAT
description: Learn how to integrate a NAT gateway into a hub and spoke network with a network virtual appliance. 
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: nat
ms.topic: tutorial 
ms.date: 01/09/2023
ms.custom: template-tutorial 
---

# Tutorial: Use a NAT gateway with a hub and spoke network

[Add your introductory paragraph]


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a NAT gateway.
> * Create a hub and spoke virtual network.
> * Create a simulated Network Virtual Appliance (NVA).
> * Force all traffic from the spokes through the hub.
> * Force all internet traffic in the hub and the spokes out the NAT gateway.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a NAT gateway

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create network address translation (NAT) gateway** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorialNATHubSpoke-rg** in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **South Central US**. |
    | Availability zone | Select a **Zone** or **No zone**. |
    | TCP idle timeout (minutes) | Enter **15**. |

5. Select **Next: Outbound IP**.

6. In **Outbound IP** in **Public IP addresses**, select **Create a new public IP address**.

7. Enter **myPublicIP-NAT-1** in **Name**.

8. Select **OK**.

9. Select **Review + create**. 

10. Select **Create**.

## Create hub virtual network

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

2. Select **+ Create**.

3. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialNATHubSpoke-rg**. |
    | **Instance details** |   |
    | Name | Enter **myVNet-Hub**. |
    | Region | Select **South Central US**. |

4. Select **Next: IP Addresses**.

5. In the **IP Addresses** tab in **IPv4 address space**, select the trash can to delete the address space that is auto populated.

6. In **IPv4 address space** enter **10.1.0.0/16**.

7. Select **+ Add subnet**.

8. In **Add subnet** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | Enter **subnet-private**. |
    | Subnet address range | Enter **10.1.0.0/24**. |

9. Select **Add**.

10. Select **+ Add subnet**.

11. In **Add subnet** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | Enter **subnet-public**. |
    | Subnet address range | Enter **10.1.253.0/28**. |
    | **NAT GATEWAY** |   |
    | NAT gateway | Select **myNATgateway**. |

12. Select **Add**.

13. Select **Next: Security**.

14. In the **Security** tab in **BastionHost** select **Enable**.

15. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **myBastion**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26**. |
    | Public IP address | Select **Create new**. </br> In **Name** enter **myPublicIP-Bastion**. </br> Select **OK**. |

16. Select **Review + create**.

17. Select **Create**.

It will take a few minutes for the bastion host to deploy. When the virtual network is created as part of the deployment you can proceed to the next steps.

## Create simulated NVA virtual machine

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **+ Create** then **Azure virtual machine**.

3. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialNATHubSpoke-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM-NVA**. |
    | Region | Select **(US) South Central US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 20.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Re-enter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

4. Select **Next: Disks** then **Next: Networking**.

5. In the **Networking** tab enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet-Hub**. |
    | Subnet | Select **subnet-public**. |
    | Public IP | Select **None**. |

6. Leave the rest of the options at the defaults and select **Review + create**.

7. Select **Create**.

### Configure virtual machine network interfaces

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM-NVA**.

3. In the **Overview** select **Stop** if the virtual machine is running.

4. Select **Networking** in **Settings**.

5. In **Networking** select the network interface name next to **Network Interface:**. The interface name is the virtual machine name and random numbers and letters. In this example, the interface name is **myvm-nva271**. 

6. In the network interface properties select **IP configurations** in **Settings**.

7. In **IP forwarding** select **Enabled**.

8. Select **Save**.

9. When the save action completes, select **ipconfig1**.

10. In **Assignment** in **ipconfig1** select **Static**.

11. In **IP address** enter **10.1.253.10.

12. Select **Save**.

13. When the save action completes, return to the networking configuration for **myVM-NVA**.

14. In **Networking** of **myVM-NVA** select **Attach network interface**.

15. Select **Create and attach network interface**.

16. In **Create network interface** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Resource group | Select **TutorialNATHubSpoke-rg**. |
    | **Network interface** |  |
    | Name | Enter **myVM-NVA-private-nic**. |
    | Subnet | Select **subnet-private (10.1.0.0/24)**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **myVM-VNA-nsg**. |
    | Private IP address assignment | Select **Static**. |
    | Private IP address | Enter **10.1.0.10**. |

17. Select **Create**.

### Configure virtual machine software

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM-NVA**.

3. Start **myVM-NVA**.

4. When the virtual machine is completed booting, continue with the next steps.

5. Select **Connect** then **Bastion**.

6. Enter the username and password you entered when the virtual machine was created.

7. Select **Connect**.

8. Enter the following information at the prompt of the virtual machine to enable IP forwarding:

```bash
sudo vim /etc/sysctl.conf
``` 

9. In the Vim editor, remove the **`#`** from the line **`net.ipv4.ip_forward=1`**:

Press the **Insert** key.

```bash
# Uncomment the next line to enable packet forwarding for IPv4
net.ipv4.ip_forward=1
```

Press the **Esc** key.

Enter **`:wq`** and press **Enter**.

10. To enable internal NAT in the virtual machine enter the following information:

```bash
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo apt-get update
sudo apt install iptables-persistent
```

Select **Yes** twice.

```bash
sudo su
iptables-save > /etc/iptables/rules.v4
exit
```

11. Use Vim to edit the configuration with the following information:

```bash
sudo vim /etc/rc.local
```

Press the **Insert** key.

Add the following line to the configuration file:
```bash
/sbin/iptables-restore < /etc/iptables/rules.v4
```

Press the **Esc** key.

Enter **`:wq`** and press **Enter**.

12. Reboot the virtual machine:

```bash
sudo reboot
```

## Create hub network route table

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

2. Select **+ Create**.

3. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialNATHubSpoke-rg**. |
    | **Instance details** |   |
    | Region | Select **South Central US**. |
    | Name | Enter **myRouteTable-NAT-Hub**. |
    | Propagate gateway routes | Leave the default of **Yes**. |

4. Select **Review + create**. 

5. Select **Create**.

6. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

7. Select **myRouteTable-NAT-Hub**.

8. In **Settings** select **Routes**.

9. Select **+ Add** in **Routes**.

10. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **default-via-NAT-Hub**. |
    | Address prefix destination | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **0.0.0.0/0**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.1.0.10**. </br> **_This is the IP address you added to the private interface of the NVA in the previous steps._**. |

11. Select **Add**.

12. Select **Subnets** in **Settings**.

13. Select **+ Associate**.

14. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **myVNet-Hub (TutorialNATHubSpoke-rg)**. |
    | Subnet | Select **subnet-private**. |

15. Select **OK**.

## Create first spoke virtual network








## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
