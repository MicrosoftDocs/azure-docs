---
title: Join a CentOS VM to Microsoft Entra Domain Services | Microsoft Docs
description: Learn how to configure and join a CentOS Linux virtual machine to a Microsoft Entra Domain Services managed domain.
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 16100caa-f209-4cb0-86d3-9e218aeb51c6
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 09/23/2023
ms.author: justinha
---
# Join a CentOS Linux virtual machine to a Microsoft Entra Domain Services managed domain

To let users sign in to virtual machines (VMs) in Azure using a single set of credentials, you can join VMs to a Microsoft Entra Domain Services managed domain. When you join a VM to a Domain Services managed domain, user accounts and credentials from the domain can be used to sign in and manage servers. Group memberships from the managed domain are also applied to let you control access to files or services on the VM.

This article shows you how to join a CentOS Linux VM to a managed domain.

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A Microsoft Entra tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create a Microsoft Entra tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* A Microsoft Entra Domain Services managed domain enabled and configured in your Microsoft Entra tenant.
    * If needed, the first tutorial [creates and configures a Microsoft Entra Domain Services managed domain][create-azure-ad-ds-instance].
* A user account that's part of the managed domain.
* Unique Linux VM names that are a maximum of 15 characters to avoid truncated names that might cause conflicts in Active Directory.

## Create and connect to a CentOS Linux VM

If you have an existing CentOS Linux VM in Azure, connect to it using SSH, then continue on to the next step to [start configuring the VM](#configure-the-hosts-file).

If you need to create a CentOS Linux VM, or want to create a test VM for use with this article, you can use one of the following methods:

* [Microsoft Entra admin center](/azure/virtual-machines/linux/quick-create-portal)
* [Azure CLI](/azure/virtual-machines/linux/quick-create-cli)
* [Azure PowerShell](/azure/virtual-machines/linux/quick-create-powershell)

When you create the VM, pay attention to the virtual network settings to make sure that the VM can communicate with the managed domain:

* Deploy the VM into the same, or a peered, virtual network in which you have enabled Microsoft Entra Domain Services.
* Deploy the VM into a different subnet than your managed domain.

Once the VM is deployed, follow the steps to connect to the VM using SSH.

## Configure the hosts file

To make sure that the VM host name is correctly configured for the managed domain, edit the */etc/hosts* file and set the hostname:

```bash
sudo vi /etc/hosts
```

In the *hosts* file, update the *localhost* address. In the following example:

* *aaddscontoso.com* is the DNS domain name of your managed domain.
* *centos* is the hostname of your CentOS VM that you're joining to the managed domain.

Update these names with your own values:

```config
127.0.0.1 centos.aaddscontoso.com centos
```

When done, save and exit the *hosts* file using the `:wq` command of the editor.

## Install required packages

The VM needs some additional packages to join the VM to the managed domain. To install and configure these packages, update and install the domain-join tools using `yum`:

```bash
sudo yum install adcli realmd sssd krb5-workstation krb5-libs oddjob oddjob-mkhomedir samba-common-tools
```

## Join VM to the managed domain

Now that the required packages are installed on the VM, join the VM to the managed domain.

1. Use the `realm discover` command to discover the managed domain. The following example discovers the realm *AADDSCONTOSO.COM*. Specify your own managed domain name in ALL UPPERCASE:

    ```bash
    sudo realm discover AADDSCONTOSO.COM
    ```

   If the `realm discover` command can't find your managed domain, review the following troubleshooting steps:

    * Make sure that the domain is reachable from the VM. Try `ping aaddscontoso.com` to see if a positive reply is returned.
    * Check that the VM is deployed to the same, or a peered, virtual network in which the managed domain is available.
    * Confirm that the DNS server settings for the virtual network have been updated to point to the domain controllers of the managed domain.

1. Now initialize Kerberos using the `kinit` command. Specify a user that's a part of the managed domain. If needed, [add a user account to a group in Microsoft Entra ID](/azure/active-directory/fundamentals/how-to-manage-groups).

    Again, the managed domain name must be entered in ALL UPPERCASE. In the following example, the account named `contosoadmin@aaddscontoso.com` is used to initialize Kerberos. Enter your own user account that's a part of the managed domain:

    ```bash
    sudo kinit contosoadmin@AADDSCONTOSO.COM
    ```

1. Finally, join the VM to the managed domain using the `realm join` command. Use the same user account that's a part of the managed domain that you specified in the previous `kinit` command, such as `contosoadmin@AADDSCONTOSO.COM`:

    ```bash
    sudo realm join --verbose AADDSCONTOSO.COM -U 'contosoadmin@AADDSCONTOSO.COM' --membership-software=adcli
    ```

It takes a few moments to join the VM to the managed domain. The following example output shows the VM has successfully joined to the managed domain:

```output
Successfully enrolled machine in realm
```

If your VM can't successfully complete the domain-join process, make sure that the VM's network security group allows outbound Kerberos traffic on TCP + UDP port 464 to the virtual network subnet for your managed domain.

## Allow password authentication for SSH

By default, users can only sign in to a VM using SSH public key-based authentication. Password-based authentication fails. When you join the VM to a managed domain, those domain accounts need to use password-based authentication. Update the SSH configuration to allow password-based authentication as follows.

1. Open the *sshd_conf* file with an editor:

    ```bash
    sudo vi /etc/ssh/sshd_config
    ```

1. Update the line for *PasswordAuthentication* to *yes*:

    ```bash
    PasswordAuthentication yes
    ```

    When done, save and exit the *sshd_conf* file using the `:wq` command of the editor.

1. To apply the changes and let users sign in using a password, restart the SSH service:

    ```bash
    sudo systemctl restart sshd
    ```

## Grant the 'AAD DC Administrators' group sudo privileges

To grant members of the *AAD DC Administrators* group administrative privileges on the CentOS VM, you add an entry to the */etc/sudoers*. Once added, members of the *AAD DC Administrators* group can use the `sudo` command on the CentOS VM.

1. Open the *sudoers* file for editing:

    ```bash
    sudo visudo
    ```

1. Add the following entry to the end of */etc/sudoers* file. The *AAD DC Administrators* group contains whitespace in the name, so include the backslash escape character in the group name. Add your own domain name, such as *aaddscontoso.com*:

    ```config
    # Add 'AAD DC Administrators' group members as admins.
    %AAD\ DC\ Administrators@aaddscontoso.com ALL=(ALL) NOPASSWD:ALL
    ```

    When done, save and exit the editor using the `:wq` command of the editor.

## Sign in to the VM using a domain account

To verify that the VM has been successfully joined to the managed domain, start a new SSH connection using a domain user account. Confirm that a home directory has been created, and that group membership from the domain is applied.

1. Create a new SSH connection from your console. Use a domain account that belongs to the managed domain using the `ssh -l` command, such as `contosoadmin@aaddscontoso.com` and then enter the address of your VM, such as *centos.aaddscontoso.com*. If you use the Azure Cloud Shell, use the public IP address of the VM rather than the internal DNS name.

    ```bash
    sudo ssh -l contosoadmin@AADDSCONTOSO.com centos.aaddscontoso.com
    ```

1. When you've successfully connected to the VM, verify that the home directory was initialized correctly:

    ```bash
    sudo pwd
    ```

    You should be in the */home* directory with your own directory that matches the user account.

1. Now check that the group memberships are being resolved correctly:

    ```bash
    sudo id
    ```

    You should see your group memberships from the managed domain.

1. If you signed in to the VM as a member of the *AAD DC Administrators* group, check that you can correctly use the `sudo` command:

    ```bash
    sudo yum update
    ```

## Next steps

If you have problems connecting the VM to the managed domain or signing in with a domain account, see [Troubleshooting domain join issues](join-windows-vm.md#troubleshoot-domain-join-issues).

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: /azure/active-directory/fundamentals/sign-up-organization
[associate-azure-ad-tenant]: /azure/active-directory/fundamentals/how-subscriptions-associated-directory
[create-azure-ad-ds-instance]: tutorial-create-instance.md
