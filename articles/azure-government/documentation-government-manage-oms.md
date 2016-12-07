---
title: Azure Government OMS | Microsoft Docs
description: This article describes the Scenario of OMS applicable to US Government agencies and solution providers
services: Azure-Government
cloud: gov
documentationcenter: ''
author: sacha
manager: jobruno
editor: ''
---

# Azure Government Cybersecurity: Monitoring and securing your assets with Operations Management Suite (OMS)

## Cybersecurity in the cloud
A crucial concern for our customers who are moving to the cloud is retaining asset management and security of the Azure Government services that they've deployed to the Cloud. Virtual machine firewalls need to be configured correctly. Virtual networks need to have the right Network Security Groups applied to them. Access to your assets needs to be locked down at the right time. All of these  necessary work streams need to be planned, designed, and provisioned to enable a secure infrastructure for your agency to use.

Setting up this kind of environment can be challenging. Onboarding your fleet of servers to any monitoring service is hard to scale, and in can also be challenging to update the monitoring service. Monitoring infrastructure on different cloud providers as well as across the cloud and on-premises is difficult. Finally, keeping your monitoring up-to-date and enabling insights to monitor, detect, alert, and action against cybersecurity threats requires time, resources, and compute power.

## Microsoft Operations Management Suite (OMS)
Microsoft Operations Management Suite, now available in Azure Government, is a service that enables you to do all of these things by leveraging the power of map reduce and machine learning as a service.

OMS can:

* Deploy agents to individual VMs (Linux and Windows) on Azure, other cloud providers, and/or on-premises.
* Connect your existing logs via an Azure Government Storage Account or SCOM endpoint with existing logging data.
* Run evergreen machine learning and map reduce services that are powered by hyper-scale log search to expose threats in your environment out-of-the-box.

Let's explore how we can get OMS integrated into your fleet and look at some of the out-of-box solutions that can address the previous concerns.

## Onboard servers to OMS
The first step in integrating your cloud assets with Operations Management Suite is installing the OMS agent across log sources. For virtual machines, this is very simple because you can manually download the agent from your OMS workspace.

![Figure 1: Windows Servers connected to OMS](./media/documentation-government-oms-figure1.png)
<p align="center">Figure 1: Windows Servers connected to OMS</p>

You can connect Azure VMs to OMS directly through the Azure portal. For instructions, see [New ways to enable Log Analytics (OMS) on your Azure VMs](https://blogs.technet.microsoft.com/momteam/2016/02/10/new-ways-to-enable-log-analytics-oms-on-your-azure-vms/).

You can also connect them programmatically or configure the OMS extension right into your Azure Resource Manager templates. See the instructions for Windows-based machines at [Connect Windows computers to Log Analytics](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-windows-agents) and for Linux-based machines at [Connect Linux computers to Log Analytics](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-linux-agents).

## Onboard Storage Accounts and SCOM to OMS
OMS can also connect to your Storage Account and/or existing SCOM 2013 deployments to offer you operations management in hybrid scenarios (across cloud providers or in cloud/on-premises infrastructures).

![Figure 2: Connecting Azure Storage and SCOM to OMS](./media/documentation-government-oms-figure2.png)
<p align="center">Figure 2: Connecting Azure Storage and SCOM to OMS</p>

OMS also supports logging information from other monitoring services like Chef or Puppet. Furthermore, for Azure deployments, we also have VMs with OMS-enabled Azure Resource Manager templates so you can deploy Compute and onboard to your OMS workspace at the same time.

![Figure 3: Azure Resource Manager templates for Azure VMs with OMS extension](./media/documentation-government-oms-figure3a.png)
![Figure 3: Azure Resource Manager templates for Azure VMs with OMS extension](./media/documentation-government-oms-figure3b.png)
<p align="center">Figure 3: Azure Resource Manager templates for Azure VMs with OMS extension</p>

Information on setting up OMS with your existing SCOM implementation on premises can be found [here](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-om-agents).

## Leverage intelligence through OMS Solution Packs
Now that you have various sources of logging data there arises a separate problem – making sense of all this data.
OMS, at its’ core, is a log search service that lets you write powerful queries to very quickly search across thousands or even millions of logs. However, discovering the issues that you need to write queries for is very difficult.

Enter OMS solutions – packs of queries integrated natively with OMS map reduce and machine learning tech to proactively give you insights into your OMS managed fleet.

Along the theme of cyber security – I’ll briefly discuss three cybersecurity scenarios that OMS can solve out-of-the-box for you.

###Antimalware assessment
Antimalware Assessments gives you a pre-canned set of queries, notifications, and monitoring dashboards to give you, at glance, how well your fleet is protected against malware.

This dashboard gives you 4 things:
* Any servers that have active and/or remediated threats.
* Currently detected threats
* Computers that aren’t being sufficiently protected. OMS does this by crawling the logs of your computers and look for any site of FWs being opened and/or improperly configured rules in common web browsers.
* Analysis on how your protected servers are being protected. For example – by native Windows OS virus protection and/or something like
System Center Endpoint Protection.

For example, below – you can see a threat was caught and automatically triaged by Systems Center:

![Figure 4: OMS Antimalware Assessment solution](./media/documentation-government-oms-figure4.png)
<p align="center">Figure 4: OMS Antimalware Assessment solution</p>

More information on Antimalware Assessment can be found here: [https://azure.microsoft.com/en-us/documentation/articles/log-analytics-malware/](https://azure.microsoft.com/en-us/documentation/articles/log-analytics-malware/)

### Identity and access
Another common cybersecurity scenario in the Cloud is in credential compromise. Not only does your cloud subscription have credentials – but each individual VM has a user and/or secret (usually a certificate and/or password) associated with it.

OMS will sum and organize all login attempts in your fleet and bucket them depending on type (remote, local, username used etc.)
For example – in the below – I can see a mass amount of unsuccessful login attempts from largely random strings as usernames. This most likely points to my computers being exposed and not properly protected by firewalls and access control lists.

![Figure 5: 97.3% Logon Failed in the last 24 hours](./media/documentation-government-oms-figure5.png)
<p align="center">Figure 5: 97.3% Logon Failed in the last 24 hours</p>

### Threat intelligence
OMS also provides protection against malicious insider scenarios – where there’s a security compromise inside your organization and a malicious user is trying to ex-filtrate data.

OMS Threat Intelligence looks at all your Network logs on your computer and automatically searches and notifies you on inbound/outbound network connections to known malicious IPs (for example – IP addresses on the unindexed dark net).
For example, below – I can see there are both inbound and outbound network connections to the People’s Republic of China.

Double clicking on the inbound tag – I can find out that a Linux VM that is being managed by OMS is making outbound connections to a known dark net IP in China.

You can also setup Alerts to OMS Solutions like Threat Intelligence. Below I’ve setup an Alert so should OMS detect > 10 outbound connections to a known malicious IP it sends an alert out to me via email. I then configure that alert to fire an Azure Automation job which is setup to automatically shut down that VM.

![Figure 6: OMS Alerts and Automation](./media/documentation-government-oms-figure6.png)
<p align="center">Figure 6: OMS Alerts and Automation</p>

This is just one example of an out-of-box OMS solution that can be applied to your fleet, whether it’s running on Azure, another cloud service provider, or on your premises.
OMS will continue to update its machine learning to the latest threats automatically for you and we continue to roll out new Solutions to the OMS Solution Gallery as well.

For more information on OMS – please consult our documentation page here: [https://azure.microsoft.com/en-us/documentation/articles/documentation-government-overview/](https://azure.microsoft.com/en-us/documentation/articles/documentation-government-overview/)
