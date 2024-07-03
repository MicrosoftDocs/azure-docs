---
title: AzCopy V10 error code reference
description: A list of error codes that can be returned by the Azure Blob Storage API when working with AzCopy
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 04/18/2024
ms.author: normesta
ms.subservice: storage-common-concepts
---

# Error codes: AzCopy V10

The following errors can be returned by the Azure Blob Storage API when working with AzCopy. The error codes are organized by HTTP status code. For a list of all common REST API error codes, see [Common REST API error codes](/rest/api/storageservices/common-rest-api-error-codes). For a list of Azure Blob Service error codes, see [Azure Blob Storage error codes](/rest/api/storageservices/blob-service-error-codes).

## Bad Request (400)

### InvalidOperation

Invalid operation against a blob snapshot. Snapshots are read-only. You can't modify them. If you want to modify a blob, you must use the base blob, not a snapshot.

### MissingRequiredQueryParameter

A required query parameter wasn't specified for this request.

### InvalidHeaderValue

The value provided for one of the HTTP headers wasn't in the correct format.

## Unauthorized (401)

### InvalidAuthenticationInfo

Server failed to authenticate the request. Refer to the information in the www-authenticate header.

### NoAuthenticationInformation

Server failed to authenticate the request. Refer to the information in the www-authenticate header.

## Forbidden (403)

### AuthenticationFailed

Server failed to authenticate the request. Make sure the value of the Authorization header is formed correctly including the signature.

### AccountIsDisabled

The specified account is disabled. Your Azure subscription can get disabled because your credit has expired or if you reached your spending limit. It can also get disabled if you have an overdue bill, hit your credit card limit, or because the Account Administrator canceled the subscription.

## Not Found (404)

### ResourceNotFound

The specified resource doesn't exist.

## Conflict (409)

### ResourceTypeMismatch

The specified resource type doesn't match the type of the existing resource.

## Internal Server Error (500)

### CannotVerifyCopySource

This error is returned when you try to copy a blob from a source that isn't accessible. More information and possible workarounds can be found [here](/troubleshoot/azure/azure-storage/blobs/connectivity/copy-blobs-between-storage-accounts-network-restriction#copy-blobs-between-storage-accounts-in-a-hub-spoke-architecture-using-private-endpoints).

## Service Unavailable (503)

### ServerBusy

The server is currently unable to receive requests. Retry your request.

- Ingress is over the account limit.
- Egress is over the account limit.
- Operations per second is over the account limit.

You can use the Storage insights to monitor the account limits. See [Monitoring your storage service with Azure Monitor Storage insights](storage-insights-overview.md).
