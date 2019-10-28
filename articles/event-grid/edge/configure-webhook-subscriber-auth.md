---
title: Configure webhook subscriber authentication - Azure Event Grid IoT Edge | Microsoft Docs 
description: Configure webhook subscriber authentication 
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/06/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Configure webhook subscriber authentication

This guide gives examples of the possible webhook subscriber configurations for an Event Grid module. By default, only HTTPS endpoints are accepted for webhook subscribers. The Event Grid module will reject if the subscriber presents a self-signed certificate.

## Allow only HTTPS subscriber

```json
 {
  "Env": [
    "outbound:webhook:httpsOnly=true",
    "outbound:webhook:skipServerCertValidation=false",
    "outbound:webhook:allowUnknownCA=false"
  ]
}
 ```

## Allow HTTPS subscriber with self-signed certificate

```json
 {
  "Env": [
    "outbound:webhook:httpsOnly=true",
    "outbound:webhook:skipServerCertValidation=false",
    "outbound:webhook:allowUnknownCA=true"
  ]
}
 ```

>[!NOTE]
>Set the property `outbound:webhook:allowUnknownCA` to `true` only in test environments as you might typically use self-signed certificates. For production workloads we recommend them to be set to **false**.

## Allow HTTPS subscriber but skip certificate validation

```json
 {
  "Env": [
    "outbound:webhook:httpsOnly=true",
    "outbound:webhook:skipServerCertValidation=true",
    "outbound:webhook:allowUnknownCA=false"
  ]
}
 ```

>[!NOTE]
>Set the property `outbound:webhook:skipServerCertValidation` to `true` only in test environments as you might not be presenting a certificate that needs to be authenticated. For production workloads we recommend them to be set to **false**

## Allow both HTTP and HTTPS with self-signed certificates

```json
 {
  "Env": [
    "outbound:webhook:httpsOnly=false",
    "outbound:webhook:skipServerCertValidation=false",
    "outbound:webhook:allowUnknownCA=true"
  ]
}
 ```

>[!NOTE]
>Set the property `outbound:webhook:httpsOnly` to `false` only in test environments as you might want to bring up a HTTP subscriber first. For production workloads we recommend them to be set to **true**
