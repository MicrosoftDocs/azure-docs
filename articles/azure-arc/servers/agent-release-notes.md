---
title: Release notes
description: This article has release notes for Azure Arc for servers agent. For many of the summarized issues there are links to additional details.
ms.topic: conceptual
ms.date: 08/31/2020
---

# Release notes for Azure Arc for servers agent

[Download and install](https://aka.ms/AzureConnectedMachineAgent) the latest release of the Azure Connected Machine agent package for Windows.

[Download and install](https://packages.microsoft.com/) the latest release of the Azure Connected Machine agent package for Linux.

## August 2020

Version: 0.11

| Change | Details |
| :----- | :------ |
| Support for Ubuntu 20.04, and and reliability improvements for extension deployments. |

### Known issues

If you are using an older version of the agent on Linux and configured the agent to use a proxy server, you need to reconfigure the proxy server setting after the upgrade. To do this, run `sudo azcmagent_proxy add http://proxyserver.local:83`.

## Next Steps

Before evaluating or enabling Arc enabled servers (preview) across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.