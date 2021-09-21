---
title: Worload identity federation | Azure
titleSuffix: Microsoft identity platform
description: Learn about workload identity federation, which allows developers to use a token from another identity provider (such as GitHub) as the credential for accessing Azure resources.  This eliminates the need for storing and maintaining long-lived secrets outside of Azure.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 09/20/2021
ms.author: ryanwi
ms.reviewer: keyam, udayh, vakarand
ms.custom: 
#As a developer, I can learn 
---

# Workload identity federation

## What is it, primary audience, problem statement, goals 
Workload identities are identities used by software workloads (applications, services, scripts, or containers) when they need to authenticate and access resources available to them. In order for the software workload to authenticate, it normally needs the identifier for that identity and its credential (a secret or a certificate). 

Workload identity federation creates a new type of credential (federated identity credential) which allows Azure AD workload identities to impersonate apps outside of Azure. A workload identity (app/SP/managed identity) can be configured to trust tokens from another identity provider (i.e. GitHub) and exchange them for access tokens from Microsoft identity platform.  Using an access token, the external app can deploy/access resources on Azure. This removes the need for the developer to store and manage the credential securely and rotating it regularly.  

## Primary scenarios enabled by workload identity federation: 
This will allow a variety of scenarios to be enabled without the need to have explicit secrets that need to be managed on these identities:

GitHub Actions CI/CD to Azure without storing service principal secrets in GitHub, with GitHub tokens exchanged for AAD access tokens 


## Generic work flow/pattern: 
While each scenario has it's own unique specialized ways to make it easy for developers to accomplish this, the underlying pattern remains the same.  This pattern will be utilized in each scenario. 

1. **Create the trust.** Configure the trust between the identity provider and AAD. This trust is at the level of a service principal, by calling an AAD API to configure a federated identity credential on the workload identity.  Right now, this is only at the app object/SP level.  Even on MS Graph, doing a POST on applications.

2. **Request the token from Microsoft identity platform using the foreign token.** AAD will support an OAuth Confidential Client with a token as a client assertion. This will allow anyone to send the foreign token as a client assertion when requesting an AAD token

3. **Access Azure resources using the token.** The token can then be used to access the specific Azure resource for which it was requested. 

 
## Next steps

