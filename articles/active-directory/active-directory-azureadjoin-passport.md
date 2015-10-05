<properties 
	pageTitle="Overview of Microsoft Passport and details about this new certification-based authentication.| Microsoft Azure" 
	description="A topic that explains how users can set up Azure AD Join during their first run experience." 
	services="active-directory" 
	documentationCenter="" 
	authors="femila" 
	manager="stevenpo" 
	editor=""/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/21/2015" 
	ms.author="femila"/>

# Authenticating identities without passwords through Microsoft Passport

The current methods of authentication with passwords alone are not sufficient to keep users safe. Users reuse and forget passwords. Passwords are breachable, phishable, prone to cracks, and guessable. They also get difficult to remember and prone to attacks like “pass the hash”.

## What is Microsoft Passport
Microsoft Passport is a new private/public key or certificate-based authentication approach for organizations and consumers that goes beyond passwords. This form of authentication relies on these key pair credentials that can replace passwords and be resistant to breaches, thefts and phishing Microsoft Passport lets users authenticate to a Microsoft account, an Active Directory account, a Microsoft Azure Active Directory (AD) account, or non-Microsoft service that supports Fast ID Online (FIDO) authentication. After an initial two-step verification during Microsoft Passport enrollment, a Microsoft Passport is set up on the user's device and the user sets a gesture, which can be Windows Hello or a PIN. The user provides the gesture to verify identity; Windows then uses Microsoft Passport to authenticate users and help them to access protected resources and services.

The private key is made available solely through a “user gesture” like a PIN, biometrics, remote device like a smart card that the user used to sign in to the device and this information is linked to a certificate or an asymmetrical key pair. This private-key is hardware attested if device has a Trusted Platform Module (TPM) chip. The private key never leaves the device.

The public key is registered with Azure Active Directory and Windows Server Active Directory (for On-Premises). The Identity Providers (IDPs) validate the user by mapping the public key of the user to the private key and provides sign-in information through One Time Password (OTP), Phonefactor or a different notification mechanism.
## Why should enterprises adopt Microsoft Passport
By enabling Microsoft Passport, enterprises can make their resources even more secure by:

* Setting up Microsoft Passport with a hardware-preferred option, which means that keys will be generated on TPM 1.2 or TPM 2.0 when available and by software when TPM is not available. 

* Defining the complexity and length of the PIN, and whether Hello usage is enabled in your organization

* Configuring Microsoft Passport to support smart card-like scenarios using certificate-based trust.

## How does it work
1. Keys are generated on the hardware. A lot of machines have a built-in trusted platform module (TPM) chip that secures the hardware by integrating cryptographic keys into devices. The TPM 1.2 or TPM 2.0 is used to generate keys or certificates that will be keyed out of the keys generated.

2. These hardware-bound keys are attested by the TPM and enterprises can 

3. Single unlock gesture will unlock the device and this gesture will be allowed to get access to multiple resources if the device is domain-joined or Azure AD Joined. 

## Microsoft Passport lifecycle
Microsoft Passport Authentication Lifecycle
![](./media/active-directory-azureadjoin/active-directory-azureadjoin-microsoft-passport.png)
The above diagram illustrates the private-public key pair and the validation by the identity provider. Each of these steps are explained in detail below:

1. User proves his/her identity through multiple built-in proofing methods (gestures, physical smart cards, multi-factor authentication) and sends this information to the Identity Provider (IDP) like Azure Active Directory or Active Directory.

2.  device then creates the keys, attests the key, takes the public portion of this key, attach it with station statements, signs in and sends it to IDP to register this key. 

3. As soon as the public portion of the key is registered in the IDP, it challenges the device to sign with the private portion of the key. The IDP then validates and issues the authentication token that lets the user access protected resources.

4. As soon as the public portion of the key is registered in the IDP, it challenges the device for the challenge to sign with the private portion of the key. 

5. IDP then validates and issues the authentication token that lets the user and device access protected resources. IDPs can write cross-platform apps or use browser support via JS/Webcrypto APIs) to create and use Microsoft Passport credentials for their users.

## Deployment Requirements
At the enterprise level
---------------------------
* Azure Subscription

At the user level
-------------------------------------------------------------
* Computer must run Windows 10 Professional or Enterprise SKU

## Additional information

* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)

