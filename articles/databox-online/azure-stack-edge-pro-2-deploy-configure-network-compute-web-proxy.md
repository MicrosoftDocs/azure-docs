---
title: Tutorial to configure network settings for Azure Stack Edge Pro 2 device 
description: Tutorial to deploy Azure Stack Edge Pro 2 instructs you to configure network, compute network, and web proxy settings for your physical device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 02/10/2022
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to connect and activate Azure Stack Edge Pro so I can use it to transfer data to Azure. 
---
# Tutorial: Configure network for Azure Stack Edge Pro 2

This tutorial describes how to configure network for your Azure Stack Edge Pro 2 device by using the local web UI.

The connection process can take around 20 minutes to complete.

In this tutorial, you learn about:

> [!div class="checklist"]
>
> * Prerequisites
> * Configure network
> * Enable advanced networking
> * Configure web proxy


## Prerequisites

Before you configure and set up your Azure Stack Edge Pro device with GPU, make sure that:

* You've installed the physical device as detailed in [Install Azure Stack Edge Pro](azure-stack-edge-pro-2-deploy-install.md).
* You've connected to the local web UI of the device as detailed in [Connect to Azure Stack Edge Pro](azure-stack-edge-pro-2-deploy-connect.md)


## Configure network

Your **Get started** page displays the various settings that are required to configure and register the physical device with the Azure Stack Edge service. 

Follow these steps to configure the network for your device.

1. In the local web UI of your device, go to the **Get started** page. 

2. On the **Network** tile, select **Configure**.  
    
    ![Screenshot of the Get started page in the local web UI of an Azure Stack Edge device. The Needs setup is highlighted on the Network tile.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/network-1.png)

    On your physical device, there are four network interfaces. Port 1 and Port 2 are 1-Gbps network interfaces that can also serve as 10-Gbps network interfaces. Port 3 and Port 4 are 100-Gbps network interfaces. Port 1 is automatically configured as a management-only port, and Port 2 to Port 4 are all data ports. For a new device, the **Network** page is as shown below.
    
    ![Screenshot of the Network page in the local web UI of an Azure Stack Edge device whose network isn't configured.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/network-2.png)

3. To change the network settings, select a port and in the right pane that appears, modify the IP address, subnet, gateway, primary DNS, and secondary DNS. 

    - If you select Port 1, you can see that it's preconfigured as static. 

        ![Screenshot of the Port 1 Network settings in the local web UI of an Azure Stack Edge device.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/network-3.png)

    - If you select Port 2, Port 3, or Port 4, all of these ports are configured as DHCP by default.

        ![Screenshot of the Port 3 Network settings in the local web UI of an Azure Stack Edge device.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/network-4.png)

    As you configure the network settings, keep in mind:

    * <!--ENGG TO VERIFY --> Make sure that Port 3 and Port 4 are connected for Network Function Manager deployments. For more information, see [Tutorial: Deploy network functions on Azure Stack Edge](../network-function-manager/deploy-functions.md).
    * If DHCP is enabled in your environment, network interfaces are automatically configured. An IP address, subnet, gateway, and DNS are automatically assigned.
    * If DHCP isn't enabled, you can assign static IPs if needed.
    * You can configure your network interface as IPv4.
    * <!--ENGG TO VERIFY --> Network Interface Card (NIC) Teaming or link aggregation isn’t supported with Azure Stack Edge. 
    * <!--ENGG TO VERIFY --> In this release, the 100-GbE interfaces aren't configured for RDMA mode.
    * Serial number for any port corresponds to the node serial number.

    Once the device network is configured, the page updates as shown below.

    ![Screenshot of the Network page in the local web UI of an Azure Stack Edge device whose network is configured.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/network-5.png)


     > [!NOTE]
     > We recommend that you do not switch the local IP address of the network interface from static to DCHP, unless you have another IP address to connect to the device. If using one network interface and you switch to DHCP, there would be no way to determine the DHCP address. If you want to change to a DHCP address, wait until after the device has activated with the service, and then change. You can then view the IPs of all the adapters in the **Device properties** in the Azure portal for your service.


    After you’ve configured and applied the network settings, select **Next: Advanced networking** to configure compute network.

## Configure advanced networking

Follow these steps to configure advanced network settings such as creating a switch for compute and associating it with a virtual network. 

> [!NOTE]
> <!--ENGG TO VERIFY --> You can enable compute only on one virtual switch on your device. You can however move the virtual switch on which you enabled compute.

1. In the local web UI of your device, go to the **Advanced networking** page. Select **Add virtual switch** to create a new virtual switch or use an existing virtual switch. This virtual switch will be used for the compute infrastructure on the device. 


    ![Screenshot of the Advanced networking page in the local web UI of an Azure Stack Edge device. The Add virtual switch button is highlighted.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/advanced-networking-1.png)

1. In **Add virtual switch** blade:

    1. Provide a name for your virtual switch.
    1. Associate a network interface on your device with the virtual switch you'll create. You can only have one virtual switch associated with a network interface on your device.
    1. Assign an intent for your virtual switch. To deploy compute workloads, you'll select compute as the intent.    
    1. Assign **Kubernetes node IPs**. These static IP addresses are for the compute VM that will be created on this virtual switch.  

        For an *n*-node device, a contiguous range of a minimum of *n+1* IPv4 addresses (or more) are provided for the compute VM using the start and end IP addresses. For a 1-node device, provide a minimum of 2 contiguous IPv4 addresses.
    
        > [!IMPORTANT]
        > Kubernetes on Azure Stack Edge uses 172.27.0.0/16 subnet for pod and 172.28.0.0/16 subnet for service. Make sure that these are not in use in your network. If these subnets are already in use in your network, you can change these subnets by running the `Set-HcsKubeClusterNetworkInfo` cmdlet from the PowerShell interface of the device. For more information, see [Change Kubernetes pod and service subnets](azure-stack-edge-gpu-connect-powershell-interface.md#change-kubernetes-pod-and-service-subnets).

    1. Assign **Kubernetes external service IPs**. These are also the load-balancing IP addresses. These contiguous IP addresses are for services that you want to expose outside of the Kubernetes cluster and you specify the static IP range depending on the number of services exposed. 
    
        > [!IMPORTANT]
        > We strongly recommend that you specify a minimum of 1 IP address for Azure Stack Edge Hub service to access compute modules. You can then optionally specify additional IP addresses for other services/IoT Edge modules (1 per service/module) that need to be accessed from outside the cluster. The service IP addresses can be updated later. 
    
    1. Select **Apply**.

    ![Screenshot of the Add virtual switch blade in the local web UI of an Azure Stack Edge device. The Apply button is highlighted.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/advanced-networking-2.png)

1. You'll see a warning to the effect that you may need to wait for a couple minutes and then refresh the browser. Select **OK**.

    ![Screenshot of the Refresh warning in the local web UI of an Azure Stack Edge device. The OK button is highlighted.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/advanced-networking-3.png)


1. After the configuration is applied and you've refreshed the browser, you can see that the specified port is enabled for compute. 
 
    ![Screenshot of the Advanced networking page in the local web UI of an Azure Stack Edge device. The newly added virtual switch is highlighted.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/advanced-networking-4.png)


1. Optionally you can create a virtual network and associate it with your virtual switches. Select **Add virtual network** and then input the following information.

    1. Select a **Virtual switch** to which you'll add a virtual network.
    1. Provide a **Name** for the virtual network.
    1. Supply a unique number from 1-4096 as your **VLAN ID**.
    1. Enter a **Subnet mask** and a **Gateway** depending on the configuration of your physical network in the environment.
    1. Select **Apply**.

    ![Screenshot of the Add virtual network blade in the local web UI of an Azure Stack Edge device. The Apply button is highlighted.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/advanced-networking-5.png)
    
1. After the configuration is applied, you can see that the specified virtual network is created.

    ![Screenshot of the Advanced networking page in the local web UI of an Azure Stack Edge device. The newly added virtual network is highlighted.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/advanced-networking-6.png)

    Select **Next: Web proxy** to configure web proxy.  

  
## Configure web proxy

This is an optional configuration. However, if you use a web proxy, you can configure it only on this page.

> [!IMPORTANT]
> * <!--ENGG TO VERIFY --> Proxy-auto config (PAC) files are not supported. A PAC file defines how web browsers and other user agents can automatically choose the appropriate proxy server (access method) for fetching a given URL. 
> * <!--ENGG TO VERIFY --> Transparent proxies work well with Azure Stack Edge Pro 2. For non-transparent proxies that intercept and read all the traffic (via their own certificates installed on the proxy server), upload the public key of the proxy's certificate as the signing chain on your Azure Stack Edge Pro device. You can then configure the proxy server settings on your Azure Stack Edge device. For more information, see [Bring your own certificates and upload through the local UI](azure-stack-edge-gpu-deploy-configure-certificates.md#bring-your-own-certificates).  

1. On the **Web proxy settings** page, take the following steps:

   1. In the **Web proxy URL** box, enter the URL in this format: `http://host-IP address or FQDN:Port number`. HTTPS URLs aren’t supported.

   2. To validate and apply the configured web proxy settings, select **Apply**.

   ![Screenshot of the Web proxy page in the local web UI of an Azure Stack Edge device. The Apply button is highlighted.](./media/azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy/web-proxy-1.png)

2. After the settings are applied, select **Next: Device**.


## Next steps

In this tutorial, you learned about:

> [!div class="checklist"]
> * Prerequisites
> * Configure network
> * Configure advanced networking
> * Configure web proxy


To learn how to set up your Azure Stack Edge Pro 2 device, see:

> [!div class="nextstepaction"]
> [Configure device settings](./azure-stack-edge-pro-2-deploy-set-up-device-update-time.md)
