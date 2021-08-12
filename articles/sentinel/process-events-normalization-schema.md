---
title: Azure Sentinel Process Event normalization schema reference | Microsoft Docs
description: This article describes the Azure Sentinel Process Event normalization schema.
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 06/22/2021
ms.author: bagol

---

# Azure Sentinel Process Event normalization schema reference (Public preview)

The Process Event normalization schema is used to describe the operating system activity of executing and terminating a process. Such events are reported by operating systems as well as by security systems such as EDR (End Point Detection and Response) systems. A process, as defined by OSSEM, is a containment and management object that represents a running instance of a program. Note that processes do not run. Instead, processes manage threads that run and execute code.

For more information about normalization in Azure Sentinel, see [Normalization and the Azure Sentinel Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The Process Event normalization schema is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Parsers

Azure Sentinel provides the following built-in, product-specific process event parsers:

- **Security Events process creation (Event 4688)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Security Events process termination (Event 4689)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Sysmon process creation (Event 1)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Sysmon process termination (Event 5)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Microsoft 365 Defender for Endpoints process creation**

To use the source-agnostic parsers that unify all of listed parsers and ensure that you analyze across all the configured sources, use the following table names in your queries:

- **imProcessCreate**, for queries that require process creation information. This is the most common case.
- **imProcessTerminate** for queries that require process termination information.
- **imProcessEvents** for queries that require both process creation and termination information. In such cases, the `EventType` field enables you to distinguish between the events, and is set to `ProcessCreate` or `ProcessTerminate`, respectively. Process termination events generally include a lot less information than process creation events.

Deploy the [source-agnostic and source-specific parsers](normalization-about-parsers.md) from the [Azure Sentinel GitHub repository](https://aka.ms/AzSentinelProcessEvents).

## Add your own normalized parsers

When implementing custom parsers for the [Process Event](normalization-about-schemas.md#the-process-entity) information model, name your KQL functions using the following syntax: `imProcess<Type><vendor><Product>`, where `Type` is either `Create`, `Terminate`, or `Event` if the parser implements both creation and termination events.

Add your KQL function to the `imProcess<Type>` and `imProcess` source-agnostic parsers to ensure that any content using the [Process Event](normalization-about-schemas.md#the-process-entity) model also uses your new parser.

## Normalized content for process activity data

The following Azure Sentinel content works with any process activity that's normalized using the Azure Sentinel Information Model:

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


    For more information, see [Hunt for threats with Azure Sentinel](hunting.md).

## Schema details

The Process Event information model is aligned is the [OSSEM Process entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/process.md).

### Log Analytics fields

The following fields are generated by Log Analytics for each record, and can be overridden when creating a custom connector.

| Field         | Type     | Discussion      |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| <a name="timegenerated"></a>**TimeGenerated** | datetime | The time the event was generated by the reporting device.|
| **_ResourceId**   | guid     | The Azure Resource ID of the reporting device or service, or the log forwarder resource ID for events forwarded using Syslog, CEF or WEF. |
| | | |

> [!NOTE]
> Log Analytics also adds other fields that are less relevant to security use cases. For more information, see [Standard columns in Azure Monitor Logs](../azure-monitor/logs/log-standard-columns.md).
>

## Event fields

Event fields are common to all schemas and describe the activity itself and the reporting device.

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| **EventMessage**        | Optional    | String     |     A general message or description, either included in or generated from the record.   |
| **EventCount**          | Mandatory   | Integer    |     The number of events described by the record. <br><br>This value is used when the source supports aggregation, and a single record may represent multiple events. <br><br>For other sources, set to `1`.   |
| **EventStartTime**      | Mandatory   | Date/time  |      If the source supports aggregation and the record represents multiple events, this field specifies the time that the first event was generated. Otherwise, this field aliases the [TimeGenerated](#timegenerated) field. |
| **EventEndTime**        | Mandatory   | Alias      |      Alias to the [TimeGenerated](#timegenerated) field.    |
| **EventType**           | Mandatory   | Enumerated |    Describes the operation reported by the record. <br><br>For Process records, supported values include: <br>- `ProcessCreated` <br>- `ProcessTerminated` |
| **EventResult**         | Mandatory   | Enumerated |  Describes the result of the event, normalized to one of the following supported values: <br><br>- `Success`<br>- `Partial`<br>- `Failure`<br>- `NA` (not applicable) <br><br>The source may provide only a value for the **EventResultDetails** field, which must be analyzed to get the **EventResult** value.<br><br>Note that Process Events commonly report only success. |
| **EventOriginalUid**    | Optional    | String     |   A unique ID of the original record, if provided by the source.<br><br>Example: `69f37748-ddcd-4331-bf0f-b137f1ea83b`|
| **EventOriginalType**   | Optional    | String     |   The original event type or ID, if provided by the source.<br><br>Example: `4688`|
| <a name ="eventproduct"></a>**EventProduct**        | Mandatory   | String     |             The product generating the event. <br><br>Example: `Sysmon`<br><br>**Note**: This field may not be available in the source record. In such cases, this field must be set by the parser.           |
| **EventProductVersion** | Optional    | String     | The version of the product generating the event. <br><br>Example: `12.1`      |
| **EventVendor**         | Mandatory   | String     |           The vendor of the product generating the event. <br><br>Example: `Microsoft`  <br><br>**Note**: This field may not be available in the source record. In such cases, this field must be set by the parser.  |
| **EventSchemaVersion**  | Mandatory   | String     |    The version of the schema. The version of the schema documented here is `0.1`         |
| **EventReportUrl**      | Optional    | String     | A URL provided in the event for a resource that provides additional information about the event.|
| **Dvc** | Mandatory       | String     |                A unique identifier of the device on which the event occurred. <br><br>This field may alias the [DvcId](#dvcid), [DvcHostname](#dvchostname), or [DvcIpAddr](#dvcipaddr) fields. For cloud sources, for which there is no apparent device, use the same value as the [Event Product](#eventproduct) field.            |
| <a name ="dvcipaddr"></a>**DvcIpAddr**           | Recommended | IP Address |         The IP Address of the device on which the process event occurred.  <br><br>Example: `45.21.42.12`    |
| <a name ="dvchostname"></a>**DvcHostname**         | Recommended | Hostname   |               The hostname of the device on which the process event occurred. <br><br>Example: `ContosoDc.Contoso.Azure`               |
| <a name ="dvcid"></a>**DvcId**               | Optional    | String     |  The unique ID of the device on which the process event occurred. <br><br>Example: `41502da5-21b7-48ec-81c9-baeea8d7d669`   |
| **DvcMacAddr**          | Optional    | MAC        |   The MAC  of device on which the process event occurred.  <br><br>Example: `00:1B:44:11:3A:B7`       |
| **DvcOs**               | Optional    | String     |         The operating system running on the device on which the process event occurred.    <br><br>Example: `Windows`    |
| **DvcOsVersion**        | Optional    | String     |   The version of the operating system on the device on which the process event occurred. <br><br>Example: `10` |
| **AdditionalFields**    | Optional    | Dynamic    | If your source provides additional information worth preserving, either keep it with the original field names or create the dynamic **AdditionalFields** field, and add to it the extra information as key/value pairs.    |
| | | | |

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
| **ActingProcessId**| Mandatory    | int        | The process ID (PID) of the acting process.<br><br>Example:  `48610176`           <br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows and Linux this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.    |
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
| **ParentProcessId**| Mandatory    | integer    | The process ID (PID) of the parent process.   <br><br>     Example:  `48610176`    |
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
| | | | |



## Next steps

For more information, see:

- [Normalization in Azure Sentinel](normalization.md)
- [Azure Sentinel authentication normalization schema reference (Public preview)](authentication-normalization-schema.md)
- [Azure Sentinel DNS normalization schema reference](dns-normalization-schema.md)
- [Azure Sentinel file event normalization schema reference (Public preview)](file-event-normalization-schema.md)
- [Azure Sentinel network normalization schema reference](normalization-schema.md)
- [Azure Sentinel registry event normalization schema reference (Public preview)](registry-event-normalization-schema.md)
