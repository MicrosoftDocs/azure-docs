---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 09/13/2023
ms.author: msmbaldwin

# Prerequites include for quickstarts and how to guides for registering the Microsoft.ConfidentialLedger provider.

---

```Bash
cat vote_accept.json
{
  "ballot": "export function vote (rawProposal, proposerId)\n
  {\n
    // Accepts any proposal\n
    return true;\n
  }"
}

ccf_cose_sign1 --content vote_accept.json --signing-cert member0_cert.pem --signing-key member0_privk.pem --ccf-gov-msg-type ballot --ccf-gov-msg-created_at `date -Is` --ccf-gov-msg-proposal_id $proposal_id | curl https://confidentialbillingapp.confidential-ledger.azure.com/gov/proposals/$proposal_id/ballots -H 'Content-Type: application/cose' --data-binary @- --cacert service_cert.pem
```