---
title: Join a CoreOS VM to Microsoft Entra Domain Services | Microsoft Docs
description: Learn how to configure and join a CoreOS virtual machine to a Microsoft Entra Domain Services managed domain.
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 5db65f30-bf69-4ea3-9ea5-add1db83fdb8
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 09/23/2023
ms.author: justinha

---
# Join a CoreOS virtual machine to a Microsoft Entra Domain Services managed domain

To let users sign in to virtual machines (VMs) in Azure using a single set of credentials, you can join VMs to a Microsoft Entra Domain Services managed domain. When you join a VM to a Domain Services managed domain, user accounts and credentials from the domain can be used to sign in and manage servers. Group memberships from the managed domain are also applied to let you control access to files or services on the VM.

This article shows you how to join a CoreOS VM to a managed domain.

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A Microsoft Entra tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create a Microsoft Entra tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* A Microsoft Entra Domain Services managed domain enabled and configured in your Microsoft Entra tenant.
    * If needed, the first tutorial [creates and configures a Microsoft Entra Domain Services managed domain][create-azure-ad-ds-instance].
* A user account that's a part of the managed domain.
* Unique Linux VM names that are a maximum of 15 characters to avoid truncated names that might cause conflicts in Active Directory.

## Create and connect to a CoreOS Linux VM

If you have an existing CoreOS Linux VM in Azure, connect to it using SSH, then continue on to the next step to [start configuring the VM](#configure-the-hosts-file).

If you need to create a CoreOS Linux VM, or want to create a test VM for use with this article, you can use one of the following methods:

* [Microsoft Entra admin center](/azure/virtual-machines/linux/quick-create-portal)
* [Azure CLI](/azure/virtual-machines/linux/quick-create-cli)
* [Azure PowerShell](/azure/virtual-machines/linux/quick-create-powershell)

When you create the VM, pay attention to the virtual network settings to make sure that the VM can communicate with the managed domain:

* Deploy the VM into the same, or a peered, virtual network in which you have enabled Microsoft Entra Domain Services.
* Deploy the VM into a different subnet than your Microsoft Entra Domain Services managed domain.

Once the VM is deployed, follow the steps to connect to the VM using SSH.

## Configure the hosts file

To make sure that the VM host name is correctly configured for the managed domain, edit the */etc/hosts* file and set the hostname:

```console
sudo vi /etc/hosts
```

In the *hosts* file, update the *localhost* address. In the following example:

* *aaddscontoso.com* is the DNS domain name of your managed domain.
* *coreos* is the hostname of your CoreOS VM that you're joining to the managed domain.

Update these names with your own values:

```console
127.0.0.1 coreos coreos.aaddscontoso.com
```

When done, save and exit the *hosts* file using the `:wq` command of the editor.

## Configure the SSSD service

Update the */etc/sssd/sssd.conf* SSSD configuration.

```console
sudo vi /etc/sssd/sssd.conf
```

Specify your own managed domain name for the following parameters:

* *domains* in ALL UPPER CASE
* *[domain/AADDSCONTOSO]* where AADDSCONTOSO is in ALL UPPER CASE
* *ldap_uri*
* *ldap_search_base*
* *krb5_server*
* *krb5_realm* in ALL UPPER CASE

```console
[sssd]
config_file_version = 2
services = nss, pam
domains = AADDSCONTOSO.COM

[domain/AADDSCONTOSO]
id_provider = ad
auth_provider = ad
chpass_provider = ad

ldap_uri = ldap://aaddscontoso.com
ldap_search_base = dc=aaddscontoso,dc=com
ldap_schema = rfc2307bis
ldap_sasl_mech = GSSAPI
ldap_user_object_class = user
ldap_group_object_class = group
ldap_user_home_directory = unixHomeDirectory
ldap_user_principal = userPrincipalName
ldap_account_expire_policy = ad
ldap_force_upper_case_realm = true
fallback_homedir = /home/%d/%u

krb5_server = aaddscontoso.com
krb5_realm = AADDSCONTOSO.COM
```

## Join the VM to the managed domain

With the SSSD configuration file updated, now join the virtual machine to the managed domain.

1. First, use the `adcli info` command to verify you can see information about the managed domain. The following example gets information for the domain *AADDSCONTOSO.COM*. Specify your own managed domain name in ALL UPPERCASE:

    ```console
    sudo adcli info AADDSCONTOSO.COM
    ```

   If the `adcli info` command can't find your managed domain, review the following troubleshooting steps:

    * Make sure that the domain is reachable from the VM. Try `ping aaddscontoso.com` to see if a positive reply is returned.
    * Check that the VM is deployed to the same, or a peered, virtual network in which the managed domain is available.
    * Confirm that the DNS server settings for the virtual network have been updated to point to the domain controllers of the managed domain.

1. Now join the VM to the managed domain using the `adcli join` command. Specify a user that's a part of the managed domain. If needed, [add a user account to a group in Microsoft Entra ID](/azure/active-directory/fundamentals/how-to-manage-groups).

    Again, the managed domain name must be entered in ALL UPPERCASE. In the following example, the account named `contosoadmin@aaddscontoso.com` is used to initialize Kerberos. Enter your own user account that's a part of the managed domain.

    ```console
    sudo adcli join -D AADDSCONTOSO.COM -U contosoadmin@AADDSCONTOSO.COM -K /etc/krb5.keytab -H coreos.aaddscontoso.com -N coreos
    ```

    The `adcli join` command doesn't return any information when the VM has successfully joined to the managed domain.

1. To apply the domain-join configuration, start the SSSD service:
  
    ```console
    sudo systemctl start sssd.service
    ```

## Sign in to the VM using a domain account

To verify that the VM has been successfully joined to the managed domain, start a new SSH connection using a domain user account. Confirm that a home directory has been created, and that group membership from the domain is applied.

1. Create a new SSH connection from your console. Use a domain account that belongs to the managed domain using the `ssh -l` command, such as `contosoadmin@aaddscontoso.com` and then enter the address of your VM, such as *coreos.aaddscontoso.com*. If you use the Azure Cloud Shell, use the public IP address of the VM rather than the internal DNS name.

    ```console
    ssh -l contosoadmin@AADDSCONTOSO.com coreos.aaddscontoso.com
    ```

1. Now check that the group memberships are being resolved correctly:

    ```console
    id
    ```

    You should see your group memberships from the managed domain.

## Next steps

If you have problems connecting the VM to the managed domain or signing in with a domain account, see [Troubleshooting domain join issues](join-windows-vm.md#troubleshoot-domain-join-issues).

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: /azure/active-directory/fundamentals/sign-up-organization
[associate-azure-ad-tenant]: /azure/active-directory/fundamentals/how-subscriptions-associated-directory
[create-azure-ad-ds-instance]: tutorial-create-instance.md
