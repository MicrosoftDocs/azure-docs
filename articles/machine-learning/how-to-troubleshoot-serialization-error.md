---
title: Troubleshoot SerializationError
titleSuffix: Azure Machine Learning
description: Troubleshooting steps when you get the "cannot import name 'SerializationError'" message.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: Blackmist
ms.author: larryfr
ms.topic: troubleshooting 
ms.date: 06/15/2022
---


# Troubleshoot "cannot import name 'SerializationError'"

When using Azure Machine Learning, you may receive the error "Cannot import name 'SerializationError'". This error may occur when using an Azure Machine Learning environment. For example, when submitting a training job.

## Cause

This problem is caused by a bug in the Azure Machine Learning SDK version 1.42.0.

## Resolution

Update your Azure Machine Learning environment to use SDK version 1.42.0.post1 or greater.

For more information on updating an environment, see the following articles:

* [Manage environments in studio](how-to-manage-environments-in-studio.md#rebuild-an-environment)
* [Create & use software environments (SDK v1)](https://how-to-use-environments.md#update-an-existing-environment)
* [Create & manage environments (CLI v2)](how-to-manage-environments-v2.md#update)