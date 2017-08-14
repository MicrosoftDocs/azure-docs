## Prepare your Intel NUC

To complete the hardware setup, you need to:

- Connect your Intel NUC to the power supply included in the kit.
- Connect your Intel NUC to your network using an Ethernet cable.

You have now completed the hardware setup of your Intel NUC gateway device.

### Sign in and access the terminal

You have two options to access a terminal environment on your Intel NUC:

- If you have a keyboard and monitor connected to your Intel NUC, you can access the shell directly. The default credentials are username **root** and password **root**.

- Access the shell on your Intel NUC using SSH from your desktop machine.

#### Sign in with SSH

To sign in with SSH, you need the IP address of your Intel NUC. If you have a keyboard and monitor connected to your Intel NUC, use the `ifconfig` command to find the IP address. Alternatively, connect to your router to list the addresses of devices on your network.

Sign in with username **root** and password **root**.

#### Optional: Share a folder on your Intel NUC

Optionally, you may want to share a folder on your Intel NUC with your desktop environment. Sharing a folder enables you to use your preferred desktop text editor (such as [Visual Studio Code](https://code.visualstudio.com/) or [Sublime Text](http://www.sublimetext.com/)) to edit files on your Intel NUC instead of using `nano` or `vi`.

To share a folder with Windows, configure a Samba server on the Intel NUC. Alternatively, use the SFTP server on the Intel NUC with an SFTP client on your desktop machine.
