---
title: Check your Kubernetes deployments for implementation of best practices
description: Learn how to check for implementation of best practices in your Kubernetes deployments using kube-advisor
services: container-service
author: seanmck

ms.service: container-service
ms.topic: troubleshooting
ms.date: 08/23/2018
ms.author: seanmck
---


# Checking for Kubernetes best practices in your cluster

There are several best practice that you should follow on your Kubernetes deployments to ensure the best performance and resilience for your applications. You can use the kube-advisor tool to look for deployments that are not following those suggestions.

## Running the tool

The kube-advisor tool is a single container designed to be run on your cluster. It queries the Kubernetes API server for information about your deployments and returns a set of suggested improvements.

To run the tool on a cluster that is configured for role-based access control (RBAC), use the following commands:

```bash
kubectl run --rm -it kube-resource-checker --image=seanknox/kube-resource-checker:latest --restart=Never
```

Within a few seconds, you should see a table describing potential improvements to your deployments.

## Suggested improvements

The tool validates several Kubernetes best practices, each with their own suggested remediation.

### Resource requests and limits

Kubernetes supports defining [resource requests and limits on pod specifications][kube-cpumem]. The request defines the minimum CPU and memory required to run the container, while the limit defines the maximum CPU and memory that should be allowed.

By default, no requests or limits are set on pod specifications, which can lead to nodes being overscheduled and containers being starved. The kube-advisor tool highlights pods without requests and limits set.

## Next steps

- [Troubleshoot issues with Azure Kubernetes Service](troubleshooting.md)

<!-- RESOURCES -->

[kube-cpumem]: https://github.com/Azure/azure-quickstart-templates