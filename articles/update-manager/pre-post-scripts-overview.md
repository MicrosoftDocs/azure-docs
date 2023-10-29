---
title: An overview of pre-scripts and post-scripts in your Azure Update Manager
description: This article provides an overview on pre and post scripts and its requirements.
ms.service: azure-update-manager
ms.date: 10/29/2023
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# About pre-scripts and post-scripts

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Pre-scripts and post-scripts are runbooks that you can attach to your upcoming schedules for patching your machines before and after installing the updates. They enable you to:
- Start VMs patch them and shut them down again.
- Stop a service on the machine, patch it and start the service again.

For example, if there's a maintenance configuration or a schedule that you must run on a specific date and time and some of your VMs are deallocated, you get failed deployments. In such scenarios, you run the pre-scripts before starting the patching process to run a sequence of events.

 Pre-scripts run at the beginning of the patching process. On Windows, post-scripts run at the end of the deployment and after any reboots that are configured. For Linux, post-scripts run after the end of the deployment, not after the machine reboots. 


## Key capabilities

- **Works with various end points** - You can choose to configure other endpoints such as Webhooks or Azure Functions or Storage accounts.

- **Compatibility with the [Event Grid](../event-grid/overview.md)** allows you to deliver the pre script and post script.

## Pre-script and post-script parameters

When you configure pre-scripts and post-scripts, you can pass in parameters just like scheduling a runbook. Parameters are defined at the time of update deployment creation. Pre-scripts and post-scripts support the following types:

* [char]
* [byte]
* [int]
* [long]
* [decimal]
* [single]
* [double]
* [DateTime]
* [string]

Pre-script and post-script runbook parameters don't support boolean, object, or array types. These values cause the runbooks to fail. 

If you need another object type, you can cast it to another type with your own logic in the runbook.

In addition to your standard runbook parameters, the `SoftwareUpdateConfigurationRunContext` parameter (type JSON string) is provided. If you define the parameter in your pre-script or post-script runbook, it's automatically passed in by the update deployment. The parameter contains information about the update deployment, which is a subset of information returned by the [SoftwareUpdateconfigurations API](/rest/api/automation/softwareupdateconfigurations/getbyname#updateconfiguration). The following sections define the associated properties.

## Next steps

To troubleshoot issues, see [Troubleshoot Update Manager](troubleshoot.md).