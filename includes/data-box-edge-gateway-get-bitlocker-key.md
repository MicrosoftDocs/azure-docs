---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 03/04/2019
ms.author: alkohli
---
If  your device goes into recovery mode, use the BitLocker key to boot up your device. This is only possible if you have used the `Get-DeviceSecretInfo` cmdlet to get the BitLocker key and copied it into a safe location before the problem occurs with your device.

The command used is:

`Get-DeviceSecretInfo -- user BitLockerRecoveryKey`

