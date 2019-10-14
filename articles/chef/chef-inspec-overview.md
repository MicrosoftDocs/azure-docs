---
title: Use InSpec for compliance automation of your Azure infrastructure
description: Learn how to use InSpec to detect issues in your Azure deployments
keywords: azure, chef, devops, virtual machines, overview, automate, inspec
ms.service: virtual-machines-linux
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 03/19/2019
ms.topic: article
---

# Use InSpec for compliance automation of your Azure infrastructure

[InSpec](https://www.chef.io/inspec/) is Chef’s open-source language for describing security & compliance rules that can be shared between software engineers, operations, and security engineers. InSpec works by comparing the actual state of your infrastructure with the desired state that you express in easy-to-read and easy-to-write InSpec code. InSpec detects violations and displays findings in the form of a report, but puts you in control of remediation.

You can use InSpec to validate the state of resources and resource groups in a subscription, including virtual machines, network configurations, Azure Active Directory settings, and more.

This article describes the benefits of using InSpec to make security and compliance easier on Azure.

## Make compliance easy to understand and assess

Compliance documentation written in spreadsheets or Word documents leaves requirements open to interpretation. With InSpec, you transform your requirements into versioned, executable, human-readable code. Code replaces conversations about what should be assessed in favor of tangible tests with clear intent.

## Detect fleet-wide issues and prioritize their remediation

InSpec's agentless detect mode enable you to quickly assess - at scale - your exposure level. Built-in metadata for impact/severity scoring helps determine what areas to focus on for remediation. You can also write rules quickly in response to new vulnerabilities or regulations and roll them out immediately.

## Audit Azure virtual machines with Policy Guest Configuration

Azure directly supports use of Chef InSpec definitions to audit Azure virtual machines through [Azure Policy Guest Configuration](/azure/governance/policy/concepts/guest-configuration). Guest Configuration evaluates a Linux virtual machine to a provided Chef InSpec definition and reports compliance back through Azure Policy. The results of these audits are also reported through Azure Monitor logs; enabling alerts and other automation scenarios.

## Satisfy audits

With InSpec, you can respond to audit questions at any time - not just at predetermined intervals such as quarterly or yearly. By continuously running InSpec tests, you enter an audit cycle knowing your exact compliance posture and history, rather than being surprised by an auditor’s findings.

## Next steps

> [!div class="nextstepaction"] 
> [Try InSpec in the Azure Cloud Shell](https://shell.azure.com)