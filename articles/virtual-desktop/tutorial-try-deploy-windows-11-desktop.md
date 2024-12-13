---
title: "Tutorial: Try Azure Virtual Desktop with Windows 11"
description: This tutorial shows you how to deploy Azure Virtual Desktop with a Windows 11 desktop in a sample infrastructure with the Azure portal.
ms.topic: tutorial
author: dknappettmsft
ms.author: daknappe
ms.date: 12/06/2024
---

# Tutorial: Deploy a sample Azure Virtual Desktop infrastructure with a Windows 11 desktop

Azure Virtual Desktop enables you to access desktops and applications from virtually anywhere. This tutorial shows you how to deploy a *Windows 11 Enterprise* desktop in Azure Virtual Desktop using the Azure portal and how to connect to it using [Windows App](/windows-app/overview).

To learn more about the terminology used for Azure Virtual Desktop, see [Azure Virtual Desktop terminology](environment-setup.md) and [What is Azure Virtual Desktop?](overview.md)

In this tutorial, you:

> [!div class="checklist"]
> * Create: 
>    * A personal host pool.
>    * A session host virtual machine (VM) joined to your Microsoft Entra tenant with Windows 11 Enterprise and add it to the host pool.
>    * A workspace and an application group that publishes a desktop to the session host VM.
> * Assign users to the application group.
> * Connect to the desktop using Windows App.

> [!TIP]
> This tutorial shows a simple way you can get started with Azure Virtual Desktop. It doesn't provide an in-depth guide of the different options and you can't publish a RemoteApp in addition to the desktop. For a more in-depth and adaptable approach to deploying Azure Virtual Desktop, see [Deploy Azure Virtual Desktop](deploy-azure-virtual-desktop.md), or for suggestions of what else you can configure, see the articles we list in [Next steps](#next-steps).

## Prerequisites

You need:

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- The Azure account must be assigned the following built-in role-based access control (RBAC) roles as a minimum on the subscription, or on a resource group. For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml). If you want to assign the roles to a resource group, you need to create this first.

   | Resource type | RBAC role |
   |--|--|
   | Host pool, workspace, and application group | [Desktop Virtualization Contributor](rbac.md#desktop-virtualization-contributor) |
   | Session hosts | [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor) |

   Alternatively if you already have the [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner) RBAC role, you're already able to create all of these resource types.

- A [virtual network](../virtual-network/quick-create-portal.md) in the same Azure region you want to deploy your session hosts to. The virtual network needs outbound internet access. For more information, see [Default outbound access in Azure](/azure/virtual-network/ip-services/default-outbound-access).

- A user account in Microsoft Entra ID you can use for connecting to the desktop. This account must be assigned the *Virtual Machine User Login* or *Virtual Machine Administrator Login* RBAC role on the subscription. Alternatively you can assign the role to the account on the session host VM or the resource group containing the VM after deployment.

- [Windows App installed on your device](/windows-app/get-started-connect-devices-desktops-apps?pivots=azure-virtual-desktop) to connect to the desktop. You can also use Windows App in a web browser without installing any extra software.

## Create a personal host pool, workspace, application group, and session host VM

To create a personal host pool, workspace, application group, and session host VM running Windows 11:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. From the Azure Virtual Desktop overview page, select **Create a host pool**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | **Project details** |  |
   | Subscription | Select the subscription you want to deploy your host pool, session hosts, workspace, and application group in from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Host pool name | Enter a name for the host pool, for example **hp01**. |
   | Location | Select the Azure region from the list where you want to create your host pool, workspace, and application group. |
   | Validation environment | Select **No**. This setting enables your host pool to receive service updates before all other production host pools, but isn't needed for this tutorial.|
   | Preferred app group type | Select **Desktop**. With this personal host pool, you publish a desktop, but you can't also add a RemoteApp application group for the same host pool to also publish applications. See [Next steps](#next-steps) for more advanced scenarios. |
   | **Host pool type** |  |
   | Host pool type | Select **Personal**. This means that end users have a dedicated assigned session host that they always connect to. Selecting **Personal** shows a new option for **Assignment type**. |
   | Assignment type | Select **Automatic**. Automatic assignment means that a user automatically gets assigned the first available session host when they first sign in, which is then dedicated to that user. |

   Once you've completed this tab, select **Next: Session hosts**.

1. On the **Session hosts** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Add Azure virtual machines | Select **Yes**. This shows several new options. |
   | Resource group | This automatically defaults to the resource group you chose your host pool to be in on the *Basics* tab. |
   | Name prefix | Enter a name for your session hosts, for example **hp01-sh**.<br /><br />This name prefix is used as the prefix for your session host VMs. Each session host has a suffix of a hyphen and then a sequential number added to the end, for example **hp01-sh-0**.<br /><br />The prefix can be a maximum of 11 characters and is used in the computer name in the operating system. The prefix and the suffix combined can be a maximum of 15 characters. Session host names must be unique. |
   | Virtual machine location | Select the Azure region where you want to deploy your session host VMs. It must be the same region that your virtual network is in. |
   | Availability options | Select **No infrastructure redundancy required**. This means that your session host VMs aren't deployed in an availability set or in availability zones. |
   | Security type | Select **Trusted launch virtual machines**. Leave the subsequent defaults as they are. For more information, see [Trusted launch](security-guide.md#trusted-launch). |
   | Image | Select a **Windows 11** image from the drop-down list. |
   | Virtual machine size | Select an Azure VM SKU. You can use the default SKU, or if you want to use a different SKU, select **Change size**, then select from the list. Make sure your Azure subscription has available quota for the SKU you select. For more information, see [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes/overview) and [View quotas](/azure/quotas/view-quotas). |
   | Hibernate | Leave hibernate unchecked for this tutorial. |
   | Number of VMs | Enter **1** as a minimum. You can deploy up to 400 session host VMs at this point if you wish, or you can add more separately.<br /><br />With a personal host pool, each session host can only be assigned to one user, so you need one session host for each user connecting to this host pool. Once you've completed this tutorial, you can create a pooled host pool, where multiple users can connect to the same session host. |
   | OS disk type | Select **Premium SSD** for best performance. If you select a different type, your Windows experience in the remote session might be slow. |
   | OS disk size | Leave **Default size (128GiB)** selected. |
   | Boot Diagnostics | Select **Enable with managed storage account (recommended)**. |
   | **Network and security** |  |
   | Virtual network | Select your virtual network and subnet to connect session hosts to. |
   | Network security group | Select **Basic**. |
   | Public inbound ports | Select **No** as you don't need to open inbound ports to connect to Azure Virtual Desktop. Learn more at [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md). |
   | **Domain to join** |  |
   | Select which directory you would like to join | Select **Microsoft Entra ID**. |
   | Enroll VM with Intune | Select **No.** |
   | **Virtual machine administrator account** |  |
   | Username | Enter a name to use as the local administrator account for these session host VMs. |
   | Password | Enter a password for the local administrator account. |
   | Confirm password | Reenter the password. |
   | **Custom configuration** |  |
   | Custom configuration script URL | Leave this blank. |

   Once you've completed this tab, select **Next: Workspace**.

1. On the **Workspace** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Register desktop app group | Select **Yes**. This registers the default desktop application group to the selected workspace. |
   | To this workspace | Select **Create new** and enter a name, for example **ws01**. |

   Once you've completed this tab, select **Next: Review + create**. You don't need to complete the other tabs.

1. On the **Review + create** tab, ensure validation passes and review the information that is used during deployment. If validation doesn't pass, review the error message and check what you entered in each tab.

1. Select **Create**. A host pool, workspace, application group, and session host are created. Once your deployment is complete, select **Go to resource** to go to the host pool overview.

1. Finally, from the host pool overview, select **Session hosts** and verify the status of the session hosts is **Available**.

## Assign users to the application group

Once your host pool, workspace, application group, and session host VM(s) have been deployed, you need to assign users to the application group that was automatically created. After users are assigned to the application group, they'll automatically be assigned to an available session host VM because *Assignment type* was set to **Automatic** when the host pool was created.

1. From the host pool overview, select **Application groups**.

1. Select the application group from the list, for example **hp01-DAG**.

1. From the application group overview, select **Assignments**.

1. Select **+ Add**, then search for and select the user account you want to be assigned to this application group.

1. Finish by selecting **Select**.

## Enable Microsoft Entra ID authentication to the remote session

The session host you created is joined to Microsoft Entra ID. To enable connections to a remote session using Microsoft Entra ID authentication, you need to add an RDP property to your host pool configuration:

1. Go back to the host pool overview, then select **RDP Properties**.

1. Select the **Advanced** tab.

1. In the **RDP Properties** box, add `enablerdsaadauth:i:1;` to the start of the text in the box.

1. Select **Save**.

## Connect to the desktop with Windows App

You're ready to connect to the desktop. The desktop takes longer to load the first time as the profile is being created, however subsequent connections are quicker.

> [!IMPORTANT]
> Make sure the user account you're using to connect has been assigned the *Virtual Machine User Login* or *Virtual Machine Administrator Login* RBAC role on the subscription, session host VM, or the resource group containing the VM, as mentioned in the prerequisites, else you won't be able to connect.

Select the relevant tab and follow the steps, depending on which platform you're using. We've only listed the steps here for Windows, macOS, and using a web browser. If you want to connect using Windows App on another platform, see [Get started with Windows App to connect to desktops and apps](/windows-app/get-started-connect-devices-desktops-apps?pivots=azure-virtual-desktop).

# [Windows](#tab/windows)

1. Open **Windows App** on your device.

1. Select Sign in and sign in with your user account for Azure Virtual Desktop. If you're signed in to your local Windows device with a work or school account on a managed device, you're signed in automatically.

1. If it's your first time using Windows App, navigate through the tour to learn more about Windows App, then select **Done**, or select **Skip**.

1. After you sign in, select the **Devices** tab to see the desktop you created, which is called **SessionDesktop**.

1. Select **Connect** to launch a desktop session. If you see the prompt **Allow remote desktop connection?**, select **Yes**. Your desktop is ready to use.

# [macOS](#tab/macos)

1. Open **Windows App** on your device.

1. If it's your first time using Windows App, navigate through the tour to learn more about Windows App, then select **Done**, or select **Skip**.

1. Select **+**, then select **Add Work or School Account** and sign in with your user account for Azure Virtual Desktop.

1. After you sign in, select the **Devices** tab to see the desktop you created, which is called **SessionDesktop**.

1. Double-click **SessionDesktop** to connect. If you see the prompt **Allow remote desktop connection?**, select **Yes**. Your desktop is ready to use.

# [Web browser](#tab/web)

1. Open a web browser and go to [**https://windows.cloud.microsoft/**](https://windows.cloud.microsoft/).

1. Sign in with your user account for Azure Virtual Desktop. If you're signed in to your browser with a work or school account on a managed device, you're signed in automatically.

1. If it's your first time using Windows App, navigate through the tour to learn more about Windows App, then select **Done**, or select **Skip**.

1. After you sign in, select the **Devices** tab to see the desktop you created, which is called **SessionDesktop**.

1. Select **Connect** to launch a desktop session.

1. The prompt **In Session Settings** enables you to access some local resources, such as printers and the clipboard in the remote session. Once you've made your selections, select **Connect**.

1. If you see the prompt **Allow remote desktop connection?**, select **Yes**. Your desktop is ready to use.

---

## Next steps

Now that you've created and connected to a Windows 11 desktop with Azure Virtual Desktop there's much more you can do. For a more in-depth and adaptable approach to deploying Azure Virtual Desktop, see [Deploy Azure Virtual Desktop](deploy-azure-virtual-desktop.md), or for suggestions of what else you can configure, see:

- [Add session hosts to a host pool](add-session-hosts-host-pool.md).

- [Publish applications with RemoteApp](publish-applications-stream-remoteapp.md).

- [User profile management for Azure Virtual Desktop with FSLogix profile containers](fslogix-profile-containers.md).

- [Understand network connectivity](network-connectivity.md).

- Learn about [supported identities and authentication methods](authentication.md)

- [Configure single sign-on for Azure Virtual Desktop using Microsoft Entra authentication](configure-single-sign-on.md), which includes providing consent on behalf of your organization.

- Learn about [session host virtual machine sizing guidelines](/windows-server/remote/remote-desktop-services/virtual-machine-recs?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json).

- [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md).

- [Monitor your deployment with Azure Virtual Desktop Insights](azure-monitor.md).
