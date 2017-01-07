### Prepare for automatic push on Windows machines

1. Ensure there’s network connectivity between the Windows machine and the process server.
2. Create an account that can be used by the process server to access the machine. The account should have administrator privileges (local or domain), and is only used for the push installation and agent updates.

   > [!NOTE]
   > If you're not using a domain account, you need to disable Remote User Access control on the local machine. To do this, in the register under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System add the DWORD entry LocalAccountTokenFilterPolicy with a value of 1. To add the registry entry from a CLI type **`REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1`**.
   >
   >
2. On the Windows Firewall of the machine you want to protect, select **Allow an app or feature through Firewall**. Enable **File and Printer Sharing** and **Windows Management Instrumentation**. For machines that belong to a domain, you can configure the firewall settings with a GPO.

   ![Firewall settings](./media/site-recovery-prepare-push-install-mob-svc-win/mobility1.png)
3. Add the account you created in the CSPSConfigtool.

   * Open **cspsconfigtool**. It's available as a shortcut on the desktop, and located in the %ProgramData%\home\svsystems\bin folder.
   * In the **Manage Accounts** tab, click **Add Account**.
   * Add the account you created. After adding the account, you need to provide the credentials when you enable replication for a machine.
