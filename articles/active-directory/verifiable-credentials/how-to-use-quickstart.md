---
title: How to create credentials using the Quickstart
description: Learn how to use the Quickstart to create custom credentials
documentationCenter: ''
author: barclayn
manager: rkarlin
ms.service: decentralized-identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 06/08/2022
ms.author: barclayn

#Customer intent: As an administrator, I am looking for information to help me disable 
---

# How to create credentials using the Quickstart

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

> [!IMPORTANT]
> Azure Active Directory Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- Complete verifiable credentials onboarding.

## What is the Quickstart?

Azure AD verifiable Credentials now comes with a quickstart in the portal for creating custom credentials. This means no more editing and uploading of Display and Rules files to Azure Storage. Instead you enter all details in the portal and create the credential in one page. For custom credentials, this means you provide the Display and Rules definition in JSON documents. These definitions are now stored together with the credential details. 

## Create a Custom credential

When you select + Add credential in the portal, you get the option to launch two Quickstarts. Select [x] Custom credential and click Next. 

![Quickstart start screen](media/how-to-use-quickstart/quickstart-startscreen.png)

In the next screen, you enter JSON for the Display and the Rules definitions and give the credential a type name. Click Create to create the credential.

![Quickstart create new credential](media/how-to-use-quickstart/quickstart-create-new.png)

## Sample JSON Display definitions

The expected JSON for the Display definitions is the inner content of the displays collection. The JSON is a collection, so if you want to support multiple locales, you add multiple entries with a comma as separator.

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

## Sample JSON Rules definitions

The expected JSON for the Rules definitions is the inner content of the rules attribute, which starts with the attestation attribute.

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
      }
}
```

## Configure the samples to issue and verify your Custom credential

To configure your sample code deployment to issue and verify your custom credentials you need your issuer DID for your tenant, the credential type and the manifest url to your credential. The easiest way to find this for a Custom Credential is to go to your credential in the portal, select Issue credential and switch to Custom issue.

![Quickstart custom issue](media/how-to-use-quickstart/quickstart-config-sample-1.png)

This will bring up a textbox with a skeleton JSON payload for the Request Service API. There you have these value that you can copy and paste to your sample deployment’s configuration files. Issuer’s DID is the authority value.

![Quickstart custom issue](media/how-to-use-quickstart/quickstart-config-sample-2.png)

## Next steps

- Reference for [Rules and Display definitions model](rules-and-display-definitions-model.md)