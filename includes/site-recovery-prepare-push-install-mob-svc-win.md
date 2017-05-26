### Prepare for a push installation on a Windows computer

1. Ensure that there’s network connectivity between the Windows computer and the process server.
2. Create an account that the process server can use to access the computer. The account should have administrator rights (local or domain). (Use this account only for the push installation and for agent updates.)

   > [!NOTE]
   > If you're not using a domain account, disable Remote User Access control on the local computer. To disable Remote User Access control, under the HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System registry key, add a new DWORD: **LocalAccountTokenFilterPolicy**. Set the value to **1**. To do this at a command prompt, run the following command:  
   `REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1`
   >
   >
2. In Windows Firewall on the computer you want to protect, select **Allow an app or feature through Firewall**. Enable **File and Printer Sharing** and **Windows Management Instrumentation (WMI)**. For computers that belong to a domain, you can configure the firewall settings by using a Group Policy object (GPO).

   ![Firewall settings](./media/site-recovery-prepare-push-install-mob-svc-win/mobility1.png)

3. Add the account that you created in CSPSConfigtool.
    1.  Sign in to your configuration server.
    2.  Open **cspsconfigtool.exe**. (It's available as a shortcut on the desktop and in the %ProgramData%\home\svsystems\bin folder.)
    3.  On the **Manage Accounts** tab, select **Add Account**.
    4.  Add the account you created.
    5.  Enter the credentials you use when you enable replication for a computer.
