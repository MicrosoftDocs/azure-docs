---
title: Migration from Windows Virtual Desktop classic to Azure Resource Manager
---

# Migration module tool

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

7. Sign into Azure Resource Manager:

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

1. Before you migrate, if you want to understand how the existing Classic resources will get mapped to new Azure Resource Manager resources, use
    
    ```powershell
    Get-RdsHostPoolMigrationMapping
    ```

    Examples:

    ```powershell
    Get-RdsHostPoolMigrationMapping -Tenant Contoso -HostPool Office -Location EastUS -OutputFile mapping.csv
    ```

    ```powershell
    Get-RdsHostPoolMigrationMapping -Tenant Contoso -Location WestUS -OutputFile mapping.csv
    ```

    Input:

- Specify the full path to where you want the file to be created.

    ```powershell
    Get-RdsHostPoolMigrationMapping -Tenant Contoso -HostPool Office -Location EastUS -OutputFile 'C:\\Users\\contosouser\\OneDrive - Microsoft\\Desktop\\mapping.csv'
    ```

1. Next you can choose to migrate a single host pool or all host pools within a
    tenant using Start-RdsHostPoolMigration.

    Examples:

    ```powershell
    Start-RdsHostPoolMigration -Tenant Contoso -HostPool Office -CopyUserAssignments \$false -Location EastUS
    ```

    ```powershell
    Start-RdsHostPoolMigration -Tenant Contoso -Location WestUS
    ```

    ```powershell
    Start-RdsHostPoolMigration -Tenant Contoso -HostPool Office -CopyUserAssignments -Location EastUS -Workspace <Resource ID of workspacename>
    ```

    Input:

- Tenant name

- Optional host pool name if you want a specific host pool to be migrated

- A valid US region where the Azure Resource Manager resources need to be created - Migration will not accept creation of Azure Resource Manager resources in regions outside of US geo. Please use only US regions.

- Optional resource ID to a previously created workspace name - If you do not provide the workspace name, the tool will create one using the tenant name. To get the resource ID:

    ```powershell
    Get-AzWvdWorkspace -WorkspaceName <workspace> -ResourceGroupName <resource group> \|fl
    

    ………

    Id: /subscriptions/<subscriptionId>resourcegroups/<resource group>/providers/Microsoft.DesktopVirtualization/workspaces/<workspace>

    ………
    ```

- Specify a user assignment mode for the existing user assignments:

**Copy** mode copies all user assignments from classic app groups to Azure Resource Manager app groups, leaving the existing user assignments as-is. Users will be able to see feeds for both versions on their clients. **None** mode doesn't change the user assignments. You have the option to assign users or user groups to app groups with the tools provided by Azure Resource Manager, such as the Azure portal, PowerShell cmdlets or API.

There is a max number of users that will be allowed to be copied. The actual limit depends on how many assignments are already used in the subscription. There is a hard limit of 2000 for assignments per subscription. The tool checks how many assignments are available, and will calculate the limit based on this. If enough assignments are not available to complete the “copy”, then you will get an error: "Insufficient role assignment quota to copy user assignments" "Rerun command without the -CopyUserAssignments switch to migrate."

Expected outcome:

Once you've entered the information, wait about 15 minutes for the service objects to be created. If you copied or moved user assignments, that will take some extra time for the assignments to complete.

The following will be created once Start-RdsHostPoolMigration is completed :

- Azure service objects for the tenant or host pool you specified.

- Two new resource groups:

    - “Tenantname”resource group - contains just the Workspace

    - “Tenantname”_”originalHostPoolName” resource group - contains the host pool and desktop app group.

- Based on your input, users might have also been published to the newly created app groups.

- Virtual machines will be available in both existing and new host pools to avoid user downtime during the migration process. This lets users connect to the same user session.

Since these are new Azure Resource Manager objects, the tool will not be able to set any RBAC permission OR diagnostics on them. So you will need to update the RBAC permissions and diagnostic settings for the new Azure service objects.

Once initial user connections are validated, you can choose to also publish the app group to more users or user groups.

>[!NOTE]
>After the migration, if you move app groups to a different resource group after user assignments, then you will have to redo the user assignments since all RBAC roles are removed during resource moves.

1. Finally, run Complete-RdsHostPoolMigration to finish migration for the tenant or host pool. This will delete all service objects created by the classic release. You will be left with just the new Azure objects and users will only be able to see the feed for the newly created app groups on their clients. Once you are done finalizing your migration, you need to explicitly delete the tenant in Classic.

Examples:

```powershell
Complete-RdsHostPoolMigration -Tenant Contoso -HostPool Office -Location EastUS
```

- **Complete-RdsHostPoolMigration -Tenant Contoso -Location EastUS**

    Input:

- Tenant name

- Optional host pool name if you want a specific host pool to be finalize

- A valid US region where the Azure Resource Manager resources were created

Expected outcome:

This will delete all service objects created by the classic release. You will be left with just the new Azure objects and users will only be able to see the feed for the newly created app groups on their clients. Once you are done finalizing your migration, you need to explicitly delete the tenant in Classic.

1. If you aren't ready to finish the migration and want to wait until a later date to migrate your classic service objects, run
    
    ```powershell
    Revert-RdsHostPoolMigration
    ```

    Examples:

```powershell
Revert-RdsHostPoolMigration -Tenant Contoso -HostPool Office -Location EastUS
```

```powershell
Revert-RdsHostPoolMigration -Tenant Contoso -Location EastUS
```

Input:

- Tenant name

- Optional host pool name if you want a specific host pool to revert

- A valid US region where the Azure Resource Manager resources were previously created

    Expected outcome:

Your newly created service objects will be deleted. Users will only see the feed for the classic version in their clients.

Revert will not delete the newly created workspace as well as the resource group associated with it. Hence you will need to manually delete them.

1. If you don't want to get rid of your classic service objects, you can run **Set-RdsHostPoolHidden** instead.

    Example:

```powershell
Set-RdsHostPoolHidden -Tenant Contoso -Hostpool Office -Hidden \$true -Location WestUS
```

Input:

- Tenant name

- Optional host pool name if you want a specific classic host pool to hide

- True – if you want to hide the Classic resources, False – if you want to
    unhide them

- A valid US region where the Azure Resource Manager resources were previously created

Expected outcome:

This will hide the classic user feed and the classic service objects instead of deleting them. This gives you the option of reverting later if you choose to.
