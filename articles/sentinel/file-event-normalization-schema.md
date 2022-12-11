---
title: The Advanced Security Information Model (ASIM) File Event normalization schema reference (Public preview)| Microsoft Docs
description: This article describes the Microsoft Sentinel File Event normalization schema.
author: limwainstein
ms.topic: reference
ms.date: 11/09/2021
ms.author: lwainstein
ms.custom: ignite-fall-2021
---

# The Advanced Security Information Model (ASIM) File Event normalization schema reference (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

The File Event normalization schema is used to describe file activity such as creating, modifying, or deleting files or documents. Such events are reported by operating systems, file storage systems such as Azure Files, and document management systems such as Microsoft SharePoint.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The File Event normalization schema is currently in PREVIEW. This feature is provided without a service level agreement, and is not recommended for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Parsers

For the list of the file activity parsers Microsoft Sentinel provides out-of-the-box refer to the [ASIM parsers list](normalization-parsers-list.md#file-activity-parsers) 

To use the unifying parser that unifies all of the built-in parsers, and ensure that your analysis runs across all the configured sources, use imFileEvent as the table name in your query.

## Add your own normalized parsers

When implementing custom parsers for the File Event information model, name your KQL functions using the following syntax: `imFileEvent<vendor><Product`.

Add your KQL function to the `imFileEvent` unifying parser to ensure that any content using the File Event model also uses your new parser.

## Normalized content for file activity data

Support for the File Activity ASIM schema also includes support for the following built-in analytics rules with normalized file activity parsers. While links to the Microsoft Sentinel GitHub repository are provided below as a reference, you can also find these rules in the [Microsoft Sentinel Analytics rule gallery](detect-threats-built-in.md). Use the linked GitHub pages to copy any relevant hunting queries for the listed rules.


- [SUNBURST and SUPERNOVA backdoor hashes (Normalized File Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimFileEvent/imFileESolarWindsSunburstSupernova.yaml)
- [Exchange Server Vulnerabilities Disclosed March 2021 IoC Match](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ExchangeServerVulnerabilitiesMarch2021IoCs.yaml)
- [HAFNIUM UM Service writing suspicious file](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/HAFNIUMUmServiceSuspiciousFile.yaml)
- [NOBELIUM - Domain, Hash, and IP IOCs - May 2021](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/NOBELIUM_IOCsMay2021.yaml)
- [SUNSPOT log file creation ](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/SUNSPOTLogFile.yaml)
- [Known ZINC Comebacker and Klackring malware hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ZincJan272021IOCs.yaml)

For more information, see [Create custom analytics rules to detect threats](detect-threats-custom.md).


## Schema details

The File Event information model is aligned to the [OSSEM Process entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/file.md).

### Common fields

> [!IMPORTANT]
> Fields common to all schemas are described in detail in the [ASIM Common Fields](normalization-common-fields.md) article.
>

#### Fields with specific guidelines for the DNS schema

The following list mentions fields that have specific guidelines for File activity events:

| **Field** | **Class** | **Type**  | **Description** |
| --- | --- | --- | --- |
| **EventType**           | Mandatory   | Enumerated |    Describes the operation reported by the record. <br><br>For File records, supported values include: <br><br>- `FileAccessed`<br>- `FileCreated`<br>- `FileModified`<br>- `FileDeleted`<br>- `FileRenamed`<br>- `FileCopied`<br>- `FileMoved`<br>- `FolderCreated`<br>- `FolderDeleted` |
| **EventSchema** | Optional | String | The name of the schema documented here is **FileEvent**. |
| **EventSchemaVersion**  | Mandatory   | String     | The version of the schema. The version of the schema documented here is `0.1`         |
| **Dvc** fields| -      | -    | For File activity events, device fields refer to the system on which the file activity occurred. |


> [!IMPORTANT]
> The `EventSchema` field is currently optional but will become Mandatory on September 1st 2022.
>

#### All common fields

Fields that appear in the table below are common to all ASIM schemas. Any guideline specified above overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For further details on each field, refer to the [ASIM Common Fields](normalization-common-fields.md) article.

| **Class** | **Fields** |
| --------- | ---------- |
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br> - [EventStartTime](normalization-common-fields.md#eventstarttime)<br> - [EventEndTime](normalization-common-fields.md#eventendtime)<br> - [EventType](normalization-common-fields.md#eventtype)<br>- [EventResult](normalization-common-fields.md#eventresult)<br> - [EventProduct](normalization-common-fields.md#eventproduct)<br> - [EventVendor](normalization-common-fields.md#eventvendor)<br> - [EventSchema](normalization-common-fields.md#eventschema)<br> - [EventSchemaVersion](normalization-common-fields.md#eventschemaversion)<br> - [Dvc](normalization-common-fields.md#dvc)<br>|
| Recommended | - [EventResultDetails](normalization-common-fields.md#eventresultdetails)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br> - [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br> - [DvcHostname](normalization-common-fields.md#dvchostname)<br> - [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype)<br>- [DvcAction](normalization-common-fields.md#dvcaction)|
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br> - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails)<br> - [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity) <br> - [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventReportUrl](normalization-common-fields.md#eventreporturl)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)<br>- [DvcDescription](normalization-common-fields.md#dvcdescription)|



### File event specific fields

The fields listed in the table below are specific to File events, but are similar to fields in other schemas and follow similar naming conventions.

The File Event schema references the following entities, which are central to file activities:

- **Actor**. The user that initiated the file activity
- **ActingProcess**. The process used by the Actor to initiate the file activity
- **TargetFile**. The file on which the operation was performed
- **Source File (SrcFile)**. Stores file information prior to the operation.

The relationship between these entities is best demonstrated as follows: An **Actor** performs a file operation using an **Acting Process**, which modifies the **Source File** to **Target File**. 

For example: `JohnDoe` (**Actor**) uses `Windows File Explorer` (**Acting process**) to rename `new.doc` (**Source File**) to `old.doc` (**Target File**).

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
| **ActingProcessCommandLine** |Optional  |String  | The command line used to run the acting process. <br><br>Example: `"choco.exe" -v` |
|**ActingProcessGuid** |Optional     | String     |  A generated unique identifier (GUID) of the acting process. Enables identifying the process across systems.  <br><br> Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00`            |
| **ActingProcessId**| Mandatory    | String        | The process ID (PID) of the acting process.<br><br>Example:  `48610176`           <br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows and Linux this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.    |
| <a name="actingprocessname"></a>**ActingProcessName**              | Optional     | String     |   The name of the acting process. This name is commonly derived from the image or executable file that's used to define the initial code and data that's mapped into the process' virtual address space.<br><br>Example: `C:\Windows\explorer.exe`  |
|**Process**| Alias| | Alias to [ActingProcessName](#actingprocessname)|
| <a name="actoruserid"></a>**ActorUserId**    | Recommended  | String     |   A unique ID of the **Actor**. The specific ID depends on the system generating the event. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).  <br><br>Example: `S-1-5-18`    |
| **ActorUserIdType**| Recommended  | String     |  The type of the ID stored in the [ActorUserId](#actoruserid) field. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity). <br><br>Example: `SID`         |
| <a name="actorusername"></a>**ActorUsername**  | Mandatory    | String     | The user name of the user who initiated the event. <br><br>Example: `CONTOSO\WIN-GG82ULGC9GO$`     |
| **ActorUsernameType**              | Mandatory    | Enumerated |   Specifies the type of the user name stored in the [ActorUsername](#actorusername) field. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity). <br><br>Example: `Windows`       |
|**User** | Alias| | Alias to the [ActorUsername](#actorusername) field. <br><br>Example: `CONTOSO\dadmin`|
| **ActorUserType**|Optional | Enumerated| The type of **Actor**. Supported values include: <br><br>- `Regular`<br>- `Machine`<br>- `Admin`<br>- `System`<br>- `Application`<br>- `Service Principal`<br>- `Other` <br><br>**Note**: The source may provide only a value for the [ActorOriginalUserType](#actororiginalusertype) field, which must be analyzed to get the **ActorUserType** value.|
|<a name="actororiginalusertype"></a>**ActorOriginalUserType** |Optional |String | The **Actor** user type, as provided by the reporting device. |
|**HttpUserAgent** |Optional | String |When the operation is initiated by a remote system using HTTP or HTTPS, the user agent used.<br><br>For example:<br>`Mozilla/5.0 (Windows NT 10.0; Win64; x64)`<br>`AppleWebKit/537.36 (KHTML, like Gecko)`<br>` Chrome/42.0.2311.135`<br>`Safari/537.36 Edge/12.246`|
| **NetworkApplicationProtocol**| Optional|String | When the operation is initiated by a remote system, this value is the application layer protocol used in the OSI model. <br><br>While this field is not enumerated, and any value is accepted, preferable values include: `HTTP`, `HTTPS`, `SMB`,`FTP`, and `SSH`<br><br>Example: `SMB`|
|**SrcIpAddr** |Recommended |IP Address | When the operation is initiated by a remote system, the IP address of this system.<br><br>Example: `185.175.35.214`|
| **SrcFileCreationTime**|Optional |Date/Time |The time at which the source file was created. |
|**SrcFileDirectory** | Optional| String| The source file folder or location. This field should be similar to the [SrcFilePath](#srcfilepath) field, without the final element. <br><br>**Note**: A parser can provide this value if the value is available in the log source, and does not need to be extracted from the full path.|
| **SrcFileExtension**|Optional | String|The source file extension. <br><br>**Note**: A parser can provide this value the value is available in the log source, and does not need to be extracted from the full path.|
|**SrcFileMimeType** |Optional |Enumerated |	The Mime or Media type of the source file. Supported values are listed in the [IANA Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml) repository. |
|**SrcFileName** |Optional |String | The name of the source file, without a path or a location, but with an extension if relevant. This field should be similar to the last element in the [SrcFilePath](#srcfilepath) field. <br><br>**Note**: A parser can provide this value if the value available in the log source and does not need to be extracted from the full path.|
| <a name="srcfilepath"></a>**SrcFilePath**| Recommended |String |The full, normalized path of the source file, including the folder or location, the file name, and the extension. <br><br>For more information, see [Path structure](#path-structure).<br><br>Example: `/etc/init.d/networking` |
|**SrcFilePathType** | Recommended | Enumerated| The type of [SrcFilePath](#srcfilepath). For more information, see [Path structure](#path-structure).|
|**SrcFileMD5**|Optional |MD5 |	The MD5 hash of the source file. <br><br>Example:           `75a599802f1fa166cdadb360960b1dd0` |
|**SrcFileSHA1**|Optional |SHA1 |The SHA-1 hash of the source file.<br><br>Example:<br>`d55c5a4df19b46db8c54`<br>`c801c4665d3338acdab0` |
|**SrcFileSHA256** | Optional|SHA256 |The SHA-256 hash of the source file. <br><br>Example:<br> `e81bb824c4a09a811af17deae22f22dd`<br>`2e1ec8cbb00b22629d2899f7c68da274`|
|**SrcFileSHA512** |Optional | SHA512|The SHA-512 hash of the source file. |
|**SrcFileSize**| Optional|Integer | The size of the source file in bytes.|
|**TargetFileCreationTime** | Optional|Date/Time |The time at which the target file was created. |
|**TargetFileDirectory** | Optional|String |The target file folder or location. This field should be similar to the [TargetFilePath](#targetfilepath) field, without the final element. <br><br>**Note**:  A parser can provide this value if the value available in the log source and does not need to be extracted from the full path.|
|**TargetFileExtension** |Optional |String | The target file extension.<br><br>**Note**:  A parser can provide this value if the value available in the log source and does not need to be extracted from the full path.|
| **TargetFileMimeType**|Optional | Enumerated| The Mime, or Media, type of the target file. Allowed values are listed in the [IANA Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml) repository.|
| **TargetFileName**|Optional |String |The name of the target file, without a path or a location, but with an extension if relevant. This field should be similar to the final element in the [TargetFilePath](#targetfilepath) field.<br><br>**Note**:  A parser can provide this value if the value available in the log source and does not need to be extracted from the full path.|
|<a name="targetfilepath"></a>**TargetFilePath** | Mandatory| String| The full, normalized path of the target file, including the folder or location, the file name, and the extension. For more information, see [Path structure](#path-structure). <br><br>**Note**: If the record does not include folder or location information, store the filename only here. <br><br>Example: `C:\Windows\System32\notepad.exe`|
|**TargetFilePathType** | Mandatory|Enumerated | The type of [TargetFilePath](#targetfilepath). For more information, see [Path structure](#path-structure).	|
|**FilePath** |Alias | | Alias to the [TargetFilePath](#targetfilepath) field.|
| **TargetFileMD5**| Optional| MD5|The MD5 hash of the target file. <br><br>Example: `75a599802f1fa166cdadb360960b1dd0` |
|**TargetFileSHA1** |Optional |SHA1 |The SHA-1 hash of the target file. <br><br>Example:<br> `d55c5a4df19b46db8c54`<br>`c801c4665d3338acdab0`|
|**TargetFileSHA256** | Optional|SHA256 |The SHA-256 hash of the target file. <br><br>Example:<br> `e81bb824c4a09a811af17deae22f22dd`<br>`2e1ec8cbb00b22629d2899f7c68da274`  |
| **TargetFileSHA512**| Optional| SHA512|The SHA-512 hash of the source file. |
|**Hash**|Alias | |Alias to the best available Target File hash. |
|**TargetFileSize** |Optional | Integer|The size of the target file in bytes. |
| **TargetUrl**|Optional | String|When the operation is initiated using HTTP or HTTPS, the URL used. <br><br>Example: `https://onedrive.live.com/?authkey=...` |



## Path structure

The path should be normalized to match one of the following formats. The format the value is normalized to will be reflected in the respective **FilePathType** field.

|Type  |Example  |Notes  |
|---------|---------|---------|
|**Windows Local**     |   `C:\Windows\System32\notepad.exe`      |      Since Windows path names are case insensitive, this type implies that the value is case insensitive.   |
|**Windows Share**     |      `\\Documents\My Shapes\Favorites.vssx`   | Since Windows path names are case insensitive, this type implies that the value is case insensitive.        |
|**Unix**     |  `/etc/init.d/networking`       |     Since Unix path names are case-sensitive, this type implies that the value is case-sensitive.  <br><br>- Use this type for AWS S3. Concatenate the bucket and key names to create the path. <br><br>- Use this type for Azure Blob storage object keys.   |
|**URL**     |  `https://1drv.ms/p/s!Av04S_*********we`       | Use when the file path is available as a URL. URLs are not limited to *http* or *https*, and any value, including an FTP value, is valid. |


## Schema updates

These are the changes in version 0.1.1 of the schema:
- Added the field `EventSchema` - currently optional, but will become mandatory on Sep 1st, 2022.

## Next steps

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
