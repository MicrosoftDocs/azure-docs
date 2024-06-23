---
title: Known issue - Invalid certificate error during deployment
titleSuffix: Azure Machine Learning
description: During machine learning deployments with an AKS cluster, you may receive an invalid certificate error.
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/04/2023
ms.custom: known-issue
---

# Known issue  - Invalid certificate error during deployment with an AKS cluster

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

During machine learning deployments using an AKS cluster, you may receive an invalid certificate error, such as `{"code":"BadRequest","statusCode":400,"message":"The request is invalid.","details":[{"code":"KubernetesUnaccessible","message":"Kubernetes error: AuthenticationException. Reason: InvalidCertificate"}]`.

 
**Status:** Open

**Problem area:** Inferencing

## Symptoms

Azure Machine Learning deployments with an AKS cluster fail with the error:

`{"code":"BadRequest","statusCode":400,"message":"The request is invalid.","details":[{"code":"KubernetesUnaccessible","message":"Kubernetes error: AuthenticationException. Reason: InvalidCertificate"}],`
and the following error is shown in the MMS logs:

`K8sReadNamespacedServiceAsync failed with AuthenticationException: System.Security.Authentication.AuthenticationException: The remote certificate was rejected by the provided RemoteCertificateValidationCallback. at System.Net.Security.SslStream.SendAuthResetSignal(ProtocolToken message, ExceptionDispatchInfo exception) at System.Net.Security.SslStream.CompleteHandshake(SslAuthenticationOptions sslAuthenticationOptions) at System.Net.Security.SslStream.ForceAuthenticationAsync[TIOAdapter](tioadapteradapterbooleanreceivefirstbytereauthenticationdatabooleanisapm) at System.Net.Http.ConnectHelper.EstablishSslConnectionAsync(SslClientAuthenticationOptions sslOptions, HttpRequestMessage request, Boolean async, Stream stream, CancellationToken cancellationToken)`

## Cause

This error occurs because the certificate for AKS clusters created before January 2021 does not include the `Subject Key Identifier` value, which prevents the required `Authority Key Identifier` value from being generated.

## Solutions and workarounds

There are two options to resolve this issue:
- Rotate the AKS certificate for the cluster. See [Certificate Rotation in Azure Kubernetes Service (AKS) - Azure Kubernetes Service](../../aks/certificate-rotation.md) for more information.
- Wait for 5 hours for the certificate to be automatically updated, and the issue should be resolved. 

## Next steps

- [About known issues](azure-machine-learning-known-issues.md)
