---
title: Set up a common identity for the Data Science Virtual Machine - Azure | Microsoft Docs
description: Learn how to create common user accounts that can be used across multiple Data Science Virtual Machines. You can use Azure Active Directory or an on-premises Active Directory to authenticate users to the Data Science Virtual Machine.
keywords: deep learning, AI, data science tools, data science virtual machine, geospatial analytics, team data science process
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun
ms.custom: seodec18

ms.assetid: 
ms.service: machine-learning
ms.subservice: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2018
ms.author: gokuma

---

# Set up a common identity on the Data Science Virtual Machine

On an Azure virtual machine (VM), including the Data Science Virtual Machine (DSVM), you create local user accounts while provisioning the VM. Users then authenticate to the VM by using these credentials. If you have multiple VMs that you need to access, this approach can quickly get cumbersome as you manage credentials. Common user accounts and  management through a standards-based identity provider enable you to use a single set of credentials to access multiple resources on Azure, including multiple DSVMs. 

Active Directory is a popular identity provider and is supported on Azure as a service and on-premises. You can use Azure Active Directory (Azure AD) or on-premises Active Directory to authenticate users on a standalone DSVM or a cluster of DSVMs in an Azure virtual machine scale set. You do this by joining the DSVM instances to an Active Directory domain. 

If you already have Active Directory to manage the identities, you can use it as your common identity provider. If you don't have Active Directory, you can run a managed Active Directory instance on Azure through a service called [Azure Active Directory Domain Services](https://docs.microsoft.com/azure/active-directory-domain-services/) (Azure AD DS). 

The documentation for [Azure AD](https://docs.microsoft.com/azure/active-directory/) provides detailed [management instructions](https://docs.microsoft.com/azure/active-directory/choose-hybrid-identity-solution), including connecting Azure AD to your on-premises directory if you have one. 

This article describes the steps to set up a fully managed Active Directory domain service on Azure by using Azure AD DS. You can then join your DSVMs to the managed Active Directory domain to enable users to access a pool of DSVMs (and other Azure resources) by using a common user account and credentials. 

## Set up a fully managed Active Directory domain on Azure

Azure AD DS makes it simple to manage your identities by providing a fully managed service on Azure. On this Active Directory domain, you manage users and groups. The steps to set up an Azure-hosted Active Directory domain and user accounts in your directory are:

1. In the Azure portal, add the user to Active Directory: 

   a. Sign in to the [Azure Active Directory admin center](https://aad.portal.azure.com) with an account that's a global admin for the directory.
    
   b. Select **Azure Active Directory** and then **Users and groups**.
    
   c. On **Users and groups**, select **All users**, and then select **New user**.
   
      The **User** pane opens.
      
      ![The "User" pane](./media/add-user.png)
    
   d. Enter details for the user, such as **Name** and **User name**. The domain name portion of the user name must be either the initial default domain name "[domain name].onmicrosoft.com" or a verified, non-federated [custom domain name](../../active-directory/add-custom-domain.md) such as "contoso.com."
    
   e. Copy or otherwise note the generated user password so that you can provide it to the user after this process is complete.
    
   f. Optionally, you can open and fill out the information in **Profile**, **Groups**, or **Directory role** for the user. 
    
   g. On **User**, select **Create**.
    
   h. Securely distribute the generated password to the new user so that the user can sign in.

1. Create an Azure AD DS instance. Follow the instructions in the article [Enable Azure Active Directory Domain Services using the Azure portal](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-getting-started) (tasks 1 to 5). It's important to update the existing user passwords in Active Directory so that the password in Azure AD DS is synced. It's also important to add DNS to Azure AD DS, as described in task 4 of the article. 

1. Create a separate DSVM subnet in the virtual network created in task 2 of the preceding step.
1. Create one or more Data Science VM instances in the DSVM subnet. 
1. Follow the [instructions](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-join-ubuntu-linux-vm ) to add DSVM to Active Directory. 
1. Mount an Azure Files share to host your home or notebook directory to enable mounting your workspace on any machine. (If you need tight file-level permissions, you'll need NFS running on one or more VMs.)

   a. [Create an Azure Files share](../../storage/files/storage-how-to-create-file-share.md).
    
   b. Mount it on the Linux DSVM. When you select the **Connect** button for the Azure Files share in your storage account in the Azure portal, the  command to run in the Bash shell on the Linux DSVM appears. The command looks like this:
   
   ```
   sudo mount -t cifs //[STORAGEACCT].file.core.windows.net/workspace [Your mount point] -o vers=3.0,username=[STORAGEACCT],password=[Access Key or SAS],dir_mode=0777,file_mode=0777,sec=ntlmssp
   ```
1. Assume that you mounted your Azure Files share in /data/workspace, for example. Now create directories for each of your users in the share: /data/workspace/user1, /data/workspace/user2, and so on. Create a `notebooks` directory in each user's workspace. 
1. Create symbolic links for `notebooks` in `$HOME/userx/notebooks/remote`.   

Now, you have the users in your Active Directory instance hosted in Azure. By using the Active Directory credentials, users can log in to any DSVM (SSH or JupyterHub) that's joined to Azure AD DS. Because the user workspace is on an Azure Files share, users have access to their notebooks and other work from any DSVM when they're using JupyterHub. 

For autoscaling, you can use a virtual machine scale set to create a pool of VMs that are all joined to the domain in this fashion and with the shared disk mounted. Users can log in to any available machine in the virtual machine scale set and have access to the shared disk where their notebooks are saved. 

## Next steps

* [Securely store credentials to access cloud resources](dsvm-secure-access-keys.md)



