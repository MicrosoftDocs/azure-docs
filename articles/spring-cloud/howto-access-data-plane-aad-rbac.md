---
title:  "Access data plane with AAD, RBAC"
description: How to access data plane with Azure Active Directory role based access control.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/04/2021
ms.custom: devx-track-java
---

# How to access data plane with AAD RBAC

This article explains how customers can access Azure Spring Cloud config server and service registry endpoints with Azure Active Directory (AAD) role-based access control (RBAC).

## Assign role to AAD user/group, MSI, or service principal

1. Go to service overview page of your service instance.

2. Click **Access Control (IAM)** to open the Access control blade.

3. Click **Add** button and **Add role assignment** (Authorization may be required to add).

4. Find and select *Azure Spring Cloud Data Reader* in **Role**, Assign access to `User, group, or service principal` or `User assigned managed identity` according to the user type. Search fro and select user.  Click `Save`

   ![assign-role](media/access-data-plane-aad-rbac/assign-data-reader-role.png)

## Access data plane

After AAD user is assigned *Azure Spring Cloud Data Reader* role, customers can login Azure CLI with user, service principal, or managed identity.  See [Authenticate Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli) to get access token.

```
az login
az account get-access-token
```

Currently CLI supports default endpoints of config server and service registry. For more information, see[Production ready endpoints](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-endpoints). Customers can also get full list of supported endpoints of config server and service registry by accessing endpoints "https://SERVICE_NAME.Root_Endpoint/eureka/actuator/" and "https://SERVICE_NAME.Root_Endpoint/config/actuator/" with the access token as authorization in header. Only the "GET" method is supported.

For example, access an endpoint like "https://SERVICE_NAME.Root_Endpoint/eureka/actuator/health" to see the health status of eureka.

Various root endpoints are shown below according to different cloud types.

| Cloud          | Root Endpoint              |
| -------------- | -------------------------- |
| Public         | svc.azuremicroservices.io  |
| Mooncake/China | svc.microservices.azure.cn |

If the response is *401 Unauthorized*, check to see if role is successfully assigned.  It will take several minutes for the role take effect. Or verify the access token is not expired.

## See also
* [Create roles and permissions](spring-cloud-howto-permissions.md)