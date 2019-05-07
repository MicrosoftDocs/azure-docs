---
title: Register for Azure NetApp Files | Microsoft Docs
description: Describes how to submit a request to enroll in the Azure NetApp Files service. 
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
ms.topic: conceptual
ms.date: 05/06/2018
ms.author: b-juche
---
# Register for Azure NetApp Files

> [!IMPORTANT] 
> Before registering the Azure NetApp Files resource provider, you must have received an email from the Azure NetApp Files team confirming that you have been granted access to the service. You will be able to successfully register the NetApp Resource Provider even without being granted access for service. However, without access authorization, any Azure portal or API request to create a NetApp account or any other Azure NetApp Files resource will be rejected. You can get on the waitlist through the [Azure NetApp Files waitlist submission page](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR8cq17Xv9yVBtRCSlcD_gdVUNUpUWEpLNERIM1NOVzA5MzczQ0dQR1ZTSS4u). Waitlist signup does not guarantee immediate service access. You must wait for an official confirmation email from the Azure NetApp Files team before creating any NetApp accounts. 

## Request to enroll in the service
You need to be part of the Public Preview program and whitelisted for accessing the Microsoft.NetApp Resource Provider. For details about joining the Public Preview program, see the [Azure NetApp Files Public Preview signup page](https://aka.ms/nfspublicpreview). 


## Register the NetApp Resource Provider

To use the service, you must register the Azure Resource Provider for Azure NetApp Files. 

1. From the Azure portal, click the Azure Cloud Shell icon on the upper right-hand corner:

      ![Azure Cloud Shell icon](../media/azure-netapp-files/azure-netapp-files-azure-cloud-shell.png)

2. If you have multiple subscriptions on your Azure account, select the one that has been whitelisted for Azure NetApp Files:
    
        az account set --subscription <subscriptionId>

3. In the Azure Cloud Shell console, enter the following command to verify that your subscription has been whitelisted:
    
        az feature list | grep NetApp

   The command output appears as follows:
   
       "id": "/subscriptions/<SubID>/providers/Microsoft.Features/providers/Microsoft.NetApp/features/publicPreviewADC",  
       "name": "Microsoft.NetApp/publicPreviewADC" 
       
   `<SubID>` is your subscription ID.

    If you do not see the feature name, you do not have access to the service. Stop at this step. Get on the awaitlist for service access through the [Azure NetApp Files waitlist submission page](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR8cq17Xv9yVBtRCSlcD_gdVUNUpUWEpLNERIM1NOVzA5MzczQ0dQR1ZTSS4u).

4. In the Azure Cloud Shell console, enter the following command to register the Azure Resource Provider: 
    
        az provider register --namespace Microsoft.NetApp --wait

   The `--wait` parameter instructs the console to wait for the registration to complete. The registration process can take some time to complete.

5. In the Azure Cloud Shell console, enter the following command to verify that the Azure Resource Provider has been registered: 
    
        az provider show --namespace Microsoft.NetApp

   The command output appears as follows:
   
        {
        "id": "/subscriptions/<SubID>/providers/Microsoft.NetApp",
        "namespace": "Microsoft.NetApp", 
        "registrationState": "Registered", 
        "resourceTypes": […. 

   `<SubID>` is your subscription ID.  The `state` parameter value indicates `Registered`.

6. From the Azure portal, click the **Subscriptions** blade.
7. In the Subscriptions blade, click your subscription ID. 
8. In the settings of the subscription, click **Resource providers** to verify that Microsoft.NetApp Provider indicates the Registered status: 

      ![Registered Microsoft.NetApp](../media/azure-netapp-files/azure-netapp-files-registered-resource-providers.png)


## Next steps  

[Create a NetApp account](azure-netapp-files-create-netapp-account.md)