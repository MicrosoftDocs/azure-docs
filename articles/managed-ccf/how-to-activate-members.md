---
title: Activate members in an Azure Managed CCF resource
description: Learn to activate the members in an Azure Managed CCF resource
author: msftsettiy
ms.author: settiy
ms.date: 09/08/2023
ms.service: confidential-ledger
ms.topic: how-to
ms.custom:
---

# Activate members in an Azure Managed CCF resource

In this guide, you will learn how to activate the member(s) in an Azure Managed CCF (Managed CCF) resource. This tutorial builds on the Managed CCF resource created in the [Quickstart: Create an Azure Managed CCF resource using the Azure portal](quickstart-portal.md) tutorial.

## Prerequisites

- Python 3+.
- Install the latest version of the [CCF Python package](https://pypi.org/project/ccf/).

## Download the service identity

[!INCLUDE [Download Service Identity](./includes/service-identity.md)]

## Activate Member(s)

When a member is added to a Managed CCF resource, they are in the accepted state. They cannot participate in governance until they are activated. To do so, the member must acknowledge that they are satisfied with the state of the service (for example, after auditing the current constitution and the nodes currently trusted).

1. The member must update and retrieve the latest state digest. In doing so, the new member confirms that they are satisfied with the current state of the service.

```Bash
curl https://confidentialbillingapp.confidential-ledger.azure.com/gov/ack/update_state_digest -X POST --cacert service_cert.pem --key member0_privk.pem --cert member0_cert.pem --silent | jq > request.json
cat request.json
{
    "state_digest": <...>
}
```

[!INCLUDE [Mac instructions](./includes/macos-instructions.md)]

2. The member must sign the state digest using the ccf_cose_sign1 utility. This utility is installed along with the CCF Python package.

```Bash
ccf_cose_sign1 --ccf-gov-msg-type ack --ccf-gov-msg-created_at `date -Is` --signing-key member0_privk.pem --signing-cert member0_cert.pem --content request.json | \
 curl https://confidentialbillingapp.confidential-ledger.azure.com/gov/ack --cacert service_cert.pem --data-binary @- -H "content-type: application/cose"
```

3. After the command completes, the member is active and can participate in governance. The members can be viewed using the following command.

[!INCLUDE [View members](./includes/view-members.md)]

## Next steps

- [Azure Managed CCF overview](overview.md)
- [Quickstart: Create an Azure Managed CCF resource](quickstart-portal.md)
- [Quickstart: Deploy an Azure Managed CCF application](quickstart-deploy-application.md)
