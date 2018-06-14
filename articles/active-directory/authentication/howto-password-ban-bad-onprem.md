---
title: Azure AD Password Protection preview
description: Ban weak passwords in on-premises Active Directory using the Azure AD Password Protection preview

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: article
ms.date: 06/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: jsimmons

---
# Preview: Enforce banned passwords on-premises

Azure AD Password Protection is a new feature in public preview powered by Azure Active Directory (Azure AD) to enhance password policies in an organization. The on-premises deployment of Azure AD Password Protection uses both the global and custom banned password lists stored in Azure AD, and performs the same checks on-premises as Azure AD cloud-based changes.

There are three software components that make up Azure AD Password Protection:

* The Azure AD Password Protection Proxy service runs on any domain-joined machine in the current Active Directory forest. It forwards requests from domain controllers to Azure AD and returns the response from Azure AD back to the domain controller.
* The Azure AD Password Protection DC Agent service receives password validation requests from the DC Agent password filter dll, processes them using the current locally available password policy, and returns the result (pass\fail). This service is responsible for periodically calling the Azure AD Password Protection Proxy Service to retrieve new versions of the password policy. Communication for calls to and from the Azure AD Password Protection Proxy Service is handled over RPC (Remote Procedure Call) over TCP. Upon retrieval, new policies are stored in a sysvol folder where they can replicate to other domain controllers. It also monitors the sysvol folder for changes in case other domain controllers have written new password policies there.
* The DC Agent password filter dll receives password validation requests from the operating system and forwards them to the Azure AD Password Protection DC Agent service running locally on the domain controller.

## Requirements

Azure AD Password Protection requires Azure AD Premium licenses. Additional licensing information, including costs, can be found on the [Azure Active Directory pricing site](https://azure.microsoft.com/pricing/details/active-directory/).

1. All machines where Azure AD Password Protection components are installed including domain controllers must be running Windows Server 2012 or later.
1. Network connectivity must exist between at least one domain controller in each domain and at least one server hosting the Azure AD Password Protection Proxy service.
1. Any Active Directory domain running the DC Agent service software must use DFSR for sysvol replication.
1. A global administrator account to register the Azure AD Password Protection Proxy service with Azure AD.
1. An account with Active Directory domain administrator privileges in the forest root domain.

### Answers to common questions

* No internet connectivity required from the domain controllers. The machine(s) running the Azure AD Password Protection Proxy service are the only machines requiring internet connectivity.
* No network ports are opened on domain controllers.
* No Active Directory schema changes are required.
   * The software uses the existing Active Directory container and serviceConnectionPoint schema objects.
* There is no minimum Active Directory Domain or Forest Functional level (DFL\FFL) requirement.
* The software does not create or require any accounts in the Active Directory domains it protects.
* Incremental deployment is supported with the tradeoff that password policy is only enforced where the domain controller agent is installed.
* Azure AD Password Protection is not a real-time policy application engine. There may be a delay in the time between a password policy configuration change and the time it reaches and is enforced on all domain controllers.

## Single forest deployment

Azure AD Password Protection is deployed in two basic procedures.

### Install and configure the Azure AD Password Protection Proxy service

1. Choose one or more servers to host the Azure AD Password Protection Proxy service.
   * Each such service can only provide password policies for a single forest, and the host machine must be domain-joined to a domain (root and child are both equally supported) in that forest. For Azure AD Password Protection Proxy service to fulfill its mission, there must exist network connectivity between at least one DC in each domain of the forest, and the Azure AD Password Protection Proxy host machine.
   * It is supported to install and run the Azure AD Password Protection Proxy service on a domain controller for testing purposes but then  requires internet connectivity.

   > [!NOTE]
   > The public preview supports a maximum of two (2) proxy servers per forest. This limitation may be increased or removed in a future release.

2. Install the Password Policy Proxy Service software using the AzureADPasswordProtectionProxy.msi MSI package.
   * The software installation does not require a reboot. The software installation may be automated using standard MSI procedures, for example:
   `msiexec.exe /i AzureADPasswordProtectionProxy.msi /quiet /qn`

3. Open a PowerShell window as an Administrator.
   * The Azure AD Password Protection Proxy software includes a new PowerShell module named AzureADPasswordProtection. The following steps are based on running various cmdlets from this PowerShell module, and assume that you have opened a new PowerShell window and have imported the new module as follows:
      * `Import-Module AzureADPasswordProtection`

      > [!NOTE]
      > The installation software modifies the host machine’s PSModulePath environment variable. In order for this change to take effect so that the AzureADPasswordProtection powershell module can be imported and used, you may need to open a brand new PowerShell console window.

   * Check that the service is running using the following PowerShell command: `Get-Service AzureADPasswordProtectionProxy | fl`.
      * The result should produce a result with the **Status** returning a "Running" result.

4. Register the proxy.
   * Once step 3 has been completed the Azure AD Password Protection Proxy service is running on the machine, but does not yet have the necessary credentials to communicate with Azure AD. Registration with Azure AD is required to enable that ability using the `Register-AzureADPasswordProtectionProxy` PowerShell cmdlet. The cmdlet requires global administrator credentials for your Azure tenant as well as on-premises Active Directory domain administrator privileges in the forest root domain. Once it has succeeded for a given proxy service, additional invocations of `Register-AzureADPasswordProtectionProxy` continue to succeed but are unnecessary.
      * The cmdlet may be run as follows:
         ```
         $tenantAdminCreds = Get-Credential
         Register-AzureADPasswordProtectionProxy -AzureCredential $tenantAdminCreds
         ```

         The example only works if the currently logged in user is also an Active Directory domain administrator for the root domain. An alternative is to supply the necessary domain credentials via the `-ForestCredential` parameter.

   > [!TIP]
   > There may be a considerable delay (many seconds) the first time this cmdlet is run for a given Azure tenant before the cmdlet completes execution. Unless a failure is reported this delay should not be considered alarming.

   > [!NOTE]
   > Registration of the Azure AD Password Protection Proxy service is expected to be a one-time step in the lifetime of the service. The proxy service will automatically perform any other necessary maintainenance from this point onwards.

5. Register the forest.
   * The on-premises Active Directory forest must be initialized with the necessary credentials to communicate with Azure using the `Register-AzureADPasswordProtectionForest` Powershell cmdlet. The cmdlet requires global administrator credentials for your Azure tenant as well as on-premises Active Directory domain administrator privileges in the forest root domain. This step is run once per forest.
      * The cmdlet may be run as follows:
         ```
         $tenantAdminCreds = Get-Credential
         Register-AzureADPasswordProtectionForest -AzureCredential $tenantAdminCreds
         ```

         The example above only works if the currently logged in user is also an Active Directory domain administrator for the root domain. An alternative is to supply the necessary domain credentials via the -ForestCredential parameter.

         > [!NOTE]
         > If multiple proxy servers are installed in your environment, it does not matter which specific proxy server the above procedure above is executed upon.

         > [!TIP]
         > There may be a considerable delay (many seconds) the first time this cmdlet is run for a given Azure tenant before the cmdlet completes execution. Unless a failure is reported this delay should not be considered alarming.

   > [!NOTE]
   > Registration of the Active Directory forest is expected to be a one-time step in the lifetime of the forest. The domain controller agents running in the forest will automatically perform any other necessary maintainenance from this point onwards. Once it has succeeded for a given forest, additional invocations of `Register-AzureADPasswordProtectionForest` continue to succeed but are unnecessary.

6. Optional: Configure the Azure AD Password Protection Proxy service to listen on a specific port.
   * RPC over TCP is used by the Azure AD Password Protection DC Agent software on the domain controllers to communicate with the Azure AD Password Protection Proxy service. By default, the Azure AD Password Protection Password Policy Proxy service listens on any available dynamic RPC endpoint. If necessary due to networking topology or firewall requirements, the service may instead be configured to listen on a specific TCP port.
      * To configure the service to run under a static port, use the `Set-AzureADPasswordProtectionProxyConfiguration` cmdlet.
         ```
         Set-AzureADPasswordProtectionProxyConfiguration –StaticPort <portnumber>
         WARNING: You must stop and restart the service for these changes to take effect.
         ```
      * To configure the service to run under a dynamic port, use the same procedure but set StaticPort back to zero, like so:
         ```
         Set-AzureADPasswordProtectionProxyConfiguration –StaticPort 0
         WARNING: You must stop and restart the service for these changes to take effect.
         ```

   > [!NOTE]
   > The Azure AD Password Protection Proxy service requires a manual restart after any change in port configuration. It is not necessary to restart the DC Agent service software running on domain controllers after making configuration changes of this nature.

   * The current configuration of the service may be queried using the `Get-AzureADPasswordProtectionProxyConfiguration` cmdlet as the following example shows:
      `Get-AzureADPasswordProtectionProxyConfiguration | fl`

      ```
      ServiceName : AzureADPasswordProtectionProxy
      DisplayName : Azure AD Password Protection Proxy
      StaticPort  : 0 
      ```

### Install the Azure AD Password Protection DC Agent service

* Install the Azure AD Password Protection DC Agent Service software using the `AzureADPasswordProtectionDCAgent.msi` MSI package:
   * The software installation does require a reboot on install and uninstall due to the operating system requirement that password filter dlls are only loaded or unloaded upon a reboot.
   * It is supported to install the DC Agent Service on a machine that is not yet a domain-controller. In this case, the service will start and run but will otherwise be inactive until after the machine is promoted to be a domain controller.

   The software installation may be automated using standard MSI procedures, for example:
   `msiexec.exe /i AzureADPasswordProtectionDCAgent.msi /quiet /qn`

   > [!WARNING]
   > The example msiexec command will result in an immediate reboot; this can be avoided by specifying the `/norestart` flag.

Once installed on a domain controller and rebooted, the Azure AD Password Protection DC Agent software installation is complete. No other configuration is required or possible.

## Multiple forest deployments

There are no additional requirements to deploy Azure AD Password Protection across multiple forests. Each forest is independently configured as described in the single forest deployment section. Each Azure AD Password Protection Proxy can only support domain controllers from the forest it is joined to. The Azure AD Password Protection software in a given forest is unaware of Azure AD Password Protection software deployed in another forest regardless of Active Directory trust configurations.

## High availability

The main concern with ensuring high availability of Azure AD Password Protection is the availability of the proxy servers, when domain controllers in a forest are attempting to download new policies or other data from Azure. The public preview supports a maximum of two proxy servers per forest. Each DC agent uses a simple round-robin style algorithm when deciding which proxy server to call, and skips over proxy servers that are not responding.
The usual problems associated with high availability are mitigated by the design of the DC agent software. The DC agent maintains a local cache of the most recently downloaded password policy. Even if all registered proxy servers become unavailable for any reason, the DC agent(s) continue to enforce their cached password policy. A reasonable update frequency for password policies in a large deployment could be days, not hours or less, brief outages of the proxy servers will not significantly impact the operation of the Azure AD Password Protection feature or its security benefits.

## Deployment strategy

Microsoft suggests that deployments start in audit mode. Audit mode is the default initial setting. Once proxy server(s) and DC agents are fully deployed in audit mode, regular monitoring should be done in order to determine what impact password policy enforcement would have on users and the environment if the policy was enforced.

During the audit stage, many organizations find:

* They need to improve existing operational processes to use more secure passwords.
* Users are accustomed to choosing regularly unsecure passwords
* They need to inform users about the upcoming change in security enforcement, the impact it may have on them, and help them better understand how they can choose more secure passwords.

Once the feature has been running in audit mode for a reasonable time, the enforcement configuration can be flipped from **Audit** to **Enforce**. Focused monitoring during this time is a good idea.

## Post-deployment operations and maintenance

### Audit Mode

Audit mode is intended as a way to run the software in a “what if” mode. Each DC Agent service evaluates an incoming password according to the currently active policy. If the current policy is configured to be in Audit mode, “bad” passwords result in event log messages but are accepted. This is the only difference between Audit and Enforce mode; all other operations run the same.

> [!NOTE]
> Microsoft recommends that initial deployment and testing always start out in Audit mode. Events in the event log should then be monitored to try to anticipate whether any existing operational processes would be disturbed once Enforce mode is enabled.

### Enforce Mode

Enforce mode is intended as the final configuration. As in Audit mode above, each DC Agent service evaluates incoming passwords according to the currently active policy. If Enforce mode is enabled though, a password that is considered unsecure according to the policy is rejected.

When a password is rejected in Enforce mode by the Azure AD Password Protection DC Agent, the visible impact seen by an end user is identical to what they would see if their password was rejected by traditional on-premises password complexity enforcement. For example, a user might see the following traditional error message at the logon\change password screen:

“Unable to update the password. The value provided for the new password does not meet the length, complexity, or history requirements of the domain.”

This message is only one example of several possible outcomes. The specific error message can vary depending on the actual software or scenario that is attempting to set an unsecure password.

Affected end users may need to work with their IT staff to understand the new requirements and be more able to choose secure passwords.

## On-premises Logs and events

### DC Agent Service

On each domain controller, the DC Agent Service software writes the results of its password validations (and other status) to a local event log:
\Applications and Services Logs\Microsoft\AzureADPasswordProtection\DCAgent\Admin

Events are logged by the various DC agent components using the following ranges:

|Component |Event ID range|
| --- | --- |
|DC Agent password filter dll| 10000-19999|
|DC Agent service hosting process| 20000-29999|
|DC Agent service policy validation logic| 30000-39999|

For a successful password validation operation, there is generally one event logged from the DC agent password filter dll. For a failing password validation operation, there are generally two events logged, one from the DC Agent service, and one from the DC Agent password filter dll.

Discrete events to capture these situations are logged, based around the following factors:

1. Whether a given password is being set or changed
2. Whether validation of a given password passed or failed
3. Whether validation failed due to the Microsoft global policy vs the organizational policy
4. Whether audit only mode is currently on or off for the current password policy.

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

An example of a successful 10014 password change event log message is as follows:

The changed password for the specified user was validated as compliant with the current Azure password policy.

 UserName: BPL_02885102771
 FullName:

An example of a failed 10017 and 30003 password set event log message pair is as follows:

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

Note: this condition may be caused by one or more of the following reasons:%n

1. The forest has not yet been registered with Azure.

Resolution steps: an administrator must register the forest using the Register-AzureADPasswordProtectionForest cmdlet.

2. An Azure AD Password Protection Proxy is not yet available on at least one machine in the current forest.

Resolution steps: an administrator must install and register a proxy using the Register-AzureADPasswordProtectionProxy cmdlet.

3. This DC does not have network connectivity to any Azure AD Password Protection Proxy instances.

Resolution steps: ensure network connectivity exists to at least one Azure AD Password Protection Proxy instance.

4. This DC does not have connectivity to other domain controllers in the domain.

Resolution steps: ensure network connectivity exists to the domain.

#### Sample event log message for Event ID 30006

The service is now enforcing the following Azure password policy.

 AuditOnly: 1

 Global policy date: ‎2018‎-‎05‎-‎15T00:00:00.000000000Z

 Tenant policy date: ‎2018‎-‎06‎-‎10T20:15:24.432457600Z

 Enforce tenant policy: 1

#### DC Agent log locations

The DC Agent service will also operational-related events to the following log:
\Applications and Services Logs\Microsoft\AzureADPasswordProtection\DCAgent\Operational

The DC Agent service can also log verbose debug-level trace events to the following log:
\Applications and Services Logs\Microsoft\AzureADPasswordProtection\DCAgent\Trace

> [!WARNING]
> The Trace log is disabled by default. When enabled, this log receives a high volume of events and may impact domain controller performance. Therefore, this enhanced log should only be enabled when a problem requires deeper investigation, and then only for a minimal amount of time.

### Azure AD Password Protection Proxy service

The Password Protection Proxy service emits a minimal set of events to the following event log:
\Applications and Services Logs\Microsoft\AzureADPasswordProtection\ProxyService\Operational

The Password Protection Proxy service can also log verbose debug-level trace events to the following log:
\Applications and Services Logs\Microsoft\AzureADPasswordProtection\ProxyService\Trace

> [!WARNING]
> The Trace log is disabled by default. When enabled, this log receives a high volume of events and this may impact performance of the proxy host. Therefore, this log should only be enabled when a problem requires deeper investigation, and then only for a minimal amount of time.

### Usage reporting

#### Summary activity reporting

The `Get-AzureADPasswordProtectionSummaryReport` cmdlet may be used to produce a summary view of activity. An example output of this cmdlet is as follows:

```
Get-AzureADPasswordProtectionSummaryReport -DomainController bplrootdc2
DomainController                : bplrootdc2
PasswordChangesValidated        : 6677
PasswordSetsValidated           : 9
PasswordChangesRejected         : 10868
PasswordSetsRejected            : 34
PasswordChangeAuditOnlyFailures : 213
PasswordSetAuditOnlyFailures    : 3
PasswordChangeErrors            : 0
PasswordSetErrors               : 1
```

The scope of the cmdlet’s reporting may be influenced using one of the –Forest, -Domain, or –DomainController parameters. Not specifying a parameter implies –Forest.

> [!NOTE]
> This cmdlet works by remotely querying each DC Agent Service’s Admin event log. If the event logs contain large numbers of events, the cmdlet may take a long time to complete. In addition, bulk network queries of large data sets may impact domain controller performance. Therefore, this cmdlet should be used carefully in production environments.

### DC Agent discovery

The `Get-AzureADPasswordProtectionDCAgent` cmdlet may be used to display basic information about the various DC agents running in a domain or forest. This information is retrieved from the serviceConnectionPoint object(s) registered by the running DC agent service(s). An example output of this cmdlet is as follows:

```
PS C:\> Get-AzureADPasswordProtectionDCAgent
ServerFQDN            : bplChildDC2.bplchild.bplRootDomain.com
Domain                : bplchild.bplRootDomain.com
Forest                : bplRootDomain.com
Heartbeat             : 2/16/2018 8:35:01 AM
```

The various properties are updated by each DC Agent service on an approximate hourly basis. The data is still subject to Active Directory replication latency.

The scope of the cmdlet’s query may be influenced using either the –Forest or –Domain parameters.

### Emergency remediation

If an unfortunate situation occurs where the DC agent service is causing problems, the DC Agent service may be immediately shut down. The DC agent password filter dll attempts to call the non-running service and will log warning events (10012, 10013), but all incoming passwords are accepted during that time. The DC agent service may then also be configured via the Windows Service Control Manager with a startup type of “Disabled” as needed.

### Performance monitoring

The DC Agent Service software installs a performance counter object named **Azure AD Password Protection**. The following perf counters are currently available:

|Perf counter name | Description|
| --- | --- |
|Passwords processed |This counter displays the total number of passwords processed (accepted or rejected) since last restart.|
|Passwords accepted |This counter displays the total number of passwords that were accepted since last restart.|
|Passwords rejected |This counter displays the total number of passwords that were rejected since last restart.|
|Password filter requests in progress |This counter displays the number of password filter requests currently in progress.|
|Peak password filter requests |This counter displays the peak number of concurrent password filter requests since the last restart.|
|Password filter request errors |This counter displays the total number of password filter requests that failed due to an error since last restart. Errors can occur when the Azure AD Password Protection DC Agent service is not running.|
|Password filter requests/sec |This counter displays the rate at which passwords are being processed.|
|Password filter request processing time |This counter displays the average time required to process a password filter request.|
|Peak password filter request processing time |This counter displays the peak password filter request processing time since the last restart.|
|Passwords accepted due to audit mode |This counter displays the total number of passwords that would normally have been rejected, but were accepted because the password policy was configured to be in audit-mode (since last restart).|

### Read-only domain controllers

Password changes\sets are never processed and persisted on read-only domain controllers (RODCs); instead, these are forwarded to writable domain controllers. Therefore there is no need to install the DC agent software on RODCs.

### Directory Services Repair Mode

If the domain controller is booted into Directory Services Repair Mode, the DC agent service detects this causing all password validation or enforcement activities to be disabled, regardless of the currently active policy configuration.

### Domain controller demotion

It is supported to demote a domain controller that is still running the DC agent software. Administrators should be aware however that the DC agent software keeps running and continues enforcing the current password policy during the demotion procedure. The new local Administrator account password (specified as part of the demotion operation) is validated like any other password. Microsoft recommends that secure passwords be chosen for local Administrator accounts as part of a DC demotion procedure; however the validation of the new local Administrator account password by the DC agent software may be disruptive to pre-existing demotion operational procedures.
Once the demotion has succeeded, and the domain controller has been rebooted and is again running as a normal member server, the DC agent software reverts to running in a passive mode. It may then be uninstalled at any time.

## Removal

If it is decided to uninstall the public preview software and cleanup all related state from the domain(s) and forest, this can be accomplished using the following steps:

> [!IMPORTANT]
> It is important to perform these steps in order. If any instance of the Password Protection Proxy service is left running it will periodically re-create its serviceConnectionPoint object as well as periodically re-create the sysvol state.

1. Uninstall the Password Protection Proxy software from all machines. This step does **not** require a reboot.
2. Uninstall the DC Agent software from all domain controllers. This step **requires** a reboot.
3. Manually remove all proxy service connection points in each domain naming context. The location of these objects may be discovered with the following Active Directory Powershell command:
   ```
   $scp = “serviceConnectionPoint”
   $keywords = “{EBEFB703-6113-413D-9167-9F8DD4D24468}*”
   Get-ADObject -SearchScope Subtree -Filter { objectClass -eq $scp -and keywords -eq $keywords }
   ```

   Do not omit the asterisk (“*”) at the end of the $keywords variable value above.

   The resulting object found via the `Get-ADObject` command can then be piped to `Remove-ADObject`, or deleted manually. 

4. Manually remove all DC agent connection points in each domain naming context. There may be one these objects per domain controller in the forest, depending on how widely the public preview software was deployed. The location of that object may be discovered with the following Active Directory Powershell command:

   ```
   $scp = “serviceConnectionPoint”
   $keywords = “{B11BB10A-3E7D-4D37-A4C3-51DE9D0F77C9}*”
   Get-ADObject -SearchScope Subtree -Filter { objectClass -eq $scp -and keywords -eq $keywords }
   ```

   The resulting object found via the `Get-ADObject` command can then be piped to `Remove-ADObject`, or deleted manually.

5. Manually remove the forest-level configuration state. The forest configuration state is maintained in a container in the Active Directory configuration naming context. It can be discovered and deleted as follows:

   ```
   $passwordProtectonConfigContainer = "CN=Azure AD Password Protection,CN=Services," + (Get-ADRootDSE).configurationNamingContext
   Remove-ADObject $passwordProtectonConfigContainer
   ```

6. Manually remove all sysvol related state by manually deleting the following folder and all of its contents:

   `\\<domain>\sysvol\<domain fqdn>\Policies\{4A9AB66B-4365-4C2A-996C-58ED9927332D}`

   If necessary, this path may also be accessed locally on a given domain controller; the default location would be something like this:

   `%windir%\sysvol\domain\Policies\{4A9AB66B-4365-4C2A-996C-58ED9927332D}`

   This path is different if the sysvol share has been configured in a non-default location.

# Next steps

For more information on the global and custom banned password lists, see the article [Ban bad passwords](concept-password-ban-bad.md)
