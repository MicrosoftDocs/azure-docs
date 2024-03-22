---
title: include file
description: include file
author: dominicbetts
ms.topic: include
ms.date: 12/18/2023
ms.author: dobett
---

Verify data is flowing to the MQTT broker by using the **mqttui** tool. In this example, you run the **mqttui** tool inside your Kubernetes cluster:

1. Run the following command to deploy a pod that includes the **mqttui** and **mosquitto** tools that are useful for interacting with the MQ broker in the cluster:

    ```console
    kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml
    ```

    The following snippet shows the YAML file that you applied:

    :::code language="yaml" source="~/azure-iot-operations-samples/samples/quickstarts/mqtt-client.yaml":::

    > [!CAUTION]
    > This configuration isn't secure. Don't use this configuration in a production environment.

1. When the **mqtt-client** pod is running, run the following command to create a shell environment in the pod you created:

    ```console
    kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh
    ```

1. At the shell in the **mqtt-client** pod, run the following command to connect to the MQ broker using the **mqttui** tool:

    ```console
    mqttui -b mqtts://aio-mq-dmqtt-frontend:8883 -u '$sat' --password $(cat /var/run/secrets/tokens/mq-sat) --insecure
    ```
