---
title: Access Azure NetApp Files and create a NetApp account | Microsoft Docs
description: Describes xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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
ms.date: 03/28/2018
ms.author: b-juche
---
# Access Azure NetApp Files and create a NetApp account

Follow the procedures in this article to prepare the deployment of Azure NetApp Files: 

1. [Whitelist your Azure subscription](#whitelist-your-azure-subscription)
2. [Set up Azure network connectivity](#set-up-azure-network-connectivity)  
    a. [Verify Microsoft.Networking Resource Provider registration status](#verify-resource-provider)  
    b. [Create Resource Group and assign NetApp IAM access to Resource Group](#create_resource_group)  
    c. [Configure VNet gateway](#configure_vnet_geteway)
3. [Register the Azure Resource Provider](#register_azure_resource_provider)



## <a name="whitelist-your-azure-subscription"></a>Whitelist your Azure subscription 

The whitelisting process prepares your Azure subscription for use with Azure NetApp Files. You must have an Azure user account and a valid Azure subscription for this process.

1.	Use a web browser to access the [Azure Portal](https://portal.azure.com/) and log in to your Azure account.  
2.	Go to the **Subscriptions** blade and record your subscription ID found in the Subscriptions blade. 
    The subscription ID consists of lower case letters, numbers, and dashes. 
3.	Open the URL and fill out the Office 365 form to request whitelisting your Azure subscription for use with Azure NetApp Files.   
    You will receive a notification by email that your subscription has been whitelisted. 


## <a name="set-up-azure-network-connectivity"></a>Set up Azure network connectivity

NetApp will set up express route provisioning for you.  However, you must complete the following steps to enable the required access for the setup. 

### <a name="verify-resource-provider"></a>Verify Microsoft.Networking Resource Provider registration status

1. From the Azure Portal, click the Azure Cloud Shell icon on the upper right-hand corner:

    ![Azure Cloud Shell icon ](../media/azure-netapp-files/azure-netapp-files-azure-cloud-shell-icon.png)

2. If you have multiple subscriptions on your Azure account, select the one that you will use for Azure NetApp Files:  

    ````
    az account set --subscription <subId>
    ````
    `<SubID>` is your subscription ID.

3.	In the Azure Cloud Shell console, enter the following command to verify that the Microsoft.Network Azure Resource Provider has been registered:

    ````
    az provider show --namespace Microsoft.Network | more
    ````
    The command output appears as follows:
    ````
    …{
      "id": "/subscriptions/<SubID>/providers/Microsoft.Network",
      "namespace": "Microsoft.Network",
      "registrationState": "Registered",
      "resourceTypes": [….
     ````

4.	If the `registrationState` parameter indicates `NotRegistered`, enter the following command to register the Microsoft.Network Azure Resource Provider:

    ````
     az provider register –-namespace Microsoft.Network –-wait
    ````

### <a name="create_resource_group"></a>Create Resource Group and assign NetApp IAM access to Resource Group
1. In the Azure portal, click the **Resource Groups blade**.
2. Click the **+Add** icon to create a new Azure resource group.
3.	In the Create Empty Resource Group blade, provide the following information:
    - Resource group name: Enter *your_referred_resource_group*.
    - Subscription: Select your subscription.
    - Resource group location: Enter **East US**.
4.	Click **Create**.
5.	After you receive a notification indicating that the resource group has been created, click the notification message to go to the properties of the resource group.

    Alternatively, you can click *your_referred_resource_group* resource group name in the Resource Groups blade.
6.	Click **Access control (IAM)** for the resource group.

    [Use Role-Based Access Control to manage access to your Azure subscription resources](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-configure)  
    [Add or change Azure administrator roles that manage the subscription or services](https://docs.microsoft.com/en-us/azure/billing/billing-add-change-azure-subscription-administrator)
7.	In the Access control (IAM) blade, click **Add**.
8.	In the Add permissions blade, provide the following information:
    - In the Role field, select **Network Contributor** from the drop-down list.
    - In the Assign Access To field, select **Azure AD user, group, or Application** from the drop-down list.  
    - In the Select field, type in **azure-nfsaas-support@netapp.com** to request express route provisioning.   
    *Note:*	The IAM permissions apply only to the resource group you specified.
9.	Click **Save**.
10.	Email [azure-nfsaas-support@netapp.com](mailto:azure-nfsaas-support@netapp.com) to indicate that the resource group has been created and the IAM permissions on the resource group have been configured.

    You should receive an email indicating that express route provisioning has been set up.

### <a name="configure_vnet_geteway"></a>Configure VNet gateway
After NetApp sets up express route provisioning for your, you need to configure the Azure virtual network (Vnet) gateway.
<!-- After NetApp (SRE) sets up Express Route for users, need to have users configure VNet gateway. --> 
====== NEED DETAILS ==========



## <a name="register_azure_resource_provider">Register the Azure Resource Provider
You must register the Azure Resource Provider for Azure NetApp Files.
1.	From the Azure Portal, click the Azure Cloud Shell icon on the upper right-hand corner:

    ![Azure Cloud Shell icon ](../media/azure-netapp-files/azure-netapp-files-azure-cloud-shell-icon.png)

2.	If you have multiple subscriptions on your Azure account, select the one that you will use for Azure NetApp Files:  

    ````
    az account set --subscription <subscriptionId>
    ````

3. In the Azure Cloud Shell console, enter the following command to verify that your subscription information is correct:

    ````
    az feature list | grep NFS
    ````
   The command output appears as follows:
   ````
   "id": "/subscriptions/<SubID>/providers/Microsoft.Features/providers/Microsoft.NFS/features/privatePreview",
   "name": "Microsoft.NFS/privatePreview"
    ````
    `<SubID>` is your subscription ID.

4.	In the Azure Cloud Shell console, enter the following command to register the Azure Resource Provider:

    ````
    az provider register –-namespace Microsoft.NFS –-wait
    ````

    The `--wait parameter` instructs the console to wait for the registration to complete. The registration process can take some time to complete.

5.	In the Azure Cloud Shell console, enter the following command to verify that the Azure Resource Provider has been registered:

    ````
    az provider show --namespace Microsoft.NFS
    ````
    The command output appears as follows:

    ````
    {
    "id": "/subscriptions/<SubID>/providers/Microsoft.NFS",
    "namespace": "Microsoft.NFS",
    "registrationState": "Registered",
    "resourceTypes": [….
    ````

    The `registrationState` parameter value indicates `Registered`.

    `<SubID>` is your subscription ID.

6.	From the Azure Portal, click the **Subscriptions** blade.

7.	In the Subscriptions blade, click your subscription ID.

8.	In the settings of the subscription, click **Resource providers** to verify that Microsoft.NFS Provider indicates the Registered status:

    ![Resource Provider Registered status ](../media/azure-netapp-files/azure-netapp-files-resource-provider-registered-status.png)  
