---
title: Deploy the Microsoft Sentinel for SAP data connector agent container using expert configuration options | Microsoft Docs
description: Learn how to deploy the Microsoft Sentinel for SAP data connector environments using expert configuration options, such as and on-premises machine and custom, manual configurations.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 09/15/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As an SAP BASIS team member, I want to deploy and configure a custom Microsoft Sentinel for SAP applications data connector so that I can securely integrate SAP logs into my cloud-based SIEM for enhanced monitoring and analysis.

---

# Deploy the Microsoft Sentinel for SAP data connector agent container with expert options

This article provides procedures for deploying and configuring the Microsoft Sentinel for SAP data connector agent container with expert, custom, or manual configuration options. For typical deployments we recommend that you use the [portal](deploy-data-connector-agent-container.md#deploy-the-data-connector-agent-from-the-portal-preview) instead.

Content in this article is intended for your **SAP BASIS** teams. For more information, see [Deploy an SAP data connector agent from the command line](deploy-command-line.md).

> [!NOTE]
> This article is relevant only for the data connector agent, and isn't relevant for the [SAP agentless solution](deployment-overview.md#data-connector) (limited preview).
>

## Prerequisites

- Make sure that your system complies with the relevant prerequisites before you start. For more information, see [Deployment prerequisites for the Microsoft Sentinel solutions for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

## Manually add SAP data connector agent Azure Key Vault secrets

Use the following script to manually add SAP system secrets to your key vault. Make sure to replace the placeholders with your own system ID and the credentials you want to add:

```azurecli
#Add Abap username
az keyvault secret set \
  --name <SID>-ABAPUSER \
  --value "<abapuser>" \
  --description SECRET_ABAP_USER --vault-name $kvname

#Add Abap Username password
az keyvault secret set \
  --name <SID>-ABAPPASS \
  --value "<abapuserpass>" \
  --description SECRET_ABAP_PASSWORD --vault-name $kvname

#Add Java Username
az keyvault secret set \
  --name <SID>-JAVAOSUSER \
  --value "<javauser>" \
  --description SECRET_JAVAOS_USER --vault-name $kvname

#Add Java Username password
az keyvault secret set \
  --name <SID>-JAVAOSPASS \
  --value "<javauserpass>" \
  --description SECRET_JAVAOS_PASSWORD --vault-name $kvname

#Add abapos username
az keyvault secret set \
  --name <SID>-ABAPOSUSER \
  --value "<abaposuser>" \
  --description SECRET_ABAPOS_USER --vault-name $kvname

#Add abapos username password
az keyvault secret set \
  --name <SID>-ABAPOSPASS \
  --value "<abaposuserpass>" \
  --description SECRET_ABAPOS_PASSWORD --vault-name $kvname

#Add Azure Log ws ID
az keyvault secret set \
  --name <SID>-LOGWSID \
  --value "<logwsod>" \
  --description SECRET_AZURE_LOG_WS_ID --vault-name $kvname

#Add Azure Log ws public key
az keyvault secret set \
  --name <SID>-LOGWSPUBLICKEY \
  --value "<loswspubkey>" \
  --description SECRET_AZURE_LOG_WS_PUBLIC_KEY --vault-name $kvname
```

For more information, see the [Quickstart: Create a key vault using the Azure CLI](/azure/key-vault/general/quick-create-cli) and the [az keyvault secret](/cli/azure/keyvault/secret) CLI documentation.

## Perform an expert / custom installation

This procedure describes how to deploy the Microsoft Sentinel for SAP data connector via the CLI using an expert or custom installation, such as when installing on-premises.

**Prerequisites:** Azure Key Vault is the recommended method to store your authentication credentials and configuration data. We recommend that you perform this procedure only after you have a key vault ready with your SAP credentials.

**To deploy the Microsoft Sentinel for SAP data connector**:

1. Download the latest SAP NW RFC SDK from the [SAP Launchpad site](https://support.sap.com) > **SAP NW RFC SDK** > **SAP NW RFC SDK 7.50** > **nwrfc750X_X-xxxxxxx.zip**, and save it to your data connector agent machine.

    > [!NOTE]
    > You'll need your SAP user sign-in information in order to access the SDK, and you must download the SDK that matches your operating system.
    >
    > Make sure to select the **LINUX ON X86_64** option.

1. On your same machine, create a new folder with a meaningful name, and copy the SDK zip file into your new folder.

1. Clone the Microsoft Sentinel solution GitHub repository onto your on-premises machine, and copy Microsoft Sentinel solution for SAP applications solution **systemconfig.json** file into your new folder.

    For example:

    ```bash
    mkdir /home/$(pwd)/sapcon/<sap-sid>/
    cd /home/$(pwd)/sapcon/<sap-sid>/
    wget  https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/template/systemconfig.json 
    cp <**nwrfc750X_X-xxxxxxx.zip**> /home/$(pwd)/sapcon/<sap-sid>/
    ```

1. Edit the **systemconfig.json** file as needed, using the embedded comments as a guide.

    Define the following configurations using the instructions in the **systemconfig.json** file:

    - The logs that you want to ingest into Microsoft Sentinel using the instructions in the **systemconfig.json** file.
    - Whether to include user email addresses in audit logs
    - Whether to retry failed API calls
    - Whether to include cexal audit logs
    - Whether to wait an interval of time between data extractions, especially for large extractions

    For more information, see [Manually configure the Microsoft Sentinel for SAP data connector](#manually-configure-the-microsoft-sentinel-for-sap-data-connector) and [Define the SAP logs that are sent to Microsoft Sentinel](#define-the-sap-logs-that-are-sent-to-microsoft-sentinel).

    To test your configuration, you might want to add the user and password directly to the **systemconfig.json** configuration file. While we recommend that you use Azure Key vault to store your credentials, you can also use an **env.list** file, [Docker secrets](#manually-configure-the-microsoft-sentinel-for-sap-data-connector), or you can add your credentials directly to the **systemconfig.json** file.

    For more information, see [SAL logs connector configurations](#sal-logs-connector-settings).

1. Save your updated **systemconfig.json** file in the **sapcon** directory on your machine.

1. If you have chosen to use an **env.list** file for your credentials, create a temporary **env.list** file with the required credentials. Once your Docker container is running correctly, make sure to delete this file.

    > [!NOTE]
    > The following script has each Docker container connecting to a specific ABAP system. Modify your script as needed for your environment.
    >

    Run:

    ```bash
    ##############################################################
    # Include the following section if you're using user authentication
    ##############################################################
    # env.list template for Credentials
    SAPADMUSER=<SET_SAPCONTROL_USER>
    SAPADMPASSWORD=<SET_SAPCONTROL_PASS>
    LOGWSID=<SET MICROSOFT SENTINEL WORKSPACE ID>
    LOGWSPUBLICKEY=<SET MICROSOFT SENTINEL WORKSPACE KEY>
    ABAPUSER=SET_ABAP_USER>
    ABAPPASS=<SET_ABAP_PASS>
    JAVAUSER=<SET_JAVA_OS_USER>
    JAVAPASS=<SET_JAVA_OS_USER>
    ##############################################################
    # Include the following section if you are using Azure Keyvault
    ##############################################################
    # env.list template for AZ Cli when MI is not enabled
    AZURE_TENANT_ID=<your tenant id>
    AZURE_CLIENT_ID=<your client/app id>
    AZURE_CLIENT_SECRET=<your password/secret for the service principal>
    ##############################################################
    ```

1. Download and run the predefined Docker image with the SAP data connector installed. Run:

    ```bash
    docker pull mcr.microsoft.com/azure-sentinel/solutions/sapcon:latest-preview
    docker run --env-file=<env.list_location> -d --restart unless-stopped -v /home/$(pwd)/sapcon/<sap-sid>/:/sapcon-app/sapcon/config/system --name sapcon-<sid> sapcon
    rm -f <env.list_location>
    ```

1. Verify that the Docker container is running correctly. Run:

    ```bash
    docker logs –f sapcon-[SID]
    ```

1. Continue with deploying **Microsoft Sentinel solution for SAP applications**.

    Deploying the solution enables the SAP data connector to display in Microsoft Sentinel and deploys the SAP workbook and analytics rules. When you're done, manually add and customize your SAP watchlists.

    For more information, see [Deploy the Microsoft Sentinel solution for SAP applications from the content hub](deploy-sap-security-content.md).

## Manually configure the Microsoft Sentinel for SAP data connector

When deployed via the CLI, the Microsoft Sentinel for SAP data connector is configured in the **systemconfig.json** file, which you cloned to your SAP data connector machine as part of the [deployment procedure](#perform-an-expert--custom-installation). Use the content in this section to manually configure data connector settings.

For more information, see [Systemconfig.json file reference](reference-systemconfig-json.md), or [Systemconfig.ini file reference](reference-systemconfig.md) for legacy systems.

### Define the SAP logs that are sent to Microsoft Sentinel

The default **systemconfig.json** file is configured to cover built-in analytics, the SAP user authorization master data tables, with users and privilege information, and the ability to track changes and activities on the SAP landscape. 

The default configuration provides more logging information to allow for post-breach investigations and extended hunting abilities. However you might want to customize your configuration over time, especially as business processes tend to be seasonal.

Use the following sets of code to configure the **systemconfig.json** file to define the logs that are sent to Microsoft Sentinel.

For more information, see [Microsoft Sentinel solution for SAP applications solution logs reference (public preview)](sap-solution-log-reference.md).

#### Configure a default profile

The following code configures a default configuration:

```json
"logs_activation_status": {
      "abapauditlog": "True",
      "abapjoblog": "True",
      "abapspoollog": "True",
      "abapspooloutputlog": "True",
      "abapchangedocslog": "True",
      "abapapplog": "True",
      "abapworkflowlog": "True",
      "abapcrlog": "True",
      "abaptabledatalog": "False",
      "abapfileslogs": "False",
      "syslog": "False",
      "icm": "False",
      "wp": "False",
      "gw": "False",
      "javafileslogs": "False"
```

#### Configure a detection-focused profile

Use the following code to configure a detection-focused profile, which includes the core security logs of the SAP landscape required for the most of the analytics rules to perform well. Post-breach investigations and hunting capabilities are limited.

```json
"logs_activation_status": {
      "abapauditlog": "True",
      "abapjoblog": "False",
      "abapspoollog": "False",
      "abapspooloutputlog": "False",
      "abapchangedocslog": "True",
      "abapapplog": "False",
      "abapworkflowlog": "False",
      "abapcrlog": "True",
      "abaptabledatalog": "False",
      "abapfileslogs": "False",
      "syslog": "False",
      "icm": "False",
      "wp": "False",
      "gw": "False",
      "javafileslogs": "False"
    },
....
  "abap_table_selector": {
      "agr_tcodes_full": "True",
      "usr01_full": "True",
      "usr02_full": "True",
      "usr02_incremental": "True",
      "agr_1251_full": "True",
      "agr_users_full": "True",
      "agr_users_incremental": "True",
      "agr_prof_full": "True",
      "ust04_full": "True",
      "usr21_full": "True",
      "adr6_full": "True",
      "adcp_full": "True",
      "usr05_full": "True",
      "usgrp_user_full": "True",
      "user_addr_full": "True",
      "devaccess_full": "True",
      "agr_define_full": "True",
      "agr_define_incremental": "True",
      "pahi_full": "True",
      "pahi_incremental": "True",
      "agr_agrs_full": "True",
      "usrstamp_full": "True",
      "usrstamp_incremental": "True",
      "agr_flags_full": "True",
      "agr_flags_incremental": "True",
      "sncsysacl_full": "False",
      "usracl_full": "False",
```

Use the following code to configure a minimal profile, which includes the SAP Security Audit Log, which is the most important source of data that the Microsoft Sentinel solution for SAP applications uses to analyze activities on the SAP landscape. Enabling this log is the minimal requirement to provide any security coverage.

```json
"logs_activation_status": {
      "abapauditlog": "True",
      "abapjoblog": "False",
      "abapspoollog": "False",
      "abapspooloutputlog": "False",
      "abapchangedocslog": "True",
      "abapapplog": "False",
      "abapworkflowlog": "False",
      "abapcrlog": "True",
      "abaptabledatalog": "False",
      "abapfileslogs": "False",
      "syslog": "False",
      "icm": "False",
      "wp": "False",
      "gw": "False",
      "javafileslogs": "False"
    },
....
  "abap_table_selector": {
      "agr_tcodes_full": "False",
      "usr01_full": "False",
      "usr02_full": "False",
      "usr02_incremental": "False",
      "agr_1251_full": "False",
      "agr_users_full": "False",
      "agr_users_incremental": "False",
      "agr_prof_full": "False",
      "ust04_full": "False",
      "usr21_full": "False",
      "adr6_full": "False",
      "adcp_full": "False",
      "usr05_full": "False",
      "usgrp_user_full": "False",
      "user_addr_full": "False",
      "devaccess_full": "False",
      "agr_define_full": "False",
      "agr_define_incremental": "False",
      "pahi_full": "False",
      "pahi_incremental": "False",
      "agr_agrs_full": "False",
      "usrstamp_full": "False",
      "usrstamp_incremental": "False",
      "agr_flags_full": "False",
      "agr_flags_incremental": "False",
      "sncsysacl_full": "False",
      "usracl_full": "False",
```

### SAL logs connector settings

Add the following code to the Microsoft Sentinel for SAP data connector **systemconfig.json** file to define other settings for SAP logs ingested into Microsoft Sentinel.

For more information, see [Perform an expert / custom SAP data connector installation](#perform-an-expert--custom-installation).

```json
    "connector_configuration": {
      "extractuseremail": "True",
      "apiretry": "True",
      "auditlogforcexal": "False",
      "auditlogforcelegacyfiles": "False",
      "timechunk": "60"
```

This section enables you to configure the following parameters:

|Parameter name  |Description  |
|---------|---------|
|**extractuseremail**     |  Determines whether user email addresses are included in audit logs.       |
|**apiretry**     |   Determines whether API calls are retried as a failover mechanism.      |
|**auditlogforcexal**     |  Determines whether the system forces the use of audit logs for non-SAL systems, such as SAP BASIS version 7.4.       |
|**auditlogforcelegacyfiles**     |  Determines whether the system forces the use of audit logs with legacy system capabilities, such as from SAP BASIS version 7.4 with lower patch levels.|
|**timechunk**     |   Determines that the system waits a specific number of minutes as an interval between data extractions. Use this parameter if you have a large amount of data expected. <br><br>For example, during the initial data load during your first 24 hours, you might want to have the data extraction running only every 30 minutes to give each data extraction enough time. In such cases, set this value to **30**.  |

### Configuring an ABAP SAP Control instance

To ingest all ABAP logs into Microsoft Sentinel, including both NW RFC and SAP Control Web Service-based logs, configure the following ABAP SAP Control details:

|Setting  |Description  |
|---------|---------|
|**javaappserver**     |Enter your SAP Control ABAP server host. <br>For example: `contoso-erp.appserver.com`         |
|**javainstance**     |Enter your SAP Control ABAP instance number. <br>For example: `00`         |
|**abaptz**     |Enter the time zone configured on your SAP Control ABAP server, in GMT format. <br>For example: `GMT+3`         |
|**abapseverity**     |Enter the lowest, inclusive, severity level for which you want to ingest ABAP logs into Microsoft Sentinel. Values include: <br><br>- **0** = All logs <br>- **1** = Warning <br>- **2** = Error     |

### Configuring a Java SAP Control instance

To ingest SAP Control Web Service logs into Microsoft Sentinel, configure the following JAVA SAP Control instance details:

|Parameter  |Description  |
|---------|---------|
|**javaappserver**     |Enter your SAP Control Java server host. <br>For example: `contoso-java.server.com`         |
|**javainstance**     |Enter your SAP Control ABAP instance number. <br>For example: `10`         |
|**javatz**     |Enter the time zone configured on your SAP Control Java server, in GMT format. <br>For example: `GMT+3`         |
|**javaseverity**     |Enter the lowest, inclusive, severity level for which you want to ingest Web Service logs into Microsoft Sentinel. Values include: <br><br>- **0** = All logs <br>- **1** = Warning <br>- **2** = Error     |

### Configuring User Master data collection

To ingest tables directly from your SAP system with details about your users and role authorizations, configure your **systemconfig.json** file with a `True`/`False` statement for each table.

For example:

```json
    "abap_table_selector": {
      "agr_tcodes_full": "True",
      "usr01_full": "True",
      "usr02_full": "True",
      "usr02_incremental": "True",
      "agr_1251_full": "True",
      "agr_users_full": "True",
      "agr_users_incremental": "True",
      "agr_prof_full": "True",
      "ust04_full": "True",
      "usr21_full": "True",
      "adr6_full": "True",
      "adcp_full": "True",
      "usr05_full": "True",
      "usgrp_user_full": "True",
      "user_addr_full": "True",
      "devaccess_full": "True",
      "agr_define_full": "True",
      "agr_define_incremental": "True",
      "pahi_full": "True",
      "pahi_incremental": "True",
      "agr_agrs_full": "True",
      "usrstamp_full": "True",
      "usrstamp_incremental": "True",
      "agr_flags_full": "True",
      "agr_flags_incremental": "True",
      "sncsysacl_full": "False",
      "usracl_full": "False",
```

For more information, see [Reference of tables retrieved directly from SAP systems](sap-solution-log-reference.md#reference-of-tables-retrieved-directly-from-sap-systems).

## Related content

For more information, see:

- [Connect your SAP system to Microsoft Sentinel](deploy-data-connector-agent-container.md)
- [Troubleshooting your Microsoft Sentinel solution for SAP applications deployment](sap-deploy-troubleshoot.md)
