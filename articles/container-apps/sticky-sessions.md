---
title: Session Affinity in Azure Container Apps
description: How to set session affinity (sticky sessions) in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 03/28/2023
ms.author: cshoe
zone_pivot_groups: arm-portal
---

# Session Affinity in Azure Container Apps

Session affinity, also known as sticky sessions, is a feature that allows you to route all requests from a client to the same replica. This feature is useful for stateful applications that require a consistent connection to the same replica.

Session stickiness is enforced using HTTP cookies. This feature is available in single revision mode when HTTP ingress is enabled. A client may be routed to a new replica if the previous replica is no longer available.

If your app doesn't require session affinity, we recommend that you don't enable it. With session affinity disabled, ingress distributes requests more evenly across replicas improving the performance of your app.

> [!NOTE]
> Session affinity is only supported when your app is in [single revision mode](revisions.md#single-revision-mode) and the ingress type is HTTP.
> 

## Configure session affinity

::: zone pivot="azure-resource-manager"

Session affinity is configured by setting the `affinity` property in the `ingress.stickySessions` configuration section. The following example shows how to configure session affinity for a container app:

```json
{
  ...
  "configuration": {
      "ingress": {
          "external": true,
          "targetPort": 80,
          "transport": "auto",
          "stickySessions": {
              "affinity": "sticky"
          }
      }
  }
}
```

::: zone-end

::: zone pivot="azure-portal"


You can enable session affinity when you create your container app via the Azure portal. To enable session affinity:

1. On the **Create Container App** page, select the **App settings** tab.  
1. In the **Application ingress settings** section, select **Enabled** for the **Session affinity** setting.  


:::image type="content" source="media/ingress/screenshot-session-affinity.png" alt-text="Screenshot of the session affinity setting in Create Container App page.":::

You can also enable or disable session affinity after your container app is created. To enable session affinity:

1. Go  to your app in the portal.
1. Select **Ingress**.
1. You can enable or disable **Session affinity** by selecting or deselecting **Enabled**.
1. Select **Save**.

:::image type="content" source="media/ingress/screenshot-ingress-session-affinity.png" alt-text="Screenshot of session affinity session on Ingress page.":::

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Configure ingress](ingress-how-to.md)
