---
title: Define key pair values or claims in Azure Verifiable credentials
description: 
services: active-directory
author: barclayn
manager: davba
ms.service: active-directory
ms.subservice: verifiable-credentials
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/08/2021
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---

# Define key pair values or claims in Azure Verifiable credentials

Verifiable Credentials typically contain a number of key value pairs that describe attributes, or claims, about the user to which they are issued. For instance, a higher education diploma credential might contain:

```
name:      Alex Johnson
major:     Mechanical Engineering
date:      06/15/1998
studentId: 12515010
```

This article will help you define the properties and contents of your Verifiable Credentials.

> [!NOTE] 
> During the Verifiable Credentials preview, production customer data should not be used in the contents of Verifiable Credentials.

## Connect to your identity provider

To receive a Verifiable Credential, users must first log in to your organization's identity provider. This allows the user to prove who they are before receiving their credential. When a user successfully logs in, your identity provider will return a security token that contains claims about the user. The issuer service then transforms these security tokens and their claims into Verifiable Credentials.

<img style="box-shadow:none" src="../images/idp-transform-diagram.png" alt="issue process">

Any identity provider that supports the OpenID Connect protocol is supported. Examples of supported identity providers include Azure Active Directory, and Azure AD B2C. [This article](xref:4d02f5ca-6114-4fad-9e87-54944b3f0610) contains the details of the OpenID Connect protocol used during the credential issuing process.

To issue a Verifiable Credential, you need to provide the issuer service with the configuation details of your OpenID compliant identity provider.

<div class="step" style="margin-bottom:0px" >
<div class="numberCircle">1</div>
<div class="multiline-step">
Register the Verifiable Credential issuer service as an application in your identity provider and obtain a client ID. Instructions are available for registering an application with [Azure AD](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app) or [Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications). When registering, use the values below. Write down the application ID. You need this value later.
</div>
</div>

<table class="table" style="padding-left: 50px;">
<thead><tr><th>Setting</th><th>Value</th></tr></thead>
<tbody>
<tr><td style="min-width:150px">Application Type</td><td>Public client/native application.</td></tr>
<tr><td style="min-width:150px">Application Name</td><td>"My Credential Issuer", or something similar.</td></tr>
<tr><td style="min-width:150px">Redirect URI</td><td>`vcclient://openid`</td></tr>
</tbody>
</table>

<div class="step" style="margin-bottom:0px">
<div class="numberCircle">2</div>
<div class="multiline-step">
Locate the URL of the OpenID Connect configuration document for your identity provider. The configuration document contains details necessary for the issuer service to communicate with your identity provider. Example values for Azure AD and Azure AD B2C are provided below.
</div>
</div>

<table class="table" style="padding-left: 50px;">
<thead><tr><th>Service</th><th>Document Location</th></tr></thead>
<tbody>
<tr><td style="min-width:150px">Azure AD</td><td>`https://login.microsoftonline.com/mytenant.onmicrosoft.com/v2.0/.well-known/openid-configuration`</td></tr>
<tr><td style="min-width:150px">Azure AD B2C</td><td>`https://mytenant.b2clogin.com/mytenant.onmicrosoft.com/B2C_1_Example/v2.0/.well-known/openid-configuration`</td></tr>
</tbody>
</table>

<div class="step" style="margin-bottom:0px">
<div class="numberCircle">3</div>
<div class="multiline-step">
Identify the available claims in tokens returned by your identity provider. Each identity provider will offer a different set of claims in its tokens. Many identity providers also offer the ability to customize claims in tokens. For details on customizing claims in Azure AD and Azure AD B2C, refer to the links below.
</div>
</div>

<table class="table" style="padding-left: 50px;">
<thead><tr><th>Service</th><th>Claim Details</th></tr></thead>
<tbody>
<tr><td style="min-width:150px">Azure AD</td><td>[Claims in Azure AD tokens](xref:9736b847-7ac5-4ea0-bf94-d37df820aca5#azure-active-directory)</td></tr>
<tr><td style="min-width:150px">Azure AD B2C</td><td>[Claims in Azure AD B2C tokens](xref:9736b847-7ac5-4ea0-bf94-d37df820aca5#azure-ad-b2c)</td></tr>
</tbody>
</table>

Once you have a client ID, you have the URL for the OpenID configuration, and you know the claims in tokens, you're ready to proceed. Any claim from your identity provider's ID token can be included as attributes in your Verifiable Credentials. To define the contents of your credential, you must create and upload a single JSON file, known as the rules file.

## Create a credential rules file

The rules file is a simple JSON file that describes important properties of verifiable credentials. In particular it describes how claims from your ID tokens are used to populate your Verifiable Credentials. The rules file has the following structure.

```json
{
  "vc": {
    "type": [ "https://schemas.contoso.edu/credentials/schemas/diploma2020" ]
  },
  "validityInterval": 2592000,
  "attestations": {
    "idTokens": [
      {
        "mapping": {
          "name": { "claim": "studentName" },
          "major": { "claim": "fieldOfStudy" },
          "date": { "claim": "graduationDate" },
          "studentId": { "claim": "studentId" }
        },
        "configuration": "https://idp.contoso.com/.well-known/openid-configuration",
        "client_id": "6809af9d-u198a0af1",
        "scopes": "openid profile email",
        "redirect_uri": "vcclient://openid"
      }
    ]
  }
}
```

| Property | Description |
| -------- | ----------- |
| `vc.type` | An array of strings indicating the schema(s) that your Verifiable Credential satisfies. See the section below. |
| `validityInterval` | A time duration, in seconds, representing the lifetime of your Verifiable Credentials. After this time period elapses, the Verifiable Credential will no longer be valid. Omitting this value means that each Verifiable Credential will remain valid until is it explicitly revoked. |
| `attestations.idTokens` | An array of OpenID Connect identity providers that are supported for sourcing user information. |
| `...mapping` | An object that describes how claims in each ID token are mapped to attributes in the resulting Verifiable Credential. |
| `...mapping.{attribute-name}` | The attribute that should be populated in the resulting Verifiable Credential. |
| `...mapping.{attribute-name}.claim` | The claim in ID tokens whose value should be used to populate the attribute. |
| `...configuration` | The location of your identity provider's configuration document. This URL must adhere to the [OpenID Connect standard for identity provider metadata](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata). The configuration document must include the `issuer`, `authorization_endpoint`, `token_endpoint`, and `jwks_uri` fields. |
| `...client_id` | The client ID obtained during the client registration process. |
| `...scopes` | A space delimited list of scopes the IDP needs to be able to return the correct claims in the ID token. |
| `...redirect_uri` | Must always use the value `portableidentity://verify`. |


To issue verifiable credentials, you need to construct your own rules file. Begin with the example given above, and change the following values.

<div class="step">
<div class="numberCircle">1</div>
<div class="singleline-step">
Modify the `credentialIssuer` value to use your Azure AD tenant ID.
</div>
</div>

<div class="step">
<div class="numberCircle">2</div>
<div class="singleline-step">
Modify the `vc.type` value to reflect the type of your credential. See the section below.
</div>
</div>

<div class="step">
<div class="numberCircle">3</div>
<div class="multiline-step">
Modify the `mapping` section, so that claims from your identitiy provider are mapped to attributes of your Verifiable Credential.
</div>
</div>

<div class="step">
<div class="numberCircle">4</div>
<div class="singleline-step">
Modify the `configuration` and `client_id` values to the values you prepared in the section above.
</div>
</div>


## Choose credential type(s)

All Verifiable Credentials must declare their "type" in their rules file. The type of a credential distinguishes your Verifiable Credentials from credentials issued by other organizations and ensures interoperability between issuers and verifiers. To indicate a credential type, you must provide one or more credential types that the credential satisfies. Each type is represented by a unique string - often a URI will be used to ensure global uniqueness. The URI does not need to be addressable; it is treated as a string. 

As an example, a diploma credential issued by Contoso University might declare the following types:

| Type | Purpose |
| ---- | ------- |
| `https://schema.org/EducationalCredential` | Declares that diplomas issued by Contoso University contain attributes defined by schema.org's `EducationaCredential` object. |
| `https://schemas.ed.gov/universityDiploma2020` | Declares that diplomas issued by Contoso University contain attributes defined by the United States department of education. |
| `https://schemas.contoso.edu/diploma2020` | Declares that diplomas issued by Contoso University contain attributes defined by Contoso University. |

By declaring all three types, Contoso University's diplomas can be used to satisfy different requests from verifiers. A bank can request a set of `EducationCredential`s from a user, and the diploma can be used to satisfy the request. But the Contoso University Alumni Association can request a credential of type `https://schemas.contoso.edu/diploma2020`, and the diploma will also satisfy the request.

To ensure interoperability of your credentials, it's recommended that you work closely with related organizations to define credential types, schemas, and URIs for use in your industry. Many industry bodies provide guidance on the structure of official documents that can be repurposed for defining the contents of Verifiable Credentials. You should also work closely with the verifiers of your credentials to understand how they intend to request and consume your Verifiable Credentials.

## Upload the rules file

Once that you've constructed your rules file following the example above, you must upload it to your own Azure Blob Storage. The issuer service will read the rules file from blob storage when issuing credentials.

<div class="step" style="margin-bottom:0px" >
<div class="numberCircle">1</div>
<div class="multiline-step">
[Create an Azure Storage account](https://docs.microsoft.com/azure/storage/common/storage-account-create), or use an existing storage account. You must use the same storage account for all verifiable credentials you create in the Azure Portal. When creating the storage account we recommend the following details.
</div>
</div>

<table class="table" style="padding-left: 50px;">
<thead><tr><th>Detail</th><th>Recommended</th></tr></thead>
<tbody>
<tr><td>Region</td><td>East US</td></tr>
<tr><td>Performance</td><td>Standard</td></tr>
<tr><td>Account kind</td><td>StorageV2</td></tr>
</tbody>
</table>

<div class="step" style="margin-bottom:0px" >
<div class="numberCircle">2</div>
<div class="multiline-step">
Create a container in your storage account, or use an existing container. When creating the container, we recommend the following details.
</div>
</div>

<table class="table" style="padding-left: 50px;">
<thead><tr><th>Detail</th><th>Recommended</th></tr></thead>
<tbody>
<tr><td>Public access level</td><td>Private (no anonymous access)</td></tr>
</tbody>
</table>

<div class="step">
<div class="numberCircle">3</div>
<div class="multiline-step">
Upload your rules file with a `.json` extension to your container. Once uploaded, copy the URL to your rules file blob from the Azure Portal. The URL should be similar to `https://mystorage.blob.core.windows.net/mycontainer/MyCredentialRulesFile.json`, without any spaces or special characters.
</div>
</div>

<div class="step">
<div class="numberCircle">4</div>
<div class="multiline-step">
In the Azure Portal, navigate to the **Verifiable Credentials (Preview)** blade. In the **Credentials** menu, **Add a credential** to create your first Verifiable Credential. Give the credential a name, select your subscription and select your rules and display file you uploaded in the previous step. 
</div>
</div>
 
![New credential select from blob storage](../images/New_Credential.jpg)

You've now successfully defined the properties and contents of your Verifiable Credential. If you'd like to reference a working example of a rules file, please see our [code sample on GitHub](https://github.com/Azure-Samples/active-directory-verifiable-credentials).

Before you can finish creating your credential, you need to define the look and feel of your Verifiable Credentials. [Continue onto the next article to design the appearance of your Verifiable Credentials](xref:484cd922-2a86-41cb-a85a-87794cdd49c2).
