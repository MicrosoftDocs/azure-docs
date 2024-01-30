---
title: Azure API Management self-hosted gateway - Microsoft Entra authentication
description: Enable the Azure API Management self-hosted gateway to authenticate with its associated cloud-based API Management instance using Microsoft Entra authentication. 
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 05/22/2023
ms.author: danlep
---

# Use Microsoft Entra authentication for the self-hosted gateway

The Azure API Management [self-hosted gateway](self-hosted-gateway-overview.md) needs connectivity with its associated cloud-based API Management instance for reporting status, checking for and applying configuration updates, and sending metrics and events. 

In addition to using a gateway access token (authentication key) to connect with its cloud-based API Management instance, you can enable the self-hosted gateway to authenticate to its associated cloud instance by using an [Microsoft Entra app](../active-directory/develop/app-objects-and-service-principals.md). With Microsoft Entra authentication, you can configure longer expiry times for secrets and use standard steps to manage and rotate secrets in Active Directory. 

## Scenario overview

The self-hosted gateway configuration API can check Azure RBAC to determine who has permissions to read the gateway configuration. After you create a Microsoft Entra app with those permissions, the self-hosted gateway can authenticate to the API Management instance using the app. 

To enable Microsoft Entra authentication, complete the following steps:
1. Create two custom roles to:
    * Let the configuration API get access to customer's RBAC information
    * Grant permissions to read self-hosted gateway configuration
1. Grant RBAC access to the API Management instance's managed identity 
1. Create a Microsoft Entra app and grant it access to read the gateway configuration
1. Deploy the gateway with new configuration options

## Prerequisites

* An API Management instance in the Developer or Premium service tier. If needed, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
* Provision a [gateway resource](api-management-howto-provision-self-hosted-gateway.md) on the instance.
* Enable a [system-assigned managed identity](api-management-howto-use-managed-service-identity.md) on the instance.
* Self-hosted gateway container image version 2.2 or later

### Limitations notes

* Only system-assigned managed identity is supported.

## Create custom roles

Create the following two [custom roles](../role-based-access-control/custom-roles.md) that are assigned in later steps. You can use the permissions listed in the following JSON templates to create the custom roles using the [Azure portal](../role-based-access-control/custom-roles-portal.md), [Azure CLI](../role-based-access-control/custom-roles-cli.md), [Azure PowerShell](../role-based-access-control/custom-roles-powershell.md), or other Azure tools.

When configuring the custom roles, update the [`AssignableScopes`](../role-based-access-control/role-definitions.md#assignablescopes) property with appropriate scope values for your directory, such as a subscription in which your API Management instance is deployed. 

**API Management Configuration API Access Validator Service Role**

```json
{
  "Description": "Can access RBAC permissions on the API Management resource to authorize requests in Configuration API.",
  "IsCustom": true,
  "Name": "API Management Configuration API Access Validator Service Role",
  "Permissions": [
    {
      "Actions": [
        "Microsoft.Authorization/denyAssignments/read",
        "Microsoft.Authorization/roleAssignments/read",
        "Microsoft.Authorization/roleDefinitions/read"
      ],
      "NotActions": [],
      "DataActions": [],
      "NotDataActions": []
    }
  ],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscriptionID}"
  ]
}
```

**API Management Gateway Configuration Reader Role**

```json
{
  "Description": "Can read self-hosted gateway configuration from Configuration API",
  "IsCustom": true,
  "Name": "API Management Gateway Configuration Reader Role",
  "Permissions": [
    {
      "Actions": [],
      "NotActions": [],
      "DataActions": [
        "Microsoft.ApiManagement/service/gateways/getConfiguration/action"
      ],
      "NotDataActions": []
    }
  ],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscriptionID}"
  ]
}
```

## Add role assignments

### Assign API Management Configuration API Access Validator Service Role 

Assign the API Management Configuration API Access Validator Service Role to the managed identity of the API Management instance. For detailed steps to assign a role, see [Assign Azure roles using the portal](../role-based-access-control/role-assignments-portal.md). 

* Scope: The  resource group or subscription in which the API Management instance is deployed
* Role: API Management Configuration API Access Validator Service Role
* Assign access to: Managed identity of API Management instance

### Assign API Management Gateway Configuration Reader Role

<a name='step-1-register-azure-ad-app'></a>

#### Step 1: Register Microsoft Entra app 

Create a new Microsoft Entra app. For steps, see [Create a Microsoft Entra application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md). This app will be used by the self-hosted gateway to authenticate to the API Management instance.

* Generate a [client secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret) 
* Take note of the following application values for use in the next section when deploying the self-hosted gateway: application (client) ID, directory (tenant) ID, and client secret

#### Step 2: Assign API Management Gateway Configuration Reader Service Role

[Assign](../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application) the API Management Gateway Configuration Reader Service Role to the app.

* Scope: The API Management instance (or resource group or subscription in which it's deployed)
* Role: API Management Gateway Configuration Reader Role
* Assign access to: Microsoft Entra app

## Deploy the self-hosted gateway

Deploy the self-hosted gateway to Kubernetes, adding Microsoft Entra app registration settings to the `data` element of the gateways `ConfigMap`. In the following example YAML configuration file, the gateway is named *mygw* and the file is named `mygw.yaml`.

> [!IMPORTANT]
> If you're following the existing Kubernetes [deployment guidance](how-to-deploy-self-hosted-gateway-kubernetes.md):
> * Make sure to omit the step to store the default authentication key using the `kubectl create secret generic` command. 
> * Substitute the following basic configuration file for the default YAML file that's generated for you in the Azure portal. The following file adds Microsoft Entra configuration in place of configuration to use an authentication key.
  
```yml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: mygw-env
  labels:
    app: mygw
data:
  config.service.endpoint: "<service-name>.configuration.azure-api.net"
  config.service.auth: azureAdApp 
  config.service.auth.azureAd.authority: "https://login.microsoftonline.com"  
  config.service.auth.azureAd.tenantId: "<Azure AD tenant ID>" 
  config.service.auth.azureAd.clientId: "<Azure AD client ID>" 
  config.service.auth.azureAd.clientSecret: "<Azure AD client secret>"
  gateway.name: <gateway-id>
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mygw
  labels:
    app: mygw
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mygw
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 25%
  template:
    metadata:
      labels:
        app: mygw
    spec:
      terminationGracePeriodSeconds: 60
      containers:
      - name: mygw
        image: mcr.microsoft.com/azure-api-management/gateway:v2
        ports:
        - name: http
          containerPort: 8080
        - name: https
          containerPort: 8081
          # Container port used for rate limiting to discover instances
        - name: rate-limit-dc
          protocol: UDP
          containerPort: 4290
          # Container port used for instances to send heartbeats to each other
        - name: dc-heartbeat
          protocol: UDP
          containerPort: 4291
        readinessProbe:
          httpGet:
            path: /status-0123456789abcdef
            port: http
            scheme: HTTP
          initialDelaySeconds: 0
          periodSeconds: 5
          failureThreshold: 3
          successThreshold: 1
        envFrom:
        - configMapRef:
            name: mygw-env
---
apiVersion: v1
kind: Service
metadata:
  name: mygw-live-traffic
  labels:
    app: mygw
spec:
  type: LoadBalancer
  externalTrafficPolicy: Local
  ports:
  - name: http
    port: 80
    targetPort: 8080
  - name: https
    port: 443
    targetPort: 8081
  selector:
    app: mygw
---
apiVersion: v1
kind: Service
metadata:
  name: mygw-instance-discovery
  labels:
    app: mygw
  annotations:
    azure.apim.kubernetes.io/notes: "Headless service being used for instance discovery of self-hosted gateway"
spec:
  clusterIP: None
  type: ClusterIP
  ports:
  - name: rate-limit-discovery
    port: 4290
    targetPort: rate-limit-dc
    protocol: UDP
  - name: discovery-heartbeat
    port: 4291
    targetPort: dc-heartbeat
    protocol: UDP
  selector:
    app: mygw
```

Deploy the gateway to Kubernetes with the following command:

```Console
kubectl apply -f mygw.yaml
```

[!INCLUDE [api-management-self-hosted-gateway-kubernetes-services](../../includes/api-management-self-hosted-gateway-kubernetes-services.md)]

## Next steps

* Learn more about the API Management [self-hosted gateway overview](self-hosted-gateway-overview.md).
* Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md).
* Learn [how to deploy API Management self-hosted gateway to Azure Arc-enabled Kubernetes clusters](how-to-deploy-self-hosted-gateway-azure-arc.md).

[helm]: https://helm.sh/
[helm-install]: https://helm.sh/docs/intro/install/
