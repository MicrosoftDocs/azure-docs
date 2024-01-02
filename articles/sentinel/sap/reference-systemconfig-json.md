---
title: Microsoft Sentinel solution for SAP® applications systemconfig.json container configuration file reference
description: Description of settings available in systemconfig.json file
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.custom: devx-track-extended-java
ms.date: 06/03/2023
---
# Systemconfig.json file reference

The *systemconfig.json* file is used to configure behavior of the data collector. Configuration options are grouped into several sections. This article lists options available and provides an explanation to the options.

> [!IMPORTANT]
> Microsoft Sentinel solution for SAP® applications uses the new *systemconfig.json* file from agent versions deployed on June 22 and later. For previous agent versions, you must still use the *[systemconfig.ini file](reference-systemconfig.md)*.

## File structure

```json
{ 

"<SID_GUID>": { 

    "secrets_source": {...},

    "abap_central_instance": {...},

    "azure_credentials": {...},

    "file_extraction_abap": {...},

    "file_extraction_java": {...},

    "logs_activation_status" {...},

    "connector_configuration": {...},

    "abap_table_selector":: {...}

...

}
```

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

> [!NOTE]
> Remove all comments before you use this file for configuration and deployment.

```json
"secrets_source": {
  "secrets": "AZURE_KEY_VAULT|DOCKER_FIXED",
  # Storage location of SAP credentials and Log Analytics workspace ID and key
  # AZURE_KEY_VAULT - store in an Azure Key Vault. Requires keyvault option and intprefix option
  # DOCKER_FIXED - store in systemconfig.ini file. Requires user, passwd, loganalyticswsid and publickey options

  "keyvault": "<vaultname>",
  # Azure Keyvault name, in case secrets = AZURE_KEY_VAULT

  "intprefix": "<prefix>"
  # intprefix - Prefix for variables created in Azure Key Vault

    },
```

## ABAP Central Instance section

> [!NOTE]
> Remove all comments before you use this file for configuration and deployment.

```json
"abap_central_instance": {
      "auth_type": "PLAIN_USER_AND_PASSWORD|SNC_WITH_X509",
      # Authentication type - username/password authentication, or X.509 authentication

      "ashost": "<hostname>",
      # FQDN, hostname, or IP address of the ABAP server

      "mshost": "<hostname>",
      # FQDN, hostname, or IP address of the Message server

      "msserv": "<portnumber>",
      # Port number, or service name (from /etc/services) of the message server

      "group": "<logon group>",
      # Logon group of the message server

      "sysnr": "<Instance number>",
      # Instance number of the ABAP server

      "sysid": "<SID>",
      # System ID of the ABAP server

      "client": "<Client Number>",
      # Client number of the ABAP server

      "user": "<username>",
      # Username to use to connect to ABAP server. Used only when secrets setting in Secrets Source section is set to DOCKER_FIXED

      "passwd": "<password>",
      # Password to use to connect to ABAP server. Used only when secrets setting in Secrets Source section is set to DOCKER_FIXED

      "snc_lib": "<path to libsapcrypto>",
      # Full path, to the libsapcrypto.so
      # Used when SNC is in use
      # !!! Note - the path must be valid within the container.

      "snc_partnername": "<distinguished name of the server certificate>",
      # p: -prefixed valid SAP server SNC name, which is equal to Distinguished Name(DN) of SAP server PSE
      # Used when SNC is in use

      "snc_qop": "<SNC protection level>",
      # More information available at docs.oracle.com/cd/E19509-01/820-5064/ggrpj/index.html
      # Used when SNC is in use

      "snc_myname": "<distinguished name of the client certificate>",
      # p: -prefixed valid client SNC name, which is equal to Distinguished Name(DN) of client PSE
      # Used when SNC is in use

      "x509cert": "<server certificate>"
      # Base64 encoded server certificate value in a single line (with leading ----BEGIN-CERTIFICATE--- and trailing ----END-CERTIFICATE---- removed)
    },
```

## Azure Credentials section

> [!NOTE]
> Remove all comments before you use this file for configuration and deployment.

```json
 "azure_credentials": {
      "loganalyticswsid": "<workspace ID>",
      # Log Analytics workspace ID. Used only when secrets setting in Secrets Source section is set to DOCKER_FIXED

      "publickey": "<publickey>"
      # Log Analytics workspace primary or secondary key. Used only when secrets setting in Secrets Source section is set to DOCKER_FIXED

    },
```

## File Extraction ABAP section

> [!NOTE]
> Remove all comments before you use this file for configuration and deployment.

```json
"file_extraction_abap": {
      "osuser": "<SAPControl username>",
      # Username to use to authenticate to SAPControl

      "ospasswd": "<SAPControl password>",
      # Password to use to authenticate to SAPControl

      "appserver": "<server>",
      #SAPControl server hostname/fqdn/IP address

      "instance": "<instance>",
      #SAPControl instance number

      "abapseverity": "<severity>",
      # 0 = All logs ; 1 = Warning ; 2 = Error

      "abaptz": "<timezone>"
      # GMT FORMAT
      # example - For OS Timezone = NZST (New Zealand Standard Time) use abaptz = GMT+12
    },
```

## File Extraction JAVA section

> [!NOTE]
> Remove all comments before you use this file for configuration and deployment.

```json
"file_extraction_java": {
      "javaosuser": "<username>",
      # Username to use to authenticate to JAVA server

      "javaospasswd": "<password>",
      # Password to use to authenticate to JAVA server

      "javaappserver": "<server>",
      #JAVA server hostname/fqdn/IP address

      "javainstance": "<instance number>",
      #JAVA instance number

      "javaseverity": "<severity>",
      # 0 = All logs ; 1 = Warning ; 2 = Error

      "javatz": "<timezone>"
      # GMT FORMAT
      # example - For OS Timezone = NZST (New Zealand Standard Time) use abaptz = GMT+12

    },
```

### Logs Activation Status section

> [!NOTE]
> Remove all comments before you use this file for configuration and deployment.

```json
"logs_activation_status": {
      # GMT FORMAT
      # example - For OS Timezone = NZST (New Zealand Standard Time) use abaptz = GMT+12
      "ABAPAuditLog": "<True/False>",
      "ABAPJobLog": "<True/False>",
      "ABAPSpoolLog": "<True/False>",
      "ABAPSpoolOutputLog": "<True/False>",
      "ABAPChangeDocsLog": "<True/False>",
      "ABAPAppLog": "<True/False>",
      "ABAPWorkflowLog": "<True/False>",
      "ABAPCRLog": "<True/False>",
      "ABAPTableDataLog": "<True/False>",
      
      # The following logs are retrieved using SAP Control interface and OS Login
      "ABAPFilesLogs": "<True/False>",
      "SysLog": "<True/False>",
      "ICM": "<True/False>",
      "WP": "<True/False>",
      "GW": "<True/False>",
      
      # The following logs are retrieved using SAP Control interface and OS Login
      "JAVAFilesLogs": "<True/False>",
```

### Connector Configuration section

> [!NOTE]
> Remove all comments before you use this file for configuration and deployment.

```json
"connector_configuration": {
      "extractuseremail": "<True/False>",
      "apiretry": "<True/False>",
      "auditlogforcexal": "<True/False>",
      "auditlogforcelegacyfiles": "<True/False>",
      "azure_resource_id": "<Azure _ResourceId>",
      "timechunk": "<value>"
    },
```

### ABAP Table Selector section

> [!NOTE]
> Remove all comments before you use this file for configuration and deployment.

```json
"abap_table_selector": {
      # Specify True or False to configure whether table should be collected from the SAP system

      "AGR_TCODES_FULL": "<True/False>",
      "USR01_FULL": "<True/False>",
      "USR02_FULL": "<True/False>",
      "USR02_INCREMENTAL": "<True/False>",
      "AGR_1251_FULL": "<True/False>",
      "AGR_USERS_FULL": "<True/False>",
      "AGR_USERS_INCREMENTAL": "<True/False>",
      "AGR_PROF_FULL": "<True/False>",
      "UST04_FULL": "<True/False>",
      "USR21_FULL": "<True/False>",
      "ADR6_FULL": "<True/False>",
      "ADCP_FULL": "<True/False>",
      "USR05_FULL": "<True/False>",
      "USGRP_USER_FULL": "<True/False>",
      "USER_ADDR_FULL": "<True/False>",
      "DEVACCESS_FULL": "<True/False>",
      "AGR_DEFINE_FULL": "<True/False>",
      "AGR_DEFINE_INCREMENTAL": "<True/False>",
      "PAHI_FULL": "<True/False>",
      "AGR_AGRS_FULL": "<True/False>",
      "USRSTAMP_FULL": "<True/False>",
      "USRSTAMP_INCREMENTAL": "<True/False>",
      "SNCSYSACL_FULL": "<True/False>",
      "USRACL_FULL": "<True/False>"
    }
```
## Next steps

Learn more about the Microsoft Sentinel solution for SAP® applications:

- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy SAP security content](deploy-sap-security-content.md)
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
