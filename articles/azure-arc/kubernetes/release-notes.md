---
title: "What's new with Azure Arc-enabled Kubernetes"
ms.date: 04/18/2024
ms.topic: overview
description: "Learn about the latest releases of Arc-enabled Kubernetes."
---

# What's new with Azure Arc-enabled Kubernetes

Azure Arc-enabled Kubernetes is updated on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the latest releases of the [Azure Arc-enabled Kubernetes agents](conceptual-agent-overview.md).

When any of the Arc-enabled Kubernetes agents are updated, all of the agents in the `azure-arc` namespace are incremented with a new version number, so that the version numbers are consistent across agents. When a new version is released, all of the agents are upgraded together to the newest version (whether or not there are functionality changes in a given agent), unless you have [disabled automatic upgrades](agent-upgrade.md) for the cluster.

We generally recommend using the most recent versions of the agents. The [version support policy](agent-upgrade.md#version-support-policy) covers the most recent version and the two previous versions (N-2).

## Version 1.15.3 (March 2024)

- Various enhancements and bug fixes

## Version 1.14.5 (December 2023)

- Migrated auto-upgrade to use latest Helm release

## Version 1.13.4 (October 2023)

- Various enhancements and bug fixes

## Version 1.13.1 (September 2023)

- Various enhancements and bug fixes

## Version 1.12.5 (July 2023)

- Alpine base image powering our Arc agent containers has been updated from 3.7.12 to 3.18.0

## Version 1.11.7 (May 2023)

- Updates to enable users that belong to more than 200 groups in cluster connect scenarios

## Version 1.11.3 (April 2023)

- Updates to base image of Arc-enabled Kubernetes agents to address security CVE

## Next steps

- Learn how to [enable or disable automatic agent upgrades](agent-upgrade.md).
- Learn how to [connect a Kubernetes cluster to Azure Arc](quickstart-connect-cluster.md).