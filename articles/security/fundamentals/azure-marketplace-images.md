---
title: Security recommendations for Azure Marketplace images
description: Review security recommendations for Azure Marketplace images, including Linux, open-source operating system, and Windows Server image checks.
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.custom: linux-related-content
ms.topic: article
ms.date: 07/20/2026
ms.author: mbaldwin
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---
# Security recommendations for Azure Marketplace images

Before you upload images to the Azure Marketplace, update your image to meet several security configuration requirements. These requirements help maintain a high level of security for partner solution images across the Azure Marketplace.

Run security vulnerability detection on your image before you submit it to the Azure Marketplace. If you detect a security vulnerability in your published image, inform your customers about the vulnerability details and how to correct it in current deployments.

## Linux and open-source OS images

| Category | Check |
| -------- | ----- |
| Security                                                     | Install the latest security patches for the Linux distribution.                                                                                                                                                                                                              |
| Security                                                     | Follow industry guidelines to secure the VM image for the specific Linux distribution.                                                                                                                                                                                     |
| Security                                                     | Limit the attack surface by keeping a minimal footprint with only necessary services, packages, and networking ports.                                                                                                                                                      |
| Security                                                     | Scan source code and resulting VM image for malware.                                                                                                                                                                                                                                   |
| Security                                                     | The VHD image includes only necessary locked accounts that don't have default passwords that would allow interactive sign-in. Don't include back doors.                                                                                                                               |
| Security                                                     | Disable firewall rules unless the application relies on them to function, such as a firewall appliance.                                                                                                                                                                             |
| Security                                                     | Remove all sensitive information from the VHD image, such as test SSH keys, known hosts file, log files, and unnecessary certificates.                                                                                                                                       |
| Security                                                     | Don't use LVM. LVM is vulnerable to write caching problems with VM hypervisors and also increases data recovery complexity for users of your image.                                                                                                                          |
| Security                                                     | Include supported versions of required libraries: </br> - OpenSSL 1.0 or later </br> - Python 3.x, unless your workload requires Python 2.x support </br> - `python-pyasn1` module, if it isn't already installed                                                             |
| Security                                                     | Clear Bash and shell history entries. These entries could include private information or plain-text credentials for other systems.                                                                                                                                            |
| Networking                                                   | Include the SSH server by default. Configure SSH keepalive in the `sshd` configuration with the following option: `ClientAliveInterval 180`.                                                                                                                                                        |
| Networking                                                   | Remove any custom network configuration from the image. Delete `/etc/resolv.conf`: `rm /etc/resolv.conf`.                                                                                                                                                                         |
| Deployment                                                   | Install the latest Azure Linux Agent.</br> - Install the agent by using an `.rpm` or `.deb` package. </br> - You can also use the manual installation process, but Microsoft recommends installer packages. </br> - If you install the agent manually from the GitHub repository, first copy the `waagent` file to `/usr/sbin`. Then run the following commands as root: </br>`# chmod 755 /usr/sbin/waagent` </br>`# /usr/sbin/waagent -install` </br>The installation places the agent configuration file at `/etc/waagent.conf`. |
| Deployment                                                   | Configure the image so Azure Support can provide partners with serial console output when needed and provide an adequate timeout for operating system disk mounting from cloud storage. Add the following parameters to the image kernel boot line: `console=ttyS0 earlyprintk=ttyS0 rootdelay=300`. |
| Deployment                                                   | Don't create a swap partition on the operating system disk. Request swap creation on the local resource disk by using the Azure Linux Agent.         |
| Deployment                                                   | Create a single root partition for the operating system disk.      |
| Deployment                                                   | 64-bit operating system only.                                                                                                                                                                                                                                                          |

## Windows Server images

| Category | Check |
| -------- | ----- |
| Security                                                         | Use a secure OS base image. For Windows Server images, use a source VHD from the Windows Server OS images provided through Microsoft Azure. |
| Security                                                         | Install the latest security updates.                                                                                                                                     |
| Security                                                         | Applications shouldn't depend on restricted user names like administrator, root, or admin.                                                                |
| Security                                                         | Enable BitLocker Drive Encryption for both OS hard drives and data hard drives.                                                             |
| Security                                                         | Limit the attack surface by keeping a minimal footprint with only necessary Windows Server roles, features, services, and networking ports enabled.                         |
| Security                                                         | Scan source code and resulting VM image for malware.                                                                                                                     |
| Security                                                         | Set Windows Server image security updates to install automatically.                                                                                                                |
| Security                                                         | The VHD image includes only necessary locked accounts that don't have default passwords that would allow interactive sign-in. Don't include back doors.                             |
| Security                                                         | Disable firewall rules unless the application relies on them to function, such as a firewall appliance.                                                               |
| Security                                                         | Remove all sensitive information from the VHD image, including HOSTS files, log files, and unnecessary certificates.                                              |
| Deployment                                                       | 64-bit operating system only.                            |

Even if your organization doesn't have images in the Azure Marketplace, consider checking your Windows and Linux image configurations against these recommendations.
