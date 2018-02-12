---
title: 'Azure Active Directory: Login to Azure Linux virtual machine | Microsoft Docs'
description: Login to an Azure Linux virtual machine using Azure AD authentication
services: active-directory
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mahesh-unnikrishnan
editor: curtand

ms.assetid: 33a2f1cc-a47f-406f-a1d2-79d7a5aa320e
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/12/2018
ms.author: maheshu

---

# Login to an Azure Linux virtual machine using Azure AD authentication *[Preview]*
This article shows you how to log in to an Azure Linux virtual machine using Azure AD authentication.

## Benefits of using Azure AD authentication
There are many benefits of using Azure AD authentication to log in to Azure Linux virtual machines.

1. **Improved security:** This approach has many security benefits:
  - You can use your corporate AD credentials to log in to Azure Linux VMs. There is no need to create local administrator accounts and manage credential lifetime.
  - By reducing your reliance on local administrator accounts, you do not need to worry about credential loss/theft, users configuring weak credentials etc.
  - The password complexity and password lifetime policies configured for your Azure AD directory help secure Linux VMs as well.
  - The VM is not susceptible to password brute force attacks on local administrator accounts.
  - You can configure multiple factor authentication or conditional access control policies to further secure log in to Azure virtual machines.

2. **Seamless collaboration:** Using RBAC roles you can specify who has access to a given VM, as a regular user or with administrator privileges. When users join or leave your team, you can easily update the RBAC policy for the VM to grant or deny access as appropriate. This experience is much simpler than having to scrub VMs to remove unnecessary SSH public keys. When employees leave your organization, they no longer have access to your resources.


## Supported Azure Linux distributions
The following Linux distributions are supported for this functionality:

| Distribution | Version |
| --- | --- |
| Ubuntu Server | Ubuntu 16.04 LTS |


## Install the pre-requisite software

### Prepare the virtual machine
Use the local administrator credentials you specified when provisioning the virtual machine to connect using *SSH*.

Type the following command to open the ```/etc/hosts``` file:
```
sudo vi /etc/hosts
```

Add an entry for the virtual machine's hostname to the ```/etc/hosts``` file. In this example, the hostname of the Linux virtual machine is 'contoso-linux'. Replace 'contoso-linux' with the hostname of your virtual machine. Save the file.
```
127.0.0.1 contoso-linux
```

Update DNS settings on the virtual machine by typing the following command in the ssh console:
```
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf > /dev/null
```

### Install *libcurl3* on the virtual machine
Type the following command in the SSH terminal to update the package repositories on the Ubuntu virtual machine.
```
sudo apt-get update
```
Now, install the ```libcurl3``` package on the virtual machine.
```
sudo apt-get install libcurl3
```

### Install the Azure AD login VM extension
Type the following PowerShell command to install the Azure AD VM login extension on the Linux virtual machine. Replace ```VM_NAME```, ```RESOURCE_GROUP_NAME```, and ```LOCATION``` as appropriate for your deployed virtual machine.

```PowerShell
Set-AzureRmVMExtension -Publisher “Microsoft.Azure.ActiveDirectory.LinuxSSH.Edp” `
-ExtensionType “AADLoginForLinux” -ResourceGroupName "RESOURCE_GROUP_NAME" `
-VMName "VM_NAME" -ExtensionName "AADLoginForLinux" `
-Location "South Central US" -TypeHandlerVersion "1.0"
```

>[!NOTE]
> Only the 'South Central US' Azure region is supported during the preview.
>

If the command executes successfully, the VM extension is installed on the virtual machine. You see a ```StatusCode``` value of 'OK' in the PowerShell console.


## Configure RBAC policy for the Linux virtual machine
Azure Role-Based Access Control (RBAC) policy determines who can log in to the virtual machine. Two new RBAC roles are used to authorize VM login:
1. **Virtual Machine Administrator Login**: Users with this role assigned can log in to an Azure virtual machine with Windows Administrator or Linux root user privileges.
2. **Virtual Machine User Login**: Users with this role assigned can log in to an Azure virtual machine with regular user privileges.

To configure RBAC policy for the Linux virtual machine:

1. Navigate to the [virtual machines page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Compute%2FVirtualMachines) in the Azure portal.
2. Click the Linux VM for which you want to configure RBAC policy.
3. In the left-hand navigation pane, click **Access control (IAM)**.
4. Click the **Add** button.
5. In the **Add permissions** page, click the **Role** dropdown.
6. To configure the role, which allows users to log in to the VM with 'root' privileges, select **Virtual Machine Administrator Login**.
7. To configure the role, which allows users to log in to the VM with regular user privileges, select **Virtual Machine User Login**.
8. In the **Assign access to** dropdown, select **Azure AD user, group, or application**.
9. In the **Select** box, search for the user or group to which you would like to assign this role.
10. After selecting all desired users or groups, click the **Save** button.

### More information - configure Azure RBAC policy
For more information on how to use Role-Based Access Control to manage access to your Azure subscription resources, see:
* [Configure RBAC using Azure portal](../../active-directory/role-based-access-control-configure.md)
* [Configure RBAC using Azure PowerShell](../../active-directory/role-based-access-control-manage-access-powershell.md)

## Log in to the Linux virtual machine
