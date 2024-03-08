---
 title: include file
 description: include file
 services: load-balancer
 author: mbender-ms
 ms.service: load-balancer
 ms.topic: include
 ms.date: 10/24/2023
 ms.author: mbender
 ms.custom: include file
---

## Create virtual network and virtual machines

A virtual network and subnet is required for the resources in the tutorial. In this section, you create a virtual network and virtual machines for the later steps.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **+ Create** > **+ Virtual machine**.
   
1. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter *load-balancer-rg*. </br> Select **OK**. |
    | **Instance details** |    |
    | Virtual machine name | Enter *lb-vm1*. |
    | Region | Select **((US) East US)**. |
    | Availability options | Select **Availability zone**. |
    | Availability zone | Select **Zone 1**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 20.04 LTS - Gen2**. |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Select a VM size. |
    | **Administrator account** |    |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter *azureuser*. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter *lb-key-pair*. |
    | **Inbound port rules** |    |
    | Public inbound ports | Select **None**. |

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

1. In the **Networking** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **Create new**. </br> Enter *lb-vnet* in **Name**. </br> In **Address space**, under **Address range**, enter *10.0.0.0/16*. </br> In **Subnets**, under **Subnet name**, enter *backend-subnet*. </br> In **Address range**, enter *10.0.1.0/24*. </br> Select **OK**. |
    | Subnet | Select **backend-subnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> Enter *lb-NSG* in **Name**. </br> Select **+ Add an inbound rule** under **Inbound rules**. </br> In **Service**, select **HTTP**. </br> Enter *100* in **Priority**. </br> Enter *lb-NSG-Rule* for **Name**. </br> Select **Add**. </br> Select **OK**. |

2. Select the **Review + create** tab, or select the **Review + create** button at the bottom of the page.

3. Select **Create**.

4. At the **Generate new key pair** prompt, select **Download private key and create resource**. Your key file is downloaded as lb-key-pair.pem. Ensure you know where the .pem file was downloaded, you'll need the path to the key file in later steps.

5. Follow the steps 1 through 7 to create another VM with the following values and all the other settings the same as **lb-vm1**:

    | Setting | Value |
    | ------- | ----- |
    | **Basics** |    |
    | **Instance details** |   |
    | Virtual machine name | Enter *lb-vm2* |
    | Availability zone | Select **Zone 2** |
    | **Administrator account** |   |
    | Authentication type | Select **SSH public key** |
    | SSH public key source | Select **Use existing key stored in Azure**. |
    | Stored Keys | Select **lb-key-pair**. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |
    | **Networking** |   |
    | **Network interface** |  |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select the existing **lb-NSG** |
