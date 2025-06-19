---
author: msmbaldwin
ms.service: azure-confidential-ledger
ms.topic: include
ms.date: 04/16/2025
ms.author: msmbaldwin

---

An Azure Managed CCF resource has a unique identity called the service identity, represented by a certificate and created during the resource creation. Every individual node that is part of the Azure Managed CCF resource has its self-signed certificate, endorsed by the service identity, which establishes trust on it. 

Customers are recommended to download the service identity certificate and use it to establish a TLS connection when interacting with the service. The following command downloads the certificate and saves it into service_cert.pem.

```Bash
curl https://identity.confidential-ledger.core.azure.com/ledgerIdentity/confidentialbillingapp --silent | jq ' .ledgerTlsCertificate' | xargs echo -e > service_cert.pem
```
