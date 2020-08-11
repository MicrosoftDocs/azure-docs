---
title: 'Troubleshoot Azure Bastion | Microsoft Docs'
description: In this article, learn how to troubleshoot Azure Bastion.
services: bastion
author: charwen

ms.service: bastion
ms.topic: troubleshooting
ms.date: 10/16/2019
ms.author: charwen

---

# Troubleshoot Azure Bastion

This article shows you how to troubleshoot Azure Bastion.

## <a name="nsg"></a>Unable to create an NSG on AzureBastionSubnet

**Q:** When I try to create an NSG on the Azure Bastion subnet, I get the following error: *'Network security group <NSG name> does not have necessary rules for Azure Bastion Subnet AzureBastionSubnet"*.

**A:** If you create and apply an NSG to *AzureBastionSubnet*, make sure you have added the following rules in your NSG. If you do not add these rules, the NSG creation/update will fail.

1. Control plane connectivity – Inbound on 443 from GatewayManager
2. Diagnostics logging and others – Outbound on 443 to AzureCloud (Regional tags within this service tag are not supported yet.)
3. Target VM – Outbound for 3389 and 22 to VirtualNetwork

An example of the NSG rules is available for reference in the [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-azure-bastion-nsg).
For more information, see [NSG guidance for Azure Bastion](bastion-nsg.md).

## <a name="sshkey"></a>Unable to use my SSH key with Azure Bastion

**Q:** When I try to browse my SSH key file, I get the following error: *'SSH Private key must start with -----BEGIN RSA PRIVATE KEY----- and ends with -----END RSA PRIVATE KEY-----'*.

**A:** Azure Bastion supports only RSA SSH keys, at this point in time. Make sure that you browse a key file that is RSA private key for SSH, with public key provisioned on the target VM. 

As an example, you can use the following command to create a new RSA SSH key:

**ssh-keygen -t rsa -b 4096 -C "email@domain.com"**

Output:

```
ashishj@dreamcatcher:~$ ssh-keygen -t rsa -b 4096 -C "email@domain.com"
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ashishj/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/ashishj/.ssh/id_rsa.
Your public key has been saved in /home/ashishj/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:c+SBciKXnwceaNQ8Ms8C4h46BsNosYx+9d+AUxdazuE email@domain.com
The key's randomart image is:
+---[RSA 4096]----+
|      .o         |
| .. ..oo+. +     |
|=.o...B==.O o    |
|==o  =.*oO E     |
|++ .. ..S =      |
|oo..   + =       |
|...     o o      |
|         . .     |
|                 |
+----[SHA256]-----+
```

## <a name="domain"></a>Unable to sign in to my Windows domain-joined virtual machine

**Q:** I am unable to connect to my Windows virtual machine that is domain-joined.

**A:** Azure Bastion supports domain-joined VM sign in for username-password based domain sign-in only. When specifying the domain credentials in  the Azure portal, use the UPN (username@domain) format instead of *domain\username* format to sign in. This is supported for domain-joined or hybrid-joined (both domain-joined as well as Azure AD-joined) virtual machines. It is not supported for Azure AD-joined-only virtual machines.

## <a name="filetransfer"></a>File transfer issues

**Q:** Is file transfer supported with Azure Bastion?

**A:** File transfer is not supported at this time. We are working on adding support.

## <a name="blackscreen"></a>Black screen in the Azure portal

**Q:** When I try to connect using Azure Bastion, I get a black screen in the Azure portal.

**A:** This happens when there is either a network connectivity issue between your web browser and Azure Bastion (your client Internet firewall may be blocking WebSockets traffic or similar), or between the Azure Bastion and your target VM. Most cases include an NSG applied either to AzureBastionSubnet, or on your target VM subnet that is blocking the RDP/SSH traffic in your virtual network. Allow WebSockets traffic on your client internet firewall, and check the NSGs on your target VM subnet.

## Next steps

For more information, see the [Bastion FAQ](bastion-faq.md).
