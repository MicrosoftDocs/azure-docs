---
title: Install Azure IoT OPC UA Broker
description: How to install Azure IoT OPC UA Broker using helm
author: timlt
ms.author: timlt
# ms.subservice: opcua-broker
ms.topic: how-to 
ms.date: 10/23/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to to install OPC UA Broker
# in standalone mode. This lets my OPC UA assets exchange data with my cluster and the cloud. 
---

# Install Azure IoT OPC UA Broker (preview) by using helm

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

By using OPC UA Broker, you can manage the OPC UA assets that are part of your solution. This article shows you how to install OPC UA Broker in standalone mode. Running in standalone mode gives you the option to install other third party components and to manage assets without using the full Azure IoT Operations platform.


## Prerequisites

- An installed Kubernetes environment. 
- An [MQTT v5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html) compliant broker as your  messaging infrastructure. To install an MQTT broker, we recommend the steps described in [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md). The deployment process sets up Azure IoT MQ (preview), an MQTT broker.  
- A certificate manager for SSL certificate management.  The admission controller requires SSL communication.  If you previously followed the steps described in [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md), a certificate manager is installed with Azure IoT Operations. 
- Optionally, an installation of Akri if you want to autodetect OPC UA assets. If you previously followed the steps described in [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md), the commercial version of Akri called Azure IoT Akri (preview) is installed with Azure IoT Operations. To install the open source Akri, follow the Akri [installation instructions](https://docs.akri.sh/user-guide/getting-started).

## Features supported

The following features are supported for installing OPC UA Broker: 

| Feature                              | Supported | Symbol      |
| ------------------------------------ | --------- | :---------: |
| Anonymous authentication             | Supported | ``✅`` |
| Server Account Token authentication  | Supported | ``✅`` |
| AMD64 Support                        | Supported | ``✅`` |
| ARM64 Support                        | Supported | ``✅`` |

## Install OPC UA Broker

 OPC UA Broker is packaged as a [helm](https://helm.sh) chart. You can use a helm command to deploy OPC UA Broker and related Custom Resource Definitions to a Kubernetes cluster.  Another option is to deploy  OPC UA Broker via the Azure CLI k8s-extension to an Arc enabled Kubernetes cluster.

 OPC UA Broker uses a multi-architecture container, which contains AMD64 and ARM64 images that use the same tag.

### Use OPC UA Broker with Azure IoT MQ

If you installed Azure IoT Operations as shown in the prerequisites, the setup installed Azure IoT MQ.  The setup also included Service Account Token (SAT) access. 

Use the following helm command to deploy OPC UA Broker to your Kubernetes cluster:

#### [bash](#tab/bash)

  ```bash
  helm upgrade -i opcuabroker oci://{{% oub-registry %}}/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker \
      --set image.registry={{% oub-registry %}} \
      --version {{% oub-version %}} \
      --namespace opcuabroker \
      --create-namespace \
      --set secrets.kind=k8s \
      --set mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.default:1883 \
      --set opcPlcSimulation.deploy=true \
      --wait
  ```

#### [Azure PowerShell](#tab/azure-powershell)

  ```azurepowershell
  helm upgrade -i opcuabroker oci://{{% oub-registry %}}/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker `
      --set image.registry={{% oub-registry %}} `
      --version {{% oub-version %}} `
      --namespace opcuabroker `
      --create-namespace `
      --set secrets.kind=k8s `
      --set mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.default:1883 `
      --set opcPlcSimulation.deploy=true `
      --wait
  ```
If you installed MQ into a different namespace than `default`, specify the corresponding address of MQTT broker by adding the following line to the previous statement.

#### [bash](#tab/bash)

  `--set mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.<your-aio-mq-namespace>:1883 \`

#### [Azure PowerShell](#tab/azure-powershell)

  ```--set mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.<your-aio-mq-namespace>:1883 ```

If MQ is configured with a specific audience for SAT-based authentication via `spec.authenticationMethods[].sat.audiences[]` of `BrokerAuthentication` custom resource, then the same audience should be set for {{% oub-product-name %}} via `mqttBroker.serviceAccountTokenAudience`. You can find more details on using SAT-based authentication with MQ at [Configure Azure IoT MQ authentication](../administer/howto-configure-authentication.md).
The original deployment of OPC UA Broker from above can be modified to set SAT audience, here for `aio-mq` audience:

<!-- 4. Task H2s ------------------------------------------------------------------------------

Required: Multiple procedures should be organized in H2 level sections. A section contains a major grouping of steps that help users complete a task. Each section is represented as an H2 in the article.

For portal-based procedures, minimize bullets and numbering.

* Each H2 should be a major step in the task.
* Phrase each H2 title as "<verb> * <noun>" to describe what they'll do in the step.
* Don't start with a gerund.
* Don't number the H2s.
* Begin each H2 with a brief explanation for context.
* Provide a ordered list of procedural steps.
* Provide a code block, diagram, or screenshot if appropriate
* An image, code block, or other graphical element comes after numbered step it illustrates.
* If necessary, optional groups of steps can be added into a section.
* If necessary, alternative groups of steps can be added into a section.

-->

## Task 1
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3

## Task 2
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3

## Task 3
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3

<!-- 5. Next step/Related content------------------------------------------------------------------------

Optional: You have two options for manually curated links in this pattern: Next step and Related content. You don't have to use either, but don't use both.
  - For Next step, provide one link to the next step in a sequence. Use the blue box format
  - For Related content provide 1-3 links. Include some context so the customer can determine why they would click the link. Add a context sentence for the following links.

-->

## Next step

TODO: Add your next step link(s)


<!-- OR -->

## Related content

TODO: Add your next step link(s)


<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->