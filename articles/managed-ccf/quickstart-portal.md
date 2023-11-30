---
title: Quickstart – Microsoft Azure Managed Confidential Consortium Framework with the Azure portal
description: Learn to deploy a Microsoft Azure Managed Confidential Consortium Framework resource through the Azure portal
author: msftsettiy
ms.author: settiy
ms.date: 09/08/2023
ms.service: confidential-ledger
ms.topic: quickstart
ms.custom: mode-ui
---

# Quickstart: Create an Azure Managed CCF resource using the Azure portal

Azure Managed CCF (Managed CCF) is a new and highly secure service for deploying confidential applications. For more information on Managed CCF, see [About Azure Managed Confidential Consortium Framework](overview.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

In this quickstart, you create a Managed CCF resource with the [Azure portal](https://portal.azure.com).

## Prerequisites

- [OpenSSL](https://www.openssl.org/) on a computer running Windows or Linux.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

### Register the provider

Register the `Managed CCF` feature in the `Microsoft.ConfidentialLedger` namespace following instructions at [Set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md).

Then, re-register the `Microsoft.ConfidentialLedger` resource provider as described in [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md).

### Create a resource group

[!INCLUDE [Create resource group](./includes/powershell-resource-group-create.md)]

### Create members

[!INCLUDE [Create members](includes/create-member.md)]

### Create a Managed CCF resource

1. From the Azure portal menu, or from the Home page, select **Create a resource**.

2. In the Search box, enter "Confidential Ledger", select said application, and then choose **Create**.

1. On the Create confidential ledger section, provide the following information:
    - **Subscription**: Choose the desired subscription.
    - **Resource Group**: Choose the resource group created in the previous step.
    - **Region**: In the pull-down menu, choose a region.
    - **Name**: Provide a unique name.
    - **Account Type**: Choose Custom CCF Application.
    - **Application Type**: Choose Custom JavaScript Application.
    - **Network Node Count**: Choose the desired node count.

:::image type="content" source="media/quickstart-tutorials/create-mccf-resource.png" alt-text="A screenshot of the Managed CCF create screen.":::

1. Select the **Security** tab.

1. You must add one or more members to the Managed CCF resource. Select **+ Add Member Identity**.
    - **Member Identifier**: A unique member name.
    - **Member Group**: An optional group name.
    - **Certificate**: Paste the contents of the member0_cert.pem file.

:::image type="content" source="media/quickstart-tutorials/create-mccf-resource-security-tab.png" alt-text="A screenshot of the Managed CCF resource security tab screen.":::

1. Select **Review + Create**. After validation has passed, select **Create**.1.

:::image type="content" source="media/quickstart-tutorials/create-mccf-resource-review-tab.png" alt-text="A screenshot of the Managed CCF resource review tab screen.":::

When the deployment is complete, select **Go to resource**.

:::image type="content" source="media/quickstart-tutorials/create-mccf-resource-overview-screen.png" alt-text="A screenshot of the Managed CCF resource properties screen.":::

Make a note of the following properties as it is required to activate the member(s).

- **Application endpoint**: In the example, this endpoint is `https://confidentialbillingapp.confidential-ledger.azure.com`.
- **Identity Service endpoint**: In the example, this endpoint is `https://identity.confidential-ledger.core.azure.com/ledgerIdentity/confidentialbillingapp`.

You will need these values to transact with the confidential ledger from the data plane.

### Clean up resources

Other Azure Managed CCF articles build upon this quickstart. If you plan to continue on to work with subsequent articles, you might wish to leave these resources in place.

When no longer needed, delete the resource group, which deletes the Managed CCF and related resources. To delete the resource group through the portal:

1. Enter the name of your resource group in the Search box at the top of the portal. When you see the resource group used in this quickstart in the search results, select it.

1. Select **Delete resource group**.

1. In the **TYPE THE RESOURCE GROUP NAME:** box, enter the name of the resource group, and select **Delete**.

## Next steps

In this quickstart, you created a Managed CCF resource by using the Azure portal. To learn more about Azure Managed CCF and how to integrate it with your applications, continue on to these articles:

- [Azure Managed CCF overview](overview.md)
- [Quickstart: Azure CLI](quickstart-cli.md)
- [How to: Activate members](how-to-activate-members.md)
