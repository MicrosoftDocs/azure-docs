---
title: Set up Azure Confidential Computing virtual machines - Azure
description: How to set up virtual machines that use the confidential computing feature.
author: Heidilohr
ms.topic: how-to
ms.date: 06/30/2023
ms.author: helohr
manager: femila
---
# Set up Azure Confidential Computing for Azure Virtual Desktop

Azure Confidential Computing lets you secure and encrypt information on virtual machines wile they're in use by your end-users. Deploying confidential VMs with Azure Virtual Desktop gives users access to Microsoft 365 and other applications on session hosts that use hardware-based isolation, which hardens isolation from other virtual machines, the hypervisor, and the host OS. A dedicated secure processor inside the Advanced Micro Devices processor generates and safeguards memory encryption keys that can't be read from software. For more information about how Confidential Computing works, see the [Azure Confidential Computing overview](../confidential-computing/overview.md).

## Prerequisites

Confidential Computing virtual machines (VMs) are only supported by the following versions of Windows:

- Windows 11 
- Windows Server 2019
- Windows Server 2022 

