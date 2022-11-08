---
title: Troubleshoot Kubernetes Compute for Machine Learning Tasks
description: Learn how to troubleshoot some common Kubernetes compute for training jobs or online deployments errors. 
titleSuffix: Azure Machine Learning
author: Chenlu Jiao
ms.author: 
ms.reviewer: 
ms.service: machine-learning
ms.subservice: core
ms.date: 
ms.topic: how-to
ms.custom: build-spring-2022, cliv2, sdkv2, event-tier1-build-2022
---

# Troubleshoot AzureML extension

In this article, you will learn how to troubleshoot some common problems you may encounter with using [Kubernetes compute](./how-to-attach-kubernetes-to-workspace.md) for training jobs or model deployments [AzureML extension](./how-to-deploy-kubernetes-extension.md) deployment in your AKS or Arc-enabled Kubernetes.

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

### Kubernetes Compute related errors

below list of

* ERROR: GenericComputeError
* ERROR: ComputeNotFound
* ERROR: ComputeNotAccessible


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
1. check if the instance types is information is correct. You can check the supported instance types in the [Kubernetes compute](./how-to-attach-kubernetes-to-workspace.md) documentation.
1. Try to detach and re-attach the compute to the workspace if applicable.

#### ERROR: ComputeNotFound

The error message is as follows:

```bash
Cannot found Kubernetes compute.
```

This should happen when:
1. The system cannot find the compute when create/update new endpoint/deployment. 
1. The compute of existing endpoint/deployment is removed. 

You can check the following items to troubleshoot the issue:
1. Re-create endpoint and deployment. 
1. Re-attach the compute. (?) 

#### ERROR: ComputeNotAccessible
The error message is as follows:

```bash
The Kubernetes compute is not accessible.
```

This should happen when the workspace MSI does not have access to the AKS cluster. You can check the following items to troubleshoot the issue:
1.  Check the workspace MSI has the access to the AKS. 

### Kubernetes Cluster Error

below list of

* ERROR: GenericClusterError
* ERROR: ClusterNotReachable

#### ERROR: GenericClusterError

The error message is as follows:

```bash
Failed to connect to Kubernetes cluster: <message>
```

This should happen when the system  failed to connect to the Kubernetes cluster for unknown reason. You can check the following items to troubleshoot the issue:

1. (For AKS) Check if the cluster is shutdown. 
    1. If the cluster is shutdown, you need to start the cluster first.
1. (For AKS) Check if the cluster has enabled selected network.  
1. (For AKS) Check if the cluster enabled network policy. 
1. Check if the user could access Kubernetes API server. (e.g. using kubectl) 

#### ERROR: ClusterNotReachable 

The error message is as follows:

```bash
The Kubernetes cluster is not reachable. 
```

This should happen when the system cannot connect to cluster. You can check the following items to troubleshoot the issue:

1. Check if the cluster is shutdown. 
1. Check if the user could access the Kubernetes API server (e.g. using kubectl) 



## Training Guide

### UserError: AzureML Kubernetes job failed. : Dispatch Job Fail: Cluster does not support job type RegularJob

### UserError: Unable to mount data store workspaceblobstore. Give either an account key or SAS token.


### UserError: Unable to upload project files to working directory in AzureBlob because the authorization failed

The error message is like below:

```bash
Unable to upload project files to working directory in AzureBlob because the authorization failed. Most probable reasons are:
 1. The storage account could be in a Virtual Network. To enable Virtual Network in Azure Machine Learning, please refer to https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-enable-virtual-network.
```

Please make sure the storage account has enabled the exceptions of “Allow Azure services on the trusted service list to access this storage account” and the aml workspace is in the resource instances list. And make sure the aml workspace has system assigned managed identity.

### UserError: Encountered an error when attempting to connect to the Azure ML token service

The error message is like below:

```bash
AzureML Kubernetes job failed. 400:{"Msg":"Encountered an error when attempting to connect to the Azure ML token service","Code":400}
```
Please follow Private Link troubleshooting section(link) to check your network settings.

### ServiceError: Job pod get stuck in Init state

If the job runs longer than you expected and you find job pods get stuck in Init state with the this warning `Unable to attach or mount volumes: *** failed to get plugin from volumeSpec for volume ***-blobfuse-*** err=no volume plugin matched,` this is a known issue. Beacuse Azureml extension doesn't support download mode for input data currently. Please change to mount mode for your input data to mitigate the issue.

### ServiceError: AzureML Kubernetes job failed

The error message is like below:

```bash
AzureML Kubernetes job failed. 137:PodPattern matched: {"containers":[{"name":"training-identity-sidecar","message":"Updating certificates in /etc/ssl/certs...\n1 added, 0 removed; done.\nRunning hooks in /etc/ca-certificates/update.d...\ndone.\n * Serving Flask app 'msi-endpoint-server' (lazy loading)\n * Environment: production\n   WARNING: This is a development server. Do not use it in a production deployment.\n   Use a production WSGI server instead.\n * Debug mode: off\n * Running on http://127.0.0.1:12342/ (Press CTRL+C to quit)\n","code":137}]}
```

Check your proxy setting and check whether 127.0.0.1 was added to proxy-skip-range when using “az connectedk8s connect” by following this.

