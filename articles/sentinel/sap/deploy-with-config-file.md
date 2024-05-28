---
title: Deploy and configure the SAP data connector agent container with a configuration file | Microsoft Sentinel
description: This article describes how to deploy the container that hosts the SAP data connector agent with a configuration file as part of the Microsoft Sentinel Solution for SAP.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 05/28/2024
#customerIntent: As a security operator, I want to deploy the container that hosts the SAP data connector agent with a configuration file, since we're unable to use , so that I can ingest SAP data into Microsoft Sentinel.
---

# Deploy and configure the SAP data connector agent container with a configuration file

Key Vault is the recommended method to store your authentication credentials and configuration data.

If you are prevented from using Azure Key Vault, you can use a configuration file instead.

## Prerequisites


## Create a virtual machine and configure access to your credentials

1. Create a virtual machine on which to deploy the agent.
1. Continue with deploying the data connector agent using the configuration file. For more information, see [Deploy the data connector agent](#deploy-the-data-connector-agent) and [Command line options](#command-line-options).

The configuration file is generated during the agent deployment. For more information, see:

- [Systemconfig.json file reference](reference-systemconfig-json.md) (for versions deployed June 22 or later).
- [Systemconfig.ini file reference](reference-systemconfig.md) (for agent versions deployed before June 22, 2023).

# [Deploy with a configuration file](#tab/deploy-cli-config-file)

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

    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. You can supply additional parameters to the script to minimize the number of prompts or to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

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