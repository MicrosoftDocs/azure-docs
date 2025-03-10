---
title: Kickstart deployment script reference for the Microsoft Sentinel for SAP applications data connector agent
description: Description of command line options available with kickstart deployment script
author: batamig
ms.author: bagol
ms.topic: reference
ms.date: 09/15/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As an SAP BASIS team member, I want to understand the options in the kickstart script used to deploy and configure a container hosting the SAP data connector, so that I can streamline the setup process and manage secrets storage and network configurations efficiently.

---

# Kickstart deployment script reference for the Microsoft Sentinel for SAP applications data connector agent

This article provides a reference of the configurable parameters available in the kickstart script used to the deploy the Microsoft Sentinel for SAP applications data connector agent. 

For more information, see [Connect your SAP system to Microsoft Sentinel](deploy-data-connector-agent-container.md).

Content in this article is intended for your **SAP BASIS** teams.

## Secret storage location

**Parameter name:** `--keymode`

**Parameter values:** `kvmi`, `kvsi`, `cfgf`

**Required:** No. `kvmi` is assumed by default.

**Description:** Specifies whether secrets (username, password, log analytics ID, and shared key) should be stored in local configuration file, or in Azure Key Vault. Also controls whether authentication to Azure Key Vault is done using the VM's Azure system-assigned managed identity or a Microsoft Entra registered-application identity.

If set to `kvmi`, Azure Key Vault is used to store secrets, and authentication to Azure Key Vault is done using the virtual machine's Azure system-assigned managed identity.

If set to `kvsi`, Azure Key Vault is used to store secrets, and authentication to Azure Key Vault is done using a Microsoft Entra registered-application identity. Usage of `kvsi` mode requires `--appid`, `--appsecret`, and `--tenantid` values.

If set to `cfgf`, the configuration file stored locally is used to store secrets.

## ABAP server connection mode

**Parameter name:** `--connectionmode`

**Parameter values:** `abap`, `mserv`

**Required:** No. If not specified, the default is `abap`.

**Description:** Defines whether the data collector agent should connect to the  ABAP server directly, or through a message server. Use `abap` to have the agent connect directly to the ABAP server, whose name you can define using the `--abapserver` parameter. If you don't define the name ahead of time, the script prompts you for it. Use `mserv` to connect through a message server, in which case you **must** specify the `--messageserverhost`, `--messageserverport`, and `--logongroup` parameters.

## Configuration folder location

**Parameter name:** `--configpath`

**Parameter values:** `<path>`

**Required:** No, `/opt/sapcon/<SID>` is assumed if not specified.

**Description:** By default kickstart initializes configuration file, metadata location to `/opt/sapcon/<SID>`. To set alternate location of configuration and metadata, use the `--configpath` parameter.

## ABAP server address

**Parameter name:** `--abapserver`

**Parameter values:** `<servername>`

**Required:** No. If the parameter isn't specified and if the [ABAP server connection mode](#abap-server-connection-mode) parameter is set to `abap`, the script prompts you for the server hostname/IP address.

**Description:** Used only if the connection mode is set to `abap`, this parameter contains the Fully Qualified Domain Name (FQDN), short name, or IP address of the ABAP server to connect to.

## System instance number

**Parameter name:** `--systemnr`

**Parameter values:** `<system number>`

**Required:** No. If not specified, the user is prompted for the system number.

**Description:** Specifies the SAP system instance number to connect to.
 
## System ID

**Parameter name:** `--sid`

**Parameter values:** `<SID>`

**Required:** No. If not specified, the user is prompted for the system ID.

**Description:**  Specifies the SAP system ID to connect to.

## Client number

**Parameter name:** `--clientnumber`

**Parameter values:** `<client number>`

**Required:** No. If not specified, the user is prompted for the client number.

**Description:** Specifies the client number to connect to.


## Message Server Host

**Parameter name:** `--messageserverhost`

**Parameter values:** `<servername>`

**Required:** Yes, if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`.

**Description:** Specifies the hostname/ip address of the message server to connect to. Can **only** be used if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`.
 
## Message Server Port

**Parameter name:** `--messageserverport`

**Parameter values:** `<portnumber>`

**Required:** Yes, if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`.

**Description:** Specifies the service name (port) of the message server to connect to. Can **only** be used if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`.
 
## Logon group

**Parameter name:** `--logongroup`

**Parameter values:** `<logon group>`

**Required:** Yes, if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`.

**Description:** Specifies the sign-in group to use when connecting to a message server. Can be used **only** if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`. If the logon group name contains spaces, they should be passed in double quotes, as in the example `--logongroup "my logon group"`.

## Logon username

**Parameter name:** `--sapusername`

**Parameter values:** `<username>`

**Required:** No. If not supplied, the user is prompted for the username if they are **not** using SNC (X.509) for authentication.

**Description:** Username used to authenticate to ABAP server.

## Logon password 

**Parameter name:** `--sappassword`

**Parameter values:** `<password>`

**Required:** No. If not supplied, the user is prompted for the password, if they're **not** using SNC (X.509) for authentication. Password input is masked.

**Description:** Password used to authenticate to ABAP server.
 
## NetWeaver SDK file location

**Parameter name:** `--sdk`

**Parameter values:** `<filename>`

**Required:** No. The script attempts to locate the nwrfc*.zip file in the current folder. If it isn't found, the user is prompted to supply a valid NetWeaver SDK archive file.

**Description:** NetWeaver SDK file path. A valid SDK is required for the data collector to operate. For more information, see [SAP prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

## Enterprise Application ID

**Parameter name:** `--appid`

**Parameter values:** `<guid>`

**Required:** Yes, if [Secret storage location](#secret-storage-location) is set to `kvsi`.

**Description:** When Azure Key Vault authentication mode is set to `kvsi`, authentication to key vault is done using an [enterprise application (service principal) identity](deploy-data-connector-agent-container.md?tabs=registered-application#create-a-virtual-machine-and-configure-access-to-your-credentials). This parameter specifies the application ID.

## Enterprise Application secret

**Parameter name:** `--appsecret`

**Parameter values:** `<secret>`

**Required:** Yes, if [Secret storage location](#secret-storage-location) is set to `kvsi`.

**Description:** When Azure Key Vault authentication mode is set to `kvsi`, authentication to key vault is done using an [enterprise application (service principal) identity](deploy-data-connector-agent-container.md?tabs=registered-application#create-a-virtual-machine-and-configure-access-to-your-credentials). This parameter specifies the application secret.

## Tenant ID

**Parameter name:** `--tenantid`

**Parameter values:** `<guid>`

**Required:** Yes, if [Secret storage location](#secret-storage-location) is set to `kvsi`.

**Description:** When Azure Key Vault authentication mode is set to `kvsi`, authentication to key vault is done using an [enterprise application (service principal) identity](deploy-data-connector-agent-container.md?tabs=registered-application#create-a-virtual-machine-and-configure-access-to-your-credentials). This parameter specifies the Microsoft Entra tenant ID.
 
## Key Vault Name

**Parameter name:** `--kvaultname`

**Parameter values:** `<key vaultname>`

**Required:** No. If [Secret storage location](#secret-storage-location) is set to `kvsi` or `kvmi`, the script prompts for the value if not supplied.

**Description:** If [Secret storage location](#secret-storage-location) is set to `kvsi` or `kvmi`, the key vault name (in FQDN format) should be entered here.
 
## Log Analytics workspace ID

**Parameter name:** `--loganalyticswsid`

**Parameter values:** `<id>`

**Required:** No. If not supplied, the script prompts for the workspace ID.

**Description:** Log Analytics workspace ID where the data collector sends the data to. To locate the workspace ID, locate the Log Analytics workspace in the Azure portal: open Microsoft Sentinel, select **Settings** in the **Configuration** section, select **Workspace settings**, then select **Agents Management**.
 
## Log Analytics key

**Parameter name:** `--loganalyticskey`

**Parameter values:** `<key>`

**Required:** No. If not supplied, script prompts for the workspace key. Input is masked.

**Description:** Primary or secondary key of the Log Analytics workspace where the data collector sends the data to. To locate the workspace Primary or Secondary Key, locate the Log Analytics workspace in Azure portal: open Microsoft Sentinel, select **Settings** in the **Configuration** section, select **Workspace settings**, then select **Agents Management**.
 
## Use X.509 (SNC) for authentication

**Parameter name:** `--use-snc`

**Parameter values:** None

**Required:** No. If not specified, the username and password is used for authentication. If specified, `--cryptolib`, `--sapgenpse`, combination of either `--client-cert` and `--client-key`, or `--client-pfx` and `--client-pfx-passwd` as well as `--server-cert`, and in certain cases `--cacert` switches is required.

**Description:** Specifies that X.509 authentication is used to connect to ABAP server, rather than username/password authentication. For more information, see [Configure your system to use SNC for secure connections](preparing-sap.md#configure-your-system-to-use-snc-for-secure-connections).

## SAP Cryptographic library path

**Parameter name:** `--cryptolib`

**Parameter values:** `<sapcryptolibfilename>`

**Required:** Yes, if `--use-snc` is specified.

**Description:** Location and filename of SAP Cryptographic library (libsapcrypto.so).

## SAPGENPSE tool path

**Parameter name:** `--sapgenpse`

**Parameter values:** `<sapgenpsefilename>`

**Required:** Yes, if `--use-snc` is specified.

**Description:** Location and filename of the **sapgenpse** tool for creation and management of PSE-files and SSO-credentials.
 
## Client certificate public key path

**Parameter name:** `--client-cert`

**Parameter values:** `<client certificate filename>`

**Required:** Yes, if `--use-snc` **and** certificate is in .crt/.key base-64 format.

**Description:** Location and filename of the base-64 client public certificate. If the client certificate is in .pfx format, use `--client-pfx` switch instead.
 
## Client certificate private key path

**Parameter name:** `--client-key`

**Parameter values:** `<client key filename>`

**Required:** Yes, if `--use-snc` is specified **and** key is in .crt/.key base-64 format.

**Description:** Location and filename of the base-64 client private key. If the client certificate is in .pfx format, use `--client-pfx` switch instead.

## Issuing/root Certification Authority certificates

**Parameter name:** `--cacert`

**Parameter values:** `<trusted ca cert>`

**Required:** Yes, if `--use-snc` is specified **and** the certificate is issued by an enterprise certification authority.

**Description:** If the certificate is self-signed, it has no issuing CA, so there's no trust chain that needs to be validated. 

If the certificate is issued by an enterprise CA, the issuing CA certificate and any higher-level CA certificates need to be validated. Use separate instances of the `--cacert` switch for each CA in the trust chain, and supply the full filenames of the public certificates of the enterprise certificate authorities.

## Client PFX certificate path

**Parameter name:** `--client-pfx`

**Parameter values:** `<pfx filename>`

**Required:** Yes, if `--use-snc` **and** key is in .pfx/.p12 format.

**Description:** Location and filename of the pfx client certificate.
 
## Client PFX certificate password

**Parameter name:** `--client-pfx-passwd`

**Parameter values:** `<password>`

**Required:** Yes, if `--use-snc` is used, certificate is in .pfx/.p12 format, and certificate is protected by a password.

**Description:** PFX/P12 file password.
 
## Server certificate

**Parameter name:** `--server-cert`

**Parameter values:** `<server certificate filename>`

**Required:** Yes, if `--use-snc` is used.

**Description:** ABAP server certificate full path and name.

## HTTP proxy server URL

**Parameter name:** `--http-proxy`

**Parameter values:** `<proxy url>`

**Required:** No

**Description:** Containers that can't establish a connection to Microsoft Azure services directly and require a connection via a proxy server, also require an `--http-proxy` switch to define the proxy URL for the container. The format for the proxy URL is `http://hostname:port`.

## Host-based networking

**Parameter name:** `--hostnetwork`

**Required:** No.

**Description:** If the `hostnetwork` switch is specified, the agent uses a host-based networking configuration. This can solve internal DNS resolution issues in some cases.

## Confirm all prompts

**Parameter name:** `--confirm-all-prompts`

**Parameter values:** None

**Required:** No

**Description:** If the `--confirm-all-prompts` switch is specified, the script doesn't pause for any user confirmations, and only prompts if user input is required. Use the `--confirm-all-prompts` switch for a zero-touch deployment.

## Use preview build of the container

**Parameter name:** `--preview`

**Parameter values:** None

**Required:** No

**Description:** By default, the container deployment kickstart script deploys the container with the `:latest` tag. Public preview features are published to the `:latest-preview` tag. To have the container deployment script uses the public preview version of the container, specify the `--preview` switch.

## Related content

For more information, see:

- [Connect your SAP system to Microsoft Sentinel](deploy-data-connector-agent-container.md)
- [Troubleshoot your Microsoft Sentinel solution for SAP applications solution deployment](sap-deploy-troubleshoot.md)
