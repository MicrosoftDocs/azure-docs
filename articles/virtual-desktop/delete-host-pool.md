---
title: Delete Azure Virtual Desktop host pool - Azure
description: How to delete a host pool in Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 07/23/2021
ms.author: helohr 
manager: femila
---

# Delete a host pool

All host pools created in Azure Virtual Desktop are attached to session hosts and application groups. To delete a host pool, you need to delete its associated application groups and session hosts. Deleting an application group is fairly simple, but deleting a session host is more complicated. When you delete a session host, you need to make sure it doesn't have any active user sessions. All user sessions on the session host should be logged off to prevent users from losing data.

### [Portal](#tab/azure-portal)

To delete a host pool in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Search for and select **Azure Virtual Desktop**.

3. Select **Host pools** in the menu on the left side of the page, then select the name of the host pool you want to delete.

4. On the menu on the left side of the page, select **Application groups**.

5. Select all application groups in the host pool you're going to delete, then select **Remove**.

6. Once you've removed the application groups, go to the menu on the left side of the page and select **Overview**.

7. Select **Remove**.

8. If there are session hosts in the host pool you're deleting, you'll see a message asking for your permission to continue. Select **Yes**.

9. The Azure portal will now remove all session hosts and delete the host pool. The VMs related to the session host won't be deleted and will remain in your subscription.

### [Azure PowerShell](#tab/azure-powershell)

To delete a host pool using PowerShell, you first need to delete all application groups in the host pool. To delete all application groups, run the following PowerShell cmdlet:

```powershell
Remove-AzWvdApplicationGroup -Name <appgroupname> -ResourceGroupName <resourcegroupname>
```

Next, run this cmdlet to delete the host pool:

```powershell
Remove-AzWvdHostPool -Name <hostpoolname> -ResourceGroupName <resourcegroupname> -Force:$true
```

This cmdlet removes all existing user sessions on the host pool's session host. It also unregisters the session host from the host pool. Any related virtual machines (VMs) will still exist within your subscription.

### [Azure CLI](#tab/azure-cli)

To delete a host pool using the Azure CLI, you first need to delete all application groups in the host pool. 

To delete all application groups, use the [az desktopvirtualization applicationgroup delete](/cli/azure/desktopvirtualization/applicationgroup#az-desktopvirtualization-applicationgroup-delete) command:

```azurecli
az desktopvirtualization applicationgroup delete --name "MyApplicationGroup" --resource-group "MyResourceGroup"
```

Next, delete the host pool using the [az desktopvirtualization hostpool delete](/cli/azure/desktopvirtualization/hostpool#az-desktopvirtualization-hostpool-delete) command:

```azurecli
az desktopvirtualization hostpool delete --force true --name "MyHostPool" --resource-group "MyResourceGroup"
```

This deletion removes all existing user sessions on the host pool's session host. It also unregisters the session host from the host pool. Any related virtual machines (VMs) will still exist within your subscription.

---

## Next steps

To learn how to create a host pool, check out these articles:

- [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md)
- [Create a host pool with PowerShell](create-host-pools-powershell.md)

To learn how to configure host pool settings, check out these articles:

- [Customize Remote Desktop Protocol properties for a host pool](customize-rdp-properties.md)
- [Configure the Azure Virtual Desktop load-balancing method](configure-host-pool-load-balancing.md)
- [Configure the personal desktop host pool assignment type](configure-host-pool-personal-desktop-assignment-type.md)
