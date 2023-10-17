---
title: Troubleshoot registered, hybrid, and Microsoft Entra joined Windows machines
description: This article helps you troubleshoot Microsoft Entra hybrid joined Windows 10 and Windows 11 devices

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 08/29/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: jogro
---
# Troubleshooting Windows devices in Microsoft Entra ID

If you have a Windows 11 or Windows 10 device that isn't working with Microsoft Entra ID correctly, start your troubleshooting here.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Reader](../roles/permissions-reference.md#global-reader).
1. Browse to **Identity** > **Devices** > **All devices** > **Diagnose and solve problems**.
1. Select **Troubleshoot** under the **Windows 10+ related issue** troubleshooter.
   :::image type="content" source="media/troubleshoot-device-windows-joined/devices-troubleshoot-windows.png" alt-text="A screenshot showing the Windows troubleshooter located in the diagnose and solve pane." lightbox="media/troubleshoot-device-windows-joined/devices-troubleshoot-windows.png":::
1. Select **instructions** and follow the steps to download, run, and collect the required logs for the troubleshooter to analyze.
1. Return to the Microsoft Entra admin center when you've collected and zipped the `authlogs` folder and contents.
1. Select **Browse** and choose the zip file you wish to upload.
   :::image type="content" source="media/troubleshoot-device-windows-joined/devices-troubleshoot-windows-upload.png" alt-text="A screenshot showing how to browse to select the logs gathered in the previous step to allow the troubleshooter to make recommendations." lightbox="media/troubleshoot-device-windows-joined/devices-troubleshoot-windows-upload.png":::

The troubleshooter will review the contents of the file you uploaded and provide suggested next steps. These next steps may include links to documentation or contacting support for further assistance.

## Next steps

- [Troubleshoot devices by using the dsregcmd command](troubleshoot-device-dsregcmd.md)
- [Troubleshoot Microsoft Entra hybrid joined devices](troubleshoot-hybrid-join-windows-current.md)
- [Troubleshooting Microsoft Entra hybrid joined down-level devices](troubleshoot-hybrid-join-windows-legacy.md)
- [Troubleshoot pending device state](/troubleshoot/azure/active-directory/pending-devices)
- [MDM enrollment of Windows 10-based devices](/windows/client-management/mdm/mdm-enrollment-of-windows-devices)
- [Troubleshooting Windows device enrollment errors in Intune](/troubleshoot/mem/intune/troubleshoot-windows-enrollment-errors)
