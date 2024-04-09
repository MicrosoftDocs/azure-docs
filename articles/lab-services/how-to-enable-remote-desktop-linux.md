---
title: Enable graphical remote desktop for Linux labs
titleSuffix: Azure Lab Services
description: Learn how to enable remote desktop for Linux virtual machines in a lab in Azure Lab Services, and about options for best performance.
services: lab-services
ms.service: lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 03/12/2024
#customer intent: As an educator and lab creator, I want to provide access to linux virtual machines by RDP so that students can use a GUI.
---

# Enable graphical remote desktop for Linux virtual machines in Azure Lab Services

When you create a lab from a Linux image, Azure Lab Services automatically enables Secure Shell (SSH). A lab creator can connect to the template virtual machine (VM) from the command line. After you publish the template VM, students can also connect to their VMs using SSH.

To connect to a Linux VM using a GUI, there are more steps to set up in the template VM. The steps vary based on the distribution, version, GUI desktop environment, and remote desktop technology that you choose to use with Azure Lab Services. This article shows how to set up common GUI desktops with Ubuntu 20.04/22.04 LTS using either Remote Desktop Protocol (RDP) or X2Go.

> [!NOTE]
> Linux uses an open-source version of RDP called [Xrdp](https://en.wikipedia.org/wiki/Xrdp). For simplicity, we use the term RDP throughout this article.

## Performance

Performance over a remote desktop connection varies by distribution, version, GUI desktop, and the remote desktop technology used. For example, you might notice latency over a remote desktop connection when using a resource intensive GUI desktop like [GNOME](https://www.gnome.org/) and RDP. A light-weight GUI desktop like [XFCE](https://www.xfce.org/) or [X2Go](https://wiki.x2go.org/doku.php/doc:newtox2go) tends to have better performance. To optimize performance, you should consider using:

- A less resource intensive GUI desktop like XFCE.
- X2Go for remote desktop connection to [supported GUI desktops](https://wiki.x2go.org/doku.php/doc:de-compat).

Another option to consider is [nested virtualization](concept-nested-virtualization-template-vm.md). Students can connect to a Windows lab host VM using RDP, and then use Linux on nested VMs. This approach might help improve performance.

> [!IMPORTANT]
> Some marketplace images already have a graphical desktop environment and remote desktop server installed. For example, the [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) already has [XFCE and X2Go Server installed and configured to accept client connections](../machine-learning/data-science-virtual-machine/dsvm-ubuntu-intro.md#x2go).

## Choose setup options

There are several [distributions/versions](how-to-configure-auto-shutdown-lab-plans.md#supported-linux-distributions-for-automatic-shutdown) and GUI desktops that can be used with Azure Lab Services. This section shows how to set up a lab's template VM with the following common configurations:

| Distribution/Version      | GUI desktop | Remote desktop technology | Instructions |
|:--------------------------|:------------|:--------------------------|:-------------|
| Ubuntu 20.04/22.04 LTS    | [XFCE](https://www.xfce.org/)    | [X2Go](https://wiki.x2go.org/doku.php/doc:newtox2go)    | [Set up XFCE and X2Go](how-to-enable-remote-desktop-linux.md#set-up-xfce-and-x2go) |
| Ubuntu 20.04/22.04 LTS    | [Xubuntu](https://xubuntu.org/)    | X2Go    | [Set up xUbuntu and X2Go](how-to-enable-remote-desktop-linux.md#set-up-xubuntu-and-x2go) |
| Ubuntu 20.04/22.04 LTS    | [MATE](https://mate-desktop.org/)    | X2Go    | [Set up MATE and X2Go](how-to-enable-remote-desktop-linux.md#set-up-mate-and-x2go) |
| Ubuntu 20.04/22.04 LTS    | [GNOME](https://www.gnome.org/)    | [RDP](https://en.wikipedia.org/wiki/Xrdp)    | [Set up GNOME and RDP](how-to-enable-remote-desktop-linux.md#set-up-gnome-and-rdp) |

## Set up XFCE and X2Go

For optimal performance, we recommend using XFCE with X2Go for remote desktop connection. The lab creator must perform the following steps on the lab template VM:

- Install the XFCE GUI desktop
- Install the X2Go remote desktop server

X2Go uses the same port as SSH (22), which is enabled by default when you create a lab. The following steps show how to set up XFCE and X2Go.

1. [Connect to a lab's template VM](how-to-create-manage-template.md#update-a-template-vm) using SSH.
1. Use the following ReadMe and script to install the XFCE GUI desktop and the X2Go server on the template VM.

    - [ReadMe](https://aka.ms/azlabs/scripts/LinuxDesktop-Xfce)
    - [Bash script](https://aka.ms/azlabs/scripts/LinuxDesktop-Xfce/x2go-xfce4.sh)

1. Use the [X2Go client to connect to the template VM](connect-virtual-machine-linux-x2go.md).

## Set up xUbuntu and X2Go

xUbuntu is another light-weight GUI desktop that can be used with X2Go for remote desktop connection. However, to optimize performance, you need to disable windows compositing. The lab creator must perform the following steps on the lab template VM:

- Install the xUbuntu GUI desktop
- Install the X2Go remote desktop server
- Disable windows compositing

X2Go uses the same port as SSH (22), which is enabled by default when you create a lab. The following steps show how to set up xUbuntu and X2Go.

1. [Connect to a lab's template VM](how-to-create-manage-template.md#update-a-template-vm) using SSH.
1. Use the following ReadMe and script to install the xUbuntu GUI desktop and the X2Go server on the template VM.

   - [ReadMe](https://aka.ms/azlabs/scripts/LinuxDesktop-Xfce)
   - [Bash script](https://aka.ms/azlabs/scripts/LinuxDesktop-Xfce/x2go-xubuntu.sh)

1. Use the [X2Go client to connect to the template VM](connect-virtual-machine-linux-x2go.md). As shown in the above ReadMe, disable windows compositing and restart the template VM to optimize performance.

## Set up MATE and X2Go

The MATE GUI desktop can also be used with X2Go for remote desktop connection. The lab creator must perform the following steps on the lab template VM:

- Install the MATE GUI desktop
- Install the X2Go remote desktop server

X2Go uses the same port as SSH (22), which is enabled by default when you create a lab. The following steps show how to set up MATE and X2Go.

1. [Connect to a lab's template VM](how-to-create-manage-template.md#update-a-template-vm) using SSH.
1. Use the following ReadMe and script to install the MATE GUI desktop and the X2Go server on the template VM.

   - [ReadMe](https://aka.ms/azlabs/scripts/LinuxDesktop-GnomeMate)
   - [Bash script](https://aka.ms/azlabs/scripts/LinuxDesktop-GnomeMate/x2go-mate.sh)

1. Use the [X2Go client to connect to the template VM](connect-virtual-machine-linux-x2go.md).

## Set up GNOME and RDP

GNOME is a more resource intensive desktop that requires RDP for remote desktop connection. The lab creator must perform the following steps:

- Enable the **Client connection (RDP) setting** during lab creation.
- On the template VM:

  - Install the GNOME GUI desktop
  - Install the RDP remote desktop server
  - Update RDP performance related settings

RDP uses port 3389 for connecting to a VM. By default, Linux lab VMs only have the SSH port 22 enabled. The following steps show how to enable port 3389 and how to set up GNOME and RDP.

1. During [lab creation](quick-create-connect-lab.md#create-a-lab), use the **Enabled connection types settings** to select the **Client connection (RDP)** setting. You must enable this option to open the port on the Linux VM that is needed for an RDP remote desktop session. If this option is left disabled, only the port for SSH is open. The enabled ports *can't* be changed after a lab is created.

    :::image type="content" source="./media/how-to-enable-remote-desktop-linux/enable-rdp-connection-option.png" alt-text="Screenshot that shows the Lab policies window with the Client connection (RDP) setting during lab creation." lightbox="./media/how-to-enable-remote-desktop-linux/enable-rdp-connection-option.png":::

1. On the **Enable Remote Desktop Connection** message box, select **Continue with Remote Desktop**.

    :::image type="content" source="./media/how-to-enable-remote-desktop-linux/enable-remote-desktop-connection-dialog.png" alt-text="Screenshot that shows the Enable Remote Desktop Connection confirmation window." lightbox="./media/how-to-enable-remote-desktop-linux/enable-remote-desktop-connection-dialog.png":::

1. [Connect to a lab's template VM](how-to-create-manage-template.md#update-a-template-vm) using SSH.

1. On the template VM, use the following ReadMe and script to install the GNOME GUI desktop, install the RDP server, and make RDP performance optimizations:

   - [ReadMe](https://aka.ms/azlabs/scripts/LinuxDesktop-GnomeMate)
   - [Bash script](https://aka.ms/azlabs/scripts/LinuxDesktop-GnomeMate/xrdp-gnome.sh)

1. Use the [RDP client to connect to the template VM](connect-virtual-machine.md#connect-to-a-linux-lab-vm-using-rdp).

## Related content

You successfully configured RDP or X2Go for a Linux-based template VM.

- Learn how you can [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm) to create student lab VMs based on this template.
