---
title: "[Deprecated] Cisco Firepower eStreamer via Legacy Agent connector for Microsoft Sentinel"
description: "Learn how to install the connector [Deprecated] Cisco Firepower eStreamer via Legacy Agent to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# [Deprecated] Cisco Firepower eStreamer via Legacy Agent connector for Microsoft Sentinel

eStreamer is a Client Server API designed for the Cisco Firepower NGFW Solution. The eStreamer client requests detailed event data on behalf of the SIEM or logging solution in the Common Event Format (CEF).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (CiscoFirepowerEstreamerCEF)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Cisco](https://www.cisco.com/c/en_in/support/index.html) |

## Query samples

**Firewall Blocked Events**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Cisco"

   | where DeviceProduct == "Firepower" 
   | where DeviceAction != "Allow"
   ```

**File Malware Events**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Cisco"

   | where DeviceProduct == "Firepower" 
   | where Activity == "File Malware Event"
   ```

**Outbound Web Traffic Port 80**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "Cisco"

   | where DeviceProduct == "Firepower" 
   | where DestinationPort == "80"
   ```



## Vendor installation instructions

1. Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.1 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your security solution and Microsoft Sentinel this machine can be on your on-prem environment, Azure or other clouds.

1.2 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 25226 TCP.

> 1. Make sure that you have Python on your machine using the following command: python -version.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Install the Firepower eNcore client

Install and configure the Firepower eNcore eStreamer client, for more details see full install [guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html)

2.1 Download the Firepower Connector from github

Download the latest version of the Firepower eNcore connector for Microsoft Sentinel [here](https://github.com/CiscoSecurity/fp-05-microsoft-sentinel-connector).  If you plan on using python3 use the [python3 eStreamer connector](https://github.com/CiscoSecurity/fp-05-microsoft-sentinel-connector/tree/python3)

2.2 Create a pkcs12 file using the Azure/VM Ip Address

Create a pkcs12 certificate using the public IP of the VM instance in Firepower under System->Integration->eStreamer, for more information please see install [guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html#_Toc527049443)

2.3  Test Connectivity between the Azure/VM Client and the FMC

Copy the pkcs12 file from the FMC to the Azure/VM instance and run the test utility (./encore.sh test) to ensure a connection can be established, for more details please see the setup [guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html#_Toc527049430)

2.4 Configure encore to stream data to the agent

Configure encore to stream data via TCP to the Microsoft Agent, this should be enabled by default, however, additional ports and streaming protocols can configured depending on your network security posture, it is also possible to save the data to the file system, for more information please see [Configure Encore](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html#_Toc527049433)

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   `sudo wget  -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py  {0}`

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cisco.cisco-firepower-estreamer?tab=Overview) in the Azure Marketplace.
