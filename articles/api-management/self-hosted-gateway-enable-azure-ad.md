---
title: Enable Azure AD authentication for self-hosted gateway | Azure API Management
description: Learn now to enable the Azure API Management self-hosted gateway to authenticate with its associated cloud-based API Management instance using Azure Active Directory authentication. 
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 05/10/2023
ms.author: danlep
---

# Enable Azure AD authentication in the self-hosted gateway

The default authentication mechanism provided with the self-hosted gateway to connect with its associated API Management instance is an access token (authentication key). You can configure the access token to be valid for at most 30 days, after which it must be regenerated and the gateway configuration refreshed.

This article shows you how to enable the self-hosted gateway to authenticate to its associated cloud instance by using an Azure AD [app and service principal](../active-directory/develop/app-objects-and-service-principals.md). With Azure AD authentication, you can configure longer expiry times for secrets than provided using the access token. You also can use Azure role-based access control (RBAC) to scope access to a specific Azure API Management instance.

## Prerequisites

* An API Management instance in the Developer or Premium service tier. If needed, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
* Provision a [gateway resource](api-management-howto-provision-self-hosted-gateway.md) on the instance.
* Enable a [managed identity](api-management-howto-use-managed-service-identity.md) on the instance.

## Create custom roles

Create the following two [custom roles](../role-based-access-control/custom-roles.md) that are assigned in later steps. You can use the following JSON templates to create the custom roles with the [Azure portal](../role-based-access-control/custom-roles-portal.md), [Azure CLI](../role-based-access-control/custom-roles-cli.md), [Azure PowerShell](../role-based-access-control/custom-roles-powershell.md), or other Azure tools.

When configuring the custom roles, update the [`AssignableScopes`](../role-based-access-control/role-definitions.md#assignablescopes) property with appropriate scope values for your directory, such as a subscription in which your API Management instance is deployed. 

### API Management Configuration API Access Validator Service Role

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

### API Management Gateway Configuration Reader Service Role

```json
{
  "Description": "Can read self-hosted gateway configuration from Configuration API",
  "IsCustom": true,
  "Name": "API Management Gateway Configuration Reader Service Role",
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

## Add role assignments to API Management instance

### Add API Management Configuration API Access Validator Service Role assignment

Assign the API Management Configuration API Access Validator Service Role to the managed identity of the API Management instance. For steps to assign a role, see [Assign Azure roles using the portal](../role-based-access-control/role-assignments-portal.md).

### Register Azure AD app 

Create a new AD app and service principal. For steps, see [Create an Azure Active Directory application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md). This app will be used by the self-hosted gateway to authenticate to the API Management instance.

* Generate a [client secret](../active-directory/develop/howto-create-service-principal-portal.md#option-2-create-a-new-application-secret) 
* Take note of the following application values for use in the next section when deploying the self-hosted gateway: application (client) ID, directory (tenant) ID, and client secret

### Add API Management Gateway Configuration Reader Service Role assignment

[Assign](../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application) the API Management Gateway Configuration Reader Service Role to the app, scoped to the API Management instance.

## Deploy the self-hosted gateway

Deploy the self-hosted gateway to Kubernetes, adding Azure AD app registration settings to the `data` element of the gateways `ConfigMap`. In the following example YAML configuration file, the gateway is named *mygw* and the file is named `mgw.yaml`.

> [!IMPORTANT]
> If you're following the existing Kubernetes [deployment guidance](how-to-deploy-self-hosted-gateway-kubernetes.md):
> * Make sure to omit the step to store the default authentication key using the `kubectl create secret generic` command. 
> * Use the following basic configuration file in place of the default YAML file that's generated for you in the Azure portal. That file includes configuration to use an authentication key.
  
```yml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: mygw-env
  labels:
    app: mygw
data:
  config.service.endpoint: "danlep0510.configuration.azure-api.net"
  config.service.auth: azureAdApp 
  config.service.auth.azureAd.authority: "https://login.microsoftonline.com"  
  config.service.auth.azureAd.tenantId: "<Azure AD tenant ID>" 
  config.service.auth.azureAd.clientId: "<Azure AD client ID>" 
  config.service.auth.azureAd.clientSecret: "<Azure AD client secret>"
  gateway.name: mygw
  neighborhood.host: "mygw-instance-discovery"
  runtime.deployment.artifact.source: "Azure Portal"
  runtime.deployment.mechanism: "YAML"
  runtime.deployment.orchestrator.type: "Kubernetes"
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

## Confirm that the gateway is running

1. Run the following command to check if the deployment succeeded. It might take a little time for all the objects to be created and for the pods to initialize.

    ```console
    kubectl get deployments
    ```
    It should return
    ```console
        NAME             READY   UP-TO-DATE   AVAILABLE   AGE
    <gateway-name>   1/1     1            1           18s
    ```
1. Run the following command to check if the service was successfully created. Your service IPs and ports will be different.

    ```console
    kubectl get services
    ```
    It should return
    ```console
    NAME             TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
    <gateway-name>   LoadBalancer   10.99.236.168   <pending>     80:31620/TCP,443:30456/TCP   9m1s
    ```
1. Go back to the Azure portal and select **Overview**.
1. Confirm that **Status** shows a green check mark, followed by a node count that matches the number of replicas specified in the YAML file. This status means the deployed self-hosted gateway pods are successfully communicating with the API Management service and have a regular "heartbeat."


## Next steps

* Learn more about the API Management [self-hosted gateway overview](self-hosted-gateway-overview.md).
* Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md).
* Learn [how to deploy API Management self-hosted gateway to Azure Arc-enabled Kubernetes clusters](how-to-deploy-self-hosted-gateway-azure-arc.md).

[helm]: https://helm.sh/
[helm-install]: https://helm.sh/docs/intro/install/