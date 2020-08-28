---
title: Managed HSM security domain | Microsoft Docs
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
author: amitbapat
ms.author: ambapat
manager: msmbaldwin
ms.date: 09/15/2020
---
# Managed HSM security domain

Security domain is a set of core credentials needed to recover a managed HSM pool in case of a disaster. These credentials are generated in the HSM pool's member partitions and enclaves and represent "ownership" of those partitions.

Every HSM pool must have a security domain to operate. When you request a new managed HSM pool, it is provisioned but not activated until you initialize and download the security domain. When an HSM pool is in provisioned (but not activated) state, there are two ways to initialize it:
- request to create a new security domain
- request to upload an existing security domain you already have. This method allows you to create multiple HSM pools that share the same security domain.

## Download security domain 

When an HSM pool is in provisioned but not activated, downloading a security domain results in creating a new security domain. To download the security domain, you must create at least 3 (maximum 10) RSA key pairs and send the public keys while requesting to download the security domain. You also need to specify the minimum number of keys required (quorum) to decrypt the security domain. The HSM pool will initialize a new security domain and encrypt it using the public keys you provided. The security domain blob you download can only be decrypted when at least quorum number of private keys are available. Therefore, you must keep the private keys safe to ensure security of the security domain. Once the download is complete the HSM will in activated state.

## Upload security domain

When an HSM pool is in provisioned but not activated, you can request to initiate a security domain recovery process. The HSM pool will generate a RSA key pair and return the public key. Then you can upload the security domain to this HSM pool - before uploading, the client (Azure CLI or PowerShell) will need to be provided with the minimum quorum number of private keys you used while downloading the security domain. The client will decrypt the security domain and encrypt it using the public key you downloaded when you requested recovery. Once the upload is complete the HSM will be in activated state.


## Backup and restore behavior

Backups (either full backup or a single key backup) can only be successfully restored if the source HSM pool where the backup was created and the destination HSM pool where the backup will be restored share the same security domain. In this way security domain also defines a cryptographic boundary for each HSM pool.




