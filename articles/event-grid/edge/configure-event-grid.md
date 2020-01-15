---
title: Configuration - Azure Event Grid IoT Edge | Microsoft Docs 
description: Configuration in Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/03/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Event Grid Configuration

Event Grid provides many configurations that can be modified per environment. The following section is a reference to all the available options and their defaults.

## TLS configuration

To learn about client authentication in general, see [Security and Authentication](security-authentication.md). Examples of its usage can be found in [this article](configure-api-protocol.md).

| Property Name | Description |
| ---------------- | ------------ |
|`inbound:serverAuth:tlsPolicy`| TLS Policy of the Event Grid module. Default value is HTTPS only.
|`inbound:serverAuth:serverCert:source`| Source of server certificate used by the Event Grid Module for its TLS configuration. Default value is IoT Edge.

## Incoming client authentication

To learn about client authentication in general, see [Security and Authentication](security-authentication.md). Examples can be found in [this article](configure-client-auth.md).

| Property Name | Description |
| ---------------- | ------------ |
|`inbound:clientAuth:clientCert:enabled`| To turn on/off certificate-based client authentication. Default value is true.
|`inbound:clientAuth:clientCert:source`| Source for validating client certificates. Default value is IoT Edge.
|`inbound:clientAuth:clientCert:allowUnknownCA`| Policy to allow a self-signed client certificate. Default value is true.
|`inbound:clientAuth:sasKeys:enabled`| To turn on/off SAS key based client authentication. Default value is off.
|`inbound:clientAuth:sasKeys:key1`| One of the values to validate incoming requests.
|`inbound:clientAuth:sasKeys:key2`| Optional second value to validate incoming requests.

## Outgoing client authentication
To learn about client authentication in general, see [Security and Authentication](security-authentication.md). Examples can be found in [this article](configure-identity-auth.md).

| Property Name | Description |
| ---------------- | ------------ |
|`outbound:clientAuth:clientCert:enabled`| To turn on/off attaching an identity certificate for outgoing requests. Default value is true.
|`outbound:clientAuth:clientCert:source`| Source for retrieving Event Grid module's outgoing certificate. Default value is IoT Edge.

## Webhook event handlers

To learn about client authentication in general, see [Security and Authentication](security-authentication.md). Examples can be found in [this article](configure-webhook-subscriber-auth.md).

| Property Name | Description |
| ---------------- | ------------ |
|`outbound:webhook:httpsOnly`| Policy to control whether only HTTPS subscribers will be allowed. Default value is true (only HTTPS).
|`outbound:webhook:skipServerCertValidation`| Flag to control whether to validate the subscriber's certificate. Default value is true.
|`outbound:webhook:allowUnknownCA`| Policy to control whether a self-signed certificate can be presented by a subscriber. Default value is true. 

## Delivery and retry

To learn about this feature in general, see [Delivery and Retry](delivery-retry.md).

| Property Name | Description |
| ---------------- | ------------ |
| `broker:defaultMaxDeliveryAttempts` | Maximum number of attempts to deliver an event. Default value is 30.
| `broker:defaultEventTimeToLiveInSeconds` | Time-to-live (TTL) in seconds after which an event will be dropped if not delivered. Default value is  **7200** seconds

## Output batching

To learn about this feature in general, see [Delivery and Output batching](delivery-output-batching.md).

| Property Name | Description |
| ---------------- | ------------ |
| `api:deliveryPolicyLimits:maxBatchSizeInBytes` | Maximum value allowed for the `ApproxBatchSizeInBytes` knob. Default value is `1_058_576`.
| `api:deliveryPolicyLimits:maxEventsPerBatch` | Maximum value allowed for the `MaxEventsPerBatch` knob. Default value is `50`.
| `broker:defaultMaxBatchSizeInBytes` | Maximum delivery request size when only `MaxEventsPerBatch` is specified. Default value is `1_058_576`.
| `broker:defaultMaxEventsPerBatch` | Maximum number of events to add to a batch when only `MaxBatchSizeInBytes` is specified. Default value is `10`.
