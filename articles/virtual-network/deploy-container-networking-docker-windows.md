---
title: Deploy container networking for a stand-alone Windows Docker host
titleSuffix: Azure Virtual Network
description: Learn how to deploy the Azure CNI plug-in to enable container virtual network connectivity for a standalone Windows Docker host.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 12/26/2022
ms.custom: template-how-to
---

# Deploy container networking for a stand-alone Windows Docker host

The Azure CNI plugin enables per container/pod networking for stand-alone docker hosts and Kubernetes clusters. In this article, you'll learn how to install and configure the CNI plugin for a standalone Windows Docker host.

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

It can take a few minutes for the network and Bastion host to deploy. Continue with the next steps when the deployment is complete or the virtual network creation is complete.

## Create virtual machine

In this section, you'll create a Windows Server 2022 virtual machine for the stand-alone Docker host. The CNI plug-in supports Windows and Linux.

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
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
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

4. Select the name of the network interface next to **Network Interface:**. The network interface is named **myvm** with a random number. In this example, it's **myvm418**.

    :::image type="content" source="./media/deploy-container-networking-docker-windows/select-nic-portal.png" alt-text="Screenshot of the network interface in settings for the virtual machine in the Azure portal.":::

5. In **Settings** of the network interface, select **IP configurations**.

6. in **IP configurations**, select **ipconfig1** in **Name**.

    :::image type="content" source="./media/deploy-container-networking-docker-windows/nic-ip-configuration.png" alt-text="Screenshot of IP configuration of the virtual machine network interface.":::

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

    :::image type="content" source="./media/deploy-container-networking-docker-windows/verify-ip-configuration.png" alt-text="Screenshot of IP configuration of the virtual machine network interface with the secondary configuration.":::

Repeat steps 1 through 13 to add as many configurations as containers you wish to deploy on the container host.

## Configure IP addresses in Windows

To assign multiple IP addresses to a Windows virtual machine, the IP addressees must be added to the network interface in Windows. In this section, you'll sign-in to the virtual machine and configure the IP configurations you created in the previous section.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. In the **Overview** of **myVM**, select **Connect** then **Bastion**.

4. Enter the username and password you created when you deployed the virtual machine in the previous steps.

5. Select **Connect**.

6. Open the network connections configuration on the virtual machine. Select **Start** -> **Run** and enter **`ncpa.cpl`**. 

7. Select **OK**.

8. Select the network interface of the virtual machine, then **Properties**:

    :::image type="content" source="./media/deploy-container-networking-docker-windows/select-network-interface.png" alt-text="Screenshot of select network interface in Windows OS.":::

9. In **Ethernet Properties**, select **Internet Protocol Version 4 (TCP/IPv4)**, then **Properties**.

10. Enter or select the following information in the **General** tab:

    | Setting | Value |
    | ------- | ----- |
    | Select **Use the following IP address:** |   |
    | IP address: | Enter **10.1.0.4** |
    | Subnet mask: | Enter **255.255.255.0** |
    | Default gateway | Enter **10.1.0.1** |
    | Select **Use the following DNS server addresses:** |   |
    | Preferred DNS server: | Enter **168.63.129.16** *This IP is the DHCP assigned IP address for the default Azure DNS* |

    :::image type="content" source="./media/deploy-container-networking-docker-windows/ip-address-configuration.png" alt-text="Screenshot of the primary IP configuration in Windows.":::

11. Select **Advanced...**.

12. in **IP addresses**, select **Add...**.

    :::image type="content" source="./media/deploy-container-networking-docker-windows/advanced-ip-configuration.png" alt-text="Screenshot of the advanced IP configuration in Windows.":::

13. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **TCP/IP Address** |   |
    | IP address: | Enter **10.1.0.5** |
    | Subnet mask: | Enter **255.255.255.0** |

    :::image type="content" source="./media/deploy-container-networking-docker-windows/secondary-ip-address.png" alt-text="Screenshot of the secondary IP configuration addition.":::

14. Select **Add**.

15. To add more IP addresses that correspond with any extra IP configurations created previously, select **Add**. 

16. Select **OK**.

17. Select **OK**.

18. Select **OK**.

The Bastion connection will drop for a few seconds as the network configuration is applied. Wait a few seconds then attempt to reconnect. Continue when a reconnection is successful.

## Install Docker

The Docker container engine must be installed and configured on the virtual machine you created previously.

Sign-in to the virtual machine you created previously with the Azure Bastion host you deployed with the virtual network.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. In the **Overview** of **myVM**, select **Connect** then **Bastion**.

4. Enter the username and password you created when you deployed the virtual machine in the previous steps.

5. Select **Connect**.

6. Open **Windows PowerShell** on **myVM**.

7. The following example installs **Docker CE/Moby**:

    ```powershell
    Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/microsoft/Windows-Containers/Main/helpful_tools/Install-DockerCE/install-docker-ce.ps1" -o install-docker-ce.ps1

    .\install-docker-ce.ps1
    ```

The virtual machine will reboot to install the container support in Windows. Reconnect to the virtual machine and the Docker install will continue.

For more information about Windows containers, see, [Get started: Prep Windows for containers](/virtualization/windowscontainers/quick-start/set-up-environment?tabs=dockerce#windows-server-1).

After Docker is installed on your virtual machine, continue with the steps in this article.

## Install CNI plugin and jq

The Azure CNI plugin is maintained as a GitHub project and is available for download from the project's GitHub page. For this article, you'll download the CNI plugin repository within the virtual machine and then install and configure the plugin.

For more information about the Azure CNI plugin, see [Microsoft Azure Container Networking](https://github.com/Azure/azure-container-networking).

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM**.

3. In the **Overview** of **myVM**, select **Connect** then **Bastion**.

4. Enter the username and password you created when you deployed the virtual machine in the previous steps.

5. Select **Connect**.

6. Use the following example to download and extract the CNI plugin to a temporary folder in the virtual machine:

    ```powershell
    Invoke-WebRequest -Uri https://github.com/Azure/azure-container-networking/archive/refs/heads/master.zip -OutFile azure-container-networking.zip
    
    Expand-Archive azure-container-networking.zip -DestinationPath azure-container-networking
    ```

7. To install the CNI plugin, change to the scripts directory of the CNI plugin folder you downloaded in the previous step.  The install script command requires a version number for the CNI plugin. At the time of the writing of this article, the newest version is **`v1.4.39`**. To obtain the latest version number of the plugin or previous versions, see [Releases](https://github.com/Azure/azure-container-networking/releases).

    ```powershell
    cd .\azure-container-networking\azure-container-networking-master\scripts\

    .\Install-CniPlugin.ps1 v1.4.39
    ```

8. The CNI plugin comes with a built-in network configuration file for the plugin. Use the following example to copy the file to the network configuration directory:

    ```powershell
    Copy-Item -Path "c:\k\azurecni\bin\10-azure.conflist" -Destination "c:\k\azurecni\netconf"
    ```

### Install jq

The script that creates the containers with the Azure CNI plugin requires the application jq. For more information and download location, see [Download jq](https://stedolan.github.io/jq/download/).

1. Open a web browser in the virtual machine and download the **jq** application.

2. The download is a self-contained executable for the application. Copy the executable **`jq-win64.exe`** to the **`C:\Windows`** directory.

## Create test container

1. To start a container with the CNI plugin, you must use a special script that comes with the plugin to create and start the container. The following example will create a Windows Server container with the CNI plugin script:

    ```powershell
    cd .\azure-container-networking\azure-container-networking-master\scripts\
    .\docker-exec.ps1 vnetdocker1 default mcr.microsoft.com/windows/servercore/iis add
    ```

    It can take a few minutes for the image for the container to download for the first time. When the container starts and initializes the network, the Bastion connection will disconnect. Wait a few seconds and the connection will reestablish.

2. To verify that the container received the IP address you previously configured, connect to the container and view the IP:

    ```powershell
    docker exec -it vnetdocker1 powershell
    ```

3. Use the **`ipconfig`** command in the following example to verify the IP address was assigned to the container:

    ```powershell
    ipconfig
    ```
    :::image type="content" source="./media/deploy-container-networking-docker-windows/ipconfig-output.png" alt-text="Screenshot of ipconfig output in PowerShell prompt of test container.":::

4. Exit the container and close the Bastion connection to **myVM**.

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