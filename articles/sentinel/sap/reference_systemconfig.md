---
title: Continuous Threat Monitoring for SAP container configuration file reference | Microsoft Docs
description: Description of settings available in systemconfig.ini file
author: MSFTandrelom
ms.author: andrelom
ms.topic: reference
ms.date: 03/03/2022
---
# Systemconfig.ini file reference

## Systemconfig file description
Systemconfig.ini file is used to configure behavior of the data collector. Configuration options are grouped into several sections

### Systemconfig configuration file sections
- [Secrets Source](#secrets-source-section)<br>
This section defines where credentials are stored
- [ABAP Central Instance](#abap-central-instance-section)<br>
This section defines general options of the SAP instance to connect to
- [Azure Credentials](#azure-credentials-section)<br>
This section defines credentials to connect to Azure Log Analytics
- File Extraction ABAP<br>
This section defines logs and credentials that are extracted from ABAP server using SAPControl interface
- File Extraction JAVA<br>
This section defines logs and credentials that are extracted from JAVA server using SAPControl interface
- Logs Activation Status<br>
This section defines which logs are extracted from ABAP 
- Connector Configuration<br>
This section defines miscellaneous connector options
- ABAP Table Selector<br>
This section defines which User Master Data logs get extracted from the ABAP system

### Secrets Source section
````systemconfig.ini
secrets=AZURE_KEY_VAULT|DOCKER_SECRETS|DOCKER_FIXED

keyvault=<vaultname>
# Azure Keyvault name, in case secrets = AZURE_KEY_VAULT

intprefix=<prefix>
# intprefix - Prefix for variables created in Azure Key Vault
````

### ABAP Central Instance section
````systemconfig.ini
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
# Username to use to connect to ABAP server

passwd=<password>
# Password to use to connect to ABAP server

snc_lib=<path to libsapcrypto>
# Full path, to the libsapcrypto.so
# Used when SNC is in use
# !!! Note: the path must be valid within the container!!!

snc_partnername=<distinguished name of the server certificate>
# p: -prefixed distinguished name of the server certificate
# Used when SNC is in use

snc_qop=<SNC protection level>
# More information available at https://docs.oracle.com/cd/E19509-01/820-5064/ggrpj/index.html
# Used when SNC is in use

snc_myname=<distinguished name of the client certificate>
# p: -prefixed distinguished name of the client certificate
# Used when SNC is in use

x509cert=<server certificate>
# Base64 encoded server certificate value in a single line (with leading ----BEGIN-CERTIFICATE--- and trailing ----END-CERTIFICATE---- removed)
````

### Azure Credentials section
````systemconfig.ini
loganalyticswsid=<workspace ID>
# Log Analytics workspace ID

publickey=<publickey>
# Log Analytics workspace primary or secondary key
````

### File Extraction ABAP section
````systemconfig.ini
osuser = <SAPControl username>
# Username to use to authenticate to SAPControl

ospasswd = <SAPControl password>
# Password to use to authenticate to SAPControl

appserver = <server>
#SAPControl server hostname/fqdn/IP address

instance = <instance>
#SAPControl instance name


abapseverity = <SET_ABAP_SEVERITY>
abaptz = <SET_ABAP_TZ>
````