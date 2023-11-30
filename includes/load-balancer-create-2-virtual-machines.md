---
 title: include file
 description: include file
 services: virtual-network
 author: mbender-ms
 ms.service: virtual-network
 ms.topic: include
 ms.date: 10/19/2023
 ms.author: mbender
 ms.custom: include file
---

## Create virtual machines

In this section, you create two VMs (**lb-vm1** and **lb-VM2**) in two different zones (**Zone 1** and **Zone 2**). 

These VMs are added to the backend pool of the load balancer that was created earlier.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **+ Create** > **Azure virtual machine**.
   
1. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:

    | Setting | Value                                          |
    |-----------------------|----------------------------------|
    | **Project Details** |  |
    | Subscription | Select your Azure subscription |
    | Resource Group | Select **load-balancer-rg** |
    | **Instance details** |  |
    | Virtual machine name | Enter **lb-VM1** |
    | Region | Select **((US) East US)** |
    | Availability Options | Select **Availability zones** |
    | Availability zone | Select **Zone 1** |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - Gen2** |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Choose VM size or take default setting |
    | **Administrator account** |  |
    | Username | Enter a username |
    | Password | Enter a password |
    | Confirm password | Reenter password |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None** |

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.
  
1. In the Networking tab, select or enter the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |  |
    | Virtual network | Select **lb-vnet** |
    | Subnet | Select **backend-subnet** |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced** |
    | Configure network security group | Skip this setting until the rest of the settings are completed. Complete after **Select a backend pool**.|
    | Delete NIC when VM is deleted | Leave the default of **unselected**. |
    | Accelerated networking | Leave the default of **selected**. |
    | **Load balancing**  |
    | **Load balancing options** |
    | Load-balancing options | Select **Azure load balancer** |
    | Select a load balancer | Select **load-balancer**  |
    | Select a backend pool | Select **lb-backend-pool** |
    | Configure network security group | Select **Create new**. </br> In the **Create network security group**, enter **lb-NSG** in **Name**. </br> Under **Inbound rules**, select **+Add an inbound rule**. </br> In **Service**, select **HTTP**. </br> Under **Priority**, enter **100**. </br> In **Name**, enter **lb-NSG-Rule** </br> Select **Add** </br> Select **OK** |
   
1. Select **Review + create**. 
  
1. Review the settings, and then select **Create**.

1. Follow the steps 1 through 7 to create another VM with the following values and all the other settings the same as **lb-VM1**:

    | Setting | VM 2 
    | ------- | ----- |
    | Name |  **lb-VM2** |
    | Availability zone | **Zone 2** |
    | Network security group | Select the existing **lb-NSG** |