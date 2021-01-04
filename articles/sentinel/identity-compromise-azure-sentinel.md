---
title: Using Azure Sentinel to respond to supply chain attacks and systemic identity compromise | Microsoft Docs
description: Learn how to use Azure Sentinel to respond to supply chain attacks and systemic identity compromises similar to the SolarWinds attack (Solorigate).
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2020
ms.author: bagol

---

# Using Microsoft Azure Sentinel to respond to supply chain attacks and systemic identity threats

Azure Sentinel enables you to analyze data from across products, including both on-premises and cloud environments. 

For example, Microsoft 365 Defender has a range of alerts and queries for known patterns associated with the Solorigate attack, which can flow into Sentinel. Microsoft 365 Defender alerts, combined with raw logs from other data sources, can provide security teams with insights into the full nature and scope of the Solorigate attack on their organization.

Use Azure Sentinel to hunt for attack activity, especially with the [SolarWinds post-compromise hunting workbook](https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/SolarWindsPostCompromiseHunting.json). For example, if you have recently rotated Active Directory Federated Service (ADFS) key material, use the [Sentinel hunting workbook](https://github.com/Azure/Azure-Sentinel/blob/master/Workbooks/SolarWindsPostCompromiseHunting.json) to identify attacker sign-in activity if they sign in with old key material. 

We recommend that you use Sentinel to perform the following steps as needed in your organization:

1. [Find machines with SolarWinds Orion components](#step-1-use-sentinel-to-find-machines-with-solarwinds-orion-components)
1. [Identify escalating privileges in your system](#step-2-use-sentinel-to-identify-escalating-privileges-in-your-system)
1. [Find exported certificates](#step-3-use-sentinel-to-find-exported-certificates)
1. [Hunt through Azure Active Directory logs](#step-4-use-sentinel-to-hunt-through-azure-active-directory-logs)
1. [Find reconnaissance and remote process execution](#step-5-use-sentinel-to-find-reconnaissance-and-remote-process-execution)
1. [Find illicit data access](#step-6-use-sentinel-to-find-illicit-data-access)
1. [Find mail data exfiltration](#step-7-use-sentinel-to-find-mail-data-exfiltration)
1. [Find suspicious domain-related activity](#step-8-use-sentinel-to-find-suspicious-domain-related-activity)
1. [Find evidence of security service tampering](#step-9-use-sentinel-to-find-evidence-of-security-service-tampering)
1. [Find correlations between Microsoft 365 Defender and Azure Sentinel detections](#step-10-use-sentinel-to-find-correlations-between-microsoft-365-defender-and-azure-sentinel-detections)

> [!NOTE]
> Depending on your configurations and identified risk, there may be steps described in this section that are not relevant for your organization, or should be performed in a different order than listed. 
>
> We recommend performing as many checks as possible with an informed understanding of your network estate.
>

> [!TIP]
> Azure Sentinel and the M365 Advanced Hunting portal share the same query language and similar data types. Therefore, all of the referenced queries can be used directly or slightly modified to work in both products.
>

## Step 1: Use Sentinel to find machines with SolarWinds Orion components

Your organization may have a software inventory management system that indicates the hosts where the SolarWinds application is installed. Alternately, use Sentinel with the [Microsoft 365 Defender connector](connect-microsoft-365-defender.md) to run a query and gather similar information.

Once you have the [Microsoft 365 Defender connector](connect-microsoft-365-defender.md) configured with Sentinel, you can use the following query to pull data about any hosts that have run the SolarWinds process in the last 30 days.

Returned hosts will include hosts that are on-boarded to Sentinel directly, or via Microsoft Defender for Endpoints (MDE). 

The following query also uses the Sysmon logs collected by many customers to find machines with SolarWinds software installed. Similar queries that use Microsoft 365 raw data can also be run from the Microsoft 365 Advanced hunting portal.

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

For more information, see [Finding hardcoded pipes in your environment](#step-1a-finding-hardcoded-pipes-in-your-environment).

### Step 1a: Finding hardcoded pipes in your environment

The Solorigate attacker used a hardcoded pipe named **583da945-62af-10e8-4902-a8f205c72b2e** to verify that only one instance of the backdoor they created was running, among other checks.

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

## Step 2: Use Sentinel to identify escalating privileges in your system

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
- [Use Microsoft Defender to respond to supply chain attacks and systemic identity threats](#use-microsoft-defender-to-respond-to-supply-chain-attacks-and-systemic-identity-threats), below

## Step 3: Use Sentinel to find exported certificates

Once an attacker has domain administrator access, they will steal the SAML token-signing certificate from the AD FS server. 

Once the certificate has been acquired, the attacker can forge SAML tokens with any claims and lifetime they choose, and then sign it with the stolen certificate. The attacker can then forge SAML tokens and impersonate highly privileged accounts. 

Microsoft 365 Defender has added high-fidelity detections for the Solorigate attack, which you can view in the Azure Sentinel Security Alerts, or in the Microsoft 365 security portal.

For more information, see:

- [Find stolen certificates using Windows Event logs](#step-3a-find-stolen-certificates-using-windows-event-logs)
- [Find stolen certificates using Sysmon logs](#step-3b-find-stolen-certificates-using-sysmon-logs)

The attacker may also have used custom tools, and so looking for unusual processes running or accounts signing into the AD FS server can provide insights about when attacks have happened.

For more information, see the following linked queries:

- [Find rare and unusual processes in your environment](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SecurityEvent/ProcessEntropy.yaml)
- [Find rare processes run by service accounts](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SecurityEvent/RareProcbyServiceAccount.yaml)
- [Find uncommon processes that are in the bottom 5% of all processes](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SecurityEvent/uncommon_processes.yaml)

> [!NOTE]
> Some environments have a rare command line syntax related to DLL loading. In such cases, adjust the queries linked above to also look at rarity on the command line.
> In some cases, depending on your environment configuration, using these queries as generic queries can be noisy. Therefore, we recommend to first limiting this sort of hunting to the ADFS server, and then only expand it if needed.

 
### Step 3a: Find stolen certificates using Windows Event logs

The following query finds evidence of exported ADFS DKM keys using Windows Event logs. 

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

### Step 3b: Find stolen certificates using Sysmon logs

The following query uses the visibility provided by Sysmon logs to provide detections with more reliability than Windows Event logs. 

To use this query, you must be collecting Sysmon Event IDs 17 and 18 into your Azure Sentinel workspace.

For more information, see the [ADFSKeyExportSysmon](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/SecurityEvent/ADFSKeyExportSysmon.yaml) query on GitHub.


## Step 4: Use Sentinel to hunt through Azure Active Directory logs

The Solorigate attacker also targeted the Azure AD for affected systems, and modified Azure AD settings to provide themselves with long-term access. You can use queries in the [Azure Sentinel workbook](https://github.com/Azure/Azure-Sentinel) to identify such activities in Azure AD.

For example, the [Azure Sentinel query for modified domain federation trust settings](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/AuditLogs/ADFSDomainTrustMods.yaml) alerts when a user or application modifies the federation settings on the domain, particularly when a new ADFS Trusted Realm object, such as a signing certificate, is added to the domain.
 
Since domain federation setting modifications should be rare, this would be a high-fidelity alert where Azure Sentinel users should pay careful attention.

Use the following queries to hunt for other unusual activity:

- [Find modifications made to STS refresh tokens](#step-4a-find-modifications-made-to-sts-refresh-tokens)
- [Find access added to service principals or applications](#step-4b-find-access-added-to-service-principals-or-applications)
- [Find applications with permissions to read mailbox contents](#step-4c-find-applications-with-permissions-to-read-mailbox-contents)

> [!TIP]
> You can also monitor Azure AD for sign-ins that attempt to use invalid key material. For example, this may occur when an attacker attempts to use a stolen key after the key material has already been rotated. 
>
> To do this, use Azure Sentinel to query **SignInLogs**, where the **ResultType**=**5000811**. 
>
> Note that if you roll your token-signing certificate, there will be expected activity for this query.
>

### Step 4a: Find modifications made to STS refresh tokens

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

### Step 4b: Find access added to service principals or applications

**Find extra credentials added to applications or service principals**

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

**Find first credentials added to applications or service principals**

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

### Step 4c: Find applications with permissions to read mailbox contents

The Solorigate attacker used applications with access to users mailboxes to read through privileged information.

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

 

## Step 5: Use Sentinel to find reconnaissance and remote process execution

An attacker might attempt to access on-premises systems to gain further insight about the environment mapping. For example, in the Solorigate attack, the attacker renamed the **adfind.exe** Windows administrative tool and then used it to enumerate domains in the system.

Search for such process executions, which may look as follows:

```VB
C:\Windows\system32\cmd.exe /C csrss.exe -h breached.contoso.com -f (name=”Domain Admins”) member -list | csrss.exe -h breached.contoso.com -f objectcategory=* > .\Mod\mod1.log
```

Customize the following query as needed to look at your specific DC/ADFS servers, and find command-line patterns related to ADFind usage:

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

## Step 6: Use Sentinel to find illicit data access

Use the following Sentinel queries to find evidence of illicit data access in your system:

- [Find instances of sign-ins used to access non-AD resources](#step-6a-find-instances-of-sign-ins-used-to-access-non-ad-resources)
- [Find instances of MFA sign-ins using tokens](#step-6b-find-instances-of-mfa-sign-ins-using-tokens)
- [Find sign-ins from Virtual Private Servers (VPS)](#step-6c-find-sign-ins-from-virtual-private-servers-vps)

### Step 6a: Find instances of sign-ins used to access non-AD resources

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

### Step 6b: Find instances of MFA sign-ins using tokens

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

### Step 6c: Find sign-ins from Virtual Private Servers (VPS)

The Solorigate attack used VPS hosts to access affected networks. Use the following linked queries together with other queries listed above to find evidence of access gained via VPS hosts:

- [Find successful sign-ins from network ranges associated with VPS providers](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/SigninLogs/Signins-From-VPS-Providers.yaml). This query may return a large number of false positives. We recommend investigating any results before proceeding.

- [Find sign-ins that come from known VPS provider network ranges](/data-explorer/kusto/query/ipv4-lookup-plugin). This query can also be used to find all sign-ins that do not come from known ranges, especially if your environment has a common sign-in source.

## Step 7: Use Sentinel to find mail data exfiltration 

Use the following Sentinel queries to monitor for suspicious access to email data:

- [Find suspicious access to MailItemsAccessed volumes](#step-7a-find-suspicious-access-to-mailitemsaccessed-volumes)
- [Find time series-based anomalies in MailItemsAccessed events](#step-7b-find-time-series-based-anomalies-in-mailitemsaccessed-events)
- [Find OWA data exfiltrations](#step-7c-find-owa-data-exfiltrations)
- [Find non-owner mailbox sign-in activity](#step-7d-find-non-owner-mailbox-sign-in-activity)

### Step 7a: Find suspicious access to MailItemsAccessed volumes

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

### Step 7b: Find time series-based anomalies in MailItemsAccessed events

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

### Step 7c: Find OWA data exfiltrations

Use the following Sentinel queries to find instances of PowerShell commands being used to export on-premises Exchange mailboxes, and then hosting the files on OWA servers in order to exfiltrate them.

- [Find hosts that created then removed mailbox export requests](#find-hosts-that-created-then-removed-mailbox-export-requests)
- [Find exported mailboxes hosted on OWA](#find-exported-mailboxes-hosted-on-owa)

#### Find hosts that created then removed mailbox export requests

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

#### Find exported mailboxes hosted on OWA

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



### Step 7d: Find non-owner mailbox sign-in activity

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

## Step 8: Use Sentinel to find suspicious domain-related activity

Use the following queries to find suspicious domain activity related to the Solorigate attack:

- [Find suspicious domain-specific activity](#step-8a-find-suspicious-domain-specific-activity)
- [Find suspicious domain DGA activity](#step-8b-find-suspicious-domain-dga-activity)
- [Find suspicious encoded domain activity](#step-8c-find-suspicious-encoded-domain-activity)

### Step 8a: Find suspicious domain-specific activity

Use the following Sentinel query to find IOCs collected from [MSTIC](https://blogs.microsoft.com/on-the-issues/2020/12/13/customers-protect-nation-state-cyberattacks/), [FireEye](https://github.com/fireeye/sunburst_countermeasures/blob/main/indicator_release/Indicator_Release_NBIs.csv), and [Volexity](https://www.volexity.com/blog/2020/12/14/dark-halo-leverages-solarwinds-compromise-to-breach-organizations/), using multiple network-focused data sources.

For more information, see the [Solorigate-Network-Beacon](https://github.com/Azure/Azure-Sentinel/blob/8a7cb80515cb9cc280c71b3cf076469db29ba5fc/Detections/MultipleDataSources/Solorigate-Network-Beacon.yaml) query on GitHub.

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

### Step 8b: Find suspicious domain DGA activity

The Solorigate attacker made several DGA-like subdomain queries as part of C2 activities.

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

### Step 8c: Find suspicious encoded domain activity

Use the following Sentinel query to search DNS logs for a pattern that includes the encoding pattern used by the DGA and encoded domains seen in sign-in logs. Results from this query can help identify other C2 domains that use the same encoding scheme.

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

## Step 9: Use Sentinel to find evidence of security service tampering

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

## Step 10: Use Sentinel to find correlations between Microsoft 365 Defender and Azure Sentinel detections

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

## Next steps

If you want to dive deeper using Azure Defender for Endpoint and Azure Active Directory, see:

- [Using Microsoft resources to respond to supply chain attacks and systemic identity compromise](identity-compromise-defender.md)
- [Using Microsoft resources to respond to supply chain attacks and systemic identity compromise](identity-compromise-aad.md)

**See also**:
- [Using Microsoft resources to respond to supply chain attacks and systemic identity compromise](solarwinds.md)
- [Solorigate indicators of compromise (IOCs)](solarwinds-ioc-mitigate.md)