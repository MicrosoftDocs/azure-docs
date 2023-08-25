---
title: "What's new with Azure Arc-enabled Kubernetes"
ms.date: 08/21/2023
ms.topic: overview
description: "Learn about the latest releases of Arc-enabled Kubernetes."
---

# What's new with Azure Arc-enabled Kubernetes

Azure Arc-enabled Kubernetes is updated on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the latest releases of the Azure CLI `connectedk8s` extension, the [Azure Arc-enabled Kubernetes agents](conceptual-agent-overview.md), and other changes.

> [!NOTE]
> When any of the Arc-enabled Kubernetes agents are updated, all of the agents in the `azure-arc` namespace are incremented with a new version number, so that the version numbers are consistent across agents. If you have enabled automatic updates, all of the agents will be upgraded together to the newest version (whether or not there are functionality changes in a given agent).
>
> We generally recommend using the most recent versions of the agents. The [version support policy](agent-upgrade.md#version-support-policy) covers the most recent version and the two previous versions (N-2).

## July 2023

### Arc agents - Version 1.12.5

- Alpine base image powering our Arc agent containers has been updated from 3.7.12 to 3.18.0

## May 2023

### Arc agents - Version 1.11.7

- Updates to enable users that belong to more than 200 groups in cluster connect scenarios

### Azure CLI `connectedk8s` extension - Version 1.3.17

- Onboarding enhancements to track ARM resource provisioning
- Enhancements for better troubleshooting and logging to improve onboarding experience

## April 2023

### Arc agents - Version 1.11.3

- Updates to base image of Arc-enabled Kubernetes agents to address security CVE

### Azure CLI `connectedk8s` extension - Version 1.3.16

- Force delete added to connect command to clear stale resources, if any, during onboarding
- Diagnoser enhancements to capture and store agent metadata
- Heuristics detection in connect command

