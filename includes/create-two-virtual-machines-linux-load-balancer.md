---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 07/17/2023
 ms.author: allensu
 ms.custom: include file
---

## Create virtual machines

In this section, you create two VMs (**vm-1** and **vm-2**) in two different zones (**Zone 1** and **Zone 2**).

These VMs are added to the backend pool of the load balancer that was created earlier.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.
   
1. In **Create a virtual machine**, type or select the values in the **Basics** tab:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **vm-1**. |
    | Region | Select **East US 2**. |
    | Availability options | Select **Zone 1**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 22.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |  |
    | Authentication type | Select **Password**. |
    | Username | Enter **azureuser**. |
    | Password | Enter a password. |
    | Confirm password | Reenter the password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    |-|-|
    | **Network interface** |  |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**|
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **nsg-1** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> In **Service**, select **HTTP**. </br> Select **Add** </br> Select **OK** |
    | **Load balancing**  |
    | Place this virtual machine behind an existing load-balancing solution? | Select the check box.|
    | **Load balancing settings** |
    | Load-balancing options | Select **Azure load balancer** |
    | Select a load balancer | Select **load-balancer**  |
    | Select a backend pool | Select **backend-pool** |
   
1. Select **Review + create**. 
  
1. Review the settings, and then select **Create**.

1. Follow the previous steps to create a VM with the following values and all the other settings the same as **vm-1**:

    | Setting | VM 2 |
    | ------- | ----- |
    | Name |  **vm-2** |
    | Availability zone | **2** |
    | Network security group | Select the existing **nsg-1** |
    | Load-balancing options | Select **Azure load balancer** |
    | Select a load balancer | Select **load-balancer**  |
    | Select a backend pool | Select **backend-pool** |
