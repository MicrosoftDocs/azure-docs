---
title: Microsoft resources for verifying your security against the SolarWinds attack | Microsoft Docs
description: Learn about how to use resources created by Microsoft specifically to battle against the SolarWinds attack.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2020
ms.author: bagol

---

# After SolarWinds: Apply Microsoft resources to verify your security

This article describes how to use the Microsoft resources created specifically to counteract the SolarWinds attack (Soliargate), with clear action items for you to perform to help ensure your organization's security.

## About the SolarWinds attack and Microsoft's response

In December 2020, [FireEye discovered a nation-state cyber attack on SolarWinds software](https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html).

Following this discovery, Microsoft swiftly took the following steps against the attack:

1. **Disclosed a set of complex techniques** used by an advanced actor in the attack, affecting several key customers.

1. **Removed the digital certificates used by the Trojaned files,** effectively telling all Windows systems overnight to stop trusting those compromised files. 

1. **Updated Microsoft Windows Defender** to detect and alert if it found a Trojaned file on the system.

1. **Sinkholed one of the domains used by the malware** to command and control affected systems.

1. **Changed Windows Defender's default action for Solarigate from *Alert* to *Quarantine***, effectively killing the malware when found at the risk of crashing the system.

These steps helped to neutralize and then kill the malware and then taking control over the malware infrastructure from the attackers.

Azure Sentinel enables you to view data from a single view, including both on-premises and cloud sources, makes it easier for you to spot trends and attacks, and understand the full nature of an attack on your system. Sentinel customers should start by [using Sentinel to review Solarigate-related alerts from across platforms and environments](#azure-sentinel).

Other instructions for customers performing system checks for the Solarigate attack include:

- [Use an Azure Active Directory workbook to help assess your organization's Solarigate risk](#azure-active-directory)

- [Use Microsoft Defender solutions to identify malicious activity in your network](#microsoft-defender)

For more information, see our reference of [Solarigate indicators of compromise (IOCs)](#solarigate-indicators-of-compromise-iocs) and the list of [blog references](#references) for this article.

> [!IMPORTANT]
> The Solarwinds attack is an ongoing investigation, and our teams continue to act as first responders to these attacks. As new information becomes available, we will make updates through our Microsoft Security Response Center (MSRC) blog at https://aka.ms/solorigate.
> 

## Azure Sentinel

Azure Sentinel enables you to analyze data from across products, including both on-premises and cloud environments. 

For example, Microsoft 365 Defender has a range of alerts and queries for known patterns associated with the Solarigate attack, which can flow into Sentinel. Microsoft 365 Defender alerts, combined with raw logs from other data sources, can provide security teams with insights into the full nature and scope of the Solarigate attack on their organization.

Use Azure Sentinel to hunt for attack activity, especially with the [SolarWinds post-compromise hunting workbook](https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/SolarWindsPostCompromiseHunting.json). For example, if you have recently-rotated Active Directory Federated Service (ADFS) key material, use the [Sentinel hunting workbook](https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/SolarWindsPostCompromiseHunting.json) to identify attacker sign-in activity if they sign in with old key material. 

> [!NOTE]
> Azure Sentinel and the M365 Advanced Hunting portal share the same query language and similar data types. Therefore, all of the referenced queries can be used directly or slightly modified to work in both products.
>

We recommend that you use Sentinel to perform the following steps:

- [Use Sentinel to find machines with SolarWinds Orion components](#use-sentinel-to-find-machines-with-solarwinds-orion-components)
- [Identify escalating privileges in your system](#identify-escalating-privileges-in-your-system)
- [Find exported certificates](#find-exported-certificates)
- [Find illicit data access](#find-illicit-data-access)
- [Find mail data exfiltration](#find-mail-data-exfiltration)
- [Find suspicious domain-related activity](#find-suspicious-domain-related-activity)
- [Find security service tampering](#find-security-service-tampering)
- [Find correlations between Microsoft 365 Defender and Azure Sentinel detections](#find-correlations-between-microsoft-365-defender-and-azure-sentinel-detections)

### Use Sentinel to find machines with SolarWinds Orion components

Your organization may have a software inventory management system that indicates the hosts where the SolarWinds application is installed. Alternately, use Sentinel with the [Microsoft 365 Defender connector](connect-microsoft-365-defender.md) to run a query and gather similar information.

Once you have the [Microsoft 365 Defender connector](connect-microsoft-365-defender.md) configured with Sentinel, you can use the following query to pull data about any hosts that have run the SolarWinds process in the last 30 days.

Returned hosts will include hosts that are on-boarded to Sentinel directly, or via Microsoft Defender for Endpoints (MDE). 

The following query also uses the Sysmon logs collected by many customers to find machines with SolarWinds software installed. Similar queries that leverage Microsoft 365 raw data can also be run from the Microsoft 365 Advanced hunting portal.

For more information, see the [SolarWinds Inventory check query](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/MultipleDataSources/SolarWindsInventory.yaml) on GitHub.

```kusto
let timeframe = 30d; 
(union isfuzzy=true 
( 
SecurityEvent 
| where TimeGenerated >= ago(timeframe) 
| where EventID == '4688' 
| where tolower(NewProcessName) has 'solarwinds' 
| extend MachineName = Computer , Process = NewProcessName
| summarize StartTime = min(TimeGenerated), EndTime = max(TimeGenerated), MachineCount = dcount(MachineName), AccountCount = dcount(Account), MachineNames = make_set(MachineName), Accounts = make_set(Account) by Process, Type
), 
( 
DeviceProcessEvents 
| where TimeGenerated >= ago(timeframe) 
| where tolower(InitiatingProcessFolderPath) has 'solarwinds' 
| extend MachineName = DeviceName , Process = InitiatingProcessFolderPath, Account = AccountName
| summarize StartTime = min(TimeGenerated), EndTime = max(TimeGenerated), MachineCount = dcount(MachineName), AccountCount = dcount(Account), MachineNames = make_set(MachineName), Accounts = make_set(Account)  by Process, Type
), 
( 
Event 
| where TimeGenerated >= ago(timeframe) 
| where Source == "Microsoft-Windows-Sysmon" 
| where EventID == 1 
| extend Image = EventDetail.[4].["#text"] 
| where tolower(Image) has 'solarwinds' 
| extend MachineName = Computer , Process = Image, Account = UserName
| summarize StartTime = min(TimeGenerated), EndTime = max(TimeGenerated), MachineCount = dcount(MachineName), AccountCount = dcount(Account), MachineNames = make_set(MachineName), Accounts = make_set(Account)  by Process, Type
) 
) 
```

For more information, see [Finding hardcoded pipes in your environment](#finding-hardcoded-pipes-in-your-environment).

#### Finding hardcoded pipes in your environment

The Solarigate attacker used a hardcoded pipe named **583da945-62af-10e8-4902-a8f205c72b2e** to verify that only one instance of the backdoor they created was running, among other checks.

If you are collecting Sysmon logs (Event ID 17/18) or Security Events (ID 5145) to your Azure Sentinel workspace, use the following query to find evidence of this hardcoded pipe in your systems.

> [!IMPORTANT]
> This query should not be considered reliable on its own. The creation of the hardcoded named pipe on its own does not indicate that the malicious code was completely triggered, and the machine many have beaconed out or received additional commands. 
>
> However, the presence of this named pipe is suspicious and should warrant a further, more in-dept investigation.

For more information, see [Solorigate Named Pipe detection](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/SecurityEvent/SolorigateNamedPipe.yaml).

```json
let timeframe = 1d;
(union isfuzzy=true
(Event
| where TimeGenerated >= ago(timeframe)
| where Source == "Microsoft-Windows-Sysmon"
| where EventID in (17,18)
| extend EvData = parse_xml(EventData)
| extend EventDetail = EvData.DataItem.EventData.Data
| extend NamedPipe = EventDetail.[5].["#text"]
| extend ProcessDetail = EventDetail.[6].["#text"]
| where NamedPipe contains '583da945-62af-10e8-4902-a8f205c72b2e'
| extend Account = UserName
| project-away EventDetail, EvData
),
(
SecurityEvent
| where TimeGenerated >= ago(timeframe)
| where EventID == '5145'
| where AccessList has '%%4418' // presence of CreatePipeInstance value
| where RelativeTargetName contains '583da945-62af-10e8-4902-a8f205c72b2e'
)
)
| extend timestamp = TimeGenerated, AccountCustomEntity = Account, HostCustomEntity = Computer
```

### Identify escalating privileges in your system

Once an attacker has a system account level access, they will attempt to access domain administrator levels.

Use any of the following linked queries to identify unusual sign-in activities or additions to privileged groups:

- [Check for hosts with new sign-ins to identify potential lateral movement by the attacker](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SecurityEvent/HostsWithNewLogons.yaml).
- [Check for new accounts created and added to a built-in administrators group](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/SecurityEvent/UserCreatedAddedToBuiltinAdmins_1d.yaml).
- [Check for user accounts added to privileged, built-in domain local or global groups](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/SecurityEvent/UserAccountAddedToPrivlegeGroup_1h.yaml). This query includes accounts added to domain-privileged group, such as Enterprise Admins, Cert Publisher, or DnsAdmins. 
- [Check for unusual activity performed by a high-value account on a system or service](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/MultipleDataSources/TrackingPrivAccounts.yaml)

In some affected environments, service account credentials were granted administrative privileges. If needed, modify any of the queries listed above to remove the *user* focus by commenting out the following line where relevant:

```kusto
//| where AccountType == "User"
```
 
For more information, see:

- [Azure Sentinel GitHub](https://github.com/Azure/Azure-Sentinel)- **Detections** and **Hunting Queries** sections for AuditLogs and SecurityEvents
- [Microsoft 365 Defender advanced hunting portal](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries)
- [Use Microsoft Defender solutions to identify malicious activity in your network](#microsoft-defender), below

### Find exported certificates

Once an attacker has domain administrator access, they will steal the SAML token-signing certificate from the AD FS server. 

Once the certificate has been acquired, the attacker can forge SAML tokens with any claims and lifetime they choose, and then sign it with the stolen certificate. The attacker can then forge SAML tokens and impersonate highly privileged accounts. 

Microsoft 365 Defender has added high-fidelity detections for the Solarigate attack, which you can view in the Azure Sentinel Security Alerts, or in the Microsoft 365 security portal.

For more information, see:

- [Find stolen certificates using Windows Event logs](#find-stolen-certificates-using-windows-event-logs)
- [Find stolen certificates using Sysmon logs](#find-stolen-certificates-using-sysmon-logs)

The attacker may also have used custom tools, and so looking for unusual processes running or accounts signing into the AD FS server can provide insights about when attacks have happened.

For more information, see the following linked queries:

- [Find rare and unusual processes in your environment](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SecurityEvent/ProcessEntropy.yaml)
- [Find rare processes run by service accounts](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SecurityEvent/RareProcbyServiceAccount.yaml)
- [Find uncommon processes that are in the bottom 5% of all processes](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SecurityEvent/uncommon_processes.yaml)

> [!NOTE]
> Some environments have a rare command line syntax related to DLL loading. In such cases, adjust the queries linked above to also look at rarity on the command line.
> In some cases, depending on your environment configuration, using these queries as generic queries can be noisy. Therefore, we recommend to first limiting this sort of hunting to the ADFS server, and then only expand it if needed.

 
#### Find stolen certificates using Windows Event logs

The following query finds evidence of exported ADFS DKM master keys using Windows Event logs. 

For more information, see the [ADFS DKM Master Key Export](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ADFS-DKM-MasterKey-Export.yaml) query on GitHub.

```kusto
 (union isfuzzy=true (SecurityEvent
| where EventID == 4662
| where ObjectServer == 'DS'
| where OperationType == 'Object Access'
//| where ObjectName contains '<GUID of ADFS DKM Container>' This is unique to the domain.
| where ObjectType contains '5cb41ed0-0e4c-11d0-a286-00aa003049e2' // Contact Class
| where Properties contains '8d3bca50-1d7e-11d0-a081-00aa006c33ed' // Picture Attribute - Ldap-Display-Name: thumbnailPhoto
| extend timestamp = TimeGenerated, HostCustomEntity = Computer, AccountCustomEntity = SubjectAccount),
(DeviceEvents
| where ActionType =~ "LdapSearch"
| where AdditionalFields.AttributeList contains "thumbnailPhoto"
| extend timestamp = TimeGenerated, HostCustomEntity = DeviceName, AccountCustomEntity = InitiatingProcessAccountName)
)
```

#### Find stolen certificates using Sysmon logs

The following query uses the visibility provided by Sysmon logs to provide detections with more reliability than Windows Event logs. 

To use this query, you must be collecting Sysmon Event IDs 17 and 18 into your Azure Sentinel workspace.

For more information, see the [ADFSKeyExportSysmon](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/SecurityEvent/ADFSKeyExportSysmon.yaml) query on GitHub.


### Use Sentinel to hunt through Azure Active Directory logs

The Solorigate attacker also targeted the Azure AD for affected systems, and modified Azure AD settings to provide themselves with long-term access. You can use queries in the [Azure Sentinel workbook](https://github.com/Azure/Azure-Sentinel) to identify such activities in Azure AD.

For example, the [Azure Sentinel query for modified domain federation trust settings](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/AuditLogs/ADFSDomainTrustMods.yaml) alerts when a user or application modifies the federation settings on the domain, particularly when a new ADFS Trusted Realm object, such as a signing certificate, is added to the domain.
 
Since domain federation setting modifications should be rare, this would be a high-fidelity alert where Azure Sentinel users should pay careful attention.

Use the following queries to hunt for additional unusual activity:

- [Find modifications made to STS refresh tokens](#find-modifications-made-to-sts-refresh-tokens)
- [Find access added to service principals or applications](#find-access-added-to-service-principals-or-applications)
- [Find applications with permissions to read mailbox contents](#find-applications-with-permissions-to-read-mailbox-contents)

> [!TIP]
> You can also monitor Azure AD for sign-ins that attempt to use invalid key material. For example, this may occur when an attacker attempts to use a stolen key after the key material has already been rotated. 
>
> To do this, use Azure Sentinel to query **SignInLogs**, where the **ResultType**=**5000811**. 
>
> Note that if you roll your token-signing certificate, there will be expected activity for this query.
>

#### Find modifications made to STS refresh tokens

Use the following Sentinel query to check for modifications made to Active Directory Security Token Service (STS) refresh tokens, by service principals and applications other than DirectorySync. 

> [!Note]
> While these events are most often generated when legitimate administrators troubleshoot user sign-ins, it may also be generated for malicious token extensions.
>
> We recommend that you confirm whether any activity found is related to legitimate administrator activity, and check the new token's validation time period for high values.
>

```kusto
let auditLookback = 1d;
AuditLogs
| where TimeGenerated > ago(auditLookback)
| where OperationName has 'StsRefreshTokenValidFrom'
| where TargetResources[0].modifiedProperties != '[]'
| where TargetResources[0].modifiedProperties !has 'DirectorySync'
| extend TargetResourcesModProps = TargetResources[0].modifiedProperties
| mv-expand TargetResourcesModProps
| where tostring(TargetResourcesModProps.displayName) =~ 'StsRefreshTokensValidFrom'
| extend InitiatingUserOrApp = iff(isnotempty(InitiatedBy.user.userPrincipalName),tostring(InitiatedBy.user.userPrincipalName), tostring(InitiatedBy.app.displayName))
| where InitiatingUserOrApp !in ('Microsoft Cloud App Security')
| extend targetUserOrApp = TargetResources[0].userPrincipalName
| extend eventName = tostring(TargetResourcesModProps.displayName)
| extend oldStsRefreshValidFrom = todatetime(parse_json(tostring(TargetResourcesModProps.oldValue))[0])
| extend newStsRefreshValidFrom = todatetime(parse_json(tostring(TargetResourcesModProps.newValue))[0])
| extend tokenMinutesAdded = datetime_diff('minute',newStsRefreshValidFrom,oldStsRefreshValidFrom)
| extend tokenMinutesRemaining = datetime_diff('minute',TimeGenerated,newStsRefreshValidFrom)
| project-reorder Result, AADOperationType
| extend InitiatingIpAddress = iff(isnotempty(InitiatedBy.user.ipAddress), tostring(InitiatedBy.user.ipAddress), tostring(InitiatedBy.app.ipAddress))
| extend timestamp = TimeGenerated, AccountCustomEntity = InitiatingUserOrApp, IPCustomEntity = InitiatingIpAddress
```

#### Find access added to service principals or applications

Use the following Sentinel queries to find where new access credentials have been added to an application or service principal:

- [Additional credentials added to applications or service principals](#additional-credentials-added-to-applications-or-service-principals)
- [First credentials added to applications or service principals](#first-credentials-added-to-applications-or-service-principals)

##### Additional credentials added to applications or service principals

Use the following Sentinel query to find new access credentials added to an application or service principal.

For more information, see the [NewAppOrServicePrincipalCredential](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/AuditLogs/NewAppOrServicePrincipalCredential.yaml) query on GitHub.

```kusto
let auditLookback = 1h;
AuditLogs
| where TimeGenerated > ago(auditLookback)
| where OperationName has_any ("Add service principal", "Certificates and secrets management") // captures "Add service principal", "Add service principal credentials", and "Update application – Certificates and secrets management" events
| where Result =~ "success"
| mv-expand target = TargetResources
| where tostring(InitiatedBy.user.userPrincipalName) has "@" or tostring(InitiatedBy.app.displayName) has "@"
| extend targetDisplayName = tostring(TargetResources[0].displayName)
| extend targetId = tostring(TargetResources[0].id)
| extend targetType = tostring(TargetResources[0].type)
| extend keyEvents = TargetResources[0].modifiedProperties
| mv-expand keyEvents
| where keyEvents.displayName =~ "KeyDescription"
| extend new_value_set = parse_json(tostring(keyEvents.newValue))
| extend old_value_set = parse_json(tostring(keyEvents.oldValue))
| where old_value_set != "[]"
| extend diff = set_difference(new_value_set, old_value_set)
| where isnotempty(diff)
| parse diff with * "KeyIdentifier=" keyIdentifier:string ",KeyType=" keyType:string ",KeyUsage=" keyUsage:string ",DisplayName=" keyDisplayName:string "]" *
| where keyUsage == "Verify" or keyUsage == ""
| extend UserAgent = iff(AdditionalDetails[0].key == "User-Agent",tostring(AdditionalDetails[0].value),"")
| extend InitiatingUserOrApp = iff(isnotempty(InitiatedBy.user.userPrincipalName),tostring(InitiatedBy.user.userPrincipalName), tostring(InitiatedBy.app.displayName))
| extend InitiatingIpAddress = iff(isnotempty(InitiatedBy.user.ipAddress), tostring(InitiatedBy.user.ipAddress), tostring(InitiatedBy.app.ipAddress))
// The below line is currently commented out but Azure Sentinel users can modify this query to show only Application or only Service Principal events in their environment
//| where targetType =~ "Application" // or targetType =~ "ServicePrincipal"
| project-away diff, new_value_set, old_value_set
| project-reorder TimeGenerated, OperationName, InitiatingUserOrApp, InitiatingIpAddress, UserAgent, targetDisplayName, targetId, targetType, keyDisplayName, keyType, keyUsage, keyIdentifier, CorrelationId, TenantId
| extend timestamp = TimeGenerated, AccountCustomEntity = InitiatingUserOrApp, IPCustomEntity = InitiatingIpAddress
```

##### First credentials added to applications or service principals

Use the following Sentinel query to find a first access credential added to an application or service principal, where no credentials were already present:

For more information, see the [FirstAppOrServicePrincipalCredential](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/AuditLogs/FirstAppOrServicePrincipalCredential.yaml) query on GitHub.

```kusto
let auditLookback = 1h;
AuditLogs
| where TimeGenerated > ago(auditLookback)
| where OperationName has_any ("Add service principal", "Certificates and secrets management") // captures "Add service principal", "Add service principal credentials", and "Update application – Certificates and secrets management" events
| where Result =~ "success"
| mv-expand target = TargetResources
| where tostring(InitiatedBy.user.userPrincipalName) has "@" or tostring(InitiatedBy.app.displayName) has "@"
| extend targetDisplayName = tostring(TargetResources[0].displayName)
| extend targetId = tostring(TargetResources[0].id)
| extend targetType = tostring(TargetResources[0].type)
| extend keyEvents = TargetResources[0].modifiedProperties
| mv-expand keyEvents
| where keyEvents.displayName =~ "KeyDescription"
| extend new_value_set = parse_json(tostring(keyEvents.newValue))
| extend old_value_set = parse_json(tostring(keyEvents.oldValue))
| where old_value_set == "[]"
| parse new_value_set with * "KeyIdentifier=" keyIdentifier:string ",KeyType=" keyType:string ",KeyUsage=" keyUsage:string ",DisplayName=" keyDisplayName:string "]" *
| where keyUsage == "Verify" or keyUsage == ""
| extend UserAgent = iff(AdditionalDetails[0].key == "User-Agent",tostring(AdditionalDetails[0].value),"")
| extend InitiatingUserOrApp = iff(isnotempty(InitiatedBy.user.userPrincipalName),tostring(InitiatedBy.user.userPrincipalName), tostring(InitiatedBy.app.displayName))
| extend InitiatingIpAddress = iff(isnotempty(InitiatedBy.user.ipAddress), tostring(InitiatedBy.user.ipAddress), tostring(InitiatedBy.app.ipAddress))
// The below line is currently commented out but Azure Sentinel users can modify this query to show only Application or only Service Principal events in their environment
//| where targetType =~ "Application" // or targetType =~ "ServicePrincipal"
| project-away new_value_set, old_value_set
| project-reorder TimeGenerated, OperationName, InitiatingUserOrApp, InitiatingIpAddress, UserAgent, targetDisplayName, targetId, targetType, keyDisplayName, keyType, keyUsage, keyIdentifier, CorrelationId, TenantId
| extend timestamp = TimeGenerated, AccountCustomEntity = InitiatingUserOrApp, IPCustomEntity = InitiatingIpAddress
```

#### Find applications with permissions to read mailbox contents

The Solarigate attacker used applications with access to users mailboxes to read through privileged information.

Use the following query to find such applications, and then verify that their access is legitimate and genuinely required:

```kusto
AuditLogs
| where Category =~ "ApplicationManagement"
| where ActivityDisplayName =~ "Add delegated permission grant"
| where Result =~ "success"
| where tostring(InitiatedBy.user.userPrincipalName) has "@" or tostring(InitiatedBy.app.displayName) has "@"
| extend props = parse_json(tostring(TargetResources[0].modifiedProperties))
| mv-expand props
| extend UserAgent = tostring(AdditionalDetails[0].value)
| extend InitiatingUser = tostring(parse_json(tostring(InitiatedBy.user)).userPrincipalName)
| extend UserIPAddress = tostring(parse_json(tostring(InitiatedBy.user)).ipAddress)
| extend DisplayName = tostring(props.displayName)
| extend Permissions = tostring(parse_json(tostring(props.newValue)))
| where Permissions has_any ("Mail.Read", "Mail.ReadWrite")
| extend PermissionsAddedTo = tostring(TargetResources[0].displayName)
| extend Type = tostring(TargetResources[0].type)
| project-away props
| join kind=leftouter(
AuditLogs
| where ActivityDisplayName has "Consent to application"
| extend AppName = tostring(TargetResources[0].displayName)
| extend AppId = tostring(TargetResources[0].id)
| project AppName, AppId, CorrelationId) on CorrelationId
| project-reorder TimeGenerated, OperationName, InitiatingUser, UserIPAddress, UserAgent, PermissionsAddedTo, Permissions, AppName, AppId, CorrelationId
| extend timestamp = TimeGenerated, AccountCustomEntity = InitiatingUser, IPCustomEntity = UserIPAddress
```

> [!IMPORTANT]
> We also recommend hunting for application consents for unexpected applications, especially if they provide offline access to data or other high-value access. For more information, see the following queries:
>
> - [Suspicious application consent similar to O365 Attack Toolkit](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/AuditLogs/MaliciousOAuthApp_O365AttackToolkit.yaml)
> - [Suspicious application consent for offline access](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/AuditLogs/SuspiciousOAuthApp_OfflineAccess.yaml)

 

### Find reconnaissance and remote process execution

An attacker might attempt to access on-premises systems to gain further insight about the environment mapping. For example, in the Solarigate attack, the attacker renamed the **adfind.exe** Windows administrative tool and then used it to enumerate domains in the system.

Search for such process executions, which may look as follows:

```VB
C:\Windows\system32\cmd.exe /C csrss.exe -h breached.contoso.com -f (name=”Domain Admins”) member -list | csrss.exe -h breached.contoso.com -f objectcategory=* > .\Mod\mod1.log
```

Customize the following query as needed to look at your specific DC/ADFS servers, and find command line patterns related to ADFind usage:

For more information, see the [Suspicious_enumeration_using_adfind](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SecurityEvent/Suspicious_enumeration_using_adfind.yaml) query on GitHub.

```kusto
let startdate = 1d;
let lookupwindow = 2m;
let threshold = 3; //number of commandlines in the set below
let DCADFSServersList = dynamic (["DCServer01", "DCServer02", "ADFSServer01"]); // Enter a reference list of hostnames for your DC/ADFS servers
let tokens = dynamic(["objectcategory","domainlist","dcmodes","adinfo","trustdmp","computers_pwdnotreqd","Domain Admins", "objectcategory=person", "objectcategory=computer", "objectcategory=*"]);
SecurityEvent
//| where Computer in (DCADFSServersList) // Uncomment to limit it to your DC/ADFS servers list if specified above or any pattern in hostnames (startswith, matches regex, etc).
| where TimeGenerated between (ago(startdate) .. now())
| where EventID == 4688
| where CommandLine has_any (tokens)
| where CommandLine matches regex "(.*)>(.*)"
| summarize Commandlines = make_set(CommandLine), LastObserved=max(TimeGenerated) by bin(TimeGenerated, lookupwindow), Account, Computer, ParentProcessName, NewProcessName
| extend Count = array_length(Commandlines)
| where Count > threshold
```

If you have the [Windows Event 4648](/windows/security/threat-protection/auditing/event-4648) collected to Azure Sentinel, you can also use the following query to find instances where the execution runs via multiple, explicit credentials against remote targets:

For more information, see the [MultipleExplicitCredentialUsage4648Events](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SecurityEvent/MultipleExplicitCredentialUsage4648Events.yaml) query on GitHub.

```kusto
let WellKnownLocalSIDs = "S-1-5-[0-9][0-9]$";
let protocols = dynamic(['cifs', 'ldap', 'RPCSS', 'host' , 'HTTP', 'RestrictedKrbHost', 'TERMSRV', 'msomsdksvc', 'mssqlsvc']);
SecurityEvent
| where TimeGenerated >= ago(1d)
| where EventID == 4648
| where SubjectUserSid != 'S-1-0-0' // this is the Nobody SID which really means No security principal was included.
| where not(SubjectUserSid matches regex WellKnownLocalSIDs) //excluding system account/service account as this is generally normal
| where TargetInfo has '/' //looking for only items that indicate an interesting protocol is included
| where Computer !has tostring(split(TargetServerName,'$')[0])
| where TargetAccount !~ tostring(split(SubjectAccount,'$')[0])
| extend TargetInfoProtocol = tolower(split(TargetInfo, '/')[0]), TargetInfoMachine = toupper(split(TargetInfo, '/')[1])
| extend TargetAccount = tolower(TargetAccount), SubjectAccount = tolower(SubjectAccount)
| extend UncommonProtocol = case(not(TargetInfoProtocol has_any (protocols)), TargetInfoProtocol, 'NotApplicable')
| summarize StartTime = min(TimeGenerated), EndTime = max(TimeGenerated), AccountsUsedCount = dcount(TargetAccount), AccountsUsed = make_set(TargetAccount), TargetMachineCount = dcount(TargetInfoMachine),
TargetMachines = make_set(TargetInfoMachine), TargetProtocols = dcount(TargetInfoProtocol), Protocols = make_set(TargetInfoProtocol), Processes = make_set(Process) by Computer, SubjectAccount, UncommonProtocol
| where TargetMachineCount > 1 or UncommonProtocol != 'NotApplicable'
| extend ProtocolCount = array_length(Protocols)
| extend ProtocolScore = case(
Protocols has 'rpcss' and Protocols has 'host' and Protocols has 'cifs', 10, //observed in Solorigate and depending on which are used together the higher the score
Protocols has 'rpcss' and Protocols has 'host', 5,
Protocols has 'rpcss' and Protocols has 'cifs', 5,
Protocols has 'host' and Protocols has 'cifs', 5,
Protocols has 'ldap' or Protocols has 'rpcss' or Protocols has 'host' or Protocols has 'cifs', 1, //ldap is more commonly seen in general, this was also seen with Solorigate but not usually to the same machines as the others above
UncommonProtocol != 'NotApplicable', 3,
0 //other protocols may be of interest, but in relation to observations for enumeration/execution in Solorigate they receive 0
)
| extend Score = ProtocolScore + ProtocolCount + AccountsUsedCount
| where Score >= 9 or (UncommonProtocol != 'NotApplicable' and Score >= 4) // Score must be 9 or better as this will include 5 points for atleast 2 of the interesting protocols + the count of protocols (min 2) + the number of accounts used for execution (min 2) = min of 9 OR score must be 4 or greater for an uncommon protocol
| extend TimePeriod = EndTime - StartTime //This identifies the time between start and finish for the use of the explicit credentials, shorter time period may indicate scripted executions
| project-away UncommonProtocol
| extend timestamp = StartTime, AccountCustomEntity = SubjectAccount, HostCustomEntity = Computer
| order by Score desc
```



 
### Find illicit data access

Use the following Sentinel queries to find evidence of illicit data access in your system:

- [Find instances of sign-ins used to access non-AD resources](#find-instances-of-sign-ins-used-to-access-non-ad-resources)
- [Find instances of MFA sign-ins using tokens](#find-instances-of-mfa-sign-ins-using-tokens)
- [Find sign-ins from Virtual Private Servers (VPS)](#find-sign-ins-from-virtual-private-servers-vps)

#### Find instances of sign-ins used to access non-AD resources

Use the following Sentinel queries to find instances of user or application sign-ins that use Azure AD PowerShell to access non-AD resources.

**Prerequisites**: To use this query, you must have Diagnostic Logging enabled on your workspace, including the **AADServicePrincipalSigninLogs** datatype configured in your settings.

```kusto
AADServicePrincipalSignInLogs
| where TimeGenerated > ago(90d)
| where ResourceDisplayName == "Microsoft Graph"
| where ServicePrincipalId == "524c43c4-c484-4f7a-bd44-89d4a0d8aeab"
| summarize count() by bin(TimeGenerated, 1h)
| render timechart
```

#### Find instances of MFA sign-ins using tokens

The following query can return sign-ins to Azure AD, where MFA was satisfied using a token-based sign-in instead of phone or other similar authentication. 

To slim down the results returned, we recommend that you use the following query as an example and fine-tune it for your environment.

```kusto
SigninLogs
| where TimeGenerated > ago(30d)
| where ResultType == 0
| extend additionalDetails = tostring(Status.additionalDetails)
| summarize make_set(additionalDetails), min(TimeGenerated), max(TimeGenerated) by IPAddress, UserPrincipalName
| where array_length(set_additionalDetails) == 2
| where (set_additionalDetails[1] == "MFA requirement satisfied by claim in the token" and set_additionalDetails[0] == "MFA requirement satisfied by claim provided by external provider") or (set_additionalDetails[0] == "MFA requirement satisfied by claim in the token" and set_additionalDetails[1] == "MFA requirement satisfied by claim provided by external provider")
//| project IPAddress, UserPrincipalName, min_TimeGenerated, max_TimeGenerated
```

#### Find sign-ins from Virtual Private Servers (VPS)

The Solarigate attack used VPS hosts to access affected networks. Use the following linked queries together with other queries listed above to find evidence of access gained via VPS hosts:

- [Find successful sign-ins from network ranges associated with VPS providers](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SigninLogs/Signins-From-VPS-Providers.yaml). This query may return a large number of false positives. We recommend investigating any results before proceeding.

- [Find sign-ins that come from known VPS provider network ranges](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/ipv4-lookup-plugin). This query can also be used to find all sign-ins that do not come from known ranges, especially if your environment has a common sign-in source.

### Find mail data exfiltration 

Use the following Sentinel queries to monitor for suspicious access to email data:

- [Find suspicious access to MailItemsAccessed volumes](#find-suspicious-access-to-mailitemsaccessed-volumes)
- [Find time series-based anomolies in MailItemsAccessed events](#find-time-series-based-anomolies-in-mailitemsaccessed-events)
- [Find OWA data exfiltrations](#find-owa-data-exfiltrations)
- [Find non-owner mailbox sign-in activity](#find-non-owner-mailbox-sign-in-activity)
-
#### Find suspicious access to MailItemsAccessed volumes

Use the following Sentinel query to find suspicious access to other users' mailboxes:

For more information, see the [AnomolousUserAccessingOtherUsersMailbox](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/OfficeActivity/AnomolousUserAccessingOtherUsersMailbox.yaml) query on GitHub:

```kusto
let timeframe = 14d;
let user_threshold = 1;
let folder_threshold = 5;
OfficeActivity
| where TimeGenerated > ago(timeframe)
| where Operation =~ "MailItemsAccessed"
| where ResultStatus =~ "Succeeded"
| mv-expand parse_json(Folders)
| extend folders = tostring(Folders.Path)
| where tolower(MailboxOwnerUPN) != tolower(UserId)
| extend ClientIP = iif(Client_IPAddress startswith "[", extract("\\[([^\\]]*)", 1, Client_IPAddress), Client_IPAddress)
| summarize make_set(folders), make_set(ClientInfoString), make_set(ClientIP), make_set(MailboxGuid), make_set(MailboxOwnerUPN) by UserId
| extend folder_count = array_length(set_folders)
| extend user_count = array_length(set_MailboxGuid)
| where user_count > user_threshold or folder_count > folder_threshold
| sort by user_count desc
| project-reorder UserId, user_count, folder_count, set_MailboxOwnerUPN, set_ClientIP, set_ClientInfoString, set_folder
```

#### Find time series-based anomolies in MailItemsAccessed events

Use the following Sentinel query to look for time series-based anomalies in **MailItemsAccessed** events in the **OfficeActivity** log.

For more information, see the [MailItemsAccessedTimeSeries](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/OfficeActivity/MailItemsAccessedTimeSeries.yaml) query on GitHub.

```kusto
let starttime = 14d;
let endtime = 1d;
let timeframe = 1h;
let scorethreshold = 1.5;
let percentthreshold = 50;
// Preparing the time series data aggregated hourly count of MailItemsAccessd Operation in the form of multi-value array to use with time series anomaly function.
let TimeSeriesData =
OfficeActivity
| where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime)))
| where OfficeWorkload=~ "Exchange" and Operation =~ "MailItemsAccessed" and ResultStatus =~ "Succeeded"
| project TimeGenerated, Operation, MailboxOwnerUPN
| make-series Total=count() on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe;
let TimeSeriesAlerts = TimeSeriesData
| extend (anomalies, score, baseline) = series_decompose_anomalies(Total, scorethreshold, -1, 'linefit')
| mv-expand Total to typeof(double), TimeGenerated to typeof(datetime), anomalies to typeof(double), score to typeof(double), baseline to typeof(long)
| where anomalies > 0
| project TimeGenerated, Total, baseline, anomalies, score;
// Joining the flagged outlier from the previous step with the original dataset to present contextual information
// during the anomalyhour to analysts to conduct investigation or informed decisions.
TimeSeriesAlerts | where TimeGenerated > ago(2d)
// Join against base logs since specified timeframe to retrive records associated with the hour of anomoly
| join (
OfficeActivity
| where TimeGenerated > ago(2d)
| where OfficeWorkload=~ "Exchange" and Operation =~ "MailItemsAccessed" and ResultStatus =~ "Succeeded"
) on TimeGenerated
```

#### Find OWA data exfiltrations

Use the following Sentinel queries to find instances of PowerShell commands being used to export on-premises Exchange mailboxes, and then hosting the files on OWA servers in order to exfiltrate them.

- [Find hosts that created then removed mailbox export requests](#find-hosts-that-created-then-removed-mailbox-export-requests)
- [Find exported mailboxes hosted on OWA](#find-exported-mailboxes-hosted-on-owa)

##### Find hosts that created then removed mailbox export requests

For more information, see the [HostExportingMailboxAndRemovingExport](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SecurityEvent/HostExportingMailboxAndRemovingExport.yaml) query on GitHub.

```kusto
 // Adjust the timeframe to change the window events need to occur within to alert

  let timeframe = 1h;

  SecurityEvent

  | where Process in ("powershell.exe", "cmd.exe")

  | where CommandLine contains 'New-MailboxExportRequest'

  | summarize by Computer, timekey = bin(TimeGenerated, timeframe), CommandLine, SubjectUserName

  | join kind=inner (SecurityEvent

  | where Process in ("powershell.exe", "cmd.exe")

  | where CommandLine contains 'Remove-MailboxExportRequest'

  | summarize by Computer, timekey = bin(TimeGenerated, timeframe), CommandLine, SubjectUserName) on Computer, timekey, SubjectUserName

  | extend commands = pack_array(CommandLine1, CommandLine)

  | summarize by timekey, Computer, tostring(commands), SubjectUserName

  | project-reorder timekey, Computer, SubjectUserName, ['commands']

  | extend HostCustomEntity = Computer, AccountCustomEntity = SubjectUserName
```

##### Find exported mailboxes hosted on OWA

For more information, see the [SuspectedMailBoxExportHostonOWA](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/W3CIISLog/SuspectedMailBoxExportHostonOWA.yaml) query on GitHub.


```kusto
let excludeIps = dynamic(["127.0.0.1", "::1"]);
let scriptingExt = dynamic(["aspx", "ashx", "asp"]);
W3CIISLog
| where csUriStem contains "/owa/"
//The actor pulls a file back but won't send it any URI params
| where isempty(csUriQuery)
| extend file_ext = tostring(split(csUriStem, ".")[-1])
//Giving your file a known scripting extension will throw an error
//rather than just serving the file as it will try to interpret the script
| where file_ext !in~ (scriptingExt)
//The actor was seen using image files, but we go wider in case they change this behaviour
//| where file_ext in~ ("jpg", "jpeg", "png", "bmp")
| extend file_name = tostring(split(csUriStem, "/")[-1])
| where file_name != ""
| where cIP !in~ (excludeIps)
| project file_ext, csUriStem, file_name, Computer, cIP, sIP, TenantId, TimeGenerated
| summarize dcount(cIP), AccessingIPs=make_set(cIP), AccessTimes=make_set(TimeGenerated), Access=count() by TenantId, file_name, Computer, csUriStem
//Collection of the exfiltration will occur only once, lets check for 2 accesses in case they mess up
//Tailor this for hunting
| where Access <= 2 and dcount_cIP == 1
```



#### Find non-owner mailbox sign-in activity

Use the following Sentinel query to find non-owner sign-in activity, which can be used to delegate email access to other users. 

For more information, see the [nonowner_MailboxLogin](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/OfficeActivity/nonowner_MailboxLogin.yaml) query on GitHub.

```kusto
let timeframe = 1d;
OfficeActivity
| where TimeGenerated >= ago(timeframe)
| where Operation == "MailboxLogin" and Logon_Type != "Owner"
| summarize count(), min(TimeGenerated), max(TimeGenerated) by Operation, OrganizationName, UserType, UserId, MailboxOwnerUPN, Logon_Type
| extend timestamp = min_TimeGenerated, AccountCustomEntity = UserId
``` 

### Find suspicious domain-related activity

Use the following queries to find suspicious domain activity related to the Solarigate attack:

- [Find suspicious domain-specific activity](#find-suspicious-domain-specific-activity)
- [Find suspicious domain DGA activity](#find-suspicious-domain-dga-activity)
- [Find suspicious encoded domain activity](#find-suspicious-encoded-domain-activity)

#### Find suspicious domain-specific activity

Use the following Sentinel query to find IOCs collected from [MSTIC](https://blogs.microsoft.com/on-the-issues/2020/12/13/customers-protect-nation-state-cyberattacks/), [FireEye](https://github.com/fireeye/sunburst_countermeasures/blob/main/indicator_release/Indicator_Release_NBIs.csv), and [Volexity](https://www.volexity.com/blog/2020/12/14/dark-halo-leverages-solarwinds-compromise-to-breach-organizations/), using multiple network-focused data sources.

For more information, see the [Solorigate-Network-Beacon](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/CommonSecurityLog/Solorigate-Network-Beacon.yaml) query on GitHub.

```kusto
let domains = dynamic(["incomeupdate.com","zupertech.com","databasegalore.com","panhardware.com","avsvmcloud.com","digitalcollege.org","freescanonline.com","deftsecurity.com","thedoccloud.com","virtualdataserver.com","lcomputers.com","webcodez.com","globalnetworkissues.com","kubecloud.com","seobundlekit.com","solartrackingsystem.net","virtualwebdata.com"]);
let timeframe = 6h;
(union isfuzzy=true
(CommonSecurityLog
| where TimeGenerated >= ago(timeframe)
| parse Message with * '(' DNSName ')' *
| where DNSName in~ (domains) or DestinationHostName has_any (domains) or RequestURL has_any(domains)
| extend AccountCustomEntity = SourceUserID, HostCustomEntity = DeviceName, IPCustomEntity = SourceIP
),
(DnsEvents
| where TimeGenerated >= ago(timeframe)
| extend DNSName = Name
| where isnotempty(DNSName)
| where DNSName in~ (domains)
| extend IPCustomEntity = ClientIP
),
(VMConnection
| where TimeGenerated >= ago(timeframe)
| parse RemoteDnsCanonicalNames with * '["' DNSName '"]' *
| where isnotempty(DNSName)
| where DNSName in~ (domains)
| extend IPCustomEntity = RemoteIp
),
(DeviceNetworkEvents
| where TimeGenerated >= ago(timeframe)
| where isnotempty(RemoteUrl)
| where RemoteUrl has_any (domains)
| extend DNSName = RemoteUrl
| extend IPCustomEntity = RemoteIP
| extend HostCustomEntity = DeviceName
)
)
```

#### Find suspicious domain DGA activity

The Solarigate attacker made several DGA-like subdomain queries as part of C2 activities.

Use the following Sentinel query to find similar patterns of activity from other domains, which can help identify other potential C2 sources.

For more information, see the [Solorigate-DNS-Pattern](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/DnsEvents/Solorigate-DNS-Pattern.yaml) query on GitHub.

```kusto
let cloudApiTerms = dynamic(["api", "east", "west"]);
DnsEvents
| where IPAddresses != "" and IPAddresses != "127.0.0.1"
| where Name endswith ".com" or Name endswith ".org" or Name endswith ".net"
| extend domain_split = split(Name, ".")
| where tostring(domain_split[-5]) != "" and tostring(domain_split[-6]) == ""
| extend sub_domain = tostring(domain_split[0])
| where sub_domain !contains "-"
| extend sub_directories = strcat(domain_split[-3], " ", domain_split[-4])
| where sub_directories has_any(cloudApiTerms)
//Based on sample communications the subdomain is always between 20 and 30 bytes
| where strlen(domain_split) < 32 or strlen(domain_split) > 20
| extend domain = strcat(tostring(domain_split[-2]), ".", tostring(domain_split[-1]))
| extend subdomain_no = countof(sub_domain, @"(\d)", "regex")
| extend subdomain_ch = countof(sub_domain, @"([a-z])", "regex")
| where subdomain_no > 1
| extend percentage_numerical = toreal(subdomain_no) / toreal(strlen(sub_domain)) * 100
| where percentage_numerical < 50 and percentage_numerical > 5
| summarize count(), make_set(Name), FirstSeen=min(TimeGenerated), LastSeen=max(TimeGenerated) by Name
| order by count_ asc
```

#### Find suspicious encoded domain activity

Use the following Sentinel query to search DNS logs for a pattern that includes the encoding pattern used by the DGA and encoded domains seen in sign-in logs. Results from this query can help identify other C2 domains that use the same enconding scheme.

For more information, see the [Solorigate-Encoded-Domain-URL](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/DnsEvents/Solorigate-Encoded-Domain-URL.yaml) query on GitHub.

```kusto
let dictionary = dynamic(["r","q","3","g","s","a","l","t","6","u","1","i","y","f","z","o","p","5","7","2","d","4","9","b","n","x","8","c","v","m","k","e","w","h","j"]);
let regex_bad_domains = SigninLogs
//Collect domains from tenant from signin logs
| where TimeGenerated > ago(1d)
| extend domain = tostring(split(UserPrincipalName, "@", 1)[0])
| where domain != ""
| summarize by domain
| extend split_domain = split(domain, ".")
//This cuts back on domains such as na.contoso.com by electing not to match on the "na" portion
| extend target_string = iff(strlen(split_domain[0]) <= 2, split_domain[1], split_domain[0])
| extend target_string = split(target_string, "-")
| mv-expand target_string
//Rip all of the alphanumeric out of the domain name
| extend string_chars = extract_all(@"([a-z0-9])", tostring(target_string))
//Guid for tracking our data
| extend guid = new_guid()
//Expand to get all of the individual chars from the domain
| mv-expand string_chars
| extend chars = tostring(string_chars)
//Conduct computation to encode the domain as per actor spec
| extend computed_char = array_index_of(dictionary, chars)
| extend computed_char = dictionary[(computed_char + 4) % array_length(dictionary)]
| summarize make_list(computed_char) by guid, domain
| extend target_encoded = tostring(strcat_array(list_computed_char, ""))
//These are probably too small, but can be edited (expect FP's when going too small)
| where strlen(target_encoded) > 5
| distinct target_encoded
| summarize make_set(target_encoded)
//Key to join to DNS
| extend key = 1;
DnsEvents
| where TimeGenerated > ago(1d)
| summarize by Name
| extend key = 1
//For each DNS query join the malicious domain list
| join kind=inner (
regex_bad_domains
) on key
| project-away key
//Expand each malicious key for each DNS query observed
| mv-expand set_target_encoded
//IndexOf allows us to fuzzy match on the substring
| extend match = indexof(Name, set_target_encoded)
| where match > -1
```

### Find security service tampering

Use the following Sentinel query to detect any tampering with Microsoft Defender services. You can also adapt this query to identify tampering with other security services. 

For more information, see the [PotentialMicrosoftDefenderTampering](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/MultipleDataSources/PotentialMicrosoftDefenderTampering.yaml) query on GitHub.

```kusto
let includeProc = dynamic(["sc.exe","net1.exe","net.exe", "taskkill.exe", "cmd.exe", "powershell.exe"]);
let action = dynamic(["stop","disable", "delete"]);
let service1 = dynamic(['sense', 'windefend', 'mssecflt']);
let service2 = dynamic(['sense', 'windefend', 'mssecflt', 'healthservice']);
let params1 = dynamic(["-DisableRealtimeMonitoring", "-DisableBehaviorMonitoring" ,"-DisableIOAVProtection"]);
let params2 = dynamic(["sgrmbroker.exe", "mssense.exe"]);
let regparams1 = dynamic(['reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender"', 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Advanced Threat Protection"']);
let regparams2 = dynamic(['ForceDefenderPassiveMode', 'DisableAntiSpyware']);
let regparams3 = dynamic(['sense', 'windefend']);
let regparams4 = dynamic(['demand', 'disabled']);
let timeframe = 1d;
(union isfuzzy=true
(
SecurityEvent
| where TimeGenerated >= ago(timeframe)
| where EventID == 4688
| extend ProcessName = tostring(split(NewProcessName, '\\')[-1])
| where ProcessName in~ (includeProc)
| where (CommandLine has_any (action) and CommandLine has_any (service1))
or (CommandLine has_any (params1) and CommandLine has 'Set-MpPreference' and CommandLine has '$true')
or (CommandLine has_any (params2) and CommandLine has "/IM")
or (CommandLine has_any (regparams1) and CommandLine has_any (regparams2) and CommandLine has '/d 1')
or (CommandLine has "start" and CommandLine has "config" and CommandLine has_any (regparams3) and CommandLine has_any (regparams4))
| project TimeGenerated, Computer, Account, AccountDomain, ProcessName, ProcessNameFullPath = NewProcessName, EventID, Activity, CommandLine, EventSourceName, Type
),
(
Event
| where TimeGenerated >= ago(timeframe)
| where Source =~ "Microsoft-Windows-SENSE"
| where EventID == 87 and ParameterXml in ("<Param>sgrmbroker</Param>", "<Param>WinDefend</Param>")
| project TimeGenerated, Computer, Account = UserName, EventID, Activity = RenderedDescription, EventSourceName = Source, Type
),
(
DeviceProcessEvents
| where TimeGenerated >= ago(timeframe)
| where InitiatingProcessFileName in~ (includeProc)
| where (InitiatingProcessCommandLine has_any(action) and InitiatingProcessCommandLine has_any (service2) and InitiatingProcessParentFileName != 'cscript.exe')
or (InitiatingProcessCommandLine has_any (params1) and InitiatingProcessCommandLine has 'Set-MpPreference' and InitiatingProcessCommandLine has '$true')
or (InitiatingProcessCommandLine has_any (params2) and InitiatingProcessCommandLine has "/IM")
or (InitiatingProcessCommandLine has_any (regparams1) and InitiatingProcessCommandLine has_any (regparams2) and InitiatingProcessCommandLine has '/d 1')
or (InitiatingProcessCommandLine has_any("start") and InitiatingProcessCommandLine has "config" and InitiatingProcessCommandLine has_any (regparams3) and InitiatingProcessCommandLine has_any (regparams4))
| extend Account = iff(isnotempty(InitiatingProcessAccountUpn), InitiatingProcessAccountUpn, InitiatingProcessAccountName), Computer = DeviceName
| project TimeGenerated, Computer, Account, AccountDomain, ProcessName = InitiatingProcessFileName, ProcessNameFullPath = FolderPath, Activity = ActionType, CommandLine = InitiatingProcessCommandLine, Type, InitiatingProcessParentFileName
)
)
| extend timestamp = TimeGenerated, AccountCustomEntity = Account, HostCustomEntity = Computer
```

### Find correlations between Microsoft 365 Defender and Azure Sentinel detections

Use the following Sentinel query to collect the full range of Microsoft Defender detections currently deployed, which can provide an overview of such alerts and any hosts they're related to.

For more information, see the [Solorigate-Defender-Detections](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/SecurityAlert/Solorigate-Defender-Detections.yaml) query on GitHub.

```kusto
DeviceInfo
| extend DeviceName = tolower(DeviceName)
| join (SecurityAlert
| where ProviderName =~ "MDATP"
| extend ThreatName = tostring(parse_json(ExtendedProperties).ThreatName)
| where ThreatName has "Solarigate"
| extend HostCustomEntity = tolower(CompromisedEntity)
| take 10) on $left.DeviceName == $right.HostCustomEntity
| project TimeGenerated, DisplayName, ThreatName, CompromisedEntity, PublicIP, MachineGroup, AlertSeverity, Description, LoggedOnUsers, DeviceId, TenantId
| extend timestamp = TimeGenerated, IPCustomEntity = PublicIP
```

## Azure Active Directory

Microsoft has published a specific Azure AD workbook in the Azure administration portal to help you assess your organization's Solorigate risk and investigate any Identity-related indicators of compromise (IOCs) related to the attacks. 

- [Access the Microsoft Azure AD Solarigate workbook](#access-the-microsoft-azure-ad-solarigate-workbook)
- [Data shown in the Microsoft Azure AD Solarigate workbook](#data-shown-in-the-microsoft-azure-ad-solarigate-workbook)

> [!NOTE]
> The information in this workbook is also available in Azure AD audit and sign-in logs. The workbook helps to collect and visualize the information in a single view.
>
>This workbook includes an overview of some of the common attack patterns in AAD, not only in Solorigate, and can generally be useful as an investigation aid to ensure that your environment is safe from malicious actors.
>

For more information, see [Solarigate indicators of compromise (IOCs)](#solarigate-indicators-of-compromise-iocs).

### Access the Microsoft Azure AD Solarigate workbook

**Prerequisite**: Your Azure AD sign-in and audit logs must be integrated with Azure Monitor.

Integrating your logs with Azure Monitor enables you to store, query, and visualize your logs using workbooks for up to two years. Only sign-in and audit events created after the integration are stored, so this workbook will not contain any insights prior to the date of integration.

For more information, see [How to integrate activity logs with Log Analytics](/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics).

**To access the Azure AD workbook for Solarigate**:
 
1. Sign into the [Azure portal](https://portal.azure.com) and navigate to **Azure Active Directory**.

1. Scroll down the menu on the left, and under **Monitoring**, select **Workbooks**.

1. The **Troubleshoot** area, select the **Sensitive Operations Report**. 

### Data shown in the Microsoft Azure AD Solarigate workbook

In your [workbook](#access-the-microsoft-azure-ad-workbook-for-the-solarigate-risk), expand each of the following areas to learn more about activity detected in your tenant:

|Area  |Description  |
|---------|---------|
|**Modified application and service principal credentials/authentication methods**     |   Helps you detect any new credentials that were added to existing applications and service principals. <br><br>These new credentials allow attackers to authenticate as the target application or service principal, granting them access to all resources where it has permissions. <br><br>This area of the workbook displays the following data for your tenant: <br>- **All new credentials added** to applications and service principals, including the credential type <br>- **A list of the top actors**, and the number of credential modifications they performed <br>- **A timeline** for all credential changes <br><br>Use filters to drill down to suspicious actors or modified service principals.    <br><br>For more information, see [Apps & service principals in Azure AD - Microsoft identity platform](/active-directory/develop/app-objects-and-service-principals).  |
|**Modified federation settings**     |   Helps you understand changes performed to existing domain federation trusts, which can help an attacker to gain a long-term foothold in the environment by adding an attacker-controlled SAML IDP as a trusted authentication source. <br><br>This area of the workbook displays the following data for your tenant: <br>- Changes performed to existing domain federation trusts <br>- Any addition of new domains and trusts <br><br>**Important**: Any actions that modify or add domain federation trusts are rare and should be treated as high fidelity to be investigated as soon as possible. <br><br>For more information, see [What is federation with Azure AD?](/active-directory/hybrid/whatis-fed)|
|**Azure AD STS refresh token modifications by service principals and applications other than DirectorySync**     |  Lists any manual modifications made to refresh tokens, which are used to validate identification and obtain access tokens. <br><br>**Tip**: While manual modifications to refresh tokens may be legitimate, they have also been generated as a result of malicious token extensions. We recommend checking any new token validation time periods with high values, and investigating whether the change was legitimate or an attacker's attempt to gain persistence. <br><br>For more information, see [Refresh tokens in Azure AD](/azure/active-directory/develop/active-directory-configurable-token-lifetimes#refresh-tokens).  |
|**New permissions granted to service principals**     |  Helps you investigate any suspicious permissions added to an existing application or service principal. <br><br>Attackers may add permissions to existing applications or service principals when they are unable to find one that already has a highly privileged set of permissions they can use to gain access. <br><br>**Tip**: We recommend that administrators investigate any instances of excessively high permissions, included but not limited to: Exchange Online, Microsoft Graph, or Azure AD Graph <br><br>For more information, see [Microsoft identity platform scopes, permissions, and consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent).       |
|**Directory role and group membership updates for service principals**     |This area of the workbook provides an overview of all changes made to service principal memberships. <br><br>**Tip**: We recommend that you review the information for any additions to highly privileged roles and groups, which is another step an attacker might take in attempting to gain access to an environment.         |
|     |         |

## Microsoft Defender

Microsoft Defender solutions provide the following coverage and visibility to help protect against the Solorigate attack:


|Product  |Description  |
|---------|---------|
|**Microsoft Defender for Endpoint**     | Has comprehensive detection coverage across the Solorigate attack chain. These detections raise alerts that inform security operations teams about activities and artifacts related to the attack. <br><br>Since the attack compromised legitimate software that should not be interrupted, automatic remediation is not enabled. However, the detections provide visibility into the attack activity and can be used to investigate and hunt further.        |
|**Microsoft 365 Defender**     |  Provides visibility *beyond* endpoints, by consolidating threat data from across domains, including identities, data, cloud apps, as well as endpoints. Cross-domain visibility enables Microsoft 365 Defender to correlate signals and comprehensively resolve whole attack chains. <br><br>    Security operations teams can then hunt using rich threat data and gain insights for protecting networks from compromise.       |
|**Microsoft Defender Antivirus**     |  The default anti-malware solution on Windows 10, detects and blocks the malicious DLL and its behaviors. It quarantines malware, even if the process is running.  <br><br>For more information, see [Microsoft Defender Antivirus detections for Solarigate](#microsoft-defender-antivirus-detections-for-solarigate).     |
|     |         |

We recommend that Microsoft 365 Defender customers to start their investigations with the [threat analytics reports](#threat-analytics-reports) created by Microsoft specifically for Solarigate. 

Use these reports, and other alerts and queries to perform the following recommended steps:

- [Use Microsoft Defender to find devices with the compromised SolarWinds Orion application](#use-microsoft-defender-to-find-devices-with-the-compromised-solarwinds-orion-application)
- [Investigate related alerts and incidents](#investigate-related-alerts-and-incidents)
- [Hunt for related attacker activity](#hunt-for-related-attacker-activity)

For more information, see [Advanced query reference](#advanced-query-reference) and [MITRE ATT&CK techniques observed](#mitre-attck-techniques-observed).

### Microsoft Defender for threat analytics reports

Microsoft published the following threat analytics reports specifically to help investigate after the Solarigate attack. 

- [Sophisticated actor attacks FireEye](https://security.microsoft.com/threatanalytics3/a43fc0c6-120a-40c5-a948-a9f41eef0bf9/overview) provides information about the FireEye breach and compromised red team tools
- [Solorigate supply chain attack](https://security.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview) provides a detailed analysis of the SolarWinds supply chain compromise

These reports are available to all Microsoft Defender for Endpoint customers and Microsoft 365 Defender early adopters, and include a deep-dive analysis, MITRE techniques, detection details, recommended actions, updated lists of IOCs, and advanced hunting techniques to expand detection coverage. 

For example:

:::image type="content" source="media/solarwinds/Threat-analytics-solorigate.jpg" alt-text="Threat analytics report in the Microsoft Defender Security Center":::

For more information, see: 

- [Understand the analyst report in threat analytics](/windows/security/threat-protection/microsoft-defender-atp/threat-analytics-analyst-reports)
- [Threat analytics for Microsoft 365 security](https://security.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview)
- [Threat overview - Microsoft Defender for Endpoint](https://securitycenter.microsoft.com/threatanalytics3/2b74f636-146e-48dd-94f6-5cb5132467ca/overview)

### Use Microsoft Defender to find devices with the compromised SolarWinds Orion application

The threat analytics reports use insights from [threat and vulnerability management](/windows/security/threat-protection/microsoft-defender-atp/next-gen-threat-and-vuln-mgt) to identify devices that have the compromised SolarWinds Orion Platform binaries or are exposed to the attack due to misconfiguration.

From the **Vulnerability patching status** chart in threat analytics, view  mitigation details to see a list of devices with the vulnerability ID **TVM-2020-0002**. This vulnerability was added specifically to help with Solorigate investigations.

Threat and vulnerability management provides more info about the vulnerability ID **TVM-2020-0002**, and all relevant applications, via the Software inventory view. There are also multiple security recommendations to address this specific threat, including instructions to update the software versions installed on exposed devices.

**Related query**:

To search for Threat and Vulnerability Management data and find SolarWinds Orion software, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAI2QywrCMBBF71rwH7pTP8JdN27cKN1KH5EKfUATLYof78lAsYiChGQmd2ZOJpPK6aaLSuwRr9VBvc4KGpVrQN2pQ3ecgciguzJd1XB33HIVVDfswHbySrTUQk_sqNpyHP4nNTNiZcREW1aiFdU9rJgxQotxj_oPb49tLeJRoxbwRuurNnZ86cLZzYien7Ss3GIPq6-YRY8e_7tWOpvP9MaGrII5_O7ize-tkyl_zj59ZcecOMVSL39fnZCaAQAA&runQuery=true&timeRangeId=month): 

```kusto
DeviceTvmSoftwareInventoryVulnerabilities| where SoftwareVendor == ‘solarwinds’| where SoftwareName startswith ‘orion’| summarize dcount(DeviceName) by SoftwareName| sort by dcount_DeviceName desc
```

Data returned will be organized by product name and sorted by the number of devices the software is installed on.


### Investigate related alerts and incidents

Use the threat analytics report to locate devices with alerts related to the attack. The **Devices with alerts** chart identifies devices with malicious components or activities known to be directly related to Solorigate. Navigate through to get the list of alerts and investigate.

Alerts are collected into Microsoft 365 Defender incidents, which can help you see the relationship between detected activities.

Review incidents in the [Incidents](/microsoft-365/security/mtp/investigate-incidents?view=o365-worldwide) queue and look for any relevant alerts. 


- Some Solorigate activities may not be directly tied to this specific threat, but will trigger alerts due to suspicious or malicious behaviors. 

- Microsoft Threat Expert customers with [Experts on demand subscriptions](/windows/security/threat-protection/microsoft-defender-atp/microsoft-threat-experts#collaborate-with-experts-on-demand) can reach out directly to our on-demand hunters for more help in understanding the Solorigate threat and the scope of its impact in their environments.

> [!Caution]
> Some alerts are specially tagged with [Microsoft Threat Experts](https://aka.ms/threatexperts) to indicate malicious activities that Microsoft researchers found in customer environments during hunting, and sent [targeted attack notifications](/windows/security/threat-protection/microsoft-defender-atp/microsoft-threat-experts#targeted-attack-notification).   If you see an alert tagged with Microsoft Threat Experts, we strongly recommend that you give it immediate attention.
> 

For more information, see the [threat analytics](#microsoft-defender-for-threat-analytics-reports) report, and any of the following alerts:

- [Alerts by attack stage](#alerts-by-attack-stage)
- [Alerts by threat type](#alerts-by-threat-type)

Each alert provides a full description and recommended actions. For more information, see [Microsoft Defender Antivirus detections for Solarigate](#microsoft-defender-antivirus-detections-for-solarigate).

#### Alerts by attack stage

We recommend searching your Microsoft 365 Defender solutions for any of the following alerts, which indicate a specific stage in a Solarigate attack:

|Attack stage  |Microsoft 365 Defender detection or alert  |
|---------|---------|
|**Initial access**     |   	**Microsoft Defender for Endpoint**:<br>- ‘Solorigate’ high-severity malware was detected/blocked/prevented ([Trojan:MSIL/Solorigate.BR!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.BR!dha)) <br>- SolarWinds Malicious binaries associated with a supply chain attack      |
|**Execution and persistence**     |  **Microsoft Defender for Endpoint**: <br>-‘Solorigate’ high-severity malware was detected/blocked/prevented ([Trojan:Win64/Cobaltstrike.RN!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win64/Cobaltstrike.RN!dha), [Trojan:PowerShell/Solorigate.H!dha]((https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:PowerShell/Solorigate.H!dha&threatId=-2147196089))) <br>- Suspicious process launch by Rundll32.exe <br>- Use of living-off-the-land binary to run malicious code <br>- A WMI event filter was bound to a suspicious event consumer       |
|**Command and control**     |    **Microsoft Defender for Endpoint**: <br>- An active ‘Solorigate’ high-severity malware was detected/ blocked/prevented ([Trojan:Win64/Cobaltstrike.RN!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win64/Cobaltstrike.RN!dha))     |
|**Defense evasion**     |   **Microsoft Defender for Endpoint** <br>- Suspicious audit policy tampering      |
|**Reconnaissance**     |    **Microsoft Defender for Endpoint**: <br>- Masquerading Active Directory exploration tool<br>- Suspicious sequence of exploration activities <br>- Execution of suspicious known LDAP query fragments     |
|**Credential access**     |    **Microsoft Defender for Endpoint**: <br>- Suspicious access to LSASS (credential access) <br>-AD FS private key extraction attempt <br>-Possible attempt to access ADFS key material <br>-Suspicious ADFS adapter process created<br><br>**Microsoft Defender for Identity**: <br>-Unusual addition of permissions to an OAuth app <br>-Active Directory attributes Reconnaissance using LDAP <br><br>**Microsoft Cloud App Security**: <br>-Unusual addition of credentials to an OAuth app     |
|**Lateral movement**     |    **Microsoft Defender for Endpoint** <br>- Suspicious file creation initiated remotely (lateral movement) <br>- Suspicious Remote WMI Execution (lateral movement)     |
|**Exfiltration**     |  **Microsoft Defender for Endpoint** <br>- Suspicious mailbox export or access modification <br>-Suspicious archive creation       |
|     |         |

#### Alerts by threat type

We recommend searching  Microsoft Defender Security Center and the Microsoft 365 security center for any of the following alerts, which indicate a specific type of Solarigate-related threat:

|Threat |Alerts  |
|---------|---------|
|May indicate threat activity on your network    | **SolarWinds Malicious binaries associated with a supply chain attack** <br><br>**SolarWinds Compromised binaries associated with a supply chain attack** <br><br>**Network traffic to domains associated with a supply chain attack**  |
|May indicate that threat activity has occurred or may occur later.<br><br>These alerts may also be associated with other malicious threats.     |**ADFS private key extraction attempt** <br><br>**Masquerading Active Directory exploration tool**<br><br> **Suspicious mailbox export or access modification** <br><br>**Possible attempt to access ADFS key material** <br><br>**Suspicious ADFS adapter process created**         |
|    |         |

#### Microsoft Defender Antivirus detections for Solarigate

Microsoft Defender Antivirus detects the following threats and quarantines malware when found:
    
|Alert  |Threat descriptions  |
|---------|---------|
|**Detection for backdoored SolarWinds.Orion.Core.BusinessLayer.dll files**     |   [Trojan:MSIL/Solorigate.BR!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.BR!dha)      |
|**Detection for Cobalt Strike fragments in process memory and stops the process**     | [Trojan:Win32/Solorigate.A!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win32/Solorigate.A!dha&threatId=-2147196107) <br>[Behavior:Win32/Solorigate.A!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Behavior:Win32/Solorigate.A!dha&threatId=-2147196108)       |
|**Detection for the second-stage payload** <br>A cobalt strike beacon that might connect to `infinitysoftwares[.]com`|  [Trojan:Win64/Solorigate.SA!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:Win64/Solorigate.SA!dha)      |
|**Detection for the PowerShell payload** that grabs hashes and SolarWinds passwords from the database along with machine information     |     [Trojan:PowerShell/Solorigate.H!dha](https://www.microsoft.com/wdsi/threats/malware-encyclopedia-description?Name=Trojan:PowerShell/Solorigate.H!dha&threatId=-2147196089)    |
|     |         |

### Hunt for related attacker activity

Use Microsoft Defender for Endpoint, Microsoft 365 Defender, and Microsoft Defender for Identity to hunt for malicious activity on your tenant that may be related to the Solarigate attack:

- [Find and block malware and malicious behavior on endpoints](#find-and-block-malware-and-malicious-behavior-on-endpoints)
- [Find malicious activity in an on-premises environment](#find-malicious-activity-in-an-on-premises-environment)
- [Find malicious activity in the cloud environment](#find-malicious-activity-in-the-cloud-environment)

Additionally, run the following advanced queries to find tactics, threats, and procedures used in the attack:

- [Find malicious DLLs loaded into memory](#find-malicious-dlls-loaded-into-memory)
- [Find malicious DLLs created in the system or locally](#find-malicious-dlls-created-in-the-system-or-locally)
- [Find SolarWinds processes launching PowerShell with Base64](#find-solarwinds-processes-launching-powershell-with-base64)
- [Find SolarWinds processes launching CMD with echo](#find-solarwinds-processes-launching-cmd-with-echo)
- [Find C2 communications](#find-c2-communications)

For more information, see [Advanced hunting query reference](#advanced-hunting-query-reference).

#### Find and block malware and malicious behavior on endpoints

To evade security software and analysis tools, the Solorigate malware attempts to disable processes, drivers, and registry keys on the target system, including the Microsoft Defender for Endpoint sensor.

While Microsoft Defender for Endpoint has built-in protections against these attempts, a successful attempt can prevent the system from reporting observed activities. 

Use the following advanced query to locate devices that should be reporting but aren't:

```Kusto
// Times to be modified as appropriate
let timeAgo=1d;
let silenceTime=8h;
// Get all silent devices and IPs from network events
let allNetwork=materialize(DeviceNetworkEvents
| where Timestamp > ago(timeAgo)
and isnotempty(LocalIP)
and isnotempty(RemoteIP)
and ActionType in (“ConnectionSuccess”, “InboundConnectionAccepted”)
and LocalIP !in (“127.0.0.1”, “::1”)
| project DeviceId, Timestamp, LocalIP, RemoteIP, ReportId);
let nonSilentDevices=allNetwork
| where Timestamp > ago(silenceTime)
| union (DeviceProcessEvents | where Timestamp > ago(silenceTime))
| summarize by DeviceId;
let nonSilentIPs=allNetwork
| where Timestamp > ago(silenceTime)
| summarize by LocalIP;
let silentDevices=allNetwork
| where DeviceId !in (nonSilentDevices)
and LocalIP !in (nonSilentIPs)
| project DeviceId, LocalIP, Timestamp, ReportId;
// Get all remote IPs that were recently active
let addressesDuringSilence=allNetwork
| where Timestamp > ago(silenceTime)
| summarize by RemoteIP;
// Potentially disconnected devices were connected but are silent
silentDevices
| where LocalIP in (addressesDuringSilence)
| summarize ReportId=arg_max(Timestamp, ReportId), Timestamp=max(Timestamp), LocalIP=arg_max(Timestamp, LocalIP) by DeviceId
| project DeviceId, ReportId=ReportId1, Timestamp, LocalIP=LocalIP1
```

> [!NOTE]
> Microsoft is continuously developing additional measures to both block and alert on these types of tampering activities.
> 

#### Find malicious activity in an on-premises environment

Attackers can gain access to an organization's cloud services through the Activity Directory Federation Services (AD FS) server, which enables federated identity and access management and stores the Security Assertion Markup Language (SAML) token-signing certificate.

To attack the AD FS server, attackers must first obtain domain permissions through on-premises activity. Use Microsoft Defender for Endpoint queries to find evidence of masked exploration tools used by an attacker to gain access to an on-premises system. For example:

:::image type="content" source="media/solarwinds/masqueradring-exploration-tools.png" alt-text="Microsoft Defender for Endpoint using queries to find usage of masked exploration tools":::


Microsoft Defender for Identity can also detect and block lateral moves between devices and credential theft. In addition to watching for related alerts, use Microsoft 365 Defender to hunt for signs of identity compromise. For example, use the following queries:

- [Find searches for high-value DC assets followed by sign-in attempts to validate stolen credentials](#find-searches-for-high-value-dc-assets-followed-by-sign-in-attempts-to-validate-stolen-credentials)
- [Find high numbers of LDAP queries in a short time that filter for non-DC devices](#find-high-numbers-of-ldap-queries-in-a-short-time-that-filter-for-non-dc-devices)

Once attackers have access to an AD FS infrastructure, they often attempt to create valid SAML tokens to allow user impersonation in the cloud. Attackers may either steal the SAML signing certificate, or add or modify existing certificates as trusted entities. 

Both Microsoft Defender for Endpoint and Microsoft Defender for Identify detect actions used to steal encryption keys, used to decrypt the SAML signing certificate. For more information, see [Find malicious changes made in domain federation settings](#find-malicious-changes-made-in-domain-federation-settings).

> [!IMPORTANT]
> If any indications of malicious activity are found, take containment measures as needed to invalidate certificate rotation and prevent the attacker from further using and creating SAML tokens. Additionally, you may need to isolate and remediate affected AD FS servers to ensure that no attacker control or persistence remains.
>- Follow recommended actions in alerts to remove persistance and prevent an attacker's payload from loading again after rebooting. 
> - Use the Microsoft 365 security center to isolate the devices involved, and block any remote activity, as well as mark suspected users as compromised.  
> 

##### Find searches for high-value DC assets followed by sign-in attempts to validate stolen credentials

The following query finds searches for high-value DC assets, followed closely by sign-in attempts to validate stolen credentials:

```kusto
let MaxTime = 1d;
let MinNumberLogon = 5;
//devices attempting enumeration of high-value DC
IdentityQueryEvents
| where Timestamp > ago(30d)
| where Application == “Active Directory”
| where QueryTarget in (“Read-only Domain Controllers”)
//high-value RODC assets
| project Timestamp, Protocol, Query, DeviceName, AccountUpn
| join kind = innerunique (
//devices trying to logon {MaxTime} after enumeration
IdentityLogonEvents
| where Timestamp > ago(30d)
| where ActionType == “LogonSuccess”
| project LogonTime = Timestamp, DeviceName, DestinationDeviceName) on DeviceName
| where LogonTime between (Timestamp .. (Timestamp + MaxTime))
| summarize n=dcount(DestinationDeviceName), TargetedDC = makeset(DestinationDeviceName) by Timestamp, Protocol, DeviceName
| where n >= MinNumberLogon
```

##### Find high numbers of LDAP queries in a short time that filter for non-DC devices

Use the following query to find any instance of high-volume LDAP queries in a short time, that filter for non-DC devices:

```kusto
let Threshold = 12;
let BinTime = 1m;
//approximate list of DC
let listDC=IdentityDirectoryEvents
| where Application == “Active Directory”
| where ActionType == “Directory Services replication”
| summarize by DestinationDeviceName;
IdentityQueryEvents
| where Timestamp > ago(30d)
//filter out LDAP traffic across DC
| where DeviceName !in (listDC)
| where ActionType == “LDAP query”
| parse Query with * “Search Scope: ” SearchScope “, Base Object:” BaseObject “, Search Filter: ” SearchFilter
| summarize NumberOfDistinctLdapQueries = dcount(SearchFilter) by DeviceName, bin(Timestamp, BinTime)
| where NumberOfDistinctLdapQueries > Threshold
```

##### Find malicious changes made in domain federation settings

Use the following query to search Azure AD audit logs for changes in domain federation settings. 

For more information, see [ADFSDomainTrustMods](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Defense%20evasion/ADFSDomainTrustMods%5BSolarigate%5D.md) on GitHub.

```kusto
let auditLookback = 1d; CloudAppEvents
| where Timestamp > ago(auditLookback)
| where ActionType =~ “Set federation settings on domain.”
| extend targetDetails = parse_json(ActivityObjects[1])
| extend targetDisplayName = targetDetails.Name
| extend resultStatus = extractjson(“$.ResultStatus”, tostring(RawEventData), typeof(string))
| project Timestamp, ActionType, InitiatingUserOrApp=AccountDisplayName, targetDisplayName, resultStatus, InitiatingIPAddress=IPAddress, UserAgent
```

> [!IMPORTANT]
> We recommend verifying that any instances found are indeed the result of illegitimate administrative activity.
> 

#### Find malicious activity in the cloud environment

If an attacker has created illicit SAML tokens, they can access sensitive data without being limited to a compromised or on-premises device. 

For example, they can attempt to blend into normal activity patterns, including apps or service principals with existing **Mail.Read** or **Mail.ReadWrite** permissions to read email content. Applications that don't already have read-permissions for emails can be modified to grant those permissions.

Microsoft Defender Cloud App Security (MCAS) alerts have been added to automatically detect unusual credential additions to OAuth apps, in order to warn about apps that have been compromised. For example:

:::image type="content" source="media/solarwinds/MCAS-OAutho-app.png" alt-text="MCAS alert for unusual credential additions to OAuth apps":::
 
If you see these alerts and confirm malicious activity, we recommend that you take immediate action to suspend the user and mark them as compromised, reset the user's password, and remove any credentials added. You might also consider disabling the application during your investigation and remediation.

For more information, see:

- [Find newly added credentials](#find-newly-added-credentials)
- [Find malicious access to mail items](#find-malicious-access-to-mail-items)
- [Find OAuth applications reading mail with changed behavior patterns](#find-oauth-applications-reading-mail-with-changed-behavior-patterns)

##### Find newly added credentials

Additionally, use the following Microsoft 365 Defender hunting query to examine Azure AD audit logs for newly credentials added to a service principal or application. 

For more information, see [NewAppOrServicePrincipalCredential](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Persistence/NewAppOrServicePrincipalCredential%5BSolarigate%5D.md) on GitHub.

```kusto
let auditLookback = 1d; CloudAppEvents
| where Timestamp > ago(auditLookback)
| where ActionType in (“Add service principal.”, “Add service principal credentials.”, “Update application – Certificates and secrets management “)
| extend RawEventData = parse_json(RawEventData)
| where RawEventData.ResultStatus =~ “success”
| where AccountDisplayName has “@”
| extend targetDetails = parse_json(ActivityObjects[1])
| extend targetId = targetDetails.Id
| extend targetType = targetDetails.Type
| extend targetDisplayName = targetDetails.Name
| extend keyEvents = RawEventData.ModifiedProperties
| where keyEvents has “KeyIdentifier=” and keyEvents has “KeyUsage=Verify”
| mvexpand keyEvents
| where keyEvents.Name =~ “KeyDescription”
| parse keyEvents.NewValue with * “KeyIdentifier=” keyIdentifier:string “,KeyType=” keyType:string “,KeyUsage=” keyUsage:string “,DisplayName=” keyDisplayName:string “]” *
| parse keyEvents.OldValue with * “KeyIdentifier=” keyIdentifierOld:string “,KeyType” *
| where keyEvents.OldValue == “[]” or keyIdentifier != keyIdentifierOld
| where keyUsage == “Verify”
| project-away keyEvents
| project Timestamp, ActionType, InitiatingUserOrApp=AccountDisplayName, InitiatingIPAddress=IPAddress, UserAgent, targetDisplayName, targetId, targetType, keyDisplayName, keyType, keyUsage, keyIdentifier
```

> [!IMPORTANT]
> We recommend that you verify any unusual changes with respective owners to verify whether they are indeed the result of illegitimate administrative actions. 
> 

##### Find malicious access to mail items

To increase visibility on OAuth applications or service principals that can read email content from Exchange online, the **MailItemsAccessed** is now available via Microsoft Exchange mailbox advanced audit functionality. 

> [!NOTE]
> If you have customized the list of collected audit events, you may need to manually turn on this feature.
>

If more than **1,000** MailItemsAccessed audit records are generated in less than 24 hours, Exchange Online stops generating auditing records for MailItemsAccessed activity for 24 hours, and then resumes logging after this period. 

Use the following query to check for this throttling behavior and help discover potentially compromised mailboxes. 

For more information, see [MailItemsAccessedThrottling](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/MailItemsAccessed%20Throttling%20%5BSolorigate%5D.md) on GitHub.

```kusto
let starttime = 2d;
let endtime = 1d;
CloudAppEvents
| where Timestamp between (startofday(ago(starttime))..startofday(ago(endtime)))
| where ActionType == “MailItemsAccessed”
| where isnotempty(RawEventData[‘ClientAppId’]) and RawEventData[‘OperationProperties’][1] has “True”
| project Timestamp, RawEventData[‘OrganizationId’],AccountObjectId,UserAgent
```

##### Find OAuth applications reading mail, with changed behavior patterns

Use the following query to hunt for OAuth applications that can read mail, and whose behavior has recently changed when compared with a baseline period.

For more information, see [OAuthGraphAPIAnomalies](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/OAuth%20Apps%20reading%20mail%20via%20GraphAPI%20anomaly%20%5BSolorigate%5D.md) on GitHub.

```kusto
//Look for OAuth App reading mail via GraphAPI — that did not read mail via graph API in prior week
let appMailReadActivity = (timeframeStart:datetime, timeframeEnd:datetime) {
CloudAppEvents
| where Timestamp between (timeframeStart .. timeframeEnd)
| where ActionType == “MailItemsAccessed”
| where RawEventData has “00000003-0000-0000-c000-000000000000” // performance check
| extend rawData = parse_json(RawEventData)
| extend AppId = tostring(parse_json(rawData.AppId))
| extend OAuthAppId = tostring(parse_json(rawData.ClientAppId)) // extract OAuthAppId
| summarize by OAuthAppId
};
appMailReadActivity(ago(1d),now()) // detection period
| join kind = leftanti appMailReadActivity(ago(7d),ago(2d)) // baseline period
on OAuthAppId
```

#### Find malicious DLLs loaded into memory

To locate the presence or distribution of malicious DLLs loaded into memory, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAE2XzQ7sNAyFs0biHa7uCiQWadL8LZFAAokdT5A0DdwFXAkQbHh4nM_uMBp1pm0S2zk-Ps585273t_vkLvn90f3muvtF7n5yn-Vuuu9l7Ha_u7_cn-6D-9J94f6V33_cr_L2D7k-uJ_dD-5bd8jdJ5n3wX3lPrrisnxO512Sq7oh47e8LfLc5C7JWOX5EC_JRXvf5Zo8RVmzWHVLZB_dN3JNeY5ib8jdtrQ9JBkN8hvls8RmFRuXzIn422-bzFmypsvqInNvecpEqFYPViyZeVis6jcy58LmjnbbGLI-ifeL6E88L_neMXR8PbHezNz-olgJYjnLuyafJe87cev7yP1emey72Pz9W_FZzWqW1VM-Vd4NGb_Y1SXXkhU3Ngv7TzK-PW_MTuwn9r_tphfCajWw405ce1eHfKbMPNirZ6yTidPWVr53fvdok0tz4dmvWh3idWDzBLFBdF7ug_x2spJZvSOrhuNiN0PWDL5vcrvRfrKV8aORDVkd5NqIePi6x_f9AusIFgEfJ9Yned3IbozLi1mV2VXmbbQnVvauh0SgbNiYLJiQ5HnAt0Lu9sxGvgdxNbOq3JsyuvNwwrELT09MaqGCeYSbHdZOq5SBtb3TJnPU6gUnCnhV8PasU4buCE84kfE42fEie4NZlSwoE3bNPRx4omi2021ryQrNqY5FYps8L7BqoF3gVoTNmew-VjfuWWztGCtVcpOHm5Wbq5HsX3Kv-ZuwalEpHS5eeNw5f6xuTHVvg0g91g6qp1OJB_hsmxrjoLZ2rCf6k8hFgZX_V-zBngocGWhRA7ELD1rfjfg8czSXO-oA7nt-t4yo1cVoQks8fFpYUyVRP5VVk5wltHLBlQWyASVTBu5YvxaN_Sza-yhvQAnf1Tfy7oA_FYZ6ailg68TLZuSNJm2NO8nB3s9tvJz8emo1oCrT6uE0nG5wbNSrZzyDaHnxVBV_ksMMkwoYdfjbiaeT6_nS0cN8FKI4iPAmwkAlTusQuidPTJWIDlhVqaf5UvfHWzJlb4w2U0fldyKaTPyTPVciiLwf9JWG5YKtiO5War4aRoU4VZEXmK03hd21p95UETcnM4qU4G2BxQGGdbwm0GrYG3x7Lk_-TubvHqe1l0BLu4VnteJ7wcRpUXTT1mCcu19KoLM92b9h4IVuV1C-rP5VZya6n9HlgWZm8A62n0k2NIeP-h7caxTaMTx4dupi8HuA4-ITqMJCbRWsTdYcxBLY7WUafbH7br0rMl7I1wkfGpo4WB3fVNRj8cRHpCKi-Uvo3039LdOMhV19Hqigcvokf5oFz24atXTDMe3-nbXap1XhywuLhbdCLqZpWiZzlfyqtmU7vzQwT6hopCdoBx6vU08Gha26jT1pP0_UUcd2gh0JZB52aie9qZYIut7i1S6vyHX8NOvZt0UdiSoYDyaR3RbXQgW00gYVtq0qnzI-jxc7lX_RunuioiMRqcKcMGuASICFjy4-3WmBi0eXOoqR7fmmdhRfVZlJZJkaXm89O5DdEwxvbEyr1GrnNtWmQe-57MSZQLBbpzis4w5yFfHeYMhBfaseelipfT4Rc3yr1Aj_Bva0V2vffphwma3CvADWJ-jrqe0gxhPGLTsTVfI0resNY2_ihKh9W09hTxQNNKZV3UStD8vqwwbtlsn6xYntaZqovPOmbZ4a0j7wKGUwfydRLJis_WbX5oOFKrpHYTJYBXDQk0hnX82y6MnaoFsW6x16hjzYQTVF1ZP3MCs3kTbQ015esLY9PafZar3iYvfKm8KuFkhqB59wJ7OPBmqqTXpeV96drAh0Fu2xep9NfwYM0v8di7zkl2pd5DG8VLahcTu7l3WZC72YpuKnxR1hWqc7-df5--RzmTqexkhP1Rx2IlGVrFTLc6ZZ2J_sVpkc0Kli1RTAJ8PPZXOUsXrCjm-9JZteTztBXPZPrdjZVnei_7cqu91noP8A9D6a0LYOAAA&runQuery=true&timeRangeId=week):

```Kusto
DeviceImageLoadEvents | where SHA1 in (“d130bd75645c2433f88ac03e73395fba172ef676″,”1acf3108bf1e376c8848fbb25dc87424f2c2a39c”,”e257236206e99f5a5c62035c9c59c57206728b28″,”6fdd82b7ca1c1f0ec67c05b36d14c9517065353b”,”2f1a5a7411d015d01aaee4535835400191645023″,”bcb5a4dcbc60d26a5f619518f2cfc1b4bb4e4387″,”16505d0b929d80ad1680f993c02954cfd3772207″,”d8938528d68aabe1e31df485eb3f75c8a925b5d9″,”395da6d4f3c890295f7584132ea73d759bd9d094″,”c8b7f28230ea8fbf441c64fdd3feeba88607069e”,”2841391dfbffa02341333dd34f5298071730366a”,”2546b0e82aecfe987c318c7ad1d00f9fa11cd305″,”e2152737bed988c0939c900037890d1244d9a30e”) or SHA256 in (“ce77d116a074dab7a22a0fd4f2c1ab475f16eec42e1ded3c0b0aa8211fe858d6″,”dab758bf98d9b36fa057a66cd0284737abf89857b73ca89280267ee7caf62f3b”,”eb6fab5a2964c5817fb239a7a5079cabca0a00464fb3e07155f28b0a57a2c0ed”,”ac1b2b89e60707a20e9eb1ca480bc3410ead40643b386d624c5d21b47c02917c”,”019085a76ba7126fff22770d71bd901c325fc68ac55aa743327984e89f4b0134″,”c09040d35630d75dfef0f804f320f8b3d16a481071076918e9b236a321c1ea77″,”0f5d7e6dfdd62c83eb096ba193b5ae394001bac036745495674156ead6557589″,”e0b9eda35f01c1540134aba9195e7e6393286dde3e001fce36fb661cc346b91d”,”20e35055113dac104d2bb02d4e7e33413fae0e5a426e0eea0dfd2c1dce692fd9″,”2b3445e42d64c85a5475bdbc88a50ba8c013febb53ea97119a11604b7595e53d”,”a3efbc07068606ba1c19a7ef21f4de15d15b41ef680832d7bcba485143668f2d”,”92bd1c3d2a11fc4aba2735d9547bd0261560fb20f36a0e7ca2f2d451f1b62690″,”a58d02465e26bdd3a839fd90e4b317eece431d28cab203bbdde569e11247d9e2″,”cc082d21b9e880ceb6c96db1c48a0375aaf06a5f444cb0144b70e01dc69048e6″)
```

#### Find malicious DLLs created in the system or locally

To locate the presence or distribution of malicious DLLs created locally or elsewhere in the system, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAE2Xy87tNAyFO0biHX6dEUgM0twzRALEnCdImkYc6QgkQDDh4XE-u5utqru3xHaWl5ezfzju4-_j83HJ9Se5fpHrj_LmPn47_jr-PD6Or4-vjn_l-s_xq7z9Q86P45fj5-P745S7zzLu4_jm-HSUI8sRD3ckOesx5Pstb4s8N7lL8q3yfB5dnoK973JOnoLMWcy6JZ5Px3dyTnkOYm_I3ba0PST56uUa5Fhis4qNS8YE_O23TcYsmdNldpGxtzxlIlSrJzOWjDwtVvUbGHNhc0e7bQyZn8T7RfQRz0t-dwwdX0-sNyO3vyBWvFjO8q7JseR9J259H7jfM5P9Fhu_rxWf1axmmT3lqPJuyPeLVV1yLplxY7Ow_iTft-eNWcR-Yv3bbnohrFY9K-7EtVd1yjFl5MlaHd86mYg2t_K787u_Njk1F471qtUhXgc2I4gNonNy7-XayUpm9o6sGo6L1QyZM_i9ye1G-8lWxo9GNmS2l3Mj4sTm5Pu-X2AdwMLjI2J9kteN7Ma4vJhVGV1l3EZ7YmWvekgEyoaNyYIJSZ4HfCvkbo9s5HsQVzOryr0pX3ceIhy78PTEpBYqmAe42WHttEoZWNsrbTJGrV5wooBXBW_HPGXojjDCiYzHyYoX2RuMqmRBmbBr7uHAE0WzlW5bS2ZoTvVbILbJ8wKrBtoFbgXYnMnuY3XjnsXWjrFSJTd5uJm5uRrI_iX3mr8JqxaV0uHihced88fqxlTXNojUYe2kejqVeILPtqkxDmprxxrRn0QuCqz8v2JP1lTgyECLGohdeND6bsTnGKO53FF7cN_ju2VErS6-JrTEwaeFNVUS9VOZNclZQisXXFkg61EyZeCO9VvR2N9Fex_l9Sjhu_oG3p3wp8JQRy15bEW8bEbeaNLWuEgO9npu4-Xk6qhVj6pMq4doON3g2KhXx_cMouXFU1X8SQ4zTCpg1OFvJ55OrudLR0_zUYjiJMKbCD2VOK1D6JocMVUiOmFVpZ7mS90fb8mUvfG1mToqvxPRZOKfrLkSQeD9oK80LBdsBXS3UvPVMCrEqYq8wGy9KeyuPfWmirg5mVGkBG8LLPYwrOM1gVbD3uDXcTryFxm_e5zWXgIt7RaO2YrvBROnRdFNW71x7n4pgY52ZP-GgRe6XUH5svpXnZnofkaXB5qZwdvbeibZ0Bw-6ntyr1Fox3Dg2amLwfUEx8XhqcJCbRWsTeacxOJZ7WUafbH6br0r8L2QrwgfGpo4mB3eVNRhMeIjUBHB_CX076b-lmnGwq4-D1RQOR3Jn2bBsZpGLd1wTLt_Z672aVX48sJi4a2Qi2malslcJb-qbdn2Lw3MEyoa6Anagcdr15NBYatuY03azxN11LGdYEcCmYed2klvqiWArrN4tcsrch0_zXr2bVEHovLGg0lkt8W1UAGttEGFbavKp4zP88VO5V-w7p6o6EBEqjARZg0Q8bDw0cWnOy1wcehSRzGyPd_UjuKrKjOJLFPD661ne7IbwfDGxrRKrbZvU20a9J7LdpwJBLt1itM67iBXAe8NhpzUt-qhg5Xa5xMxh7dKDfBvYE97tfbthwmX2SqM82AdQV93bScxRhi3bE9UydO0rjeMvYkdovZt3YU9UTTQmFZ1E7U-LasPG7RbJusXEdvTNFF550zbHDWkfeBRSm_-IlEsmKz9Ztfmg4UqukNhMlh5cNCdSGddzbLoyNqgWxbrHbqHPFlBNUXVnfcwKzeRNtDTXl6wtj09u9lqveJi9cqbwqoWSGoHn3Ans44GaqpNul9X3kVmeDqL9li9z6Y_Awbp_45FXvJLtS7y6F8q29C4nd3LusyFXkxT8WhxB5jW6U7utf-OHJepYzRGOqrmtB2JqmSlWp49zcL-ZLXKZI9OFasmDz4Zfi4bo4zVHXZ46y3Z9HraDuKyf2rF9ra6Ev2_VVnt3gP9B3GMOb2sDgAA&runQuery=true&timeRangeId=week):

```Kusto
DeviceFileEvents | where SHA1 in (“d130bd75645c2433f88ac03e73395fba172ef676″,”1acf3108bf1e376c8848fbb25dc87424f2c2a39c”,”e257236206e99f5a5c62035c9c59c57206728b28″,”6fdd82b7ca1c1f0ec67c05b36d14c9517065353b”,”2f1a5a7411d015d01aaee4535835400191645023″,”bcb5a4dcbc60d26a5f619518f2cfc1b4bb4e4387″,”16505d0b929d80ad1680f993c02954cfd3772207″,”d8938528d68aabe1e31df485eb3f75c8a925b5d9″,”395da6d4f3c890295f7584132ea73d759bd9d094″,”c8b7f28230ea8fbf441c64fdd3feeba88607069e”,”2841391dfbffa02341333dd34f5298071730366a”,”2546b0e82aecfe987c318c7ad1d00f9fa11cd305″,”e2152737bed988c0939c900037890d1244d9a30e”) or SHA256 in (“ce77d116a074dab7a22a0fd4f2c1ab475f16eec42e1ded3c0b0aa8211fe858d6″,”dab758bf98d9b36fa057a66cd0284737abf89857b73ca89280267ee7caf62f3b”,”eb6fab5a2964c5817fb239a7a5079cabca0a00464fb3e07155f28b0a57a2c0ed”,”ac1b2b89e60707a20e9eb1ca480bc3410ead40643b386d624c5d21b47c02917c”,”019085a76ba7126fff22770d71bd901c325fc68ac55aa743327984e89f4b0134″,”c09040d35630d75dfef0f804f320f8b3d16a481071076918e9b236a321c1ea77″,”0f5d7e6dfdd62c83eb096ba193b5ae394001bac036745495674156ead6557589″,”e0b9eda35f01c1540134aba9195e7e6393286dde3e001fce36fb661cc346b91d”,”20e35055113dac104d2bb02d4e7e33413fae0e5a426e0eea0dfd2c1dce692fd9″,”2b3445e42d64c85a5475bdbc88a50ba8c013febb53ea97119a11604b7595e53d”,”a3efbc07068606ba1c19a7ef21f4de15d15b41ef680832d7bcba485143668f2d”,”92bd1c3d2a11fc4aba2735d9547bd0261560fb20f36a0e7ca2f2d451f1b62690″,”a58d02465e26bdd3a839fd90e4b317eece431d28cab203bbdde569e11247d9e2″,”cc082d21b9e880ceb6c96db1c48a0375aaf06a5f444cb0144b70e01dc69048e6″)
```

#### Find SolarWinds processes launching PowerShell with Base64

To locate SolarWinds processes that are spawning suspected Base64-encoded PowerShell commands, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAK1TXUsCQRQ9z0H_YfHF3VKzkqAHoW8KJIIegkpEdxeVdlV2TO3zt3fu3VHcsloohpm5d-ac-zlzghAT9OFzv0KCoUqG45TnIQYYU17HGl7hYIoezxJOBxe86_O2j7auA3Q_WTjjaUT5kohYOXW8cy3gmqiIpwlulBkQXcERHrmLnvIbRDypv3PiDb1UqM04Cysj-t7fiPyp4oziI46srS0OhznP6CUh3-fuoEPJELOHGjWphk9LAaWAulFsmnnJ3hvmkEYzITfibfDFTqTILtm9RR6heg61Fll8y97No0p91xec-bmLIucdDlHGLc_KeEaV6z42mVsTL9ihXsIbMXXVRdul7pEp8W_rmu3hMeWYo62RNWx3vD_FLTXqZKrn_sqUyKq6upaZVvF3pkeO9Lam0oaV8sQvfV7ut8QuvR3p25UKuThg7e4ZWVrBot2lXg-8b_2Y5bL9FnFD_RGJvvo8eXk2D3m7q_7DgBYFGzPicU6bju10nl7G-vN99WhsbbqKlErMX2KT8n9aTd-0WP0AdbkD_LwEAAA&runQuery=true&timeRangeId=month): 

```Kusto
DeviceProcessEvents| where InitiatingProcessFileName =~ “SolarWinds.BusinessLayerHost.exe”| where FileName =~ “powershell.exe”// Extract base64 encoded string, ensure valid base64 length| extend base64_extracted = extract(‘([A-Za-z0-9+/]{20,}[=]{0,3})’, 1, ProcessCommandLine)| extend base64_extracted = substring(base64_extracted, 0, (strlen(base64_extracted) / 4) * 4)| extend base64_decoded = replace(@’\0′, ”, make_string(base64_decode_toarray(base64_extracted)))//| where notempty(base64_extracted) and base64_extracted matches regex ‘[A-Z]’ and base64_extracted matches regex ‘[0-9]’
```

#### Find SolarWinds processes launching CMD with echo

To locate SolarWinds processes launching CMD with echo, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAG2OSwrCQBBEay14h2EOkBtk4w-FIIIL1yEZzEASIfEL4tl9M3EhITT9requXsnpLq-CfFCnS6x6bM3cqdWVeq6Z3jJ6qGLW4UY7MA_qlcfY6jy6sGFaU-9hNHEn1YdodYRVM-10ipsl7EQL3cihH_YzGK-ot4Xfo5LQPXE7-dGUXhr1Cvryb9vACKpm9PGSusEGNPv9YtDIQcMlB7eCZfUF5AwwqToBAAA&runQuery=true&timeRangeId=month):

```Kusto
DeviceProcessEvents| where InitiatingProcessFileName =~ “SolarWinds.BusinessLayerHost.exe”| where FileName == “cmd.exe” and ProcessCommandLine has “echo”
```

#### Find C2 communications

The compromised SolarWinds files create a backdoor that allows attackers to remotely control and operate an affected device. 

When the compromised SolarWinds binary files are loaded on a device, such as through regular updates, the backdoor verifies that it's running on an enterprise network, and then contacts a command and control (C2) server, allowing the attacker to remotely run commands on the device, and move to the next stage of the attack.

To locate DNS lookups to an attacker's domain, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEAGWOSwrCQBQEay14hyEH0BO4EKJLwc8FghkwEI2YZCTg4S1noQtpHt00Bf1KIomGs74xRW4M9MyZ8SLw5GL38AJrqUG2kzkxcc_tSgUKStuePWPmJw56L9PlPkoElqpkx9H8I8Mf-1mvzHVerVXzXa5o2ZqjXksHP6yyFyxMyZy4-msrP8oUvAEb21tt5gAAAA&runQuery=true&timeRangeId=month):

```kusto
DeviceEvents| where ActionType == “DnsQueryResponse” //DNS Query Responseand AdditionalFields has “.avsvmcloud”
```

To find C2 communications that may indicate malicious behavior, [run the following query](https://securitycenter.windows.com/hunting?query=H4sIAAAAAAAEALWQPQ6CQBCFX23iHZDGjhvYqYmNMSYegCA_G4E1gEDh4f12KgtLCZmd3TfvZ5e9co1yyuhnatAkr04PHcBztSC9Iq210ps-qQLtqEhX1gb2QL-B1WAZ56BJ8WxNuWU_shvhZnC8XrorMWbD9JfzCa3DxaEdzKnUhZm3e_Z8R9Da7pziEjQb7VhjGJUxA5pQMxX_PaVhmvOOctEUZ85P-2vdokkFk-BSwJ4XzPG8JvikXxkfdzmn1oQCAAA&runQuery=true&timeRangeId=month):

```kusto
DeviceNetworkEvents| where RemoteUrl contains ‘avsvmcloud.com’| where InitiatingProcessFileName != “chrome.exe”| where InitiatingProcessFileName != “msedge.exe”| where InitiatingProcessFileName != “iexplore.exe”| where InitiatingProcessFileName != “firefox.exe”| where InitiatingProcessFileName != “opera.exe”
```

##### ADFS adapter process spawning

<!--why no description in source?-->
Use the following process to track ADFS adapter process spawning:

```kusto
DeviceProcessEvents| where InitiatingProcessFileName =~”Microsoft.IdentityServer.ServiceHost.exe”| where FileName in~(“werfault.exe”, “csc.exe”)| where ProcessCommandLine !contains (“nameId”)
```
 







### Advanced query reference

Run the following advanced queries, referenced from GitHub, to find tactics, threats, and procedures used in the Solarigate attack:

|Attack stage  |Query link  |
|---------|---------|
|**General**     |    **Microsoft Defender for Endpoint Threat and Vulnerability Management**: <br>- [SolarWinds Orion software in your org](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/possible-affected-software-orion%5BSolorigate%5D.md)     |
|**Initial access**     | **Microsoft Defender for Endpoint**: <br>- [Malicious DLLs loaded in memory](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/e4ff45064d58ebd352cff0bb6765ad87d54ab9a9/Campaigns/locate-dll-loaded-in-memory%5BSolorigate%5D.md) <br>- [Malicious DLLs created in the system or locally](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/locate-dll-created-locally%5BSolorigate%5D.md) <br>- [Compromised SolarWinds certificate](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/616f86b2767318577a0d9bccb379177d0dccdf2d/Campaigns/compromised-certificate%5BSolorigate%5D.md)        |
|**Execution**     | **Microsoft Defender for Endpoint**: <br>- [SolarWinds processes launching PowerShell with Base64](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/launching-base64-powershell%5BSolorigate%5D.md) <br>- [SolarWinds processes launching CMD with echo](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/launching-cmd-echo%5BSolorigate%5D.md)       |
|**Command and control**     |  **Microsoft Defender for Endpoint**: <br>- [C2 communications](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/c2-lookup-response%5BSolorigate%5D.md) <br>- [C2 lookup](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/3cb633cee8332b5eb968b4ae1947b9ddb7a5958f/Campaigns/c2-lookup-from-nonbrowser%5BSolorigate%5D..md)       |
|**Credential access**     |  **Azure Active Directory (Microsoft Cloud App Security)**: <br>- [Credentials added to AAD app after admin consent](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Persistence/CredentialsAddAfterAdminConsentedToApp%5BSolorigate%5D.md) <br>- [New access credential added to application or service principal](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Persistence/NewAppOrServicePrincipalCredential%5BSolarigate%5D.md) <br>- [Domain federation trust settings modified](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Defense%20evasion/ADFSDomainTrustMods%5BSolarigate%5D.md) <br>- [Add uncommon credential type to application](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Privilege%20escalation/Add%20uncommon%20credential%20type%20to%20application%20%5BSolorigate%5D.md) <br>- [Service Principal Added To Role](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Privilege%20escalation/ServicePrincipalAddedToRole%20%5BSolorigate%5D.md)       |
|**Exfiltration**     |    **Exchange Online (Microsoft Cloud App Security)**: <br>- [Mail Items Accessed Throttling Analytic](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/MailItemsAccessed%20Throttling%20%5BSolorigate%5D.md)<br>- [Mail Items Accessed Anomaly Analytic](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/Anomaly%20of%20MailItemAccess%20by%20GraphAPI%20%5BSolorigate%5D.md) <br>- [OAuth Apps reading mail via GraphAPI anomaly](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/OAuth%20Apps%20reading%20mail%20via%20GraphAPI%20anomaly%20%5BSolorigate%5D.md) <br>- [OAuth Apps reading mail both via GraphAPI and directly](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/blob/master/Exfiltration/OAuth%20Apps%20reading%20mail%20both%20via%20GraphAPI%20and%20directly%20%5BSolorigate%5D.md)     |
|     |         |

### MITRE ATT&CK techniques observed

This threat makes use of the following attacker techniques documented in the [MITRE ATT&CK framework](https://attack.mitre.org/).

|Technique  |Reference  |
|---------|---------|
|**Initial Access**     |  [T1195.001 Supply Chain Compromise](https://attack.mitre.org/techniques/T1195/001/)      |
|**Execution**     |  [T1072 Software Deployment Tools](https://attack.mitre.org/techniques/T1072/)       |
|**Command and Control**     |  [T1071.004 Application Layer Protocol: DNS](https://attack.mitre.org/techniques/T1071/004/) <br><br>[T1017.001 Application Layer Protocol: Web Protocols](https://attack.mitre.org/techniques/T1071/001/) <br><br>[T1568.002 Dynamic Resolution: Domain Generation Algorithms](https://attack.mitre.org/techniques/T1568/002/) <br><br>[T1132 Data Encoding](https://attack.mitre.org/techniques/T1132/)       |
|**Persistence**     |    [T1078 Valid Accounts](https://attack.mitre.org/techniques/T1071/001/)     |
|**Defense Evasion**     |   [T1480.001 Execution Guardrails: Environmental Keying](https://attack.mitre.org/techniques/T1480/001/) <br><br>[T1562.001 Impair Defenses: Disable or Modify Tools](https://attack.mitre.org/techniques/T1562/001/)      |
|**Collection**     |  [T1005 Data From Local System](https://attack.mitre.org/techniques/T1005/)        |
|     |         |




## Solarigate indicators of compromise (IOCs)

This section provides details about anomalies found by Microsoft in affected tenants that may indicate attacker activity, what to look for in your tenants, and how to mitigate the risks exposed by these anomalies.

> [!IMPORTANT]
> Although the steps taken by Microsoft detailed above have neutralized and killed the malware wherever found, we recommend that you perform your own checks for added security.
>
> We also recommend also reviewing the relevant IOCs listed by FireEye on the [FireEye Threat Research blog](https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html).
> 

Anomalies found included the following types:

- [Anomalies in Microsoft 365 API access patterns](#anomalies-in-microsoft-365-api-access-patterns)
- [Anomalies in SAML tokens being presented for access](#anomalies-in-saml-tokens-being-presented-for-access)

The following sections detail how specific attack patterns that might use these anomalies, and what to verify in your tenants to ensure your organization's security. 

- [Forged SAML tokens](#forged-saml-tokens)
- [Illegitimate SAML trust relationship registrations](#illegitimate-saml-trust-relationship-registrations)
- [Added credentials to existing applications](#added-credentials-to-existing-applications)

### Anomalies in SAML tokens being presented for access

In some impacted tenants, Microsoft detected anomalous SAML tokens presented for access to the Microsoft Cloud, which were signed by customer certificates. 

The anomalies indicate tha the customer SAML token-signing certificates may have been compromised, and that an attacker could be forging SAML tokens to access any resources that trust those certificates.

Compromising a SAML token-signing certificate usually requires admin access, and the presence of a forged SAML token usually indicates that the customer's on-premises infrastructure may be compromised. 

> [!NOTE]
> Since the signing certificate is the *root* of trust for the federated trust relationship, service principals would not easily detect these forgeries.         
> 

### Anomalies in Microsoft 365 API access patterns

In some impacted tenants, Microsoft detected anomalous API access patters, originating from existing applications and service principals. 

Anomalous API access patterns indicate that attackers with administrative credentials have added their own credentials to existing applications and service principals. 

Microsoft 365 APIs can be used to access email, documents, chats, configuration settings (such as email forwarding), and more.  

Since you must have a highly privileged Azure Active Directory (AAD) administrative account to add credentials to service principals, changes at this level can imply that one or more such privileged accounts have been compromised. There may be other significant changes made in any impacted tenant.       


### Forged SAML tokens

- [Anomalies found that indicate forged SAML tokens](#anomalies-found-that-indicate-forged-saml-tokens)
- [How these anomalies indicate forged SAML tokens](#how-these-anomalies-indicate-forged-saml-tokens)
- [How to look for forged SAML tokens in your system](#how-to-look-for-forged-saml-tokens-in-your-system)
- [What to do if you've found forged SAML tokens](#what-to-do-if-youve-found-forged-saml-tokens)

#### Anomalies found that indicate forged SAML tokens

Anomalous tokens found included the following types:

- Tokens with an expiration of *exactly* **3600 seconds** or **144000 seconds**, with no millisecond values. 

    **144000** = **40 hours,** and is considered to be exceptionally long for a token expiration.
- Tokens that were received at the same time as the issuance time, without any delay between creation and usage
- Tokens that were received *before* the time they were issued. These tokens indicate a falsified issuance time after the token was received.
- Tokens that were used from outside typical user locations.
- Tokens that contained claims not previously seen by the tenant’s federation server.
- Tokens that indicated that MFA was used when the token claimed to authenticate from within the corporate estate, where MFA is not required.

> [!NOTE]
> Microsoft generally retains token logs only for 30 days, and never logs complete token. For this reason, Microsoft cannot see every aspect of an SAML  token. Customers who want longer retention can configure additional storage in Azure monitor or other systems. 
>
> The token anomalies detected were anomalous in lifetime, usage location, or claims (particularly MFA claims). The anomalies were sufficiently convincing as forgeries. These patterns were not found in all cases.

#### How these anomalies indicate forged SAML tokens

The token anomalies found in these cases may indicate any of the following scenarios:

- **The SAML token-signing certificate was exfiltrated** from the customer environment, and used to forge tokens by the actor.

- **Administrative access to the SAML Token Signing Certificate storage had been compromised**, either via a service administrative access, or by direct device storage / memory inspection.

- **The customer environment was deeply penetrated**, with administrative access to identity infrastructure, or the hardware environment running the identity infrastructure.

####  How to look for forged SAML tokens in your system

To search for forged SAML tokens in your system, look for the following indications:

- SAML tokens received by the service principal with configurations that deviate from the IDP’s configured behavior.

- SAML tokens received by the service principal without corresponding issuing logs at the IDP.

- SAML tokens received by the service principal with MFA claims,  but without corresponding MFA activity logs at the IDP.

- SAML tokens that are received from IP addresses, agents, times, or for services that are anomalous for the requesting identity represented in the token.

- Other evidence of unauthorized administrative activity.

#### What to do if you've found forged SAML tokens

If you think that you've found forged SAML tokens, perform the following steps:

- Determine how the certificates were exfiltrated, and remediate as needed.

- Roll all SAML token signing certificates.

- Where possible, consider reducing your reliance on on-premises SAML trust relationships.

- Consider using a Hardware Security Model (HSM) to manage your SAML Token Signing Certificates.

### Illegitimate SAML trust relationship registrations

In some cases, the SAML token forgeries correspond to service principal configuration changes. 

Actors can change SAML service principal configurations, such as Azure AD, telling the service principal to trust their certificate. In effect, in our case, the actor has told Azure AD, "Here is another SAML IDP that you should trust. Validate it with this public key." This extra trust is illegitimate.

For more information, see:

- [Types of illegitimate SAML trust relationship registrations found](#types-of-illegitimate-saml-trust-relationship-registrations-found)
- [Implications of illegitimate SAML trust relationship registrations](#implications-of-illegitimate-saml-trust-relationship-registrations)
- [How to look for illegitimate SAML trust relationship registrations in your system](#how-to-look-for-illegitimate-saml-trust-relationship-registrations-in-your-system)
- [What to do if you've found illegitimate SAML trust relationship registrations](#what-to-do-if-youve-found-illegitimate-saml-trust-relationship-registrations)

#### Types of illegitimate SAML trust relationship registrations found

Microsoft found the following types of illegitimate SAML trust relationship registrations on affected tenants:

- **The addition of federation trust relationships at the service principal**, which later resulted in SAML authentications of users with administrative privileges. 

    The actor took care to follow existing naming conventions for server names, or copy existing server names. For example, if a server named **GOV_SERVER01** already existed, they created a new one named **GOV_SERVERO1**.

    The impersonated users later took actions consistent with detected attacker patterns.

- **Token forgeries** consistent with the [patterns described above](#forged-saml-tokens). 

Calls generally came from different IP addresses for each call and impersonated user, but generally tracked back to anonymous VPN servers.

#### Implications of illegitimate SAML trust relationship registrations 

Registering illegitimate SAML trust relationships provided administrative access to Azure AD. 

Evidence illegitimate SAML trust relationships registered may mean that the actors had been unable to gain access to on-premises resources, or was experimenting with other persistence mechanisms.

Additionally, illegitimately registered relationships may mean that the actor may have been unable to exfiltrate tokens, possibly due to use of HSM.

#### How to look for illegitimate SAML trust relationship registrations in your system

Look for any anomalous administrative sessions that are associated with modifications to federation trust relationships.

#### What to do if you've found illegitimate SAML trust relationship registrations

If you think you've found an illegitimate SAML trust relationship registration, we recommend that you perform the following steps to secure your environment:

- Review all federation trust relationships to ensure that they are all valid.
- Determine how the administrative account was impersonated. For more information, see [below](#queries-that-impersonate-existing-applications).
- Roll back any illegitimate administrative account credentials.

### Added credentials to existing applications

Once an actor has been able to impersonate a privileged Azure AD administrator, they added credentials to existing applications or service principals, usually with the permissions that they wanted already associated and high traffic patterns, such as for mail archive applications.

In some cases, Microsoft found that the actor had added permissions for a new application or service principal for a short while, and used those permissions as another layer of indirection.

For more information, see:

- [Types of added credentials found](#types-of-added-credentials-found)
- [Implications of added credentials to existing applications](#implications-of-added-credentials-to-existing-applications)
- [How to find added credentials in your system](#how-to-find-added-credentials-in-your-system)
- [What to do if you've found added credentials in your system](#what-to-do-if-youve-found-added-credentials-in-your-system)

#### Types of added credentials found

Microsoft found the following types of added credentials in affected tenants:

- The addition of federation trust relationships at the service principal, resulting in SAML user authentications with administrative privileges. 

    The impersonated users later took actions consistent with attacker patterns described below.

- Service principals added into well-known administrative roles, such as **Tenant Admin** or **Cloud Application Admin**.

- Reconnaissance to identify existing applications that have application roles with permissions to call Microsoft Graph.

- Token forgeries consistent with the patterns described [above](#forged-saml-tokens)

The impersonated applications or service principals were different across different customers, and the actor did not have a default type of target. Impersonated applications and service principals included both customer-developed and vendor-developed software. 

Additionally, no Microsoft 365 applications or service principals were used when impersonated. Customer credentials cannot be added to these applications and service principals.

#### Implications of added credentials to existing applications

The addition of credentials to existing applications enabled the actor gain access to Azure AD. 

The actor performed extensive reconnaissance to find unique applications that could be used to obfuscate their activity.

#### How to find added credentials in your system

Search for the following indications:

- Anomalous administrative sessions associated with modified  federation trust relationships.

- Unexpected service principals added to privileged roles in cloud environments.

#### What to do if you've found added credentials in your system

If you think you've found added credentials the applications in your system, we recommend that you perform the following steps:

- Review all applications and service principals for credential modification activity.

- Review all applications and service principals for excess permissions.

- Remove all inactive service principals from your environment.

- Regularly roll credentials for all applications and service principals.

### Queries that impersonate existing applications

Once credentials were added to existing applications or service principals, the actor proceeded to acquire an OAUTH access token for the application using the forged credentials, and call APIs with the assigned permissions.

Most of the relevant API calls found on affected tenants were focused on email and document extraction, although some API calls also added users, or added permissions for other applications or service principals. 

Calls were generally very targeted, synchronizing, and then monitoring emails for specific users.

For more information, see:

- [Types of impersonating queries found](#types-of-impersonating-queries-found)
- [Implications of impersonating queries](#implications-of-impersonating-queries)
- [How to look for impersonating queries in your system](#how-to-look-for-impersonating-queries-in-your-system)
- [What to do if you find impersonating queries in your system](#what-to-do-if-you-find-impersonating-queries-in-your-system)

#### Types of impersonating queries found

The following types of impersonating queries were found on affected tenants:

- Application calls attempting to authenticate to Microsoft Graph resources with the following **applicationID**: `00000003-0000-0000-c000-000000000000`

- Impersonated calls to the Microsoft Graph **Mail.Read** and **Mail.ReadWrite** endpoints.

- Impersonating calls from anomalous endpoints. These endpoints were not repeated from customer to customer, and were usually Virtual Private Server (VPS) vendors.

#### Implications of impersonating queries

The actor used impersonating queries primarily to obfuscate their persistence and reconnaissance activities.

#### How to look for impersonating queries in your system

Search for the following in your systems:

- Anomalous requests to your resources from trusted applications or service principals.

- Requests from service principals that added or modified groups, users, applications, service principals, or trust relationships.

#### What to do if you find impersonating queries in your system

If you think you've found impersonating queries in your environment, we recommend taking the following steps:

- Review all federation trust relationships, ensure all are valid.

- Determine how the administrative account was impersonated. For more information, see [below](#queries-that-impersonate-existing-applications).

- Roll administrative account credentials.

### Other attacker behaviors

Microsoft also found the following types of attacker behaviors in affected tenants:

|Behavior  |Details  |
|---------|---------|
|**Attacker access to on premises resources**     | While Microsoft has a limited ability to view on-premises behavior, we have the following indications as to how on-premises access was gained. <br><br> - **Compromised network management software** was used as command and control software, and placed malicious binaries that exfiltrated SAML token-signing certificates.<br><br>- **Vendor networks were compromised**, including vendor credentials with existing administrative access.<br><br>- **Service account credentials, associated with compromised vendor software**, were also compromised.<br><br>- **Non-MFA service accounts** were used.  <br><br>**Important**: We recommend using on-premises tools, such as [Microsoft Defender for Identity](#microsoft-365-defender), to detect other anomalies.     |
|**Attacker access to cloud resources**     |   For administrative access to the Microsoft 365 cloud, Microsoft found evidence of the following indicators: <br><br>    - **Forged SAML tokens**, which impersonated accounts with cloud administrative privileges. <br><br>- **Accounts with no MFA required**. Such accounts [easily compromised](https://aka.ms/yourpassworddoesntmatter).     <br><br>- Access allowed from **trusted, but compromised vendor accounts**.      |
|   |         |


## References

|Source  |Links  |
|---------|---------|
|**Microsoft On The Issues**     |[Important steps for customers to protect themselves from recent nation-state cyberattacks](https://blogs.microsoft.com/on-the-issues/2020/12/13/customers-protect-nation-state-cyberattacks/)         |
|**Microsoft Security Response Center**     |  [Solorigate Resource Center: https://aka.ms/solorigate](https://aka.ms/solorigate) <br><br>[Customer guidance on recent nation-state cyber attack](https://msrc-blog.microsoft.com/2020/12/13/customer-guidance-on-recent-nation-state-cyber-attacks/)       |
|**Azure Active Directory Identity blog**     |  [Understanding "Solorigate"'s Identity IOCs - for Identity Vendors and their customers](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/understanding-quot-solorigate-quot-s-identity-iocs-for-identity/ba-p/2007610)       |
|**TechCommunity**     |    [Azure AD workbook to help you assess Solarigate risk](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/azure-ad-workbook-to-help-you-assess-solorigate-risk/ba-p/2010718) <br><br> [Solarwinds: Post compromise hunting with Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/solarwinds-post-compromise-hunting-with-azure-sentinel/ba-p/1995095)      |
|**Microsoft Security Intelligence**     |  [Malware encyclopedia definition: Solarigate](https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=Trojan:MSIL/Solorigate.B!dha)       |
|**Microsoft Security blog**     |   [Analyzing Solarigate: The compromised DLL file that started a sophisticated cyberattack and how Microsoft Defender helps protect](https://www.microsoft.com/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/)<br><br> [Advice for incident responders on recovery from system identity compromises](https://www.microsoft.com/security/blog/2020/12/21/advice-for-incident-responders-on-recovery-from-systemic-identity-compromises/) from the Detection and Response Team (DART) <br><br>[Using Microsoft 365 Defender to coordinate protection against Solorigate](https://www.microsoft.com/security/blog/2020/12/28/using-microsoft-365-defender-to-coordinate-protection-against-solorigate/)   <br><br>[Ensuring customers are protected from Solarigate](https://www.microsoft.com/security/blog/2020/12/15/ensuring-customers-are-protected-from-solorigate/)   |
| **GitHub resources**    |   [Azure Sentinel workbook for SolarWinds post-compromise hunting](https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/SolarWindsPostCompromiseHunting.json) <br><br>[Advanced query reference](#advanced-query-reference)      |
|     |         |
