# Azure Device Update (ADU) Overview

## What is Azure Device Update

Azure Device Update is a service that enables you to deploy over-the-air
updates (OTA) for your IoT devices. ADU lets you focus on your solution,
ensuring your devices are up-to-date with the latest security fixes or
application updates without having to build and maintain your own update
solution. ADU is a reliable and scalable solution that is based on the Windows
Update platform and integrated with Azure IoT Hub to support devices globally.
ADU provides controls on how to manage the deployment of updates, so you are
always in control of when and how devices are updated. Finally, ADU also
provides reporting capabilities so you can always see the state of your devices.

### Support for a wide range of IoT devices

Azure Device Update integrates with the Azure IoT device SDK to enable your
devices to receive updates. For Private Preview, an ADU Agent Simulator binary and Raspberry Pi reference Yocto image images are provided.
Azure Device Update also supports updating Azure IoT Edge devices. For Private
Preview, an ADU Agent will be provided for Ubuntu Server 18.04 amd64
platform. Azure Device Update will also provide open source code if you are not
running one of the above platforms so you can port it to the distribution you
are running.

ADU works with IoT Plug and Play (PnP) and can manage any device that supports
the required PnP interfaces. For more information, see [Azure Device Update and
IoT Plug and Play](how-adu-uses-iot-pnp.md).

### Support for a wide range of update artifacts

Azure Device Update supports two forms of updates – image-based
and package-based.

Package-based updates are targeted updates that alter only a specific component
or application on the device. Thus, this leads to lower consumption of
bandwidth and helps reduce the time to download and install the update. Package
updates typically allow for less downtime of devices when applying an update and
avoid the overhead of creating images.

Image updates provide a higher level of confidence in the end-state
of the device. It is typically easier to replicate the results of an
image-update between a pre-production environment and a production environment,
since it doesn’t pose the same challenges as packages and their dependencies.
Due to their atomic nature, one can also adopt a A/B failover model easily.

There is no one right answer, and you might choose differently based on
your specific use cases. Azure Device Update supports both image and package
form of updating, and empowers you to choose the right updating model
for your device environment.


### Secure updates

Once updates are published to ADU, they are then scanned for malware (coming
later during Private Preview) and additional metadata is generated that allows
the device to verify the integrity of the updates it receives. ADU uses IoT Hub
to securely communicate to the device to initiate an update. The device
then downloads the update from an ADU-specified location or a Gateway (coming
later during Private Preview.)

## ADU workflows

ADU functionality can be broken down into 3 areas: Agent Integration,
Importing, and Management. Below is a quick overview of the various areas of
functionality.

### ADU Agent

When an update command is received on a device, it will execute the requested
phase of updating, (either Download, Install and Apply). During each phase,
status is returned to ADU via IoT Hub so you can view the current status of a
deployment. If there are no updates in progress the status is returned as “Idle”
. A deployment can be canceled at any time.

![Client Agent Workflow](images/client-agent-workflow.png)

[Learn More](agent-reference/agent-overview.md)

### Importing

Importing is the ability to import your update into ADU. For Private Preview,
ADU supports rolling out a single update per device, making it ideal for
full-image updates that update an entire OS partition at once, or a
apt Manifest that describes all the packages you might want to update
on your device. To import updates into ADU, you first create an import manifest 
describing the update, then upload both the update file(s) and the import 
manifest to an Internet-accessible location. After that, you can use the Azure portal or call the ADU Import
REST API to initiate the asynchronous process where ADU uploads the files, processes
them, and makes them available for distribution to IoT devices.

**NOTE:** For sensitive content, protect the download using a shared access
signature (SAS), such as an ad-hoc SAS for Azure Blob Storage.

[Learn more about
SAS](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview)

![Import an Update](images/import-an-update.png)

[Learn More](publish-api-reference/import-api-overview.md)

### Management

When content is imported, ADU automatically adds the device into a **Device
Class** of devices with the same compatibility. ADU uses these device classes to
match devices to available content that is compatible with them. After importing
content into ADU, you can view compatible updates for your devices and device
classes.

ADU supports the concept of **Groups** via tags in IoT Hub. Deploying an update
out to a test group first is a good way to reduce the risk of issues during a
production rollout.

In ADU, deployments are called **Deployments**, which are a way of connecting the
right content to the a specific set of compatible devices. ADU orchestrates the
process of sending commands to each device, instructing them to download and
install the updates and getting status back.

![Manage and Deploy Updates](images/manage-deploy-updates.png)

[Learn More](management-api-reference/management-api-overview.md)

## Azure Device Update Quickstart

[Getting Started With Azure Device Update](quickstarts/overview-quickstart.md)
