---
title: Configure a host pool as a validation environment - Azure
description: How to configure a host pool as a validation environment to test service updates before they roll out to production.
author: Heidilohr
ms.topic: how-to
ms.date: 03/01/2023
ms.author: helohr 
ms.custom: devx-track-azurecli
---
# Configure a host pool as a validation environment

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/create-validation-host-pool-2019.md).

Host pools are a collection of one or more identical virtual machines within Azure Virtual Desktop environment. We highly recommend you create a validation host pool where service updates are applied first. Validation host pools let you monitor service updates before the service applies them to your standard or non-validation environment. Without a validation host pool, you may not discover changes that introduce errors, which could result in downtime for users in your standard environment.

To ensure your apps work with the latest updates, the validation host pool should be as similar to host pools in your non-validation environment as possible. Users should connect as frequently to the validation host pool as they do to the standard host pool. If you have automated testing on your host pool, you should include automated testing on the validation host pool.

You can debug issues in the validation host pool with either [the diagnostics feature](./troubleshoot-set-up-overview.md) or the [Azure Virtual Desktop troubleshooting articles](troubleshoot-set-up-overview.md).

>[!NOTE]
> We recommend that you leave the validation host pool in place to test all future updates. Validation host pools should only be used for testing, and not in production environments.

## Create your host pool

You can configure any existing pooled or personal host pool to be a validation host pool. You can also create a new host pool to use for validation by following the instructions in any of these articles:
- [Tutorial: Create a host pool with Azure Marketplace or the Azure CLI](create-host-pools-azure-marketplace.md)
- [Create a host pool with PowerShell or the Azure CLI](create-host-pools-powershell.md)

## Define your host pool as a validation environment

### [Portal](#tab/azure-portal)

To use the Azure portal to configure your validation host pool:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for and select **Azure Virtual Desktop**.
3. In the Azure Virtual Desktop page, select **Host pools**.
4. Select the name of the host pool you want to edit.
5. Select **Properties**.
6. In the validation environment field, select **Yes** to enable the validation environment.
7. Select **Save** to apply the new settings.

### [Azure PowerShell](#tab/azure-powershell)

If you haven't already done so, follow the instructions in [Set up the Azure Virtual Desktop PowerShell module](powershell-module.md) to set up your PowerShell module and sign in to Azure.

Run the following PowerShell cmdlets to define the new host pool as a validation host pool. Replace the values in brackets with the values relevant to your session:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -ValidationEnvironment:$true
```

Run the following PowerShell cmdlet to confirm that the validation property has been set. Replace the values in brackets with the values relevant to your session.

```powershell
Get-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> | Format-List
```

The results from the cmdlet should look similar to this output:

```powershell
    HostPoolName        : hostpoolname
    FriendlyName        :
    Description         :
    Persistent          : False
    CustomRdpProperty   : use multimon:i:0;
    MaxSessionLimit     : 10
    LoadBalancerType    : BreadthFirst
    ValidationEnvironment : True
```

### [Azure CLI](#tab/azure-cli)

If you haven't already done so, prepare your environment for the Azure CLI and sign in.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

To define the new host pool as a validation host pool, use the [az desktopvirtualization hostpool update](/cli/azure/desktopvirtualization#az-desktopvirtualization-hostpool-update) command:

```azurecli
az desktopvirtualization hostpool update --name "MyHostPool" \
    --resource-group "MyResourceGroup" \
    --validation-environment true
```

Use the following command to confirm that the validation property has been set.

```azurecli
az desktopvirtualization hostpool show --name "MyHostPool" \
    --resource-group "MyResourceGroup" 
```
---

## Update schedule

Service updates happen monthly. If there are major issues, critical updates will be provided at a more frequent pace.

If there are any service updates, make sure you have at least a couple of users sign in each day to validate the environment. We recommend you regularly visit our [TechCommunity site](https://techcommunity.microsoft.com/t5/forums/searchpage/tab/message?filter=location&q=wvdupdate&location=forum-board:WindowsVirtualDesktop&sort_by=-topicPostDate&collapse_discussion=true) and follow any posts with WVDUPdate or AVDUpdate to stay informed about service updates.

## Next steps

Now that you've created a validation host pool, you can learn how to use Azure Service Health to monitor your Azure Virtual Desktop deployment.

> [!div class="nextstepaction"]
> [Set up service alerts](./set-up-service-alerts.md)
