---
title: include file
description: file
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: include
author: mingshen-ms
ms.author: krsh
ms.date: 04/16/2021
---

## Generalize the image

All images in the Azure Marketplace must be reusable in a generic fashion. To achieve this, the operating system VHD must be generalized, an operation that removes all instance-specific identifiers and software drivers from a VM.

### For Windows

Windows OS disks are generalized with the [sysprep](/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview) tool. If you later update or reconfigure the OS, you must run sysprep again.

> [!WARNING]
> After you run sysprep, turn the VM off until it's deployed because updates may run automatically. This shutdown will avoid subsequent updates from making instance-specific changes to the operating system or installed services. For more information about running sysprep, see [Generalize a Windows VM](../../virtual-machines/generalize.md#windows).

### For Linux

1. Remove the Azure Linux agent.
    1. Connect to your Linux VM using an SSH client.
    2. In the SSH window, enter this command: `sudo waagent –deprovision+user`.
    3. Type Y to continue (you can add the -force parameter to the previous command to avoid the confirmation step).
    4. After the command completes, enter **Exit** to close the SSH client.
2. Stop virtual machine.
    1. In the Azure portal, select your resource group (RG) and de-allocate the VM.
    2. Your VM is now generalized and you can create a new VM using this VM disk.

### Capture image

> [!NOTE]
> The Azure subscription containing the SIG must be under the same tenant as the publisher account in order to publish. Also, the publisher account must have at least Contributor access to the subscription containing SIG.

Once your VM is ready, you can capture it in a Azure shared image gallery. Follow the below steps to capture:

1. On [Azure portal](https://ms.portal.azure.com/), go to your Virtual Machine’s page.
2. Select **Capture**.
3. Under **Share image to Shared image gallery**, select **Yes, share it to a gallery as an image version**.
4. Under **Operating system state** select Generalized.
5. Select a Target image gallery or **Create New**.
6. Select a Target image definition or **Create New**.
7. Provide a **Version number** for the image.
8. Select **Review + create** to review your choices.
9. Once the validation is passed, select **Create**.

## Set the right permissions

If your Partner Center account is the owner of the subscription hosting Shared Image Gallery, nothing further is needed for permissions.

If you only have read access to the subscription, use one of the following two options.

### Option one – Ask the owner to grant owner permission

Steps for the owner to grant owner permission:

1. Go to the Shared Image Gallery (SIG).
2. Select **Access control** (IAM) on the left panel.
3. Select **Add**, then **Add role assignment**.<br>
    :::image type="content" source="../media/create-vm/add-role-assignment.png" alt-text="The add role assignment window is shown.":::
1. For **Role**, select **Owner**.
1. For **Assign access to**, select **User, group, or service principal**.
1. For **Select**, enter the Azure email of the person who will publish the image.
1. Select **Save**.

### Option Two – Run a command

Ask the owner to run either one of these commands (in either case, use the SusbscriptionId of the subscription where you created the Shared image gallery).

```azurecli
az login
az provider register --namespace Microsoft.PartnerCenterIngestion --subscription {subscriptionId}
```
 
```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionId {subscriptionId}
Register-AzResourceProvider -ProviderNamespace Microsoft.PartnerCenterIngestion
```

> [!NOTE]
> You don’t need to generate SAS URIs as you can now publish a SIG Image on Partner Center. However, if you still need to refer to the SAS URI generation steps, see [How to generate a SAS URI for a VM image](../azure-vm-get-sas-uri.md).
