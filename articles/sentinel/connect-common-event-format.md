---
title: Connect CEF data to Azure Sentinel Preview| Microsoft Docs
description: Connect an external solution that sends Common Event Format (CEF) messages to Azure Sentinel by using a Linux machine as a log forwarder.
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
ms.date: 10/01/2020
ms.author: yelevin

---
# Connect your external solution using Common Event Format

When you connect an external solution that sends CEF messages, there are three steps to connecting with Azure Sentinel:

STEP 1: [Connect CEF by deploying a Syslog/CEF forwarder](connect-cef-agent.md)
STEP 2: [Perform solution-specific steps](connect-cef-solution-config.md)
STEP 3: [Verify connectivity](connect-cef-verify.md)

This article describes how the connection works, provides prerequisites, and provides the steps for deploying the agent on security solutions that send Common Event Format (CEF) messages on top of Syslog. 

> [!NOTE] 
> Data is stored in the geographic location of the workspace on which you are running Azure Sentinel.

In order to make this connection, you need to deploy a Syslog Forwarder server to support the communication between the appliance and Azure Sentinel.  The server consists of a dedicated Linux machine (VM or on-premises) with the Log Analytics agent for Linux installed. 

The following diagram describes the setup in the event of a Linux VM in Azure:

 ![CEF in Azure](./media/connect-cef/cef-syslog-azure.png)

Alternatively, this setup will exist if you use a VM in another cloud, or an on-premises machine: 

 ![CEF on premises](./media/connect-cef/cef-syslog-onprem.png)

## Security considerations

Make sure to configure the machine's security according to your organization's security policy. For example, you can configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. You can use the following instructions to improve your machine security configuration:  [Secure VM in Azure](../virtual-machines/security-policy.md), [Best practices for Network security](../security/fundamentals/network-best-practices.md).

To use TLS communication between the Syslog source and the Syslog Forwarder, you will need to configure the Syslog daemon (rsyslog or syslog-ng) to communicate in TLS: [Encrypting Syslog Traffic with TLS -rsyslog](https://www.rsyslog.com/doc/v8-stable/tutorials/tls_cert_summary.html), [Encrypting log messages with TLS –syslog-ng](https://support.oneidentity.com/technical-documents/syslog-ng-open-source-edition/3.22/administration-guide/60#TOPIC-1209298).
 
## Prerequisites

Make sure the Linux machine you use as a log forwarder is running one of the following operating systems:

- 64-bit
  - CentOS 7 and 8, including sub-versions (not 6)
  - Amazon Linux 2017.09
  - Oracle Linux 7
  - Red Hat Enterprise Linux (RHEL) Server 7 and 8, including sub-versions (not 6)
  - Debian GNU/Linux 8, 9, and 10
  - Ubuntu Linux 14.04 LTS, 16.04 LTS and 18.04 LTS
  - SUSE Linux Enterprise Server 12 - 15

- 32-bit
  - CentOS 7 and 8, including sub-versions (not 6)
  - Oracle Linux 7
  - Red Hat Enterprise Linux (RHEL) Server 7 and 8, including sub-versions (not 6)
  - Debian GNU/Linux 8, 9, and 10
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
  - Make sure you have python 2.7 running on your machine.

## Next steps

In this document, you learned how Azure Sentinel collects CEF logs from security solutions and appliances. To learn how to connect your solution to Azure Sentinel, see the following articles:

- STEP 1: [Connect CEF by deploying a Syslog/CEF forwarder](connect-cef-agent.md)
- STEP 2: [Perform solution-specific steps](connect-cef-solution-config.md)
- STEP 3: [Verify connectivity](connect-cef-verify.md)

To learn more about what to do with the data you've collected in Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

