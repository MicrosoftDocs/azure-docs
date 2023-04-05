---
title: Revisions in Azure Container Apps
description: Learn how revisions are created in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 05/11/2022
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# Revisions in Azure Container Apps

Azure Container Apps implements container app versioning by creating revisions. A revision is an immutable snapshot of a container app version. 

- The first revision is automatically created when you deploy your container app.
- New revisions are automatically created when you make a [*revision-scope*](#revision-scope-changes) change to your container app.
- While revisions are immutable, they're affected by [*application-scope*](#application-scope-changes) changes, which apply to all revisions.
- You can retain up to 100 revisions, giving you a historical record of your container app updates.
- You can run multiple revisions concurrently.
- You can split external HTTP traffic between active revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions.png" alt-text="Azure Container Apps: Containers":::


## Use cases

Container Apps revisions help you manage the release of updates to your container app by creating a new revision each time you make a *revision-scope* change to your app.  You can control which revisions are active, and the external traffic that is routed to each active revision. 

You can use revisions to:

- Release a new version of your app.
- Quickly revert to an earlier version of your app.
- Split traffic between revisions for [A/B testing](https://wikipedia.org/wiki/A/B_testing).
- Gradually phase in a new revision in blue-green deployments.  For more information about blue-green deployment, see [BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html).

The following diagram shows a container app with two revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions-traffic-split.png" alt-text="Azure Container Apps: Traffic splitting among revisions":::

This scenario presumes the container app is in the following state:

- [Ingress](ingress-how-to.md) is enabled, making the container app available via HTTP or TCP.
- The first revision was deployed as _Revision 1_.
- After the container was updated, a new revision was activated as _Revision 2_.
- [Traffic splitting](traffic-splitting.md) rules are configured so that _Revision 1_ receives 80% of the requests, and _Revision 2_ receives the remaining 20%.

## Revision name suffix

Revision names are used to identify a revision, and in the revision's URL.  You can customize the revision name by setting the revision suffix.

The format of a revision name is:

```text
<CONTAINER_APP_NAME>--<REVISION_SUFFIX>
```

By default, Container Apps creates a unique revision name with a suffix consisting of a semi-random string of alphanumeric characters.  You can customize the name by setting a unique custom revision suffix.

For example, for a container app named *album-api*, setting the revision suffix name to *1st-revision* would create a revision with the name *album-api--1st-revision*.

You can set the revision suffix in the [ARM template](azure-resource-manager-api-spec.md#propertiestemplate), through the Azure CLI `az containerapp create` and `az containerapp update` commands, or when creating a revision via the Azure portal.

## Change types

Changes to a container app fall under two categories: *revision-scope* or *application-scope* changes. *Revision-scope* changes trigger a new revision when you deploy your app, while *application-scope* changes don't.

### Revision-scope changes

A new revision is created when a container app is updated with *revision-scope* changes.  The changes are limited to the revision in which they're deployed, and don't affect other revisions.

A *revision-scope* change is any change to the parameters in the [`properties.template`](azure-resource-manager-api-spec.md#propertiestemplate) section of the container app resource template.

These parameters include:

- [Revision suffix](#revision-name-suffix)
- Container configuration and images
- Scale rules for the container application

### Application-scope changes

When you deploy a container app with *application-scope* changes:

- The changes are globally applied to all revisions.  
- A new revision isn't created.

*Application-scope* changes are defined as any change to the parameters in the [`properties.configuration`](azure-resource-manager-api-spec.md#propertiesconfiguration) section of the container app resource template.

These parameters include:

- [Secret values](manage-secrets.md) (revisions must be restarted before a container recognizes new secret values)
- [Revision mode](#revision-modes)
- Ingress configuration including:
  - Turning [ingress](ingress-how-to.md) on or off
  - [Traffic splitting rules](traffic-splitting.md)
  - Labels
- Credentials for private container registries
- Dapr settings


## Revision modes

The revision mode controls whether only a single revision or multiple revisions of your container app can be simultaneously active. You can set your app's revision mode from your container app's **Revision management** page in the Azure portal, using Azure CLI commands, or in the ARM template.

### Single revision mode

By default, a container app is in *single revision mode*. In this mode, when a new revision is created, the latest revision replaces the active revision. For more information, see [Zero downtime deployment](./application-lifecycle-management.md#zero-downtime-deployment).

### Multiple revision mode

Set the revision mode to *multiple revision mode*, to run multiple revisions of your app simultaneously. While in this mode, new revisions are activated alongside current active revisions.

For an app implementing external HTTP ingress, you can control the percentage of traffic going to each active revision from your container app's **Revision management** page in the Azure portal, using Azure CLI commands, or in an ARM template. For more information, see [Traffic splitting](traffic-splitting.md).

## Revision Labels

For container apps with external HTTP traffic, labels are a portable means to direct traffic to specific revisions. A label provides a unique URL that you can use to route traffic to the revision that the label is assigned. To switch traffic between revisions, you can move the label from one revision to another.

- Labels keep the same URL when moved from one revision to another.
- A label can be applied to only one revision at a time.
- Allocation for traffic splitting isn't required for revisions with labels.
- Labels are most useful when the app is in *multiple revision mode*.
- You can enable labels, traffic splitting or both.

Labels are useful for testing new revisions.  For example, when you want to give access to a set of test users, you can give them the label's URL. Then when you want to move your users to a different revision, you can move the label to that revision.

Labels work independently of traffic splitting.  Traffic splitting distributes traffic going to the container app's application URL to revisions based on the percentage of traffic.  When traffic is directed to a label's URL, the traffic is routed to one specific revision.

A label name must:

- consist of lower case alphanumeric characters or dashes ('-')
- start with an alphabetic character
- end with an alphanumeric character
- not have two consecutive dashes (--)
- not be more than 64 characters

You can manage labels from your container app's **Revision management** page in the Azure portal.

:::image type="content" source="media/revisions/screen-shot-revision-mgmt-labels.png" alt-text="Screenshot of Container Apps revision management.":::

You can find the label URL in the revision details pane.

:::image type="content" source="media/revisions/screen-shot-revision-mgmt-revision-details.png" alt-text="Screenshot of Container Apps revision details.":::

## Activation state

In *multiple revision modes*, revisions remain active until you deactivate them. You can activate and deactivate revisions from your container app's **Revision management** page in the Azure portal or from the Azure CLI.

You aren't charged for the inactive revisions. You can have a maximum of 100 revisions, after which the oldest revision is purged.

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)
