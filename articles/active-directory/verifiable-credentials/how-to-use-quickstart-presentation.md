---
title: Issue verifiable credentials by presenting claims from an existing verifiable credential
description: Learn how to use a quickstart to create custom credentials for from other VC attestation
documentationCenter: ''
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 07/06/2022
ms.author: barclayn

#Customer intent: As a verifiable credentials administrator, I want to create a verifiable credential for self-asserted claims scenario. 
---

# Issue verifiable credentials by presenting claims from an existing verifiable credential

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

A [rules definition](rules-and-display-definitions-model.md#rulesmodel-type) that uses the [presentations attestation](rules-and-display-definitions-model.md#verifiablepresentationattestation-type) type produces an issuance flow where you want the user to present another verifiable credential in the wallet during issuance and where claim values for issuance of the new credential are taken from the presented credential. An example of this can be when you present your VerifiedEmployee credential to get a visitors pass credential.

## Create a custom credential with the presentations attestation type

In the Azure portal, when you select **Add credential**, you get the option to launch two quickstarts. Select **custom credential**, and then select **Next**. 

:::image type="content" source="media/how-to-use-quickstart/quickstart-startscreen.png" alt-text="Screenshot of the 'Issue credentials' quickstart for creating a custom credential.":::

On the **Create a new credential** page, enter the JSON code for the display and the rules definitions. In the **Credential name** box, give the credential a name. This name is just an internal name for the credential in the portal. The type name of the credential is defined in the `vc.type` property name in the rules definition. To create the credential, select **Create**.

:::image type="content" source="media/how-to-use-quickstart/quickstart-create-new.png" alt-text="Screenshot of the 'Create a new credential' page, displaying JSON samples for the display and rules files.":::

## Sample JSON display definitions

The JSON display definition is nearly the same, regardless of attestation type. You only have to adjust the labels according to the claims that your verifiable credential has. The expected JSON for the display definitions is the inner content of the displays collection. The JSON is a collection, so if you want to support multiple locales, add multiple entries with a comma as separator. 

```json
{
  "locale": "en-US",
  "card": {
    "backgroundColor": "#000000",
    "description": "Use your verified credential to prove to anyone that you know all about verifiable credentials.",
    "issuedBy": "Microsoft",
    "textColor": "#ffffff",
    "title": "Verified Credential Expert",
    "logo": {
      "description": "Verified Credential Expert Logo",
      "uri": "https://didcustomerplayground.blob.core.windows.net/public/VerifiedCredentialExpert_icon.png"
    }
  },
  "consent": {
    "instructions": "Present your True Identity card to issue your VC",
    "title": "Do you want to get your Verified Credential?"
  },
  "claims": [
    {
      "claim": "vc.credentialSubject.firstName",
      "label": "First name",
      "type": "String"
    },
    {
      "claim": "vc.credentialSubject.lastName",
      "label": "Last name",
      "type": "String"
    }
  ]
}
```

## Sample JSON rules definitions

The JSON attestation definition should contain the **presentations** name. The **inputClaim** in the mapping section defines what claims should be captured in the credential the user presents. They need to have the prefix `$.vc.credentialSubject`. The **outputClaim** defined the name of the claims in the credential being issued. 

The following rules definition will ask the user to present the **True Identity** credential during issuance. This credential comes from the [public demo application](https://woodgroveemployee.azurewebsites.net/). 

```json
{
  "attestations": {
    "presentations": [
      {
        "mapping": [
          {
            "outputClaim": "firstName",
            "required": true,
            "inputClaim": "$.vc.credentialSubject.firstName",
            "indexed": false
          },
          {
            "outputClaim": "lastName",
            "required": true,
            "inputClaim": "$.vc.credentialSubject.lastName",
            "indexed": false
          }
        ],
        "required": false,
        "credentialType": "TrueIdentity",
        "contracts": [
          "https://verifiedid.did.msidentity.com/v1.0/tenants/3c32ed40-8a10-465b-8ba4-0b1e86882668/verifiableCredentials/contracts/M2MzMmVkNDAtOGExMC00NjViLThiYTQtMGIxZTg2ODgyNjY4dHJ1ZSBpZGVudGl0eSBwcm9k/manifest"
        ],
        "trustedIssuers": [
          "did:ion:EiDXOEH-YmaP2ZvxoCI-lA5zT1i5ogjgH6foIc2LFC83nQ:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJzaWdfODEwYmQ1Y2EiLCJwdWJsaWNLZXlKd2siOnsiY3J2Ijoic2VjcDI1NmsxIiwia3R5IjoiRUMiLCJ4IjoiRUZwd051UDMyMmJVM1dQMUR0Smd4NjdMMENVVjFNeE5peHFQVk1IMkw5USIsInkiOiJfZlNUYmlqSUpqcHNxTDE2Y0lFdnh4ZjNNYVlNWThNYnFFcTA2NnlWOWxzIn0sInB1cnBvc2VzIjpbImF1dGhlbnRpY2F0aW9uIiwiYXNzZXJ0aW9uTWV0aG9kIl0sInR5cGUiOiJFY2RzYVNlY3AyNTZrMVZlcmlmaWNhdGlvbktleTIwMTkifV0sInNlcnZpY2VzIjpbeyJpZCI6ImxpbmtlZGRvbWFpbnMiLCJzZXJ2aWNlRW5kcG9pbnQiOnsib3JpZ2lucyI6WyJodHRwczovL2RpZC53b29kZ3JvdmVkZW1vLmNvbS8iXX0sInR5cGUiOiJMaW5rZWREb21haW5zIn0seyJpZCI6Imh1YiIsInNlcnZpY2VFbmRwb2ludCI6eyJpbnN0YW5jZXMiOlsiaHR0cHM6Ly9iZXRhLmh1Yi5tc2lkZW50aXR5LmNvbS92MS4wLzNjMzJlZDQwLThhMTAtNDY1Yi04YmE0LTBiMWU4Njg4MjY2OCJdfSwidHlwZSI6IklkZW50aXR5SHViIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlCUlNqWlFUYjRzOXJzZnp0T2F3OWVpeDg3N1l5d2JYc2lnaFlMb2xTSV9KZyJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpQXZDTkJoODlYZTVkdUk1dE1wU2ZyZ0k2aVNMMmV2QS0tTmJfUElmdFhfOGciLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUN2RFdOTFhzcE1sbGJfbTFJal96ZV9SaWNKOWdFLUM1b2dlN1NnZTc5cy1BIn19"
        ]
      }
    ]
  },
  "validityInterval": 2592001,
  "vc": {
    "type": [
      "VerifiedCredentialExpert"
    ]
  }
}
```

| Property | Type | Description |
| -------- | -------- | -------- |
|`credentialType`| string | credential type being requested during issuance. `TrueIdentity` in the above example. |
|`contracts` | string (array) | list of manifest URL(s) of credentials being requested. In the above example, the manifest URL is the manifest for `True Identity` |
| `trustedIssuers` | string (array) | a list of allowed issuer DIDs for the credential being requested. In the above example, the DID is the DID of the `True Identity`issuer. |

Values

## Authenticator experience during issuance

During issuance, Authenticator prompts the user to select a matching credential. If the user has multiple matching credentials in the wallet, the user must select which one to present.

:::image type="content" source="media/how-to-use-quickstart-presentation/issue-presentation.png" alt-text="Screenshot of presentations claims input.":::

## Configure the samples to issue your custom credential

To configure your sample code to issue and verify your custom credential, you need:

- Your tenant's issuer decentralized identifier (DID)
- The credential type
- The manifest URL to your credential 

The easiest way to find this information for a custom credential is to go to your credential in the Azure portal. Select **Issue credential**. Then you have access to a text box with a JSON payload for the Request Service API. Replace the placeholder values with your environment's information. The issuer’s DID is the authority value.

:::image type="content" source="media/how-to-use-quickstart/quickstart-config-sample-2.png" alt-text="Screenshot of the quickstart custom credential issue.":::

## Next steps

See the [Rules and display definitions reference](rules-and-display-definitions-model.md).