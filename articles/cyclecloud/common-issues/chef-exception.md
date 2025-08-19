---
title: Common Issues - Chef Exceptions
description: Azure CycleCloud common issue - Chef Exceptions
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
ms.topic: conceptual
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

