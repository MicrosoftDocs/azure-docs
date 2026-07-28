---
title: Common Issues - Chef Exceptions
description: Troubleshoot Chef exception errors in Azure CycleCloud, including their causes and how to resolve them on cluster nodes.
author: adriankjohnson
ms.date: 06/19/2026
ms.update-cycle: 3650-days
ms.author: adjohnso
ms.topic: troubleshooting-general
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
---

# Common Issues: Chef::Exceptions:X : \<resource-name\> had an error

## Possible Error Messages

- `Chef::Exceptions::UserIDNotFound: file[/var/log/new.log] had an error`

## Resolution

Chef has many exception types. When an exception occurs, Chef returns the resource name, 
recipe, recipe line number, and stack trace. These exceptions happen during the configuration of the system, so they can affect 
all of the functionality that Chef provides and arbitrary commands runnable
as a Chef resource. 

To diagnose unhandled Chef exceptions, you need to use your system administration skills.

