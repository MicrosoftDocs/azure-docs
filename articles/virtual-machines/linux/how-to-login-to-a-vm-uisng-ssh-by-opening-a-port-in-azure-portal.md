---
title: How to login to a virtual machine using ssh by opening a port in Azure portal | Microsoft Docs
description: Learn how to login to a virtual machine using ssh by opening a part in Azure Portal
services: virtual-machines-linux
documentationcenter: ''
author: ksurendra
manager:
editor: ''

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 5/7/2018
ms.author: ksurendra

---
# How to login to a virtual machine (Windows or Linux) using SSH by opening a prt in Azure Portal
When a new VM is created on Azure, by-default the Protocol TCP on Port 22 is Disabled. This will not let you SSH into the VM either from Azure’s Cloud Shell or external access from a Mac Terminal or Putty.

When trying to do an `ssh username@vm-ipaddress` you may see a nothing happening or an error message like `ssh: connect to host <ip-address> port 22: Connection timed out`

![SSH Error Message](./media/how-to-login-to-a-avm-using-ssh-by-opening-port-in-azure-portal/azure-ssh-error-message.png)


## Resolution
To use SSH on Cloud Shell or Mac Terminal or Putty, do the following:

- Select the VM
- Select “Networking”
- On the right, select “Add inbound port rule”. This should open a popup
  - ![Allow inbound tcp on port 22](./media/how-to-login-to-a-avm-using-ssh-by-opening-port-in-azure-portal/azure-vm-add-inbound.png)
  - Source: Any (default)
  - Source port range: * (default)
  - Destination: Any (default)
  - Destination port ranges: 22
  - Protocol: TCP
  - Action: Allow
  - Priority: 330 (default)
  - Name: Enable 22 (can be anything you can identify)
- Select “Add“

You may now try to SSH and you will be able to login to your VM.
![successfully able to login using ssh](./media/how-to-login-to-a-avm-using-ssh-by-opening-port-in-azure-portal/azure-vm-ssh-enabled.png)


## Caution
The actions above will exposed SSH port 22 to the internet and this will be not safe on your VM. This is only recommended for testing. For production environments, use a VPN or private connection.