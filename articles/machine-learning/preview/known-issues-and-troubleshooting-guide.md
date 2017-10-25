---
title: Known Issues and Troubleshooting Guide | Microsoft Docs
description: List of known issues and a guide to help troubleshoot 
services: machine-learning
author: svankam
ms.author: svankam
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/20/2017 
---

# Azure Machine Learning Workbench - Known Issues And Troubleshooting Guide 
This article helps you find and correct errors or failures encountered as a part of using the Azure Machine Learning Workbench application. 

> [!IMPORTANT]
> When communicating with the support team, it is important to have the build number. You can find out the build number of the app by clicking on the **Help** menu. Clicking on the build number copies it to your clipboard. You can paste it into emails or support forums to help report issues.

![check version number](media/known-issues-and-troubleshooting-guide/buildno.png)

## Machine Learning MSDN Forum
We have an MSDN Forum that you can post questions. The product team monitors the forum actively. 
The forum URL is [https://aka.ms/azureml-forum](https://aka.ms/azureml-forum). 

## Gather diagnostics information
Sometimes it can be helpful if you can provide diagnostic information when asking for help. Here is where the log files live:

### Installer
If you run into issue during installation, the installer log files are here:

```
# Windows:
%TEMP%\amlinstaller\logs\*

# macOS:
/tmp/amlinstaller/logs/*
```
You can zip up the contents of these directories and send it to us for diagnostics.

### Workbench desktop app
If the Workbench desktop crashes, you can find log files here:
```
# Windows
%APPDATA%\AmlWorkbench

# macOS
~/Library/Application Support/AmlWorkbench
``` 
You can zip up the contents of these directories and send it to us for diagnostics.

### Experiment execution
If a particular script fails during submission from the desktop app, try to resubmit it through CLI using `az ml experiment submit` command. This should give you full error message in JSON format, and most importantly it contains an **operation ID** value. Send us the JSON file including the **operation ID** and we can help diagnose. 

If a particular script succeeds in submission but fails in execution, it should print out the **Run ID** to identify that particular run. You can package up the relevant log files using the following command:

```azurecli
# Create a ZIP file that contains all the diagnostics information
$ az ml experiment diagnostics -r <run_id> -t <target_name>
```

The `az ml experiment diagnostics` command generates a `diagnostics.zip` file in the project root folder. The ZIP package contains the entire project folder in the state at the time it was executed, plus logging information. Be sure to remove any sensitive information you don't want to include before sending us the diagnostics file.

## Send us a frown (or a smile)

When you are working in Azure ML Workbench, you can also send us a frown (or a smile) by clicking on the smiley face icon at the lower left corner of the application shell. You can optionally choose to include your email address (so we can get back to you), and/or a screenshot of the current state. 

## Known service limits
- Max allowed project folder size: 25 MB.
    >[!NOTE]
    >This limit doesn't apply to `.git`, `docs` and `outputs` folders. These folder names are case-sensitive. If you are working with large files, refer to [Persisting Changes and Deal with Large Files](how-to-read-write-files.md).

- Max allowed experiment execution time: seven days
- Max size of tracked file in `outputs` folder after a run: 512 MB
  - This means if your script produces a file larger than 512 MB in the outputs folder, it is not collected there. If you are working with large files, refer to [Persisting Changes and Deal with Large Files](how-to-read-write-files.md).

- SSH keys are not supported when connecting to a remote machine or Spark cluster over SSH. Only username/password mode is currently supported.

- Text clustering transforms are not supported on Mac.

- RevoScalePy library is only supported on Windows and Linux (in Docker containers). It is not supported on macOS.

## File name too long on Windows
If you uses Workbench on Windows, you might run into the default maximum 260-character file name length limit, which could surface as a somewhat misleading "system cannot find the path specified" error. You can modify a registry key setting to allow much longer file path name. Review [this article](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247%28v=vs.85%29.aspx?#maxpath) for more details on how to set the _MAX_PATH_ registry key.

## Docker error "read: connection refused"
When executing against a local Docker container, sometimes you might see the following error: 
```
Get https://registry-1.docker.io/v2/: 
dial tcp: 
lookup registry-1.docker.io on [::1]:53: read udp [::1]:49385->[::1]:53: 
read: connection refused
```

You can fix it by changing the Docker DNS Server from `automatic` to a fixed value of `8.8.8.8`.

## Remove VM execution error "no tty present"
When executing against a Docker container on a remote Linux machine, you might encounter the following error message:
```
sudo: no tty present and no askpass program specified.
``` 
This can happen if you use Azure portal to change the root password of an Ubuntu Linux VM. 

Azure Machine Learning Workbench requires password-less sudoers access to run on remote hosts. The simplest way to do that is to use _visudo_ to edit the following file (you may create the file if it does not exist):

```
$ sudo visudo -f /etc/sudoers
```

>[!IMPORTANT]
>It is important to edit the file with _visudo_ and not another command. _visudo_ automatically syntax checks all sudo config files, and failure to produce a syntactically correct sudoers file can lock you out of sudo.

Insert the following line at the end of the file:

```
username ALL=(ALL) NOPASSWD:ALL
```

Where _username_ is the name of Azure Machine Learning Workbench will use to log in to your remote host.

The line must be placed after #includedir "/etc/sudoers.d", otherwise it may be overridden by another rule.

If you have a more complicated sudo configuration, you may want to consult sudo documentation for Ubuntu available here: https://help.ubuntu.com/community/Sudoers

The above error can also happen if you are not using an Ubuntu-based Linux VM in Azure as an execution target. We only support Ubuntu-based Linux VM for remote execution. 

## VM disk is full
By default when you create a new Linux VM in Azure, you get a 30-GB disk for the operating system. Docker engine by default uses the same disk for pulling down images and running containers. This can fill up the OS disk and you see a "VM Disk is Full" error when it happens.

A quick fix is to remove all Docker images you no longer use. The following Docker command does just that. (Of course you have to SSH into the VM in order to execute the Docker command from a bash shell.)

```
$ docker system prune -a
```

You can also add a data disk and configure Docker engine to use the data disk for storing images. Here is [how to add a data disk](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/add-disk). You can then [change where Docker stores images](https://forums.docker.com/t/how-do-i-change-the-docker-image-installation-directory/1169).

Or, you can expand the OS disk, and you don't have to touch Docker engine configuration. Here is [how you can expand the OS disk](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/add-disk).

## Sharing C drive on Windows
If you are executing in a local Docker container on Windows, setting `sharedVolumes` to `true` in the `docker.compute` file under `aml_config` can improve execution performance. However, this requires you share C drive in the _Docker for Windows Tool_. If you are not able to share C drive, try the following tips:

* Check the sharing on C drive using file explorer
* Open network adapter settings and uninstall/reinstall "File and Printer Sharing for Microsoft Networks" for vEthernet
* Open docker settings and share C drive from within docker settings
* Changes to the Windows password affect the sharing. Open File explorer, reshare the C drive, and enter the new password.
* You might also encounter firewall issue when attempting to share your C drive with Docker. This [Stack Overflow post](http://stackoverflow.com/questions/42203488/settings-to-windows-firewall-to-allow-docker-for-windows-to-share-drive/43904051) can be helpful.
* When sharing C drive using domain credentials, the sharing might stop working on networks where the domain controller is not reachable (for example, home network, public wifi etc.). For more information, see [this post](https://blogs.msdn.microsoft.com/stevelasker/2016/06/14/configuring-docker-for-windows-volumes/).

You can also avoid the sharing problem, at a small performance cost, by setting `sharedVolumne` to `false` in the `docker.compute` file.

## Some useful Docker commands

Here are some useful Docker commands:

```sh
# display all running containers
$ docker ps

# dislplay all containers (running or stopped)
$ docke ps -a

# display all images
$ docker images

# show Docker logs of a container
$ docker logs <container_id>

# create a new container and launch into a bash shell
$ docker run <image_id> /bin/bash

# launch into a bash shell on a running container
$ docker exec -it <container_id> /bin/bash

# stop an running container
$ docker stop <container_id>

# delete a container
$ docker rm <container_id>

# delete an image
$ docker rmi <image_id>

# delete all unussed Docker images 
$ docker system prune -a

```
