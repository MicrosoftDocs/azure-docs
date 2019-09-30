---
title: "Frequently asked questions about Azure Dev Spaces"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
author: zr-msft
ms.author: zarhoads
ms.date: 09/25/2019
ms.topic: "conceptual"
description: "Find answers to some of the common questions about Azure Dev Spaces"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s "
---

# Frequently asked questions about Azure Dev Spaces

This addresses frequently asked questions about Azure Dev Spaces.

## Which Azure regions currently provide Azure Dev Spaces?

For a complete list of available regions, see [supported regions and configurations][supported-regions].

## Can I use Azure Dev Spaces without a public IP address?

No, you can't provision Azure Dev Spaces on an AKS Cluster without a public IP. A public IP is [needed by Azure Dev Spaces for routing][dev-spaces-routing].

## Can I use my own ingress with Azure Dev Spaces?

Yes, you can configure your own ingress along side the one Azure Dev Spaces creates. For example, you can use [traefik][ingress-traefik].

## Can I use HTTPS with Azure Dev Spaces?

Yes, you can configure your own ingress with HTTPS using [traefik][ingress-https-traefik].

## Can I use Azure Dev Spaces on a cluster that uses CNI rather than kubenet? 

Yes, you can use Azure Dev Spaces on an AKS cluster that uses CNI for networking. For example, you can use Azure Dev Spaces on an AKS cluster with [existing Windows containers][windows-containers], which uses CNI for networking.

## Can I use Azure Dev Spaces with Windows Containers?

Currently, Azure Dev Spaces is intended to run on Linux pods and nodes only, but you can run Azure Dev Spaces on an AKS cluster with [existing Windows containers][windows-containers].


[dev-spaces-routing]: how-dev-spaces-works.md#how-routing-works
[ingress-traefik]: how-to/ingress-https-traefik.md#configure-a-custom-traefik-ingress-controller
[ingress-https-traefik]: how-to/ingress-https-traefik.md#configure-the-traefik-ingress-controller-to-use-https
[supported-regions]: about.md#supported-regions-and-configurations
[windows-containers]: how-to/run-dev-spaces-windows-containers.md