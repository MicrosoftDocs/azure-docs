---
title: Connect to a Linux VM  using X2Go in Azure Lab Services | Microsoft Docs
description: Learn how to use X2Go for Linux virtual machines in a lab in Azure Lab Services.  
ms.topic: how-to
ms.date: 02/01/2022
---

# Connect to a VM using X2Go

Students can use X2Go to connect to their Linux VMs after their educator sets up their lab with X2Go and the GUI packages for a Linux graphical desktop environment

Students need to find out from their educator which Linux graphical desktop environment their educator has installed.  This information is needed in the next steps to connect using the X2Go client.

## Install X2Go client

Install the [X2Go client](https://wiki.x2go.org/doku.php/doc:installation:x2goclient) on your local computer.  Follow the instructions that match the client OS you are using.

## Connect to the VM using X2Go client

1. Copy SSH connection information for VM. For instructions to get the SSH command, see [Connect to a Linux lab VM Using SSH](connect-virtual-machine.md#connect-to-a-linux-lab-vm-using-ssh).  You need this information to connect using the X2Go client.

1. Once you have the SSH connection information, open the X2Go client and select **Session** > **New Session**.

    :::image type="content" source="./media/how-to-use-classroom-lab/x2go-new-session.png" alt-text="Screenshot of X 2 Go client Session menu.":::

1. Enter the values in the **Session Preferences** pane based on your SSH connection information.  For example, your connection information will look similar to following command.

    ```bash
    ssh -p 12345 student@ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com
    ```

    Using this example, the following values are entered:

   - **Session name** - Specify a name, such as the name of your VM.
   - **Host** - The ID of your VM; for example, **`ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com`**.
   - **Login** - The username for your VM; for example, **student**.
   - **SSH port** - The unique port assigned to your VM; for example, **12345**.
   - **Session type** - Select the Linux graphical desktop environment that your educator configured your VM.  You  need to get this information from your educator.  For example, select `XFCE` if you're using either XFCE or Xubuntu graphical desktop environments.

    Finally, select **OK** to create the session.

    :::image type="content" source="./media/how-to-use-classroom-lab/x2go-session-preferences.png" alt-text="Screenshot of new session window in X 2 Go client.  The session name, server information and session type settings are highlighted.":::

1. Select on your session in the right-hand pane.

    :::image type="content" source="./media/how-to-use-classroom-lab/x2go-start-session.png" alt-text="Screenshot of X 2 Go with saved session.":::

    > [!NOTE]
    > If you are prompted with a message about authenticity, select **yes** to continue to entering your password.  Message will be similar to "The authenticity of host '[`00000000-0000-0000-0000-000000000000.eastus2.cloudapp.eastus.cloudapp.azure.com`]:12345' can't be established.  ECDSA key fingerprint is SHA256:00000000000000000000000000000000000000000000.Are you sure you want to continue connecting (yes/no)?"

1. When prompted, enter your password and select **OK**.  You'll now be remotely connected to your VM's GUI desktop environment.

## Next steps

- [As an educator, configure X2Go on a template VM](how-to-enable-remote-desktop-linux.md#x2go-setup)
- [As a student, stop the VM](how-to-use-lab.md#start-or-stop-the-vm)
