---
title: CycleCloud Common Issues - Chef Exceptions | Microsoft Docs
description: Azure CycleCloud common issue - Chef Exceptions
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Chef::Exceptions:X : <resource-name> had an error

## Possible Error Messages

- `Chef::Exceptions::UserIDNotFound: file[/var/log/new.log] had an error`

## Resolution

Chef exceptions types are numerous. This message will return the Chef resource name, 
recipe, recipe line number, and stack trace for the occurrence of the exception.
These exceptions occur during the configuration of the system so they can span 
all of the functionality that Chef provides as well as arbitrary commands runnable
as a chef resource. 

Basic deduction of system administration will be needed to diagnose unhandled
Chef exceptions.

