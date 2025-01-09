---
title: Connect your SAP system by deploying your data connector agent container from the command line | Microsoft Sentinel
description: This article describes how to connect your SAP system to Microsoft Sentinel by deploying the container that that hosts the SAP data connector agent using the command line.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 10/31/2024
ms.collection: usx-security

#Customer intent: As a security, infrastructure, or SAP BASIS team member, I want to deploy and configure a containerized SAP data connector agent from the command line so that I can ingest SAP data into Microsoft Sentinel for enhanced monitoring and threat detection.

---

# Deploy an SAP data connector agent from the command line

This article provides command line options for deploying an SAP data connector agent. For typical deployments we recommend that you use the [portal](deploy-data-connector-agent-container.md#deploy-the-data-connector-agent-from-the-portal-preview) instead of the command line, as data connector agents installed via the command line can be managed only via the command line.

However, if you're using a configuration file to store your credentials instead of Azure Key Vault, or if you're an advanced user who wants to deploy the data connector manually, such as in a Kubernetes cluster, use the procedures in this article instead.

While you can run multiple data connector agents on a single machine, we recommend that you start with one only, monitor the performance, and then increase the number of connectors slowly. We also recommend that your **security** team perform this procedure with help from the **SAP BASIS** team. 

> [!NOTE]
> This article is relevant only for the data connector agent, and isn't relevant for the [SAP agentless solution](deployment-overview.md#data-connector) (limited preview).
>

## Prerequisites

- Before deploying your data connector, make sure to [create a virtual machine and configure access to your credentials](deploy-data-connector-agent-container.md#create-a-virtual-machine-and-configure-access-to-your-credentials).

- If you're using SNC for secure connections, make sure that your SAP system is configured properly, and then [prepare the kickstart script for secure communication with SNC](#prepare-the-kickstart-script-for-secure-communication-with-snc) before deploying the data connector agent.

    For more information, see the [SAP documentation](https://help.sap.com/docs/ABAP_PLATFORM_NEW/e73bba71770e4c0ca5fb2a3c17e8e229/e656f466e99a11d1a5b00000e835363f.html).

## Deploy the data connector agent using a managed identity or registered application

This procedure describes how to create a new agent and connect it to your SAP system via the command line, authenticating with a managed identity or a Microsoft Entra ID registered application.

- If you're using SNC, make sure that you've completed [Prepare the kickstart script for secure communication with SNC](#prepare-the-kickstart-script-for-secure-communication-with-snc) first.

- If you're using a configuration file to store your credentials, see [Deploy the data connector using a configuration file](#deploy-the-data-connector-using-a-configuration-file) instead.

**To deploy your data connector agent**:

1. Download and run the deployment kickstart script:

    - **For a managed identity**, use one of the following command options:

        - For the Azure public commercial cloud:

            ```bash
            wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh
            ```

        - For Microsoft Azure operated by 21Vianet, add `--cloud mooncake` to the end of the copied command.

        - For Azure Government - US, add `--cloud fairfax` to the end of the copied command.

    - **For a registered application**, use the following command to download the deployment kickstart script from the Microsoft Sentinel GitHub repository and mark it executable:

        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
        chmod +x ./sapcon-sentinel-kickstart.sh
        ```

        Run the script, specifying the application ID, secret (the "password"), tenant ID, and key vault name that you copied in the previous steps. For example:

        ```bash
        ./sapcon-sentinel-kickstart.sh --keymode kvsi --appid aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa --appsecret ssssssssssssssssssssssssssssssssss -tenantid bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb -kvaultname <key vault name>
        ```

    - **To configure secure SNC configuration**, specify the following base parameters:

        - `--use-snc`
        - `--cryptolib <path to sapcryptolib.so>`
        - `--sapgenpse <path to sapgenpse>`
        - `--server-cert <path to server certificate public key>`

        If the client certificate is in *.crt* or *.key* format, use the following switches:

        - `--client-cert <path to client certificate public key>`
        - `--client-key <path to client certificate private key>`

        If the client certificate is in *.pfx* or *.p12* format, use the following switches:

        - `--client-pfx <pfx filename>`
        - `--client-pfx-passwd <password>`

        If the client certificate was issued by an enterprise CA, add the following switch for each CA in the trust chain:

        - `--cacert <path to ca certificate>`

        For example:

        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
        chmod +x ./sapcon-sentinel-kickstart.sh    --use-snc     --cryptolib /home/azureuser/libsapcrypto.so     --sapgenpse /home/azureuser/sapgenpse     --client-cert /home/azureuser/client.crt --client-key /home/azureuser/client.key --cacert /home/azureuser/issuingca.crt    --cacert /home/azureuser/rootca.crt --server-cert /home/azureuser/server.crt
        ```

    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. Supply extra parameters to the script to minimize the number of prompts or to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

1. **Follow the on-screen instructions** to enter your SAP and key vault details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```bash
    The process has been successfully completed, thank you!
    ```

   Make a note of the Docker container name in the script output. To see the list of docker containers on your VM, run:

    ```bash
    docker ps -a
    ```

    You'll use the name of the docker container in the next step.

1. Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Log Analytics workspace enabled for Microsoft Sentinel, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

    To run the command in this step, you must be a resource group owner on the Log Analytics workspace enabled for Microsoft Sentinel. If you aren't a resource group owner on your workspace, this procedure can also be performed later on.

    Assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles to the VM's identity:

    1. <a name=agent-id-managed></a>Get the agent ID by running the following command, replacing the `<container_name>` placeholder with the name of the docker container that you'd created with the kickstart script:

        ```bash
        docker inspect <container_name> | grep -oP '"SENTINEL_AGENT_GUID=\K[^"]+
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
    |`<OBJ_ID>`     | Your VM identity object ID. <br><br>    To find your VM identity object ID in Azure: <br>- **For a managed identity**, the object ID is listed on the VM's **Identity** page. <br>- **For a service principal**, go to **Enterprise application** in Azure. Select **All applications** and then select your VM. The object ID is displayed on the **Overview** page.  |
    |`<SUB_ID>`     |    The subscription ID for you Log Analytics workspace enabled for Microsoft Sentinel    |
    |`<RESOURCE_GROUP_NAME>`     |  The resource group name for your Log Analytics workspace enabled for Microsoft Sentinel      |
    |`<WS_NAME>`     |    The name of your Log Analytics workspace enabled for Microsoft Sentinel     |
    |`<AGENT_IDENTIFIER>`     |   The agent ID displayed after running the command in the [previous step](#agent-id-managed).      |

1. To configure the Docker container to start automatically, run the following command, replacing the `<container-name>` placeholder with the name of your container:

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

The deployment procedure generates a [**systemconfig.json**](reference-systemconfig-json.md) file that contains the configuration details for the SAP data connector agent. The file is located in the `/sapcon-app/sapcon/config/system` directory on your VM.

## Deploy the data connector using a configuration file

Azure Key Vault is the recommended method to store your authentication credentials and configuration data. If you're prevented from using Azure Key Vault, this procedure describes how you can deploy the data connector agent container using a configuration file instead.

- If you're using SNC, make sure that you've completed [Prepare the kickstart script for secure communication with SNC](#prepare-the-kickstart-script-for-secure-communication-with-snc) first.

- If you're using a managed identity or registered application, see [Deploy the data connector agent using a managed identity or registered application](#deploy-the-data-connector-agent-using-a-managed-identity-or-registered-application) instead.

**To deploy your data connector agent**:

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

    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. Supply extra parameters to the script as needed to minimize the number of prompts or to customize the container deployment. For more information, see the [Kickstart script reference](reference-kickstart.md).

1. **Follow the on-screen instructions** to enter the requested details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```bash
    The process has been successfully completed, thank you!
    ```

   Make a note of the Docker container name in the script output. To see the list of docker containers on your VM, run:

    ```bash
    docker ps -a
    ```

    You'll use the name of the docker container in the next step.

1. Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Log Analytics workspace enabled for Microsoft Sentinel, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

    To run the commands in this step, you must be a resource group owner on your workspace. If you aren't a resource group owner on your workspace, this step can also be performed later on.

    Assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles to the VM's identity:

    1. <a name=agent-id-file></a>Get the agent ID by running the following command, replacing the `<container_name>` placeholder with the name of the docker container that you created with the Kickstart script:

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
        |`<OBJ_ID>`     | Your VM identity object ID. <br><br>    To find your VM identity object ID in Azure: For a managed identity, the object ID is listed on the VM's **Identity** page. For a service principal, go to **Enterprise application** in Azure. Select **All applications** and then select your VM. The object ID is displayed on the **Overview** page.  |
        |`<SUB_ID>`     |   The subscription ID for your Log Analytics workspace enabled for Microsoft Sentinel    |
        |`<RESOURCE_GROUP_NAME>`     |  The resource group name for your Log Analytics workspace enabled for Microsoft Sentinel       |
        |`<WS_NAME>`     |    The name of your Log Analytics workspace enabled for Microsoft Sentinel   |
        |`<AGENT_IDENTIFIER>`     |   The agent ID displayed after running the command in the [previous step](#agent-id-file).      |

1. Run the following command to configure the Docker container to start automatically.

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

The deployment procedure generates a [**systemconfig.json**](reference-systemconfig-json.md) file that contains the configuration details for the SAP data connector agent. The file is located in the `/sapcon-app/sapcon/config/system` directory on your VM.

## Prepare the kickstart script for secure communication with SNC

This procedure describes how to prepare the deployment script to configure settings for secure communications with your SAP system using SNC. If you're using SNC, you must perform this procedure before deploying the data connector agent.

**To configure the container for secure communication with SNC**:

1. Transfer the *libsapcrypto.so* and *sapgenpse* files to the system where you're creating the container.

1. Transfer the client certificate, including both private and public keys to the system where you're creating the container.

    The client certificate and key can be in *.p12*, *.pfx*, or Base64 *.crt* and *.key* format.

1. Transfer the server certificate (public key only) to the system where you're creating the container.

    The server certificate must be in Base64 *.crt* format.

1. If the client certificate was issued by an enterprise certification authority, transfer the issuing CA and root CA certificates to the system where you're creating the container.

1. Get the kickstart script from the Microsoft Sentinel GitHub repository:

    ```bash
    wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
    ```

1. Change the script's permissions to make it executable:

    ```bash
    chmod +x ./sapcon-sentinel-kickstart.sh
    ```

For more information, see [Kickstart deployment script reference for the Microsoft Sentinel for SAP applications data connector agent](reference-kickstart.md).

## Optimize SAP PAHI table monitoring (recommended)

For optimal results in monitoring the SAP PAHI table, open the **systemconfig.json** file for editing and under the `[ABAP Table Selector](reference-systemconfig-json.md#abap-table-selector)` section, enable both the `PAHI_FULL` and the `PAHI_INCREMENTAL` parameters.

For more information, see [Systemconfig.json file reference](reference-systemconfig-json.md#abap-table-selector) and [Verify that the PAHI table is updated at regular intervals](preparing-sap.md#verify-that-the-pahi-table-is-updated-at-regular-intervals).

## Check connectivity and health

After you deploy the SAP data connector agent, check your agent's health and connectivity. For more information, see [Monitor the health and role of your SAP systems](../monitor-sap-system-health.md).

## Next step

Once the connector is deployed, proceed to deploy Microsoft Sentinel solution for SAP applications content:
> [!div class="nextstepaction"]
> [Enable SAP detections and threat protection](deployment-solution-configuration.md)
