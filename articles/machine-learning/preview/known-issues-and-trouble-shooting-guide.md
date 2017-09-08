---
title: Known Issues and Trouble Shooting Guide | Microsoft Docs
description: List of known issues and a guide to help trouble-shoot 
services: machine-learning
author: svankam
ms.author: svankam
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/05/2017
---

# Known Issues And Trouble Shooting Guide 

## Security
* RSA keys are not supported when connecting to a remote machine or Spark cluster over SSH. Only username/password mode is supported.

## Sharing C drive in Docker for Windows stops working
* Check the sharing on C drive using file explorer
* Open network adapter settings and uninstall/reinstall "File and Printer Sharing for Microsoft Networks" for vEthernet
* Open docker settings and share C drive from within docker settings
* Changes to the Windows password affect the sharing. Open File explorer, reshare the C drive, and enter the new password.
* You might also encounter firewall issue when attempting to share your C drive with Docker. This [Stack Overflow post](http://stackoverflow.com/questions/42203488/settings-to-windows-firewall-to-allow-docker-for-windows-to-share-drive/43904051) can be helpful.
* When sharing C drive using domain credentials, the sharing might stop working on networks where the domain controller is not reachable (for example, home network, public wifi etc.). For more information, see [this post](https://blogs.msdn.microsoft.com/stevelasker/2016/06/14/configuring-docker-for-windows-volumes/).

## DataPrep
- Text clustering transform doesn't work on macOS.

## Python/PySpark Script Execution
* CentOS-based Azure Data Science Virtual Machine (DSVM) is not supported. You can target [Ubuntu-based DSVM](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu).
* If you change the password on the Linux VM from Azure portal, and then you try to execute against that VM you see an error about "sudo: no tty present and no askpass program specified". Workaround: add a file named _myDockerUsers_ (any file name works as long as it has no dot in the file name) in _/etc/sudoers.d_ with following content (replace \<username> with the actual username):
```
<username> ALL = NOPASSWD: /usr/bin/docker, /usr/bin/nvidia-docker
```

## Docker
* When executing against a local Docker container, if you see the following error, you can fix it by changing the Docker DNS Server from Automatic to Fixed 8.8.8.8. 
```
Get https://registry-1.docker.io/v2/: 
dial tcp: 
lookup registry-1.docker.io on [::1]:53: read udp [::1]:49385->[::1]:53: 
read: connection refused
```
![Image](media/known-issues-and-trouble-shooting-guide/docker_dns.png)





## Operationalization (O16N) CLI

## Feedback
If you discovered other undocumented issues, send feedback through _Send a Smile/Frown_. 

