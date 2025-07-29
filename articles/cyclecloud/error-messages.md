---
title: Error Messages
description: List of common CycleCloud error messages.
author: adriankjohnson
ms.date: 06/10/2025
ms.author: adjohnso
---

# Error Messages

A compilation of error messages encountered in Azure CycleCloud.

## Staging Resources

[Resource group {GROUP} for restricted credential does not exist](common-issues/resource-group-privileges.md)

[Error creating resource group {GROUP} for credential](common-issues/resource-group-privileges.md)

[Failed to register Azure providers](common-issues/registering-providers.md)

[Staging Resources (urlopen error [Errno 104] Socket closed)](common-issues/fetching-resources.md)

[Staging Resources (Unable to determine AccessKey for URL)](common-issues/staging-resources.md)

[Staging Resources (pogo.exceptions.FrameworkError: 'az://.../blobs' is not a directory)](common-issues/staging-resources.md)

[Staging Resources (pogo.exceptions.FrameworkError: Cannot sync from directory to file!)](common-issues/staging-resources.md)

[Staging resources (No JSON object could be decoded)](common-issues/azure-credentials.md)

[Staging resources (Azure account credentials are not valid)](common-issues/azure-credentials.md)

## Acquiring Resources from Azure

[Validating nodes (Credentials not found)](common-issues/cluster-credentials.md)

[Creating network interface (Failure creating network interface for node)](common-issues/creating-network-resources.md)

[Failed to create load balancer for cell](common-issues/creating-network-resources.md)

[Failed to create Public IP for cell](common-issues/creating-network-resources.md)

[Failed to create network interface for node](common-issues/creating-network-resources.md)

[Failed to create Network Security Group for node](common-issues/creating-network-resources.md)

[Failed to create Public IP for node](common-issues/creating-network-resources.md)

[Creating Virtual Machine (User failed validation to purchase resources)](common-issues/marketplace-images.md)

[Creating Virtual Machine (The requested VM size {Standard_X} is not available in the current region)](common-issues/unavailable-sku.md)

[Updating Scaleset (Operation Not Allowed)](common-issues/updating-scalesets.md)

[This node does not match existing scaleset attributes](common-issues/scaleset-attributes.md)

## VM Booting and Configuration

[Timeout awaiting system boot-up (node connectivity)](common-issues/node-cyclecloud-connectivity.md)

[Timeout awaiting system boot-up (storage account)](common-issues/node-timeout-await-bootup.md)

[Timed out connecting to CycleCloud](common-issues/node-cyclecloud-connectivity.md)

[Connection refused to CycleCloud through return-proxy tunnel](common-issues/node-cyclecloud-connectivity.md)

[Unable to setup return proxy](common-issues/node-cyclecloud-connectivity.md)

[Timed out waiting for return proxy](common-issues/node-cyclecloud-connectivity.md)

## Error Configuring Software

[Unknown configuration status returned](common-issues/configuration-status.md)

[Unable to execute command](common-issues/execute-command.md)

[Error resolving Chef cookbooks](common-issues/resolving-cookbooks.md )

[Chef::Exceptions:RecipeNotFound](common-issues/resolving-cookbooks.md )

[Chef::Exceptions](common-issues/chef-exception.md)

[Multiple errors resolving Chef cookbooks](common-issues/resolving-cookbooks.md)

[{error} while executing {script} in project](common-issues/cluster-init.md)

[Failed to execute cluster-init script {script} in project](common-issues/cluster-init.md)

[Detected corrupt RPM database, rebuilding...](common-issues/corrupt-rpm.md)

## Scheduler Configuration

[Unable to execute command `/usr/bin/systemctl --system start slurmd` (exit code 1)](common-issues/slurmd-errors.md)
