---
title: 'Online endpoints YAML reference'
titleSuffix: Azure Machine Learning
description: Learn about the YAML files used to deploy models as online endpoints
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: how-to
ms.custom: cliv2, event-tier1-build-2022

author: dem108
ms.author: sehan
ms.date: 11/15/2023
ms.reviewer: mopeakande
reviewer: msakande
---

# CLI (v2) online endpoint YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json for managed online endpoint, and at https://azuremlschemas.azureedge.net/latest/kubernetesOnlineEndpoint.schema.json for Kubernetes online endpoint. The differences between managed online endpoint and Kubernetes online endpoint are described in the table of properties in this article. Sample in this article focuses on managed online endpoint.

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

> [!NOTE]
> A fully specified sample YAML for managed online endpoints is available for [reference](https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.template.yaml)

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `name` | string | **Required.** Name of the endpoint. Needs to be unique at the Azure region level. <br><br> Naming rules are defined under [managed online endpoint limits](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints).| | |
| `description` | string | Description of the endpoint. | | |
| `tags` | object | Dictionary of tags for the endpoint. | | |
| `auth_mode` | string | The authentication method for the endpoint. Key-based authentication and Azure Machine Learning token-based authentication are supported. Key-based authentication doesn't expire but Azure Machine Learning token-based authentication does. | `key`, `aml_token` | `key` |
| `compute` | string | Name of the compute target to run the endpoint deployments on. This field is only applicable for endpoint deployments to Azure Arc-enabled Kubernetes clusters (the compute target specified in this field must have `type: kubernetes`). Don't specify this field if you're doing managed online inference. | | |
| `identity` | object | The managed identity configuration for accessing Azure resources for endpoint provisioning and inference. | | |
| `identity.type` | string | The type of managed identity. If the type is `user_assigned`, the `identity.user_assigned_identities` property must also be specified. | `system_assigned`, `user_assigned` | |
| `identity.user_assigned_identities` | array | List of fully qualified resource IDs of the user-assigned identities. | | |
| `traffic` | object | Traffic represents the percentage of requests to be served by different deployments. It's represented by a dictionary of key-value pairs, where keys represent the deployment name and value represent the percentage of traffic to that deployment. For example, `blue: 90 green: 10` means 90% requests are sent to the deployment named `blue` and 10% is sent to deployment `green`. Total traffic has to either be 0 or sum up to 100. See [Safe rollout for online endpoints](how-to-safely-rollout-online-endpoints.md) to see the traffic configuration in action. <br><br> Note: you can't set this field during online endpoint creation, as the deployments under that endpoint must be created before traffic can be set. You can update the traffic for an online endpoint after the deployments have been created using `az ml online-endpoint update`; for example, `az ml online-endpoint update --name <endpoint_name> --traffic "blue=90 green=10"`. | | |
| `public_network_access` | string | This flag controls the visibility of the managed endpoint. When `disabled`, inbound scoring requests are received using the [private endpoint of the Azure Machine Learning workspace](how-to-configure-private-link.md) and the endpoint can't be reached from public networks. This flag is applicable only for managed endpoints | `enabled`, `disabled` | `enabled` |
| `mirror_traffic` | string | Percentage of live traffic to mirror to a deployment. Mirroring traffic doesn't change the results returned to clients. The mirrored percentage of traffic is copied and submitted to the specified deployment so you can gather metrics and logging without impacting clients. For example, to check if latency is within acceptable bounds and that there are no HTTP errors. It's represented by a dictionary with a single key-value pair, where the key represents the deployment name and the value represents the percentage of traffic to mirror to the deployment. For more information, see [Test a deployment with mirrored traffic](how-to-safely-rollout-online-endpoints.md#test-the-deployment-with-mirrored-traffic).

## Remarks

The `az ml online-endpoint` commands can be used for managing Azure Machine Learning online endpoints.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online). Several are shown below.

## YAML: basic

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/sample/endpoint.yml":::

## YAML: system-assigned identity

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/managed-identities/1-sai-create-endpoint.yml":::

## YAML: user-assigned identity

:::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/managed/managed-identities/1-uai-create-endpoint.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- Learn how to [deploy a model with a managed online endpoint](how-to-deploy-online-endpoints.md)
- [Troubleshooting managed online endpoints deployment and scoring (preview)](./how-to-troubleshoot-online-endpoints.md)
