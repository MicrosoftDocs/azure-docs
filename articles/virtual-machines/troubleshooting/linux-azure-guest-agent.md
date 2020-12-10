---
title: Troubleshooting Azure Linux Agent
description: Troubleshoot the Azure Linux Agent is not working issues
services: virtual-machines-linux
ms.service: virtual-machines-linux
author: axelg
manager: dcscontentpm
editor: 
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/17/2020
ms.author: axelg
---
# Troubleshoot Azure Linux Agent

[Azure Linux Agent](../extensions/agent-linux.md) enables the virtual machine (VM) to communicate with the Fabric Controller (the underlying physical server on which VM is hosted) on IP address 168.63.129.16. This IP address is a virtual public IP address that facilitates the communication. For more information, see [What is IP address 168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md).

## Check agent status and version

See https://github.com/Azure/WALinuxAgent/wiki/FAQ#what-does-goal-state-agent-mean-in-waagent---version-output.

## Troubleshoot VM agent with Not Ready status

1. Make sure Azure Linux Agent is running.
    The service name might be **walinuxagent** or **waagent**:

     ```
    root@nam-u18:/home/nam# service walinuxagent status
     ● walinuxagent.service - Azure Linux Agent
       Loaded: loaded (/lib/systemd/system/walinuxagent.service; enabled; vendor preset: enabled)
       Active: active (running) since Thu 2020-10-08 17:10:29 UTC; 3min 9s ago
     Main PID: 1036 (python3)
        Tasks: 4 (limit: 4915)
       CGroup: /system.slice/walinuxagent.service
           ├─1036 /usr/bin/python3 -u /usr/sbin/waagent -daemon
           └─1156 python3 -u bin/WALinuxAgent-2.2.51-py2.7.egg -run-exthandlers

    Oct 08 17:10:33 nam-u18 python3[1036]: 2020-10-08T17:10:33.129375Z INFO ExtHandler ExtHandler Started tracking cgroup: Microsoft.OSTCExtensions.VMAccessForLinux-1.5.10, path: /sys/fs/cgroup/memory/sys
    Oct 08 17:10:35 nam-u18 python3[1036]: 2020-10-08T17:10:35.189020Z INFO ExtHandler [Microsoft.CPlat.Core.RunCommandLinux-1.0.1] Target handler state: enabled [incarnation 2]
    Oct 08 17:10:35 nam-u18 python3[1036]: 2020-10-08T17:10:35.197932Z INFO ExtHandler [Microsoft.CPlat.Core.RunCommandLinux-1.0.1] [Enable] current handler state is: enabled
    Oct 08 17:10:35 nam-u18 python3[1036]: 2020-10-08T17:10:35.212316Z INFO ExtHandler [Microsoft.CPlat.Core.RunCommandLinux-1.0.1] Update settings file: 0.settings
    Oct 08 17:10:35 nam-u18 python3[1036]: 2020-10-08T17:10:35.224062Z INFO ExtHandler [Microsoft.CPlat.Core.RunCommandLinux-1.0.1] Enable extension [bin/run-command-shim enable]
    Oct 08 17:10:35 nam-u18 python3[1036]: 2020-10-08T17:10:35.236993Z INFO ExtHandler ExtHandler Started extension in unit 'Microsoft.CPlat.Core.RunCommandLinux_1.0.1_db014406-294a-49ed-b112-c7912a86ae9e
    Oct 08 17:10:35 nam-u18 python3[1036]: 2020-10-08T17:10:35.263572Z INFO ExtHandler ExtHandler Started tracking cgroup: Microsoft.CPlat.Core.RunCommandLinux-1.0.1, path: /sys/fs/cgroup/cpu,cpuacct/syst
    Oct 08 17:10:35 nam-u18 python3[1036]: 2020-10-08T17:10:35.280691Z INFO ExtHandler ExtHandler Started tracking cgroup: Microsoft.CPlat.Core.RunCommandLinux-1.0.1, path: /sys/fs/cgroup/memory/system.sl
    Oct 08 17:10:37 nam-u18 python3[1036]: 2020-10-08T17:10:37.349090Z INFO ExtHandler ExtHandler ProcessGoalState completed [incarnation 2; 4496 ms]
    Oct 08 17:10:37 nam-u18 python3[1036]: 2020-10-08T17:10:37.365590Z INFO ExtHandler ExtHandler [HEARTBEAT] Agent WALinuxAgent-2.2.51 is running as the goal state agent [DEBUG HeartbeatCounter: 1;Heartb
    root@nam-u18:/home/nam#
    ```

    If the service is running, restart the Azure Linux Agent. If the service is stopped, start them and wait a few minutes. Then check whether the **Agent status** is reporting as **Ready**.
    To further troubleshoot these issues, contact [Microsoft Support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

2. Check whether auto-update is enabled.
    Check this setting in /etc/waagent.conf:

    ```
    AutoUpdate.Enabled=y
    ```

    For more information on how to update the Azure Linux Agent, refer to https://docs.microsoft.com/azure/virtual-machines/extensions/update-linux-agent.

3. Check whether the VM can connect to the Fabric Controller.
    Use a tool such as curl to test whether the VM can connect to 168.63.129.16 on ports 80, 32526, and 443. If the VM doesn’t connect as expected, check whether outbound communication over ports 80, 443, and 32526 is open in your local firewall on the VM. If this IP address is blocked, VM Agent might display unexpected behavior in a variety of scenarios.

## Advanced troubleshooting

Events for troubleshooting Azure Linux Agent are recorded in the following log files:

- /var/log/waagent.log

### Unable to connect to WireServer IP (Host IP) 

Notice the following error entries in /var/log/waagent.log:

```
2020-10-02T18:11:13.148998Z WARNING ExtHandler ExtHandler An error occurred while retrieving the goal state:
```

**Analysis**

The VM cannot reach the WireServer IP on the host server.

**Solution**

1. Because the WireServer IP is not reachable, connect to the VM by using SSH, and then try to access the following URL from curl: http://168.63.129.16/?comp=versions.
1. Check for any issues that might be caused by a firewall, a proxy, or other source that could be blocking access to the IP address 168.63.129.16.
1. Check whether Linux IPTables or a third-party firewall is blocking access to ports 80, 443, and 32526. For more information about why this address should not be blocked,  see [What is IP address 168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md).


## Next steps

To further troubleshoot Azure Linux Agent issues, [contact Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).