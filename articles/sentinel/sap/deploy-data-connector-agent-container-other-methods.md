---
title: Microsoft Sentinel solution for SAP® applications - manually deploy and configure the SAP data connector agent container using the command line
description: This article shows you how to manually deploy the container that hosts the SAP data connector agent, using the Azure command line interface, in order to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel Solution for SAP.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom:
ms.date: 01/03/2024
---

# Manually deploy and configure the container hosting the SAP data connector agent

This article shows you how to use the Azure command line interface to deploy the container that hosts the SAP data connector agent, and create new SAP systems under the agent. You use this connector agent to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel Solution for SAP. 

Other ways to deploy the container and create SAP systems using the Azure portal or a *kickstart* script are described in [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md). These other methods make use of an Azure Key Vault to store SAP credentials, and are highly preferred over the method described here. You should use the manual deployment method only if none of the other options are available to you.

## Deployment milestones

Deployment of the Microsoft Sentinel Solution for SAP is divided into the following sections

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Prepare SAP environment](preparing-sap.md)

1. [Deploy the Microsoft Sentinel solution for SAP applications® from the content hub](deploy-sap-security-content.md) 

1. **Deploy data connector agent (*You are here*)**

1. [Configure Microsoft Sentinel Solution for SAP](deployment-solution-configuration.md)

1. Optional deployment steps
   - [Configure auditing](configure-audit.md)
   - [Configure SAP data connector to use SNC](configure-snc.md)

## Data connector agent deployment overview

Read about the [deployment process](deploy-data-connector-agent-container.md#data-connector-agent-deployment-overview).

## Prerequisites

Read about the [prerequisites for deploying the agent container](deploy-data-connector-agent-container.md#prerequisites).

## Deploy the data connector agent container manually

1. Transfer the [SAP NetWeaver SDK](https://aka.ms/sap-sdk-download) to the machine on which you want to install the agent.

1. Install [Docker](https://www.docker.com/) on the VM, following the [recommended deployment steps](https://docs.docker.com/engine/install/) for the chosen operating system.

1. Use the following commands (replacing `<SID>` with the name of the SAP instance) to create a folder to store the container configuration and metadata, and to download a sample systemconfig.json file (for older versions use the systemconfig.ini file) into that folder.

   ```bash
   sid=<SID>
   mkdir -p /opt/sapcon/$sid
   cd /opt/sapcon/$sid
   wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/template/systemconfig.json
   ```

   For agent versions released before June 22, 2023, use systemconfig.ini instead of systemconfig.json. Substitute the following line for the last line in the previous code block.

   ```bash
   wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/template/systemconfig.ini 
   ```

1. Edit the systemconfig.ini file to [configure the relevant settings](reference-systemconfig.md).

1. Run the following commands (replacing `<SID>` with the name of the SAP instance) to retrieve the latest container image, create a new container, and configure it to start automatically.

   ```bash
   sid=<SID>
   docker pull mcr.microsoft.com/azure-sentinel/solutions/sapcon:latest
   docker create --restart unless-stopped --name my-container mcr.microsoft.com/azure-sentinel/solutions/sapcon   
   ```

1. Run the following command to copy the SDK into the container. Replace `<SID>` with the name of the SAP instance and `<sdkfilename>` with full filename of the SAP NetWeaver SDK.

   ```bash
   sdkfile=<sdkfilename> 
   sid=<SID>
   docker cp $sdkfile sapcon-$sid:/sapcon-app/inst/
   ```

1. Run the following command (replacing `<SID>` with the name of the SAP instance) to start the container.

   ```bash
   sid=<SID>
   docker start sapcon-$sid
   ```

<!-- --- -->

## Next steps

Once the connector is deployed, proceed to deploy Microsoft Sentinel Solution for SAP content:
> [!div class="nextstepaction"]
> [Deploy the solution content from the content hub](deploy-sap-security-content.md)
