---
title: Deploy container networking for a stand-alone Linux Docker host
titleSuffix: Azure Virtual Network
description: Learn how to deploy the Azure CNI plug-in to enable container virtual network connectivity for a standalone Linux Docker host.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 12/22/2022
ms.custom: template-how-to
---

# Deploy container networking for a stand-alone Linux Docker host

The Azure CNI plugin enables per container/pod networking for stand-alone docker hosts and Kubernetes clusters. In this article, you'll learn how to install and configure the CNI plugin for a standalone Linux Docker host.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create virtual network

A virtual network contains the virtual machine used in this article. In this section, you'll create a virtual network and subnet. You'll enable Azure Bastion during the virtual network deployment. The Azure Bastion host is used to securely connect to the virtual machine to complete the steps in this article.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **+ Create**.

4. Enter or select the following information in the **Basics** tab of **Create virtual network**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup** in **Name**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select a region. |

5. Select **Next: IP Addresses**. 

6. In **IPv4 address space**, enter **10.1.0.0/16**.

7. Select **+ Add subnet**.

8. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | Enter **mySubnet**. |
    | Subnet address range | Enter **10.1.0.0/24**. |

9. Select **Add**.

10. Select **Next: Security**.

11. Select **Enable** in **BastionHost**.

12. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | Enter **myBastion**. |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26**. |
    | Public IP address | Select **Create new**. </br> Enter **myBastionIP** in **Name**. </br> Select **OK**. |

13. Select **Review + create**.

14. Select **Create**.

It can take a few minutes for the Bastion host to deploy. You can continue with the steps while the Bastion host is deploying.

## Create virtual machine

In this section, you'll create an Ubuntu virtual machine for the stand-alone Docker host. Ubuntu is used for the example in this article. The CNI plug-in supports Windows and other Linux distributions.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **+ Create** > **Azure virtual machine**.

3. Enter or select the following information in the **Basics** tab of **Create a virtual machine**:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |    |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select a region. |
    | Availability options | Select **No infrastructure required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 20.04 LTS -x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Run with Azure Spot discount | Leave the default of unchecked. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

4. Select **Next: Disks**, then **Next: Networking**.

5. Enter or select the following information in the **Networking** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet (10.1.0.0/24)**. |
    | Public IP | Select **None**. |

6. Select **Review + create**.

7. Select **Create**

## Add IP configuration

The Azure CNI plugin allocates IP addresses to containers based on a pool of IP addresses you create on the virtual network interface of the virtual machine. For every container on the host, an IP configuration must exist on the virtual network interface. If the number of containers on the server outnumber the IP configurations on the virtual network interface, the container will start but won't have an IP address. 

In this section, you'll add an IP configuration to the virtual network interface of the virtual machine you created previously.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. In **Settings**, select **Networking**.

4. Select the name of the network interface next to **Network Interface:**. The network interface is named **myvm** with a random number. In this example, it's **myvm27**.

5. In **Settings** of the network interface, select **IP configurations**.

6. in **IP configurations**, select **ipconfig1** in **Name**.

7. In the **ipconfig1** settings, change the assignment of the private IP address from **Dynamic** to **Static**.

8. Select **Save**.

9. Return to **IP configurations**.

10. Select **+ Add**.

11. Enter or select the following information for **Add IP configuration**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **ipconfig2**. |
    | **Private IP address settings** |  |
    | Allocation | Select **Static**. |
    | IP address | Enter **10.1.0.5**. |

12. Select **OK**.

13. Verify **ipconfig2** has been added as a secondary IP configuration.

Repeat steps 1 through 13 to add as many configurations as containers you wish to deploy on the container host.

## Install Docker

The Docker container engine must be installed and configured on the virtual machine you created previously.

Sign-in to the virtual machine you created previously with the Azure Bastion host you deployed with the virtual network.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. In the **Overview** of **myVM**, select **Connect** then **Bastion**.

4. Enter the username and password you created when you deployed the virtual machine in the previous steps.

5. Select **Connect**.

For install instructions for Docker on an Ubuntu container host, see [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

After Docker is installed on the virtual machine, follow the instructions for the Linux post install. For instructions on the Linux post install, see [Docker Engine post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/).

After Docker is installed on your virtual machine, continue with the steps in this article.

## Install CNI plugin and create a test container

The Azure CNI plugin is maintained as a GitHub project and is available for download from the project's GitHub page. For this article, you'll use **`git`** within the virtual machine to clone the repository for the plugin and then install and configure the plugin.

For more information about the Azure CNI plugin, see [Microsoft Azure Container Networking](https://github.com/Azure/azure-container-networking).

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. In the **Overview** of **myVM**, select **Connect** then **Bastion**.

4. Enter the username and password you created when you deployed the virtual machine in the previous steps.

5. Select **Connect**.

6. The application **jq** is required for the install script for the CNI plugin, use the following example to install the application:

    ```bash
    sudo apt-get update
    sudo apt-get install jq
    ```
7. Next, you'll clone the repository for the CNI plugin. Use the following example to clone the repository:

    ```bash
    git clone https://github.com/Azure/azure-container-networking.git
    ```

8. Configure permissions and install the CNI plugin. The install script command requires a version number for the CNI plugin. At the time of the writing of this article, the newest version is **`v1.4.39`**. To obtain the latest version number of the plugin or previous versions, see [Releases](https://github.com/Azure/azure-container-networking/releases).

    ```bash
    cd ./azure-container-networking/scripts
    chmod u+x install-cni-plugin.sh
    sudo ./install-cni-plugin.sh v1.4.39
    chmod u+x docker-run.sh
    ```

9. To start a container with the CNI plugin, you must use a special script that comes with the plugin to create and start the container. The following example will create an Alpine container with the CNI plugin script:

    ```bash
    sudo ./docker-run.sh vnetdocker1 default alpine
    ```

10. To verify that the container received the IP address you previously configured, connect to the container and view the IP:

    ```bash
    sudo docker exec -it vnetdocker1 /bin/sh
    ```

11. Use the **`ifconfig`** command in the following example to verify the IP address was assigned to the container:

    ```bash
    ifconfig
    ```
    :::image type="content" source="./media/deploy-container-networking-docker-linux/ifconfig-output.png" alt-text="Screenshot of ifconfig output in Bash prompt of test container.":::

## Clean up resources

If you're not going to continue to use this application, delete the virtual network and virtual machine with the following steps:

1. In the search box at the top of the portal, enter **Resource group**. Select **Resource groups** in the search results.

2. Select **myResourceGroup**.

3. In the **Overview** of **myResourceGroup**, select **Delete resource group**.

4. In **TYPE THE RESOURCE GROUP NAME:**, enter **myResourceGroup**.

5. Select **Delete**.

## Next steps

In this article, you learned how to install the Azure CNI plugin and create a test container.

For more information about Azure container networking and Azure Kubernetes service, see:

- [What is Azure Kubernetes Service?](../aks/intro-kubernetes.md)

- [Microsoft Azure Container Networking](https://github.com/Azure/azure-container-networking)

- [Azure CNI plugin releases](https://github.com/Azure/azure-container-networking/releases)

- [Deploy the Azure Virtual Network container network interface plug-in](deploy-container-networking.md)