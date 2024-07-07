---
title: Sample Microsoft Sentinel for SAP solution ingestion profile configurations
description: See sample ingestion profile configurations for the Microsoft Sentinel for SAP solution.
author: batamig
ms.author: bagol
ms.topic: reference
ms.custom: devx-track-extended-java
ms.date: 07/02/2024
---

# Sample Microsoft Sentinel for SAP solution ingestion profile configurations

<!--do we really need this entire file? I'd like to remove it. I'm sure it's not up to date?-->

Because SAP is a business application, and business processes tend to be seasonal, it may be difficult to predict the overall volume of logs over time. To address this issue, we recommend that you keep all logs on for two weeks, and learn from the observed activity. This learning can later be revised during business activity peaks, or major landscape transformations.

This article shows typical customer configuration profiles for SAP log ingestion. The ingestion profile is a set of configurations that define the logs to be collected from the SAP landscape. The profile is defined in the `systemconfig.json` or `systemconfig.ini` (legacy) file, which is used by the SAP data connector agent to collect logs from the SAP landscape.

:::image type="icon" source="media/deployment-steps/expert.png" border="false"::: Content in this article is intended for your SAP teams.

## Default ingestion profile (recommended)

<!--do we really need this? if it's the default, isn't it covered in the reference file?-->
This profile includes complete coverage for:

- Built-in analytics
- The SAP user authorization master data tables, with users and privilege information
- The ability to track changes and activities on the SAP landscape. This profile provides more logging information to allow for post-breach investigations and extended hunting abilities.

For the default ingestion profile, the `systemconfig` file is configured as follows:

```
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

## Detection-focused profile

This profile includes the core security logs of the SAP landscape required for the most of the analytics rules to perform well. Post-breach investigations and hunting capabilities are limited.

For a detection-focused profile, the `systemconfig` file is configured as follows:

### systemconfig.ini file

```
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

## Minimal profile

The SAP Security Audit Log is the most important source of data the Microsoft Sentinel solution for SAP applications uses to analyze activities on the SAP landscape. Enabling this log is the minimal requirement to provide any security coverage.

For a minimal ingestion profile, the `systemconfig` file is configured as follows:

```
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

## Related content

For more information, see:

- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Systemconfig.json file reference](reference-systemconfig-json.md)
- [Troubleshoot your Microsoft Sentinel solution for SAP applications solution deployment](sap-deploy-troubleshoot.md)
