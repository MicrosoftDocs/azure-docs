---
 title: include file
 description: include file
 services: digital-twins
 author: kingdomofends
 ms.service: digital-twins
 ms.topic: include
 ms.date: 12/20/2018
 ms.author: adgera
 ms.custom: include file
---

The following table describes the roles that are available in Azure Digital Twins:

| **Role** | **Description** | **Identifier** |
| --- | --- | --- |
| Space Administrator | *CREATE*, *READ*, *UPDATE*, and *DELETE* permission for the specified space and all nodes underneath. Global permission. | 98e44ad7-28d4-4007-853b-b9968ad132d1 |
| User Administrator| *CREATE*, *READ*, *UPDATE*, and *DELETE* permission for users and user-related objects. *READ* permission for spaces. | dfaac54c-f583-4dd2-b45d-8d4bbc0aa1ac |
| Device Administrator | *CREATE*, *READ*, *UPDATE*, and *DELETE* permission for devices and device-related objects. *READ* permission for spaces. | 3cdfde07-bc16-40d9-bed3-66d49a8f52ae |
| Key Administrator | *CREATE*, *READ*, *UPDATE*, and *DELETE*  permission for access keys. *READ* permission for spaces. | 5a0b1afc-e118-4068-969f-b50efb8e5da6 |
| Token Administrator |  *READ* and *UPDATE* permission for access keys. *READ* permission for spaces. | 38a3bb21-5424-43b4-b0bf-78ee228840c3 |
| User |  *READ* permission for spaces, sensors, and users, which includes their corresponding related objects. | b1ffdb77-c635-4e7e-ad25-948237d85b30 |
| Support Specialist |  *READ* permission for everything except access keys. | 6e46958b-dc62-4e7c-990c-c3da2e030969 |
| Device Installer | *READ* and *UPDATE* permission for devices and sensors, which includes their corresponding related objects. *READ* permission for spaces. | b16dd9fe-4efe-467b-8c8c-720e2ff8817c |
| Gateway Device | *CREATE* permission for sensors. *READ* permission for devices and sensors, which includes their corresponding related objects. | d4c69766-e9bd-4e61-bfc1-d8b6e686c7a8 |