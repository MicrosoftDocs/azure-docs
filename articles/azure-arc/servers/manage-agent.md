---
title:  Managing the Azure Arc for servers (preview) agent
description: This article describes the different management tasks that you will typically perform during the lifecycle of the Azure Arc for servers Connected Machine agent.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
ms.date: 03/24/2020
ms.topic: conceptual
---

# Managing and maintaining the Connected Machine agent

After initial deployment of the Azure Arc for servers (preview) Connected Machine agent for Windows or Linux, you may need to reconfigure the agent, upgrade it, or remove it from the computer if it has reached the retirement stage in its lifecycle. You can easily manage these routine maintenance tasks manually or through automation, which reduces both operational error and expenses.

## Upgrading agent

The Azure Connected Machine agent for Windows and Linux can be upgraded to the latest release manually or automatically depending on your requirements. The following table describes the methods supported to perform the agent upgrade.

| Operating system | Upgrade method |
|------------------|----------------|
| Windows | Manually<br> Windows Update |
| Ubuntu | [Apt](https://help.ubuntu.com/lts/serverguide/apt.html) command-line tool |
| SUSE Linux Enterprise Server | [zypper](https://en.opensuse.org/SDB:Zypper_usage_11.3) |
| Red Hat Enterprise, Amazon, CentOS Linux | [yum](https://wiki.centos.org/PackageManagement/Yum) | 

### Windows agent

### Linux agent

## Remove the agent

### Windows agent

### Linux agent

## Update proxy settings

To configure the agent to communicate to the service through a proxy server after deployment, use one of the following methods to complete this task.

### Windows agent

### Linux agent