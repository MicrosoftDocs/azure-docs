---
author: Rajeswari-Mamilla
ms.service: site-recovery
ms.topic: include
ms.date: 08/06/2018
ms.author: ramamill
---
The steps to unregister a process server differs depending on its connection status with the Configuration Server.

### Unregister a process server that is in a connected state

1. Remote into the process server as an Administrator.
2. Launch the **Control Panel** and open **Programs > Uninstall a program**
3. Uninstall a program by the name **Microsoft Azure Site Recovery Configuration/Process Server**
4. Once step 3 is completed, you can uninstall **Microsoft Azure Site Recovery Configuration/Process Server Dependencies**

### Unregister a process server that is in a disconnected state

> [!WARNING]
> Use the below steps should be used if there is no way to revive the virtual machine on which the Process Server was installed.

1. Sign in to your configuration server as an Administrator.
2. Open an Administrative command prompt and browse to the directory `%ProgramData%\ASR\home\svsystems\bin`.
3. Now run the command.

    ```
    perl Unregister-ASRComponent.pl -IPAddress <IP_of_Process_Server> -Component PS
    ```
4. The above command will provide the list of process server(s) (can be more than one, in case of duplicate entries) with serial number(S.No), IP address (IP), name of the VM on which process server is deployed (Name), Heart beat of the VM (Heartbeat) as shown below.
    ![Unregister-cmd](media/site-recovery-vmware-unregister-process-server/Unregister-cmd.PNG)
5. Now, enter the serial number of the process server you wish to un-register.
6. This will purge the details of the process server from the system and will display the message: **Successfully unregistered server-name> (server-IP-address)**

