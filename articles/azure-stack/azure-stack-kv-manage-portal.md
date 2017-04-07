---
title: Manage Key Vault in Azure Stack using PowerShell | Microsoft Docs
description: Learn how to manage Key Vault in Azure Stack using PowerShell.
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/06/2017
ms.author: sngun

---

# Manage Key Vault in Azure Stack using the portal

Starting in Technical Preview 3 (TP3), you can manage Key Vault in Azure Stack by using the Azure Stack portal. This article helps you get started to create and manage Key Vault in Azure Stack. 

>[!NOTE]
> In TP3, you can create and manage a key vault from the [user portal](azure-stack-manage-portals.md#the-user-portal) or user API only. If you are an administrator, you should sign in to the user portal to manage key vaults, keys, and secrets.   

## Prerequisites  

* Azure Stack administrators must have [created an offer](azure-stack-create-offer.md) that includes the Key Vault service.  
* Tenants must [subscribe to an offer](azure-stack-subscribe-plan-provision-vm.md) that includes the Key Vault service.  
 
## Create a key vault 

1. Sign in to the user portal(https://portal.local.azurestack.external).  

2. From the dashboard, click **New > Security + Identity > Key Vault**.  

    ![KV screen](media/azure-stack-kv-manage-portal/image1.png)  

3. On the **Create Key Vault** blade, assign a **Name** for your vault. Vault name can contain only alphanumeric characters, the special character hyphen (-), and it shouldn’t start with a number.  

4. Choose a **Subscription** from the list of available subscriptions. All subscriptions that offer the Key Vault service are displayed in the drop-down.  

5. Select an existing **Resource Group** or create a new one.  

6. Select the **Pricing tier**.  
    >[!NOTE]
    > At the TP3 release, key vault supports the **Standard** SKU only.

7. Choose an existing **Access policies** or create a new one. Access policy allows you to grant permissions for a user, application, or a security group to perform operations with this vault.  

8. Optionally, choose an **Advanced access policy** to enable the features like access to Virtual Machines for deployment, access to Resource Manager for template deployment and access to Azure Disk Encryption for volume encryption. 
  
9.	After configuring the settings, click **OK** and then **Create**. This starts the key vault deployment. 

## Manage keys and secrets

After you create a vault, use the following steps to create and manage keys and secrets within the vault.

## Create a key

1. Sign in to the user portal (https://portal.local.azurestack.external).  

2. From the dashboard, click **All resources** > select the key vault that you created earlier> click the **Keys** tile.  

3. From the **Keys** blade, click **Add**. 

4. On the **Create a key** blade, form the list of **Options**, choose the method that you want to use to create a key. You can **Generate** a new key, **Upload** an existing key, or **Restore Backup** key.  

5. Enter a **Name** for your key. The key name can contain only alphanumeric characters and the special character hyphen (-).  

6. Optionally, configure **Set activation date** and **Set expiration date** values for your key.  

7. Click **Create** to start the deployment.  

After the key is successfully created, you can select it from the **Keys** blade and view or modify its properties. The properties section contains the **Key Identifier**, a URI by which external applications can access this key. To limit operations on this key, configure settings under **Permitted operations**.

![URI key](media/azure-stack-kv-manage-portal/image4.png)  

## Create a secret 

1. Sign in to the user portal (https://portal.local.azurestack.external).  
2. From the dashboard, click **All resources** > select the key vault that you created earlier> click the **Secrets** tile.  

3. From the **Secrets** blade, click **Add**.  

4. On the **Create a secret** blade, from the list of **Upload options**, choose an option by which you want to create a secret. You can create a secret **Manually** by entering a value for the secret, or by uploading a **Certificate** from your local machine.  

5. Enter a **Name** for the secret. The secret name can contain only alphanumeric characters and the special character hyphen (-).  

6. Optionally, specify the **Content type**, and configure values for **Set activation date** and **Set expiration date** values for the secret.  

7. Click Create to start the deployment.  

After the secret is successfully created, you can select it from the **Secrets** blade and view or modify its properties. The properties section contains **Secret Identifier**, a URI by which external applications can access this secret. 

![URI secret](media/azure-stack-kv-manage-portal/image5.png) 


## Next Steps
* [Deploy a VM by retrieving the password stored in a key vault](azure-stack-kv-deploy-vm-with-secret.md)  
* [Deploy a VM with certificate stored in a key vault](azure-stack-kv-push-secret-into-vm.md)     


