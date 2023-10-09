---
title: Azure Firewall with Microsoft Sentinel overview
description: This article shows you how you can optimize security using the Azure Firewall solution for Microsoft Sentinel.
author: vhorne
ms.author: victorh
ms.service: firewall
ms.topic: concept-article
ms.date: 10/09/2023
---

# Azure Firewall with Microsoft Sentinel overview

You can now get both detection and prevention in the form of an easy-to-deploy Azure Firewall solution for Azure Sentinel.

Security is a constant balance between proactive and reactive defenses. They're both equally important, and neither can be neglected. Effectively protecting your organization means constantly optimizing both prevention and detection.

Combining prevention and detection allows you to ensure that you both prevent sophisticated threats when you can, while also maintaining an *assume breach mentality* to detect and quickly respond to cyber attacks.


## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

<!-- 4. H2s (Article body)
--------------------------------------------------------------------

Required: In a series of H2 sections, the article body should discuss the ideas that explain how "X is a (type of) Y that does Z":

* Give each H2 a heading that sets expectations for the content that follows.
* Follow the H2 headings with a sentence about how the section contributes to the whole.
* Describe the concept's critical features in the context of defining what it is.
* Provide an example of how it's used where, how it fits into the context, or what it does. If it's complex and new to the user, show at least two examples.
* Provide a non-example if contrasting it will make it clearer to the user what the concept is.
* Images, code blocks, or other graphical elements come after the text block it illustrates.
* Don't number H2s.

-->

## Key capabilities
When you integrate Azure Firewall with Microsoft Sentinel, you enable the following capabilities:

- Monitoring and visualizing Azure Firewall activities
- Detecting threats and applying AI-assisted investigation capabilities
- Automating response and correlation to other sources 

The whole experience is packaged as a solution in the Microsoft Sentinel marketplace, which means it can be deployed relatively easily.

## Deploy and enable the Azure Firewall solution for Microsoft Sentinel

You can quickly deploy the solution from the Content hub. From your Microsoft Sentinel workspace, select **Analytics** and then **More content at Content hub**.  Search for and select **Azure Firewall** and select **Install**.

Once installed, select **Manage** follow all the steps in the wizard, pass validation, and create the solution. With just a few selections all content, including connectors, detections, workbooks, and playbooks are deployed in your Microsoft Sentinel workspace.

## Monitor and visualize Azure Firewall activities

The Azure Firewall workbook allows you to visualize Azure Firewall events. With this workbook, you can:

- Learn about your application and network rules
- See statistics for firewall activities across URLs, ports, and addresses
- Filter by firewall and resource group
- Dynamically filter per category with easy-to-read data sets when investigating an issue in the logs.

The workbook provides a single dashboard for ongoing monitoring of your firewall activity. When it comes to threat detection, investigation, and response, the Azure Firewall solution also provides built-in detection and hunting capabilities.

## Detect threats and use AI-assisted investigation capabilities

The solution’s detection rules provide Microsoft Sentinel a powerful method for analyzing Azure Firewall signals to detect traffic representing malicious activity patterns traversing through the network. This allows rapid response and remediation of the threats.

The attack stages an adversary pursues within the firewall solution are segmented based on the [MITRE ATT&CK](https://attack.mitre.org/) framework. The MITRE framework is a series of steps that trace stages of a cyberattack from the early reconnaissance stages to the exfiltration of data. The framework helps defenders understand and combat ransomware, security breaches, and advanced attacks.

The solution includes detections for common scenarios an adversary might use as part of the attack, spanning from the discovery stage (gaining knowledge about the system and internal network) through the command-and-control (C2) stage (communicating with compromised systems to control them) to the exfiltration stage (adversary trying to steal data from the organization).

| Detection rule | What does it do? | What does it indicate? |
| --- | --- | --- |
| Port scan | Identifies a source IP scanning multiple open ports on the Azure Firewall. | Malicious scanning of ports by an attacker, trying to reveal open ports in the organization that can be compromised for initial access. |
| Port sweep | Identifies a source IP scanning the same open ports on the Azure Firewall different IPs. | Malicious scanning of a port by an attacker trying to reveal IPs with specific vulnerable ports open in the organization. |
| Abnormal deny rate for source IP | Identifies an abnormal deny rate for a specific source IP to a destination IP based on machine learning done during a configured period. | Potential exfiltration, initial access, or C2, where an attacker tries to exploit the same vulnerability on machines in the organization but Azure Firewall rules blocks it. |
| Abnormal Port to protocol | Identifies communication for a well-known protocol over a nonstandard port based on machine learning done during an activity period. | Malicious communication (C2) or exfiltration by attackers trying to communicate over known ports (SSH, HTTP) but don’t use the known protocol headers that match the port number. |
| Multiple sources affected by the same TI destination | Identifies multiple machines that are trying to reach out to the same destination blocked by threat intelligence (TI) in the Azure Firewall. | An attack on the organization by the same attack group trying to exfiltrate data from the organization. |

### Hunting queries

Hunting queries are a tool for the security researcher to look for threats in the network of an organization, either after an incident has occurred or proactively to discover new or unknown attacks. To do this, security researchers look at several indicators of compromise (IOCs). The built-in Azure Sentinel hunting queries in the Azure Firewall solution give security researchers the tools they need to find high-impact activities from the firewall logs. Several examples include:

| Hunting query | What does it do? | What does it indicate? |
| --- | --- | --- |
| First time a source IP connects to destination port | Helps to identify a common indication of an attack (IOA) when a new host or IP tries to communicate with a destination using a specific port. | Based on learning the regular traffic during a specified period. |
| First time source IP connects to a destination | Helps to identify an IOA when malicious communication is done for the first time from machines that never accessed the destination before. | Based on learning the regular traffic during a specified period. |
| Source IP abnormally connects to multiple destinations | Identifies a source IP that abnormally connects to multiple destinations. | Indicates initial access attempts by attackers trying to jump between different machines in the organization, exploiting lateral movement path or the same vulnerability on different machines to find vulnerable machines to access. |
| Uncommon port for the organization | Identifies abnormal ports used in the organization network. | An attacker can bypass monitored ports and send data through uncommon ports. This allows the attackers to evade detection from routine detection systems. |
| Uncommon port connection to destination IP | Identifies abnormal ports used by machines to connect to a destination IP. | An attacker can bypass monitored ports and send data through uncommon ports. This can also indicate an exfiltration attack from machines in the organization by using a port that has never been used on the machine for communication. |

### Automate response and correlation to other sources

Lastly, the Azure Firewall also includes Azure Sentinel playbooks, which enable you to automate response to threats. For example, say the firewall logs an event where a particular device on the network tries to communicate with the Internet via the HTTP protocol over a nonstandard TCP port. This action triggers a detection in Azure Sentinel. The playbook automates a notification to the security operations team via Microsoft Teams, and the security analysts can block the source IP address of the device with a single selection. This prevents it from accessing the Internet until an investigation can be completed. Playbooks allow this process to be much more efficient and streamlined.

## Real world example

Let’s look at what the fully integrated solution looks like in a real-world scenario.

### The attack and initial prevention by Azure Firewall

A sales representative in the company has accidentally opened a phishing email and opened a PDF file containing malware. The malware immediately tried to connect to a malicious website but Azure Firewall blocks it. The firewall detected the domain using the Microsoft threat intelligence feed it consumes.

### The response

The connection attempt triggers a detection in Azure Sentinel and starts the playbook automation process to notify the security operations team via a Teams channel. There, the analyst can block the computer from communicating with the Internet. The security operations team then notifies the IT department which removes the malware from the sales representative’s computer. However, taking the proactive approach and looking deeper, the security researcher applies the Azure Firewall hunting queries and runs the **Source IP abnormally connects to multiple destinations** query. This reveals that the malware on the infected computer tried to communicate with several other devices on the broader network and tried to access several of them. One of those access attempts succeeded, as there was no proper network segmentation to prevent the lateral movement in the network, and the new device had a known vulnerability the malware exploited to infect it.

## The result

The security researcher removed the malware from the new device, completed mitigating the attack, and discovered a network weakness in the process.

## Next step


> [!div class="nextstepaction"]
> [Learn more about Microsoft Sentinel](../sentinel/overview.md)
> [Microsoft security](https://www.microsoft.com/en-us/security/business)
