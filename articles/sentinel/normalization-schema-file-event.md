---
title: The Advanced Security Information Model (ASIM) File Event normalization schema reference (Public preview)| Microsoft Docs
description: This article describes the Microsoft Sentinel File Event normalization schema.
author: oshezaf
ms.topic: reference
ms.date: 11/09/2021
ms.author: ofshezaf
---

# The Advanced Security Information Model (ASIM) File Event normalization schema reference (Public preview)

The File Event normalization schema is used to describe file activity such as creating, modifying, or deleting files or documents. Such events are reported by operating systems, file storage systems such as Azure Files, and document management systems such as Microsoft SharePoint.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The File Event normalization schema is currently in PREVIEW. This feature is provided without a service level agreement, and is not recommended for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Parsers

### Deploying and using file activity parsers

Deploy the ASIM File Activity parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/DeployASIM). To query across all File Activity sources, use the unifying parser `imFileEvent` as the table name in your query. 

For more information about using ASIM parsers, see the [ASIM parsers overview](normalization-parsers-overview.md).
For the list of the file activity parsers Microsoft Sentinel provides out-of-the-box refer to the [ASIM parsers list](normalization-parsers-list.md#file-activity-parsers) 

### Add your own normalized parsers

When implementing custom parsers for the File Event information model, name your KQL functions using the following syntax: `imFileEvent<vendor><Product`.

Refer to the article [Managing ASIM parsers](normalization-manage-parsers.md) to learn how to add your custom parsers to the file activity  unifying parser.


## Normalized content

For a full list of analytics rules that use normalized File Activity events, see [File Activity security content](normalization-content.md#file-activity-security-content).

## Schema overview

The File Event information model is aligned to the [OSSEM Process entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/file.md).

The File Event schema references the following entities, which are central to file activities:

- **Actor**. The user that initiated the file activity
- **ActingProcess**. The process used by the Actor to initiate the file activity
- **TargetFile**. The file on which the operation was performed
- **Source File (SrcFile)**. Stores file information prior to the operation.

The relationship between these entities is best demonstrated as follows: An **Actor** performs a file operation using an **Acting Process**, which modifies the **Source File** to **Target File**. 

For example: `JohnDoe` (**Actor**) uses `Windows File Explorer` (**Acting process**) to rename `new.doc` (**Source File**) to `old.doc` (**Target File**).


## Schema details

### Common fields

> [!IMPORTANT]
> Fields common to all schemas are described in detail in the [ASIM Common Fields](normalization-common-fields.md) article.
>

#### Fields with specific guidelines for the File Event schema

The following list mentions fields that have specific guidelines for File activity events:

| **Field** | **Class** | **Type**  | **Description** |
| --- | --- | --- | --- |
| <a name='eventtype'></a>**EventType**           | Mandatory   | Enumerated |    Describes the operation reported by the record. <br><br>Supported values include: <br><br>- `FileAccessed`<br>- `FileCreated`<br>- `FileModified`<br>- `FileDeleted`<br>- `FileRenamed`<br>- `FileCopied`<br>- `FileMoved`<br>- `FolderCreated`<br>- `FolderDeleted`<br>- `FolderMoved`<br>- `FolderModified`<br>- `FileCreatedOrModified` |
| **EventSubType**           | Optional   | Enumerated |    Describes details about the operation reported in [EventType](#eventtype). Supported values per event type include:<br>- `FileCreated` -  `Upload`, `Checkin`<br>- `FileModified` - `Checkin`<br>- `FileCreatedOrModified` - `Checkin`    <br>- `FileAccessed` - `Download`, `Preview`, `Checkout`, `Extended`<br>- `FileDeleted` - `Recycled`, `Versions`, `Site` |
| **EventSchema** | Mandatory | String | The name of the schema documented here is **FileEvent**. |
| **EventSchemaVersion**  | Mandatory   | String     | The version of the schema. The version of the schema documented here is `0.2.1`         |
| **Dvc** fields| -      | -    | For File activity events, device fields refer to the system on which the file activity occurred. |


> [!IMPORTANT]
> The `EventSchema` field is currently optional but will become Mandatory on September 1st 2022.
>

#### All common fields

Fields that appear in the table are common to all ASIM schemas. Any of the schema specific guidelines in this document overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For more information on each field, see to the [ASIM Common Fields](normalization-common-fields.md) article.

| **Class** | **Fields** |
| --------- | ---------- |
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br> - [EventStartTime](normalization-common-fields.md#eventstarttime)<br> - [EventEndTime](normalization-common-fields.md#eventendtime)<br> - [EventType](normalization-common-fields.md#eventtype)<br>- [EventResult](normalization-common-fields.md#eventresult)<br> - [EventProduct](normalization-common-fields.md#eventproduct)<br> - [EventVendor](normalization-common-fields.md#eventvendor)<br> - [EventSchema](normalization-common-fields.md#eventschema)<br> - [EventSchemaVersion](normalization-common-fields.md#eventschemaversion)<br> - [Dvc](normalization-common-fields.md#dvc)<br>|
| Recommended | - [EventResultDetails](normalization-common-fields.md#eventresultdetails)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br>- [EventUid](normalization-common-fields.md#eventuid)<br> - [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br> - [DvcHostname](normalization-common-fields.md#dvchostname)<br> - [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype)<br>- [DvcAction](normalization-common-fields.md#dvcaction)|
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br> - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails)<br> - [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity) <br> - [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventReportUrl](normalization-common-fields.md#eventreporturl)<br> - [EventOwner](normalization-common-fields.md#eventowner)<br>- [DvcZone](normalization-common-fields.md#dvczone)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)<br>- [DvcDescription](normalization-common-fields.md#dvcdescription)<br>- [DvcScopeId](normalization-common-fields.md#dvcscopeid)<br>- [DvcScope](normalization-common-fields.md#dvcscope)|

### Target file fields

The following fields represent information about the target file in a file operation. If the operation involves a single file, `FileCreate` for example, it is represented by the target file fields.

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
|**TargetFileCreationTime** | Optional|Date/Time |The time at which the target file was created. |
|**TargetFileDirectory** | Optional|String |The target file folder or location. This field should be similar to the [TargetFilePath](#targetfilepath) field, without the final element. <br><br>**Note**:  A parser can provide this value if the value available in the log source and does not need to be extracted from the full path.|
|**TargetFileExtension** |Optional |String | The target file extension.<br><br>**Note**:  A parser can provide this value if the value available in the log source and does not need to be extracted from the full path.|
| **TargetFileMimeType**|Optional | Enumerated| The Mime, or Media, type of the target file. Allowed values are listed in the [IANA Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml) repository.|
| <a name='targetfilename'></a>**TargetFileName**|Recommended |String |The name of the target file, without a path or a location, but with an extension if relevant. This field should be similar to the final element in the [TargetFilePath](#targetfilepath) field.|
|**FileName** |Alias | | Alias to the [TargetFileName](#targetfilename) field.|
|<a name="targetfilepath"></a>**TargetFilePath** | Mandatory| String| The full, normalized path of the target file, including the folder or location, the file name, and the extension. For more information, see [Path structure](#path-structure). <br><br>**Note**: If the record does not include folder or location information, store the filename only here. <br><br>Example: `C:\Windows\System32\notepad.exe`|
| **TargetFilePathType** | Mandatory|Enumerated | The type of [TargetFilePath](#targetfilepath). For more information, see [Path structure](#path-structure).	|
|**FilePath** |Alias | | Alias to the [TargetFilePath](#targetfilepath) field.|
| **TargetFileMD5**| Optional| MD5|The MD5 hash of the target file. <br><br>Example: `75a599802f1fa166cdadb360960b1dd0` |
| **TargetFileSHA1** |Optional |SHA1 |The SHA-1 hash of the target file. <br><br>Example:<br> `d55c5a4df19b46db8c54`<br>`c801c4665d3338acdab0`|
| **TargetFileSHA256** | Optional|SHA256 |The SHA-256 hash of the target file. <br><br>Example:<br> `e81bb824c4a09a811af17deae22f22dd`<br>`2e1ec8cbb00b22629d2899f7c68da274`  |
| **TargetFileSHA512**| Optional| SHA512|The SHA-512 hash of the source file. |
| **Hash** | Alias | |Alias to the best available Target File hash. |
| **HashType** | Recommended | String | The type of hash stored in the HASH alias field, allowed values are `MD5`, `SHA`, `SHA256`, `SHA512` and `IMPHASH`. Mandatory if `Hash` is populated. |  
| **TargetFileSize** |Optional | Long |The size of the target file in bytes. |

### Source file fields

The following fields represent information about the source file in a file operation that has both a source and a destination, such as copy. If the operation involves a single file, it is represented by the target file fields.

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
| **SrcFileCreationTime**|Optional |Date/Time |The time at which the source file was created. |
|**SrcFileDirectory** | Optional| String| The source file folder or location. This field should be similar to the [SrcFilePath](#srcfilepath) field, without the final element. <br><br>**Note**: A parser can provide this value if the value is available in the log source, and does not need to be extracted from the full path.|
| **SrcFileExtension**|Optional | String|The source file extension. <br><br>**Note**: A parser can provide this value the value is available in the log source, and does not need to be extracted from the full path.|
|**SrcFileMimeType** |Optional |Enumerated |	The Mime or Media type of the source file. Supported values are listed in the [IANA Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml) repository. |
|**SrcFileName** |Recommended |String | The name of the source file, without a path or a location, but with an extension if relevant. This field should be similar to the last element in the [SrcFilePath](#srcfilepath) field. |
| <a name="srcfilepath"></a>**SrcFilePath**| Recommended |String |The full, normalized path of the source file, including the folder or location, the file name, and the extension. <br><br>For more information, see [Path structure](#path-structure).<br><br>Example: `/etc/init.d/networking` |
|**SrcFilePathType** | Recommended | Enumerated| The type of [SrcFilePath](#srcfilepath). For more information, see [Path structure](#path-structure).|
|**SrcFileMD5**|Optional |MD5 |	The MD5 hash of the source file. <br><br>Example:           `75a599802f1fa166cdadb360960b1dd0` |
|**SrcFileSHA1**|Optional |SHA1 |The SHA-1 hash of the source file.<br><br>Example:<br>`d55c5a4df19b46db8c54`<br>`c801c4665d3338acdab0` |
|**SrcFileSHA256** | Optional|SHA256 |The SHA-256 hash of the source file. <br><br>Example:<br> `e81bb824c4a09a811af17deae22f22dd`<br>`2e1ec8cbb00b22629d2899f7c68da274`|
|**SrcFileSHA512** |Optional | SHA512|The SHA-512 hash of the source file. |
|**SrcFileSize**| Optional| Long | The size of the source file in bytes.|


### Actor fields

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
| <a name="actoruserid"></a>**ActorUserId**    | Recommended  | String     |   A machine-readable, alphanumeric, unique representation of the Actor. For the supported format for different ID types, refer to [the User entity](normalization-about-schemas.md#the-user-entity). <br><br>Example: `S-1-12` |
| **ActorScope** | Optional | String | The scope, such as Microsoft Entra tenant, in which [ActorUserId](#actoruserid) and [ActorUsername](#actorusername) are defined. or more information and list of allowed values, see [UserScope](normalization-about-schemas.md#userscope) in the [Schema Overview article](normalization-about-schemas.md).|
 **ActorScopeId** | Optional | String | The scope ID, such as Microsoft Entra Directory ID, in which [ActorUserId](#actoruserid) and [ActorUsername](#actorusername) are defined. or more information and list of allowed values, see [UserScopeId](normalization-about-schemas.md#userscopeid) in the [Schema Overview article](normalization-about-schemas.md).|
| **ActorUserIdType**| Conditional  | String     |  The type of the ID stored in the [ActorUserId](#actoruserid) field. For a list of allowed values and further information, refer to [UserIdType](normalization-about-schemas.md#useridtype) in the [Schema Overview article](normalization-about-schemas.md). |
| <a name="actorusername"></a>**ActorUsername**  | Mandatory    | String     | The Actor username, including domain information when available. For the supported format for different ID types, refer to [the User entity](normalization-about-schemas.md#the-user-entity). Use the simple form only if domain information isn't available.<br><br>Store the Username type in the [ActorUsernameType](#actorusernametype) field. If other username formats are available, store them in the fields `ActorUsername<UsernameType>`.<br><br>Example: `AlbertE`   |
|**User** | Alias| | Alias to the [ActorUsername](#actorusername) field. <br><br>Example: `CONTOSO\dadmin`|
| <a name="actorusernametype"></a>**ActorUsernameType**              | Conditional    | Enumerated |   Specifies the type of the user name stored in the [ActorUsername](#actorusername) field. For a list of allowed values and further information, refer to [UsernameType](normalization-about-schemas.md#usernametype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>Example: `Windows`       |
| **ActorSessionId** | Optional     | String     |   The unique ID of the login session of the Actor.  <br><br>Example: `999`<br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows this value must be numeric. <br><br>If you are using a Windows machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.   |
| **ActorUserType** | Optional | UserType | The type of Actor. For a list of allowed values and further information, refer to [UserType](normalization-about-schemas.md#usertype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>**Note**: The value might be provided in the source record by using different terms, which should be normalized to these values. Store the original value in the [ActorOriginalUserType](#actororiginalusertype) field. |
| <a name="actororiginalusertype"></a>**ActorOriginalUserType** | Optional | String | The original destination user type, if provided by the reporting device. |


### Acting process fields

| Field          | Class        | Type       | Description    |
|---------------|--------------|------------|-----------------|
| **ActingProcessCommandLine**       | Optional     | String     |   The command line used to run the acting process. <br><br>Example: `"choco.exe" -v`    |
| <a name='actingprocessname'></a>**ActingProcessName**              | Optional     | string     |   The name of the acting process. This name is commonly derived from the image or executable file that's used to define the initial code and data that's mapped into the process' virtual address space.<br><br>Example: `C:\Windows\explorer.exe`  |
|**Process**| Alias| | Alias to [ActingProcessName](#actingprocessname)|
| **ActingProcessId**| Optional    | String        | The process ID (PID) of the acting process.<br><br>Example:  `48610176`           <br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows and Linux this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.    |
| **ActingProcessGuid**              | Optional     | string     |  A generated unique identifier (GUID) of the acting process. Enables identifying the process across systems.  <br><br> Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00`            |

### Source system related fields

The following fields represent information about the system initiating the file activity, typically when carried over the network.

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
| <a name='srcipaddr'></a>**SrcIpAddr** |Recommended |IP Address | When the operation is initiated by a remote system, the IP address of this system.<br><br>Example: `185.175.35.214`|
| **IpAddr** | Alias | | Alias to [SrcIpAddr](#srcipaddr) | 
| **Src** | Alias | | Alias to [SrcIpAddr](#srcipaddr) | 
| **SrcPortNumber** | Optional | Integer | When the operation is initiated by a remote system, the port number from which the connection was initiated.<br><br>Example: `2335` |
| <a name="srchostname"></a> **SrcHostname** | Recommended | Hostname | The source device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field.<br><br>Example: `DESKTOP-1282V4D` |
|<a name="srcdomain"></a> **SrcDomain** | Recommended | String | The domain of the source device.<br><br>Example: `Contoso` |
| <a name="srcdomaintype"></a>**SrcDomainType** | Conditional | DomainType | The type of [SrcDomain](#srcdomain). For a list of allowed values and further information, refer to [DomainType](normalization-about-schemas.md#domaintype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>Required if [SrcDomain](#srcdomain) is used. |
| **SrcFQDN** | Optional | String | The source device hostname, including domain information when available. <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [SrcDomainType](#srcdomaintype) field reflects the format used. <br><br>Example: `Contoso\DESKTOP-1282V4D` |
| <a name = "srcdescription"></a>**SrcDescription** | Optional | String | A descriptive text associated with the device. For example: `Primary Domain Controller`. |
| <a name="srcdvcid"></a>**SrcDvcId** | Optional | String |  The ID of the source device. If multiple IDs are available, use the most important one, and store the others in the fields `SrcDvc<DvcIdType>`.<br><br>Example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| <a name="srcdvcscopeid"></a>**SrcDvcScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **SrcDvcScopeId** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="srcdvcscope"></a>**SrcDvcScope** | Optional | String | The cloud platform scope the device belongs to. **SrcDvcScope** map to a subscription ID on Azure and to an account ID on AWS. | 
| **SrcDvcIdType** | Conditional | DvcIdType | The type of [SrcDvcId](#srcdvcid). For a list of allowed values and further information, refer to [DvcIdType](normalization-about-schemas.md#dvcidtype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>**Note**: This field is required if [SrcDvcId](#srcdvcid) is used. |
| **SrcDeviceType** | Optional | DeviceType | The type of the source device. For a list of allowed values and further information, refer to [DeviceType](normalization-about-schemas.md#devicetype) in the [Schema Overview article](normalization-about-schemas.md). |
| <a name="srcsubscriptionid"></a>**SrcSubscriptionId** | Optional | String | The cloud platform subscription ID the source device belongs to. **SrcSubscriptionId** map to a subscription ID on Azure and to an account ID on AWS. |
| **SrcGeoCountry** | Optional | Country | The country associated with the source IP address.<br><br>Example: `USA` |
| **SrcGeoRegion** | Optional | Region | The region associated with the source IP address.<br><br>Example: `Vermont` |
| **SrcGeoCity** | Optional | City | The city associated with the source IP address.<br><br>Example: `Burlington` |
| **SrcGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the source IP address.<br><br>Example: `44.475833` |
| **SrcGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the source IP address.<br><br>Example: `73.211944` |

### Network related fields

The following fields represent information about the network session when the file activity was carried over the network.

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
|**HttpUserAgent** |Optional | String |When the operation is initiated by a remote system using HTTP or HTTPS, the user agent used.<br><br>For example:<br>`Mozilla/5.0 (Windows NT 10.0; Win64; x64)`<br>`AppleWebKit/537.36 (KHTML, like Gecko)`<br>` Chrome/42.0.2311.135`<br>`Safari/537.36 Edge/12.246`|
| **NetworkApplicationProtocol**| Optional|String | When the operation is initiated by a remote system, this value is the application layer protocol used in the OSI model. <br><br>While this field is not enumerated, and any value is accepted, preferable values include: `HTTP`, `HTTPS`, `SMB`,`FTP`, and `SSH`<br><br>Example: `SMB`|



### Target application fields

The following fields represent information about the destination application performing the file activity on behalf of the user. A destination application is usually related to over-the-network file activity, for example using Saas (Software as a service) applications.  

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="targetappname"></a>**TargetAppName** | Optional | String | The name of the destination application.<br><br>Example: `Facebook` |
| <a name="application"></a>**Application** | Alias | | Alias to [TargetAppName](#targetappname). |
| <a name="targetappid"></a>**TargetAppId** | Optional | String | The ID of the destination application, as reported by the reporting device. |
| <a name="targetapptype"></a>**TargetAppType** | Optional | AppType | The type of the destination application. For a list of allowed values and further information, refer to [AppType](normalization-about-schemas.md#apptype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>This field is mandatory if [TargetAppName](#targetappname) or [TargetAppId](#targetappid) are used. |
| <a name="targeturl"></a>**TargetUrl**| Optional | String| When the operation is initiated using HTTP or HTTPS, the URL used. <br><br>Example: `https://onedrive.live.com/?authkey=...` |
| **Url** | Alias | | Alias to [TargetUrl](#targeturl) |


### <a name="inspection-fields"></a>Inspection fields

The following fields are used to represent that inspection performed by a security system such an anti-virus system. The thread identified is usually associated with the file on which the activity was performed rather than the activity itself.

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| <a name="rulename"></a>**RuleName** | Optional | String | The name or ID of the rule by associated with the inspection results. |
| <a name="rulenumber"></a>**RuleNumber** | Optional | Integer | The number of the rule associated with the inspection results. |
| **Rule** | Conditional | String | Either the value of [kRuleName](#rulename) or the value of [RuleNumber](#rulenumber). If the value of [RuleNumber](#rulenumber) is used, the type should be converted to string. |
| **ThreatId** | Optional | String | The ID of the threat or malware identified in the file activity. |
| **ThreatName** | Optional | String | The name of the threat or malware identified in the file activity.<br><br>Example: `EICAR Test File` |
| **ThreatCategory** | Optional | String | The category of the threat or malware identified in the file activity.<br><br>Example: `Trojan` |
| **ThreatRiskLevel** | Optional | Integer | The risk level associated with the identified threat. The level should be a number between **0** and **100**.<br><br>**Note**: The value might be provided in the source record by using a different scale, which should be normalized to this scale. The original value should be stored in [ThreatRiskLevelOriginal](#threatoriginalrisklevel). |
| <a name="threatoriginalrisklevel"></a>**ThreatOriginalRiskLevel** | Optional | String | The risk level as reported by the reporting device. |
| **ThreatFilePath** | Optional | String | A file path for which a threat was identified. The field [ThreatField](#threatfield) contains the name of the field **ThreatFilePath** represents. |
| <a name="threatfield"></a>**ThreatField** | Optional | Enumerated | The field for which a threat was identified. The value is either `SrcFilePath` or `DstFilePath`. |
| **ThreatConfidence** | Optional | Integer | The confidence level of the threat identified, normalized to a value between 0 and a 100.| 
| **ThreatOriginalConfidence** | Optional | String |  The original confidence level of the threat identified, as reported by the reporting device.| 
| **ThreatIsActive** | Optional | Boolean | True if the threat identified is considered an active threat. | 
| **ThreatFirstReportedTime** | Optional | datetime | The first time the IP address or domain were identified as a threat.  | 
| **ThreatLastReportedTime** | Optional | datetime | The last time the IP address or domain were identified as a threat.| 


### Path structure

The path should be normalized to match one of the following formats. The format the value is normalized to will be reflected in the respective **FilePathType** field.

|Type  |Example  |Notes  |
|---------|---------|---------|
|**Windows Local**     |   `C:\Windows\System32\notepad.exe`      |      Since Windows path names are case insensitive, this type implies that the value is case insensitive.   |
|**Windows Share**     |      `\\Documents\My Shapes\Favorites.vssx`   | Since Windows path names are case insensitive, this type implies that the value is case insensitive.        |
|**Unix**     |  `/etc/init.d/networking`       |     Since Unix path names are case-sensitive, this type implies that the value is case-sensitive.  <br><br>- Use this type for AWS S3. Concatenate the bucket and key names to create the path. <br><br>- Use this type for Azure Blob storage object keys.   |
|**URL**     |  `https://1drv.ms/p/s!Av04S_*********we`       | Use when the file path is available as a URL. URLs are not limited to *http* or *https*, and any value, including an FTP value, is valid. |


## Schema updates

These are the changes in version 0.1.1 of the schema:
- Added the field `EventSchema`.

There are the changes in version 0.2 of the schema:
- Added [inspection fields](#inspection-fields).
- Added the fields `ActorScope`, `TargetUserScope`, `HashType`, `TargetAppName`, `TargetAppId`, `TargetAppType`, `SrcGeoCountry`, `SrcGeoRegion`, `SrcGeoLongitude`, `SrcGeoLatitude`, `ActorSessionId`, `DvcScopeId`, and `DvcScope`..
- Added the aliases `Url`, `IpAddr`, 'FileName', and `Src`.

There are the changes in version 0.2.1 of the schema:
- Added `Application` as an alias to `TargetAppName`.
- Added the field `ActorScopeId`
- Added source device related fields. 


## Next steps

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
