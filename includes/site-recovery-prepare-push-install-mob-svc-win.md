### Prepare for a push installation on a Windows computer

1. Ensure that there's network connectivity between the Windows computer and the process server.
1. Create an account that the process server can use to access the computer. The account should have administrator rights, either local or domain. Use this account only for the push installation and for agent updates.

   > [!NOTE]
   > If you don't use a domain account, disable Remote User Access control on the local computer. To disable Remote User Access control, under  HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System registry key, add a new DWORD: **LocalAccountTokenFilterPolicy**. Set the value to **1**. To do this task at a command prompt, run the following command:  
   `REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1`
   >
   >
1. In Windows Firewall on the computer you want to protect, select **Allow an app or feature through Firewall**. Enable **File and Printer Sharing** and **Windows Management Instrumentation (WMI)**. For computers that belong to a domain, you can configure the firewall settings by using a Group Policy object (GPO).

   ![Firewall settings](./media/site-recovery-prepare-push-install-mob-svc-win/mobility1.png)

1. Add the account that you created in CSPSConfigtool. Follow these steps:

    a. Sign in to your configuration server.

    b. Open **cspsconfigtool.exe**. It's available as a shortcut on the desktop and in the %ProgramData%\home\svsystems\bin folder.

    c. On the **Manage Accounts** tab, select **Add Account**.

    d. Add the account you created.

    e. Enter the credentials you use when you enable replication for a computer.
