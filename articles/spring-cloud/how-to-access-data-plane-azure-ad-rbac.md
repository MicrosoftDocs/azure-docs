---
title: "Access Config Server and Service Registry"
titleSuffix: Azure Spring Cloud
description: How to access Config Server and Service Registry Endpoints with Azure Active Directory role-based access control.
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/04/2021
ms.custom: devx-track-java, subject-rbac-steps
---

# Access Config Server and Service Registry

This article explains how to access the Spring Cloud Config Server and Spring Cloud Service Registry managed by Azure Spring Cloud using Azure Active Directory (Azure AD) role-based access control (RBAC).

## Assign role to Azure AD user/group, MSI, or service principal

Assign the role to the [user | group | service-principal | managed-identity] at [management-group | subscription | resource-group | resource] scope.
| Role name | Description |
| - | - |
| Azure Spring Cloud Config Server Reader | Allow read access to Azure Spring Cloud Config Server |
| Azure Spring Cloud Config Server Contributor | Allow read, write and delete access to Azure Spring Cloud Config Server |
| Azure Spring Cloud Service Registry Reader | Allow read access to Azure Spring Cloud Service Registry |
| Azure Spring Cloud Service Registry Contributor | Allow read, write and delete access to Azure Spring Cloud Service Registry |

For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

## Access Config Server and Service Registry Endpoints

After the role is assigned, customers can access the Spring Cloud Config Server and the Spring Cloud Service Registry endpoints. Use the following procedures:

1. Get an access token. After an Azure AD user is assigned the role, customers can use the following commands to log in to Azure CLI with user, service principal, or managed identity to get an access token. For details, see [Authenticate Azure CLI](/cli/azure/authenticate-azure-cli). 

    ```azurecli
    az login
    az account get-access-token
    ```
1. Compose the endpoint. We support default endpoints of the Spring Cloud Config Server and Spring Cloud Service Registry managed by Azure Spring Cloud. For more information, see [Production ready endpoints](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-endpoints).

    * *'https://SERVICE_NAME.svc.azuremicroservices.io/eureka/{path}/'*
    * *'https://SERVICE_NAME.svc.azuremicroservices.io/config/{path}/'* 

    >[!NOTE]
    > If you are using Azure China, please replace `*.azuremicroservices.io` with `*.microservices.azure.cn`, [learn more](/azure/china/resources-developer-guide#check-endpoints-in-azure).

1. Access the composed endpoint with the access token. Put the access token in a header to provide authorization: `--header 'Authorization: Bearer {TOKEN_FROM_PREVIOUS_STEP}`.

    For example, 

    a. access an endpoint like *'https://SERVICE_NAME.svc.azuremicroservices.io/config/actuator/health'* to see the health status of Config Server.

    b. access an endpoint like *'https://SERVICE_NAME.svc.azuremicroservices.io/eureka/eureka/apps'* to see the registered apps in eureka.

    If the response is *401 Unauthorized*, check to see if the role is successfully assigned.  It will take several minutes for the role take effect or verify that the access token has not expired.

## Access Config Server and Service Registry in Java application
Both Config Server and Service Registry support [custom rest template](https://cloud.spring.io/spring-cloud-config/reference/html/#custom-rest-template) to inject the bearer token for authentication. Please check the [code example (branch `dataplane`)](https://github.com/leonard520/spring-petclinic-microservices.git) about how to implement your own Config Server / Service Registry rest template integrated with Azure AD.


## Next steps
* [Authenticate Azure CLI](/cli/azure/authenticate-azure-cli)
* [Production ready endpoints](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-endpoints)

## See also
* [Create roles and permissions](how-to-permissions.md)