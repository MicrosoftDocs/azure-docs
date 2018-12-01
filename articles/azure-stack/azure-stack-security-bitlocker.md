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

Azure Stack protects user and infrastructure data at the storage subsystem level using encryption. Azure Stack's storage subsystem is encrypted using BitLocker with 128 bit AES encryption. BitLocker keys are persisted in an internal secret store.

Beginning with the 1811 release, Azure Stack extends the protection of data at rest encryption to protect infrastructure data stored on local disks of each scale-unit node. For example, if someone gains physical access to one or more hard drives, the data on the hard drives is protected by BitLocker encryption. Data at rest encryption is a common requirement for many of the major compliance standards (for example, PCI-DSS, FedRAMP, HIPAA). Azure Stack enables you to meet those requirements with no extra work or configurations required. For more information on how Azure Stack helps you meet compliance standards, see the [Microsoft Service Trust Portal](https://aka.ms/AzureStackCompliance).

> [!NOTE]
> Data at rest encryption does not protect data in transit over a network or data in use in memory.

## Retrieving BitLocker recovery keys

Azure Stack BitLocker keys for data at rest are internally managed. You are not required to provide them for regular operation or during system startup. However, support scenarios may require BitLocker recovery keys to bring the system online.  

> [!WARNING]
> Retrieve your BitLocker recovery keys and store them in a safe location outside of Azure Stack. Without BitLocker recovery keys in a support scenario, data cannot be assessed resulting in a redeployment of the system.

Retrieving the BitLocker recovery keys requires access to the [privileged endpoint](azure-stack-privileged-endpoint.md) (PEP). From a PEP session, run the Get-AzsRecoveryKeys cmdlet.

```powershell
##This cmdlet retrieves the recovery keys for all the volumes that are encrypted with BitLocker.
Get-AzsRecoveryKeys
```

Optional parameters for *Get-AzsRecoveryKeys* cmdlet:

| Parameter | Description | Type | Required |
|---------|---------|---------|---------|
|*raw* | returns raw data of mapping between recovery key, computer name, and password id(s) of each encrypted volume  | switch | no (Designed for support scenarios)|

## Hardware protection for data at rest

Beginning with the 1811 release, the local disk volumes are protected by BitLocker. The local disk volume keys are stored in the hardware Trusted Platform Modules (TPM) 2.0 that are included with each Azure Stack configuration (all OEM partners in all geographies).
The majority of the infrastructure components and all user data is stored on cluster shared volumes (CSVs). However, a small subset of infrastructure components use local disks because they are required to start the CSVs. For example, Active Directory service is needed to start CSVs. Therefore, the Active Directory components use local disks. 
Since all CSVs store their keys in Active Directory, and Active Directory stores its key in a TPM, all user data as well as data from Azure Stack infrastructure is protected by a hardware security module (TPM).

## Troubleshoot issues

In extreme circumstances, a BitLocker unlock request could fail resulting in a specific volume (either on a local disk or shared) to not boot. Depending on the availability of some of the components of the architecture, this failure could result in downtime and potential data loss if you don't have your BitLocker recovery keys.

> [!WARNING]
> Retrieve your BitLocker recovery keys and store them in a safe location outside of Azure Stack. Without BitLocker recovery keys in a support scenario, data cannot be assessed resulting in a redeployment of the system.

If you suspect that your system is experiencing issues with BitLocker such as Azure Stack failing to start, contact support. Support requires your BitLocker recovery keys. The majority of the BitLocker related issues can be resolved with a FRU operation for that specific VM/host/volume. For the more complicated cases such as all domain controllers are unavailable, a manual unlocking procedure using BitLocker recovery keys can be performed. If BitLocker recovery keys are not available, the only option is to restore from a backup image. Depending on when the last backup was performed, you may encounter data loss.

## Next steps

- [Learn more about Azure Stack security](azure-stack-security-foundations.md)
- For more information on how BitLocker protects CSVs, see [protecting cluster shared volumes and storage area networks with BitLocker](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/protecting-cluster-shared-volumes-and-storage-area-networks-with-bitlocker).