---
title: Data at Rest Encryption in Azure Stack
description: Learn how to Azure Stack protects your data with encryption at rest
services: azure-stack
author: PatAltimore
manager: femila
ms.service: azure-stack
ms.topic: article
ms.date: 12/06/2018
ms.author: patricka
ms.reviewer: fiseraci
keywords:
---

# Data at rest encryption in Azure Stack

Azure Stack protects user and infrastructure data at the storage subsystem level using encryption at rest. Azure Stack's storage subsystem is encrypted using BitLocker with 128-bit AES encryption. BitLocker keys are persisted in an internal secret store. The store itself is encrypted and the keys are stored in a hardware Trusted Platform Modules (TPM) 2.0.

Beginning with the 1811 release, Azure Stack extends the protection of data at rest encryption to protect infrastructure data stored on local disks of each scale-unit node. Data at rest encryption is a common requirement for many of the major compliance standards (for example, PCI-DSS, FedRAMP, HIPAA). Azure Stack enables you to meet those requirements with no extra work or configurations required. For more information on how Azure Stack helps you meet compliance standards, see the [Microsoft Service Trust Portal](https://aka.ms/AzureStackCompliance).

> [!NOTE]
> Data at rest encryption protects your data against being accessed by someone who physically stole one or more hard drives. Data at rest encryption does not protect against data being intercepted over the network (data in transit), data currently being used (data in memory) or more in general, data being exfiltrated while the system is up and running.

## Retrieving BitLocker recovery keys

Azure Stack BitLocker keys for data at rest are internally managed. You are not required to provide them for regular operations or during system startup. However, support scenarios may require BitLocker recovery keys to bring the system online.  

> [!WARNING]
> Retrieve your BitLocker recovery keys and store them in a secure location outside of Azure Stack. The inavailability of the recovery keys during certain support scenarios migh result in data loss and require a system restore from a backup image.

Retrieving the BitLocker recovery keys requires access to the [privileged endpoint](azure-stack-privileged-endpoint.md) (PEP). From a PEP session, run the Get-AzsRecoveryKeys cmdlet.

```powershell
##This cmdlet retrieves the recovery keys for all the volumes that are encrypted with BitLocker.
Get-AzsRecoveryKeys
```

Optional parameters for *Get-AzsRecoveryKeys* cmdlet:

| Parameter | Description | Type | Required |
|---------|---------|---------|---------|
|*raw* | returns raw data of mapping between recovery key, computer name, and password id(s) of each encrypted volume  | switch | no (Designed for support scenarios)|


## Troubleshoot issues

In extreme circumstances, a BitLocker unlock request could fail resulting in a specific volume (either on a local disk or shared) to not boot. Depending on the availability of some of the components of the architecture, this failure could result in downtime and potential data loss if you don't have your BitLocker recovery keys.

> [!WARNING]
> Retrieve your BitLocker recovery keys and store them in a secure location outside of Azure Stack. The inavailability of the recovery keys during certain support scenarios migh result in data loss and require a system restore from a backup image.

If you suspect that your system is experiencing issues with BitLocker, such as Azure Stack failing to start, contact support. Support requires your BitLocker recovery keys. The majority of the BitLocker related issues can be resolved with a FRU operation for that specific VM/host/volume. For the other cases, a manual unlocking procedure using BitLocker recovery keys can be performed. If BitLocker recovery keys are not available, the only option is to restore from a backup image. Depending on when the last backup was performed, you may encounter data loss.

## Next steps

- [Learn more about Azure Stack security](azure-stack-security-foundations.md)
- For more information on how BitLocker protects CSVs, see [protecting cluster shared volumes and storage area networks with BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/protecting-cluster-shared-volumes-and-storage-area-networks-with-bitlocker).
