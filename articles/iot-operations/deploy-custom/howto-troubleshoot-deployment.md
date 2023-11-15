---
title: Troubleshoot - Azure IoT Orchestrator
description: Guidance and suggested steps for troubleshooting an Orchestrator deployment of Azure IoT Operations components.
author: kgremban
ms.author: kgremban
# ms.subservice: orchestrator
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/02/2023

#CustomerIntent: As an IT professional, I want prepare an Azure-Arc enabled Kubernetes cluster so that I can deploy Azure IoT Operations to it.
---

# Troubleshoot Orchestrator deployments

If you need to troubleshoot a deployment, you can find error details in the Azure portal to understand which resources failed or succeeded and why.

1. In the [Azure portal](https://portal.azure.com), navigate to the resource group that contains your Arc-enabled cluster.

1. Select **Deployments** under **Settings** in the navigation menu.

1. If a deployment failed, select **Error details** to get more information about each individual resource in the deployment.

   ![Screenshot of error details for a failed deployment](./media/howto-troubleshoot-deployment/deployment-error-details.png)

## Resolve error codes

The following sections provide details about specific error codes that you might receive and steps to resolve them.

### Provider error codes

| Error code | Description | Steps to resolve |
| ---------- | ----------- | ---------------- |
| Bad config | Bad configuration | Update the config property in the provider component. |
| Init failed | Failed to initialize the provider | Verify that the provider properties are set correctly. Ensure that the provider's name, config type, config data, context, and inCluster properties are set correctly. |
| Not found | Component or object not found | Verify that the component you are referencing is named correctly. |
| Update failed | Failed to update the component | The troubleshooting steps for this error vary depending on the provider. Check the specific provider error codes in the following sections. |
| Delete failed | Failed to delete the component | The troubleshooting steps for this error vary depending on the provider. Check the specific provider error codes in the following sections. |

### Helm provider error codes

| Error code | Description | Steps to resolve |
| ---------- | ----------- | ---------------- |
| Helm action failed | The provider failed to create a Helm client | Check the Helm version for your setup.<br><br> Make sure that the Helm chart that you're using is valid and compatible with the Helm version that you're running.<br><br> Ensure that the repository is accessible and correctly added to helm by using the command `helm repo add`.<br><br> Update your Helm repository to ensure that you have the latest information about available charts by using the command `helm repo update`. |
| Validate failed | Failed to validate the rules for the Helm component | Set the required component types, properties, and metadata. |
| Create action config failed | Failed to initialize the action config | Check the Helm version for your setup.<br><br> Make sure that the Helm chart that you're using is valid and compatible with the Helm version that you're running.<br><br> Ensure that the repository is accessible and correctly added to helm by using the command `helm repo add`.<br><br> Update your Helm repository to ensure that you have the latest information about available charts by using the command `helm repo update`. |
| Get Helm property failed | Failed to get Helm property from the components | Check the Helm version and make sure that the version matches your setup.<br><br> Verify that the release name you provided matches the release that you want to inspect.<br><br> If the release is deployed in a specific component, pass the namespace property to that component by using the command `helm get values <RELEASE_NAME> --namespace <NAMESPACE>`. |
| Helm chart pull failed | The Helm client failed to pull the Helm chart from the repository | Ensure that the URL of the Helm chart repository is correct.<br><br> Verify your network connectivity.<br><br> Update your Helm repository by using the command `helm repo update`.<br><br> Ensure that the Helm chart that you're trying to pull exists in the repository.<br><br>Check your Helm version. |
| Helm chart load failed | The Helm client failed to load the Helm chart | Confirm that the Helm chart that you're trying to load is available by using the command `helm search repo <CHART_NAME>`.<br><br> Update your Helm repositories to ensure that you have the latest charts by using the command `helm repo update`.<br><br> Ensure that you're using the correct chart name. The chart name is case sensitive.<br><br> Specify the desired chart version to avoid incompatibility issues. |
| Helm chart apply failed | The Helm client failed to apply the Helm chart | Check the chart correctness by using the command `helm lint PATH [flags]`.<br><br> Check the correctness of the deployment configuration by using the command `helm install <CHART_NAME> --dry-run --debug`. |
| Helm chart uninstall failed | The Helm client failed to uninstall the Helm chart | Check the Helm version by using the command `helm version`.<br><br>Ensure that you're uninstalling the Helm chart from the correct namespace by using the command `helm uninstall <RELEASE_NAME? --namespace <NAMESPACE>`.<br><br> Verify that you're specifying the correct release name. The release name is case sensitive and must match the name of the release that you want to uninstall. |
| Bad config | Incorrect configuration settings for the Helm provider | Set the `inCluster` setting to a Boolean value. |

### Kubectl provider error codes

| Error code | Description | Steps to resolve |
| ---------- | ----------- | ---------------- |
| Get component spec failed | Failed to get the component specification | Check if the YAML or resource property is set for the component.<br><br> Check the YAML syntax and verify that there are no errors. |
| Validate failed | Failed to validate the component type, properties, or metadata | Set the required component types, properties, and metadata. |
| Read YAML failed | Failed to read the YAML data | Check your YAML file for any syntax errors. YAML is sensitive to indentation and formatting.<br><br> If you have a multi-document YAML file, ensure that they're separated by three hyphens (`---`). |
| Apply YAML failed | Failed to apply the custom resource | Check your YAML file for any syntax errors. YAML is sensitive to indentation and formatting.<br><br> Check the configuration file for the correct Kubernetes cluster. Use the command `kubectl config current-context` and verify that it's the expected cluster.<br><br> Check if the YAML file specifies any namespace in the `metadata.namespace` field. Ensure that the namespace exists or modify the YAML file to use the correct namespace. |
| Read resource property failed | Failed to convert the resource data to bytes | Check your YAML file for any syntax errors. YAML is sensitive to indentation and formatting.<br><br> Ensure that your kubectl is properly configured to connect to the correct Kubernetes cluster. Check the current context by using the command `kubectl config current-context`.<br><br> Ensure that the CRDs references in your YAML file are created first. |
| Apply resource failed | Failed to apply the custom resource | Check your YAML file for any syntax errors. YAML is sensitive to indentation and formatting.<br><br> Check the configuration file for the correct Kubernetes cluster. Use the command `kubectl config current-context` and verify that it's the expected cluster.<br><br> Check if the YAML file specifies any namespace in the `metadata.namespace` field. Ensure that the namespace exists or modify the YAML file to use the correct namespace.<br><br> Check if a resource with the same name already exists in the cluster. Consider using a different name for the resource. |
| Delete YAML failed | Failed to delete object from YAML property | Confirm that the YAML file that you're using for deletion already exists in the specific path.<br><br> Check if you have the necessary read permissions to access the YAML file.<br><br> Ensure that the resource definitions in your YAML file don't have dependencies on other resource that aren't created or applied yet.<br><br> Ensure that the resource names specified in the YAML file match the names of the existing resources in the cluster.<br><br> Use the `--dry-run` option with the `kubectl delete` command to test the delete operation without deleting the resource. |
| Delete resource failed | Failed to delete the custom resource | Confirm that the resource that you're using for deletion already exists.<br><br> Ensure that the resource definitions don't have dependencies on other resources that aren't created or applied yet.<br><br> Ensure that the resource names match the names of the existing resources in the cluster.<br><br> Use the `--dry-run` option with the `kubectl delete` command to test the delete operation without deleting the resource. |
| Check resource status failed | Failed to check the resource status within the timeout period | Verify that the name of the resource being used exists.<br><br> Check the cluster where the resource exists and pass that as a component property. |
| YAML or resource property not found | Component doesn't have a YAML or resource property | Set the YAML or resource property for the component. The kubectl provider requires at least one of the two property values to be defined.<br><br> Check the configuration setting for the correct property value. |
