---
title: Create an IoT Hub with Certificate Management in Azure Device Registry by Using the Azure CLI
description: This article explains how to create an IoT hub with Azure Device Registry integration and certificate management by using the Azure CLI.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
ms.topic: include
ms.date: 01/27/2026
---

## More prerequisites for the Azure CLI

Before you begin, make sure that you have:

- The Azure CLI installed. Follow the steps to [install the Azure CLI](/cli/azure/install-azure-cli).
- The Azure IoT CLI extension with previews enabled installed to access the Azure Device Registry integration and certificate management functionalities for Azure IoT Hub:

    1. Check for existing Azure CLI extension installations.
    
        ```azurecli-interactive
        az extension list
        ```
    
    1. Remove any existing `azure-iot` installations.
    
        ```azurecli-interactive
        az extension remove --name azure-iot
        ```
        
    1. Install the `azure-iot` extension from the index with previews enabled.
    
        ```azurecli-interactive
        az extension add --name azure-iot --allow-preview
        ```

        Or you can download the .whl file from the GitHub releases page to install the extension manually.

        ```azurecli-interactive
        az extension add --upgrade --source https://github.com/Azure/azure-iot-cli-extension/releases/tag/v0.30.0b2
        ```
    
    1. After the installation, validate that your `azure-iot` extension version is at least 0.30.0b2.
    
        ```azurecli-interactive
        az extension list
        ``` 

## Overview

Use the Azure CLI commands to create an IoT hub with Device Registry integration and certificate management.

The setup process in this article includes the following steps:

1. Create a resource group.
1. Configure the necessary app privileges.
1. Create a user-assigned managed identity.
1. Create a Device Registry namespace with system-assigned managed identity.
1. Create a credential certificate authority (root CA) and policy (issuing CA) scoped to that namespace.
1. Create an IoT hub (preview) with a linked namespace and managed identity.
1. Create a DPS instance with a linked IoT hub and namespace.
1. Sync your credential and policies (CA certificates) to IoT Hub.
1. Create an enrollment group and link to your policy to enable certificate provisioning.

> [!IMPORTANT]
> During the preview period, IoT Hub with Device Registry integration and certificate management features enabled on top of IoT Hub are available free of charge. Device provisioning service is billed separately and isn't included in the preview offer. For information on DPS pricing, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

## Prepare your environment

To prepare your environment to use Device Registry, follow these steps:

1. Open a terminal window.
1. To sign in to your Azure account, run `az login`.
1. To list all subscriptions and tenants to which you have access, run `az account list`.
1. If you have access to multiple Azure subscriptions, set your active subscription where your IoT devices are created by running the following command:

    ```azurecli-interactive
    az account set --subscription "<your subscription name or ID>"
    ```

1. To display your current account details, run `az account show`. Copy both of the following values from the output of the command, and save them to a safe location, such as:

    - The `id` GUID. You use this value to provide your subscription ID.
    - The `tenantId` GUID. You use this value to update your permissions by using the tenant ID.

## Configure your resource group, permissions, and managed identity

To create a resource group, role, and permissions for your IoT solution, follow these steps:

1. Create a resource group for your environment.

    ```azurecli-interactive
    az group create --name <RESOURCE_GROUP_NAME> --location <REGION>
    ```

1. Assign a Contributor role to IoT Hub on the resource group level. The `AppId` value, which is the principal ID for IoT Hub, is `89d10474-74af-4874-99a7-c23c2f643083`, and it's the same for all IoT Hub apps.

    ```azurecli-interactive
    az role assignment create --assignee "89d10474-74af-4874-99a7-c23c2f643083" --role "Contributor" --scope "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>"
    ```

1. Create a new user-assigned managed identity.

    ```azurecli-interactive
    az identity create --name <USER_IDENTITY> --resource-group <RESOURCE_GROUP_NAME> --location <REGION>
    ```

1. Retrieve the resource ID of the managed identity. You need the resource ID to assign roles, configure access policies, or link the identity to other resources.

    ```azurecli-interactive
    UAMI_RESOURCE_ID=$(az identity show --name <USER_IDENTITY> --resource-group <RESOURCE_GROUP_NAME> --query id -o tsv)
    ```

## Create a new Device Registry namespace

In this section, you create a new Device Registry namespace with a system-assigned managed identity. This process automatically generates a root CA credential and an issuing CA policy for the namespace. For more information on how credentials and policies are used to sign device leaf certificates during provisioning, see [Certificate management](../articles/iot-hub/iot-hub-certificate-management-overview.md).

Credentials are optional. You can also create a namespace without a managed identity by omitting the `--enable-certificate-management` and `--policy-name` flags.

1. Create a new Device Registry namespace. Your namespace `name` can contain only lowercase letters and hyphens (`-`) in the middle of the name, but not at the beginning or end. For example, the name `msft-namespace` is valid. The `--enable-certificate-management` command creates credential (root CA) and default policy (issuing CA) for this namespace. You can configure the name for this policy by using the `--policy-name` command. By default, a policy can issue certificates with a validity of 30 days.

    ```azurecli-interactive
    az iot adr ns create --name <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP_NAME> --location <REGION> --enable-certificate-management true --policy-name <POLICY_NAME>
    ```

    You can optionally create a custom policy by adding the `--cert-subject` and `--cert-validity-days` parameters. For more information, see [Create a custom policy](#create-a-custom-policy).

    The creation of the Device Registry namespace with system-assigned managed identity might take up to five minutes.

1. Verify that the namespace with a system-assigned managed identity, or principal ID, is created.

    ```azurecli-interactive
    az iot adr ns show --name <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP_NAME>
    ```

1. Verify that a credential and policy named are created.

    ```azurecli-interactive
    az iot adr ns credential show --namespace <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP_NAME>
    az iot adr ns policy show --namespace <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP_NAME> --name <POLICY_NAME>
    ```

    If you didn't assign a policy name, the policy is created with the name `default`.

## Assign a user-assigned managed identity role to access the Device Registry namespace

In this section, you assign the [Azure Device Registry Contributor](../articles/role-based-access-control/built-in-roles/internet-of-things.md#azure-device-registry-contributor) role to the managed identity and scope it to the namespace. This custom role allows for full access to IoT devices within the Device Registry namespace.

1. Retrieve the principal ID of the user-assigned managed identity. This ID is needed to assign roles to the identity.

    ```azurecli-interactive
    UAMI_PRINCIPAL_ID=$(az identity show --name <USER_IDENTITY> --resource-group <RESOURCE_GROUP> --query principalId -o tsv)
    ```

1. Retrieve the resource ID of the Device Registry namespace. This ID is used as the scope for the role assignment.

    ```azurecli-interactive
    NAMESPACE_RESOURCE_ID=$(az iot adr ns show --name <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP> --query id -o tsv)
    ```

1. Assign the [Azure Device Registry Contributor](../articles/role-based-access-control/built-in-roles/internet-of-things.md#azure-device-registry-contributor) role to the managed identity. This role grants the managed identity the necessary permissions that are scoped to the namespace.

    ```azurecli-interactive
    az role assignment create --assignee $UAMI_PRINCIPAL_ID --role "a5c3590a-3a1a-4cd4-9648-ea0a32b15137" --scope $NAMESPACE_RESOURCE_ID
    ```

## Create an IoT hub with Device Registry integration

1. Create a new IoT hub that's linked to the Device Registry namespace and with the user-assigned managed identity that you created earlier.

    ```azurecli-interactive
    az iot hub create --name <HUB_NAME> --resource-group <RESOURCE_GROUP> --location <HUB_LOCATION> --sku GEN2 --mi-user-assigned $UAMI_RESOURCE_ID --ns-resource-id $NAMESPACE_RESOURCE_ID --ns-identity-id $UAMI_RESOURCE_ID
    ```

    [!INCLUDE [iot-hub-pii-note-naming-hub](iot-hub-pii-note-naming-hub.md)]

1. Verify that the IoT hub has correct identity and Device Registry properties configured.

    ```azurecli-interactive
    az iot hub show --name <HUB_NAME> --resource-group <RESOURCE_GROUP> --query identity --output json
    ```

## Assign IoT Hub roles to access the Device Registry namespace

1. Retrieve the principal ID of the Device Registry namespace's managed identity. This identity needs permissions to interact with the IoT hub.

    ```azurecli-interactive
    ADR_PRINCIPAL_ID=$(az iot adr ns show --name <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP> --query identity.principalId -o tsv)
    ```

1. Retrieve the resource ID of the IoT hub. This ID is used as the scope for role assignments.

    ```azurecli-interactive
    HUB_RESOURCE_ID=$(az iot hub show --name <HUB_NAME> --resource-group <RESOURCE_GROUP> --query id -o tsv)
    ```

1. Assign the Contributor role to the Device Registry identity. This role grants the Device Registry namespace's managed identity Contributor access to the IoT hub. The role allows broad access, including managing resources, but not assigning roles.

    ```azurecli-interactive
    az role assignment create --assignee $ADR_PRINCIPAL_ID --role "Contributor" --scope $HUB_RESOURCE_ID
    ```

1. Assign the IoT Hub Registry Contributor role to the Device Registry identity. This role grants more specific permissions to manage device identities in the IoT hub. These permissions are essential for Device Registry to register and manage devices in the hub.

    ```azurecli-interactive
    az role assignment create --assignee $ADR_PRINCIPAL_ID --role "IoT Hub Registry Contributor" --scope $HUB_RESOURCE_ID
    ```

## Create a DPS instance with Device Registry integration

1. Create a new DPS instance linked to your Device Registry namespace that you created in the previous sections. Your DPS instance must be located in the same region as your Device Registry namespace.

    ```azurecli-interactive
    az iot dps create --name <DPS_NAME> --resource-group <RESOURCE_GROUP> --location <LOCATION> --mi-user-assigned $UAMI_RESOURCE_ID --ns-resource-id $NAMESPACE_RESOURCE_ID --ns-identity-id $UAMI_RESOURCE_ID
    ```

1. Verify that DPS has the correct identity and Device Registry properties configured.

    ```azurecli-interactive
    az iot dps show --name <DPS_NAME> --resource-group <RESOURCE_GROUP> --query identity --output json
    ```

## Link your IoT hub to the DPS instance

1. Link the IoT hub to your DPS instance.

    ```azurecli-interactive
    az iot dps linked-hub create --dps-name <DPS_NAME> --resource-group <RESOURCE_GROUP> --hub-name <HUB_NAME>
    ```

1. Verify that the IoT hub appears in the list of linked hubs for the DPS instance.

    ```azurecli-interactive
    az iot dps linked-hub list --dps-name <DPS_NAME> --resource-group <RESOURCE_GROUP>
    ```

## Run Device Registry credential synchronization

Synchronize your credential and policies to the IoT hub. This step ensures that the IoT hub registers the CA certificates and trusts any leaf certificates issued by your configured policies.

```azurecli-interactive
az iot adr ns credential sync --namespace <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP>
```

## Validate the hub CA certificate

Validate that your IoT hub registered its CA certificate.

```azurecli-interactive
az iot hub certificate list --hub-name <HUB_NAME> --resource-group <RESOURCE_GROUP>
```

## Create an enrollment in DPS

To provision devices by using leaf certificates, create an enrollment group in DPS and assign it to the appropriate credential policy with the `--credential-policy` parameter.

The following command creates an enrollment group that uses symmetric key attestation by default:

> [!NOTE]
> If you create a policy with a different name from `default`, ensure that you use the policy name after the `--credential-policy` parameter.

```azurecli-interactive
az iot dps enrollment-group create --dps-name <DPS_NAME> --resource-group <RESOURCE_GROUP> --enrollment-id <ENROLLMENT_ID> --credential-policy <POLICY_NAME>
```

Your IoT hub with Device Registry integration and certificate management is now set up and ready to use.

## Optional commands

The following commands help you manage your Device Registry namespaces, disable devices, create custom policies, and delete resources when they're no longer needed.

### Manage your namespaces

1. List all the namespaces in your resource group.

    ```azurecli-interactive
    az iot adr ns list --resource-group <RESOURCE_GROUP_NAME>
    ```

1. Show the details of a specific namespace.

    ```azurecli-interactive
    az iot adr ns show --name <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP_NAME>
    ```

1. List all the policies in your namespace.

    ```azurecli-interactive
    az iot adr ns policy list --namespace <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP_NAME>
    ```

1. Show the details of a specific policy.

    ```azurecli-interactive
    az iot adr ns policy show --namespace <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP_NAME> --name <POLICY_NAME>
    ```

1. List all the credentials in your namespace.

    ```azurecli-interactive
    az iot adr ns credential list --namespace <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP_NAME>
    ```

### Disable devices

1. List all the devices in your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity list --hub-name <HUB_NAME> --resource-group <RESOURCE_GROUP_NAME>
    ```

1. Disable a device by updating its status to `disabled`. Make sure to replace `<MY_DEVICE_ID>` with the device ID that you want to disable.

    ```azurecli-interactive
    az iot hub device-identity update --hub-name <HUB_NAME> --resource-group <RESOURCE_GROUP_NAME> -d <MY_DEVICE_ID> --status disabled
    ```

1. Run the device again and verify that it's unable to connect to an IoT hub.

### Create a custom policy

Create a custom policy by using the `az iot adr ns policy create` command. Set the name, certificate subject, and validity period for the policy by following these rules:

- The policy `name` value must be unique within the namespace. If you try to create a policy with a name that already exists, you receive an error message.
- The certificate subject `cert-subject` value must be unique across all policies in the namespace. If you try to create a policy with a subject that already exists, you receive an error message.
- The validity period `cert-validity-days` value must be between 1 and 30 days. If you try to create a policy with a validity period outside this range, you receive an error message.

The following example creates a policy named `custom-policy` with a subject of `CN=TestDevice` and a validity period of 30 days.

```azurecli-interactive
az iot adr ns policy create --name "custom-policy" --namespace <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP_NAME> --cert-subject "CN=TestDevice" --cert-validity-days "30"
```

### Delete resources

To delete your Device Registry namespace, you must first delete any IoT hubs that are linked to the namespace.

```azurecli-interactive
az iot hub delete --name <HUB_NAME> --resource-group <RESOURCE_GROUP_NAME>
az iot adr ns delete --name <NAMESPACE_NAME> --resource-group <RESOURCE_GROUP_NAME>
az iot dps delete --name <DPS_NAME> --resource-group <RESOURCE_GROUP_NAME> 
az identity delete --name <USER_IDENTITY> --resource-group <RESOURCE_GROUP_NAME>
```