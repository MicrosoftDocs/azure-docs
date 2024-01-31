---
author: sipastak
ms.author: sipastak
ms.topic: include
ms.date: 01/30/2024
---

Run the following command in PowerShell to give your session host a friendly name:

```powershell
$parameters = @{
   HostPoolName = <HostPoolName>
   Name = <SessionHostName>
   ResourceGroupName = <ResourceGroupName>
   FriendlyName = <SessionHostFriendlyName>
}

Update-AzWvdSessionHost @parameters
```