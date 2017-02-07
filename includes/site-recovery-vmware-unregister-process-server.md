The steps to unregister a process server differs depending on its connection status with the Configuration Server.

### Unregister a Process Server that is in a connected state

1. Remote into the Process Server as an Administrator.
2. Launch the **Control Panel** and open **Programs > Uninstall a program**
3. Uninstall a program by the name **Microsoft Azure Site Recovery Configuration/Process Server**
4. Once step 3 is completed, you can uninstall **Microsoft Azure Site Recovery Configuration/Process Server Dependencies**

### Unregister a Process Server that is in a disconnected state

> [!WARNING]
> Use the below steps should be used if there is no way to revive the virtual machine on which the Process Server was installed.

1. Log on to your Configuration Server as an Administrator.
2. Open an Administrative Command prompt and browse to the directory `%ProgramData%\ASR\home\svsystems\bin`
3. Now run the Command

    ```
    perl Unregister-ASRComponent.pl -IPAddress <IP_of_Process_Server> -Component PS
    ```
4. This will purge the details of the Process Server from the system.
