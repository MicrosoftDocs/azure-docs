---
title: Register for NetApp Resource Provider to use with Azure NetApp Files | Microsoft Docs
description: Learn how to register the NetApp Resource Provider for Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 10/04/2021
ms.author: b-juche
---
# Register for NetApp Resource Provider

To use the Azure NetApp Files service, you need to register the NetApp Resource Provider.

1. From the Azure portal, click the Azure Cloud Shell icon on the upper right-hand corner:

      ![Azure Cloud Shell icon](../media/azure-netapp-files/azure-netapp-files-azure-cloud-shell.png)

2. If you have multiple subscriptions on your Azure account, select the one that has been approved for Azure NetApp Files:
    
    ```azurecli
    az account set --subscription <subscriptionId>
    ```

3. In the Azure Cloud Shell console, enter the following command to verify that your subscription has been approved:
    
    ```azurecli
    az feature list | grep NetApp
    ```

   The command output appears as follows:
   
    ```output
    "id": "/subscriptions/<SubID>/providers/Microsoft.Features/providers/Microsoft.NetApp/features/ANFGA",  
    "name": "Microsoft.NetApp/ANFGA" 
    ```
       
   `<SubID>` is your subscription ID.



4. In the Azure Cloud Shell console, enter the following command to register the Azure Resource Provider: 
    
    ```azurecli
    az provider register --namespace Microsoft.NetApp --wait
    ```

   The `--wait` parameter instructs the console to wait for the registration to complete. The registration process can take some time to complete.

5. In the Azure Cloud Shell console, enter the following command to verify that the Azure Resource Provider has been registered: 
    
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

   `<SubID>` is your subscription ID.  The `state` parameter value indicates `Registered`.

6. From the Azure portal, click the **Subscriptions** blade.
7. In the Subscriptions blade, click your subscription ID. 
8. In the settings of the subscription, click **Resource providers** to verify that Microsoft.NetApp Provider indicates the Registered status: 

      ![Registered Microsoft.NetApp](../media/azure-netapp-files/azure-netapp-files-registered-resource-providers.png)


## Next steps

* [Create a NetApp account](azure-netapp-files-create-netapp-account.md)
* [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
