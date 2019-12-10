---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 12/07/2019
ms.author: alkohli
---

Before you can deploy VMs on your Azure Stack Edge device, you must configure your client to connect to the device via Azure Resource Manager over Azure PowerShell. For detailed steps, go to [Connect to Azure Resource Manager on your Azure Stack Edge device](../articles/databox-online/azure-stack-edge-r-series-connect-resource-manager.md).

Complete all the steps described in the procedure. Ensure that the following steps can be performed on your client that is accessing the device: 

1. Verify that Azure Resource Manager communication is working. Type:     

    ```powershell
    Add-AzureRmEnvironment -Name <Environment Name> -ARMEndpoint "https://management.<appliance name>.<DNSDomain>:30005/
    ```

2. Call local device APIs to authenticate. Type: 

    `login-AzureRMAccount -EnvironmentName <Environment Name>`

    Provide the username - *EdgeARMuser* and the password to connect via Azure Resource Manager. 

After the prerequisites are completely configured, proceed to deploy the VMs.