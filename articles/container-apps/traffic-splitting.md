---
title: Traffic splitting in Azure Container Apps
description: Ingress options for Azure Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/14/2023
ms.author: v-bcatherine
---

# Traffic splitting in Azure Container Apps

By default, when ingress is enabled all traffic is routed to the latest deployed revision. You can configure traffic splitting rules to route portions of your traffic to a specific revision. Traffic splitting is useful for testing updates to your container app.  

You can configure traffic splitting rules using the `ingress` settings in your container app template. 


## Traffic splitting scenarios

The following scenarios describe configuration settings for common use cases.


>[!NOTE]
> add example of traffic splitting based on revision label.

### Rapid iteration

In situations where you're frequently iterating development of your container app, you can set traffic rules to always shift all traffic to the latest deployed revision.

The following example template routes all traffic to the latest deployed revision:

```jso
"ingress": { 
  "traffic": [
    {
      "latestRevision": true,
      "weight": 100
    }
  ]
}
```

Once you're satisfied with the latest revision, you can lock traffic to that revision by updating the `ingress` settings to:

```json
"ingress": { 
  "traffic": [
    {
      "latestRevision": false, // optional
      "revisionName": "myapp--knowngoodrevision",
      "weight": 100
    }
  ]
}
```

### Update existing revision

Consider a situation where you have a known good revision that's serving 100% of your traffic, but you want to issue an update to your app. You can deploy and test new revisions using their direct endpoints without affecting the main revision serving the app.

Once you're satisfied with the updated revision, you can shift a portion of traffic to the new revision for testing and verification.

The following template moves 20% of traffic over to the updated revision:

```json
"ingress": {
  "traffic": [
    {
      "revisionName": "myapp--knowngoodrevision",
      "weight": 80
    },
    {
      "revisionName": "myapp--newerrevision",
      "weight": 20
    }
  ]
}
```

### Staging microservices

When building microservices, you may want to maintain production and staging endpoints for the same app. Use labels to ensure that traffic doesn't switch between different revisions.

The following example template applies labels to different revisions.

```json
"ingress": { 
  "traffic": [
    {
      "revisionName": "myapp--knowngoodrevision",
      "weight": 100
    },
    {
      "revisionName": "myapp--98fdgt",
      "weight": 0,
      "label": "staging"
    }
  ]
}
```