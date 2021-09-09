---
title: Access the local vCenter of your private cloud
description: Steps to access the local vCenter of your Azure VMware Solution private cloud.
ms.topic: include
ms.date: 09/10/2021
author: shortpatti
ms.author: v-patsho
ms.service: azure-vmware

# used in: 
# 

---

1. Sign in to the [Azure portal](https://portal.azure.com), select your private cloud, and then **Manage** > **Identity**.

1. Copy the vCenter URL, username, and password. You'll use them to access your virtual machine (VM). 

1. Open the VM and connect to it. If you need help with connecting, see [connect to a virtual machine](../../virtual-machines/windows/connect-logon.md#connect-to-the-virtual-machine) for details.

1. In the VM, open a browser and navigate to the vCenter URL. 

1. Enter the `cloudadmin@vsphere.local` user credentials from the previous step.

   :::image type="content" source="../media/tutorial-access-private-cloud/ss5-vcenter-login.png" alt-text="Screenshot showing the VMware vSphere sign in page." border="true":::