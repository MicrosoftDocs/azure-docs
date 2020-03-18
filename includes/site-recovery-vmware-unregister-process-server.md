---
author: Rajeswari-Mamilla
ms.service: site-recovery
ms.topic: include
ms.date: 04/28/2019
ms.author: ramamill
---

Follow the steps for your specific circumstances.

### Unregister a connected process server

1. Establish a remote connection to the process server as an Administrator.
2. In the **Control Panel**, open **Programs > Uninstall a program**.
3. Uninstall the program **Microsoft Azure Site Recovery Mobility Service/Master Target Server**.
4. Uninstall the program **Microsoft Azure Site Recovery Configuration/Process Server**.
5. After the programs in steps 3 and 4 are uninstalled, uninstall **Microsoft Azure Site Recovery Configuration/Process Server Dependencies**.

### Unregister a disconnected process server

Only use these steps if there's no way to revive the machine on which the process server is installed.

1. Sign in the configuration server as an Administrator.
2. Open an Administrative command prompt, and browse to `%ProgramData%\ASR\home\svsystems\bin`.
3. Run this command to get a list of one or more process servers.

    ```
    perl Unregister-ASRComponent.pl -IPAddress <IP_of_Process_Server> -Component PS
    ```
    - S. No: the process server serial number.
    - IP/Name: The IP address and name of the machine running the process server.
    - Heartbeat: Last heartbeat from the process server machine.
    ![Unregister-cmd](media/site-recovery-vmware-unregister-process-server/Unregister-cmd.PNG)

4. Specify the serial number of the process server you want to unregister.
5. Unregistering a process server remove all of its details from the system, and displays the message: **Successfully unregistered server-name> (server-IP-address)**

