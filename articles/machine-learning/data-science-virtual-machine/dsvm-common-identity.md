---
title: Setup common identity for Data Science Virtual Machine - Azure | Microsoft Docs
description: Setup common identity in  enterprise team's DSVM environments.
keywords: deep learning, AI, data science tools, data science virtual machine, geospatial analytics, team data science process
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun


ms.assetid: 
ms.service: machine-learning
ms.component: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2018
ms.author: gokuma

---

# Setup common identity on the Data Science VM

By default, on Azure VM including the Data Science VM (DSVM) local user accounts are created while provisioning the VM and the users authenticate to the VM with these credentials. If you have multiple VMs that you need to access, this approach can quickly get cumbersome to manage credentials. Common user accounts and  management using a standards-based identity provider allows you to use a single set of credentials to access multiple resources on Azure including multiple DSVMs. 

Active Directory (AD) is a popular identity provider and is supported both on Azure as a service as well as On-premises. You can leverage AD or Azure AD to authenticate users on both a standalone the Data Science VM (DSVM)  or a cluster of DSVM on an Azure virtual machine scale set. This is done by joining the DSVM instances to an AD domain. If you already have an Active Directory to manage the identities, you can use it as your common identity provider. In case you do not have an AD, you can run a managed AD on Azure through a service called [Azure Active Directory Domain Services](https://docs.microsoft.com/azure/active-directory-domain-services/)(Azure AD DS). 

The documentation for [Azure Active directory (Azure AD)](https://docs.microsoft.com/azure/active-directory/) provides detailed [instructions](https://docs.microsoft.com/azure/active-directory/choose-hybrid-identity-solution#synchronized-identity) to managed active directory including connecting the Azure AD to your On-premises directory if you have one. 

Rest of this article describes the steps to set up a fully managed AD domain service on Azure using Azure AD DS and join your DSVMs to the managed AD domain to enable users to access a pool of DSVMs (and other Azure resources) using a common user account and credentials. 

##  Set up a fully managed Active Directory domain on Azure

Azure AD DS makes it simple to manage your identities by providing a fully managed service on Azure. On this Active directory domain, users and groups are managed.  The steps to set up an Azure hosted AD domain and user accounts in your directory are:

1. Add user(s) to Active directory on portal 

    a. Sign in to the [Azure Active Directory admin center](https://aad.portal.azure.com) with an account that's a global admin for the directory.
    
    b. Select **Azure Active Directory** and then **Users and groups**.
    
    c. On **Users and groups**, select **All users**, and then select **New user**.
   
   ![Selecting the Add command](./media/add-user.png)
    
    d. Enter details for the user, such as **Name** and **User name**. The domain name portion of the user name must either be the initial default domain name "[domain name].onmicrosoft.com" or a verified, non-federated [custom domain name](../../active-directory/add-custom-domain.md) such as "contoso.com."
    
    e. Copy or otherwise note the generated user password so that you can provide it to the user after this process is complete.
    
    f. Optionally, you can open and fill out the information in **Profile**, **Groups**, or **Directory role** for the user. 
    
    g. On **User**, select **Create**.
    
    h. Securely distribute the generated password to the new user so that the user can sign in.

2.	Create Azure AD Domain Services

    To create an Azure ADDS, follow instructions in the article "[Enable Azure Active Directory Domain Services using the Azure portal](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-getting-started)" (Task 1 to Task 5). It is important that the existing user passwords in Active directory are updated so that the password in Azure AD DS is synched. It is also important to add the DNS to Azure AD DS as listed in Task #4 of the above article. 

3.	Create a separate DSVM Subnet in the  virtual network created in Task #2 of the preceeding step
4.	Create one or more Data Science VM instances in the DSVM subnet 
5.	Follow [instructions](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-join-ubuntu-linux-vm ) to add DSVM to AD. 
6.	Next mount a shared Azure Files to host your home or notebook directory to enable mounting your workspace on any machine. (If you need tight file level permissions you will need an NFS running on one or more VMs)

    a. [Create an Azure File Share](../../storage/files/storage-how-to-create-file-share.md)
    
    b. Mount it on the Linux DSVM. When you click on “Connect” button for the Azure Files in your storage account on the Azure portal, the  command to run in bash shell on the Linux DSVM will be shown. The command will look like this:
```
sudo mount -t cifs //[STORAGEACCT].file.core.windows.net/workspace [Your mount point] -o vers=3.0,username=[STORAGEACCT],password=[Access Key or SAS],dir_mode=0777,file_mode=0777,sec=ntlmssp
```
7.	Say, you mounted your Azure Files in /data/workspace. Now create directories for each of your users in the share. /data/workspace/user1, /data/workspace/user2 and so on. Create a ```notebooks``` directory in each user's workspace. 
8. Create symbolic links for the ```notebooks``` in ```$HOME/userx/notebooks/remote```.   

Now, you have the users in your active directory hosted in Azure and able to log in to any DSVM (both SSH, Jupyterhub) that is joined to the Azure AD DS  using the AD credentials. Since the user workspace is on shared Azure Files, the user will have access to their notebooks and other work from any DSVM when using Jupyterhub. 

For auto scaling, you can use the virtual machine scale set to create a pool of VMs that are all joined to the domain in this fashion and with the shared disk mounted. Users can log in to any available machine in the virtual machine scale set and have access to shared disk where their notebooks are saved. 

## Next steps

* [Securely store credentials to access cloud resources](dsvm-secure-access-keys.md)



