---
author: sipastak
ms.author: sipastak
ms.topic: include
ms.date: 01/30/2024
---

Run the following command in PowerShell to add or change a session host's friendly name:

```powershell
$parameters = @{
   HostPoolName = 'HostPoolName'
   Name = 'SessionHostName'
   ResourceGroupName = 'ResourceGroupName'
   FriendlyName = 'SessionHostFriendlyName'
}

Update-AzWvdSessionHost @parameters
```



### Get the session host friendly name

To get the session host friendly name, run the following command in PowerShell:

```powershell
$sessionHostParams = @{
  HostPoolName = 'HostPoolName'
  Name = 'SessionHostName'
  ResourceGroupName = 'ResourceGroupName'
}

Get-AzWvdSessionHost @sessionHostParams | FL Name, AssignedUser, FriendlyName
```

There isn't currently a way to get the session host friendly name in the Azure portal.