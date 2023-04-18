---
title: Migrate automatically from Azure Virtual Desktop (classic) - Azure
description: How to migrate automatically from Azure Virtual Desktop (classic) to Azure Virtual Desktop by using the migration module.
author: Heidilohr
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 01/31/2022
ms.author: helohr
manager: femila
---

# Migrate automatically from Azure Virtual Desktop (classic)

The migration module tool lets you migrate your organization from Azure Virtual Desktop (classic) to Azure Virtual Desktop automatically. This article will show you how to use the tool. 

## Requirements

Before you use the migration module, make sure you have the following things ready:

- An Azure subscription where you'll create new Azure service objects.

- You must be assigned the Contributor role to create Azure objects on your subscription, and the User Access Administrator role to assign users to application groups.

- At least Remote Desktop Services (RDS) Contributor permissions on an RDS tenant or the specific host pools you're migrating.

- The latest version of the Microsoft.RdInfra.RDPowershell PowerShell module.

- The latest version of the Az.DesktopVirtualization PowerShell module.

- The latest version of the Az.Resources PowerShell module.

- Install the migration module on your computer.

- PowerShell or PowerShell ISE to run the scripts you'll see in this article. The Microsoft.RdInfra.RDPowershell module doesn't work in PowerShell Core.

>[!IMPORTANT]
>Migration only creates service objects in the US geography. If you try to migrate your service objects to another geography, it won't work. Also, if you have more than 500 app groups in your Azure Virtual Desktop (classic) deployment, you won't be able to migrate. You'll only be able to migrate if you rebuild your environment to reduce the number of app groups within your Azure Active Directory (Azure AD) tenant.

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

    If you don't, then you'll have to install and import the modules by running these cmdlets:

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
    Install-Module -Name Microsoft.RDInfra.RDPowershell -RequiredVersion 1.0.3414.0 -force
    Import-module Microsoft.RDInfra.RDPowershell
    ```

4. Once you're done installing everything, run this cmdlet to make sure you have the right versions of the modules:

    ```powershell
    Get-Module Microsoft.RDInfra.RDPowershell
    ```

5. Now, let's install and import the migration module by running these cmdlets:

    ```powershell
    Install-Module -Name PackageManagement -Repository PSGallery -Force
    Install-Module -Name PowerShellGet -Repository PSGallery -Force
    # Then restart shell
    Install-Module -Name Microsoft.RdInfra.RDPowershell.Migration -AllowClobber
    Import-Module <Full path to the location of the migration module>\Microsoft.RdInfra.RDPowershell.Migration.psd1
    ```

6. Once you're done, sign into Azure Virtual Desktop (classic) in your PowerShell window:

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

10. Finally you'll need to register the provider. There are two ways you can do this:
    - If you want to use PowerShell, then run this cmdlet:
       
       ```powershell
       Register-AzResourceProvider -ProviderNamespace Microsoft.DesktopVirtualization
       ```
    
    - If you'd rather use the Azure portal, open and sign in to the Azure portal, then go to **Subscriptions** and select the name of the subscription you want to use. After that, go to **Resource Provider** > **Microsoft.DesktopVirtualization** and select **Re-register**. You won't see anything change in the UI just yet, but your PowerShell environment should now be ready to run the module.

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

2. Next, run the **Start-RdsHostPoolMigration** cmdlet to choose whether to migrate a single host pool or all host pools within a tenant.

   For example:

   ```powershell
   Start-RdsHostPoolMigration -Tenant Contoso -Location WestUS
   ```

   If you want to migrate your resources a specific host pool, then include the host pool name. For example, if you want to move the host pool named "Office," run a command like this:

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

      - Use **Copy** to copy all user assignments from your old app groups to Azure Resource Manager application groups. Users will be able to see feeds for both versions of their clients.
      - Use **None** if you don't want to change the user assignments. Later, you can assign users or user groups to app groups with the Azure portal, PowerShell, or API. Users will only be able to see feeds using the Azure Virtual Desktop (classic) clients.

   You can only copy 2,000 user assignments per subscription, so your limit will depend on how many assignments are already in your subscription. The module calculates the limit based on how many assignments you already have. If you don't have enough assignments to copy, you'll get an error message that says "Insufficient role assignment quota to copy user assignments. Rerun command without the -CopyUserAssignments switch to migrate."

3. After you run the commands, it will take up to 15 minutes for the module to create the service objects. If you copied or moved any user assignments, that will add to the time it takes for the module to finish setting everything up.

   After the **Start-RdsHostPoolMigration** cmdlet is done, you should see the following things:

      - Azure service objects for the tenant or host pool you specified.

      - Two new resource groups:

         - A resource group called "Tenantname," which contains your workspace.

         - A resource group called "Tenantname_originalHostPoolName," which contains the host pool and desktop app groups.

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

   If you want to complete a specific host pool, you can include the host pool name in the cmdlet. For example, if you want to complete a host pool named "Office," you'd use a command like this:

    ```powershell
    Complete-RdsHostPoolMigration -Tenant Contoso -HostPool Office -Location EastUS
    ```

    This will delete all service objects created by Azure Virtual Desktop (classic). You will be left with just the new Azure objects and users will only be able to see the feed for the newly created app groups on their clients. Once you are done finalizing your migration, you need to explicitly delete the tenant in Azure Virtual Desktop (classic).

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

6. If you don't want to delete your Azure Virtual Desktop (classic) service objects yet but do want to test migration, you can run **Set-RdsHostPoolHidden**.

    For example:

    ```powershell
    Set-RdsHostPoolHidden -Tenant Contoso -Hostpool Office -Hidden $true -Location WestUS
    ```

    Setting the status to "true" will hide the Azure Virtual Desktop (classic) resources. Setting it to "false" will reveal the resources to your users.

    The *-Hostpool* parameter is optional. You can use this parameter if there's a specific Azure Virtual Desktop (classic) host pool you want to hide.

    This cmdlet will hide the Azure Virtual Desktop (classic) user feed and service objects instead of deleting them. However, this is usually only used for testing and doesn't count as a completed migration. To complete your migration, you'll need to run the **Complete-RdsHostPoolMigration** command. Otherwise, revert your deployment by running **Revert-RdsHostPoolMigration**.

## Troubleshoot automatic migration

This section explains how to solve commonly encountered issues in the migration module.

### I can't access the tenant

First, try these two things:

- Make sure your admin account has the required permissions to access the tenant.
- Try running **Get-RdsTenant** on the tenant.

If those two things work, try running the **Set-RdsMigrationContext** cmdlet to set the RDS Context and ADAL Context for your migration:

1. Create the RDS Context by running the **Add-RdsAccount** cmdlet.       

2. Find the RDS Context in the global variable *$rdMgmtContext*.         

3. Find the ADAL Context in the global variable *$AdalContext*.

4. Run **Set-RdsMigrationContext** with the variables you found in this format:

   ```powershell
   Set-RdsMigrationContext -RdsContext <rdscontext> -AdalContext <adalcontext>
   ```

## Next steps

If you'd like to learn how to migrate your deployment manually instead, see [Migrate manually from Azure Virtual Desktop (classic)](manual-migration.md).

Once you've migrated, get to know how Azure Virtual Desktop works by checking out [our tutorials](create-host-pools-azure-marketplace.md). Learn about advanced management capabilities at [Expand an existing host pool](expand-existing-host-pool.md) and [Customize RDP properties](customize-rdp-properties.md).

To learn more about service objects, check out [Azure Virtual Desktop environment](environment-setup.md).
