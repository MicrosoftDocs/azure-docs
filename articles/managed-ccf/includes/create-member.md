---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 09/13/2023
ms.author: msmbaldwin

# Generic CLI create resource group include for quickstarts.

---

Generate a key pair for the member. After the following command completes, the member's public key is saved in member0_cert.pem and the private key is saved in member0_privk.pem.

```bash
/opt/ccf_virtual/bin/keygenerator.sh --name member0
```