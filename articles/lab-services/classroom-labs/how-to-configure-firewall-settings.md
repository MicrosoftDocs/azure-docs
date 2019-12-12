---
title: Firewall settings for Lab Services
description: Learn how to determine the public IP address and port number range of virtual machines in a lab so information maybe added to firewall rules.
author: emaher

ms.author: enewman
ms.date: 12/12/2019
ms.topic: article
ms.service: lab-services
---
# Firewall settings for Azure Lab Services

Each school  will set up their own network in a way that best fits their needs.  Sometimes that includes setting firewall rules that block Remote Desktop (rdp) or Secure Shell (ssh) connections to machines outside their own network.  Because Azure Lab Services runs in the public cloud, some extra configuration maybe needed to allow students to access their VM when connecting from the campus network.

Each lab uses single public IP address and multiple ports.  All VMs, both the template VM and student VMs, will use this public IP address.  The public IP address will not change for the life of lab.  However, each VM will have a different port number.  The port numbers range from 49152 to 65535.  The combination of public IP address and port number is used to connect teacher and students to the correct VM.  This article will cover how to find the specific public ip address used by a lab.  That information can be used to update inbound and outbound firewall rules so students can access their VMs.

>[!IMPORTANT]
>Each lab will have a different public IP address.  These steps will be required for every lab you want to access from within your school's network.

## Get a lab's hostname

To get the public IP address of a lab, we'll first need to get the lab’s hostname.  For a Linux VM, the ssh connection information can be used.  For a Windows VM, rdp file information can be used.  A lab’s template VM and all user Lab VMs will share a public IP address.

### Get a lab's hostname for Linux VM

We will cover how to get the hostname for the template VM.  However, SSH details from either template or student VM can be used.  

- Go to the [template tile](use-dashboard.md#template-tile).
- Start the VM if it is stopped.
- Click the **Customize template** button.  
- Copy the SSH information.

SSH connection details will look something like the following.

```bash
ssh -p 12345 username@ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com
```

VM host names are everything after the '@' sign.  The host name will follow the pattern `{vm-name}-ml-lab-{guid}.{location}.cloudapp.azure.com:{port-number}`.  In the above example, `ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com` is the host name.

### Get a lab's hostname for Windows VM

We will cover how to get the hostname for the template VM.  However, Remote Desktop connection details from either can be used.

- Go to the [template tile](use-dashboard.md#template-tile).
- Start the VM if it is stopped.
- Click the **Customize template** button.  
- Open your Downloads folder.
- Right-click the {vm-name}.rdp file. Choose **Open With** -> **Notepad**.  
- Copy the full address value.

The rdp file will have contents that look something like the following.

```text
full address:s:ml-lab-00000000-0000-0000-0000-000000000000.eastus2.azure.com:12345
prompt for credentials:i:1
username:s:~\UserName
```

The host name will follow the pattern `{vm-name}-ml-lab-{guid}.{location}.cloudapp.azure.com:{port-number}`.  In the above example, the host name is `ml-lab-00000000-0000-0000-0000-000000000000.eastus2.azure.com`.

## Get a lab's public ip address

Next, we need to use the lab's hostname to get the lab's public ip address.  The host name is everything after the @.  There are many tools that can accomplish this task.  We will cover how to us nslookup.  The nslookup tool comes pre-installed installed on Windows, macOS, and Linux.

Type the following command into your command-line window.  Make sure to replace example hostname with your lab’s hostname.

```bash
nslookup ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com
```

The last line in the output in your terminal window will contain the lab’s public IP address, and should look something like the following.

```bash
Server:  ---
Address:  1111:1111::1111:1111

Non-authoritative answer:
Name:    ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com
Address:  111.111.111.111
```

Note the IPV4 address that matches the hostname for the VM.  In our example, the public IP address is 111.111.111.111.

## Conclusion

Now we know the public IP address for the lab.  Inbound and outbound rules can be created for the school's firewall for the public ip address and the port range  49152-65535.  Now, students can access their VMs without the school network firewall blocking access.
