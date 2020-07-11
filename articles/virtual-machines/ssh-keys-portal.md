---
title: Create SSH keys in the Azure portal 
description: Learn how to generate and store SSH keys in the Azure portal for connecting the Linux VMs.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 07/10/2020
ms.author: cynthn

---

# Generate and store SSH keys in the Azure portal

You can create and reuse SSH keys in the Azure portal. You can create a SSH keys when you first create a VM, and reuse them for other VMs. You can also create SSH keys separately, so that you have a set of keys stored in Azure to fit your organizations needs. And, if you have existing keys and you want to simplify using the with Azure VMs, you can upload them and store them in Azure for reuse.


************ Portal currently links to https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-ssh-keys-detailed from the SSH thing using this fwlink: https://go.microsoft.com/fwlink/?linkid=2118349.**********


SSH is an encrypted connection protocol that allows secure sign-ins over unsecured connections. SSH is the default connection protocol for Linux VMs hosted in Azure. Although SSH itself provides an encrypted connection, using passwords with SSH connections still leaves the VM vulnerable to brute-force attacks or guessing of passwords. A more secure and preferred method of connecting to a VM using SSH is by using a public-private key pair, also known as SSH keys.

The public key is stored in Azure. The private key remains on your local system. Protect this private key. Do not share it.


## Create keys

Open the Azure portal.

At the top of the page, type *SSH* to search. Under **Marketplace*, select **SSH keys**.

On the **SSH Key** page, select **Create**.

Downloads as *frontend.pem* file.


The SSH key can now be used to create VMs in your subscription, in any region.



During VM creation