---
title: Azure Attestation 
description: XXX
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Workflow

The following actors are involved in an attestation work flow:
- Relying party: The component which relies on MAA to validate an enclave and make decisions on data exchange with an enclave. Relying party generally owns a key collateral and will release key material upon successful token validation. 
- Client: The component which collects evidence from an enclave and sends attestation requests to MAA. 
- MAA: The component which accepts enclave evidence from client, validates it and returns attestation token to the client


## Enclave validation work flow

Here are the general steps in a typical SGX enclave attestation workflow (using MAA):

1. The client collects the evidence from an enclave. Evidence is the information about the enclave environment and the client library running inside the enclave.
1. The client has an attestation URL which references to attestation provider of MAA.
The client authenticates to Azure AD and obtains a access token for the attestation provider, referenced in the attestation URL.
1. The client sends the quote and enclave held data to MAA along with the access token. Exact information submitted to the provider depends on the enclave type.
1. Attestation provider validates the submitted information and evaluates against the configured attestation policy. If the verification succeeds, the attestation provider issues an attestation token and returns the token to the client.
If this step fail, attestation provider reports an error to client. 
1. The client sends the attestation token to relying party. Relying party calls the public key endpoint of the attestation provider to retrieve signing certificates of MAA. Please refer to “MAA APIs” section of this document for more details. The relying party verifies the signature of the attestation token and ensures enclave is valid. 

## Secure Key Release work flow

Here are the general steps in a secure key exchange operation:

1. The enclave creates a “quote” which expresses the state of the enclave. For the “Enclave Held Data (EHD)”, it uses the public key for the enclave (normally the public key is formatted as an JSON Web Key). It places the SHA256 of the Json Web Key in the first 32 bytes of the “reportData” field of the quote and returns both the quote and the enclave held data to the 
client.
1. The client has an attestation URL which references to attestation provider of MAA.
The client authenticates to Azure AD and obtains a access token for the attestation provider, referenced in the attestation URL.
1. The client sends the quote and enclave held data to MAA along with the access token.
1. MAA validates the quote and enclave held data and returns a signed JWT back to client.
1. The client sends the JWT token to relying party
1. Relying party verifies the attestation token by referring to the public key endpoint of the attestation provider
1. The relying party extracts the EHD from the JWT and uses the public key to encrypt the data to be sent to the enclave. The relying party can be certain that the key was in fact a key known to the enclave because MAA verified that the enclave is valid and the enclave held data is known to the application. 


## Use cases
MAA is tasked with providing comprehensive attestation services for multiple environments and distinctive use cases.
This section elaborates on the primary scenarios.

### Intel® SGX Enclaves
Intel® SGX refers to hardware grade isolation, which is supported on certain CPUs models. SGX enables code to run in sanitized compartments known as SGX enclaves. Access and memory permissions are then managed by hardware to ensure a minimal attack surface with proper isolation.

Client applications can be designed to take advantage of SGX enclaves by delegating security-sensitive tasks to take place inside those enclaves. Such apps can then make use of MAA to routinely establish trust in the enclave and its ability to access sensitive data.

A leading Azure example of this is SQL Always Encrypted, which seeks to leverage SGX in order to remove VM administrators from its TCB.

### Open Enclave
Open Enclave (OE) is a collection of libraries targeted at creating a single unified enclaving abstraction for developer to build TEEs based applications. It offers a universal secure app model that minimizes platform specificities. Microsoft views it as an essential stepping-stone toward democratizing enclave technologies such as SGX and increasing their uptake on Azure.

In the context of MAA, OE standardizes specific requirements for verification of an enclave evidence. This qualifies Open Enclave as a highly fitting attestation consumer of MAA.

## VBS Attestation
Virtualization-based security is a software-based architecture for enclave memory protection based on Hyper-V. It prevents host admin code, as well as local and cloud service administrators from accessing the data in a VBS enclave or affecting its execution.

In a similar fashion to Intel® SGX technology, VBS architecture includes working enclaves and a quoting enclave. The latter is used to issues reports. MAA will support validating these reports against configured policies, and issuing a certification statement as proof of validity for the enclaves.


## Next steps

