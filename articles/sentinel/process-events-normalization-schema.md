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

The Process Event normalization schema is used to describe the operating system activity of executing and terminating a process. Such events are reported by operating systems as well as by security systems such as EDR (End Point Detection and Response) systems.

For more information, see [Normalization and the Azure Sentinel Information Model (ASIM)](normalization.md).

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

To use the source-agnostic parsers that unify all of listed parsers and ensure that you analyze across all the configured sources, use the following table names:

- **imProcessCreate**, for queries that require process creation information. This is the most common case.
- **imProcessTerminate** for queries that require process termination information.
- **imProcessEvents** for queries that require both process creation and termination information. In such cases, the `EventType` field enables you to distinguish between the events, and is set to `ProcessCreate` or `ProcessTerminate`, respectively. Process termination events generally include a lot less information than process creation events.

Deploy the '[source-agnostic and source-specific parsers](normalization.md#parsers) from the [Azure Sentinel GitHub repository](https://aka.ms/AzSentinelProcess).

## Add your own normalized parsers

When implementing custom parsers for the [Process Event](normalization.md#the-process-entity) information model, name your KQL functions using the following syntax: `imProcess<Type><vendor><Product>`, where `Type` is either `Create`, `Terminate`, or `Event` if the parser implements both creation and termination events.

Add your KQL function to the `imProcess<Type>` and `imProcess` source-agnostic parsers to ensure that any content using the [Process Event](normalization.md#the-process-entity) model also uses your new parser.

## Normalized content for process activity data

The following Azure Sentinel content works with any process activity that's normalized using the Azure Sentinel Information Model:

- **Analytics rules**:

    - Probable AdFind Recon Tool Usage (Normalized Process Events)
    - Base64 encoded Windows process command-lines (Normalized Process Events)
    - Malware in the recycle bin (Normalized Process Events)
    - NOBELIUM - suspicious rundll32.exe execution of vbscript (Normalized Process Events)
    - SUNBURST suspicious SolarWinds child processes (Normalized Process Events)

    For more information, see [Automate incident handling in Azure Sentinel with automation rules](automate-incident-handling-with-automation-rules.md).

-	**Hunting queries**:
    - Cscript script daily summary breakdown (Normalized Process Events)
    - Enumeration of users and groups (Normalized Process Events)
    - Exchange PowerShell Snapin Added (Normalized Process Events)
    - Host Exporting Mailbox and Removing Export (Normalized Process Events)
    - Invoke-PowerShellTcpOneLine Usage (Normalized Process Events)
    - Nishang Reverse TCP Shell in Base64 (Normalized Process Events)
    - Summary of users created using uncommon/undocumented commandline switches (Normalized Process Events)
    - Powercat Download (Normalized Process Events)
    - PowerShell downloads (Normalized Process Events)
    - Entropy for Processes for a given Host (Normalized Process Events)
    - SolarWinds Inventory (Normalized Process Events)
    - Suspicious enumeration using Adfind tool (Normalized Process Events)
    - Uncommon processes - bottom 5% (Normalized Process Events)
    - Windows System Shutdown/Reboot (Normalized Process Events)
    - Certutil (LOLBins and LOLScripts, Normalized Process Events)
    - Rundll32 (LOLBins and LOLScripts, Normalized Process Events)

    For more information, see [Hunt for threats with Azure Sentinel](hunting.md).

## Schema details

The Process Event information model is aligned is the [OSSEM Process entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/process.md).

### Log Analytics fields

The following fields are generated by Log Analytics for each record, and can be overridden when creating a custom connector.

| Field         | Type     | Discussion      |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **TimeGenerated** | datetime | The time the event was generated by the reporting device.|
| **_ResourceId**   | guid     | The Azure Resource ID of the reporting device or service, or the log forwarder resource ID for events forwarded using Syslog, CEF or WEF. |
| | | |

> [!NOTE]
> Log Analytics also adds other fields that are less relevant to security use cases. For more information, see [Standard columns in Azure Monitor Logs](/azure/azure-monitor/logs/log-standard-columns).
>

## Event fields

Event fields are common to all schemas and describe the activity itself and the reporting device.

| Field               | Class       | Type       | Example | Description        |
|---------------------|-------------|------------|---------|--------------------|
| **EventMessage**        | Optional    | String     |     | A general message or description, either included in or generated from the record.   |
| **EventCount**          | Mandatory   | Integer    | `1`   | The number of events described by the record. <br><br>This value is used when the source supports aggregation, and a single record may represent multiple events. <br><br>For other sources, set to `1`.    |
| **EventStartTime**      | Mandatory   | Date/time  |     | If the source supports aggregation and the record represents multiple events, this field specifies the time the that first event was generated. Otherwise, this field aliases the `TimeGenerated` field. |
| **EventEndTime**        | Mandatory   | Alias      |     | Alias to the `TimeGenerated` field.    |
| **EventType**           | Mandatory   | Enumerated | `ProcessCreated`  | Describes the operation reported by the record. <br><br>For Process records, supported values include: <br>- `ProcessCreated` <br>- `ProcessTerminated` |
| **EventResult**         | Mandatory   | Enumerated | Success   | Describes the result of the event, normalized to one of the following supported values: <br><br>- `Success`<br>- `Partial`<br>- `Failure`<br>- `NA` (not applicable) <br><br>The source may provide only a value for the `EventResultDetails`, which must be analyzed to get the `EventResult` value. |
| **EventOriginalUid**    | Optional    | String     | `69f37748-ddcd-4331-bf0f-b137f1ea83b`  | A unique ID of the original record, if provided by the source.|
| **EventProduct**        | Mandatory   | String     | `Sysmon`               | The product generating the event. <br><br>**Note**: This field may not be available in the source record. In such cases, this field must be set by the parser.           |
| **EventProductVersion** | Optional    | String     | `12.1` | The version of the product generating the event.       |
| **EventVendor**         | Mandatory   | String     | `Microsoft`            | The vendor of the product generating the event. <br><br>**Note**: This field may not be available in the source record. In such cases, this field must be set by the parser.  |
| **EventSchemaVersion**  | Mandatory   | String     | `0.1`  | The version of the schema document here is `0.1`.         |
| **EventReportUrl**      | Optional    | String     | | A URL provided in the event for a resource that provides additional information about the event.|
| **Dvc** | Alias       | String     | `ContosoDc.Contoso.Azure`              | A unique identifier of the device on which the process event occurred. <br><br>This field also aliases the [**DvcId**](#dvcid), **[DvcHostname](#dvchostname)** or **DvcIp** fields.            |
| **DvcIpAddr**           | Recommended | IP Address | `45.21.42.12`          | The IP Address of the device on which the process event occurred.      |
| <a name ="dvchostname"></a>**DvcHostname**         | Recommended | Hostname   | `ContosoDc.Contoso.Azure`              | The hostname of the device on which the process event occurred.               |
| <a name ="dvcid"></a>**DvcId**               | Optional    | String     | `41502da5-21b7-48ec-81c9-baeea8d7d669` | The unique ID of the device on which the process event occurred.     |
| **DvcMacAddr**          | Optional    | MAC        |` 00:1B:44:11:3A:B7`    | The MAC  of device on which the process event occurred..         |
| **DvcOs**               | Optional    | String     | `Windows`              | The operating system running on the device on which the process event occurred.        |
| **DvcOsVersion**        | Optional    | String     | `10`   | The version of the operating system on the device on which the process event occurred. |
| **AdditionalFields**    | Optional    | Dynamic    | | If your source provides additional information worth preserving, either keep it with the original field names or create the dynamic `AdditionalFields` field, and add to it the extra information as key/value pairs.    |
| | | | | |

### Process Event specific fields

The fields listed in the table below are specific to Process events, but are similar to fields in other schemas and follow similar naming conventions.

The process event schema references the following entities, which are central to process creation and termination activity:

- **Actor**. The user that initiated the process creation or termination.
- **ActorProcess**. The process used by the Actor to initiate the process creation or termination.
- **TargetProcess**. The new process.
- **TargetUser**. The user whose credentials are used to create the new process.
- **ParentProcess**. The process that initiated the Actor Process.

| Field          | Class        | Type       | Description   |
|---------------|--------------|------------|-----------------|
| **User**           | Alias        |            | Example: `CONTOSO\ dadmin`<br><br>Alias to the [TargetUsername](#targetusername)     |
| **Process**        | Alias        |            | Example: `C:\Windows\System32\rundll32.exe`<br><br> Alias to the [TargetProcessName](#targetprocessname) |
| **CommandLine**    | Alias        |            |     Alias to [TargetProcessCommandLine](#targetprocesscommandline)  |
| **Hash**           | Alias        |            |       Alias to the best available hash |
| <a name="actorusername"></a>**ActorUsername**  | Mandatory    | String     | Example: `CONTOSO\ WIN-GG82ULGC9GO$` <br><br> The user name of the user who initiated the event    |
| **ActorUsernameType**              | Mandatory    | Enumerated | Example: `Windows`            <br><br>Specifies the type of the user name stored in [ActorUsername](#actorusername) field. For more information, see [The User entity](normalization.md#the-user-entity).        |
| <a name="actoruserid"></a>**ActorUserId**    | Recommended  | String     |Example: `S-1-5-18`          <br><br> A unique ID of the Actor. The specific ID depends on the system generating the event. For more information, see [The User entity](normalization.md#the-user-entity).      |
| **ActorUserIdType**| Recommended  | String     | Example: `SID` <br><br> The type of the ID stored in the [ActorUserId](#actoruserid) field. For more information, see [The User entity](normalization.md#the-user-entity).          |
| **ActorSessionId** | Optional     | String     | Example: `999`  <br><br> The unique ID of the login session of the Actor.  <br><br>**Note**: The type is defined as `string` to support varying systems, but on Windows this value must be numeric. <br>If you are using a Windows machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.   |
| **ActingProcessCommandLine**       | Optional     | String     | Example: `"choco.exe" -v`      <br><br> The command line used to run the acting process.     |
| **ActingProcessName**              | Optional     | string     | Example: `C:\Windows\explorer.exe`    <br><br> The file name of the acting process image file. This is usually considered the process name.    |
| **ActingProcessCompany**       | Optional     | String     | Example: `Microsoft`            <br><br> The company that created the acting process image file.      |
| **ActingProcessFileDescription**   | Optional     | String     |Example:  `Notepad++ : a free (GPL) source code editor`  <br><br> The description embedded in the version information of the acting process image file. |
| **ActingProcessFileProduct**       | Optional     | String     | Example: `Notepad++`          <br><br> The product name from the version information in the acting process image file. |
| **ActingProcessFileVersion**       | Optional     | String     | Example: `7.9.5.0`             <br><br> The product version from the version information of the acting process image file.   |
| **ActingProcessFileInternalName**  | Optional     | String     |      The product internal file name from the version information of the acting process image file. |
| **ActingProcessFileOriginallName** | Optional     | String     |Example:  `Notepad++.exe`       <br><br> The product original file name from the version information of the acting process image file. |
| **ActingProcessIsHidden**          | Optional     | Boolean    |      An indication of whether the acting process is in hidden mode.  |
| **ActingProcessInjectedAddress**   | Optional     | String     |      The memory address in which the responsible acting process is stored.           |
| **ActingProcessId**| Mandatory    | int        | `48610176`           <br><br>The process ID (PID) of the acting process.  <br><br>**Note**: The type is defined as `string` to support varying systems, but on Windows and Linux this value must be numeric. <br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.    |
| **ActingProcessGuid**              | Optional     | string     | Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00`           <br><br> A generated unique identifier (GUID) of the acting process.     |
| **ActingProcessIntegrityLevel**    | Optional     | String     |       The integrity level of the acting process. Windows assigns integrity levels to processes based on certain characteristics, such as if they were launched from an internet download. <br><br>Assigned integrity levels influence permissions to access resources. |
| **ActingProcessMD5**               | Optional     | String     |Example:  `75a599802f1fa166cdadb360960b1dd0` <br><br>The MD5 hash of the acting process image file. |
| **ActingProcessSHA1**              | Optional     | SHA1       | Example: `d55c5a4df19b46db8c54c801c4665d3338acdab0`        <br><br>The SHA-1 hash of the acting process image file.         |
| **ActingProcessSHA256**            | Optional     | SHA256     |Example:  `e81bb824c4a09a811af17deae22f22dd2e1ec8cbb00b22629d2899f7c68da274` <br><br> The SHA-256 hash of the acting process image file.       |
| **ActingProcessSHA512**            | Optional     | SHA521     |       The SHA-512 hash of the acting process image file.       |
| **ActingProcessIMPHASH**           | Optional     | String     |       The Import Hash of all the library DLLs that are used by the acting process.    |
| **ActingProcessCreationTime**      | Optional     | DateTime   |       The date and time when the acting process was started. |
| **ActingProcessTokenElevation**    | Optional     | String     |Example:  `None` <br><br> A token indicating the presence or absence of User Access Control (UAC) privilege elevation applied to the acting process.  |
| **ActingProcessFileSize**          | Optional     | Long       |      The size of the file that ran the acting process.   |
| **ParentProcessName**              | Optional     | string     | Example: `C:\Windows\explorer.exe`   <br><br> The file name of the parent process image file. This is considered the process name. |
| **ParentProcessCompany**       | Optional     | String     |Example:  `Microsoft`            <br><br> The name of the company that created the parent process image file.      |
| **ParentProcessFileDescription**   | Optional     | String     |  Example: `Notepad++ : a free (GPL) source code editor`  <br><br>The description from the version information in the parent process image file.  |
| **ParentProcessFileProduct**       | Optional     | String     |Example:  `Notepad++`  <br><br> The product name from the version information in parent process image file.     |
| **ParentProcessFileVersion**       | Optional     | String     |Example:  `7.9.5.0`    <br><br> The product version from the version information in parent process image file.  |
| **ParentProcessIsHidden**          | Optional     | Boolean    |   An indication of whether the parent process is in hidden mode.  |
| **ParentProcessInjectedAddress**   | Optional     | String     |    The memory address in which the responsible parent process is stored.           |
| **ParentProcessId**| Mandatory    | integer    |Example:  `48610176`  <br><br> The process ID (PID) of the parent process.          |
| **ParentProcessGuid**              | Optional     | String     | Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00`  <br><br> A generated unique identifier (GUID) of the parent process.     |
| **ParentProcessIntegrityLevel**    | Optional     | String     |   The integrity level of the parent process. Windows assigns integrity levels to processes based on certain characteristics, such as if they were launched from an internet download. <br><br>Assigned integrity levels influence permissions to access resources. |
| **ParentProcessMD5**               | Optional     | MD5        |Example: `75a599802f1fa166cdadb360960b1dd0`  <br><br> The MD5 hash of the parent process image file.|
| **ParentProcessSHA1**              | Optional     | SHA1       |Example:  `d55c5a4df19b46db8c54c801c4665d3338acdab0`  <br><br> The SHA-1 hash of the parent process image file.         |
| **ParentProcessSHA256**            | Optional     | SHA256     |Example:  `e81bb824c4a09a811af17deae22f22dd2e1ec8cbb00b22629d2899f7c68da274`  <br><br>The SHA-256 hash of the parent process image file.       |
| **ParentProcessSHA512**            | Optional     | SHA512     |    The SHA-512 hash of the parent process image file.       |
| **ParentProcessIMPHASH**           | Optional     | String     |    The Import Hash of all the library DLLs that are used by the parent process.    |
| **ParentProcessTokenElevation**    | Optional     | String     | Example: `None`    <br><br> A token indicating the presence or absence of User Access Control (UAC) privilege elevation applied to the parent process.  |
| **ParentProcessCreationTime**      | Optional    | DateTime   |    The date and time when the parent process was started. |
| <a name="targetusername"></a>**TargetUsername** | Mandatory for process create events. | String     |Example:   `CONTOSO\ WIN-GG82ULGC9GO$`       <br><br> The username of the target user. |
| **TargetUsernameType**             | Mandatory for process create events.   | Enumerated |Example:  `Windows`          <br><br> Specifies the type of the username stored in [TargetUsername](#targetusername) field. For more information, see [The User entity](normalization.md#the-user-entity).          |
|<a name="targetuserid"></a> **TargetUserId**   | Recommended | String     | Example: `S-1-5-18`           <br><br>A unique ID of the target user. The specific ID depends on the system generating the event. For more information, see [The User entity](normalization.md#the-user-entity).      |
| **TargetUserIdType**               | Recommended | String     |Example:  `SID`           <br><br> The type of the user ID stored in the [TargetUserId](#targetuserid) field. For more information, see [The User entity](normalization.md#the-user-entity).    |
| **TargetUserSessionId**            | Optional     | String     |Example: `999`          <br><br> The unique ID of the target user's login session.<br><br>**Note**: The type is defined as `string` to support varying systems, but on Windows this value must be numeric. <br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.     |
| <a name="targetprocessname"></a>**TargetProcessName**              | Mandatory    | string     |Example:  `C:\Windows\explorer.exe`  <br><br> The file name of the target process image file.          |
| **TargetProcessCompany**       | Optional     | String     |Example:  `Microsoft` <br><br>The name of the company that created the target process image file.      |
| **TargetProcessFileDescription**   | Optional     | String     |Example:  `Notepad++ : a free (GPL) source code editor`  <br><br> The description from the version information in the target process image file.  |
| **TargetProcessFileProduct**       | Optional     | String     |Example: `Notepad++`  <br><br>The product name from the version information in target process image file.     |
| **TargetProcessFileSize**          | Optional     | String     |    Size of the file that ran the process responsible for the event. |
| **TargetProcessFileVersion**       | Optional     | String     | Example: `7.9.5.0`   <br><br>The product version from the version information in the target process image file.  |
| **TargetProcessFileInternalName**  |    Optional          |         |   The product internal file name from the version information of the image file of the target process. |
| **TargetProcessFileOriginallName** |       Optional       |            |   The product original file name from the version information of the image file of the target process. |
| **TargetProcessIsHidden**          | Optional     | Boolean    |   An indication of whether the target process is in hidden mode.  |
| **TargetProcessInjectedAddress**   | Optional     | String     |    The memory address in which the responsible target process is stored.           |
| **TargetProcessMD5**               | Optional     | MD5        |Example:  `75a599802f1fa166cdadb360960b1dd0`   <br><br> The MD5 hash of the target process image file.|
| **TargetProcessSHA1**              | Optional     | SHA1       |Example:  `d55c5a4df19b46db8c54c801c4665d3338acdab0`   <br><br> The SHA-1 hash of the target process image file.         |
| **TargetProcessSHA256**            | Optional     | SHA256     |Example:  `e81bb824c4a09a811af17deae22f22dd2e1ec8cbb00b22629d2899f7c68da274`  <br><br> The SHA-256 hash of the target process image file.       |
| **TargetProcessSHA512**            | Optional     | SHA512     |   The SHA-512 hash of the target process image file.       |
| **TargetProcessIMPHASH**           | Optional     | String     |    The Import Hash of all the library DLLs that are used by the target process.    |
| <a name="targetprocesscommandline"></a> **TargetProcessCommandLine**       | Mandatory    | String     |Example:  `"choco.exe" -v` <br><br> The command line used to run the target process.     |
| **TargetProcessCreationTime**      | Mandatory    | DateTime   |    The product version from the version information of the target process image file.   |
| **TargetProcessId**| Mandatory    | String     | Example: `48610176`   <br><br> The process ID (PID) of the target process.  <br><br>**Note**: The type is defined as `string` to support varying systems, but on Windows and Linux this value must be numeric. <br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.         |
| **TargetProcessGuid**              | Optional    | String     |Example:  `EF3BD0BD-2B74-60C5-AF5C-010000001E00`  <br><br>A generated unique identifier (GUID) of the target process.     |
| **TargetProcessIntegrityLevel**    | Optional    | String     |    The integrity level of the target process. Windows assigns integrity levels to processes based on certain characteristics, such as if they were launched from an internet download. <br><br>Assigned integrity levels influence permissions to access resources. |
| **TargetProcessTokenElevation**    | Optional    | String     |Example:  `None`  <br><br>Token type indicating the presence or absence of User Access Control (UAC) privilege elevation applied to the process that was created or terminated.          |
| | | | |



## Next steps

For more information, see:

- [Normalization in Azure Sentinel](normalization.md)
- [Azure Sentinel data normalization schema reference](normalization-schema.md)
- [Azure Sentinel DNS normalization schema reference](dns-normalization-schema.md)

