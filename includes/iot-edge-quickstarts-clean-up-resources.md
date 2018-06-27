---
title: include file
description: include file
services: iot-edge
author: wesmc7777
ms.service: iot-edge
ms.topic: include
ms.date: 06/26/2018
ms.author: wesmc
ms.custom: include file
---


If you will be continuing to the next recommended article, you can keep the resources and configurations you've already created and reuse them.

Otherwise, you can delete the local configurations and the Azure resources created in this article to avoid charges. 

> [!IMPORTANT]
> Deleting Azure resources and resource group is irreversible. Once deleted, the resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the IoT Hub inside an existing resource group that contains resources you want to keep, only delete the IoT Hub resource itself instead of deleting the resource group.
>

To delete only the IoT Hub execute the following command using your hub name and resource group name:

```azurecli-interactive
az iot hub delete --name MyIoTHub --resource-group IoTEdge
```


To delete a resource group by name:

1. Sign in to the [Azure portal](https://portal.azure.com) and click **Resource groups**.

2. In the **Filter by name...** textbox, type the name of the resource group containing your IoT Hub. 

3. To the right of your resource group in the result list, click **...** then **Delete resource group**.

    ![Delete](./media/iot-edge-quickstarts-clean-up-resources/iot-edge-delete-resource-group.png)

4. You will be asked to confirm the deletion of the resource group. Type the name of your resource group again to confirm, and then click **Delete**. After a few moments, the resource group and all of its contained resources are deleted.


Remove the IoT Edge service runtime based on your IoT device platform (Linux or Windows).

### Windows

Remove the IoT Edge runtime.

```Powershell
Stop-Service iotedge 
Remove-Service -Name iotedge
```

Delete the containers that were created on your device. 

```Powershell
docker rm -f $(docker ps -a --no-trunc --filter "name=edge" --filter "name=tempSensor")
```

### Linux

Remove the IoT Edge runtime.

```bash
sudo apt-get remove --purge iotedge
```

Delete the containers that were created on your device. 

```bash
sudo docker rm -f $(sudo docker ps -a --no-trunc --filter "name=edge" --filter "name=tempSensor")
```

Remove the container runtime.

```bash
sudo apt-get remove --purge moby
```



