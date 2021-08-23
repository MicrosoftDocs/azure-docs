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
1. Compose the endpoint. We support default endpoints of the Spring Cloud Config Server and Spring Cloud Service Registry managed by Azure Spring Cloud. 
    
    * *'https://SERVICE_NAME.svc.azuremicroservices.io/eureka/{path}'*
    * *'https://SERVICE_NAME.svc.azuremicroservices.io/config/{path}'* 

    >[!NOTE]
    > If you are using Azure China, please replace `*.azuremicroservices.io` with `*.microservices.azure.cn`, [learn more](/azure/china/resources-developer-guide#check-endpoints-in-azure).

1. Access the composed endpoint with the access token. Put the access token in a header to provide authorization: `--header 'Authorization: Bearer {TOKEN_FROM_PREVIOUS_STEP}`.

    For example, 

    a. access an endpoint like *'https://SERVICE_NAME.svc.azuremicroservices.io/config/actuator/health'* to see the health status of Config Server.

    b. access an endpoint like *'https://SERVICE_NAME.svc.azuremicroservices.io/eureka/eureka/apps'* to see the registered apps in Spring Cloud Service Registry (Eureka here).

    If the response is *401 Unauthorized*, check to see if the role is successfully assigned.  It will take several minutes for the role take effect or verify that the access token has not expired.

1. More reference for endpoint path

    - For more information about actuator endpoint, see [Production ready endpoints](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-endpoints).

    - For eureka endpoints, see [Eureka-REST-operations](https://github.com/Netflix/eureka/wiki/Eureka-REST-operations)

    - For config server endpoints, refer to [ResourceController.java](https://github.com/spring-cloud/spring-cloud-config/blob/main/spring-cloud-config-server/src/main/java/org/springframework/cloud/config/server/resource/ResourceController.java) and [EncryptionController.java](https://github.com/spring-cloud/spring-cloud-config/blob/main/spring-cloud-config-server/src/main/java/org/springframework/cloud/config/server/encryption/EncryptionController.java) for detail path infomation.

## Register Spring Boot apps to Spring Cloud Config Server and Service Registry managed by Azure Spring Cloud

After the role is assigned, customers can register Spring Boot apps to Spring Cloud Config Server and Service Registry managed by Azure Spring Cloud with Azure AD token authentication. Both Config Server and Service Registry support [custom rest template](https://cloud.spring.io/spring-cloud-config/reference/html/#custom-rest-template) to inject the bearer token for authentication. 

You can refer to [code example](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples) about how to implement your own Config Server / Service Registry rest template integrated with Azure AD. Please pay attention to the below key code piece.

1. AccessTokenManager.java

    It is responsible to get access token from Azure AD. Please configure the service principal's login information in the `application.properties` and initialize `ApplicationTokenCredentials` to get token. 
    ```
    prop.load(in);
            tokenClientId = prop.getProperty("access.token.clientId");
            String tenantId = prop.getProperty("access.token.tenantId");
            String secret = prop.getProperty("access.token.secret");
            String clientId = prop.getProperty("access.token.clientId");
            credentials = new ApplicationTokenCredentials(
                clientId, tenantId, secret, AzureEnvironment.AZURE);
    ```

1. CustomConfigServiceBootstrapConfiguration.java

    `CustomConfigServiceBootstrapConfiguration` implments the custom rest template for Config Server and inject the token from Azure AD as `Authorization` headers.

    ```
    public class RequestResponseHandlerInterceptor implements ClientHttpRequestInterceptor {

        @Override
        public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
            String accessToken = AccessTokenManager.getToken();
            request.getHeaders().remove(AUTHORIZATION);
            request.getHeaders().add(AUTHORIZATION, "Bearer " + accessToken);

            ClientHttpResponse response = execution.execute(request, body);
            return response;
        }

    }
    ```

1. CustomRestTemplateTransportClientFactories.java
    
    The two classes are for the implmentation of the custom rest template for Spring Cloud Service Registry. The `intercept` part is same as Config Server above. One thing to note is to make sure to add `factory.mappingJacksonHttpMessageConverter()` to the message converters.
    ```
    private RestTemplate customRestTemplate() {
        /*
         * Inject your custom rest template
         */
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors()
            .add(new RequestResponseHandlerInterceptor());
        RestTemplateTransportClientFactory factory = new RestTemplateTransportClientFactory();

        restTemplate.getMessageConverters().add(0, factory.mappingJacksonHttpMessageConverter());

        return restTemplate;
    }
    ```

1. If you are running on applications on kubernetes cluster, it is recommand to use IP address to register to Spring Cloud Service Registry for access.
    ```
    eureka.instance.prefer-ip-address=true
    ```

## Next steps

* [Authenticate Azure CLI](/cli/azure/authenticate-azure-cli)
* [Production ready endpoints](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-endpoints)
* [Create roles and permissions](how-to-permissions.md)
