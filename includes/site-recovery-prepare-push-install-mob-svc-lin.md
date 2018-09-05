### Prepare for a push installation on a Linux server

1. Ensure that there's network connectivity between the Linux computer and the process server.
1. Create an account that the process server can use to access the computer. The account should be a **root** user on the source Linux server. Use this account only for the push installation and for updates.
1. Check that the /etc/hosts file on the source Linux server has entries that map the local hostname to IP addresses associated with all network adapters.
1. Install the latest openssh, openssh-server, and openssl packages on the computer that you want to replicate.
1. Ensure that Secure Shell (SSH) is enabled and running on port 22.
1. Enable SFTP subsystem and password authentication in the sshd_config file. Follow these steps:

    a. Sign in as **root**.

    b. In the **/etc/ssh/sshd_config** file, find the line that begins with **PasswordAuthentication**.

    c. Uncomment the line, and change the value to **yes**.

    d. Find the line that begins with **Subsystem**, and uncomment the line.

      ![Linux](./media/site-recovery-prepare-push-install-mob-svc-lin/mobility2.png)

    e. Restart the **sshd** service.

1. Add the account that you created in CSPSConfigtool. Follow these steps:

    a. Sign in to your configuration server.

    b. Open **cspsconfigtool.exe**. It's available as a shortcut on the desktop and in the %ProgramData%\home\svsystems\bin folder.

    c. On the **Manage Accounts** tab, select **Add Account**.

    d. Add the account you created.

    d. Enter the credentials you use when you enable replication for a computer.
