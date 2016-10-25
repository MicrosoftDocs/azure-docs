<properties
   pageTitle="Troubleshooting Docker Client Errors on Windows Using Visual Studio | Microsoft Azure"
   description="Troubleshoot problems you encounter when using Visual Studio to create and deploy web apps to Docker on Windows by using Visual Studio."
   services="azure-container-service"
   documentationCenter="na"
   authors="mlearned"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="06/08/2016"
   ms.author="allclark" />

# Troubleshooting Visual Studio Docker Development

When working with Visual Studio Tools for Docker Preview, you may encounter some problems due to the preview nature.
The following are some common issues and resolutions.


## Unable to validate volume mapping
Volume mapping is required to share the source code and binaries of your application with the app folder in the container.  Specific volume mappings are 
contained within the docker-compose.dev.debug.yml and docker-compose.dev.release.yml files. As files are changed on your host machine, the containers 
reflect these changes in a similar folder structure.

To enable volume mapping, open **Settings...** from the Docker For Windows "moby" tray icon and then select the **Shared Drives** tab.  Ensure that the drive letter 
which hosts your project as well as the drive letter where %USERPROFILE% resides are shared by checking them, and then clicking **Apply**.

To test if volume mapping is functioning, once the drive(s) have been shared, either Rebuild and F5 from within Visual Studio or try the following from a command prompt:

*In a Windows command prompt*

*[Note: This assumes your Users folder is located on the "C" drive and that it has been shared.  Update as necessary if you have shared a different drive]*
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

**Note:** *When working with Linux VMs, the container file system is case sensitive.*

##Build : "PrepareForBuild" task failed unexpectedly.

Microsoft.DotNet.Docker.CommandLine.ClientException: An error occurred trying to connect:

Verify the default docker host is running. Open a command prompt and execute:

```
docker info
```

If this returns an error then attempt to start the **Docker For Windows** desktop app.  If the desktop app is running then the **moby**
icon in the tray should be visible. Right click on the tray icon and open **Settings**.  Click on the **Reset** tab and then **Restart Docker..**.

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

1. Uninstall the previous version and install Docker Tools 0.40, and then **Add->Docker Support** again from the context menu for your ASP.Net Core Web or Console Application. This will add the new required Docker artifacts back to your project. 

## An error dialog occurs when attempting to **Add->Docker Support** or Debug (F5) an ASP.NET Core Application in a container

We have occasionally seen after uninstalling and installing extensions, Visual Studio's MEF (Managed Extensibility Framework) cache can become corrupt. When this occurs it can cause various error dialogs when adding Docker Support and/or attempting to run or Debug (F5) your ASP.NET Core Application. As a temporary workaround, execute the following steps to delete and regenerate the MEF cache.

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
