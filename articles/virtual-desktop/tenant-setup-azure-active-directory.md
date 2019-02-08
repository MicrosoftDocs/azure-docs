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
> * Create a Windows Virtual Desktop tenant.
> * Confirm your Windows Virtual Desktop tenant.

You need the Windows Virtual Desktop PowerShell module to follow the instructions in this article. Install the Windows Virtual Desktop PowerShell module from the PowerShell Gallery by running this cmdlet:

```powershell
PS C:\> Install-Module WindowsVirtualDesktop
```

You also need the following things to set up your Windows Virtual Desktop tenant:

* The Windows Virtual Desktop PowerShell module installed to your computer.
* An [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) account.
* An Azure subscription tied to the Azure Active Directory account.
* An Azure Active Directory user account with Global Administrator permissions. This will allow Windows Virtual Desktop to query your Azure Active Directory.
* Access to the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/).

## Grant Azure Active Directory permissions to Windows Virtual Desktop

As global administrator of your Azure Active Directory, you must grant permissions to the service to query your Azure Active Directory and create a Windows Virtual Desktop tenant.

Cloud Solution Provider organizations granting Azure Active Directory consent on behalf of the Cloud Solution Provider customer they're managing must use a Global Administrator account sourced from the customer’s Azure Active Directory, not from the Cloud Solution Provider organization itself.

To grant permissions:

1. Open a browser and connect to the [Remote Desktop Web page URL](https://rdweb.wvd.microsoft.com).
2. For **Consent Option** > **Server App**, enter the Azure AD tenant name or ID, then select **Submit**.
        For Cloud Solution Provider customers, the ID is the customer's Microsoft ID from the Partner Portal. For Enterprise Azure subscriptions, the ID is located under **Azure Active Directory** > **Properties** > **Directory ID**.
3. Sign in to the Windows Virtual Desktop consent page with an administrative account within the customer’s Azure AD tenant. For example, admin@tenantname.onmicrosoft.com.  
4. Select **Accept**.
5. Wait for one minute.
6. Navigate back to the [Remote Desktop Web page URL](https://rdweb.wvd.microsoft.com).
7. Select **Consent Option** > **Client App**, enter the Azure AD tenant name or ID, then select **Submit**.
8. Sign in to the Windows Virtual Desktop consent page with an administrative account within the customer’s Azure AD tenant. For example, admin@tenantname.onmicrosoft.com.
9. Select **Accept**.

## Create a Windows Virtual Desktop tenant

Now that the Windows Virtual Desktop service has permissions to query your Azure Active Directory, you can create a tenant.

1. In the Azure Marketplace, select **New**.
2. Search for **Windows Virtual Desktop**.
3. Select **Windows Virtual Desktop – Create a tenant**.
4. Enter a name for your Windows Virtual Desktop and configure its settings. The following table shows examples of configuration types.
    
    |Setting|Example value|Description|
    |---|---|---|
    |Name|Your company name|Choose an appropriate value for your Windows Virtual Desktop tenant.|
    |Resource Group|yourcompanynameWVDTenant|This resource group is only used for tenant creation.|
    |Location|East US 2|Choose a location where your assets are located to run Azure Automation. If the region does not support Azure Automation, then the Azure Automation account is created in East US 2.|
    
5. Once you've configured your settings, select **Create** > **Purchase**.

## Confirm your Windows Virtual Desktop tenant

After you've created your Windows Virtual Desktop tenant, you can run the following cmdlets to confirm it's set up the way you want.

1. Run the following cmdlet in PowerShell to install the Windows Virtual Desktop PowerShell module from the PowerShell Gallery:
    ```powershell
    Install-Module Rds
    ```
2. Run the following cmdlet to check if your PowerShell instance is using TLS 1.2:
    ```powershell
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    ```
3. Run the following cmdlet to sign in to Windows Virtual Desktop:
    ```powershell
    Add-RdsAccount -DeploymentUrl “https://rdbroker.wvd.microsoft.com”
    ```
4. Optionally, you can run the following cmdlet to set the context of the administrative session to a specific tenant group if you've recieved one.
    ```powershell
    Set-RdsContext -TenantGroupName “Custom Tenant Group”
    ```
        This situation tends to apply to Cloud Solution Provider organizations.
5. Run the following cmdlet to check which Windows Virtual Desktop tenants your user can access.
    ```powershell
    Get-RdsTenant
    ```

## Next steps

Once you've created your tenant, you'll need to make a host pool. To learn more about host pools, continue to the tutorial for creating a host pool in Windows Virtual Desktop.

> [!div class="nextstepaction"]
> [Windows Virtual Desktop host pool tutorial](./create-host-pools-azure-marketplace.md)