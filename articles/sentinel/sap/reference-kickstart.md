---
title: Continuous Threat Monitoring for SAP container kickstart deployment script reference | Microsoft Docs
description: Description of command line options available with kickstart deployment script
author: MSFTandrelom
ms.author: andrelom
ms.topic: reference
ms.date: 03/02/2022
---

# Kickstart script reference

## Script overview
Kickstart script (available at [Microsoft Azure Sentinel SAP Continuous Threat Monitoring GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP)) is used to simplify deployment of the Continuous Threat Monitoring for SAP container, enable different modes of secrets storage, configure SNC and more

## Parameter reference

#### Secret storage location
Parameter name: `--keymode`

Parameter values: `kvmi`, `kvsi`, `cfgf`

Required?: No. `kvmi` assumed if not specified

Explanation: Specifies whether secrets (username, password, log analytics ID and shared key) should be stored in local configuration file, or in Azure Key Vault. Also controls whether authentication to Azure Keyvault is done using Managed VM identity or Enterprise application identity

If set to `kvmi`, implies Azure Keyvault is used to store secrets and authentication to Azure Keyvault is done using Virtual Machine managed identity

If set to `kvsi`, implies Azure Keyvault is used to store secrets and authentication to Azure Keyvault is done using Enterprise application identity. Usage of `kvsi` mode requires `--appid`, `--appsecret` and `--tenantid` values

If set to `cfgf`, configuration file stored locally will be used to store secrets

#### ABAP server connection mode
Parameter name: `--connectionmode`

Parameter values: `abap`, `mserv`

Required?: No. `abap` assumed if not specified

Explanation: Defines whether data collector agent should connect to ABAP server directly, or through a message server. Usage of `abap` value means direct connection to ABAP server and server *may* be defined via `--abapserver` parameter. Usage of `mserv` value means means connection via message server and **requires** usage of `--messageserverhost`, `--messageserverport` and `--logongroup` parameters

#### Configuration folder location
Parameter name: `--configpath`

Parameter values: `<path>`

Required?: No, `/opt/sapcon/<SID>` is assumed if not specified

Explanation: By default kickstart initializes configuration file, metadata location to `/opt/sapcon/<SID>`. To set alternate location of configuration and metadata, use the `--configpath` parameter

#### ABAP server address
Parameter name: `--apabserver`

Parameter values: `<servername>`

Required?: No, if not specified and [ABAP server connection mode](#abap-server-connection-mode) is set to `abap`, user will be prompted for the server hostname/ip address

Explanation: Used only if connection mode set to `abap`, contains the fqdn, short name, or ip address of the ABAP server to connect to.

#### System instance number
Parameter name: `--systemnr`

Parameter values: `<system number>`

Required?: No, if not specified, user will be prompted for the system number.

Explanation: Specifies the SAP system instance number to connect to
 
#### System ID
Parameter name: `--sid`

Parameter values: `<SID>`

Required?: No, if not specified, user will be prompted for the system ID.

Explanation:  Specifies the SAP system ID to connect to.

#### Client number
Parameter name: `--clientnumber`

Parameter values: `<client number>`

Required?: No, if not specified, user will be prompted for the client number.

Explanation: Specifies the client number to connect to.


#### Message Server Host
Parameter name: `--messageserverhost`

Parameter values: `<servername>`

Required?: Yes, if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`

Explanation: Specifies the hostname/ip address of the message server to connect to. Can **only** be used if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`
 
#### Message Server Port
Parameter name: `--messageserverport`

Parameter values: `<portnumber>`

Required?: Yes, if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`

Explanation: Specifies the service name (port) of the message server to connect to. Can **only** be used if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`
 
#### Logon group
Parameter name: `--logongroup`

Parameter values: `<logon group>`

Required?: Yes, if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`

Explanation: Specifies the logon group to use when connecting to message server. Can **only** be used if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`. If Logon group contains a space, it should be passed in quotes e.g. `--logongroup "my logon group"`

#### Logon username
Parameter name: `--sapusername`

Parameter values: `<username>`

Required?: No, user will be prompted for username, if **not** using SNC (X.509) for authentication if not supplied

Explanation: Username that will be used to authenticate to ABAP server.

#### Logon password 
Parameter name: `--sappassword`

Parameter values: `<password>`

Required?: No, user will be prompted for password, if **not** using SNC (X.509) for authentication if not supplied. Password input will then be masked

Explanation: Password that will be used to authenticate to ABAP server.
 
#### NetWeaver SDK file location
Parameter name: `--sdk`

Parameter values: `<filename>`

Required?: No, script will attempt to locate nwrfc*.zip file in the current folder, if not found, user will be prompted to supply a valid NetWeaver SDK archive file.

Explanation: NetWeaver SDK file path. A valid SDK is required for the data collector to operate. For more information see [Prerequisites for deploying SAP continuous threat monitoring](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#table-of-prerequisites)

#### Enterprise Application ID
Parameter name: `--appid`

Parameter values: `<guid>`

Required?: Yes, if [Secret storage location](#secret-storage-location) is set to `kvsi`.

Explanation: When Azure Keyvault authentication mode is set to `kvsi`, authentication to keyvault is done using an enterprise application (service principal) identity. This parameter specifies the application ID. For more information see [Deployment of Microsoft Sentinel continuous protection for SAP data connector using Enterprise application identity for secrets storage in Key Vault](deploy-data-connector-agent-container.md#deployment-of-microsoft-sentinel-continuous-protection-for-sap-data-connector-using-enterprise-application-identity-for-secrets-storage-in-key-vault)

#### Enterprise Application secret
Parameter name: `--appsecret`

Parameter values: `<secret>`

Required?: Yes, if [Secret storage location](#secret-storage-location) is set to `kvsi`.

Explanation: When Azure Keyvault authentication mode is set to `kvsi`, authentication to keyvault is done using an enterprise application (service principal) identity. This parameter specifies the application secret. For more information see [Deployment of Microsoft Sentinel continuous protection for SAP data connector using Enterprise application identity for secrets storage in Key Vault](deploy-data-connector-agent-container.md#deployment-of-microsoft-sentinel-continuous-protection-for-sap-data-connector-using-enterprise-application-identity-for-secrets-storage-in-key-vault)

#### Tenant ID
Parameter name: `--tenantid`

Parameter values: `<guid>`

Required?: Yes, if [Secret storage location](#secret-storage-location) is set to `kvsi`.

Explanation: When Azure Keyvault authentication mode is set to `kvsi`, authentication to keyvault is done using an enterprise application (service principal) identity. This parameter specifies the Azure Active Directory Tenant ID. For more information see [Deployment of Microsoft Sentinel continuous protection for SAP data connector using Enterprise application identity for secrets storage in Key Vault](deploy-data-connector-agent-container.md#deployment-of-microsoft-sentinel-continuous-protection-for-sap-data-connector-using-enterprise-application-identity-for-secrets-storage-in-key-vault)
 
#### Key Vault Name
Parameter name: `--kvaultname`

Parameter values: `<keyvaultname>`

Required?: No, if [Secret storage location](#secret-storage-location) is set to `kvsi` or `kvmi`, script will prompt for value if not supplied. 

Explanation: If [Secret storage location](#secret-storage-location) is set to `kvsi` or `kvmi`, keyvault name, not FQDN should entered here.
 
#### Log Analytics workspace ID
Parameter name: `--loganalyticswsid`

Parameter values: `<id>`

Required?: No, if not supplied, script will prompt for the workspace ID.

Explanation: Log Analytics workspace ID where data collector will send the data to. To locate the workspace ID, locate the Log Analytics workspace in Azure portal: open Microsoft Sentinel, select **Settings** in **Configuration** section, select **Workspace settings**, then click **Agents Management**
 
#### Log Analytics key
Parameter name: `--loganalyticskey`

Parameter values: `<key>`

Required?: No, if not supplied, script will prompt for the workspace key. Input will be masked in this case.

Explanation: Primary or secondary key of the Log Analytics workspace where data collector will send the data to. To locate the workspace Primary or Secondary Key, locate the Log Analytics workspace in Azure portal: open Microsoft Sentinel, select **Settings** in **Configuration** section, select **Workspace settings**, then click **Agents Management**
 
#### Use X.509 (SNC) for authentication
Parameter name: `--use-snc`

Parameter values: None

Required?: No, if not specified, username and password will be used for authentication. If specified, `--cryptolib`, `--sapgenpse`, combination of either `--client-cert` and `--client-key`, or `--client-pfx` and `--client-pfx-passwd` as well as `--server-cert`, and in certain cases `--cacert` switches is required.

Explanation: Switch specifies that X.509 authentication will be used to connect to ABAP server, rather than username/password authentication.

#### SAP Cryptographic library path
Parameter name: `--cryptolib`

Parameter values: `<sapcryptolibfilename>`

Required?: Yes, if `--use-snc` is specified

Explanation: Location and filename of SAP Cryptographic library (libsapcrypto.so)

#### SAPGENPSE tool path
Parameter name: `--sapgenpse`

Parameter values: `<sapgenpsefilename>`

Required?: Yes, if `--use-snc` is specified

Explanation: Location and filename of the sapgenpse tool for creation and management of PSE-files and SSO-credentials
 
#### Client certificate public key path
Parameter name: `--client-cert`

Parameter values: `<client certificate filename>`

Required?: Yes, if `--use-snc` **and** certificate is in .crt/.key base-64 format

Explanation: Location and filename of the base-64 client public certificate. If client certificate is in .pfx format, use `--client-pfx` switch instead
 
#### Client certificate private key path
Parameter name: `--client-key`

Parameter values: `<client key filename>`

Required?: Yes, if `--use-snc` **and** key is in .crt/.key base-64 format

Explanation: Location and filename of the base-64 client private key. If client certificate is in .pfx format, use `--client-pfx` switch instead

#### Issuing/root Certification Authority certificates
Parameter name: `--cacert`

Parameter values: `<trusted ca cert>`

Required?: Yes, if `--use-snc` **and** certificate is issued by an enterprise certification authority.

Explanation: If certificate is self-signed, it has no issuing CA, therefore no trust chain that needs to be validated. In case certificate is issued by an enterprise CA, issuing CA certificate, as well as any higher-level CA certificates needs to be validated. Use multiple instances of `--cacert` switches and supply full filenames of the public certificates of the enterprise certificate authorities.

#### Client PFX certificate path
Parameter name: `--client-pfx`

Parameter values: `<pfx filename>`

Required?: Yes, if `--use-snc` **and** key is in .pfx/.p12 format 

Explanation: Location and filename of the pfx client certificate.
 
#### Client PFX certificate password
Parameter name: `--client-pfx-passwd`

Parameter values: `<password>`

Required?: Yes, if `--use-snc` is used, certificate is in .pfx/.p12 format, and certificate is protected by a password

Explanation: PFX/P12 file password
 
#### Server certificate
Parameter name: `--server-cert`

Parameter values: `<server certificate filename>`

Required?: Yes, if `--use-snc` is used

Explanation: ABAP server certificate full path and name.

#### HTTP proxy server URL
Parameter name: `--http-proxy`

Parameter values: `<proxy url>`

Required?: No

Explanation: Containers, that cannot establish connection to Microsoft Azure services directly and require connection via a proxy server require `--http-proxy` switch to define proxy url for the container. Format of the proxy url is `http://hostname:port`

#### Confirm all prompts
Parameter name: `--confirm-all-prompts`

Parameter values: None

Required?: No

Explanation: If `--confirm-all-prompts` switch is specified, script will not pause for any user confirmations and will only prompt if user input is required. Use `--confirm-all-prompts` switch to achieve a zero-touch deployment

#### Use preview build of the container
Parameter name: `--preview`

Parameter values: None

Required?: No

Explanation: By default, container deployment kickstart script deploys the container with :latest tag. Public preview features are published to :latest-preview tag. To ensure container deployment script uses public preview version of the container, specify the `--preview` switch.
