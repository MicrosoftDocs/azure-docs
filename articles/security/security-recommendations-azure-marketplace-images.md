---
title: Security Recommendations for Azure Marketplace Images | Microsoft Docs
description: This article provides recommendations for images included in the market place
services: security
documentationcenter: na
author: barclayn
manager: barbkess
ms.assetid: 
ms.service: security
ms.devlang: na
ms.topic: article
ms.date: 01/11/2019
ms.author: barclayn

---
# Security Recommendations for Azure Marketplace Images

We recommend that each solution complies with the following security configuration recommendations. This helps maintain a high level of security for partner solution images in the Azure Marketplace.

These recommendations can also be helpful for organizations that do not have images in the Azure marketplace. You may want to check your company's Windows and Linux image configurations against the guidelines found in the following tables:

## Open Source-based Images

|||
|--------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Category**                                                 | **Check**                                                                                                                                                                                                                                                                              |
| Security                                                     | All the latest security patches for the Linux distribution are installed.                                                                                                                                                                                                              |
| Security                                                     | Industry guidelines to secure the VM image for the specific Linux distribution have been followed.                                                                                                                                                                                     |
| Security                                                     | Limit the attack surface by keeping minimal footprint with only necessary Windows Server roles, features, services, and networking ports.                                                                                                                                               |
| Security                                                     | Scan source code and resulting VM image for malware.                                                                                                                                                                                                                                   |
| Security                                                     | The VHD image only includes necessary locked accounts, that do not have default passwords that would allow interactive login; no back doors.                                                                                                                                           |
| Security                                                     | Firewall rules are disabled, unless application functionally relies on them, such as a firewall appliance.                                                                                                                                                                             |
| Security                                                     | All sensitive information has been removed from the VHD image, such as test SSH keys, known hosts file, log files, and unnecessary certificates.                                                                                                                                       |
| Security                                                     | It is recommended that LVM should not used.                                                                                                                                                                                                                                            |
| Security                                                     | Latest versions of required libraries should be included: </br> - OpenSSL v1.0 or greater </br> - Python 2.5 or above (Python 2.6+ is highly recommended) </br> - Python pyasn1 package if not already installed </br> - d.OpenSSL v 1.0 or greater                                                                |
| Security                                                     | Bash/Shell history entries must be cleared                                                                                                                                                                                                                                             |
| Networking                                                   | SSH server should be included by default. Set SSH keep alive to sshd config with the following option: ClientAliveInterval 180                                                                                                                                                        |
| Networking                                                   | Image should not contain any custom network configuration. Delete the resolv.conf: `rm /etc/resolv.conf`                                                                                                                                                                                |
| Deployment                                                   | Latest Azure Linux Agent should be installed </br> -  The agent should be installed using the RPM or Deb package.  </br> - You may also use the manual install process, but the installer packages are recommended and preferred. </br> - If installing the agent manually from the GitHub repository, first copy the `waagent` file to `/usr/sbin` and run (as root): </br>`# chmod 755 /usr/sbin/waagent` </br>`# /usr/sbin/waagent -install` </br>The agent configuration file is placed at `/etc/waagent.conf`.    |
| Deployment                                                   | Ensures that Azure Support can provide our partners with serial console output when needed and provide adequate timeout for OS disk mounting from cloud storage. Image must have added the following parameters to the Kernel Boot Line: `console=ttyS0 earlyprintk=ttyS0 rootdelay=300` |
| Deployment                                                   | No swap partition on the OS disk. Swap can be requested for creation on the local resource disk by the Linux Agent.         |
| Deployment                                                   | It is recommended that a single root partition is created for the OS disk.      |
| Deployment                                                   | 64-bit operating system only.                                                                                                                                                                                                                                                          |

## Windows Server-based Images

|||
|-------------| -------------------------|
| **Category**                                                     | **Check**                                                                                                                                                                |
| Security                                                         | Use a secure OS base image. The VHD used for the source of any image based on Windows Server must be from the Windows Server OS images provided through Microsoft Azure. |
| Security                                                         | Install all latest security updates.                                                                                                                                     |
| Security                                                         | Applications should not have a dependency on restricted user names such as Administrator, root and admin.                                                                |
| Security                                                         | BitLocker Drive Encryption is not supported on the operating system hard disk. BitLocker may be used on data disks.                                                            |
| Security                                                         | Limit the attack surface by keeping minimal footprint with only necessary Windows Server roles, features, services, and networking ports enabled.                         |
| Security                                                         | Scan source code and resulting VM image for malware.                                                                                                                     |
| Security                                                         | Set Windows Server images security update to auto-update.                                                                                                                |
| Security                                                         | The VHD image only includes necessary locked accounts, that do not have default passwords that would allow interactive login; no back doors.                             |
| Security                                                         | Firewall rules are disabled, unless application functionally relies on them, such as a firewall appliance.                                                               |
| Security                                                         | All sensitive information has been removed from the VHD image. For example, HOSTS file, log files, and unnecessary certificates should be removed.                                              |
| Deployment                                                       | 64-bit operating system only.                            |
