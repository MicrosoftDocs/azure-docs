The steps to unregister a process server differs depending on its connection status with the Configuration Server.

### Unregister a Process Server that is in a connected state

1. Remote into the Process Server as a Administrator.
2. Launch the **Control Panel** and open **Programs > Uninstall a program**
3. Uninstall a program by the name **Microsoft Azure Site Recovery Configuration/Process Server**
4. Once step 3 is completed, you can uninstall **Microsoft Azure Site Recovery Configuration/Process Server Dependencies**

Once the uninstallation is complete the Process Server should be unregistered from your configuration server.

### Unregister a Process Server that is in a disconnected state

> [!WARNING]
> Use the below steps as the last resort and you have no way to revive the virtual machine on which the Process Server was installed.

1. Logon to your Configuration Server as an Administrator.
2. Open a Administrative Command prompt and browse to the directory `%ProgramData%\ASR\home\svsystems\bin`
3. Now run the Command
```
perl Unregister-ASRComponent.pl -IPAddress <IP_of_Process_Server> -Component PS
```
4. This will purge the details of the Process Server from the system.
