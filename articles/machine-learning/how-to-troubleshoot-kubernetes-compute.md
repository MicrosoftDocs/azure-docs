---
title: Troubleshoot Kubernetes Compute for Machine Learning Tasks
description: Learn how to troubleshoot some common Kubernetes compute errors for training jobs and model deployments. 
titleSuffix: Azure Machine Learning
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: 
ms.service: machine-learning
ms.subservice: core
ms.date: 11/11/2022
ms.topic: how-to
ms.custom: build-spring-2022, cliv2, sdkv2, event-tier1-build-2022
---

# Troubleshoot Kubernetes Compute

In this article, you will learn how to troubleshoot some common problems you may encounter with using [Kubernetes compute](./how-to-attach-kubernetes-to-workspace.md) for training jobs and model deployments.

## Inference Guide

### How to check sslCertPemFile and sslKeyPemFile is correct?
Below commands could be used to run sanity check for your cert and key. Expect the second command return "RSA key ok" without prompting you for password.

```bash
openssl x509 -in cert.pem -noout -text
openssl rsa -in key.pem -noout -check
```

Below commands could be used to verify whether sslCertPemFile and sslKeyPemFile are matched:

```bash
openssl x509 -in cert.pem -noout -modulus | md5sum
openssl rsa -in key.pem -noout -modulus | md5sum
```

### Kubernetes Compute errors

Below is a list of error types in **compute scope** that you might encounter when using Kubernetes compute to create online endpoints and online deployments for real-time model inference, please review the causes and troubleshoot the errors according to the guidance below:


* [ERROR: GenericComputeError](#error-genericcomputeerror)
* [ERROR: ComputeNotFound](#error-computenotfound)
* [ERROR: ComputeNotAccessible](#error-computenotaccessible)


#### ERROR: GenericComputeError
The error message is as below:

```bash
Failed to get compute information.
```

This should happen when system failed to get the compute information from the Kubernetes cluster. You can check the following items to troubleshoot the issue:
1. Check the Kubernetes cluster status. If the cluster is not running, you need to start the cluster first.
1. Check if the Kubernetes cluster is health.
    1.  You can check if the cluster health check report any issues, for example the cluster is not reachable.
    1. You can go to your workspace portal to check the compute status.
1. Check if the instance types is information is correct. You can check the supported instance types in the [Kubernetes compute](./how-to-attach-kubernetes-to-workspace.md) documentation.
1. Try to detach and re-attach the compute to the workspace if applicable.

> [!NOTE]
> To trouble shoot errors by re-attaching, please guarantee to re-attach with the exact same configuration as previously detached compute, such as the same compute name and namespace, otherwise you may encounter other errors.

#### ERROR: ComputeNotFound

The error message is as follows:

```bash
Cannot find Kubernetes compute.
```

This should happen when:
1. The system cannot find the compute when create/update new online endpoint/deployment. 
1. The compute of existing online endpoints/deployments has been removed. 

You can check the following items to troubleshoot the issue:
1. Try to re-create the endpoint and deployment. 
1. Try to detach and re-attach the compute to the workspace. Please pay attention to more notes on [re-attach](#error-genericcomputeerror).


#### ERROR: ComputeNotAccessible
The error message is as follows:

```bash
The Kubernetes compute is not accessible.
```

This should happen when the workspace MSI (managed identity) does not have access to the AKS cluster. You can check if the workspace MSI has the access to the AKS, and if not, you can follow this [document](how-to-identity-based-service-authentication.md) to manage access and identity.

### Kubernetes Cluster Error

Below is a list of error types in **cluster scope** that you might encounter when using Kubernetes compute to create online endpoints and online deployments for real-time model inference, please review the causes and troubleshoot the errors according to the guidance below:

* [ERROR: GenericClusterError](#error-genericclustererror)
* [ERROR: ClusterNotReachable](#error-clusternotreachable)

#### ERROR: GenericClusterError

The error message is as follows:

```bash
Failed to connect to Kubernetes cluster: <message>
```

This should happen when the system  failed to connect to the Kubernetes cluster for unknown reason. You can check the following items to troubleshoot the issue:

For AKS cluster:
1. Please check the if AKS cluster is shutdown. 
    1. If the cluster is not running, you need to start the cluster first.
1. Please check if the AKS cluster has enabled enabled selected network by using authorized IP ranges. 
    1. If the AKS cluster has enabled authorized IP ranges, please make sure all the **AzureML control plane IP ranges** have been enabled for the AKS cluster. More information you can see this [document](how-to-deploy-kubernetes-extension?tabs=deploy-extension-with-cli#limitations).


For both AKS cluster and Azure Arc enabled Kubernetes cluster:
1. Please check if the Kubernetes API server is accessible by running `kubectl` command in cluster. 

#### ERROR: ClusterNotReachable 

The error message is as follows:

```bash
The Kubernetes cluster is not reachable. 
```

This should happen when the system cannot connect to cluster. You can check the following items to troubleshoot the issue:


For AKS cluster:
1. Please check the if AKS cluster is shutdown. 
    1. If the cluster is not running, you need to start the cluster first.

For both AKS cluster and Azure Arc enabled Kubernetes cluster:
1. Please check if the Kubernetes API server is accessible by running `kubectl` command in cluster. 


## Training Guide

### UserError

#### AzureML Kubernetes job failed. E45004

The error message is like below:

```bash
AzureML Kubernetes job failed. E45004:"Training feature is not enabled, please enable it when install the extension."
```

Please check whether you have `enableTraining=True` set when doing the AzureML extension installation. More details could be found at [Deploy AzureML extension on AKS or Arc Kubernetes cluster](how-to-deploy-kubernetes-extension.md)

#### Unable to mount data store workspaceblobstore. Give either an account key or SAS token

If you need to access Azure Container Registry (ACR) for Docker image, and Storage Account for training data, this should happen when the compute is not specified with a managed identity, because the credential less machine learning workspace default storage account is not supported right now for training jobs. 

To mitigate this issue, you can You can assign Managed Identity to the compute in compute attach step, or you can assign Managed Identity to the compute after it is attached. More details could be found at [Assign Managed Identity to the compute target](how-to-attach-kubernetes-to-workspace.md#assign-managed-identity-to-the-compute-target).

#### Unable to upload project files to working directory in AzureBlob because the authorization failed

The error message is like below:

```bash
Unable to upload project files to working directory in AzureBlob because the authorization failed. Most probable reasons are:
 1. The storage account could be in a Virtual Network. To enable Virtual Network in Azure Machine Learning, please refer to https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-enable-virtual-network.
```

You can check the following items to troubleshoot the issue:
1. Please make sure the storage account has enabled the exceptions of “Allow Azure services on the trusted service list to access this storage account” and the workspace is in the resource instances list. 
1. And make sure the workspace has system assigned managed identity.

### Encountered an error when attempting to connect to the Azure ML token service

The error message is like below:

```bash
AzureML Kubernetes job failed. 400:{"Msg":"Encountered an error when attempting to connect to the Azure ML token service","Code":400}
```
Please follow [Private Link troubleshooting section](#private-link-issue) to check your network settings.

### ServiceError

#### Job pod get stuck in Init state

If the job runs longer than you expected and you find job pods get stuck in Init state with the this warning `Unable to attach or mount volumes: *** failed to get plugin from volumeSpec for volume ***-blobfuse-*** err=no volume plugin matched,` this is a known issue because AzureML extension doesn't support download mode for input data currently. 

Please change to mount mode for your input data to mitigate the issue.

#### AzureML Kubernetes job failed

The error message is like below:

```bash
AzureML Kubernetes job failed. 137:PodPattern matched: {"containers":[{"name":"training-identity-sidecar","message":"Updating certificates in /etc/ssl/certs...\n1 added, 0 removed; done.\nRunning hooks in /etc/ca-certificates/update.d...\ndone.\n * Serving Flask app 'msi-endpoint-server' (lazy loading)\n * Environment: production\n   WARNING: This is a development server. Do not use it in a production deployment.\n   Use a production WSGI server instead.\n * Debug mode: off\n * Running on http://127.0.0.1:12342/ (Press CTRL+C to quit)\n","code":137}]}
```

Check your proxy setting and check whether 127.0.0.1 was added to proxy-skip-range when using `az connectedk8s connect` by following this.

## Private Link Issue

We could use the method below to check private link setup by logging into one pod in the Kubernetes cluster and then check related network settings.

1. Find workspace id in Azure portal or get this id by running `az ml workspace show` in the command line.
1. Show all scoring fe pods run by `kubectl get po -n azureml -l azuremlappname=azureml-fe`.
1. Login into any of them run `kubectl exec -it -n azureml {scorin_fe_pod_name} bash`.
1. If the cluster doesn't use proxy run `nslookup {workspace_id}.workspace.{region}.api.azureml.ms`.
If they setup private link from VNet to workspace correctly, DNS lookup will response internal IP in VNet.

1. If the cluster uses proxy, please try to `curl` workspace 
 ```bash
curl https://{workspace_id}.workspace.westcentralus.api.azureml.ms/metric/v2.0/subscriptions/{subscription}/resourceGroups/{resource_group}/providers/Microsoft.MachineLearningServices/workspaces/{workspace_name}/api/2.0/prometheus/post -X POST -x {proxy_address} -d {} -v -k
```

If they configured proxy and workspace with private link correctly, they can see it's trying to connect to an internal IP, and get response with http 401 which is expected as you don't provide token.