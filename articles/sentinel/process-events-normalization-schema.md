---
title: The Advanced Security Information Model (ASIM) Process Event normalization schema reference (Public preview) | Microsoft Docs
description: This article describes the Microsoft Sentinel Process Event normalization schema.
author: oshezaf
ms.topic: reference
ms.date: 11/09/2021
ms.author: ofshezaf
ms.custom: ignite-fall-2021
---

# The Advanced Security Information Model (ASIM) Process Event normalization schema reference (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

The Process Event normalization schema is used to describe the operating system activity of running and terminating a process. Such events are reported by operating systems and security systems, such as EDR (End Point Detection and Response) systems.

A process, as defined by OSSEM, is a containment and management object that represents a running instance of a program. While processes themselves do not run, they do manage threads that run and execute code.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The Process Event normalization schema is currently in PREVIEW. This feature is provided without a service level agreement, and is not recommended for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Parsers

Microsoft Sentinel provides the following built-in, product-specific process event parsers:

- **Security Events process creation (Event 4688)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Security Events process termination (Event 4689)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Sysmon process creation (Event 1)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Sysmon process termination (Event 5)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Microsoft 365 Defender for Endpoint process creation**

To use the unifying parsers that unify all of listed parsers and ensure that you analyze across all the configured sources, use the following table names in your queries:

- **imProcessCreate**, for queries that require process creation information. These queries are the most common case.
- **imProcessTerminate** for queries that require process termination information.
- **imProcessEvents** for queries that require both process creation and termination information. In such cases, the `EventType` field enables you to distinguish between the events, and is set to `ProcessCreate` or `ProcessTerminate`, respectively. Process termination events generally include a lot less information than process creation events.

Deploy the [unifying and source-specific parsers](normalization-about-parsers.md) from the [Microsoft Sentinel GitHub repository](https://aka.ms/AzSentinelProcessEvents).

For more information, see [ASIM parsers overview](normalization-parsers-overview.md).

## Add your own normalized parsers

When implementing custom parsers for the [Process Event](normalization-about-schemas.md#the-process-entity) information model, name your KQL functions using the following syntax: `imProcess<Type><vendor><Product>`, where `Type` is either `Create`, `Terminate`, or `Event` if the parser implements both creation and termination events.

Add your KQL function to the `imProcess<Type>` and `imProcess` unifying parsers to ensure that any content using the [Process Event](normalization-about-schemas.md#the-process-entity) model also uses your new parser.

## Normalized content for process activity data

The following Microsoft Sentinel content works with any process activity that's normalized using the Advanced Security Information Model:

- **Analytics rules**:

   - [Probable AdFind Recon Tool Usage (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_AdFind_Usage.yaml)
   - [Base64 encoded Windows process command-lines (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_base64_encoded_pefile.yaml)
   - [Malware in the recycle bin (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_malware_in_recyclebin.yaml)
   - [NOBELIUM - suspicious rundll32.exe execution of vbscript (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_NOBELIUM_SuspiciousRundll32Exec.yaml)
   - [SUNBURST suspicious SolarWinds child processes (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_SolarWinds_SUNBURST_Process-IOCs.yaml)

   For more information, see [Create custom analytics rules to detect threats](detect-threats-custom.md).

- **Hunting queries**:
    - [Cscript script daily summary breakdown (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_cscript_summary.yaml)
    - [Enumeration of users and groups (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_enumeration_user_and_group.yaml)
    - [Exchange PowerShell Snapin Added (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_ExchangePowerShellSnapin.yaml)
    - [Host Exporting Mailbox and Removing Export (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_HostExportingMailboxAndRemovingExport.yaml)
    - [Invoke-PowerShellTcpOneLine Usage (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Invoke-PowerShellTcpOneLine.yaml)
    - [Nishang Reverse TCP Shell in Base64 (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_NishangReverseTCPShellBase64.yaml)
    - [Summary of users created using uncommon/undocumented commandline switches (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_persistence_create_account.yaml)
    - [Powercat Download (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_PowerCatDownload.yaml)
    - [PowerShell downloads (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_powershell_downloads.yaml)
    - [Entropy for Processes for a given Host (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_ProcessEntropy.yaml)
    - [SolarWinds Inventory (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_SolarWindsInventory.yaml)
    - [Suspicious enumeration using Adfind tool (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Suspicious_enumeration_using_adfind.yaml)
    - [Windows System Shutdown/Reboot (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Windows%20System%20Shutdown-Reboot(T1529).yaml)
    - [Certutil (LOLBins and LOLScripts, Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Certutil-LOLBins.yaml)
    - [Rundll32 (LOLBins and LOLScripts, Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/inProcess_SignedBinaryProxyExecutionRundll32.yaml)
    - [Uncommon processes    - bottom 5% (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_uncommon_processes.yaml)
    - [Unicode Obfuscation in Command Line](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/MultipleDataSources/UnicodeObfuscationInCommandLine.yaml)


    For more information, see [Hunt for threats with Microsoft Sentinel](hunting.md).

## Schema details

The Process Event information model is aligned to the [OSSEM Process entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/process.md).

### Common ASIM fields

> [!IMPORTANT]
> Fields common to all schemas are described in detail in the [ASIM Common Fields](normalization-common-fields.md) article.
>

#### Common fields with specific guidelines

The following list mentions fields that have specific guidelines for process activity events:

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| **EventType**           | Mandatory   | Enumerated |    Describes the operation reported by the record. <br><br>For Process records, supported values include: <br>- `ProcessCreated` <br>- `ProcessTerminated` |
| **EventSchemaVersion**  | Mandatory   | String     |    The version of the schema. The version of the schema documented here is `0.1`         |
| **EventSchema** | Optional | String | The name of the schema documented here is `ProcessEvent`. |
| **Dvc** fields|        |      | For process activity events, device fields refer to the system on which the process was executed. |


> [!IMPORTANT]
> The `EventSchema` field is currently optional but will become Mandatory on September 1st 2022.
>

#### All common fields

Fields that appear in the table below are common to all ASIM schemas. Any guideline specified above overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For further details on each field, refer to the [ASIM Common Fields](normalization-common-fields.md) article.

| **Class** | **Fields** |
| --------- | ---------- |
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br> - [EventStartTime](normalization-common-fields.md#eventstarttime)<br> - [EventEndTime](normalization-common-fields.md#eventendtime)<br> - [EventType](normalization-common-fields.md#eventtype)<br>- [EventResult](normalization-common-fields.md#eventresult)<br> - [EventProduct](normalization-common-fields.md#eventproduct)<br> - [EventVendor](normalization-common-fields.md#eventvendor)<br> - [EventSchema](normalization-common-fields.md#eventschema)<br> - [EventSchemaVersion](normalization-common-fields.md#eventschemaversion)<br> - [Dvc](normalization-common-fields.md#dvc)<br>|
| Recommended | - [EventResultDetails](normalization-common-fields.md#eventresultdetails)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br> - [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br> - [DvcHostname](normalization-common-fields.md#dvchostname)<br> - [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype)<br>- [DvcAction](normalization-common-fields.md#dvcaction)|
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br> - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails)<br> - [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity) <br> - [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventReportUrl](normalization-common-fields.md#eventreporturl)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)|



### Process Event-specific fields

The fields listed in the table below are specific to Process events, but are similar to fields in other schemas and follow similar naming conventions.

The process event schema references the following entities, which are central to process creation and termination activity:

- **Actor**. The user that initiated the process creation or termination.
- **ActingProcess**. The process used by the Actor to initiate the process creation or termination.
- **TargetProcess**. The new process.
- **TargetUser**. The user whose credentials are used to create the new process.
- **ParentProcess**. The process that initiated the Actor Process.

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
| **User**           | Alias        |            | Alias to the [TargetUsername](#targetusername). <br><br>Example: `CONTOSO\dadmin`     |
| **Process**        | Alias        |            | Alias to the [TargetProcessName](#targetprocessname) <br><br>Example: `C:\Windows\System32\rundll32.exe`|
| **CommandLine**    | Alias        |            |     Alias to [TargetProcessCommandLine](#targetprocesscommandline)  |
| **Hash**           | Alias        |            |       Alias to the best available hash. |
| <a name="actorusername"></a>**ActorUsername**  | Mandatory    | String     | The user name of the user who initiated the event. <br><br>Example: `CONTOSO\WIN-GG82ULGC9GO$`     |
| **ActorUsernameType**              | Mandatory    | Enumerated |   Specifies the type of the user name stored in the [ActorUsername](#actorusername) field. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity). <br><br>Example: `Windows`       |
| <a name="actoruserid"></a>**ActorUserId**    | Recommended  | String     |   A unique ID of the Actor. The specific ID depends on the system generating the event. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).  <br><br>Example: `S-1-5-18`    |
| **ActorUserIdType**| Recommended  | String     |  The type of the ID stored in the [ActorUserId](#actoruserid) field. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity). <br><br>Example: `SID`         |
| **ActorSessionId** | Optional     | String     |   The unique ID of the login session of the Actor.  <br><br>Example: `999`<br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows this value must be numeric. <br><br>If you are using a Windows machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.   |
| **ActingProcessCommandLine**       | Optional     | String     |   The command line used to run the acting process. <br><br>Example: `"choco.exe" -v`    |
| **ActingProcessName**              | Optional     | string     |   The name of the acting process. This name is commonly derived from the image or executable file that's used to define the initial code and data that's mapped into the process' virtual address space.<br><br>Example: `C:\Windows\explorer.exe`  |
| **ActingProcessFileCompany**       | Optional     | String     |           The company that created the acting process image file.  <br><br> Example: `Microsoft`    |
| **ActingProcessFileDescription**   | Optional     | String     |  The description embedded in the version information of the acting process image file. <br><br>Example:  `Notepad++ : a free (GPL) source code editor` |
| **ActingProcessFileProduct**       | Optional     | String     |The product name from the version information in the acting process image file. <br><br> Example: `Notepad++`           |
| **ActingProcessFileVersion**       | Optional     | String     |               The product version from the version information of the acting process image file. <br><br>Example: `7.9.5.0`   |
| **ActingProcessFileInternalName**  | Optional     | String     |      The product internal file name from the version information of the acting process image file. |
| **ActingProcessFileOriginalName** | Optional     | String     |The product original file name from the version information of the acting process image file.       <br><br> Example:  `Notepad++.exe` |
| **ActingProcessIsHidden**          | Optional     | Boolean    |      An indication of whether the acting process is in hidden mode.  |
| **ActingProcessInjectedAddress**   | Optional     | String     |      The memory address in which the responsible acting process is stored.           |
| **ActingProcessId**| Mandatory    | String        | The process ID (PID) of the acting process.<br><br>Example:  `48610176`           <br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows and Linux this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.    |
| **ActingProcessGuid**              | Optional     | string     |  A generated unique identifier (GUID) of the acting process. Enables identifying the process across systems.  <br><br> Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00`            |
| **ActingProcessIntegrityLevel**    | Optional     | String     |       Every process has an integrity level that is represented in its token. Integrity levels determine the process level of protection or access. <br><br> Windows defines the following integrity levels: **low**, **medium**, **high**, and **system**. Standard users receive a **medium** integrity level and elevated users receive a **high** integrity level. <br><br> For more information, see [Mandatory Integrity Control - Win32 apps](/windows/win32/secauthz/mandatory-integrity-control). |
| **ActingProcessMD5**               | Optional     | String     |The MD5 hash of the acting process image file.  <br><br>Example:  `75a599802f1fa166cdadb360960b1dd0`|
| **ActingProcessSHA1**              | Optional     | SHA1       | The SHA-1 hash of the acting process image file.             <br><br>  Example: `d55c5a4df19b46db8c54c801c4665d3338acdab0`  |
| **ActingProcessSHA256**            | Optional     | SHA256     | The SHA-256 hash of the acting process image file.    <br><br> Example: <br> `e81bb824c4a09a811af17deae22f22dd`<br>`2e1ec8cbb00b22629d2899f7c68da274`   |
| **ActingProcessSHA512**            | Optional     | SHA521     |       The SHA-512 hash of the acting process image file.       |
| **ActingProcessIMPHASH**           | Optional     | String     |       The Import Hash of all the library DLLs that are used by the acting process.    |
| **ActingProcessCreationTime**      | Optional     | DateTime   |       The date and time when the acting process was started. |
| **ActingProcessTokenElevation**    | Optional     | String     | A token indicating the presence or absence of User Access Control (UAC) privilege elevation applied to the acting process.   <br><br>Example:  `None`|
| **ActingProcessFileSize**          | Optional     | Long       |      The size of the file that ran the acting process.   |
| **ParentProcessName**              | Optional     | string     | The name of the parent process. This name is commonly derived from the image or executable file that's used to define the initial code and data that's mapped into the process' virtual address space.<br><br>Example: `C:\Windows\explorer.exe` |
| **ParentProcessFileCompany**       | Optional     | String     |The name of the company that created the parent process image file.            <br><br>    Example:  `Microsoft`   |
| **ParentProcessFileDescription**   | Optional     | String     |  The description from the version information in the parent process image file.    <br><br>Example: `Notepad++ : a free (GPL) source code editor`|
| **ParentProcessFileProduct**       | Optional     | String     |The product name from the version information in parent process image file.    <br><br>  Example:  `Notepad++`  |
| **ParentProcessFileVersion**       | Optional     | String     | The product version from the version information in parent process image file.    <br><br> Example:  `7.9.5.0` |
| **ParentProcessIsHidden**          | Optional     | Boolean    |   An indication of whether the parent process is in hidden mode.  |
| **ParentProcessInjectedAddress**   | Optional     | String     |    The memory address in which the responsible parent process is stored.           |
| **ParentProcessId**| Mandatory    | String    | The process ID (PID) of the parent process.   <br><br>     Example:  `48610176`    |
| **ParentProcessGuid**              | Optional     | String     |  A generated unique identifier (GUID) of the parent process.  Enables identifying the process across systems.    <br><br> Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00` |
| **ParentProcessIntegrityLevel**    | Optional     | String     |   Every process has an integrity level that is represented in its token. Integrity levels determine the process level of protection or access. <br><br> Windows defines the following integrity levels: **low**, **medium**, **high**, and **system**. Standard users receive a **medium** integrity level and elevated users receive a **high** integrity level. <br><br> For more information, see [Mandatory Integrity Control - Win32 apps](/windows/win32/secauthz/mandatory-integrity-control). |
| **ParentProcessMD5**               | Optional     | MD5        | The MD5 hash of the parent process image file.  <br><br>Example: `75a599802f1fa166cdadb360960b1dd0`|
| **ParentProcessSHA1**              | Optional     | SHA1       | The SHA-1 hash of the parent process image file.       <br><br> Example:  `d55c5a4df19b46db8c54c801c4665d3338acdab0`   |
| **ParentProcessSHA256**            | Optional     | SHA256     |The SHA-256 hash of the parent process image file.      <br><br>  Example: <br> `e81bb824c4a09a811af17deae22f22dd`<br>`2e1ec8cbb00b22629d2899f7c68da274` |
| **ParentProcessSHA512**            | Optional     | SHA512     |    The SHA-512 hash of the parent process image file.       |
| **ParentProcessIMPHASH**           | Optional     | String     |    The Import Hash of all the library DLLs that are used by the parent process.    |
| **ParentProcessTokenElevation**    | Optional     | String     |A token indicating the presence or absence of User Access Control (UAC) privilege elevation applied to the parent process.     <br><br>  Example: `None` |
| **ParentProcessCreationTime**      | Optional    | DateTime   |    The date and time when the parent process was started. |
| <a name="targetusername"></a>**TargetUsername** | Mandatory for process create events. | String     | The username of the target user.  <br><br>Example:   `CONTOSO\WIN-GG82ULGC9GO$`      |
| **TargetUsernameType**             | Mandatory for process create events.   | Enumerated | Specifies the type of the username stored in the [TargetUsername](#targetusername) field. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).          <br><br>  Example:  `Windows`        |
|<a name="targetuserid"></a> **TargetUserId**   | Recommended | String     | A unique ID of the target user. The specific ID depends on the system generating the event. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).            <br><br> Example: `S-1-5-18`    |
| **TargetUserIdType**               | Recommended | String     | The type of the user ID stored in the [TargetUserId](#targetuserid) field. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).            <br><br> Example:  `SID`  |
| **TargetUserSessionId**            | Optional     | String     |The unique ID of the target user's login session. <br><br>Example: `999`          <br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.     |
| <a name="targetprocessname"></a>**TargetProcessName**              | Mandatory    | string     |The name of the target process. This name is commonly derived from the image or executable file that's used to define the initial code and data that's mapped into the process' virtual address space.   <br><br>     Example:  `C:\Windows\explorer.exe`     |
| **TargetProcessFileCompany**       | Optional     | String     |The name of the company that created the target process image file.   <br><br>   Example:  `Microsoft` |
| **TargetProcessFileDescription**   | Optional     | String     | The description from the version information in the target process image file.   <br><br>Example:  `Notepad++ : a free (GPL) source code editor` |
| **TargetProcessFileProduct**       | Optional     | String     |The product name from the version information in target process image file.  <br><br>  Example: `Notepad++`  |
| **TargetProcessFileSize**          | Optional     | String     |    Size of the file that ran the process responsible for the event. |
| **TargetProcessFileVersion**       | Optional     | String     |The product version from the version information in the target process image file.   <br><br>  Example: `7.9.5.0` |
| **TargetProcessFileInternalName**  |    Optional          | String  |   The product internal file name from the version information of the image file of the target process. |
| **TargetProcessFileOriginalName** |       Optional       | String   |   The product original file name from the version information of the image file of the target process. |
| **TargetProcessIsHidden**          | Optional     | Boolean    |   An indication of whether the target process is in hidden mode.  |
| **TargetProcessInjectedAddress**   | Optional     | String     |    The memory address in which the responsible target process is stored.           |
| **TargetProcessMD5**               | Optional     | MD5        | The MD5 hash of the target process image file.   <br><br> Example:  `75a599802f1fa166cdadb360960b1dd0`|
| **TargetProcessSHA1**              | Optional     | SHA1       | The SHA-1 hash of the target process image file.       <br><br>  Example:  `d55c5a4df19b46db8c54c801c4665d3338acdab0`   |
| **TargetProcessSHA256**            | Optional     | SHA256     | The SHA-256 hash of the target process image file.      <br><br>  Example: <br> `e81bb824c4a09a811af17deae22f22dd`<br>`2e1ec8cbb00b22629d2899f7c68da274` |
| **TargetProcessSHA512**            | Optional     | SHA512     |   The SHA-512 hash of the target process image file.       |
| **TargetProcessIMPHASH**           | Optional     | String     |    The Import Hash of all the library DLLs that are used by the target process.    |
| <a name="targetprocesscommandline"></a> **TargetProcessCommandLine**       | Mandatory    | String     | The command line used to run the target process.   <br><br> Example:  `"choco.exe" -v`  |
| <a name="targetprocesscurrentdirectory"></a> **TargetProcessCurrentDirectory**       | Optional    | String     | The current directory in which the target process is executed.  <br><br> Example:  `c:\windows\system32`  |
| **TargetProcessCreationTime**      | Mandatory    | DateTime   |    The product version from the version information of the target process image file.   |
| **TargetProcessId**| Mandatory    | String     |  The process ID (PID) of the target process.     <br><br>Example: `48610176`<br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows and Linux this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.         |
| **TargetProcessGuid**              | Optional    | String     |A generated unique identifier (GUID) of the target process. Enables identifying the process across systems.   <br><br>  Example:  `EF3BD0BD-2B74-60C5-AF5C-010000001E00`  |
| **TargetProcessIntegrityLevel**    | Optional    | String     |   Every process has an integrity level that is represented in its token. Integrity levels determine the process level of protection or access. <br><br> Windows defines the following integrity levels: **low**, **medium**, **high**, and **system**. Standard users receive a **medium** integrity level and elevated users receive a **high** integrity level. <br><br> For more information, see [Mandatory Integrity Control - Win32 apps](/windows/win32/secauthz/mandatory-integrity-control). |
| **TargetProcessTokenElevation**    | Optional    | String     |Token type indicating the presence or absence of User Access Control (UAC) privilege elevation applied to the process that was created or terminated.   <br><br>    Example:  `None`     |


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
