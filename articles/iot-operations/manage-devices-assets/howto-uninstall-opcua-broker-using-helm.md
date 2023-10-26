---
title: Uninstall Azure IoT OPC UA Broker Preview
description: How to uninstall Azure IoT OPC UA Broker Preview using helm.
author: timlt
ms.author: timlt
# ms.subservice: opcua-broker
ms.topic: how-to 
ms.date: 10/24/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to uninstall OPC UA Broker
# from my environment, so that I have the option to remove it or to complete a new installation to resolve issues.
---

# Uninstall OPC UA Broker Preview using helm

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to uninstall the OPC UA Broker Preview by using helm.  This approach gives you a convenient option to either remove OPC UA Broker entirely, or to update your environment with a clean installation.  

For removal options, you can remove any or all of the following items:

- Individual assets
- Connections to OPC UA servers
- OPC UA Broker software

## Remove an asset definition
If you don't know the name of an asset you want to remove, confirm which assets are defined for a specific OPC UA Server. For each OPC UA Server endpoint connection, there's a separate namespace in which the assets are defined. 

To list all assets defined in a namespace, run a command like the following example:

# [bash](#tab/bash)

```bash
kubectl get assets.opcuabroker.iotoperations.azure.com --namespace opcuabroker
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl get assets.opcuabroker.iotoperations.azure.com --namespace opcuabroker
```
---

The command generates output like the following example:

```console
NAME                AGE
thermostat-sample   14d
```

To remove an asset, remove the asset definition that defines the asset by running the following command. In the code example, the command removes the `thermostat-sample` definition in the namespace `opcua`.

# [bash](#tab/bash)

```bash
kubectl delete assets.opcuabroker.iotoperations.azure.com thermostat-sample --namespace opcuabroker
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl delete assets.opcuabroker.iotoperations.azure.com thermostat-sample --namespace opcuabroker
```
---

### Remove an AssetType definition
After you remove all instances of an `AssetType`, you can remove the `AssetType` definition as well. The `AssetType` definitions are created in the same namespace as the assets. 

To list all defined `AssetType` definitions, run the following command:

# [bash](#tab/bash)

```bash
kubectl get assettypes.opcuabroker.iotoperations.azure.com --namespace opcuabroker
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl get assettypes.opcuabroker.iotoperations.azure.com --namespace opcuabroker
```
---

The command generates output like the following example:

```console
NAME                AGE
thermostat          20d
```

To remove an `AssetType`, remove the `AssetType` definition that defines the `AssetType`. Run the following command to remove the `AssetType` definition named `thermostat` in the namespace `opcua`:

# [bash](#tab/bash)

```bash
kubectl delete assettypes.opcuabroker.iotoperations.azure.com thermostat --namespace opcuabroker
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl delete assettypes.opcuabroker.iotoperations.azure.com thermostat --namespace opcuabroker
```
---

## Remove the connection to an OPC UA server
To connect OPC UA Broker to an OPC UA Server (endpoint), an instance of OPC UA Connector was previously deployed with a specific name. The OPC UA connector instance is named `aio-opcplc-connector` in the following example. If you deployed the OPC UA Connector instance with helm as shown in [Connect an OPC UA server](howto-connect-an-opcua-server.md), you can use helm to remove the OPC UA Connector.

To remove an OPC UA Connector, run a helm command as in the following example:

# [bash](#tab/bash)

```bash
helm uninstall aio-opcplc-connector -n opcuabroker --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm uninstall aio-opcplc-connector -n opcuabroker --wait
```
---

## Remove OPC UA Broker completely
To remove OPC UA Broker, first remove all OPC UA Connectors. In a previous step in the article [Connect an OPC UA server](howto-connect-an-opcua-server.md), you created an instance of the OPC UA Connector per OPC UA Server.

To remove the OPC UA Connector named `aio-opcplc-connector` that you added in the previous example, run the following command:

# [bash](#tab/bash)

```bash
helm uninstall aio-opcplc-connector -n opcuabroker --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm uninstall aio-opcplc-connector -n opcuabroker --wait
```
---

After you remove all OPC UA Connectors, you can remove the OPC UA Broker runtime.  To remove the OPC UA Broker runtime named `opcuabroker` in the previous example, run the following command:

# [bash](#tab/bash)

```bash
helm uninstall opcuabroker -n opcuabroker --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm uninstall opcuabroker -n opcuabroker --wait
```
---

The OPC UA Broker runtime uses Kubernetes custom resource definitions (CRDs) internally. The CRDs were installed using helm charts as shown in [Install OPC UA Broker](howto-install-opcua-broker-using-helm.md). However, CRDs can't be deleted using helm. CRDs are global resources.  If you delete them, all instances that use those CRDs are automatically removed.

> [!WARNING]
> The next step makes the OPC UA Broker runtime and all OPC UA Connectors unusable. Remove the OPC UA Broker and all OPC UA Connectors before you remove the CRDs. 

Run the following command to delete all CRDs that the OPC UA Broker uses:

# [bash](#tab/bash)

```bash
kubectl delete crd assets.opcuabroker.iotoperations.azure.com
kubectl delete crd assettypes.opcuabroker.iotoperations.azure.com
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl delete crd assets.opcuabroker.iotoperations.azure.com
kubectl delete crd assettypes.opcuabroker.iotoperations.azure.com
```
---


## Related content

- [Install Azure IoT OPC UA Broker](howto-install-opcua-broker-using-helm.md)