---
title: Azure Attestation Workflow
description: The workflow of Azure Attestation.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Workflow

Microsoft Azure Attestation receives evidence from enclavess and evaluates the evidence against Azure security baseline and configurable policies. Upon successful verficiation, Azure Attestation generates an attestation token to confirm trustworthiness of the enclave.

The following actors are involved in an Azure Attestation work flow:

- **Relying party**: The component which relies on Azure Attestation to verify enclave validity. 
- **Client**: The component which collects information from an enclave and sends requests to Azure Attestation. 
- **Azure Attestation**: The component which accepts enclave evidence from client, validates it and returns attestation token to the client


## Enclave validation work flow

Here are the general steps in a typical SGX enclave attestation workflow (using Azure Attestation):

1. Client collects evidence from an enclave. Evidence is information about the enclave environment and the client library running inside the enclave.
1. The client has an URI which refers to an instance of Azure Attestation. The client authenticates to Azure AD and obtains an access token.
1. The client sends evidence to Azure Attestation along with the access token. Exact information submitted to the provider depends on the enclave type.
1. Azure Attestation validates the submitted information and evaluates it against a configured policy. If the verification succeeds, Azure Attestation issues an attestation token and returns it to the client. If this step fails, Azure Attestation reports an error to the client. 
1. The client sends the attestation token to relying party. The relying party calls public key metadata endpoint of Azure Attestation to retrieve signing certificates. The relying party then verifies the signature of the attestation token and ensures the enclave trustworthiness. 

![Enclave validation flow](./media/validation-flow.png)


## Next steps
- [How to author and sign an attestation policy](author-sign-policy.md)
- [Set up Azure Attestation using PowerShell](quickstart-powershell.md)
