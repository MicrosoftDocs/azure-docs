---
title: Azure Sentinel entity types reference | Microsoft Docs
description: This article displays the Azure Sentinel entity types and their required identifiers.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 12/28/2020
ms.author: yelevin

---

# Azure Sentinel entity types reference

## Entity types and identifiers

The following table shows the **entity types** currently available for mapping in Azure Sentinel, and the **attributes** available as **identifiers** for each entity type - which appear in the **Identifiers** drop-down list in the [entity mapping](map-data-fields-to-entities.md) section of the [analytics rule wizard](tutorial-detect-threats-custom.md).

Each one of the identifiers in the **required identifiers** column is *usually*, by itself, sufficient to uniquely identify its entity. The more identifiers used, the stronger the unique identification. You can use up to three identifiers for a single entity mapping.

For best results - for guaranteed unique identification - you should use an identifier from the **strongest identifiers** column whenever possible.

| Entity type | Identifiers | Required identifiers | Strongest identifiers |
| - | - | - | - |
| [**User account**](#user-account)<br>*(Account)* | Name<br>FullName<br>NTDomain<br>DnsDomain<br>UPNSuffix<br>Sid<br>AadTenantId<br>AadUserId<br>PUID<br>IsDomainJoined<br>DisplayName<br>ObjectGuid | FullName<br>Sid<br>Name<br>AadUserId<br>PUID<br>ObjectGuid | Name + NTDomain<br>Name + UPNSuffix<br>AADUserId<br>Sid |
| [**Host**](#host) | DnsDomain<br>NTDomain<br>HostName<br>FullName<br>NetBiosName<br>AzureID<br>OMSAgentID<br>OSFamily<br>OSVersion<br>IsDomainJoined | FullName<br>HostName<br>NetBiosName<br>AzureID<br>OMSAgentID | HostName + NTDomain<br>HostName + DnsDomain<br>NetBiosName + NTDomain<br>NetBiosName + DnsDomain<br>AzureID<br>OMSAgentID |
| [**IP address**](#ip-address)<br>*(IP)* | Address<br>***Location ?*** (not in list) | Address | |
| [**Malware**](#malware) | Name<br>Category | Name | |
| [**File**](#file) | Directory<br>Name | Name | |
| [**Process**](#process) | ProcessId<br>CommandLine<br>ElevationToken<br>CreationTimeUtc | CommandLine<br>ProcessId | |
| [**Cloud application**](#cloud-application)<br>*(CloudApplication)* | AppId<br>Name<br>InstanceName | AppId<br>Name | |
| [**Domain name**](#domain-name)<br>*(DNS)* | DomainName | DomainName | |
| [**Azure resource**](#azure-resource) | ResourceId | ResourceId | |
| [**File hash**](#file-hash)<br>*(FileHash)* | Algorithm<br>Value | Algorithm + Value | |
| [**Registry key**](#registry-key) | Hive<br>Key | Hive<br>Key | Hive + Key |
| [**Registry value**](#registry-value) | Name<br>Value<br>ValueType | Name | |
| [**Security group**](#security-group) | DistinguishedName<br>SID<br>ObjectGuid | DistinguishedName<br>SID<br>ObjectGuid | |
| [**URL**](#url) | Url | Url | |
| [**Mailbox**](#mailbox) | MailboxPrimaryAddress<br>DisplayName<br>Upn<br>ExternalDirectoryObjectId<br>RiskLevel | MailboxPrimaryAddress | |
| [**Mail cluster**](#mail-cluster) | NetworkMessageIds<br>CountByDeliveryStatus<br>CountByThreatType<br>CountByProtectionStatus<br>Threats<br>Query<br>QueryTime<br>MailCount<br>IsVolumeAnomaly<br>Source<br>ClusterSourceIdentifier<br>ClusterSourceType<br>ClusterQueryStartTime<br>ClusterQueryEndTime<br>ClusterGroup | Query<br>Source | |
| [**Mail message**](#mail-message) | Recipient<br>Urls<br>Threats<br>Sender<br>P1Sender<br>P1SenderDisplayName<br>P1SenderDomain<br>SenderIP<br>P2Sender<br>P2SenderDisplayName<br>P2SenderDomain<br>ReceivedDate<br>NetworkMessageId<br>InternetMessageId<br>Subject<br>BodyFingerprintBin1<br>BodyFingerprintBin2<br>BodyFingerprintBin3<br>BodyFingerprintBin4<br>BodyFingerprintBin5<br>AntispamDirection<br>DeliveryAction<br>DeliveryLocation<br>Language<br>ThreatDetectionMethods | NetworkMessageId<br>Recipient | |
| [**Submission mail**](#submission-mail) | SubmissionId<br>SubmissionDate<br>Submitter<br>NetworkMessageId<br>Timestamp<br>Recipient<br>Sender<br>SenderIp<br>Subject<br>ReportType | SubmissionId<br>NetworkMessageId<br>Recipient<br>Submitter |  |
|

## Entity type schemas

The following is a more in-depth look at the full schemas of each entity type. You'll notice that many of these schemas include links to other entity types - for example, the User account schema includes a link to the Host entity type, as one attribute of a user account is the host it's defined on. These externally-linked entities can't be used as identifiers for entity mapping, but they are very useful in giving a complete picture of entities on entity pages and the investigation graph.

> [!NOTE]
> A question mark following the value in the **Type** column indicates the field is nullable.

## User account

*Entity name: Account*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘account’ |
| Name | String | The name of the account. This field should hold only the name without any domain added to it. |
| **FullName** | **?** | **Not part of schema, included for backward and external compatibility ?**
| NTDomain | String | The NETBIOS domain name as it appears in the alert format – domain\username. Examples: Middleeast, NT AUTHORITY |
| DnsDomain | String | The fully qualified domain DNS name. Examples: middleeast.corp.microsoft.com |
| UPNSuffix | String | The user principal name suffix for the account. In some cases this is also the domain name. Examples: microsoft.com |
| Host | Entity | The host which contains the account, if it's a local account. |
| Sid | String | The account security identifier, such as S-1-5-18 |
| AadTenantId | Guid? | The Azure AD tenant ID, if known. |
| AadUserId | Guid? | The Azure AD account object ID, if known. |
| PUID | Guid? | The Azure AD Passport User ID, if known. |
| IsDomainJoined | Bool? | Determines whether this is a domain account. |
| DisplayName | String | The display name of the account. |
| ObjectGuid | Guid? | The objectGUID attribute is a single-value attribute that is the unique identifier for the object, assigned by Active Directory. |
|

Strong identifiers of an account entity:

- Name + UPNSuffix
- AadUserId
- Sid (except a SID of a builtin account)
- Sid + Host **(for SIDs of builtin accounts?)**
- Name + Host + NTDomain (if NTDomain is a builtin domain, i.e. Workgroup)
- ***Name + Host (if NTDomain is a builtin domain, i.e. Workgroup) ?***
- Name + NTDomain (if NTDomain differs from Host, if Host exists)
- Name + DnsDomain
- PUID
- ObjectGuid

Weak identifiers of an account entity:

- Name

## Host

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘host’ |
| DnsDomain | String | The DNS domain that this host belongs to. Should contain the complete DNS suffix for the domain, if known |
| NTDomain | String | The NT domain that this host belongs to. |
| HostName | String | The hostname without the domain suffix. |
| **FullName** | **?** | **Not part of schema, included for backward and external compatibility ?**
| NetBiosName | String | The host name (pre-windows2000). |
| IoTDevice | IoTDevice (Entity) | The IoT Device entity (if this host represents an IoT Device). |
| AzureID | String | The Azure resource ID of the VM, if known. |
| OMSAgentID | String | The OMS agent ID, if the host has OMS agent installed. |
| OSFamily | Enum? | One of the following values: <li>Linux<li>Windows<li>Android<li>IOS |
| OSVersion | String | A free-text representation of the operating system.<br>This field is meant to hold specific versions the are more fine-grained than OSFamily, or future values not supported by OSFamily enumeration. |
| IsDomainJoined | Bool | Determines whether this host belongs to a domain. |
|

Strong identifiers of a host entity:
- HostName + NTDomain
- HostName + DnsDomain
- NetBiosName + NTDomain
- NetBiosName + DnsDomain
- AzureID
- OMSAgentID
- IoTDevice (not supported for entity mapping)

Weak identifiers of a host entity:
- HostName
- NetBiosName

## IP address

*Entity name: IP*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘ip’ |
| Address | String | The IP address as string, e.g. 127.0.0.1 (either in Ipv4 or Ipv6) |
| Location | GeoLocation | The geo-location context attached to the IP entity. ***See structure below ?.*** |
|

Strong identifiers of an IP entity:
- Address

## Malware

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘malware’ |
| Name | String | The malware name by the vendor, such as Win32/Toga!rfn. |
| Category | String | The malware category by the vendor, e.g. Trojan. |
| Files | List\<Entity> | List of linked file entities on which the malware was found. Can contain the File entities inline or as reference.<br>See the File entity for additional details on structure. |
| Processes | List\<Entity> | List of linked process entities on which the malware was found. This would often be used when the alert triggered on fileless activity.<br>See the Process entity for additional details on structure. |
|

Strong identifiers of a malware entity:

- Name + Category

## File

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘file’ |
| Directory | String | The full path to the file. |
| Name | String | The file name without the path (some alerts might not include path). |
| Host | Host (Entity) | The host on which the file was stored. |
| FileHashes | List&lt;FileHash (Entity)&gt; | The file hashes associated with this file. |
|

Strong identifiers of a file entity:
- Directory + Name
- ***Name + FileHash ?***
- ***Name + Directory + FileHash ?***

## Process

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘process’ |
| ProcessId | String | The process ID |
| CommandLine | String | The command line used to create the process. |
| ElevationToken | Enum? | The elevation token associated with the process.<br>Possible value is one for the following:<li>TokenElevationTypeDefault<li>TokenElevationTypeFull<li>TokenElevationTypeLimited |
| CreationTimeUtc | DateTime? | The time when the process started to run. |
| ImageFile | File (Entity) | Can contain the File entity inline or as reference.<br>See the File entity for additional details on structure. |
| Account | Account (Entity) | The account running the processes.<br>Can contain the Account entity inline or as reference.<br>See the Account entity for additional details on structure. |
| ParentProcess | Process (Entity) | The parent process entity. <br>Can contain partial data, i.e. only the PID |
| Host | Host (Entity) | The host on which the process was running. |
| LogonSession | HostLogonSession (Entity) | The session in which the process was running. |
|

Strong identifiers of a process entity:

- Host + ProcessId + CreationTimeUtc
- Host + ParentProcessId + CreationTimeUtc + CommandLine
- Host + ProcessId + CreationTimeUtc + ImageFile
- Host + ProcessId + CreationTimeUtc + ImageFile.FileHash

Weak identifiers of a process entity:

- ProcessId + CreationTimeUtc + CommandLine (and no Host)
- ProcessId + CreationTimeUtc + ImageFile (and no Host)

## Cloud application

*Entity name: CloudApplication*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘cloud-application’ |
| AppId | int | The technical identifier of the application. ***This should be one of the values defined in the constants in [Cloud Application Identifiers](./CloudApplicationIdentifier.md) ?***. The value for AppId field is optional. |
| Name | String | The name of the related cloud application. The value of application name is optional. |
| InstanceName | String | The user defined instance name of the cloud application. It is often used to distinguish between several applications of the same type that a customer has. |
|

Strong identifiers of a cloud application entity:
 - AppId (without InstanceName)
 - Name (without InstanceName)
 - AppId + InstanceName
 - Name + InstanceName

## Domain name

*Entity name: DNS*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | enum | ‘dns’ |
| DomainName | String | The name of the DNS record associated with the alert. |
| IpAddress | List&lt;IP (Entity)&gt; | Entities of type ‘ip’ for the resolved IP address. |
| DnsServerIp | IP (Entity) | An entity of type ‘ip’ for the Dns server resolving the request. |
| HostIpAddress | IP (Entity) | An entity of type ‘ip’ for the Dns request client. |
|

Strong identifiers of a DNS entity:
- DomainName + DnsServerIp + HostIpAddress

Weak identifiers of a DNS entity:
- DomainName + HostIpAddress

## Azure resource

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'azure-resource' |
| ResourceId | String | The Azure resource ID of the resource |
| SubscriptionId | String | The subscription ID of the resource |
| TryGetResourceGroup | Bool | The resource group value if it exists |
| TryGetProvider | Bool | The provider value if it exists |
| TryGetName | Bool | The name value if it exists |
|  |  |  |
|  |  |  |
|  |  |  |
|

Strong identifiers of an Azure resource entity:
- ResourceId

## File hash

*Entity name: FileHash*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'filehash' |
| Algorithm | Enum | The hash algorithm type, can be either one of those value:<li>Unknown<li>MD5<li>SHA1<li>SHA256<li>SHA256AC |
| Value | String | The hash value |
|

Strong identifiers of a file hash entity:
- Algorithm + Value

## Registry key

*Entity name: RegistryKey*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘registry-key’ |
| Hive | Enum? | One of the following values:<li>HKEY_LOCAL_MACHINE<li>HKEY_CLASSES_ROOT<li>HKEY_CURRENT_CONFIG<li>HKEY_USERS<li>HKEY_CURRENT_USER_LOCAL_SETTINGS<li>HKEY_PERFORMANCE_DATA<li>HKEY_PERFORMANCE_NLSTEXT<li>HKEY_PERFORMANCE_TEXT<li>HKEY_A<li>HKEY_CURRENT_USER |
| Key | String | The registry key path. |
|

Strong identifiers of a registry key entity:
- Hive + Key

## Registry value

*Entity name: RegistryValue*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘registry-value’ |
| Key | RegistryKey (Entity) | The registry key entity. |
| Name | String | The registry value name. |
| Value | string | String formatted representation of the value data. |
| ValueType | Enum? | One of the following values:<li>String<li>Binary<li>DWord<li>Qword<li>MultiString<li>ExpandString<li>None<li>Unknown<br>Values should conform to Microsoft.Win32.RegistryValueKind enumeration. |
|

Strong identifiers of a registry value entity:
- Key + Name

Weak identifiers of a registry value entity:
- Name (without Key)

## Security group

*Entity name: SecurityGroup*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'security-group' |
| DistinguishedName | String | The group distinguished name. |
| SID | String | The SID attribute is a single-value attribute that specifies the security identifier (SID) of the group. |
| ObjectGuid | Guid? | The objectGUID attribute is a single-value attribute that is the unique identifier for the object, assigned by Active Directory. |
|

Strong identifiers of a security group entity:
 - DistinguishedName
 - SID
 - ObjectGuid

## URL

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'url' |
| Url | Uri | A full URL the entity points to. |
|

Strong identifiers of an URL entity:
- Url (when an absolute URL)

Weak identifiers of an URL entity:
- Url (when a relative URL)

## IoTDevice

> [!NOTE]
> Entity mapping is not yet supported for this entity type.

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'iotdevice' |
| IoTHub | AzureResource (Entity) | The AzureResource entity representing the IoT Hub the device belongs to. |
| DeviceId | String | The ID of the device in the context of the IoT Hub. |
| DeviceName | String | The friendly name of the device. |
| IoTSecurityAgentId | Guid? | The ID of the *Defender for IoT* agent running on the device. |
| DeviceType | String | The type of the device ('temperature sensor', 'freezer', 'wind turbine' etc.). |
| Source | String | The source (Microsoft/Vendor) of the device entity. |
| SourceRef | Url (Entity) | A URL reference to the source item where the device is managed. |
| Manufacturer | String | The manufacturer of the device. |
| Model | String | The model of the device. |
| OperatingSystem | String | The operating system the device is running. |
| IpAddress | IP (Entity) | The current IP address of the device. |
| MacAddress | String | The MAC address of the device. |
| Protocols | List&lt;String&gt; | A list of protocols that the device supports. |
| SerialNumber | String | The serial number of the device. |
|

Strong identifiers of an IoT device entity:
- IoTHub + DeviceId

Weak identifiers of an IoT device entity:
- DeviceId (without IoTHub)

## Mailbox

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'mailbox' |
| MailboxPrimaryAddress | String | The mailbox's primary address. |
| DisplayName | String | The mailbox's display name. |
| Upn | String | The mailbox's UPN. |
| RiskLevel | RiskLevel? | The risk level of this mailbox - Low, Medium, High. |
| ExternalDirectoryObjectId | Guid? | The AzureAD identifier of mailbox. Similar to AadUserId in the Account entity, but this property is specific to mailbox object on the Office side. |
|

Strong identifiers of a mailbox entity:
- MailboxPrimaryAddress

## Mail cluster

*Entity name: MailCluster*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'mail-cluster' |
| NetworkMessageIds | IList&lt;String&gt; | The mail message IDs that are part of the mail cluster. |
| CountByDeliveryStatus | IDictionary&lt;String,int&gt; | Count of mail messages by DeliveryStatus string representation. |
| CountByThreatType | IDictionary&lt;String,int&gt; | Count of mail messages by ThreatType string representation. |
| ***CountByProtectionStatus ?*** |  |  |
| Threats | IList&lt;String&gt; | The threats of mail messages that are part of the mail cluster. |
| Query | String | The query that was used to identify the messages of the mail cluster. |
| QueryTime | DateTime? | The query time. |
| MailCount | int? | The number of mail messages that are part of the mail cluster. |
| IsVolumeAnomaly | bool? | Is this a volume anomaly mail cluster. |
| Source | String | The source of the mail cluster (default is 'O365 ATP'). |
| ***ClusterSourceIdentifier ?*** |  |  |
| ***ClusterSourceType ?*** |  |  |
| ***ClusterQueryStartTime ?*** |  |  |
| ***ClusterQueryEndTime ?*** |  |  |
| ***ClusterGroup ?*** |  |  |
|

Strong identifiers of a mail cluster entity:
- Query + Source ***(together or separate?)***

## Mail message

*Entity name: MailMessage*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'mail-message' |
| Files | IList&lt;File&gt; | The File entities of this mail message's attachments. |
| Recipient | String | The recipient of this mail message. In the case of multiple recipients, the mail message is copied, and each copy has one recipient. |
| Urls | IList&lt;String&gt; | The URLs contained in this mail message. |
| Threats | IList&lt;String&gt; | The threats contained in this mail message. |
| Sender | String | The sender's email address. |
| ***P1Sender ?*** |  |  |
| ***P1SenderDisplayName ?*** |  |  |
| ***P1SenderDomain ?*** |  |  |
| ***P2Sender ?*** |  |  |
| ***P2SenderDisplayName ?*** |  |  |
| ***P2SenderDomain ?*** |  |  |
| SenderIP | String | The sender's IP address. |
| ReceivedDate | DateTime | The received date of this message. |
| NetworkMessageId | Guid? | The network message ID of this mail message. |
| InternetMessageId | String | The internet message ID of this mail message. |
| Subject | String | The subject of this mail message. |
| ***BodyFingerprintBin1 ?*** |  |  |
| ***BodyFingerprintBin2 ?*** |  |  |
| ***BodyFingerprintBin3 ?*** |  |  |
| ***BodyFingerprintBin4 ?*** |  |  |
| ***BodyFingerprintBin5 ?*** |  |  |
| AntispamDirection | AntispamMailDirection? | The directionality of this mail message. |
| DeliveryAction | DeliveryAction? | The delivery action of this mail message - Delivered, Blocked, Replaced, and others. |
| DeliveryLocation | DeliveryLocation? | The delivery location of this mail message - Inbox, JunkFolder, and others |
| ***Language ?*** |  |  |
| ***ThreatDetectionMethods ?*** |  |  |
|

Strong identifiers of a mail message entity:
- NetworkMessageId + Recipient ***(together or separate?)***

## Submission mail

*Entity name: SubmissionMail*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'SubmissionMail' |
| SubmissionId | Guid? | The Submission ID. |
| SubmissionDate | DateTime? | Reported Date time for this submission. |
| Submitter | string | The submitter email address. |
| NetworkMessageId | Guid? | The network message ID of email to which submission belongs. |
| Timestamp | DateTime? | The Time stamp when the message is received (Mail). |
| Recipient | string | The recipient of the mail. |
| Sender | string | The sender of the mail. |
| SenderIp | string | The sender's IP. |
| Subject | string | The subject of submission mail. |
| ReportType | string | The submission type for the given instance. This maps to Junk, Phish, Malware or NotJunk. |
|

Strong identifiers of a SubmissionMail entity :
- SubmissionId, Submitter, NetworkMessageId, Recipient
