---
title: Supported events API types and titles - Microsoft Defender for IoT
description: Learn about the supported values for the type and title parameters used in the events API.
ms.date: 06/20/2022
ms.topic: reference
---

# Supported event types and titles


This article lists the supported values for event the event *type* and *title* parameters used in the [events (Retrieve timeline events)](sensor-alert-apis.md#events-retrieve-timeline-events) API.

## Event `type` and `title` reference

| Event type                                           | Event title                                          |
| ---------------------------------------------------- | ---------------------------------------------------- |
| DEVICE_CREATE                                        | Device Detected                                      |
| DEVICE_UPDATE                                        | Device Updated                                       |
| ALERT_REPORTED                                       | Alert Detected                                       |
| ALERT_UPDATED                                        | Alert Updated                                        |
| SCAN                                                 | Scan Device Detected                                 |
| PROGRAM_DEVICE                                       | PLC Programming                                      |
| MMS_PROGRAM_DEVICE                                   | PLC Program Update                                   |
| SCL_UPLOADED                                         | SCL Uploaded                                         |
| EXCLUSION_RULE_CREATED                               | Exclusion Rule Created                               |
| EXCLUSION_RULE_REMOVED                               | Exclusion Rule Removed                               |
| EXCLUSION_RULE_UPDATED                               | Exclusion Rule Updated                               |
| DEVICE_CONNECTION_CREATED                            | Device Connection Detected                           |
| USER_LOGIN                                           | User Login Attempt                                   |
| FILE_TRANSFER                                        | File Transfer Detected                               |
| CUSTOM_EVENT                                         | User Defined Event                                   |
| REMOTE_ACCESS                                        | Remote Access Connection Established                 |
| BACK_TO_NORMAL                                       | Back to Normal                                       |
| MMS_MEMORY_BLOCK_OPERATION                           | MMS Memory Block Operation                           |
| MMS_PROGRAM_OPERATION                                | MMS Program Operation                                |
| HTTP_BASIC_AUTHENTICATION                            | HTTP Basic Authentication                            |
| SIEMENS_S_7_MEMORY_BLOCK_OPERATION                   | Siemens S7 Memory Block Operation                    |
| SIEMENS_S_7_AUTHENTICATION                           | Siemens S7 Authentication                            |
| REPORT_CREATED                                       | Report Created                                       |
| SNMP_TRAP                                            | SNMP Trap detected                                   |
| DATABASE_ACTION                                      | Database Structure Manipulation                      |
| PLC_MODULE_CHANGE                                    | PLC Module Change                                    |
| FIRMWARE_UPDATE                                      | Firmware Update                                      |
| PLC_START                                            | PLC Start                                            |
| SRTP_PLC_RESET                                       | PLC Reset                                            |
| SRTP_PLC_COPY_FIRMWARE                               | Firmware Update                                      |
| SRTP_LOGIN_PROGRAMMING                               | PLC Programming Mode Set                             |
| SRTP_PLC_CHANGE_PASSWORD                             | PLC Password Change                                  |
| OPC_DATA_ACCESS_GROUP_MANAGEMENT_OPERATION           | OPC Data Access Group Management Operation           |
| OPC_DATA_ACCESS_ITEM_MANAGEMENT_OPERATION            | OPC Data Access Item Management Operation            |
| OPC_DATA_ACCESS_IO_SUBSCRIPTION_MANAGEMENT_OPERATION | OPC Data Access IO Subscription Management Operation |
| OPC_AE_EVENT_SUBSCRIPTION                            | OPC AE Event Subscription                            |
| OPC_AE_EVENT_CONDITION_MANAGEMENT_OPERATION          | OPC AE Event Condition Management Operation          |
| OPC_AE_EVENT                                         | OPC AE Event                                         |
| SRTP_CHANGE_PRIVILEGE                                | PLC Change access level                              |
| SRTP_CHANGE_LEVEL_FAILED                             | PLC Change access level failed                       |
| SUITELINK_INIT_CONNECTION                            | Wonderware session initialized                       |
| USER_OPERATION                                       | User Operation                                       |
| DIP_UPLOADED                                         | Data Intelligance Package Uploaded                   |
| FTP_AUTHENTICATION_FAILURE                           | FTP Authentication Failure                           |
| PROFINET_DPC_VALUE_SET                               | Profinet SET operation                               |
| S7PLUS_PLC_MODE_CHANGE                               | PLC Mode Change                                      |
| S7_PLC_MODE_CHANGE                                   | PLC Mode Change                                      |
| DELETE_DEVICE                                        | Device Deleted                                       |
| S7PLUS_PROGRAMMING                                   | PLC Programming                                      |
| FIRMWARE_CHANGED                                     | PLC Firmware Changed                                 |
| DELTAV_PROGRAMMING                                   | DeltaV Install Script                                |
| USER_DEFINED_RULE_CREATED                            | User Defined Rule Created                            |
| USER_DEFINED_RULE_EDITED                             | User Defined Rule Edited                             |
| USER_DEFINED_RULE_DELETED                            | User Defined Rule Deleted                            |
| USER_DEFINED_RULE_OPERATION                          | User Defined Rule Operation                          |
| REMOTE_PROCESS_EXECUTION                             | Remote Process Execution                             |
| DEVICE_UNIFICATION                                   | Device Updated                                       |
| NOTIFICATION                                         | Notification was resolved manually                   |
| ENIP_CONTROLLER_PROGRAM_DELETE                       | Controller Program Delete                            |
| ENIP_CONTROLLER_PROGRAM_RESET                        | Controller Program Reset                             |
| ENIP_CONTROLLER_GENERIC_RESET                        | Controller Reset                                     |
| ENIP_CONTROLLER_GENERIC_STOP                         | Controller Stop                                      |
| ENIP_CONTROLLER_GENERIC_START                        | Controller Start                                     |
| TELNET_AUTHENTICATION_FAILURE                        | Telnet Authentication Failure                        |
| CONFIGURATION_OF_CLEARTEXT_PASSWORD                  | Configuration Of Cleartext Password                  |
| CLEARTEXT_AUTHENTICATION                             | Cleartext Authentication                             |
| PROGRAM_UPLOAD_DEVICE                                | PLC Program Upload                                   |
| CONFIGURATION_CHANGE                                 | PLC Configuration Write                              |
| CONFIGURATION_READ                                   | PLC Configuration Read                               |
| SYSLOG_MSG                                           | Syslog Message                                       |
| INTERNET_ACCESS                                      | Internet Access                                      |
| CAMP_MEMORY_WRITE_OPERATION                          | Common ASCII Message Protocol Memory Write Operation |
| MUTED_ALERT                                          | Event Detected and Muted                             |
| DHCP_UPDATE                                          | Address Update                                      |
| DIP_FAILURE                                          | Data Intelligance Package Installation Failure       |
| DELETE_DEVICE_SCHEDULE                               | Inactive Devices Scheduled for deletion              |
| PLC_OPERATING_MODE_CHANGED                           | PLC Operating Mode Change Detected                   |
| HARDWARE_UPDATE_BY_IDENTIFIER                        | Address Update                                       |

## Next steps

Use the values listed in this article as event *type* and *title* values for the [events](sensor-alert-apis.md#events-retrieve-timeline-events) API.

For more information, see:

- [Defender for IoT API reference](../references-work-with-defender-for-iot-apis.md)
- [Alert management API reference for OT monitoring sensors](sensor-alert-apis.md)
