### Prepare for push install on Windows machines

1. Ensure there’s network connectivity between the Windows machine and the process server.
2. Create an account that can be used by the process server to access the machine. The account should have administrator privileges (local or domain), and is only used for the push installation and agent updates.

   > [!NOTE]
   > If you're not using a domain account, you need to disable Remote User Access control on the local machine. You cdisable Remote User Access control on a computer by adding a new DWORD **LocalAccountTokenFilterPolicy** under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System registry key, and set its value as 1. Here is the command to do the same from a command prompt **`REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1`**.
   >
   >
2. On the Windows Firewall of the machine you want to protect, select **Allow an app or feature through Firewall**. Enable **File and Printer Sharing** and **Windows Management Instrumentation**. For machines that belong to a domain, you can configure the firewall settings with a GPO.

   ![Firewall settings](./media/site-recovery-prepare-push-install-mob-svc-win/mobility1.png)

3. Add the account you created in the CSPSConfigtool.
    - Log in to your Configuration Server.
    - Open **cspsconfigtool.exe**. (It's available as a shortcut on the desktop and under the %ProgramData%\home\svsystems\bin folder)
    - In the **Manage Accounts** tab, click **Add Account**.
    - Add the account you created. After adding the account, you need to provide the credentials when you enable replication for a machine.
