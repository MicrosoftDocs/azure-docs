---
title: Retrieve and remediate configuration drift with Azure Copilot
description: Retrieve and remediate SAP configuration drift using the Run SAP Agent in Azure Copilot. Learn how to query settings and generate safe fixes.
ms.date: 11/06/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
author: vaidehikher18
ms.author: vaidehikher
ms.reviewer: mattmcinnes
---

# Retrieve and remediate configuration drift with Run SAP agent

Use the Run SAP agent in Azure Copilot to retrieve current configuration values for your SAP workloads and generate scripts to remediate configuration drift. This article explains how to query settings, compare workloads, and review and run a remediation script while retaining control over changes to your systems.

## Configuration retrieval by using Azure Copilot Run SAP Agent

Configuration validation tells you where your systems deviate from best practices, while configuration retrieval tells you what your systems are configured to. By using natural language in the Azure Copilot Run SAP Agent, you can look up the current value of a configuration item across one or more workload virtual instances (WVIs) and compare it across systems, without signing in to each host, reading configuration files, or running CLI commands.

### What you can do

- Look up a configuration value for one WVI or a set of WVIs.

- Compare a setting across systems and get a side-by-side view that highlights inconsistencies and outliers.

- Verify a fix by asking for the current value after you remediate a deviation.

### Supported workloads and configuration types

- It covers Azure infrastructure settings for the resources in your WVI (for example, networking, VM SKUs, availability zones, and disks), OS-level settings on the WVI’s virtual machines (for example, kernel parameters, filesystems, and cluster configuration), and SAP Profile parameters.

> [!NOTE]
> Configuration retrieval is read-only. It doesn't change anything on your systems.

### Using Configuration Retrieval

1. Open the Azure portal, select **Workloads Hub for SAP**, and open **Copilot** from the top bar.

1. Select **Run SAP Agent** from the dropdown.

   > [!NOTE]
   > Select the agent each time you start a new conversation. Otherwise, general Azure Copilot answers your question instead of Azure Copilot Run SAP Agent.

1. Ask your question in natural language, naming the WVI or WVIs you're interested in.

#### Example prompts

- What is the current kernel version and patch level for SAP system \<WVI-name\>?

- Get the DIR_EXECUTABLE, DIR_PROFILE, and SAPDBHOST values for SAP system \<WVI-name\>.

- Show me the ABAP buffer size (abap/buffersize) for workload \<WVI-name\>.

## Workload Aware Remediation

Fixing deviations on an SAP system one step at a time is slow and risky. It can take dozens of manual steps across the network, load balancer, VM, HANA, and cluster layers, with no guidance on the safe order or on which actions interrupt the system. Workload Aware Remediation uses the context that Azure Workload Center already knows about your workload virtual instance (WVI), including its components and the high-availability setup, to generate a single, ordered remediation script that respects your workload’s topology.

### How it works

- The agent understands your workload. It uses WVI’s topology and component roles (such as HANA nodes, ASCS, and application servers) together with the deviations found by Configuration Validation.

- Steps are ordered safely. The agent applies SAP on Azure ordering rules from a shared knowledge base, such as sequencing and updates for application servers. 

- Disruptive and non-disruptive changes are kept apart. By default, the script contains only non-disruptive changes. 

- You get one consolidated script generated for a WVI per request. 

- The script uses Azure CLI (az) commands, with az vm run-command for steps that run inside the VMs. It's returned as a downloadable file that you can save as a PowerShell file (Windows) or a Bash script (Linux). Steps that can't be scripted are listed separately as manual steps.

- You stay in control. Scripts never run automatically. You review and run them yourself. 

The following terms are used for the changes in a remediation step: 

| **Change type**        | **Definition**                                                                                                         |
|------------------------|------------------------------------------------------------------------------------------------------------------------|
| Non-disruptive change  | Can be applied while the SAP system stays available.                                                                   |
| Disruptive change      | Might interrupt the availability of the system or a component while you apply it (for example, a restart or failover).  |

### Generating and applying a remediation script 

1.  On the **Check results** page of your WVI, select the resolution for a deviation. Alternatively, open Copilot from the top bar and select the **Azure Copilot Run SAP Agent**. 

2.  Ask for the remediation script, for example “Give me the resolution script for workload \<WVI name\>”. 

3.  The agent returns a summary of the ordered steps and a downloadable artifact of the script file. 

4.  Download the file, review it, and save it as a `.ps1` (PowerShell) or `.sh` (Bash) file, depending on your environment. 

5.  Run the non-disruptive script.

6.  Validate the results. The next hourly validation run re-checks the configuration, and you can also confirm the new values with **Azure Copilot Run SAP Agent**. When the deviation clears, you can also configure to receive a **Deviation resolved** notification. 

> [!NOTE]
> Always review generated scripts and test them on nonproduction systems first.


#### Example prompts

- “Give me the resolution script for my workload \<WVI name\>.” 

<!-- -->

- “Provide the resolution steps for all the deviations for my workload \<WVI name\>.” 

<!-- -->

- “Generate remediation steps for all high-impact deviations in \<WVI name\>.” 

<!-- -->

- “Show me the resolution steps for the \<check name\> check on \<WVI name\>.” 
