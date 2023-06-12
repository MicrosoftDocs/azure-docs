---
title: Connect to a Linux VM using X2Go
titleSuffix: Azure Lab Services
description: Learn how to use X2Go for Linux virtual machines in a lab in Azure Lab Services.  
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 04/24/2023
---

# Connect to a lab VM using X2Go in Azure Lab Services

In this article, you learn how to connect to a Linux-based lab VM in Azure Lab Services by using X2Go. Before you can connect with X2Go, the lab needs to have the X2Go and the GUI packages for a Linux graphical desktop environment.

When you connect to the lab VM by using X2Go, you need to provide the Linux graphical desktop environment version. For example, select `XFCE` if you're using either XFCE or Xubuntu graphical desktop environments. You can get this information from the person that created the lab.

## Install X2Go client

Install the [X2Go client](https://wiki.x2go.org/doku.php/doc:installation:x2goclient) on your local computer.  Follow the instructions that match your client OS.

## Connect to the VM using X2Go client

1. Copy SSH connection information for the lab VM. 

    Learn how to [Connect to a Linux lab VM Using SSH](connect-virtual-machine.md#connect-to-a-linux-lab-vm-using-ssh). You need this information to connect using the X2Go client.

1. Once you have the SSH connection information, open the X2Go client and select **Session** > **New Session**.

    :::image type="content" source="./media/how-to-use-classroom-lab/x2go-new-session.png" alt-text="Screenshot of X 2 Go client Session menu.":::

1. Enter the values in the **Session Preferences** pane based on your SSH connection information.

    For example, your connection information might look similar to following command.

    ```bash
    ssh -p 12345 student@ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com
    ```

    Based on this sample, enter the following values:

   - **Session name** - Specify a name, such as the name of your VM.
   - **Host** - The ID of your VM; for example, **`ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com`**.
   - **Login** - The username for your VM; for example, **student**.
   - **SSH port** - The unique port assigned to your VM; for example, **12345**.
   - **Session type** - Select the Linux graphical desktop environment that was used when setting up the lab. For example, select `XFCE` if you're using either XFCE or Xubuntu graphical desktop environments.

1. Select **OK** to create the remote session.

    :::image type="content" source="./media/how-to-use-classroom-lab/x2go-session-preferences.png" alt-text="Screenshot of new session window in X 2 Go client.  The session name, server information and session type settings are highlighted.":::

1. Select your session in the right-hand pane.

    :::image type="content" source="./media/how-to-use-classroom-lab/x2go-start-session.png" alt-text="Screenshot of X 2 Go with saved session.":::

    > [!NOTE]
    > If you're prompted with a message about authenticity, select **yes** to continue, and enter your password. The message is similar to "The authenticity of host '[`00000000-0000-0000-0000-000000000000.eastus2.cloudapp.eastus.cloudapp.azure.com`]:12345' can't be established.  ECDSA key fingerprint is SHA256:00000000000000000000000000000000000000000000.Are you sure you want to continue connecting (yes/no)?"

1. When prompted, enter your password and select **OK**.

    You're now remotely connected to your lab VM's GUI desktop environment.

## Next steps

- [Configure X2Go on a template VM](how-to-enable-remote-desktop-linux.md#setting-up-x2go)
