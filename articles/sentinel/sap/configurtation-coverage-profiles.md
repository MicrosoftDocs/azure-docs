---
title: Selecting which logs to enable | Microsoft Docs
description: This article explains how to select the profile fot you SAP solution, there are three different profiles
author: oferinbar and kobymin
ms.author: oferinbar and kobymin
ms.topic: how-to
ms.date: 11/08/2022
---



# Select SAP ingestion profile
 
The following are typical customer configuration profiles for SAP log ingestion. Notably Microsoft is updating the below profiles from times to times.
 
### Recommended (default)
This profile includes complete coverage for the built-in analytics, the SAP user authorization master data tables with users and privileges information as well as the capability of tracking changes and activities on the SAP landscape. This mode provides additional logging to allow for post-breach investigations and extended hunting abilities.

#### systemconfig.ini for this profile
```systemconfig.ini
[Logs Activation Status]
# ABAP RFC Logs - Retrieved by using RFC interface
ABAPAuditLog = True
ABAPJobLog = True
ABAPSpoolLog = True
ABAPSpoolOutputLog = True
ABAPChangeDocsLog = True
ABAPAppLog = True
ABAPWorkflowLog = True
ABAPCRLog = True
ABAPTableDataLog = False
# ABAP SAP Control Logs - Retrieved by using SAP Conntrol interface and OS Login
ABAPFilesLogs = False
SysLog = False
ICM = False
WP = False
GW = False
# Java SAP Control Logs - Retrieved by using SAP Conntrol interface and OS Login
JAVAFilesLogs = False

[ABAP Table Selector]
AGR_TCODES_FULL = True
USR01_FULL = True
USR02_FULL = True
USR02_INCREMENTAL = True
AGR_1251_FULL = True
AGR_USERS_FULL = True
AGR_USERS_INCREMENTAL = True
AGR_PROF_FULL = True
UST04_FULL = True
USR21_FULL = True
ADR6_FULL = True
ADCP_FULL = True
USR05_FULL = True
USGRP_USER_FULL = True
USER_ADDR_FULL = True
DEVACCESS_FULL = True
AGR_DEFINE_FULL = True
AGR_DEFINE_INCREMENTAL = True
PAHI_FULL = True
AGR_AGRS_FULL = True
USRSTAMP_FULL = True
USRSTAMP_INCREMENTAL = True
AGR_FLAGS_FULL = True
AGR_FLAGS_INCREMENTAL = True
SNCSYSACL_FULL = False
USRACL_FULL = False
```

### Detection focused
This profile includes the core security logs of the SAP landscape required for the majority of the analytic rules to perform well. Post-breach investigations and hunting capabilities are limited.

#### systemconfig.ini for this profile
```systemconfig.ini
[Logs Activation Status]
# ABAP RFC Logs - Retrieved by using RFC interface
ABAPAuditLog = True
ABAPJobLog = False
ABAPSpoolLog = False
ABAPSpoolOutputLog = False
ABAPChangeDocsLog = False
ABAPAppLog = False
ABAPWorkflowLog = False
ABAPCRLog = False
ABAPTableDataLog = False
# ABAP SAP Control Logs - Retrieved by using SAP Conntrol interface and OS Login
ABAPFilesLogs = False
SysLog = False
ICM = False
WP = False
GW = False
# Java SAP Control Logs - Retrieved by using SAP Conntrol interface and OS Login
JAVAFilesLogs = False

[ABAP Table Selector]
AGR_TCODES_FULL = False
USR01_FULL = False
USR02_FULL = False
USR02_INCREMENTAL = False
AGR_1251_FULL = False
AGR_USERS_FULL = False
AGR_USERS_INCREMENTAL = False
AGR_PROF_FULL = False
UST04_FULL = False
USR21_FULL = False
ADR6_FULL = False
ADCP_FULL = False
USR05_FULL = False
USGRP_USER_FULL = False
USER_ADDR_FULL = False
DEVACCESS_FULL = False
AGR_DEFINE_FULL = False
AGR_DEFINE_INCREMENTAL = False
PAHI_FULL = False
AGR_AGRS_FULL = False
USRSTAMP_FULL = False
USRSTAMP_INCREMENTAL = False
AGR_FLAGS_FULL = False
AGR_FLAGS_INCREMENTAL = False
SNCSYSACL_FULL = False
USRACL_FULL = False
```
 
### Minimal
The SAP Security Audit Log is the most important source of data the Microsoft Sentinel Solution for SAP uses to analyze activities on the SAP landscape. Enabling this log is the minimal requirement to provide any security coverage.  
The above configuration profiles can be achived by setting the relevant logs using the systemconfig.ini file file.

#### systemconfig.ini for this profile
```systemconfig.ini
[Logs Activation Status]
# ABAP RFC Logs - Retrieved by using RFC interface
ABAPAuditLog = True
ABAPJobLog = False
ABAPSpoolLog = False
ABAPSpoolOutputLog = False
ABAPChangeDocsLog = True
ABAPAppLog = False
ABAPWorkflowLog = False
ABAPCRLog = True
ABAPTableDataLog = False
# ABAP SAP Control Logs - Retrieved by using SAP Conntrol interface and OS Login
ABAPFilesLogs = False
SysLog = False
ICM = False
WP = False
GW = False
# Java SAP Control Logs - Retrieved by using SAP Conntrol interface and OS Login
JAVAFilesLogs = False

[ABAP Table Selector]
AGR_TCODES_FULL = True
USR01_FULL = True
USR02_FULL = True
USR02_INCREMENTAL = True
AGR_1251_FULL = True
AGR_USERS_FULL = True
AGR_USERS_INCREMENTAL = True
AGR_PROF_FULL = True
UST04_FULL = True
USR21_FULL = True
ADR6_FULL = True
ADCP_FULL = True
USR05_FULL = True
USGRP_USER_FULL = True
USER_ADDR_FULL = True
DEVACCESS_FULL = True
AGR_DEFINE_FULL = True
AGR_DEFINE_INCREMENTAL = True
PAHI_FULL = False
AGR_AGRS_FULL = True
USRSTAMP_FULL = True
USRSTAMP_INCREMENTAL = True
AGR_FLAGS_FULL = True
AGR_FLAGS_INCREMENTAL = True
SNCSYSACL_FULL = False
USRACL_FULL = False
```
