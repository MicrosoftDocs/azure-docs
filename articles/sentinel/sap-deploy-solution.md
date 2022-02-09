---
title: Deploy SAP continuous threat monitoring | Microsoft Docs
description: Learn how to deploy the Microsoft Sentinel solution for SAP environments.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.custom: mvc, ignite-fall-2021
ms.date: 11/09/2021
---

#  Deploy SAP continuous threat monitoring (preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This article takes you step by step through the process of deploying Microsoft Sentinel continuous threat monitoring for SAP.

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Overview

[Microsoft Sentinel solutions](sentinel-solutions.md) include bundled security content, such as threat detections, workbooks, and watchlists. With these solutions, you can onboard Microsoft Sentinel security content for a specific data connector by using a single process.

By using the Microsoft Sentinel SAP data connector, you can monitor SAP systems for sophisticated threats within the business and application layers.

The SAP data connector streams 14 application logs from the entire SAP system landscape. The data connector collects logs from Advanced Business Application Programming (ABAP) via NetWeaver RFC calls and from file storage data via OSSAP Control interface. The SAP data connector adds to the ability of Microsoft Sentinel to monitor the SAP underlying infrastructure.

To ingest SAP logs into Microsoft Sentinel, you must have the Microsoft Sentinel SAP data connector installed in your SAP environment. For the deployment, we recommend that you use a Docker container on an Azure virtual machine, as described in this tutorial.

After the SAP data connector is deployed, deploy the  SAP solution security content to gain insight into your organization's SAP environment and improve any related security operation capabilities.

In this article, you'll learn how to:

> [!div class="checklist"]
> * Prepare your SAP system for the SAP data connector deployment.
> * Use a Docker container and an Azure virtual machine (VM) to deploy the SAP data connector.
> * Deploy the SAP solution security content in Microsoft Sentinel.

> [!NOTE]
> Extra steps are required to deploy your SAP data connector over a Secure Network Communications (SNC) connection. For more information, see [Deploy the Microsoft Sentinel SAP data connector with SNC](sap-solution-deploy-snc.md).
>
## Prerequisites

To deploy the Microsoft Sentinel SAP data connector and security content as described in this tutorial, you must meet the following prerequisites:

| Area | Description |
| --- | --- |
|**Azure prerequisites** | **Access to Microsoft Sentinel**. Make a note of your Microsoft Sentinel workspace ID and key to use in this tutorial when you [deploy your SAP data connector](#deploy-your-sap-data-connector). <br><br>To view these details from Microsoft Sentinel, go to **Settings** > **Workspace settings** > **Agents management**. <br><br>**Ability to create Azure resources**. For more information, see the [Azure Resource Manager documentation](../azure-resource-manager/management/manage-resources-portal.md). <br><br>**Access to your Azure key vault**. This tutorial describes the recommended steps for using your Azure key vault to store your credentials. For more information, see the [Azure Key Vault documentation](../key-vault/index.yml). |
|**System prerequisites** | **Software**. The SAP data connector deployment script automatically installs software prerequisites. For more information, see [Automatically installed software](#automatically-installed-software). <br><br> **System connectivity**. Ensure that the VM serving as your SAP data connector host has access to: <br>- Microsoft Sentinel <br>- Your Azure key vault <br>- The SAP environment host, via the following TCP ports: *32xx*, *5xx13*, and *33xx*, where *xx* is the SAP instance number. <br><br>Make sure that you also have an SAP user account in order to access the SAP software download page.<br><br>**System architecture**. The SAP solution is deployed on a VM as a Docker container, and each SAP client requires its own container instance. For sizing recommendations, see [Recommended virtual machine sizing](sap-solution-detailed-requirements.md#recommended-virtual-machine-sizing). <br>Your VM and the Microsoft Sentinel workspace can be in different Azure subscriptions, and even different Azure AD tenants.|
|**SAP prerequisites** | **Supported SAP versions**. We recommend using [SAP_BASIS versions 750 SP13](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows) or later. <br><br>Certain steps in this tutorial provide alternative instructions if you're working on older SAP version [SAP_BASIS 740](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows).<br><br> **SAP system details**. Make a note of the following SAP system details for use in this tutorial:<br>- SAP system IP address<br>- SAP system number, such as `00`<br>- SAP System ID, from the SAP NetWeaver system (for example, `NPL`) <br>- SAP client ID, such as`001`<br><br>**SAP NetWeaver instance access**. Access to your SAP instances must use one of the following options: <br>- [SAP ABAP user/password](#configure-your-sap-system). <br>- A user with an X509 certificate, using SAP CRYPTOLIB PSE. This option might require expert manual steps.<br><br>**Support from your SAP team**.  You'll need the support of your SAP team to help ensure that your SAP system is [configured correctly](#configure-your-sap-system) for the solution deployment. |
| | |

### Automatically installed software

The [SAP data connector deployment script](#deploy-your-sap-data-connector) installs the following software on your VM by using *sudo* (root) privileges:

- [Unzip](https://www.microsoft.com/en-us/p/unzip/9mt44rnlpxxt?activetab=pivot:overviewtab)
- [NetCat](https://sectools.org/tool/netcat/)
- [Python 3.6 or later](https://www.python.org/downloads/)
- [Python 3-pip](https://pypi.org/project/pip/)
- [Docker](https://www.docker.com/)

## Configure your SAP system

This procedure describes how to ensure that your SAP system has the correct prerequisites installed and is configured for the Microsoft Sentinel SAP data connector deployment.

> [!IMPORTANT]
> Perform this procedure together with your SAP team to ensure correct configurations.
>

**To configure your SAP system for the SAP data connector**:

1. Ensure that the following SAP notes are deployed in your system, depending on your version:

    | SAP&nbsp;BASIS&nbsp;versions | Required note |
    | --- | --- |
    | - 750 SP01 to SP12<br>- 751 SP01 to SP06<br>- 752 SP01 to SP03 | 2641084: Standardized read access for the Security Audit log data |
    | - 700 to 702<br>- 710 to 711, 730, 731, 740, and 750 | 2173545: CD: CHANGEDOCUMENT_READ_ALL |
    | - 700 to 702<br>- 710 to 711, 730, 731, and 740<br>- 750 to 752 | 2502336: CD (Change Document): RSSCD100 - read only from archive, not from database |
    | | |

   Later versions don't require the extra notes. For more information, see the [SAP support Launchpad site](https://support.sap.com/en/index.html). Log in with an SAP user account.

1. Download and install one of the following SAP change requests from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR):

    - **SAP version 750 or later**: Install the SAP change request *NPLK900180*
    - **SAP version 740**: Install the SAP change request *NPLK900179*

    When you're performing this step, be sure to use binary mode to transfer the files to the SAP system, and use the **STMS_IMPORT** SAP transaction code.

    > [!NOTE]
    > In the SAP **Import Options** area, the **Ignore Invalid Component Version** option might be displayed. If it is displayed, select this option before you continue.
    >

1. Create a new SAP role named **/MSFTSEN/SENTINEL_CONNECTOR** by importing the SAP change request *NPLK900163*. Use the **STMS_IMPORT** SAP transaction code.

    Verify that the role is created with the required permissions, such as:

    :::image type="content" source="media/sap/required-sap-role-authorizations.png" alt-text="Required SAP role permissions for the Microsoft Sentinel SAP data connector.":::

    For more information, see [authorizations for the ABAP user](sap-solution-detailed-requirements.md#required-abap-authorizations).

1. Create a non-dialog RFC/NetWeaver user for the SAP data connector, and attach the newly created */MSFTSEN/SENTINEL_CONNECTOR* role.

    - After you attach the role, verify that the role permissions are distributed to the user.
    - This process requires that you use a username and password for the ABAP user. After the new user is created and has the required permissions, be sure to change the ABAP user password.

1. Download and place the SAP NetWeaver RFC SDK 7.50 for Linux on x86_64 64 BIT version on your VM, because it's required during the installation process.

    For example, find the SDK on the [SAP software download site](https://launchpad.support.sap.com/#/softwarecenter/template/products/_APP=00200682500000001943&_EVENT=DISPHIER&HEADER=Y&FUNCTIONBAR=N&EVENT=TREE&NE=NAVIGATE&ENR=01200314690100002214&V=MAINT) > **SAP NW RFC SDK** > **SAP NW RFC SDK 7.50** > **nwrfc750X_X-xxxxxxx.zip**. Be sure to download the **LINUX ON X86_64 65BIT** option. Copy the file, such as by using SCP, to your VM.

    You'll need an SAP user account to access the SAP software download page.

1. (Optional) The SAP *Auditlog* file is used system-wide and supports multiple SAP clients. However, each instance of the Microsoft Sentinel SAP solution supports a single SAP client only.

    Therefore, if you have a multi-client SAP system, to avoid data duplication, we recommend that you enable the *Auditlog* file only for the client where you deploy the SAP solution.


## Deploy a Linux VM for your SAP data connector

This procedure describes how to use the Azure CLI to deploy an Ubuntu server 18.04 LTS VM and assign it with a [system-managed identity](../active-directory/managed-identities-azure-resources/index.yml).

> [!TIP]
> You can also deploy the data connector on RHEL version 7.7 or later or on SUSE version 15 or later. Note that any OS and patch levels must be completely up to date.
>

**To deploy and prepare your Ubuntu VM, do the following**:

1. Make sure that you have enough disk space for the Docker container runtime environment so that you'll have enough space for your operation agent logs. 

    For example, in Ubuntu, you can mount a disk to the `/var/lib/docker` directory before installing the container, as by default you may have little space allocated to the `/var` directory.

    For more information, see [Recommended virtual machine sizing](sap-solution-detailed-requirements.md#recommended-virtual-machine-sizing).

1. Use the following command as an example for deploying your VM, inserting the values for your resource group and VM name where indicated.

    ```azurecli
    az vm create  --resource-group [resource group name]   --name [VM Name] --image UbuntuLTS  --admin-username azureuser --data-disk-sizes-gb 10 – --size Standard_DS2 --generate-ssh-keys  --assign-identity
    ```

1. On your new VM, install:

    - [Venv](https://docs.python.org/3.8/library/venv.html), with Python version 3.8 or later.
    - The [Azure CLI](/cli/azure/), version 2.8.0 or later.

> [!IMPORTANT]
> Be sure to apply any security best practices for your organization, just as you would for any other VM.
>

For more information, see [Quickstart: Create a Linux virtual machine with the Azure CLI](../virtual-machines/linux/quick-create-cli.md).

## Create a key vault for your SAP credentials

In this tutorial, you use a newly created or dedicated [Azure key vault](../key-vault/index.yml) to store credentials for your SAP data connector.

To create or dedicate an Azure key vault, do the following:

1. Create a new Azure key vault, or choose an existing one to dedicate to your SAP data connector deployment.

    For example, to create a new key vault, run the following commands. Be sure to use the name of your key vault resource group and enter your key vault name.

    ```azurecli
    kvgp=<KVResourceGroup>

    kvname=<keyvaultname>

    #Create a key vault
    az keyvault create \
      --name $kvname \
      --resource-group $kvgp
    ```

1. Assign an access policy, including GET, LIST, and SET permissions to the VM's managed identity, by using one of the following methods:

    - **The Azure portal**:

        1. In your Azure key vault, select **Access Policies** > **Add Access Policy - Secret Permissions: Get, List, and Set** > **Select Principal**.  
        1. Enter your [VM name](#deploy-a-linux-vm-for-your-sap-data-connector), and then select **Add** > **Save**.

        For more information, see the [Key Vault documentation](../key-vault/general/assign-access-policy-portal.md).

    - **The Azure CLI**:

        1. Run the following command to get the [VM's principal ID](#deploy-a-linux-vm-for-your-sap-data-connector). Be sure to enter the name of your Azure resource group.  

            ```azurecli
            VMPrincipalID=$(az vm show -g [resource group] -n [Virtual Machine] --query identity.principalId -o tsv)
            ```  

            Your principal ID is displayed for you to use in the next step.

        1. Run the following command to assign the VM access permissions to the key vault. Be sure to enter the name of your resource group and the principal ID value that was returned from the previous step.

            ```azurecli
            az keyvault set-policy -n [key vault] -g [resource group] --object-id $VMPrincipalID --secret-permissions get list set
            ```

## Deploy your SAP data connector

The deployment script of the Microsoft Sentinel SAP data connector installs the [required software](#automatically-installed-software) and then installs the connector on your [newly created VM](#deploy-a-linux-vm-for-your-sap-data-connector). It also stores credentials in your [dedicated key vault](#create-a-key-vault-for-your-sap-credentials).

The deployment script of the SAP data connector is stored in [Microsoft Sentinel GitHub repository > DataConnectors > SAP](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh).

To run the SAP data connector deployment script, you'll need the following items:

- Your Microsoft Sentinel workspace details, as listed in the [Prerequisites](#prerequisites) section.
- The SAP system details, as listed in the [Prerequisites](#prerequisites) section.
- Access to a VM user with sudo privileges.
- The SAP user that you created in [Configure your SAP system](#configure-your-sap-system), with the **/MSFTSEN/SENTINEL_CONNECTOR** role applied.
- The help of your SAP team.

To run the SAP solution deployment script, do the following:

1. Run the following command to deploy the SAP solution on your VM:

    ```azurecli
    wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh
    ```

1. Follow the on-screen instructions to enter your SAP and key vault details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```azurecli
    The process has been successfully completed, thank you!
    ```

    Microsoft Sentinel starts to retrieve SAP logs for the configured time span, until 24 hours before the initialization time.

1. We recommend that you review the system logs to make sure that the data connector is transmitting data. Run:

    ```bash
    docker logs -f sapcon-[SID]
    ```

## Deploy SAP security content

Deploy the [SAP security content](sap-solution-security-content.md) from the Microsoft Sentinel **Solutions** and **Watchlists** areas.

The **Microsoft Sentinel - Continuous Threat Monitoring for SAP** solution enables the SAP data connector to be displayed in the Microsoft Sentinel **Data connectors** area. The solution also deploys the **SAP - System Applications and Products** workbook and SAP-related analytics rules.

Add SAP-related watchlists to your Microsoft Sentinel workspace manually.

To deploy SAP solution security content, do the following:

1. In Microsoft Sentinel, on the left pane, select **Solutions (Preview)**.

    The **Solutions** page displays a filtered, searchable list of solutions.

1. To open the SAP solution page, select **Microsoft Sentinel - Continuous Threat Monitoring for SAP (preview)**.

    :::image type="content" source="media/sap/sap-solution.png" alt-text="Screenshot of the 'Microsoft Sentinel - Continuous Threat Monitoring for SAP (preview)' solution pane.":::

1. To launch the solution deployment wizard, select **Create**, and then enter the details of the Azure subscription, resource group, and Log Analytics workspace where you want to deploy the solution.

1. Select **Next** to cycle through the **Data Connectors** **Analytics** and **Workbooks** tabs, where you can learn about the components that will be deployed with this solution.

    The default name for the workbook is **SAP - System Applications and Products - Preview**. Change it in the workbooks tab as needed.

    For more information, see [Microsoft Sentinel SAP solution: security content reference (public preview)](sap-solution-security-content.md).

1. On the **Review + create tab** pane, wait for the **Validation Passed** message, then select **Create** to deploy the solution.

    > [!TIP]
    > You can also select **Download a template** for a link to deploy the solution as code.

1. After the deployment is completed, a confirmation message appears at the upper right.

    To display the newly deployed content, go to:

    - **Threat Management** > **Workbooks** > **My workbooks**, to find the [built-in SAP workbooks](sap-solution-security-content.md#built-in-workbooks).
    - **Configuration** > **Analytics** to find a series of [SAP-related analytics rules](sap-solution-security-content.md#built-in-analytics-rules).

1. Add SAP-related watchlists to use in your search, detection rules, threat hunting, and response playbooks. These watchlists provide the configuration for the Microsoft Sentinel SAP Continuous Threat Monitoring solution. Do the following:

    a. Download SAP watchlists from the Microsoft Sentinel GitHub repository at https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Analytics/Watchlists.  
    b. In the Microsoft Sentinel **Watchlists** area, add the watchlists to your Microsoft Sentinel workspace. Use the downloaded CSV files as the sources, and then customize them as needed for your environment.  

    [ ![SAP-related watchlists added to Microsoft Sentinel.](media/sap/sap-watchlists.png) ](media/sap/sap-watchlists.png#lightbox)

    For more information, see [Use Microsoft Sentinel watchlists](watchlists.md) and [Available SAP watchlists](sap-solution-security-content.md#available-watchlists).

1. In Microsoft Sentinel, go to the **Microsoft Sentinel Continuous Threat Monitoring for SAP** data connector to confirm the connection:

    [ ![Screenshot of the Microsoft Sentinel Continuous Threat Monitoring for SAP data connector page.](media/sap/sap-data-connector.png) ](media/sap/sap-data-connector.png#lightbox)

    SAP ABAP logs are displayed on the Microsoft Sentinel **Logs** page, under **Custom logs**:

    [ ![Screenshot of the SAP ABAP logs in the 'Custom Logs' area in Microsoft Sentinel.](media/sap/sap-logs-in-sentinel.png) ](media/sap/sap-logs-in-sentinel.png#lightbox)

    For more information, see [Microsoft Sentinel SAP solution logs reference (public preview)](sap-solution-log-reference.md).


## Update your SAP data connector

If you have a Docker container already running with an earlier version of the SAP data connector, run the SAP data connector update script to get the latest features available.

Make sure that you have the most recent versions of the relevant deployment scripts from the Microsoft Sentinel github repository. 

Run:

```azurecli
wget -O sapcon-instance-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-instance-update.sh && bash ./sapcon-instance-update.sh
```

The SAP data connector Docker container on your machine is updated. 

Be sure to check for any other available updates, such as:

- Relevant SAP change requests, in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR).
- Microsoft Sentinel SAP security content, in the **Microsoft Sentinel Continuous Threat Monitoring for SAP** solution.
- Relevant watchlists, in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Analytics/Watchlists).

## Collect SAP HANA audit logs

If you have SAP HANA database audit logs configured with Syslog, you'll also need to configure your Log Analytics agent to collect the Syslog files.

1. Make sure that the SAP HANA audit log trail is configured to use Syslog, as described in *SAP Note 0002624117*, which is accessible from the [SAP Launchpad support site](https://launchpad.support.sap.com/#/notes/0002624117). For more information, see:

    - [SAP HANA Audit Trail - Best Practice](https://archive.sap.com/documents/docs/DOC-51098)
    - [Recommendations for Auditing](https://help.sap.com/viewer/742945a940f240f4a2a0e39f93d3e2d4/2.0.05/en-US/5c34ecd355e44aa9af3b3e6de4bbf5c1.html)

1. Check your operating system Syslog files for any relevant HANA database events.

1. Install and configure a Log Analytics agent on your machine:

    a. Sign in to your HANA database operating system as a user with sudo privileges.  
    b. In the Azure portal, go to your Log Analytics workspace. On the left pane, under **Settings**, select **Agents management** > **Linux servers**.  
    c. Under **Download and onboard agent for Linux**, copy the code that's displayed in the box to your terminal, and then run the script.

    The Log Analytics agent is installed on your machine and connected to your workspace. For more information, see [Install Log Analytics agent on Linux computers](../azure-monitor/agents/agent-linux.md) and [OMS Agent for Linux](https://github.com/microsoft/OMS-Agent-for-Linux) on the Microsoft GitHub repository.

1. Refresh the **Agents Management > Linux servers** tab to confirm that you have **1 Linux computers connected**.

1. On the left pane, under **Settings**, select **Agents configuration**, and then select the **Syslog** tab.

1. Select **Add facility** to add the facilities you want to collect. 

    > [!TIP]
    > Because the facilities where HANA database events are saved can change between different distributions, we recommend that you add all facilities, check them against your Syslog logs, and then remove any that aren't relevant.
    >

1. In Microsoft Sentinel, check to confirm that HANA database events are now shown in the ingested logs.

## Next steps

Learn more about the Microsoft Sentinel SAP solutions:

- [Deploy the Microsoft Sentinel SAP data connector with SNC](sap-solution-deploy-snc.md)
- [Expert configuration options, on-premises deployment, and SAPControl log sources](sap-solution-deploy-alternate.md)
- [Microsoft Sentinel SAP solution detailed SAP requirements](sap-solution-detailed-requirements.md)
- [Microsoft Sentinel SAP solution logs reference](sap-solution-log-reference.md)
- [Microsoft Sentinel SAP solution: built-in security content](sap-solution-security-content.md)
- [Troubleshoot your Microsoft Sentinel SAP solution deployment](sap-deploy-troubleshoot.md)

For more information, see [Microsoft Sentinel solutions](sentinel-solutions.md).
