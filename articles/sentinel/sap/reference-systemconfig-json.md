---
title: Microsoft Sentinel solution for SAP applications data connector agent systemconfig.json file reference
description: Learn about the settings available in Microsoft Sentinel for SAP applications data connector agent systemconfig.json file.
author: batamig
ms.author: bagol
ms.topic: reference
ms.custom: devx-track-extended-java
ms.date: 09/15/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As an SAP BASIS team member, I want to understand the configuration options in the systemconfig.json file so that I can properly set up and manage the data collector for SAP applications.

---
# Microsoft Sentinel solution for SAP applications data connector agent `systemconfig.json` file reference

The *systemconfig.json* file is used to configure the behavior of the Microsoft Sentinel for SAP applications data connector agent when [deployed from the command line](deploy-command-line.md). This article describes the options available in each section of the configuration file.

Content in this article is intended for your **SAP BASIS** teams, and is only relevant when your data connector agent is deployed from the command line. We recommend [deploying your data connector agent from the portal](deploy-data-connector-agent-container.md) instead.

> [!IMPORTANT]
> Microsoft Sentinel solution for SAP applications uses the *systemconfig.json* file for agent versions released on or after June 22, 2023. For previous agent versions, you must still use the *[systemconfig.ini file](reference-systemconfig.md)*.

## Overall file structure

The following code shows the overall structure of the `systemconfig.json` file:

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

The following table describes each overall section in the `systemconfig.json` file:

| Section name | Description |
| ------------ | ----------- |
| [Secrets source](#secrets-source) | Defines where credentials are stored. |
| [ABAP central instance](#abap-central-instance) | Defines general options of the SAP instance to connect to. |
| [Azure credentials](#azure-credentials) | Defines credentials to connect to Azure Log Analytics. |
| [File extraction ABAP](#file-extraction-abap) | Defines logs and credentials that are extracted from ABAP servers using the SAPControl interface. |
| [File extraction JAVA](#file-extraction-java) | Defines logs and credentials that are extracted from JAVA servers using the SAPControl interface. |
| [Logs activation status](#logs-activation-status) | Defines which logs are extracted from ABAP. |
| [Connector configuration](#connector-configuration) | Defines miscellaneous connector options. |
| [ABAP table selector](#abap-table-selector) | Defines which user master data logs get extracted from the ABAP system. |

## Secrets source

> [!NOTE]
> Remove all comments before you use this file for configuration and deployment.

```json
"secrets_source": {
  "secrets": "AZURE_KEY_VAULT|DOCKER_FIXED",
  # Storage location of SAP credentials and Log Analytics workspace ID and key
  # AZURE_KEY_VAULT - store in an Azure Key Vault. Requires keyvault option and intprefix option
  # DOCKER_FIXED - store in systemconfig.json file. Requires user, passwd, loganalyticswsid and publickey options

  "keyvault": "<vaultname>",
  # Azure Keyvault name, in case secrets = AZURE_KEY_VAULT

  "intprefix": "<prefix>"
  # intprefix - Prefix for variables created in Azure Key Vault

    },
```

## ABAP central instance

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

## Azure credentials

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

## File extraction ABAP

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

## File extraction JAVA

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

## Logs activation status

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

## Connector configuration

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

## ABAP table selector

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
      "PAHI_INCREMENTAL": "<True/False>",
      "AGR_AGRS_FULL": "<True/False>",
      "USRSTAMP_FULL": "<True/False>",
      "USRSTAMP_INCREMENTAL": "<True/False>",
      "SNCSYSACL_FULL": "<True/False>",
      "USRACL_FULL": "<True/False>"
    }
```

## Related content

For more information, see:

- [Connect your SAP system to Microsoft Sentinel](deploy-data-connector-agent-container.md)
- [Troubleshoot your Microsoft Sentinel solution for SAP applications solution deployment](sap-deploy-troubleshoot.md)
- [Kickstart script reference](reference-kickstart.md)
