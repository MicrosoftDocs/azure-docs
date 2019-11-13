---
title: Connect Palo Alto Networks data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Palo Alto Networks data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: a4b21d67-1a72-40ec-bfce-d79a8707b4e1
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/13/2019
ms.author: rkarlin

---
# Connect Palo Alto Networks to Azure Sentinel



This article explains how to connect your Palo Alto Networks appliance to Azure Sentinel. The Palo Alto Networks data connector allows you to easily connect your Palo Alto Networks logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Using Palo Alto Networks on Azure Sentinel will provide you more insights into your organization’s Internet usage, and will enhance its security operation capabilities.​ 


## How it works

You need to deploy an agent on a dedicated Linux machine (VM or on premises) to support the communication between Palo Alto Networks and Azure Sentinel. The following diagram describes the setup in the event of a Linux VM in Azure.

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

In this step, you need to select the Linux machine that will act as a proxy between Azure Sentinel and your security solution. You will have to run a script on the proxy machine that:
- Installs the Log Analytics agent and configures it as needed to listen for Syslog messages on port 514 over TCP and send the CEF messages to your Azure Sentinel workspace.
- Configures the Syslog daemon to forward CEF messages to the Log Analytics agent using port 25226.
- Sets the Syslog agent to collect the data and send it securely to Log Analytics, where it is parsed and enriched.
 
 
1. In the Azure Sentinel portal, click **Data connectors** and select **Palo Alto Networks** and then **Open connector page**. 

1. Under **Install and configure the Syslog agent**, select your machine type, either Azure, other cloud, or on-premises. 
   > [!NOTE]
   > Because the script in the next step installs the Log Analytics agent and connects the machine to your Azure Sentinel workspace, make sure this machine is not connected to any other workspace.
1. You must have elevated permissions (sudo) on your machine. Make sure that you have Python on your machine using the following command: `python –version`

1. Run the following script on your proxy machine.
   `sudo wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py [WorkspaceID] [Workspace Primary Key]`
1. While the script is running, check to make sure you don't get any error or warning messages.


 
## STEP 2: Forward Palo Alto Networks logs to the Syslog agent

Configure Palo Alto Networks to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent:
1.  Go to [Common Event Format (CEF) Configuration Guides](https://docs.paloaltonetworks.com/resources/cef) and download the pdf for your appliance type. Follow all the instructions in the guide to set up your Palo Alto Networks appliance to collect CEF events. 

1.  Go to [Configure Syslog monitoring](https://aka.ms/asi-syslog-paloalto-forwarding) and follow steps 2 and 3 to configure CEF event forwarding from your Palo Alto Networks appliance to Azure Sentinel.

    1. Make sure to set the **Syslog server format** to **BSD**.

       > [!NOTE]
       > The copy/paste operations from the PDF might change the text and insert random characters. To avoid this, copy the text to an editor and remove any characters that might break the log format before pasting it, as you can see in this example.
 
        ![CEF text copy problem](./media/connect-cef/paloalto-text-prob1.png)

2. To use the relevant schema in Log Analytics for the Palo Alto Networks events, search for **CommonSecurityLog**.

## STEP 3: Validate connectivity

1. Open Log Analytics to make sure that logs are received using the CommonSecurityLog schema.<br> It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 

1. Before you run the script, we recommend that you send messages from your security solution to make sure they are being forwarded to the Syslog proxy machine you configured. 
1. You must have elevated permissions (sudo) on your machine. Make sure that you have Python on your machine using the following command: `python –version`
1. Run the following script to check connectivity between the agent, Azure Sentinel, and your security solution. It checks that the daemon forwarding is properly configured, listens on the correct ports, and that nothing is blocking communication between the daemon and the Log Analytics agent. The script also sends mock messages 'TestCommonEventFormat' to check end-to-end connectivity. <br>
 `sudo wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py [WorkspaceID]`







## Next steps
In this document, you learned how to connect Palo Alto Networks appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).

