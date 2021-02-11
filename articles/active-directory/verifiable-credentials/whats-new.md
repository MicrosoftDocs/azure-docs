---
title: What's new for Azure Verifiable Credentials
description: Recent updates for Azure Verifiable Credentials
services: active-directory
author: barclayn
ms.service: active-directory
ms.subservice: verifiable-credentials
ms.topic: reference
ms.date: 02/11/2021
ms.author: barclayn

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.

---

# What's new for Azure Verifiable Credentials


## November 2020

Microsoft Authenticator has completed a refactoring project to move the database from the SDK to the Wallet. This has resulted in the credentials being deleted. Please go through the issuance flow in order to get new credentials. 

The Cards tab has changed to Credentials to more accurately reflect what the user possess in their wallet. Additionally, we are using the Beta tag, instead of Preview to describe status of the feature. 

When creating a new credential in the Verifiable Credentials (Preview), you can now select the Rules and Display file from blob storage without needing to provide the URL. 

![New credential select from blob storage](../images/New_Credential.jpg)

#### Breaking Change: Update Redirect URI

We've updated the Redirect URI to a more generic term. Please use the following steps to add 'vcclient://openid' as an additional redirect in your issuer tenant. The change can be done immediately and the existing redirect can stay as is in order prevent incompatibility with the existing app and the new version of Authenticator. 

1. Go to Azure Active Directory in the Azure Portal 
2. App Registrations 
3. Under 'Owned applications' select your Issuer Application 
4. Click on the 'Redirect URIs' link
5. Under 'Mobile and desktop applications' add another uri: vcclient://openid 
6. Keep the existing URI to keep compatibility with both versions of the Microsoft Authenticator app 
7. Click save!

## October 2020

This month, we're releasing updates to Microsoft Authenticator that align with standard protocols being developed in the Decentralized Identity Foundation. Authenticator version `6.2009.6407` will be released to the Google Play store beginning on September 25, 2020. Some changes will require your attention.

#### Breaking Change: Supporting DIF Presentation Exchange 

Authenticator version `6.2009.6407` and [VC SDK 0.10.0-preview.29](https://www.npmjs.com/package/verifiablecredentials-verification-sdk-typescript) both support the [DIF Presentation Exchange](https://identity.foundation/presentation-exchange/) spec. This is a breaking change and requires attention if you are using the new version of Authenticator. The error message should say, "Input Descriptor is missing in presentation request."

Changes to the documentation: 
1. [Issue Credentials - step 3](https://didproject.azurewebsites.net/docs/credential-issue-flow.html) change to the presentationDefinition syntax.
2. [Verify Credentials - step 4](https://didproject-staging.azurewebsites.net/docs/verify-credential-in-web.html) change to the presentationDefinition syntax. 

This release supports the ability to ask for a schema. The constraint field, from the DIF Presentation Exchange spec, will come in a later release. 

#### Deactivate and Delete Specific Cards in Authenticator

Authenticator version 6.2009.6407, gives the user the ability to Deactivate and Delete specific cards. Deactivate is a non-destructive action in order to remove the card from being used in presentation requests. The user also has the ability to delete a specific card, which would result in the user needing to go back to the issuer for a new Verifiable Credential. 

#### Deep Link Issue in Authenticator

Authenticator version 6.2009.6407, app lock is turned on by default. There is a known bug when Authenticator is open in the background and the user taps on a deep link, which results in the app to hang. The work around is to terminate Authenticator from running in the background and tap the deep link again, which should result in the Issuance or Presentation screen to show.  

## September 2020

This month, we're releasing a few updates to the Verifiable Credentials preview that improve privacy and security for customers. Version `6.2008.5762` of Microsoft Authenticator will be released to the Google Play Store beginning on August 28, 2020. The following changes will require your immediate attention:

#### Cryptography updates to algorithms used in credential presentations

To improve security, the new version of Authenticator changes one of the cryptographic algorithms used in credential presentation. As a result, all previously issued verifiable credentials will become invalid. Please delete all verifiable credentials in Authenticator by using the "Delete all Verifiable Credentials" button found in Authenticator's settings menu. Any new verifiable credentials will work without any additional action.

#### Azure Key Vault support in the VC SDK

Version `0.10.0-preview.4` of our Verifiable Credentials NodeJS package adds support for Azure Key Vault. You can now sign credential issuance and presentation requests using a private key stored in Azure Key Vault. This enables an issuer to use the same private key to sign both verifiable credentials and issuance requests. Please update your NodeJS web services to this version of the SDK and use Azure Key Vault. Our [code sample](https://github.com/Azure-Samples/active-directory-verifiable-credentials) and [tutorials](xref:6dda9f38-227a-4a60-99f1-b58343f7324d) now have up-to-date instructions.

#### Other changes

A few other updates are included in this month's release:

- Authenticator's credential consent page has been updated to improve transparency for how user data is being accessed.
- The issuer administrator experience in the Azure Portal has been updated to improve security.
- Issuers with existing Azure AD tenants can now use the preview without needing to manually create service principals.

## August 2020

The latest release of the Authenticator app `6.2007.5012` includes a breaking change that requires attention. The new version of Authenticator will be released to the Google Play Store beginning on July 29, 2020.

Authenticator now supports the ability to issue and present verifiable credentials by displaying a deep link on a mobile website, instead of a QR code. This improves usability for mobile devices. As part of this change, both QR codes and deep links must now use the `openid://vc` custom scheme. All preview customers will need to update their code to this new scheme to be compatable with the updated Authenticator app. See the [issuer tutorial](xref:152f1c4c-ea67-4958-9d17-e9b0b5e3040b) and [verifier tutorial](xref:74316adb-3a52-400f-b0e9-43eefcecefb7) for more information. 

In addition, the latest Authenticator release also includes:

- The `client_id` parameter has been removed from issuance and presentation requests.
- Recent activity for a verifiable credential is now in descending time order.
- The verifiable credentials error page now contains a direct link to Authenticator logs.
- Verifiable credentials can now be removed from Authenticator in [settings](xref:1c41fd0f-3ae7-4a0a-8f12-8ae624f9887d).

## July 2020

This release of Microsoft Authenticator and Verifiable Credentials services includes updates to the ION network that improve compliance with DID standards. All components have been updated with a new version of ION DIDs, which means all credentials and services are being reset. More details are provided below.

On Monday, July 6 at 9 AM PDT, we will be making a change to our services that will affect your use of verifiable credentials. This change requires us to completely reset all verifiable credentials configurations for customers in the preview.

What to expect:
	
- Any credentials you have currently issued to Microsoft Authenticator will no longer be valid.
- Any credentials or details you have configured in the Azure Portal will be deleted. You will need to set up your issuer service again.
- Your Key Vault and Azure Storage account will not be modified in any way. When you set up your issuer service again, new keys will be created in the Key Vault you provide.
- Any code you have written to issue or verify credentials will require changes.

How to proceed:

- You may continue to use the same Azure AD tenant you have previously used. When you access the Verifiable Credentials experience in the Azure Portal, you will need to re-enter your configuration information, such as your Key Vault details.
- You will need to re-create and re-configure your credentials, following the updated documentation. Some slight modifications to your rules files will be required. 
- You will need to update Microsoft Authenticator to the latest version available in the Google Play Store. Version `6.2006.4360` or later is sufficient.
- Because old credentials are no longer valid, you will need to remove them from Authenticator by clearing the app storage for Authenticator app on your device. Be sure to [back up your accounts](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-backup-recovery) before doing so - you will need to recover your accounts after clearing the storage. Alternatively, you may leave the old, invalid credential in Authenticator. If you choose to do this, new credentials you issue must using a new `vc.type` value, to distinguish them from the old credentials.
- You will need to update the VC SDK to the latest version available on NPM. Version `0.10.0-preview.0` is required. Refer to our updated code sample for code modifications you will need to make.

If you have any questions or issues, please reach out to your point of contact for the Verifiable Credentials preview. 
 
Over the next few months, you should expect a few more breaking changes of this nature. We'll be sending an update like this one to inform you of any changes you need to be aware of. You can also refer to our release notes to track changes made to the Verifiable Credentials preview.
 
Thank you for your patience and participation in the preview. Your comments and feedback over these last few weeks have been vital to improving the quality of our experiences. 


## June 2020

This is the Private Preview launch of Verifiable Credentials as a Service in Azure AD and Microsoft Authenticator. 

- You can use Azure AD to [configure and issue](https://didproject.azurewebsites.net/docs/issuer-setup.html) Verifiable Credentials. 
- [Microsoft Authenticator](https://didproject.azurewebsites.net/docs/authenticator.html) for Android (version 6.2005.3599 and later) can scan DID QR codes to receive or present Verifiable Credentials.
- We've open sourced our [Verifier SDK](https://github.com/microsoft/VerifiableCredentials-Verification-SDK-Typescript) so you can request and verify Verifiable Credentials on your webite using NodeJS.   
- We've open sourced our [User Agent SDK for Android](https://github.com/microsoft/VerifiableCredential-SDK-Android). This is the same SDK that Microsoft Authenticator uses to interact with Verifiable Credentials and the [ION network.](https://github.com/decentralized-identity/ion) 
-ION will now publish DIDs to bitcoin mainnet. Read more about IONs mainnet launch [here.](https://techcommunity.microsoft.com/t5/identity-standards-blog/ion-booting-up-the-network/ba-p/1441552)