---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 03/25/2022
ms.author: msmbaldwin

# Generic CLI create resource group include for quickstarts.

---

1. Submit the application bundle present in *set_js_app.json* by creating a proposal.

```Bash
$ proposalid=$( (ccf_cose_sign1 --content set_js_app.json --signing-cert member0_cert.pem --signing-key member0_privk.pem --ccf-gov-msg-type proposal --ccf-gov-msg-created_at `date -Is` | curl https://confidentialbillingapp.confidential-ledger.azure.com/gov/proposals -H 'Content-Type: application/cose' --data-binary @- --cacert service_cert.pem | jq -r ‘.proposal_id’) )
```
2. The next step is to accept the proposal by submitting a vote.

```Bash
cat vote_accept.json
{
  "ballot": "export function vote (rawProposal, proposerId)\n
  {\n
    // Accepts any proposal\n
    return true;\n
  }"
}

ccf_cose_sign1 --content vote_accept.json --signing-cert member0_cert.pem --signing-key member0_privk.pem --ccf-gov-msg-type ballot --ccf-gov-msg-created_at `date -Is` --ccf-gov-msg-proposal_id $proposalid | curl https://confidentialbillingapp.confidential-ledger.azure.com/gov/proposals/$proposalid/ballots -H 'Content-Type: application/cose' --data-binary @- --cacert service_cert.pem
```
3. Repeat the above step for every member in the Managed CCF resource.