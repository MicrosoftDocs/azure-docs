---
title: Automate email resource management
titleSuffix: An Azure Communication Services Automation Sample
description: This article describes how to automate the creation of Communication Services and Email Communication Services. This article also describes how to manage custom domains, configure DNS records, and verify domains.
author: Deepika0530
manager: komivi.agbakpem
services: azure-communication-services

ms.author: v-deepikal
ms.date: 01/16/2025
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: email
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-ps-azclips-azclipython
---

# Automate email resource management

::: zone pivot="platform-powershell"
[!INCLUDE [Email Resource Managemnt with Azure PowerShell](./includes/email-resource-management-powershell.md)]
::: zone-end

::: zone pivot="platform-azclips"
[!INCLUDE [Email Resource Managemnt with Azure CLI PowerShell](./includes/email-resource-management-azurecli-powershell.md)]
::: zone-end

::: zone pivot="platform-azclipython"
[!INCLUDE [Email Resource Managemnt with Azure CLI Python](./includes/email-resource-management-azurecli-python.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. To delete your communication resource, run the following command.

```azurecli-interactive
az communication delete --name "ContosoAcsResource1" --resource-group "ContosoResourceProvider1"
```

If you want to clean up and remove an Email Communication Services, You can delete your Email Communication resource by running the following command:

```PowerShell
PS C:\> Remove-AzEmailService -Name ContosoEcsResource1 -ResourceGroupName ContosoResourceProvider1
```

If you want to clean up and remove a Domain resource, You can delete your Domain resource by running the following command:

```PowerShell
PS C:\> Remove-AzEmailServiceDomain -Name contoso.com -EmailServiceName ContosoEcsResource1 -ResourceGroupName ContosoResourceProvider1
```

[Deleting the resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md#delete-resource-groups) also deletes any other resources associated with it.

If you have any phone numbers assigned to your resource upon resource deletion, the phone numbers are automatically released from your resource at the same time.

> [!NOTE]
> Resource deletion is **permanent** and no data, including Event Grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.
