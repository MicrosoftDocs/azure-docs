---
title: About Azure Managed HSM security domain
description: Overview of the Managed HSM Security Domain, a set of artifacts needed to recover a Managed HSM
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
author: mbaldwin
ms.author: mbaldwin
ms.date: 03/28/2022
---

# About the Managed HSM Security Domain

A managed HSM is a single-tenant, [FIPS (Federal Information Processing Standards) 140-2 validated](https://csrc.nist.gov/publications/detail/fips/140/2/final), highly available hardware security module (HSM), with a customer-controlled security domain.  

Every managed HSM must have a security domain to operate. The security domain is an encrypted blob file that contains artifacts such as the HSM backup, user credentials, the signing key, and the data encryption key unique to your managed HSM. It serves the following purposes:

- Establishes "ownership" by cryptographically tying each managed HSM to a root of trust keys under your sole control,. This ensures that Microsoft does not have access to your cryptographic key material on the managed HSM.
- Sets the cryptographic boundary for key material in a managed HSM instance
- Allows you to fully recover a managed HSM instance if there is a disaster. The following disaster scenarios are covered:
  - A catastrophic failure where all member HSM instances of a managed HSM instance are destroyed.
  - The managed HSM instance was soft deleted by a customer and the resource was purged after the expiry of the mandatory retention period.
  - The end customer archived a project by performing a backup that included the managed HSM instance and all data, then deleted all Azure resources associated with the project.

Without the security domain, disaster recovery is not possible. And Microsoft has no way of recovering the security domain, nor can it access your keys without the security domain. Protection of the security domain is of therefore of the utmost importance for business continuity, and to ensure you are not cryptographically locked out.

## Security domain protection best practices

### Downloading the encrypted security domain

The security domain is generated in the managed HSM hardware, and the service software enclaves at the initialization time. Once the managed HSM is provisioned, you must create at least 3 RSA key pairs and send the public keys to the service when requesting the security domain download. You also need to specify the minimum number of keys required (quorum) to decrypt the Security Domain in the future. The managed HSM will initialize the Security Domain and encrypt it with the public keys you provide using Shamir's Secret Sharing Algorithm. Once the security domain is downloaded, the Managed HSM moves into an activated state and ready for consumption.

### Storing the security domain keys

The keys to a security domain must be held in offline storage (such as an encrypted USB drive), with each split of the quorum on a separate storage device. The storage devices must be held at separate geographical locations, and in a physical safe or a lock box. For ultra-sensitive and high assurance use cases, you may even choose to store your security domain private keys on your on-premises, offline HSM. 

It is again especially important to periodically review your security policy around the managed HSM quorum. Your security policy must be accurate, you must have up-to-date records of where the security domain and its private keys are stored, and you must know who has control of the security domain.

Security domain key handling prohibitions:
- One person should never be allowed to have physical access to all quorum keys. In other words, `m` must be greater than 1 (and should ideally be >= 3).
- The security domain keys must never be stored on a computer with an internet connection. A computer with internet connection is exposed to various threats, such as viruses and malicious hackers. You significantly reduce your risk by storing the security domain keys offline

### Establishing a security domain quorum

The best way to protect a security domain and prevent crypto lockout is to implement multi-person control, using the managed HSM concept called a "quorum". A quorum is split-secret threshold to divide the key encrypting the security domain among multiple persons to enforce multi-person control. In this way, the security domain is not dependent on a single person, who could leave the organization or have malicious intent.

We recommend implementing a quorum of `m` persons, where `m` is greater than or equal to 3. The maximum quorum size of the security domain for the managed HSM is 10.

Although a greater (`m`) size provides additional security, it imposes additional administrative overhead in terms of handling the security domain. It is therefore imperative that the security domain quorum be carefully chosen, with at least `m` >= 3. The security domain quorum size should also be periodically reviewed and updated (in the case of personnel changes, for example). It is especially important to keep records of security domain holders; your records should document every hand-off or change of possession, and your policy should enforce a rigorous adherence to quorum and documentation requirements.

The security domain private keys must be held by trusted and key employees of an organization, as it contains the most sensitive and critical information of your managed HSM. Security domain holders should have separate roles and be geographically separated within your organization.

For example, a security domain quorum could comprise four key pairs, with each private key given to a different person. A minimum of two people would have to come together to reconstruct a security domain. The parts could be given to key personnel, such as:

- Business Unit Technical Lead
- Security Architect
- Security Engineer
- Application Developer

Every organization is different and enforces a different security policy based on their needs. We recommend that you periodically review your security policy for compliance and for making decisions on the quorum and its size.

The security domain quorum must be periodically reviewed.  Timing depends on your organization, but we recommend that you conduct a security domain review at least once every quarter, as well as when:

- A member of the quorum leaves the organization.
- A new or emerging threat makes you decide to increase the size of the quorum.
- There is a process change in implementing the quorum.
- A USB drive or HSM belonging to a member of the security domain quorum is lost or compromised.

### Security domain compromise or loss

If your security domain is compromised, a malicious actor could use it to create their own managed HSM instance. The malicious actor could use the access to the key backups to start decrypting the data protected with the keys on the managed HSM instance. A lost security domain is considered compromised.

After a security domain compromise, all data encrypted with the current managed HSM instance must be decrypted with current key material. A new managed HSM instance must be provisioned, and a new security domain, pointing to the new URL, must be implemented.

Because there is no way to migrate key material from a managed HSM instance to another with a different security domain, implementing the security domain must be well thought-out, and protected with accurate, periodically reviewed record keeping.

## Summary

The security domain and its corresponding private keys play an important part in managed HSM operations. These artifacts are analogous to the combination of a safe, and poor management may easily comprise strong algorithms and systems. If a safe combination is known to an adversary, the strongest safe provides no security. The proper management of the security domain and its private keys is essential to the effective use of the managed HSM.

It is highly recommended that you review [NIST Special Publication 800-57](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final) for key management best practices, before developing and implementing the policies, systems, and standards necessary to meet and enhance your organization's security goals.

## Next steps

- Read an [Overview of Managed HSM](overview.md)
- Learn about [Managing managed HSM with Azure CLI](key-management.md)
- Review [Managed HSM best practices](best-practices.md)
