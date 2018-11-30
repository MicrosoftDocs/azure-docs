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

Azure Stack protects user and infrastructure data stored in its storage subsystem encryption. All the cluster shared volumes (CSVs) are encrypted with BitLocker and their keys are persisted in an internal secret store. For more information on how BitLocker protects CSVs, see [protecting cluster shared volumes and storage area networks with BitLocker](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/protecting-cluster-shared-volumes-and-storage-area-networks-with-bitlocker).

In Azure Stack, BitLocker uses Advanced Encryption Standard (AES) as its encryption algorithm, with key length of 128 bits.

Beginning with the 1811 release update, Azure Stack extends the protection of data at rest encryption to include all the infrastructure data stored on local disks. By encrypting local disk data, all infrastructure and users data is protected on your Azure Stack.

It is important to clarify that by design, data at rest encryption protects your data against being accessed by someone that physically stole one or more hard drives. Data at rest encryption does not protect against data being intercepted on the wire (data in transit), data currently being used (data in memory) or more in general, data being exfiltrated while the system is up and running.

Data at rest encryption is a common requirement for many of the major compliance standards (e.g. PCI-DSS, FedRAMP, HIPAA). With its configuration, Azure Stack enables you to meet those requirements out of the box, with no extra work or configurations required. For more information on how Azure Stack helps you meet the most stringent compliance standards, please see the [Microsoft Service Trust Portal](https://aka.ms/AzureStackCompliance).

## Retrieving BitLocker recovery keys

Azure Stack is configured in a way that BitLocker keys are internally managed, so that you do not need to provide them during regular operations, like, for instance, during system start up. However, there might be support scenarios in which the system is not able to start up and BitLocker recovery keys are necessary to bring the system online.  

> [!IMPORTANT]
> We strongly require that you retrieve your BitLocker recovery keys and store them in a safe location outside of Azure Stack. The inavailability of the recovery keys migh result in **data loss** and a system restore from a backup image.

Retrieving the BitLocker recovery keys requires access to the privileged endpoint (PEP). From a PEP session, run the Get-AzsRecoveryKeys cmdlet.

```powershell
##This cmdlet retrieves the recovery keys for all the volumes that are encrypted with BitLocker.
Get-AzsRecoveryKeys
```

Optional parameters for *Get-AzsRecoveryKeys* cmdlet:

| Parameter | Description | Type | Required |
|---------|---------|---------|---------|
|*raw* | returns raw data of mapping between recovery key, computer name and password id(s) of each encrypted volume  | switch | no (Designed for support scenarios)| 

## Hardware protection for data at rest

As with any type of encryption, the provided protection is only as good as how well the keys are managed. Azure Stack is no different and for the BitLocker keys, we used a two-tier protection architecture. 
To protect the encryption keys of the Cluster Shared Volumes, we use [Active Directory-based protectors](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/protecting-cluster-shared-volumes-and-storage-area-networks-with-bitlocker#a-href-idconfiguring-bitlocker-on-cluster-shared-volumes-aconfiguring-bitlocker-on-cluster-shared-volumes). When an unlock request is made for a protected volume, the BitLocker service interrupts the request and uses the BitLocker protect/unprotect APIs to unlock or deny the request.
The majority of the infrastructure components and all the user data is stored on CSVs. There is however, a small subset of infrastructure components that run on top of local disks (e.g. Active Directory) because they are required to bring up the CSVs; there would be a circular dependency otherwise. Starting with 1811, the local disk volumes are  also protected by BitLocker. Their keys are stored in the hardware Trusted Platform Modules (TPM) 2.0 that are included with each Azure Stack configuration (all OEM partners in all geos).
Since all CSVs store their keys in Active Directory, and AD stores its key in a TPM, all user data as well as data from Azure Stack infrastructure is eventually protected by a hardware security module (TPM).

## Troubleshoot issues

In extreme circumstances, a BitLocker unlock request could fail, resulting in a specific volume (either on a local disk or shared) not being able to boot up. Depending on the availability of some of the components of the architecture, this could result in downtime and, potentially, data loss, unless the BitLocker recovery keys are provided.

> [!IMPORTANT]
> Have you already retrieved, and stored in a secure place, the BitLocker recovery keys for your environment(s)? If not, stop everything you are doing, and do it immediately. Not having the recovery keys could result in **data loss**.

If you suspect that your system is experiencing issues with BitLocker (e.g. the system is unable to come up), contact support. Support requires your recovery keys. The majority of the BitLocker-related issues can be resolved with a FRU operation for that specific VM/Host/volume. For the more complicated cases (that is, all domain controllers are unavailable), if the recovery keys are provided, a manual unlocking procedure can be performed. If keys are not available, the only option is restore from a backup image, which, depending on when the last backup was performed, it could result in data loss.

## Next steps

[Learn more about Azure Stack security](azure-stack-security-foundations.md)