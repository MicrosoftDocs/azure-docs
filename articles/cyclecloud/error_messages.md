---
title: Error Messages
description: List of common CycleCloud error messages.
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Error Messages

A list of error messages one encounters in CycleCloud

## Staging Resources

[Resource group {GROUP} for restricted credential does not exist](common-issues/resource_group_privileges.md)

[Error creating resource group {GROUP} for credential](common-issues/resource_group_privileges.md)

[Failed to register Azure providers](common-issues/registering_providers.md)

[Staging Resources (urlopen error [Errno 104] Socket closed)](common-issues/fetching_resources.md)

[Staging Resources (Unable to determine AccessKey for URL)](common-issues/staging_resources.md)

[Staging Resources (pogo.exceptions.FrameworkError: 'az://.../blobs' is not a directory)](common-issues/staging_resources.md)

[Staging Resources (pogo.exceptions.FrameworkError: Cannot sync from directory to file!)](common-issues/staging_resources.md)

[Staging resources (No JSON object could be decoded)](common-issues/azure_credentials.md)

[Staging resources (Azure account credentials are not valid)](common-issues/azure_credentials.md)

## Acquiring Resources from Azure

[Validating nodes (Credentials not found)](common-issues/cluster_credentials.md)

[Creating network interface (Failure creating network interface for node)](common-issues/creating_network_resources.md)

[Failed to create load balancer for cell](common-issues/creating_network_resources.md)

[Failed to create Public IP for cell](common-issues/creating_network_resources.md)

[Failed to create network interface for node](common-issues/creating_network_resources.md)

[Failed to create Network Security Group for node](common-issues/creating_network_resources.md)

[Failed to create Public IP for node](common-issues/creating_network_resources.md)

[Creating Virtual Machine (User failed validation to purchase resources)](common-issues/marketplace_images.md)

[Creating Virtual Machine (The requested VM size {Standard_X} is not available in the current region)](common-issues/unavailable_sku.md)

[Updating Scaleset (Operation Not Allowed)](common-issues/updating_scalesets.md)

[This node does not match existing scaleset attributes](common-issues/scaleset_attributes.md)

## VM Booting and Configuration

[Timeout awaiting system boot-up (node connectivity)](common-issues/node_cyclecloud_connectivity.md)

[Timeout awaiting system boot-up (storage account)](common-issues/node_timeout_await_bootup.md)

[Timed out connecting to CycleCloud](common-issues/node_cyclecloud_connectivity.md)

[Connection refused to CycleCloud through return-proxy tunnel](common-issues/node_cyclecloud_connectivity.md)

[Unable to setup return proxy](common-issues/node_cyclecloud_connectivity.md)

[Timed out waiting for return proxy](common-issues/node_cyclecloud_connectivity.md)

## Error Configuring Software

[Unknown configuration status returned](common-issues/configuration_status.md)

[Unable to execute command](common-issues/execute_command.md)

[Error resolving Chef cookbooks](common-issues/resolving_cookbooks.md )

[Chef::Exceptions:RecipeNotFound](common-issues/resolving_cookbooks.md )

[Chef::Exceptions](common-issues/chef_exception.md)

[Multiple errors resolving Chef cookbooks](common-issues/resolving_cookbooks.md)

[{error} while executing {script} in project](common-issues/cluster-init.md)

[Failed to execute cluster-init script {script} in project](common-issues/cluster-init.md)

[Detected corrupt RPM database, rebuilding...](common-issues/corrupt-rpm.md)

## Scheduler Configuration

[Unable to execute command `/usr/bin/systemctl --system start slurmd` (exit code 1)](common-issues/slurmd_errors.md)
