---
title: Troubleshooting and logging in Azure AD password protection preview
description: Understand Azure AD password protection preview logging and common troubleshooting

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: jsimmons

---
# Preview: Azure AD password protection monitoring, reporting, and troubleshooting

|     |
| --- |
| Azure AD password protection and the custom banned password list are public preview features of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

After deployment of Azure AD password protection monitoring and reporting are essential tasks. This article goes into detail to help you understand where each service logs information and how to report on the use of Azure AD password protection.

## On-premises logs and events

### DC agent service

On each domain controller, the DC agent service software writes the results of its password validations (and other status) to a local event log:
\Applications and Services Logs\Microsoft\AzureADPasswordProtection\DCAgent\Admin

Events are logged by the various DC agent components using the following ranges:

|Component |Event ID range|
| --- | --- |
|DC Agent password filter dll| 10000-19999|
|DC agent service hosting process| 20000-29999|
|DC agent service policy validation logic| 30000-39999|

For a successful password validation operation, there is generally one event logged from the DC agent password filter dll. For a failing password validation operation, there are generally two events logged, one from the DC agent service, and one from the DC Agent password filter dll.

Discrete events to capture these situations are logged, based around the following factors:

* Whether a given password is being set or changed.
* Whether validation of a given password passed or failed.
* Whether validation failed due to the Microsoft global policy vs the organizational policy.
* Whether audit only mode is currently on or off for the current password policy.

The key password-validation-related events are as follows:

|   |Password change |Password set|
| --- | :---: | :---: |
|Pass |10014 |10015|
|Fail (did not pass customer password policy)| 10016, 30002| 10017, 30003|
|Fail (did not pass Microsoft password policy)| 10016, 30004| 10017, 30005|
|Audit-only Pass (would have failed customer password policy)| 10024, 30008| 10025, 30007|
|Audit-only Pass (would have failed Microsoft password policy)| 10024, 30010| 10025, 30009|

> [!TIP]
> Incoming passwords are validated against the Microsoft global password list first; if that fails, no further processing is performed. This is the same behavior as performed on password changes in Azure.

#### Sample event log message for Event ID 10014 successful password set

The changed password for the specified user was validated as compliant with the current Azure password policy.

 UserName: BPL_02885102771
 FullName:

#### Sample event log message for Event ID 10017 and 30003 failed password set

10017:

The reset password for the specified user was rejected because it did not comply with the current Azure password policy. Please see the correlated event log message for more details.

 UserName: BPL_03283841185
 FullName:

30003:

The reset password for the specified user was rejected because it matched at least one of the tokens present in the per-tenant banned password list of the current Azure password policy.

 UserName: BPL_03283841185
 FullName:

Some other key event log messages to be aware of are:

#### Sample event log message for Event ID 30001

The password for the specified user was accepted because an Azure password policy is not available yet

UserName: <user>
FullName: <user>

This condition may be caused by one or more of the following reasons:%n

1. The forest has not yet been registered with Azure.

   Resolution steps: an administrator must register the forest using the Register-AzureADPasswordProtectionForest cmdlet.

2. An Azure AD password protection Proxy is not yet available on at least one machine in the current forest.

   Resolution steps: an administrator must install and register a proxy using the Register-AzureADPasswordProtectionProxy cmdlet.

3. This DC does not have network connectivity to any Azure AD password protection Proxy instances.

   Resolution steps: ensure network connectivity exists to at least one Azure AD password protection Proxy instance.

4. This DC does not have connectivity to other domain controllers in the domain.

   Resolution steps: ensure network connectivity exists to the domain.

#### Sample event log message for Event ID 30006

The service is now enforcing the following Azure password policy.

 AuditOnly: 1

 Global policy date: ‎2018‎-‎05‎-‎15T00:00:00.000000000Z

 Tenant policy date: ‎2018‎-‎06‎-‎10T20:15:24.432457600Z

 Enforce tenant policy: 1

#### DC Agent log locations

The DC agent service will also log operational-related events to the following log:
\Applications and Services Logs\Microsoft\AzureADPasswordProtection\DCAgent\Operational

The DC agent service can also log verbose debug-level trace events to the following log:
\Applications and Services Logs\Microsoft\AzureADPasswordProtection\DCAgent\Trace

> [!WARNING]
> The Trace log is disabled by default. When enabled, this log receives a high volume of events and may impact domain controller performance. Therefore, this enhanced log should only be enabled when a problem requires deeper investigation, and then only for a minimal amount of time.

### Azure AD password protection proxy service

The password protection Proxy service emits a minimal set of events to the following event log:
\Applications and Services Logs\Microsoft\AzureADPasswordProtection\ProxyService\Operational

The password protection Proxy service can also log verbose debug-level trace events to the following log:
\Applications and Services Logs\Microsoft\AzureADPasswordProtection\ProxyService\Trace

> [!WARNING]
> The Trace log is disabled by default. When enabled, this log receives a high volume of events and this may impact performance of the proxy host. Therefore, this log should only be enabled when a problem requires deeper investigation, and then only for a minimal amount of time.

### DC Agent discovery

The `Get-AzureADPasswordProtectionDCAgent` cmdlet may be used to display basic information about the various DC agents running in a domain or forest. This information is retrieved from the serviceConnectionPoint object(s) registered by the running DC agent service(s). An example output of this cmdlet is as follows:

```
PS C:\> Get-AzureADPasswordProtectionDCAgent
ServerFQDN            : bplChildDC2.bplchild.bplRootDomain.com
Domain                : bplchild.bplRootDomain.com
Forest                : bplRootDomain.com
Heartbeat             : 2/16/2018 8:35:01 AM
```

The various properties are updated by each DC agent service on an approximate hourly basis. The data is still subject to Active Directory replication latency.

The scope of the cmdlet’s query may be influenced using either the –Forest or –Domain parameters.

### Emergency remediation

If an unfortunate situation occurs where the DC agent service is causing problems, the DC agent service may be immediately shut down. The DC agent password filter dll attempts to call the non-running service and will log warning events (10012, 10013), but all incoming passwords are accepted during that time. The DC agent service may then also be configured via the Windows Service Control Manager with a startup type of “Disabled” as needed.

### Performance monitoring

The DC agent service software installs a performance counter object named **Azure AD password protection**. The following perf counters are currently available:

|Perf counter name | Description|
| --- | --- |
|Passwords processed |This counter displays the total number of passwords processed (accepted or rejected) since last restart.|
|Passwords accepted |This counter displays the total number of passwords that were accepted since last restart.|
|Passwords rejected |This counter displays the total number of passwords that were rejected since last restart.|
|Password filter requests in progress |This counter displays the number of password filter requests currently in progress.|
|Peak password filter requests |This counter displays the peak number of concurrent password filter requests since the last restart.|
|Password filter request errors |This counter displays the total number of password filter requests that failed due to an error since last restart. Errors can occur when the Azure AD password protection DC agent service is not running.|
|Password filter requests/sec |This counter displays the rate at which passwords are being processed.|
|Password filter request processing time |This counter displays the average time required to process a password filter request.|
|Peak password filter request processing time |This counter displays the peak password filter request processing time since the last restart.|
|Passwords accepted due to audit mode |This counter displays the total number of passwords that would normally have been rejected, but were accepted because the password policy was configured to be in audit-mode (since last restart).|

## Directory Services Repair Mode

If the domain controller is booted into Directory Services Repair Mode, the DC agent service detects this causing all password validation or enforcement activities to be disabled, regardless of the currently active policy configuration.

## Domain controller demotion

It is supported to demote a domain controller that is still running the DC agent software. Administrators should be aware however that the DC agent software keeps running and continues enforcing the current password policy during the demotion procedure. The new local Administrator account password (specified as part of the demotion operation) is validated like any other password. Microsoft recommends that secure passwords be chosen for local Administrator accounts as part of a DC demotion procedure; however the validation of the new local Administrator account password by the DC agent software may be disruptive to pre-existing demotion operational procedures.
Once the demotion has succeeded, and the domain controller has been rebooted and is again running as a normal member server, the DC agent software reverts to running in a passive mode. It may then be uninstalled at any time.

## Removal

If it is decided to uninstall the public preview software and cleanup all related state from the domain(s) and forest, this task can be accomplished using the following steps:

> [!IMPORTANT]
> It is important to perform these steps in order. If any instance of the password protection Proxy service is left running it will periodically re-create its serviceConnectionPoint object as well as periodically re-create the sysvol state.

1. Uninstall the password protection Proxy software from all machines. This step does **not** require a reboot.
2. Uninstall the DC Agent software from all domain controllers. This step **requires** a reboot.
3. Manually remove all proxy service connection points in each domain naming context. The location of these objects may be discovered with the following Active Directory Powershell command:
   ```
   $scp = “serviceConnectionPoint”
   $keywords = “{EBEFB703-6113-413D-9167-9F8DD4D24468}*”
   Get-ADObject -SearchScope Subtree -Filter { objectClass -eq $scp -and keywords -like $keywords }
   ```

   Do not omit the asterisk (“*”) at the end of the $keywords variable value.

   The resulting object found via the `Get-ADObject` command can then be piped to `Remove-ADObject`, or deleted manually. 

4. Manually remove all DC agent connection points in each domain naming context. There may be one these objects per domain controller in the forest, depending on how widely the public preview software was deployed. The location of that object may be discovered with the following Active Directory Powershell command:

   ```
   $scp = “serviceConnectionPoint”
   $keywords = “{B11BB10A-3E7D-4D37-A4C3-51DE9D0F77C9}*”
   Get-ADObject -SearchScope Subtree -Filter { objectClass -eq $scp -and keywords -like $keywords }
   ```

   The resulting object found via the `Get-ADObject` command can then be piped to `Remove-ADObject`, or deleted manually.

5. Manually remove the forest-level configuration state. The forest configuration state is maintained in a container in the Active Directory configuration naming context. It can be discovered and deleted as follows:

   ```
   $passwordProtectonConfigContainer = "CN=Azure AD password protection,CN=Services," + (Get-ADRootDSE).configurationNamingContext
   Remove-ADObject $passwordProtectonConfigContainer
   ```

6. Manually remove all sysvol related state by manually deleting the following folder and all of its contents:

   `\\<domain>\sysvol\<domain fqdn>\Policies\{4A9AB66B-4365-4C2A-996C-58ED9927332D}`

   If necessary, this path may also be accessed locally on a given domain controller; the default location would be something like the following path:

   `%windir%\sysvol\domain\Policies\{4A9AB66B-4365-4C2A-996C-58ED9927332D}`

   This path is different if the sysvol share has been configured in a non-default location.

## Next steps

For more information on the global and custom banned password lists, see the article [Ban bad passwords](concept-password-ban-bad.md)
