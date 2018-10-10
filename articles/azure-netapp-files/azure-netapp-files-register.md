---
title: Register for Azure NetApp Files | Microsoft Docs
description: Before using Azure NetApp Files, you must submit a request to enroll in the Azure NetApp Files service.  After the enrollment, you then register to use the service.
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
ms.topic: get-started-article
ms.date: 09/19/2018
ms.author: b-juche
---
# Register for Azure NetApp Files
Before using Azure NetApp Files, you must submit a request to enroll in the Azure NetApp Files service.  After the enrollment, you then register to use the service.

## Request to enroll in the service
Send a request as follows:

#### Steps 


## Register to use the service 

After you have been enrolled in the Azure NetApp Files service, you must perform a few registration steps.

### Register the NetApp Resource Provider 
You must register the Azure Resource Provider for Azure NetApp Files.

#### Steps 
1. From the Azure portal, click the Azure Cloud Shell icon on the upper right-hand corner:

      ![Azure Cloud Shell icon](../media/azure-netapp-files/azure-netapp-files-azure-cloud-shell.png)

2. If you have multiple subscriptions on your Azure account, select the one that has been whitelisted for Azure NetApp Files:   

   `az account set --subscription <subscriptionId>`

3. In the Azure Cloud Shell console, enter the following command to verify that your subscription has been whitelisted:  

   `az feature list | grep NetApp` 

   The command output appears as follows: 

   `
   "id": "/subscriptions/<SubID>/providers/Microsoft.Features/providers/Microsoft.NetApp/features/publicPreviewADC",<br/><br/>  
   "name": "Microsoft.NetApp/publicPreviewADC"
   `
  

   `<SubID>` is your subscription ID.

4. In the Azure Cloud Shell console, enter the following command to register the Azure Resource Provider: 

   `az provider register --namespace Microsoft.NetApp --wait`

   The `--wait` parameter instructs the console to wait for the registration to complete. The registration process can take some time to complete.

5. In the Azure Cloud Shell console, enter the following command to verify that the Azure Resource Provider has been registered:

   `az provider show --namespace Microsoft.NetApp`

   The command output appears as follows:
   
   ```
   {
   "id": "/subscriptions/<SubID>/providers/Microsoft.NetApp",
   "namespace": "Microsoft.NetApp",
   "registrationState": "Registered",
   "resourceTypes": [….
   ```

   The registrationState parameter value indicates Registered.   
   `<SubID>` is your subscription ID. 

6.	From the Azure portal, click the **Subscriptions** blade.
7.	In the Subscriptions blade, click your subscription ID. 
8.	In the settings of the subscription, click **Resource providers** to verify that Microsoft.NetApp Provider indicates the Registered status:


      ![Registered Microsoft.NetApp](../media/azure-netapp-files/azure-netapp-files-registered-resource-providers.png)

### Register the AllowBaremetalServers Feature from Network Resource Provider

You must also register the **AllowBaremetalServers** feature from the Network Resource Provider.

#### Steps

1.  In the Azure Cloud Shell console, enter the following command to register the AllowBaremetalServers feature:   

   `az feature register –-name AllowBaremetalServers --namespace Microsoft.Network --wait `

   The `--wait` parameter instructs the console to wait for the registration to complete. The registration process can take some time to complete.

2.	In the Azure Cloud Shell console, enter the following command to verify that the AllowedBaremetalServers feature has been registered:   

   `az feature show –-name AllowBaremetalServers --namespace Microsoft.Network`
   
   The command output appears as follows:

   ```
   {
   "id": "/subscriptions/<SubID>/providers/Microsoft.Features/providers/Microsoft.Network/features/AllowBaremetalServers",
   "name": "Microsoft.Network/AllowBaremetalServers",
   "properties":{
   "state": "Registered",
   …
   ```

   `<SubID>` is your subscription ID.  The `state` parameter value indicates `Registered`.


## Next steps  

1. [Create a NetApp account](azure-netapp-files-create-netapp-account.md)
1. [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
1. [Create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
1. [Configure export policy for a volume (optional)](azure-netapp-files-configure-export-policy.md)
