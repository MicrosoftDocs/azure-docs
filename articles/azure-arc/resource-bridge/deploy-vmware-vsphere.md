---
title: Deploy Azure Arc resource bridge on VMware vSphere
description: Learn how to deploy Azure Arc resource bridge to VMware vSphere.
ms.date: 09/28/2021
ms.topic: overview
---

# How to deploy Azure Arc resource bridge to VMware vSphere

Azure Arc resource bridge is a fully managed Kubernetes cluster, packaged in a virtual machine (VM) format. This article describes how you can deploy it in your private cloud environment running VMware vSphere. Inside the VM, their is a single node Kubernetes cluster hosting various components, including the custom locations and cluster extensions.

You perform the following to complete the deployment:

- Download the VM image
- Create three configuration YAML files:
    - **Application.yaml** - This is the primary configuration file that provides a path to the provider configuration and resource configuration YAML files. The file also specifies the network configuration of the resource bridge, and includes generic cluster information that is not provider specific.
    - **Infra.yaml** - A configuration file that includes a set of configuration properties specific to your private cloud provider.
    - **Resource.yaml** - A configuration file that contains all the information related to the Azure Resource Manager resource, such as the subscription name and resource group for the resource bridge in Azure.

- Deploy the resource bridge and register it with Azure.

Before you get started, be sure to review the [prerequisites](overview.md#prerequisites) and verify that your subscription and resources meet the requirements. For information about supported regions and other related considerations, see [supported Azure regions](overview.md#supported-regions).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Install and register extension

Before proceeding with installing and configuring the Arc resource bridge on your VMware vSphere infrastructure, you need to download and install the Arc resource bridge extension.  

1. Download the Azure Command-Line Interface (CLI) Appliance Extension by running the following commands:

   ```azurecli
   az extension add --name arcappliance
   # Verify extension was added
   az arcappliance -h 
   ```

2. Sign in to Azure by running the following command:

   ```azurecli
   az login
   ```

3. Run the following command to register the Azure resource provider. 

   ```azurecli
   az provider register --name Microsoft.ResourceConnector
   ```

## Create an appliance configuration

The `appliance.yaml` file is the main configuration file that specifies the path to two YAML files to deploy the resource bridge in your environment, and to register it in Azure. This file also includes the network configuration settings, specifically its IP address and optionally, a proxy server if direct network connection to the internet is not allowed in your environment.  

1. Copy and paste the following syntax into your file:

    ```bash
    # Relative or absolute path to the infra.yaml file
    infrastructureConfigPath: "VMware-infra.yaml"
    
    # Relative or absolute path to ARM resource configuration file
    applianceResourceFilePath: "VMware-resource.yaml"
    
    # IP address to be used for control plane/API server from the DHCP range available in the environment. This IP address must be reserved for this, and can't be changed. If it is changed, the resource bridge will not be reachable by all the other Arc agents and services.
    applianceClusterConfig:
        controlPlaneEndpoint: <ipAddress>
    ```

    If your environment requires a proxy server, you can add the following under section `applianceClusterConifg`
    
    ```bash
    applianceClusterConfig:
      controlPlaneEndpoint: <endpoint>
      networking:
        # Specify the proxy configuration.
        proxy:
          http: "<http://<proxyURL>:<proxyport>"
          https: "<https://<proxyURL>:<proxyport>"
          noproxy: "..."
          # Specify certificate if applicable
          certificateFilePath: "<certificatePath>"
    ```

2. Edit the values for **controlPlaneEndpoint**. If communicating through a proxy server, edit the values for **http** or **https** depending on if your proxy server only supports HTTP or HTTPS, and **certificateFilePath**. 

3. Save this file as `appliance.yaml` to a local folder.

### Example of the Infra.yaml

The `infra.yaml` file includes specific information to enable deployment of the virtual machine within the vSphere infrastructure.  

1. Copy and paste the following syntax into your file:

    ```bash
    vsphereprovider:
      # vCenter credentials, which will be used to create the resource bridge.
      credentials:
        address: <vcenterAddress>
        username: <userName>
        password: <password>
      # Current deployment uses the template and snapshot to create the resource bridge VM.
      appliancevm:
        vmtemplate: <templateName>
        templatesnapshot: <snapshotName>
      # The datacenter where the resource bridge VM will be created on.
      datacenter: <datacenteName>
       # The datastore used by the resource bridge VM
      datastore: <datastoreName>
      # The network interface used by the resource bridge VM
      network: <networkInterfaceName>
      # The resource pool where the resource bridge VM will be created on.
      resourcepool: <resourcePoolName>
      # The folder where the resource bridge will be created under.
      folder: <folderName>
    
    # The following is only required for the current release
     applianceagents:
      reference: azurearcfork8sdev.azurecr.io/dogfood/dev/azure-arc-k8sagents:0.1.485-dev
    ```

2. Edit the values for vCenter credentials, and deployment configuration properties required to deploy the VM.

3. Save this file as `infra.yaml` to a local folder.
 
### Example of the Resource.yaml

The `resource.yaml` file contains all the information related to the Azure Resource Manager resource definition, such as the the subscription, resource group, resource name, and location for the resource bridge in Azure.

1. Copy and paste the following syntax into your file:

    ```bash
    resource:
        resource_group: <resourceGroupName>
        name: <resourceName>
        location: <location>
        subscription: <subscription>
    ```

2. Edit the values for vCenter credentials, and deployment configuration properties required to deploy the VM.

3. Save this file as `resource.yaml` to a local folder.

## Deployment

Perform the following steps to deploy the Arc resource bridge in your vSphere environment.

1. Create the resource bridge vSphere virtual machine running the following command. It creates a kubeconfig file after a successful deployment.

    ```bash
    az arcappliance deploy vmware --config-file <path and name of the appliance.yaml> --out-file kubeconfig
    ```

  This step can take around 30 minutes to complete. 

2. Run the following command to create the resource bridge resource in Azure:

    ```bash
    az arcappliance create vmware --config-file appliance.yaml --kubeconfig <path to kubeconfig created earlier>
    ```

The resource in Azure will take several minutes to connect to the virtual machine deployed in vSphere. Run the following command to check the `provisioningState` and `status` of the Arc resource bridge.  

```bash
az arcappliance show -n <resourceName> -g <resourceGroupName>
```

The output results for the property `provisioningState` has a value of `Succeeded` and for the property `status`, a value of `Running`.

## Delete resource bridge

To delete the resource bridge, use the same config files created and used earlier. This action deletes the resource bridge VM from your private cloud environment and the resource in Azure.

```bash
az arcappliance delete vmware --config-file appliance.yaml
```

## Next steps

Learn how to perform common management operations on the VMware virtual machines that are enabled by Azure Arc.