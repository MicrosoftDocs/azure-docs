---
title: Deploy the Microsoft Sentinel for SAP data connector agent container using expert configuration options | Microsoft Docs
description: Learn how to deploy the Microsoft Sentinel for SAP data connector environments using expert configuration options, such as and on-premises machine and custom, manual configurations.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 07/01/2024
---

# Deploy the Microsoft Sentinel for SAP data connector agent container with expert options

This article provides procedures for deploying and configuring the Microsoft Sentinel for SAP data connector agent container using expert, custom, or manual configuration options.

We typically recommend using the default process, as described in [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md). 

Content in this article is intended for your **SAP BASIS** teams.

## Prerequisites

Make sure that your system complies with the prerequisites documented in the main [SAP data connector prerequisites document](prerequisites-for-deploying-sap-continuous-threat-monitoring.md) before you start.

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

For more information, see the [Quickstart: Create a key vault using the Azure CLI](../../key-vault/general/quick-create-cli) and the [az keyvault secret](/cli/azure/keyvault/secret) CLI documentation.

## Perform an expert / custom installation

This procedure describes how to deploy the Microsoft Sentinel for SAP data connector using an expert or custom installation, such as when installing on-premises.

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

    To test your configuration, you may want to add the user and password directly to the **systemconfig.json** configuration file. While we recommend that you use Azure Key vault to store your credentials, you can also use an **env.list** file, [Docker secrets](#manually-configure-the-microsoft-sentinel-for-sap-data-connector), or you can add your credentials directly to the **systemconfig.json** file.

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
    LOGWSID=<SET SENTINEL WORKSPACE id>
    LOGWSPUBLICKEY=<SET SENTINEL WORKSPACE KEY>
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

1. Download and run the pre-defined Docker image with the SAP data connector installed.  Run:

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

    For more information, see [Deploy the Microsoft Sentinel solution for SAP applications® from the content hub](deploy-sap-security-content.md).

## Manually configure the Microsoft Sentinel for SAP data connector

The Microsoft Sentinel for SAP data connector is configured in the **systemconfig.json** file, which you cloned to your SAP data connector machine as part of the [deployment procedure](#perform-an-expert--custom-installation). Use the content in this section to manually configure data connector settings.

For more information, see [Systemconfig.json file reference](reference-systemconfig-json.md), or [Systemconfig.ini file reference](reference-systemconfig.md) for legacy systems.

### Define the SAP logs that are sent to Microsoft Sentinel

The default **systemconfig** file is configured to cover built-in analytics, the SAP user authorization master data tables, with users and privilege information, and the ability to track changes and activities on the SAP landscape. The default configuration provides more logging information to allow for post-breach investigations and extended hunting abilities.

However you might want to customize your configuration over time, especially as business processes tend to be seasonal.

Use the following code to the Microsoft Sentinel solution for SAP applications **systemconfig.json** file to define the logs that are sent to Microsoft Sentinel.

For more information, see [Microsoft Sentinel solution for SAP applications solution logs reference (public preview)](sap-solution-log-reference.md).

```python
##############################################################
# Enter True OR False for each log to send those logs to Microsoft Sentinel
[Logs Activation Status]
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
##############################################################
```

Use the following code to configure a detection-focused profile, which includes the core security logs of the SAP landscape required for the most of the analytics rules to perform well. Post-breach investigations and hunting capabilities are limited.

```python
##############################################################
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

Use the following code to configure a minimal profile, which includes the SAP Security Audit Log, which is the most important source of data that the Microsoft Sentinel solution for SAP applications uses to analyze activities on the SAP landscape. Enabling this log is the minimal requirement to provide any security coverage.

```python
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


### SAL logs connector settings

Add the following code to the Microsoft Sentinel for SAP data connector **systemconfig.json** file to define other settings for SAP logs ingested into Microsoft Sentinel.

For more information, see [Perform an expert / custom SAP data connector installation](#perform-an-expert--custom-installation).

```python
##############################################################
[Connector Configuration]
extractuseremail = True
apiretry = True
auditlogforcexal = False
auditlogforcelegacyfiles = False
timechunk = 60
##############################################################
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
|**abapseverity**     |Enter the lowest, inclusive, severity level for which you want to ingest ABAP logs into Microsoft Sentinel.  Values include: <br><br>- **0** = All logs <br>- **1** = Warning <br>- **2** = Error     |

### Configuring a Java SAP Control instance

To ingest SAP Control Web Service logs into Microsoft Sentinel, configure the following JAVA SAP Control instance details:

|Parameter  |Description  |
|---------|---------|
|**javaappserver**     |Enter your SAP Control Java server host. <br>For example: `contoso-java.server.com`         |
|**javainstance**     |Enter your SAP Control ABAP instance number. <br>For example: `10`         |
|**javatz**     |Enter the time zone configured on your SAP Control Java server, in GMT format. <br>For example: `GMT+3`         |
|**javaseverity**     |Enter the lowest, inclusive, severity level for which you want to ingest Web Service logs into Microsoft Sentinel.  Values include: <br><br>- **0** = All logs <br>- **1** = Warning <br>- **2** = Error     |


### Configuring User Master data collection

To ingest tables directly from your SAP system with details about your users and role authorizations, configure your **systemconfig.json** file with a `True`/`False` statement for each table. 

For example:

```python
[ABAP Table Selector] 
USR01_FULL = True
USR02_FULL = True
USR02_INCREMENTAL = True
UST04_FULL = True
AGR_USERS_FULL = True
AGR_USERS_INCREMENTAL = True
USR21_FULL = True
AGR_1251_FULL = True
ADR6_FULL = True
AGR_TCODES_FULL = True 
DEVACCESS_FULL = True
AGR_DEFINE_FULL = True
AGR_DEFINE_INCREMENTAL = True
AGR_PROF_FULL = True
PAHI_FULL = True
```

For more information, see [Tables retrieved directly from SAP systems](sap-solution-log-reference.md#tables-retrieved-directly-from-sap-systems).

## Deploy a data connector agent container using a configuration file

Azure Key Vault is the recommended method to store your authentication credentials and configuration data. If you are prevented from using Azure Key Vault, this procedure describes how you can deploy the data connector agent container using a configuration file instead.

1. Create a virtual machine on which to deploy the agent.

1. Transfer the [SAP NetWeaver SDK](https://aka.ms/sap-sdk-download) to the machine on which you want to install the agent.

1. Run the following commands to **download the deployment Kickstart script** from the Microsoft Sentinel GitHub repository and **mark it executable**:

    ```bash
    wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
    chmod +x ./sapcon-sentinel-kickstart.sh
    ```
    
1. **Run the script**:

    ```bash
    ./sapcon-sentinel-kickstart.sh --keymode cfgf
    ```

    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. Supply additional parameters to the script as needed to minimize the number of prompts or to customize the container deployment. For more information, see the [Kickstart script reference](reference-kickstart.md).

1. **Follow the on-screen instructions** to enter the requested details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```bash
    The process has been successfully completed, thank you!
    ```

   Note the Docker container name in the script output. To see the list of docker containers on your VM, run:

    ```bash
    docker ps -a
    ```

    You'll use the name of the docker container in the next step.

1. Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

    To run the commands in this step, you must be a resource group owner on your Microsoft Sentinel workspace. If you aren't a resource group owner on your workspace, this step can also be performed later on.

    Assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles to the VM's identity:

    1. <a name=agent-id-file></a>Get the agent ID by running the following command, replacing the `<container_name>` placeholder with the name of the docker container that you'd created with the Kickstart script:

        ```bash
        docker inspect <container_name> | grep -oP '"SENTINEL_AGENT_GUID=\K[^"]+'
        ```

        For example, an agent ID returned might be `234fba02-3b34-4c55-8c0e-e6423ceb405b`.


    1. Assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles by running the following commands:

        ```bash
        az role assignment create --assignee-object-id <Object_ID> --role --assignee-principal-type ServicePrincipal "Microsoft Sentinel Business Applications Agent Operator" --scope /subscriptions/<SUB_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/microsoft.operationalinsights/workspaces/<WS_NAME>/providers/Microsoft.SecurityInsights/BusinessApplicationAgents/<AGENT_IDENTIFIER>

        az role assignment create --assignee-object-id <Object_ID> --role --assignee-principal-type ServicePrincipal "Reader" --scope /subscriptions/<SUB_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/microsoft.operationalinsights/workspaces/<WS_NAME>/providers/Microsoft.SecurityInsights/BusinessApplicationAgents/<AGENT_IDENTIFIER>
        ```

        Replace placeholder values as follows:

        |Placeholder  |Value  |
        |---------|---------|
        |`<OBJ_ID>`     | Your VM identity object ID. <br><br>    To find your VM identity object ID in Azure, go to **Enterprise application** > **All applications**, and select your VM or application name, depending on whether you're using a managed identity or a registered application. <br><br>Copy the value of the **Object ID** field to use with your copied command.      |
        |`<SUB_ID>`     |    Your Microsoft Sentinel workspace subscription ID     |
        |`<RESOURCE_GROUP_NAME>`     |  Your Microsoft Sentinel workspace resource group name       |
        |`<WS_NAME>`     |    Your Microsoft Sentinel workspace name     |
        |`<AGENT_IDENTIFIER>`     |   The agent ID displayed after running the command in the [previous step](#agent-id-file).      |

1. Run the following command to configure the Docker container to start automatically.

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

The deployment procedure generates a **systemconfig.json** file that contains the configuration details for the SAP data connector agent. The file is located in the `/sapcon-app/sapcon/config/system` directory on your VM. You can use this file to update the configuration of your SAP data connector agent.

Earlier versions of the deployment script, released before June 2023, generated a **systemconfig.ini** file instead. For more information, see:

- [Systemconfig.json file reference](reference-systemconfig-json.md)
- [Systemconfig.ini file reference](reference-systemconfig.md) (legacy)

## Related content

For more information, see:

- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Troubleshooting your Microsoft Sentinel solution for SAP applications deployment](sap-deploy-troubleshoot.md)
