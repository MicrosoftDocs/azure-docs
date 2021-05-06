---
title: What's the difference between Azure Sentinel and Azure Security Center? 
description: Learn the difference between Azure Sentinel and Azure Security Center.
services: sentinel
author: yelevin
ms.service: azure-sentinel
ms.topic: overview
ms.custom: mvc
ms.date: 05/03/2021
ms.author: yelevin

---
# What's the difference between Azure Sentinel and Azure Security Center?

It's common to have a pre-defined perspective when you hear the word "security". Some people think of applications being configured correctly or insecure coding practices. Some people think of identity concepts like password spray attacks, phishing or multi factor authentication. And some people think of infrastructure concepts like networking, VPNs and port scanning. Security is all of these - and more.

 Microsoft helps you manage a layered approach to security with tools that integrate with your Azure and non-Azure workloads. Three common capabilities that are used in unison are Azure Security Center, Azure Defender and Azure Sentinel. So what's the difference between them and when would you use each product?


## Azure Security Center - Security Posture Management

This is your "base layer" for monitoring the security configuration and health of your workloads. Azure Security Center collects events from Azure or log analytics agents and correlates them in a security analytics engine, to provide you with tailored recommendations (hardening tasks). Strengthening your security posture can be achieved by implementing these recommendations. 


- The Azure Security Center uses a built-in Azure Policy initiative in audit-only mode (the Azure Security Benchmark) as well as Azure Monitor logs and other Azure security solutions like Microsoft Cloud App Security. 
- The free pricing tier of the Azure Security Center is enabled by default on all Azure subscriptions, once you visit the Azure Security Center in the portal for the first time (or activate it via the API). 
- Security Center automatically discovers and onboards Azure resources, including PaaS services in Azure (Service Fabric,  SQL Database etc). And you can include non-Azure resources via the Log Analytics agent and Azure Arc.
- Azure Security Center also includes a network map - an interactive graphical view of the network topology of your Azure workloads and the traffic routes. By default, the topology map displays resources that have network recommendations with high or medium severity.
- One of the most important features of Security Center is the pro-active security recommendations  for Azure Compute, data, identity and access and networking resources. Implementing these will improve your Secure Score - a visual indication of the improvement of your overall security posture. Learn more about the security recommendations.

## Azure Defender - Advanced Workload Protection

To add additional security alerts and advanced threat detection, certain types of resources can also be monitored by Azure Defender. The Azure Defender pane inside the Azure Security Center shows you which workloads are protected by Azure Defender or not. This is a paid service and turning on Azure Defender for servers (for example) applies to all servers in that Azure subscription, when they are running.

Azure Defender is available for servers, app service, Storage, SQL, Key Vault, Resource Manager, DNS, Kubernetes and container registries. It can also apply to non-Azure servers on-premises and in other clouds, via Azure Arc.



Lets look at some of the features you'd get for your Windows Server (as an example) by adding Azure Defender for servers:

- Security alerts: Appearing in Azure Security Center, security alerts detail the suspicious process executed, start time and MITRE ATT&CK tactic  - for Windows, Linux, Azure App Service, Containers (AKS), Containers (host level), SQL Database, Azure Synapse Analytics, Azure Resource Manager, DNS, Azure Storage, Cosmos DB (preview), Azure network layer, Azure key vault and Azure DDoS Protection. For more information, see Security alerts - a reference guide. 
- Vulnerability assessment - Your VM is scanned for artefacts which are analysed by Qualys' cloud service and the results sent back to Azure Security Center. These results show if any vulnerabilities have been identified in the software running on your VM (including its operating system), highlighting the highest priorities and including the latest available patches. The cost of this service is included in your Azure Defender pricing. For more details, visit Azure Defender's integrated vulnerability assessment solution for Azure and hybrid machines. 
- Just in time access - JIT VM access enables you to lock down standard inbound management ports (such as port 3389) and easily open them when requested by an appropriate user, to their connection only (or IP range), for a limited period of time. Then the ports are automatically locked down again. This includes an approval process and no manual configuration of Network Security Groups or Azure Firewall. For more information, visit Understanding just-in-time (JIT) VM access. 
- Adaptive application controls - This feature provides an intelligent and automated allow list of known-safe applications for your VM. Machine learning analysis your workload to detect what is common or known in your organisation (which you can further customize) and you'll get security alerts if any other applications are run that are not on the allow list. Learn more at Use adaptive controls to reduce your machines' attack surface. 
- Azure Defender for servers also includes file integrity monitoring, adaptive network hardening and Docker host hardening. For more information on these capabilities and the other Azure Defender workload types and features, visit Introduction to Azure Defender. 


So far so good! Our VM is being monitored by Azure Security Center protecting all the VMs in our subscription, and we've added Azure Defender for servers for vulnerability scanning, adaptive application and network control and just in time access to management ports. What about Azure Sentinel?


## Azure Sentinel SIEM/SOAR

Azure Sentinel Security Information Event Management (SIEM) and Security Orchestration Automated Response (SOAR) helps you to bring in the big picture of what's happening across your environment and connect the dots that might be related to the same security incident. While I've mentioned Azure and on-premises workloads so far, there's often more to your IT footprint than that - Microsoft 365, Azure Active Directory, Amazon Web Services - CloudTrail, Citrix Analytics, VMWare Carbon Black Cloud Endpoint, and third party firewalls and proxies, just to name a few examples. 

With all of those different data sources connected, Azure Sentinel uses AI and Microsoft's threat intelligence stream to detect threats across your environment, correlate alerts into incidents, use deep investigation tools to find the scope and root cause and access powerful hunting search and query tools. Now you're no longer having to search through logs separately in different systems, trying to decide what may be relevant and what is just noise, while trying to compare time stamps to link to the same possible event.

In addition, Azure Sentinel supports playbooks with Azure Logic Apps - build your own automated workflows to open tickets, send notifications or trigger actions when particular events are detected.

## Summary 

Now you can choose which workloads need the added protection of Azure Defender and which workloads should be included for visibility in Azure Sentinel, for comprehensive security management across your entire IT environment.

## Next steps

- Watch these videos to learn about protecting hybrid environments with Azure Sentinel and Azure Security Center:

    - [OPS101](https://techcommunity.microsoft.com/t5/itops-talk-blog/ops101-securing-your-hybrid-environment-part-1-azure-security/ba-p/2103250?WT.mc_id=modinfra-17262-socuff): Security for your Hybrid environment Part 1 - Azure Security Center
    - [OPS103](https://techcommunity.microsoft.com/t5/itops-talk-blog/ops103-securing-your-hybrid-environment-part-2-azure-sentinel/ba-p/2103853?Wt.mc_id=modinfra-17262-socuff): Security your Hybrid environment Part 2 - Azure Sentinel


- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).