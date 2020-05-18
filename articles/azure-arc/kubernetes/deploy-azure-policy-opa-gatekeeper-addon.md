# Use Azure Policy & OPA to enforce standardization within the cluster
The Azure Policy Add-on for Kubernetes connects the Azure Policy service to the [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper), a validating webhook that enforces Custom Resource Definitions based policies executed by Open Policy Agent, a policy engine for Cloud Native environments hosted by Cloud Native Computing Foundation as an incubation-level project.

The Azure Policy Add-on enacts the following functions:
- Checks with Azure Policy service for assignments to the cluster.
- Deploys policies in the cluster as [constraint template](https://github.com/open-policy-agent/gatekeeper#constraint-templates) and [constraint](https://github.com/open-policy-agent/gatekeeper#constraints) custom resources.
- Reports auditing and compliance details back to Azure Policy service.

# Overview
To enable and use Azure Policy Add-on on Azure Arc enabled Kubernetes clusters, take the following actions:
- [Prerequisites](#prerequisites)
- [Install the Azure Policy Add-on on cluster](#install-the-azure-policy-add-on-on-cluster)
- [Assign policy definition to the cluster](#assign-policy-definition-to-the-cluster)
- [View compliance of the cluster](#view-compliance-of-the-cluster)

## Prerequisites
- Make sure that your Kubernetes cluster is up and running, that you have a kubeconfig, and cluster-admin access.
- Kubernetes cluster version is **1.14 or higher**.
- [Install Helm 3](https://v3.helm.sh/docs/intro/install/).
- Install [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) or [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.5.0).
- [Kubernetes cluster onboarded to Azure Arc](../docs/02-connect-a-cluster.md).
- Fully Qualified Azure Resource Id of the Azure Arc enabled Kubernetes cluster.
- Permissions to create a service principal in the Azure Active Directory tenant of the subscription of the Azure Arc enabled Kubernetes Cluster.
- Permissions to do role assignment on the Azure Arc enabled Kubernetes Cluster scope using Azure role-based access control.
- The Azure Policy Add-on needs following outbound ports and domains to fetch policy definitions and assignments and to report compliance results to Azure Policy service.
    - gov-prod-policy-data.trafficmanager.net 443
    - raw.githubusercontent.com 443
    - login.windows.net 443
    - dc.services.visualstudio.com 443

## Install the Azure Policy Add-on on cluster
Once the prerequisites are completed, the Azure Policy Add-on can be installed by running the following steps.

1. Register **Microsoft.PolicyInsights** resource provider in your cluster's Azure subscription. Use either Azure CLI or Azure PowerShell command.
    #### Azure CLI
    ```bash
    # Log in first with az login if you're not using Cloud Shell.

    # Select your subscription. Replace <AzureSubscriptionId> below with your subscription Id.
    az account set -s <AzureSubscriptionId>

    # Register resource provider.
    az provider register --namespace 'Microsoft.PolicyInsights'
    ```
    #### Azure PowerShell
    ```powershell
    # Log in first with Connect-AzAccount if you're not using Cloud Shell.

    # Select your subscription. Replace <AzureSubscriptionId> below with your subscription Id.
    Select-AzSubscription -Subscription <AzureSubscriptionId>

    # Register resource provider.
    Register-AzResourceProvider -ProviderNamespace 'Microsoft.PolicyInsights'
    ```

1. The Azure Policy Add-on requires a service principal in order to communicate to Azure Policy service. Create a service principal and assign **Policy Insights Data Writer (Preview)** permissions on the Azure Arc enabled Kubernetes cluster scope. Use either Azure CLI or Azure PowerShell command.
    #### Azure CLI
    ```bash
    # Replace <AzureArcClusterResourceId> with your Azure Arc enabled Kubernetes cluster resource Id. For example: /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testRG/Microsoft.Kubernetes/connectedClusters/testCluster
    az ad sp create-for-rbac --role "Policy Insights Data Writer (Preview)" --scopes <AzureArcClusterResourceId>
    ```
    #### Azure PowerShell
    ```powershell
    # Run below two commands in PowerShell. In the first command, replace <AzureArcClusterResourceId> with your Azure Arc enabled Kubernetes cluster resource Id. For example: /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testRG/Microsoft.Kubernetes/connectedClusters/testCluster
    $sp = New-AzADServicePrincipal -Role "Policy Insights Data Writer (Preview)" -Scope <AzureArcClusterResourceId>

    @{ appId=$sp.ApplicationId;password=[System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp.Secret));tenant=(Get-AzContext).Tenant.Id } | ConvertTo-Json
    ```
    **Note _appId_, _password_ and _tenant_** values from the output of above commands. You need to use these values later in step #4 while installing the add-on using Helm Chart. Sample output for above commands looks like below. 
    ```bash
    {
        "appId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "password": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "tenant": "cccccccc-cccc-cccc-cccc-cccccccccccc"
    }
    ```

1. Add the Azure Policy Add-on repo to Helm.
    ```bash
    helm repo add azure-policy https://raw.githubusercontent.com/Azure/azure-policy/master/extensions/policy-addon-kubernetes/helm-charts
    ```

1. Install the Azure Policy Add-on and Gatekeeper using Helm Chart
    ```bash
    # In below command, replace...
    #    <AzureArcClusterResourceId> with your Azure Arc enabled Kubernetes cluster resource Id. For example: /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testRG/Microsoft.Kubernetes/connectedClusters/testCluster
    #    <ServicePrincipalAppId> with app Id of the service principal created in step #2 above.
    #    <ServicePrincipalPassword> with password of the service principal created in step #2 above.
    #    <ServicePrincipalTenantId> with tenant of the service principal created in step #2 above.
    helm install azure-policy-addon azure-policy/azure-policy-addon-arc-clusters \
        --set azurepolicy.env.resourceid=<AzureArcClusterResourceId> \
        --set azurepolicy.env.clientid=<ServicePrincipalAppId> \
        --set azurepolicy.env.clientsecret=<ServicePrincipalPassword> \
        --set azurepolicy.env.tenantid=<ServicePrincipalTenantId>
    ```
    For more information about what the add-on Helm Chart installs, see the [Azure Policy Add-on Helm Chart definition](https://github.com/Azure/azure-policy/tree/master/extensions/policy-addon-kubernetes/helm-charts) on GitHub.

To validate that the add-on installation was successful and that the **azure-policy** and **gatekeeper** pods are running, run the following commands.
```bash
# azure-policy pod is installed in kube-system namespace
kubectl get pods -n kube-system

# gatekeeper pod is installed in gatekeeper-system namespace
kubectl get pods -n gatekeeper-system
```

## Assign policy definition to the cluster
>**Important**  
>
>Azure Policy for Kubernetes is in Preview and only supports built-in policy definitions. Built-in policies are in the Kubernetes category. The policies in Kubernetes Service category and its related effect EnforceRegoPolicy are being deprecated. Instead, use the updated EnforceOPAConstraint effect.

To find the built-in policies for managing your cluster using the Azure portal, follow these steps:
1. Start the Azure Policy service in the Azure portal. Select All services in the left pane and then search for and select **Policy**.
1. In the left pane of the Azure Policy page, select **Definitions**.
1. From the Category drop-down list box, use Select all to clear the filter and then select **Kubernetes**.
1. Select the policy definition, then select the **Assign** button.
1. Set the **Scope** to the management group, subscription, or resource group of the Azure Arc enabled Kubernetes cluster where the policy assignment will apply.
1. Give the policy assignment a **Name** and **Description** that you can use to identify it easily.
1. Set the **[Policy enforcement](https://docs.microsoft.com/azure/governance/policy/concepts/assignment-structure#enforcement-mode)** to one of the values below.
    - **Enabled** - Enforce the policy on the cluster. Kubernetes admission requests with violations are denied.
    - **Disabled** - Do not enforce the policy on the cluster. Kubernetes admission requests with violations are not denied. Compliance assessment results are still available. When rolling out new policies to running clusters, *Disabled* option is helpful for testing the policies as admission requests with violations are not denied.
1. Click **Next**
1. Set **parameter values**
    - To exclude Kubernetes namespaces from policy evaluation, specify the list of namespaces in parameter **Namespace exclusions**. It's recommended to exclude: _kube-system;azure-arc_
1. Click **Review + create**

#### Policy language
The Azure Policy language structure for managing Kubernetes follows that of existing policies. The effect _EnforceOPAConstraint_ is used to manage your Kubernetes clusters and takes details properties specific to working with [OPA Constraint Framework](https://github.com/open-policy-agent/frameworks/tree/master/constraint) and Gatekeeper v3. For details and examples, see the [EnforceOPAConstraint](https://docs.microsoft.com/azure/governance/policy/concepts/effects#enforceopaconstraint) effect.  
  
As part of the _details.constraintTemplate_ and _details.constraint_ properties in the policy definition, Azure Policy passes the URIs of these [CustomResourceDefinitions](https://github.com/open-policy-agent/gatekeeper#constraint-templates) (CRD) to the add-on. Rego is the language that OPA and Gatekeeper support to validate a request to the Kubernetes cluster. By supporting an existing standard for Kubernetes management, Azure Policy makes it possible to reuse existing rules and pair them with Azure Policy for a unified cloud compliance reporting experience. For more information, see [What is Rego?](https://www.openpolicyagent.org/docs/latest/policy-language/#what-is-rego).

## View compliance of the cluster
The add-on checks in with Azure Policy service for changes in policy assignments every 15 minutes. During this refresh cycle, the add-on checks for changes. These changes trigger creates, updates, or deletes of the constraint templates and constraints.
>**Note**  
>  
>While a cluster admin may have permission to create and update constraint templates and constraints resources, these are not supported scenarios as manual updates will be overwritten.

Every 15 minutes, the add-on calls for a full scan of the cluster. After gathering details of the full scan and any real-time evaluations by Gatekeeper of attempted changes to the cluster, the add-on reports the results back to Azure Policy service for inclusion in [compliance details](https://docs.microsoft.com/azure/governance/policy/how-to/get-compliance-data#portal) like any Azure Policy assignment. Only results for active policy assignments are returned during the audit cycle. Audit results can also be seen as [violations](https://github.com/open-policy-agent/gatekeeper#audit) listed in the status field of the failed constraint.

# Uninstall the add-on
To remove the Azure Policy Add-on and Gatekeeper from your cluster, run below helm command.
```bash
helm uninstall azure-policy-addon
```

# Diagnostic data collected by Azure Policy Add-on
The Azure Policy Add-on for Kubernetes collects limited cluster diagnostic data. This diagnostic data is vital technical data related to software and performance. It's used in the following ways:
- Keep Azure Policy Add-on up-to-date
- Keep Azure Policy Add-on secure, reliable, performant
- Improve Azure Policy Add-on - through the aggregate analysis of the use of the add-on
The information collected by the add-on isn't personal data. The following details are currently collected:
    - Azure Policy Add-on agent version
    - Cluster resource
    - Cluster resource ID
    - Cluster subscription ID
    - Exceptions/errors encountered by Azure Policy Add-on during agent installation or policy evaluation
    - Number of Gatekeeper policies installed and not installed by Azure Policy Add-on
