## IoT Edge
Azure IoT Edge enables cloud-driven deployment of Azure services and solution-specific code to on-premises devices. IoT Edge devices can aggregate data from other devices to perform computing and analytics before the data is sent to the cloud. For more information please see [Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/).

## IoT Edge agent
The part of the IoT Edge runtime responsible for deploying and monitoring modules.

## IoT Edge device
IoT Edge devices have the IoT Edge runtime installed and are flagged as “IoT Edge device” in the device details. Learn how to [deploy Azure IoT Edge on a simulated device in Linux - preview](https://docs.microsoft.com/azure/iot-edge/tutorial-simulate-device-linux).

## IoT Edge deployment
An IoT Edge deployment configures a target set of IoT Edge devices to run a set of IoT Edge modules. Each deployment continuously ensures that all devices that match its target condition are running the specified set of modules, even when new devices are created or are modified to match the target condition. Each IoT Edge device only receives the highest priority deployment whose target condition it meets. Learn more about [IoT Edge deployment](https://docs.microsoft.com/azure/iot-edge/module-deployment-monitoring).

## IoT Edge deployment manifest
A Json document containing the information to be copied in one or more IoT Edge devices' module twin(s) to deploy a set of modules, routes and associated module desired properties.

## IoT Edge gateway device
An IoT Edge device with downstream device. The downstream device can be either IoT Edge or not IoT Edge device.

## IoT Edge hub
The part of the IoT Edge runtime responsible for module to module communications, upstream (toward IoT Hub) and downstream (away from IoT Hub) communications. 

## IoT Edge leaf device
An IoT Edge device with no downstream device. 

## IoT Edge module
An IoT Edge module is a Docker container that you can deploy to IoT Edge devices. It performs a specific task, such as ingesting a message from a device, transforming a message, or sending a message to an IoT hub. It communicates with other modules and sends data to the IoT Edge runtime. [Understand the requirements and tools for developing IoT Edge modules](https://docs.microsoft.com/azure/iot-edge/module-development).

## IoT Edge module identity
A record in the IoT Hub module identity registry detailing the existence and security credentials to be used by a module to authenticate with an edge hub or IoT Hub.

## IoT Edge module image
The docker image that is used by the IoT Edge runtime to instantiate module instances.

## IoT Edge module twin
A Json document persisted in the IoT Hub that stores the state information for a module instance.

## IoT Edge priority
When two IoT Edge deployments target the same device, the deployment with higher priority gets applied. If two deployments have the same priority, the deployment with the later creation date gets applied. Learn more about [priority](https://docs.microsoft.com/azure/iot-edge/module-deployment-monitoring#priority).

## IoT Edge runtime
IoT Edge runtime includes everything that Microsoft distributes to be installed on an IoT Edge device. It included Edge agent, Edge hub and Edge CTL tool.

## IoT Edge set modules to a single device
An operation that copies the content of an IoT Edge manifest on one device' module twin. The underlying API is a generic 'apply configuration', which simply takes an IoT Edge manifest as an input.

## IoT Edge target condition
In an IoT Edge deployment, Target condition is any Boolean condition on device twins’ tags to select the target devices of the deployment, e.g. "tag.environment = prod". The target condition is continuously evaluated to include any new devices that meet the requirements or remove devices that no longer do. Learn more about [target condition](https://docs.microsoft.com/azure/iot-edge/module-deployment-monitoring#target-condition)