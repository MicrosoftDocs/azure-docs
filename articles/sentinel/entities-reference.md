---
title: Microsoft Sentinel entity types reference | Microsoft Docs
description: This article displays the Microsoft Sentinel entity types and their required identifiers.
author: yelevin
ms.author: yelevin
ms.topic: reference
ms.date: 10/16/2024


#Customer intent: As a security analyst, I want to understand the entity types and identifiers in Microsoft Sentinel so that I can effectively track and investigate alerts and incidents.

---

# Microsoft Sentinel entity types reference

This document contains two sets of information regarding entities and entity types in Microsoft Sentinel in the Azure portal and [Microsoft Sentinel in the Defender portal](microsoft-sentinel-defender-portal.md).
- The [**Entity types and identifiers**](#entity-types-and-identifiers) table shows the different types of [entities](entities.md) that can be identified in alerts and incidents, allowing you to [track and investigate them](entity-pages.md). The table also shows, for each entity type, the different identifiers that can be used to identify an entity.
- The [**Entity schema**](#entity-type-schemas) section shows the data structure and schema for entities in general and for each entity type in particular.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Entity types and identifiers

The following table shows the **entity types** that can be recognized by Microsoft Sentinel, and the **attributes** that can be used as **identifiers** for each entity type.

Microsoft Sentinel recognizes entities in alerts and incidents that are created by [entity mapping](map-data-fields-to-entities.md) in [analytics rules](threat-detection.md). It also recognizes entities already identified in alerts ingested from other sources.

You can currently use up to three identifiers for a given entity when creating an entity mapping in Microsoft Sentinel. **Strong identifiers** alone are sufficient to uniquely identify an entity, whereas **weak identifiers** can do so only in combination with other identifiers. Learn more about [strong and weak identifiers](entities.md#strong-and-weak-identifiers). Most but not all identifiers in this table can be used when creating entity mappings in Microsoft Sentinel (see footnotes).

| Entity type | Identifiers | Strong identifiers | Weak identifiers |
| - | - | - | - |
| [**Account**](#account) | Name<br>*FullName \**<br>NTDomain<br>DnsDomain<br>UPNSuffix<br>Sid<br>AadTenantId<br>AadUserId<br>PUID<br>IsDomainJoined<br>*DisplayName \**<br>ObjectGuid | Name+UPNSuffix<br>AADUserId<br>Sid [\*\*](#strong-identifiers-of-an-account-entity)<br>Sid+*Host* [\*\*](#strong-identifiers-of-an-account-entity)<br>Name+*Host*+NTDomain [\*\*](#strong-identifiers-of-an-account-entity)<br>Name+NTDomain [\*\*](#strong-identifiers-of-an-account-entity)<br>Name+DnsDomain<br>PUID<br>ObjectGuid | Name |
| [**Host**](#host) | DnsDomain<br>NTDomain<br>HostName<br>*FullName \**<br>NetBiosName<br>AzureID<br>OMSAgentID<br>OSFamily<br>OSVersion<br>IsDomainJoined | HostName+NTDomain<br>HostName+DnsDomain<br>NetBiosName+NTDomain<br>NetBiosName+DnsDomain<br>AzureID<br>OMSAgentID | HostName<br>NetBiosName |
| [**IP**](#ip) | Address<br>AddressScope | Address [\*\*](#strong-identifiers-of-an-ip-entity)<br>Address+AddressScope [\*\*](#strong-identifiers-of-an-ip-entity) | |
| [**URL**](#url) | Url | Url *(if absolute URL)* [\*\*](#strong-identifiers-of-a-url-entity) | Url *(if relative URL)* [\*\*](#strong-identifiers-of-a-url-entity) |
| [**Azure resource**](#azure-resource)<br>*(AzureResource)* | ResourceId | ResourceId | |
| [**Cloud application**](#cloud-application)<br>*(CloudApplication)* | AppId<br>Name<br>InstanceName | AppId<br>Name<br>AppId+InstanceName<br>Name+InstanceName | |
| [**DNS resolution**](#dns-resolution)<br>*(DNS)* | DomainName | DomainName+*DnsServerIp*+*HostIpAddress* | DomainName+*HostIpAddress* |
| [**File**](#file) | Directory<br>Name | Directory+Name | |
| [**File hash**](#file-hash)<br>*(FileHash)* | Algorithm<br>Value | Algorithm+Value | |
| [**Malware**](#malware) | Name<br>Category | Name+Category | |
| [**Process**](#process) | ProcessId<br>CommandLine<br>ElevationToken<br>CreationTimeUtc | *Host*+ProcessID+CreationTimeUtc<br>*Host*+*ParentProcessId*+<br>&nbsp;&nbsp;&nbsp;CreationTimeUtc+CommandLine<br>*Host*+ProcessId+<br>&nbsp;&nbsp;&nbsp;CreationTimeUtc+*ImageFile*<br>*Host*+ProcessId+<br>&nbsp;&nbsp;&nbsp;CreationTimeUtc+*ImageFile*+<br>&nbsp;&nbsp;&nbsp;*FileHash* | ProcessId+CreationTimeUtc+<br>&nbsp;&nbsp;&nbsp;CommandLine (no Host)<br>ProcessId+CreationTimeUtc+<br>&nbsp;&nbsp;&nbsp;*ImageFile* (no Host) |
| [**Registry key**](#registry-key)<br>*(RegistryKey)* | Hive<br>Key | Hive+Key | |
| [**Registry value**](#registry-value)<br>*(RegistryValue)* | Name<br>Value<br>ValueType<br> | *Key*+Name | Name (no Key) |
| [**Security group**](#security-group)<br>*(SecurityGroup)* | DistinguishedName<br>SID<br>ObjectGuid | DistinguishedName<br>SID<br>ObjectGuid | |
| [**Mailbox**](#mailbox) | MailboxPrimaryAddress<br>DisplayName<br>Upn<br>ExternalDirectoryObjectId<br>RiskLevel | MailboxPrimaryAddress | |
| [**Mail cluster**](#mail-cluster)<br>*(MailCluster)* | NetworkMessageIds<br>CountByDeliveryStatus<br>CountByThreatType<br>CountByProtectionStatus<br>Threats<br>Query<br>QueryTime<br>MailCount<br>IsVolumeAnomaly<br>Source<br>*ClusterSourceIdentifier \**<br>*ClusterSourceType \**<br>*ClusterQueryStartTime \**<br>*ClusterQueryEndTime \**<br>*ClusterGroup \** | Query+Source | |
| [**Mail message**](#mail-message)<br>*(MailMessage)* | Recipient<br>Urls<br>Threats<br>Sender<br>*P1Sender \**<br>*P1SenderDisplayName \**<br>*P1SenderDomain \**<br>SenderIP<br>*P2Sender \**<br>*P2SenderDisplayName \**<br>*P2SenderDomain \**<br>ReceivedDate<br>NetworkMessageId<br>InternetMessageId<br>Subject<br>*BodyFingerprintBin1 \**<br>*BodyFingerprintBin2 \**<br>*BodyFingerprintBin3 \**<br>*BodyFingerprintBin4 \**<br>*BodyFingerprintBin5 \**<br>AntispamDirection<br>DeliveryAction<br>DeliveryLocation<br>*Language \**<br>*ThreatDetectionMethods \** | NetworkMessageId+Recipient | |
| [**Submission mail**](#submission-mail)<br>*(SubmissionMail)* | NetworkMessageId<br>Timestamp<br>Recipient<br>Sender<br>SenderIp<br>Subject<br>ReportType<br>SubmissionId<br>SubmissionDate<br>Submitter | SubmissionId+NetworkMessageId+<br>&nbsp;&nbsp;&nbsp;Recipient+Submitter |  |
| [**Sentinel entities**](#sentinel-entities) | Entities | Entities |  |

**Table footnotes:**
- \* These identifiers appear in the list of identifiers that can be used in entity mapping, but strictly speaking they are not part of the entity schema.
- \*\* These identifiers are considered strong only under certain conditions. Follow the asterisks' links to see the conditions that apply, under the relevant entity's listing in the [entity schemas section below](#entity-type-schemas).
- *Italicized identifier names* (without an asterisk) represent internal entities, which means that one entity type can have other entity types as attributes (see the [entity schemas section below](#entity-type-schemas)). Follow the identifier's link to see the internal entity's own schema.
- Other entities may be present in the schema, which is a general schema that supports many things besides Microsoft Sentinel. Only those entities available in Microsoft Sentinel are listed in this article.

## Entity type schemas

The following section contains a more in-depth look at the full schemas of each entity type. You'll notice that many of these schemas include links to other entity types. For example, the Account schema includes a link to the Host entity type, since one attribute of a user account is the host it's defined on. These entities-as-attributes are known as "internal entities", and they can't be used as identifiers for entity mapping, but they are very useful in giving a complete picture of entities on entity pages and the investigation graph.

> [!NOTE]
> A question mark following the value in the **Type** column indicates the field is nullable.

### List of entity type schemas

- [Account](#account)
- [Host](#host)
- [IP](#ip)
- [Malware](#malware)
- [File](#file)
- [Process](#process)
- [Cloud application](#cloud-application)
- [DNS resolution](#dns-resolution)
- [Azure resource](#azure-resource)
- [File hash](#file-hash)
- [Registry key](#registry-key)
- [Registry value](#registry-value)
- [Security group](#security-group)
- [URL](#url)
- [IoT device](#iot-device)
- [Mailbox](#mailbox)
- [Mail cluster](#mail-cluster)
- [Mail message](#mail-message)
- [Submission mail](#submission-mail)
- [Sentinel entities](#sentinel-entities)

### Account

*Entity name: Account*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'account' |
| **Name** | String | The name of the account. This field should hold only the name without any domain added to it. |
| ***FullName*** | -- | *Not part of schema, included for backward compatibility with old version of entity mapping.* |
| **NTDomain** | String | The NETBIOS domain name as it appears in the alert format&mdash;domain\username. Examples: Finance, NT AUTHORITY |
| **DnsDomain** | String | The fully qualified domain DNS name. Examples: finance.contoso.com |
| **UPNSuffix** | String | The user principal name suffix for the account. In many cases the UPN Suffix is also the domain name. Examples: contoso.com |
| **Host** | Entity ([Host](#host)) | The host that contains the account, if it's a local account. |
| **Sid** | String | The account's security identifier. |
| **AadTenantId** | Guid? | The Microsoft Entra tenant ID, if known. |
| **AadUserId** | Guid? | The Microsoft Entra account object ID, if known. |
| **PUID** | Guid? | The Microsoft Entra Passport User ID, if known. |
| **IsDomainJoined** | Bool? | Indicates whether the account is a domain account. |
| ***DisplayName*** | -- | *Not part of schema, included for backward compatibility with old version of entity mapping.* |
| **ObjectGuid** | Guid? | The objectGUID attribute is a single-value attribute that is the unique identifier for the object, assigned by Active Directory. |
| **CloudAppAccountId** | String | The AccountID in alerts from the CloudApp provider. Refers to account IDs in third-party apps that are not supported in other Microsoft products. |
| **IsAnonymized** | Bool? | Indicates whether the user name is anonymized. Optional. Default value: `false`. |
| **Stream** | Stream | The source of discovery logs related to the specific account. Optional. |

#### Strong identifiers of an account entity

- **Name + UPNSuffix**
- **AadUserId**
- **Sid**  
\*\* This identifier is strong as long as the account **is not** one of the built-in accounts listed in the **Note** below.
- **Sid + [*Host*](#host)**  
\*\* When the account is one of the built-in accounts listed in the **Note** below, the Host component is required to make this identifier a strong one.
- **Name + NTDomain**  
\*\* This combination is a strong identifier when the account is a domain account, since NTDomain is not a built-in domain/workgroup and is different from the host name. In this case, this is a strong identifier even without the Host component.
- **Name + NTDomain + [*Host*](#host)**  
\*\* The Host component is necessary to create a strong identifier when the account is a local account, meaning that the NTDomain is a built-in domain/workgroup.  
- **Name + DnsDomain**
- **PUID**
- **ObjectGuid**

#### Weak identifiers of an account entity
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

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Host

*Entity name: Host*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'host' |
| **IpInterfaces** | List<Entity ([Ip](#ip))> | List of all IP interfaces on the host machine. |
| **DnsDomain** | String | The DNS domain that this host belongs to. Should contain the complete DNS suffix for the domain, if known. |
| **NTDomain** | String | The NT domain that this host belongs to. |
| **HostName** | String | The hostname without the domain suffix. |
| **NetBiosName** | String | The host name (pre-Windows 2000). |
| **IoTDevice** | Entity ([IoT Device](#iot-device)) | The IoT Device entity (if this host represents an IoT Device). |
| **AzureID** | String | The Azure resource ID of the VM, if known. |
| **OMSAgentID** | String | The OMS agent ID, if the host has OMS agent installed. |
| **OSFamily** | Enum? | One of the following values: <li>Linux<li>Windows<li>Android<li>IOS<li>Mac |
| **OSVersion** | String | A free-text representation of the operating system.<br>This field is meant to hold specific versions the are more fine-grained than OSFamily, or future values not supported by OSFamily enumeration. |
| **IsDomainJoined** | Bool | Indicates whether this host belongs to a domain. |

#### Strong identifiers of a host entity

- **HostName + NTDomain**
- **HostName + DnsDomain**
- **NetBiosName + NTDomain**
- **NetBiosName + DnsDomain**
- **AzureID**
- **OMSAgentID**
- **IoTDevice**

#### Weak identifiers of a host entity

- HostName
- NetBiosName

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### IP

*Entity name: IP*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'ip' |
| **Address** | String | The IP address as string, for example. 127.0.0.1 (either in IPv4 or IPv6). |
| **AddressScope** | String | Name of the host, subnet, or private network for private, non-global IP addresses. Null or empty for global IP addresses (default). |
| **Location** | GeoLocation | The geo-location context attached to the IP entity. <br><br>For more information, see also [Enrich entities in Microsoft Sentinel with geolocation data via REST API (Public preview)](geolocation-data-api.md). |
| **Stream** | Stream | The source of discovery logs related to the specific IP. Optional. |

#### Strong identifiers of an IP entity

- **Address**  
\*\* Address alone is a unique, strong identifier when the IP address is a global address.
- **Address + AddressScope**  
\*\* For private/internal, non-global IP addresses, the AddressScope component is required to make this a strong identifier.

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Malware

*Entity name: Malware*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'malware' |
| **Name** | String | The malware name assigned by the (detection?) vendor, such as `Win32/Toga!rfn`. |
| **Category** | String | The malware category assigned by the (detection?) vendor, for example. Trojan. |
| **Files** | List\<Entity ([File](#file))> | List of linked file entities on which the malware was found. Can contain the File entities inline or as reference.<br>See the [File](#file) entity for more details on structure. |
| **Processes** | List\<Entity ([Process](#process))> | List of linked process entities on which the malware was found. This would often be used when the alert triggered on fileless activity.<br>See the [Process](#process) entity for more details on structure. |

#### Strong identifiers of a malware entity

- **Name + Category**

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### File

*Entity name: File*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'file' |
| **Directory** | String | The full path to the file. |
| **Name** | String | The file name without the path (some alerts might not include path). |
| **AlternateDataStreamName** | String | The file stream name in NTFS filesystem (null for the main stream). |
| **Host** | Entity ([Host](#host)) | The host on which the file was stored. |
| **HostUrl** | Entity ([URL](#url)) | URL where the file was downloaded from <br>([Mark of the Web](/deployedge/per-site-configuration-by-policy)). |
| **WindowsSecurityZoneType** | WindowsSecurityZone | Windows Security Zone to which the URL belongs <br>([Mark of the Web](/deployedge/per-site-configuration-by-policy)). |
| **ReferrerUrl** | Entity ([URL](#url)) | Referrer URL of the file download HTTP request <br>([Mark of the Web](/deployedge/per-site-configuration-by-policy)). |
| **SizeInBytes** | Long? | The size of the file in bytes. |
| **FileHashes** | List\<Entity ([FileHash](#file-hash))> | The file hashes associated with this file. |

#### Strong identifiers of a file entity

- **Name + Directory**
- **Name + *FileHash***
- **Name + Directory + *FileHash***

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Process

*Entity name: Process*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'process' |
| **ProcessId** | String | The process ID. |
| **CommandLine** | String | The command line used to create the process. |
| **ElevationToken** | Enum? | The elevation token associated with the process.<br>Possible values:<li>TokenElevationTypeDefault<li>TokenElevationTypeFull<li>TokenElevationTypeLimited |
| **CreationTimeUtc** | DateTime? | The time when the process started to run. |
| **ImageFile** | Entity ([File](#file)) | Can contain the File entity inline or as reference.<br>See the [File](#file) entity for more details on structure. |
| **Account** | Entity ([Account](#account)) | The account running the processes.<br>Can contain the Account entity inline or as reference.<br>See the [Account](#account) entity for more details on structure. |
| **ParentProcess** | Entity ([Process](#process)) | The parent process entity. <br>Can contain partial data, for example, only the PID. |
| **Host** | Entity ([Host](#host)) | The host on which the process was running. |
| **LogonSession** | Entity (HostLogonSession) | The session in which the process was running. |

#### Strong identifiers of a process entity

- ***Host* + ProcessId + CreationTimeUtc**
- ***Host* + *ParentProcessId* + CreationTimeUtc + CommandLine**
- ***Host* + ProcessId + CreationTimeUtc + *ImageFile***
- ***Host* + ProcessId + CreationTimeUtc + *ImageFile.FileHash***

#### Weak identifiers of a process entity

- ProcessId + CreationTimeUtc + CommandLine (and no Host)
- ProcessId + CreationTimeUtc + *ImageFile* (and no Host)

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Cloud application

*Entity name: CloudApplication*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'cloud-application' |
| **AppId** | Int | Deprecated; use SaasId field instead. The technical identifier of the application. Possible values are those defined in the list of [cloud application identifiers](#cloud-application-identifiers). Value optional. Should not contain InstanceId. |
| **SaasId** | Int | Replaces deprecated AppId field. The technical identifier of the application. Possible values are those defined in the list of [cloud application identifiers](#cloud-application-identifiers). Value optional. Should not contain InstanceId. |
| **Name** | String | The name of the related cloud application. Value optional. |
| **InstanceName** | String | The user-defined instance name of the cloud application. It is often used to distinguish between several applications of the same type that a customer has. |
| **InstanceId** | Int | The identifier of the specific session of the application. This is a zero-based running number. Value optional. |
| **Risk** | AppRisk? | Lets you filter apps by risk score so that you can focus on, for example, reviewing only highly risky apps. Possible values like Low, Medium, High or Unknown. |
| **Stream** | Stream | The source of discovery logs related to the specific cloud app. Optional. |

#### Strong identifiers of a cloud application entity

- **AppId (without InstanceName)**
- **Name (without InstanceName)**
- **AppId + InstanceName**
- **Name + InstanceName**

[List of cloud application identifiers](#cloud-application-identifiers)

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### DNS resolution

*Entity name: DNS*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'dns' |
| **DomainName** | String | The name of the DNS record associated with the alert. |
| **IpAddress** | List\<Entity ([IP](#ip))> | Entities corresponding to the resolved IP addresses. |
| **DnsServerIp** | Entity ([IP](#ip)) | An entity representing the DNS server resolving the request. |
| **HostIpAddress** | Entity ([IP](#ip)) | An entity representing the DNS request client. |

#### Strong identifiers of a DNS entity

- **DomainName + *DnsServerIp* + *HostIpAddress***

#### Weak identifiers of a DNS entity

- DomainName + *HostIpAddress*

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Azure resource

*Entity name: AzureResource*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'azure-resource' |
| **ResourceId** | String | The Azure resource ID of the resource. Mandatory. |
| **SubscriptionId** | String | The subscription ID of the resource. |
| **ActiveContacts** | List\<ActiveContact> | Active contacts associated with the resource. |
| **ResourceType** | String | The type of the resource. |
| **ResourceName** | String | The name of the resource. |

#### Strong identifiers of an Azure resource entity

- **ResourceId**

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### File hash

*Entity name: FileHash*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'filehash' |
| **Algorithm** | Enum | The hash algorithm type. Mandatory. Possible values:<li>Unknown<li>MD5<li>SHA1<li>SHA256<li>SHA256AC |
| **Value** | String | The hash value. Mandatory. |

#### Strong identifiers of a file hash entity

- **Algorithm + Value**

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Registry key

*Entity name: RegistryKey*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'registry-key' |
| **Hive** | Enum? | One of the following values:<li>HKEY_LOCAL_MACHINE<li>HKEY_CLASSES_ROOT<li>HKEY_CURRENT_CONFIG<li>HKEY_USERS<li>HKEY_CURRENT_USER_LOCAL_SETTINGS<li>HKEY_PERFORMANCE_DATA<li>HKEY_PERFORMANCE_NLSTEXT<li>HKEY_PERFORMANCE_TEXT<li>HKEY_A<li>HKEY_CURRENT_USER |
| **Key** | String | The registry key path. |

#### Strong identifiers of a registry key entity

- **Hive + Key**

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Registry value

*Entity name: RegistryValue*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'registry-value' |
| **Host** | Entity ([Host](#host)) | The host that the registry belongs to. |
| **Key** | Entity ([RegistryKey](#registry-key)) | The registry key entity. |
| **Name** | String | The registry value name. |
| **Value** | String | String-formatted representation of the value data. |
| **ValueType** | Enum? | One of the following values:<li>String<li>Binary<li>DWord<li>Qword<li>MultiString<li>ExpandString<li>None<li>Unknown<br>Values should conform to Microsoft.Win32.RegistryValueKind enumeration. |

#### Strong identifiers of a registry value entity

- ***Key* + Name**

#### Weak identifiers of a registry value entity

- Name (without Key)

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Security group

*Entity name: SecurityGroup*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'security-group' |
| **DistinguishedName** | String | The group distinguished name. |
| **SID** | String | A single-value attribute that specifies the security identifier (SID) of the group. |
| **ObjectGuid** | Guid? | A single-value attribute that is the unique identifier for the object, assigned by Active Directory. |

#### Strong identifiers of a security group entity

- **DistinguishedName**
- **SID**
- **ObjectGuid**

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### URL

*Entity name: Url*

| Field | Type | Description |
| ----- | ---- | ----------- |
| Type | String | 'url' |
| Url | Uri | A full URL the entity points to. Mandatory. |

#### Strong identifiers of a URL entity

- **Url** (\*\* This identifier is strong when the URL is an absolute URL.)

#### Weak identifiers of a URL entity

- Url (\*\* This identifier is weak when the URL is a relative URL.)

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### IoT device

*Entity name: IoTDevice*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'iotdevice' |
| **IoTHub** | Entity ([AzureResource](#azure-resource)) | The AzureResource entity representing the IoT Hub the device belongs to. |
| **DeviceId** | String | The ID of the device in the context of the IoT Hub. Mandatory. |
| **DeviceName** | String | The friendly name of the device. |
| **Owners** | List\<String> | The owners for the device. |
| **IoTSecurityAgentId** | Guid? | The ID of the *Defender for IoT* agent running on the device. |
| **DeviceType** | String | The type of the device ('temperature sensor', 'freezer', 'wind turbine' etc.). |
| **DeviceTypeId** | String | A unique ID to identify each device type according to the device type schema, as the device type itself is a display name and not reliable in comparisons.<br><br>Possible values:<br>Unclassified = 0<br>Miscellaneous = 1<br>Network Device = 2<br>Printer = 3<br>Audio and Video = 4<br>Media and Surveillance = 5<br>Communication = 7<br>Smart Appliance = 9<br>Workstation = 10<br>Server = 11<br>Mobile = 12<br>Smart Facility = 13<br>Industrial = 14<br>Operational Equipment = 15 |
| **Source** | String | The source (Microsoft/Vendor) of the device entity. |
| **SourceRef** | Entity ([Url](#url)) | A URL reference to the source item where the device is managed. |
| **Manufacturer** | String | The manufacturer of the device. |
| **Model** | String | The model of the device. |
| **OperatingSystem** | String | The operating system the device is running. |
| **IpAddress** | Entity ([IP](#ip)) | The current IP address of the device. |
| **MacAddress** | String | The MAC address of the device. |
| **Nics** | Entity (Nic) | The current NICs on the device. |
| **Protocols** | List\<String> | A list of protocols that the device supports. |
| **SerialNumber** | String | The serial number of the device. |
| **Site** | String | The site location of the device. |
| **Zone** | String | The zone location of the device within a site. |
| **Sensor** | String | The sensor monitoring the device. |
| **Importance** | Enum? | One of the following values:<li>Low<li>Normal<li>High |
| **PurdueLayer** | String | The Purdue Layer of the device. |
| **IsProgramming** | Bool? | Indicates whether the device classified as programming device. |
| **IsAuthorized** | Bool? | Indicates whether the device classified as authorized device. |
| **IsScanner** | Bool? | Indicates whether the device classified as a scanner device. |
| **DevicePageLink** | Entity ([Url](#url)) | A URL to the device page in Defender for IoT portal. |
| **DeviceSubType** | String | The name of the device subtype. |

#### Strong identifiers of an IoT device entity

- **IoTHub + DeviceId**

#### Weak identifiers of an IoT device entity

- DeviceId (without IoTHub)

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Mailbox

*Entity name: Mailbox*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'mailbox' |
| **MailboxPrimaryAddress** | String | The mailbox's primary address. |
| **DisplayName** | String | The mailbox's display name. |
| **Upn** | String | The mailbox's UPN. |
| **AadId** | String | The mailbox's Azure AD identifier of the user. |
| **RiskLevel** | RiskLevel?  | The risk level of this mailbox. Possible values:<li>None<li>Low<li>Medium<li>High |
| **ExternalDirectoryObjectId** | Guid? | The AzureAD identifier of mailbox. Similar to AadUserId in the Account entity, but this property is specific to mailbox object on the Office side. |

#### Strong identifiers of a mailbox entity

- **MailboxPrimaryAddress**

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Mail cluster

*Entity name: MailCluster*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'mail-cluster' |
| **NetworkMessageIds** | IList\<String> | The mail message IDs that are part of the mail cluster. |
| **CountByDeliveryStatus** | IDictionary\<String,Int> | Count of mail messages by DeliveryStatus string representation. |
| **CountByThreatType** | IDictionary\<String,Int> | Count of mail messages by ThreatType string representation. |
| **CountByProtectionStatus** | IDictionary\<String,long> | Count of mail messages by Protection status string representation. |
| **CountByDeliveryLocation** | IDictionary\<String,long> | Count of mail messages by Delivery location string representation. |
| **Threats** | IList\<String> | The threats of mail messages that are part of the mail cluster. |
| **Query** | String | The query that was used to identify the messages of the mail cluster. |
| **QueryTime** | DateTime? | The query time. |
| **MailCount** | Int? | The number of mail messages that are part of the mail cluster. |
| **IsVolumeAnomaly** | Bool? | Indicates whether the mail cluster is a volume anomaly mail cluster. |
| **Source** | String | The source of the mail cluster (default is `O365 ATP`). |

#### Strong identifiers of a mail cluster entity

- **Query + Source**

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Mail message

*Entity name: MailMessage*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'mail-message' |
| **Files** | IList\<Entity ([File](#file))> | The File entities of this mail message's attachments. |
| **Recipient** | String | The recipient of this mail message. In the case of multiple recipients, the mail message is copied, and each copy has one recipient. |
| **Urls** | IList\<String> | The URLs contained in this mail message. |
| **Threats** | IList\<String> | The threats contained in this mail message. |
| **Sender** | String | The sender's email address. |
| **SenderIP** | String | The sender's IP address. |
| **ReceivedDate** | DateTime | The received date of this message. |
| **NetworkMessageId** | Guid? | The network message ID of this mail message. |
| **InternetMessageId** | String | The internet message ID of this mail message. |
| **Subject** | String | The subject of this mail message. |
| **AntispamDirection** | Enum? | The directionality of this mail message. Possible values:<li>Unknown<li>Inbound<li>Outbound<li>Intraorg (internal) |
| **DeliveryAction** | Enum? | The delivery action of this mail message. Possible values:<li>Unknown<li>DeliveredAsSpam<li>Delivered<li>Blocked<li>Replaced |
| **DeliveryLocation** | Enum? | The delivery location of this mail message. Possible values:<li>Unknown<li>Inbox<li>JunkFolder<li>DeletedFolder<li>Quarantine<li>External<li>Failed<li>Dropped<li>Forwarded |
| **CampaignId** | String | The identifier of the campaign in which this mail message is present. |
| **SuspiciousRecipients** | IList\<String> | The list of recipients who were detected as suspicious. |
| **ForwardedRecipients** | IList\<String> | The list of all recipients on the forwarded mail. |
| **ForwardingType** | IList\<String> | The forwarding type of the mail, such as SMTP, ETR, etc. |

#### Strong identifiers of a mail message entity

- **NetworkMessageId + Recipient**

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Submission mail

*Entity name: SubmissionMail*

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Type** | String | 'SubmissionMail' |
| **SubmissionId** | Guid? | The Submission ID. |
| **SubmissionDate** | DateTime? | Reported Date time for this submission. |
| **Submitter** | String | The submitter email address. |
| **NetworkMessageId** | Guid? | The network message ID of email to which submission belongs. |
| **Timestamp** | DateTime? | The Time stamp when the message is received (Mail). |
| **Recipient** | String | The recipient of the mail. |
| **Sender** | String | The sender of the mail. |
| **SenderIp** | String | The sender's IP. |
| **Subject** | String | The subject of submission mail. |
| **ReportType** | String | The submission type for the given instance. Possible values are Junk, Phish, Malware, or NotJunk. |

#### Strong identifiers of a SubmissionMail entity

- **SubmissionId, Submitter, NetworkMessageId, Recipient**

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

### Sentinel entities

| Field | Type | Description |
| ----- | ---- | ----------- |
| **Entities** | String | A list of the entities identified in the alert. This list is the **entities** column from the SecurityAlert schema ([see documentation](security-alert-schema.md)). |

[Back to list of entity type schemas](#list-of-entity-type-schemas) | [Back to entity identifiers table](#entity-types-and-identifiers)

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
