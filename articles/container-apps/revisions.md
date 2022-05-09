---
title: Revisions in Azure Container Apps Preview
description: Learn about revisions in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 05/03/2022
ms.author: cshoe
ms.custom: ignite-fall-2021
---

# Revisions in Azure Container Apps Preview

Azure Container Apps implements container app versioning by creating revisions. A revision is an immutable snapshot of a container app version. 

- The first revision is automatically created when you deploy your container app.
- New revisions are automatically created when you make a [*revision-scope*](#revision-scope-changes) change to your container app.
- While revisions are immutable, they're affected by [*application-scope*](#application-scope-changes) changes, which apply to all revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions.png" alt-text="Azure Container Apps: Containers":::

## Revision modes

The revision mode controls whether only a single revision or multiple revisions of your container app can be simultaneously active. You can set your app's revision mode from your container app's **Revision management** page in the Azure portal, using Azure CLI commands, or in the ARM template.

### Single revision mode

By default, a container app is in *single revision mode*. In this mode, only one revision is active at a time. When a new revision is created in *single revision mode*, the latest revision replaces the active revision.

### Multiple revision mode

Set the revision mode to *multiple revision mode*, to run multiple revisions of your app simultaneously. While in *multiple revision mode*, new revisions are activated alongside current active revisions. 

In *multiple revision mode*, traffic isn't automatically allocated to new revisions for apps with external HTTP ingress.  Configure splitting from your container app's **Revision management** page in the Azure portal, using Azure CLI commands, or in an ARM template. 

## Use cases

Container Apps revisions help you manage the versioning of your container app.  You can use revisions to:

- Release a new version of your app.
- Quickly revert to an earlier version of your app.
- Split traffic between revisions for [A/B testing](https://wikipedia.org/wiki/A/B_testing).
- Gradually phase in a new revision in blue-green deployments.  For more information about blue-green deployment, see [BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html).

The following diagram shows a container app with two revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions-traffic-split.png" alt-text="Azure Container Apps: Traffic splitting among revisions":::

The scenario shown above presumes the container app is in the following state:

- [Ingress](ingress.md) is enabled, making the container app available via HTTP.
- The first revision is deployed as _Revision 1_.
- After the container was updated, a new revision was activated as _Revision 2_.
- [Traffic splitting](revisions-manage.md#traffic-splitting) rules are configured so that _Revision 1_ receives 80% of the requests, and _Revision 2_ receives the remaining 20%.

## Change types

Changes to a container app fall under two categories: *revision-scope* or *application-scope* changes. *Revision-scope* changes trigger a new revision when you deploy your app, while *application-scope* changes don't.

### Revision-scope changes

A new revision is created when a container app is updated with *revision-scope* changes.  *Revision-scope* changes modify the container app itself rather than only its runtime settings.

A *revision-scope* change is any change to the parameters in the [`properties.template`](azure-resource-manager-api-spec.md#propertiestemplate) section of the container app resource template.

These changes include modifications to:

- Revision name
- Container configuration and images
- Scale rules for the container application

### Application-scope changes

*Application-scope* changes modify the settings in which the container app is run, not the container app itself. When you deploy a container app with *application-scope* changes:

- a new revision isn't created
- the changes are applied to every revision

*Application-scope* changes are defined as any change to the parameters in the [`properties.configuration`](azure-resource-manager-api-spec.md#propertiesconfiguration) section of the container app resource template.

These parameters include:

- [Secret values](manage-secrets.md)
  - Revisions must be [restarted](revisions.md) before a container recognizes new secret values.
- Revision mode
- Ingress configuration including:
  - Turning [ingress](ingress.md) on or off
  - [Traffic splitting rules](revisions-manage.md#traffic-splitting)
  - Labels
- Credentials for private container registries
- Dapr settings

## Revision Labels

For container apps with external HTTP traffic, labels are a portable means to direct traffic to specific revisions. A label provides a unique URL that you can use to route traffic to the revision that the label is assigned. To switch traffic between revisions, you can move the label from one revision to another.

- Label name rules are the same as for container app names.
- The same label can't be applied to more than one active or inactive revision.
- Labels keep the same URL when moved from one revision to another.
- Traffic allocation isn't required for revisions with labels.
- Labels are most useful when the app is in *multiple revision mode*.
- You can enable labels, traffic splitting or both.

Labels are useful for testing new revisions.  For example, when you want to give access to a set of test users, you can give them the label's URL. Then when you want to move your users to a different revision, you can move the label to that revision.

Labels work independently of traffic splitting.  Traffic splitting distributes traffic going to the container app's application URL to revisions based on the percentage of traffic.  While traffic directed to a label's URL is routed to one specific revision.

You can manage labels from your container app's **Revision management** page in the Azure portal.

:::image type="content" source="media/revisions/screen-shot-revision-mgmt-labels.png" alt-text="Screenshot of Container Apps revision management.":::

You can find the label URL in the revision details pane.

:::image type="content" source="media/revisions/screen-shot-revision-mgmt-revision-details.png" alt-text="Screenshot of Container Apps revision details.":::

## Activation state

In *multiple revision mode*, revisions remain active until you deactivate them. You can activate and deactivate revisions from your container app's **Revision management** page in the Azure portal or from the Azure CLI.

You aren't charged for the inactive revisions. You can have a maximum of 100 revisions, after which the oldest revision is purged.

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)

