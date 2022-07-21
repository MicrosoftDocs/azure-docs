---
title: Governing an application's existing users in Azure AD with Microsoft PowerShell
description: Planning for a successful access reviews campaign for a particular application includes identifying if there are any users in that application whose access doesn't derive from Azure AD.
services: active-directory
documentationCenter: ''
author: markwahl-msft
manager: karenhoran
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 06/24/2022
ms.author: mwahl
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As an IT admin, I want to ensure access to specific applications is governed, by setting up access reviews for those applications.  For this, I need to have in Azure AD the existing users of that application assigned to the application.

---

# Governing an application's existing users - Microsoft PowerShell

There are two common scenarios in which it's necessary to populate Azure Active Directory (Azure AD) with existing users of an application, prior to using the application with an Azure AD identity governance feature such as [access reviews](access-reviews-application-preparation.md).

### Application migrated to Azure AD after using its own identity provider

The first scenario is one in which the application already exists in the environment, and previously used its own identity provider or data store to track which users had access. When you change the application to rely upon Azure AD, then only users who are in Azure AD and permitted access to that application can access it.  As part of that configuration change, you can choose to bring in the existing users from that application's data store into Azure AD, so that those users continue to have access, through Azure AD. Having the users associated with the application represented in Azure AD will enable Azure AD to track users with access to the application, even though the user's relationship with the application originated elsewhere, such as in an applications' database or directory.  Once Azure AD is aware of a user's assignment, Azure AD will be able send updates to the application's data store when that user's attributes change, or when the user goes out of scope of the application.

### Application that doesn't use Azure AD as its only identity provider

The second scenario is one in which an application doesn't solely rely upon Azure AD as its identity provider.  In some cases, an application might support multiple identity providers, or have its own built-in credential storage. This scenario is described as Pattern C in [preparing for an access review of user's access to an application](access-reviews-application-preparation.md). If it isn't feasible to remove other identity providers or local credential authentication from the application, then in order to be able to use Azure AD to review who has access to that application, or remove someone's access from that application, you'll need to create assignments in Azure AD that represent the access by users of the application, those users who don't rely upon Azure AD for authentication.  Having these assignments is necessary if you plan to review all users with access to the application, as part of an access review.

For example, there's a user who's in the application's data store and Azure AD is configured to require role assignments to the application, however, the user doesn't have an application role assignment in Azure AD.  If the user is updated in Azure AD, then no changes will be sent to the application. And if the application's role assignments are reviewed, the user won't be included in the review. To have all the users included in the review, then it's necessary to have application role assignments for all users of the application.

## Terminology

This article illustrates the process for managing application role assignments using the [Microsoft Graph PowerShell cmdlets](https://www.powershellgallery.com/packages/Microsoft.Graph) and so uses Microsoft Graph terminology.

![Terminology](./media/identity-governance-applications-existing-users/data-model-terminology.png)

In Azure AD, a `ServicePrincipal` represents an application in a particular organization's directory.  The `ServicePrincipal` has a property `AppRoles` that lists the roles an application supports, such as `Marketing specialist`.  An `AppRoleAssignment` links a `User` to a Service principal and specifies which role that user has in that application.

You may also be using [Azure AD entitlement management](entitlement-management-overview.md) access packages to give users time-limited access to the application. In entitlement management, an `AccessPackage` contains one or more resource roles, potentially from multiple service principals, and has `Assignment` for users to the access package.  When you create an assignment for a user to an access package, then Azure AD entitlement management automatically creates the necessary `AppRoleAssignment` for the user to each application.  For more information, see the [Manage access to resources in Azure AD entitlement management](/powershell/microsoftgraph/tutorial-entitlement-management) tutorial on how to create access packages through PowerShell.

## Before you begin

- You must have one of the following licenses in your tenant:

  - Azure AD Premium P2
  - Enterprise Mobility + Security (EMS) E5 license

- You'll need to have an appropriate administrative role. If this is the first time you're performing these steps, you'll need the `Global administrator` role to authorize the use of Microsoft Graph PowerShell in your tenant.
- There needs to be a service principal for your application in your tenant.

  - If the application uses an LDAP directory, follow the guide for [configuring Azure AD to provision users into LDAP directories](/azure/active-directory/app-provisioning/on-premises-ldap-connector-configure) through the section to Download, install, and configure the Azure AD Connect Provisioning Agent Package.
  - If the application uses a SQL database, follow the guide for [configuring Azure AD to provision users into SQL based applications](/azure/active-directory/app-provisioning/on-premises-sql-connector-configure) through the section to Download, install and configure the Azure AD Connect Provisioning Agent Package.


## Collect existing users from an application

The first step to ensuring all users are recorded in Azure AD, is to collect the list of existing users who have access to the application.  Some applications may have a built-in command to export a list of current users from its data store. In other cases, the application may rely upon an external directory or database.  In some environments, the application may be located on a network segment or system that isn't appropriate for use for managing access to Azure AD, so you might need to extract the list of users from that directory or database, and then transfer it as a file to another system that can be used for Azure AD interactions.  This section explains three approaches for how to get a list of users, held in a comma separated text file (CSV),

* From an LDAP directory
* From a SQL Server database
* From another SQL-based database

### Collect existing users from an application that uses an LDAP directory

This section applies to applications that use an LDAP directory as its underlying data store for users who don't authenticate to Azure AD.

Many LDAP directories, such as Active Directory, include a command that outputs a list of users.

1. Identify which of the users in that directory are in scope of being users of the application. This choice will be dependent upon your application's configuration. For some applications, any user who exists in an LDAP directory is a valid user.  Other applications may require the user to have a particular attribute or be a member of a group in that directory.

1. Run the command that retrieves that subset of users from your directory. Ensure that the output includes the attributes of users that will be used for matching with Azure AD - such as an employee ID, account name or email address. For example, this command would produce a CSV file in the current directory with the `userPrincipalName` attribute of every person in the directory.

   ```powershell
   $out_filename = ".\users.csv"
   csvde -f $out_filename -l userPrincipalName,cn -r "(objectclass=person)"
   ```
1. If needed, transfer the CSV file containing the list of users to a system with the [Microsoft Graph PowerShell cmdlets](https://www.powershellgallery.com/packages/Microsoft.Graph) installed.
1. Continue reading at the section below, **Confirm Azure AD has users for each user from the application**.

### Collect existing users from an application's database table using a SQL Server wizard

This section applies to applications that use SQL Server as its underlying data store.

First, get a list of the users from the tables. Most databases provide a way to export the contents of tables to a standard file format, such as to a CSV file.  If the application uses a SQL Server database, you can use the **SQL Server Import and Export Wizard** to export portions of a database.  If you don't have a utility for your database, you can use the ODBC driver with PowerShell, described in the next section.

1. Log in to the system where SQL Server is installed.
1. Launch **SQL Server 2019 Import and Export (64 bit)** or the equivalent for your database.
1. Select the existing database as the source.
1. Select **Flat File Destination** as the destination.  Provide a file name, and change the **Code page** to **65001 (UTF-8)**.
1. Complete the wizard, and select to run immediately.
1. Wait for the execution to complete.
1. If needed, transfer the CSV file containing the list of users to a system with the [Microsoft Graph PowerShell cmdlets](https://www.powershellgallery.com/packages/Microsoft.Graph) installed.
1. Continue reading at the section below, **Confirm Azure AD has users for each user from the application**.

### Collect existing users from an application's database table using PowerShell

This section applies to applications that use another SQL database as its underlying data store, where you're using the [ECMA Connector Host](/azure/active-directory/app-provisioning/on-premises-sql-connector-configure) to provision users into that application.  If you've not yet configured the provisioning agent, use that guide to create the DSN connection file you'll use in this section.

1. Log in to the system where the provisioning agent is or will be installed.
1. Launch PowerShell.
1. Construct a connection string for connecting to your database system. The components of a connection string will depend upon the requirements of your database. If you are using SQL Server, then see the [list of DSN and Connection String Keywords and Attributes](/sql/connect/odbc/dsn-connection-string-attribute). If you are using a different database, then you'll need to include the mandatory keywords for connecting to that database. For example, if your database uses the fully-qualified pathname of the DSN file, a userID and password, then construct the connection string using the following commands.

   ```powershell
   $filedsn = "c:\users\administrator\documents\db.dsn"
   $db_cs = "filedsn=" + $filedsn + ";uid=p;pwd=secret"
   ```

1. Open a connection to your database, providing that connection string, using the following commands.

   ```powershell
   $db_conn = New-Object data.odbc.OdbcConnection
   $db_conn.ConnectionString = $db_cs
   $db_conn.Open()
   ```

1. Construct a SQL query to retrieve the users from the database table.  Be sure to include the columns that will be used to match users in the application's database with those users in Azure AD, such as an employee ID, account name or email address.  For example, if your users are held in a database table named `USERS` and have columns `name` and `email`, then type the following command.

   ```powershell
   $db_query = "SELECT name,email from USERS"

   ```

1. Send the query to the database via the connection, and retrieve the results.

   ```powershell
   $result = (new-object data.odbc.OdbcCommand($db_query,$db_conn)).ExecuteReader()
   $table = new-object System.Data.DataTable
   $table.Load($result)
   ```

1. Write the result, the list of rows representing users that were retrieved from the query, to a CSV file.

   ```powershell
   $out_filename = ".\users.csv"
   $table.Rows | Export-Csv -Path $out_filename -NoTypeInformation -Encoding UTF8
   ```

1. If this system doesn't have the Microsoft Graph PowerShell cmdlets installed, or doesn't have connectivity to Azure AD, then transfer the CSV file that was generated in the previous step, containing the list of users, to a system that has the [Microsoft Graph PowerShell cmdlets](https://www.powershellgallery.com/packages/Microsoft.Graph) installed.

## Confirm Azure AD has users for each user from the application

Now that you have a list of all the users obtained from the application, you'll next match those users from the application's data store with users in Azure AD.  Before proceeding, review the section on [matching users in the source and target systems](/azure/active-directory/app-provisioning/customize-application-attributes#matching-users-in-the-source-and-target--systems), as you'll configure Azure AD provisioning with equivalent mappings afterwards.  That step will allow Azure AD provisioning to query the application's data store with the same matching rules.

### Retrieve the IDs of the users in Azure AD

This section shows how to interact with Azure AD using [Microsoft Graph PowerShell](https://www.powershellgallery.com/packages/Microsoft.Graph) cmdlets. The first time your organization use these cmdlets for this scenario, you'll need to be in a Global Administrator role to consent Microsoft Graph PowerShell to be used for these scenarios in your tenant.  Subsequent interactions can use a lower privileged role, such as User Administrator role if you anticipate creating new users, or the Application Administrator or [Identity Governance Administrator](/azure/active-directory/roles/permissions-reference#identity-governance-administrator) role, if you're just managing application role assignments.

1. Launch PowerShell.
1. If you don't have the [Microsoft Graph PowerShell modules](https://www.powershellgallery.com/packages/Microsoft.Graph) already installed, install the `Microsoft.Graph.Users` module and others using

   ```powershell
   Install-Module Microsoft.Graph
   ```

1. If you already have the modules installed, ensure you are using a recent version. 

   ```powershell
   Update-Module microsoft.graph.users,microsoft.graph.identity.governance,microsoft.graph.applications
   ```

1. Connect to Azure AD.

   The first time you run these scripts, you'll need to be an administrator, to be able to consent Microsoft Graph PowerShell for these permissions.

   ```powershell
   $msg = Connect-MgGraph -ContextScope Process -Scopes "User.Read.All,Application.Read.All,AppRoleAssignment.ReadWrite.All,EntitlementManagement.ReadWrite.All"
   ```

1. Read the list of users obtained from the application's data store into the PowerShell session. If the list of users was in a CSV file, then you can use the PowerShell cmdlet `Import-Csv` and provide the filename of the file from the previous section as an argument. For example, if the file is named `users.csv` and located in the current directory, type the command

   ```powershell
   $filename = ".\users.csv"
   $dbusers = Import-Csv -Path $filename -Encoding UTF8
   ```

1. Pick the column of the `users` file that will match with an attribute of a user in Azure AD.

   For example, you might have users in the database where the value in the column named `EMail` is the same value as in the Azure AD attribute `mail`.

   ```powershell
   $db_match_column_name = "EMail"
   $azuread_match_attr_name = "mail"
   ```

1. Retrieve the IDs of those users in Azure AD.

   The following PowerShell script will use the `$dbusers`, `$db_match_column_name` and `$azuread_match_attr_name` specified above, and will query Azure AD to locate a user that has a matching value for each record in the source file.  If there are many users in the database, this script may take several minutes to complete.

   ```powershell
   $dbu_not_queried_list = @()
   $dbu_not_matched_list = @()
   $dbu_match_ambiguous_list = @()
   $dbu_query_failed_list = @()
   $azuread_match_id_list = @()

   foreach ($dbu in $dbusers) { 
      if ($null -ne $dbu.$db_match_column_name -and $dbu.$db_match_column_name.Length -gt 0) { 
         $val = $dbu.$db_match_column_name
         $escval = $val -replace "'","''"
         $filter = $azuread_match_attr_name + " eq '" + $escval + "'"
         try {
            $ul = @(Get-MgUser -Filter $filter -All -ErrorAction Stop)
            if ($ul.length -eq 0) { $dbu_not_matched_list += $dbu; } elseif ($ul.length -gt 1) {$dbu_match_ambiguous_list += $dbu } else {
               $id = $ul[0].id; 
               $azuread_match_id_list += $id;
            } 
         } catch { $dbu_query_failed_list += $dbu } 
       } else { $dbu_not_queried_list += $dbu }
   }

   ```

1. View the results of the previous queries to see if any of the users in the database couldn't be located in Azure AD, due to errors or missing matches.

   The following PowerShell script will display the counts of records that weren't located.

   ```powershell
   $dbu_not_queried_count = $dbu_not_queried_list.Count
   if ($dbu_not_queried_count -ne 0) {
     Write-Error "Unable to query for $dbu_not_queried_count records as rows lacked values for $db_match_column_name."
   }
   $dbu_not_matched_count = $dbu_not_matched_list.Count
   if ($dbu_not_matched_count -ne 0) {
     Write-Error "Unable to locate $dbu_not_matched_count records in Azure AD by querying for $db_match_column_name values in $azuread_match_attr_name."
   }
   $dbu_match_ambiguous_count = $dbu_match_ambiguous_list.Count
   if ($dbu_match_ambiguous_count -ne 0) {
     Write-Error "Unable to locate $dbu_match_ambiguous_count records in Azure AD."
   }
   $dbu_query_failed_count = $dbu_query_failed_list.Count
   if ($dbu_query_failed_count -ne 0) {
     Write-Error "Unable to locate $dbu_query_failed_count records in Azure AD as queries returned errors."
   }
   if ($dbu_not_queried_count -ne 0 -or $dbu_not_matched_count -ne 0 -or $dbu_match_ambiguous_count -ne 0 -or $dbu_query_failed_count -ne 0) {
    Write-Output "You will need to resolve those issues before access of all existing users can be reviewed."
   }
   $azuread_match_count = $azuread_match_id_list.Count
   Write-Output "Users corresponding to $azuread_match_count records were located in Azure AD." 
   ```

1. When the script completes, it will indicate an error if there were any records from the data source that weren't located in Azure AD.  If not all the records for users from the application's data store could be located as users in Azure AD, then you'll need to investigate which records didn't match and why.  For example, someone's email address may have been changed in Azure AD without their corresponding `mail` property being updated in the application's data source.  Or, they may have already left the organization, but still be in the application's data source.  Or there might be a vendor or super-admin account in the application's data source who does not correspond to any specific person in Azure AD.

1. If there were users that couldn't be located in Azure AD, but you want to have their access be reviewed or their attributes updated in the database, you'll need to create Azure AD users for the users that could not be located.  You can create users in bulk using either a CSV file, as described in [bulk create users in the Azure AD portal](../enterprise-users/users-bulk-add.md), or by using the [New-MgUser](/powershell/module/microsoft.graph.users/new-mguser?view=graph-powershell-1.0#examples) cmdlet.  When doing so, ensure that the users are populated with the attributes required for Azure AD to later match these new users to the existing users in the application.

1. After adding any missing users to Azure AD, then run the script from step 7 above again, and then the script from step 8, and check that no errors are reported.

   ```powershell
   $dbu_not_queried_list = @()
   $dbu_not_matched_list = @()
   $dbu_match_ambiguous_list = @()
   $dbu_query_failed_list = @()
   $azuread_match_id_list = @()

   foreach ($dbu in $dbusers) { 
      if ($null -ne $dbu.$db_match_column_name -and $dbu.$db_match_column_name.Length -gt 0) { 
         $val = $dbu.$db_match_column_name
         $escval = $val -replace "'","''"
         $filter = $azuread_match_attr_name + " eq '" + $escval + "'"
         try {
            $ul = @(Get-MgUser -Filter $filter -All -ErrorAction Stop)
            if ($ul.length -eq 0) { $dbu_not_matched_list += $dbu; } elseif ($ul.length -gt 1) {$dbu_match_ambiguous_list += $dbu } else {
               $id = $ul[0].id; 
               $azuread_match_id_list += $id;
            } 
         } catch { $dbu_query_failed_list += $dbu } 
       } else { $dbu_not_queried_list += $dbu }
   }

   $dbu_not_queried_count = $dbu_not_queried_list.Count
   if ($dbu_not_queried_count -ne 0) {
     Write-Error "Unable to query for $dbu_not_queried_count records as rows lacked values for $db_match_column_name."
   }
   $dbu_not_matched_count = $dbu_not_matched_list.Count
   if ($dbu_not_matched_count -ne 0) {
     Write-Error "Unable to locate $dbu_not_matched_count records in Azure AD by querying for $db_match_column_name values in $azuread_match_attr_name."
   }
   $dbu_match_ambiguous_count = $dbu_match_ambiguous_list.Count
   if ($dbu_match_ambiguous_count -ne 0) {
     Write-Error "Unable to locate $dbu_match_ambiguous_count records in Azure AD."
   }
   $dbu_query_failed_count = $dbu_query_failed_list.Count
   if ($dbu_query_failed_count -ne 0) {
     Write-Error "Unable to locate $dbu_query_failed_count records in Azure AD as queries returned errors."
   }
   if ($dbu_not_queried_count -ne 0 -or $dbu_not_matched_count -ne 0 -or $dbu_match_ambiguous_count -ne 0 -or $dbu_query_failed_count -ne 0) {
    Write-Output "You will need to resolve those issues before access of all existing users can be reviewed."
   }
   $azuread_match_count = $azuread_match_id_list.Count
   Write-Output "Users corresponding to $azuread_match_count records were located in Azure AD." 
   ```

## Check for users who are not already assigned to the application

The previous steps have confirmed that all the users in the application's data store exist as users in Azure AD.  However, they may not all currently be assigned to the application's roles in Azure AD.  So the next steps are to see which users don't have assignments to application roles.

1. Retrieve the users who currently have assignments to the application in Azure AD.

   For example, if the enterprise application is named `CORPDB1`, then type the following commands

   ```powershell
   $azuread_app_name = "CORPDB1"
   $azuread_sp_filter = "displayName eq '" + ($azuread_app_name -replace "'","''") + "'"
   $azuread_sp = Get-MgServicePrincipal -Filter $azuread_sp_filter -All
   $azuread_existing_assignments = @(Get-MgServicePrincipalAppRoleAssignedTo -ServicePrincipalId $azuread_sp.Id -All)
   ```

1. Compare the list of user IDs from the previous section to those users currently assigned to the application.

   ```powershell
   $azuread_not_in_role_list = @()
   foreach ($id in $azuread_match_id_list) {
      $found = $false
      foreach ($existing in $azuread_existing_assignments) {
         if ($existing.principalId -eq $id) {
            $found = $true; break;
         }
      }
      if ($found -eq $false) { $azuread_not_in_role_list += $id }
   }
   $azuread_not_in_role_count = $azuread_not_in_role_list.Count
   Write-Output "$azuread_not_in_role_count users in the application's data store are not assigned to the application roles."
   ```

   If 0 users aren't assigned to application roles, indicating that all users are assigned to application roles, then no further changes are needed before performing an access review.

   However, if one or more users aren't currently assigned to the application roles, you'll need to add them to one of the application's roles, as described in the sections below.

1. Select the role of the application to assign the remaining users to.

   An application may have more than one role.  Use this command to list the available roles.

   ```powershell
   $azuread_sp.AppRoles | where-object {$_.AllowedMemberTypes -contains "User"} | ft DisplayName,Id
   ```

   Select the appropriate role from the list, and obtain its role ID.  For example, if the role name is `Admin`, then provide that value in the following PowerShell commands.

   ```powershell
   $azuread_app_role_name = "Admin"
   $azuread_app_role_id = ($azuread_sp.AppRoles | where-object {$_.AllowedMemberTypes -contains "User" -and $_.DisplayName -eq $azuread_app_role_name}).Id
   if ($null -eq $azuread_app_role_id) { write-error "role $azuread_app_role_name not located in application manifest"}
   ```

## Configure application provisioning

Before creating new assignments, you'll want to configure [Azure AD provisioning](/azure/active-directory/app-provisioning/user-provisioning) of Azure AD users to the application.  Configuring provisioning will enable Azure AD to match up the users in Azure AD with the application role assignments to the users already in the application's data store.

1. Ensure that the application is configured to require users to have application role assignments, so that only selected users will be provisioned to the application.
1. If provisioning hasn't been configured for the application, then configure, but do not start, [provisioning](/azure/active-directory/app-provisioning/user-provisioning).

   * If the application uses an LDAP directory, follow the guide for [configuring Azure AD to provision users into LDAP directories](/azure/active-directory/app-provisioning/on-premises-ldap-connector-configure).
   * If the application uses a SQL database, follow the guide for [configuring Azure AD to provision users into SQL based applications](/azure/active-directory/app-provisioning/on-premises-sql-connector-configure).

1. Check the [attribute mappings](/azure/active-directory/app-provisioning/customize-application-attributes) for provisioning to that application.  Make sure that *Match objects using this attribute* is set for the Azure AD attribute and column that you used in the sections above for matching.  If these rules aren't using the same attributes as you used earlier, then when application role assignments are created, Azure AD may be unable to locate existing users in the applications' data store, and inadvertently create duplicate users.
1. Check that there's an attribute mapping for **isSoftDeleted** to an attribute of the application.  When a user is unassigned from the application, soft-deleted in Azure AD, or blocked from sign-in, then Azure AD provisioning will update the attribute mapped to **isSoftDeleted**.  If no attribute is mapped, then users who later are unassigned from the application role will continue to exist in the application's data store.
1. If provisioning has already been enabled for the application, check that the application provisioning is not in [quarantine](/azure/active-directory/app-provisioning/application-provisioning-quarantine-status). You'll need to resolve any issues that are causing the quarantine prior to proceeding.

## Create app role assignments in Azure AD

For Azure AD to match the users in the application with the users in Azure AD, you'll need to create application role assignments in Azure AD.

When an application role assignment is created in Azure AD for a user to application, then

  - Azure AD will query the application to determine if the user already exists.
  - Subsequent updates to the user's attributes in Azure AD will be sent to the application.
  - Users will remain in the application indefinitely, unless updated outside of Azure AD, or until the assignment in Azure AD is removed.
  - On the next review of that application's role assignments, the user will be included in the review.
  - If the user is denied in an access review, then their application role assignment will be removed, and Azure AD will notify the application that the user is blocked from sign in.

1. Create application role assignments for users who don't currently have role assignments.

   ```powershell
   foreach ($u in $azuread_not_in_role_list) {
      $res = New-MgServicePrincipalAppRoleAssignedTo -ServicePrincipalId $azuread_sp.Id -AppRoleId $azuread_app_role_id -PrincipalId $u -ResourceId $azuread_sp.Id 
   }
   ```

1. Wait 1 minute for changes to propagate within Azure AD.

## Check that Azure AD provisioning has matched the existing users

1. Requery Azure AD to obtain the updated list of role assignments.

   ```powershell
   $azuread_existing_assignments = @(Get-MgServicePrincipalAppRoleAssignedTo -ServicePrincipalId $azuread_sp.Id -All)
   ```

1. Compare the list of user IDs from the previous section to those users now assigned to the application.

   ```powershell
   $azuread_still_not_in_role_list = @()
   foreach ($id in $azuread_match_id_list) {
      $found = $false
      foreach ($existing in $azuread_existing_assignments) {
         if ($existing.principalId -eq $id) {
            $found = $true; break;
         }
      }
      if ($found -eq $false) { $azuread_still_not_in_role_list += $id }
   }
   $azuread_still_not_in_role_count = $azuread_still_not_in_role_list.Count
   if ($azuread_still_not_in_role_count -gt 0) {
      Write-Output "$azuread_still_not_in_role_count users in the application's data store are not assigned to the application roles."
   }
   ```

   If any users aren't assigned to application roles, check the Azure AD audit log for an error from a previous step.

1. If the **Provisioning Status** of the application is **Off**, turn the **Provisioning Status** to **On**.
1. Based on the guidance for [how long will it take to provision users](/azure/active-directory/app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user#how-long-will-it-take-to-provision-users), wait for Azure AD provisioning to match the existing users of the application to those users just assigned.
1. Monitor the [provisioning status](/azure/active-directory/app-provisioning/check-status-user-account-provisioning) to ensure that all users were matched successfully.  If you don't see users being provisioned, check the troubleshooting guide for [no users being provisioned](/azure/active-directory/app-provisioning/application-provisioning-config-problem-no-users-provisioned).  If you see an error in the provisioning status and are provisioning to an on-premises application, then check the [troubleshooting guide for on-premises application provisioning](/azure/active-directory/app-provisioning/on-premises-ecma-troubleshoot).

Once the users have been matched by the Azure AD provisioning service, based on the application role assignments you've created, then subsequent changes will be sent to the application.

## Next steps

 - [Prepare for an access review of users' access to an application](access-reviews-application-preparation.md)
