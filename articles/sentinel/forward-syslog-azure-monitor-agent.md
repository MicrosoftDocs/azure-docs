---
title: Forward streaming event log data to Microsoft Sentinel by using the Azure Monitor agent
description: In this tutorial, you will forward syslog data to Microsoft Sentinel by using the Azure Monitor agent. 
author: cwatson-cat
ms.author: cwatson
ms.service: microsoft-sentinel
ms.topic: tutorial 
ms.date: 07/12/2022
ms.custom: template-tutorial
#Customer intent: As a security-engineer, I want to get event data into Microsoft Sentinel so that I can use the data with other data to do attack detection, threat visibility, proactive hunting, and threat response.
---

# Tutorial: Forward event log data to Microsoft Sentinel by using the Azure Monitor agent

In this tutorial, you'll configure a Linux virtual machine (VM) to forward streaming events to Microsoft Sentinel by using the  Azure Monitor agent. Use these steps to collect data from devices where you can't install an agent like a firewall network device.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a data collection rule
> * Verify the Azure Monitor agent is running
> * Enable log reception on port 514

<!-- 4. Prerequisites 
Required. First prerequisite is a link to a free trial account if one exists. If there 
are no prerequisites, state that no prerequisites are needed for this tutorial.
-->

## Prerequisites

To complete the steps in this tutorial, you must have the following resources and roles.

- Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Log Analytics workspace associated to Microsoft Sentinel
- Linux server that's running an operating system that supports Azure Monitor agent.
   - [Create a Linux VM with the Azure CLI](/azure/virtual-machines/linux/tutorial-manage-vm) or
   - Onboard an on-premises Linux server to Azure Arc. See [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm)
   - [Overview of Azure Monitor agents - Supported operating systems](/azure/azure-monitor/agents/agents-overview#linux).
- Roles to deploy the agent and create the data collection rules.


  |Build-in Role  |Scope  |Reason  |
  |---------|---------|---------|
  |- [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles)</br>- [Azure Connected Machine Resource Administrator](/azure/role-based-access-control/built-in-roles)     |  Virtual machines</br>Scale sets</br>Arc-enabled servers        |   To deploy the agent      |
  |Row2     |         |         |
  |Row3     |         |         |


- <!-- prerequisite n -->

<!-- 5. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->

## [Section 1 heading]
<!-- Introduction paragraph -->

1. Sign in to the [<service> portal](url).
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section 2 heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section n heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->