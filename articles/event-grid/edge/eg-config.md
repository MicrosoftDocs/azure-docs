---
title: Configuration - Azure Event Grid IoT Edge | Microsoft Docs 
description: Configuration in Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 09/04/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Configuration

Event Grid provides allows configuration that can be modified per environment. The below section provides a reference to all the available ones with their defaults.

## TLS Configuration

For a deeper understanding on this topic refer to [Security and Authentication](security-authentication.md). Examples of its usage can be found [here](configure-api-protocol.md).

| Property Name | Description |
| ---------------- | ------------ |
|`inbound:serverAuth:tlsPolicy`|TLS Policy of the Event Grid module. Default HTTPs only.
|`inbound:serverAuth:serverCert:source`|Source of Server Certificate used by Event Grid Module for its TLS configuration. Default IoTEdge.

## Incoming Client Authentication

For a deeper understanding on this topic refer to [Security and Authentication](security-authentication.md). Examples can be found [here](configure-client-auth.md).

| Property Name | Description |
| ---------------- | ------------ |
|`inbound:clientAuth:clientCert:enabled`| To turn on/off Certificate based client authentication. Default on.
|`inbound:clientAuth:clientCert:source`| Source for validating client certificates. Default IoTEdge.
|`inbound:clientAuth:clientCert:allowUnknownCA`| Policy to allow a self-signed client certificate. Default on.
|`inbound:clientAuth:sasKeys:enabled`| To turn on/off SAS key based client authentication. Default off.
|`inbound:clientAuth:sasKeys:key1`| One of the values to use to validate incoming requests.
|`inbound:clientAuth:sasKeys:key2`| Optional second value to use to validate incoming requests.

## Outgoing Client Authentication

For a deeper understanding on this topic refer to [Security and Authentication](security-authentication.md). Examples can be found [here](configure-identity-auth.md).

| Property Name | Description |
| ---------------- | ------------ |
|`outbound:clientAuth:clientCert:enabled`| To turn on/off attaching an identity certificate for outgoing requests. Default on.
|`outbound:clientAuth:clientCert:source`| Source for retrieving Event Grid module's outgoing certificate. Default IoTEdge.

## Webhook EventHandlers

For a deeper understanding on this topic refer to [Security and Authentication](security-authentication.md). Examples can be found [here](configure-webhook-subscriber-auth.md).

| Property Name | Description |
| ---------------- | ------------ |
|`outbound:webhook:httpsOnly`| Policy to control whether only HTTPs subscribers will be allowed. Default only HTTPs subscribers.
|`outbound:webhook:skipServerCertValidation`| Flag to control whether to validate the subscriber's certificate. Default true.
|`outbound:webhook:allowUnknownCA`| Policy to control whether a self-signed certificate can be presented by a subscriber. Default on.

## Delivery and Retry

For a deeper understanding on this topic refer to [Delivery and Retry](delivery-retry.md).

| Property Name | Description |
| ---------------- | ------------ |
| `broker:defaultMaxDeliveryAttempts` | Maximum number of attempts to deliver an event. Default 30.
| `broker:defaultEventTimeToLiveInSeconds` | Event TTL in seconds after which an event will be dropped if not delivered. Default **7200** seconds

## Output Batching

For a deeper understanding on this topic refer to [Delivery and Output batching](delivery-output-batching.md).

| Property Name | Description |
| ---------------- | ------------ |
| `api:deliveryPolicyLimits:maxBatchSizeInBytes` | Maximum value allowed for the `ApproxBatchSizeInBytes` knob. Default `1_058_576`.
| `api:deliveryPolicyLimits:maxEventsPerBatch` | Maximum value allowed for the `MaxEventsPerBatch` knob. Default `50`.
| `broker:defaultMaxBatchSizeInBytes` | Maximum delivery request size when only `MaxEventsPerBatch` is specified. Default `1_058_576`.
| `broker:defaultMaxEventsPerBatch` | Maximum number of events to add to a batch when only `MaxBatchSizeInBytes` is specified. Default `10`.
