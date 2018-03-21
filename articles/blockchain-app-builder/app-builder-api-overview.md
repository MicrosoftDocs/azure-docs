---
title:  App Builder REST API Overview - Azure Blockchain
description: What is the Azure Blockchain App Builder REST API
# services: service-name-with-dashes-AZURE-ONLY
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 3/20/2018
ms.topic: article
# Use only one of the following. Use ms.service for services, ms.prod for on-prem. Remove the # before the relevant field.
# ms.service: service-name-from-white-list
# product-name-from-white-list

# ms.custom: mvc
ms.reviewer: zeyadr
manager: zeyadr
---
# Azure Blockchain App Builder REST API Overview

Using the Azure Blockchain App Builder REST API you can:

* Manage applications
* Manage users
* Perform transactions
* Query metadata
* etc? 

{image}

An application represents a definition of a blockchain application. An application consists of one or more workflows. Each workflow consists of one or more smart contracts. Each smart contract consists of one or more states, where specific users can take actions to transition to the next state. 

## Base URL

All URLs have the following base:
`https://{blockchain-app}/api/v1`

The URI host is based on the deployed blockchain app URL.

## Authentication

HTTP requests to the App Builder REST API are protected with Azure Active Directory (Azure AD). 

To make an authenticated request to the App Builder APIs, client code requires authentication with valid credentials before you can call the API. Authentication is coordinated between the various actors by Azure AD, and provides your client with an [access token](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-dev-glossary#access-token) as proof of the authentication. The token is then sent in the HTTP Authorization header of REST API requests. To learn more about Azure AD authentication, see [Azure Active Directory for developers](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-developers-guide). 

## REST Operation Groups

|Operation group |Description |
|----------------|------------|
|[Applications]() | Definition of a blockchain application |
|[Connectors]()   | Connection to a chain instance |
|[Ledgers]()      | Supported chain types |
|[Users]()        | Users of the blockchain app |
|[Contracts]()    | Smart contract instances |

## Next steps

link - Using the API Scenario 1
link - Using the API Scenario 2


