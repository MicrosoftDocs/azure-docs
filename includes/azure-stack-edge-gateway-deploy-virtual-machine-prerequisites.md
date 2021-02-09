---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 01/15/2021
ms.author: alkohli
---

Before you can deploy VMs on your Azure Stack Edge device, you must configure your client to connect to the device via Azure Resource Manager over Azure PowerShell. For detailed steps, go to [Connect to Azure Resource Manager on your Azure Stack Edge device](../articles/databox-online/azure-stack-edge-j-series-connect-resource-manager.md).

Make sure that the following steps can be used to access the device from your client. (You have done this configuration when connecting to Azure Resource Manager. You're now just verifying that the configuration was successful.) 

1. Verify that Azure Resource Manager communication is working. Enter:     

    ```powershell
    Add-AzureRmEnvironment -Name <Environment Name> -ARMEndpoint "https://management.<appliance name>.<DNSDomain>"
    ```

1. Call local device APIs to authenticate. Enter: 

    `login-AzureRMAccount -EnvironmentName <Environment Name>`

    Provide the username - *EdgeARMuser* and the password to connect via Azure Resource Manager.

1. If you configured **Compute** for Kubernetes, you can skip this step. Proceed to ensure that you've enabled a network interface for compute. In your local user interface, go to **Compute** settings. Select the network interface that you want to use to create a virtual switch. The VMs you create will be attached to a virtual switch attached to this port and the associated network. Be sure to choose a network that matches the IP address you will use for the VM.  

    ![Screenshot that shows how to enable compute settings.](../articles/databox-online/media/azure-stack-edge-gpu-deploy-virtual-machine-templates/enable-compute-setting.png)

    Enable compute on the network interface. Azure Stack Edge will create and manage a virtual switch corresponding to that network interface. Don't enter specific IPs for Kubernetes at this time. It can take several minutes to enable compute.

    > [!NOTE]
    > If you're creating GPU VMs, select a network interface connected to the internet. This allows you to install a GPU extension on your device.


