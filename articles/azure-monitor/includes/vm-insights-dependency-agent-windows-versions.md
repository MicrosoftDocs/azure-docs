---
author: KennedyDenMSFT
ms.author: guywild
ms.service: azure-monitor
ms.topic: include
ms.date: 02/27/2024
---

| Operating system | Azure Monitor agent | Log Analytics agent (legacy) | Diagnostics extension |
|:---|:---:|:---:|:---:|
| Windows Server 2022                                      | ✓ | ✓ |   |
| Windows Server 2022 Core                                 | ✓ |   |   |
| Windows Server 2019                                      | ✓ | ✓ | ✓ |
| Windows Server 2019 Core                                 | ✓ |   |   |
| Windows Server 2016                                      | ✓ | ✓ | ✓ |
| Windows Server 2016 Core                                 | ✓ |   | ✓ |
| Windows Server 2012 R2                                   | ✓ | ✓ | ✓ |
| Windows Server 2012                                      | ✓ | ✓ | ✓ |
| Windows 11 Client and Pro                                | ✓<sup>2</sup>, <sup>3</sup> |  |  |
| Windows 11 Enterprise<br>(including multi-session)       | ✓ |  |  |
| Windows 10 1803 (RS4) and higher                         | ✓<sup>2</sup> |  |  |
| Windows 10 Enterprise<br>(including multi-session) and Pro<br>(Server scenarios only)  | ✓ | ✓ | ✓ |
| Windows 8 Enterprise and Pro<br>(Server scenarios only)  |   | ✓<sup>1</sup> |   |
| Windows 7 SP1<br>(Server scenarios only)                 |   | ✓<sup>1</sup> |   |
| Azure Stack HCI                                          | ✓ | ✓ |   |
| Windows IoT Enterprise                                   | ✓ |   |   |

<sup>1</sup> Running the OS on server hardware that is always connected, always on.<br>
<sup>2</sup> Using the Azure Monitor agent [client installer](./azure-monitor-agent-windows-client.md).<br>
<sup>3</sup> Also supported on Arm64-based machines.
