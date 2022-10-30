---
title: Connect to Azure Percept DK over SSH
description: Learn how to SSH into your Azure Percept DK with PuTTY
author: yvonne-dq
ms.author: davej
ms.service: azure-percept
ms.topic: how-to
ms.date: 10/04/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to Azure Percept DK over SSH

[!INCLUDE [Retirement note](./includes/retire.md)]


Follow the steps below to set up an SSH connection to your Azure Percept DK through OpenSSH or [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

## Prerequisites

- A Windows, Linux, or OS X based host computer with Wi-Fi capability
- An SSH client (see the next section for installation guidance)
- An Azure Percept DK (dev kit)
- An SSH account, created during the [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md)

## Install your preferred SSH client

If your host computer runs Linux or OS X, SSH services are included in those operating systems and can be run without a separate client application. Check your operating system product documentation for more information on how to run SSH services.

If your host computer runs Windows, you may have two SSH client options to choose from: OpenSSH and PuTTY.

### OpenSSH

Windows 10 includes a built-in SSH client called OpenSSH that can be run with a simple command in a command prompt. We recommend using OpenSSH with Azure Percept if it's available to you. To check if your Windows computer has OpenSSH installed, follow these steps:

1. Go to **Start** -> **Settings**.

1. Select **Apps**.

1. Under **Apps & features**, select **Optional features**.

1. Type **OpenSSH Client** into the **Installed features** search bar. If OpenSSH appears, the client is already installed, and you may move on to the next section. If you do not see OpenSSH, select **Add a feature**.

    :::image type="content" source="./media/how-to-ssh-into-percept-dk/open-ssh-install.png" alt-text="Screenshot of settings showing OpenSSH installation status.":::

1. Select **OpenSSH Client** and select **Install**. You may now move on to the next section. If OpenSSH is not available to install on your computer, follow the steps below to install PuTTY, a third-party SSH client.

### PuTTY

If your Windows computer does not include OpenSSH, we recommend using [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html). To download and install PuTTY, complete the following steps:

1. Go to the [PuTTY download page](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

1. Under **Package files**, select the 32-bit or 64-bit .msi file to download the installer. If you are unsure of which version to choose, check out the [FAQs](https://www.chiark.greenend.org.uk/~sgtatham/putty/faq.html#faq-32bit-64bit).

1. Select the installer to start the installation process. Follow the prompts as required.

1. Congratulations! You have successfully installed the PuTTY SSH client.

## Initiate the SSH connection
   >[!NOTE]
   > You may receive a warning message from your SSH client that says your cached/stored key does not match. This can happen after flashing your device or when the IP/hostname has changed and is now provisioned to a new target.  Follow your SSH client’s instructions for how to remedy this.
1. Power on your Azure Percept DK.

1. If your dev kit is already connected to a network over Ethernet or Wi-Fi, skip to the next step. Otherwise, connect your host computer directly to the dev kit’s Wi-Fi access point. Like connecting to any other Wi-Fi network, open the network and internet settings on your computer, select the following network, and enter the network password when prompted:

    - **Network name**: depending on your dev kit's operating system version, the name of the Wi-Fi access point is either **scz-xxxx** or **apd-xxxx** (where “xxxx” is the last four digits of the dev kit’s MAC address)
    - **Password**: can be found on the Welcome Card that came with the dev kit

    > [!WARNING]
    > While connected to the Azure Percept DK Wi-Fi access point, your host computer will temporarily lose its connection to the Internet. Active video conference calls, web streaming, or other network-based experiences will be interrupted.

1. Complete the SSH connection process according to your SSH client.

### Using OpenSSH

1. Open a command prompt (**Start** -> **Command Prompt**).

1. Enter the following into the command prompt:

    ```console
    ssh [your ssh user name]@[IP address]
    ```

    If your computer is connected to the dev kit's Wi-Fi access point, the IP address will be 10.1.1.1. If your dev kit is connected over Ethernet, use the local IP address of the device, which you can get from the Ethernet router or hub. If your dev kit is connected over Wi-Fi, you must use the IP address that was assigned to your dev kit during the [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md).

    > [!TIP]
    > If your dev kit is connected to a Wi-Fi network but you do not know its IP address, go to Azure Percept Studio and [open your device's video stream](./how-to-view-video-stream.md). The address bar in the video stream browser tab will show your device's IP address.

1. Enter your SSH password when prompted.

    :::image type="content" source="./media/how-to-ssh-into-percept-dk/open-ssh-prompt.png" alt-text="Screenshot of Open SSH command prompt login.":::

1. If this is the first time connecting to your dev kit through OpenSSH, you may also be prompted to accept the host's key. Enter **yes** to accept the key.

1. Congratulations! You have successfully connected to your dev kit over SSH.

### Using PuTTY

1. Open PuTTY. Enter the following into the **PuTTY Configuration** window and select **Open** to SSH into your dev kit:

    1. Host Name: [IP address]
    1. Port: 22
    1. Connection Type: SSH

    The **Host Name** is your dev kit's IP address. If your computer is connected to the dev kit's Wi-Fi access point, the IP address will be 10.1.1.1. If your dev kit is connected over Ethernet, use the local IP address of the device, which you can get from the Ethernet router or hub. If your dev kit is connected over Wi-Fi, you must use the IP address that was assigned to your dev kit during the [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md).

    > [!TIP]
    > If your dev kit is connected to a Wi-Fi network but you do not know its IP address, go to Azure Percept Studio and [open your device's video stream](./how-to-view-video-stream.md). The address bar in the video stream browser tab will show your device's IP address.

    :::image type="content" source="./media/how-to-ssh-into-percept-dk/ssh-putty.png" alt-text="Screenshot of PuTTY Configuration window.":::

1. A PuTTY terminal will open. When prompted, enter your SSH username and password into the terminal.

1. Congratulations! You have successfully connected to your dev kit over SSH.

## Next steps

After connecting to your Azure Percept DK through SSH, you may perform a variety of tasks, including [device troubleshooting](./troubleshoot-dev-kit.md) and [USB updates](./how-to-update-via-usb.md).
