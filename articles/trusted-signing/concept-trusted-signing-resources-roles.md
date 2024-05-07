---
title: Trusted Signing resources and roles
description: Trusted Signing is a Microsoft fully managed end-to-end signing solution that simplifies the signing process for Azure developers. Learn all about the resources and roles specific to Trusted Signing, such as identity validations, certificate profiles, and the trusted signing identity verifier.
author: ianjmcm
ms.author: ianmcm
ms.service: trusted-signing
ms.topic: concept-article
ms.date: 04/03/2024
ms.custom: template-concept
---

# Trusted Signing resources and roles

Trusted Signing is an Azure native resource with full support for common Azure concepts such as resources. As with all other Azure Resource, Trusted Signing also has its own set of resources and roles designed to simplify the management of the service. 

This article introduces you to the resources and roles that are specific to Trusted Signing.

## Trusted Signing Resource Types
Trusted Signing has the following resource types: 

- **Trusted Signing Account**: The account is a logical container of all the subscriber's resources to complete signing and manage access controls to those sensitive resources. 

- **Certificate Profile**: Certificate Profiles are the configuration attributes that generate the certificates you use to sign code. They also define the trust model and scenario signed content is consumed under by relying parties. Signing roles are assigned to this resource to authorize identities in the tenant to request signing. A prerequisite for creating any Certificate Profile is to have at least one Identity Validation request completed. 

- **Identity Validation**: Identity Validation performs verification of your organization or individual identity before you can sign code. The verified organization or individual identity is the source of the attributes for your Certificate Profiles' SubjectDN values (for example, "CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US"). Identity validation roles are assigned to identities in the tenant to create these resources.

In the below example structure, notice that an Azure Subscription has a Resource Group. Under the Resource Group you can have one or many Trusted Signing Account resources with one or many Identity Validations and Certificate Profiles. 

![Diagram of Trusted Signing resource group and cert profiles](./media/trusted-signing-resource-structure.png)

This ability to have multiple Trusted Signing Accounts and Certificate Profiles is useful as the service supports Public Trust, Private Trust, CI Policy, VBS Enclave, and Test signing types. For more information on the Certificate Profile types and how they're used, review [Trusted Signing certificate types and management](./concept-trusted-signing-cert-management.md). 

> [!NOTE]
> Identity Validations and Certificate Profiles align with either Public or Private Trust. Meaning that a Public Trust Identity Validation is only used for Certificate Profiles that are used for the Public Trust model. For more information, review [Trusted Signing trust models](./concept-trusted-signing-trust-models.md).

### Trusted Signing account

The Trusted Signing account is a logical container of the resources that are used to do signing. Trusted Signing accounts can be used to define boundaries of a project or organization. For most, a single Trusted Signing account can satisfy all the signing needs for an individual or organization. Subscribers can sign many artifacts all distributed by the same identity (for example, "Contoso News, LLC"), but operationally, there may be boundaries the subscriber wants to draw in terms of access to signing. You may choose to have a Trusted Signing account per product or per team to isolate usage of an account. However, this isolation pattern can also be achieved at the Certificate Profile level.

### Identity Validations

Identity Validations are all about establishing the identity on the certificates that are used for signing.  There are two types: Private Trust and Public Trust. These two types are defined by the level of identity validation that's required to complete the creation of an Identity Validation resource. 

**Private Trust** is intended for use in situations where there's an established trust in a private identity across one or many relying parties (consumers of signatures) or internally in app control or Line of Business (LoB) scenarios. With Private Trust Identity Validations, there's minimal verification of the identity attributes (for example, Organization Unit value) and it's tightly associated with the Azure Tenant of the subscriber (for example, Costoso.onmicrosoft.com). The values inputted for Private Trust are otherwise not validated beyond the Azure Tenant information. 

**Public Trust** means that all identity values must be validated in accordance to our [Microsoft PKI Services Third Party Certification Practice Statement (CPS)](https://www.microsoft.com/pkiops/docs/repository.htm). This aligns with the expectations for publicly trusted code signing certificates. 

For more details on Private and Public Trust, review [Trusted Signing trust models](./concept-trusted-signing-trust-models.md). 

### Certificate Profiles

Trusted Signing provides five total Certificate Profile types that all subscribers can use with the aligned and completed Identity Validation resources. These five Certificate Profiles are aligned to Public or Private Trust Identity Validations as follows:

- **Public Trust**
    - **Public Trust**: Used for signing code and artifacts that can be publicly distributed. It's default trusted on the Windows platform for code signing. 
    - **VBS Enclave**: Used for signing [Virtualization-based Security Enclaves](/windows/win32/trusted-execution/vbs-enclaves) on Windows.
    - **Public Trust Test**: Used for test signing only and aren't publicly trusted by default. Consider Public Trust Test Certificate Profile as a great option for inner loop build signing. 
    
    > [!NOTE]
    > All certificates under the Public Trust Test Certificate Profile type include the Lifetime EKU (1.3.6.1.4.1.311.10.3.13) forcing validation to respect the lifetime of the signing certificate regardless of the presence of a valid time stamp countersignature. 

- **Private Trust**
    - **Private Trust**: Used for signing internal or private artifacts such as Line of Business (LoB) applications and containers. It can also be used to sign [catalog files for Windows App Control for Business](/windows/security/application-security/application-control/windows-defender-application-control/deployment/deploy-catalog-files-to-support-wdac).
    - **Private Trust CI Policy**: The Private Trust CI Policy Certificate Profile is the only type that does NOT include the Code Signing EKU (1.3.6.1.5.5.7.3.3). It's specifically designed for [signing Windows App Control for Business CI policy files](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-signed-policies-to-protect-wdac-against-tampering). 
 

## Supported roles

Azure Role Based Accesfnotes Controls (RBAC) is a cornerstone concept for all Azure resources. Trusted Signing adds two custom roles to meet subscribers’ needs for creating an Identity Validation (Trusted Signing Identity Verifier) and signing with Certificate Profiles (Trusted Signing Certificate Profile Signer). These custom roles explicitly must be assigned to perform those two critical functions in using Trusted Signing. Below is a complete list of roles Trusted Signing supports and their capabilities, including all standard Azure roles.

|Role|Managed/View Account|Manage Certificate Profiles|Sign with Certificate Profile|View Signing History|Manage Role Assignment|Manage Identity Validation|
|---------------|---------------|-----------------|-----------------|-----------------|-----------------|-----------------|
|Trusted Signing Identity Verifier<sub>1</sub>||||||X|
|Trusted Signing Certificate Profile Signer<sub>2</sub>|||X|X|||
|Owner|X|X|||X||
|Contributor|X|X|||||
|Reader|X||||||
|User Access Admin|||||X||
||||||||

<sub>1</sub> Required to create/manage Identity Validation only available on the Azure portal experience. 

<sub>2</sub> Required to successfully sign with Trusted Signing.

## Next steps

* Get started with [Trusted Signing's Quickstart Guide](./quickstart.md).
* Review the [Trusted Signing Trust Models](./concept-trusted-signing-trust-models.md) concept.
* Review the [Trusting Signing certificates and management](./concept-trusted-signing-cert-management.md) concept.

