---
title: Troubleshooting Docker client errors on Windows by using Visual Studio | Microsoft Docs
description: Troubleshoot problems you encounter when using Visual Studio to create and deploy web apps to Docker on Windows by using Visual Studio.
services: azure-container-service
documentationcenter: na
author: mlearned
manager: douge
editor: ''

ms.assetid: 346f70b9-7b52-4688-a8e8-8f53869618d3
ms.service: multiple
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 06/08/2016
ms.author: mlearned

---

# Troubleshoot Visual Studio Docker development

When you're working with Visual Studio Tools for Docker Preview, you may encounter some problems because of the nature of the preview.
Following are some common issues and resolutions.  

## Visual Studio 2017 RC

### **Linux containers**

####  Build errors occur when debugging a .NET Core web or console application  

This could be related to not sharing the drive where the project resides with Docker for Windows.  You may receive an error like the following:

```
The "PrepareForLaunch" task failed unexpectedly.
Microsoft.DotNet.Docker.CommandLineClientException: Creating network "webapplication13628050196_default" with the default driver
Building webapplication1
Creating webapplication13628050196_webapplication1_1
ERROR: for webapplication1  Cannot create container for service webapplication1: C: drive is not shared. Please share it in Docker for Windows Settings
```
To resolve this issue:

1. Right-click **Docker for Windows** in the notification area, and then select **Settings**.  
2. Select **Shared Drives** and share the drive where the project resides.

### **Windows containers**

The following issues are specific to debugging .NET Framework web and console applications in Windows containers.

#### Prerequisites

1. Visual Studio 2017 RC (or later) with the .NET Core and Docker Preview workload must be installed.
2. Windows 10 Anniversary Update with that latest Windows Update patches. Specifically [KB3194798](https://support.microsoft.com/en-us/help/3194798/cumulative-update-for-windows-10-version-1607-and-windows-server-2016-october-11,-2016) must be installed. 
3. [Docker for Windows](https://docs.docker.com/docker-for-windows/) (build 1.13.0 or later) must be installed.
4. **Switch to Windows containers** must be selected. In the notification area, click **Docker for Windows**, and then select **Switch to Windows containers**. After the machine restarts, ensure that this setting is retained.

#### Console output does not appear in Visual Studio's output window while debugging a console application

This is a known issue with the Visual Studio debugger (msvsmon.exe), which is currently not designed for this scenario. Support for this scenario might be included in a future release. To see output from the console application in Visual Studio, use **Docker: Start Project**, which is equivalent to **Start without Debugging**.

#### Debugging web applications with the release configuration fails with (403) Forbidden error

To work around this issue, open web.release.config in the solution and comment out or delete the following lines:

```
<compilation xdt:Transform="RemoveAttributes(debug)" />
```

## Visual Studio 2015

### **Linux containers**

#### Unable to validate volume mapping
Volume mapping is required to share the source code and binaries of your application with the app folder in the container.  Specific volume mappings are
contained within docker-compose.dev.debug.yml and docker-compose.dev.release.yml. As files are changed on your host machine, the containers
reflect these changes in a similar folder structure.

To enable volume mapping:

1. Click **Moby** in the notification area and select **Settings**.
2. Select **Shared Drives**.
3. Select the drive that hosts your project and the drive where %USERPROFILE% resides.
4. Click **Apply**.

To test if volume mapping is functioning, Rebuild and select F5 from within Visual Studio after one or more drives have been shared, or run the following code from a command prompt.

> [!NOTE]
> This example assumes that your Users folder is located on drive C and that it has been shared.
> Revise as necessary if you have shared a different drive.

```
docker run -it -v /c/Users/Public:/wormhole busybox
```

Run the following code in the Linux container.

```
/ # ls
```

You should see a directory listing from the Users/Public folder. If no files are displayed and your /c/Users/Public folder isn't empty, volume mapping is not configured properly.

```
bin       etc       proc      sys       usr       wormhole
dev       home      root      tmp       var
```

Change to the wormhole directory to see the contents of the `/c/Users/Public` directory:

```
/ # cd wormhole/
/wormhole # ls
AccountPictures  Downloads        Music            Videos
Desktop          Host             NuGet.Config     desktop.ini
Documents        Libraries        Pictures
/wormhole #
```

> [!NOTE]
> When you're working with Linux VMs, the container file system is case-sensitive.

## Build: "PrepareForBuild" task failed unexpectedly

Microsoft.DotNet.Docker.CommandLine.ClientException: An error occurred trying to connect.

Verify that the default Docker host is running. Open a command prompt and execute:

```
docker info
```

If this returns an error, then attempt to start the **Docker for Windows** desktop app. If the desktop app is running, then **Moby** should be visible in the notification area. Right-click **Moby** and open **Settings**. Click **Reset**, and then restart Docker.

## An error dialog occurs when attempting to add Docker Support or debug (F5) an ASP.NET Core application in a container

After uninstalling and installing extensions, the Managed Extensibility Framework (MEF) cache in Visual Studio can become corrupted. When this occurs, it can cause various error messages when you're adding Docker Support and/or attempting to run or debug (F5) your ASP.NET Core application. As a temporary workaround, use the following steps to delete and regenerate the MEF cache.

1. Close all instances of Visual Studio.
1. Open %USERPROFILE%\AppData\Local\Microsoft\VisualStudio\14.0\.
1. Delete the following folders:
     ```
       ComponentModelCache
       Extensions
       MEFCacheBackup
    ```
1. Open Visual Studio.
1. Attempt the scenario again.
