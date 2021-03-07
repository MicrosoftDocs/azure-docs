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


|   CEF field name     |      CommonSecurityLog name      |        CEF description     |
| -------------------------- | -------------------------- |--------------------------- |
|       Device   Vendor        |         DeviceVendor    |                             |
|       Device   Product       |        DeviceProduct         |                        |
|       Device   Version       |        DeviceVersion         |                        |
|      DeviceEventClassID      |      DeviceEventClassID      |    Unique identifier per event-type      |
|      Name             |           Activity           |    A string representing a human-readable and understandable description of the event  |
|       Severity           |         LogSeverity          | The valid string values are Unknown, Low, Medium,   High, and Very-High. The valid integer values are 0-3=Low, 4-6=Medium, 7-   8=High, and 9-10=Very-High. |
|             act              |         DeviceAction         |        deviceAction - Action mentioned in event     |
|             app              |     ApplicationProtocol      |       Application Protocol            |
|             cnt              |          EventCount          |       Base   Event Count - A count associated with this event. How many times was this   same event observed?     |
|     destinationDnsDomain     |     DestinationDnsDomain     |  The DNS domain part of the complete fully qualified domain name (FQDN).   |
|    destinationServiceName    |    DestinationServiceName    |   The service which is targeted by   this event.   |
| destinationTranslatedAddress | DestinationTranslatedAddress |     Identifies the translated destination that the   event refers to in an IP network.   |
|  destinationTranslatedPort   |  DestinationTranslatedPort   |   Port after it was translated; for   example, a firewall. Valid port numbers are 0 to 65535 |
|       deviceDirection        |    CommunicationDirection    |   Any information about what direction the   communication that was observed has taken.    |
|       deviceDnsDomain        |       DeviceDnsDomain        |   The DNS domain part of the complete fully qualified domain name (FQDN).   |
|       deviceExternalId       |       DeviceExternalID       |     A name that uniquely identifies   the device generating this event  |
|        deviceFacility        |        DeviceFacility        |    The facility generating this event      |
|    deviceInboundInterface    |    DeviceInboundInterface |               |
|        deviceNtDomain        |        DeviceNtDomain        |   The Windows domain name of the   device address.     |   
|   deviceOutboundInterface    |   DeviceOutboundInterface |                |   
|       devicePayloadId        |       DevicePayloadId        |                                                                                                                                                             |   |   |
|      deviceProcessName       |         ProcessName          |                            Process name associated to the event. In UNIX,   the process generating the syslog entry for example                             |   |   |
|                              |                              |                                                                                                                                                             |   |   |
|   deviceTranslatedAddress    |   DeviceTranslatedAddress    |                   Identifies the translated device   address that the event refers to in an IP network. The format is an IPv4   address.                    |   |   |
|            dhost             |     DestinationHostName      |                                                                destination Host Name (FQDN)                                                                 |   |   |
|             dmac             |    DestinationMACAddress     |                                                                   destiantion Mac Address                                                                   |   |   |
|            dntdom            |     DestinationNTDomain      |                                          destination NT Domain - Windows domain name   of the destination address                                           |   |   |
|             dpid             |     DestinationProcessId     |                                                                                                                                                             |   |   |
|            dpriv             |  DestinationUserPrivileges   |                                Destination User Privileges - The allowed   values are: “Administrator”, “User”, and “Guest”.                                |   |   |
|            dproc             |    DestinationProcessName    |                                                                     destination Process                                                                     |   |   |
|                              |                              |                                                                                                                                                             |   |   |
|             dpt              |       DestinationPort        |                                                                      destiantion Port                                                                       |   |   |
|                              |                              |                                                                                                                                                             |   |   |
|             dst              |        DestinationIP         |                                                                 destination Address (IPv4)                                                                  |   |   |
|             dtz              |        DeviceTimeZone        |                                                                       deviceTimeZone                                                                        |   |   |
|             duid             |      DestinationUserID       |                                                                     destination UserId                                                                      |   |   |
|            duser             |     DestinationUserName      |                                                                    destination User Name                                                                    |   |   |
|             dvc              |        DeviceAddress         |                                                                    device Address (IPv4)                                                                    |   |   |
|           dvchost            |          DeviceName          |                                                                      device Host Name                                                                       |   |   |
|            dvcmac            |       DeviceMacAddress       |                                                                      deviceMacAddress                                                                       |   |   |
|            dvcpid            |          ProcessID           |                                                                       deviceProcessId                                                                       |   |   |
|             end              |           EndTime            |                                           End   Time - The time at which the activity related to the event ended                                            |   |   |
|                              |                              |                                                                                                                                                             |   |   |
|          externalId          |          ExternalID          |                             An ID used by the originating   device. Usually these are increasing numbers associated with events                             |   |   |
|        fileCreateTime        |        FileCreateTime        |                                                                                                                                                             |   |   |
|           fileHash           |           FileHash           |                                                                                                                                                             |   |   |
|            fileId            |            FileID            |                                                      An ID associated with a file could   be the inode                                                      |   |   |
|     fileModificationTime     |     FileModificationTime     |                                                                                                                                                             |   |   |
|           filePath           |           FilePath           |                                                                                                                                                             |   |   |
|        filePermission        |        FilePermission        |                                                                                                                                                             |   |   |
|           fileType           |           FileType           |                                                                                                                                                             |   |   |
|            fname             |           FileName           |                                                                          filename                                                                           |   |   |
|            fsize             |           FileSize           |                                                                          filesize                                                                           |   |   |
|              in              |        ReceivedBytes         |                                                      Bytes   In - Number of bytes transferred inbound.                                                      |   |   |
|                              |                              |                                                                                                                                                             |   |   |
|             msg              |           Message            |                                            Message - An arbitrary message giving more   details about the event                                             |   |   |
|      oldFileCreateTime       |      OldFileCreateTime       |                                                                                                                                                             |   |   |
|         oldFileHash          |         OldFileHash          |                                                                                                                                                             |   |   |
|          oldFileId           |          OldFileId           |                                                                                                                                                             |   |   |
|   oldFileModificationTime    |   OldFileModificationTime    |                                                                                                                                                             |   |   |
|         oldFileName          |         OldFileName          |                                                                                                                                                             |   |   |
|         oldFilePath          |         OldFilePath          |                                                                                                                                                             |   |   |
|      oldFilePermission       |      OldFilePermission       |                                                                                                                                                             |   |   |
|         oldFileSize          |         OldFileSize          |                                                                                                                                                             |   |   |
|         oldFileType          |         OldFileType          |                                                                                                                                                             |   |   |
|             out              |          SentBytes           |                                                     Bytes   Out - Number of bytes transferred outbound                                                      |   |   |
|                              |                              |                                                                                                                                                             |   |   |
|           Outcome            |           Outcome            |                                                                                                                                                             |   |   |
|            proto             |           Protocol           |                   Transport Protocol - Identifies the Layer-4   protocol used. The possible values are protocol names such as TCP or UDP.                   |   |   |
|            Reason            |            Reason            |                                   The reason an audit event was   generated. For example "Bad password" or "Unknown User"                                   |   |   |
|           request            |          RequestURL          |                                    Request URL - In the case of an HTTP   request, this field contains the URL accessed                                     |   |   |
|   requestClientApplication   |   RequestClientApplication   |                                                        The User-Agent associated with the   request                                                         |   |   |
|        requestContext        |        RequestContext        |                                                                                                                                                             |   |   |
|        requestCookies        |        RequestCookies        |                                                                                                                                                             |   |   |
|        requestMethod         |        RequestMethod         |                                           The method used to access a URL.   Possible values: “POST”, “GET”, ...                                            |   |   |
|              rt              |         ReceiptTime          |                                      Receipt   Time - The time at which the event related to the activity was received                                      |   |   |
|                              |                              |                                                                                                                                                             |   |   |
|            shost             |        SourceHostName        |                                                                   Source Host Name (FQDN)                                                                   |   |   |
|             smac             |       SourceMACAddress       |                                                                     Source Mac Address                                                                      |   |   |
|            sntdom            |        SourceNTDomain        |                                                                      Source NT Domain                                                                       |   |   |
|       sourceDnsDomain        |       SourceDnsDomain        |                                          The DNS domain part of the   complete fully qualified domain name (FQDN)                                           |   |   |
|      sourceServiceName       |      SourceServiceName       |                                                The service which is responsible   for generating this event                                                 |   |   |
|   sourceTranslatedAddress    |   SourceTranslatedAddress    |                                        Identifies the translated source   that the event refers to in an IP network                                         |   |   |
|     sourceTranslatedPort     |     SourceTranslatedPort     |                                                  Port after it was translated by   for example a firewall                                                   |   |   |
|             spid             |       SourceProcessId        |                                                                                                                                                             |   |   |
|            spriv             |     SourceUserPrivileges     |                                  Source User Privileges - The allowed values   are: “Administrator”, “User”, and “Guest”.                                   |   |   |
|            sproc             |      SourceProcessName       |                                                                                                                                                             |   |   |
|             spt              |          SourcePort          |                                                                         Source Port                                                                         |   |   |
|             src              |           SourceIP           |                                                                    Source Address (IPv4)                                                                    |   |   |
|            start             |          StartTime           |                                           Start Time - The time when the activity the   event referred to started                                           |   |   |
|             suid             |         SourceUserID         |                                                                       Source User Id                                                                        |   |   |
|            suser             |        SourceUserName        |                                                                      Source User Name                                                                       |   |   |
|             type             |          EventType           |           0 means base event, 1 means   aggregated, 2 means correlation, and 3 means action; this field can be   omitted for base events(type 0)            |   |   |
|           RemoteIP           |           RemoteIP           |                                                 Derived from the event if possible (from   direction value)                                                 |   |   |
|                              |                              |                                                                                                                                                             |   |   |
|                              |                              |                                                                                                                                                             |   |   |
|                              |          RemotePort          |                                                                                                                                                             |   |   |
|             Host             |           Computer           |                                                                    Host from the SysLog                                                                     |   |   |
|                              |    SimplifiedDeviceAction    |                                                  A mapped version of DeviceAction   (e.g. Denied -> Deny)                                                   |   |   |
|                              |     OriginalLogSeverity      |                                                            A non-mapped version of   LogSeverity                                                            |   |   |
## Next steps

For more information, see [Connect your external solution using Common Event Format](connect-common-event-format.md).
