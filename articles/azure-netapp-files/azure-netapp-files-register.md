---
title: Register for NetApp Resource Provider to use with Azure NetApp Files | Microsoft Docs
description: Learn how to register the NetApp Resource Provider for Azure NetApp Files.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 10/15/2024
ms.author: anfdocs
---
# Register for NetApp Resource Provider

To use Azure NetApp Files, you need to register the NetApp Resource Provider.

1. From the Azure portal, select the Azure Cloud Shell icon on the upper right-hand corner:

      ![Azure Cloud Shell icon](./media/azure-netapp-files-register/azure-netapp-files-azure-cloud-shell.png)

2. If you have multiple subscriptions on your Azure account, select the one that you want to configure for Azure NetApp Files:
    
    ```azurecli
    az account set --subscription <subscriptionId>
    ```

3. In the Azure Cloud Shell console, enter the following command to register the Azure Resource Provider: 
    
    ```azurecli
    az provider register --namespace Microsoft.NetApp --wait
    ```

   The `--wait` parameter instructs the console to wait for the registration to complete. The registration process can take some time to complete.

4. Verify that the Azure Resource Provider has been registered. To verify, enter the following command in the Azure Cloud Shell console:
    
    ```azurecli
    az provider show --namespace Microsoft.NetApp
    ```

   The command output appears as follows:
   
    ```output
    {
     "id": "/subscriptions/<SubID>/providers/Microsoft.NetApp",
     "namespace": "Microsoft.NetApp", 
     "registrationState": "Registered", 
     "resourceTypes": […. 
    ```

   `<SubID>` is your subscription ID. The `state` parameter value indicates `Registered`.

5. From the Azure portal, select **Subscriptions**.
6. From Subscriptions, select your subscription ID. 
7. In the settings of the subscription, select **Resource providers** to verify that Microsoft.NetApp Provider indicates the Registered status: 

      ![Registered Microsoft.NetApp](./media/azure-netapp-files-register/azure-netapp-files-registered-resource-providers.png)


## Next steps

* [Create a NetApp account](azure-netapp-files-create-netapp-account.md)
* [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request)
