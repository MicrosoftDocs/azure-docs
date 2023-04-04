---
title: Commission an AKS cluster 
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to commission the Azure Kubernetes Cluster on Azure Stack Edge to get it ready to deploy Azure Private 5G Core.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/30/2023
ms.custom: template-how-to 
zone_pivot_groups: ase-pro-version
---

# Commission the AKS cluster

The packet core instances in the Azure Private 5G Core service run on an Arc-enabled Azure Kubernetes Service (AKS) cluster on an Azure Stack Edge (ASE) device. This how-to guide shows how to commission the AKS cluster on ASE so that it's ready to deploy a packet core instance.

> [!IMPORTANT]
> This procedure must only be used for Azure Private 5G Core. AKS on ASE is not supported for other services.

## Prerequisites

- [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- You will need Owner permission on the resource group for your Azure Stack Edge resource.
    > [!NOTE]
    > Make a note of the Azure Stack Edge's resource group. The AKS cluster and custom location, created in this procedure, must belong to this resource group.

## Enter a minishell session

You need to run minishell commands on Azure Stack Edge  during this procedure. You must use a Windows machine that is on a network with access to the management port of the ASE. You should be able to view the ASE local UI to verify you have access.

> [!TIP]
> To access the local UI, see [Tutorial: Connect to Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-connect.md).

### Enable WinRM on your machine

The following process uses PowerShell and needs WinRM to be enabled on your machine. Run the following command from a PowerShell window in Administrator mode:
```powershell
winrm quickconfig
```
WinRM may already be enabled on your machine, as you only need to do it once. Ensure your network connections are set to Private or Domain (not Public), and accept any changes.

### Start the minishell session

1. From a PowerShell window, enter the ASE management IP address (including quotation marks, for example `"10.10.5.90"`):
    ```powershell
   $ip = "*ASE IP address*"
   
   $sessopt = New-PSSessionOption -SkipCACheck -SkipCNCheck -SkipRevocationCheck

   $minishellSession = New-PSSession -ComputerName $ip -ConfigurationName "Minishell" -Credential ~\EdgeUser -UseSSL -SessionOption $sessopt
    ```

1. At the prompt, enter your Azure Stack Edge password. Ignore the following message:

    ```powershell
   WARNING: The Windows PowerShell interface of your device is intended to
   be used only for the initial network configuration. Please
   engage Microsoft Support if you need to access this interface
   to troubleshoot any potential issues you may be experiencing.
   Changes made through this interface without involving Microsoft
   Support could result in an unsupported configuration.
    ```

You now have a minishell session set up ready to enable your Azure Kubernetes Service in the next step.

> [!TIP]
> If there is a network change, the session can break. Run `Get-PSSession` to view the state of the session.  If it is still connected, you should still be able to run minishell commands. If it is broken or disconnected, run `Remove-PSSession` to remove the session locally, then start a new session.

## Enable Azure Kubernetes Service on the Azure Stack Edge device

Run the following commands at the PowerShell prompt, specifying the object ID you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).

```powershell
Invoke-Command -Session $minishellSession -ScriptBlock {Set-HcsKubeClusterArcInfo -CustomLocationsObjectId *object ID*}

Invoke-Command -Session $minishellSession -ScriptBlock {Enable-HcsAzureKubernetesService -f}
```

Once you've run these commands, you should see an updated option in the local UI – **Kubernetes** becomes **Kubernetes (Preview)** as shown in the following image.

:::image type="content" source="media/commission-cluster/commission-cluster-kubernetes-preview.png" alt-text="Screenshot of configuration menu, with Kubernetes (Preview) highlighted.":::

Additionally, if you go to the Azure portal and navigate to your **Azure Stack Edge** resource, you should see an **Azure Kubernetes Service** option. You'll set up the Azure Kubernetes Service in [Start the cluster and set up Arc](#start-the-cluster-and-set-up-arc).

:::image type="content" source="media/commission-cluster/commission-cluster-ase-resource.png" alt-text="Screenshot of Azure Stack Edge resource in the Azure portal. Azure Kubernetes Service (PREVIEW) is shown under Edge services in the left menu.":::

## Enable high performance networking

Azure Private 5G Core requires high performance networking (HPN) to be enabled on Azure Stack Edge using a minishell command. You can continue to use the minishell session you started in [Enter a minishell session](#enter-a-minishell-session). Run the following command:

```powershell
Invoke-Command -Session $minishellSession -ScriptBlock {Set-HcsNumaLpMapping -UseSkuPolicy}
```

Wait for the machine to reboot if necessary (approximately 5 minutes).

## Set up advanced networking

You now need to configure virtual switches and virtual networks on those switches. You'll use the **Advanced networking** section of the Azure Stack Edge local UI to do this task.

You can input all the settings on this page before selecting **Apply** at the bottom to apply them all at once.
:::zone pivot="ase-pro-2"

1. Configure three virtual switches. There must be a virtual switch associated with each port before the next step. The virtual switches may already be present if you have other virtual network functions (VNFs) set up.
    Select **Add virtual switch** and fill in the side panel appropriately for each switch before selecting **Modify** to save that configuration.
    - Create a virtual switch on the port that should have compute enabled (the management port). We recommend using the format **vswitch-portX**, where **X** is the number of the port. For example, create **vswitch-port2** on port 2.  
    - Create a virtual switch on port 3 with the name **vswitch-port3**.
    - Create a virtual switch on port 4 with the name **vswitch-port4**.

    You should now see something similar to the following image:
    :::image type="content" source="media/commission-cluster/commission-cluster-virtual-switch-ase-2.png" alt-text="Screenshot showing three virtual switches, where the names correspond to the network interface the switch is on. ":::
:::zone-end
:::zone pivot="ase-pro-gpu"

1. Configure three virtual switches. There must be a virtual switch associated with each port before the next step. The virtual switches may already be present if you have other virtual network functions (VNFs) set up.
    Select **Add virtual switch** and fill in the side panel appropriately for each switch before selecting **Modify** to save that configuration.
    - Create a virtual switch on the port that should have compute enabled (the management port). We recommend using the format **vswitch-portX**, where **X** is the number of the port. For example, create **vswitch-port3** on port 3.  
    - Create a virtual switch on port 5 with the name **vswitch-port5**.
    - Create a virtual switch on port 6 with the name **vswitch-port6**.

    You should now see something similar to the following image:
    :::image type="content" source="media/commission-cluster/commission-cluster-virtual-switch.png" alt-text="Screenshot showing three virtual switches, where the names correspond to the network interface the switch is on. ":::
:::zone-end
2. Create virtual networks representing the following interfaces (which you allocated subnets and IP addresses for in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses)):
    - Control plane access interface
    - User plane access interface
    - User plane data interface(s)
    You can name these networks yourself, but the name **must** match what you configure in the Azure portal when deploying Azure Private 5G Core. For example, you can use the names **N2**, **N3** and **N6-DN1**, **N6-DN2**, **N6-DN3** (for a 5G deployment with multiple data networks (DNs); just **N6** for a single DN deployment). You can optionally configure each virtual network with a virtual local area network identifier (VLAN ID) to enable layer 2 traffic separation. The following example is for a 5G multi-DN deployment without VLANs.
:::zone pivot="ase-pro-2"
3. Carry out the following procedure three times, plus once for each of the supplementary data networks (so five times in total if you have three data networks):
    1. Select **Add virtual network** and fill in the side panel:
          - **Virtual switch**: select **vswitch-port3** for N2 and N3, and select **vswitch-port4** for N6-DN1, N6-DN2, and N6-DN3.
          - **Name**: *N2*, *N3*, *N6-DN1*, *N6-DN2*, or *N6-DN3*.
          - **VLAN**: 0
          - **Subnet mask** and **Gateway** must match the external values for the port.
            - For example, *255.255.255.0* and *10.232.44.1*
            - If there's no gateway between the access interface and gNB/RAN, use the gNB/RAN IP address as the gateway address. If there's more than one gNB connected via a switch, choose one of the IP addresses for the gateway.
    1. Select **Modify** to save the configuration for this virtual network.
    1. Select **Apply** at the bottom of the page and wait for the notification (a bell icon) to confirm that the settings have been applied. Applying the settings will take approximately 15 minutes.
    The page should now look like the following image:

  :::image type="content" source="media/commission-cluster/commission-cluster-advanced-networking-ase-2.png" alt-text="Screenshot showing Advanced networking, with a table of virtual switch information and a table of virtual network information.":::
:::zone-end
:::zone pivot="ase-pro-gpu"
3. Carry out the following procedure three times, plus once for each of the supplementary data networks (so five times in total if you have three data networks):
    1. Select **Add virtual network** and fill in the side panel:
          - **Virtual switch**: select **vswitch-port5** for N2 and N3, and select **vswitch-port6** for N6-DN1, N6-DN2, and N6-DN3.
          - **Name**: *N2*, *N3*, *N6-DN1*, *N6-DN2*, or *N6-DN3*.
          - **VLAN**: VLAN ID, or 0 if not using VLANs
          - **Subnet mask** and **Gateway** must match the external values for the port.
            - For example, *255.255.255.0* and *10.232.44.1*
            - If there's no gateway between the access interface and gNB/RAN, use the gNB/RAN IP address as the gateway address. If there's more than one gNB connected via a switch, choose one of the IP addresses for the gateway.
    1. Select **Modify** to save the configuration for this virtual network.
    1. Select **Apply** at the bottom of the page and wait for the notification (a bell icon) to confirm that the settings have been applied. Applying the settings will take approximately 15 minutes.
  The page should now look like the following image:

  :::image type="content" source="media/commission-cluster/commission-cluster-advanced-networking.png" alt-text="Screenshot showing Advanced networking, with a table of virtual switch information and a table of virtual network information.":::
:::zone-end

## Add compute and IP addresses

In the local Azure Stack Edge UI, go to the **Kubernetes (Preview)** page. You'll set up all of the configuration and then apply it once, as you did in [Set up Advanced Networking](#set-up-advanced-networking).

1. Under **Compute virtual switch**, select **Modify**.
      1. Select the management vswitch (for example, *vswitch-port3*)
      1. Enter six IP addresses in a range for the node IP addresses on the management network.
      1. Enter one IP address in a range for the service IP address, also on the management network.
      1. Select **Modify** at the bottom of the panel to save the configuration.
1. Under **Virtual network**, select a virtual network (from **N2**, **N3**, **N6-DN1**, **N6-DN2**, and **N6-DN3**). In the side panel:
      1. Enable the virtual network for Kubernetes and add a pool of IP addresses. Add a range of one IP address for the appropriate address (N2, N3, N6-DN1, N6-DN2 or N6-DN3 as collected earlier. For example, *10.10.10.20-10.10.10.20*.
      1. Repeat for each of the N2, N3, N6-DN1, N6-DN2, and N6-DN3 virtual networks.
      1. Select **Modify** at the bottom of the panel to save the configuration.
1. Select **Apply** at the bottom of the page and wait for the settings to be applied. Applying the settings will take approximately 15 minutes.

The page should now look like the following image:

:::zone pivot="ase-pro-2"
:::image type="content" source="media/commission-cluster/commission-cluster-kubernetes-preview-enabled-ase-2.png" alt-text="Screenshot showing Kubernetes (Preview) with two tables. The first table is called Compute virtual switch and the second is called Virtual network. A green tick shows that the virtual networks are enabled for Kubernetes.":::
:::zone-end
:::zone pivot="ase-pro-gpu"
:::image type="content" source="media/commission-cluster/commission-cluster-kubernetes-preview-enabled.png" alt-text="Screenshot showing Kubernetes (Preview) with two tables. The first table is called Compute virtual switch and the second is called Virtual network. A green tick shows that the virtual networks are enabled for Kubernetes.":::
:::zone-end
## Start the cluster and set up Arc

Access the Azure portal and go to the **Azure Stack Edge** resource created in the Azure portal.

If you're running other VMs on your Azure Stack Edge, we recommend that you stop them now, and start them again once the cluster is deployed. The cluster requires access to specific CPU resources that running VMs may already be using.

1. To deploy the cluster, select the **Kubernetes** option and then select the **Add** button to configure the cluster.

   :::image type="content" source="media/commission-cluster/commission-cluster-add-kubernetes.png" alt-text="Screenshot of Kubernetes Overview pane, showing the Add button to configure Kubernetes service.":::

1. For the **Node size**, select **Standard_F16s_HPN**.
1. Ensure the **Arc enabled Kubernetes** checkbox is selected.
1. The Arc enabled Kubernetes service is automatically created in the same resource group as your **Azure Stack Edge** resource. If your Azure Stack Edge resource group is not in a region that supports Azure Private 5G Core, you must change the region using the **Change** link.
1. Work through the prompts to set up the service.

The creation of the Kubernetes cluster takes about 20 minutes. During creation, there may be a critical alarm displayed on the **Azure Stack Edge** resource. This alarm is expected and should disappear after a few minutes.

Once deployed, the portal should show  **Kubernetes service is healthy** on the overview page.

## Set up kubectl access

You'll need *kubectl* access to verify that the cluster has deployed successfully. For read-only *kubectl* access to the cluster, you can download a *kubeconfig* file from the ASE local UI. Under **Device**, select **Download config**.

:::image type="content" source="media/commission-cluster/commission-cluster-kubernetes-download-config.png" alt-text="Screenshot of Kubernetes dashboard showing link to download config.":::

The downloaded file is called *config.json*. This file has permission to describe pods and view logs, but not to access pods with *kubectl exec*.

The Azure Private 5G Core deployment uses the *core* namespace. If you need to collect diagnostics, you can download a *kubeconfig* file with full access to the *core* namespace using the following minishell commands.

- Create the namespace, download the *kubeconfig* file and use it to grant access to the namespace:
    ```powershell
    Invoke-Command -Session $minishellSession -ScriptBlock {New-HcsKubernetesNamespace -Namespace "core"}
    Invoke-Command -Session $minishellSession -ScriptBlock {New-HcsKubernetesUser -UserName "core"} | Out-File -FilePath .\kubeconfig-core.yaml
    Invoke-Command -Session $minishellSession -ScriptBlock {Grant-HcsKubernetesNamespaceAccess -Namespace "core" -UserName "core"}
    ```
- If you need to retrieve the saved *kubeconfig* file later:
    ```powershell
    Invoke-Command -Session $miniShellSession -ScriptBlock { Get-HcsKubernetesUserConfig -UserName "core" }
    ```
For more information, see [Configure cluster access via Kubernetes RBAC](../databox-online/azure-stack-edge-gpu-create-kubernetes-cluster.md#configure-cluster-access-via-kubernetes-rbac).

## Set up portal access

Open your **Azure Stack Edge** resource in the Azure portal. Go to the Azure Kubernetes Service pane (shown in [Start the cluster and set up Arc](#start-the-cluster-and-set-up-arc)) and select the **Manage** link to open the **Arc** pane.

:::image type="content" source="media/commission-cluster/commission-cluster-manage-kubernetes.png" alt-text="Screenshot of part of the Azure Kubernetes Service (PREVIEW) Overview pane, showing the Manage link for Arc enabled Kubernetes.":::

Explore the cluster using the options in the **Kubernetes resources (preview)** menu:

:::image type="content" source="media/commission-cluster/commission-cluster-kubernetes-resources.png" alt-text="Screenshot of Kubernetes resources (preview) menu, showing namespaces, workloads, services and ingresses, storage and configuration options.":::

You'll initially be presented with a sign-in request box. The token to use for signing in is obtained from the *kubeconfig* file retrieved from the local UI in [Set up kubectl access](#set-up-kubectl-access). There's a string prefixed by *token:* near the end of the *kubeconfig* file. Copy this string into the box in the portal (ensuring you don't have line break characters copied), and select **Sign in**.

:::image type="content" source="media/commission-cluster/commission-cluster-kubernetes-sign-in.png" alt-text="Screenshot of sign-in screen for Kubernetes resource. There's a box to enter your service account bearer token and a sign-in button.":::

You can now view information about what’s running on the cluster – the following is an example from the **Workloads** pane:

:::image type="content" source="media/commission-cluster/commission-cluster-kubernetes-workload-pane.png" alt-text="Screenshot of Workloads pane in Kubernetes resources (preview). The pods tab is active and shows details about what's running.":::

## Verify the cluster configuration

You should verify that the AKS cluster is set up correctly by running the following *kubectl* commands using the *kubeconfig* downloaded from the UI in [Set up kubectl access](#set-up-kubectl-access):

`kubectl get nodes`

This command should return two nodes, one named *nodepool-aaa-bbb* and one named *target-cluster-control-plane-ccc*.

To view all the running pods, run:

`kubectl get pods -A`

Additionally, your AKS cluster should now be visible from your Azure Stack Edge resource in the portal.

## Collect variables for the Kubernetes extensions

Collect each of the values in the table below.

| Value | Variable name |
|--|--|
|The ID of the Azure subscription in which the Azure resources are deployed. |**SUBSCRIPTION_ID**|
|The name of the resource group in which the AKS cluster is deployed. This can be found by using the **Manage** button in the **Azure Kubernetes Service** pane of the Azure portal. |**RESOURCE_GROUP_NAME**|
|The name of the AKS cluster resource. This can be found by using the **Manage** button in the **Azure Kubernetes Service** pane of the Azure portal. |**RESOURCE_NAME**|
|The region in which the Azure resources are deployed. This must match the region into which the mobile network will be deployed, which must be one of the regions supported by AP5GC: **EastUS** or **WestEurope**.</br></br>This value must be the [region's code name](region-code-names.md); see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/) for a list of supported regions. |**LOCATION**|
|The name of the **Custom location** resource to be created for the AKS cluster. </br></br>This value must start and end with alphanumeric characters, and must contain only alphanumeric characters, `-` or `.`. |**CUSTOM_LOCATION**|

## Install Kubernetes extensions

The Azure Private 5G Core private mobile network requires a custom location and specific Kubernetes extensions that you need to configure using the Azure CLI in Azure Cloud Shell.

> [!TIP]
> The commands in this section require the `k8s-extension` and `customlocation` extensions to the Azure CLI tool to be installed. If you do not already have them, a prompt will appear to install these when you run commands that require them. See [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview) for more information on automatic extension installation.

1. Sign in to the Azure CLI using Azure Cloud Shell.

1. Set the following environment variables using the required values for your deployment:

    ```azurecli
    export SUBSCRIPTION_ID=<subscription ID>
    export RESOURCE_GROUP_NAME=<resource group name>
    export LOCATION=<deployment region, for example eastus>
    export CUSTOM_LOCATION=<custom location for the AKS cluster>
    export RESOURCE_NAME=<resource name>
    export TEMP_FILE=./tmpfile
    ```

1. Prepare your shell environment:

    ```azurecli
    az account set --subscription "$SUBSCRIPTION_ID"
    ```

1. Create the Network Function Operator Kubernetes extension:

    ```azurecli
    cat > $TEMP_FILE <<EOF
    {
      "helm.versions": "v3",
      "Microsoft.CustomLocation.ServiceAccount": "azurehybridnetwork-networkfunction-operator",
      "meta.helm.sh/release-name": "networkfunction-operator",
      "meta.helm.sh/release-namespace": "azurehybridnetwork",
      "app.kubernetes.io/managed-by": "helm",
      "helm.release-name": "networkfunction-operator",
      "helm.release-namespace": "azurehybridnetwork",
      "managed-by": "helm"
    }
    EOF

    az k8s-extension create \
    --name networkfunction-operator \
    --cluster-name "$RESOURCE_NAME" \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --cluster-type connectedClusters \
    --extension-type "Microsoft.Azure.HybridNetwork" \
    --auto-upgrade-minor-version "true" \
    --scope cluster \
    --release-namespace azurehybridnetwork \
    --release-train preview \
    --config-settings-file $TEMP_FILE 
    ```

1. Create the Packet Core Monitor Kubernetes extension:

    ```azurecli
    az k8s-extension create \
    --name packet-core-monitor \
    --cluster-name "$RESOURCE_NAME" \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --cluster-type connectedClusters \
    --extension-type "Microsoft.Azure.MobileNetwork.PacketCoreMonitor" \
    --release-train preview \
    --auto-upgrade true 
    ```

1. Create the custom location:

    ```azurecli
    az customlocation create \
    -n "$CUSTOM_LOCATION" \
    -g "$RESOURCE_GROUP_NAME" \
    --location "$LOCATION" \
    --namespace azurehybridnetwork \
    --host-resource-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.Kubernetes/connectedClusters/$RESOURCE_NAME" \
    --cluster-extension-ids "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.Kubernetes/connectedClusters/$RESOURCE_NAME/providers/Microsoft.KubernetesConfiguration/extensions/networkfunction-operator"
    ```

You should see the new **Custom Location** visible as a resource in the Azure portal within the specified resource group. Using the `kubectl get pods -A` command (with access to your *kubeconfig* file) should also show new pods corresponding to the extensions that have been installed. There should be one pod in the *azurehybridnetwork* namespace, and one in the *packet-core-monitor* namespace.

## Rollback

If you have made an error in the Azure Stack Edge configuration, you can use the portal to remove the AKS cluster.  You can then modify the settings via the local UI, or perform a full reset using the **Device Reset** blade in the local UI and then restart this procedure.

## Next steps

Your Azure Stack Edge device is now ready for Azure Private 5G Core. The next step is to collect the information you'll need to deploy your private network.

- [Collect the required information to deploy a private mobile network](./collect-required-information-for-private-mobile-network.md)