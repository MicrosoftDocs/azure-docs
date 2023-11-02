---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 09/13/2023
ms.author: msmbaldwin

# Prerequites include for quickstarts and how to guides for registering the Microsoft.ConfidentialLedger provider.

---

```bash
curl --cacert service_cert.pem https://confidentialbillingapp.confidential-ledger.azure.com/gov/members | jq
{
  "710c4d7ce6a70a89137b39170cd5c48f94b4756a66e66b2242370111c1c47564": {
    "cert": "-----BEGIN CERTIFICATE-----\nMIIB9zCCAX2gAwIBAgIQW20I1iR...l8Uv8rRce\n-----END CERTIFICATE-----",
    "member_data": {
      "is_operator": true,
      "owner": "Microsoft Azure"
    },
    "public_encryption_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMI...n3QIDAQAB\n-----END PUBLIC KEY-----\n",
    "status": "Active"
  },
  "f9ea379051e5292b538ff2a3dc97f1bb4d5046f12e2bdbf5b8e3acc4516f34e3": {
    "cert": "-----BEGIN CERTIFICATE-----\nMIIBuzCCAUKgAwIBAgIURuSESLma...yyK1EHhxx\n-----END CERTIFICATE-----",
    "member_data": {
      "group": "",
      "identifier": "member0"
    },
    "public_encryption_key": null,
    "status": "Active"
  }
}
```