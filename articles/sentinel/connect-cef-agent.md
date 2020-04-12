---
title: Deploy the agent to connect CEF data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to deploy the agent to connect CEF data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2020
ms.author: yelevin

---
# Step 1: Deploy the log forwarder


In this step, you will designate and configure the Linux machine that will forward the logs from your security solution to your Azure Sentinel workspace. This machine can be a physical or virtual machine in your on-premises environment, an Azure VM, or a VM in another cloud. Using the link provided, you will run a script on the designated machine that performs the following tasks:
- Installs the Log Analytics agent for Linux (also known as the OMS agent) and configures it for the following purposes:
    - listening for CEF messages from the built-in Linux Syslog daemon on TCP port 25226
    - sending the messages securely over TLS to your Azure Sentinel workspace, where they are parsed and enriched
- Configures the built-in Linux Syslog daemon (rsyslog.d/syslog-ng) for the following purposes:
    - listening for Syslog messages from your security solutions on TCP port 514
    - forwarding only the messages it identifies as CEF to the Log Analytics agent on localhost using TCP port 25226
 
## Prerequisites

- You must have elevated permissions (sudo) on your designated Linux machine.
- You must have python installed on the Linux machine.<br>Use the `python -version` command to check.
- The Linux machine must not be connected to any Azure workspaces before you install the Log Analytics agent.

## Run the deployment script
 
1. From the Azure Sentinel navigation menu, click **Data connectors**. From the list of connectors, click the **Common Event Format (CEF)** tile, and then the **Open connector page** button on the lower right. 

1. Under **1.2 Install the CEF collector on the Linux machine**, copy the link provided under **Run the following script to install and apply the CEF collector**, or from the text below:

     `sudo wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py [WorkspaceID] [Workspace Primary Key]`

1. While the script is running, check to make sure you don't get any error or warning messages.

Continue to [STEP 2: Configure your security solution to forward CEF messages](connect-cef-solution-config.md) .

## Deployment script explained

The following is a command-by-command description of the actions of the deployment script.

**Downloading and installing the Log Analytics agent:**


|Action        |Command            |
|--------------|-------------------|
|Downloads the installation script for the Log Analytics (OMS) Linux agent|`wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh`|
|Installs the Log Analytics agent|`sh onboard_agent.sh -w [workspaceID] -s [Primary Key] -d opinsights.azure.com`|

**Configuring the Syslog daemon:**
|Action        |rsyslog daemon    |syslog-ng daemon  |
|--------------|-------------------|-------------------|
|Open port 514 for TCP communication<br>using syslog configuration file|`/etc/rsyslog.conf`|`/etc/syslog-ng/syslog-ng.conf`|
|Configure the daemon to forward CEF messages<br>to the Log Analytics agent on localhost, on TCP port 25226, by inserting a special omsagent configuration file into the syslog daemon directory|`/etc/rsyslog.d/security-config-omsagent.conf`|`/etc/syslog-ng/conf.d/security-config-omsagent.conf`|
|File contents:|`:rawmsg, regex, "CEF\|ASA" ~`<br>`*.* @@127.0.0.1:25226`|`filter f_oms_filter {match(\"CEF\|ASA\" ) ;};`<br>
        - syslog-ng: 

## Next steps
In this document, you learned how to deploy the Log Analytics agent to connect CEF appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

