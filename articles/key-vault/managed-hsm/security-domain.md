---
title: About managed HSM security domain | Microsoft Docs
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
author: amitbapat
ms.author: ambapat
manager: msmbaldwin
ms.date: 09/15/2020
---
# About Managed HSM Security Domain

The Managed HSM Security Domain (SD) is a set of core credentials needed to recover a Managed HSM in event of a total disaster. The Security Domain is generated in the Managed HSM hardware and the service software enclaves and represents "ownership" of the HSM. 

Every Managed HSM must have a security domain to operate. When you request a new Managed HSM, it is provisioned but is not activate until you initialize and download the Security Domain. When a Managed HSM is in provisioned, but not activated, state, there are two ways to initialize it: 
- Download your Security Domain. This is the default method and allows you safely store the Security Domain either to use with another Managed HSM or to recover from a total disaster.  
- Upload an existing Security Domain you already have. This method allows you to create multiple Managed HSM that share the same Security Domain. 

## Download your security domain 

When a Managed HSM is provisioned but not activated, downloading the Security Domain captures the core credentials needed to recover from a complete loss of all hardware. To download the Security Domain, you must create at least 3 (maximum 10) RSA key pairs and send these public keys to the service when requesting the Security Domain download. You also need to specify the minimum number of keys required (quorum) to decrypt the Security Domain in the future. The Managed HSM will initialize the Security Domain and encrypt it using the public keys you provide. The Security Domain blob you download can only be decrypted when at least a quorum of private keys are available; you must keep the private keys safe to ensure the security of the Security Domain. Once the download is complete the Managed HSM will be in activated state ready for use.  

> [!IMPORTANT] For a full disaster recovery, you must have the Security Domain, and the quorum of private keys that were used to protect it, and a full HSM backup. If you lose the Security Domain or sufficient of the RSA keys (private key) to lose quorum, and no running instances of the Managed HSM are present, disaster recovery will not be possible. 

## Upload a security domain

When a Managed HSM is provisioned but not activated, you can initiate a Security Domain recovery process. The Managed HSM pool will generate a RSA key pair and return the public key. Then you can upload the Security Domain to the Managed HSM. Before uploading, the client (Azure CLI or PowerShell) will need to be provided with the minimum quorum number of private keys you used while downloading the security domain. The client will decrypt the Security Domain using this quorum and re-encrypt it using the public key you downloaded when you requested recovery. Once the upload is complete the Managed HSM will be in activated state. 


## Backup and restore behavior

Backups (either full backup or a single key backup) can only be successfully restored if the source Managed HSM where the backup was created and the destination Managed HSM where the backup will be restored share the same Security Domain. In this way, a Security Domain also defines a cryptographic boundary for each Managed HSM. 

## Next Steps

- Read an [Overview of Managed HSM](overview.md)
- Learn about [Managing managed HSM with Azure CLI](manage-with-cli.md)
- Review [Managed HSM best practices](best-practices.md)



