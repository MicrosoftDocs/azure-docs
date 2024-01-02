---
title: Deploy container networking for a stand-alone Windows Docker host
titleSuffix: Azure Virtual Network
description: Learn how to deploy the Azure CNI plug-in to enable container virtual network connectivity for a standalone Windows Docker host.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 08/28/2023
ms.custom: template-how-to
---

# Deploy container networking for a stand-alone Windows Docker host

The Azure CNI plugin enables per container/pod networking for stand-alone docker hosts and Kubernetes clusters. In this article, you learn how to install and configure the CNI plugin for a standalone Windows Docker host.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

It can take a few minutes for the network and Bastion host to deploy. Continue with the next steps when the deployment is complete or the virtual network creation is complete.

[!INCLUDE [create-test-virtual-machine.md](../../includes/create-test-virtual-machine.md)]

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

1. Verify **ipconfig2** has been added as a secondary IP configuration.

Repeat steps 1 through 13 to add as many configurations as containers you wish to deploy on the container host.

## Configure IP addresses in Windows

To assign multiple IP addresses to a Windows virtual machine, the IP addressees must be added to the network interface in Windows. In this section, you'll sign-in to the virtual machine and configure the IP configurations you created in the previous section.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. In the **Overview** of **vm-1**, select **Connect** then **Bastion**.

1. Enter the username and password you created when you deployed the virtual machine in the previous steps.

1. Select **Connect**.

1. Open the network connections configuration on the virtual machine. Select **Start** -> **Run** and enter **`ncpa.cpl`**. 

1. Select **OK**.

1. Select the network interface of the virtual machine, then **Properties**:

    :::image type="content" source="./media/deploy-container-networking-docker-windows/select-network-interface.png" alt-text="Screenshot of select network interface in Windows OS.":::

1. In **Ethernet Properties**, select **Internet Protocol Version 4 (TCP/IPv4)**, then **Properties**.

1. Enter or select the following information in the **General** tab:

    | Setting | Value |
    | ------- | ----- |
    | Select **Use the following IP address:** |   |
    | IP address: | Enter **10.0.0.4** |
    | Subnet mask: | Enter **255.255.255.0** |
    | Default gateway | Enter **10.0.0.1** |
    | Select **Use the following DNS server addresses:** |   |
    | Preferred DNS server: | Enter **168.63.129.16** *This IP is the DHCP assigned IP address for the default Azure DNS* |

1. Select **Advanced...**.

1. in **IP addresses**, select **Add...**.

1. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **TCP/IP Address** |   |
    | IP address: | Enter **10.0.0.5** |
    | Subnet mask: | Enter **255.255.255.0** |

1. Select **Add**.

1. To add more IP addresses that correspond with any extra IP configurations created previously, select **Add**. 

1. Select **OK**.

1. Select **OK**.

1. Select **OK**.

The Bastion connection drops for a few seconds as the network configuration is applied. Wait a few seconds then attempt to reconnect. Continue when a reconnection is successful.

## Install Docker

The Docker container engine must be installed and configured on the virtual machine you created previously.

Sign-in to the virtual machine you created previously with the Azure Bastion host you deployed with the virtual network.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. In the **Overview** of **vm-1**, select **Connect** then **Bastion**.

1. Enter the username and password you created when you deployed the virtual machine in the previous steps.

1. Select **Connect**.

1. Open **Windows PowerShell** on **vm-1**.

1. The following example installs **Docker CE/Moby**:

    ```powershell
    Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/microsoft/Windows-Containers/Main/helpful_tools/Install-DockerCE/install-docker-ce.ps1" -o install-docker-ce.ps1

    .\install-docker-ce.ps1
    ```

The virtual machine reboots to install the container support in Windows. Reconnect to the virtual machine and the Docker install continues.

For more information about Windows containers, see, [Get started: Prep Windows for containers](/virtualization/windowscontainers/quick-start/set-up-environment?tabs=dockerce#windows-server-1).

After Docker is installed on your virtual machine, continue with the steps in this article.

## Install CNI plugin and jq

The Azure CNI plugin is maintained as a GitHub project and is available for download from the project's GitHub page. For this article, you download the CNI plugin repository within the virtual machine and then install and configure the plugin.

For more information about the Azure CNI plugin, see [Microsoft Azure Container Networking](https://github.com/Azure/azure-container-networking).

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. In the **Overview** of **vm-1**, select **Connect** then **Bastion**.

1. Enter the username and password you created when you deployed the virtual machine in the previous steps.

1. Select **Connect**.

1. Use the following example to download and extract the CNI plugin to a temporary folder in the virtual machine:

    ```powershell
    Invoke-WebRequest -Uri https://github.com/Azure/azure-container-networking/archive/refs/heads/master.zip -OutFile azure-container-networking.zip
    
    Expand-Archive azure-container-networking.zip -DestinationPath azure-container-networking
    ```

1. To install the CNI plugin, change to the scripts directory of the CNI plugin folder you downloaded in the previous step.  The install script command requires a version number for the CNI plugin. At the time of the writing of this article, the newest version is **`v1.4.39`**. To obtain the latest version number of the plugin or previous versions, see [Releases](https://github.com/Azure/azure-container-networking/releases).

    ```powershell
    cd .\azure-container-networking\azure-container-networking-master\scripts\

    .\Install-CniPlugin.ps1 v1.4.39
    ```

1. The CNI plugin comes with a built-in network configuration file for the plugin. Use the following example to copy the file to the network configuration directory:

    ```powershell
    Copy-Item -Path "c:\k\azurecni\bin\10-azure.conflist" -Destination "c:\k\azurecni\netconf"
    ```

### Install jq

The script that creates the containers with the Azure CNI plugin requires the application jq. For more information and download location, see [Download jq](https://stedolan.github.io/jq/download/).

1. Open a web browser in the virtual machine and download the **jq** application.

1. The download is a self-contained executable for the application. Copy the executable **`jq-win64.exe`** to the **`C:\Windows`** directory.

## Create test container

1. To start a container with the CNI plugin, you must use a special script that comes with the plugin to create and start the container. The following example creates a Windows Server container with the CNI plugin script:

    ```powershell
    cd .\azure-container-networking\azure-container-networking-master\scripts\
    .\docker-exec.ps1 vnetdocker1 default mcr.microsoft.com/windows/servercore/iis add
    ```

    It can take a few minutes for the image for the container to download for the first time. When the container starts and initializes the network, the Bastion connection disconnects. Wait a few seconds and the connection reestablish.

1. To verify that the container received the IP address you previously configured, connect to the container and view the IP:

    ```powershell
    docker exec -it vnetdocker1 powershell
    ```

1. Use the **`ipconfig`** command in the following example to verify the IP address was assigned to the container:

    ```powershell
    ipconfig
    ```
    :::image type="content" source="./media/deploy-container-networking-docker-windows/ipconfig-output.png" alt-text="Screenshot of ipconfig output in PowerShell prompt of test container.":::

1. Exit the container and close the Bastion connection to **vm-1**.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this article, you learned how to install the Azure CNI plugin and create a test container.

For more information about Azure container networking and Azure Kubernetes service, see:

- [What is Azure Kubernetes Service?](../aks/intro-kubernetes.md)

- [Microsoft Azure Container Networking](https://github.com/Azure/azure-container-networking)

- [Azure CNI plugin releases](https://github.com/Azure/azure-container-networking/releases)

- [Deploy the Azure Virtual Network container network interface plug-in](deploy-container-networking.md)