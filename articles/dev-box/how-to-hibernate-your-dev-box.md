---
title: Hibernate a dev box
titleSuffix: Microsoft Dev Box
description: Learn how to hibernate a dev box in Microsoft Dev Box. Use hibernation to shut down your VM, while preserving your active work.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 07/05/2023
ms.topic: how-to
#Customer intent: As a developer, I want to be able to hibernate my dev boxes so that I can resume work where I left off.
---

# Hibernate a dev box in Microsoft Dev Box

In this article, you learn how to hibernate and resume a dev box in Microsoft Dev Box. 

Hibernation is a power-saving state that saves your running applications to your hard disk and then shuts down the virtual machine (VM). When you resume the VM, all your previous work is restored. 

You can hibernate your dev box through the Microsoft Dev Box developer portal or the CLI. You can't hibernate your dev box from within the virtual machine.

> [!IMPORTANT]
> Dev Box Hibernation is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Hibernate your dev box using the developer portal 

To hibernate your dev box through the Microsoft Dev Box developer portal: 

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).
 
1. On the dev box you want to hibernate, on the more options menu, select **Hibernate**. 
 
Dev boxes that support hibernation show the **Hibernate** option. Dev boxes that only support shutdown show the **Shutdown** option.

## Resume your dev box using the developer portal 

To resume your dev box through the Microsoft Dev Box developer portal: 

1. Sign in to the [developer portal](https://aka.ms/devbox-portal).
 
1. On the dev box you want to resume, on the more options menu, select **Resume**. 

In addition, you can also double select on your dev box  in the list of VMs you see in the "Remote Desktop" app. Your dev box automatically starts up and resumes from a hibernating state. 

## Hibernate your dev box using the Azure CLI

To hibernate your dev box by using the Azure CLI:

```azurecli-interactive
az devcenter dev dev-box stop --name <YourDevBoxName> --dev-center-name <YourDevCenterName> --project-name <YourProjectName> --user-id "me" --hibernate true
```

To learn more about managing your dev box from the CLI, see: [devcenter reference](/cli/azure/devcenter/dev/dev-box?view=azure-cli-latest&preserve-view=true). 

## Troubleshooting

**My dev box doesn't resume from hibernated state. Attempts to connect to it fail and I receive an error from the RDP app.** 

If your machine is unresponsive, it might have stalled either while going into hibernation or resuming from hibernation, you can manually reboot your dev box. 

To shut down your dev box, either 

- Developer portal - Go to the [developer portal](https://aka.ms/devbox-portal), select your DevBox, and on the more options menu, select **Shut down**. 
- CLI - `az devcenter dev dev-box stop --name <YourDevBoxName> --dev-center-name <YourDevCenterName> --project-name <YourProjectName> --user-id "me" --hibernate false`

**When my dev box resumes from a hibernated state, all my open windows were gone.** 

Dev Box Hibernation is a preview feature, and you might run into reliability issues. Enable AutoSave on your applications to minimize the effects of session loss. 

**I changed some settings on one of my dev boxes and it no longer hibernates. My other dev boxes hibernate without issues. What could be the problem?**

Some settings aren't compatible with hibernation and prevent your dev box from hibernating. To learn about these settings, see: [Settings not compatible with hibernation](how-to-configure-dev-box-hibernation.md#settings-not-compatible-with-hibernation). 

 ## Related content

- [Manage a dev box by using the developer portal](how-to-create-dev-boxes-developer-portal.md)
- [How to configure Dev Box Hibernation (preview)](how-to-configure-dev-box-hibernation.md)