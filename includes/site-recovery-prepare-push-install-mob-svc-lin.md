### Prepare for push install on Linux Servers

1. Ensure there’s network connectivity between the Linux machine and the process server.
2. Create an account that can be used by the process server to access the machine. The account should be a **root** user on the source Linux server() this account is only used for the push installation/updates).
3. Check that the `/etc/hosts` file on the source Linux server contains entries that map the local hostname to IP addresses associated with all network adapters.
4. Install the latest openssh, openssh-server, openssl packages on the machine you want to replicate.
5. Ensure SSH is enabled and running on port 22.
6. Enable SFTP subsystem and password authentication in the sshd_config file as follows:
  - Log in as **root**.
  - In the file /etc/ssh/sshd_config file, find the line that begins with **PasswordAuthentication**.
  - Uncomment the line and change the value from **no** to **yes**.
   6.4 Find the line that begins with **Subsystem** and uncomment the line.

     ![Linux](./media/site-recovery-prepare-push-install-mob-svc-lin/mobility2.png)

7. Add the account you created in the CSPSConfigtool.

    - Log in to your Configuration Server.
    - Open **cspsconfigtool.exe**. (It's available as a shortcut on the desktop and under the %ProgramData%\home\svsystems\bin folder)
    - In the **Manage Accounts** tab, click **Add Account**.
    - Add the account you created. After adding the account, you need to provide the credentials when you enable replication for a machine.
