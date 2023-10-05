---
author: dlepow
ms.service: virtual-machines
ms.topic: include
ms.date: 07/10/2019
ms.author: danlep
---
### Identity tier 

The Microsoft-Oracle partnership enables you to set up a unified identity across Azure, OCI, and your Oracle application. For JD Edwards EnterpriseOne or PeopleSoft application suite, an instance of the Oracle HTTP Server (OHS) is needed to set up single sign-on between Azure AD and Oracle IDCS.

OHS acts as a reverse proxy to the application tier, which means that all the requests to the end applications go through it. Oracle Access Manager WebGate is an OHS web server plugin that intercepts every request going to the end application. If a resource being accessed is protected (requires an authenticated session), the WebGate initiates OIDC authentication flow with Identity Cloud Service through the user’s browser. For more information about the flows supported by the OpenID Connect WebGate, see the [Oracle Access Manager documentation](https://docs.oracle.com/cd/E52734_01/oam/AIAAG/GUID-1E927D1B-FB83-425B-8768-85DB441821A4.htm#AIAAG7327).

With this setup, a user already logged in to Azure AD can navigate to the JD Edwards EnterpriseOne or PeopleSoft application without logging in again, through Oracle Identity Cloud Service. Customers that deploy this solution gain the benefits of single sign-on, including a single set of credentials, an improved sign-on experience, improved security, and reduced help-desk cost.

To learn more about setting up single sign-on for JD Edwards EnterpriseOne or PeopleSoft with Azure AD, see the associated [Oracle whitepaper](https://www.oracle.com/a/ocom/docs/applications/jdedwards/jde-on-oci-strategy-updates-2020.pdf).
