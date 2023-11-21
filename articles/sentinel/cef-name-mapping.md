---
title: Common Event Format (CEF) key and CommonSecurityLog field mapping
description: This article maps CEF keys to the corresponding field names in the CommonSecurityLog in Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 11/09/2021
ms.custom: ignite-fall-2021
---

# CEF and CommonSecurityLog field mapping

The following tables map Common Event Format (CEF) field names to the names they use in Microsoft Sentinel's CommonSecurityLog, and may be helpful when you are working with a CEF data source in Microsoft Sentinel.

For more information, see [Connect your external solution using Common Event Format](connect-common-event-format.md).

> [!IMPORTANT]
>
> On **February 28th 2023**, we introduced changes to the CommonSecurityLog table schema. Following this change, you might need to review and update custom queries. For more details, see the [recommended actions section](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/upcoming-changes-to-the-commonsecuritylog-table/ba-p/3643232) in this blog post. Out-of-the-box content (detections, hunting queries, workbooks, parsers, etc.) has been updated by Microsoft Sentinel.

> [!NOTE]
> A Microsoft Sentinel workspace is required in order to [ingest CEF data](connect-common-event-format.md#prerequisites) into Log Analytics.
>

## A - C

|CEF key name  |CommonSecurityLog field name  |Description  |
|---------|---------|---------|
| act    |    <a name="deviceaction"></a> DeviceAction     |  The action mentioned in the event.       |
|   app  |    ApplicationProtocol     |  The protocol used in the application, such as HTTP, HTTPS, SSHv2, Telnet, POP, IMPA, IMAPS, and so on.   |
| cat | DeviceEventCategory | Represents the category assigned by the originating device. Devices often use their own categorization schema to classify event. For example: `/Monitor/Disk/Read`. |
| cnt    |    EventCount     |  A count associated with the event, showing how many times the same event was observed.       |


## D

|CEF key name  |CommonSecurityLog name  |Description  |
|---------|---------|---------|
|Device Vendor     |  DeviceVendor       | String that, together with device product and version definitions, uniquely identifies the type of sending device.       |
|Device Product     |   DeviceProduct      |   String that, together with device vendor and version definitions, uniquely identifies the type of sending device.        |
|Device Version     |   DeviceVersion      |      String that, together with device product and vendor definitions, uniquely identifies the type of sending device.     |
| destinationDnsDomain    | DestinationDnsDomain        |   The DNS part of the fully qualified domain name (FQDN).      |
| destinationServiceName | DestinationServiceName | The service that is targeted by the event. For example, `sshd`.|
| destinationTranslatedAddress | DestinationTranslatedAddress | Identifies the translated destination referred to by the event in an IP network, as an IPv4 IP address. |
| destinationTranslatedPort | DestinationTranslatedPort | Port, after translation, such as a firewall. <br>Valid port numbers: `0` - `65535` |
| deviceDirection | <a name="communicationdirection"></a> CommunicationDirection | Any information about the direction the observed communication has taken. Valid values: <br>- `0` = Inbound <br>- `1` = Outbound |
| deviceDnsDomain | DeviceDnsDomain | The DNS domain part of the full qualified domain name (FQDN) |
|DeviceEventClassID     |   DeviceEventClassID     |   String or integer that serves as a unique identifier per event type.      |
| deviceExternalId | deviceExternalId | A name that uniquely identifies the device generating the event. |
| deviceFacility | DeviceFacility | The facility generating the event.|
| deviceInboundInterface | DeviceInboundInterface |The interface on which the packet or data entered the device.  |
| deviceNtDomain | DeviceNtDomain | The Windows domain of the device address |
| deviceOutboundInterface | DeviceOutboundInterface |Interface on which the packet or data left the device. |
| devicePayloadId |DevicePayloadId |Unique identifier for the payload associated with the event. |
| deviceProcessName | ProcessName | Process name associated with the event. <br><br>For example, in UNIX, the process generating the syslog entry. |
| deviceTranslatedAddress | DeviceTranslatedAddress | Identifies the translated device address that the event refers to, in an IP network. <br><br>The format is an Ipv4 address. |
| dhost |DestinationHostName | The destination that the event refers to in an IP network.  <br>The format should be an FQDN associated with the destination node, when a node is available. For example, `host.domain.com` or `host`. |
| dmac | DestinationMacAddress | The destination MAC address (FQDN) |
| dntdom | DestinationNTDomain | The Windows domain name of the destination address.|
| dpid | DestinationProcessId |The ID of the destination process associated with the event.|
| dpriv | DestinationUserPrivileges | Defines the destination use's privileges. <br>Valid values: `Admninistrator`, `User`, `Guest` |
| dproc | DestinationProcessName | The name of the event’s destination process, such as `telnetd` or `sshd.` |
| dpt | DestinationPort | Destination port. <br>Valid values: `*0` - `65535` |
| dst | DestinationIP | The destination IpV4 address that the event refers to in an IP network. |
| dtz | DeviceTimeZone | Timezone of the device generating the event |
| duid |DestinationUserId | Identifies the destination user by ID. |
| duser | DestinationUserName |Identifies the destination user by name.|
| dvc | DeviceAddress | The IPv4 address of the device generating the event. |
| dvchost | DeviceName | The FQDN associated with the device node, when a node is available. For example, `host.domain.com` or `host`.| 
| dvcmac | DeviceMacAddress | The MAC address of the device generating the event. |
| dvcpid | Process ID | Defines the ID of the process on the device generating the event. |

## E - I

|CEF key name  |CommonSecurityLog name  |Description  |
|---------|---------|---------|
|externalId    |   ExternalID      | An ID used by the originating device. Typically, these values have increasing values that are each associated with an event.        |
|fileCreateTime     |  FileCreateTime      | Time when the file was created.        |
|fileHash     |   FileHash      |   Hash of a file.      |
|fileId     |   FileID      |An ID associated with a file, such as the inode.         |
| fileModificationTime | FileModificationTime |Time when the file was last modified. |
| filePath | FilePath | Full path to the file, including the filename. For example: `C:\ProgramFiles\WindowsNT\Accessories\wordpad.exe` or `/usr/bin/zip`.|
| filePermission |FilePermission |The file's permissions. |
| fileType | FileType | File type, such as pipe, socket, and so on.|
|fname | FileName| The file's name, without the path. |
| fsize | FileSize | The size of the file. |
|Host    |  Computer       | Host, from Syslog        |
|in     |  ReceivedBytes      |Number of bytes transferred inbound.         |


## M - P

|CEF key name  |CommonSecurityLog name  |Description  |
|---------|---------|---------|
|msg   |  Message       | A message that gives more details about the event.        |
|Name     |  Activity       |   A string that represents a human-readable and understandable description of the event.     |
|oldFileCreateTime     |  OldFileCreateTime       | Time when the old file was created.        |
|oldFileHash     |   OldFileHash      |   Hash of the old file.      |
|oldFileId     |   OldFileId     |   And ID associated with the old file, such as the inode.      |
| oldFileModificationTime | OldFileModificationTime |Time when the old file was last modified. |
| oldFileName |  OldFileName |Name of the old file. |
| oldFilePath | OldFilePath | Full path to the old file, including the filename. <br>For example, `C:\ProgramFiles\WindowsNT\Accessories\wordpad.exe` or `/usr/bin/zip`.|
| oldFilePermission | OldFilePermission |Permissions of the old file. |
|oldFileSize | OldFileSize | Size of the old file.|
| oldFileType | OldFileType | File type of the old file, such as a pipe, socket, and so on.|
| out | SentBytes | Number of bytes transferred outbound. |
| outcome | EventOutcome | Outcome of the event, such as `success` or `failure`.|
|proto    |  Protocol       | Transport protocol that identifies the Layer-4 protocol used. <br><br>Possible values include protocol names, such as `TCP` or `UDP`.        |


## R - T

|CEF key name  |CommonSecurityLog name  |Description  |
|---------|---------|---------|
| reason | Reason | The reason an audit event was generated. For example `badd password` or `unknown user`. This could also be an error or return code. For example: `0x1234`. |
|Request     |   RequestURL      | The URL accessed for an HTTP request, including the protocol. For example, `http://www/secure.com`        |
|requestClientApplication     |   RequestClientApplication      |   The user agent associated with the request.      |
| requestContext | RequestContext | Describes the content from which the request originated, such as the HTTP Referrer. |
| requestCookies | RequestCookies |Cookies associated with the request. |
| requestMethod | RequestMethod | The method used to access a URL. <br><br>Valid values include methods such as `POST`, `GET`, and so on. |
| rt | ReceiptTime | The time at which the event related to the activity was received. |
|Severity     |  <a name="logseverity"></a> LogSeverity       |  A string or integer that describes the importance of the event.<br><br> Valid string values: `Unknown` , `Low`, `Medium`, `High`, `Very-High` <br><br>Valid integer values are:<br> - `0`-`3` = Low <br>- `4`-`6` = Medium<br>- `7`-`8` = High<br>- `9`-`10` = Very-High |
| shost    | SourceHostName        |Identifies the source that event refers to in an IP network. Format should be a fully qualified domain name (DQDN) associated with the source node, when a node is available. For example, `host` or `host.domain.com`. |
| smac | SourceMacAddress | Source MAC address. |
| sntdom | SourceNTDomain | The Windows domain name for the source address. |
| sourceDnsDomain | SourceDnsDomain | The DNS domain part of the complete FQDN. |
| sourceServiceName | SourceServiceName | The service responsible for generating the event. |
| sourceTranslatedAddress | SourceTranslatedAddress | Identifies the translated source that the event refers to in an IP network. |
| sourceTranslatedPort | SourceTranslatedPort | Source port after translation, such as a firewall. <br>Valid port numbers are `0` - `65535`. |
| spid | SourceProcessId | The ID of the source process associated with the event.|
| spriv | SourceUserPrivileges | The source user's privileges. <br><br>Valid values include: `Administrator`, `User`, `Guest` |
| sproc | SourceProcessName | The name of the event's source process.|
| spt | SourcePort | The source port number. <br>Valid port numbers are `0` - `65535`. |
| src | SourceIP |The source that an event refers to in an IP network, as an IPv4 address. |
| suid | SourceUserID | Identifies the source user by ID. |
| suser | SourceUserName | Identifies the source user by name. |
| type | EventType | Event type. Value values include: <br>- `0`: base event <br>- `1`: aggregated <br>- `2`: correlation event <br>- `3`: action event <br><br>**Note**: This event can be omitted for base events. |


## Custom fields

The following tables map the names of CEF keys and CommonSecurityLog fields that are available for customers to use for data that does not apply to any of the built-in fields.

### Custom IPv6 address fields

The following table maps CEF key and CommonSecurityLog names for the *IPv6* address fields available for custom data.

|CEF key name  |CommonSecurityLog name  |
|---------|---------|
|     c6a1    |     DeviceCustomIPv6Address1       |
|     c6a1Label    |     DeviceCustomIPv6Address1Label    |
|     c6a2    |     DeviceCustomIPv6Address2    |
|     c6a2Label    |     DeviceCustomIPv6Address2Label    |
|     c6a3    |     DeviceCustomIPv6Address3    |
|     c6a3Label    |     DeviceCustomIPv6Address3Label    |
|     c6a4    |     DeviceCustomIPv6Address4    |
|     c6a4Label    |     DeviceCustomIPv6Address4Label    |
|     cfp1    |     DeviceCustomFloatingPoint1    |
|     cfp1Label    |     deviceCustomFloatingPoint1Label    |
|     cfp2    |     DeviceCustomFloatingPoint2    |
|     cfp2Label    |     deviceCustomFloatingPoint2Label    |
|     cfp3    |     DeviceCustomFloatingPoint3    |
|     cfp3Label    |     deviceCustomFloatingPoint3Label    |
|     cfp4    |     DeviceCustomFloatingPoint4    |
|     cfp4Label    |     deviceCustomFloatingPoint4Label    |


### Custom number fields

The following table maps CEF key and CommonSecurityLog names for the *number* fields available for custom data.

|CEF key name  |CommonSecurityLog name  |
|---------|---------|
|     cn1    |     DeviceCustomNumber1       |
|     cn1Label    |     DeviceCustomNumber1Label       |
|     cn2    |     DeviceCustomNumber2       |
|     cn2Label    |     DeviceCustomNumber2Label       |
|     cn3    |     DeviceCustomNumber3       |
|     cn3Label    |     DeviceCustomNumber3Label       |


### Custom string fields

The following table maps CEF key and CommonSecurityLog names for the *string* fields available for custom data.

|CEF key name  |CommonSecurityLog name  |
|---------|---------|
|     cs1    |     DeviceCustomString1 <sup>[1](#use-sparingly)</sup>    |
|     cs1Label    |     DeviceCustomString1Label <sup>[1](#use-sparingly)</sup>    |
|     cs2    |     DeviceCustomString2 <sup>[1](#use-sparingly)</sup>   |
|     cs2Label    |     DeviceCustomString2Label   <sup>[1](#use-sparingly)</sup> |
|     cs3    |     DeviceCustomString3  <sup>[1](#use-sparingly)</sup>  |
|     cs3Label    |     DeviceCustomString3Label   <sup>[1](#use-sparingly)</sup> |
|     cs4    |     DeviceCustomString4   <sup>[1](#use-sparingly)</sup> |
|     cs4Label    |     DeviceCustomString4Label  <sup>[1](#use-sparingly)</sup>  |
|     cs5    |     DeviceCustomString5 <sup>[1](#use-sparingly)</sup>   |
|     cs5Label    |     DeviceCustomString5Label <sup>[1](#use-sparingly)</sup>    |
|     cs6    |     DeviceCustomString6   <sup>[1](#use-sparingly)</sup> |
|     cs6Label    |     DeviceCustomString6Label   <sup>[1](#use-sparingly)</sup> |
|     flexString1    |     FlexString1    |
|     flexString1Label    |     FlexString1Label    |
|     flexString2    |     FlexString2    |
|     flexString2Label    |     FlexString2Label    |


> [!TIP]
> <a name="use-sparingly"></a><sup>1</sup> We recommend that you use the **DeviceCustomString** fields sparingly and use more specific, built-in fields when possible.
> 

### Custom timestamp fields

The following table maps CEF key and CommonSecurityLog names for the *timestamp* fields available for custom data.

|CEF key name  |CommonSecurityLog name  |
|---------|---------|
|     deviceCustomDate1    |     DeviceCustomDate1    |
|     deviceCustomDate1Label    |     DeviceCustomDate1Label    |
|     deviceCustomDate2       |     DeviceCustomDate2    |
|     deviceCustomDate2Label    |     DeviceCustomDate2Label    |
|     flexDate1    |     FlexDate1    |
|     flexDate1Label    |     FlexDate1Label    |


### Custom integer data fields

The following table maps CEF key and CommonSecurityLog names for the *integer* fields available for custom data.

|CEF key name  |CommonSecurityLog name  |
|---------|---------|
|     flexNumber1    |     FlexNumber1    |
|     flexNumber1Label    |     FlexNumber1Label    |
|     flexNumber2    |     FlexNumber2    |
|     flexNumber2Label    |     FlexNumber2Label    |


## Enrichment fields

The following **CommonSecurityLog** fields are added by Microsoft Sentinel to enrich the original events received from the source devices, and don't have mappings in CEF keys:

### Threat intelligence fields

|CommonSecurityLog field name  |Description  |
|---------|---------|
|   **IndicatorThreatType**  |  The [MaliciousIP](#MaliciousIP) threat type, according to the threat intelligence feed.       |
| <a name="MaliciousIP"></a>**MaliciousIP** | Lists any IP addresses in the message that correlates with the current threat intelligence feed. |
|  **MaliciousIPCountry**   | The [MaliciousIP](#MaliciousIP) country/region, according to the geographic information at the time of the record ingestion.        |
| **MaliciousIPLatitude**    |   The [MaliciousIP](#MaliciousIP) longitude, according to the geographic information at the time of the record ingestion.      |
| **MaliciousIPLongitude**    |  The [MaliciousIP](#MaliciousIP) longitude, according to the geographic information at the time of the record ingestion.       |
| **ReportReferenceLink**    |    Link to the threat intelligence report.     |
|  **ThreatConfidence**   |   The [MaliciousIP](#MaliciousIP) threat confidence, according to the threat intelligence feed.      |
| **ThreatDescription**    |   The [MaliciousIP](#MaliciousIP) threat description, according to the threat intelligence feed.      |
| **ThreatSeverity** | The threat severity for the [MaliciousIP](#MaliciousIP), according to the threat intelligence feed at the time of the record ingestion. |


### Additional enrichment fields

|CommonSecurityLog field name  |Description  |
|---------|---------|
|**OriginalLogSeverity**     |  Always empty, supported for integration with CiscoASA. <br>For details about log severity values, see the [LogSeverity](#logseverity) field.       |
|**RemoteIP**     |     The remote IP address. <br>This value is based on [CommunicationDirection](#communicationdirection) field, if possible.     |
|**RemotePort**     |   The remote port. <br>This value is based on [CommunicationDirection](#communicationdirection) field, if possible.      |
|**SimplifiedDeviceAction**     |   Simplifies the [DeviceAction](#deviceaction) value to a static set of values, while keeping the original value in the [DeviceAction](#deviceaction) field. <br>For example:  `Denied` > `Deny`.      |
|**SourceSystem**     | Always defined as **OpsManager**.        |


## Next steps

For more information, see [Connect your external solution using Common Event Format](connect-common-event-format.md).
