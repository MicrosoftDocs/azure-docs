---
title: Create a tenant in Windows Virtual Desktop - Azure
description: Describes how to set up Windows Virtual Desktop tenants in Azure Active Directory.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 02/20/2019
ms.author: helohr
---
# Tutorial: Create a tenant in Windows Virtual Desktop (Preview)

Creating a tenant in Windows Virtual Desktop is the first step towards building out your desktop virtualization solution. A tenant is a group of one or more host pools. Each host pool is made up of multiple identical session hosts, virtual machines running Windows 10 Enterprise multi-session with an installed and registered Windows Virtual Desktop host agent. With a tenant, you can build out host pools, assign users, and make connections through the service.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Grant Azure Active Directory permisions to the Windows Virtual Desktop service.
> * Assign the TenantCreator application role to a user in your Azure Active Directory.
> * Create a Windows Virtual Desktop tenant.

You will need the following things to set up your Windows Virtual Desktop tenant:

* The [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) containing the users that will make connections to Windows Virtual Desktop.
* A Global Administrator account within the Azure Active Directory.
   * This requirement also applies to Cloud Solution Provider (CSP) organizations creating a Windows Virtual Desktop tenant for their customers. If you are a CSP organization, you must be able to login as a Global Administrator of the customer's Azure Active Directory.

## Grant Azure Active Directory permissions to the Windows Virtual Desktop service

If you have already granted permissions to Windows Virtual Desktop for this Azure Active Directory, skip this section.

Granting permissions to the Windows Virtual Desktop service allows the service to query your Azure Active Directory for administrative and end-user tasks. To grant permissions:

1. Open a browser and connect to the [Windows Virtual Desktop consent page](https://rdweb.wvd.microsoft.com).
2. For **Consent Option** > **Server App**, enter the Azure Active Directory tenant name or Directory ID, then select **Submit**.
        For Cloud Solution Provider customers, the ID is the customer's Microsoft ID from the Partner Portal. For Enterprise customers, the ID is located under **Azure Active Directory** > **Properties** > **Directory ID**.
3. Sign in to the Windows Virtual Desktop consent page with the Global Adminstrator account. For example, admin@contoso.com.  
4. Select **Accept**.
5. Wait for one minute.
6. Navigate back to the [Windows Virtual Desktop consent page](https://rdweb.wvd.microsoft.com).
7. Select **Consent Option** > **Client App**, enter the same Azure AD tenant name or Directory ID, then select **Submit**.
8. Sign in to the Windows Virtual Desktop consent page with the Global Administrator account. For example, admin@contoso.com.
9. Select **Accept**.

## Assign the TenantCreator application role to a user in your Azure Active Directory

Assigning an Azure Active Directory user the TenantCreator application role allows that user to create a Windows Virtual Desktop tenant that is associated with the Azure Active Directory. To grant the TenantCreator application role:

1. Open a browser and connect to the [Azure Active Directory portal](https://aad.portal.azure.com) using the Global Administrator account.
2. Select **Enterprise applications**, search for **Windows Virtual Desktop** and select the application.
3. Select **Users and groups**, then select **Add user**.
4. Search for the Global Administrator account, then click **Select**, and click **Assign**.

## Create a Windows Virtual Desktop tenant

Now that the Windows Virtual Desktop service has permissions to query the Azure Active Directory and the Global Administrator account has been assigned the TenantCreator application role, you can create a Windows Virtual Desktop tenant.

Download the Windows Virtual Desktop module and import the module to use in your session.

Sign in to Windows Virtual Desktop with the Global Administrator account
```powershell
Add-RdsAccount -DeploymentUrl “https://rdbroker.wvd.microsoft.com”
```
Create a new Windows Virtual Desktop tenant associated with the Azure Active Directory
```powershell
New-RdsTenant -Name <TenantName> -AadTenantId <DirectoryID>
```
For example, the Global Admin of the Contoso organization would run the following command
```powershell
New-RdsTenant -Name Contoso -AadTenantId 00000000-1111-2222-3333-444444444444
```

## Next steps

Once you've created your tenant, you'll need to make a host pool. To learn more about host pools, continue to the tutorial for creating a host pool in Windows Virtual Desktop.

> [!div class="nextstepaction"]
> [Windows Virtual Desktop host pool tutorial](./create-host-pools-azure-marketplace.md)
