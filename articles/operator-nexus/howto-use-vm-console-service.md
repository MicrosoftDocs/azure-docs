---
title: "Azure Operator Nexus: VM Console Service"
description: Learn how to use the VM Console service.
author: sshiba
ms.author: sidneyshiba
ms.service: azure 
ms.topic: how-to
ms.date: 06/16/2023
ms.custom: template-how-to
---

# Introduction to the Virtual MachineConsole Service

The Virtual Machine (VM) Console service provides managed SSH access to a VM hosted in an Azure for Operators Cluster. It relies on the Azure Private Link Service (PLS) to establish a private network connection between the user's network and the Azure Operator Nexus Cluster Manager's private network.

<!--- IMG ![VM Console service overview](articles/operator-nexus/media/vm-console-service.png) IMG --->
:::image type="content" source="media/vm-console-service.png" alt-text="VM Console service overview.":::

For more information about networking resources that enables private connectivity to an Azure Operator Nexus Cluster, see [Introduction to Azure Private Link](https://learn.microsoft.com/en-us/training/modules/introduction-azure-private-link/).

This document provides guided instructions of how to use the VM Console service to establish an SSH session with a Virtual Machine in an Azure for Operators Nexus Cluster.

This guide helps you to:

1. Establish a secure private network connectivity between your network and the Operator Nexus Cluster Manager's private network
1. Create a Console resource with `az networkcloud virtualmachine console` CLI command
1. Initiate an SSH session with a Virtual Machine of an Undercloud cluster

> [!NOTE]
> In order to avoid passing the `--subscription` parameter to each Azure CLI command, execute the following command:
>
> ```azurecli
>   az account set --subscription "your-subscription-ID"
> ```

## Before you begin

1. Install the latest version of the [appropriate CLI extensions](./howto-install-cli-extensions.md)

## Setting variables

To help set up the environment for SSHing to Virtual Machines, define these environment variables that to be used throughout this guide.

> [!NOTE]
> These environment variable values do not reflect a real deployment and users MUST change them to match their environments.

```bash
    # Cluster Manager environment variables
    export CLUSTER_MANAGER_CLUSTER_NAME="contorso-cluster-manager-1234"
    export CLUSTER_MANAGER_RG="contorso-cluster-manager-1234-rg"

    # Your Console resource enviroment variables
    export VM_CONSOLE_RG="my-contorso-console-rg"
    export VM_CONSOLE_VM_NAME="my-undercloud-vm"
    export VM_CONSOLE_PUBLIC_KEY="xxxx-xxxx-xxxxxx-xxxx"
    export VM_CONSOLE_EXTENDED_LOCATION_NAME="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ExtendedLocation/customLocations/clusterManagerExtendedLocationName"
    export VM_CONSOLE_EXPIRATION_TIME="2023-06-01T01:27:03.008Z"

    # your environment variables
    export PRIVATE_ENDPOINT_RG="my-work-env-rg"
    export PRIVATE_ENDPOINT_NAME="my-work-env-ple"
    export PRIVATE_ENDPOINT_REGION="eastus"
    export PRIVATE_ENDPOINT_VNET="my-work-env-ple-vnet"
    export PRIVATE_ENDPOINT_SUBNET="my-work-env-ple-subnet"
    export PRIVATE_ENDPOINT_CONNECTION_NAME="my-contorse-ple-pls-connection"
```

## Establishing Private Network Connectivity

In order to establish a secure SSH session with a Virtual Machine of an Undercloud cluster, you need to establish a private network connectivity between your network and the Operator Nexus Cluster Manager's private network.

This private network relies on the Azure Private Link Endpoint (PLE) and the Azure Private Link Service (PLS) to establish a private network connection between your network and the Operator Nexus Cluster Manager's private network.

The Operator Nexus Cluster Manager automatically creates a PLS so that you can establish a private network connection between your network and the Operator Nexus Cluster Manager's private network.

This section provides a step-by-step guide to help you to establish a private network connectivity between your network and the Operator Nexus Cluster Manager's private network.

<!--- IMG ![Private link networking overview](articles/operator-nexus/media/vm-console-private-link.png) IMG --->
:::image type="content" source="media/vm-console-private-link.png" alt-text="Private link networking overview.":::

1. You need to retrieve the resource identifier for the PLS associated to the VM Console service running in the Nexus Operator Cluster Manager.

    ```bash
        # retrieve the infrastructure resource group of the AKS cluster
        export pls_resource_group=$(az aks show --name ${CLUSTER_MANAGER_CLUSTER_NAME} -g ${CLUSTER_MANAGER_RG} --query "nodeResourceGroup" -o tsv)
    
        # retrieve the Private Link Service resource id
        export pls_resourceid=$(az network private-link-service show \
            --name console-pls \
            --resource-group ${pls_resource_group} \
            --query id \
            --output tsv)
    ```

1. Create the PLE for establishing a private and secure connection between your network and the Operator Nexus Cluster Manager's private network. You need the PLS resource ID obtained in [Creating Console Resource](#creating-console-resource).

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

1. Retrieve the private IP address allocated to the PLE, which you need when establishing the `ssh` session.

    ```bash
        ple_interface_id=$(az network private-endpoint list --resource-group ${PRIVATE_ENDPOINT_NAME}-rg --query "[0].networkInterfaces[0].id" -o tsv)

        sshmux_ple_ip=$(az network nic show --ids $ple_interface_id --query 'ipConfigurations[0].privateIPAddress' -o tsv)

        echo "sshmux_ple_ip: ${sshmux_ple_ip}"
    ```

## Creating Console Resource

The Console resource provides the information about the Virtual Machine(VM) such as VM name, public SSH key, expiration date for the SSH session, etc.

This section provides step-by-step guide to help you to create a Console resource using Azure CLI commands.

<!--- IMG ![VM Console Resource](articles/operator-nexus/media/vm-console-resource.png) IMG --->
:::image type="content" source="media/vm-console-resource.png" alt-text="VM Console Resource.":::

1. The first thing before you can establish an SSH session with a Virtual Machine(VM) of an Undercloud cluster is to create a ***Console*** resource in the Operator Nexus Cluster Manager cluster.

    ```bash
        az networkcloud virtualmachine console create \
            --virtual-machine-name "${VM_CONSOLE_VM_NAME}" \
            --resource-group "${VM_CONSOLE_RG}" \
            --extended-location name="${VM_CONSOLE_EXTENDED_LOCATION_NAME}" type="CustomLocation" \
            --enabled True \
            --key-data "${VM_CONSOLE_PUBLIC_KEY}" \
           [--expiration "${VM_CONSOLE_EXPIRATION_TIME}"]
    ```

If you omit the `--expiration` parameter, the Nexus Operator Cluster Manager will automatically set the expiration to one day after the creation of the Console resource. Also note that the `expiration` date & time format MUST comply with RFC3339 otherwise the creation of the Console resource fails.

> [!NOTE]
> For a complete synopsis for this command, invoke `az networkcloud console create --help`.

1. Upon successful creation of the Console resource, retrieve the Virtual MachineAccess ID. You must use this unique identifier as `user` of the `ssh` session.

    ```bash
        virtual_machine_access_id=$(az networkcloud virtualmachine console show \
            --virtual-machine-name "${VM_CONSOLE_VM_NAME}" \
            --resource-group "${VM_CONSOLE_RG}" \
            --query "virtualMachineAccessId")
    ```

> [!NOTE]
> For a complete synopsis for this command, invoke `az networkcloud virtualmachine console show --help`.

## Establishing an SSH session with an Undercloud Virtual Machine

At this point, you have all the info needed for establishing a `ssh` session to the Virtual Machine, that is, `virtual_machine_access_id` and `sshmux_ple_ip`.

The VM Console service is a `ssh` server that "relays" the session to the designated Virtual Machine. The `sshmux_ple_ip` indirectly references the VM Console service and the `virtual_machine_access_id` the identifier for the Virtual Machine.

> [!IMPORTANT]
> The VM Console service listens to port `2222`, therefore you MUST specify this port number in the `ssh` command.
>
> ```bash
>    SSH [-i path-to-private-SSH-key] -p 2222 $virtual_machine_access_id@$sshmux_ple_ip
> ```

<!--- IMG ![VM Console SSH Session](articles/operator-nexus/media/vm-console-ssh-session.png) IMG --->
:::image type="content" source="media/vm-console-ssh-session.png" alt-text="VM Console SSH Session.":::

The VM Console service was designed to allow ONLY one `ssh` session per Virtual Machine. Anyone establishing a successful `ssh` session to a Virtual Machine closes an existing session, if any.

> [!IMPORTANT]
> The private SSH key used for authenticating the `ssh` session (default: `$HOME/.ssh/id_rsa`) MUST match the public SSH key passed as parameter when creating the Console resource.

## Updating Console Resource

You can disable `ssh` session to a given Virtual Machine by updating the expiration date/time and/or update the public SSH key.

```bash
    az networkcloud virtualmachine console update \
        --virtual-machine-name "${VM_CONSOLE_VM_NAME}" \
        --resource-group "${VM_CONSOLE_RG}" \
        [--enabled True | False] \
        [--key-data "${VM_CONSOLE_PUBLIC_KEY}"] \
        [--expiration "${VM_CONSOLE_EXPIRATION_TIME}"]
```

If you want to disable `ssh` access to a Virtual Machine, you need to update the Console resource with the parameter `enabled False`. This update closes any `ssh` session and restricts any subsequent sessions.

> [!NOTE]
> Before anyone can create a `ssh` session to a Virtual Machine, the corresponding Console resource MUST be set to `--enabled True`.

When a Console `--expiration` time expires, it closes any `ssh` session corresponding the Console resource. You'll need to update the expiration time with a future value so that you can establish a new session.

When you update the Console's public SSH key, the VM Console service closes any `ssh` session referenced by the Console resource. You have to provide a matching private SSH key matching the new public key when you establish a `ssh` session.

## Cleaning Up (Optional)

To clean up your VM Console environment setup, you need to delete the Console resource and your Private Link Endpoint.

1. Deleting your Console resource

    ```bash
        az networkcloud console delete \
            --virtual-machine-name "${VM_CONSOLE_VM_NAME}" \
            --resource-group "${VM_CONSOLE_RG}"
    ```

1. Deleting the Private Link Endpoint

    ```bash
        az network private-endpoint delete \
        --name ${PRIVATE_ENDPOINT_NAME}-ple \
        --resource-group ${PRIVATE_ENDPOINT_NAME}-rg
   ```
