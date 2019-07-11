---
title: Join a Windows Server VM to a managed domain | Microsoft Docs'
description: In this tutorial, learn how to join a Windows Server virtual machine to an Azure Active Directory Domain Services managed domain.
author: iainfoulds
manager: daveba
`
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: tutorial
ms.date: 07/11/2019
ms.author: iainfou

#Customer intent: As an server administrator, I want to learn how to join a Windows Server VM to an Azure Active Directory Domain Services managed domain to provide centralized identity and policy.
---
# Tutorial: Join a Windows Server virtual machine to a managed domain

Azure Active Directory Domain Services (Azure AD DS) provides managed domain services such as domain join, group policy, LDAP, Kerberos/NTLM authentication that is fully compatible with Windows Server Active Directory. With an Azure AD DS managed domain, you can provide domain join features and management to virtual machines (VMs) in Azure. This tutorial shows you how to create a Windows Server VM then join it to an Azure AD DS managed domain.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Windows Server VM
> * Connect to the Windows Server VM to an Azure virtual network
> * Join the VM to the Azure AD DS managed domain

If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial, you need the following resources:

* An active Azure subscription.
    * If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, [create and configure an Azure Active Directory Domain Services instance][create-azure-ad-ds-instance].

## Sign in to the Azure portal

In this tutorial, you configure secure LDAP for the Azure AD DS managed domain using the Azure portal. To get started, first sign in to the [Azure portal](https://portal.azure.com).

## Create a Windows Server virtual machine

To create a Windows virtual machine that's joined to the virtual network in which you've enabled Azure AD DS, do the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. At the top of the left pane, select **+ Create a resource**.
3. From **Get started**, choose **Windows Server 2016 Datacenter**.

    ![Choose to create a Windows Server 2016 Datacenter VM in the Azure portal](./media/join-windows-vm/select-vm-image.png)

4. In the **Basics** window, configure the core settings for the virtual machine. Leave the defaults for *Availability options*, *Image*, and *Size*.

    | Parameter            | Suggested value   |
    |----------------------|-------------------|
    | Resource group       | Select or create a resource group, such as *myResourceGroup* |
    | Virtual machine name | Enter a name for the VM, such as *myVM* |
    | Region               | Choose the region to create your VM in, such as *East US* |
    | Username             | Enter a username for the local administrator account to create on the VM, such as *azureuser* |
    | Password             | Enter, and then confirm, a secure password for the local administrator to create on the VM. Don't specify a domain user account's credentials. |

5. By default, VMs created in Azure aren't accessible from the Internet. This configuration helps improve the security of the VM and reduces the area for potential attack. In the next step of this tutorial, you connect to the VM using remote desktop protocol (RDP) and then join the Windows Server to the Azure AD DS managed domain. To do this step, you must enable *RDP* connections.

    Under **Public inbound ports**, select the option to **Allow selected ports**. From the drop-down menu for **Select inbound ports**, choose *RDP*.

6. When done, select **Next: Disks**.
7. From the drop-down menu for **OS disk type**, choose *Standard SSD*, then select **Next: Networking**.

Your VM must connect to an Azure virtual network subnet that can communicate with the subnet your Azure AD DS managed domain is deployed into. We recommend that an Azure AD DS managed domain is deployed into its own dedicated subnet. Don't deploy your VM in the same subnet as your Azure AD DS managed domain. There are two main ways to deploy your VM and connect to an appropriate virtual network subnet:

    * Create, or select an existing, subnet in the same the virtual network as your Azure AD DS managed domain is deployed.
    * Select a subnet in an Azure virtual network that is connected to it using [Azure virtual network peering][vnet-peering].

If you select a virtual network subnet that isn't connected to the subnet for your Azure AD DS instance, you can't join the VM to the managed domain. For this tutorial, let's create a new subnet in the Azure virtual network.

8. In the **Networking** pane, select the virtual network in which your Azure AD DS-managed domain is deployed, such as *myVnet*
9. To create a subnet, select **Manage subnet configuration**.

    ![Choose to manage the subnet configuration in the Azure portal](./media/join-windows-vm/manage-subnet.png)

10. Select **+ Subnet**, then enter a name for the subnet, such as *ManagedVMs*. Provide an **Address range (CIDR block)**, such as *10.1.1.0/24*. Make sure that this IP address range doesn't overlap with any other existing Azure or on-premises address ranges. Leave the other options as their default values, then select **OK**.

    ![Create a subnet configuration in the Azure portal](./media/join-windows-vm/create-subnet.png)

11. It takes a few seconds to create the subnet. Once it's created, select the *X* to close the subnet window.
12. Back in the **Networking** pane to create a VM, choose the subnet you created from the drop-down menu, such as *ManagedVMs*.
13. Leave the other options as their default values, then select **Management**.
14. Set **Boot diagnostics** to *Off*. Leave the other options as their default values, then select **Review + create**.
15. Review the VM settings, then select **Create**.

It takes a few minutes to create the VM. The Azure portal shows the status of the deployment. Once the VM is ready, select **Go to resource**.

![Go to the VM resource in the Azure portal once it's successfully created](./media/join-windows-vm/vm-created.png)

## Connect to the Windows Server VM

Now let's connect to the newly created Windows Server VM using RDP and join the Azure AD DS managed domain. Use the local administrator credentials that you specified when the VM was created in the previous step, not any existing domain credentials.

1. In the **Overview** pane, select **Connect**.

    ![Connect to Windows virtual machine in the Azure portal](./media/join-windows-vm/connect-to-vm.png)

1. Select the option to **Download RDP File*. Save this RDP file in your web browser.
1. To connect to your VM, open the downloaded RDP file. If prompted, select **Connect**.
1. Enter the local administrator credentials you entered in the previous step to create the VM, such as *localhost\azureuser*
1. If you see a certificate warning during the sign in process, select **Yes** or **Continue** to connect.

## Join the VM to the Azure AD DS managed domain

To join the Windows Server virtual machine to the Azure AD DS-managed domain, complete the following steps:

1. **Server Manager** should open by default when you sign in to the VM. If not, on the **Start** menu, open **Server Manager**.
1. In the left pane of the **Server Manager** window, select **Local Server**. Under **Properties**, choose **Workgroup**.

    ![Open Server Manager on the VM and edit the workgroup property](./media/join-windows-vm/server-manager.png)

1. In the **System Properties** window, select **Change** to join the Azure AD DS managed domain.

    ![Choose to change the workgroup or domain properties](./media/join-windows-vm/change-domain.png)

1. In the **Domain** box, specify the name of your Azure AD DS managed domain, such as *contoso100.com*, then select **OK**.

    ![Specify the Azure AD DS managed domain to join](./media/join-windows-vm/join-domain.png)

1. Enter domain credentials to join the domain. Use the credentials for a user that belongs to the *Azure AD DC administrators* group. Only members of this group have privileges to join machines to the Azure AD DS managed domain. Account credentials  can be specified in one of the following ways:

    * **UPN format** (recommended) - Enter the user principal name (UPN) suffix for the user account, as configured in Azure AD. For example, the UPN suffix of the user *contosoadmin* would be *contosoadmin@contoso100.onmicrosoft.com*.
        If a user's UPN prefix is long, such as *deehasareallylongname*), the *SAMAccountName* may be autogenerated. If multiple users have the same UPN prefix (for example, *bob*) in your Azure AD tenant, their SAMAccountName format might be autogenerated by the service. In these cases, the UPN format can be used reliably to sign in to the domain.
    * **SAMAccountName format** - Enter the account name in the *SAMAccountName* format. For example, the *SAMAccountName* of user *contosoadmin* would be *CONTOSO100\contosoadmin*.

1. It takes a few seconds to join to the Azure AD DS managed domain. When complete, the following message welcomes you to the domain:

    ![Welcome to the domain](./media/join-windows-vm/join-domain-successful.png)

    Select **OK** to continue.

1. To complete the process to join to the Azure AD DS managed domain, restart the VM.

Once the Windows Server VM has restarted, any policies applied in the Azure AD DS managed domain are be pushed to the VM. You can also now sign in to the Windows Server VM using appropriate domain credentials.

## Clean up resources

If you continue to use the Windows Server VM created in this tutorial, recall that RDP was open over the Internet. To improve the security and reduce the risk of attack, RDP should be disabled over the Internet. To disable RDP to the Windows Server VM over the internet, complete the following steps:

1. From the left-hand menu, select **Resource groups**
1. Choose your resource group, such as *myResourceGroup*.
1. Choose your VM, such as *myVM*, then select *Networking*.
1. Under **Inbound network security rules** for the network security group, select the rule that allows RDP, then choose **Delete**. It takes a few seconds to remove the inbound security rule.

If you're not going use this Windows Server VM, delete the VM using the following steps:

1. From the left-hand menu, select **Resource groups**
1. Choose your resource group, such as *myResourceGroup*.
1. Choose your VM, such as *myVM*, then select **Delete**. Select **Yes** to confirm the resource deletion. It takes a few minutes to delete the VM.
1. When the VM is deleted, select the OS disk, network interface card, and any other resources with the *myVM-* prefix and delete them.

## Troubleshoot domain-join issues

The Windows Server VM should successfully join to the Azure AD DS managed domain as a regular on-premises computer would join to an Active Directory Domain Services domain. If the Windows Server VM can't join the Azure AD DS managed domain, you have a connectivity or credentials-related issue. Review the following troubleshooting sections to successfully join the managed domain.

### Connectivity issues

If you don't receive a prompt that asks for credentials to join the domain, there's a connectivity problem. The VM is unable to reach the Azure AD DS managed domain on the virtual network. If the VM is unable to find the managed domain, review the following troubleshooting steps. After trying each of these troubleshooting steps, try to join the Windows Server VM to the managed domain again.

* Verify the VM is connected to the same virtual network Azure AD DS is enabled in, or has a peered network connection.
* Try to ping the DNS domain name of the managed domain, such as `ping contoso100.com`.
    * If the ping request fails, try to ping the IP addresses for the managed domain, such as `ping 10.0.0.4`. The IP is displayed on the *Properties* page when you select the Azure AD DS managed domain from your list of Azure resources.
    * If you can ping the IP address but not the domain, DNS may be incorrectly configured. Confirm that the IP addresses of the managed domain are configured as DNS servers for the virtual network.
* Try to flush the DNS resolver cache on the virtual machine using the `ipconfig /flushdns` command.

### Credentials-related issues

If you receive a prompt that asks for credentials to join the domain but then an error after you enter those credentials, review the following troubleshooting steps. After trying each of these troubleshooting steps, try to join the Windows Server VM to the managed domain again.

* Make sure that the user account you specify belongs to the *AAD DC Administrators* group.
* Try using the UPN format to specify credentials, such as *contosoadmin@contoso100.onmicrosoft.com*. If there are many users with the same UPN prefix in your tenant or if your UPN prefix is overly long, the *SAMAccountName* for your account may be autogenerated. In these cases, the *SAMAccountName* format for your account may be different from what you expect or use in your on-premises domain.
* Check that you have [enabled password synchronization][password-sync] to your managed domain. Without this configuration step, the required password hashes won't be present in the Azure AD DS managed domain to correctly authenticate your sign in attempt.
* Wait for password synchronization to be completed. When a user account's password is changed, it can take 15-20 minutes for the password to be available for domain-join use.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a Windows Server VM
> * Connect to the Windows Server VM to an Azure virtual network
> * Join the VM to the Azure AD DS managed domain

> [!div class="nextstepaction"]
> [Learn how synchronization works in an Azure AD Domain Services managed domain](synchronization.md)

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: create-instance.md
[vnet-peering]: ../virtual-network/virtual-network-peering-overview.md
[password-sync]: active-directory-ds-getting-started-password-sync.md
