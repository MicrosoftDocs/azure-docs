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

## Entities

Below is a index of all entity types defined in V3 schema and documented in this page: 

  - [Account](#account)
  - [Malware](#malware)
  - [Process](#process)
  - [File](#file)
  - [FileHash](#filehash)
  - [Form](#form)
  - [RegistryKey](#registrykey)
  - [RegistryValue](#registryvalue)
  - [NetworkConnection](#networkconnection)
  - [IP](#ip)
  - [Host](#host)
  - [HostLogonSession](#hostlogonsession)
  - [CloudApplication](#cloudapplication)
  - [CloudLogonSession](#cloudlogonsession)
  - [CloudLogonRequest](#cloudlogonrequest)
  - [OAuthApplication](#oauthapplication)
  - [Alerts](#alerts)
  - [DNS](#dns)
  - [ActiveDirectoryDomain](#activedirectorydomain)
  - [AzureResource](#azureresource)
  - [AmazonResource](#amazonresource)
  - [GoogleCloudResource](#googlecloudresource)
  - [SecurityGroup](#securitygroup)
  - [URL](#url)
  - [Mailbox](#mailbox)
  - [MailCluster](#mailcluster)
  - [MailMessage](#mailmessage)
  - [Nic](#nic)
  - [IoTDevice](#iotdevice)
  - [SubmissionFile](#submissionfile)
  - [SubmissionMail](#submissionmail)
  - [SubmissionUrl](#submissionurl)
  - [SubmissionUser](#submissionuser)
  - [MailboxConfiguration](#mailboxconfiguration)
  - [ServicePrincipal](#serviceprincipal)
  - [Container Entities](#container-entities)
    - [ContainerImage](#containerimage)
    - [ContainerRegistry](#containerregistry)
    - [Container](#container)
    - [KubernetesPod](#kubernetespod)
    - [KubernetesNamespace](#kubernetesnamespace)
    - [KubernetesCluster](#kubernetescluster)
    - [KubernetesService](#kubernetesservice)
    - [KubernetesServiceAccount](#kubernetesserviceaccount)
    - [KubernetesSecret](#kubernetessecret)
    - [KubernetesDeployment](#kubernetesdeployment)
    - [KubernetesReplicaSet](#kubernetesreplicaset)
    - [KubernetesStatefulSet](#kubernetesstatefulset)
    - [KubernetesDaemonSet](#kubernetesdaemonset)
    - [KubernetesJob](#kubernetesjob)
    - [KubernetesCronJob](#kubernetescronjob)
  - [Storage Entities](#storage-entities)
    - [BlobContainer](#blobcontainer)
    - [Blob](#blob)
    - [SasToken](#sastoken)
  - [GitHubOrganization](#githuborganization)
  - [GitHubUser](#githubuser)
  - [GitHubRepo](#githubrepo)
  - [TeamsMessage](#teamsmessage)
  - [TeamsMessageCluster](#teamsmessagecluster)

## Entities Description

Entities which are related to the reported alerts will be reported as part of the ‘Entities’ field in the alert. The 'Entities' field can contain entities of different types. Each entity contains a field called `Type` which will act as the discriminator and may contain additional fields per type. 

The structure and format for each entity field was originally designed so that it would be compatible with the OneCyber model by MDE. Compatibility here is maintained by allowing providers to send us additional fields than those defined below for each entity.

Entities can be hierarchical or nested and include other types and instances of entities in them. For example, a process entity might include a file entity with information about the image file that used to run the process. When including the file entity inside another entity, the nested entity can be included in-line as nested JSON object or as a reference to another entity. Entities references will be serialized as JSON references, i.e. using `$ref` and `$id` tags which are supported by most .net JSON serialization frameworks. Below is an example of a process entity that contains a file entity, one with reference and one inline:

| Inline Entity | Referenced Entity |
| ------------- | ----------------- |
| {Type: "process",	PID: 9444, File:<br>&nbsp;&nbsp;&nbsp;{Type: "file",<br>&nbsp;&nbsp;&nbsp;&nbsp;Path: "c:\temp\svchost.exe",<br>&nbsp;&nbsp;&nbsp;&nbsp;Name: "svchost.exe",}} | {Type: "file",<br>&nbsp;Path: "c:\temp\svchost.exe",<br>&nbsp;Name: "svchost.exe", $id: 1},<br>{Type: "process", PID: 9444,<br>&nbsp;File: {$ref: 1}} |

Each entity can hold additional context that will be added to it during the alert processing stages, i.e. IP entity might hold geo location, File entity might hold TI report etc. To support the additional context, each entity will contain relevant optional properties that can be complex objects on their own, to hold the attached information. Each context element is free to be in any schema and is required to support backward and forward schema compatibility, by allowing to contain properties that it is not currently aware of. We do expect the contextual data that is added to entities or to the alert, will be part of the schema specification document and any code that uses this kind of contextual data will use the structures defined here and not any schema-less format.

Each entity would include a set of common optional fields as listed here. In addition, each section below also listed the unique fields for each type of entity. All common fields for entities are optional and usually are system generated. They would usually be used when a product is persisting an alert and running analytic on top of alerts and their entities.

|Field|Type|Description|
|-----|----|-----------|
|Id|String|The graph item identifier, this should be a globally unique identifier. The graph item identifier is system generated and should normally not be set when creating new instances of entities.|
|FriendlyName|String|The graph item display name which is a short humanly readable description of the graph item instance. This property is optional and might be system generated.|
|StartTimeUtc|DateTime|The start of the entity validity period.<br>If not set, than the entity is considered valid at all times|
|EndTimeUtc|DateTime|The end of the entity validity period.<br>If not set, than the entity is considered valid at all times|
|CreatedTimeUtc|DateTime|The time when the item was created in UTC|
|LastUpdatedTimeUtc|DateTime|The last update time in UTC for the entity|
|Scope|String|The product scope for the graph node representing the entity. This refers to the logical processing scope of the graph and in most products would either be the subscription id, workspace id or the tenant id.<br>Alert providers should not populate this field, it is to be used by specific products which are down stream consumers of alerts.|
|PartitionKey|String|The node partition key within the graph. This is a system calculated value and derived from the Scope of the graph node.<br>Alert providers should not populate this field. It is system generated and to be used to improve queries from a graph of alerts and entities|
|ThreatIntelligence|List&lt;[ThreatIntelligence](Contextual-Objects.md#threatintelligence)&gt;|A list of ThreatIntelligence to describe the entity threat type)|
|ThreatAnalysisSummary|List&lt;[AnalysisSummary](Contextual-Objects.md#AnalysisSummary)&gt;|A list of AnalysisSummary to describe the entity threat analysis summary)|
|LastVerdict|AnalyzerResultVerdict?|The latest entity verdict, could be null if no analysis summary exists.|
|RemediationProviders|List&lt;EntityRemediationProvider&gt;|A list of EntityRemediationProvider to describe the entity remediation state supplied by the provider (SecurityAlert/InvestigationAction)|
|LastRemediationState|EntityRemediationState?|The latest entity remediation state, could be null if no remediation providers exists.|
|Tags|List&lt;Tag&gt;|A list of Tags assigned on the entity|
|EntitySources|List&lt;String&gt;|The sources from where the entity is generated|
|Metadata|EntityMetadata|See [Metadata](#metadata) section below for more details|
|Roles|ISet&lt;Role&gt;|Standardized descriptions of the entity role in an alert. List of possible values:<br><li>Unknown<li>Contextual<li>Scanned<li>Source<li>Destination<li>Created<li>Added<li>Compromised<li>Edited<li>Attacked<li>Attacker<li>CommandAndControl<li>Loaded<li>Suspicious<li>PolicyViolator|
|DetailedRoles|ISet&lt;string&gt;|Detailed descriptions of the entity role in an alert. Values are free form.|
|Asset|bool?|Indicates whether the current entity is an asset. Indicates in the entity is an asset. An asset is a persistent entity that the alert producer is protecting.|
|RbacScopes|RbacScopesContainer|The Rbac Scopes for this entity. See [Rbac Scopes](alert/Rbac-Scopes.md) for more details|
|EntityIds|Dictionary<string, string>|Map identifiers for this entity. See [Entity Identifiers](#entityidentifiers) for more details.|

### Entity Identifiers

Each type of entity defines a set of fields that uniquely identify it. These set of fields are used in two scenarios and for each there is a different list of identifiers:

* **Strong and Weak Identifiers**: these kind of identifiers are part of the code that implements the schema and not part of the json serialized form of an entity. The strong and weak identifiers are used to dedup and merge entity instances within the scope of a single alert. 
* **Entity Identifiers**: these kind of identifiers are part of the json serialized format of an entity and can be used to correlate alert entities with other data repositories such as XSPM enterprise graph or other data stores. 

Over time the direction should be towards deprecating entities strong identifiers, in favor of using map's entity identifiers across all entities and products scenarios as this allows for more integrated scenarios across systems.

#### Strong and Weak Identifiers

Each type of entity can define a set of field that can unique identify it. These set of fields can be referred to as Strong Identifiers in case they uniquely identify an entity instance without any disambiguity, or can be referred to as Weak Identifier where they can identify an entity under some assumption or some settings, but entities sharing the same Weak Identifiers are not guaranteed to refer to the same entity instance in all cases. 

An example for strong identifier for an account entity are NTDomain together with Name. Both fields together can uniquely identify an account instance, or putting it in other words, if two entities have the same NTDomain and Name values they refer to the same account.

An example for a weak identifier for an account entity is Name field by itself. Two entities that have the same Name field and all other fields are empty, can potentially refer to the same account. However, there is no certainty if other fields are missing because data was missing when reporting the entity and in fact these accounts have belong to different domains/hosts or if they belong to the same.

Strong and weak identifiers are used to merged entities together in various scenarios. One example is when adding entities to a SecurityAlert, if two entities have the same strong identifiers, they will be merged together. 

Entities can have multiple identifiers, strong or weak, and are considered equivalent if there is an intersection between the set of identifiers returned by each instance of an entity.

#### Entity Identifiers (Preview)

Entities which have a corresponding representation in XSPM enterprise graph or other data store, will have entity identifiers as part of the json representation of the entity. Such identifiers enable joins and correlation between alert entities and map identifiers to pull additional context into alerts or to pivot from alerts to other data stores as part of the alert investigation process. 

An example for use case where map entity identifiers is useful, is when enriching alerts with additional context from enterprise graph. In this use case, an alert that is being reported contains entity identifiers as part of the json content of each entity. The entity identifiers can be used to look up map nodes over enterprise graph API, to retrieve additional context such as inventory spec for resources, security insights etc. Additional use cases will become relevant as more sub-systems will adapt entity identifiers.

The map identifiers are defined as part of the XSPM enterprise graph project and a list of all relevant map identifiers is maintained as part of the [XSPM-Orion-IngestionClientContracts](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&_a=preview) code repository on `dev.azure.com/msazure/CESEC`. To add new identifiers to the `XSPM-Orion-IngestionClientContracts`, add a PR with changes to the identifiers json definitions under `/definition/EntityIdentifiers` at the repo root and send an email notification to [MDC CloudMap Providers](mailto:cloudmap_providers@microsoft.com) and [MDC CloudMap Consumers](mailto:mdcmapconsumers@microsoft.com) (those are temporary steps for contribution to enterprise graph until XSPM defines a modelling process).

Map identifiers are serialized into json format under the `EntityIds` property which is a collection of objects containing the identifier type and identifier value. An example of such entity json:

```json
{
    "Type": "account",
    "Name": "admin",
    "UPNSuffix": "contosohotels.com",
    "IsDomainJoined": true,
    "EntityIds": [
        { "Type": "UserPrincipalName", "Id": "admin@contosohotels.com" }
    ]
}
```

To access map identifiers that are part of an entity in code, use the EntityIds property which returns or adds `EntityId` to the collection. `EntityId` instances can be created using the `EntityIdFactory` that is part of the `CloudMap.Ingestion.Contract` nuget. Below is a code example on how to use it:

```c#
var entity = ...;

// print all identifiers explicitly added to the EntityIds collection
foreach (var identifier in EntityIds)
{
    Console.WriteLine($"{identifier.Type}: {identifier.Id}");
}

// add identifier to an entity
var awsIdentifier = EntityIdFactory.CreateAwsResourceName("arn:aws:eks:us-west-2:358385940343:cluster/eks-example");
entity.EntityIds.Add(awsIdentifier);

// Serialize the entity to json together with all map identifiers derived from the strong identifiers for this entity, if the flag of SecurityAlertDeserializationConfig.ShouldAddEntityIdentifiersOnSerialization is set to true. By default, this flag is set to false.
SecurityAlertDeserializationConfig.ShouldAddEntityIdentifiersOnSerialization = true;
string json = JsonConvert.SerializeObject(entity);
// json string now has EntityIds collection populated based on the entity strong identifiers

```

By default, entities strong identifiers are not converted to map identifiers and added to the EntityIds collection of an entity. However, there is an opt-in option to enable it by setting the `SecurityAlertDeserializationConfig.ShouldAddEntityIdentifiersOnSerialization` flag to be true. This flag adds identifiers to the list up

Not all Alert V3 entities have a corresponding map identifiers. Only alert entities which exists in the the map or inventory stores have corresponding identifiers that can be used with alert entities. In most cases, strong identifiers the are calculated based on the entity properties will be used to create map entity identifiers that are automatically added to an entity. Additional identifiers, of any kind, can be added to all entities.

### Tags

Each entity can have a list of tags assigned to it. These tags are used to classify an entity or to mark ownership. For example, a host entity can be tagged with data sensitivity tagged
classifying it as highly confidential.

Tag is identified by its 4 properties – ProviderName, TagId, TagName, TagType. So these properties are a required.

When merging two entities, the merge logic relies on the LastUpdatedTimeUtc to be valid. If LastUpdatedTimeUtc is valid non-null value it will overwrite the 'old' list of tags
with the newer list. If LastUpdatedTimeUtc is null in one of the entities, the result of the merge will be union between the two lists.
This means that the sender must always send all the tags with the entity and keeps the LastUpdatedTimeUtc up to date if he needs to overwrite and support delete/modify of tags.

Recommendations:
- Use tag names and tag Ids no longer than 60 characters, as some backends might truncate/ignore tags with strings longer than this (for storage reasons)
- Assign no more than 50 tags per entity, as some backends might only save the first 50 tags (for storage reasons)

### Roles

Entity roles are descriptions of an entity in an alert. So for example entities that represent the attacker in the alert (eg an IP the attacker is connecting from) can have the role Attacker. In the same way, entities that are included in the alert for context but were not directly impacted by attack in the alert will have the Contextual role.

|Role               |Description|
|-------------------|-----------|
|Contextual         |Entities that are likely benign but reported as a side effect of an attacker’s action. E.g. the legitimate services.exe process was used to start a malicious service.|
|Scanned            |Entities identified as targets of discovery scanning or reconnaissance actions. E.g. a port scanner was used to scan a network.|
|Source             |The entity the activity originated from. Device, user, IP address, etc.|
|Destination        |The entity the activity was sent to. Device, user, IP address, etc.|
|Created            |The entity was created due to the actions of an attacker. E.g. a user account was created.|
|Added              |The entity was added due to the actions of an attacker. E.g. a user account was added to a permissions group.|
|Compromised        |The entity was compromised and is under the control of an attacker. E.g. a user account was compromised and used to log into a cloud service.|
|Edited             |The entity was edited or changed by an attacker. E.g. the registry key for a service was edited to point to a new malicious payload location.|
|Attacked           |The entity was attacked. E.g. a device was targeted in a DDoS attack.|
|Attacker           |The entity represents the attacker. E.g. Attacker’s IP address seen logging into a cloud service using a compromised user account.|
|CommandAndControl  |The entity is being used for command and control. E.g. a C2 domain used by malware.|
|Loaded             |The entity was loaded by an attacker controlled process. E.g. A Dll was loaded into an attacker controlled process.|
|Suspicious         |The entity is suspected to be attacker controlled.|
|PolicyViolator     |The entity is violator of a customer defined policy.|

### Metadata
A bag of fields which are not presented to the user. This field is meant to hold technical fields that assist during alert processing and should not be exposed externally to end users.

The "EntityMetadata" structure supports primitive type values (e.g. ints, booleans, timestamps, datetimes) in addition to strings as well as an API to retrieve these values in a typed manner.

Example usage of typed values:

```json
Metadata: {
    "PricingTier": 2,
    "WrittenToStorage": true,
    "ShouldBeVisible": false,
    "AdditionalCustomField": "with-string-value"
}

```
# Types of Entities

Below are the fields for each type of entity. Next to each entity there is also a list of fields that makes up for a strong of weak identifiers for each type of entity, as well as the map identifiers used with each type of entity. **An entity is advised to contain at least the set of fields sufficient to make up for one of the strong identifiers**, so that checking entity instances for matches can be done to support investigation of security alert (i.e. making sure two alerts are referring to the same entity).

## Account
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘account’|
|Name|String||The name of the account. This field should hold only the name without any domain added to it, i.e. administrator|
|NTDomain|String||The NETBIOS domain name as it appears in the alert format – domain\username. Examples: Middleeast, NT AUTHORITY|
|DnsDomain|String||The fully qualified domain DNS name. Examples: middleeast.corp.microsoft.com|
|UPNSuffix|String||The user principal name suffix for the account, in some cases it is also the domain name. Examples: microsoft.com|
|Host|Entity||The host which contains the account in case it is a local account |
|Sid|String||The account security identifier, e.g. S-1-5-18|
|AadTenantId|Guid?||The AAD tenant id, if known|
|AadUserId|Guid?||The AAD account object id, if known|
|PUID|Guid?||The AAD Passport User ID, if known|
|IsDomainJoined|Bool?||Determines whether this is a domain account|
|ObjectGuid|Guid?||The objectGUID attribute is a single-value attribute that is the unique identifier for the object, assigned by active directory|
|CloudAppAccountId|String||AccountID by CloudApp provider alert. Created in order to know how to refer to 3rd party apps accounts that are not supported in other 1st party products|
|IsAnonymized|Bool?||Determines whether this is an anonymized user name. This is an optional field and by default the value is false|
|Stream|[Stream](Contextual-Objects.md#stream)||Refers to the the source of discovery logs related to the specific account. The value for Stream field is optional.|


Strong Identifiers of an account entity:
 - UPNSuffix, Name
 - AadUserId
 - Sid (in case it is not a builtin account Sid)
 - Host, Sid
 - Host, NTDomain, Name (in case NTDomain is a builtin domain, i.e. Workgroup)
 - NTDomain, Name (in case NTDomain differ from Host, if Host exists)
 - DnsDomain, Name
 - PUID 
 - ObjectGuid

 Weak Identifiers of an account entity:
  - Name

Map Entity Identifiers:
 - [UserPrincipalName](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=userprincipalname)
 - [AadObjectId](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=aadobjectid)
 - [ActiveDirectorySID](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=activedirectorysid)
 - [ActiveDirectorySAMAccountName](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=activedirectorysamaccountname)
 - [ActiveDirectoryObjectGuid](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=activedirectoryobjectguid)


## Malware
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘malware’|
|Name|String||The malware name by the vendor, e.g. Win32/Toga!rfn|
|Category|String||The malware category by the vendor, e.g. Trojan|
|Files|List<Entity>||List of linked file entities on which the malware was found. Can contain the File entities inline or as reference.<br>See the File entity for additional details on structure.|
|Processes|List<Entity>||List of linked process entities on which the malware was found. This would often be used when the alert triggered on fileless activity.<br>See the Process entity for additional details on structure.|

Strong Identifiers of a malware entity:
 - Name, Category

## Process
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘process’|
|ProcessId|String||The process ID|
|CommandLine|String||The command line used to create the process|
|ElevationToken|Enum?||The elevation token associated with the process.<br>Possible value is one for the following:<li>TokenElevationTypeDefault<li>TokenElevationTypeFull<li>TokenElevationTypeLimited|
|CreationTimeUtc|DateTime?||The time when the process started to run|
|ImageFile|[File (Entity)](#file)||Can contain the File entity inline or as reference.<br>See the File entity for additional details on structure.|
|Account|Account (Entity)||The account running the processes.<br>Can contain the Account entity inline or as reference.<br>See the Account entity for additional details on structure.|
|ParentProcess|Process (Entity)||The parent process entity. <br>Can contain partial data, i.e. only the PID|
|Host|Host (Entity)||The host on which the process was running|
|LogonSession|HostLogonSession (Entity)||The session in which the process was running|

Strong Identifiers of a process entity:
 - Host, ProcessId, CreationTimeUtc
 - Host, ParentProcessId, CreationTimeUtc, CommandLine
 - Host, ProcessId, CreationTimeUtc, ImageFile
 - Host, ProcessId, CreationTimeUtc, ImageFile.FileHash
 
 Weak Identifiers of a process entity:
 - ProcessId, CreationTimeUtc, CommandLine (and no Host)
 - ProcessId, CreationTimeUtc, ImageFile (and no Host)

## File
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘file’|
|Directory|String||The full path to the file|
|Name|String||The file name without path (some alerts might not include path)|
|AlternateDataStreamName|String|The file stream name in NTFS file system (null in case of main stream)|
|Host|Host (Entity)||The host on which the file was stored|
|URL|HostUrl (Entity)||Url where the file was downloaded from (MOTW)|
|WindowsSecurityZoneType|WindowsSecurityZone||Windows Security Zones (MOTW)|
|URL|ReferrerUrl (Entity)||Referrer url of the downloading file HTTP request (MOTW)|
|SizeInBytes|long?||The size of the file in bytes|
|FileHashes|List&lt;FileHash (Entity)&gt;||The file hashes associated with this file|


Strong Identifiers of a file entity:
- Directory, Name

## FileHash
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'filehash'|
|Algorithm|Enum|V|The hash algorithm type, can be either one of those value:<li>Unknown<li>MD5<li>SHA1<li>SHA256<li>SHA256AC|
|Value|String|V|The hash value|

Strong Identifiers of a file hash entity:
- Algorithm, Value

## Form
|Field|Type|Description|
|-----|----|-----------|
|Type|String|'form'|
|FormId|String|The form ID|
|Title|String|The form Name|
|OwnerId|String|The form owner aad id|
|PermissionType|FormPermissionType?|The form permission type, value can be InOrg or Anonymous|
|OwnerType|FormOwnerType?|The form owner type, value can be User or Group|
|FormType|FormType?|The form type|

Strong Identifiers of a form entity:
 - FormId

## RegistryKey
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘registry-key’|
|Hive|Enum?||One of the following values:<li>HKEY_LOCAL_MACHINE<li>HKEY_CLASSES_ROOT<li>HKEY_CURRENT_CONFIG<li>HKEY_USERS<li>HKEY_CURRENT_USER_LOCAL_SETTINGS<li>HKEY_PERFORMANCE_DATA<li>HKEY_PERFORMANCE_NLSTEXT<li>HKEY_PERFORMANCE_TEXT<li>HKEY_A<li>HKEY_CURRENT_USER|
|Key|String||The registry key path|

Strong Identifiers of a registry key entity:
- Hive, Key

## RegistryValue
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘registry-value’|
|Host|Host (Entity)||The Host which the Registry belongs to|
|Key|RegistryKey (Entity)||The registry key entity|
|Name|String||The registry value name|
|Value|string||String formatted representation of the value data|
|ValueType|Enum?||One of the following values:<li>String<li>Binary<li>DWord<li>Qword<li>MultiString<li>ExpandString<li>None<li>Unknown<br>Values should conform to Microsoft.Win32.RegistryValueKind enumeration

Strong Identifiers of a registry value entity:
- Key, Name

Weak Identifiers of a registry value entity:
- Name (without Key)

## NetworkConnection
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘network-connection’|
|SourceAddress|[IP (Entity)](#ip)||An entity of type ‘ip’ that is the source for this connection|
|SourcePort|int?||The source port number, e.g. 80|
|DestinationAddress|[IP (Entity)](#ip)||An entity of type ‘ip’ that is the destination for this connection|
|DestinationPort|int?||The destination port number, e.g. 80|
|Protocol|Enum?||One of the following values (can be empty if unknown):<li>TCP<li>UDP|

Strong Identifiers of a network connection entity:
- SourceAddress, SourcePort, DestinationAddress, DestinationPort, Protocol

## IP
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘ip’|
|Address|String|V|The IP address as string, e.g. 127.0.0.1 (either in Ipv4 or Ipv6)|
|AddressScope|String||Name of the host, subnet, or private network for non-public/global IP addresses. Null or empty for global IP addresses (default).|
|Location|[GeoLocation](Contextual-Objects.md#geolocation)||The geo-location context attached to the IP entity, see structure below|
|Stream|[Stream](Contextual-Objects.md#stream)||Refers to the the source of discovery logs related to the specific ip. The value for Stream field is optional.|

Strong Identifiers of an IP entity:
- Address (global IP address)
- Address, AddressScope (non-global IP address)

Map Entity Identifiers:
 - [IPv4Address](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=ipv4address)
 - [IPv6Address](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=ipv6address)

## Host
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘host’|
|IpInterfaces|List<Ip (Entity)>||List of all ip interfaces of the machine|
|DnsDomain|String||The DNS domain that this host belongs to. Should contain the complete DNS suffix for the domain, if known|
|NTDomain|String||The NT domain that this host belongs to.|
|HostName|String||The hostname without the domain suffix|
|NetBiosName|String||The host name (pre-windows2000)|
|IoTDevice|IoTDevice (Entity)|| The IoT Device entity (if this host represents an IoT Device) |
|AzureID|String||The azure resource id of the VM, if known|
|OMSAgentID|String||The OMS agent id, if the host has OMS agent installed|
|OSFamily|Enum?||One of the following values: <li>Linux<li>Windows<li>Android<li>IOS<li>Mac|
|OSVersion|String||A free text representation of the operating system.<br>This field is meant to hold specific versions the are more fine grained than OSFamily or future values not supported by OSFamily enumeration|
|IsDomainJoined|Bool||Determines whether this host belongs to a domain|

Strong Identifiers of a host entity:
- HostName, NTDomain
- HostName, DnsDomain
- NetBiosName, NTDomain
- NetBiosName, DnsDomain
- AzureID
- OMSAgentID
- IoTDevice

Weak Identifiers of a host entity:
- HostName
- NetBiosName

Map Entity Identifiers:
 - [DomainName](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=domainname)
 - [ActiveDirectorySAMAccountName](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=activedirectorysamaccountname)
 - [AzureResourceId](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=azureresourceid)

## HostLogonSession
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'host-logon-session'|
|SessionId|String|V|The session id for the account reported in the alert, e.g. 0x3e7|
|Account|Account (Entity)||The Account associated with the logon session|
|Host|Host (Entity)|V|The Host that the account had session on|
|StartTimeUtc|DateTime?||The session start time, if known|
|EndTimeUtc|DateTime?||The session end time, if known|

Strong Identifiers of a host logon session entity:
- SessionId, StartTimeUtc, Host, Account


## CloudApplication
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘cloud-application’|
|AppId|int||Deprecated, please use SaasId.The technical identifier of the application. This should be one of the values defined int the constants in [Cloud Application Identifiers](./CloudApplicationIdentifier.md). The value for AppId field is optional. AppId should not contain Instance Id. This field will be replaced by SaasId field.|
|SaasId|uint||The technical identifier of the application. This should be one of the values defined in the constants in [Cloud Application Identifiers](./CloudApplicationIdentifier.md). The value for SaasId field is optional. SaasId should not contain InstanceId.|
|Name|String||The name of the related cloud application. The value of application name is optional.|
|InstanceName|String||The user defined instance name of the cloud application. It is often used to distinguish between several applications of the same type that a customer has.|
|InstanceId|int||The identifier of the specific session of the application. This is a zero-based running-number. The value for InstanceId field is optional.|
|Risk|AppRisk?||Lets you filter apps by risk score so that you can focus on, for example, reviewing only highly risky apps. like Low, Medium, High or Unknown|
|Stream|[Stream](Contextual-Objects.md#stream)||Refers to the the source of discovery logs related to the specific cloud app. The value for Stream field is optional.|

Strong Identifiers of a cloud application entity:
 - AppId (without InstanceName)
 - Name (without InstanceName)
 - AppId, InstanceName
 - Name, InstanceName


## CloudLogonSession
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'cloud-logon-session'|
|SessionId|String|V|The session id for the account reported in the alert, e.g. 177997dc-5cba-435a-abdd-2bab21926d00|
|Account|Account (Entity)||The Account associated with the logon session|
|Protocol|string||The auth protocol that is used in this session, if known|
|DeviceName|string||The friendly name of the device, if known|
|OperatingSystem|string||The operating system that the device is running, if known|
|Browser|string||The browser that is used for the logon, if known|
|UserAgent|string||The user agent that is used for the logon, if known|
|StartTimeUtc|DateTime?||The session start time, if known|
|PreviousLogonTime|DateTime?||The previous logon time for this account, if known|

Strong Identifiers of a cloud logon session entity:
- SessionId, StartTimeUtc, Account


## CloudLogonRequest

> **Note:** For a variety of reasons, SessionId may occasionally be empty or null. In order to avoid disruptive change while changing CloudLogonSession, this additional entity is added. This RequestId utilized downstream to: <br /> 1. Query the Graph API on the M365D alert page for getting AAD IP alert story. <br /> 2. When a status update for a particular alert has to be provided back to AAD IP. 

|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'cloud-logon-request'|
|RequestId|String|V|It is unique identifier for a Logon request, while SessionId is maintained as long as same Refresh Token or authentication cookie is used. e.g. b60324f2-17bc-4b2a-b70b-e7c3331a1bef. This additional entity added |

Strong Identifiers of a cloud logon request entity:
- RequestId


## OAuthApplication
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘oauth-application’|
|OAuthAppId|String||Global ID of the application (in AAD, "Application ID" of the application object)|
|OAuthObjectId|String?||Object ID of the service principal in AAD|
|TenantId|String?||AAD tenant ID in which the app was installed|
|Name|String||Name of the app|
|Risk|AppRisk?||The app risk - like Low, Medium, High or Unknown|
|PublisherName|String||The publisher name of the app|
|Permissions|List<Permission>||List of permissions that were requested by the application, and their severities|
|RedirectURLs|List<String>||List of redirect urls|
|AuthorizedBy|int||How many users consented the app|

Strong Identifiers of an OAuth application entity:
- OauthAppId
- OauthObjectId, TenantId

Weak Identifiers of an OAuth application entity:
- OauthObjectId (Without TenantId)

Map Entity Identifiers:
 - [AadApplicationId](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=aadapplicationid)
 - [AadObjectId](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=aadobjectid)

Permission (JObject)
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|PermissionName|String|V|Represents the permission name that was required by the app|
|Risk|AppRisk?||The Risk of the permission required by the app - like Low, Medium, High or Unknown|


## Alerts

> **Note:** An alerts entity is obsolete type of entity, used only by ASC fusion incidents. It is advised to refer to [Case](../Case.md) or Incident schema when reporting compound alerts.

|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘alert’|
|AlertType|String||The type of the related alert|
|ProviderName|String||The provider name of the related alert|
|VendorName|String||The vendor name of the related alert|
|DisplayName|String||The display name for the related alert|
|CompromisedEntity|String||The display name of the compromised entity for the alert|
|Count|int||The number of related alerts grouped into the incident|
|StartTimeUtc|DateTime||The date time when the related alert started|
|EndTimeUtc|DateTime||The date time when the related alert ended|
|Severity|Enum||The related alert severity. Possible values:<li>High<li>Medium<li>Low|
|AlertIDs|List&lt;String&gt;||The alert IDs that are included as part of this related alert group|

Strong Identifiers of an alert entity:
- VendorName, ProviderName, AlertType, CompromisedEntity, DisplayName, StartTimeUtc, EndTimeUtc


## DNS
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||‘dns’|
|DomainName|String||The name of the DNS record associated with the alert|
|IpAddress|List&lt;[IP (Entity)](#ip)&gt;||Entities of type ‘ip’ for the resolved IP address.|
|DnsServerIp|[IP (Entity)](#ip)||An entity of type ‘ip’ for the Dns server resolving the request|
|HostIpAddress|[IP (Entity)](#ip)||An entity of type ‘ip’ for the Dns request client|

Strong Identifiers of a DNS entity:
- DomainName, DnsServerIp, HostIpAddress

Weak Identifiers of a DNS entity:
- DomainName, HostIpAddress

## ActiveDirectoryDomain
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'ActiveDirectoryDomain'|
|ActiveDirectoryDomainName|String|V|The name of the active directory domain entity|
|TrustedDomains|List&lt;Domain (Entity)&gt;||The trusted domains of this specific domain|

Strong Identifiers of a ActiveDirectoryDomain entity:
- ActiveDirectoryDomainName

## AzureResource
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'azure-resource'|
|ResourceId|String|V|The azure resource id of the resource|
|SubscriptionId|String||The resource subscription id (will be taken from the azure resource id)|
|ActiveContacts|List&lt;ActiveContact&gt;||Active contacts associated with the resource|
|ResourceType|String||The type of the resource|
|ResourceName|String||The name of the resource|


Strong Identifiers of an azure resource entity:
 - ResourceId

Map Entity Identifiers:
 - [AzureResourceId](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=azureresourceid)

## AmazonResource
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'amazon-resources'|
|AmazonResourceId|String|V|The amazon resource identifier(ARN) for the cloud resource|
|AmazonAccountId|String||The amazon account identifier|
|ResourceType|String||The type of the resource|
|ResourceName|String||The name of the resource|

Strong Identifiers of an amazon resource entity:
 - AmazonResourceId
 
Map Entity Identifiers:
- [AwsResourceName](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=awsresourcename)

## GoogleCloudResource
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'gcp-resource'|
|FullResourceName|String||The full resource name for the GCP resource, as defined in [https://cloud.google.com/iam/docs/full-resource-names](https://cloud.google.com/iam/docs/full-resource-names)|
|ProjectId|String||The google project id as defined by the user|
|ProjectNumber|long||The project number assigned by google|
|ResourceType|String||The type of the resource|
|ResourceName|String||The name of the resource|
|Location|String||The zone or region where the resource located|
|LocationType|Enum||The type of location, possible values are: Regional, Zonal or Global.|

Strong Identifiers of a google cloud resource entity:
 - FullResourceName

Map Entity Identifiers:
- [GcpFullResourceName](https://msazure.visualstudio.com/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&_a=preview&anchor=gcpfullresourcename)

## SecurityGroup
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'security-group'|
|DistinguishedName|String||The group distinguished name|
|SID|String||The SID attribute is a single-value attribute that specifies the security identifier (SID) of the group|
|ObjectGuid|Guid?||The objectGUID attribute is a single-value attribute that is the unique identifier for the object, assigned by active directory|

Strong Identifiers of a security group entity:
 - DistinguishedName
 - SID
 - ObjectGuid

Map Entity Identifiers:
 - [LDAPDistinguishedName](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=ldapdistinguishedname)
 - [ActiveDirectoryObjectGuid](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=activedirectoryobjectguid)
 - [ActiveDirectorySID](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=activedirectorysid)


## URL
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'url'|
|Url|Uri|V|A full URL the entity points to|

Strong Identifiers of an URL entity:
- Url (in cas of absolute Url)

Weak Identifiers of an URL entity:
- Url (in cas of relative Url)

Map Entity Identifiers:
 - [URL](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=url)

## Mailbox
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'mailbox'|
|MailboxPrimaryAddress|String||The mailbox's primary address|
|DisplayName|String||The mailbox's display name|
|Upn|String||The mailbox's UPN|
|AadId|String||The mailbox's AAD identifier of the user|
|RiskLevel|RiskLevel?||The risk level of this mailbox like Low, Medium, High|
|ExternalDirectoryObjectId|Guid?||The AzureAD identifier of mailbox. Similar to AadUserId in account entity but this property is specific to mailbox object on office side|

Strong Identifiers of a mailbox entity:
- MailboxPrimaryAddress

## MailCluster
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'mail-cluster'|
|NetworkMessageIds|IList&lt;String&gt;||The mail message IDs that are part of the mail cluster|
|CountByDeliveryStatus|IDictionary&lt;String,int&gt;||Count of mail messages by DeliveryStatus string representation|
|CountByThreatType|IDictionary&lt;String,int&gt;||Count of mail messages by ThreatType string representation|
|CountByProtectionStatus|IDictionary&lt;String,int&gt;||Count of mail messages by Protection Status string representation|
|CountByDeliveryLocation|IDictionary&lt;String,int&gt;||Count of mail messages by Delivery location string representation|
|Threats|IList&lt;String&gt;||The threats of mail messages that are part of the mail cluster|
|Query|String||The query that was used to identify the messages of the mail cluster|
|QueryTime|DateTime?||The query time|
|MailCount|int?||The number of mail messages that are part of the mail cluster|
|IsVolumeAnomaly|bool?||Is this a volume anomaly mail cluster|
|Source|String||The source of the mail cluster (default is 'O365 ATP')|

Strong Identifiers of a mail cluster entity:
- Query, Source

## MailMessage
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'mail-message'|
|Files|IList&lt;File&gt;||The File entities of this mail message's attachments|
|Recipient|String||The recipient of this mail message. Note that in case of multiple recipients the mail message is forked and each copy has one recipient|
|Urls|IList&lt;String&gt;||The Urls contained in this mail message|
|Threats|IList&lt;String&gt;||The threats of this mail message|
|Sender|String||The sender's email address|
|SenderIP|String||The sender's IP address|
|ReceivedDate|DateTime||The received date of this message|
|NetworkMessageId|Guid?||The network message id of this mail message|
|InternetMessageId|String||The internet message id of this mail message|
|Subject|String||The subject of this mail message|
|AntispamDirection|AntispamMailDirection?||The directionality of this mail message|
|DeliveryAction|DeliveryAction?||The delivery action of this mail message like Delivered, Blocked, Replaced etc|
|DeliveryLocation|DeliveryLocation?||The delivery location  of this mail message like Inbox, JunkFolder etc|
|CampaignID|String||The identifier of the campaign in which this mail message is present|
|SuspiciousRecipients|IList&lt;String&gt;||The list of recipients who were detected as suspicious|
|ForwardedRecipients|IList&lt;String&gt;||The list of all recipients on the forwarded mail|
|ForwardingType|ForwardingType?||The forwarding type of the mail like SMTP, ETR, etc|

Strong Identifiers of a mail message entity:
- NetworkMessageId, Recipient

## Nic
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||‘nic’|
|MacAddress|String||The MAC for the nic|
|IpAddress|[IP (Entity)](#ip)||The current IP for the nic|
|Vlans|List&lt;String&gt;||The current VLANs for the nic|

Strong Identifiers of an Nic entity:
- MacAddress

## IoTDevice
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'iotdevice'|
|IoTHub|AzureResource (Entity)||The AzureResource entity representing the IoT Hub the device belongs to|
|DeviceId|String|V|The ID of the device resource|
|DeviceName|String||The friendly name of the device|
|Owners|List&lt;String&gt;||The owners for the device|
|IoTSecurityAgentId|Guid?||The ID of the Azure Security Center for IoT agent running on the device|
|DeviceType|String||The type of the device ('temperature sensor', 'freezer', 'wind turbine' etc.)|
|DeviceTypeId|String|A unique id to identify each device type according to the device type schema, as the device type itself is a display name and not reliable in comparisons.
Possible values:<li>Unclassified = 0<li>Miscellaneous = 1<li>Network Device = 2<li>Printer = 3<li>Audio and Video = 4<li>Media and Surveillance = 5<li>Communication = 7<li>Smart Appliance = 9<li>Workstation = 10<li>Server = 11<li>Mobile = 12<li>Smart Facility = 13<li>Industrial = 14<li>Operational Equipment = 15|
|Source|String||The source (microsoft/vendor) of the device entity|
|SourceRef|Url (Entity)||A URL reference to the source item where the device is managed|
|Manufacturer|String||The manufacturer of the device|
|Model|String||The model of the device|
|OperatingSystem|String||The operating system the device is running|
|IpAddress|[IP (Entity)](#ip)||The current IP address of the device|
|MacAddress|String||The MAC address of the device|
|Nics|[Nic (Entity)](#nic)||The current Nics on the device|
|Protocols|List&lt;String&gt;||A list of protocols that the device supports|
|SerialNumber|String||The serial number of the device|
|Site|String||The site location of the device |
|Zone|String||The zone location of the device within a site|
|Sensor|string||The sensor the device is monitored by|
|Importance|Enum?||One of the following values:<li>Low<li>Normal<li>High|
|PurdueLayer|String||The Purdue Layer of the device|
|IsProgramming|Bool?||Determines whether the device classified as programming device|
|IsAuthorized|Bool?||Determines whether the device classified as authorized device|
|IsScanner|Bool?||Is the device classified as a scanner device|
|DevicePageLink|Url||A url to the device page in IoT defender portal|
|DeviceSubType|String||The name of the device sub type|

Strong Identifiers of an IoT device entity:
- IoTHub, DeviceId

Weak Identifiers of an IoT device entity:
- DeviceId (without IoTHub)

## SubmissionFile
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'SubmissionFile'|
|SubmissionId|Guid?||The Submission Id|
|SubmissionDate|DateTime?||Reported Date time for this submission.|
|Submitter|string||The submitter email address|
|FileName|string||Name of the file that was submitted by the user|
|FileHash|string||Submitted file's content as Hash|

Strong Identifiers of a SubmissionFile entity :
- SubmissionId, Submitter, FileName

## SubmissionMail
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'SubmissionMail'|
|SubmissionId|Guid?||The Submission Id|
|SubmissionDate|DateTime?||Reported Date time for this submission.|
|Submitter|string||The submitter email address|
|NetworkMessageId|Guid?||The network message id of email to which submission belongs.|
|Timestamp|DateTime?||The Time stamp when the message is received (Mail).|
|Recipient|string||The recipient of the mail.|
|Sender|string||The sender of the mail|
|SenderIp|string||The sender's IP|
|Subject|string||The subject of submission mail|
|ReportType|string||The submission type for the given instance. This maps to Junk, Phish, Malware or NotJunk.|

Strong Identifiers of a SubmissionMail entity :
- SubmissionId, Submitter, NetworkMessageId, Recipient

## SubmissionUrl
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'SubmissionUrl'|
|SubmissionId|Guid?||The Submission Id|
|SubmissionDate|DateTime?||Reported Date time for this submission.|
|Submitter|string||The submitter email address|
|Url|Uri||The URL which has been reported in this submission|
||||

Strong Identifiers of a SubmissionUrl entity :
- SubmissionId, Submitter, Url

## SubmissionUser
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'SubmissionUser'|
|SubmissionId|Guid?||The Submission Id|
|SubmissionDate|DateTime?||Reported Date time for this submission.|
|Submitter|string||The submitter email address|
|Upn|string||UPN (User Principal Name) of the user on whom this submission is created.|
|SmtpAddresses|IList&lt;string&gt;||List of SMTP addresses of the user on which report has been submitted.|

Strong Identifiers of a SubmissionUser entity :
- SubmissionId, Submitter, Upn

## MailboxConfiguration
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'MailboxConfiguration'|
|ConfigType|MailboxConfigurationType?||The mailbox's configuration type represented by this entity. Could be of type: MailForwardingRule, OwaSettings, EWSSettings MailDelegation or UserInboxRule|
|MailboxPrimaryAddress|String||The mailbox's primary address|
|DisplayName|String||The mailbox's display name|
|Upn|String||The mailbox's UPN|
|ConfigId|String||A mailbox can have more than one configuration entity of same configurationType. This unique id equivalent to URN.|
|ExternalDirectoryObjectId|Guid?||The AzureAD identifier of mailbox. Similar to AadUserId in account entity but this property is specific to mailbox object on office side|

Strong Identifiers of a mailbox configuration entity:
- ConfigId

Weak Identifiers of a mailbox configuration entity:
- MailboxPrimaryAddress, ConfigType

## ServicePrincipal
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'ServicePrincipal'|
|ServicePrincipalName|String||The display name for the service principal|
|ServicePrincipalObjectId|String|V|The unique identifier for the service principal. The value of the id property is often but not exclusively in the form of a GUID; treat it as an opaque identifier and do not rely on it being a GUID.|
|AppId|String||The unique identifier for the associated application (its appId property). The value of the id property is often but not exclusively in the form of a GUID; treat it as an opaque identifier and do not rely on it being a GUID.|
|AppOwnerTenantId|Guid?||Contains the tenant id where the application is registered. This is applicable only to service principals backed by applications.|
|TenantId|String||The AAD tenant id of Service Principal|
|ServicePrincipalType|Enum?||Type of the service principal: 'Unknown', 'Application', 'ManagedIdentity', 'Legacy'|

Strong Identifiers of a service principal entity:
- ServicePrincipalObjectId, TenantId

Map Entity Identifiers:
 - [AadObjectId](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=aadobjectid)
 - [AadApplicationId](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=aadapplicationid)

## Container Entities

### ContainerImage
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'container-image'|
|ImageId|string|V|Full URI for the image including tag or digest|
|DigestImage|[ContainerImage (Entity)](#containerimage)||Link to ContainerImage entity holding the digest id|
|Registry|[ContainerRegistry (Entity)](#containerregistry)||Link to ContainerRegistry entity holding the image|

Strong Identifiers:
- ImageId

Map Entity Identifiers:
- [ContainerImageId](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=containerimageid)

### ContainerRegistry
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'container-registry'|
|Registry|string|V|Registry uri|

Strong Identifiers:
- Registry

Map Entity Identifiers:
- [DomainName](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=domainname)

### Container
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'container'|
|ContainerId|string|||
|Name|string|||
|Image|[ContainerImage (Entity)](#containerimage)|||
|Command|List<string>|||
|Args|List<string>|||
|IsPrivileged|bool|||
|Pod|[Pod (Entity)](#kubernetespod)|||

Strong Identifiers:
- ContainerId, Pod
- Name, Pod

Weak Identifiers:
- ContainerId

Map Entity Identifiers:
- [ContainerId](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=containerid)

### KubernetesPod
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-pod'|
|Name|string|V||
|Labels|Dictionary<string, string>|||
|Controller|Controller (Entity)||Possible types are: [KubernetesDeployment](#kubernetesdeployment), [KubernetesReplicaSet](#kubernetesreplicaset), [KubernetesStatefulSet](#kubernetesstatefulset), [KubernetesDaemonSet](#kubernetesdaemonset), [KubernetesJob](#kubernetesjob), [KubernetesCronJob](#kubernetescronjob)|
|PodIP|[IP (Entity)](#ip)|||
|ServiceAccount|[ServiceAccount (Entity)](#kubernetesserviceaccount)|||
|Namespace|[Namespace (Entity)](#kubernetesnamespace)|||
|InitContainers|List<[Container (Entity)](#containerregistry)>|||
|EphemeralContainers|List<[Container (Entity)](#containerregistry)>|||
|Containers|List<[Container (Entity)](#containerregistry)>|||

Strong Identifiers:
- Name, Namespace

Map Entity Identifiers:
- [KubernetesResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesresource)

### KubernetesNamespace
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-namespace'|
|Name|string|||
|Labels|Dictionary<string, string>|||
|Cluster|[Cluster (Entity)](#kubernetescluster)|||

Strong Identifiers:
- Name, Cluster

Map Entity Identifiers:
- [KubernetesNamespace](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesnamespace)

### KubernetesCluster
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-cluster'|
|Name|string||The cluster name|
|CloudResource|IEntity||In case of Azure connected cluster, the resource id associated with it (For example: AzureResource, AmazonResource or GoogleCloudResource)|
|Distro|string||Type of distribution|
|Version|string||Cluster version|
|Platform|KubernetesPlatform||On which platform it runs on. Possible values are: Unknown, AKS, EKS, GKE, ARC|

Strong Identifiers:
- Name
- CloudResource

Map Entity Identifiers:
- [CloudResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=cloudresource)

### KubernetesService
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-service'|
|Name|string|V||
|Namespace|[Namespace (Entity)](#kubernetesnamespace)|||
|ServiceType|KubernetesServiceType||Possible values are: Unknown, ClusterIP, ExternalName, NodePort, LoadBalancer|
|Labels|Dictionary<string, string>|||
|Selector|Dictionary<string, string>|||
|ExternalIPs|List<[IP (Entity)](#ip)>|||
|ClusterIP|[IP (Entity)](#ip)|||
|ServicePorts|List<KubernetesServicePort>||KubernetesServicePort is a composite of AppProtocol, Name, NodePort, Port, Protocol and TargetPort.|

Strong Identifiers:
- Name, Namespace

Map Entity Identifiers:
- [KubernetesResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesresource)

### KubernetesServiceAccount
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-serviceaccount'|
|Name|string|V||
|Namespace|[Namespace (Entity)](#kubernetesnamespace)|||

Strong Identifiers:
- Name, Namespace

Map Entity Identifiers:
- [KubernetesResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesresource)

### KubernetesSecret
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-secret'|
|Name|string|V||
|Namespace|[Namespace (Entity)](#kubernetesnamespace)|||
|SecretType|string||Usually one of the built-in types, though can vary, so we are using string instead of enum to hold the values and allow for custom ones. You can use _KubernetesSecretType  _ class for built-in values|

Strong Identifiers:
- Name, Namespace

Map Entity Identifiers:
- [KubernetesResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesresource)

### KubernetesDeployment

This entity is type of Kubernetes controller.

|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-deployment'|
|Name|string|V||
|Namespace|[Namespace (Entity)](#kubernetesnamespace)|||
|Labels|Dictionary<string, string>|||

Strong Identifiers:
- Name, Namespace

Map Entity Identifiers:
- [KubernetesResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesresource)

### KubernetesReplicaSet

This entity is type of Kubernetes controller.

|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-replicaset'|
|Name|string|V||
|Namespace|[Namespace (Entity)](#kubernetesnamespace)|||
|Labels|Dictionary<string, string>|||

Strong Identifiers:
- Name, Namespace

Map Entity Identifiers:
- [KubernetesResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesresource)

### KubernetesStatefulSet

This entity is type of Kubernetes controller.

|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-statefulset'|
|Name|string|V||
|Namespace|[Namespace (Entity)](#kubernetesnamespace)|||
|Labels|Dictionary<string, string>|||

Strong Identifiers:
- Name, Namespace

Map Entity Identifiers:
- [KubernetesResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesresource)

### KubernetesDaemonSet

This entity is type of Kubernetes controller.

|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-daemonset'|
|Name|string|V||
|Namespace|[Namespace (Entity)](#kubernetesnamespace)|||
|Labels|Dictionary<string, string>|||

Strong Identifiers:
- Name, Namespace

Map Entity Identifiers:
- [KubernetesResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesresource)

### KubernetesJob

This entity is type of Kubernetes controller.

|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-job'|
|Name|string|V||
|Namespace|[Namespace (Entity)](#kubernetesnamespace)|||
|Labels|Dictionary<string, string>|||

Strong Identifiers:
- Name, Namespace

Map Entity Identifiers:
- [KubernetesResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesresource)

### KubernetesCronJob

This entity is type of Kubernetes controller.

|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'K8s-cronjob'|
|Name|string|V||
|Namespace|[Namespace (Entity)](#kubernetesnamespace)|||
|Labels|Dictionary<string, string>|||

Strong Identifiers:
- Name, Namespace

Map Entity Identifiers:
- [KubernetesResource](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=kubernetesresource)

## Storage Entities

### BlobContainer
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'blob-container'|
|Name|string|V|The name of the blob container |
|URL|Uri||A full URL of the container|
|StorageResource|[AzureResource (Entity)](#azureResource)||Link to Blob storage resource that this blob container belongs to|

Strong Identifiers:
- Name, StorageResource
- URL

Map Entity Identifiers:
- [CloudResourceNestedObject](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=cloudresourcenestedobject)
- [URL](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=url)

### Blob
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'blob'|
|Name|string|V|The name of the blob|
|BlobContainer|[BlobContainer (Entity)](#blobContainer)||Link to Blob container entity that this blob belongs to|
|URL|Uri||A full URL of the blob|
|FileHashes|List&lt;FileHash (Entity)&gt;||The file hashes associated with this blob|
|Etag|string||The Etag associated with this blob|

Strong Identifiers:
- Name, BlobContainer
- URL

Map Entity Identifiers:
- [CloudResourceNestedObject](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=cloudresourcenestedobject)
- [URL](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=url)

### GitHubOrganization
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'github-organization'|
|OrgId|string|V|The unique and immutable id of the organization|
|Login|string|V|The login (aka name) of the organization|
|Email|string||The email address of the organization|
|DisplayName|string||The display name of the organization|
|Company|string||The name of the company that owns the organization|
|WebUrl|string|V|The URL of the organization's web page (e.g., https://github.com/my-org)|

Strong Identifiers:
- OrgId
- WebUrl (composed of BaseUrl, Login)

Map Entity Identifiers:
- [URL](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=url)

### GitHubUser
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'github-user'|
|UserId|string||The unique and immutable id of the user account|
|Login|string|V|User's login (aka github handle)|
|Email|string||The email address of the user account|
|Name|string||User's name|
|WebUrl|string|V|The URL of the user's profile web page (e.g., https://github.com/my-login)|

Strong Identifiers:
- UserId
- WebUrl (composed of BaseUrl, Login)

Map Entity Identifiers:
- [URL](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=url)

### GitHubRepo
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'github-repository'|
|RepoId|string||The unique and immutable id of the github repository|
|Login|string|V|The login (aka name) of the repository|
|Owner|string|V|The login of the owner of repository|
|OwnerType|string|V|The type of owner of the repository (e.g. “User” or ‘Organization")|
|BaseUrl|string|V|The base URL of the repository's web page.|

Strong Identifiers:
- RepoId
- WebUrl (composed of BaseUrl, Login)

Map Entity Identifiers:
- [URL](https://dev.azure.com/msazure/CESEC/_git/XSPM-Orion-IngestionClientContracts?path=/doc/Identifiers.md&version=GBmain&_a=preview&anchor=url)

### SasToken
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|string||'sas-token'|
|SignatureHash|string|V|The SAS signature hash - unique identifier for each SAS|
|AllowedServices|HashSet&lt;string&gt;||Set of all services accessible with this SAS|
|AllowedResourceTypes|HashSet&lt;string&gt;||Set of all resource types accessible with this SAS|
|Permissions|HashSet&lt;string&gt;||Set of all permissions granted to this SAS|
|StartTime|DateTime?||SAS activation time - can be null|
|ExpiryTime|DateTime||SAS expiration time|
|AllowedIpAddresses|string||All ip addresses accessible with this SAS - default value is "Allows all IP addresses"|
|SignedWith|string||The storage key which used to generate the SAS|
|Protocol|string||Allowed protocol with this SAS|
|StorageResource|[AzureResource (Entity)](#azureResource)||Link to storage resource that this SAS belongs to|

Strong Identifiers:
- SignatureHash

## TeamsMessage
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'teams-message'|
|CampaignId|String||The identifier of the campaign in which teams message is present|
|GroupId|String||The identifier of Team or Group in which this message is present|
|MessageId|String||Non unique identifier of a message|
|ParentMessageId|String||Identifier of the message for which current message was a reply, else same as MessageId|
|OwningTenantId|Guid?||Tenant Id of the owner of the message|
|ThreadId|String||Identifier of the channel/chat that this message is part of|
|ThreadType|String||Teams message type - Chat, Topic, Space, Meeting|
|ChannelId|String||The channel id of this teams message|
|SourceId|String||The source id of this teams message|
|SourceAppName|String||Source of the message (desktop, mobile etc.)|
|IsExternal|Bool?||Indicates if there are external users in the chat|
|IsOwned|Bool?||Boolean value indicating if the message is owned by your organization|
|MessageDirection|AntispamTeamsDirection?||The directionality of this teams message|
|DeliveryAction|DeliveryAction?||The delivery action of this teams message like Delivered, Blocked, Redelivered|
|DeliveryLocation|TeamsDeliveryLocation?||The delivery location of this teams message like Teams, Quarantine|
|Subject|String||The subject of this teams message|
|Timestamp|DateTime?||The received date of this message|
|LastModifiedDate|DateTime?||Date and time when the message was last edited|
|Recipients|IList&lt;String&gt;||The recipients of this teams message|
|SenderFromAddress|String||The sender's smtp address|
|SenderIP|String||The sender's IP address|
|SuspiciousRecipients|IList&lt;String&gt;||The list of recipients who were detected as suspicious|
|Files|IList&lt;File&gt;||The File entities of this teams message's attachments|
|Urls|IList&lt;URL&gt;||The Urls contained in this teams message|

Strong Identifiers of a teams message entity:
- SourceId

## TeamsMessageCluster
|Field|Type|Mandatory|Description|
|-----|----|---------|-----------|
|Type|String||'teams-message-cluster'|
|MessageIds|IList&lt;String&gt;||The teams message IDs that are part of the teams message cluster|
|CountByThreatType|IDictionary&lt;String,int&gt;||Count of teams messages by ThreatType string representation|
|CountByProtectionStatus|IDictionary&lt;String,int&gt;||Count of teams messages by Protection Status string representation|
|CountByDeliveryLocation|IDictionary&lt;String,int&gt;||Count of teams messages by Delivery location string representation|
|Query|String||The query that was used to identify the messages of the teams message cluster|
|QueryTime|DateTime?||The query time|
|MessageCount|int?||The number of teams messages that are part of the teams message cluster|
|IsVolumeAnomaly|bool?||Is this a volume anomaly teams message cluster|
|Source|String||The source of the teams message cluster (default is 'O365 ATP')|

Strong Identifiers of a teams cluster entity:
- Query, Source

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
| 26318  | Microsoft Azure AD                |
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
