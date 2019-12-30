---
title: Configure VPN on your Azure Stack Edge device
description: Describes how to configure VPN on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 12/29/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to configure VPN on n my Azure Stack Edge device so that I can have a second layer of encryption for my data-in-flight.
---

# Configure VPN on your Azure Stack Edge device

Azure Resource Manager provides a management layer that enables you to create, update, and delete resources in your Azure subscription. The Azure Stack Edge device supports the same Azure Resource Manager APIs to create, update, and delete VMs in a local subscription. This support lets you manage the device in a manner consistent with the cloud. 

This article describes the steps required to configure VPN on your Azure Stack Edge device including the configuration in the cloud and the configuration on the device.

## About VPN

The following table summarizes the various endpoints exposed on your device, the supported protocols, and the ports to access those endpoints. Throughout the article, you will find references to these endpoints.

| # | Endpoint | Supported protocols | Port used | Used for |
| --- | --- | --- | --- | --- |
| 1. | Azure Resource Manager | https | 443 | To connect to Azure Resource Manager for automation |
| 2. | Security token service | https | 443 | To authenticate via access and refresh tokens |
| 3. | Blob | https | 443 | To connect to Blob storage via REST |


## Need for VPN

The process of connecting to local APIs of the device using Azure Resource Manager requires the following steps:

| Step # | You'll do this step ... | .. on this location. |
| --- | --- | --- |
| 1. | [Configure your Azure Stack Edge device](#step-1-configure-azure-stack-edge-device) | Local web UI |
| 2. | [Create and install certificates](#step-2-create-and-install-certificates) | Windows client/local web UI |
| 3. | [Review and configure the prerequisites](#step-3-install-powershell-on-the-client) | Windows client |
| 4. | [Set up Azure PowerShell on the client](#step-4-set-up-azure-powershell-on-the-client) | Windows client |
| 5. | [Modify host file for endpoint name resolution](#step-5-modify-host-file-for-endpoint-name-resolution) | Windows client or DNS server |
| 6. | [Check that the endpoint name is resolved](#step-6-verify-endpoint-name-resolution-on-the-client) | Windows client |
| 7. | [Use Azure PowerShell cmdlets to verify connection to Azure Resource Manager](#step-7-set-azure-resource-manager-environment) | Windows client |

The following sections detail each of the above steps in connecting to Azure Resource Manager.

## VPN configuration in the cloud  

Take the following steps in the local web UI of your Azure Stack Edge device.

1. Complete the network settings, web proxy settings (optional), and time settings (optional). In this example, **Port 6** network interface settings are configured.

    ![Azure Stack Edge network settings page](media/azure-stack-edge-r-series-connect-resource-manager/network-settings.png)

    Select the network interface name, in this case **Port 6** to view the network settings for this interface.

    ![Azure Stack Edge network settings page](media/azure-stack-edge-r-series-connect-resource-manager/network-settings-port6.png)

    In this example, the network interface is set to **DHCP**.

    When defining device name and DNS domain via the local UI, you will select:

    a. The Azure consistent network from the list of available cluster networks.

    b. The Azure consistent services VIP from the Azure consistent network that you chose.

    - If the interfaces associated with the Azure consistent services network used is set to DHCP, the Azure consistent VIP will be automatically set for you once you set and apply the DNS domain and the Azure consistent services network.

    - If you used a static IP address for the network interface associated with the Azure consistent services network, then you will have an option to choose the Azure consistent services VIP. For reference, see the screenshot below.

    In this following example, the Azure consistent services VIP was automatically populated and is -- 5.5.34.37.

    ![Data Box Edge device](media/azure-stack-edge-r-series-connect-resource-manager/device.png)

    c. Copy and save the Azure consistent services VIP. You will use this information later.

    > [!IMPORTANT]
    > The device name, DNS domain will be used to form the endpoints that are exposed.


## VPN configuration on the device

Certificates ensure that your communication is trusted. On your Azure Stack Edge device, self-signed appliance, blob, and Azure Resource Manager certificates are automatically generated. Optionally, you can bring in your own signed blob and Azure Resource Manager certificates as well.

When you bring in a signed certificate of your own, you also need the corresponding signing chain of the certificate. For the signing chain, Azure Resource Manager, and the blob certificates on the device, you will need the corresponding certificates on the client machine also to authenticate and communicate with the device.

To connect to Azure Resource Manager, you will need to create or get signing chain and endpoint certificates, import these certificates on your Windows client, and finally upload these certificates on the device.


## Next steps

[Deploy your Azure Stack Edge device](azure-stack-edge-r-series-deploy-prep.md).