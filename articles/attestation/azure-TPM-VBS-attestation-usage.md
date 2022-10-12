---
title: Azure TPM VBS Attestation usage 
description: Learn about how to leverage TPM and VBS attestation
services: attestation
author: prsriva
ms.service: attestation
ms.topic: overview
ms.date: 09/05/2022
ms.author: prsriva
ms.custom: tpm attestation
---

# Using TPM/VBS attestation 

Attestation can be integrated into vairous applications and servies, catering to different use cases. Azure Attestation service which acts the remote attestation service can be used for desired purposes by updating the attestation policy. The policy engine works as processor which takes the incoming payload as evidence and performs the validations as authored in the policy. This simplifies the workflow and enables the service owner to purpose build solutions for the varied platforms and use cases.The workflow remains the same as described in [Azure attestation workflow](workflow.md). For different purposes the attestaiton policy to be used is different.

Attesting a platform has its own challenges with its varied components of boot and setup, one needs to rely on a  hardware root-of-trust anchor that can be used to verify the very first steps of the boot process and extend that trust upward into every layer on your system. A hardware TPM provides such an anchor for a true remote attestation solution. Azure Attestation provides a highly scalable measured boot and runtime integrity measurement attestation solution with a revocation framework to give you full control over platform attestation and remediation.

## Attestation Steps

Attestation Setup has 2 main components: 
One pertaining to the service setup and one pertaining to the client setup. More information about the workflow is described in [Azure attestation workflow](workflow.md).

### Service endpoint setup:
This is the first step for any attestaiton to be performed. Setting up an endpoint can be performed either via code or using the Azure Portal. The key piece to attestation is the policy. Sample policies can be found in the [Policy Samples](policy-examples.md) Section.

Here is how you can setup an attestation endpoint using Powershell
<ul>
<li> Ensure powershell and azure prerequisites are met.</li>
</ul>

Here is how you can setup an attestation endpoint using Azure Portal


### Client Setup:
A client to communicate with the attestation service endpoint needs to ensure it is appropriately following the protocol as described in the procotol documentation, or for ease of intergation a sample client is available is here to try. 
<ul>
<li> Ensure the identity to be used for authentication has Attestation Reader Role.</li>
</ul>


### Executing the Attestation Workflow:


## How to use attestation for Boot integrity
To provide authenticity of the root-of-trust guarantees, the UEFI and other bootloaders and operating system components are running as expected is achieved by leveraging the cryptographic identity provided the TPMs and measured boot feature of the various components.

A sample to set up the client can be found here:

```
    Steps/Links to sample client on Linux/Windows

```

A Policy as below can be used to verify the TPM, boot components, kerenel signer, kernel signature, built-in-key rings and IMA components to ensure system integrity is maintained.

```
<B><U> TODO ADD LINUX POLICY </B></U>

```

## How to use TPM attestation for detecting firmware loaded on the system
Measurement logs also contain the firmware measurements loaded in a plaftorm, and remote attestation can be used to inspect the properties of the loaded firmaware either for monitoring, forensics or even securing the workloads running on the paltform. 

Here is an attestation policy to inspect the firmware loaded:

```
<B><U> TODO FIRMWARE POLICY </B></U>
```

Here is an attestation policy to authorize the attestation based on the signer information of the loaded drivers:

```
<B><U> TODO ADD FIRMWARE VALIDATION POLICY, ADD FASR and DRTM in this </B></U>

```


## How to use Key attestation to ensure credential safety
Key storgage providers capablities to certify objects, and building on the capablity of certifying that the object is loaded, attestation can be used to verify the public area expected by the relying party is same as certified, and the values in that public area are correct. such capability not only allows for the relying party to scale the protections across the KSPs but also additional proof-of-possesion protection.

Here is an attestation policy to verify the Key properties:

```
<B><U> TODO FIRMWARE POLICY </B></U>
```

Here is an attestation policy to check if the key object is in a valid TPM

```
<B><U> TODO ADD FIRMWARE VALIDATION POLICY, ADD FASR and DRTM in this </B></U>

```


## Learn More about integration and support