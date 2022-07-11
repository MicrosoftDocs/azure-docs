---
title: Frequently asked questions - Azure Verifiable Credentials (preview)
description: Find answers to common questions about Verifiable Credentials
author: barclayn
manager: rkarlin
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: conceptual
ms.date: 04/28/2022
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---

# Frequently Asked Questions (FAQ) (preview)

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

This page contains commonly asked questions about Verifiable Credentials and Decentralized Identity. Questions are organized into the following sections.

- [Vocabulary and basics](#the-basics)
- [Conceptual questions about decentralized identity](#conceptual-questions)
- [Questions about using Verifiable Credentials preview](#using-the-preview)

> [!IMPORTANT]
> Azure Active Directory Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## The basics

### What is a DID? 

Decentralized Identifers(DIDs) are unique identifiers that can be used to secure access to resources, sign and verify credentials, and facilitate application data exchange. Unlike traditional usernames and email addresses, DIDs are owned and controlled by the entity itself (be it a person, device, or company). DIDs exist independently of any external organization or trusted intermediary. [The W3C Decentralized Identifier spec](https://www.w3.org/TR/did-core/) explains this in further detail.

### Why do we need a DID?

Digital trust fundamentally requires participants to own and control their identities, and identity begins at the identifier.
In an age of daily, large-scale system breaches and attacks on centralized identifier honeypots, decentralizing identity is becoming a critical security need for consumers and businesses.
Individuals owning and controlling their identities are able to exchange verifiable data and proofs. A distributed credential environment allows for the automation of many business processes that are currently manual and labor intensive.

### What is a Verifiable Credential? 

Credentials are a part of our daily lives; driver's licenses are used to assert that we're capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries. Verifiable Credentials provides a mechanism to express these sorts of credentials on the Web in a way that is cryptographically secure, privacy respecting, and machine-verifiable. [The W3C Verifiable Credentials spec](https://www.w3.org/TR/vc-data-model/) explains this in further detail.


## Conceptual questions

### What happens when a user loses their phone? Can they recover their identity?

There are multiple ways of offering a recovery mechanism to users, each with their own tradeoffs. We're currently evaluating options and designing approaches to recovery that offer convenience and security while respecting a user's privacy and self-sovereignty.

### How can a user trust a request from an issuer or verifier? How do they know a DID is the real DID for an organization?

We implement [the Decentralized Identity Foundation's Well Known DID Configuration spec](https://identity.foundation/.well-known/resources/did-configuration/) in order to connect a DID to a highly known existing system, domain names. Each DID created using the  Azure Active Directory Verifiable Credentials has the option of including a root domain name that will be encoded in the DID Document. Follow the article titled [Link your Domain to your Distributed Identifier](how-to-dnsbind.md) to learn more.  

### Why does the Verifiable Credential preview use ION as its DID method, and therefore Bitcoin to provide decentralized public key infrastructure?

ION is a decentralized, permissionless, scalable decentralized identifier Layer 2 network that runs atop Bitcoin. It achieves scalability without including a special crypto asset token, trusted validators, or centralized consensus mechanisms. We use Bitcoin for the base Layer 1 substrate because of the strength of the decentralized network to provide a high degree of immutability for a chronological event record system.

## Using the preview

### Is any of the code used in the preview open source?

Yes! The following repositories are the open-sourced components of our services.

1. [SideTree, on GitHub](https://github.com/decentralized-identity/sidetree)
1. An [Android SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-Android)
1. An [iOS SDK for building decentralized identity wallets, on GitHub](https://github.com/microsoft/VerifiableCredential-SDK-iOS)


### What are the licensing requirements?

There are no special licensing requirements to issue Verifiable credentials. All you need is An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### Updating the VC Service configuration
The following instructions will take 15 mins to complete and are only required if you have been using the Azure AD Verifiable Credentials service prior to April 25, 2022. You are required to execute these steps to update the existing service principals in your tenant that run the verifiable credentials service the following is an overview of the steps:

1. Register new service principals for the Azure AD Verifiable Service
1. Update the Key Vault access policies
1. Update the access to your storage container
1. Update configuration on your Apps using the Request API
1. Cleanup configuration (after May 6, 2022) 

#### **1. Register new service principals for the Azure AD Verifiable Service**
1. Run the following PowerShell commands. These commands install and import the Azure PowerShell module. For more information, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps#installation).

    ```azurepowershell
    if((get-module -listAvailable -name "az.accounts") -eq $null){install-module -name "az.accounts" -scope currentUser}
    if ((get-module -listAvailable -name "az.resources") -eq $null){install-module "az.resources" -scope currentUser}
    ```
1. Run the following PowerShell command to connect to your Azure AD tenant. Replace ```<your tenant ID>``` with your [Azure AD tenant ID](../fundamentals/active-directory-how-to-find-tenant.md)

    ```azurepowershell
    connect-azaccount -tenantID <your tenant ID>
    ```
1. Check if of the following Service principals have been added to your tenant by running the following command:

    ```azurepowershell
    get-azADServicePrincipal -applicationID "bb2a64ee-5d29-4b07-a491-25806dc854d3"
    get-azADServicePrincipal -applicationID "3db474b9-6a0c-4840-96ac-1fceb342124f"
   ```
  
1. If you don't get any results, run the commands below to create the new service principals, if the above command results in one of the service principals is already in your tenant, you don't need to recreate it. If you try to add it through the command below, you'll get an error saying the service principle already exists.

   ```azurepowershell
   new-azADServicePrincipal -applicationID "bb2a64ee-5d29-4b07-a491-25806dc854d3"
   new-azADServicePrincipal -applicationID "3db474b9-6a0c-4840-96ac-1fceb342124f"
   ```

   >[!NOTE]
   >The AppId ```bb2a64ee-5d29-4b07-a491-25806dc854d3``` and ```3db474b9-6a0c-4840-96ac-1fceb342124f``` refer to the new Verifiable Credentials service principals.

#### **2. Update the Key Vault access policies**

Add an access policy for the **Verifiable Credentials Service**. 

>[!IMPORTANT]
> At this time, do not remove any permissions!

1. In the Azure portal, navigate to your key vault.
1. Under **Settings**, select **Access policies** 
1. Select **+ Add Access Policy**
1. Under **Key permissions**, select **Get** and **Sign**.
1. In the **Select Service principal** section, search for Verifiable Credentials service by entering **bb2a64ee-5d29-4b07-a491-25806dc854d3**.
1. Select **Add**.

Add an access policy for the Verifiable Credentials Service Request.

1. Select **+ Add Access Policy**
1. Under **Key permissions**, select **Get** and **Sign**.
1. In the **Select Service principal** section search for **3db474b9-6a0c-4840-96ac-1fceb342124f** which is the Verifiable Credentials Service Request part of Azure AD Free
1. Select **Add**.
1. Select **Save** to save your changes

#### **3. Update the access to your storage container**

We need to do this for the storage accounts used to store verifiable credentials rules and display files.

1. Find the correct storage account and open it.
1. From the list of containers, open select the container that you are using for the Verifiable Credentials service.
1. From the menu, select Access Control (IAM).
1. Select + Add, and then select Add role assignment.
1. In Add role assignment:
    1. For the Role, select Storage Blob Data Reader. Select Next
    1. For the Assign access to, select User, group, or service principal.
    1. Then +Select members and search for Verifiable Credentials Service (make sure this is the exact name, since there are several similar service principals!) and hit Select
    1. Select Review + assign

#### **4. Update configuration on your Apps using the Request API**

Grant the new service principal permissions to get access tokens

1. In your application. Select **API permissions** > **Add a permission**.
1. Select **APIs my organization uses**.
1. Search for **Verifiable Credentials Service Request** and select it. Make sure you aren't selecting the **Verifiable Credential Request Service**. Before proceeding, confirm that the **Application Client ID** is ```3db474b9-6a0c-4840-96ac-1fceb342124f```
1. Choose **Application Permission**, and expand **VerifiableCredential.Create.All**.
1. Select **Add permissions**.
1. Select **Grant admin consent for** ```<your tenant name>```.

Adjust the API scopes used in your application

For the Request API the new scope for your application or Postman is now:

```3db474b9-6a0c-4840-96ac-1fceb342124f/.default ```

### How do I reset the Azure AD Verifiable credentials service?

Resetting requires that you opt out and opt back into the Azure Active Directory Verifiable Credentials service, your existing verifiable credentials configurations will reset and your tenant will obtain a new DID to use during issuance and presentation.

1. Follow the [opt-out](how-to-opt-out.md) instructions.
1. Go over the Azure Active Directory Verifiable credentials [deployment steps](verifiable-credentials-configure-tenant.md) to reconfigure the service.
    1. If you are in the European region, it's recommended that your Azure Key Vault and container are in the same European region otherwise you may experience some performance and latency issues. Create new instances of these services in the same EU region as needed.
1. Finish [setting up](verifiable-credentials-configure-tenant.md#set-up-verifiable-credentials) your verifiable credentials service. You need to recreate your credentials.
    1. If your tenant needs to be configured as an issuer, it's recommended that your storage account is in the European region as your Verifiable Credentials service.
    2. You also need to issue new credentials because your tenant now holds a new DID.

### How can I check my Azure AD Tenant's region?

1. In the [Azure portal](https://portal.azure.com), go to Azure Active Directory for the subscription you use for your Azure Active Directory Verifiable credentials deployment.
1. Under Manage, select Properties
    :::image type="content" source="media/verifiable-credentials-faq/region.png" alt-text="settings delete and opt out":::
1. See the value for Country or Region. If the value is a country or a region in Europe, your Azure AD Verifiable Credentials service will be set up in Europe.

### How can I check if my tenant has the new Hub endpoint?

1. In the Azure portal, go to the Verifiable Credentials service.
1. Navigate to the Organization Settings. 
1. Copy your organization’s Decentralized Identifier (DID). 
1. Go to the ION Explorer and paste the DID in the search box 
1. Inspect your DID document and search for the ` “#hub” ` node.

```json
 "service": [
      {
        "id": "#linkeddomains",
        "type": "LinkedDomains",
        "serviceEndpoint": {
          "origins": [
            "https://contoso.com/"
          ]
        }
      },
      {
        "id": "#hub",
        "type": "IdentityHub",
        "serviceEndpoint": {
          "instances": [
            "https://beta.hub.msidentity.com/v1.0/12345678-0000-0000-0000-000000000000"
          ],
          "origins": []
        }
      }
    ],
```

### If I reconfigure the Azure AD Verifiable Credentials service, do I need to relink my DID to my domain?

Yes, after reconfiguring your service, your tenant has a new DID use to issue and verify verifiable credentials. You need to [associate your new DID](how-to-dnsbind.md) with your domain.

### Is it possible to request Microsoft to retrieve "old DIDs"?

No, at this point it isn't possible to keep your tenant's DID after you have opt-out of the service.

## Next steps

- [How to customize your Azure Active Directory Verifiable Credentials](credential-design.md)
