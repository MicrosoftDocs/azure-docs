---
title: Connect CEF data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect CEF data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/14/2019
ms.author: rkarlin

---
# Connect your external solution using Common Event Format



This article explains how to connect Azure Sentinel with your external security solutions that send Common Event Format (CEF) messages on top of Syslog. 

> [!NOTE] 
> Data is stored in the geographic location of the workspace on which you are running Azure Sentinel.

## How it works

You need to deploy an agent on a dedicated Linux machine (VM or on premises) to support the communication between the appliance and Azure Sentinel. The following diagram describes the setup in the event of a Linux VM in Azure.

 ![CEF in Azure](./media/connect-cef/cef-syslog-azure.png)

Alternatively, this setup will exist if you use a VM in another cloud, or an on-premises machine. 

 ![CEF on premises](./media/connect-cef/cef-syslog-onprem.png)


## Security considerations

Make sure to configure the machine's security according to your organization's security policy. For example, you can configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. You can use the following instructions to improve your machine security configuration:  [Secure VM in Azure](../virtual-machines/linux/security-policy.md), [Best practices for Network security](../security/fundamentals/network-best-practices.md).

To use TLS communication between the security solution and the Syslog machine, you will need to configure the Syslog daemon (rsyslog or syslog-ng) to communicate in TLS: [Encrypting Syslog Traffic with TLS -rsyslog](https://www.rsyslog.com/doc/v8-stable/tutorials/tls_cert_summary.html), [Encrypting log messages with TLS –syslog-ng](https://support.oneidentity.com/technical-documents/syslog-ng-open-source-edition/3.22/administration-guide/60#TOPIC-1209298).

 
## Prerequisites
Make sure the Linux machine you use as a proxy is running one of the following operating systems:

- 64-bit
  - CentOS 6 and 7
  - Amazon Linux 2017.09
  - Oracle Linux 6 and 7
  - Red Hat Enterprise Linux Server 6 and 7
  - Debian GNU/Linux 8 and 9
  - Ubuntu Linux 14.04 LTS, 16.04 LTS and 18.04 LTS
  - SUSE Linux Enterprise Server 12
- 32-bit
   - CentOS 6
   - Oracle Linux 6
   - Red Hat Enterprise Linux Server 6
   - Debian GNU/Linux 8 and 9
   - Ubuntu Linux 14.04 LTS and 16.04 LTS
 
 - Daemon versions
   - Syslog-ng: 2.1 - 3.22.1
   - Rsyslog: v8
  
 - Syslog RFCs supported
   - Syslog RFC 3164
   - Syslog RFC 5424
 
Make sure your machine also meets the following requirements: 
- Permissions
    - You must have elevated permissions (sudo) on your machine. 
- Software requirements
    - Make sure you have Python running on your machine
## STEP 1: Deploy the agent

In this step, you need to select hte Linux machine that will act as a proxy between Azure Sentinel and your security solution. You will have to run a script on the proxy machine that:
- Installs the Log Analytics agent and configures it as needed to listen for Syslog messages on port 514 over TCP and send the CEF messages to your Azure Sentinel workspace.
- Configures the Syslog daemon to forward CEF messages to the Log Analytics agent using port 25226.
- Sets the Syslog agent to collect the data and send it securely to Log Analytics, where it is parsed and enriched.
 
 
1. In the Azure Sentinel portal, click **Data connectors** and select **Common Event Format (CEF)** and then **Open connector page**. 

1. Under **Install and configure the Syslog agent**, select your machine type, either Azure, other cloud, or on-premises. 
   > [!NOTE]
   > Because the script in the next step installs the Log Analytics agent and connects the machine to your Azure Sentinel workspace, make sure this machine is not connected to any other workspace.
1. You must have elevated permissions (sudo) on your machine. Make sure that you have Python on your machine using the following command: `python –version`

1. Run the following script on your proxy machine.
   `sudo wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py [WorkspaceID] [Workspace Primary Key]`
1. While the script is running, check to make sure you don't get any error or warning messages.


## STEP 2: Configure your security solution to send CEF messages

1. On the appliance you need to set these values so that the appliance sends the necessary logs in the necessary format to the Azure Sentinel Syslog agent, based on the Log Analytics agent. You can modify these parameters in your appliance, as long as you also modify them in the Syslog daemon on the Azure Sentinel agent.
    - Protocol = TCP
    - Port = 514
    - Format = CEF
    - IP address - make sure to send the CEF messages to the IP address of the virtual machine you dedicated for this purpose.

   > [!NOTE]
   > This solution supports Syslog RFC 3164 or RFC 5424.


1. To use the relevant schema in Log Analytics for the CEF events, search for `CommonSecurityLog`.

## STEP 3: Validate connectivity

1. Open Log Analytics to make sure that logs are received using the CommonSecurityLog schema.<br> It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 

1. Before you run the script, we recommend that you send messages from your security solution to make sure they are being forwarded to the Syslog proxy machine you configured. 
1. You must have elevated permissions (sudo) on your machine. Make sure that you have Python on your machine using the following command: `python –version`
1. Run the following script to check connectivity between the agent, Azure Sentinel, and your security solution. It checks that the daemon forwarding is properly configured, listens on the correct ports, and that nothing is blocking communication between the daemon and the Log Analytics agent. The script also sends mock messages 'TestCommonEventFormat' to check end-to-end connectivity. <br>
 `sudo wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py [WorkspaceID]`


## Next steps
In this document, you learned how to connect CEF appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

