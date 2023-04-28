---
title: Troubleshoot Traffic Controller
titlesuffix: Azure Application Load Balancer
description: Learn how to troubleshoot common issues with Traffic Controller
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: troubleshooting
ms.date: 5/1/2023
ms.author: greglin
---

# Troubleshooting in Traffic Controller

Learn how to troubleshoot common problems in Traffic Controller.

## Configuration Errors

### Traffic Controller returns 500 status code

Scenarios in which you would notice a 500-error code on Traffic Controller are as follows:
1. __Invalid backend Entries__ : A backend is defined as invalid in the following scenarios:
    1. It refers to an unknown or unsupported kind of resource. In this case, the HTTPRoute's status has a condition with reason set to `InvalidKind` and the message explains which kind of resource is unknown or unsupported.
    1. It refers to a resource that doesn't exist. In this case, the HTTPRoute's status has a condition with reason set to `BackendNotFound` and the message explains that the resource doesn't exist.
    1. It refers to a resource in another namespace when the reference isn't explicitly allowed by a ReferenceGrant (or equivalent concept). In this case, the HTTPRoute's status has a condition with reason set to `RefNotPermitted` and the message explains which cross-namespace reference isn't allowed.

    For instance, if an HTTPRoute has two backends specified with equal weights, and one is invalid 50 percent of the traffic must receive a 500. This is based on the specifications provided by Gateway API [here](https://gateway-api.sigs.k8s.io/v1alpha2/references/spec/#gateway.networking.k8s.io%2fv1beta1.HTTPRouteRule)

1. No endpoints found for all backends: when there are no endpoints found for all the backends referenced in an HTTPRoute, a 500 error code is obtained.
