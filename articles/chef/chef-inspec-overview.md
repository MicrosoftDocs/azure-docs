---
title: Use InSpec for compliance automation of your Azure infrastructure
description: Learn how to use InSpec to detect issues in your Azure deployments
keywords: azure, chef, devops, virtual machines, overview, automate, inspce
ms.service: virtual-machines-linux
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.date: 05/15/2018
ms.topic: article
---

# Use InSpec for compliance automation of your Azure infrastructure
[InSpec](https://www.chef.io/inspec/) is a free and open-source framework for testing and auditing your applications and infrastructure. InSpec works by comparing the actual state of your system with the desired state that you express in easy-to-read and easy-to-write InSpec code. InSpec detects violations and displays findings in the form of a report, but puts you in control of remediation. You can use InSpec to validate the state of your virtual machines running in Azure. You can also use InSpec to scan and validate the state of resources and resource groups inside of a subscription.

This article describes the benefits of using InSpec to make security and compliance easier on Azure.

## Make compliance easy to understand and assess
With InSpec, you transform your requirements into versioned, executable, human-readable code. This allows you to organize your tests into composable profiles where you define and customize exceptions as needed.

## Detect fleet-wide issues and prioritize their remediation
The InSpec agentless detect mode enable you to quickly assess - at scale - your exposure level. Built-in metadata for impact/severity scoring helps determine what areas to focus on for remediation.

## Inspect machines, data, and new SaaS APIs
The InSpec cloud API compliance capabilities let you make both coarse and fine-grained assertions about your cloud compliance and report on it continuously.

## Satisfy audits
With InSpec, you can respond to audit questions at any time - not just at predetermined intervals such as quarterly or yearly. InSpec allows you to enter an audit cycle knowing your exact compliance posture, instead of being surprised by an auditor’s findings.

## Reduce ambiguity and miscommunication regarding rules
Documents leave configurations and processes open to interpretation. Executable code removes conversations about what should be assessed in favor of tangible tests with clear intent.

## Keep up with rapidly changing threat and compliance landscapes
InSpec allows you to write and publish detection code the same day and write new rules in quick response to new regulations. This means that changes in threats or regulations no longer equal emergencies.

## Next steps
* [Create a Windows virtual machine on Azure using Chef](/azure/virtual-machines/windows/chef-automation)