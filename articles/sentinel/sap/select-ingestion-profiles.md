---
title: Select the SAP ingestion profile for your Microsoft Sentinel for SAP solution
description: This article shows you how to select the profile for your Microsoft Sentinel for SAP solution.
author: kobymon
ms.author: kobymin
ms.topic: how-to
ms.custom: devx-track-extended-java
ms.date: 01/03/2023
---

# Select SAP ingestion profile

This article explains how to select the profile for your SAP solution. We recommend that you select an ingestion profile that maximizes your security coverage while meeting your budget requirements. 

Because SAP is a business application, and business processes tend to be seasonal, it may be difficult to predict the overall volume of logs over time. To address this issue, we recommend that you keep all logs on for two weeks, and learn from the observed activity. This learning can later be revised during business activity peaks, or major landscape transformations. 

The following sections show typical customer configuration profiles for SAP log ingestion.

### Default profile (recommended)

This profile includes complete coverage for:

- Built-in analytics
- The SAP user authorization master data tables, with users and privilege information
- The ability to track changes and activities on the SAP landscape. This profile provides more logging information to allow for post-breach investigations and extended hunting abilities.

### systemconfig.ini file

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

## Detection focused profile

This profile includes the core security logs of the SAP landscape required for the most of the analytics rules to perform well. Post-breach investigations and hunting capabilities are limited.

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

The SAP Security Audit Log is the most important source of data the Microsoft Sentinel solution for SAP® applications uses to analyze activities on the SAP landscape. Enabling this log is the minimal requirement to provide any security coverage.  

### systemconfig.ini file

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
## Next steps

Learn more about the Microsoft Sentinel solution for SAP® applications:

- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy the solution content from the content hub](deploy-sap-security-content.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md)
- [Enable and configure SAP auditing](configure-audit.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Troubleshooting:

- [Troubleshoot your Microsoft Sentinel solution for SAP® applications solution deployment](sap-deploy-troubleshoot.md)

Reference files:

- [Microsoft Sentinel solution for SAP® applications data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md)
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).
