---
title: Set up Windows Virtual Desktop tenants in Azure Active Directory - Azure
description: Describes how to set up Windows Virtual Desktop tenants in Azure Active Directory.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 10/25/2018
ms.author: helohr
---
# Create a tenant in Windows Virtual Desktop (Preview)

Creating a tenant in Windows Virtual Desktop is the first step towards building out your desktop virtualization solution. With a tenant, you can build out host pools, assign users, and make connections through the service.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Grant Azure Active Directory permisions to the Windows Virtual Desktop service.
> * Create a Windows Virtual Desktop tenant.
> * Confirm your Windows Virtual Desktop tenant.

## Prerequisites

You'll need the following things to set up your Windows Virtual Desktop tenant:

* An Azure Active Directory.
* An Azure subscription tied to the Azure Active Directory.
* An Azure Active Directory user account with Global Administrator permissions. This will allow Windows Virtual Desktop to query your Azure Active Directory.

## Grant Azure Active Directory permissions to Windows Virtual Desktop

To query your Azure Active Directory and create a Windows Virtual Desktop tenant, a global administrator of your Azure Active Directory must grant those permissions to the service.

CSP organizations granting Azure Active Directory consent on behalf of the CSP customer they're managing must use a Global Administrator account sourced from the customer’s Azure Active Directory, not from the CSP organization itself.

To grant permissions:

1. Open a browser and connect to the RD Web page URL at <https://rdweb.wvd.microsoft.com>.
2. Select **Consent Option: Server App**, enter the Azure AD tenant name or ID, then select **Submit**.
        1. For CSP customers, the ID is the customer's Microsoft ID from the Partner Portal. For Enterprise Azure subscriptions, the ID is located under **Azure Active Directory** > **Properties** > **Directory ID**.
3. Sign in to the Windows Virtual Desktop consent page with an administrative account within the customer’s Azure AD tenant. For example, admin@<tenantname>.onmicrosoft.com.  
4. Select **Accept**.
5. Navigate back to the [RD Web page URL](https://rdweb.wvd.microsoft.com).
6. Select **Consent Option: Client App**, enter the Azure AD tenant name or ID, then select **Submit**.
7. Sign in to the Windows Virtual Desktop consent page with an administrative account within the customer’s Azure AD tenant. For example, admin@<tenantname>.onmicrosoft.com.
8. Select **Accept**.

>[!NOTE]
>The Server App must be consented before the Client App. Wait 1 minute between the consent for the Server App and the Client App.

Now that the Windows Virtual Desktop service has permissions to query your Azure Active Directory, you can create a tenant.

## Create a Windows Virtual Desktop tenant

1. In the Azure Marketplace, select **New**.
2. Search for **Windows Virtual Desktop**.
3. Select **Windows Virtual Desktop – Create a tenant**.
4. Enter a name for your Windows Virtual Desktop and configure its settings. The following table shows examples of configuration types.
    
    |Setting|Example value|Description|
    |---|---|---|
    |Name|Your company name|Choose an appropirate value for your Windows Virtual Desktop tenant.|
    |Resource Group|yourcompanynameWVDTenant|This resource group will only be used for tenant creation.|
    |Location|East US 2|Choose a location where your assets are located for running of Azure Automation. If the region does not support Azure Automation, then the Azure Automation account will be created in East US 2.|
    
5. Once you've configured your settings, select **Create**, then **Purchase**.

## Confirm your Windows Virtual Desktop tenant

1. Run the following cmdlet in PowerShell to install the Windows Virtual Desktop PowerShell module from the PowerShell Gallery:
    ```PowerShell
    Install-Module Rds
    ```
2. Run the following cmdlet to check if your PowerShell instance is using TLS 1.2:
    ```PowerShell
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    ```
3. Run the following cmdlet to sign in to Windows Virtual Desktop:
    ```PowerShell
    Add-RdsAccount -DeploymentUrl “https://rdbroker.wvd.microsoft.com”
    ```
4. Optionally, you can run the following cmdlet to set the context of the administrative session to a specific tenant group if you've recieved one.
    ```PowerShell
    Set-RdsContext -TenantGroupName “Custom Tenant Group”
    ```
        This situation tends to apply to CSP organizations.
5. Run the following cmdlet to check which Windows Virtual Desktop tenants your user can access.
    ```PowerShell
    Get-RdsTenant
    ```

## Next steps

Once you've created your tenant, you'll need to [make a host pool](manage-host-pools.md).

Need help learning how to publish RemoteApps and manage assignments? Check out [Manage app groups for Windows Virtual Desktop](manage-app-groups.md).