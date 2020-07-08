# Interact with private AKS cluster using Azure Bastion and Azure DevOps

## Introduction

Private AKS cluster enables communication with Kubernetes API server over a private link. Private communication helps many customers meet key security requirement. However, this also poses considerable productivity challenges for developers. Unlike in a non-private AKS cluster, developers can no longer connect and interact with private AKS cluster through their local development environment (e.g IDE or CLI). There are options as documented [in this guidance] to connect with private AKS cluster and manage applications. This article discusses an additional option to improve developer productivity with private AKS cluster.

## Azure Bastion and Azure DevOps

[Azure Bastion] enables secure access to Azure Virtual Machines (VMs) inside a Azure Virtual Network (VNET). It enables RDP (widows) or SSH (Linux) access without needing public IP address assigned to a VM.

[Azure DevOps] helps developers to build, test and deploy applications to multiple platforms. Azure Pipelines - a component of Azure DevOps - enables developers to deploy and manage containers on a Kubernetes environment including private AKS cluster.

This articles discusses combined use of Azure Bastion and Azure DevOps capabilities. An overview of this approach is shown below.

![workflow](media/private-clusters/privateaksdevops.svg)

Process follows key activities as discussed below.

1. IT admin or cloud operator sets up Azure Bastion on the private AKS cluster virtual network.
1. IT admin or cloud operator deploys Azure DevOps build agent as a pod in private AKS cluster through Azure Bastion Host.
1. IT admin or cloud operator retrieves either `kubeconfig` content or `service account` details from private AKS cluster through Azure Bastion Host and use it to create a Kubernetes Service Connection in Azure DevOps.
1. Developers use Azure DevOps CI/CD pipeline using Kubernetes Service Connection to deploy applications in private AKS cluster. Developers get full visibility into private AKS cluster through Azure DevOps.

Steps 1,2 and 3 are one time set up. Once set, developers can interact with private AKS cluster throughput its lifecycle. This process leverages private AKS compute resources for running build agent. Build agent is used to drive CI/CD pipeline. This helps to avoid any additional setup such as new build agent VMs, Virtual Network peering or Hub and Spoke network implementation.

## Setup overview

High level setup process is as described below.

1. Create a private AKS cluster
1. Create a new Agent Pool and Personal Access Token (PAT) in Azure DevOps.
1. Create an Azure Bastion Host.
1. Create a container image for build agent.
1. Push container image to Azure Container Registry.
1. Create a deployment for build agent in private AKS cluster.
1. Create a new Kubernetes Service Connection in Azure DevOps.
1. Set up Azure DevOps pipeline using build agent.

Each setup step is discussed in detail below.

## Create a private AKS cluster

Follow [documented process] to create a private AKS cluster. If Azure Container Registry (ACR) is used to store Azure DevOps build agent container image then link ACR using following command.

```azurecli-interactive
az aks create -g <PRIVATE-AKS-RESOURCE-GROUP> -n <PRIVATE-CLUSTER-INSTANCE> --generate-ssh-keys --attach-acr <YOUR-ACR-INSTANCE>
```

## Create a new Agent Pool and Personal Access Token (PAT)

Azure DevOps Agent Pool is a logical group/pool of agents. It is advised to create a separate agent pool rather than re-use existing agent pools. This approach makes it easy to track and manage agents that are running as pods. To create a new Azure DevOps Agent Pool, navigate to Azure DevOps Project-->Project Settings-->Agent Pools. Click "Add Pool" button. Select "Pool type" as "Self-hosted".

Personal Access Toke (PAT) is a authentication scheme for Azure DevOps. A build agent uses PAT to authenticate against Azure DevOps instance.

Use [this guidance] to create a new Personal Access Token. Safely copy the token value after creating it. This value will be used in configuration of the build agent discussed below.

## Create an Azure Bastion Host

Deploy Azure Bastion using documentation [as described here]. After creation, install following components on Azure Bastion Host.

1. [Azure CLI]
2. [Kubectl]
3. [Azure AKS CLI]

Azure Bastion Host is used connect with private AKS instance and deploy Azure DevOps build agent as a pod. You may either tear it down after build agent deployment or keep it running for any other management activity.

## Create a container image for build agent

This step can be performed on a developer workstation. Process of creating Azure DevOps build agent is described [here]. Depending upon on private AKS OS (Windows or Linux) configuration, follow instructions specific to either Windows or Linux based container image. To create Linux based container image, use [WSL for Windows 10] if using Windows 10.  

## Push container image to Azure Container Registry

 To push a container image from developer workstation, either use IDE extension such as [Docker for Visual Studio Code] or run cli command as shown below.

```azurecli-interactive
docker push <YOUR-REGISTRY-INSTANCE/ado-agent-docker:latest
```

## Create a Kubernetes deployment for build agent

This step deploys Azure DevOps build agent as a pod in private AKS.

Connect to Azure Bastion Host created earlier. Create connection with private AKS instance from Azure Bastion Host by running following command.

```azurecli-interactive
az aks get-credentials -g <PRIVATE-AKS-RESOURCE-GROUP> -n <PRIVATE-CLUSTER-INSTANCE>
```

Create a Kubernetes deployment manifest locally on developer workstation as shown below. Create a new YAML file in Azure Bastion host and copy/paste local file contents using [Azure Bastion Copy/Paste operation]. Ensure that parameters AZP_URL, AZP_TOKEN, AZP_AGENT_NAME and AZP_POOL are set correctly.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ado-build-agent-deployment
spec:
  selector:
    matchLabels:
      app: ado-build-agent
  template:
    metadata:
      labels:
        app: ado-build-agent
    spec:
      containers:
      - name: ado-build-agent
        image: <YOUR IMAGE REPO>/<IMAGE NAME>:latest
        env:
        - name: AZP_URL
          value: "<YOUR AZURE DEVOPS PROJECT URL>"
        - name: AZP_TOKEN
          value: "PERSONAL ACCESS TOKEN CREATED EARLIER"
        - name: AZP_AGENT_NAME
          value: "<NAME OF BUILD AGENT>"
        - name: AZP_POOL
          value: "<AZURE DEVOPS AGENT POOL CREATED EARLIER>"
```

Navigate to folder containing manifest file on Azure Bastion Host and run following command.

```azurecli-interactive
kubectl apply -f <DEPLOYMENT-AGENT-DEPLOYMENT-MANIFEST-FILE>.yaml
```

Verify that pod is running successfully after running the deployment.

```azurecli-interactive
kubectl get pods
```

Output should be similar as shown below.

```output
NAME                                 READY   STATUS    RESTARTS   AGE
<ADO-BUILD-AGENT-POD>                1/1     Running   0          20s
```

## Create a new Kubernetes Service Connection

Service Connection enables Azure DevOps to connect to remote services and execute operations. To deploy an application on private AKS, a Kubernetes Service Connection is needed.

To create a Service Connection, navigate to Azure DevOps project --> Project settings --> Pipelines --> Service connections --> New service connection and select Kubernetes from drop-down options.

A private AKS Service Connection can be configured by using any of following options.

1. KubeConfig
1. Service Account

Select KubeConfig as an option in New Kubernetes service connection wizard. Use process below to get KubeConfig content.

1. Connect Azure Bastion Host
1. Navigate to `$HOME/.kube/config` (Linux) or `C:\Users\<user>\.kube` (Windows) location on Azure Bastion Host
1. Copy the `config` file contents

Paste contents in KubeConfig value in the service connection wizard. Provide a name for service connection and click "Save without verification" button.

## Set up Azure DevOps pipeline using build agent

Navigate to Azure DevOps Pipelines menu and click "New pipeline" button. Select either YAML or classic editor based pipeline creation wizard. Select the repository source and name. Start with an "Empty job" (for classic editor) or "starter pipeline" (for YAML). In "Build pipeline" (for classic editor), provide "Agent Pool" value and for "starter pipeline" (for YAML), provide the "pool" value as created in step [Create a new Agent Pool and Personal Access Token (PAT)](#create-a-new-agent-pool-and-personal-access-token-pat).

For classic editor based pipeline , select "Agent Job" and click "Add a task to Agent job" button. Select "kubectl" task. Configure "Service connection type" as "Kubernetes Service Connection".

For YAML based pipeline, click "Show assistant" and search for "kubectl" task and select it. Select "Service connection type" as "Kubernetes Service Connection".

For both types of pipelines, provide Kubernetes service connection as created in step [Create a new Kubernetes Service Connection in Azure DevOps](#create-a-new-kubernetes-service-connection).

For the kubectl task, select appropriate "command" from the drop-down list and configure corresponding "Arguments". For the deployments that use kubernetes manifest files checked in source code, `apply` will be appropriate command with `-f `as "argument" accompanied by manifest file path relative to source code such as `$(System.DefaultWorkingDirectory)/manifests/<YOUR-MANIFEST-FILE>.yml`

## Deploy applications to private AKS

Developers will create, modify Kubernetes manifest files locally. These manifest files will be committed to remote source control repository. CI/CD pipeline created earlier can be triggered at these commits. Depending upon needs, developers can configure additional kubectl commands (e.g. `kubectl get logs`) in Azure Devops pipeline. Using this approach enables developers to have visibility inside the private AKS cluster from their local development environment through Azure DevOps.  

<!-- LINKS - internal -->
[Azure Bastion Copy/Paste operation]: https://docs.microsoft.com/en-us/azure/bastion/bastion-vm-copy-paste
[as described here]: https://docs.microsoft.com/en-gb/azure/bastion/bastion-create-host-portal
[WSL for Windows 10]: https://docs.microsoft.com/en-us/windows/wsl/install-win10
[Azure DevOps]: https://azure.microsoft.com/en-gb/services/devops/
[Azure Bastion]: https://azure.microsoft.com/en-gb/services/azure-bastion/#overview
[in this guidance]: https://docs.microsoft.com/en-us/azure/aks/private-clusters
[documented process]: https://docs.microsoft.com/en-us/azure/aks/private-clusters
[Azure AKS CLI]: https://docs.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az-aks-install-cli
[Azure CLI]: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
[Kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[this guidance]: https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page
[Docker for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker
[here]: https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/docker?view=azure-devops