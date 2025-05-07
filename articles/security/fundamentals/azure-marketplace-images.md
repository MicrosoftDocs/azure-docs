---
title: Security Recommendations for Azure Marketplace Images | Microsoft Docs
description: This article provides recommendations for images included in the market place
services: security
author: msmbaldwin
manager: rkarlin
ms.service: security
ms.subservice: security-fundamentals
ms.custom: linux-related-content
ms.topic: article
ms.date: 09/06/2024
ms.author: mbaldwin
ms.reviewer: mattmcinnes
---
# Security Recommendations for Azure Marketplace Images

Prior to uploading images to the Azure Marketplace, your image must be updated with several security configuration requirements. These requirements help maintain a high level of security for partner solution images across the Azure Marketplace.

Make sure to run a security vulnerability detection on your image Prior to submitting it to the Azure Marketplace. If you detect a security vulnerability in your own already published image, you must inform your customers in a timely manner both of the vulnerability's details and how to correct it in current deployments.

## Linux and open source OS images

| Category | Check |
| -------- | ----- |
| Security                                                     | Install all the latest security patches for the Linux distribution.                                                                                                                                                                                                              |
| Security                                                     | Follow industry guidelines to secure the VM image for the specific Linux distribution.                                                                                                                                                                                     |
| Security                                                     | Limit the attack surface by keeping minimal footprint with only necessary Windows Server roles, features, services, and networking ports.                                                                                                                                               |
| Security                                                     | Scan source code and resulting VM image for malware.                                                                                                                                                                                                                                   |
| Security                                                     | The VHD image only includes necessary locked accounts that do not have default passwords that would allow interactive login; no back doors.                                                                                                                                           |
| Security                                                     | Disable firewall rules unless application functionally relies on them, such as a firewall appliance.                                                                                                                                                                             |
| Security                                                     | Remove all sensitive information from the VHD image, such as test SSH keys, known hosts file, log files, and unnecessary certificates.                                                                                                                                       |
| Security                                                     | Avoid using LVM. LVM is Vulnerable to write caching issues with VM hypervisors and also increases data recovery complexity for users of your image.                                                                                                                          |
| Security                                                     | Include the latest versions of required libraries: </br> - OpenSSL v1.0 or greater </br> - Python 2.5 or above (Python 2.6+ is highly recommended) </br> - Python pyasn1 package if not already installed </br> - d.OpenSSL v 1.0 or greater                                   |
| Security                                                     | Clear Bash/Shell history entries. This could include private information or plain-text credentials for other systems.                                                                                                                                                         |
| Networking                                                   | Include the SSH server by default. Set SSH keep alive to sshd config with the following option: ClientAliveInterval 180.                                                                                                                                                        |
| Networking                                                   | Remove any custom network configuration from the image. Delete the resolv.conf: `rm /etc/resolv.conf`.                                                                                                                                                                         |
| Deployment                                                   | Install the latest Azure Linux Agent.</br> -  Install using the RPM or Deb package.  </br> - You may also use the manual install process, but the installer packages are recommended and preferred. </br> - If installing the agent manually from the GitHub repository, first copy the `waagent` file to `/usr/sbin` and run (as root): </br>`# chmod 755 /usr/sbin/waagent` </br>`# /usr/sbin/waagent -install` </br>The agent configuration file is placed at `/etc/waagent.conf`. |
| Deployment                                                   | Ensure Azure Support can provide our partners with serial console output when needed and provide adequate timeout for OS disk mounting from cloud storage. Add the following parameters to the image Kernel Boot Line: `console=ttyS0 earlyprintk=ttyS0 rootdelay=300`. |
| Deployment                                                   | No swap partition on the OS disk. Swap can be requested for creation on the local resource disk by the Linux Agent.         |
| Deployment                                                   | Create a single root partition for the OS disk.      |
| Deployment                                                   | 64-bit operating system only.                                                                                                                                                                                                                                                          |

## Windows Server images

| Category | Check |
|--------- | ----- |
| Security                                                         | Use a secure OS base image. The VHD used for the source of any image based on Windows Server must be from the Windows Server OS images provided through Microsoft Azure. |
| Security                                                         | Install all latest security updates.                                                                                                                                     |
| Security                                                         | Applications should not depend on restricted user names like administrator, root, or admin.                                                                |
| Security                                                         | Enable BitLocker Drive Encryption for both OS hard drives and data hard drives.                                                             |
| Security                                                         | Limit the attack surface by keeping minimal footprint with only necessary Windows Server roles, features, services, and networking ports enabled.                         |
| Security                                                         | Scan source code and resulting VM image for malware.                                                                                                                     |
| Security                                                         | Set Windows Server images security update to auto-update.                                                                                                                |
| Security                                                         | The VHD image only includes necessary locked accounts that do not have default passwords that would allow interactive login; no back doors.                             |
| Security                                                         | Disable firewall rules unless application functionally relies on them, such as a firewall appliance.                                                               |
| Security                                                         | Remove all sensitive information from the VHD image, including HOSTS files, log files, and unnecessary certificates.                                              |
| Deployment                                                       | 64-bit operating system only.                            |

Even if your organization does not have images in the Azure marketplace, consider checking your Windows and Linux image configurations against these recommendations.
