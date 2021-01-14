---
title: Troubleshoot common Automanage onboarding errors
description: Common Automanage onboarding errors and how to troubleshoot them
author: asinn826
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 01/14/2021
ms.author: alsin
---

# Troubleshoot common Automanage onboarding errors
Automanage may fail to onboard a machine onto the service. This document explains how to troubleshoot deployment failures, shares some common reasons why deployments may fail, and describes potential next steps on mitigation.

## Troubleshooting deployment failures
Onboarding a machine to Automanage will result in an Azure Resource Manager deployment being created. If onboarding fails, it may be helpful to consult the deployment for further details as to why it failed. There are links to the deployments in the failure detail flyout, pictured below.

:::image type="content" source="media\automanage-common-errors\failure-flyout.png" alt-text="Automanage failure detail flyout.":::

If all your machines are located in the same resource group, it may be more helpful to consult the list of deployments for the resource group specifically. If your machines are located across multiple resource groups in a subscription, consult the deployments for the entire subscription.

## Common deployment errors

Error |  Mitigation
:-----|:-------------|
Automanage account insufficient permissions error TODO: add wording for this error | This may happen if you have recently moved a subscription containing a new Automanage Account into a new tenant. Steps to resolve this are located [here](./repair-automanage-account.md).
Workspace region not matching region mapping requirements TODO: add wording for this error | Automanage was unable to onboard your machine but the Log Analytics workspace that the machine is currently linked to is not mapped to a supported Automation region. Ensure that your existing Log Analytics workspace and Automation account are located in a [supported region mapping](https://docs.microsoft.com/azure/automation/how-to/region-mappings).
"The assignment has failed; there is no additional information available" | Please open a case with Microsoft Azure support.