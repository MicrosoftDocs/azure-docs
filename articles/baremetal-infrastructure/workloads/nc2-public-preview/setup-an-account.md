---
title: Setup an Account
description:  
ms.topic: how-to
ms.subservice:  
ms.date: 03/31/2021
---

# Setup an Account

Perform the following steps to set up your Azure account and subscription: 
 
1.	Set up an Azure account. 
> [!NOTE]
> In this Azure account, you must have permissions to register an app.  
> [!NOTE]
> Record your Azure subscription ID (GUID), a unique 32-digit GUID associated with your subscription.  
For up-to-date and detailed instructions on how to create a free Azure account, see [Create your Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).  

2.	Configure an Azure Active Directory (Azure AD) tenant with groups and users.  
To build Nutanix Clusters as an application that uses the Microsoft identity platform for identity and access management, you need access to an Azure Active Directory (Azure AD) tenant.  
For up-to-date and detailed instructions about how to set up a tenant, see the Microsoft Azure documentation at [Quickstart: Set up a tenant. full](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant). 

3. Set up a new Azure subscription. Work with Nutanix to get your subscription allowlisted.
> [!NOTE]
> Ensure that you set up a new Azure subscription well in advance _SN_ and that the subscription is pinned to the public preview.  
Do not create any resource or resource group in the subscription until the subscription is pinned. 
Be sure to your Azure subscription ID (GUID). 
This Azure subscription must be associated with the Azure AD that you configured. You can either create a new subscription in an existing tenant or create a new tenant. To build Nutanix Clusters as an application that uses the Microsoft identity platform for identity and access management, you need access to an Azure Active Directory (Azure AD) tenant.  
4.	Register the resource provider for your account by running these lines in PowerShell: 
```azurepowershell

```Powershell 
register-azresourceprovider –providername microsoft.network register-azresourceprovider –providername microsoft.nutanix 
register-azresourceprovider -providername microsoft.BareMetal 
```
5.	Create an app registration in Azure AD with the “Contributor” access to the new subscription. 
 In your new subscription, assign the “Contributor” role to the new app registration: 
    1. Go to the Access control (IAM) page for your subscription. 
    2. Click Add > Add role assignment. 
    3. Under Role, select the Contributor role. Click Next. 
    4. Under Members, select your app registration. 
    5. Under Review + assign, click Review + assign. 
> [!NOTE]
> Create and register Nutanix Clusters as an application in Azure, so the Microsoft identity platform can provide authentication and authorization services to Nutanix Clusters. Registering Nutanix Clusters as an application establishes a trust relationship between Nutanix Clusters and the Microsoft identity platform. 
You must add a Client Secret while you register Nutanix Clusters with Azure. The client secret is also known as an application password. It's a string value you can use in place of a certificate to identify itself.  
> [!NOTE] 
> Copy and save the secret value for later usage while adding an Azure cloud account to Nutanix Clusters 
For up-to-date and detailed instructions about how to create and register an application with Azure, see the Microsoft Azure documentation at Create an Azure AD application and service principal. 
Open the Azure PowerShell and make sure you have selected the right subscription to apply the following configuration.  

```
C:\>Register-AzResourceProvider -ProviderNamespace Microsoft.Network 
```

This registers the Microsoft network provider for your account. See RegisterAzResourceProvider for more information about registering the Microsoft network provider for your account. 
 
6. Create a resource group in Azure.  
See the Microsoft Azure documentation at Manage Azure Resource Manager resource groups by using the Azure portal.  
Create all the resources (virtual networks and VMs) required for Nutanix Clusters in the resource group you created.  
> [!NOTE] 
> Ensure that you note down the Directory ID, Application ID, Client Secret, and Azure Subscription ID. 
You will need these IDs later while adding your Azure account to the Nutanix Clusters console. 

## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
