---
title: Using Kubernetes Nginx Ingress Controller
description: How to use Kubernetes Nginx Ingress Controller with Open Service Mesh
services: container-service
ms.topic: article
ms.date: 8/26/2021
ms.custom: mvc, devx-track-azurecli
ms.author: pgibson
---

# Deploy an application managed by Open Service Mesh (OSM) with Kubernetes Nginx Ingress Controller

Open Service Mesh (OSM) is a lightweight, extensible, Cloud Native service mesh, allowing users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

This tutorial will demonstrate how to configure HTTP and HTTPS ingress to a service part of an OSM managed service mesh when using [Kubernetes Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/).

## Prerequisites

The steps detailed in this article assume that you've created an AKS cluster (Kubernetes `1.19+` and above, with Kubernetes RBAC enabled), have established a `kubectl` connection with the cluster (If you need help with any of these items, then see the [AKS quickstart](./kubernetes-walkthrough.md), and have installed the AKS OSM add-on.

You must have the following resources installed:

- The Azure CLI, version 2.20.0 or later
- OSM add-on version v0.11.1 or later
- OSM CLI version v0.11.1 or later
- Have Kubernetes Nginx Ingress Controller installed. Refer to the [deployment guide](https://kubernetes.github.io/ingress-nginx/deploy/) to install it.

## Demo

Step by step detailed instructions on how to configure ingress to a service part of the mesh can be found [here](https://release-v0-11.docs.openservicemesh.io/docs/demos/ingress_k8s_nginx/#demo). 