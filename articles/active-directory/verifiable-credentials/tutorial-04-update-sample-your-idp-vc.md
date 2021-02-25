---
title: Step 4 - Update Sample with your IDP VC and to use your Keyvault
description: Set up your own verifiable credentials issuer in Azure
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 02/23/2021
ms.author: barclayn

#Customer intent: As an administrator, I want the high-level steps that I should follow so that I can quickly start using verifiable credentials in my own Azure AD
#Source: https://hackmd.io/elQohpzlQaqj4ttZCicEfw
---

# Update Sample with your IDP VC and to use your Keyvault

From our last tutorial we should have the following values:

- Contract URI
- Application Client ID (the one for registering the Node app)
- Client secret 

There are a few other values we need to get in order to make the changes one time in our Sample app. Let's get those now!

## Verifiable Credentials Settings

Navigate to the Verifiable Credentials Settings and copy down the following values:

- Tenant identifier 
- Issuer identifier (your DID)
- Key vault (uri)

Under the Signing key identifier, there is a URI but we only need a portion of it. Copy from the part that says issuerSigningKeyION. 

Here is an example:

```
issuerSigningKeyIon-25e48331-508a-b026-55ee-ca87dc173104/aee901a18c814dcab1a6d202ac35a3f3
```

## DID Document 

There is one last piece of data and we need to retreive that from your DID document. 

Start up a browser and paste the following URL:

https://beta.discover.did.microsoft.com/1.0/identifiers/

Append at the end your Issuer identifier (DID)

Copy the json in the browser and open up the following link: https://jsonformatter.org/ 

The beautified JSON is your DID document. Please see the Resource on open standards to learn more about it, for now we are going to take an attribute we will need to add to our Sample app.

Under "verificationMethod" copy the id and label it as the kvSigningKeyId

```json=
"verificationMethod": [
      {
        "id": "#sig_25e48331",
```

Now we have everything we need to make the changes in our Sample code. 

- Issuer: app.js update const credential with your new contract uri
- Verifier: app.js update the issuerDid with your Issuer Identifier
- For both Issuer and Verifier, update the didconfig.json with the following values:


```json=
{
    "azTenantId": "Your tenant ID",
    "azClientId": "Your client ID",
    "azClientSecret": "Your client secret",
    "kvVaultUri": "your keyvault uri",
    "kvSigningKeyId": "The ID from your DID Document",
    "kvRemoteSigningKeyId" : "The snippet of the issuerSigningKeyION we copied ",
    "did": "Your DID"
}
```

Now you have everything in place to issuer and verify your own Verifiable Credential from your AAD with your own keys. 