---
title: Deploy SAP continuous threat monitoring | Microsoft Docs
description: Learn how to deploy the Azure Sentinel solution for SAP environments.
author: batamig
ms.author: bagold
ms.service: azure-sentinel
ms.topic: tutorial
ms.custom: mvc
ms.date: 05/13/2021
ms.subservice: azure-sentinel

---

#  Deploy SAP continuous threat monitoring (public preview)

This article takes you step by step through the process of deploying Azure Sentinel continuous threat monitoring for SAP.

> [!IMPORTANT]
> The Azure Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Overview

[Azure Sentinel solutions](sentinel-solutions.md) include bundled security content, such as threat detections, workbooks, and watchlists. Solutions enable you to onboard Azure Sentinel security content for a specific data connector using a single process.

The Azure Sentinel SAP data connector enables you to monitor SAP systems for sophisticated threats within the business and application layers.

The SAP data connector streams a multitude of 14 application logs from the entire SAP system landscape, and collects logs from both Advanced Business Application Programming (ABAP) via NetWeaver RFC calls and file storage data via OSSAP Control interface. The SAP data connector adds to Azure Sentinels ability to monitor the SAP underlying infrastructure.

To ingest SAP logs into Azure Sentinel, you must have the Azure Sentinel SAP data connector installed on your SAP environment.
We recommend that you use a Docker container on an Azure VM for the deployment, as described in this tutorial.

After the SAP data connector is deployed, deploy the  SAP solution security content to smoothly gain insight into your organization's SAP environment and improve any related security operation capabilities.

In this tutorial, you learn:

> [!div class="checklist"]
> * How to prepare your SAP system for the SAP data connector deployment
> * How to use a Docker container and an Azure VM to deploy the SAP data connector
> * How to deploy the SAP solution security content in Azure Sentinel

## Prerequisites

In order to deploy the Azure Sentinel SAP data connector and security content as described in this tutorial, you must have the following prerequisites:

|Area  |Description  |
|---------|---------|
|**Azure prerequisites**     |  **Access to Azure Sentinel**. Make a note of your Azure Sentinel workspace ID and key to use in this tutorial when [deploying your SAP data connector](#deploy-your-sap-data-connector). <br>To view these details from Azure Sentinel, go to **Settings** > **Workspace settings** > **Agents management**. <br><br>**Ability to create Azure resources**. For more information, see the [Azure Resource Manager documentation](/azure/azure-resource-manager/management/manage-resources-portal). <br><br>**Access to Azure Key Vault**. This tutorial describes the recommended steps for using Azure Key Vault to store your credentials. For more information, see the [Azure Key Vault documentation](/azure/key-vault/).       |
|**System prerequisites**     |   **Software**. The SAP data connector deployment script automatically installs software prerequisites. For more information, see [Automatically installed software](#automatically-installed-software). <br><br> **System connectivity**. Ensure that the VM serving as your SAP data connector host has access to: <br>- Azure Sentinel <br>- Azure Key Vault <br>- The SAP environment host, via the following TCP ports: *32xx*, *5xx13*, and *33xx*, where *xx* is the SAP instance number. <br><br>Make sure that you also have an SAP user account in order to access the SAP software download page.<br><br>**System architecture**. The SAP solution is deployed on a VM as a Docker container, and each SAP client requires its own container instance. <br>Your VM and the Azure Sentinel workspace can be in different Azure subscriptions, and even different Azure AD tenants.|
|**SAP prerequisites**     |   **Supported SAP versions**. We recommend using [SAP_BASIS versions 750 SP13](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows) or higher. <br>Select steps in this tutorial provide alternate instructions if you are working on SAP version [SAP_BASIS 740](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows).<br><br> **SAP system details**. Make a note of the following SAP system details for use in this tutorial:<br>    - SAP system IP address<br>- SAP system number, such as `00`<br>    - SAP System ID, from the SAP NetWeaver system. For example, `NPL`. <br>- SAP client ID, such as`001`.<br><br>**SAP NetWeaver instance access**. Access to your SAP instances must use one of the following options: <br>- [SAP ABAP user/password](#configure-your-sap-system). <br>- A user with an X509 certificate, using SAP CRYPTOLIB PSE. This option may require expert manual steps.<br><br>**Support from your SAP team**.  You'll need the support of your SAP team in order to ensure that your SAP system is [configured correctly](#configure-your-sap-system) for the solution deployment.   |
|     |         |


### Automatically installed software

The [SAP data connector deployment script](#deploy-your-sap-data-connector) installs the following software on your VM using SUDO (root) privileges:

- [Unzip.](https://www.microsoft.com/en-us/p/unzip/9mt44rnlpxxt?activetab=pivot:overviewtab)
- [NetCat](https://sectools.org/tool/netcat/)
- [Python 3.6 or higher](https://www.python.org/downloads/)
- [Python3-pip](https://pypi.org/project/pip/)
- [Docker](https://www.docker.com/)

## Configure your SAP system

This procedure describes how to ensure that your SAP system has the correct prerequisites installed and is configured for the Azure Sentinel SAP data connector deployment.

> [!IMPORTANT]
> Perform this procedure together with your SAP team to ensure correct configurations.
>

**To configure your SAP system for the SAP data connector**:

1. If you are using a version of SAP earlier than 750, ensure that the following SAP notes are deployed in your system:

    - **SPS12641084**. For systems running SAP versions earlier than SAP BASIS 750 SPS13
    - **2502336**. For systems running SAP versions earlier than SAP BASIS 750 SPS1
    - **2173545**. For systems running SAP versions earlier than SAP BASIS 750

    Access these SAP notes at the [SAP support Launchpad site](https://support.sap.com/en/index.html), using an SAP user account.

1. Download and install one of the following SAP change requests from the Azure Sentinel GitHub repository, at https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR:

    - **SAP versions 750 or higher**: Install the SAP change request *131 (NPLK900131)*
    - **SAP versions 740**: Install the SAP change request *132 (NPLK900132)*

    When performing this step, use the **STMS_IMPORT** SAP transaction code.

    > [!NOTE]
    > In the SAP **Import Options** area, you may see the **Ignore Invalid Component Version** option displayed. If displayed, select this option before continuing.
    >

1. Create a new SAP role named **/MSFTSEN/SENTINEL_CONNECTOR** by importing the SAP change request *14 (NPLK900114)*. Use the **STMS_IMPORT** SAP transaction code.

    Verify that the role is created with the required permissions, such as:

    :::image type="content" source="media/sap/required-sap-role-authorizations.png" alt-text="Required SAP role permissions for the Azure Sentinel SAP data connector.":::

    For more information, see [authorizations for the ABAP user](sap-solution-detailed-requirements.md#required-abap-authorizations).

1. Create a non-dialog, RFC/NetWeaver user for the SAP data connector and attach the newly created **/MSFTSEN/SENTINEL_CONNECTOR** role.

    - After attaching the role, verify that the role permissions are distributed to the user.
    - This process requires that you use a username and password for the ABAP user. After the new user is created and has required permissions, make sure to change the ABAP user password.

1. Download and place the **SAP NetWeaver RFC SDK 7.50 for Linux on x86_64 64 BIT** version on your VM, as it's required during the installation process.

    For example, find the SDK on the [SAP software download site](https://launchpad.support.sap.com/#/softwarecenter/template/products/_APP=00200682500000001943&_EVENT=DISPHIER&HEADER=Y&FUNCTIONBAR=N&EVENT=TREE&NE=NAVIGATE&ENR=01200314690100002214&V=MAINT) > **SAP NW RFC SDK** > **SAP NW RFC SDK 7.50** > **nwrfc750X_X-xxxxxxx.zip**. Make sure to download the **LINUX ON X86_64 65BIT** option. Copy the file, such as by using SCP, to your VM.

    You'll need an SAP user account to access the SAP software download page.

1. (Optional) The SAP **Auditlog** file is used system-wide and supports multiple SAP clients. However, each instance of the Azure Sentinel SAP solution supports a single SAP client only.

    Therefore, if you have a multi-client SAP system, we recommend that you enable the **Auditlog** file only for the client where you deploy the SAP solution to avoid data duplication.


## Deploy a Linux VM for your SAP data connector

This procedure describes how to use the Azure CLI to deploy an Ubuntu server 18.04 LTS VM and assign it with a [system-managed identity](/azure/active-directory/managed-identities-azure-resources/).

> [!TIP]
> You can also deploy the data connector on RHEL, versions 7.7 and higher or SUSE versions 15 and higher. Note that any OS and patch levels must be completely up to date.
>

**To deploy and prepare your Ubuntu VM**:

1. Use the following command as an example, inserting the values for your resource group and VM name:

    ```azurecli
    az vm create  --resource-group [resource group name]   --name [VM Name] --image UbuntuLTS  --admin-username AzureUser --data-disk-sizes-gb 10 – --size Standard_DS2_– --generate-ssh-keys  --assign-identity
    ```

1. On your new VM, install:

    - [Venv](https://docs.python.org/3.8/library/venv.html), with Python version 3.8 or higher.
    - The [Azure CLI](/cli/azure/), version 2.8.0 or higher.

> [!IMPORTANT]
> Make sure that you apply any security best practices for your organization, just as you would any other VM.
>

For more information, see [Quickstart: Create a Linux virtual machine with the Azure CLI](/azure/virtual-machines/linux/quick-create-cli).

## Create key vault for your SAP credentials

This tutorial uses a newly created or dedicated [Azure Key Vault](/azure/key-vault/) to store credentials for your SAP data connector.

**To create or dedicate an Azure Key Vault**:

1. Create a new Azure Key Vault, or choose an existing one to dedicate to your SAP data connector deployment.

    For example, to create a new Key Vault, run the following commands, using the name of your Key Vault resource group and entering your Key Vault name:

    ```azurecli
    kvgp=<KVResourceGroup>

    kvname=<keyvaultname>

    #Create Key Vault
    az keyvault create \
      --name $kvname \
      --resource-group $kvgp
    ```

1. Assign an access policy, including GET, LIST, and SET permissions to the VM's managed identity.

    In Azure Key Vault, select to **Access Policies** > **Add Access Policy - Secret Permissions: Get, List, and Set** > **Select Principal**. Enter your [VM's name](#deploy-a-linux-vm-for-your-sap-data-connector), and then select **Add** > **Save**.

    For more information, see the [Key Vault documentation](/azure/key-vault/general/assign-access-policy-portal).

1. Run the following command to get the [VM's principal ID](#deploy-a-linux-vm-for-your-sap-data-connector), entering the name of your Azure resource group:

    ```azurecli
    az vm show -g [resource group] -n [Virtual Machine] --query identity.principal– --out tsv
    ```

    Your principal ID is displayed for you to use in the following step.

1. Run the following command to assign the VM's access permissions to the Key Vault, entering the name of your resource group and the principal ID value returned from the previous step.

    ```azurecli
    az keyvault set-policy  --name $kv  --resource-group [resource group]  --object-id [Principal ID]  --secret-permissions get set
    ```

## Deploy your SAP data connector

The Azure Sentinel SAP data connector deployment script installs [required software](#automatically-installed-software) and then installs the connector on your [newly created VM](#deploy-a-linux-vm-for-your-sap-data-connector), storing credentials in your [dedicated key vault](#create-key-vault-for-your-sap-credentials).

The SAP data connector deployment script is stored in the [Azure Sentinel GitHub repository > DataConnectors > SAP](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh).

To run the SAP data connector deployment script, you'll need the following details:

- Your Azure Sentinel workspace details, as listed in the [Prerequisites](#prerequisites) section.
- The SAP system details listed in the [Prerequisites](#prerequisites) section.
- Access to a VM user with SUDO privileges.
- The SAP user you created in [Configure your SAP system](#configure-your-sap-system), with the **/MSFTSEN/SENTINEL_CONNECTOR** role applied.
- The help of your SAP team.


**To run the SAP solution deployment script**:

1. Run the following command to deploy the SAP solution on your VM:

    ```azurecli
    wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh
    ```

1. Follow the on-screen instructions to enter your SAP and Key Vault details and complete the deployment. A confirmation message appears when the deployment is complete:

    ```azurecli
    The process has been successfully completed, thank you!
    ```

    Azure Sentinel starts to retrieve SAP logs for the configured time span, until 24 hours before the initialization time.

1. We recommend reviewing the system logs to make sure that the data connector is transmitting data. Run:

    ```bash
    docker logs -f sapcon-[SID]
    ```

## Deploy SAP security content

Deploy the [SAP security content](sap-solution-security-content.md) from the Azure Sentinel **Solutions** and **Watchlists** areas.

The **Azure Sentinel - Continuous Threat Monitoring for SAP** solution enables the SAP data connector to show in the Azure Sentinel **Data connectors** area, and deploys the **SAP - System Applications and Products** workbook and SAP-related analytics rules.

Add SAP-related watchlists to your Azure Sentinel workspace manually.

**To deploy SAP solution security content**:

1. From the Azure Sentinel navigation menu, select **Solutions (Preview)**.

    The **Solutions** page displays a filtered, searchable list of solutions.

1. Select **Azure Sentinel - Continuous Threat Monitoring for SAP (preview)** to open the SAP solution page.

    :::image type="content" source="media/sap/sap-solution.png" alt-text="Azure Sentinel - Continuous Threat Monitoring for SAP (preview) solution.":::

1. Select **Create** to launch the solution deployment wizard, and enter the details of the Azure subscription, resource group, and Log Analytics workspace where you want to deploy the solution.

1. Select **Next** to cycle through the **Data Connectors** **Analytics** and **Workbooks** tabs, where you can learn about the components that will be deployed with this solution.

    The default name for the workbook is **SAP - System Applications and Products - Preview**. Change it in the workbooks tab as needed.

    For more information, see [Azure Sentinel SAP solution: security content reference (public preview)](sap-solution-security-content.md).

1. In the **Review + create tab**, wait for the **Validation Passed** message, then select **Create** to deploy the solution.

    > [!TIP]
    > You can also select **Download a template** for a link to deploy the solution as code.

1. After the deployment is completed, a confirmation message appears at the top-right of the page.

    To display the newly deployed content, go to:

    - **Threat Management** > **Workbooks**, to find the [SAP - System Applications and Products - Preview](sap-solution-security-content.md#sap---system-applications-and-products-workbook) workbook.
    - **Configuration** > **Analytics** to find a series of [SAP-related analytics rules](sap-solution-security-content.md#built-in-analytics-rules).

1. Add SAP-related watchlists to use in your search, detection rules, threat hunting, and response playbooks. These watchlists provide the configuration for the Azure Sentinel SAP Continuous Threat Monitoring solution.

    1. Download SAP watchlists from the Azure Sentinel GitHub repository at https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Analytics/Watchlists.

    1. In the Azure Sentinel **Watchlists** area, add the watchlists to your Azure Sentinel workspace. Use the downloaded CSV files as the sources, and then customize them as needed for your environment. 

        [ ![SAP-related watchlists added to Azure Sentinel.](media/sap/sap-watchlists.png) ](media/sap/sap-watchlists.png#lightbox)

        For more information, see [Use Azure Sentinel watchlists](watchlists.md) and [Available SAP watchlists](sap-solution-security-content.md#available-watchlists).

1. In Azure Sentinel, navigate to the **Azure Sentinel Continuous Threat Monitoring for SAP** data connector to confirm the connection:

    [ ![Azure Sentinel Continuous Threat Monitoring for SAP data connector page.](media/sap/sap-data-connector.png) ](media/sap/sap-data-connector.png#lightbox)

    SAP ABAP logs are displayed in the Azure Sentinel **Logs** page under **Custom logs**:

    [ ![SAP ABAP logs under Custom logs in Azure Sentinel.](media/sap/sap-logs-in-sentinel.png) ](media/sap/sap-logs-in-sentinel.png#lightbox)

    For more information, see [Azure Sentinel SAP solution logs reference (public preview)](sap-solution-log-reference.md).

## SAP solution deployment troubleshooting

After having deployed both the SAP data connector and security content, you may experience the following errors or issues:

|Issue  |Workaround  |
|---------|---------|
|Network connectivity issues to the SAP environment or to Azure Sentinel     |  Check your network connectivity as needed.       |
|Incorrect SAP ABAP user credentials     |Check your credentials and fix them by applying the correct values to the **ABAPUSER** and **ABAPPASS** values in Azure Key Vault.         |
|Missing permissions, such as the **/MSFTSEN/SENTINEL_CONNECTOR** role not assigned to the SAP user as needed, or inactive     |Fix this error by assigning the role and ensuring that it's active in your SAP system.         |
|A missing SAP change request     | Make sure that you've imported the correct SAP change request, as described in [Configure your SAP system](#configure-your-sap-system).        |
|Incorrect Azure Sentinel workspace ID or key entered in the deployment script     |  To fix this error, enter the correct credentials in Azure KeyVault.       |
|A corrupt or missing SAP SDK file     | Fix this error by reinstalling the SAP SDK and ensuring that you are using the correct Linux 64-bit version.        |
|Missing data in your workbook or alerts     |    Ensure that the **Auditlog** policy is properly enabled on the SAP side, with no errors in the log file. Use the **RSAU_CONFIG_LOG** transaction for this step.     |
|     |         |

> [!TIP]
> We highly recommend that you review the system logs after installing the data connector. Run:
>
> ```bash
> docker logs -f sapcon-[SID]
> ```
>
For more information, see:

- [View all Docker execution logs](#view-all-docker-execution-logs)
- [Review and update the SAP data connector configuration](#review-and-update-the-sap-data-connector-configuration)
- [Useful Docker commands](#useful-docker-commands)

### View all Docker execution logs

To view all Docker execution logs for your Azure Sentinel SAP data connector deployment, run one of the following commands:

```bash
docker exec -it sapcon-[SID] bash && cd /sapcon-app/sapcon/logs
```

or

```bash
docker exec –it sapcon-[SID] cat /sapcon-app/sapcon/logs/[FILE_LOGNAME]
```

Output similar to the following should be displayed:

```bash
Logs directory:
root@644c46cd82a9:/sapcon-app# ls sapcon/logs/ -l
total 508
-rwxr-xr-x 1 root root      0 Mar 12 09:22 ' __init__.py'
-rw-r--r-- 1 root root    282 Mar 12 16:01  ABAPAppLog.log
-rw-r--r-- 1 root root   1056 Mar 12 16:01  ABAPAuditLog.log
-rw-r--r-- 1 root root    465 Mar 12 16:01  ABAPCRLog.log
-rw-r--r-- 1 root root    515 Mar 12 16:01  ABAPChangeDocsLog.log
-rw-r--r-- 1 root root    282 Mar 12 16:01  ABAPJobLog.log
-rw-r--r-- 1 root root    480 Mar 12 16:01  ABAPSpoolLog.log
-rw-r--r-- 1 root root    525 Mar 12 16:01  ABAPSpoolOutputLog.log
-rw-r--r-- 1 root root      0 Mar 12 15:51  ABAPTableDataLog.log
-rw-r--r-- 1 root root    495 Mar 12 16:01  ABAPWorkflowLog.log
-rw-r--r-- 1 root root 465311 Mar 14 06:54  API.log # view this log to see submits of data into Azure Sentinel
-rw-r--r-- 1 root root      0 Mar 12 15:51  LogsDeltaManager.log
-rw-r--r-- 1 root root      0 Mar 12 15:51  PersistenceManager.log
-rw-r--r-- 1 root root   4830 Mar 12 16:01  RFC.log
-rw-r--r-- 1 root root   5595 Mar 12 16:03  SystemAdmin.log
```

### Review and update the SAP data connector configuration

If you want to check the SAP data connector configuration file and make manual updates, perform the following steps:

1. On your VM, in the user's home directory, open the **~/sapcon/[SID]/systemconfig.ini** file.
1. Update the configuration if needed, and then restart the container:

    ```bash
    docker restart sapcon-[SID]
    ```

### Useful Docker commands

When troubleshooting your SAP data connector, you may find the following commands useful:

|Function  |Command  |
|---------|---------|
|**Stop the Docker container**     |  `docker stop sapcon-[SID]`       |
|**Start the Docker container**     |`docker start sapcon-[SID]`         |
|**View Docker system logs**     |  `docker logs -f sapcon-[SID]`       |
|**Enter the Docker container**     |   `docker exec -it sapcon-[SID] bash`      |
|     |         |

For more information, see the [Docker CLI documentation](https://docs.docker.com/engine/reference/commandline/docker/).

## Update your SAP data connector

If you have a Docker container already running with an earlier version of the SAP data connector, run the SAP data connector update script to get the latest features available.

1. Make sure that you have the most recent versions of the relevant deployment scripts from the Azure Sentinel github repository. Run:

    ```azurecli
    - wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-update.sh
    ```

1. Run the following command on your SAP data connector machine:

    ```azurecli
    ./ sapcon-instance-update.sh
    ```

The SAP data connector Docker container on your machine is updated.

## Next steps

Learn more about the Azure Sentinel SAP solutions:

- [Deploy the Azure Sentinel SAP solution using alternate deployments](sap-solution-deploy-alternate.md)
- [Azure Sentinel SAP solution detailed SAP requirements](sap-solution-detailed-requirements.md)
- [Azure Sentinel SAP solution logs reference](sap-solution-log-reference.md)
- [Azure Sentinel SAP solution: built-in security content](sap-solution-security-content.md)

For more information, see [Azure Sentinel solutions](sentinel-solutions.md).
