# Connect a Kubernetes cluster

## Pre-requisites

Before onboarding a cluster to Azure Arc for Kubernetes, make sure that your Kubernetes cluster is up and running, that you have a kubeconfig, and cluster-admin access.

## Network requirements

azure-arc needs the following protocols/ports/outbound Urls for communication.

protocol/port: https://:443, git://:9418

| item#  | Endpoint (DNS) |
| ------------- | ------------- |
| 1.  | https://management.azure.com  |
| 2.  | https://eastus.dp.kubernetesconfiguration.azure.com, https://westeurope.dp.kubernetesconfiguration.azure.com  |
| 3.  | https://docker.io  |
| 4.  | https://github.com, git://github.com  |
| 5.  | https://login.microsoftonline.com  |
| 6.  | https://azurearcfork8s.azurecr.io  |

## Create a Resource Group

First, create a resource group to hold the connected cluster resource. The referenced region stores metadata for your cluster. Currently supported regions:

- East US
- West Europe

```console
az group create --name AzureArcTest -l EastUS -o table
```

**Output:**

```console
Location    Name
----------  ------------
eastus      AzureArcTest
```

## Connect a cluster

Next, we will connect our Kubernetes cluster to Azure. The workflow for `az connectedk8s connect` is as follows:

1. Create or re-use an onboarding service principal (stored in `~/.azure/azureArcServicePrincipal.json`)
1. Verify connectivity to your Kubernetes cluster: via `KUBECONFIG`, `~/.kube/config`, or `--kube-config`
1. Deploy Azure Arc Agents for Kubernetes using Helm 3, into the `azure-arc` namespace

Note that the user running the `az connectedk8s connect` command must have privilege to create a Service Principal in the destination tenant and subscription. The Service Principal that is created is granted only enough access to connect Kubernetes clusters and will not be given any additional permission.

If the user running the Azure CLI commands does not have sufficient permissions to create an Service Principal you may provide the id and credentials with `--onboarding-spn-id`, `--onboarding-spn-secret`, and `--tenant-id` arguments. For more information read the documentation on [creating an onboarding service prinicpal](./05-create-onboarding-spn.md).

```console
az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest
```

__Note: If you receive errors regarding missing provider, or provider not found, double check that your subscriptions have been [onboarded to the private preview, and the required providers have been enabled](./00-enable-providers.md)__


**Output:**

```console
Command group 'connectedk8s' is in preview. It may be changed/removed in a future release.
Helm release deployment succeeded

{
  "aadProfile": {
    "clientAppId": "",
    "serverAppId": "",
    "tenantId": ""
  },
  "agentPublicKeyCertificate": "...",
  "agentVersion": "0.1.0",
  "id": "/subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/resourceGroups/AzureArcTest/providers/Microsoft.Kubernetes/connectedClusters/AzureArcTest1",
  "identity": {
    "principalId": null,
    "tenantId": null,
    "type": "None"
  },
  "kubernetesVersion": "v1.15.0",
  "location": "eastus",
  "name": "AzureArcTest1",
  "resourceGroup": "AzureArcTest",
  "tags": {},
  "totalNodeCount": 1,
  "type": "Microsoft.Kubernetes/connectedClusters"
}
```

## Verify connected cluster

List your connected clusters:

```console
az connectedk8s list -g AzureArcTest -o table
```

**Output:**

```console
Command group 'connectedk8s' is in preview. It may be changed/removed in a future release.
Name           Location    ResourceGroup
-------------  ----------  ---------------
AzureArcTest1  eastus      AzureArcTest
```

Azure Arc for Kubernetes deploys a few operators into the `azure-arc` namespace. You can view these deployments and pods here:

```console
kubectl -n azure-arc get deploy,po
```

**Output:**

```console
NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.extensions/config-agent         1/1     1            1           5h43m
deployment.extensions/connect-agent        1/1     1            1           5h43m
deployment.extensions/controller-manager   1/1     1            1           5h43m

NAME                                      READY   STATUS    RESTARTS   AGE
pod/config-agent-c74f6695f-89hp8          1/1     Running   0          5h43m
pod/connect-agent-74497b546-lwzzj         1/1     Running   2          5h43m
pod/controller-manager-7cf48dc76b-m9g74   2/2     Running   0          5h43m
```

## About the Azure Arc for Kubernetes agents

Azure Arc for Kubernetes consists of a few agents (operators) that run in your cluster deployed to the `azure-arc` namespace.

- `deploy/connect-agent`: is responsible for onboarding your cluster to Azure Resource Manager (ARM), the agent also sends periodic heartbeats to ARM with basic cluster telemetry (versions and cluster size)
- `deploy/config-agent`: watches the connected cluster for source control configuration resources applied on the cluster and updates compliance state
- `deploy/controller-manager`: is an operator of operators and orchestrates interactions between Azure Arc components

## Next

* Return to the [README](../README.md)
* [Create a GitOps sourceControlConfiguration](./03-use-gitops.md)
