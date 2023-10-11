---
title: "Azure Operator Nexus: VM Console Service"
description: Learn how to use the VM console service.
author: sshiba
ms.author: sidneyshiba
ms.service: azure 
ms.topic: how-to
ms.date: 06/16/2023
ms.custom: template-how-to
---

# Introduction to the Virtual Machine console service

The Virtual Machine (VM) console service provides managed SSH access to a VM hosted in an Operator Nexus Instance. It relies on the Azure Private Link Service (PLS) to establish a private network connection between the user's network and the Azure Operator Nexus Cluster Manager's private network.

:::image type="content" source="media/vm-console-service.png" alt-text="Diagram of VM Console service." lightbox="media/vm-console-service.png":::

For more information about networking resources that enables private connectivity to an Operator Nexus Instance, see [Introduction to Azure Private Link](https://learn.microsoft.com/training/modules/introduction-azure-private-link/).

This document provides guided instructions of how to use the VM Console service to establish an SSH session with a Virtual Machine in an Operator Nexus Instance.

This guide helps you to:

1. Establish a secure private network connectivity between your network and the Cluster Manager's private network
1. Create a Console resource with `az networkcloud virtualmachine console` CLI command
1. Initiate an SSH session with a Virtual Machine

> [!NOTE]
> In order to avoid passing the `--subscription` parameter to each Azure CLI command, execute the following command:
>
> ```azurecli
>   az account set --subscription "your-subscription-ID"
> ```

## Before you begin

1. Install the latest version of the [appropriate CLI extensions](./howto-install-cli-extensions.md)

## Setting variables

To help set up the environment for SSHing to Virtual Machines, define these environment variables that are used throughout this guide.

> [!NOTE]
> These environment variable values do not reflect a real deployment and users MUST change them to match their environments.

```bash
    # CM_HOSTED_RESOURCES_RESOURCE_GROUP: Cluster Manager resource group name
    export CM_HOSTED_RESOURCES_RESOURCE_GROUP="my-contorso-console-rg"
    # CM_EXTENDED_LOCATION: Cluster Manager Extended Location, can be retrieved but you will need access rights to execute certain Azure CLI commands
    export CM_EXTENDED_LOCATION="/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ExtendedLocation/customLocations/clusterManagerExtendedLocationName"

    # VIRTUAL_MACHINE_NAME: Virtual Machine name you want to access through VM Console service
    export VIRTUAL_MACHINE_NAME="my-undercloud-vm"
    # CONSOLE_PUBLIC_KEY: Public Key matching Private Key to be used when establish `ssh` session, e.g., `ssh -i $HOME/.ssh/id-rsa`
    export CONSOLE_PUBLIC_KEY="xxxx-xxxx-xxxxxx-xxxx"
    # CONSOLE_EXPIRATION_TIME: Expiration date and time (RFC3339 format) for any `ssh` session with a virtual machine. 
    export CONSOLE_EXPIRATION_TIME="2023-06-01T01:27:03.008Z"

    # PRIVATE_ENDPOINT_RG: Resource group name that Private Endpoint will be created on
    export PRIVATE_ENDPOINT_RG="my-work-env-rg"
    # PRIVATE_ENDPOINT_NAME: Private Endpoint's name you choose
    export PRIVATE_ENDPOINT_NAME="my-work-env-ple"
    # PRIVATE_ENDPOINT_CONNECTION_NAME: PLE/PLS connection name you choose
    export PRIVATE_ENDPOINT_CONNECTION_NAME="my-contorse-ple-pls-connection"
    # PRIVATE_ENDPOINT_REGION: Location where Private Endpoint will be created
    export PRIVATE_ENDPOINT_REGION="eastus"
    # PRIVATE_ENDPOINT_VNET: Virtual Network to be used by the Private Endpoint
    export PRIVATE_ENDPOINT_VNET="my-work-env-ple-vnet"
    # PRIVATE_ENDPOINT_SUBNET: Subnetwork to be used by the Private Endpoint
    export PRIVATE_ENDPOINT_SUBNET="my-work-env-ple-subnet"
```

## Creating Console Resource

The Console resource provides the information about the VM such as VM name, public SSH key, expiration date for the SSH session, etc.

This section provides step-by-step guide to help you to create a Console resource using Azure CLI commands.

:::image type="content" source="media/vm-console-resource.png" alt-text="Diagram of VM Console Resource." lightbox="media/vm-console-resource.png":::

1. In order to create a ***Console*** resource in the Cluster Manager, you will need to collect some information, e.g., resource group (CM_HOSTED_RESOURCES_RESOURCE_GROUP) and custom location (CM_EXTENDED_LOCATION). You have to provide the resource group but you can retrieve the custom location if you have access rights to excute the commands listed below.

    ```bash
        export cluster_resource_id=$(az resource list -g ${CM_HOSTED_RESOURCES_RESOURCE_GROUP} --query "[?type=='Microsoft.NetworkCloud/clusters'].id" --output tsv)
        export CM_EXTENDED_LOCATION=$(az resource show --ids $cluster_resource_id --query "properties.clusterExtendedLocation.name" | tr -d '"')
    ```

1. The first thing before you can establish an SSH session with a VM is to create a ***Console*** resource in the Cluster Manager.

    ```bash
        az networkcloud virtualmachine console create \
            --virtual-machine-name "${VIRTUAL_MACHINE_NAME}" \
            --resource-group "${CM_HOSTED_RESOURCES_RESOURCE_GROUP}" \
            --extended-location name="${CM_EXTENDED_LOCATION}" type="CustomLocation" \
            --enabled True \
            --key-data "${CONSOLE_PUBLIC_KEY}" \
            [--expiration "${CONSOLE_EXPIRATION_TIME}"]
    ```

    If you omit the `--expiration` parameter, the Cluster Manager will automatically set the expiration to one day after the creation of the Console resource. Also note that the `expiration` date & time format **must** comply with RFC3339 otherwise the creation of the Console resource fails.

    > [!NOTE]
    > For a complete synopsis for this command, invoke `az networkcloud console create --help`.

1. Upon successful creation of the Console resource, retrieve the **Private Link Service** identifier that is required to create Private Link Endpoint (PLE)

    ```bash
        export pls_resourceid=$(az networkcloud virtualmachine console show \
            --virtual-machine-name "${VIRTUAL_MACHINE_NAME}" \
            --resource-group "${CM_HOSTED_RESOURCES_RESOURCE_GROUP}" \
            --query "privateLinkServiceId")
    ```

1. Also, retrieve the **VM Access ID**. You must use this unique identifier as `user` of the `ssh` session.

    ```bash
        virtual_machine_access_id=$(az networkcloud virtualmachine console show \
            --virtual-machine-name "${VIRTUAL_MACHINE_NAME}" \
            --resource-group "${CM_HOSTED_RESOURCES_RESOURCE_GROUP}" \
            --query "virtualMachineAccessId")
    ```

> [!NOTE]
> For a complete synopsis for this command, invoke `az networkcloud virtualmachine console show --help`.

## Establishing Private Network Connectivity

In order to establish a secure SSH session with a Virtual Machine, you need to establish a private network connectivity between your network and the Cluster Manager's private network.

This private network relies on the Azure Private Link Endpoint (PLE) and the Azure Private Link Service (PLS).

The Cluster Manager automatically creates a PLS so that you can establish a private network connection between your network and the Cluster Manager's private network.

This section provides a step-by-step guide to help you to establish a private network connectivity.

:::image type="content" source="media/vm-console-private-link.png" alt-text="Diagram of Private Link networking." lightbox="media/vm-console-private-link.png":::

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

> [!NOTE]
> You will need only one Private Endpoint per Cluster Manager.

1. Retrieve the private IP address allocated to the PLE, which you need when establishing the `ssh` session.

    ```bash
        ple_interface_id=$(az network private-endpoint list --resource-group ${PRIVATE_ENDPOINT_NAME}-rg --query "[0].networkInterfaces[0].id" -o tsv)

        sshmux_ple_ip=$(az network nic show --ids $ple_interface_id --query 'ipConfigurations[0].privateIPAddress' -o tsv)

        echo "sshmux_ple_ip: ${sshmux_ple_ip}"
    ```

## Establishing an SSH session with Virtual Machine

At this point, you have all the info needed for establishing a `ssh` session to the VM, that is, `virtual_machine_access_id` and `sshmux_ple_ip`.

The VM Console service is a `ssh` server that "relays" the session to the designated VM. The `sshmux_ple_ip` indirectly references the VM Console service and the `virtual_machine_access_id` the identifier for the VM.

> [!IMPORTANT]
> The VM Console service listens to port `2222`, therefore you **must** specify this port number in the `ssh` command.
>
> ```bash
>    SSH [-i path-to-private-SSH-key] -p 2222 $virtual_machine_access_id@$sshmux_ple_ip
> ```

:::image type="content" source="media/vm-console-ssh-session.png" alt-text="Diagram of VM Console SSH Session." lightbox="media/vm-console-ssh-session.png":::

The VM Console service was designed to allow **only** one `ssh` session per Virtual Machine. Anyone establishing a successful `ssh` session to a VM closes an existing session, if any.

> [!IMPORTANT]
> The private SSH key used for authenticating the `ssh` session (default: `$HOME/.ssh/id_rsa`) MUST match the public SSH key passed as parameter when creating the Console resource.

## Updating Console Resource

You can disable `ssh` session to a given VM by updating the expiration date/time and/or update the public SSH key.

```bash
    az networkcloud virtualmachine console update \
        --virtual-machine-name "${VIRTUAL_MACHINE_NAME}" \
        --resource-group "${CM_HOSTED_RESOURCES_RESOURCE_GROUP}" \
        [--enabled True | False] \
        [--key-data "${CONSOLE_PUBLIC_KEY}"] \
        [--expiration "${CONSOLE_EXPIRATION_TIME}"]
```

If you want to disable `ssh` access to a VM, you need to update the Console resource with the parameter `enabled False`. This update closes any `ssh` session and restricts any subsequent sessions.

> [!NOTE]
> Before anyone can create a `ssh` session to a VM, the corresponding Console resource **must** be set to `--enabled True`.

When a Console `--expiration` time expires, it closes any `ssh` session corresponding the Console resource. You'll need to update the expiration time with a future value so that you can establish a new session.

When you update the Console's public SSH key, the VM Console service closes any `ssh` session referenced by the Console resource. You have to provide a matching private SSH key matching the new public key when you establish a `ssh` session.

## Cleaning Up (Optional)

To clean up your VM Console environment setup, you need to delete the Console resource and your Private Link Endpoint.

1. Deleting your Console resource

    ```bash
        az networkcloud virtualmachine console delete \
            --virtual-machine-name "${VIRTUAL_MACHINE_NAME}" \
            --resource-group "${CM_HOSTED_RESOURCES_RESOURCE_GROUP}"
    ```

1. Deleting the Private Link Endpoint

    ```bash
        az network private-endpoint delete \
        --name ${PRIVATE_ENDPOINT_NAME}-ple \
        --resource-group ${PRIVATE_ENDPOINT_NAME}-rg
    ```
