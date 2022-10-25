---
title: Create verifiable credentials for an ID token hint
description: In this article, you learn how to use a quickstart to create a custom verifiable credential for an ID token hint.
documentationCenter: ''
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 07/06/2022
ms.author: barclayn

#Customer intent: As a verifiable credentials administrator, I want to create a verifiable credential for the ID token hint scenario. 
---

# Create verifiable credentials for ID token hint

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

A [rules definition](rules-and-display-definitions-model.md#rulesmodel-type) that uses the [idTokenHint attestation](rules-and-display-definitions-model.md#idtokenhintattestation-type) produces an issuance flow where the relying party application passes claim values in the [issuance request payload](issuance-request-api.md#issuance-request-payload). It is the relying party application's responsibility to ensure that required claim values are passed in the request. How the claim values are gathered is up to the application. 

## Create a custom credential

In the Azure portal, when you select **Add credential**, you get the option to launch two quickstarts. Select **custom credential**, and then select **Next**. 

![Screenshot of the "Issue credentials" quickstart for creating a custom credential.](media/how-to-use-quickstart/quickstart-startscreen.png)

On the **Create a new credential** page, enter the JSON code for the rules and display definitions. In the **Credential name** box, give the credential a type name. To create the credential, select **Create**.

![Screenshot of the "Create a new credential" page, displaying JSON samples for the rules and display files.](media/how-to-use-quickstart/quickstart-create-new.png)

## Sample JSON display definitions

The expected JSON for the display definitions is the inner content of the displays collection. The JSON is a collection, so if you want to support multiple locales, you add multiple entries, with a comma as a separator.

```json
{
    "locale": "en-US",
    "card": {
      "title": "Verified Credential Expert",
      "issuedBy": "Microsoft",
      "backgroundColor": "#000000",
      "textColor": "#ffffff",
      "logo": {
        "uri": "https://didcustomerplayground.blob.core.windows.net/public/VerifiedCredentialExpert_icon.png",
        "description": "Verified Credential Expert Logo"
      },
      "description": "Use your verified credential to prove to anyone that you know all about verifiable credentials."
    },
    "consent": {
      "title": "Do you want to get your Verified Credential?",
      "instructions": "Sign in with your account to get your card."
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

The expected JSON for the rules definitions is the inner content of the rules attribute, which starts with the attestation attribute.

```json
{
      "attestations": {
        "idTokenHints": [
          {
            "mapping": [
              {
                "outputClaim": "firstName",
                "required": true,
                "inputClaim": "$.given_name",
                "indexed": false
              },
              {
                "outputClaim": "lastName",
                "required": true,
                "inputClaim": "$.family_name",
                "indexed": false
              }
            ],
            "required": false
          }
        ]
      },
      "validityInterval":  2592000,
      "vc": {
        "type": [
          "VerifiedCredentialExpert"
        ]
      }
}
```


## Configure the samples to issue and verify your custom credential

To configure your sample code to issue and verify by using custom credentials, you need:

- Your tenant's issuer decentralized identifier (DID)
- The credential type
- The manifest URL to your credential 

The easiest way to find this information for a custom credential is to go to your credential in the Azure portal. Select **Issue credential**. There you have access to a text box with a JSON payload for the Request Service API. Replace the placeholder values with your environment's information. The issuer’s DID is the authority value.

![Screenshot of the quickstart custom credential issue.](media/how-to-use-quickstart/quickstart-config-sample-2.png)

## Next steps

For more information, see:
- [Rules and display definitions reference](rules-and-display-definitions-model.md)