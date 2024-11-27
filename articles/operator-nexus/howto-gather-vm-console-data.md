---
title: "Azure Operator Nexus: Gather VM Console Data"
description: Learn how to gather VM Console Data.
author: keithritchie
ms.author: keithritchie
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 11/26/2024
---

# Gathering Important Virtual Machine (VM) Console Data

The article provides generic guidance on how to collect data necessary for diagnosing VM console-related issues.

## Prerequisites to complete these procedures

In order to `ssh` to a virtual machine, you must have:

1. Created a `Private endpoint` connecting to the Cluster Manager's `Private link service`
1. Virtual machine instance with a given name
1. Created the corresponding Console with same name used for the virtual machine

## Data Collection

### Data needed by the VM Console service team for troubleshooting

If there's a problem that needs to further investigation by the VM Console service team, collect the following information to help them get started:

1. A detailed description of the problem and its affect to the customer.
1. Screenshots. The Azure portal is obviously a visual component. Try to get as much visual data as possible to describe the problem happening. Screenshots are often the best way to show the problem or how to reproduce the problem.
1. [Private Endpoint IP](#determining-the-private-endpoint-ip-address)
1. [Private Endpoint connectivity](#determining-the-private-endpoint-connectivity)
1. [Collecting Console Data](#collecting-the-console-data)

### Determining the private endpoint connectivity

1. Navigate to the Azure portal where customer's work environment is located.
1. Select the Private endpoint resource used for `ssh` to the virtual machine
   ![Private endpoint resource](./media/vm-console-ple-ip-1.png)
1. In the Private endpoint screen, select the `Private link resource`
   ![Private endpoint connectivity](./media/vm-console-ple-connectivity-1.png)
1. Capture screenshot of `Private link resource` screen. Example of screenshot provided.
   ![Private endpoint connectivity](./media/vm-console-ple-connectivity-2.png)
1. Confirm with the customer that `Private endpoint` is referencing the correct `Private Link Service`, as it's possible that customer might be using the wrong PLE when trying to `ssh` to a virtual machine.

### Determining the private endpoint IP address

1. Navigate to the Azure portal where customer's work environment is located.
1. Select the Private endpoint resource used for `ssh` to the virtual machine
   ![Private endpoint resource](./media/vm-console-ple-ip-1.png)
1. In the Private endpoint screen, select the `Network interface`
   ![Private endpoint network interface](./media/vm-console-ple-ip-2.png)
1. In that screen you'll find the `Private IPv4 address`, for example, `10.1.0.5`
   ![Private endpoint IP address](./media/vm-console-ple-ip-3.png)
1. Confirm with customer that whit IP address was in the `ssh` command, for example, `ssh -p 2222 <virtual machine access id>@10.1.0.5`

Another way to retrieve the Private endpoint IP addresses is using Azure CLI, as shown here.

```bash
ple_interface_ids=$(az network private-endpoint list --resource-group <ple resource group> --query "[].networkInterfaces[0].id" -o tsv)

for ple_interface_id in $ple_interface_ids; do
    ple_name=$(echo $ple_interface_id | awk -F/ '{print $NF}'| awk -F. '{print $1}')
    export sshmux_ple_ip=$(az network nic show --ids $ple_interface_id --query 'ipConfigurations[0].privateIPAddress' -o tsv)
    echo "ple name: ${ple_name}, ple ip: ${sshmux_ple_ip}"
done
```

In case the script option is used, ask the customer which private endpoint ip address was used.

### Collecting the Console data

1. Navigate to the Azure portal where the cluster manager is located.
1. Select on `Extended location` to view its extended locations.
   ![Cluster manager extended locations](./media/vm-console-resource-1.png)
1. Select the Console resource in question.
   ![Console to troubleshoot](./media/vm-console-resource-2.png)
1. Collect the data for the console resource to be investigated.
   1. Console `Enabled`
   1. Console `Expiration`
   1. Console `Ssh public key`
   1. Console `Virtual machine access ID
      ![Cluster manager extended locations](./media/vm-console-resource-3.png)

If the access to Azure portal isn't available, you may also to retrieve the Console data with `az networkcloud virtualmachine console show` command.

```bash
az networkcloud virtualmachine console show \
    --resource-group "${TARGET_RESOURCE_GROUP}" \
    --virtual-machine-name "${VM_NAME}"
```

Where:

- **TARGET_RESOURCE_GROUP** is the resource group where the customer's virtual machine was created
- **VM_NAME** is the name of the customer's virtual machine name
