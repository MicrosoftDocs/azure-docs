---
author: sipastak
ms.author: sipastak
ms.topic: include
ms.date: 01/30/2024
---


1. Launch the [Azure Cloud Shell](/azure/cloud-shell/overview) in the Azure portal with the *PowerShell* terminal type, or run PowerShell on your local device.

    *  If you're using Cloud Shell, make sure your [Azure context is set to the subscription you want to use](/powershell/azure/context-persistence).

    * If you're using PowerShell locally, first [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps), then make sure your [Azure context is set to the subscription you want to use](/powershell/azure/context-persistence).

2. Run the following command in PowerShell to add or change a session host's friendly name:

   ```azurepowershell
   $parameters = @{
      HostPoolName = 'HostPoolName'
      Name = 'SessionHostName'
      ResourceGroupName = 'ResourceGroupName'
      FriendlyName = 'SessionHostFriendlyName'
   }

   Update-AzWvdSessionHost @parameters
   ```

3. To get the session host friendly name, run the following command in PowerShell:

   ```azurepowershell
   $sessionHostParams = @{
      HostPoolName = 'HostPoolName'
      Name = 'SessionHostName'
      ResourceGroupName = 'ResourceGroupName'
   }

   Get-AzWvdSessionHost @sessionHostParams | FL Name, AssignedUser, FriendlyName
   ```
