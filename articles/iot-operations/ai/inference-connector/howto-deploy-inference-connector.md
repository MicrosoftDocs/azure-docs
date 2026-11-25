---
title: Deploy the inference connector (preview)
description: Learn how to deploy the Azure IoT Operations inference connector as an application that serves Foundry Local and Azure Machine Learning models.
author: jkarangula
ms.author: jkarangula
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: how-to
ms.date: 10/08/2026
ai-usage: ai-assisted

#CustomerIntent: As an IT administrator, I want to deploy and configure the inference connector so that solution builders can run machine learning inference on data in Azure IoT Operations.
---

# Deploy the inference connector (preview)

This article shows you how to deploy the inference connector and configure it to serve a Foundry Local model on your cluster. It also shows you how to enable file-based payloads and add an Azure Machine Learning model.

You manage the connector as child resources of your Azure IoT Operations instance through Azure Resource Manager, using the same deployment workflow as other instance resources:

- An *application definition* identifies the reusable connector image and its application metadata.
- An *application configuration* under that definition specifies the per-deployment model endpoints, authentication, MQTT topics, and runtime settings, including secrets, trust bundles, and volume mounts. To change those settings, update and redeploy the configuration, rather than create a new definition.

Azure IoT Operations reconciles these resources to run the connector as a pod in the `azure-iot-operations` namespace and connect it to the MQTT broker. The examples use Bicep with `az deployment group create` to create or update the resources, and `az resource` to check their state.

[!INCLUDE [inference-connector-preview-note](../../includes/inference-connector-preview-note.md)]

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../../includes/prereq-deployed-instance.md)]

- An Azure IoT Operations preview version that includes Azure IoT Operations applications (preview). Generally available (GA) versions don't include them. To find the latest preview version, see [Azure IoT Operations versions](https://aka.ms/aio-versions). To install it, see [Upgrade to preview version](../../manage-iot-ops/howto-upgrade.md#upgrade-to-preview-version).

[!INCLUDE [prereq-azure-cli](../../includes/prereq-azure-cli.md)]

- `kubectl` access to your cluster, with permission to inspect and update trust-manager Bundles and read secrets in the `azure-iot-operations` namespace.

- A predictive model that Foundry Local hosts on the same cluster. To deploy one, see [Deploy Foundry Local as an Azure Arc extension](/azure/azure-sovereign-clouds/private/foundry-local/deploy-foundry-local-arc-extension) and [Deploy a bring-your-own model](/azure/azure-sovereign-clouds/private/foundry-local/how-to-deploy-custom-model).

- Foundry Local configured to accept the connector's token. The connector authenticates to Foundry Local with the Kubernetes service account token that Azure IoT Operations provides to it for the MQTT broker. Configure Foundry Local as follows:

    1. Set the `satAuth.audience` setting of Foundry Local to `aio-internal`, which is the audience of the token.
    1. In the `authenticationMethods` of the model deployment, authorize the connector's service account, `aioappcfg-inference-connector-sa` in the `azure-iot-operations` namespace. Azure IoT Operations creates this service account when you deploy the application configuration, and names it `aioappcfg-<CONFIGURATION_NAME>-sa`, where `<CONFIGURATION_NAME>` is the name of the application configuration: `inference-connector` in this article.

    To learn more, see [Configure Kubernetes service account token authentication](/azure/azure-sovereign-clouds/private/foundry-local/how-to-configure-service-account-token-authentication).

[!INCLUDE [set-environment-variables](../../includes/set-environment-variables.md)]

Also set the following variables:

- `MODEL_DEPLOYMENT_NAME` and `MODEL_NAMESPACE` identify your Foundry Local model deployment, for example `object-detection-cpu` in the `foundry-local-operator` namespace. To list the model deployments, run `kubectl get modeldeployments --all-namespaces`.
- `FOUNDRY_LOCAL_TRUST_BUNDLE` is the name of Foundry Local's trust bundle, which contains its root certificate authority (CA) certificate. To list the trust bundles on your cluster, run `kubectl get bundles`.
- `CUSTOM_LOCATION_NAME` is the name of the custom location of your Azure IoT Operations instance. The command gets it for you.
- `APP_ID` is the resource ID of the application definition that you create in this article.

```bash
MODEL_DEPLOYMENT_NAME=<model-deployment-name>
MODEL_NAMESPACE=<model-deployment-namespace>
FOUNDRY_LOCAL_TRUST_BUNDLE=<foundry-local-trust-bundle-name>
CUSTOM_LOCATION_NAME=$(az iot ops show --name $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --query "extendedLocation.name" --output tsv | awk -F'/' '{print $NF}')
APP_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.IoTOperations/instances/$AIO_INSTANCE_NAME/aioApplicationDefinitions/inference-connector"
```

## Prepare the model endpoint

The connector authenticates to the model deployment by using a Kubernetes service account token (SAT) that Azure IoT Operations provides. It validates the endpoint's TLS certificate by using the Foundry Local root certificate authority (CA) certificate.

1. Set the endpoint URL for the model deployment. Foundry Local serves each model deployment through a Kubernetes service that uses the same name as the deployment, on port 5000:

    ```bash
    MODEL_ENDPOINT="https://$MODEL_DEPLOYMENT_NAME.$MODEL_NAMESPACE.svc.cluster.local:5000"
    kubectl get service $MODEL_DEPLOYMENT_NAME -n $MODEL_NAMESPACE
    ```

    The output shows the service with the port `5000/TCP`. The URL looks like `https://object-detection-cpu.foundry-local-operator.svc.cluster.local:5000`.

1. Check that Foundry Local's trust bundle is available as a secret, with a `ca.crt` key, in the `azure-iot-operations` namespace. The command prints `ca.crt` if the key exists:

    ```bash
    kubectl get secret $FOUNDRY_LOCAL_TRUST_BUNDLE -n azure-iot-operations -o jsonpath='{.data}' | grep -o 'ca\.crt'
    ```

    If the command prints nothing, configure trust-manager to publish the secret:

    1. Enable secret targets on the `cert-manager` extension that Azure IoT Operations installs by default:

        ```azurecli
        az k8s-extension update \
          --cluster-name $CLUSTER_NAME \
          --resource-group $RESOURCE_GROUP \
          --cluster-type connectedClusters \
          --name cert-manager \
          --configuration-settings trust-manager.secretTargets.enabled=true trust-manager.secretTargets.authorizedSecretsAll=true \
          --yes
        ```

    1. Inspect the bundle's targets. The output shows whether the bundle has a `secret` target and which namespaces its `namespaceSelector` selects:

        ```bash
        kubectl get bundle $FOUNDRY_LOCAL_TRUST_BUNDLE -o jsonpath='{.spec.target}'
        ```

    1. If the output has no `secret` target, add one with the `ca.crt` key. The patch keeps the bundle's other settings:

        ```bash
        kubectl patch bundle $FOUNDRY_LOCAL_TRUST_BUNDLE --type=merge -p '{"spec":{"target":{"secret":{"key":"ca.crt"}}}}'
        ```

    1. If the `namespaceSelector` selects namespaces by label, add a matching label to the `azure-iot-operations` namespace by using `kubectl label namespace`.

    1. Run the check command again. It prints `ca.crt` after trust-manager publishes the secret.

    To learn more, see [Configure TLS for Foundry Local](/azure/azure-sovereign-clouds/private/foundry-local/how-to-configure-tls-authentication).

## Create the application definition

1. Save the following Bicep file as `inference-connector-definition.bicep`. The file uses version `0.1.2` of the connector image, `mcr.microsoft.com/azureiotoperations/inference-connector:0.1.2`, which is also the application's metadata reference:

    ```bicep
    param aioInstanceName string
    param customLocationName string
    param applicationName string = 'inference-connector'
    param imageRegistry string = 'mcr.microsoft.com'
    param imageName string = 'azureiotoperations/inference-connector'
    param imageTag string = '0.1.2'
    param applicationMetadataRef string = '${imageRegistry}/${imageName}:${imageTag}'

    resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
      name: customLocationName
    }

    resource aioInstance 'Microsoft.IoTOperations/instances@2026-09-03-preview' existing = {
      name: aioInstanceName
    }

    resource applicationDefinition 'Microsoft.IoTOperations/instances/aioApplicationDefinitions@2026-09-03-preview' = {
      parent: aioInstance
      name: applicationName
      extendedLocation: {
        type: 'CustomLocation'
        name: customLocation.id
      }
      properties: {
        applicationSource: 'UserDefined'
        applicationType: 'AioApplication'
        applicationMetadataRef: applicationMetadataRef
        imageDetails: {
          imageName: imageName
          registrySettings: {
            registrySettingsType: 'ContainerRegistry'
            containerRegistrySettings: {
              registry: imageRegistry
            }
          }
          tagDigestSettings: {
            tagDigestType: 'Tag'
            tag: imageTag
          }
        }
        resources: {
          requests: {
            cpu: '100m'
            memory: '100Mi'
          }
        }
      }
    }
    ```

    The definition also reserves 100 millicores of CPU and 100 MiB of memory for the connector.

1. Deploy the Bicep file:

    ```azurecli
    az deployment group create \
      --resource-group $RESOURCE_GROUP \
      --name inference-connector-definition \
      --template-file inference-connector-definition.bicep \
      --parameters aioInstanceName=$AIO_INSTANCE_NAME customLocationName=$CUSTOM_LOCATION_NAME
    ```

    Bicep might show warning BCP081 because the preview resource types don't have type definitions yet. You can ignore this warning.

1. Wait until the application definition is ready. Run the following command until it prints `Succeeded`. Until then, deployments of the application configuration fail.

    ```azurecli
    az resource show --ids $APP_ID --api-version 2026-09-03-preview --query properties.provisioningState --output tsv
    ```

## Create the application configuration

The following Bicep file configures the connector to serve one Foundry Local model. The model accepts MQTT requests on the `inference/<MODEL_NAME>/request` topic, publishes results to `inference/<MODEL_NAME>/response`, and serves commands from data flow graphs. The connector authenticates with the token that Azure IoT Operations provides for the MQTT broker, and validates the endpoint's certificate with the CA certificate in the `ca.crt` key of Foundry Local's trust bundle.

The resource's `properties` object is the same application configuration shown as JSON in the [configuration reference](reference-inference-connector-configuration.md#configuration-structure). The `configuration` section contains the connector's model settings, `runtimeConfiguration` tells Azure IoT Operations how to run it and which resources to mount. The JSON reference isn't a separate configuration file or management system.

1. Save the following Bicep file as `inference-connector-configuration.bicep`:

    ```bicep
    param aioInstanceName string
    param customLocationName string
    param applicationName string = 'inference-connector'
    param modelName string
    param modelEndpoint string
    param trustBundleName string

    resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
      name: customLocationName
    }

    resource aioInstance 'Microsoft.IoTOperations/instances@2026-09-03-preview' existing = {
      name: aioInstanceName
    }

    resource applicationDefinition 'Microsoft.IoTOperations/instances/aioApplicationDefinitions@2026-09-03-preview' existing = {
      parent: aioInstance
      name: applicationName
    }

    resource applicationConfiguration 'Microsoft.IoTOperations/instances/aioApplicationDefinitions/aioApplicationConfigurations@2026-09-03-preview' = {
      parent: applicationDefinition
      name: applicationName
      extendedLocation: {
        type: 'CustomLocation'
        name: customLocation.id
      }
      properties: {
        configuration: {
          models: [
            {
              name: modelName
              'inference-provider': 'FoundryLocal'
              'http-endpoint': modelEndpoint
              'fl-client-max-retries': 3
              auth: {
                // Token that Azure IoT Operations provides for the MQTT broker (audience aio-internal)
                sat: {}
              }
              'trust-bundle': {
                'trust-settings-key': 'ca.crt'
              }
              'pub-sub': {
                'source-topics': [
                  {
                    'source-topic': 'inference/${modelName}/request'
                  }
                ]
                'target-topic': 'inference/${modelName}/response'
                'correlation-key': 'correlation-id'
                'worker-count': 2
              }
              mrpc: {
                'worker-count': 2
              }
            }
          ]
        }
        runtimeConfiguration: {
          runtimeConfigurationType: 'ImageConfiguration'
          imageConfigurationSettings: {
            replicas: 1
            imagePullPolicy: 'IfNotPresent'
            trustSettings: {
              trustListSecretRef: trustBundleName
            }
          }
        }
      }
    }
    ```

    For a description of each setting, see [Inference connector configuration reference](reference-inference-connector-configuration.md).

1. Deploy the Bicep file. The model name, `object-detection` in this example, identifies the model in MQTT topics, commands, logs, and metrics. It can't contain the `/`, `+`, or `#` characters.

    ```azurecli
    az deployment group create \
      --resource-group $RESOURCE_GROUP \
      --name inference-connector-configuration \
      --template-file inference-connector-configuration.bicep \
      --parameters aioInstanceName=$AIO_INSTANCE_NAME customLocationName=$CUSTOM_LOCATION_NAME \
        modelName=object-detection modelEndpoint=$MODEL_ENDPOINT trustBundleName=$FOUNDRY_LOCAL_TRUST_BUNDLE
    ```

## Verify the deployment

1. Check that the provisioning state of the application configuration is `Succeeded`.

    ```azurecli
    az resource show --ids $APP_ID/aioApplicationConfigurations/inference-connector --api-version 2026-09-03-preview --query properties.provisioningState --output tsv
    ```

1. Check that the connector pod is running, and review its logs. The status of the pod is `Running`. At startup, the connector logs the configuration that it loaded and the topics that it subscribes to:

    ```bash
    kubectl get pods -n azure-iot-operations -l akri.iotoperations.azure.com/aio-application-configuration=inference-connector
    kubectl logs -n azure-iot-operations -l akri.iotoperations.azure.com/aio-application-configuration=inference-connector --tail=100
    ```

    If the pod restarts repeatedly, see [Troubleshoot the inference connector](troubleshoot-inference-connector.md).

The connector doesn't call the model until it receives a request. To test inference end to end, see [Send a test request](howto-inference-connector-mqtt.md#send-a-test-request).

## Enable file-based payloads

To keep large inputs, such as images, out of the MQTT broker, producers can write input files to a shared volume and publish only the path of each file.

> [!NOTE]
> File-based requests keep large payloads out of MQTT messages, but the inference connector still loads entire input files and model responses into memory. Large files or multiple requests processed at the same time can exhaust container memory and cause the connector to restart. Adjust file sizes, `worker-count`, and container memory limits for your workload.

1. Create a persistent volume claim (PVC) in the `azure-iot-operations` namespace. The following example uses the `unbacked-sc` storage class of [Local Shared Edge Volumes](/azure/azure-arc/container-storage/howto-configure-local-shared-edge-volumes) in Azure Container Storage enabled by Azure Arc, which supports the `ReadWriteMany` access mode. To use another storage class, change `storageClassName`:

    > [!NOTE]
    > On a multinode cluster, the producers and the connector can run on different nodes, so the volume must support the `ReadWriteMany` access mode. [Deploy Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/howto-install-edge-volumes), or use your own storage class that supports `ReadWriteMany`.

    ```bash
    kubectl apply -f - <<'EOF'
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: inference-data
      namespace: azure-iot-operations
    spec:
      accessModes:
        - ReadWriteMany
      resources:
        requests:
          storage: 2Gi
      storageClassName: unbacked-sc
    EOF
    ```

1. In `inference-connector-configuration.bicep`, mount the PVC at `/data` by adding the following setting to `imageConfigurationSettings`:

    ```bicep
    persistentVolumeClaims: [
      {
        claimName: 'inference-data'
        mountPath: '/data'
      }
    ]
    ```

1. In the model entry, add a source topic for file-based requests, and a `data-volume` that refers to the volume by its mount path:

    ```bicep
    'pub-sub': {
      'source-topics': [
        {
          'source-topic': 'inference/${modelName}/request'
        }
        {
          'source-topic': 'inference/${modelName}/request-file'
          'read-request-from-disk': true
        }
      ]
      'target-topic': 'inference/${modelName}/response'
      'correlation-key': 'correlation-id'
      'worker-count': 2
    }
    'data-volume': {
      'mount-path': '/data'
      'read-sub-path': 'requests'
    }
    ```

    The connector now treats the payload of each message on `inference/<MODEL_NAME>/request-file` as a file path relative to the `requests` folder of the volume. To also write results to files, add `'write-sub-path': 'responses'` to `data-volume`, and `'write-response-to-disk': true` to the model entry. The connector creates the `responses` folder if it doesn't exist.

1. Deploy the updated Bicep file with the same command as before.

Producers write their input files to the `requests` folder on the volume. The connector doesn't create this folder, so file-based requests fail until a producer creates it. To copy a test file to the volume and send a request, see [Send file-based requests](howto-inference-connector-mqtt.md#send-file-based-requests).

## Add an Azure Machine Learning model

The connector can also serve a model from an [Azure Machine Learning online endpoint](/azure/machine-learning/concept-endpoints-online) that your cluster can reach, such as a Kubernetes online endpoint on the same cluster. The connector posts the input data as the request body to the scoring URI, with the content type of the request, so the scoring script must accept that format.

1. Get the scoring URI of the endpoint. For a Kubernetes online endpoint on the same cluster, use the in-cluster address of the Azure Machine Learning inference router, `https://azureml-fe.azureml.svc.cluster.local/api/v1/endpoint/<ENDPOINT_NAME>/score`. For other endpoints, run the following command:

    ```azurecli
    az ml online-endpoint show --name <ENDPOINT_NAME> --resource-group <ML_RESOURCE_GROUP> --workspace-name <WORKSPACE_NAME> --query scoring_uri --output tsv
    ```

1. Get the certificate of the CA that issued the TLS certificate of the endpoint, and save it to a file. The connector uses the certificate to validate the endpoint. For a Kubernetes online endpoint, use the CA of the certificate that you configured for the inference router with `sslCertPemFile`. To learn more, see [Review Azure Machine Learning extension configuration settings](/azure/machine-learning/how-to-deploy-kubernetes-extension#review-azure-machine-learning-extension-configuration-settings).


1. Store the primary key of the endpoint and the CA certificate in secrets in the `azure-iot-operations` namespace.

    Create the secrets before you deploy the updated configuration. If a secret is missing, the connector can't start, and stops serving all its models.

1. In `inference-connector-configuration.bicep`, add the following `secrets` list to `imageConfigurationSettings`. Keep `trustSettings` for Foundry Local's trust bundle. The trust list mounts only one secret, so mount the endpoint's CA certificate through `secrets`. Model settings refer to each entry by its `secretAlias`:

    ```bicep
    secrets: [
      {
        secretAlias: 'aml-endpoint-key'
        secretRef: '<ENDPOINT_NAME>-key'
        secretKey: 'api-key'
      }
      {
        secretAlias: 'aml-endpoint-ca'
        secretRef: '<ENDPOINT_NAME>-ca'
        secretKey: 'ca.crt'
      }
    ]
    ```

1. Add a model entry with its own topics, key, and CA certificate to the `models` list. Replace `<AML_MODEL_NAME>` with a name for the model in the connector, such as `defect-detection`, and `<SCORING_URI>` with the scoring URI from the first step:

    ```bicep
    {
      name: '<AML_MODEL_NAME>'
      'inference-provider': 'AmlStudio'
      'http-endpoint': '<SCORING_URI>'
      'fl-client-max-retries': 3
      auth: {
        key: {
          'secret-alias': 'aml-endpoint-key'
        }
      }
      'trust-bundle': {
        'secret-alias': 'aml-endpoint-ca'
      }
      'pub-sub': {
        'source-topics': [
          {
            'source-topic': 'inference/<AML_MODEL_NAME>/request'
          }
        ]
        'target-topic': 'inference/<AML_MODEL_NAME>/response'
        'correlation-key': 'correlation-id'
      }
    }
    ```

    To also use the model from data flow graphs, add `mrpc: {}` to the model entry.

1. Deploy the updated Bicep file with the same command as before.

To authenticate with an Azure Machine Learning token instead of a key, see [Authentication settings](reference-inference-connector-configuration.md#authentication-settings).

## Update the configuration

To change models or runtime settings, edit `inference-connector-configuration.bicep` and deploy it again. Azure IoT Operations restarts the connector with the new configuration.

To rotate a credential that you store in a secret, such as an Azure Machine Learning endpoint key, update the secret. The connector picks up the new value without a redeployment or a restart.


## Remove the inference connector

Delete the application configuration, and then the application definition:

```azurecli
az resource delete --ids $APP_ID/aioApplicationConfigurations/inference-connector --api-version 2026-09-03-preview
az resource delete --ids $APP_ID --api-version 2026-09-03-preview
```

If you created secrets or a persistent volume claim for the connector, and no other workload uses them, delete them too. For example:

```bash
kubectl delete pvc inference-data -n azure-iot-operations
```

## Related content

- [Send inference requests over MQTT](howto-inference-connector-mqtt.md)
- [Run inference in a data flow graph](howto-inference-connector-dataflow-graph.md)
- [Inference connector configuration reference](reference-inference-connector-configuration.md)
- [Troubleshoot the inference connector](troubleshoot-inference-connector.md)
