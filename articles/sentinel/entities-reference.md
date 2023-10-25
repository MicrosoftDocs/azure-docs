---
title: Microsoft Sentinel entity types reference | Microsoft Docs
description: This article displays the Microsoft Sentinel entity types and their required identifiers.
author: yelevin
ms.author: yelevin
ms.topic: reference
ms.date: 05/29/2023
ms.custom: ignite-fall-2021
---

# Microsoft Sentinel entity types reference

## Entity types and identifiers

The following table shows the **entity types** currently available for mapping in Microsoft Sentinel, and the **attributes** available as **identifiers** for each entity type. These attributes appear in the **Identifiers** drop-down list in the [entity mapping](map-data-fields-to-entities.md) section of the [analytics rule wizard](detect-threats-custom.md).

Each one of the identifiers in the **required identifiers** column is necessary to identify its entity. However, a required identifier might not, by itself, be sufficient to provide *unique* identification. The more identifiers used, the greater the likelihood of unique identification. You can use up to three identifiers for a single entity mapping.

For best results&mdash;for guaranteed unique identification&mdash;you should use identifiers from the **strongest identifiers** column whenever possible. The use of multiple strong identifiers enables correlation between strong identifiers from varying data sources and schemas. This correlation in turn allows Microsoft Sentinel to provide more comprehensive insights for a given entity.

| Entity type | Identifiers | Required identifiers | Strongest identifiers |
| - | - | - | - |
| [**User account**](#user-account)<br>*(Account)* | Name<br>FullName<br>NTDomain<br>DnsDomain<br>UPNSuffix<br>Sid<br>AadTenantId<br>AadUserId<br>PUID<br>IsDomainJoined<br>DisplayName<br>ObjectGuid | FullName<br>Sid<br>Name<br>AadUserId<br>PUID<br>ObjectGuid | Name + NTDomain<br>Name + UPNSuffix<br>AADUserId<br>Sid |
| [**Host**](#host) | DnsDomain<br>NTDomain<br>HostName<br>FullName<br>NetBiosName<br>AzureID<br>OMSAgentID<br>OSFamily<br>OSVersion<br>IsDomainJoined | FullName<br>HostName<br>NetBiosName<br>AzureID<br>OMSAgentID | HostName + NTDomain<br>HostName + DnsDomain<br>NetBiosName + NTDomain<br>NetBiosName + DnsDomain<br>AzureID<br>OMSAgentID |
| [**IP address**](#ip-address)<br>*(IP)* | Address | Address | |
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
| [**IoT device**](#iot-device) | IoTHub<br>DeviceId<br>DeviceName<br>IoTSecurityAgentId<br>DeviceType<br>Source<br>SourceRef<br>Manufacturer<br>Model<br>OperatingSystem<br>IpAddress<br>MacAddress<br>Protocols<br>SerialNumber | IoTHub<br>DeviceId | IoTHub + DeviceId |
| [**Mailbox**](#mailbox) | MailboxPrimaryAddress<br>DisplayName<br>Upn<br>ExternalDirectoryObjectId<br>RiskLevel | MailboxPrimaryAddress | |
| [**Mail cluster**](#mail-cluster) | NetworkMessageIds<br>CountByDeliveryStatus<br>CountByThreatType<br>CountByProtectionStatus<br>Threats<br>Query<br>QueryTime<br>MailCount<br>IsVolumeAnomaly<br>Source<br>ClusterSourceIdentifier<br>ClusterSourceType<br>ClusterQueryStartTime<br>ClusterQueryEndTime<br>ClusterGroup | Query<br>Source | Query + Source |
| [**Mail message**](#mail-message) | Recipient<br>Urls<br>Threats<br>Sender<br>P1Sender<br>P1SenderDisplayName<br>P1SenderDomain<br>SenderIP<br>P2Sender<br>P2SenderDisplayName<br>P2SenderDomain<br>ReceivedDate<br>NetworkMessageId<br>InternetMessageId<br>Subject<br>BodyFingerprintBin1<br>BodyFingerprintBin2<br>BodyFingerprintBin3<br>BodyFingerprintBin4<br>BodyFingerprintBin5<br>AntispamDirection<br>DeliveryAction<br>DeliveryLocation<br>Language<br>ThreatDetectionMethods | NetworkMessageId<br>Recipient | NetworkMessageId + Recipient |
| [**Submission mail**](#submission-mail) | SubmissionId<br>SubmissionDate<br>Submitter<br>NetworkMessageId<br>Timestamp<br>Recipient<br>Sender<br>SenderIp<br>Subject<br>ReportType | SubmissionId<br>NetworkMessageId<br>Recipient<br>Submitter |  |
| [**Sentinel entities**](#sentinel-entities) | Entities | Entities |  |

## Entity type schemas

The following section contains a more in-depth look at the full schemas of each entity type. You'll notice that many of these schemas include links to other entity types&mdash;for example, the User account schema includes a link to the Host entity type, since one attribute of a user account is the host it's defined on. These externally linked entities can't be used as identifiers for the purpose of entity mapping, but they are very useful in giving a complete picture of entities on entity pages and the investigation graph.

> [!NOTE]
> A question mark following the value in the **Type** column indicates the field is nullable.

## User account

*Entity name: Account*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘account’ |
| Name | String | The name of the account. This field should hold only the name without any domain added to it. |
| *FullName* | *N/A* | *Not part of schema, included for backward compatibility with old version of entity mapping.*
| NTDomain | String | The NETBIOS domain name as it appears in the alert format – domain\username. Examples: Finance, NT AUTHORITY |
| DnsDomain | String | The fully qualified domain DNS name. Examples: finance.contoso.com |
| UPNSuffix | String | The user principal name suffix for the account. In some cases this is also the domain name. Examples: contoso.com |
| Host | Entity | The host which contains the account, if it's a local account. |
| Sid | String | The account security identifier, such as S-1-5-18. |
| AadTenantId | Guid? | The Microsoft Entra tenant ID, if known. |
| AadUserId | Guid? | The Microsoft Entra account object ID, if known. |
| PUID | Guid? | The Microsoft Entra Passport User ID, if known. |
| IsDomainJoined | Bool? | Determines whether this is a domain account. |
| DisplayName | String | The display name of the account. |
| ObjectGuid | Guid? | The objectGUID attribute is a single-value attribute that is the unique identifier for the object, assigned by Active Directory. |

Strong identifiers of an account entity:

- Name + UPNSuffix
- AadUserId
- Sid + Host (required for SIDs of builtin accounts)
- Sid (except for SIDs of builtin accounts)
- Name + NTDomain (unless NTDomain is a builtin domain, for example "Workgroup")
- Name + Host (if NTDomain is a builtin domain, for example "Workgroup")
- Name + DnsDomain
- PUID
- ObjectGuid

Weak identifiers of an account entity:

- Name

> [!NOTE]
> If the **Account** entity is defined using the **Name** identifier, and the Name value of a particular entity is one of the following generic, commonly built-in account names, then that entity will be dropped from its alert.
> - ADMIN
> - ADMINISTRATOR
> - SYSTEM
> - ROOT
> - ANONYMOUS
> - AUTHENTICATED USER
> - NETWORK
> - NULL
> - LOCAL SYSTEM
> - LOCALSYSTEM
> - NETWORK SERVICE

## Host

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘host’ |
| DnsDomain | String | The DNS domain that this host belongs to. Should contain the complete DNS suffix for the domain, if known. |
| NTDomain | String | The NT domain that this host belongs to. |
| HostName | String | The hostname without the domain suffix. |
| *FullName* | *N/A* | *Not part of schema, included for backward compatibility with old version of entity mapping.*
| NetBiosName | String | The host name (pre-Windows 2000). |
| IoTDevice | Entity | The IoT Device entity (if this host represents an IoT Device). |
| AzureID | String | The Azure resource ID of the VM, if known. |
| OMSAgentID | String | The OMS agent ID, if the host has OMS agent installed. |
| OSFamily | Enum? | One of the following values: <li>Linux<li>Windows<li>Android<li>IOS |
| OSVersion | String | A free-text representation of the operating system.<br>This field is meant to hold specific versions the are more fine-grained than OSFamily, or future values not supported by OSFamily enumeration. |
| IsDomainJoined | Bool | Determines whether this host belongs to a domain. |

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
| Address | String | The IP address as string, e.g. 127.0.0.1 (either in IPv4 or IPv6). |
| Location | GeoLocation | The geo-location context attached to the IP entity. <br><br>For more information, see also [Enrich entities in Microsoft Sentinel with geolocation data via REST API (Public preview)](geolocation-data-api.md). |

Strong identifiers of an IP entity:
- Address

## Malware

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘malware’ |
| Name | String | The malware name by the vendor, such as `Win32/Toga!rfn`. |
| Category | String | The malware category by the vendor, e.g. Trojan. |
| Files | List\<Entity> | List of linked file entities on which the malware was found. Can contain the File entities inline or as reference.<br>See the [File](#file) entity for more details on structure. |
| Processes | List\<Entity> | List of linked process entities on which the malware was found. This would often be used when the alert triggered on fileless activity.<br>See the [Process](#process) entity for more details on structure. |

Strong identifiers of a malware entity:

- Name + Category

## File

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘file’ |
| Directory | String | The full path to the file. |
| Name | String | The file name without the path (some alerts might not include path). |
| Host | Entity | The host on which the file was stored. |
| FileHashes | List&lt;Entity&gt; | The file hashes associated with this file. |

Strong identifiers of a file entity:
- Name + Directory
- Name + FileHash
- Name + Directory + FileHash

## Process

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘process’ |
| ProcessId | String | The process ID. |
| CommandLine | String | The command line used to create the process. |
| ElevationToken | Enum? | The elevation token associated with the process.<br>Possible values:<li>TokenElevationTypeDefault<li>TokenElevationTypeFull<li>TokenElevationTypeLimited |
| CreationTimeUtc | DateTime? | The time when the process started to run. |
| ImageFile | Entity (File) | Can contain the File entity inline or as reference.<br>See the [File](#file) entity for more details on structure. |
| Account | Entity | The account running the processes.<br>Can contain the Account entity inline or as reference.<br>See the [Account](#user-account) entity for more details on structure. |
| ParentProcess | Entity (Process) | The parent process entity. <br>Can contain partial data, i.e. only the PID. |
| Host | Entity | The host on which the process was running. |
| LogonSession | Entity (HostLogonSession) | The session in which the process was running. |

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
| AppId | Int | The technical identifier of the application. This should be one of the values defined in the list of [cloud application identifiers](#cloud-application-identifiers). The value for AppId field is optional. |
| Name | String | The name of the related cloud application. The value of application name is optional. |
| InstanceName | String | The user-defined instance name of the cloud application. It is often used to distinguish between several applications of the same type that a customer has. |

Strong identifiers of a cloud application entity:
 - AppId (without InstanceName)
 - Name (without InstanceName)
 - AppId + InstanceName
 - Name + InstanceName

## Domain name

*Entity name: DNS*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘dns’ |
| DomainName | String | The name of the DNS record associated with the alert. |
| IpAddress | List&lt;Entity (IP)&gt; | Entities corresponding to the resolved IP addresses. |
| DnsServerIp | Entity (IP) | An entity representing the DNS server resolving the request. |
| HostIpAddress | Entity (IP) | An entity representing the DNS request client. |

Strong identifiers of a DNS entity:
- DomainName + DnsServerIp + HostIpAddress

Weak identifiers of a DNS entity:
- DomainName + HostIpAddress

## Azure resource

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'azure-resource' |
| ResourceId | String | The Azure resource ID of the resource. |
| SubscriptionId | String | The subscription ID of the resource. |
| TryGetResourceGroup | Bool | The resource group value if it exists. |
| TryGetProvider | Bool | The provider value if it exists. |
| TryGetName | Bool | The name value if it exists. |

Strong identifiers of an Azure resource entity:
- ResourceId

## File hash

*Entity name: FileHash*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'filehash' |
| Algorithm | Enum | The hash algorithm type. Possible values:<li>Unknown<li>MD5<li>SHA1<li>SHA256<li>SHA256AC |
| Value | String | The hash value. |

Strong identifiers of a file hash entity:
- Algorithm + Value

## Registry key

*Entity name: RegistryKey*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘registry-key’ |
| Hive | Enum? | One of the following values:<li>HKEY_LOCAL_MACHINE<li>HKEY_CLASSES_ROOT<li>HKEY_CURRENT_CONFIG<li>HKEY_USERS<li>HKEY_CURRENT_USER_LOCAL_SETTINGS<li>HKEY_PERFORMANCE_DATA<li>HKEY_PERFORMANCE_NLSTEXT<li>HKEY_PERFORMANCE_TEXT<li>HKEY_A<li>HKEY_CURRENT_USER |
| Key | String | The registry key path. |

Strong identifiers of a registry key entity:
- Hive + Key

## Registry value

*Entity name: RegistryValue*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | ‘registry-value’ |
| Key | Entity (RegistryKey) | The registry key entity. |
| Name | String | The registry value name. |
| Value | String | String-formatted representation of the value data. |
| ValueType | Enum? | One of the following values:<li>String<li>Binary<li>DWord<li>Qword<li>MultiString<li>ExpandString<li>None<li>Unknown<br>Values should conform to Microsoft.Win32.RegistryValueKind enumeration. |

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

Strong identifiers of a security group entity:
 - DistinguishedName
 - SID
 - ObjectGuid

## URL

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'url' |
| Url | Uri | A full URL the entity points to. |

Strong identifiers of a URL entity:
- Url (when an absolute URL)

Weak identifiers of a URL entity:
- Url (when a relative URL)

## IoT device

*Entity name: IoTDevice*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'iotdevice' |
| IoTHub | Entity (AzureResource) | The AzureResource entity representing the IoT Hub the device belongs to. |
| DeviceId | String | The ID of the device in the context of the IoT Hub. |
| DeviceName | String | The friendly name of the device. |
| IoTSecurityAgentId | Guid? | The ID of the *Defender for IoT* agent running on the device. |
| DeviceType | String | The type of the device ('temperature sensor', 'freezer', 'wind turbine' etc.). |
| Source | String | The source (Microsoft/Vendor) of the device entity. |
| SourceRef | Entity (Url) | A URL reference to the source item where the device is managed. |
| Manufacturer | String | The manufacturer of the device. |
| Model | String | The model of the device. |
| OperatingSystem | String | The operating system the device is running. |
| IpAddress | Entity (IP) | The current IP address of the device. |
| MacAddress | String | The MAC address of the device. |
| Protocols | List&lt;String&gt; | A list of protocols that the device supports. |
| SerialNumber | String | The serial number of the device. |

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
| RiskLevel | Enum? | The risk level of this mailbox. Possible values:<li>None<li>Low<li>Medium<li>High |
| ExternalDirectoryObjectId | Guid? | The AzureAD identifier of mailbox. Similar to AadUserId in the Account entity, but this property is specific to mailbox object on the Office side. |

Strong identifiers of a mailbox entity:
- MailboxPrimaryAddress

## Mail cluster

*Entity name: MailCluster*

> [!NOTE]
> **Microsoft Defender for Office 365** was formerly known as Office 365 Advanced Threat Protection (O365 ATP).

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'mail-cluster' |
| NetworkMessageIds | IList&lt;String&gt; | The mail message IDs that are part of the mail cluster. |
| CountByDeliveryStatus | IDictionary&lt;String,Int&gt; | Count of mail messages by DeliveryStatus string representation. |
| CountByThreatType | IDictionary&lt;String,Int&gt; | Count of mail messages by ThreatType string representation. |
| CountByProtectionStatus | IDictionary&lt;String,long&gt; | Count of mail messages by Threat Protection status. |
| Threats | IList&lt;String&gt; | The threats of mail messages that are part of the mail cluster. |
| Query | String | The query that was used to identify the messages of the mail cluster. |
| QueryTime | DateTime? | The query time. |
| MailCount | Int? | The number of mail messages that are part of the mail cluster. |
| IsVolumeAnomaly | Bool? | Determines whether this is a volume anomaly mail cluster. |
| Source | String | The source of the mail cluster (default is 'O365 ATP'). |
| ClusterSourceIdentifier | String | The network message ID of the mail that is the source of this mail cluster. |
| ClusterSourceType | String | The source type of the mail cluster. This maps to the MailClusterSourceType setting from Microsoft Defender for Office 365 (see note above). |
| ClusterQueryStartTime | DateTime? | Cluster start time - used as start time for cluster counts query. Usually dates to the End time minus DaysToLookBack setting from Microsoft Defender for Office 365 (see note above). |
| ClusterQueryEndTime | DateTime? | Cluster end time - used as end time for cluster counts query. Usually the mail data's received time. |
| ClusterGroup | String | Corresponds to the Kusto query key used on Microsoft Defender for Office 365 (see note above). |

Strong identifiers of a mail cluster entity:
- Query + Source

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
| P1Sender | String | Email ID of (delegated) user who sent this mail "on-behalf of P2 (primary) user". If email not sent by delegate, this value is equal to P2Sender. |
| P1SenderDisplayName | String | Display name of the (delegated) user who sent this mail "on behalf of P2 (primary) user". Represented in email header by "OnbehalfofSenderDisplayName" property. |
| P1SenderDomain | String | Email domain of the (delegated) user who sent this mail "on behalf of P2 (primary) user". If email not sent by delegate, this value is equal to P2SenderDomain. |
| P2Sender | String | Email of the (primary) user on behalf of whom this email was sent. |
| P2SenderDisplayName | String | Display name of the (primary) user on behalf of whom this email was sent. If email not sent by delegate, this represents the display name of the sender. |
| P2SenderDomain | String | Email domain of the (primary) user on behalf of whom this email was sent. If email not sent by delegate, this represents the domain of the sender. |
| SenderIP | String | The sender's IP address. |
| ReceivedDate | DateTime | The received date of this message. |
| NetworkMessageId | Guid? | The network message ID of this mail message. |
| InternetMessageId | String | The internet message ID of this mail message. |
| Subject | String | The subject of this mail message. |
| BodyFingerprintBin1<br>BodyFingerprintBin2<br>BodyFingerprintBin3<br>BodyFingerprintBin4<br>BodyFingerprintBin5 | UInt? | Used by Microsoft Defender for Office 365 to find matching or similar mail messages. |
| AntispamDirection | Enum? | The directionality of this mail message. Possible values:<li>Unknown<li>Inbound<li>Outbound<li>Intraorg (internal) |
| DeliveryAction | Enum? | The delivery action of this mail message. Possible values:<li>Unknown<li>DeliveredAsSpam<li>Delivered<li>Blocked<li>Replaced |
| DeliveryLocation | Enum? | The delivery location of this mail message. Possible values:<li>Unknown<li>Inbox<li>JunkFolder<li>DeletedFolder<li>Quarantine<li>External<li>Failed<li>Dropped<li>Forwarded |
| Language | String | The language in which the contents of the mail are written. |
| ThreatDetectionMethods | IList&lt;String&gt; | The list of Threat Detection Methods applied on this mail. |

Strong identifiers of a mail message entity:
- NetworkMessageId + Recipient

## Submission mail

*Entity name: SubmissionMail*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'SubmissionMail' |
| SubmissionId | Guid? | The Submission ID. |
| SubmissionDate | DateTime? | Reported Date time for this submission. |
| Submitter | String | The submitter email address. |
| NetworkMessageId | Guid? | The network message ID of email to which submission belongs. |
| Timestamp | DateTime? | The Time stamp when the message is received (Mail). |
| Recipient | String | The recipient of the mail. |
| Sender | String | The sender of the mail. |
| SenderIp | String | The sender's IP. |
| Subject | String | The subject of submission mail. |
| ReportType | String | The submission type for the given instance. This maps to Junk, Phish, Malware or NotJunk. |

Strong identifiers of a SubmissionMail entity:
- SubmissionId, Submitter, NetworkMessageId, Recipient

## Sentinel entities

| Field | Type | Description |
| ----- | ---- | ----------- |
| Entities | String | A list of the entities identified in the alert. This list is the **entities** column from the SecurityAlert schema ([see documentation](security-alert-schema.md)). |

## Cloud application identifiers

The following list defines identifiers for known cloud applications. The App ID value is used as a [cloud application](#cloud-application) entity identifier.

| App ID | Name                              |
| ------ | --------------------------------- |
| 10026  | DocuSign                          |
| 10395  | Anaplan                           |
| 10489  | Box                               |
| 10549  | Cisco Webex                       |
| 10618  | Atlassian                         |
| 10915  | Cornerstone OnDemand              |
| 10921  | Zendesk                           |
| 10980  | Okta                              |
| 11042  | Jive Software                     |
| 11114  | Salesforce                        |
| 11161  | Office 365                        |
| 11162  | Microsoft OneNote Online          |
| 11394  | Microsoft Online Services         |
| 11522  | Yammer                            |
| 11599  | Amazon Web Services               |
| 11627  | Dropbox                           |
| 11713  | Expensify                         |
| 11770  | G Suite                           |
| 12005  | SuccessFactors                    |
| 12260  | Microsoft Azure                   |
| 12275  | Workday                           |
| 13843  | LivePerson                        |
| 13979  | Concur                            |
| 14509  | ServiceNow                        |
| 15570  | Tableau                           |
| 15600  | Microsoft OneDrive for Business   |
| 15782  | Citrix ShareFile                  |
| 17152  | Amazon                            |
| 17865  | Ariba Inc                         |
| 18432  | Zscaler                           |
| 19688  | Xactly                            |
| 20595  | Microsoft Defender for Cloud Apps |
| 20892  | Microsoft SharePoint Online       |
| 20893  | Microsoft Exchange Online         |
| 20940  | Active Directory                  |
| 20941  | Adallom CPanel                    |
| 22110  | Google Cloud Platform             |
| 22930  | Gmail                             |
| 23004  | Autodesk Fusion Lifecycle         |
| 23043  | Slack                             |
| 23233  | Microsoft Office Online           |
| 25275  | Microsoft Skype for Business      |
| 25988  | Google Docs                       |
| 26055  | Microsoft 365 admin center |
| 26060  | OPSWAT Gears                      |
| 26061  | Microsoft Word Online             |
| 26062  | Microsoft PowerPoint Online       | 
| 26063  | Microsoft Excel Online            |
| 26069  | Google Drive                      |
| 26206  | Workiva                           |
| 26311  | Microsoft Dynamics                |
| 26318  | Microsoft Entra ID                |
| 26320  | Microsoft Office Sway             |
| 26321  | Microsoft Delve                   |
| 26324  | Microsoft Power BI                |
| 27548  | Microsoft Forms                   |
| 27592  | Microsoft Flow                    |
| 27593  | Microsoft PowerApps               |
| 28353  | Workplace by Facebook             |
| 28373  | CAS Proxy Emulator                |
| 28375  | Microsoft Teams                   |
| 32780  | Microsoft Dynamics 365            |
| 33626  | Google                            |
| 34127  | Microsoft AppSource               |
| 34667  | HighQ                             |
| 35395  | Microsoft Dynamics Talent         |

## Next steps

In this document you learned about entity structure, identifiers, and schema in Microsoft Sentinel.

Learn more about [entities](entities.md) and [entity mapping](map-data-fields-to-entities.md). 
