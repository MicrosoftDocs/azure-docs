---
title: Microsoft Sentinel solution for SAP applications data connector agent systemconfig.ini file reference
description: Learn about the settings available in Microsoft Sentinel for SAP applications data connector agent systemconfig.ini file.
author: batamig
ms.author: bagol
ms.topic: reference
ms.date: 07/03/2024
ms.custom: devx-track-extended-java
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As an SAP BASIS team member using the legacy systemconfig.ini file, I want to understand the configuration options so that I can properly configure the data collector for SAP applications.

---

# Microsoft Sentinel solution for SAP applications data connector agent `systemconfig.ini` file reference

The *systemconfig.ini* file is the legacy file used to configure the behavior of the Microsoft Sentinel for SAP applications data connector agent in versions earlier than June 22, 2023. This article describes the options available in each section of the configuration file.

Content in this article is intended for your **SAP BASIS** teams. This article is not relevant if you've used the [recommended deployment procedure](deploy-data-connector-agent-container.md) from the portal. If you've installed a newer version of the agent from the command line, use the [Microsoft Sentinel solution for SAP applications `systemconfig.json` file reference](reference-systemconfig-json.md) instead.


## Systemconfig configuration file sections

The following table describes each overall section in the `systemconfig.ini` file:

| Section name | Description |
| ------------ | ----------- |
| [ABAP central instance](#abap-central-instance) | This section defines general options of the SAP instance to connect to. |
| [ABAP table selector](#abap-table-selector) | This section defines which user master data logs get extracted from the ABAP system. |
| [Azure credentials](#azure-credentials) | This section defines credentials to connect to Azure Log Analytics. |
| [Connector configuration](#connector-configuration) | This section defines miscellaneous connector options. |
| [File extraction ABAP](#file-extraction-abap) | This section defines logs and credentials that are extracted from ABAP server using SAPControl interface. |
| [File extraction JAVA](#file-extraction-java) | This section defines logs and credentials that are extracted from JAVA server using SAPControl interface. |
| [Logs activation status](#logs-activation-status) | This section defines which logs are extracted from ABAP. |
| [Secrets source](#secrets-source) | This section defines where credentials are stored. |

## ABAP central instance

```ini
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

## ABAP table selector

```ini
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

## Azure credentials

```ini
[Azure Credentials]
loganalyticswsid=<workspace ID>
# Log Analytics workspace ID. Used only when secrets setting in Secrets Source section is set to DOCKER_FIXED

publickey=<publickey>
# Log Analytics workspace primary or secondary key. Used only when secrets setting in Secrets Source section is set to DOCKER_FIXED
```

## Connector configuration

```ini
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

## File extraction ABAP

```ini
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

## File extraction JAVA

```ini
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

## Logs activation status

```ini
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

## Secrets source

```ini
secrets=AZURE_KEY_VAULT|DOCKER_FIXED
# Storage location of SAP credentials and Log Analytics workspace ID and key
# AZURE_KEY_VAULT - store in an Azure Key Vault. Requires keyvault option and intprefix option
# DOCKER_FIXED - store in systemconfig.ini file. Requires user, passwd, loganalyticswsid and publickey options

keyvault=<vaultname>
# Azure Keyvault name, in case secrets = AZURE_KEY_VAULT

intprefix=<prefix>
# intprefix - Prefix for variables created in Azure Key Vault
```

## Related content

For more information, see:

- [Connect your SAP system to Microsoft Sentinel](deploy-data-connector-agent-container.md)
- [Troubleshoot your Microsoft Sentinel solution for SAP applications solution deployment](sap-deploy-troubleshoot.md)
