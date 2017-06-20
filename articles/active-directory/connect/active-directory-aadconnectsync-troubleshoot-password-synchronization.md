---
title: Troubleshoot password synchronization with Azure AD Connect sync | Microsoft Docs
description: Provides information about how to troubleshoot passowrd synchronziation problems
services: active-directory
documentationcenter: ''
author: AndKjell
manager: femila
editor: ''

ms.assetid:
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/28/2017
ms.author: billmath

---
# Troubleshoot password synchronization with Azure AD Connect sync
This topic provides steps for how to troubleshoot issues with password synchronization. If passwords are not synchronizing as expected, it can either be for a subset of users or for all users. For Azure AD Connect deployment with **version 1.1.524.0 and after**, there is now a diagnostic cmdlet that can be used to troubleshoot password synchronization issues:

* If you have an issue where no passwords are synchronized, refer to section [No passwords are synchronized - Troubleshoot using diagnostic cmdlet](#no-passwords-are-synchronized---troubleshoot-using-diagnostic-cmdlet).

* If you have an issue with individual objects, refer to section [One object is not synchronizing passwords - Troubleshoot using diagnostic cmdlet](#one-object-is-not-synchronizing-passwords---troubleshoot-using-diagnostic-cmdlet).

For older versions of Azure AD Connect deployment:

* If you have an issue where no passwords are synchronized, refer to section [No passwords are synchronized - Manual troubleshooting steps](#no-passwords-are-synchronized---manual-troubleshooting-steps).

* If you have an issue with individual objects, refer to section [One object is not synchronizing passwords - Manual troubleshooting steps](#one-object-is-not-synchronizing-passwords---manual-troubleshooting-steps).

## No passwords are synchronized - Troubleshoot using diagnostic cmdlet
You can use the **Invoke-ADSyncDiagnostics** cmdlet to figure out why no passwords are synchronized.

> [!NOTE]
> The **Invoke-ADSyncDiagnostics** cmdlet is only available for Azure AD Connect version 1.1.524.0 and after.

### How to run the diagnostics cmdlet
To troubleshoot issues where no passwords are synchronized:

1. Open a new Windows PowerShell session on your Azure AD Connect server with **Run as Administrator** option.

2. Run `Set-ExecutionPolicy RemoteSigned` or `Set-ExecutionPolicy Unrestricted`.

3. Run `Import-Module ADSyncDiagnostics`.

4. Run `Invoke-ADSyncDiagnostics -PasswordSync`.

### Understand the results of the cmdlet
The diagnostic cmdlet performs the following checks:

1. Validates password synchronization feature is enabled for your Azure AD tenant.

2. Validates the Azure AD Connect server is not in staging mode.

3. For each existing on-premises AD Connector (which corresponds to an existing AD forest):

   1. Validates password synchronization feature is enabled.
   
   2. Searches for password synchronization heartbeat events in the Windows Application Event logs.

   3. For each AD domain under the on-premises AD Connector:

      1. Validate that the domain is reachable from the Azure AD Connect server.

      2. Validate that the AD DS account used by the on-premises AD Connector has correct username, password and permissions required for password synchronization.

Following diagram illustrates the results of the cmdlet for a single-domain on-premises AD topology:

![Diagnosticoutputforpasswordsynchronization](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/phsglobalgeneral.png)

The rest of this section describes specific results returned by the cmdlet and corresponding issues.

#### Password synchronization feature isn't enabled
If you haven't enabled Password synchronization using Azure AD Connect wizard, following error is returned:

![Password synchronization isn't enabled](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/phsglobaldisabled.png)

#### Azure AD Connect server is in staging mode
If the Azure AD Connect is in staging mode, password synchronization is temporarily disabled and following error is returned:

![Azure AD Connect server is in staging mode](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/phsglobalstaging.png)

#### No password synchronization heartbeat events
Each on-premises AD Connector has its own password synchronization channel. When the password synchronization channel is established and there aren't any password changes to be synchronized, a heartbeat event (EventId 654) is generated once every 30 minutes under Windows Application Event Log. For each on-premises AD Connector, the cmdlet searches for corresponding heartbeat event in the past three hours. If no heartbeat event is found, the following error is returned:

![No password synchronization heart beat event](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/phsglobalnoheartbeat.png)

#### AD DS account does not have correct permissions
If the AD DS account used by the on-premises AD Connector to synchronize password hashes does not have the appropriate permissions, following error is returned:

![Incorrect credential](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/phsglobalaccountincorrectpermission.png)

#### Incorrect AD DS account username or password
If the AD DS account used by the on-premises AD Connector to synchronize password hashes has incorrect username or password, following error is returned:

![Incorrect credential](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/phsglobalaccountincorrectcredential.png)

## One object is not synchronizing passwords - Troubleshoot using diagnostic cmdlet
You can use the **Invoke-ADSyncDiagnostics** cmdlet to figure out why one object is not synchronizing passwords.

> [!NOTE]
> The **Invoke-ADSyncDiagnostics** cmdlet is only available for Azure AD Connect version 1.1.524.0 and after.

### How to run the diagnostics cmdlet
To troubleshoot issues where no passwords are synchronized:

1. Open a new Windows PowerShell session on your Azure AD Connect server with **Run as Administrator** option.

2. Run `Set-ExecutionPolicy RemoteSigned` or `Set-ExecutionPolicy Unrestricted`.

3. Run `Import-Module ADSyncDiagnostics`.

4. Run following cmdlet:
   ```
   Invoke-ADSyncDiagnostics -PasswordSync -ADConnectorName <Name-of-AD-Connector> -DistinguishedName <DistinguishedName-of-AD-object>
   ```
   For example:
   ```
   Invoke-ADSyncDiagnostics -PasswordSync -ADConnectorName "contoso.com" -DistinguishedName "CN=TestUserCN=Users,DC=contoso,DC=com"
   ```

### Understand the results of the cmdlet
The diagnostic cmdlet performs the following checks:

1. Examines the state of the AD object in the AD Connector space, Metaverse and Azure AD Connector space.

2. Validates that there are synchronization rules with password synchronization enabled and apply to the AD object.

3. Attempts to retrieve and display the results of the last attempt to synchronize password for the object.

Following diagram illustrates the results of the cmdlet when troubleshooting password synchronization for a single object:

![Diagnostic output for password synchronization - single object](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/phssingleobjectgeneral.png)

The rest of this section describes specific results returned by the cmdlet and corresponding issues.

#### AD object isn't exported to Azure AD
Password synchronization for this on-premises AD account fails because there is no corresponding object in the Azure AD tenant. Following error is returned:

![Azure AD object is missing](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/phssingleobjectnotexported.png)

#### User has temporary password
Currently, Azure AD Connect does not support synchronizing temporary passwords to Azure AD. A password is considered to be temporary if the "Change password at next logon" option is set on the on-premises AD user. Following error is returned:

![Temporary password is not exported](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/phssingleobjecttemporarypassword.png)

#### Results of last attempt to synchronize password isn't available
By default, Azure AD Connect stores the results of password synchronization attempts for 7 days. If there are no results available for the selected AD object, following warning is returned:

![Diagnostic output for single object - no password sync history](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/phssingleobjectnohistory.png)


## No passwords are synchronized - Manual troubleshooting steps
Follow these steps to figure out why no passwords are synchronized:

1. Is the Connect server in [staging mode](active-directory-aadconnectsync-operations.md#staging-mode)? A server in staging mode does not synchronize any passwords.
2. Run the script in the section [Get the status of password sync settings](#get-the-status-of-password-sync-settings). It gives you an overview of the password sync configuration.  
![PowerShell script output from password sync settings](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/psverifyconfig.png)  
3. If the feature is not enabled in Azure AD or if the sync channel status is not enabled, then run the Connect installation wizard. Select **Customize synchronization options** and unselect password sync. This change temporarily disables the feature. Then run the wizard again and re-enable password sync. Run the script again to verify that the configuration is correct.
4. Look in the eventlog for errors. Look for the following events, which would indicate a problem:
    1. Source: "Directory synchronization" ID: 0, 611, 652, 655
    If you see these, you have a connectivity problem. The eventlog message contains forest information where you have a problem. For more information, see [Connectivity problem](#connectivity problem)
5. If you see no heartbeat or if nothing else worked, then run [Trigger a full sync of all passwords](#trigger-a-full-sync-of-all-passwords). You should only run this script once.
6. Read the section [Troubleshoot one object that is not synchronizing passwords](#one-object-is-not-synchronizing-passwords).

### Connectivity problem

1. Do you have connectivity with Azure AD.
2. Does the account have required permissions to read the password hashes in all domains? If you installed Connect using Express settings, the permissions should already be correct. If you used custom install, you need to set the permissions manually.
    1. To find the account used by the Active Directory Connector, start **Synchronization Service Manager**. Go to **Connectors** and find the on-premises Active Directory forest you are troubleshooting. Select the Connector and click **Properties**. Go to **Connect to Active Directory Forest**.  
    ![Account used by AD Connector](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/connectoraccount.png)  
    Take a note of the username and the domain the account is located in.
    2. Start **Active Directory Users and Computers**. Verify that the account you found in the previous steps have the follow permissions set at the root of all domains in your forest:
        * Replicate Directory Changes
        * Replicate Directory Changes All
3. Are the domain controllers reachable by Azure AD Connect? If the Connect server cannot connect to all domain controllers, then you should configure **Only use preferred domain controller**.  
    ![Domain controller used by AD Connector](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/preferreddc.png)  
    Go back to **Synchronization Service Manager** and **Configure Directory Partition**. Select your domain in **Select directory partitions**, select the checkbox **Only use preferred domain controllers**, and click **Configure**. In the list, enter the domain controllers Connect should use for password sync. The same list is used for import and export as well. Do these steps for all your domains.
4. If the script shows that there is no heartbeat, then run the script in [Trigger a full sync of all passwords](#trigger-a-full-sync-of-all-passwords).

## One object is not synchronizing passwords - Manual troubleshooting steps
You can easily troubleshoot password synchronization issues by reviewing the status of an object.

1. Start in **Active Directory Users and Computers**. Find the user and verify that **User must change password at next logon** is unselected.  
![Active Directory productive passwords](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/adprodpassword.png)  
If it is selected, then ask the user to sign in and change the password. Temporary passwords are not synchronized to Azure AD.
2. If it looks correct in Active Directory, then the next step is to follow the user in the sync engine. By following the user from on-premises Active Directory to Azure AD, you can see if there is a descriptive error on the object.
    1. Start the **[Synchronization Service Manager](active-directory-aadconnectsync-service-manager-ui.md)**.
    2. Click **Connectors**.
    3. Select the **Active Directory Connector** the user is located in.
    4. Select **Search Connector Space**.
    5. In **Scope**, select **DN or anchor**. Enter the full DN of the user you are troubleshooting.
    ![Search for user in cs with DN](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/searchcs.png)  
    6. Locate the user you are looking for and click **Properties** to see all attributes. If the user is not in the search result, then verify your [filtering rules](active-directory-aadconnectsync-configure-filtering.md) and make sure you run [Apply and verify changes](active-directory-aadconnectsync-configure-filtering.md#apply-and-verify-changes) for the user to appear in Connect.
    7. To see the password sync details of the object for the past week, click **Log...**.  
    ![Object log details](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/csobjectlog.png)  
    If the object log is empty, then Azure AD Connect has not been able to read the password hash from Active Directory. Continue your troubleshooting with [Connectivity Errors](#connectivity-errors). If you see any other value than **success**, then refer to the table in [Password sync log](#password-sync-log).
    8. Select the **lineage** tab and make sure that at least one Sync Rule shows **Password Sync** as **True**. In the default configuration, the name of the Sync Rule is **In from AD - User AccountEnabled**.  
    ![Lineage information about a user](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/cspasswordsync.png)  
    9. Click **Metaverse Object Properties**. You see a list of attributes in the user.  
    ![Metaverse information](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/mvpasswordsync.png)  
    Verify that there is no attribute **cloudFiltered** present. Make sure that the domain attributes (domainFQDN and domainNetBios) have the expected values.
    10. Click the tab **Connectors**. Make sure you see connectors to both your on-premises AD and to Azure AD.
    ![Metaverse information](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/mvconnectors.png)  
    11. Select the row representing Azure AD and click **Properties**. Click the tab **Lineage**. The connector space object should have an outbound rule with **Password Sync** set to **True**. In the default configuration, the name of the sync rule is **Out to AAD - User Join**.  
    ![Connector space properties of a user](./media/active-directory-aadconnectsync-troubleshoot-password-synchronization/cspasswordsync2.png)  

### Password sync log
The status column can have the following values:

| Status | Description |
| --- | --- |
| Success |Password has been successfully synchronized. |
| FilteredByTarget |Password is set to **User must change password at next logon**. Password has not been synchronized. |
| NoTargetConnection |No object in the metaverse or in the Azure AD connector space. |
| SourceConnectorNotPresent |No object found in the on-premises Active Directory connector space. |
| TargetNotExportedToDirectory |The object in the Azure AD connector space has not yet been exported. |
| MigratedCheckDetailsForMoreInfo |Log entry was created before build 1.0.9125.0 and is shown in its legacy state. |

## Scripts to help troubleshooting

### Get the status of password sync settings
```
Import-Module ADSync
$connectors = Get-ADSyncConnector
$aadConnectors = $connectors | Where-Object {$_.SubType -eq "Windows Azure Active Directory (Microsoft)"}
$adConnectors = $connectors | Where-Object {$_.ConnectorTypeName -eq "AD"}
if ($aadConnectors -ne $null -and $adConnectors -ne $null)
{
    if ($aadConnectors.Count -eq 1)
    {
        $features = Get-ADSyncAADCompanyFeature -ConnectorName $aadConnectors[0].Name
        Write-Host
        Write-Host "Password sync feature enabled in your Azure AD directory: "  $features.PasswordHashSync
        foreach ($adConnector in $adConnectors)
        {
            Write-Host
            Write-Host "Password sync channel status BEGIN ------------------------------------------------------- "
            Write-Host
            Get-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector.Name
            Write-Host
            $pingEvents =
                Get-EventLog -LogName "Application" -Source "Directory Synchronization" -InstanceId 654  -After (Get-Date).AddHours(-3) |
                    Where-Object { $_.Message.ToUpperInvariant().Contains($adConnector.Identifier.ToString("D").ToUpperInvariant()) } |
                    Sort-Object { $_.Time } -Descending
            if ($pingEvents -ne $null)
            {
                Write-Host "Latest heart beat event (within last 3 hours). Time " $pingEvents[0].TimeWritten
            }
            else
            {
                Write-Warning "No ping event found within last 3 hours."
            }
            Write-Host
            Write-Host "Password sync channel status END ------------------------------------------------------- "
            Write-Host
        }
    }
    else
    {
        Write-Warning "More than one Azure AD Connectors found. Please update the script to use the appropriate Connector."
    }
}
Write-Host
if ($aadConnectors -eq $null)
{
    Write-Warning "No Azure AD Connector was found."
}
if ($adConnectors -eq $null)
{
    Write-Warning "No AD DS Connector was found."
}
Write-Host
```

#### Trigger a full sync of all passwords
> [!NOTE]
> You should only run this script once. If you need to run it more than once, then something else is the problem. Contact Microsoft support to help troubleshoot the problem.

You can trigger a full sync of all passwords using the following script:

```
$adConnector = "<CASE SENSITIVE AD CONNECTOR NAME>"
$aadConnector = "<CASE SENSITIVE AAD CONNECTOR NAME>"
Import-Module adsync
$c = Get-ADSyncConnector -Name $adConnector
$p = New-Object Microsoft.IdentityManagement.PowerShell.ObjectModel.ConfigurationParameter "Microsoft.Synchronize.ForceFullPasswordSync", String, ConnectorGlobal, $null, $null, $null
$p.Value = 1
$c.GlobalParameters.Remove($p.Name)
$c.GlobalParameters.Add($p)
$c = Add-ADSyncConnector -Connector $c
Set-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector -TargetConnector $aadConnector -Enable $false
Set-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector -TargetConnector $aadConnector -Enable $true
```

## Next steps
* [Implementing password synchronization with Azure AD Connect sync](active-directory-aadconnectsync-implement-password-synchronization.md)
* [Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
