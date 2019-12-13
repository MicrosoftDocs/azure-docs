---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 12/11/2019
ms.author: alkohli
---

Before you can deploy VMs on your Azure Stack Edge device, you must configure your client to connect to the device via Azure Resource Manager over Azure PowerShell. For detailed steps, go to [Connect to Azure Resource Manager on your Azure Stack Edge device](../articles/databox-online/azure-stack-edge-r-series-connect-resource-manager.md).

Make sure that the following steps can be used to access the device from your client (You have done this configuration when connecting to Azure Resource Manager, you are just verifying that the configuration was successful.): 

1. Verify that Azure Resource Manager communication is working. Type:     

    ```powershell
    Add-AzureRmEnvironment -Name <Environment Name> -ARMEndpoint "https://management.<appliance name>.<DNSDomain>:30005/
    ```

2. Call local device APIs to authenticate. Type: 

    `login-AzureRMAccount -EnvironmentName <Environment Name>`

    Provide the username - *EdgeARMuser* and the password to connect via Azure Resource Manager.

3. Enable a network interface for compute. This network interface IP is used to create a virtual switch for the VM deployment. Take the following steps: 

    1. Go to the **Compute settings**. Select the network interface that you will use to create a virtual switch.

    ![Select network interface](../articles/databox-online/media/azure-stack-edge-r-series-connect-resource-manager/compute-settings.png)

    2. Enable compute on the network interface. Azure Stack Edge will create and manage a virtual switch corresponding to that network interface.

    ![Enable compute settings on Port](../articles/databox-online/media/azure-stack-edge-r-series-connect-resource-manager/network-settings-port6-enable.png)

If you decide to use another network interface for compute, make sure that you:

- Delete all the VMs that you have deployed using Azure Resource Manager.

- Delete all virtual network interfaces and the virtual network associated with this network interface. 

- You can now enable another network interface for compute.

After the prerequisites are completely configured, proceed to deploy the VMs.