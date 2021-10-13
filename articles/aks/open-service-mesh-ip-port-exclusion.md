---
title: IP and port range exclusion
description: Implement IP and port range exclusion
services: container-service
ms.topic: article
ms.date: 10/8/2021
ms.custom: mvc, devx-track-azurecli
ms.author: kochhars
---

# Implement IP and <span class="x x-first x-last">port range exclusion</span>

Outbound TCP based traffic from applications is by default intercepted using the `iptables` rules programmed by OSM, and redirected to the Envoy proxy sidecar. OSM provides a means to specify a list of IP ranges and ports to exclude from traffic interception if necessary. For guidance on how to exclude IP and port ranges, refer to [this documentation](https://release-v0-11.docs.openservicemesh.io/docs/guides/traffic_management/iptables_redirection/). 

**Note that for the Open Service Mesh AKS add-on, port exclusion can only be implemented after installation using `kubectl patch` and not during installation using the OSM CLI `--set` flag.**

> [!NOTE]
> If the application pods that are a part of the mesh need access to IMDS, Azure DNS or the Kubernetes API server, the user needs to explicitly add these IP addresses to the list of Global outbound IP ranges using the above command. See an example of Kubernetes API Server port exclusion [here](https://release-v0-11.docs.openservicemesh.io/docs/guides/app_onboarding/#onboard-services).
