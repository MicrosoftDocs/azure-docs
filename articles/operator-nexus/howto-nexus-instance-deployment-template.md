---
title: "Azure Operator Nexus: Nexus Instance Deployment Template"
description: Learn the process for deploying a Nexus instance with a step-by-step parameterized template.
author: bartpinto 
ms.author: bpinto
ms.service: azure-operator-nexus
ms.date: 04/25/2025
ms.topic: how-to
ms.custom: azure-operator-nexus, template-include
---

# Nexus Instance deployment template

This how-to guide provides a step-by-step template for deploying a Nexus Instance.

## Overview
<details>
<summary> Overview of Nexus Instance deployment template </summary>
 
This template is designed to assist users in managing a reproducible end-to-end deployment through Azure APIs and standard operating procedures.

</details>

## Prerequisites
<details>
<summary> Prerequisites for using this template to deploy a Nexus Instance </summary>

- Latest version of [Azure CLI](https://aka.ms/azcli).
- Latest `managednetworkfabric` [CLI extension](howto-install-cli-extensions.md).
- Latest `networkcloud` [CLI extension](howto-install-cli-extensions.md).
- Subscription access to run the Azure Operator Nexus Network Fabric (NF) and Network Cloud (NC) CLI extension commands.
- Nexus Instance data for the [Telco Input Template](concepts-telco-input-template.md).
- [Platform Prerequisites](howto-platform-prerequisites.md).

</details>

## Required parameters
<details>
<summary> Parameters used in this document </summary>

- \<ENVIRONMENT\>: Instance name
- <AZURE_REGION>: Azure Region of Instance
- <CUSTOMER_SUB_NAME>: Subscription name
- <CUSTOMER_SUB_ID>: Subscription ID
- <CUSTOMER_SUB_TENANT_ID>: Tenant ID (from `az account show`)
- \<NEXUS_VERSION\>: Nexus release version (for example, 2504.1)
- <NNF_VERSION>: Nexus Network Fabric (NNF) release version (for example, 8.1) 
- <NF_VERSION>: Network Fabric (NF) runtime version (for example, 5.0.0)
- <NC_VERSION>: Network Cloud (NC) release version (for example, 4.2.5)
- <NFC_NAME>: Associated Network Fabric Controller (NFC) name
- <NFC_RG>: NFC Resource Group
- <NFC_RID>: NFC ARM ID
- <NFC_MRG>: NFC Managed Resource Group
- <NFC_SUBNET>: Subnet range for the NFC
- <NF_NAME>: NF name
- <NF_RG>: NF Resource Group
- <NF_RID>: NF ARM ID
- <NF_MGMT_SUBNET>: NF management subnet range
- <NF_IDRAC_SUBNET>: NF IDRAC subnet range
- <NF_DEVICE_NAME>: NF Device name
- <NF_DEVICE_RID>: NF Device Resource ID
- <NF_DEVICE_INTERFACE_NAME>: NF Device Interface name
- <NF_DEVICE_HOSTNAME>: NF Device hostname
- <NF_DEVICE_SN>: NF Device serial number
- <CM_NAME>: Associated Cluster Manager (CM)
- <CM_RG>: CM Resource Group
- <CLUSTER_NAME>: Associated Cluster name
- <CLUSTER_RG>: Cluster Resource Group (RG)
- <CLUSTER_RID>: Cluster ARM ID
- <CLUSTER_MRG>: Cluster Managed Resource Group
- <CLUSTER_CONTROL_BMM>: Cluster Control plane Bare Metal Machine (BMM)
- <CLUSTER_DEPLOY_GROUPING>: Cluster deployment grouping
- <CLUSTER_DEPLOY_TYPE>: Cluster deployment type
- <CLUSTER_DEPLOY_THRESHOLD>: Cluster deployment threshold
- <DEPLOYMENT_THRESHOLD>: Compute deployment threshold
- <DEPLOYMENT_PAUSE_MINS>: Time to wait before moving to the next Rack once the current Rack meets the deployment threshold
- <MISE_CID>: Microsoft.Identity.ServiceEssentials (MISE) Correlation ID in debug output for Device updates
- <CORRELATION_ID>: Operation Correlation ID in debug output for Device updates
- <ASYNC_URL>: Asynchronous (ASYNC) URL in debug output for Device updates
- <LINK_TO_TELCO_INPUT>: Link to the Instance Telco Input file

</details>

## Deployment Data
<details>
<summary> Deployment data details </summary>

```
- Nexus: <NEXUS_VERSION>
- NC: <NC_VERSION>
- NF: <NF_VERSION>
- Subscription Name: <CUSTOMER_SUB_NAME>
- Subscription ID: <CUSTOMER_SUB_ID>
- Tenant ID: <CUSTOMER_SUB_TENANT_ID>
- Telco Input: <LINK_TO_TELCO_INPUT>
```

</details>

## Debug information for Azure CLI commands
<details>
<summary> How to collect debug information for Azure CLI commands </summary>

Azure CLI deployment commands issued with `--debug` contain the following information in the command output:
```
cli.azure.cli.core.sdk.policies:     'mise-correlation-id': '<MISE_CID>'
cli.azure.cli.core.sdk.policies:     'x-ms-correlation-request-id': '<CORRELATION_ID>'
cli.azure.cli.core.sdk.policies:     'Azure-AsyncOperation': '<ASYNC_URL>'
```

To view status of long running asynchronous operations, run the following command with `az rest`:
```
az rest -m get -u '<ASYNC_URL>'
```

Command status information is returned along with detailed informational or error messages:
- `"status": "Accepted"`
- `"status": "Succeeded"`
- `"status": "Failed"`

If any failures occur, report the <MISE_CID>, <CORRELATION_ID>, status code, and detailed messages when opening a support request.

</details>

## Deploy NFC (skip section if NFC already exists)
<details>
 <summary> Detailed steps for deploying NFC </summary>

### Create NFC
1. Create group if it doesn't exist from Azure CLI:
   ```
   az group list --query "[?location=='<AZURE_REGION>'] | [?contains(name,'<NFC_RG>')]" --subscription <CUSTOMER_SUB_ID> -o table
   az group create -l <AZURE_REGION> -n <NFC_RG> --subscription <CUSTOMER_SUB_ID>
   ```

2. Check if NFC already exists from Azure CLI:
   ```
   az networkfabric controller show --resource-group <NFC_RG> --resource-name <NFC_NAME> --subscription <CUSTOMER_SUB_ID> -o table
   Code: ResourceNotFound
   ```

   > [!IMPORTANT]
   > Don't continue if NFC already exists for <NFC_NAME>.

3. Create NFC from Telco Input template (skip for existing NFC) with Azure CLI:
   ```
   az networkfabric controller create --resource-group <NFC_RG> --subscription <CUSTOMER_SUB_ID> --location <AZURE_REGION> \
     --resource-name <NFC_NAME> --ipv4-address-space "<NFC_IPV4>/<NFC_IPV4_CIDR>" --ipv6-address-space "<NFC_IPV6>/<NFC_IPV6_CIDR>" \
     --infra-er-connections '[{"expressRouteCircuitId": "<MGMT_ER1_RID>", "expressRouteAuthorizationKey": "<MGMT_AUTH_1>"}, \
       {"expressRouteCircuitId": "<MGMT_ER2_RID>", "expressRouteAuthorizationKey": "<MGMT_AUTH_2>"}]' \
     --workload-er-connections '[{"expressRouteCircuitId": "<TNT_ER1_RID>", "expressRouteAuthorizationKey": "<TNT_AUTH_1>"}, \
       {"expressRouteCircuitId": "<TNT_ER2_RID>", "expressRouteAuthorizationKey": "<TNT_AUTH_2>"}]' \
     --mrg name=<NFC_MRG> location=<AZURE_REGION> --debug --no-wait
   ```

   > [!NOTE]
   > NFC creation can take up to 1 hour.

4. Check statuses of the NFC and the NFC `customlocation` are both `Succeeded` from Azure CLI:
   ```
   az networkfabric controller show --resource-group <NFC_RG> --resource-name <NFC_NAME> --subscription <CUSTOMER_SUB_ID> -o table

   az networkfabric controller list --subscription <CUSTOMER_SUB_ID> -o table
   az vm list -o table --query "[?location=='<AZURE_REGION>']" --subscription <CUSTOMER_SUB_ID>

   az customlocation list -o table --query "[?location=='<AZURE_REGION>']" | grep <NFC_NAME> --subscription <CUSTOMER_SUB_ID>
   ```

5. Verify NFC subnets are created:

   Check in Azure portal:
   `Network Fabric Controllers (Operator Nexus)` -> <NFC_NAME> -> <NFC_MRG> -> `networkfabric-infravnet` -> `Subnets`

   Check with Azure CLI:
   ```
   az network vnet subnet list --vnet-name networkfabric-infravnet -g <NFC_MRG> --subscription <CUSTOMER_SUB_ID> -o table
   <NFC_SUBNET>.<+0>.0/24  nfc-aks-subnet    Disabled  Enabled   Succeeded <NFC_MRG>
   <NFC_SUBNET>.<+1>.0/24  GatewaySubnet        Disabled  Enabled   Succeeded <NFC_MRG>
   <NFC_SUBNET>.<+2>.0/23  infra-proxy-subnet   Disabled  Enabled   Succeeded <NFC_MRG>
   <NFC_SUBNET>.<+7>.0/24  private-link-subnet  Disabled  Enabled   Succeeded <NFC_MRG>  PrivateEndpoints
   <NFC_SUBNET>.<+4>.0/24  clustermanager-subnet  Disabled  Disabled  Succeeded <NFC_MRG>
   ```

6. Check ER connections are `Status: Succeeded`:

   Check in Azure portal:
   `Network Fabric Controllers (Operator Nexus)` -> <NFC_NAME> -> <NFC_MRG> -> <NF_ER_CONNECTIONS>

   Check with Azure CLI:
   ```
   az network vpn-connection list -g <NFC_MRG> --subscription <CUSTOMER_SUB_ID> -o table
   ```

</details>

## Deploy CM (skip section if CM already exists)
<details>
 <summary> Detailed Steps for deploying a CM </summary>

### Create CM
1. Create group if it doesn't exist from Azure CLI:
   ```
   az group list --query "[?location=='<AZURE_REGION>'] | [?contains(name,'<CM_RG>')]" --subscription <CUSTOMER_SUB_ID> -o table
   az group create -l <AZURE_REGION> -n <CM_RG> --subscription <CUSTOMER_SUB_ID>
   ```
   
2. Check if CM already exists from Azure CLI:
   ```
   az networkcloud clustermanager show --subscription <CUSTOMER_SUB_ID> -n <CM_NAME> -g <CM_RG> -o table
   Code: ResourceNotFound
   ```

   > [!IMPORTANT]
   > Don't continue if a CM already exists for <CM_NAME>.

3. Create CM from Telco Input template (skip for existing CM) with ARM Deployment from Azure CLI:
   ```
   az deployment sub create --name <CM_NAME>-deployment --subscription <CUSTOMER_SUB_ID> --location <AZURE_REGION> --template-file "clusterManager.jsonc" \
     --parameters "clusterManager.parameters.jsonc" --debug --no-wait
   ```

   Follow these links for the structure of the ARM template and parameters files for the CM:
   - [`clusterManager.jsonc`](clustermanager-jsonc-example.md)
   - [`clusterManager.parameters.jsonc`](clustermanager-parameters-jsonc-example.md)

4. Check status of CM for `Succeeded` from Azure CLI:
   ```
   az networkcloud clustermanager list --subscription <CUSTOMER_SUB_ID> -o table
   ```
   
</details>

## Deploy Fabric
<details>
 <summary> Detailed Steps for deploying a Fabric </summary>

### Create Fabric

1. Create group if it doesn't exist from Azure CLI:
   ```
   az group list --query "[?location=='<AZURE_REGION>'] | [?contains(name,'<NF_RG>')]" --subscription <CUSTOMER_SUB_ID> -o table
   az group create -l <AZURE_REGION> -n <NF_RG> --subscription <CUSTOMER_SUB_ID>
   ```

2. Check if Fabric custom location already exists from Azure CLI:
   ```
   az customlocation list --subscription <CUSTOMER_SUB_ID> -o table | grep <NF_NAME>
   ```

   > [!IMPORTANT]
   > Don't continue if a Fabric custom location already exists for <NF_NAME>.

3. Check if Fabric already exists from Azure CLI:
   ```
   az networkfabric fabric show --resource-group <NF_RG> --resource-name <NF_NAME> --subscription <CUSTOMER_SUB_ID> -o table
   Code: ResourceNotFound
   ```
   > [!IMPORTANT]
   > Don't continue if a Fabric already exists for <NF_NAME>.
   
4. Create Fabric from Telco Input template with Azure CLI:
   ```
   az networkfabric fabric create --resource-group <NF_RG> --subscription <CUSTOMER_SUB_ID> --location <AZURE_REGION> --resource-name <NF_NAME> \
     --nf-sku <NF_SKU> --nfc-id </subscriptions/<CUSTOMER_SUB_ID>/resourceGroups/<NFC_RG>/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/<NFC_NAME> \
     --fabric-asn <NF_ASN> --fabric-version <NF_VER> --ipv4-prefix "<MGMT_IPV4>/<MGMT_IPV4_CIDR>" --ipv6-prefix "<MGMT_IPV6>/<MGMT_IPV6_CIDR>" --rack-count <RACK_COUNT> \
     --server-count-per-rack <SERVERS_PER_RACK> --ts-config '{"primaryIpv4Prefix": "<TS_IPV4_1>/<TS1_IPV4_1_CIDR>", "secondaryIpv4Prefix": "<TS_IPV4_2>/<TS1_IPV4_2_CIDR>", \
       "username": "<TS_USER>", "password": "<TS_PASSWORD?", "serialNumber": "<TS_SERIAL>", "primaryIpv6Prefix": "<TS_IPV6_1>/<TS1_IPV6_1_CIDR>", "secondaryIpv6Prefix": "<TS_IPV6_2>/<TS1_IPV6_2_CIDR>"}' \
     --managed-network-config '{"infrastructureVpnConfiguration": {"peeringOption": "OptionA", "optionAProperties": {"mtu": "<MGMT_OPA_MTU>", "vlanId": "<MGMT_OPA_VLANID>", \
       "peerASN": "<MGMT_OPA_PEERASN>", "primaryIpv4Prefix": "<MGMT_OPA_PRIMARYIPV4PREFIX>", "secondaryIpv4Prefix": "<MGMT_OPA_SECONDARYIPV4PREFIX>"}}, \
       "workloadVpnConfiguration": {"peeringOption": "OptionA", "optionAProperties": {"mtu": "<TENANT_OPA_MTU>", "vlanId": "<TENANT_OPA_VLANID>", "peerASN": "<TENANT_OPA_PEERASN>", \
       "primaryIpv4Prefix": "<TENANT_OPA_PRIMARYIPV4PREFIX>", "secondaryIpv4Prefix": "<TENANT_OPA_SECONDARYIPV4PREFIX>", "primaryIpv6Prefix": "<TENANT_OPA_PRIMARYIPV6PREFIX>", \
       "secondaryIpv6Prefix": "<TENANT_OPA_SECONDARYIPV6PREFIX>"}}}' --debug --no-wait
   ```

5. Check status of Fabric for `Succeeded` from Azure CLI:
   ```
   az networkfabric fabric show --resource-group <NF_RG> --resource-name <NF_NAME> --subscription <CUSTOMER_SUB_ID> -o table
   az networkfabric fabric list --subscription <CUSTOMER_SUB_ID> -o table
   ```

6. Create Ingress and Egress Access Control List (ACL) resources if using ACL from Azure CLI:
   ```
   az rest  --subscription <CUSTOMER_SUB_ID> -m put --url /subscriptions/<CUSTOMER_SUB_ID>/resourceGroups/<NF_RG>/providers/Microsoft.ManagedNetworkFabric/accessControlLists/<NNI_1_INGRESS_ACL_1_NAME>?api-version=2023-06-15 --body @<NNI_1_INGRESS_ACL_1_NAME>.json
   az rest  --subscription <CUSTOMER_SUB_ID> -m put --url /subscriptions/<CUSTOMER_SUB_ID>/resourceGroups/<NF_RG>/providers/Microsoft.ManagedNetworkFabric/accessControlLists/<NNI_1_EGRESS_ACL_1_NAME>?api-version=2023-06-15 --body @<NNI_1_EGRESS_ACL_1_NAME>.json
   ```
   For more information on creating ACLs, see [how to create ACL for NNI](howto-create-access-control-list-for-network-to-network-interconnects.md).
   
7. Create Network-to-Network Interface (NNI) resource with Azure CLI:
   ```
   az networkfabric nni create --resource-group <NF_RG> --subscription <CUSTOMER_SUB_ID> --resource-name <NNI_1_NAME> --fabric <NF_NAME> --is-management-type "True" --use-option-b "False" \
     --layer2-configuration '{"interfaces": \
       ["/subscriptions/<CUSTOMER_SUB_ID>/resourceGroups/<NF_RG>/providers/Microsoft.ManagedNetworkFabric/networkDevices/<NF_NAME>-AggrRack-CE1/networkInterfaces/<NNI1_L2_CE1_INT_1>", \
       "/subscriptions/<CUSTOMER_SUB_ID>/resourceGroups/<NF_RG>/providers/Microsoft.ManagedNetworkFabric/networkDevices/<NF_NAME>-AggrRack-CE2/networkInterfaces/<NNI1_L2_CE2_INT_1>"], \
       "mtu": "<NNI1_L2_MTU>"}' --option-b-layer3-configuration '{"peerASN": "<NNI1_PEER_ASN>", "vlanId": "<NNI1_L3_VLAN_ID>", "primaryIpv4Prefix": "<NNI1_L3_IPV4_1>/<NNI1_L3_IPV4_1_CIDR>", \
       "secondaryIpv4Prefix": "<NNI1_L3_IPV4_2>/<NNI1_L3_IPV4_2_CIDR>"}' \
     --ingress-acl-id "/subscriptions/<CUSTOMER_SUB_ID>/resourceGroups/<NF_RG>/providers/Microsoft.ManagedNetworkFabric/accessControlLists/<NNI_1_INGRESS_1_ACL_NAME>" \
     --egress-acl-id "/subscriptions/<CUSTOMER_SUB_ID>/resourceGroups/<NF_RG>/providers/Microsoft.ManagedNetworkFabric/accessControlLists/<NNI_1_INGRESS_1_ACL_NAME>" --debug --no-wait
   ```

8. Check status of Fabric for `Succeeded` from Azure CLI:
   ```
   az networkfabric nni list -g <NF_RG> --fabric <NF_NAME> --subscription <CUSTOMER_SUB_ID>
   az networkfabric nni list -g <NF_RG> --fabric <NF_NAME> --subscription <CUSTOMER_SUB_ID> -o table
   ```
   
9. Update Device Names and Serial Numbers for all Devices with Azure CLI:
   ```
   az networkfabric device update  --subscription <CUSTOMER_SUB_ID> --resource-group <NF_RG> --resource-name <NF_NAME>-AggrRack-CE1 --host-name <CE1_HOSTNAME> \
     --serial-number "<CE1_HW_VENDOR>;<CE1_HW_MODEL>;<CE1_HW_VER>;<CE1_SN>" --debug --no-wait
   # Repeat for each device in Network Fabric Device list
   ```

10. Verify all Devices are created and configured from Azure CLI:
   ```
   az networkfabric device list --resource-group <NF_RG> --subscription <CUSTOMER_SUB_ID> -o table
   ```
   
### Provision Fabric
1. Verify Fabric ProvisioningState is `Succeeded` from Azure CLI:
   ```
   az networkfabric fabric list --resource-group <NF_RG> --subscription <CUSTOMER_SUB_ID> -o table
   ```

2. Provision fabric with Azure CLI:
   ```
   az networkfabric fabric provision --resource-group <NF_RG> --resource-name <NF_NAME> --subscription <CUSTOMER_SUB_ID> --debug --no-wait
   ```

3. Check provisioning status of Fabric is `Provisioned` from Azure CLI:
   ```
   az networkfabric fabric list --resource-group <NF_RG> --subscription <CUSTOMER_SUB_ID> -o table
   ```

</details>

## Deploy Cluster
<details>
 <summary> Detailed steps for deploying a Cluster </summary>

### Create Cluster
1. Create group if it doesn't exist from Azure CLI:
   ```
   az group list --query "[?location=='<AZURE_REGION>'] | [?contains(name,'<CLUSTER_RG>')]" --subscription <CUSTOMER_SUB_ID> -o table
   az group create -l <AZURE_REGION> -n <CLUSTER_RG> --subscription <CUSTOMER_SUB_ID>
   ```

2. Check if Cluster already exists from Azure CLI:   
   ```
   az networkcloud cluster list --subscription <CUSTOMER_SUB_ID> -o table
   ```

   > [!IMPORTANT]
   > Don't continue if a Cluster already exists for <CLUSTER_NAME>.
   
3. Create Cluster from Telco Input template with ARM Deployment from Azure CLI:
   ```
   az deployment sub create --name <CLUSTER_NAME>-deployment --subscription <CUSTOMER_SUB_ID> --location <REGION> --template-file "cluster.jsonc" --parameters "cluster.parameters.jsonc" --debug --no-wait
   ```
   Follow these links for the structure of the ARM template and parameters files for the Cluster:
   - [`cluster.jsonc`](cluster-jsonc-example.md)
   - [`cluster.parameters.jsonc`](cluster-parameters-jsonc-example.md)
     
4. Verify Cluster `Provisioning state` is `Succeeded` from Azure CLI:
   ```
   az networkcloud cluster list --subscription <CUSTOMER_SUB_ID> -o table
   ```
   
5. Update deployment threshold to custom value with Azure CLI (if desired threshold is different from default of 80%):
   ```
   az networkcloud cluster update --name <CLUSTER_NAME> --resource-group <CLUSTER_RG> --subscription <CUSTOMER_SUB_ID> --compute-deployment-threshold type=<CLUSTER_DEPLOY_TYPE> grouping=<CLUSTER_DEPLOY_GROUPING> value=<CLUSTER_DEPLOY_THRESHOLD>

   # Validate update:
   az networkcloud cluster show -g <CLUSTER_RG> -n <CLUSTER_NAME> --subscription <CUSTOMER_SUB_ID> | grep -a3 computeDeploymentThreshold
   
     "clusterType": "MultiRack",
     "clusterVersion": "<CLUSTER_VERSION>",
     "computeDeploymentThreshold": {
       "grouping": "<CLUSTER_DEPLOY_GROUPING>",
       "type": "<CLUSTER_DEPLOY_TYPE>",
       "value": <CLUSTER_DEPLOY_THRESHOLD>
   ```

### Deploy Cluster

To initiate Cluster deployment through Azure portal:
Azure portal -> `Clusters (Operator Nexus)` -> `<CLUSTER_NAME>` -> `Deploy`

To initiate Cluster deployment through Azure CLI:
```
az networkcloud cluster deploy --resource-group <CLUSTER_RG> --name <CLUSTER_NAME> --subscription <CUSTOMER_SUB_ID> --no-wait --debug
```

### Order of deployment
1. Validate Baseboard Management Controller (BMC) connection strings
2. Power down all servers
3. Validate hardware
4. Generate bootstrap image
5. Bootstrap  ephemeral node
6. Reboot servers and perform `racreset`
7. Upgrade firmware, configure RAID and, configure BIOS settings on control BMM
8. Provision Kubernetes Control Plane (KCP) and provision Nexus Management Plane (NMP)
9. Move KCP from ephemeral to on-premises BMM
10. Generate Infrastructure L2 Isolation Domains (ISD)
11. Bootstrap cluster and connect to Azure
12. Hydrate cluster into Azure
13. Deploy Workers until deployment threshold met
14. Configure Storage Appliance

### Monitor Cluster deployment

Monitor Cluster deployment progress in Azure portal or CLI.

To monitor in Azure portal:
Azure portal -> `Clusters (Operator Nexus)` -> `<CLUSTER_NAME>` -> Overview-> "Detailed status message"

To monitor through Azure CLI:
```
// Monitor detailed cluster status and update every 5 mins 
watch -n 300 'az networkcloud cluster show --resource-group <CLUSTER_RG> --name <CLUSTER_NAME> --subscription <CUSTOMER_SUB_ID> -o table'
```

Follow link to troubleshoot all [BMM that fail hardware validation](troubleshoot-hardware-validation-failure.md).
- KCP/MNP nodes that fail hardware validation cause Cluster deployment to fail.
- BMMs that fail hardware validation cause Cluster deployment to fail if not enough BMMs are available to pass the deployment threshold.

> [!IMPORTANT]
> If the Cluster deployment reaches the time out threshold, the status moves to `Failed`. Failure can occur if any KCP or NMP BMM fail hardware validation, or too many compute BMM fail hardware validations.
> Once hardware issues are fixed, delete the Cluster, re-create, and then retry the Cluster deploy action.

### Monitor provisioning of BMM
Monitor BMM provisioning progress in Azure portal or CLI.

To monitor in Azure portal:
Azure portal -> `Bare Metal Machines (Operator Nexus)` -> `<BMM_NAME>` -> Overview

To monitor through Azure CLI:
```
az networkcloud baremetalmachine list -g <CLUSTER_MRG> --subscription <CUSTOMER_SUB_ID> --query "sort_by([]. {name:name,kubernetesNodeName:kubernetesNodeName,location:location,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,cordonStatus:cordonStatus,powerState:powerState,machineRoles:machineRoles| join(', ', @),createdAt:systemData.createdAt}, &name)" -o table
```

### BMM provisioning lifecycle
- Registering -> Preparing -> Inspecting -> Available -> Provisioning -> Provisioned -> Ready

BMM provisioning is complete when the following conditions are met:
   - Provisioning State = `Succeeded`
   - Detailed Status = `Provisioned`
   - Cordon Status = `Uncordoned`
   - Ready State = `True`

</details>

## Post-deployment tasks
<details>
 <summary> Detailed steps for post-deployment tasks </summary>

### Review Operator Nexus release notes
Review the Operator Nexus release notes for any version specific actions required post-deployment.

### Validate Nexus Instance

Validate the health and status of all the Nexus Instance resources created during deployment with the [Nexus Instance Readiness Test (IRT)](howto-run-instance-readiness-testing.md).

To perform a resource validation of the Nexus Instance components post-deployment through Azure CLI:
```
# Check `ProvisioningState = Succeeded` in all resources

# NFC
az networkfabric controller list -g <NFC_RG> --subscription <CUSTOMER_SUB_ID> -o table
az customlocation list -g <NFC_MRG> --subscription <CUSTOMER_SUB_ID> -o table

# Fabric
az networkfabric fabric list -g <NF_RG> --subscription <CUSTOMER_SUB_ID> -o table
az networkfabric rack list -g <NF_RG> --subscription <CUSTOMER_SUB_ID> -o table
az networkfabric fabric device list -g <NF_RG> --subscription <CUSTOMER_SUB_ID> -o table
az networkfabric nni list -g <NF_RG> --fabric <NF_NAME> --subscription <CUSTOMER_SUB_ID> -o table
az networkfabric acl list -g <NF_RG> --fabric <NF_NAME> --subscription <CUSTOMER_SUB_ID> -o table
az networkfabric l2domain list -g <NF_RG> --fabric <NF_NAME> --subscription <CUSTOMER_SUB_ID> -o table

# CM
az networkcloud clustermanager list -g <CM_RG> --subscription <CUSTOMER_SUB_ID> -o table

# Cluster
az networkcloud cluster list -g <CLUSTER_RG> --subscription <CUSTOMER_SUB_ID> -o table
az networkcloud baremetalmachine list -g <CLUSTER_MRG> --subscription <CUSTOMER_SUB_ID> --query "sort_by([]. {name:name,kubernetesNodeName:kubernetesNodeName,location:location,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,cordonStatus:cordonStatus,powerState:powerState,machineRoles:machineRoles| join(', ', @),createdAt:systemData.createdAt}, &name)" -o table
az networkcloud storageappliance list -g <CLUSTER_MRG> --subscription <CUSTOMER_SUB_ID> -o table

# Tenant Workloads
az networkcloud virtualmachine list --sub <CUSTOMER_SUB_ID> --query "reverse(sort_by([?clusterId=='<CLUSTER_RID>'].{name:name, createdAt:systemData.createdAt, resourceGroup:resourceGroup, powerState:powerState, provisioningState:provisioningState, detailedStatus:detailedStatus,bareMetalMachineId:bareMetalMachineIdi,CPUCount:cpuCores, EmulatorStatus:isolateEmulatorThread}, &createdAt))" -o table
az networkcloud kubernetescluster list --sub <CUSTOMER_SUB_ID> --query "[?clusterId=='<CLUSTER_RID>'].{name:name, resourceGroup:resourceGroup, provisioningState:provisioningState, detailedStatus:detailedStatus, detailedStatusMessage:detailedStatusMessage, createdAt:systemData.createdAt, kubernetesVersion:kubernetesVersion}" -o table
```

> [!Note]
> IRT validation provides a complete functional test of networking and workloads across all components of the Nexus Instance. Simple validation does not provide functional testing.

</details>

## Links
<details>
<summary> Reference Links for Nexus Instance deployment </summary>

Reference links for deploying a Nexus Instance:
- Access the [Azure portal](https://aka.ms/nexus-portal)
- Access the [Azure portal ARM Template Editor](https://portal.azure.com/#create/Microsoft.Template)
- [Install Azure CLI](https://aka.ms/azcli)
- [Install CLI Extension](howto-install-cli-extensions.md)
- [Troubleshoot hardware validation failure](troubleshoot-hardware-validation-failure.md)
- [Troubleshoot BMM provisioning](troubleshoot-bare-metal-machine-provisioning.md)
- [Troubleshoot BMM provisioning](troubleshoot-bare-metal-machine-provisioning.md)
- [Troubleshoot BMM degraded](troubleshoot-bare-metal-machine-degraded.md)
- [Troubleshoot BMM warning](troubleshoot-bare-metal-machine-warning.md)
- Reference the [Nexus Telco Input Template](concepts-telco-input-template.md)
- Reference the [Nexus Platform Prerequisites](howto-platform-prerequisites.md)
- Create a [Network Fabric ACL](howto-create-access-control-list-for-network-to-network-interconnects.md)
- Reference the [Nexus Instance Readiness Test (IRT)](howto-run-instance-readiness-testing.md)

</details>
