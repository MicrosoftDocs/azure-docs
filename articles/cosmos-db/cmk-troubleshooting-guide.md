---
title: Troubleshooting guide for customer-managed keys 
titleSuffix: Azure Cosmos DB
description: This document is meant to serve as a troubleshooting guide for Cosmos DB CMK accounts that have gone into revoked state
author: dileepraotv-github
ms.service: cosmos-db
ms.topic: how-to
ms.date: 06/07/2023
ms.author: turao
ms.custom: ignite-2022
ms.devlang: azurecli
---

# Troubleshooting Revocation Scenarios for your Customer-Managed Keys Configured Azure Cosmos DB account 

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Data stored in your Azure Cosmos DB account is automatically and seamlessly encrypted with keys that the customer manages as a second layer of encryption. When the Azure Cosmos DB account can no longer access the Azure Key Vault key per the Azure Cosmos DB account setting (see _KeyVaultKeyUri_), the account goes into revoke state. In this state, the only operations allowed are account updates that refresh the current assigned default identity or account deletion. Data plane operations like reading or writing documents are restricted. 

This troubleshooting guide shows you how to restore access when running into the most common errors with Customer managed keys. Check either the error message received each time a restricted operation is performed or by reading the _CmkError_ property on your Azure Cosmos DB account. 

## Default Identity is unauthorized to access the Azure Key Vault key 

### Reason for error?

You see the error when the default identity associated with the Azure Cosmos DB account is no longer authorized to perform either a get, a wrap or unwrap call to the Key Vault. 

### Troubleshooting 

When using access policies, verify that the get, wrap, and unwrap permissions on your Key Vault are assigned to the identity set as the default identity for the respective Azure Cosmos DB account. 

In case you're using RBAC, verify that the "Key Vault Crypto Service Encryption User" role to the default identity is assigned. 

Another option is to create a new identity with [the expected permission](./how-to-setup-customer-managed-keys.md) and set it as the new default identity via the Azure Cosmos DB account update operation. 

After assigning the permissions, wait upwards to one hour for the account to stop being in revoke state. If the issue isn't resolved after more than two hours, contact customer service. 

## Azure Active Directory Token Acquisition error 

### Reason for error? 

You see this error when Azure Cosmos DB is unable to obtain the default's identity Microsoft Azure Active Directory access token. The token is used for communicating with the Azure Key Vault in order to wrap and unwrap the data encryption key. 

### Troubleshooting 

Make sure that the current default identity assigned to the Azure Cosmos DB account is that of an existing Azure resource with all the correspondent permissions to access the Azure Key Vault. 

A troubleshooting solution, for example, would be to create a new identity with [the expected permission](./how-to-setup-customer-managed-keys.md) and set it as the new default identity via the Azure Cosmos DB account update operation. 

After updating the account's default identity, you need to wait upwards to one hour for the account to stop being in revoke state. If the issue isn't resolved after more than two hours, contact customer service. 

## Customer Managed Key does not exist 

### Reason for error? 

You see this error when the customer managed key isn't found on the specified Azure Key Vault. 

### Troubleshooting 

Check if the Azure Key Vault or the specified key exist and restore them if accidentally got deleted, then wait for one hour. If the issue isn't resolved after more than 2 hours, contact customer service. 

## Invalid Azure Cosmos DB default identity 

### Reason for error? 

The Azure Cosmos DB account goes into revoke state if it doesn't have any of these identity types set as a default identity: 

- FirstPartyIdentity 
- SystemAssignedIdentity 
- UserAssignedIdentity 
- DelegatedSystemAssignedIdentity 
- DelegatedUserAssignedIdentity 

### Troubleshooting 

Make sure that your default identity is that of a valid Azure resource and has all of [the expected permission](./how-to-setup-customer-managed-keys.md) to access the Azure Key Vault. Once the permissions have been assigned, wait upwards to one hour for the account to stop being in revoke state. If the issue isn't resolved after more than two hours, contact customer service. 

## Improper Syntax Detected on the Key Vault URI Property

### Reason for error?

You see this error when internal validation detects that the Key Vault URI property on the Azure Cosmos DB account is different than expected. 

### Troubleshooting 

You need to update your account's _KeyVaultkeyUri_ property to a valid Key Vault key URI. An example of a valid Azure Key Vault's key Uri would be: "https://ContosoKeyVault.vault.azure.net/keys". It's important to mention that including the version of the key isn't needed.  

Once the _KeyVaultKeyUri_ property has been updated, wait upwards to one hour for the account to stop being in revoke state. If the issue isn't resolved after more than two hours, contact customer service. 

## Internal unwrapping procedure error 

### Reason for error? 

You see the error message when the Azure Cosmos DB service is unable to unwrap the key properly. 

### Troubleshooting 

In case that either the Key Vault or the Costumer Managed Key has been recently deleted; restore the resource and wait for one hour. If the issue isn't resolved after more than 2 hours, contact customer service. 

## Unable to Resolve the Key Vault's DNS 

### Reason for error?

You see the error message when the Key Vault DNS name can't be resolved. The error may indicate that there's a major issue within the Azure Key Vault service that blocks Cosmos DB from accessing your key. 

### Troubleshooting 

If the Key Vault has been recently deleted, you need to restore it. If not, wait upwards of two hours for the account to become available again. If none of these solutions unblock the account, contact customer service. 
