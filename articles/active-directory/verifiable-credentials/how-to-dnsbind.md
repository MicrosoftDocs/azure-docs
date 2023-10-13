---
title: Link your Domain to your Decentralized Identifier (DID) - Microsoft Entra Verified ID
description: Learn how to DNS Bind?
documentationCenter: ''
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 06/22/2022
ms.author: barclayn

#Customer intent: Why are we doing this?
---

# Verify domain ownership to your Decentralized Identifier (DID)

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]


## Prerequisites

To verify domain ownership to your DID, you need to have completed the following.

- Complete the [Getting Started](./verifiable-credentials-configure-tenant.md) and subsequent [tutorial set](./verifiable-credentials-configure-tenant.md).

## Verify domain ownership and distribute did-configuration.json file

The domain you verify ownership of to your DID is defined in the [overview section](verifiable-credentials-configure-tenant.md#set-up-verified-id). The domain needs to be a domain under your control and it should be in the format `https://www.example.com/`. 

1. From the Azure portal, navigate to the VerifiedID page.

1. Select **Setup**, then **Verify domain ownership** and choose **Verify** for the domain

1. Copy or download the `did-configuration.json` file.

   ![Screenshot of download well-known config.](media/how-to-dnsbind/verify-download.png) 

1. Host the `did-configuration.json` file at the location specified. Example: If you specified domain `https://www.example.com` the file need to be hosted at this URL `https://www.example.com/.well-known/did-configuration.json`.
There can be no additional path in the URL other than the `.well-known path` name.

1. When the `did-configuration.json` is publicly available at the .well-known/did-configuration.json URL, verify it by pressing the **Refresh verification status** button.

   ![Screenshot of verified well-known config.](media/how-to-dnsbind/verify-download-verified.png) 

1. Test out issuing or presenting with Microsoft Authenticator to validate. Make sure the setting in Authenticator 'Warn about unsafe apps' is toggled on.

>[!NOTE]
>By default, 'Warn about unsafe apps' is turned on.

## How can I verify that the verification is working?

The portal verifies that the `did-configuration.json` is reachable over public internet and valid when you click the **Refresh verification status** button. Microsoft Authenticator does not honor http redirects. You should also consider verifying that you can request that URL in a browser to avoid errors like not using https, a bad SSL certificate or the URL not being public. If the `did-configuration.json` file can't be requested anonymously in a browser or via tools such as `curl`, without warnings or errors, the portal can't complete the **Refresh verification status** step either.

>[!NOTE]
> If you are experiencing problems refreshing your verification status, you can troubleshoot it via running `curl -Iv https://yourdomain.com/.well-known/did-configuration.json` on an machine with Ubuntu OS. Windows Subsystem for Linux with Ubuntu will work too. If curl fails, refreshing the verification status will not work.

## Why do we need to verify domain ownership of our DID?

A DID starts out as an identifier that isn't anchored to existing systems. A DID is useful because a user or organization can own it and control it. If an entity interacting with the organization doesn't know 'who' the DID belongs to, then the DID isn't as useful.

Linking a DID to a domain solves the initial trust problem by allowing any entity to cryptographically verify the relationship between a DID and a Domain.

## How does VerifiedID link DIDs and domains?

VerifiedID follows the [Well-Known DID configuration](https://identity.foundation/.well-known/resources/did-configuration/) specification when creating the link. The verifiable credentials service links your DID and domain. The service includes the domain information that you provided in your DID, and generates the well-known config file:

1. VerifiedID uses the domain information you provide during organization setup to write a Service Endpoint within the DID Document. All parties who interact with your DID can see the domain your DID proclaims to be associated with.  
  
    ```json
    "service": [
      {
        "id": "#linkeddomains",
        "type": "LinkedDomains",
        "serviceEndpoint": {
          "origins": [
            "https://www.contoso.com/"
          ]
        }
      }
    ]
    ```

2. The verifiable credential service in VerifiedID generates a compliant well-known configuration resource that you must host on your domain. The configuration file includes a self-issued verifiable credential of credentialType `DomainLinkageCredential`, signed with your DID, that has an origin of your domain. Here's an example of the config doc that is stored at the root domain URL.


    ```json
    {
      "@context": "https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld",
      "linked_dids": [
        "jwt..."
      ]
    }
    ```

## User experience in the wallet

When a user is going through an issuance flow or presenting a verifiable credential, they should know something about the organization and its DID. Microsoft Authenticator, validates a DID's relationship with the domain in the DID document and presents users with two different experiences depending on the outcome.

## Verified domain

Before Microsoft Authenticator displays a **Verified** icon, a few things need to be true:

* The DID signing the self-issued open ID (SIOP) request must have a Service endpoint for Linked Domain.
* The root domain doesn't use a redirect and uses https.
* The domain listed in the DID Document has a resolvable well-known resource.
* The well-known resource's verifiable credential is signed with the same DID that was used to sign the SIOP that Microsoft Authenticator used to kick start the flow.

If all of the previously mentioned are true, then Microsoft Authenticator displays a verified page and includes the domain that was validated.

![Screenshot of new permission request.](media/how-to-dnsbind/new-permission-request.png) 

## Unverified domain

If any of the above aren't true, Microsoft Authenticator displays a full page warning to the user indicating that the domain is unverified. The user is warned that they are in the middle of a potential risky transaction and they should proceed with caution. We have chosen to take this route because:

* The DID is either not anchored to a domain.
* The configuration wasn't set up properly.
* The DID that the user is interacting with could be malicious and actually can't prove that they own the domain linked. 

It is of high importance that you link your DID to a domain recognizable to the user.

![Screenshot of unverified domain warning in the add credential screen.](media/how-to-dnsbind/add-credential-not-verified-authenticated.png)

## How do you update the linked domain on your DID?

With the Web trust system, updating your linked domain isn't supported. You have to opt out and re-onboard.

## Linked Domain domain made easy for developers

The easiest way for a developer to get a domain to use for linked domain is to use Azure Storage's static website feature. You can't control what the domain name is, other than it contains your storage account name as part of it's hostname.

Follow these steps to quickly set up a domain to use for Linked Domain:

1. Create an **Azure Storage account**. During storage account creation, choose StorageV2 (general-purpose v2 account) and Locally redundant storage (LRS).
1. Go to that Storage Account and select **Static website** in the left hand menu and enable static website. If you can't see the **Static website** menu item, you didn't create a **V2** storage account.
1. Copy the primary endpoint name that appears after saving. This value is your domain name. It looks something like `https://<your-storageaccountname>.z6.web.core.windows.net/`.

When it comes time to upload the `did-configuration.json` file, take the following steps:

1. Go to that Storage Account and select **Containers** in the left hand menu. Then select the container named `$web`.
1. Select **Upload** and select on the folder icon to find your file
1. Before uploaded, open the **Advanced** section and specify `.well-known` in the **Upload to folder** textbox.
1. Upload the file.

You now have your file publicly available at a URL that looks something like `https://<your-storageaccountname>.z6.web.core.windows.net/.well-known/did-configuration.json`.

## Next steps

- [How to customize your Microsoft Entra Verified ID](credential-design.md)
