---
title: Govern an application's existing users in Azure AD with Microsoft PowerShell
description: Planning for a successful access reviews campaign for a particular application includes identifying if any users in that application have access that doesn't derive from Azure AD.
services: active-directory
documentationCenter: ''
author: markwahl-msft
manager: amycolannino
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


#Customer intent: As an IT admin, I want to ensure that access to specific applications is governed by setting up access reviews for those applications. For this, I need to have the existing users of that application assigned to the application in Azure AD.

---

# Govern an application's existing users - Microsoft PowerShell

There are two common scenarios in which it's necessary to populate Azure Active Directory (Azure AD) with existing users of an application before you use the application with an Azure AD identity governance feature such as [access reviews](access-reviews-application-preparation.md).

### Application migrated to Azure AD after using its own identity provider

In the first scenario, the application already exists in the environment. Previously, the application used its own identity provider or data store to track which users had access. 

When you change the application to rely on Azure AD, only users who are in Azure AD and permitted access to that application can access it. As part of that configuration change, you can choose to bring in the existing users from that application's data store into Azure AD. Those users then continue to have access, through Azure AD. 

Having users who are associated with the application represented in Azure AD will enable Azure AD to track users who have access to the application, even though their relationship with the application originated elsewhere. For example, the relationship might have originated in an application's database or directory. 

After Azure AD is aware of a user's assignment, it can send updates to the application's data store. Updates include when that user's attributes change, or when the user goes out of scope of the application.

### Application that doesn't use Azure AD as its only identity provider

In the second scenario, an application doesn't solely rely on Azure AD as its identity provider. 

In some cases, an application might support multiple identity providers or have its own built-in credential storage. This scenario is described as Pattern C in [Preparing for an access review of users' access to an application](access-reviews-application-preparation.md). 

It might not be feasible to remove other identity providers or local credential authentication from the application. In that case, if you want to use Azure AD to review who has access to that application, or remove someone's access from that application, you'll need to create assignments in Azure AD that represent application users who don't rely on Azure AD for authentication.

Having these assignments is necessary if you plan to review all users with access to the application, as part of an access review.

For example, assume that a user is in the application's data store. Azure AD is configured to require role assignments to the application. However, the user doesn't have an application role assignment in Azure AD. 

If the user is updated in Azure AD, no changes will be sent to the application. And if the application's role assignments are reviewed, the user won't be included in the review. To have all the users included in the review, it's necessary to have application role assignments for all users of the application.

## Terminology

This article illustrates the process for managing application role assignments by using the [Microsoft Graph PowerShell cmdlets](https://www.powershellgallery.com/packages/Microsoft.Graph). It uses the following Microsoft Graph terminology.

![Diagram that illustrates Microsoft Graph terminology.](./media/identity-governance-applications-existing-users/data-model-terminology.png)

In Azure AD, a service principal (`ServicePrincipal`) represents an application in a particular organization's directory. `ServicePrincipal` has a property called `AppRoles` that lists the roles that an application supports, such as `Marketing specialist`. `AppRoleAssignment` links a user to a service principal and specifies which role that user has in that application.

You might also be using [Azure AD entitlement management](entitlement-management-overview.md) access packages to give users time-limited access to the application. In entitlement management, `AccessPackage` contains one or more resource roles, potentially from multiple service principals. `AccessPackage` also has assignments (`Assignment`) for users to the access package. 

When you create an assignment for a user to an access package, Azure AD entitlement management automatically creates the necessary `AppRoleAssignment` instances for the user to each application. For more information, see the [Manage access to resources in Azure AD entitlement management](/powershell/microsoftgraph/tutorial-entitlement-management) tutorial on how to create access packages through PowerShell.

## Before you begin

- You must have one of the following licenses in your tenant:

  - Azure AD Premium P2
  - Enterprise Mobility + Security E5 license

- You need to have an appropriate administrative role. If this is the first time you're performing these steps, you need the Global Administrator role to authorize the use of Microsoft Graph PowerShell in your tenant.
- Your application needs a service principal in your tenant:

  - If the application uses an LDAP directory, follow the [guide for configuring Azure AD to provision users into LDAP directories](../app-provisioning/on-premises-ldap-connector-configure.md) through the section to download, install, and configure the Azure AD Connect Provisioning Agent package.
  - If the application uses a SQL database, follow the [guide for configuring Azure AD to provision users into SQL-based applications](../app-provisioning/on-premises-sql-connector-configure.md) through the section to download, install, and configure the Azure AD Connect Provisioning Agent package.

## Collect existing users from an application

The first step toward ensuring that all users are recorded in Azure AD is to collect the list of existing users who have access to the application.  

Some applications might have a built-in command to export a list of current users from the data store. In other cases, the application might rely on an external directory or database. 

In some environments, the application might be located on a network segment or system that isn't appropriate for managing access to Azure AD. So you might need to extract the list of users from that directory or database, and then transfer it as a file to another system that can be used for Azure AD interactions.  

This section explains three approaches for how to get a list of users in a comma-separated values (CSV) file:

* From an LDAP directory
* From a SQL Server database
* From another SQL-based database

### Collect existing users from an application that uses an LDAP directory

This section applies to applications that use an LDAP directory as the underlying data store for users who don't authenticate to Azure AD. Many LDAP directories, such as Active Directory, include a command that outputs a list of users.

1. Identify which of the users in that directory are in scope for being users of the application. This choice will depend n your application's configuration. For some applications, any user who exists in an LDAP directory is a valid user. Other applications might require the user to have a particular attribute or be a member of a group in that directory.

1. Run the command that retrieves that subset of users from your directory. Ensure that the output includes the attributes of users that will be used for matching with Azure AD. Examples of these attributes are employee ID, account name, and email address. 

   For example, this command would produce a CSV file in the current directory with the `userPrincipalName` attribute of every person in the directory:

   ```powershell
   $out_filename = ".\users.csv"
   csvde -f $out_filename -l userPrincipalName,cn -r "(objectclass=person)"
   ```
1. If needed, transfer the CSV file that contains the list of users to a system with the [Microsoft Graph PowerShell cmdlets](https://www.powershellgallery.com/packages/Microsoft.Graph) installed.
1. Continue reading at the [Confirm Azure AD has users that match users from the application](#confirm-azure-ad-has-users-that-match-users-from-the-application) section later in this article.

### Collect existing users from an application's database table by using a SQL Server wizard

This section applies to applications that use SQL Server as the underlying data store.

First, get a list of the users from the tables. Most databases provide a way to export the contents of tables to a standard file format, such as to a CSV file. If the application uses a SQL Server database, you can use the SQL Server Import and Export Wizard to export portions of a database. If you don't have a utility for your database, you can use the ODBC driver with PowerShell, as described in the next section.

1. Log in to the system where SQL Server is installed.
1. Open **SQL Server 2019 Import and Export (64 bit)** or the equivalent for your database.
1. Select the existing database as the source.
1. Select **Flat File Destination** as the destination. Provide a file name, and change the **Code page** value to **65001 (UTF-8)**.
1. Complete the wizard, and select the option to run immediately.
1. Wait for the execution to finish.
1. If needed, transfer the CSV file that contains the list of users to a system with the [Microsoft Graph PowerShell cmdlets](https://www.powershellgallery.com/packages/Microsoft.Graph) installed.
1. Continue reading at the [Confirm Azure AD has users that match users from the application](#confirm-azure-ad-has-users-that-match-users-from-the-application) section later in this article.

### Collect existing users from an application's database table by using PowerShell

This section applies to applications that use another SQL database as the underlying data store, where you're using the [ECMA Connector Host](../app-provisioning/on-premises-sql-connector-configure.md) to provision users into that application. If you haven't yet configured the provisioning agent, use that guide to create the DSN connection file you'll use in this section.

1. Log in to the system where the provisioning agent is or will be installed.
1. Open PowerShell.
1. Construct a connection string for connecting to your database system. 
   
   The components of a connection string depend on the requirements of your database. If you're using SQL Server, see the [list of DSN and connection string keywords and attributes](/sql/connect/odbc/dsn-connection-string-attribute). 
   
   If you're using a different database, you need to include the mandatory keywords for connecting to that database. For example, if your database uses the fully qualified path name of the DSN file, a user ID, and a password, construct the connection string by using the following commands:

   ```powershell
   $filedsn = "c:\users\administrator\documents\db.dsn"
   $db_cs = "filedsn=" + $filedsn + ";uid=p;pwd=secret"
   ```

1. Open a connection to your database and provide the connection string, by using the following commands:

   ```powershell
   $db_conn = New-Object data.odbc.OdbcConnection
   $db_conn.ConnectionString = $db_cs
   $db_conn.Open()
   ```

1. Construct a SQL query to retrieve the users from the database table. Be sure to include the columns that will be used to match users in the application's database with those users in Azure AD. Columns might include employee ID, account name, or email address. 

   For example, if your users are held in a database table named `USERS` that has columns `name` and `email`, enter the following command:

   ```powershell
   $db_query = "SELECT name,email from USERS"

   ```

1. Send the query to the database via the connection:

   ```powershell
   $result = (new-object data.odbc.OdbcCommand($db_query,$db_conn)).ExecuteReader()
   $table = new-object System.Data.DataTable
   $table.Load($result)
   ```
   The result is the list of rows that represents users that were retrieved from the query.

1. Write the result to a CSV file:

   ```powershell
   $out_filename = ".\users.csv"
   $table.Rows | Export-Csv -Path $out_filename -NoTypeInformation -Encoding UTF8
   ```

1. If this system doesn't have the Microsoft Graph PowerShell cmdlets installed or doesn't have connectivity to Azure AD, transfer the CSV file that contains the list of users to a system that has the [Microsoft Graph PowerShell cmdlets](https://www.powershellgallery.com/packages/Microsoft.Graph) installed.

## Confirm Azure AD has users that match users from the application

Now that you have a list of all the users obtained from the application, you'll match those users from the application's data store with users in Azure AD.  

Before you proceed, review the information about [matching users in the source and target systems](../app-provisioning/customize-application-attributes.md#matching-users-in-the-source-and-target--systems). You'll configure Azure AD provisioning with equivalent mappings afterward. That step will allow Azure AD provisioning to query the application's data store with the same matching rules.

### Retrieve the IDs of the users in Azure AD

This section shows how to interact with Azure AD by using [Microsoft Graph PowerShell](https://www.powershellgallery.com/packages/Microsoft.Graph) cmdlets. 

The first time your organization uses these cmdlets for this scenario, you need to be in a Global Administrator role to allow Microsoft Graph PowerShell to be used in your tenant. Subsequent interactions can use a lower-privileged role, such as:

- User Administrator, if you anticipate creating new users.
- Application Administrator or [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator), if you're just managing application role assignments.

1. Open PowerShell.
1. If you don't have the [Microsoft Graph PowerShell modules](https://www.powershellgallery.com/packages/Microsoft.Graph) already installed, install the `Microsoft.Graph.Users` module and others by using this command:

   ```powershell
   Install-Module Microsoft.Graph
   ```

   If you already have the modules installed, ensure that you're using a recent version: 

   ```powershell
   Update-Module microsoft.graph.users,microsoft.graph.identity.governance,microsoft.graph.applications
   ```

1. Connect to Azure AD:

   ```powershell
   $msg = Connect-MgGraph -ContextScope Process -Scopes "User.Read.All,Application.Read.All,AppRoleAssignment.ReadWrite.All,EntitlementManagement.ReadWrite.All"
   ```

1. Read the list of users obtained from the application's data store into the PowerShell session. If the list of users was in a CSV file, you can use the PowerShell cmdlet `Import-Csv` and provide the name of the file from the previous section as an argument. 

   For example, if the file is named *users.csv* and located in the current directory, enter this command:

   ```powershell
   $filename = ".\users.csv"
   $dbusers = Import-Csv -Path $filename -Encoding UTF8
   ```

1. Choose the column of the *users.csv* file that will match with an attribute of a user in Azure AD.

   For example, you might have users in the database where the value in the column named `EMail` is the same value as in the Azure AD attribute `mail`:

   ```powershell
   $db_match_column_name = "EMail"
   $azuread_match_attr_name = "mail"
   ```

1. Retrieve the IDs of those users in Azure AD.

   The following PowerShell script uses the `$dbusers`, `$db_match_column_name`, and `$azuread_match_attr_name` values specified earlier. It will query Azure AD to locate a user that has an attribute with a matching value for each record in the source file. If there are many users in the database, this script might take several minutes to finish.  If you don't have an attribute in Azure AD that has the value, and need to use a `contains` or other filter expression, then you will need to customize this script and that in step 11 below to use a different filter expression.

   ```powershell
   $dbu_not_queried_list = @()
   $dbu_not_matched_list = @()
   $dbu_match_ambiguous_list = @()
   $dbu_query_failed_list = @()
   $azuread_match_id_list = @()
   $azuread_not_enabled_list = @()
   $dbu_values = @()
   $dbu_duplicate_list = @()

   foreach ($dbu in $dbusers) { 
      if ($null -ne $dbu.$db_match_column_name -and $dbu.$db_match_column_name.Length -gt 0) { 
         $val = $dbu.$db_match_column_name
         $escval = $val -replace "'","''"
         if ($dbu_values -contains $escval) { $dbu_duplicate_list += $dbu; continue } else { $dbu_values += $escval }
         $filter = $azuread_match_attr_name + " eq '" + $escval + "'"
         try {
            $ul = @(Get-MgUser -Filter $filter -All -Property Id,accountEnabled -ErrorAction Stop)
            if ($ul.length -eq 0) { $dbu_not_matched_list += $dbu; } elseif ($ul.length -gt 1) {$dbu_match_ambiguous_list += $dbu } else {
               $id = $ul[0].id; 
               $azuread_match_id_list += $id;
               if ($ul[0].accountEnabled -eq $false) {$azuread_not_enabled_list += $id }
            } 
         } catch { $dbu_query_failed_list += $dbu } 
       } else { $dbu_not_queried_list += $dbu }
   }

   ```

1. View the results of the previous queries. See if any of the users in the database couldn't be located in Azure AD, because of errors or missing matches.

   The following PowerShell script will display the counts of records that weren't located:

   ```powershell
   $dbu_not_queried_count = $dbu_not_queried_list.Count
   if ($dbu_not_queried_count -ne 0) {
     Write-Error "Unable to query for $dbu_not_queried_count records as rows lacked values for $db_match_column_name."
   }
   $dbu_duplicate_count = $dbu_duplicate_list.Count
   if ($dbu_duplicate_count -ne 0) {
     Write-Error "Unable to locate Azure AD users for $dbu_duplicate_count rows as multiple rows have the same value"
   }
   $dbu_not_matched_count = $dbu_not_matched_list.Count
   if ($dbu_not_matched_count -ne 0) {
     Write-Error "Unable to locate $dbu_not_matched_count records in Azure AD by querying for $db_match_column_name values in $azuread_match_attr_name."
   }
   $dbu_match_ambiguous_count = $dbu_match_ambiguous_list.Count
   if ($dbu_match_ambiguous_count -ne 0) {
     Write-Error "Unable to locate $dbu_match_ambiguous_count records in Azure AD as attribute match ambiguous."
   }
   $dbu_query_failed_count = $dbu_query_failed_list.Count
   if ($dbu_query_failed_count -ne 0) {
     Write-Error "Unable to locate $dbu_query_failed_count records in Azure AD as queries returned errors."
   }
   $azuread_not_enabled_count = $azuread_not_enabled_list.Count
   if ($azuread_not_enabled_count -ne 0) {
    Write-Error "$azuread_not_enabled_count users in Azure AD are blocked from sign-in."
   }
   if ($dbu_not_queried_count -ne 0 -or $dbu_duplicate_count -ne 0 -or $dbu_not_matched_count -ne 0 -or $dbu_match_ambiguous_count -ne 0 -or $dbu_query_failed_count -ne 0 -or $azuread_not_enabled_count) {
    Write-Output "You will need to resolve those issues before access of all existing users can be reviewed."
   }
   $azuread_match_count = $azuread_match_id_list.Count
   Write-Output "Users corresponding to $azuread_match_count records were located in Azure AD." 
   ```

1. When the script finishes, it will indicate an error if any records from the data source weren't located in Azure AD. If not all the records for users from the application's data store could be located as users in Azure AD, you'll need to investigate which records didn't match and why.  

   For example, someone's email address might have been changed in Azure AD without their corresponding `mail` property being updated in the application's data source. Or, the user might have already left the organization but is still in the application's data source. Or there might be a vendor or super-admin account in the application's data source that does not correspond to any specific person in Azure AD.

1. If there were users who couldn't be located in Azure AD, or weren't active and able to sign in, but you want to have their access reviewed or their attributes updated in the database, you need to update or create Azure AD users for them. You can create users in bulk by using either:

   - A CSV file, as described in [Bulk create users in the Azure AD portal](../enterprise-users/users-bulk-add.md)
   - The [New-MgUser](/powershell/module/microsoft.graph.users/new-mguser?view=graph-powershell-1.0#examples) cmdlet  

   Ensure that these new users are populated with the attributes required for Azure AD to later match them to the existing users in the application.

1. After you add any missing users to Azure AD, run the script from step 6 again. Then run the script from step 7. Check that no errors are reported.

   ```powershell
   $dbu_not_queried_list = @()
   $dbu_not_matched_list = @()
   $dbu_match_ambiguous_list = @()
   $dbu_query_failed_list = @()
   $azuread_match_id_list = @()
   $azuread_not_enabled_list = @()
   $dbu_values = @()
   $dbu_duplicate_list = @()

   foreach ($dbu in $dbusers) { 
      if ($null -ne $dbu.$db_match_column_name -and $dbu.$db_match_column_name.Length -gt 0) { 
         $val = $dbu.$db_match_column_name
         $escval = $val -replace "'","''"
         if ($dbu_values -contains $escval) { $dbu_duplicate_list += $dbu; continue } else { $dbu_values += $escval }
         $filter = $azuread_match_attr_name + " eq '" + $escval + "'"
         try {
            $ul = @(Get-MgUser -Filter $filter -All -Property Id,accountEnabled -ErrorAction Stop)
            if ($ul.length -eq 0) { $dbu_not_matched_list += $dbu; } elseif ($ul.length -gt 1) {$dbu_match_ambiguous_list += $dbu } else {
               $id = $ul[0].id; 
               $azuread_match_id_list += $id;
               if ($ul[0].accountEnabled -eq $false) {$azuread_not_enabled_list += $id }
            } 
         } catch { $dbu_query_failed_list += $dbu } 
       } else { $dbu_not_queried_list += $dbu }
   }

   $dbu_not_queried_count = $dbu_not_queried_list.Count
   if ($dbu_not_queried_count -ne 0) {
     Write-Error "Unable to query for $dbu_not_queried_count records as rows lacked values for $db_match_column_name."
   }
   $dbu_duplicate_count = $dbu_duplicate_list.Count
   if ($dbu_duplicate_count -ne 0) {
     Write-Error "Unable to locate Azure AD users for $dbu_duplicate_count rows as multiple rows have the same value"
   }
   $dbu_not_matched_count = $dbu_not_matched_list.Count
   if ($dbu_not_matched_count -ne 0) {
     Write-Error "Unable to locate $dbu_not_matched_count records in Azure AD by querying for $db_match_column_name values in $azuread_match_attr_name."
   }
   $dbu_match_ambiguous_count = $dbu_match_ambiguous_list.Count
   if ($dbu_match_ambiguous_count -ne 0) {
     Write-Error "Unable to locate $dbu_match_ambiguous_count records in Azure AD as attribute match ambiguous."
   }
   $dbu_query_failed_count = $dbu_query_failed_list.Count
   if ($dbu_query_failed_count -ne 0) {
     Write-Error "Unable to locate $dbu_query_failed_count records in Azure AD as queries returned errors."
   }
   $azuread_not_enabled_count = $azuread_not_enabled_list.Count
   if ($azuread_not_enabled_count -ne 0) {
    Write-Error "$azuread_not_enabled_count users in Azure AD are blocked from sign-in."
   }
   if ($dbu_not_queried_count -ne 0 -or $dbu_duplicate_count -ne 0 -or $dbu_not_matched_count -ne 0 -or $dbu_match_ambiguous_count -ne 0 -or $dbu_query_failed_count -ne 0 -or $azuread_not_enabled_count -ne 0) {
    Write-Output "You will need to resolve those issues before access of all existing users can be reviewed."
   }
   $azuread_match_count = $azuread_match_id_list.Count
   Write-Output "Users corresponding to $azuread_match_count records were located in Azure AD." 
   ```

## Check for users who are not already assigned to the application

The previous steps have confirmed that all the users in the application's data store exist as users in Azure AD. However, they might not all currently be assigned to the application's roles in Azure AD. So the next steps are to see which users don't have assignments to application roles.

1. Retrieve the users who currently have assignments to the application in Azure AD.

   For example, if the enterprise application is named `CORPDB1`, enter the following commands:

   ```powershell
   $azuread_app_name = "CORPDB1"
   $azuread_sp_filter = "displayName eq '" + ($azuread_app_name -replace "'","''") + "'"
   $azuread_sp = Get-MgServicePrincipal -Filter $azuread_sp_filter -All
   $azuread_existing_assignments = @(Get-MgServicePrincipalAppRoleAssignedTo -ServicePrincipalId $azuread_sp.Id -All)
   ```

1. Compare the list of user IDs from the previous section to those users currently assigned to the application:

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

   If zero users are *not* assigned to application roles, indicating that all users *are* assigned to application roles, you don't need to make any further changes before performing an access review.

   However, if one or more users aren't currently assigned to the application roles, you'll need to continue the procedure and add them to one of the application's roles.

1. Select the role of the application to assign the remaining users to.

   An application might have more than one role. Use this command to list the available roles:

   ```powershell
   $azuread_sp.AppRoles | where-object {$_.AllowedMemberTypes -contains "User"} | ft DisplayName,Id
   ```

   Select the appropriate role from the list, and obtain its role ID. For example, if the role name is `Admin`, provide that value in the following PowerShell commands:

   ```powershell
   $azuread_app_role_name = "Admin"
   $azuread_app_role_id = ($azuread_sp.AppRoles | where-object {$_.AllowedMemberTypes -contains "User" -and $_.DisplayName -eq $azuread_app_role_name}).Id
   if ($null -eq $azuread_app_role_id) { write-error "role $azuread_app_role_name not located in application manifest"}
   ```

## Configure application provisioning

Before you create new assignments, configure [provisioning of Azure AD users](../app-provisioning/user-provisioning.md) to the application. Configuring provisioning will enable Azure AD to match up the users in Azure AD with the application role assignments to the users already in the application's data store.

1. Ensure that the application is configured to require users to have application role assignments, so that only selected users will be provisioned to the application.
1. If provisioning hasn't been configured for the application, configure it now (but don't start provisioning):

   * If the application uses an LDAP directory, follow the [guide for configuring Azure AD to provision users into LDAP directories](../app-provisioning/on-premises-ldap-connector-configure.md).
   * If the application uses a SQL database, follow the [guide for configuring Azure AD to provision users into SQL-based applications](../app-provisioning/on-premises-sql-connector-configure.md).
   * For other applications, follow steps 1-3 to [configure provisioning via Graph APIs](../app-provisioning/application-provisioning-configuration-api.md).

1. Check the [attribute mappings](../app-provisioning/customize-application-attributes.md) for provisioning to that application. Make sure that **Match objects using this attribute** is set for the Azure AD attribute and column that you used in the previous sections for matching.  

   If these rules aren't using the same attributes that you used earlier, then when application role assignments are created, Azure AD might be unable to locate existing users in the application's data store. Azure AD might then inadvertently create duplicate users.
1. Check that there's an attribute mapping for `isSoftDeleted` to an attribute of the application. 

   When a user is unassigned from the application, soft-deleted in Azure AD, or blocked from sign-in, Azure AD provisioning will update the attribute mapped to `isSoftDeleted`. If no attribute is mapped, users who later are unassigned from the application role will continue to exist in the application's data store.
1. If provisioning has already been enabled for the application, check that the application provisioning is not in [quarantine](../app-provisioning/application-provisioning-quarantine-status.md). Resolve any issues that are causing the quarantine before you proceed.

## Create app role assignments in Azure AD

For Azure AD to match the users in the application with the users in Azure AD, you need to create application role assignments in Azure AD.

When an application role assignment is created in Azure AD for a user to an application, then:

- Azure AD will query the application to determine if the user already exists.
- Subsequent updates to the user's attributes in Azure AD will be sent to the application.
- The user will remain in the application indefinitely unless they're updated outside Azure AD, or until the assignment in Azure AD is removed.
- On the next review of that application's role assignments, the user will be included in the review.
- If the user is denied in an access review, their application role assignment will be removed. Azure AD will notify the application that the user is blocked from sign-in.

1. Create application role assignments for users who don't currently have role assignments:

   ```powershell
   foreach ($u in $azuread_not_in_role_list) {
      $res = New-MgServicePrincipalAppRoleAssignedTo -ServicePrincipalId $azuread_sp.Id -AppRoleId $azuread_app_role_id -PrincipalId $u -ResourceId $azuread_sp.Id 
   }
   ```

1. Wait one minute for changes to propagate within Azure AD.

## Check that Azure AD provisioning has matched the existing users

1. Query Azure AD to obtain the updated list of role assignments:

   ```powershell
   $azuread_existing_assignments = @(Get-MgServicePrincipalAppRoleAssignedTo -ServicePrincipalId $azuread_sp.Id -All)
   ```

1. Compare the list of user IDs from the previous section to those users now assigned to the application:

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

1. If **Provisioning Status** for the application is **Off**, turn it to **On**.  You can also start provisioning [using Graph APIs](../app-provisioning/application-provisioning-configuration-api.md#step-4-start-the-provisioning-job).
1. Based on the guidance for [how long will it take to provision users](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users), wait for Azure AD provisioning to match the existing users of the application to those users just assigned.
1. Monitor the [provisioning status](../app-provisioning/check-status-user-account-provisioning.md) through the Portal or [Graph APIs](../app-provisioning/application-provisioning-configuration-api.md#monitor-the-provisioning-job-status) to ensure that all users were matched successfully.

   If you don't see users being provisioned, check the [troubleshooting guide for no users being provisioned](../app-provisioning/application-provisioning-config-problem-no-users-provisioned.md). If you see an error in the provisioning status and are provisioning to an on-premises application, check the [troubleshooting guide for on-premises application provisioning](../app-provisioning/on-premises-ecma-troubleshoot.md).

1. Check the provisioning log through the [Azure portal](../reports-monitoring/concept-provisioning-logs.md) or [Graph APIs](../app-provisioning/application-provisioning-configuration-api.md#monitor-provisioning-events-using-the-provisioning-logs).  Filter the log to the status **Failure**.  If there are failures with an ErrorCode of **DuplicateTargetEntries**,  this indicates an ambiguity in your provisioning matching rules, and you'll need to update the Azure AD users or the mappings that are used for matching to ensure each Azure AD user matches one application user.  Then filter the log to the action **Create** and status **Skipped**.  If users were skipped with the SkipReason code of **NotEffectivelyEntitled**, this may indicate that the user accounts in Azure AD were not matched because the user account status was **Disabled**.

After the Azure AD provisioning service has matched the users based on the application role assignments you've created, subsequent changes will be sent to the application.

## Next steps

 - [Prepare for an access review of users' access to an application](access-reviews-application-preparation.md)
