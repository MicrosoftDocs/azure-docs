---
title: What's new with Azure Arc enabled servers (preview) agent
description: This article has release notes for Azure Arc enabled servers (preview) agent. For many of the summarized issues, there are links to additional details.
ms.topic: conceptual
ms.date: 08/31/2020
---

# What's new with Azure Arc enabled servers (preview) agent

The Azure Arc enabled servers (preview) Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

## August 2020

Version: 0.11

- Support for Ubuntu 20.04.

- Reliability improvements for extension deployments.

### Known issues

If you are using an older version of the Linux agent and configured it to use a proxy server, you need to reconfigure the proxy server setting after the upgrade. To do this, run `sudo azcmagent_proxy add http://proxyserver.local:83`.

## Next steps

Before evaluating or enabling Arc enabled servers (preview) across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.