---
title: Application management CLI commands - Microsoft Defender for IoT
description: Learn about the CLI commands available for managing the Defender for IoT on-premises applications.
ms.date: 09/07/2022
ms.topic: reference
---

# Application Management CLI Reference (OT Sensor)

## Check service status

Ensure that all application components, including the web console and traffic analysis, are working correctly.

|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `system sanity`      |   `no attributes`      |
|**cyberx**     |   `cyberx-xsense-sanity`      |   `no attributes`      |
|**cyberx_host**     |   n/a      |   n/a      |


For example, for the **support** user:
```bash
root@xsense: system sanity
[+] C-Cabra Engine | Running for 17:26:30.191945
[+] Cache Layer | Running for 17:26:32.352745
[+] Core API | Running for 17:26:28
[+] Health Monitor | Running for 17:26:28
[+] Horizon Agent 1 | Running for 17:26:27
[+] Horizon Parser | Running for 17:26:30.183145
[+] Network Processor | Running for 17:26:27
[+] Persistence Layer | Running for 17:26:33.577045
[+] Profiling Service | Running for 17:26:34.105745
[+] Traffic Monitor | Running for 17:26:30.345145
[+] Upload Manager Service | Running for 17:26:31.514645
[+] Watch Dog | Running for 17:26:30
[+] Web Apps | Running for 17:26:30

System is UP! (medium)
```


## Check software version
Provides information on the version of the software installed

|User  |Command  |Full command syntax <!--remove this column if no attributes-->  |
|---------|---------|---------|
|**support**     |   `system version`      |   `no attributes`      |
|**cyberx**     |   `cyberx-xsense-version`      |   `no attributes`      |
|**cyberx_host**     |   n/a      |   n/a      |


For example, for the **support** user:
```bash
root@xsense: system version
Version: 22.2.5.9-r-2121448
```


## Reboot appliance

## Shut down appliance

## Back up appliance data

## Restore appliance data

## Map network interfaces

## Next steps


For more information, see:

- [Appliance management commands](cli-appliance.md)
- [Configuration commands](cli-configuration.md)
- [On-premises management console commands](cli-management.md)
