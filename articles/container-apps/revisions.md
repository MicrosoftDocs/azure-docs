---
title: Revisions in Azure Container Apps Preview
description: Learn how revisions are created in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: cshoe
ms.custom: ignite-fall-2021
---

# Revisions in Azure Container Apps Preview

A revision is an immutable snapshot of a container app.

- The first revision is automatically created when you deploy your container app.
- New revisions are automatically created when a container app's `template` configuration changes.
- While revisions are immutable, they're affected by changes to global configuration values, which apply to all revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions.png" alt-text="Azure Container Apps: Containers":::

Revisions are most useful when you enable [ingress](ingress.md) to make your container app accessible via HTTP.  Revisions are often used when you want to direct traffic from one snapshot of your container app to the next. Typical traffic direction strategies include [A/B testing](https://wikipedia.org/wiki/A/B_testing) and [BlueGreen deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html).

The following diagram shows a container app with two revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions-traffic-split.png" alt-text="Azure Container Apps: Traffic splitting among revisions":::

The scenario shown above presumes the container app is in following state:

- [Ingress](ingress.md) is enabled, which makes the container app available via HTTP.
- The first revision is deployed as _Revision 1_.
- After the container was updated, a new revision was activated as _Revision 2_.
- [Traffic splitting](revisions-manage.md#traffic-splitting) rules are configured so that _Revision 1_ receives 80% of the requests, while _Revision 2_ receives the remaining 20%.

## Change types

Changes made to a container app fall under one of two categories: *revision-scope* and *application-scope* changes. Revision-scope changes are any change that triggers a new revision, while application-scope changes don't create revisions.

### Revision-scope changes

The following types of changes create a new revision:

- Changes to containers
- Add or update scaling rules
- Changes to Dapr settings
- Any change that affects the `template` section of the configuration

### Application-scope changes

The following types of changes do not create a new revision:

- Changes to [traffic splitting rules](revisions-manage.md#traffic-splitting)
- Turning [ingress](ingress.md) on or off
- Changes to [secret values](manage-secrets.md)
- Any change outside the `template` section of the configuration

While changes to secrets are an application-scope change, revisions must be [restarted](revisions.md) before a container recognizes new secret values.

## Activation state

New revisions remain active until you deactivate them, or you set your container app to automatically deactivate old revisions.

- Inactive revisions remain as a snapshot record of your container app in a certain state.
- You are not charged for inactive revisions.
- Up to 100 revisions remain available before being purged.

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)
