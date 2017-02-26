1. Connect to the Process Server virtual machine using Remote Desktop Connection.
2. You can launch the cspsconfigtool.exe by clicking on the shortcut available on the desktop. (The tool will be automatically launched if this the first time you are logging into the process sever).
  * Configuration Server's fully qualified name (FQDN) or IP Address
  * Port on which the Configuration server is listening on. The value should be 443
  * Connection Passphrase to connect to the configuration server.
  * Data Transfer port to be configured for this Process Server. Leave the default value as is unless you have changed it to a different port number in your environment.

    ![Register Process Server](./media/site-recovery-vmware-register-process-server/register-ps.png)
3. Click the save button to save the configuration.
4. Once the registration is completed, the Process Server starts showing up under your Configuration server and now can be used for failback.

> [!TIP]
> The Process Server configuration utility can be launched by double-clicking the **cspsconfigtool** shortcut available on the desktop of the virtual machine.
