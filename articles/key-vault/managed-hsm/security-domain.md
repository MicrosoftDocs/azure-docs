---
title: About the security domain in Azure Key Vault Managed HSM
description: Get an overview of the Azure Key Vault Managed HSM security domain, a set of artifacts you must have to recover a managed HSM.
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: concept-article
author: msmbaldwin
ms.author: mbaldwin
ms.date: 03/28/2022
---

# Security domain in Managed HSM overview

A managed HSM is a single-tenant, [Federal Information Processing Standards (FIPS) 140-2 validated](https://csrc.nist.gov/publications/detail/fips/140/2/final), highly available, hardware security module (HSM) that has a customer-controlled security domain.  

To operate, a managed HSM must have a security domain. The security domain is an encrypted blob file that contains artifacts like the HSM backup, user credentials, the signing key, and the data encryption key that's unique to the managed HSM.

A managed HSM serves the following purposes:

- Establishes "ownership" by cryptographically tying each managed HSM to a root of trust keys under your sole control. This ensures that Microsoft doesn't have access to your cryptographic key material on the managed HSM.
- Sets the cryptographic boundary for key material in a managed HSM instance.
- Allows you to fully recover a managed HSM instance if there's a disaster. The following disaster scenarios are covered:

  - A catastrophic failure in which all member HSM instances of a managed HSM instance are destroyed.
  - The managed HSM instance was soft-deleted by a customer and the resource was purged after the mandatory retention period expired.
  - The customer archived a project by performing a backup that included the managed HSM instance and all data, and then deleted all Azure resources that were associated with the project.

Without the security domain, disaster recovery isn't possible. Microsoft has no way to recover the security domain, and Microsoft can't access your keys without the security domain. Protecting the security domain is therefore of the utmost importance for your business continuity, and to ensure that you aren't cryptographically locked out.

## Security domain protection best practices

Implement the following best practices to help ensure the protection of your security domain.

### Downloading the encrypted security domain

The security domain is generated in both the managed HSM hardware and the service software enclaves during initialization. After the managed HSM is provisioned, you must create at least three RSA key pairs and send the public keys to the service when you request the security domain download. You also need to specify the minimum number of keys required (the quorum) to decrypt the security domain in the future.

The managed HSM initializes the security domain and encrypts it with the public keys that you provide by using Shamir's Secret Sharing Algorithm. After the security domain is downloaded, the managed HSM moves into an activated state and is ready for consumption.

### Storing the security domain keys

The keys to a security domain must be held in offline storage (such as on an encrypted USB drive), with each split of the quorum on a separate storage device. The storage devices must be held at separate geographical locations, and in a physical safe or lock box. For ultrasensitive and high-assurance use cases, you might even choose to store your security domain private keys in your on-premises, offline HSM.

It's especially important to periodically review your security policy for the managed HSM quorum. Your security policy must be accurate, you must have up-to-date records of where the security domain and its private keys are stored, and you must know who has control of the security domain.

Here are security domain key-handling prohibitions:

- One person should never be allowed to have physical access to all quorum keys. In other words, `m` must be greater than 1 (and ideally should be >= 3).
- The security domain keys must never be stored on a computer that has an internet connection. A computer that is connected to the internet is exposed to various threats, such as viruses and malicious hackers. You significantly reduce your risk by storing the security domain keys offline.

### Establishing a security domain quorum

The best way to protect a security domain and prevent cryptographic lockout is to implement multi-person control by using the managed HSM concept *quorum*. A quorum is a split-secret threshold to divide the key that encrypts the security domain among multiple persons. A quorum enforces multi-person control. This way, the security domain isn't dependent on a single person, who might leave the organization or have malicious intent.

We recommend that you implement a quorum of `m` persons, where `m` is greater than or equal to 3. The maximum quorum size of the security domain for a managed HSM is 10.

Although a higher `m` size provides more security, it imposes further administrative overhead in terms of handling the security domain. It's therefore imperative that the security domain quorum be carefully chosen, with at least `m` >= 3.

The security domain quorum size should also be periodically reviewed and updated (in the case of personnel changes, for example). It's especially important to keep records of security domain holders. Your records should document every hand-off or change of possession. Your policy should enforce a rigorous adherence to quorum and documentation requirements.

Because the keys allow access to the most sensitive and critical information of your managed HSM, the security domain private keys must be held by primary, trusted employees in the organization. Security domain holders should have separate roles and be geographically separated within your organization.

For example, a security domain quorum might comprise four key pairs, with each private key given to a different person. A minimum of two people would have to come together to reconstruct a security domain. The parts could be given to key personnel, such as:

- Business Unit Technical Lead
- Security Architect
- Security Engineer
- Application Developer

Every organization is different and enforces a different security policy based on its needs. We recommend that you periodically review your security policy for compliance and to make decisions about the quorum and its size. Your organization can choose the timing of the review, but we recommend that you conduct a security domain review at least once every quarter, and also at these times:

- When a member of the quorum leaves the organization.
- When a new or emerging threat makes you decide to increase the size of the quorum.
- When there's a process change in implementing the quorum.
- When a USB drive or HSM that belongs to a member of the security domain quorum is lost or compromised.

### Security domain compromise or loss

If your security domain is compromised, a malicious actor might use it to create their own managed HSM instance. The malicious actor can use the access to key backups to start decrypting the data that's protected with the keys on the managed HSM.

A lost security domain is considered compromised.

After a security domain is compromised, all data that's encrypted via the current managed HSM must be decrypted by using current key material. A new instance of Azure Key Vault Managed HSM must be provisioned, and a new security domain that points to the new URL must be implemented.

Because there's no way to migrate key material from one instance of Managed HSM to another instance that has a different security domain, implementing the security domain must be well thought-out, and it must be protected through accurate, periodically reviewed recordkeeping.

## Summary

The security domain and its corresponding private keys play an important part in managed HSM operations. These artifacts are analogous to the combination of a safe, and poor management might easily compromise strong algorithms and systems. If a safe combination is known to an adversary, the strongest safe provides no security. The proper management of the security domain and its private keys is essential to the effective use of the managed HSM.

We highly recommend that you review [NIST Special Publication 800-57](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final) for key management best practices before you develop and implement the policies, systems, and standards that are necessary to meet and enhance your organization's security goals.

## Next steps

- Read an [overview of Managed HSM](overview.md).
- Learn about [managing your managed HSM by using the Azure CLI](key-management.md).
- Review [Managed HSM best practices](best-practices.md).
