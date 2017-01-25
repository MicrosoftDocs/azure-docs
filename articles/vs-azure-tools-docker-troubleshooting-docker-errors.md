---
title: Troubleshooting Docker Client Errors on Windows Using Visual Studio | Microsoft Docs
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

# Troubleshooting Visual Studio Docker Development

When working with Visual Studio Tools for Docker Preview, you may encounter some problems due to the preview nature.
The following are some common issues and resolutions.  

## Visual Studio 2017 RC

### **Linux Containers**

###  Build errors occur when debugging a .NET Core web or console application.  

This could be related to not sharing the drive where the project resides with Docker For Windows.  You may receive an error such as the following:

```
The "PrepareForLaunch" task failed unexpectedly.
Microsoft.DotNet.Docker.CommandLineClientException: Creating network "webapplication13628050196_default" with the default driver
Building webapplication1
Creating webapplication13628050196_webapplication1_1
ERROR: for webapplication1  Cannot create container for service webapplication1: C: drive is not shared. Please share it in Docker for Windows Settings
```
To resolve, right-click on the Docker for Windows system tray icon and select "Settings...".  Click the "Shared Drives" tab and share the drive letter where the project resides.

### **Windows Containers** 

The following are specific to troubleshooting issues when debugging .NET Framework web and console applications in windows containers

### Pre-requisites

1. Visual Studio 2017 RC (or later) with the .NET Core and Docker (Preview) workload installed.
2. Windows 10 Anniversary Update with the latest windows update patches installed. 
3. Docker For Windows (Beta) - https://docs.docker.com/docker-for-windows/ (Version 1.12.2-beta28 7813 or later).
4. From the Docker For Windows system tray icon, select "Switch to Windows containers."  After the machine restarts, ensure this setting is retained. 

### Console output does not appear in Visual Studio's output window while debugging a console application.

This is a known issue with the Visual Studio Debugger (msvsmon.exe), which is currently not designed for this scenario.  We are looking into providing support for this in 
a future release.  To see output from the console application in Visual Studio, use "Docker: Start Project", which is equivalent to "Start without Debugging".

### Debugging web applications with the release configuration fails with (403) Forbidden error.

To work around the issue, open the web.release.config file in the solution and comment out or delete the following lines:

```
<compilation xdt:Transform="RemoveAttributes(debug)" /> 
```

### When switching to windows containers, you could potentially see an error dialog stating "Error response from daemon: i/o timeout".

This issue in Docker For Windows can be tracked at https://github.com/docker/for-win/issues/178.


## Visual Studio 2015

### **Linux Containers** 

### Unable to validate volume mapping
Volume mapping is required to share the source code and binaries of your application with the app folder in the container.  Specific volume mappings are 
contained within the docker-compose.dev.debug.yml and docker-compose.dev.release.yml files. As files are changed on your host machine, the containers 
reflect these changes in a similar folder structure.

To enable volume mapping, open **Settings...** from the Docker For Windows "moby" tray icon and then select the **Shared Drives** tab.  Ensure that the drive letter, which 
hosts your project, and the drive letter where %USERPROFILE% resides are shared by checking them, and then clicking **Apply**.

To test if volume mapping is functioning, once once or more drives have been shared, either Rebuild and F5 from within Visual Studio or try the following from a command prompt:

*In a Windows command prompt*

> [!Note]
> This example assumes your Users folder is located on the "C" drive and that it has been shared.
> Update as necessary if you have shared a different drive.

```
docker run -it -v /c/Users/Public:/wormhole busybox
```

*In the Linux container*

```
/ # ls
```

You should see a directory listing from the Users/Public folder.
If no files are displayed, and your /c/Users/Public folder isn't empty, volume mapping is not configured properly. 

```
bin       etc       proc      sys       usr       wormhole
dev       home      root      tmp       var
```

Change into the wormhole directory to see the contents of the `/c/Users/Public` directory:

```
/ # cd wormhole/
/wormhole # ls
AccountPictures  Downloads        Music            Videos
Desktop          Host             NuGet.Config     desktop.ini
Documents        Libraries        Pictures
/wormhole #
```

> [!Note]
> When working with Linux VMs, the container file system is case sensitive.

##Build : "PrepareForBuild" task failed unexpectedly.

Microsoft.DotNet.Docker.CommandLine.ClientException: An error occurred trying to connect:

Verify the default docker host is running. Open a command prompt and execute:

```
docker info
```

If this returns an error then attempt to start the **Docker For Windows** desktop app.  If the desktop app is running, then the **moby**
icon in the tray should be visible. Right click the tray icon and open **Settings**.  Click the **Reset** tab and then **Restart Docker..**.

##Manually upgrading from version 0.31 to 0.40


1. Backup the project
1. Delete the following files in the project:

    ```
      Dockerfile
      Dockerfile.debug
      DockerTask.ps1
      docker-compose-yml
      docker-compose.debug.yml
      .dockerignore
      Properties\Docker.props
      Properties\Docker.targets
    ```

1. Close the Solution and remove the following lines from the .xproj file:

    ```
      <DockerToolsMinVersion>0.xx</DockerToolsMinVersion>
      <Import Project="Properties\Docker.props" />
      <Import Project="Properties\Docker.targets" />
    ```

1. Reopen the Solution
1. Remove the following lines from the Properties\launchSettings.json file:

    ```
      "Docker": {
        "executablePath": "%WINDIR%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
        "commandLineArgs": "-ExecutionPolicy RemoteSigned .\\DockerTask.ps1 -Run -Environment $(Configuration) -Machine '$(DockerMachineName)'"
      }
    ```

1. Remove the following files related to Docker from project.json in the publishOptions:

    ```
    "publishOptions": {
      "include": [
        ...
        "docker-compose.yml",
        "docker-compose.debug.yml",
        "Dockerfile.debug",
        "Dockerfile",
        ".dockerignore"
      ]
    },
    ```

1. Uninstall the previous version and install Docker Tools 0.40, and then **Add->Docker Support** again from the context menu for your ASP.Net Core Web or Console Application. This adds the new required Docker artifacts back to your project. 

## An error dialog occurs when attempting to **Add->Docker Support** or Debug (F5) an ASP.NET Core Application in a container

We have occasionally seen after uninstalling and installing extensions, Visual Studio's MEF (Managed Extensibility Framework) cache can become corrupt. When this occurs, it can cause various error dialogs when adding Docker Support and/or attempting to run or Debug (F5) your ASP.NET Core Application. As a temporary workaround, execute the following steps to delete and regenerate the MEF cache.

1. Close all instances of Visual Studio
1. Open %USERPROFILE%\AppData\Local\Microsoft\VisualStudio\14.0\
1. Delete the following folders
     ```
       ComponentModelCache
       Extensions
       MEFCacheBackup
    ```
1. Open Visual Studio
1. Attempt the scenario again 
