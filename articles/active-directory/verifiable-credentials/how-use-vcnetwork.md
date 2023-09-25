---
title: How to use the Microsoft Entra Verified ID Network
description: In this article, you learn how to use the Microsoft Entra Verified ID Network to verify credentials
documentationCenter: ''
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 07/28/2022
ms.author: barclayn

#Customer intent: As a verifiable credentials administrator, I want to configure verifying credentials from another party 
---

# Verifying credentials using the Microsoft Entra Verified ID Network

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]


## Prerequisites

To use the Microsoft Entra Verified ID Network, you need to have completed the following.

- Complete the [Getting Started](./verifiable-credentials-configure-tenant.md) and subsequent [tutorial set](./verifiable-credentials-configure-tenant.md).

<a name='what-is-the-entra-verified-id-network'></a>

## What is the Microsoft Entra Verified ID Network?

In our scenario, Proseware is a verifier. Woodgrove is the issuer. The verifier needs to know Woodgrove's issuer DID and the verifiable credential (VC) type that represents Woodgrove employees before it can create a presentation request for a verified credential for Woodgrove employees. The necessary information may come from some kind of manual exchange between the companies, but this approach would be both manual and complex. The Microsoft Entra Verified ID Network makes this process much easier. Woodgrove, as an issuer, can publish credential types to the Microsoft Entra Verified ID Network and Proseware, as the verifier, can search for published credential types and schemas in the Microsoft Entra Verified ID Network. Using this information, Woodgrove can create a [presentation request](presentation-request-api.md#presentation-request-payload) and easily invoke the Request Service API.
  
:::image type="content" source="media/decentralized-identifier-overview/did-overview.png" alt-text="Diagram of Microsoft DID implementation overview.":::


<a name='how-do-i-use-the-entra-verified-id-network'></a>

## How do I use the Microsoft Entra Verified ID Network?

1. In the start page of Microsoft Entra Verified ID in the Azure portal, you have a Quickstart named **Verification request**. Clicking on **start** will take you to a page where you can browse the Verifiable Credentials Network

    :::image type="content" source="media/how-use-vcnetwork/vcnetwork-quickstart.png" alt-text="Screenshot of the Verified ID Network Quickstart.":::

1. When you select on the **Select first issuer**, a panel opens on the right side of the screen where you can search for issuers by their linked domains. So if you are looking for something from Woodgrove, you just type `woodgrove` in the search textbox. When you select an issuer in the list, the available credential types will show in the lower part labeled Step 2. Check the type you want to use and select the Add button to get back to the first screen. If the expected linked domain isn't in the list it means that the linked domain isn't verified yet. If the list of credentials is empty, it means that the issuer has verified the linked domain but haven't published any credential types yet.

    :::image type="content" source="media/how-use-vcnetwork/vcnetwork-search-select.png" alt-text="Screenshot of Verified ID Network Search and select.":::

1. In the first screen we now have Woodgrove in the issuer list and the next step is to select the **Review** button. 

    :::image type="content" source="media/how-use-vcnetwork/vcnetwork-issuer-list.png" alt-text="Screenshot of verified ID Network list of issuers.":::

1. The Review screen displays a skeleton presentation request JSON payload for the Request Service API. The important pieces of information are the DID inside the **acceptedIssuers** collection and the **type** value. This information is needed to create a presentation request. The request prompts the user for a credential of a certain type issued by a trusted organization.

    :::image type="content" source="media/how-use-vcnetwork/vcnetwork-issuer-details.png" alt-text="Verified ID Network issuers details.":::

## How do I make my linked domain searchable?

Linked domains that are verified will be searchable. Unverified domains won't be searchable.

## How do I make my credential types visible in the list?

Each credential type that is created has an attribute named `availableInVcDirectory` that makes it visible in the list. You can update this attribute to make the credential type visible or not. See [Admin API reference](admin-api.md#contract-type).

## What is public when a credential type is made visible?

When you make a credential type available in the Microsoft Entra Verified ID Network, only the **issuing DID**, the credential **type** and its **schema** are made public. Important to note is that this information was already public before making it visible due to how decentralized identities work. Making the credential type visible is just making it searchable in the Microsoft Entra Verified ID Network.  

## Next steps

For more information, see:

- [Learn how to verify Microsoft Entra Verified ID credentials](verifiable-credentials-configure-verifier.md).
- [Presentation API specification](presentation-request-api.md)
