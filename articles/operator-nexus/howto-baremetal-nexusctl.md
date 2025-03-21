---
title: "Azure Operator Nexus: Running bare metal actions directly with nexusctl"
description: Learn how to bypass Azure and run bare metal actions directly in an emergency using nexusctl.
author: DanCrank
ms.author: danielcrank
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/26/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Run emergency bare metal actions outside of Azure using nexusctl

This article describes the `nexusctl` utility, which can be used in break-glass (emergency) situations to
run simple actions on bare metal machines without using the Azure console or command-line interface (CLI).

> [!CAUTION]
> Do not perform any action against management servers without first consulting with Microsoft support personnel. Doing so could affect the integrity of the Operator Nexus Cluster.

> [!IMPORTANT]
> Disruptive command requests against a Kubernetes Control Plane (KCP) node are rejected if there is another disruptive action command already running against another KCP node or if the full KCP is not available. This check is done to maintain the integrity of the Nexus instance and ensure multiple KCP nodes don't become non-operational at once due to simultaneous disruptive actions. If multiple nodes become non-operational, it will break the healthy quorum threshold of the Kubernetes Control Plane.
>
> Powering off a KCP node is the only nexusctl action considered disruptive in the context of this check.

## Prerequisites

- A [BareMetalMachineKeySet](./howto-baremetal-bmm-ssh.md) must be available to allow ssh access to the bare metal machines. The user must have superuser privilege level.
- The platform Kubernetes must be up and running on site.

## Overview

`nexusctl` is a stand-alone program that can be run using `nc-toolbox` from an `ssh` session on any control-plane node. Since `nexusctl` is contained in the `nc-toolbox-breakglass` container image and isn't installed directly on the host, it must be run with a command-line like:

```
sudo nc-toolbox nc-toolbox-breakglass nexusctl <command> [subcommand] [options]
```

(`nc-toolbox` must always be run as root or with `sudo`.)

Like most other command-line programs, the `--help` option can be used with any command or subcommand to see more information:

```
sudo nc-toolbox nc-toolbox-breakglass nexusctl --help
sudo nc-toolbox nc-toolbox-breakglass nexusctl baremetal --help
sudo nc-toolbox nc-toolbox-breakglass nexusctl baremetal power-off --help
```

etc.

> [!NOTE]
>
> > There is no bulk execution against multiple machines. Commands are executed on a machine by machine basis.

## Power off a bare metal machine

A single bare metal machine can be powered off by connecting to a control-plane node via ssh and running the command:

```
sudo nc-toolbox nc-toolbox-breakglass nexusctl baremetal power-off --name <machine name>
```

If the command is accepted, `nexusctl` responds with another command line that can be used to view the status of the long-running operation. Prefix this command with `sudo nc-toolbox nc-toolbox-breakglass`, as follows:

```
sudo nc-toolbox nc-toolbox-breakglass nexusctl baremetal power-off --status --name <machine name> --operation-id <operation-id>
```

The status is blank until the operation completes and reaches either a "succeeded" or "failed" state. While it's blank, assume that the operation is still in progress.

## Start a bare metal machine

A single bare metal machine can be started by connecting to a control-plane node via ssh and running the command:

```
sudo nc-toolbox nc-toolbox-breakglass nexusctl baremetal start --name <machine name>
```

If the command is accepted, `nexusctl` responds with another command line that can be used to view the status of the long-running operation. Prefix this command with `sudo nc-toolbox nc-toolbox-breakglass`, as follows:

```
sudo nc-toolbox nc-toolbox-breakglass nexusctl baremetal start --status --name <machine name> --operation-id <operation-id>
```

The status is blank until the operation completes and reaches either a "succeeded" or "failed" state. While it's blank, assume that the operation is still in progress.

## Unmanage a bare metal machine (set to unmanaged state)

A single bare metal machine can be switched to an unmanaged state by connecting to a control-plane node via ssh and running the command:

```
sudo nc-toolbox nc-toolbox-breakglass nexusctl baremetal unmanage --name <machine name>
```

While in an unmanaged state, no actions are permitted for that machine, except for returning it to a managed state (see next section). This function can be used to keep a bare metal machine powered off if it's in a rebooting crash loop.

`unmanage` isn't a long-running command, so there's no associated command to check operation status.

## Manage a bare metal machine (set to managed state)

A single bare metal machine can be switched to a managed state by connecting to a control-plane node via ssh and running the command:

```
sudo nc-toolbox nc-toolbox-breakglass nexusctl baremetal manage --name <machine name>
```

`manage` isn't a long-running command, so there's no associated command to check operation status.
