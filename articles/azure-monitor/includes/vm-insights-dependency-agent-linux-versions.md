---
author: KennedyDenMSFT
ms.author: guywild
ms.service: azure-monitor
ms.custom: linux-related-content
ms.topic: include
ms.date: 02/27/2024
---

>[!NOTE]
> With Dependency agent 9.10.15 and above, installation is not blocked for unsupported kernel versions, but the agent will run in degraded mode. In this mode, connection and port data stored in VMConnection and VMBoundport tables is not collected. The VMProcess table may have some data, but it will be minimal.

| Distribution | OS version | Kernel version |
|:---|:---|:---|
| Red Hat Linux 8    | 8.6     | 4.18.0-372.\*el8.x86_64, 4.18.0-372.*el8_6.x86_64 |
|                    | 8.5     | 4.18.0-348.\*el8_5.x86_644.18.0-348.\*el8.x86_64 |
|                    | 8.4     | 4.18.0-305.\*el8.x86_64, 4.18.0-305.\*el8_4.x86_64 |
|                    | 8.3     | 4.18.0-240.\*el8_3.x86_64 |
|                    | 8.2     | 4.18.0-193.\*el8_2.x86_64 |
|                    | 8.1     | 4.18.0-147.\*el8_1.x86_64 |
|                    | 8.0     | 4.18.0-80.\*el8.x86_64<br>4.18.0-80.\*el8_0.x86_64 |
| Red Hat Linux 7    | 7.9     | 3.10.0-1160 |
|                    | 7.8     | 3.10.0-1136 |
|                    | 7.7     | 3.10.0-1062 |
|                    | 7.6     | 3.10.0-957  |
|                    | 7.5     | 3.10.0-862  |
|                    | 7.4     | 3.10.0-693  |
| Red Hat Linux 6    | 6.10    | 2.6.32-754 |
|                    | 6.9     | 2.6.32-696  |
| CentOS Linux 8     | 8.6     | 4.18.0-372.\*el8.x86_64, 4.18.0-372.*el8_6.x86_64 |
|                    | 8.5     | 4.18.0-348.\*el8_5.x86_644.18.0-348.\*el8.x86_64  |
|                    | 8.4     | 4.18.0-305.\*el8.x86_64, 4.18.0-305.\*el8_4.x86_64 |
|                    | 8.3     | 4.18.0-240.\*el8_3.x86_64 |
|                    | 8.2     | 4.18.0-193.\*el8_2.x86_64 |
|                    | 8.1     | 4.18.0-147.\*el8_1.x86_64 |
|                    | 8.0     | 4.18.0-80.\*el8.x86_64<br>4.18.0-80.\*el8_0.x86_64 |
| CentOS Linux 7     | 7.9     | 3.10.0-1160 |
|                    | 7.8     | 3.10.0-1136 |
|                    | 7.7     | 3.10.0-1062 |
| CentOS Linux 6     | 6.10    | 2.6.32-754.3.5<br>2.6.32-696.30.1 |
|                    | 6.9     | 2.6.32-696.30.1<br>2.6.32-696.18.7 |
| Ubuntu Server      | 20.04   | 5.8<br>5.4\* |
|                    | 18.04   | 5.3.0-1020<br>5.0 (includes Azure-tuned kernel)<br>4.18*<br>4.15* |
|                    | 16.04.3 | 4.15.\* |
|                    | 16.04   | 4.13.\*<br>4.11.\*<br>4.10.\*<br>4.8.\*<br>4.4.\* |
|                    | 14.04   | 3.13.\*-generic<br>4.4.\*-generic|
| SUSE Linux 12 Enterprise Server | 12 SP5     | 4.12.14-122.\*-default, 4.12.14-16.\*-azure|
|                                 | 12 SP4 | 4.12.\* (includes Azure-tuned kernel) |
|                                 | 12 SP3 | 4.4.\* |
|                                 | 12 SP2 | 4.4.\* |
| SUSE Linux 15 Enterprise Server | 15 SP1 | 4.12.14-197.\*-default, 4.12.14-8.\*-azure |
|                                 | 15     | 4.12.14-150.\*-default |
| Debian                          | 9      | 4.9  | 

>[!NOTE]
> Dependency agent is not supported for Azure Virtual Machines with Ampere Altra ARM–based processors.
