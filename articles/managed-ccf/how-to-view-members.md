---
title: View the members in an Azure Managed CCF resource
description: Learn to view the members in an Azure Managed CCF resource
author: msftsettiy
ms.author: settiy
ms.date: 09/11/2023
ms.service: confidential-ledger
ms.topic: how-to
---

# View the members in an Azure Managed CCF resource

The members in an Azure Managed CCF(Managed CCF) resource can be viewed on the Azure portal or via CLI. This tutorial builds on the Managed CCF resource created in the [Quickstart: Create an Azure Managed CCF resource](quickstart-portal.md) tutorial.

## Download the service identity

[!INCLUDE [Download Service Identity](./includes/service-identity.md)]

## View the members

### Azure portal

1. Navigate to the Managed CCF resource page.

1. Under Operations, select the Members link. This is a view only page. To manage the members, follow the instructions at [manage members](how-to-manage-members.md).

:::image type="content" source="./media/how-to/members.png" lightbox="./media/how-to/members.png" alt-text="A screenshot showing the members in a Managed CCF resource.":::

### Command Line Interface

```bash
curl --cacert service_cert.pem https://confidentialbillingapp.confidential-ledger.azure.com/gov/members | jq
{
  "3d08a5ddcb6fe939088b3f8f55040d069ba2f73e1946739b2a30910d7c60b011": {
    "cert": "-----BEGIN CERTIFICATE-----\nMIIBtjCCATyg...zWP\nGeRSybu3EpITPg==\n-----END CERTIFICATE-----",
    "member_data": {
      "group": "IT",
      "identifier": "member0"
    },
    "public_encryption_key": null,
    "status": "Active"
  },
  "9a403f4811f3e3a5eb21528088d6619ad7f6f839405cf737b0e8b83767c59039": {
    "cert": "-----BEGIN CERTIFICATE-----\nMIIB9zCCAX2gAwIBAgIQeA...lf8wPx0uzNRc1iGM+mv\n-----END CERTIFICATE-----",
    "member_data": {
      "is_operator": true,
      "owner": "Microsoft Azure"
    },
    "public_encryption_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhki...DAQAB\n-----END PUBLIC KEY-----\n",
    "status": "Active"
  }
}
```

The output shows two active members in the resource. One is an operator member (identified by the is_operator field) and the other was added during deployment. An active member can submit a proposal to add or remove other members. Refer to the [how-to-manage-members](how-to-manage-members.md) guide for the instructions.

## Next steps

- [Azure Managed CCF overview](overview.md)
- [Quickstart: Deploy an Azure Managed CCF application](quickstart-deploy-application.md)
- [How to: View application logs in Azure Monitor](how-to-enable-azure-monitor.md)
- [How to: Activate members](how-to-activate-members.md)
