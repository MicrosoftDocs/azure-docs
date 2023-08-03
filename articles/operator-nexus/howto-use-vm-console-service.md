---
title: "Azure Operator Nexus: VM Console Service"
description: Learn how to use the VM Console service.
author: sshiba
ms.author: sidneyshiba
ms.service: azure
ms.topic: how-to
ms.date: 06/16/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Introduction to the Virtual Machine console service

The Virtual Machine (VM) console service provides managed access to a VM hosted in an Operator Nexus Instance. It relies on the Azure Private Link Service (PLS) to establish a private network connection between the user's network and the Azure Operator Nexus Cluster Manager's private network.

:::image type="content" source="media/vm-console-service.png" alt-text="Diagram of VM Console service." lightbox="media/vm-console-service.png":::

For more information about networking resources that enables private connectivity to an Operator Nexus Instance, see [Introduction to Azure Private Link](https://learn.microsoft.com/training/modules/introduction-azure-private-link/).

This document provides guided instructions of how to use the VM Console service to establish a session with a Virtual Machine in an Operator Nexus Instance.

This guide helps you to:

1. Establish a secure private network connectivity between your network and the Cluster Manager's private network.
1. Create a Console resource in your workload/tenant resource group using the `az networkcloud virtualmachine console` CLI command.
1. Initiate an SSH session to connect to the Virtual Machine's Console.

> [!NOTE]
> In order to avoid passing the `--subscription` parameter to each Azure CLI command, execute the following command:
>
> ```azurecli
>   az account set --subscription "your-subscription-ID"
> ```

## Before you begin

1. Install the latest version of the [appropriate CLI extensions](./howto-install-cli-extensions.md).

## Setting variables

To help set up the environment for access to Virtual Machines, define these environment variables that are used throughout this guide.

> [!NOTE]
> These environment variable values do not reflect a real deployment and users MUST change them to match their environments.

```bash
    # Cluster Manager environment variables
    export CM_CLUSTER_NAME="contorso-cluster-manager-1234"
    export CM_MANAGED_RESOURCE_GROUP="contorso-cluster-manager-1234-rg"
    export CM_EXTENDED_LOCATION="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ExtendedLocation/customLocations/clusterManagerExtendedLocationName"
    export CM_HOSTED_RESOURCES_RESOURCE_GROUP="my-contorso-console-rg"

    # Your Console resource enviroment variables
    export VIRTUAL_MACHINE_NAME="my-undercloud-vm"
    export VM_RESOURCE_GROUP="my-vm-rg"
    export CONSOLE_PUBLIC_KEY="xxxx-xxxx-xxxxxx-xxxx"
    export CONSOLE_EXPIRATION_TIME="2023-06-01T01:27:03.008Z"

    # your environment variables
    export PRIVATE_ENDPOINT_RG="my-work-env-rg"
    export PRIVATE_ENDPOINT_NAME="my-work-env-ple"
    export PRIVATE_ENDPOINT_REGION="eastus"
    export PRIVATE_ENDPOINT_VNET="my-work-env-ple-vnet"
    export PRIVATE_ENDPOINT_SUBNET="my-work-env-ple-subnet"
    export PRIVATE_ENDPOINT_CONNECTION_NAME="my-contorse-ple-pls-connection"
```

## Establishing Private Network Connectivity

In order to establish a secure session with a Virtual Machine, you need to establish private network connectivity between your network and the Cluster Manager's private network.

This private network relies on the Azure Private Link Endpoint (PLE) and the Azure Private Link Service (PLS).

The Cluster Manager automatically creates a PLS so that you can establish a private network connection between your network and the Cluster Manager's private network.

This section provides a step-by-step guide to help you to establish a private network connectivity.

:::image type="content" source="media/vm-console-private-link.png" alt-text="Diagram of Private Link networking." lightbox="media/vm-console-private-link.png":::

1. You need to retrieve the resource identifier for the PLS associated to the VM Console service running in the Cluster Manager.

   ```bash
       # retrieve the infrastructure resource group of the AKS cluster
       export pls_resource_group=$(az aks show --name ${CM_CLUSTER_NAME} -g ${CM_MANAGED_RESOURCE_GROUP} --query "nodeResourceGroup" -o tsv)

       # retrieve the Private Link Service resource id
       export pls_resourceid=$(az network private-link-service show \
           --name console-pls \
           --resource-group ${pls_resource_group} \
           --query id \
           --output tsv)
   ```

1. Create the PLE for establishing a private and secure connection between your network and the Cluster Manager's private network. You need the PLS resource ID obtained in [Creating Console Resource](#creating-console-resource).

   ```bash
       az network private-endpoint create \
           --connection-name "${PRIVATE_ENDPOINT_CONNECTION_NAME}" \
           --name "${PRIVATE_ENDPOINT_NAME}" \
           --private-connection-resource-id "${pls_resourceid}" \
           --resource-group "${PRIVATE_ENDPOINT_RG}" \
           --vnet-name "${PRIVATE_ENDPOINT_VNET}" \
           --subnet "${PRIVATE_ENDPOINT_SUBNET}" \
           --manual-request false
   ```

1. Retrieve the private IP address allocated to the PLE, which you need when establishing a session.

   ```bash
       ple_interface_id=$(az network private-endpoint list --resource-group ${PRIVATE_ENDPOINT_NAME}-rg --query "[0].networkInterfaces[0].id" -o tsv)

       sshmux_ple_ip=$(az network nic show --ids $ple_interface_id --query 'ipConfigurations[0].privateIPAddress' -o tsv)

       echo "sshmux_ple_ip: ${sshmux_ple_ip}"
   ```

## Creating Console Resource

The Console resource provides the information about the VM such as VM name, public SSH key, expiration date for the session, etc.

This section provides step-by-step guide to help you to create a Console resource using Azure CLI commands.

:::image type="content" source="media/vm-console-resource.png" alt-text="Diagram of VM Console Resource." lightbox="media/vm-console-resource.png":::

1. Before you can establish a session with a VM, a Console resource must be created for that VM.

   ```bash
       az networkcloud virtualmachine console create \
           --virtual-machine-name "${VIRTUAL_MACHINE_NAME}" \
           --resource-group "${VM_RESOURCE_GROUP}" \
           --extended-location name="${CM_EXTENDED_LOCATION}" type="CustomLocation" \
           --enabled True \
           --key-data "${CONSOLE_PUBLIC_KEY}" \
          [--expiration "${CONSOLE_EXPIRATION_TIME}"]
   ```

   If you omit the `--expiration` parameter, the Cluster Manager will automatically set the expiration to one day after the creation of the Console resource. Also note that the `expiration` date & time format **must** comply with RFC3339 otherwise the creation of the Console resource fails.

   > [!NOTE]
   > For a complete synopsis for this command, invoke `az networkcloud console create --help`.

1. Upon successful creation of the Console resource, retrieve the VM Access ID. You must use this unique identifier as `user` of the SSH session.

   ```bash
       virtual_machine_access_id=$(az networkcloud virtualmachine console show \
           --virtual-machine-name "${VIRTUAL_MACHINE_NAME}" \
           --resource-group "${VM_RESOURCE_GROUP}" \
           --query "virtualMachineAccessId")
   ```

> [!NOTE]
> For a complete synopsis for this command, invoke `az networkcloud virtualmachine console show --help`.

## Establishing a session with a Virtual Machine

At this point, you have the `virtual_machine_access_id` and the `sshmux_ple_ip`. This input is the info needed for establishing a session with the VM.

The VM Console service is a `ssh` server that "relays" the session to the designated VM. The `sshmux_ple_ip` indirectly references the VM Console service and the `virtual_machine_access_id` the identifier for the VM.

> [!IMPORTANT]
> The VM Console service listens to port `2222`, therefore you **must** specify this port number in the `ssh` command.
>
> ```bash
>    SSH [-i path-to-private-SSH-key] -p 2222 $virtual_machine_access_id@$sshmux_ple_ip
> ```

:::image type="content" source="media/vm-console-ssh-session.png" alt-text="Diagram of VM Console SSH Session." lightbox="media/vm-console-ssh-session.png":::

The VM Console service was designed to allow **only** one session per Virtual Machine. Anyone establishing another successful session to a VM closes an existing session.

> [!IMPORTANT]
> The private SSH key used for authenticating the session (default: `$HOME/.ssh/id_rsa`) MUST match the public SSH key passed as a parameter when creating the Console resource.

## Updating Console Resource

You can disable the session to a given VM by updating the expiration date/time and/or updating the public SSH key used when creating the session with a VM.

```bash
    az networkcloud virtualmachine console update \
        --virtual-machine-name "${VIRTUAL_MACHINE_NAME}" \
        --resource-group "${VM_RESOURCE_GROUP}" \
        [--enabled True | False] \
        [--key-data "${CONSOLE_PUBLIC_KEY}"] \
        [--expiration "${CONSOLE_EXPIRATION_TIME}"]
```

If you want to disable access to a VM, you need to update the Console resource with the parameter `enabled False`. This update closes any existing session and restricts any subsequent sessions.

> [!NOTE]
> Before creating a session to a VM, the corresponding Console resource **must** be set to `--enabled True`.

When a Console `--expiration` time expires, it closes any session corresponding the Console resource. You'll need to update the expiration time with a future value so that you can establish a new session.

When you update the Console's public SSH key, the VM Console service closes any active session referenced by the Console resource. You have to provide a matching private SSH key matching the new public key when you establish a new session.

## Cleaning Up (Optional)

To clean up your VM Console environment setup, you need to delete the Console resource and your Private Link Endpoint.

1. Deleting your Console resource

   ```bash
       az networkcloud virtualmachine console delete \
           --virtual-machine-name "${VIRTUAL_MACHINE_NAME}" \
           --resource-group "${VM_RESOURCE_GROUP}"
   ```

1. Deleting the Private Link Endpoint

   ```bash
       az network private-endpoint delete \
       --name ${PRIVATE_ENDPOINT_NAME}-ple \
       --resource-group ${PRIVATE_ENDPOINT_NAME}-rg
   ```
