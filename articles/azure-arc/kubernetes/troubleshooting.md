---
title: "Troubleshoot common Azure Arc enabled Kubernetes issues"
ms.service: arc-kubernetes
ms.date: 05/19/2020
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Troubleshooting common issues with Arc enbaled Kubernetes clusters."
keywords: "Kubernetes, Arc, Azure, containers"
---

# Azure Arc enabled Kubernetes troubleshooting

## General troubleshooting

### az CLI setup
Before using az connectedk8s or az k8sconfiguration CLI commands, assure that az is set to work against the correct Azure subscription.

```console
az account set --subscription 'subscriptionId'
az account show
```

### azure-arc agents
All agents for Azure Arc enabled Kubernetes are deployed as pods in the `azure-arc` namespace. Under normal operations all pods should be running and passing their health checks.

First, verify the Azure Arc helm release:

```console
$ helm --namespace default status azure-arc
NAME: azure-arc
LAST DEPLOYED: Fri Apr  3 11:13:10 2020
NAMESPACE: default
STATUS: deployed
REVISION: 5
TEST SUITE: None
```

If the Helm release is not found or missing, try onboarding the cluster again.

If the Helm release is present and `STATUS: deployed` determine the status of the agents using `kubectl`:

```console
$ kubectl -n azure-arc get deploy,pods
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/config-agent         1/1     1            1           53s
deployment.apps/connect-agent        1/1     1            1           53s
deployment.apps/controller-manager   1/1     1            1           53s
deployment.apps/metrics-agent        1/1     1            1           53s

NAME                                      READY   STATUS    RESTARTS   AGE
pod/config-agent-74cf758b5f-cxnhs         2/2     Running   0          53s
pod/connect-agent-bc6b9ff5d-dzkvf         2/2     Running   0          53s
pod/controller-manager-7cf95d5d77-wv5cw   2/2     Running   0          53s
pod/metrics-agent-c77c9dfc7-45n5r         1/1     Running   0          53s
```

All Pods should show `STATUS` as `Running` and `READY` should be either `2/2` or `1/1`. Fetch logs and describe pods that are returning `Error` or `CrashLoopBackOff`.

## Unable to connect my Kubernetes cluster to Azure

Connecting clusters to Azure requires access to both an Azure subscription and `cluster-admin` access to a target cluster. If the cluster cannot be reached or has insufficient permissions onboarding will fail.

### Insufficient cluster permissions

If the provided kubeconfig file does not have sufficient permissions to install the Azure Arc agents, the CLI command will return an error attempting to call the Kubernetes API.

```console
$ az connectedk8s connect --resource-group AzureArc --name AzureArcCluster
Command group 'connectedk8s' is in preview. It may be changed/removed in a future release.
Ensure that you have the latest helm version installed before proceeding to avoid unexpected errors.
This operation might take a while...

Error: list: failed to list: secrets is forbidden: User "myuser" cannot list resource "secrets" in API group "" at the cluster scope
```

Cluster owner should use a Kubernetes user with cluster administrator permissions.

### Installation timeouts

Azure Arc agent installation requires running a set of containers on the target cluster. If the cluster is running over a slow internet connection the container image pull may take longer than the CLI timeouts.

```console
$ az connectedk8s connect --resource-group AzureArc --name AzureArcCluster
Command group 'connectedk8s' is in preview. It may be changed/removed in a future release.
Ensure that you have the latest helm version installed before proceeding to avoid unexpected errors.
This operation might take a while...

There was a problem with connect-agent deployment. Please run 'kubectl -n azure-arc logs -l app.kubernetes.io/component=connect-agent -c connect-agent' to debug the error.
```

### Incorrect or expired onboarding credentials

```console
$ kubectl -n azure-arc get deploy,pod
NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/config-agent         1/1     1            1           8m11s
deployment.apps/connect-agent        0/1     1            0           8m11s
deployment.apps/controller-manager   1/1     1            1           8m11s
deployment.apps/metrics-agent        1/1     1            1           8m11s

NAME                                      READY   STATUS             RESTARTS   AGE
pod/config-agent-74cf758b5f-d7qz9         2/2     Running            0          8m11s
pod/connect-agent-bc6b9ff5d-sd9fb         1/2     CrashLoopBackOff   6          8m11s
pod/controller-manager-7cf95d5d77-qlsvs   2/2     Running            0          8m11s
pod/metrics-agent-c77c9dfc7-lp2rf         1/1     Running            1          8m11s
```

Connect agent logs all errors communicating with Azure and the local Kubernetes API server as standard pod logs. Fetch the logs using `kubectl` to debug.

```console
$ kubectl -n azure-arc logs -l app.kubernetes.io/component=connect-agent -c connect-agent
2020/04/07 20:52:50 Environment validation :success
2020/04/07 20:52:50 Kubernetes API server access validation :success
2020/04/07 20:52:51 Azure Subscription access token :error :http request failed. Authentication Token URL:https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token Authentication Token Body:grant_type=client_credentials&client_id=82195c37-7497-458c-b643-f4a3d0a64190&client_secret=9814c84e-59d7-49fc-bef6-17b717d2f5a8&resource=https%3A%2F%2Fmanagement.azure.com%2F ErrorInfo: Response:{"error":"invalid_client","error_description":"AADSTS7000215: Invalid client secret is provided.\r\nTrace ID: b179b7db-c957-4917-a1b6-66fab2042a00\r\nCorrelation ID: 4cfc9c81-660f-4a1a-ba0b-87db205c5461\r\nTimestamp: 2020-04-07 20:52:51Z","error_codes":[7000215],"timestamp":"2020-04-07 20:52:51Z","trace_id":"b179b7db-c957-4917-a1b6-66fab2042a00","correlation_id":"4cfc9c81-660f-4a1a-ba0b-87db205c5461","error_uri":"https://login.microsoftonline.com/error?code=7000215"} HTTPReturnCode:401
```

To fix an invalid client credential, validate that the client_id and secret are correct:

```console
$ kubectl -n azure-arc get cm/azure-clusterconfig -o yaml
  AZURE_CLIENT_ID: 82195c37-7497-458c-b643-f4a3d0a64190
  AZURE_RESOURCE_GROUP: AzureArc
  AZURE_RESOURCE_NAME: AzureArcCluster
```

### Expired credentials

Service principal credentials that are expired cause the connect-agent to log an error `AADSTS7000222: The provided client secret keys are expired`.

```console
$ kubectl -n azure-arc logs -l app.kubernetes.io/component=connect-agent -c connect-agent
2020/04/13 19:49:19 Environment validation :success
2020/04/13 19:49:19 Kubernetes API server access validation :success
2020/04/13 19:49:19 Azure Subscription access token :error :http request failed. Authentication Token URL:https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token Authentication Token Body:grant_type=client_credentials&client_id=82195c37-7497-458c-b643-f4a3d0a64190&client_secret=9814c84e-59d7-49fc-bef6-17b717d2f5a8&resource=https%3A%2F%2Fmanagement.azure.com%2F ErrorInfo: Response:{"error":"invalid_client","error_description":"AADSTS7000222: The provided client secret keys are expired.\r\nTrace ID: 69ade0e5-f089-4a9d-b55d-9089e07f6300\r\nCorrelation ID: 10057011-6143-4e87-ad4a-c8256cf0e353\r\nTimestamp: 2020-04-13 19:49:19Z","error_codes":[7000222],"timestamp":"2020-04-13 19:49:19Z","trace_id":"69ade0e5-f089-4a9d-b55d-9089e07f6300","correlation_id":"10057011-6143-4e87-ad4a-c8256cf0e353"} HTTPReturnCode:401
```

Expired credentials may be reset using `az ad sp credential reset`.

## Configuration management

### General
To help troubleshoot issues with source control configuration, run az commands with --debug switch.

```console
az provider show -n Microsoft.KubernetesConfiguration --debug
az k8sconfiguration create <parameters> --debug
```

### Create source control configuration
Contributor role on the Microsoft.Kubernetes/connectedCluster resource is necessary and sufficient for creating Microsoft.KubernetesConfiguration/sourceControlConfiguration resource.

### Configuration remains `Pending`

```console
kubectl -n azure-arc logs -l app.kubernetes.io/component=config-agent -c config-agent
$ k -n pending get gitconfigs.clusterconfig.azure.com  -o yaml
apiVersion: v1
items:
- apiVersion: clusterconfig.azure.com/v1beta1
  kind: GitConfig
  metadata:
    creationTimestamp: "2020-04-13T20:37:25Z"
    generation: 1
    name: pending
    namespace: pending
    resourceVersion: "10088301"
    selfLink: /apis/clusterconfig.azure.com/v1beta1/namespaces/pending/gitconfigs/pending
    uid: d9452407-ff53-4c02-9b5a-51d55e62f704
  spec:
    correlationId: ""
    deleteOperator: false
    enableHelmOperator: false
    giturl: git@github.com:slack/cluster-config.git
    helmOperatorProperties: null
    operatorClientLocation: azurearcfork8s.azurecr.io/arc-preview/fluxctl:0.1.3
    operatorInstanceName: pending
    operatorParams: '"--disable-registry-scanning"'
    operatorScope: cluster
    operatorType: flux
  status:
    configAppliedTime: "2020-04-13T20:38:43.081Z"
    isSyncedWithAzure: true
    lastPolledStatusTime: ""
    message: 'Error: {exit status 1} occurred while doing the operation : {Installing
      the operator} on the config'
    operatorPropertiesHashed: ""
    publicKey: ""
    retryCountPublicKey: 0
    status: Installing the operator
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```

### Source control configurations remain on my cluster
