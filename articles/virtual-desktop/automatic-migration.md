---
title: Migrate automatically from Azure Virtual Desktop (classic) - Azure
description: How to migrate automatically from Azure Virtual Desktop (classic) to Azure Virtual Desktop by using the migration module.
author: Heidilohr
ms.topic: how-to
ms.date: 07/22/2021
ms.author: helohr
manager: femila
---

# Migrate automatically from Azure Virtual Desktop (classic)

The migration module tool lets you migrate your organization from Azure Virtual Desktop (classic) to Azure Virtual Desktop automatically. This article will show you how to use the tool. 

## Requirements

Before you use the migration module, make sure you have the following things ready:

- An Azure subscription where you’ll create new Azure service objects.

- You must be assigned the Contributor role to create Azure objects on your subscription, and the User Access Administrator role to assign users to application groups.

- At least Remote Desktop Services (RDS) Contributor permissions on an RDS tenant or the specific host pools you’re migrating.

- The latest version of the Microsoft.RdInfra.RDPowershell PowerShell module 

- The latest version of the Az.DesktopVirtualization PowerShell module 

- The latest version of the Az.Resources PowerShell module 

- Download the migration module to your computer

- PowerShell or PowerShell ISE to run the scripts you'll see in this article. The Microsoft.RdInfra.RDPowershell module doesn't currently work in PowerShell Core.

>[!IMPORTANT]
>Migration currently only creates service objects in the US geography. If you try to migrate your service objects to another geography, it won't work. Also, if you have more than 200 app groups in your Azure Virtual Desktop (classic) deployment, you won't be able to migrate. You'll only be able to migrate if you rebuild your environment to reduce the number of app groups within your Azure Active Directory (Azure AD) tenant.

## Prepare your PowerShell environment

First, you'll need to prepare your PowerShell environment for the migration process.

To prepare your PowerShell environment:

1. Before you start, make sure you have the latest version of the Az.Desktop Virtualization and Az.Resources modules by running the following cmdlets:

    ```powershell
    Get-Module Az.Resources
    Get-Module Az.DesktopVirtualization
    https://www.powershellgallery.com/packages/Az.DesktopVirtualization/
    https://www.powershellgallery.com/packages/Az.Resources/
    ```

    If you don’t, then install and import the modules by running these cmdlets:

    ```powershell
    Install-module Az.Resources
    Import-module Az.Resources
    Install-module Az.DesktopVirtualization
    Import-module Az.DesktopVirtualization
    ```

2. Next, uninstall the current RDInfra PowerShell module by running this cmdlet:

    ```powershell
    Uninstall-Module -Name Microsoft.RDInfra.RDPowershell -AllVersions
    ```

3. After that, install the RDPowershell module with this cmdlet:

    ```powershell
    Install-Module -Name Microsoft.RDInfra.RDPowershell -RequiredVersion 1.0.2955.0 -force
    Import-module Microsoft.RDInfra.RDPowershell
    ```

4. Once you're done installing everything, run this cmdlet to make sure you have the right versions of the modules:

    ```powershell
    Get-Module Microsoft.RDInfra.RDPowershell
    ```

    ![Graphical user interface, text Description automatically generated](media/dbac6c7de0318a265fbaf9fdeee62d9c.jpg)

5. Now, let's import the migration module by running this cmdlet:

    ```powershell
    Import-Module <Full path to the location where you extracted the migration module>\Microsoft.RdInfra.RDPowershell.Migration.psd1
    ```

6. Once you're done, sign into Windows Virtual Desktop (classic) in your PowerShell window:

    ```powershell
    Add-RdsAccount -DeploymentUrl https://rdbroker.wvd.microsoft.com
    ```

7. Sign in to Azure Resource Manager:

    ```powershell
    Login-AzAccount
    ```

8. If you have multiple subscriptions, select the one you want to migrate your resources to with this cmdlet:

    ```powershell
    Select-AzSubscription -Subscriptionid <subID>
    ```

9. Register the Resource Provider in Azure portal for the selected subscription.

10. Sign in to the Azure portal, then go to **Subscriptions** and select the name of the subscription you want to use. After that, go to **Resource Provider** > **Microsoft.DesktopVirtualization** and select **Re-register**. You won't see anything change in the UI just yet, but your PowerShell environment should now be ready to run the module.

## Migrate Azure Virtual Desktop (classic) resources to Azure Resource Manager

Now that your PowerShell environment is ready, you can begin the migration process.

To migrate your Azure virtual Desktop (classic) resources to Azure Resource Manager:

1. Before you migrate, if you want to understand how the existing Classic resources will get mapped to new Azure Resource Manager resources, run this cmdlet:
    
    ```powershell
    Get-RdsHostPoolMigrationMapping
    ```

    With **Get-RdsHostPoolMigrationMapping**, you can create a CSV file that maps where your resources will go. For example, if your tenant's name is "Contoso," and you want to store your mapping file in the "contosouser" file, you'd run a cmdlet that looks like this:

    ```powershell
    Get-RdsHostPoolMigrationMapping -Tenant Contoso -HostPool Office -Location EastUS -OutputFile 'C:\\Users\contosouser\OneDrive - Microsoft\Desktop\mapping.csv'
    ```

2. Next, run the **Start-RdsHostPoolMigration** cmdlet to choose whether to migrate your resources to a single host pool or all host pools within a tenant.

    For example:

    ```powershell
    Start-RdsHostPoolMigration -Tenant Contoso -Location WestUS
    ```

    If you want to migrate your resources to a specific host pool, then include the office name. For example, if you want to move your resources to the host pool named "Office," run a command like this:

    ```powershell
    Start-RdsHostPoolMigration -Tenant Contoso -HostPool Office -CopyUserAssignments $false -Location EastUS
    ```

    If you don't give a workspace name, the module will automatically create one for you based on the tenant name. However, if you'd prefer to use a specific workspace, you can enter its resource ID like this:

    ```powershell
    Start-RdsHostPoolMigration -Tenant Contoso -HostPool Office -CopyUserAssignments -Location EastUS -Workspace <Resource ID of workspacename>
    ```
    
    If you'd like to use a specific workspace but don't know its resource ID, run this cmdlet:

    ```powershell
    Get-AzWvdWorkspace -WorkspaceName <workspace> -ResourceGroupName <resource group> |fl
    ```

  You'll also need to specify a user assignment mode for the existing user assignments:

  - Use **Copy** to copy all user assignments from your old app gropus to Azure Resource Manager app groups while leaving existing user assignments as-is. Users will be able to see feeds for both versions of their clients.
  - Use **None** if you don't want to change the user assignments. Later, you can assign users or user groups to app groups with the Azure portal, PowerShell, or API.

  You can only copy 2,000 user assignments per subscription, so your limit will depend on how many assigments are already in your subscription. The module calculates the limit based on how many assigments y ou already have. If you don't have enough assigments to copy, you'll get an error message that says "Insufficient role assignment quota to copy user assignments. Rerun command without the -CopyUserAssignments switch to migrate."

3. Once you run the commands, wait about 15 minutes for the module to create the service objects. If you copied or moved any user assignments, that will add to the time it takes for the module to finish setting everything up.

   Once the **Start-RdsHostPoolMigration** cmdlet is done, you should see the following things:

      - Azure service objects for the tenant or host pool you specified

      - Two new resource groups:

         - A resource group called "Tenantname," which contains your workspace.

         - A resource group called "Tenantname_originalHostPoolName," which contains the host pool and desktop app group.

      - Any users you published to the newly created app groups.

      - Virtual machines will be available in both existing and new host pools to avoid user downtime during the migration process. This lets users connect to the same user session.

   Since these new Azure service objects are Azure Resource Manager objects, the module can't set Role-based Access Control (RBAC) permissions or diagnostic settings on them. Therefore, you'll need to update the RBAC permissions and settings for these objects manually.

   Once the module validates the initial user connections, you can also publish the app group to more users or user groups, if you'd like.

   >[!NOTE]
   >After migration, if you move app groups to a different resource group after assigning permissions to users, it will remove all RBAC roles. You'll need to reassign users RBAC permissions all over again.

4. If you want to delete all Azure Virtual Desktop (classic) service objects, run **Complete-RdsHostPoolMigration** to finish the migration process. This cmdlet will delete all Azure Virtual Desktop (classic) objects, leaving only the new Azure objects. Users will only be able to see the feed for the newly created app groups on their clients. Once this command is done, you can safely delete the Azure Virtual Desktop (classic) tenant to finish the process.

   For example:

   ```powershell
   Complete-RdsHostPoolMigration -Tenant Contoso -Location EastUS
   ```

   If you want to revert a specific host pool, you can include the host pool name in the cmdlet. For example, if you want to revert a host pool named "Office," you'd use a command like this:

    ```powershell
    Complete-RdsHostPoolMigration -Tenant Contoso -HostPool Office -Location EastUS
    ```

    This will delete all service objects created by the classic release. You will be left with just the new Azure objects and users will only be able to see the feed for the newly created app groups on their clients. Once you are done finalizing your migration, you need to explicitly delete the tenant in Classic.

5. If you've changed your mind about migrating and want to revert the process, run the **Revert-RdsHostPoolMigration** cmdlet.
    
   For example:

   ```powershell
   Revert-RdsHostPoolMigration -Tenant Contoso -Location EastUS
   ```

   If you'd like to revert a specific host pool, you can include the host pool name in the command. For example, if you want to revert a host pool named "Office," then you'd enter something like this:

   ```powershell
   Revert-RdsHostPoolMigration -Tenant Contoso -HostPool Office -Location EastUS
   ```

   This cmdlet will delete all newly created Azure service objects. Your users will only see the feed for Azure Virtual Desktop (classic) objects in their clients.

   However, the cmdlet won't delete the workspace the module created or its associated resource group. You'll need to manually delete those items to get rid of them.

6. If you want to finish migration but don't want to delete your Azure Virtual Desktop (classic) service objects yet, you can run **Set-RdsHostPoolHidden**.

    For example:

    ```powershell
    Set-RdsHostPoolHidden -Tenant Contoso -Hostpool Office -Hidden $true -Location WestUS
    ```

    Setting the status to "true" will hide the Azure Virtual Desktop (classic) resources. Setting it to "false" will reveal the resources to your users.

    The *-Hostpool* parameter is optional. You can use this parameter if there's a specific Azure Virtual Desktop (classic) host pool you want to hide.

    This cmdlet will hide the Azure Virtual Desktop (classic) user feed and tservice objects instead of deleting them. This gives you the option of reverting later if you choose to.

## Next steps

If you'd like to learn how to migrate your deployment manually instead, see [Migrate manually from Azure Virtual Desktop (classic)](manual-migration.md).

Once you've migrated, get to know how Azure Virtual Desktop works by checking out [our tutorials](create-host-pools-azure-marketplace.md). Learn about advanced management capabilities at [Expand an existing host pool](expand-existing-host-pool.md) and [Customize RDP properties](customize-rdp-properties.md).

To learn more about service objects, check out [Azure Virtual Desktop environment](environment-setup.md).