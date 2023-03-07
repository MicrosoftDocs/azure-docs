---
title: Troubleshoot Kubernetes compute for machine learning tasks
description: Learn how to troubleshoot common Kubernetes compute errors for training jobs and model deployments. 
titleSuffix: Azure Machine Learning
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 11/11/2022
ms.topic: how-to
ms.custom: build-spring-2022, cliv2, sdkv2, event-tier1-build-2022
---

# Troubleshoot Kubernetes Compute

In this article, you'll learn how to troubleshoot common problems you may encounter with using [Kubernetes compute](./how-to-attach-kubernetes-to-workspace.md) for training jobs and model deployments.

## Inference guide

### How to check sslCertPemFile and sslKeyPemFile is correct?
Use the commands below to run a baseline check for your cert and key. This is to allow for any known errors to be surfaced. Expect the second command to return "RSA key ok" without prompting you for password.

```bash
openssl x509 -in cert.pem -noout -text
openssl rsa -in key.pem -noout -check
```

Run the commands below to verify whether sslCertPemFile and sslKeyPemFile are matched:

```bash
openssl x509 -in cert.pem -noout -modulus | md5sum
openssl rsa -in key.pem -noout -modulus | md5sum
```

### Kubernetes compute errors

Below is a list of error types in **compute scope** that you might encounter when using Kubernetes compute to create online endpoints and online deployments for real-time model inference, which you can trouble shoot by following the guidelines:


* [ERROR: GenericComputeError](#error-genericcomputeerror)
* [ERROR: ComputeNotFound](#error-computenotfound)
* [ERROR: ComputeNotAccessible](#error-computenotaccessible)


#### ERROR: GenericComputeError
The error message is as below:

```bash
Failed to get compute information.
```

This error should occur when system failed to get the compute information from the Kubernetes cluster. You can check the following items to troubleshoot the issue:
* Check the Kubernetes cluster status. If the cluster isn't running, you need to start the cluster first.
* Check the Kubernetes cluster health.
    * You can view the cluster health check report for any issues, for example, if the cluster is not reachable.
    * You can go to your workspace portal to check the compute status.
* Check if the instance types is information is correct. You can check the supported instance types in the [Kubernetes compute](./how-to-attach-kubernetes-to-workspace.md) documentation.
* Try to detach and reattach the compute to the workspace if applicable.

> [!NOTE]
> To trouble shoot errors by reattaching, please guarantee to reattach with the exact same configuration as previously detached compute, such as the same compute name and namespace, otherwise you may encounter other errors.

#### ERROR: ComputeNotFound

The error message is as follows:

```bash
Cannot find Kubernetes compute.
```

This error should occur when:
* The system can't find the compute when create/update new online endpoint/deployment. 
*  The compute of existing online endpoints/deployments have been removed. 

You can check the following items to troubleshoot the issue:
* Try to recreate the endpoint and deployment. 
* Try to detach and reattach the compute to the workspace. Pay attention to more notes on [reattach](#error-genericcomputeerror).


#### ERROR: ComputeNotAccessible
The error message is as follows:

```bash
The Kubernetes compute is not accessible.
```

This error should occur when the workspace MSI (managed identity) doesn't have access to the AKS cluster. You can check if the workspace MSI has the access to the AKS, and if not, you can follow this [document](how-to-identity-based-service-authentication.md) to manage access and identity.

### Kubernetes cluster error

Below is a list of error types in **cluster scope** that you might encounter when using Kubernetes compute to create online endpoints and online deployments for real-time model inference, which you can trouble shoot by following the guideline:

* [ERROR: GenericClusterError](#error-genericclustererror)
* [ERROR: ClusterNotReachable](#error-clusternotreachable)

#### ERROR: GenericClusterError

The error message is as follows:

```bash
Failed to connect to Kubernetes cluster: <message>
```

This error should occur when the system  failed to connect to the Kubernetes cluster for an unknown reason. You can check the following items to troubleshoot the issue:

For AKS clusters:
* Check if the AKS cluster is shut down. 
    * If the cluster isn't running, you need to start the cluster first.
* Check if the AKS cluster has enabled selected network by using authorized IP ranges. 
    * If the AKS cluster has enabled authorized IP ranges, please make sure all the **AzureML control plane IP ranges** have been enabled for the AKS cluster. More information you can see this [document](how-to-deploy-kubernetes-extension.md#limitations).


For an AKS cluster or an Azure Arc enabled Kubernetes cluster:
1. Check if the Kubernetes API server is accessible by running `kubectl` command in cluster. 

#### ERROR: ClusterNotReachable 

The error message is as follows:

```bash
The Kubernetes cluster is not reachable. 
```

This error should occur when the system can't connect to a cluster. You can check the following items to troubleshoot the issue:


For AKS clusters:
* Check if the AKS cluster is shut down. 
    *  If the cluster isn't running, you need to start the cluster first.

For an AKS cluster or an Azure Arc enabled Kubernetes cluster:
* Check if the Kubernetes API server is accessible by running `kubectl` command in cluster. 


## Training guide

### UserError

#### AzureML Kubernetes job failed. E45004

If the error message is:

```bash
AzureML Kubernetes job failed. E45004:"Training feature is not enabled, please enable it when install the extension."
```

Please check whether you have `enableTraining=True` set when doing the AzureML extension installation. More details could be found at [Deploy AzureML extension on AKS or Arc Kubernetes cluster](how-to-deploy-kubernetes-extension.md)

#### Unable to mount data store workspaceblobstore. Give either an account key or SAS token

If you need to access Azure Container Registry (ACR) for Docker image, and Storage Account for training data, this issue should occur when the compute is not specified with a managed identity. This is because machine learning workspace default storage account without any credentials is not supported for training jobs. 

To mitigate this issue, you can assign Managed Identity to the compute in compute attach step, or you can assign Managed Identity to the compute after it has been attached. More details could be found at [Assign Managed Identity to the compute target](how-to-attach-kubernetes-to-workspace.md#assign-managed-identity-to-the-compute-target).

#### Unable to upload project files to working directory in AzureBlob because the authorization failed

If the error message is:

```bash
Unable to upload project files to working directory in AzureBlob because the authorization failed. 
```

You can check the following items to troubleshoot the issue:
*  Make sure the storage account has enabled the exceptions of “Allow Azure services on the trusted service list to access this storage account” and the workspace is in the resource instances list. 
*  Make sure the workspace has a system assigned managed identity.

### Encountered an error when attempting to connect to the Azure ML token service

If the error message is:

```bash
AzureML Kubernetes job failed. 400:{"Msg":"Encountered an error when attempting to connect to the Azure ML token service","Code":400}
```
You can follow [Private Link troubleshooting section](#private-link-issue) to check your network settings.

### ServiceError

#### Job pod get stuck in Init state

If the job runs longer than you expected and if you find that your job pods are getting stuck in an Init state with this warning `Unable to attach or mount volumes: *** failed to get plugin from volumeSpec for volume ***-blobfuse-*** err=no volume plugin matched`,  the issue might be occurring because AzureML extension doesn't support download mode for input data. 

To resolve this issue, change to mount mode for your input data.

#### AzureML Kubernetes job failed

If the error message is:

```bash
AzureML Kubernetes job failed. 137:PodPattern matched: {"containers":[{"name":"training-identity-sidecar","message":"Updating certificates in /etc/ssl/certs...\n1 added, 0 removed; done.\nRunning hooks in /etc/ca-certificates/update.d...\ndone.\n * Serving Flask app 'msi-endpoint-server' (lazy loading)\n * Environment: production\n   WARNING: This is a development server. Do not use it in a production deployment.\n   Use a production WSGI server instead.\n * Debug mode: off\n * Running on http://127.0.0.1:12342/ (Press CTRL+C to quit)\n","code":137}]}
```

Check your proxy setting and check whether 127.0.0.1 was added to proxy-skip-range when using `az connectedk8s connect` by following this [network configuring](how-to-access-azureml-behind-firewall.md#kubernetes-compute).

## Private link issue

We could use the method below to check private link setup by logging into one pod in the Kubernetes cluster and then check related network settings.

*  Find workspace ID in Azure portal or get this ID by running `az ml workspace show` in the command line.
*  Show all azureml-fe pods run by `kubectl get po -n azureml -l azuremlappname=azureml-fe`.
*  Login into any of them run `kubectl exec -it -n azureml {scorin_fe_pod_name} bash`.
*  If the cluster doesn't use proxy run `nslookup {workspace_id}.workspace.{region}.api.azureml.ms`.
If you set up private link from VNet to workspace correctly, then the internal IP in VNet should be responded through the *DNSLookup* tool.

*  If the cluster uses proxy, you can try to `curl` workspace 
 ```bash
curl https://{workspace_id}.workspace.westcentralus.api.azureml.ms/metric/v2.0/subscriptions/{subscription}/resourceGroups/{resource_group}/providers/Microsoft.MachineLearningServices/workspaces/{workspace_name}/api/2.0/prometheus/post -X POST -x {proxy_address} -d {} -v -k
```

If the proxy and workspace with private link is configured correctly, you can see it's trying to connect to an internal IP. This will return a response with http 401, which is expected when you don't provide token.

## Next steps

- [How to troubleshoot kubernetes extension](how-to-troubleshoot-kubernetes-extension.md)
- [How to troubleshoot online endpoints](how-to-troubleshoot-online-endpoints.md)
- [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)