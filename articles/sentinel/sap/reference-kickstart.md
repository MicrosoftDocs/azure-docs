---
title: Microsoft Sentinel solution for SAP® applications container kickstart deployment script reference | Microsoft Docs
description: Description of command line options available with kickstart deployment script
author: yelevin
ms.author: yelevin
ms.topic: reference
ms.date: 05/24/2023
---

# Kickstart script reference

## Script overview

Simplify the [deployment of the container hosting the SAP data connector](deploy-data-connector-agent-container.md) by using the provided **Kickstart script** (available at [Microsoft Sentinel solution for SAP® applications GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP)), which can also enable different modes of secrets storage, configure SNC, and more.

## Parameter reference

The following parameters are configurable. You can see examples of how these parameters are used in [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md).

#### Secret storage location

**Parameter name:** `--keymode`

**Parameter values:** `kvmi`, `kvsi`, `cfgf`

**Required:** No. `kvmi` is assumed by default.

**Explanation:** Specifies whether secrets (username, password, log analytics ID and shared key) should be stored in local configuration file, or in Azure Key Vault. Also controls whether authentication to Azure Key Vault is done using the VM's Azure system-assigned managed identity or a Microsoft Entra registered-application identity.

If set to `kvmi`, Azure Key Vault is used to store secrets, and authentication to Azure Key Vault is done using the virtual machine's Azure system-assigned managed identity.

If set to `kvsi`, Azure Key Vault is used to store secrets, and authentication to Azure Key Vault is done using a Microsoft Entra registered-application identity. Usage of `kvsi` mode requires `--appid`, `--appsecret` and `--tenantid` values.

If set to `cfgf`, configuration file stored locally will be used to store secrets.

#### ABAP server connection mode

**Parameter name:** `--connectionmode`

**Parameter values:** `abap`, `mserv`

**Required:** No. If not specified, the default is `abap`.

**Explanation:** Defines whether the data collector agent should connect to the  ABAP server directly, or through a message server. Use `abap` to have the agent connect directly to the ABAP server, whose name you can define using the `--abapserver` parameter (though if you don't, [you will still be prompted for it](#abap-server-address)). Use `mserv` to connect through a message server, in which case you **must** specify the `--messageserverhost`, `--messageserverport`, and `--logongroup` parameters.

#### Configuration folder location

**Parameter name:** `--configpath`

**Parameter values:** `<path>`

**Required:** No, `/opt/sapcon/<SID>` is assumed if not specified.

**Explanation:** By default kickstart initializes configuration file, metadata location to `/opt/sapcon/<SID>`. To set alternate location of configuration and metadata, use the `--configpath` parameter.

#### ABAP server address

**Parameter name:** `--abapserver`

**Parameter values:** `<servername>`

**Required:** No. If the parameter isn't specified and if the [ABAP server connection mode](#abap-server-connection-mode) parameter is set to `abap`, you will be prompted for the server hostname/IP address.

**Explanation:** Used only if the connection mode is set to `abap`, this parameter contains the Fully Qualified Domain Name (FQDN), short name, or IP address of the ABAP server to connect to.

#### System instance number

**Parameter name:** `--systemnr`

**Parameter values:** `<system number>`

**Required:** No. If not specified, user will be prompted for the system number.

**Explanation:** Specifies the SAP system instance number to connect to.
 
#### System ID

**Parameter name:** `--sid`

**Parameter values:** `<SID>`

**Required:** No. If not specified, user will be prompted for the system ID.

**Explanation:**  Specifies the SAP system ID to connect to.

#### Client number

**Parameter name:** `--clientnumber`

**Parameter values:** `<client number>`

**Required:** No. If not specified, user will be prompted for the client number.

**Explanation:** Specifies the client number to connect to.


#### Message Server Host

**Parameter name:** `--messageserverhost`

**Parameter values:** `<servername>`

**Required:** Yes, if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`.

**Explanation:** Specifies the hostname/ip address of the message server to connect to. Can **only** be used if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`.
 
#### Message Server Port

**Parameter name:** `--messageserverport`

**Parameter values:** `<portnumber>`

**Required:** Yes, if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`.

**Explanation:** Specifies the service name (port) of the message server to connect to. Can **only** be used if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`.
 
#### Logon group

**Parameter name:** `--logongroup`

**Parameter values:** `<logon group>`

**Required:** Yes, if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`.

**Explanation:** Specifies the logon group to use when connecting to a message server. Can be used **only** if [ABAP server connection mode](#abap-server-connection-mode) is set to `mserv`. If the logon group name contains spaces, they should be passed in double quotes, as in the example `--logongroup "my logon group"`.

#### Logon username

**Parameter name:** `--sapusername`

**Parameter values:** `<username>`

**Required:** No, user will be prompted for username, if **not** using SNC (X.509) for authentication if not supplied.

**Explanation:** Username that will be used to authenticate to ABAP server.

#### Logon password 

**Parameter name:** `--sappassword`

**Parameter values:** `<password>`

**Required:** No, user will be prompted for password, if **not** using SNC (X.509) for authentication if not supplied. Password input will then be masked.

**Explanation:** Password that will be used to authenticate to ABAP server.
 
#### NetWeaver SDK file location

**Parameter name:** `--sdk`

**Parameter values:** `<filename>`

**Required:** No, script will attempt to locate nwrfc*.zip file in the current folder, if not found, user will be prompted to supply a valid NetWeaver SDK archive file.

**Explanation:** NetWeaver SDK file path. A valid SDK is required for the data collector to operate. For more information see [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#table-of-prerequisites).

#### Enterprise Application ID

**Parameter name:** `--appid`

**Parameter values:** `<guid>`

**Required:** Yes, if [Secret storage location](#secret-storage-location) is set to `kvsi`.

**Explanation:** When Azure Key Vault authentication mode is set to `kvsi`, authentication to key vault is done using an [enterprise application (service principal) identity](deploy-data-connector-agent-container-other-methods.md?tabs=registered-application#deploy-the-data-connector-agent-container). This parameter specifies the application ID.

#### Enterprise Application secret

**Parameter name:** `--appsecret`

**Parameter values:** `<secret>`

**Required:** Yes, if [Secret storage location](#secret-storage-location) is set to `kvsi`.

**Explanation:** When Azure Key Vault authentication mode is set to `kvsi`, authentication to key vault is done using an [enterprise application (service principal) identity](deploy-data-connector-agent-container-other-methods.md?tabs=registered-application#deploy-the-data-connector-agent-container). This parameter specifies the application secret.

#### Tenant ID

**Parameter name:** `--tenantid`

**Parameter values:** `<guid>`

**Required:** Yes, if [Secret storage location](#secret-storage-location) is set to `kvsi`.

**Explanation:** When Azure Key Vault authentication mode is set to `kvsi`, authentication to key vault is done using an [enterprise application (service principal) identity](deploy-data-connector-agent-container-other-methods.md?tabs=registered-application#deploy-the-data-connector-agent-container). This parameter specifies the Microsoft Entra tenant ID.
 
#### Key Vault Name

**Parameter name:** `--kvaultname`

**Parameter values:** `<key vaultname>`

**Required:** No. If [Secret storage location](#secret-storage-location) is set to `kvsi` or `kvmi`, the script will prompt for the value if not supplied. 

**Explanation:** If [Secret storage location](#secret-storage-location) is set to `kvsi` or `kvmi`, then the key vault name (in FQDN format) should be entered here.
 
#### Log Analytics workspace ID

**Parameter name:** `--loganalyticswsid`

**Parameter values:** `<id>`

**Required:** No. If not supplied, the script will prompt for the workspace ID.

**Explanation:** Log Analytics workspace ID where the data collector will send the data to. To locate the workspace ID, locate the Log Analytics workspace in the Azure portal: open Microsoft Sentinel, select **Settings** in the **Configuration** section, select **Workspace settings**, then select **Agents Management**.
 
#### Log Analytics key

**Parameter name:** `--loganalyticskey`

**Parameter values:** `<key>`

**Required:** No. If not supplied, script will prompt for the workspace key. Input will be masked in this case.

**Explanation:** Primary or secondary key of the Log Analytics workspace where data collector will send the data to. To locate the workspace Primary or Secondary Key, locate the Log Analytics workspace in Azure portal: open Microsoft Sentinel, select **Settings** in the **Configuration** section, select **Workspace settings**, then select **Agents Management**.
 
#### Use X.509 (SNC) for authentication

**Parameter name:** `--use-snc`

**Parameter values:** None

**Required:** No. If not specified, username and password will be used for authentication. If specified, `--cryptolib`, `--sapgenpse`, combination of either `--client-cert` and `--client-key`, or `--client-pfx` and `--client-pfx-passwd` as well as `--server-cert`, and in certain cases `--cacert` switches is required.

**Explanation:** Switch specifies that X.509 authentication will be used to connect to ABAP server, rather than username/password authentication. See [SNC configuration documentation](configure-snc.md) for more information.

#### SAP Cryptographic library path

**Parameter name:** `--cryptolib`

**Parameter values:** `<sapcryptolibfilename>`

**Required:** Yes, if `--use-snc` is specified.

**Explanation:** Location and filename of SAP Cryptographic library (libsapcrypto.so).

#### SAPGENPSE tool path

**Parameter name:** `--sapgenpse`

**Parameter values:** `<sapgenpsefilename>`

**Required:** Yes, if `--use-snc` is specified.

**Explanation:** Location and filename of the sapgenpse tool for creation and management of PSE-files and SSO-credentials.
 
#### Client certificate public key path

**Parameter name:** `--client-cert`

**Parameter values:** `<client certificate filename>`

**Required:** Yes, if `--use-snc` **and** certificate is in .crt/.key base-64 format.

**Explanation:** Location and filename of the base-64 client public certificate. If client certificate is in .pfx format, use `--client-pfx` switch instead.
 
#### Client certificate private key path

**Parameter name:** `--client-key`

**Parameter values:** `<client key filename>`

**Required:** Yes, if `--use-snc` is specified **and** key is in .crt/.key base-64 format.

**Explanation:** Location and filename of the base-64 client private key. If client certificate is in .pfx format, use `--client-pfx` switch instead.

#### Issuing/root Certification Authority certificates

**Parameter name:** `--cacert`

**Parameter values:** `<trusted ca cert>`

**Required:** Yes, if `--use-snc` is specified **and** the certificate is issued by an enterprise certification authority.

**Explanation:** If the certificate is self-signed, it has no issuing CA, so there is no trust chain that needs to be validated. If the certificate is issued by an enterprise CA, the issuing CA certificate and any higher-level CA certificates need to be validated. Use separate instances of the `--cacert` switch for each CA in the trust chain, and supply the full filenames of the public certificates of the enterprise certificate authorities.

#### Client PFX certificate path

**Parameter name:** `--client-pfx`

**Parameter values:** `<pfx filename>`

**Required:** Yes, if `--use-snc` **and** key is in .pfx/.p12 format.

**Explanation:** Location and filename of the pfx client certificate.
 
#### Client PFX certificate password

**Parameter name:** `--client-pfx-passwd`

**Parameter values:** `<password>`

**Required:** Yes, if `--use-snc` is used, certificate is in .pfx/.p12 format, and certificate is protected by a password.

**Explanation:** PFX/P12 file password.
 
#### Server certificate

**Parameter name:** `--server-cert`

**Parameter values:** `<server certificate filename>`

**Required:** Yes, if `--use-snc` is used.

**Explanation:** ABAP server certificate full path and name.

#### HTTP proxy server URL

**Parameter name:** `--http-proxy`

**Parameter values:** `<proxy url>`

**Required:** No

**Explanation:** Containers, that cannot establish connection to Microsoft Azure services directly and require connection via a proxy server require `--http-proxy` switch to define proxy url for the container. Format of the proxy url is `http://hostname:port`.

#### Host Based Networking

**Parameter name:** `--hostnetwork`

**Required:** No.

**Explanation:** If this switch is specified, the agent will use host-based networking configuration. This can solve internal DNS resolution issues in some cases.

#### Confirm all prompts

**Parameter name:** `--confirm-all-prompts`

**Parameter values:** None

**Required:** No

**Explanation:** If `--confirm-all-prompts` switch is specified, script will not pause for any user confirmations and will only prompt if user input is required. Use `--confirm-all-prompts` switch to achieve a zero-touch deployment.

#### Use preview build of the container

**Parameter name:** `--preview`

**Parameter values:** None

**Required:** No

**Explanation:** By default, container deployment kickstart script deploys the container with :latest tag. Public preview features are published to :latest-preview tag. To ensure container deployment script uses public preview version of the container, specify the `--preview` switch.

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
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).
