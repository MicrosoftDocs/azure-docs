---
title: Traffic splitting in Azure Container Apps
description: Ingress options for Azure Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: how-to
ms.date: 03/14/2023
ms.author: v-bcatherine
---

# Traffic splitting in Azure Container Apps

By default, when ingress is enabled all traffic is routed to the latest deployed revision. You can configure traffic splitting rules to route portions of your traffic to a specific revision. Traffic splitting is useful for testing updates to your container app.  

This article shows you how to configure traffic splitting rules for your container app.

## Configure traffic splitting

You can configure traffic splitting rules in your container using the Azure CLI, the Azure portal or an ARM template.  The weight of the traffic split is specified as a percentage.  The combined weight of all traffic split rules must equal 100%.

```json
{
  ...
  "configuration": {
    "ingress": {
      "external": true,
      "targetPort": 80,
      "allowInsecure": false,
      "traffic": [
        {
          "revisionName": "my-example-app--5g3ty20",
          "weight": 50
        },
        {
          "revisionName": "my-example-app--qcfkbsv",
          "weight": 50
        }
      ]
    },
  },
```

# [Azure CLI](#tab/azure-cli)

Configure traffic splitting between revisions using the `az containerapp ingress traffic set` command.

The following command set the traffic weight for revision `v1` to `50` and revision `v2` to `50`:

```azurecli
az containerapp ingress traffic set \
    --name <app-name> \
    --resource-group <resource-group> \
    --revision-weight v1=50 v2=50
```

This command sets the traffic weight for revision labeled `label-1` to `50` and revision `label-2` to `50`:

```azurecli
az containerapp ingress traffic set \
    --name <app-name> \
    --resource-group <resource-group> \
    --label-weight label-1=50 label-2=50

```

# [Portal](#tab/portal)

To configure traffic splitting in the Azure portal, follow these steps:



# [ARM template](#tab/arm-template)

Enable traffic splitting by setting the `ingress` settings in your container ARM template.

```json
{
  ...
  "configuration": {
    "ingress": {
      "external": true,
      "targetPort": 80,
      "allowInsecure": false,
      "traffic": [
        {
          "latestRevision": true,
          "weight": 100
        }
      ]
    },
  },
```

The follow example shows traffic splitting between two revisions:



```json
    "traffic": [
        {
            "revisionName": "my-example-app--5g3ty20",
            "weight": 50
        },
        {
            "revisionName": "my-example-app--qcfkbsv",
            "weight": 50
        }
    ],
```

The following example show traffic splitting between two revision labels:

```json
    "traffic": [
        {
            "revisionName": "my-example-app--5g3ty20",
            "weight": 50,
            "label": "v-2"
        },
        {
            "revisionName": "my-example-app--qcfkbsv",
            "weight": 50,
            "label": "v-1"
        }
    ],
```

---

## Traffic splitting scenarios

The following scenarios describe configuration settings for common use cases.

### Rapid iteration

In situations where you're frequently iterating development of your container app, you can set traffic rules to always shift all traffic to the latest deployed revision.

The following example template routes all traffic to the latest deployed revision:

```json
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