---
title: Offline deployment
description: Offline deployment enables you to pull container images from a private container registry instead of pulling from the Microsoft Container Registry.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Offline Deployment Overview

Typically the container images used in the creation of the Azure Arc data controller, SQL managed instances and PostgreSQL servers are directly pulled from the Microsoft Container Registry (MCR). In some cases, the environment that you're deploying to won't have connectivity to the Microsoft Container Registry.  For situations like this, you can pull the container images using a computer, which _does_ have access to the Microsoft Container Registry and then tag and push them to a private container registry that _is_ connectable from the environment in which you want to deploy Azure Arc-enabled data services.

Because monthly updates are provided for Azure Arc-enabled data services and there are a large number of container images, it's best to perform this process of pulling, tagging, and pushing the container images to a private container registry using a script.  The script can either be automated or run manually.

A [sample script](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/scripts/pull-and-push-arc-data-services-images-to-private-registry.py) can be found in the Azure Arc GitHub repository.

> [!NOTE]
> This script requires the installation of Python and the [Docker CLI](https://docs.docker.com/install/).

The script will interactively prompt for the following information.  Alternatively, if you want to have the script run without interactive prompts, you can set the corresponding environment variables before running the script.

|Prompt|Environment Variable|Notes|
|---|---|---|
|Provide source container registry - press ENTER for using `mcr.microsoft.com`|SOURCE_DOCKER_REGISTRY|Typically, you would pull the images from the Microsoft Container Registry, but if you're participating in a preview with a different registry, you can use the information provided to you as part of the preview program.|
|Provide source container registry repository - press ENTER for using `arcdata`:|SOURCE_DOCKER_REPOSITORY|If you're pulling from the Microsoft Container Registry, the repository will be `arcdata`.|
|Provide username for the source container registry - press ENTER for using none:|SOURCE_DOCKER_USERNAME|Only provide a value if you're pulling container images from a source that requires login.  The Microsoft Container Registry doesn't require a login.|
|Provide password for the source container registry - press ENTER for using none:|SOURCE_DOCKER_PASSWORD|Only provide a value if you're pulling container images from a source that requires login.  The Microsoft Container Registry doesn't require a login. The prompt uses a masked password prompt.  You won't see the password if you type or paste it in.|
|Provide container image tag for the images at the source - press ENTER for using '`<current monthly release tag>`':|SOURCE_DOCKER_TAG|The default tag name will be updated monthly to reflect the month and year of the current release on the Microsoft Container Registry.|
|Provide target container registry DNS name or IP address:|TARGET_DOCKER_REGISTRY|The target registry DNS name or IP address.  This prompt is the registry that the images will be pushed _to_.|
|Provide target container registry repository:|TARGET_DOCKER_REPOSITORY|The repository on the target registry to push the images to.|
|Provide username for the target container registry - press enter for using none:|TARGET_DOCKER_USERNAME|The username, if any, that is used to log in to the target container registry.|
|Provide password for the target container registry - press enter for using none:|TARGET_DOCKER_PASSWORD|The password, if any, that is used to log in to the target container registry. This prompt is a masked password prompt.  You won't see the password if you type or paste it in.|
|Provide container image tag for the images at the target:|TARGET_DOCKER_TAG|Typically, you would use the same tag as the source to avoid confusion.|
