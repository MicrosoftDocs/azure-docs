---
title: Troubleshooting Docker client errors on Windows by using Visual Studio | Microsoft Docs
description: Troubleshoot problems you encounter when using Visual Studio to create and deploy web apps to Docker on Windows by using Visual Studio 2017.
services: azure-container-service
documentationcenter: na
author: devinb
manager: douge
editor: ''

ms.assetid: 346f70b9-7b52-4688-a8e8-8f53869618d3
ms.service: multiple
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 10/13/2017
ms.author: devinb

---

# Troubleshoot Visual Studio 2017 development with Docker

When you're working with Visual Studio Tools for Docker, you may encounter issues while building or debugging your application. Below are some common troubleshooting steps.

## Volume sharing is not enabled. Enable volume sharing in the Docker CE for Windows settings  (Linux containers only)

To resolve this issue:

1. Right-click **Docker for Windows** in the notification area, and then select **Settings**.
1. Select **Shared Drives** and share the system drive along with the drive where the project resides.

> [!NOTE]
> If files appear shared, you may still need to click the "Reset credentials..." link at the bottom of the dialog in order to re-enable volume sharing. To continue after you reset credentials, you might have to restart Visual Studio.

![shared drives](./media/vs-azure-tools-docker-troubleshooting-docker-errors/shareddrives.png)

## Mounts denied

When using Docker for macOS, you might encounter an error referencing the folder /usr/local/share/dotnet/sdk/NuGetFallbackFolder. Add the folder to the File Sharing tab in Docker.

## Unable to start debugging

One reason could be related to having stale debugging components in your user profile folder. Execute the following commands to remove these folders so that the latest debugging components are downloaded on the next debug session.

- del %userprofile%\vsdbg
- del %userprofile%\onecoremsvsmon

## Errors specific to networking when debugging your application

Try executing the script downloadable from [Cleanup Container Host Networking](https://github.com/MicrosoftDocs/Virtualization-Documentation/tree/master/windows-server-container-tools/CleanupContainerHostNetworking),
which will refresh the network-related components on your host machine.


## Microsoft/DockerTools GitHub repo

For any other issues you encounter, see  [Microsoft/DockerTools](https://github.com/microsoft/dockertools/issues) issues.