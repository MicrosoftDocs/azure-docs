---
title: Central Manager API specifications
description: This section describes the following Central Manager APIs.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Central Manager API specifications

This section describes the following Central Manager APIs.

- **/external/v1/alerts/<UUID>**

- **Alert Exclusions (Maintenance Window)**

:::image type="content" source="media/image8.png" alt-text="Screenshot of Alert Exclusion view":::

Define conditions under which alerts will not be sent. For example, define and update stop and start times, assets or subnets that should be excluded when triggering alerts, or CyberX engines that should be excluded. For example, during a maintenance window, you may want to stop alert delivery of all alerts, except for malware alerts on critical assets.

The APIs you define here appear in the Central Manager, Alert Exclusion rule window as a read-only exclusion rule

## /external/v1/maintenanceWindow

- **/external/authentication/validation**

- **Response Example**

- **response:**

```rest
{
    "msg": "Authentication succeeded."
}

```

## Change Password

Use this API to let users to change their own passwords. All CyberX user roles can work with the API. You do not need a CyberX access token to use this API.

- **/external/authentication/set_password**

- **User Password Update by System Admin**

Use this API to let system administrators change passwords for specific users. CyberX Admin user roles can work with the API. You do not need a CyberX access token to use this API.

- **/external/authentication/set_password_by_admin**