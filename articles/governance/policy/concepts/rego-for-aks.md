---
title: Learn Azure Policy for Azure Kubernetes Service
description: Learn how Azure Policy uses Rego and Open Policy Agent to manage clusters on Azure Kubernetes Service.
ms.date: 03/23/2020
ms.topic: conceptual
---
# Understand Azure Policy for Azure Kubernetes Service

Azure Policy integrates with the [Azure Kubernetes Service](../../../aks/intro-kubernetes.md) (AKS)
to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.
By extending use of [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) v3, an _admission
controller webhook_ for [Open Policy Agent](https://www.openpolicyagent.org/) (OPA), Azure Policy
makes it possible to manage and report on the compliance state of your Azure resources and AKS
clusters from one place.

> [!IMPORTANT]
> Azure Policy for AKS is in Preview and only supports built-in policy definitions. Built-in
> policies are in the **Kubernetes** category. The **EnforceRegoPolicy** effect and related
> **Kubernetes Service** category policies are being _deprecated_. Instead, use the updated
> [EnforceOPAConstraint](./effects.md#enforceopaconstraint) effect.

## Overview

To enable and use Azure Policy for AKS with your AKS cluster, take the following actions:

- [Opt-in for preview features](#opt-in-for-preview)
- [Install the Azure Policy Add-on](#installation-steps)
- [Assign a policy definition for AKS](#built-in-policies)
- [Wait for validation](#validation-and-reporting-frequency)

## Opt-in for preview

Before you install the Azure Policy Add-on or enabling any of the service features, your
subscription must enable the **Microsoft.ContainerService** resource provider and the
**Microsoft.PolicyInsights** resource provider, then get approved to join the preview. To join the
preview, follow these steps in either the Azure portal or with Azure CLI:

- Azure portal:

  1. Register the **Microsoft.ContainerService** and **Microsoft.PolicyInsights** resource
     providers. For steps, see
     [Resource providers and types](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal).

  1. Launch the Azure Policy service in the Azure portal by clicking **All services**, then
     searching for and selecting **Policy**.

     ![Search for Policy in All Services](../media/rego-for-aks/search-policy.png)

  1. Select **Join Preview** on the left side of the Azure Policy page.

     ![Join the Policy for AKS preview](../media/rego-for-aks/join-aks-preview.png)

  1. Select the row of the subscription you want added to the preview.

  1. Select the **Opt-in** button at the top of the list of subscriptions.

- Azure CLI:

  ```azurecli-interactive
  # Log in first with az login if you're not using Cloud Shell

  # Provider register: Register the Azure Kubernetes Service provider
  az provider register --namespace Microsoft.ContainerService

  # Provider register: Register the Azure Policy provider
  az provider register --namespace Microsoft.PolicyInsights

  # Feature register: enables installing the add-on
  az feature register --namespace Microsoft.ContainerService --name AKS-AzurePolicyAutoApprove
  
  # Use the following to confirm the feature has registered
  az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKS-AzurePolicyAutoApprove')].{Name:name,State:properties.state}"
  
  # Once the above shows 'Registered' run the following to propagate the update
  az provider register -n Microsoft.ContainerService
  
  ```

## Azure Policy Add-on

The _Azure Policy Add-on_ for Kubernetes connects the Azure Policy service to the Gatekeeper
admission controller. The add-on, which is installed into the _kube-system_ namespace, enacts the
following functions:

- Checks with Azure Policy service for assignments to the cluster.
- Deploys policies in the cluster as
  [constraint template](https://github.com/open-policy-agent/gatekeeper#constraint-templates) and
  [constraint](https://github.com/open-policy-agent/gatekeeper#constraints) custom resources.
- Reports auditing and compliance details back to Azure Policy service.

### Installing the add-on

#### Prerequisites

Before you install the add-on in your AKS cluster, the preview extension must be installed. This
step is done with Azure CLI:

1. If Gatekeeper v2 policies were installed, remove the add-on with the **Disable** button on your
   AKS cluster under the **Policies (preview)** page.

1. You need the Azure CLI version 2.0.62 or later installed and configured. Run `az --version` to
   find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

1. The AKS cluster must be version _1.14_ or higher. Use the following script to validate your AKS
   cluster version:

   ```azurecli-interactive
   # Log in first with az login if you're not using Cloud Shell

   # Look for the value in kubernetesVersion
   az aks list
   ```

1. Install version _0.4.0_ of the Azure CLI preview extension for AKS, `aks-preview`:

   ```azurecli-interactive
   # Log in first with az login if you're not using Cloud Shell

   # Install/update the preview extension
   az extension add --name aks-preview

   # Validate the version of the preview extension
   az extension show --name aks-preview --query [version]
   ```

   > [!NOTE]
   > If you've previously installed the _aks-preview_ extension, install any updates using the
   > `az extension update --name aks-preview` command.

#### Installation steps

Once the prerequisites are completed, install the Azure Policy Add-on in the AKS cluster you want to
manage.

- Azure portal

  1. Launch the AKS service in the Azure portal by clicking **All services**, then searching for and
     selecting **Kubernetes services**.

  1. Select one of your AKS clusters.

  1. Select **Policies (preview)** on the left side of the Kubernetes service page.

     ![Policies from the AKS cluster](../media/rego-for-aks/policies-preview-from-aks-cluster.png)

  1. In the main page, select the **Enable add-on** button.

     ![Enable the Azure Policy for AKS add-on](../media/rego-for-aks/enable-policy-add-on.png)

     > [!NOTE]
     > If the **Enable add-on** button is grayed out, the subscription has not yet been added to the
     > preview. See [Opt-in for preview](#opt-in-for-preview) for the required steps. If a
     > **Disable** button is available, Gatekeeper v2 is still installed and must be removed.

- Azure CLI

  ```azurecli-interactive
  # Log in first with az login if you're not using Cloud Shell

  az aks enable-addons --addons azure-policy --name MyAKSCluster --resource-group MyResourceGroup
  ```

### Validation and reporting frequency

The add-on checks in with Azure Policy service for changes in policy assignments every 15 minutes.
During this refresh cycle, the add-on checks for changes. These changes trigger creates, updates, or
deletes of the constraint templates and constraints.

> [!NOTE]
> While a cluster admin may have permission to create and update constraint templates and
> constraints resources, these are not supported scenarios as manual updates will be overwritten.

Every 15 minutes, the add-on calls for a full scan of the cluster. After gathering details of the
full scan and any real-time evaluations by Gatekeeper of attempted changes to the cluster, the
add-on reports the results back to Azure Policy service for inclusion in
[compliance details](../how-to/get-compliance-data.md#portal) like any Azure Policy assignment. Only
results for active policy assignments are returned during the audit cycle. Audit results can also be
seen as [violations](https://github.com/open-policy-agent/gatekeeper#audit) listed in the status
field of the failed constraint.

## Policy language

The Azure Policy language structure for managing Kubernetes follows that of existing policies. The
effect _EnforceOPAConstraint_ is used to manage your Kubernetes clusters and takes details
properties specific to working with
[OPA Constraint Framework](https://github.com/open-policy-agent/frameworks/tree/master/constraint)
and Gatekeeper v3. For details and examples, see the 
[EnforceOPAConstraint](./effects.md#enforceopaconstraint) effect.
  
As part of the _details.constraintTemplate_ and _details.constraint_ properties in the policy
definition, Azure Policy passes the URIs of these
[CustomResourceDefinitions](https://github.com/open-policy-agent/gatekeeper#constraint-templates)
(CRD) to the add-on. Rego is the language that OPA and Gatekeeper support to validate a request to
the Kubernetes cluster. By supporting an existing standard for Kubernetes management, Azure Policy
makes it possible to reuse existing rules and pair them with Azure Policy for a unified cloud
compliance reporting experience. For more information, see
[What is Rego?](https://www.openpolicyagent.org/docs/latest/policy-language/#what-is-rego).

## Built-in policies

To find the built-in policies for managing your cluster using the Azure portal, follow these steps:

1. Start the Azure Policy service in the Azure portal. Select All services in the left pane and then
   search for and select **Policy**.

1. In the left pane of the Azure Policy page, select **Definitions**.

1. From the Category drop-down list box, use Select all to clear the filter and then select
   **Kubernetes**.

1. Select the policy definition, then select the **Assign** button.

1. Set the **Scope** to the management group, subscription, or resource group of the Kubernetes
   cluster where the policy assignment will apply.

   > [!NOTE]
   > When assigning the Azure Policy for AKS definition, the **Scope** must include the AKS cluster
   > resource.

1. Give the policy assignment a **Name** and **Description** that you can use to identify it easily.

1. Set the [Policy enforcement](./assignment-structure.md#enforcement-mode) to one of the values
   below.

   - **Enabled** - Enforce the policy on the cluster. Kubernetes admission requests with violations
     are denied.
   
   - **Disabled** - Don't enforce the policy on the cluster. Kubernetes admission requests with
     violations aren't denied. Compliance assessment results are still available. When rolling out
     new policies to running clusters, _Disabled_ option is helpful for testing the policies as
     admission requests with violations aren't denied.

1. Select **Next**.

1. Set **parameter values**
   
   - To exclude Kubernetes namespaces from policy evaluation, specify the list of namespaces in
     parameter **Namespace exclusions**. It's recommended to exclude: _kube-system_

1. Select **Review + create**.

Alternately, use the [Assign a policy - Portal](../assign-policy-portal.md) quickstart to find and
assign an AKS policy. Search for a Kubernetes policy definition instead of the sample 'audit vms'.

> [!IMPORTANT]
> Built-in policies in category **Kubernetes** are only for use with AKS. For a list of built-in
> policies, see [../samples/built-in-policies.md#kubernetes]

## Logging

### Azure Policy Add-on logs

As a Kubernetes controller/container, both Azure Policy Add-on and Gatekeeper keep logs in the AKS
cluster. The logs are exposed in the **Insights** page of the AKS cluster. For more information, see
[Understand AKS cluster performance with Azure Monitor for containers](../../../azure-monitor/insights/container-insights-analyze.md).

## Remove the add-on

To remove the Azure Policy Add-on from your AKS cluster, use either the Azure portal or Azure CLI:

- Azure portal

  1. Launch the AKS service in the Azure portal by clicking **All services**, then searching for and
     selecting **Kubernetes services**.

  1. Select your AKS cluster where you want to disable the Azure Policy Add-on.

  1. Select **Policies (preview)** on the left side of the Kubernetes service page.

     ![Policies from the AKS cluster](../media/rego-for-aks/policies-preview-from-aks-cluster.png)

  1. In the main page, select the **Disable add-on** button.

     ![Disable the Azure Policy for AKS add-on](../media/rego-for-aks/disable-policy-add-on.png)

- Azure CLI

  ```azurecli-interactive
  # Log in first with az login if you're not using Cloud Shell

  az aks disable-addons --addons azure-policy --name MyAKSCluster --resource-group MyResourceGroup
  ```

## Diagnostic data collected by Azure Policy Add-on

The Azure Policy Add-on for Kubernetes collects limited cluster diagnostic data. This diagnostic
data is vital technical data related to software and performance. It's used in the following ways:

- Keep Azure Policy Add-on up to date
- Keep Azure Policy Add-on secure, reliable, performant
- Improve Azure Policy Add-on - through the aggregate analysis of the use of the add-on

The information collected by the add-on isn't personal data. The following details are currently
collected:

- Azure Policy Add-on agent version
- Cluster type
- Cluster region
- Cluster resource group
- Cluster resource ID
- Cluster subscription ID
- Cluster OS (Example: Linux)
- Cluster city (Example: Seattle)
- Cluster state or province (Example: Washington)
- Cluster country or region (Example: United States)
- Exceptions/errors encountered by Azure Policy Add-on during agent installation on policy
  evaluation
- Number of Gatekeeper policies not installed by Azure Policy Add-on

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Policy definition structure](definition-structure.md).
- Review [Understanding policy effects](effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
