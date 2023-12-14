---
title: Update and deploy changes in Azure Container Apps
description: Learn how to use revisions to make changes in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 10/10/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022, build-2023
---

# Update and deploy changes in Azure Container Apps

Change management can be challenging as you develop containerized applications in the cloud. Ultimately, you need the support to track changes, ensure uptime, and have mechanisms to handle smooth rollbacks.

Change management in Azure Container Apps is powered by revisions, which are a snapshot of each version of your container app.

Key characteristics of revisions include:

- **Immutable**: Once established, a revision remains unchangeable.

- **Versioned**: Revisions act as a record of the container app's versions, capturing its state at various stages.

- **Automatically provisioned**: When you deploy a container app for the first time, an initial revision is automatically created.

- **Scoped changes**: While revisions remain static, [application-scope](#change-types) changes can affect all revisions, while [revision-scope](#change-types) changes create a new revision.

- **Historical record**: Azure Container Apps allow you to retain up to 100 revisions. This history gives you a comprehensive historical record of your app's updates.

- **Multiple revisions**: You can run multiple revisions concurrently. This feature is especially beneficial when you need to manage different versions of your app simultaneously.

## Lifecycle

Each revision undergoes specific states, influenced by its status and availability. During its lifecycle, a container app goes through different provisioning, running, and an inactive status.

### Provisioning status

When you create a new revision, the container app undergoes startup and readiness checks. During this phase, the provisioning status serves as a guide to track the container app's progress.

| Status | Description |
|---|---|
| Provisioning | The revision is in the verification process. |
| Provisioned | The revision has successfully passed all checks. |
| Provisioning failed | The revision encountered issues during verification. |

### Running status

After a container app is successfully provisioned, a revision enters its operating phase. The running status helps monitor a container app's health and functionality.

| Status | Description |
|---|---|
| Provisioning | The revision is in the verification process. | 
| Scale to 0 | Zero running replicas, and not provisioning any new replicas. The container app can create new replicas if scale rules are triggered. |
| Activating | Zero running replicas, one replica being provisioned.  |
| Activation failed | The first replica failed to provision. |
| Scaling / Processing | Scaling in or out is occurring. One or more replicas are running, while other replicas are being provisioned. |
| Running | One or more replicas are running. There are no issues to report. |
| Running (at max) | The maximum number of replicas (according to the scale rules of the revision) are running. There are no issues to report. |
| Deprovisioning | The revision is transitioning from active to inactive, and is removing any resources it has created. |
| Degraded | At least one replica in the revision is in a failed state. View running state details for specific issues. |
| Failed | Critical errors caused revisions to fail. The *running state* provides details. Common causes include:<br>• Termination<br>• Exit code `137` |

### Inactive status

Revisions can also enter an inactive state. These revisions don't possess provisioning or running states. However, Azure Container Apps maintains a list of these revisions, accommodating up to 100 inactive entries. You can activate a revision at any time.

## Revision modes

Azure Container Apps support two revision modes. Your choice of mode determines how many revisions of your app are simultaneously active.

| Revision modes | Description | Default |
|---|---|---|
| Single | New revisions are automatically provisioned, activated, and scaled to the desired size. Once all the replicas are running as defined by the [scale rule](scale-app.md), then traffic is diverted from the old version to the new one. If an update fails, traffic remains pointed to the old revision. Old revisions are automatically deprovisioned. | Yes |
| Multiple | You can have multiple active revisions, split traffic between revisions, and choose when to deprovision old revisions. This level of control is helpful for testing multiple versions of an app, blue-green testing, or taking full control of app updates. Refer to [traffic splitting](traffic-splitting.md) for more detail.

### Labels

For container apps with external HTTP traffic, labels direct traffic to specific revisions. A label provides a unique URL that you can use to route traffic to the revision that the label is assigned.

To switch traffic between revisions, you can move the label from one revision to another.

- Labels keep the same URL when moved from one revision to another.
- A label can be applied to only one revision at a time.
- Allocation for traffic splitting isn't required for revisions with labels.
- Labels are most useful when the app is in *multiple revision mode*.
- You can enable labels, traffic splitting or both.

Labels are useful for testing new revisions.  For example, when you want to give access to a set of test users, you can give them the label's URL. Then when you want to move your users to a different revision, you can move the label to that revision.

Labels work independently of traffic splitting.  Traffic splitting distributes traffic going to the container app's application URL to revisions based on the percentage of traffic.  When traffic is directed to a label's URL, the traffic is routed to one specific revision.

A label name must:

- Consist of lower case alphanumeric characters or dashes (`-`)
- Start with an alphabetic character
- End with an alphanumeric character

Labels must not:

- Have two consecutive dashes (`--`)
- Be more than 64 characters

You can manage labels from your container app's **Revision management** page in the Azure portal.

:::image type="content" source="media/revisions/screen-shot-revision-mgmt-labels.png" alt-text="Screenshot of Container Apps revision management.":::

The label URL is available in the revision details pane.

:::image type="content" source="media/revisions/screen-shot-revision-mgmt-revision-details.png" alt-text="Screenshot of Container Apps revision details.":::

### Zero downtime deployment

In *single revision mode*, Container Apps ensures your app doesn't experience downtime when creating a new revision. The existing active revision isn't deactivated until the new revision is ready.

If ingress is enabled, the existing revision continues to receive 100% of the traffic until the new revision is ready.

A new revision is considered ready when:

- The revision has provisioned successfully
- The revision has scaled up to match the previous revisions replica count (respecting the new revision's min and max replica count)
- All the replicas have passed their startup and readiness probes 

In *multiple revision* mode, you can control when revisions are activated or deactivated and which revisions receive ingress traffic. If a [traffic splitting rule](./revisions-manage.md#traffic-splitting) is configured with `latestRevision` set to `true`, traffic doesn't switch to the latest revision until it's ready.

## Work with multiple revisions

While single revision mode is the default, sometimes you might want to have full control over how your revisions are managed.

Multiple revision mode gives you the flexibility to manage your revision manually. For instance, using multiple revision mode allows you to decide exactly how much traffic is allocated to each revision.

### Traffic splitting

The following diagram shows a container app with two revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions-traffic-split.png" alt-text="Azure Container Apps: Traffic splitting among revisions":::

This scenario presumes the container app is in the following state:

- [Ingress](ingress-how-to.md) is enabled, making the container app available via HTTP or TCP.
- The first revision was deployed as *Revision 1*.
- After the container was updated, a new revision was activated as *Revision 2*.
- [Traffic splitting](traffic-splitting.md) rules are configured so that *Revision 1* receives 80% of the requests, and *Revision 2* receives the remaining 20%.

### Direct revision access

Rather than using a routing rule to divert traffic to a revision, you might want to make a revision available to requests for a specific URL. Multiple revision mode can allow you to send all requests coming in to your domain to the latest revision, while requests for an older revision are available via [labels](#labels) for direct access.

### Activation state

In multiple revision mode, you can activate or deactivate revisions as needed. Active revisions are operational and can handle requests, while inactive revisions remain dormant.

Container Apps doesn't charge for inactive revisions. However, there's a cap on the total number of available revisions, with the oldest ones being purged once you exceed a count of 100.

## Change types

Changes to a container app fall under two categories: *revision-scope* or *application-scope* changes. *Revision-scope* changes trigger a new revision when you deploy your app, while *application-scope* changes don't.

### Revision-scope changes

A new revision is created when a container app is updated with *revision-scope* changes.  The changes are limited to the revision in which they're deployed, and don't affect other revisions.

A *revision-scope* change is any change to the parameters in the [`properties.template`](azure-resource-manager-api-spec.md#propertiestemplate) section of the container app resource template.

These parameters include:

- [Revision suffix](#name-suffix)
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

## Customize revisions

You can customize the revision name and labels to better align with your naming conventions or versioning strategy.

### Name suffix

Every revision in Container Apps is assigned a unique identifier. While names are automatically generated, you can personalize the revision name.

The typical format for a revision name is:

``` text
<CONTAINER_APP_NAME>-<REVISION_SUFFIX>
```

For example, if you have a container app named *album-api* and decide on the revision suffix *first-revision*, the complete revision name becomes *album-api-first-revision*.

A revision suffix name must:

- Consist of only lower case alphanumeric characters or dashes (`-`)
- Start with an alphabetic character
- End with an alphanumeric character

Names must not have:

- Two consecutive dashes (`--`)
- Be more than 64 characters

You can set the revision suffix in the [ARM template](azure-resource-manager-api-spec.md#propertiestemplate), through the Azure CLI `az containerapp create` and `az containerapp update` commands, or when creating a revision via the Azure portal.

## Use cases

The following are common use cases for using revisions in container apps. This list isn't an exhaustive list of the purpose or capabilities of using Container Apps revisions.

### Release management

Revisions streamline the process of introducing new versions of your app. When you're ready to roll out an update or a new feature, you can create a new revision without affecting the current live version. This approach ensures a smooth transition and minimizes disruptions for end-users.

### Reverting to previous versions

Sometimes you need to quickly revert to a previous, stable version of your app. You can roll back to a previous revision of your container app if necessary.

### A/B testing

When you want to test different versions of your app, revisions can support [A/B testing](https://wikipedia.org/wiki/A/B_testing). You can route a subset of your users to a new revision, gather feedback, and make informed decisions based on real-world data.

### Blue-green deployments

Revisions support the [blue-green deployment](blue-green-deployment.md) strategy. By having two parallel revisions (blue for the live version and green for the new one), you can gradually phase in a new revision. Once you're confident in the new version's stability and performance, you can switch traffic entirely to the green environment.

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)
