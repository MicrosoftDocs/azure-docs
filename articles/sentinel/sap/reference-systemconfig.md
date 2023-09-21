---
title: Microsoft Sentinel solution for SAP® applications systemconfig.ini container configuration file reference
description: Description of settings available in systemconfig.ini file
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 06/03/2023
ms.custom: devx-track-extended-java
---

# Systemconfig.ini file reference

The *systemconfig.ini* file is used to configure behavior of the data collector. Configuration options are grouped into several sections. This article lists options available and provides an explanation to the options.

> [!IMPORTANT]
> Microsoft Sentinel solution for SAP® applications uses the new *[systemconfig.json file](reference-systemconfig-json.md)* from agent versions deployed on June 22 and later. For previous agent versions, you must still use the *systemconfig.ini* file. 
>
> If you update the agent version, the configuration file is automatically migrated. 

## Systemconfig configuration file sections

| Section name | Description |
| ------------ | ----------- |
| [Secrets Source](#secrets-source-section) | This section defines where credentials are stored. |
| [ABAP Central Instance](#abap-central-instance-section) | This section defines general options of the SAP instance to connect to. |
| [Azure Credentials](#azure-credentials-section) | This section defines credentials to connect to Azure Log Analytics. |
| [File Extraction ABAP](#file-extraction-abap-section) | This section defines logs and credentials that are extracted from ABAP server using SAPControl interface. |
| [File Extraction JAVA](#file-extraction-java-section) | This section defines logs and credentials that are extracted from JAVA server using SAPControl interface. |
| [Logs Activation Status](#logs-activation-status-section) | This section defines which logs are extracted from ABAP. |
| [Connector Configuration](#connector-configuration-section) | This section defines miscellaneous connector options. |
| [ABAP Table Selector](#abap-table-selector-section) | This section defines which User Master Data logs get extracted from the ABAP system. |

## Secrets Source section
```systemconfig.ini
secrets=AZURE_KEY_VAULT|DOCKER_FIXED
# Storage location of SAP credentials and Log Analytics workspace ID and key
# AZURE_KEY_VAULT - store in an Azure Key Vault. Requires keyvault option and intprefix option
# DOCKER_FIXED - store in systemconfig.ini file. Requires user, passwd, loganalyticswsid and publickey options

keyvault=<vaultname>
# Azure Keyvault name, in case secrets = AZURE_KEY_VAULT

intprefix=<prefix>
# intprefix - Prefix for variables created in Azure Key Vault
```

## ABAP Central Instance section
```systemconfig.ini
[ABAP Central Instance]
auth_type=PLAIN_USER_AND_PASSWORD|SNC_WITH_X509
# Authentication type - username/password authentication, or X.509 authentication

ashost=<hostname>
# FQDN, hostname, or IP address of the ABAP server

mshost=<hostname>
# FQDN, hostname, or IP address of the Message server

msserv=<portnumber>
# Port number, or service name (from /etc/services) of the message server

group=<logon group>
# Logon group of the message server

sysnr=<Instance number>
# Instance number of the ABAP server

sysid=<SID>
# System ID of the ABAP server

client=<Client Number>
# Client number of the ABAP server

user=<username>
# Username to use to connect to ABAP server. Used only when secrets setting in Secrets Source section is set to DOCKER_FIXED

passwd=<password>
# Password to use to connect to ABAP server. Used only when secrets setting in Secrets Source section is set to DOCKER_FIXED

snc_lib=<path to libsapcrypto>
# Full path, to the libsapcrypto.so
# Used when SNC is in use
# !!! Note: the path must be valid within the container!!!

snc_partnername=<distinguished name of the server certificate>
# p: -prefixed valid SAP server SNC name, which is equal to Distinguished Name(DN) of SAP server PSE
# Used when SNC is in use

snc_qop=<SNC protection level>
# More information available at https://docs.oracle.com/cd/E19509-01/820-5064/ggrpj/index.html
# Used when SNC is in use

snc_myname=<distinguished name of the client certificate>
# p: -prefixed valid client SNC name, which is equal to Distinguished Name(DN) of client PSE
# Used when SNC is in use

x509cert=<server certificate>
# Base64 encoded server certificate value in a single line (with leading ----BEGIN-CERTIFICATE--- and trailing ----END-CERTIFICATE---- removed)
```

## Azure Credentials section
```systemconfig.ini
[Azure Credentials]
loganalyticswsid=<workspace ID>
# Log Analytics workspace ID. Used only when secrets setting in Secrets Source section is set to DOCKER_FIXED

publickey=<publickey>
# Log Analytics workspace primary or secondary key. Used only when secrets setting in Secrets Source section is set to DOCKER_FIXED
```

## File Extraction ABAP section
```systemconfig.ini
[File Extraction ABAP]
osuser = <SAPControl username>
# Username to use to authenticate to SAPControl

ospasswd = <SAPControl password>
# Password to use to authenticate to SAPControl

appserver = <server>
#SAPControl server hostname/fqdn/IP address

instance = <instance>
#SAPControl instance name


abapseverity = <severity>
# 0 = All logs ; 1 = Warning ; 2 = Error

abaptz = <timezone>
# GMT FORMAT
# example - For OS Timezone = NZST (New Zealand Standard Time) use abaptz = GMT+12

```

## File Extraction JAVA section
```systemconfig.ini
[File Extraction JAVA]
javaosuser = <username>
# Username to use to authenticate to JAVA server

javaospasswd = <password>
# Password to use to authenticate to JAVA server

javaappserver = <server>
#JAVA server hostname/fqdn/IP address

javainstance = <instance number>
#JAVA instance number

javaseverity = <severity>
# 0 = All logs ; 1 = Warning ; 2 = Error

javatz = <timezone>
# GMT FORMAT
# example - For OS Timezone = NZST (New Zealand Standard Time) use abaptz = GMT+12
```

### Logs Activation Status section
```systemconfig.ini
[Logs Activation Status]
# The following logs are retrieved using RFC interface
# Specify True or False to configure whether log should be collected using the mentioned interface
ABAPAuditLog = <True/False>
ABAPJobLog = <True/False>
ABAPSpoolLog = <True/False>
ABAPSpoolOutputLog = <True/False>
ABAPChangeDocsLog = <True/False>
ABAPAppLog = <True/False>
ABAPWorkflowLog = <True/False>
ABAPCRLog = <True/False>
ABAPTableDataLog = <True/False>
# The following logs are retrieved using SAP Control interface and OS Login
ABAPFilesLogs = <True/False>
SysLog = <True/False>
ICM = <True/False>
WP = <True/False>
GW = <True/False>
# The following logs are retrieved using SAP Control interface and OS Login
JAVAFilesLogs = <True/False>
```

### Connector Configuration section
```systemconfig.ini
extractuseremail = <True/False>
apiretry = <True/False>
auditlogforcexal = <True/False>
auditlogforcelegacyfiles = <True/False>
azure_resource_id = <Azure _ResourceId>
# Used to force a specific resource group for the SAP tables in Log Analytics, useful for applying RBAC on SAP data
# example - /subscriptions/1234568-qwer-qwer-qwer-123456789/resourcegroups/RESOURCE_GROUP_NAME/providers/microsoft.compute/virtualmachines/VIRTUAL_MACHINE_NAME
# for more information - https://learn.microsoft.com/azure/azure-monitor/logs/log-standard-columns#_resourceid.

timechunk = <value>
# Default timechunk value is 60 (minutes). For certain tables, the data connector retrieves data from the ABAP server using timechunks (collecting all events that occurred within a certain timestamp). On busy systems this may result in large datasets, so to reduce memory and CPU utilization footprint, consider configuring to a smaller value.
```

### ABAP Table Selector section
```systemconfig.ini
[ABAP Table Selector]
# Specify True or False to configure whether table should be collected from the SAP system
AGR_TCODES_FULL = <True/False>
USR01_FULL = <True/False>
USR02_FULL = <True/False>
USR02_INCREMENTAL = <True/False>
AGR_1251_FULL = <True/False>
AGR_USERS_FULL = <True/False>
AGR_USERS_INCREMENTAL = <True/False>
AGR_PROF_FULL = <True/False>
UST04_FULL = <True/False>
USR21_FULL = <True/False>
ADR6_FULL = <True/False>
ADCP_FULL = <True/False>
USR05_FULL = <True/False>
USGRP_USER_FULL = <True/False>
USER_ADDR_FULL = <True/False>
DEVACCESS_FULL = <True/False>
AGR_DEFINE_FULL = <True/False>
AGR_DEFINE_INCREMENTAL = <True/False>
PAHI_FULL = <True/False>
AGR_AGRS_FULL = <True/False>
USRSTAMP_FULL = <True/False>
USRSTAMP_INCREMENTAL = <True/False>
SNCSYSACL_FULL = <True/False> (Preview)
USRACL_FULL = <True/False> (Preview)
```
## Next steps

Learn more about the Microsoft Sentinel solution for SAP® applications:

- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy the solution content from the content hub](deploy-sap-security-content.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Enable and configure SAP auditing](configure-audit.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Troubleshooting:

- [Troubleshoot your Microsoft Sentinel solution for SAP® applications solution deployment](sap-deploy-troubleshoot.md)

Reference files:

- [Microsoft Sentinel solution for SAP® applications data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Update script reference](reference-update.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).
