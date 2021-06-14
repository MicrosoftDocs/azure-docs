---
title: How to Revoke a Verifiable Credential as an Issuer - Azure Active Directory Verifiable Credentials
description: Learn how to revoke a Verifiable Credential that you've issued
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: active-directory
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 04/01/2021
ms.author: barclayn

#Customer intent: As an administrator, I am trying to learn the process of revoking verifiable credentials that I have issued
---

# Revoke a previously issued verifiable credential (Preview)

As part of the process of working with verifiable credentials (VCs), you not only have to issue credentials, but sometimes you also have to revoke them. In this article we go over the **Status** property part of the VC specification and take a closer look at the revocation process, why we may want to revoke credentials and some data and privacy implications.

> [!IMPORTANT]
> Azure Active Directory Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Status property in verifiable credentials specification

Before we can understand the implications of revoking a verifiable credential, it may help to know what the **status check** is and how it works today.

The [W3C Verifiable Credentials spec](https://www.w3.org/TR/vc-data-model/) references the **status** property in section [4.9:](https://www.w3.org/TR/vc-data-model/#status)

"This specification defines the following **credentialStatus** property for the discovery of information about the current status of a verifiable credential, such as whether it is suspended or revoked."

However, the W3C specification does not define a format on how **status check** should be implemented.

"Defining the data model, formats, and protocols for status schemes are out of scope for this specification. A Verifiable Credential Extension Registry [VC-EXTENSION-REGISTRY] exists that contains available status schemes for implementers who want to implement verifiable credential status checking."

>[!NOTE]
>For now, Microsoft's status check implementation is proprietary but we are actively working with the DID community to align on a standard.

## How does the **status** property work?

In every Microsoft issued verifiable credential, there is an attribute called credentialStatus. It's populated with a status API that Microsoft manages on your behalf. Here is an example of what it looks like.

```json
    "credentialStatus": {
      "id": "https://portableidentitycards.azure-api.net/v1.0/7952032d-d1f3-4c65-993f-1112dab7e191/portableIdentities/card/status",
      "type": "PortableIdentityCardServiceCredentialStatus2020"
    }
```

The open source Verifiable Credentials SDK handles calling the status API and providing the necessary data.

Once the API is called and provided the right information, the API will return either a True or False. True being the verifiable credential is still active with the Issuer and False signifying the verifiable credential has been actively revoked by the Issuer.

## Why you may want to revoke a VC?

Each customer will have their own unique reason's for wanting to revoke a verifiable credential, but here are some of the common themes we have heard thus far. 

- Student ID: the student is no longer an active student at the University.
- Employee ID: the employee is no longer an active employee.
- State Drivers License: the driver no longer lives in that state.

## How to set up a verifiable credential with the ability to revoke

All verifiable credential data is not stored with Microsoft by default. Therefore, we do not have any data to reference to revoke a specific verifiable credential ID. The issuer needs to specify a specific field from the verifiable credential attribute for Microsoft to index and subsequently salt and hash.

>[!NOTE]
>Hashing is a one way cryptographic operation that turns an input, called a ```preimage```, and produces an output called a hash that has a fixed length. It is not computationally feasible at this time to reverse a hash operation.

You can tell Microsoft which attribute of the verifiable credential you would like to index. The implication of indexing is that indexed values may be used to search your verifiable credentials for the VCs you want to revoke.

**Example:** Alice is a Woodgrove employee. Alice left Woodgrove to work at Contoso. Jane, the IT admin for Woodgrove, searches for Alice's email in the Verifiable Credentials Revoke search query. In this example, Jane, indexed the email field of the Woodgrove verified employee credential. 

See below for an example of how the Rules file is modified to include the index.

```json
{
  "attestations": {
    "idTokens": [
      { 
        "mapping": {
          "Name": { "claim": "name" },
          "email": { "claim": "email", "indexed": true}
        },
        "configuration": "https://login.microsoftonline.com/tenant-id-here7/v2.0/.well-known/openid-configuration",
        "client_id": "c0d6b785-7a08-494e-8f63-c30744c3be2f",
        "redirect_uri": "vcclient://openid"
      }
    ]
  },
  "validityInterval": 25920000,
  "vc": {
    "type": ["WoodgroveEmployee"]
  }
}
```

>[!NOTE]
>Only one attribute can be indexed from a Rules file.  

## How do I revoke a verifiable credential

Once an index claim has been set and verifiable credentials have been issued to your users, it's time to see how you can revoke a verifiable credential in the VC blade.

1. Navigate to the verifiable credentials blade in Azure Active Directory.
1. Choose the verifiable credential where you've previously set up the index claim and issued a verifiable credential to a user. =
1. On the left-hand menu, choose **Revoke a credential**
   ![Revoke a credential](media/how-to-issuer-revoke/settings-revoke.png) 
1. Search for the index attribute of the user you want to revoke. 

   ![Find the credential to revoke](media/how-to-issuer-revoke/revoke-search.png)

    >[!NOTE]
    >Since we are only storing a hash of the indexed claim from the verifiable credential, only an exact match will populate the search results. We take the input as searched by the IT Admin and we use the same hashing algorithm to see if we have a hash match in our database.
    
1. Once you've found a match, select the **Revoke** option to the right of the credential you want to revoke.

   ![A warning letting you know that after revocation the user still has the credential](media/how-to-issuer-revoke/warning.png) 

1. After successful revocation you see the status update and a green banner will appear at the top of the page. 
   ![Verify this domain in settings](media/how-to-issuer-revoke/revoke-successful.png) 

Now whenever a relying party calls to check the status of this specific verifiable credential, Microsoft's status API, acting on behalf of the tenant, returns a 'false' response.

## Next steps

Test out the functionality on your own with a test credential to get used to the flow. You can see information on how to configure your tenant to issue verifiable credentials by [reviewing our tutorials](get-started-verifiable-credentials.md).