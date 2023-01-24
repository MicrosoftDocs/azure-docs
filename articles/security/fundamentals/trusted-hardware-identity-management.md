---
title: Trusted Hardware Identity Management
description: Technical overview of Trusted Hardware Identity Management, which handles cache management of certificates and provides a trusted computing base.
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 10/24/2022
---

# Trusted Hardware Identity Management

The Trusted Hardware Identity Management (THIM) service handles cache management of certificates for all Trusted Execution Environments (TEE) residing in Azure and provides trusted computing base (TCB) information to enforce a minimum baseline for attestation solutions.

## THIM & attestation interactions

THIM defines the Azure security baseline for Azure Confidential computing (ACC) nodes and caches collateral from TEE providers. The cached information can be further used by attestation services and ACC nodes in validating TEEs. The diagram below shows the interactions between an attestation service or node, THIM, and an enclave host.

:::image type="content" source="./media/thim.png" alt-text="Diagram illustrating the interacts between an attestation service or node, THIM, and an enclave host.":::

## Frequently asked questions

### The "next update" date of the Azure-internal caching service API, used by Microsoft Azure Attestation, seems to be out of date. Is it still in operation and can it be used?

The "tcbinfo" field contains the TCB information. The THIM service by default provides an older tcbinfo -- updating to the latest tcbinfo from Intel would cause attestation failures for those customers who haven't migrated to the latest Intel SDK, and could results in outages.

Open Enclave SDK and Microsoft Azure Attestation don't look at nextUpdate date, however, and will pass attestation. 

### What is the Azure DCAP Library?

Azure Data Center Attestation Primitives (DCAP), a replacement for Intel Quote Provider Library (QPL), fetches quote generation collateral and quote validation collateral directly from the THIM Service. Fetching collateral directly from the THIM service ensures that all Azure hosts have collateral readily available within the Azure cloud to reduce external dependencies. The current recommended version of the DCAP library is 1.11.2.

### Where can I download the latest DCAP packages?

- Ubuntu 20.04: <https://packages.microsoft.com/ubuntu/20.04/prod/pool/main/a/az-dcap-client/az-dcap-client_1.11.2_amd64.deb>
- Ubuntu 18.04: <https://packages.microsoft.com/ubuntu/18.04/prod/pool/main/a/az-dcap-client/az-dcap-client_1.11.2_amd64.deb>
- Windows: <https://www.nuget.org/packages/Microsoft.Azure.DCAP/1.11.2>

### Why are there different baselines between THIM and Intel?

THIM and Intel provide different baseline levels of the trusted computing base. While Intel can be viewed as having the latest and greatest, this imposes requirements upon the consumer to ensure that all the requirements are satisfied, thus leading to a potential breakage of customers if they haven't updated to the specified requirements. THIM takes a slower approach to updating the TCB baseline to allow customers to make the necessary changes at their own pace. This approach, while does provide an older TCB baseline, ensures that customers will not break if they haven't been able to meet the requirements of the new TCB baseline. This reason is why THIM's TCB baseline is of a different version from Intel's. We're customer-focused and want to empower the customer to meet the requirements imposed by the new TCB baseline on their pace, instead of forcing them to update and causing them a disruption that would require reprioritization of their workstreams.

THIM is also introducing a new feature that will enable customers to select their own custom baseline. This feature will allow customers to decide between the newest TCB or using an older TCB than provided by Intel, enabling customers to ensure that the TCB version to enforce is compliant with their specific configuration. This new feature will be reflected in a future iteration of the THIM documentation.

### With Coffeelake I could get my certificates directly from Intel PCK. Why, with Icelake, do I need to get the certificates from THIM, and what do I need to do to fetch those certificates?

The certificates are fetched and cached in THIM service using platform manifest and indirect registration. As a result, Key Caching Policy will be set to never store platform root keys for a given platform. Direct calls to the Intel service from inside the VM are expected to fail.

To retrieve the certificate, you must install the [Azure DCAP library](#what-is-the-azure-dcap-library) which replaces Intel QPL. This library directs the fetch requests to THIM service running in Azure cloud. For the downloading the latest DCAP packages, please see: [Where can I download the latest DCAP packages?](#where-can-i-download-the-latest-dcap-packages)

### How do I request collateral in a Confidential Virtual Machine (CVM)?

Use the following sample in a CVM guest for requesting AMD collateral that includes the VCEK certificate and certificate chain. For details on this collateral and where it originates from, see [Versioned Chip Endorsement Key (VCEK) Certificate and KDS Interface Specification](https://www.amd.com/system/files/TechDocs/57230.pdf) (from <amd.com>).

#### URI parameters

```bash
GET "http://169.254.169.254/metadata/THIM/amd/certification"
```

#### Request body

| Name | Type | Description |
|--|--|--|
| Metadata | Boolean | Setting to True allows for collateral to be returned |

#### Sample request

```bash
curl GET "http://169.254.169.254/metadata/THIM/amd/certification" -H "Metadata: true”
```

#### Responses

| Name | Description |
|--|--|
| 200 OK | Lists available collateral in http body within JSON format. For details on the keys in the JSON, please see Definitions |
| Other Status Codes | Error response describing why the operation failed |

#### Definitions

| Key | Description |
|--|--|
| VcekCert | X.509v3 certificate as defined in RFC 5280. |
| tcbm | Trusted Computing Base |
| certificateChain | Includes the AMD SEV Key (ASK) and AMD Root Key (ARK) certificates |

## Next steps

- Learn more about [Azure Attestation documentation](../../attestation/overview.md)
- Learn more about [Azure Confidential Computing](https://azure.microsoft.com/blog/introducing-azure-confidential-computing)
