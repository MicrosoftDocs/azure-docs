---
title: Revisions in Azure Container Apps Preview
description: Learn how revisions are created in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 05/03/2022
ms.author: cshoe
ms.custom: ignite-fall-2021
---

# Revisions in Azure Container Apps Preview

Azure Container Apps manages container app versioning by creating revisions.   A revision is an immutable snapshot of a container app version.  

- The first revision is automatically created when you deploy your container app.
- New revisions are automatically created when a container app's `template` configuration changes.
- While revisions are immutable, they're affected by changes to global configuration values, which apply to all revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions.png" alt-text="Azure Container Apps: Containers":::

## Revision modes

By default, a container app is in *single revision mode*.  In this mode, only one revision is active at a time.  When new revisions are created, the new revision replaces the active revision.

When you set the revision mode to *multiple*, you can run multiple revisions of your app simultaneously. While in *multiple revision mode*, new revisions are activated along side of active revisions.  

For apps with HTTP ingress enabled, you must manage the how HTTP traffic is split between revisions. By default a new revision is not  a percentage of traffic. You can configure traffic splitting from the **Revision management* page of your container app in the Azure portal, using Azure CLI commands, or  in the ARM template.  Configuring traffic splitting in an ARM template will not trigger the creation of a new revision.

## Use cases

Revisions are an important way of versioning your container app.  With revisions you can 

-  easily revert to an earlier revision.
-  split traffic between revisions to A/B testing [A/B testing](https://wikipedia.org/wiki/A/B_testing
-  gradually phase in a new revision in blue green deployments [BlueGreen deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)


The following diagram shows a container app with two revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions-traffic-split.png" alt-text="Azure Container Apps: Traffic splitting among revisions":::

The scenario shown above presumes the container app is in following state:

- [Ingress](ingress.md) is enabled, which makes the container app available via HTTP.
- The first revision is deployed as _Revision 1_.
- After the container was updated, a new revision was activated as _Revision 2_.
- [Traffic splitting](revisions-manage.md#traffic-splitting) rules are configured so that _Revision 1_ receives 80% of the requests, while _Revision 2_ receives the remaining 20%.

## Change types

Changes made to a container app fall under one of two categories: *revision-scope* and *application-scope* changes. Revision-scope changes are any change that triggers a new revision, while application-scope changes don't create revisions.

Revision-scope changes are internal to the container app, whereas application-scope changes are configuration settings that don't require changing the app itself.  Like flipping a switch on a machine as opposed to modifying the mechanisms inside.

### Revision-scope changes

Revision-scope changes cause a new revision to be created when the container app is redeployed.  A revision-scope change is when you change something that modifies the container app itself.   Changes include 

- revision name
- container configuration and images
- scale rules for the container application

Revision-scope changes are defined in the [`properties.template`](azure-resource-manager-api-spec.md#properties.template) section in the Container Apps resource template.


### Application-scope changes

Application-scope changes do not trigger a new revision when they are deployed. An application scope change is when you change a configuration setting that does not permanently change the container app itself.  like flipping a switch on a machine as opposed to changing the internal mechanism.

Application-scope changes include changes to:

- [secret values](manage-secrets.md)
- Revision mode
- Ingress configuration including:
  - Turning [ingress](ingress.md) on or off
  - [traffic splitting rules](revisions-manage.md#traffic-splitting)
- Credentials for private container registries
- Dapr settings

Application-mode changes are defined in the [`configuration`](azure-resource-manager-api-spec.md#properties.configuration)  section of the container app resource template.

While changes to secrets are an application-scope change, revisions must be [restarted](revisions.md) before a container recognizes new secret values.

## Apply labels to revisions



## Activation state

New revisions remain active until you deactivate them, or you set your container app to automatically deactivate old revisions.

- Inactive revisions remain as a snapshot record of your container app in a certain state.
- You are not charged for inactive revisions.
- Up to 100 revisions remain available before being purged.

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)
