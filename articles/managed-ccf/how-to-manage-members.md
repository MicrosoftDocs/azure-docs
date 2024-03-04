---
title: Quickstart – Add and remove members from a Microsoft Azure Managed CCF resource
description: Learn to manage the members from a Microsoft Azure Managed CCF resource
author: msftsettiy
ms.author: settiy
ms.date: 09/10/2023
ms.service: confidential-ledger
ms.topic: how-to
---

# Add and remove members from an Azure Managed CCF resource

Members can be added and removed from an Azure Managed CCF (Managed CCF) resource using governance operations. This tutorial builds on the Managed CCF resource created in the [Quickstart: Create an Azure Managed CCF resource using the Azure portal](quickstart-portal.md) tutorial.

## Prerequisites

[!INCLUDE [Prerequisites](./includes/proposal-prerequisites.md)]

## Download the service identity

[!INCLUDE [Download Service Identity](./includes/service-identity.md)]

[!INCLUDE [Mac instructions](./includes/macos-instructions.md)]

## Add a member

[!INCLUDE [Create a member identity](./includes/create-member.md)]

1. Submit a proposal to add the member.
    ```bash
    $cat set_member.json
    {
      "actions": [
        {
          "name": "set_member",
          "args": {
            "cert": "-----BEGIN CERTIFICATE-----\nMIIBtDCCATqgAwIBAgIUV...sy93h74oqHk=\n-----END CERTIFICATE-----",
            "encryption_pub_key": ""
          }
        }
      ]
    }
    
    $ proposal_id=$( (ccf_cose_sign1 --content set_member.json --signing-cert member0_cert.pem --signing-key member0_privk.pem --ccf-gov-msg-type proposal --ccf-gov-msg-created_at `date -Is` | curl https://confidentialbillingapp.confidential-ledger.azure.com/gov/proposals -H 'Content-Type: application/cose' --data-binary @- --cacert service_cert.pem) )
    ```
1. Accept the proposal by submitting a vote. Repeat the step for all the members in the resource.
    [!INCLUDE [Submit a vote](./includes/submit-vote.md)]
1. When the command completes, the member is added in the Managed CCF resource. But, they cannot participate in the governance operations unless they are activated. Refer to the quickstart tutorial [Activate a member](how-to-activate-members.md) to activate the member.
1. View the members in the network using the following command.

[!INCLUDE [View members](./includes/view-members.md)]

## Remove a member

1. Submit a proposal to remove the member. The member is identified by their public certificate.
    ```bash
    $cat remove_member.json
    {
      "actions": [
        {
          "name": "remove_member",
          "args": {
            "cert": "-----BEGIN CERTIFICATE-----\nMIIBtDCCATqgAwIBAgIUV...sy93h74oqHk=\n-----END CERTIFICATE-----",
          }
        }
      ]
    }
    
    $ proposal_id=$( (ccf_cose_sign1 --content remove_member.json --signing-cert member0_cert.pem --signing-key member0_privk.pem --ccf-gov-msg-type proposal --ccf-gov-msg-created_at `date -Is` | curl https://confidentialbillingapp.confidential-ledger.azure.com/gov/proposals -H 'Content-Type: application/cose' --data-binary @- --cacert service_cert.pem) )
    ```
2. Accept the proposal by submitting a vote. Repeat the step for all the members in the resource.
    [!INCLUDE [Submit a vote](./includes/submit-vote.md)]
3. When the command completes, the member is removed from the Managed CCF resource and they can no longer participate in the governance operations.
4. View the members in the network using the following command.

[!INCLUDE [View members](./includes/view-members.md)]

## Next steps

- [Microsoft Azure Managed CCF overview](overview.md)
- [Quickstart: Deploy an Azure Managed CCF application](quickstart-deploy-application.md)
- [How to: Activate members](how-to-activate-members.md)
