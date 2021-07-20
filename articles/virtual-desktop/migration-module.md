---
title: Migration from Windows Virtual Desktop classic to ARM
---

# Migration module tool

## Requirements

Before you start the migration, make sure you have the following things:

1. An Azure subscription where you’ll create new Azure service objects

2. You need to be assigned the Contributor role to create Azure objects on your subscription, and the User Access Administrator role to assign users to application groups.

3. You need at least RDS Contributor permissions on an RDS tenant or the specific host pools you’re migrating.

4. Latest version of the Microsoft.RdInfra.RDPowershell Powershell module 

5. Latest version of the Az.DesktopVirtualization Powershell module 

6. Latest version of the Az.Resources Powershell module 

7. Download the Migration Module

8. Must run PowerShell script in PowerShell or PowerShell ISE. At this time the Microsoft.RdInfra.RDPowershell Powershell module does not work in PowerShell Core

>[!IMPORTANT]
>Migration currently only creates service objects in the US geography. You cannot migrate the objects to a different geography with the tools currently available. If you have more than 200 app groups in Classic, you should not migrate. You should look at re-architecting your environment to reduce the number of app groups within your Azure Active Directory (Azure AD) tenant.

## Prepare your PowerShell environment

1. Ensure you have the latest version of Az.Desktop Virtualization and Az.Resources module:

    ```powershell
    Get-Module Az.Resources
    Get-Module Az.DesktopVirtualization
    https://www.powershellgallery.com/packages/Az.DesktopVirtualization/
    https://www.powershellgallery.com/packages/Az.Resources/
    ```

    If you don’t, then Install and Import the modules:

    ```powershell
    Install-module Az.Resources
    Import-module Az.Resources
    Install-module Az.DesktopVirtualization
    Import-module Az.DesktopVirtualization
    ```

2. Uninstall the current RDInfra Powershell module:

    ```powershell
    Uninstall-Module -Name Microsoft.RDInfra.RDPowershell -AllVersions
    ```

3. Install RDPowershell module:

    ```powershell
    Install-Module -Name Microsoft.RDInfra.RDPowershell -RequiredVersion 1.0.2955.0 -force
    Import-module Microsoft.RDInfra.RDPowershell
    ```

4. Check if the right version of the PS module is installed:

    ```powershell
    Get-Module Microsoft.RDInfra.RDPowershell
    ```

    ![Graphical user interface, text Description automatically generated](media/dbac6c7de0318a265fbaf9fdeee62d9c.jpg)

5. Import Migration module:

    ```powershell
    Import-Module <Full path to the location where the migration PS is extracted>\Microsoft.RdInfra.RDPowershell.Migration.psd1
    ```

6. Sign into classic Windows Virtual Desktop:

    ```powershell
    Add-RdsAccount -DeploymentUrl https://rdbroker.wvd.microsoft.com
    ```

7. Sign into ARM

    ```powershell
    Login-AzAccount
    ```

8. If you have multiple subscriptions, select the one you want to migrate the Classic resources to:

    ```powershell
    Select-AzSubscription -Subscriptionid <subID>
    ```

9. Register the Resource Provider in Azure portal for the selected subscription.

10. Login to Azure portal. Navigate to Subscriptions > select subscription > >navigate to Resource Provider > select Microsoft.DesktopVirtualization and then click Re-register. You will not see any UI feedback.

## Migrate Classic resources to Azure Resource Manager

1. Before you migrate, if you want to understand how the existing Classic resources will get mapped to new ARM resources, use
    
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

- A valid US region where the ARM resources need to be created - Migration will not accept creation of ARM resources in regions outside of US geo. Please use only US regions.

- Optional resource ID to a previously created workspace name - If you do not provide the workspace name, the tool will create one using the tenant name. To get the resource ID:

    ```powershell
    Get-AzWvdWorkspace -WorkspaceName <workspace> -ResourceGroupName <resource group> \|fl
    

    ………

    Id: /subscriptions/<subscriptionId>resourcegroups/<resource group>/providers/Microsoft.DesktopVirtualization/workspaces/<workspace>

    ………
    ```

- Specify a user assignment mode for the existing user assignments:

**Copy** mode copies all user assignments from classic app groups to ARM app groups, leaving the existing user assignments as-is. Users will be able to see feeds for both versions on their clients. **None** mode doesn't change the user assignments. You have the option to assign users or user groups to app groups with the tools provided by ARM, such as the Azure portal, PowerShell cmdlets or API.

There is a max number of users that will be allowed to be copied. The actual limit depends on how many assignments are already used in the subscription. There is a hard limit of 2000 for assignments per subscription. The tool checks how many assignments are available, and will calculate the limit based on this. If enough assignments are not available to complete the “copy”, then you will get an error: *"Insufficient role assignment quota to copy user assignments" "Rerun command without the -CopyUserAssignments switch to migrate"*

Expected outcome:

Once you've entered the information, wait about 15 minutes for the service
objects to be created. If you copied or moved user assignments, that will take
some extra time for the assignments to complete.

The following will be created once Start-RdsHostPoolMigration is completed :

- Azure service objects for the tenant or host pool you specified.

- 2 new resource groups:

    - “Tenantname”resource group - contains just the Workspace

    - “Tenantname”_”originalHostPoolName” resource group - contains the host
        pool and desktop appgroup.

- Based on your input, users might have also been published to the newly
    created app groups.

- Virtual machines will be available in both existing and new host pools to
    avoid user downtime during the migration process. This lets users connect to
    the same user session.

>   Since these are new ARM objects, the tool will not be able to set any RBAC
>   permission OR diagnostics on them. So you will need to update the RBAC
>   permissions and diagnostic settings for the new Azure service objects.

>   Once initial user connections are validated, you can choose to also publish
>   the app group to more users or user groups.

>   **Note**: After the migration, if you move app groups to a different resource
>   group after user assignments, then you will have to redo the user
>   assignments since all RBAC roles are removed during resource moves.

1. Finally, run Complete-RdsHostPoolMigration to finish migration for the
    tenant or host pool. This will delete all service objects created by the
    classic release. You will be left with just the new Azure objects and users
    will only be able to see the feed for the newly created app groups on their
    clients. Once you are done finalizing your migration, you need to explicitly
    delete the tenant in Classic.

>   Examples:

- **Complete-RdsHostPoolMigration -Tenant Contoso -HostPool Office -Location
    EastUS**

- **Complete-RdsHostPoolMigration -Tenant Contoso -Location EastUS**

    Input:

- Tenant name

- Optional host pool name if you want a specific host pool to be finalize

- A valid US region where the ARM resources were created

    Expected outcome:

>   This will delete all service objects created by the classic release. You
>   will be left with just the new Azure objects and users will only be able to
>   see the feed for the newly created app groups on their clients. Once you are
>   done finalizing your migration, you need to explicitly delete the tenant in
>   Classic.

1. If you aren't ready to finish the migration and want to wait until a later
    date to migrate your classic service objects, run
    Revert-RdsHostPoolMigration

    Examples:

- **Revert-RdsHostPoolMigration -Tenant Contoso -HostPool Office -Location
    EastUS**

- **Revert-RdsHostPoolMigration -Tenant Contoso -Location EastUS**

    Input:

- Tenant name

- Optional host pool name if you want a specific host pool to revert

- A valid US region where the ARM resources were previously created

    Expected outcome:

>   Your newly created service objects will be deleted. Users will only see the
>   feed for the classic version in their clients.

>   Revert will not delete the newly created workspace as well as the resource
>   group associated with it. Hence you will need to manually delete them.

1. If you don't want to get rid of your classic service objects, you can run
    Set-RdsHostPoolHidden instead.

    Example:

- **Set-RdsHostPoolHidden -Tenant Contoso -Hostpool Office -Hidden \$true
    -Location WestUS**

    Input:

- Tenant name

- Optional host pool name if you want a specific classic host pool to hide

- True – if you want to hide the Classic resources, False – if you want to
    unhide them

- A valid US region where the ARM resources were previously created

    Expected outcome:

>   This will hide the classic user feed and the classic service objects instead
>   of deleting them. This gives you the option of reverting later if you choose
>   to.

Troubleshooting
===============

Error accessing tenant
----------------------

Check that the admin account has required permissions.

Check you can perform a Get-RdsTenant on the tenant.

Additionally, use Set-RdsMigrationContext cmdlet to set the RDS Context and Adal
Context to be used for migration         

- Create the RDS Context by running the Add-RdsAccount cmdlet         

- The RDS Context is stored in the global variable \$rdMgmtContext         

- The Adal Context is stored in the global variable \$AdalContext

​Set-RdsMigrationContext -RdsContext \<rdscontext\> -AdalContext \<adalcontext\>

