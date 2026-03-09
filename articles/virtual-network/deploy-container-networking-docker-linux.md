---
title: Deploy container networking for a stand-alone Linux Docker host
titleSuffix: Azure Virtual Network
description: Learn how to deploy the Azure CNI plug-in to enable container virtual network connectivity for a standalone Linux Docker host.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 02/23/2026
ms.custom:
  - template-how-to
  - linux-related-content
  - sfi-image-nochange
# Customer intent: As a DevOps engineer, I want to deploy the Azure CNI plugin for a standalone Linux Docker host, so that I can enable container networking and ensure proper IP address allocation for my containers.
---

# Deploy container networking for a stand-alone Linux Docker host

The Azure CNI plugin enables per container/pod networking for stand-alone docker hosts and Kubernetes clusters. In this article, you learn how to install and configure the CNI plugin for a standalone Linux Docker host.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Create a resource group

1. In the portal, search for and select **Resource groups**.

1. Select **+ Create**.

1. In the **Basics** tab of **Create a resource group**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Resource group | Enter **test-rg**. |
    | Region | Select **East US 2**. |

1. Select **Review + create**.

1. Select **Create**.

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

It can take a few minutes for the Bastion host to deploy. You can continue with the steps while the Bastion host is deploying.

## Create a virtual machine

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter, or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-1**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **SSH public key**. |
    | Username | Enter a username. |
    | SSH public key source | Select **Generate new key pair**. |
    | Key pair name | Enter **vm-1-key**. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | Network interface (NIC) network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**.</br> In **Name** enter **nsg-1**.</br> Select **OK**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

1. A **Generate new key pair** pop-up appears. Select **Download private key and create resource**.

1. The private key file downloads to your computer. Save the private key file to a known location on your computer.  This key is used to connect to the virtual machine with Azure Bastion in a later step.

## Add IP configuration

The Azure CNI plugin allocates IP addresses to containers based on a pool of IP addresses you create on the virtual network interface of the virtual machine. For every container on the host, an IP configuration must exist on the virtual network interface. If the number of containers on the server outnumber the IP configurations on the virtual network interface, the container starts but doesn't have an IP address. 

In this section, you add an IP configuration to the virtual network interface of the virtual machine you created previously.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. In **Settings**, select **Networking**.

1. Select the name of the network interface next to **Network Interface:**. The network interface is named **vm-1** with a random number.

1. In **Settings** of the network interface, select **IP configurations**.

1. in **IP configurations**, select **ipconfig1** in **Name**.

1. In the **ipconfig1** settings, change the assignment of the private IP address from **Dynamic** to **Static**.

1. Select **Save**.

1. Return to **IP configurations**.

1. Select **+ Add**.

1. Enter or select the following information for **Add IP configuration**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **ipconfig-2**. |
    | **Private IP address settings** |  |
    | Allocation | Select **Static**. |
    | IP address | Enter **10.0.0.5**. |

1. Select **OK**.

1. Verify **ipconfig-2** has been added as a secondary IP configuration.

Repeat the previous steps to add as many configurations as containers you wish to deploy on the container host.

## Install Docker

The Docker container engine must be installed and configured on the virtual machine you created previously.

Sign-in to the virtual machine you created previously with the Azure Bastion host you deployed with the virtual network.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. In the **Overview** of **vm-1**, select **Connect** then **Connect via Bastion**.

1. In the **Bastion** connection page, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Authentication Type | Select **SSH Private Key from Local File**. |
    | Username | Enter the username you created. |
    | Local File | Select the **vm-1-key** private key file you downloaded. |

1. Select **Connect**.

For install instructions for Docker on an Ubuntu container host, see [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

After Docker is installed on the virtual machine, follow the instructions for the Linux post install. For instructions on the Linux post install, see [Docker Engine post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/).

After Docker is installed on your virtual machine, continue with the steps in this article.

## Install CNI plugin and create a test container

The Azure CNI plugin is maintained as a GitHub project and is available for download from the project's GitHub page. For this article, you use **`git`** within the virtual machine to clone the repository for the plugin and then install and configure the plugin.

For more information about the Azure CNI plugin, see [Microsoft Azure Container Networking](https://github.com/Azure/azure-container-networking).

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. In the **Overview** of **vm-1**, select **Connect** then **Connect via Bastion**.

1. In the **Bastion** connection page, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Authentication Type | Select **SSH Private Key from Local File**. |
    | Username | Enter the username you created. |
    | Local File | Select the **vm-1-key** private key file you downloaded. |

1. Select **Connect**.

1. The application **jq** is required for the install script for the CNI plugin, use the following example to install the application:

    ```bash
    sudo apt-get update
    sudo apt-get install jq
    ```
1. Next, you clone the repository for the CNI plugin. Use the following example to clone the repository:

    ```bash
    git clone https://github.com/Azure/azure-container-networking.git
    ```

1. Configure permissions and install the CNI plugin. The install script command requires a version number for the CNI plugin. At the time of the writing of this article, the newest version is **`v1.4.39`**. To obtain the latest version number of the plugin or previous versions, see [Releases](https://github.com/Azure/azure-container-networking/releases).

    ```bash
    cd ./azure-container-networking/scripts
    chmod u+x install-cni-plugin.sh
    sudo ./install-cni-plugin.sh v1.4.39
    chmod u+x docker-run.sh
    ```

1. To start a container with the CNI plugin, you must use a special script that comes with the plugin to create and start the container. The following example creates an Alpine container with the CNI plugin script:

    ```bash
    sudo ./docker-run.sh vnetdocker1 default alpine
    ```

1. To verify that the container received the IP address you previously configured, connect to the container and view the IP:

    ```bash
    sudo docker exec -it vnetdocker1 /bin/sh
    ```

1. Use the **`ifconfig`** command in the following example to verify the IP address was assigned to the container:

    ```bash
    ifconfig
    ```
    :::image type="content" source="./media/deploy-container-networking-docker-linux/ifconfig-output.png" alt-text="Screenshot of ifconfig output in Bash prompt of test container.":::

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

## Next steps

In this article, you learned how to install the Azure CNI plugin and create a test container.

For more information about Azure container networking and Azure Kubernetes service, see:

- [What is Azure Kubernetes Service?](/azure/aks/intro-kubernetes)

- [Microsoft Azure Container Networking](https://github.com/Azure/azure-container-networking)

- [Azure CNI plugin releases](https://github.com/Azure/azure-container-networking/releases)

- [Deploy the Azure Virtual Network container network interface plug-in](deploy-container-networking.md)
