---
 title: include file
 description: include file
 services: virtual-machines-linux
 author: dlepow
 ms.service: virtual-machines-linux
 ms.topic: include
 ms.date: 04/16/2018
 ms.author: danlep
 ms.custom: include file
---
## Overview of SSH and keys

SSH is an encrypted connection protocol that allows secure sign-ins over unsecured connections. SSH is the default connection protocol for Linux VMs hosted in Azure. Although SSH itself provides an encrypted connection, using passwords with SSH connections still leaves the VM vulnerable to brute-force attacks or guessing of passwords. A more secure and preferred method of connecting to a VM using SSH is by using a public-private key pair, also known as *SSH keys*. 

* The *public key* is placed on your Linux VM, or any other service that you wish to use with public-key cryptography.

* The *private key* is what you present to your Linux VM when you make an SSH connection, to verify your identity. Protect this private key. Do not share it.

Depending on your organization's security policies, you can reuse a single public-private key pair to access multiple Azure VMs and services. You do not need a separate pair of keys for each VM or service you wish to access. 

Your public key can be shared with anyone, but only you (or your local security infrastructure) should possess your private key.