---
title: Overview of Maintenance Configurations for Azure virtual machines
description: Learn how to control when maintenance is applied to your Azure VMs using Maintenance Control.
author: cynthn
ms.service: virtual-machines
ms.subservice: maintenance
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 10/06/2021
ms.author: cynthn
#pmcontact: shants
---

# Managing platform updates with Maintenance Configurations

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Manage platform updates, that don't require a reboot, using Maintenance Configurations. Azure frequently updates its infrastructure to improve reliability, performance, security or launch new features. Most updates are transparent to users. Some sensitive workloads, like gaming, media streaming, and financial transactions, can't tolerate even few seconds of a VM freezing or disconnecting for maintenance. Creating a Maintenance Configuration gives you the option to wait on platform updates and apply them within a 35-day rolling window. 


With Maintenance Configurations, you can:
- Batch updates into one update package.
- Wait up to 35 days to apply updates for **Host** machines. 
- Automate platform updates by configuring your maintenance schedule.
- Maintenance Configurations work across subscriptions and resource groups. 

## Limitations

- Maintenance window duration can vary month over month and sometimes it can take up to 2 hours to apply the pending updates once it is initiated by the user.  
- After 35 days, an update will automatically be applied to your **Host** machines.
- Rack level maintenance cannot be controlled through maintenance configurations.
- User must have **Resource Contributor** access.
- Users need to know the nuances of the scopes required for their machine.

## Management options

You can create and manage maintenance configurations using any of the following options:

- [Azure CLI](maintenance-configurations-cli.md)
- [Azure PowerShell](maintenance-configurations-powershell.md)
- [Azure portal](maintenance-configurations-portal.md)

For an Azure Functions sample, see [Scheduling Maintenance Updates with Maintenance Configurations and Azure Functions](https://github.com/Azure/azure-docs-powershell-samples/tree/master/maintenance-auto-scheduler).

## Next steps

To learn more, see [Maintenance and updates](maintenance-and-updates.md).
