---
title: How to create verifiable credentials for self-asserted claims
description: Learn how to use the QuickStart to create custom credentials for self-issued
documentationCenter: ''
author: barclayn
manager: rkarlin
ms.service: decentralized-identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 06/22/2022
ms.author: barclayn

#Customer intent: As a verifiable credentials Administrator, I want to create a verifiable credential for self-asserted claims scenario
---

# How to create verifiable credentials for self-asserted claims

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

> [!IMPORTANT]
> Microsoft Entra Verified ID is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

A [rules definition](rules-and-display-definitions-model.md#rulesmodel-type) using the [selfIssued attestation](rules-and-display-definitions-model.md#selfissuedattestation-type) will produce an issuance flow where the user will be required to manually enter values for the claims in the Authenticator.  

## Create a Custom credential with the selfIssued attestation type

When you select + Add credential in the portal, you get the option to launch two QuickStarts. Select [x] Custom credential and select Next. 

![Screenshot of VC quickstart](media/how-to-use-quickstart/quickstart-startscreen.png)

In the next screen, you enter JSON for the Display and the Rules definitions and give the credential a type name. Select Create to create the credential.

![screenshot of create new credential section with JSON sample](media/how-to-use-quickstart/quickstart-create-new.png)

## Sample JSON Display definitions

The Display JSON definition is very much the same regardless of attestation type. You just have to adjust the labels depending on what claims your VC have. The expected JSON for the Display definitions is the inner content of the displays collection. The JSON is a collection, so if you want to support multiple locales, you add multiple entries with a comma as separator. 

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
        "claim": "vc.credentialSubject.displayName",
        "label": "Name",
        "type": "String"
      },
      {
        "claim": "vc.credentialSubject.companyName",
        "label": "Company",
        "type": "String"
      }
    ]
}
```

## Sample JSON Rules definitions

The JSON attestation definition should contain the **selfIssued** name and the claims mapping section. Since the claims are selfIssued, the value will be the same for the **outputClaim** and the **inputClaim**. The expected JSON for the Rules definitions is the inner content of the rules attribute, which starts with the attestation attribute. 

```json
{
  "attestations": {
    "selfIssued": {
      "mapping": [
        {
          "outputClaim": "displayName",
          "required": true,
          "inputClaim": "displayName",
          "indexed": false
        },
        {
          "outputClaim": "companyName",
          "required": true,
          "inputClaim": "companyName",
          "indexed": false
        }
      ],
      "required": false
    }
  }
}
```

## Claims input during issuance

During issuance, the Microsoft Authenticator will prompt the user to enter values for the specified claims. There's no validation of user input.

![selfIssued claims input](media/how-to-use-quickstart-selfissued\selfIssued-claims-input.png)

## Configure the samples to issue and verify your Custom credential

To configure your sample code to issue and verify using custom credentials, you need:

- Your tenant's issuer DID
- The credential type
- The manifest url to your credential. 

The easiest way to find this information for a Custom Credential is to go to your credential in the portal, select **Issue credential** and switch to Custom issue.

![Screenshot of QuickStart issue credential screen.](media/how-to-use-quickstart/quickstart-config-sample-1.png)

After switching to custom issue, you have access to a textbox with a JSON payload for the Request Service API. Replace the place holder values with your environment's information. The issuer’s DID is the authority value.

![Screenshot of Quickstart custom issue.](media/how-to-use-quickstart/quickstart-config-sample-2.png)

## Next steps

- Reference for [Rules and Display definitions model](rules-and-display-definitions-model.md)
