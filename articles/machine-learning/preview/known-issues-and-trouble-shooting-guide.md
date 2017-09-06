---
title: Known Issues and Trouble Shooting Guide | Microsoft Docs
description: List of known issues and a guide to help trouble-shoot 
services: machine-learning
author: rastala
ms.author: roastala
manager: jhubbard
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 08/31/2017
---

# Known Issues And Trouble Shooting Guide 

## Security
* When connecting to remote machine or Spark clusters over SSH for scripts execution, RSA keys are not supported yet. Only user name and password mode is supported.
* When entering SSH password (either from UX or from CLI) to configure remote compute context execution, the passwords are stored on disk in plain text.

## Installation
* auto-update on *Windows* to 0.1.1706.05012 (and newer) from May/April versions:
  - Issue: the exe and shortcut name has been renamed from 'Workbench' to 'Vienna', interfering with the auto-update
  - if you have not launched the old shortcut 'Workbench' since late Monday June 5th:
    - launch 'Workbench', do NOT click the 'skip update' button, i.e. let it do its update check and download; for early May or older versions, let it sit for 3-4 minutes
  - open command line:
    - ```dir  %LOCALAPPDATA%\Vienna\app-0.1.1706.05012\vienna.exe``` => confirms that updated app was downloaded bu auto-update
    - ```%LOCALAPPDATA%\Vienna\app-0.1.1706.05012\vienna.exe --squirrel-updated``` => recreates a new 'Vienna' desktop shortcut
    - launch 'Vienna' shortcut and accept its dependency install updates
    - delete now-obsolete 'Workbench' desktop shortcut
    - if this workaround fails, please re-install by downloading the latest [Vienna Windows installer](https://vienna.blob.core.windows.net/windows/ViennaSetup.exe)

## Sharing C drive in Docker for Windows stops working
* Make sure you also enabling sharing C drive using file explorer
* Go to network adapter settings and uninstall/reinstall "File and Printer Sharing for Microsoft Networks" for vEthernet
* Now go to docker settings and share C drive in docker settings
* If you change the Windows user password, the sharing will stop to work. You need to reshare the C drive and enter the new password.
* You might also encounter firewall issue when attempting to share your C drive with Docker. This [Stack Overflow post](http://stackoverflow.com/questions/42203488/settings-to-windows-firewall-to-allow-docker-for-windows-to-share-drive/43904051) can be helpful.
* If you use a domain\username to log in when sharing C drive from Docker, and you are on a network where domain controller is not reachable (such as home netwoork or public wifi), the sharing might stop working. The workaround is to create a local user and share through that user. See [this post](https://blogs.msdn.microsoft.com/stevelasker/2016/06/14/configuring-docker-for-windows-volumes/) for more details.

## DataPrep
- Text clustering transform doesn't work on macOS.

## Python/PySpark Script Execution
>For more information on execution targets, please review _[Configuring Project "Vienna" Scripts Execution](Execution.md)_.

* Project folder with space in its name is not supported. It will cause execution to fail silently.
* First time execution against _docker_ can take a long time because it is pulling down a base Docker image, and building Docker layers based on your conda file specification, and then starting up a Docker container, copying your project files into it, and then execution can begin. The subsequent runs should be faster.
* If you want to target an Azure Data Science Virtual Machine (DSVM) instance for execution, please ensure that you use an [Ubuntu-based DSVM](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu). CentOS-based DSVM is not supported.
* If you change the password on the Linux VM from Azure portal, and then you try to execute against that VM you will see an error about "sudo: no tty present and no askpass program specified". To work around this, please simply add a file named _myDockerUsers_ (any file name works as long as it has no dot in the file name) in _/etc/sudoers.d_ with following content (replace \<username> with the actual username):
```
<username> ALL = NOPASSWD: /usr/bin/docker, /usr/bin/nvidia-docker
```
* When executing against a local Docker container on Windows, if you see the below error, you can fix it by changing the Docker DNS Server from Automatic to Fixed 8.8.8.8. 
```
Get https://registry-1.docker.io/v2/: 
dial tcp: 
lookup registry-1.docker.io on [::1]:53: read udp [::1]:49385->[::1]:53: 
read: connection refused
```
![Docker DNS setting](../Images/docker_dns.png)



## Operationalization (O16N) CLI

## Feedback
If you discovered other undocumented issues, please be sure to let us know. please send us feedback through these [various feedback channels](Feedback.md).

