---
title: Join a RHEL VM to Azure AD Domain Services | Microsoft Docs
description: Learn how to configure and join a Red Hat Enterprise Linux virtual machine to an Azure AD Domain Services managed domain.
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 16100caa-f209-4cb0-86d3-9e218aeb51c6
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 07/13/2020
ms.author: justinha

---
# Join a Red Hat Enterprise Linux virtual machine to an Azure Active Directory Domain Services managed domain

To let users sign in to virtual machines (VMs) in Azure using a single set of credentials, you can join VMs to an Azure Active Directory Domain Services (Azure AD DS) managed domain. When you join a VM to an Azure AD DS managed domain, user accounts and credentials from the domain can be used to sign in and manage servers. Group memberships from the managed domain are also applied to let you control access to files or services on the VM.

This article shows you how to join a Red Hat Enterprise Linux (RHEL) VM to a managed domain.

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, the first tutorial [creates and configures an Azure Active Directory Domain Services managed domain][create-azure-ad-ds-instance].
* A user account that's a part of the managed domain.
* Unique Linux VM names that are a maximum of 15 characters to avoid truncated names that might cause conflicts in Active Directory.

## Create and connect to a RHEL Linux VM

If you have an existing RHEL Linux VM in Azure, connect to it using SSH, then continue on to the next step to [start configuring the VM](#configure-the-hosts-file).

If you need to create a RHEL Linux VM, or want to create a test VM for use with this article, you can use one of the following methods:

* [Azure portal](../virtual-machines/linux/quick-create-portal.md)
* [Azure CLI](../virtual-machines/linux/quick-create-cli.md)
* [Azure PowerShell](../virtual-machines/linux/quick-create-powershell.md)

When you create the VM, pay attention to the virtual network settings to make sure that the VM can communicate with the managed domain:

* Deploy the VM into the same, or a peered, virtual network in which you have enabled Azure AD Domain Services.
* Deploy the VM into a different subnet than your Azure AD Domain Services managed domain.

Once the VM is deployed, follow the steps to connect to the VM using SSH.

## Configure the hosts file

To make sure that the VM host name is correctly configured for the managed domain, edit the */etc/hosts* file and set the hostname:

```bash
sudo vi /etc/hosts
```

In the *hosts* file, update the *localhost* address. In the following example:

* *aaddscontoso.com* is the DNS domain name of your managed domain.
* *rhel* is the hostname of your RHEL VM that you're joining to the managed domain.

Update these names with your own values:

```config
127.0.0.1 rhel rhel.aaddscontoso.com
```

When done, save and exit the *hosts* file using the `:wq` command of the editor.


# [RHEL 6](#tab/rhel) 


> [!IMPORTANT]
> Keep in consideration Red Hat Enterprise Linux 6.X and  Oracle Linux 6.x is already EOL. 
> RHEL 6.10 has available [ELS support](https://www.redhat.com/en/resources/els-datasheet), which [will end on 06/2024]( https://access.redhat.com/product-life-cycles/?product=Red%20Hat%20Enterprise%20Linux,OpenShift%20Container%20Platform%204).

## Install required packages

The VM needs some additional packages to join the VM to the managed domain. To install and configure these packages, update and install the domain-join tools using `yum`.

```bash
sudo yum install adcli sssd authconfig krb5-workstation
```
## Join VM to the managed domain

Now that the required packages are installed on the VM, join the VM to the managed domain.

1. Use the `adcli info` command to discover the managed domain. The following example discovers the realm *ADDDSCONTOSO.COM*. Specify your own managed domain name in ALL UPPERCASE:

    ```bash
    sudo adcli info aaddscontoso.com
    ```
   If the `adcli info` command can't find your managed domain, review the following troubleshooting steps:

    * Make sure that the domain is reachable from the VM. Try `ping aaddscontoso.com` to see if a positive reply is returned.
    * Check that the VM is deployed to the same, or a peered, virtual network in which the managed domain is available.
    * Confirm that the DNS server settings for the virtual network have been updated to point to the domain controllers of the managed domain.

1. First, join the domain using the `adcli join` command, this command also creates the keytab to authenticate the machine. Use a user account that's a part of the managed domain.

    ```bash
    sudo adcli join aaddscontoso.com -U contosoadmin
    ```

1. Now configure the `/ect/krb5.conf` and create the `/etc/sssd/sssd.conf` files to use the `aaddscontoso.com` Active Directory domain.
   Make sure that `AADDSCONTOSO.COM` is replaced by your own domain name:

    Open the `/etc/krb5.conf` file with an editor:

    ```bash
    sudo vi /etc/krb5.conf
    ```

    Update the `krb5.conf` file to match the following sample:

    ```config
    [logging]
     default = FILE:/var/log/krb5libs.log
     kdc = FILE:/var/log/krb5kdc.log
     admin_server = FILE:/var/log/kadmind.log
    
    [libdefaults]
     default_realm = AADDSCONTOSO.COM
     dns_lookup_realm = true
     dns_lookup_kdc = true
     ticket_lifetime = 24h
     renew_lifetime = 7d
     forwardable = true
    
    [realms]
     AADDSCONTOSO.COM = {
     kdc = AADDSCONTOSO.COM
     admin_server = AADDSCONTOSO.COM
     }
    
    [domain_realm]
     .AADDSCONTOSO.COM = AADDSCONTOSO.COM
     AADDSCONTOSO.COM = AADDSCONTOSO.COM
    ```
    
   Create the `/etc/sssd/sssd.conf` file:
    
    ```bash
    sudo vi /etc/sssd/sssd.conf
    ```

    Update the `sssd.conf` file to match the following sample:

    ```config
    [sssd]
     services = nss, pam, ssh, autofs
     config_file_version = 2
     domains = AADDSCONTOSO.COM
    
    [domain/AADDSCONTOSO.COM]
    
     id_provider = ad
    ```

1. Make sure `/etc/sssd/sssd.conf` permissions are 600 and is owned by root user:

    ```bash
    sudo chmod 600 /etc/sssd/sssd.conf
    sudo chown root:root /etc/sssd/sssd.conf
    ```

1. Use `authconfig` to instruct the VM about the AD Linux integration:

    ```bash
    sudo authconfig --enablesssd --enablesssd auth --update
    ```

1. Start and enable the sssd service:

    ```bash
    sudo service sssd start
    sudo chkconfig sssd on
    ```

If your VM can't successfully complete the domain-join process, make sure that the VM's network security group allows outbound Kerberos traffic on TCP + UDP port 464 to the virtual network subnet for your managed domain.

Now check if you can query user AD information using `getent`

```bash
sudo getent passwd contosoadmin
```

## Allow password authentication for SSH

By default, users can only sign in to a VM using SSH public key-based authentication. Password-based authentication fails. When you join the VM to a managed domain, those domain accounts need to use password-based authentication. Update the SSH configuration to allow password-based authentication as follows.

1. Open the *sshd_conf* file with an editor:

    ```bash
    sudo vi /etc/ssh/sshd_config
    ```

1. Update the line for *PasswordAuthentication* to *yes*:

    ```config
    PasswordAuthentication yes
    ```

    When done, save and exit the *sshd_conf* file using the `:wq` command of the editor.

1. To apply the changes and let users sign in using a password, restart the SSH service for your RHEL distro version:

    ```bash
    sudo service sshd restart
    ```


# [RHEL 7](#tab/rhel7) 

## Install required packages

The VM needs some additional packages to join the VM to the managed domain. To install and configure these packages, update and install the domain-join tools using `yum`.

```bash
sudo yum install realmd sssd krb5-workstation krb5-libs oddjob oddjob-mkhomedir samba-common-tools
```
## Join VM to the managed domain

Now that the required packages are installed on the VM, join the VM to the managed domain. Again, use the appropriate steps for your RHEL distro version.

1. Use the `realm discover` command to discover the managed domain. The following example discovers the realm *AADDSCONTOSO.COM*. Specify your own managed domain name in ALL UPPERCASE:

    ```bash
    sudo realm discover AADDSCONTOSO.COM
    ```

   If the `realm discover` command can't find your managed domain, review the following troubleshooting steps:

    * Make sure that the domain is reachable from the VM. Try `ping aaddscontoso.com` to see if a positive reply is returned.
    * Check that the VM is deployed to the same, or a peered, virtual network in which the managed domain is available.
    * Confirm that the DNS server settings for the virtual network have been updated to point to the domain controllers of the managed domain.

1. Now initialize Kerberos using the `kinit` command. Specify a user that's a part of the managed domain. If needed, [add a user account to a group in Azure AD](../active-directory/fundamentals/active-directory-groups-members-azure-portal.md).

    Again, the managed domain name must be entered in ALL UPPERCASE. In the following example, the account named `contosoadmin@aaddscontoso.com` is used to initialize Kerberos. Enter your own user account that's a part of the managed domain:

    ```bash
    sudo kinit contosoadmin@AADDSCONTOSO.COM
    ```

1. Finally, join the VM to the managed domain using the `realm join` command. Use the same user account that's a part of the managed domain that you specified in the previous `kinit` command, such as `contosoadmin@AADDSCONTOSO.COM`:

    ```bash
    sudo realm join --verbose AADDSCONTOSO.COM -U 'contosoadmin@AADDSCONTOSO.COM'
    ```

It takes a few moments to join the VM to the managed domain. The following example output shows the VM has successfully joined to the managed domain:

```output
Successfully enrolled machine in realm
```

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

1. To apply the changes and let users sign in using a password, restart the SSH service.

    ```bash
    sudo systemctl restart sshd
    ```
---

## Grant the 'AAD DC Administrators' group sudo privileges

To grant members of the *AAD DC Administrators* group administrative privileges on the RHEL VM, you add an entry to the */etc/sudoers*. Once added, members of the *AAD DC Administrators* group can use the `sudo` command on the RHEL VM.

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

1. Create a new SSH connection from your console. Use a domain account that belongs to the managed domain using the `ssh -l` command, such as `contosoadmin@aaddscontoso.com` and then enter the address of your VM, such as *rhel.aaddscontoso.com*. If you use the Azure Cloud Shell, use the public IP address of the VM rather than the internal DNS name.

    ```bash
    sudo ssh -l contosoadmin@AADDSCONTOSO.com rhel.aaddscontoso.com
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
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
