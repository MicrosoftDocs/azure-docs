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
ms.date: 07/10/2019
ms.author: iainfou

#Customer intent: As an server administrator, I want to learn how to join a Windows Server VM to an Azure Active Directory Domain Services managed domain to provide centralized identity and policy.

---
# Tutorial: Join a Windows Server virtual machine to a managed domain

This tutorial shows you how to create a Windows Server VM then join it to an Azure AD DS managed domain.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * 

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

5. By default, VMs created in Azure aren't accessible from the Internet. This helps improve the security of the VM and reduces the area for potential attack. In the next step of this tutorial, you connect to the VM using remote desktop protocol (RDP) and then join the Windows Server to the Azure AD DS managed domain. To do this step, you must enable *RDP* connections.

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
12. Back in the **Networking** pane to create a VM, choose the subnet you just created from the drop-down menu, such as *ManagedVMs*.
13. Leave the other options as their default values, then select **Management**.
14. Set **Boot diagnostics** to *Off*. Leave the other options as their default values, then select **Review + create**.
15. Review the VM settings, then select **Create**.

It takes a few minutes to create the VM. The Azure portal shows the status of the deployment. Once the VM is ready, select **Go to resource**.

![Go to the VM resource in the Azure portal once it's successfully created](./media/join-windows-vm/vm-created.png)

## Connect to the Windows Server VM
Next, connect to the newly created Windows Server virtual machine to join it to the domain. Use the local administrator credentials that you specified when you created the virtual machine.

To connect to the virtual machine, perform the following steps:

1. In the **Overview** pane, select **Connect**.

    ![Connect to Windows virtual machine in the Azure portal](./media/join-windows-vm/connect-to-vm.png)

1. Select the option to **Download RDP File*. Save this RDP file in your web browser.

2. To connect to your VM, open the downloaded RDP file. If prompted, select **Connect**.
3. Enter your **local administrator credentials**, which you specified when you created the virtual machine (for example, *localhost\mahesh*).
4. If you see a certificate warning during the sign-in process, select **Yes** or **Continue** to connect.

At this point, you should be logged on to the newly created Windows virtual machine with your local administrator credentials. The next step is to join the virtual machine to the domain.


## Join the Windows Server VM to the Azure AD DS managed domain
To join the Windows Server virtual machine to the Azure AD DS-managed domain, complete the following steps:

1. Connect to the Windows Server VM, as shown in "Step 2." On the **Start** screen, open **Server Manager**.
2. In the left pane of the **Server Manager** window, select **Local Server**.

    ![The Server Manager window on the virtual machine](./media/active-directory-domain-services-admin-guide/join-domain-server-manager.png)

3. Under **Properties**, select **Workgroup**.
4. In the **System Properties** window, select **Change** to join the domain.

    ![The System Properties window](./media/active-directory-domain-services-admin-guide/join-domain-system-properties.png)

5. In the **Domain** box, specify the name of your Azure AD DS-managed domain, and then select **OK**.

    ![Specify the domain to be joined](./media/active-directory-domain-services-admin-guide/join-domain-system-properties-specify-domain.png)

6. You're asked to enter your credentials to join the domain. Use the credentials for a *user that belongs to the Azure AD DC administrators group*. Only members of this group have privileges to join machines to the managed domain.

    ![The Windows Security window for specifying credentials](./media/active-directory-domain-services-admin-guide/join-domain-system-properties-specify-credentials.png)

7. You can specify credentials in either of the following ways:

   * **UPN format**: (Recommended) Specify the user principal name (UPN) suffix for the user account, as configured in Azure AD. In this example, the UPN suffix of the user *bob* is *bob\@domainservicespreview.onmicrosoft.com*.

   * **SAMAccountName format**: You can specify the account name in the SAMAccountName format. In this example, the user *bob* would need to enter *CONTOSO100\bob*.

     > [!TIP]
     > **We recommend using the UPN format to specify credentials.**
     >
     > If a user's UPN prefix is overly long (for example, *joehasareallylongname*), the SAMAccountName might be auto-generated. If multiple users have the same UPN prefix (for example, *bob*) in your Azure AD tenant, their SAMAccountName format might be auto-generated by the service. In these cases, the UPN format can be used reliably to log on to the domain.
     >

8. After you've successfully joined a domain, the following message welcomes you to the domain.

    ![Welcome to the domain](./media/active-directory-domain-services-admin-guide/join-domain-done.png)

9. To complete joining the domain, restart the virtual machine.

## Troubleshoot joining a domain
### Connectivity issues
If the virtual machine is unable to find the domain, try the following troubleshooting steps:

* Verify the virtual machine is connected to the same virtual network Azure AD DS is enabled in. Otherwise, the virtual machine is unable to connect to or join the domain.
* Verify the virtual machine is on a virtual network that is in turn connected to the virtual network Azure AD DS is enabled in.
* Try to ping the DNS domain name of the managed domain (for example, *ping contoso100.com*). If you're unable to do so, try to ping the IP addresses for the domain that's displayed on the page where you enabled Azure AD DS (for example, *ping 10.0.0.4*). If you can ping the IP address but not the domain, DNS may be incorrectly configured. Check to see whether the IP addresses of the domain are configured as DNS servers for the virtual network.
* Try flushing the DNS resolver cache on the virtual machine (*ipconfig /flushdns*).

If a window is displayed that asks for credentials to join the domain, you do not have connectivity issues.

### Credentials-related issues
If you're having trouble with credentials and are unable to join the domain, try the following troubleshooting steps:

* Try using the UPN format to specify credentials. If there are many users with the same UPN prefix in your tenant or if your UPN prefix is overly long, the SAMAccountName for your account may be auto-generated. In these cases, the SAMAccountName format for your account may be different from what you expect or use in your on-premises domain.
* Try to use the credentials of a user account that belongs to the *AAD DC Administrators* group.
* Check that you have [enabled password synchronization](active-directory-ds-getting-started-password-sync.md) to your managed domain.
* Check that you've used the UPN of the user as configured in Azure AD (for example, *bob\@domainservicespreview.onmicrosoft.com*) to sign in.
* Wait long enough for password synchronization to be completed, as specified in the getting started guide.

## Next steps

* [Azure AD DS getting started guide](create-instance.md)
* [Manage an Azure AD Domain Services domain](manage-domain.md)

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: create-instance.md
[vnet-peering]: ../virtual-network/virtual-network-peering-overview.md
