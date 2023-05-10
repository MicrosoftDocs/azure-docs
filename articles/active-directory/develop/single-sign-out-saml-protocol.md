---
title: Azure Single Sign Out SAML Protocol
description: This article describes the Single Sign-Out SAML Protocol in Azure Active Directory
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 11/25/2022
ms.author: owenrichards
ms.reviewer: kenwith
ms.custom: aaddev, engagement-fy23
---

# Single Sign-Out SAML Protocol

Azure Active Directory (Azure AD) supports the SAML 2.0 web browser single sign-out profile. For single sign-out to work correctly, the **LogoutURL** for the application must be explicitly registered with Azure AD during application registration. If the app is [added to the Azure App Gallery](../manage-apps/v2-howto-app-gallery-listing.md) then this value can be set by default. Otherwise, the value must be determined and set by the person adding the app to their Azure AD tenant. Azure AD uses the LogoutURL to redirect users after they're signed out. 

Azure AD supports redirect binding (HTTP GET), and not HTTP POST binding.

The following diagram shows the workflow of the Azure AD single sign-out process.

![Azure AD Single Sign Out Workflow](./media/single-sign-out-saml-protocol/active-directory-saml-single-sign-out-workflow.png)

## LogoutRequest

The cloud service sends a `LogoutRequest` message to Azure AD to indicate that a session has been terminated. The following excerpt shows a sample `LogoutRequest` element.

```
<samlp:LogoutRequest xmlns="urn:oasis:names:tc:SAML:2.0:metadata" ID="idaa6ebe6839094fe4abc4ebd5281ec780" Version="2.0" IssueInstant="2013-03-28T07:10:49.6004822Z" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
  <Issuer xmlns="urn:oasis:names:tc:SAML:2.0:assertion">https://www.workaad.com</Issuer>
  <NameID xmlns="urn:oasis:names:tc:SAML:2.0:assertion"> Uz2Pqz1X7pxe4XLWxV9KJQ+n59d573SepSAkuYKSde8=</NameID>
</samlp:LogoutRequest>
```

The `LogoutRequest` element sent to Azure AD requires the following attributes:

* `ID` - This identifies the sign-out request. The value of `ID` shouldn't begin with a number. The typical practice is to append **id** to the string representation of a GUID.
* `Version` - Set the value of this element to **2.0**. This value is required.
* `IssueInstant` - This is a `DateTime` string with a Coordinate Universal Time (UTC) value and [round-trip format ("o")](/dotnet/standard/base-types/standard-date-and-time-format-strings). Azure AD expects a value of this type, but doesn't enforce it.

Per section 3.7 of the [SAML 2.0 core specification](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf), there can be multiple participants (other applications) in a session besides your application. If one of the other participants sends a `LogoutRequest` to the Microsoft identity platform (the session authority), it will send a `LogoutRequest` back to all the session participants except the participant who sent the initial `LogoutRequest`. If another participant simultaneously initiated sign-out, there would be a race to see which `LogoutRequest` reaches Microsoft identity platform first. Therefore, an application should always be prepared to handle a `LogoutRequest`.

### Issuer

The `Issuer` element in a `LogoutRequest` must exactly match one of the **ServicePrincipalNames** in the cloud service in Azure AD. Typically, this is set to the **App ID URI** that is specified during application registration.

### NameID
The value of the `NameID` element must exactly match the `NameID` of the user that is being signed out. 

> [!NOTE]
> During SAML logout request, the `NameID` value is not considered by Azure Active Directory.  
> If a single user session is active, Azure Active Directory will automatically select that session and the SAML logout will proceed.  
> If multiple user sessions are active, Azure Active Directory will enumerate the active sessions for user selection. After user selection, the SAML logout will proceed.

## LogoutResponse
Azure AD sends a `LogoutResponse` in response to a `LogoutRequest` element. The following excerpt shows a sample `LogoutResponse`.

```
<samlp:LogoutResponse ID="_f0961a83-d071-4be5-a18c-9ae7b22987a4" Version="2.0" IssueInstant="2013-03-18T08:49:24.405Z" InResponseTo="iddce91f96e56747b5ace6d2e2aa9d4f8c" xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
  <Issuer xmlns="urn:oasis:names:tc:SAML:2.0:assertion">https://sts.windows.net/82869000-6ad1-48f0-8171-272ed18796e9/</Issuer>
  <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success" />
  </samlp:Status>
</samlp:LogoutResponse>
```

Azure AD sets the `ID`, `Version` and `IssueInstant` values in the `LogoutResponse` element. It also sets the `InResponseTo` element to the value of the `ID` attribute of the `LogoutRequest` that elicited the response.

### Issuer
Azure AD sets this value to `https://login.microsoftonline.com/<TenantIdGUID>/` where \<TenantIdGUID> is the tenant ID of the Azure AD tenant.

To evaluate the value of the `Issuer` element, use the value of the **App ID URI** provided during application registration.

### Status
Azure AD uses the `StatusCode` element in the `Status` element to indicate the success or failure of sign-out. When the sign-out attempt fails, the `StatusCode` element can also contain custom error messages.
