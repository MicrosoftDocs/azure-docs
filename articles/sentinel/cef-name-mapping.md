---
title: CEF shortname and longname mapping
description: This article describes new features in Azure Sentinel from the past few months.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 02/22/2021
---

# CEF shortname and longname mapping

The following table maps Common Event Format (CEF) field names to the names they use in Azure Sentinel's CommonSecurityLog.

This mapping may be helpful when you are working with a CEF data source in Azure Sentinel. For more information, see [Connect your external solution using Common Event Format](connect-common-event-format.md).

[A - C](#a---c) | [D](#d) | [E - I](#e---i) | [M - P](#m---p) | [R - T](#r---t)

<!--are these case sensitive?-->

## A - C

|CEF field name  |CommonSecurityLog name  |Description  |
|---------|---------|---------|
| act    |    DeviceAction     |  The action mentioned in the event       |
|   app  |    ApplicationProtocol     |  The protocol used in the application <!--?-->       |
| cnt    |    EventCount     |  A count associated with the event, showing how many times the same event was observed.       |
| | | |

## D

|CEF field name  |CommonSecurityLog name  |Description  |
|---------|---------|---------|
|Device Vendor     |  DeviceVendor       |         |
|Device Product     |   DeviceProduct      |         |
|Device Version     |   DeviceVersion      |         |
|DeviceEventClassID     |   DeviceEventClassID     |   Unique identifier per event type      |
| destinationDnsDomain    | DestinationDnsDomain        |   The DNS part of the completely fully-qualified domain name (FQDN).      |
| destinationServiceName | DestinationServiceName | The service that is targed by the event. |
| destinationTranslatedAddress | DestinationTranslatedAddress | Identifies the translated destination referred to by the event in an IP network. |
| destinationTranslatedPort | DestinationTranslatedPort | Port, after translation, such as a firewall. <br>Valid port numbers: **0** - **65535** |
| deviceDirection | CommunicationDirection | Any information about the direction the observed communication has taken. | 
| deviceDnsDomain | DeviceDnsDomain | The DNS domain part of the full qualified domain name (FQDN) |
| deviceExternalID | DeviceExternalID | A name that uniquely identifies the device generating the event. |
| deviceFacility | DeviceFacility | The facility generating the event. |
| deviceInboundInterface | DeviceInboundInterface |  |
| deviceNtDomain | DeviceNtDomain | The Windows domain of the device address |
| deviceOutboundInterface | DeviceOutboundInterface | |
| devicePayloadId |DevicePayloadId | | 
| deviceProcessName | ProcessName | Process name associated with the event. <br><br>For example, in UNIX, the process generating the syslog entry. | 
| deviceTranslatedAddress | DeviceTranslatedAddress | Identifies the translated device address that the event refers to, in an IP network. <br><br>The format is an Ipv4 address. | 
| dhost |DestinationHostName | Destination host name (FQDN) |
| dmac | DestinationMacAddress | Destination MAC address (FQDN) |
| dntdom | DestinationNTDomain | Destination NT domain: the WIndows domain name of the destination address |
| dpid | DestinationProcessId | |
| dpriv | DestinationUserPrivileges | Destination user privileges. Valid values: **Admninistrator**, **User**, **Guest** |
| dproc | DestinationProcessName | Destination process |
| dpt | DestinationPort | Destination port |
| dst | DestinationIP | destination address (IPv4) |
| dtz | DeviceTimeZon | Time zone of the device generating the event |
| duid |DestinationUserId | Destination user ID |
| duser | DestinationUserName | Destination user name |
| dvc | DeviceAddress | IPv4 address of the device generating the event |
| dvchost | DeviceName | Host name of the device generating the event | 
| dvcmac | DeviceMacAddress | MAC address of the device generating the event |
| dvcpid | Process ID | Device process ID |

## E - I

|CEF field name  |CommonSecurityLog name  |Description  |
|---------|---------|---------|
|end     |  EndTime       | The time at which the activity related to the event ended.        |
|externalId    |   ExternalID      | An ID used by the originating device. Typically, these values have increasing values that are each associated with an event.        |
|fileCreateTime     |  FileCreateTime      |         |
|fileHash     |   FileHash      |         |
|fileId     |   FileID      |An ID associated with a file, such as the inode.         |
| fileModificationTime | FileModificationTime | | 
| filePath | FilePath | |
| filePermission |FilePermission | | 
| fileType | FileType | |
|fname | FileName| Filename |
| fsize | FileSize | File size |
|Host    |  Computer       | Host, from Syslog        |
|in     |  ReceivedBytes      |Number of bytes transferred inbound.         |
| | | |

## M - P

|CEF field name  |CommonSecurityLog name  |Description  |
|---------|---------|---------|
|msg   |  Message       | A message that gives more details about the event        |
|Name     |  Activity       |   A string that represents a human-readable and understandable description of the event      |
|oldFileCreateTime     |  OldFileCreateTime       |         |
|oldFileHash     |   OldFileHash      |         |
|oldFileId     |   OldFileId     |         |
| oldFileModificationTime | OldFileModificationTime | | 
| oldFileName |  OldFileName | |
| oldFilePath | OldFilePath | |
| oldFilePermission | OldFilePermission | | 
|oldFileSize | OldFileSize | |
| oldFileType | OldFileType | |
| out | SentBytes | Number of bytes transferred outbound |
| Outcome | Outcome | |
|proto    |  Protocol       | Transport protocol that identifies the Layer-4 protocol used. <br><br>Possible values include protocol names, such as **TCP** or **UDP**.        |
| | | |

## R - T

|CEF field name  |CommonSecurityLog name  |Description  |
|---------|---------|---------|
|Reason     |  Reason      |The reason an audit event was generated. <br><br>For example, **Bad password** or **Unknown user**.         |
|Request     |   RequestURL      | The URL accessed in the case of a HTTP request.         |
|requestClientApplication     |   RequestClientApplication      |   The user agent associated with the request.      |
| requestContext | RequestContext | |
| requestCookies | RequestCookies | | 
| requestMethod | RequestMethod | The method used to access a URL. <br><br>Valid values include methods such as **POST**, **GET**, and so on. |
| rt | ReceiptTime | The time at which the event related to the activity was received. | 
| RemoteIP | RemoteIP | Derived from the event's direction value, if possible. |
|Severity     |  LogSeverity       |  <!-- missing info, what does it mean?-->Valid string values: **Unknown** , **Low**, **Medium**, **High**, **Very-High** <br><br>Valid integer values are: **0**-**3** = Low, **4**-**6** = Medium, **7**-**8** = High, **9**-**10** = Very-High |
| shost    | SourceHostName        |Source host name (FQDN)         |
| |SimplifiedDeviceAction | A mapped version of [DeviceAction](#d-2), such as **Denied** > **Deny** |
| smac | SourceMacAddress | Source MAC address |
| sntdom | SourceNTDomain | Source NT Domain | 
| sourceDnsDomain | SourceDnsDomain | The DNS domain part of the complete FQDN | 
| sourceServiceName | SourceServiceName | The service responsible for generating the event. |
| sourceTranslatedAddress | SourceTranslatedAddress | Identifies the translated source that the event refers to, in an IP network. | sourceTranslatedPort | SourceTranslatedPort | Port after translation, such as a firewall. |
| spid | SourceProcessId | |
| spriv | SourceUserPrivileges | Source user privileges. <br><br>Valid values include: **Administrator**, **User**, **Guest** |
| sproc | SourceProcessName | | 
| spt | SourcePort | Source port |
| src | SourceIP |IPv4 source IP address |
| start | StartTime | The time when the activity that the event refers to started |
| suid | SourceUserID | Source User ID |
| type | EventType | Event type. Value values include: <br>- **0**: base event <br>- **1**: aggregated <br>- **2**: correlation event <br>- **3**: action event <br><br>**Note**: This event can be ommitted for base events. |
| | | |

## Unmapped fields

|CEF field name  |CommonSecurityLog name  |Description  |
|---------|---------|---------|
| |OriginalLogSeverity |A non-mapped version of LogSeverity |
| | RemotePort | |
| | | |

## Next steps

For more information, see [Connect your external solution using Common Event Format](connect-common-event-format.md).
