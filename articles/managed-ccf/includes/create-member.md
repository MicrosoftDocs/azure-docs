---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 09/13/2023
ms.author: msmbaldwin

# Generic CLI create resource group include for quickstarts.

---

Generate a key pair for the member. After the following commands complete, the member's public key is saved in `member0_cert.pem` and the private key is saved in `member0_privk.pem`.

```bash
openssl ecparam -out "member0_privk.pem" -name "secp384r1" -genkey
openssl req -new -key "member0_privk.pem" -x509 -nodes -days 365 -out "member0_cert.pem" -"sha384" -subj=/CN="member0"
```