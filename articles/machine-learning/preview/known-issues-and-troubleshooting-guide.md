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

> [!NOTE]
> When communicating with the support team over emails or forum posts, it is helpful to have the build number. You can find out the build number of the app by clicking on the **Help** menu. Clicking on the build number copies it to your clipboard. You can paste it into emails or support forums to help report issues.

![check version number](media/known-issues-and-troubleshooting-guide/version.png)

## Windows and Mac
### CentOS-based Azure Data Science Virtual Machine 
* Submitting jobs to CentOS-based Azure Data Science Virtual Machine (DSVM) is not supported. You can target [Ubuntu-based DSVM](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu).

### Docker error 
* When executing against a local Docker container, if you see the following error you can fix it by changing the Docker DNS Server from Automatic to Fixed 8.8.8.8. 
```
Get https://registry-1.docker.io/v2/: 
dial tcp: 
lookup registry-1.docker.io on [::1]:53: read udp [::1]:49385->[::1]:53: 
read: connection refused
```
![Image](media/known-issues-and-troubleshooting-guide/docker_dns.png)


### Linux VM password 
* If you change password from Azure portal on an Ubuntu Linux VM, you might might get the following error when executing a job on it:
  ```
  sudo: no tty present and no askpass program specified.
  ``` 

  The workaround is to add a file (example _myDockerUsers_) in _/etc/sudoers.d_ with following content:
  ```
  <your_username> ALL = NOPASSWD: /usr/bin/docker, /usr/bin/nvidia-docker
  ```

### SSH keys 
* SSH keys are not supported when connecting to a remote machine or Spark cluster over SSH. Only username/password mode is supported.

## Windows Only 
### Sharing C drive in Docker 
* Check the sharing on C drive using file explorer
* Open network adapter settings and uninstall/reinstall "File and Printer Sharing for Microsoft Networks" for vEthernet
* Open docker settings and share C drive from within docker settings
* Changes to the Windows password affect the sharing. Open File explorer, reshare the C drive, and enter the new password.
* You might also encounter firewall issue when attempting to share your C drive with Docker. This [Stack Overflow post](http://stackoverflow.com/questions/42203488/settings-to-windows-firewall-to-allow-docker-for-windows-to-share-drive/43904051) can be helpful.
* When sharing C drive using domain credentials, the sharing might stop working on networks where the domain controller is not reachable (for example, home network, public wifi etc.). For more information, see [this post](https://blogs.msdn.microsoft.com/stevelasker/2016/06/14/configuring-docker-for-windows-volumes/).



## Mac Only 
* Text clustering transforms are not supported on Mac.
* RevoScalePy library is not supported on Mac.

## Azure Machine Learning service Limits

- Max allowed project folder size: 25 MB
    >[!Note]
    >This limit doesn't apply to `.git`, `docs` and `outputs` folder. These folder names are case-sensitive.

- Max allowed experiment execution time: 7 days
- Max size of tracked file in `outputs` folder after a run: 512 MB 

>[!NOTE]
>If you are working with large files, refer to [Persisting Changes and Deal with Large Files](how-to-read-write-files.md).

## Other issues
If you are aware of other undocumented issues, send us feedback through _Send a Smile/Frown_. 



