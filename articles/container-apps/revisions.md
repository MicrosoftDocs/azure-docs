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
- While revisions are immutable, they're affected by [*application-scope*](#application-scope-changes), which apply to all revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions.png" alt-text="Azure Container Apps: Containers":::

## Revision modes

The revision mode controls whether only a single or multiple revisions of your container app can be active simultaneously. You can set the revision mode to *single revision mode* or *multiple revision mode*.  You can set your app's revision mode from your container app's **Revision management** page in the Azure portal, using Azure CLI commands, or in an ARM template.

### Single revision mode

By default, a container app is in *single revision mode*. In this mode, only one revision is active at a time. When a new revision is created, the latest revision replaces the active revision.

### Multiple revision mode

When you set the revision mode to *multiple revision mode*, you can run multiple revisions of your app simultaneously. While in *multiple revision mode*, new revisions are activated alongside current active revisions. 

In *multiple revision mode*, you must manage how HTTP traffic is split between revisions for apps with HTTP ingress enabled. By default, a new revision isn't allotted a percentage of traffic. You can configure traffic splitting from your container app's **Revision management** page in the Azure portal, using Azure CLI commands, or in an ARM template. 

## Use cases

You use revisions to:

- Quickly revert to an earlier revision.
- Split traffic between revisions to A/B testing [A/B testing](https://wikipedia.org/wiki/A/B_testing.
- Gradually phase in a new revision in blue-green deployments [BlueGreen deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html).

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

*Revision-scope* changes cause a new revision to be created when deploying a container app update. A *revision-scope* change modifies the container app rather than only its runtime settings. 

A *Revision-scope* change is any change to the parameters in the [`properties.template`](azure-resource-manager-api-spec.md#properties.template) section of the container app resource template. 

These changes include changes to:

- Revision name
- Container configuration and images
- Scale rules for the container application

### Application-scope changes

*Application-scope* changes modify the settings under which the container app is run, not the container app itself. When you deploy a container app with *Application-scope* changes:

- a new vision isn't created
- the changes are applied to every revision
   
An *application-scope* change is any change to the parameters in the [`configuration`](azure-resource-manager-api-spec.md#properties.configuration) section of the container app resource template. 

These changes include changes to:

- [Secret values](manage-secrets.md) - Revisions must be [restarted](revisions.md) before a container recognizes new secret values.
- Revision mode
- Ingress configuration including:
- Turning [ingress](ingress.md) on or off
- [Traffic splitting rules](revisions-manage.md#traffic-splitting)
- Credentials for private container registries
- Dapr settings


## Apply labels to revisions

For container apps with external HTTP traffic, labels are a portable means to direct traffic to a revision. When you create a label, a unique URL is created specifically for that label. The label's URL points to the URL of the revision to which the label is assigned.

You can publish the label's URL to direct traffic to that revision. To switch traffic to a different revision, move the label to that revision.

Labels work independently of traffic splitting rules. Traffic splitting rules route traffic directed to the container app's URL to the active revisions. However, when using labels, traffic directed to the label’s URL is routed directly to the URL of the revision to which the label is assigned.

Labels are useful for scenarios when you're testing your app and want to give access to a set of test users. You can provide the users with the label’s URL. You can move the label to the new revision as you update your app to keep test users on the latest revision. If needed, you can move the label back to a previous revision.

You can manage labels from your container app's **Revision management** page in the Azure portal.

## Activation state

In *multiple revision mode*, revisions remain active until you deactivate them. You can activate and deactivate revisions from your container app's **Revision management** page in the Azure portal or from the Azure CLI.

You aren't charged for the inactive revisions. You can have a maximum of 100 revisions, after which the oldest revision is purged.

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)

